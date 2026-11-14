#!/usr/bin/env python3
"""Evidence-first Wikidata + Wikimedia Commons enrichment discovery.

This script ONLY discovers candidate matches and writes review files.
It never updates Supabase, publishes places, or invents descriptions.

Example:
  python scripts/enrich_from_wikimedia.py src/data/places.cleaned.json \
    --out-dir data/enrichment --names "Balancing Rock" "Bargi dam" \
    "Bhawartaal Park" "Adhartal" "Devtaal Lake"
"""
from __future__ import annotations

import argparse
import csv
import json
import math
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any

USER_AGENT = "KahaChaleResearchBot/0.1 (place research; contact: project maintainer)"
WIKIDATA_API = "https://www.wikidata.org/w/api.php"
COMMONS_API = "https://commons.wikimedia.org/w/api.php"

WIKIDATA_FIELDS = [
    "osm_id", "place_name", "place_latitude", "place_longitude",
    "candidate_name", "wikidata_id", "wikidata_url", "name_similarity",
    "distance_km", "wikidata_description", "wikipedia_url",
    "commons_sitelink", "wikidata_image_filename", "match_confidence",
    "review_recommendation", "evidence_note",
]
COMMONS_FIELDS = [
    "osm_id", "place_name", "candidate_file", "image_url",
    "thumbnail_url", "source_page_url", "author_name", "licence",
    "licence_url", "attribution", "distance_or_name_basis",
    "review_status",
]


def normalize(value: str) -> str:
    value = (value or "").casefold()
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return " ".join(value.split())


def similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, normalize(a), normalize(b)).ratio()


def distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius = 6371.0088
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * radius * math.asin(min(1, math.sqrt(h)))


def api_get(endpoint: str, params: dict[str, str], retries: int = 3) -> dict[str, Any]:
    query = urllib.parse.urlencode(params)
    request = urllib.request.Request(
        f"{endpoint}?{query}",
        headers={"User-Agent": USER_AGENT, "Accept": "application/json"},
    )
    last_error = None
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(request, timeout=25) as response:
                return json.loads(response.read().decode("utf-8"))
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            last_error = exc
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"API request failed after {retries} attempts: {last_error}")


def wikidata_candidates(place: dict[str, Any], limit: int) -> list[dict[str, Any]]:
    name = place["name"]
    search = api_get(WIKIDATA_API, {
        "action": "wbsearchentities", "search": name,
        "language": "en", "uselang": "en", "type": "item",
        "limit": str(limit), "format": "json",
    })
    output = []
    for hit in search.get("search", []):
        entity_id = hit.get("id", "")
        if not re.fullmatch(r"Q\d+", entity_id):
            continue
        entity_data = api_get(WIKIDATA_API, {
            "action": "wbgetentities", "ids": entity_id,
            "props": "labels|descriptions|claims|sitelinks",
            "languages": "en", "format": "json",
        })
        entity = entity_data.get("entities", {}).get(entity_id, {})
        claims = entity.get("claims", {})
        coords = None
        for statement in claims.get("P625", []):
            try:
                value = statement["mainsnak"]["datavalue"]["value"]
                coords = (float(value["latitude"]), float(value["longitude"]))
                break
            except (KeyError, TypeError, ValueError):
                continue
        if not coords:
            continue

        lat, lon = place.get("latitude"), place.get("longitude")
        if lat is None or lon is None:
            continue
        km = distance_km(float(lat), float(lon), coords[0], coords[1])
        label = entity.get("labels", {}).get("en", {}).get("value") or hit.get("label", "")
        sim = similarity(name, label)
        description = entity.get("descriptions", {}).get("en", {}).get("value", "")
        sitelinks = entity.get("sitelinks", {})
        enwiki = sitelinks.get("enwiki", {}).get("url", "")
        commons_link = sitelinks.get("commonswiki", {}).get("title", "")
        image_filename = ""
        for statement in claims.get("P18", []):
            try:
                image_filename = statement["mainsnak"]["datavalue"]["value"]
                break
            except (KeyError, TypeError):
                continue

        # Confidence is a transparent heuristic, not a factual probability.
        name_score = sim
        distance_score = max(0.0, 1.0 - km / 10.0)
        confidence = round(0.65 * name_score + 0.35 * distance_score, 3)
        if km <= 2 and sim >= 0.80:
            recommendation = "strong_candidate_review"
        elif km <= 10 and sim >= 0.60:
            recommendation = "manual_review"
        else:
            recommendation = "likely_mismatch"
        output.append({
            "osm_id": place["id"], "place_name": name,
            "place_latitude": lat, "place_longitude": lon,
            "candidate_name": label, "wikidata_id": entity_id,
            "wikidata_url": f"https://www.wikidata.org/wiki/{entity_id}",
            "name_similarity": round(sim, 3), "distance_km": round(km, 3),
            "wikidata_description": description, "wikipedia_url": enwiki,
            "commons_sitelink": commons_link,
            "wikidata_image_filename": image_filename,
            "match_confidence": confidence,
            "review_recommendation": recommendation,
            "evidence_note": "Candidate only. Verify identity, coordinates and source context before reuse.",
        })
        time.sleep(0.15)
    return sorted(output, key=lambda row: (row["distance_km"], -row["name_similarity"]))


def commons_candidates(place: dict[str, Any], limit: int) -> list[dict[str, Any]]:
    search_term = f'{place["name"]} Jabalpur Madhya Pradesh'
    data = api_get(COMMONS_API, {
        "action": "query", "format": "json", "generator": "search",
        "gsrsearch": search_term, "gsrnamespace": "6", "gsrlimit": str(limit),
        "prop": "imageinfo", "iiprop": "url|extmetadata",
        "iiurlwidth": "900",
    })
    pages = data.get("query", {}).get("pages", {})
    rows = []
    for page in pages.values():
        info = (page.get("imageinfo") or [{}])[0]
        meta = info.get("extmetadata", {})
        def meta_value(key: str) -> str:
            value = meta.get(key, {}).get("value", "")
            return re.sub(r"<[^>]+>", " ", str(value)).strip()
        title = page.get("title", "")
        rows.append({
            "osm_id": place["id"], "place_name": place["name"],
            "candidate_file": title,
            "image_url": info.get("url", ""),
            "thumbnail_url": info.get("thumburl", ""),
            "source_page_url": info.get("descriptionurl", ""),
            "author_name": meta_value("Artist"),
            "licence": meta_value("LicenseShortName"),
            "licence_url": meta_value("LicenseUrl"),
            "attribution": meta_value("Attribution"),
            "distance_or_name_basis": f'Commons filename search: "{search_term}"',
            "review_status": "pending_manual_image_review",
        })
        time.sleep(0.1)
    return rows


def write_csv(path: Path, fields: list[str], rows: list[dict[str, Any]]) -> None:
    with path.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", help="Cleaned OSM JSON file")
    parser.add_argument("--out-dir", default="data/enrichment")
    parser.add_argument("--names", nargs="*", help="Exact place names to enrich")
    parser.add_argument("--limit", type=int, default=5, help="Candidates per API search (max 10)")
    parser.add_argument("--skip-commons", action="store_true")
    args = parser.parse_args()
    if not 1 <= args.limit <= 10:
        parser.error("--limit must be between 1 and 10")

    source = json.loads(Path(args.input).read_text(encoding="utf-8"))
    requested = {normalize(name) for name in (args.names or [])}
    places = [
        p for p in source.get("records", [])
        if p.get("name") and (
            not requested or normalize(p["name"]) in requested
        )
    ]
    if requested:
        found = {normalize(p["name"]) for p in places}
        missing = requested - found
        if missing:
            parser.error("Names not found in input: " + ", ".join(sorted(missing)))
    if not places:
        parser.error("No named records selected")

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    wd_rows, commons_rows, errors = [], [], []

    for index, place in enumerate(places, 1):
        print(f"[{index}/{len(places)}] Researching: {place['name']}", flush=True)
        try:
            wd_rows.extend(wikidata_candidates(place, args.limit))
        except Exception as exc:
            errors.append({"osm_id": place.get("id"), "place_name": place["name"],
                           "source": "Wikidata", "error": str(exc)})
        if not args.skip_commons:
            try:
                commons_rows.extend(commons_candidates(place, args.limit))
            except Exception as exc:
                errors.append({"osm_id": place.get("id"), "place_name": place["name"],
                               "source": "Wikimedia Commons", "error": str(exc)})

    write_csv(out_dir / "wikidata_candidates.csv", WIKIDATA_FIELDS, wd_rows)
    write_csv(out_dir / "commons_image_candidates.csv", COMMONS_FIELDS, commons_rows)
    (out_dir / "enrichment_api_errors.json").write_text(
        json.dumps(errors, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    summary = {
        "selected_places": len(places),
        "wikidata_candidates": len(wd_rows),
        "commons_image_candidates": len(commons_rows),
        "api_errors": len(errors),
        "outputs": [
            str(out_dir / "wikidata_candidates.csv"),
            str(out_dir / "commons_image_candidates.csv"),
            str(out_dir / "enrichment_api_errors.json"),
        ],
        "matching_policy": "Coordinate + name heuristic; confidence is not a probability.",
        "safety": "Candidate discovery only. No database writes, no automatic publishing.",
    }
    (out_dir / "wikimedia_enrichment_summary.json").write_text(
        json.dumps(summary, indent=2), encoding="utf-8"
    )
    print(json.dumps(summary, indent=2))
    return 0 if not errors else 2


if __name__ == "__main__":
    sys.exit(main())
