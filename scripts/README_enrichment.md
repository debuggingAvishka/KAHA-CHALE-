# Wikimedia enrichment discovery

Candidate discovery only: no Supabase writes, no publishing, and no generated facts.

Run from your project root:

```powershell
python scripts/enrich_from_wikimedia.py src/data/places.cleaned.json --out-dir data/enrichment --names "Balancing Rock" "Bargi dam" "Bhawartaal Park" "Adhartal" "Devtaal Lake"
```

Requires internet access. Uses public Wikidata and Wikimedia Commons APIs.

Outputs:
- `wikidata_candidates.csv`: candidate item, coordinates, distance, similarity, description, Wikipedia and Commons references.
- `commons_image_candidates.csv`: candidate image URLs, source page, author, licence and attribution.
- `enrichment_api_errors.json`: API failures, if any.
- `wikimedia_enrichment_summary.json`: run counts and safety notes.

Review rules:
- Confidence is a heuristic, not a probability or proof of identity.
- A Commons filename search does not prove that an image depicts the place.
- Verify image content, source page, author and licence before use.
- Do not copy a short Wikidata description as a full place description without checking evidence.
- No SQL, Supabase credentials, or automatic publishing are used.
