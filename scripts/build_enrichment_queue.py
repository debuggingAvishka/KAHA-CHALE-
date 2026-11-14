#!/usr/bin/env python3
"""Build a human-review enrichment queue from KAHA CHALE's cleaned OSM JSON.

This script does not invent descriptions, images, prices, or opening hours and
never publishes records. It creates explicit tasks for source-backed enrichment.

Usage:
  python scripts/build_enrichment_queue.py src/data/places.cleaned.json --out-dir data/enrichment
"""
import argparse
import csv
import json
from pathlib import Path

TASK_FIELDS = [
    "osm_id", "name", "category", "latitude", "longitude", "osm_source_url",
    "missing_description", "missing_image", "missing_opening_hours",
    "missing_website", "category_review_required", "review_status",
    "description_source_url", "image_source_page_url", "review_notes",
]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("input", help="Path to places.cleaned.json")
    parser.add_argument("--out-dir", default="data/enrichment")
    args = parser.parse_args()

    source = json.loads(Path(args.input).read_text(encoding="utf-8"))
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    queue = []
    for place in source.get("records", []):
        if not place.get("name"):
            continue
        tags = place.get("original_tags") or {}
        missing = {
            "missing_description": not bool(place.get("description")),
            "missing_image": not bool(place.get("image_url")),
            "missing_opening_hours": not bool(place.get("opening_hours")),
            "missing_website": not bool(place.get("website")),
            "category_review_required": place.get("category") == "other_review",
        }
        if not any(missing.values()):
            continue
        tasks = [key for key, value in missing.items() if value]
        queue.append({
            "osm_id": place.get("id") or "",
            "name": place.get("name") or "",
            "category": place.get("category") or "",
            "latitude": place.get("latitude") if place.get("latitude") is not None else "",
            "longitude": place.get("longitude") if place.get("longitude") is not None else "",
            "osm_source_url": place.get("source_url") or "",
            **{key: str(value).lower() for key, value in missing.items()},
            "review_status": "needs_review",
            "description_source_url": "",
            "image_source_page_url": "",
            "review_notes": "Review OSM tags before enrichment: " + ", ".join(tasks)
                + (f". Existing tags: {json.dumps(tags, ensure_ascii=False, sort_keys=True)}" if tags else ""),
        })

    output = out_dir / "enrichment_queue.csv"
    with output.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=TASK_FIELDS)
        writer.writeheader()
        writer.writerows(queue)

    summary = {
        "input_records": len(source.get("records", [])),
        "named_records": sum(bool(p.get("name")) for p in source.get("records", [])),
        "records_needing_enrichment": len(queue),
        "tasks": {field: sum(row[field] == "true" for row in queue) for field in TASK_FIELDS if field.startswith(("missing_", "category_"))},
        "output": str(output),
        "safety": "Review queue only. No generated facts and no automatic publishing.",
    }
    (out_dir / "enrichment_queue_summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
