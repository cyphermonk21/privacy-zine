# Translation Guide

We want this zine in as many languages as possible. Here's how to help.

## Getting Started

1. Check `translations/README.md` to see if your language already exists
2. If not, open an issue titled "New Translation: [Language Name]"
3. Wait for approval (usually quick — we just want to avoid duplicates)

## What to Translate

The zine consists of:

1. **Category labels** (Maps, AI, Browsing, etc.)
2. **Tagline text** ("Keeping unwanted eyes away...")
3. **Tool descriptions / annotations** (text in brackets)
4. **Editorial framing** ("say / see / buy / believe")
5. **Footer text** ("links & more info")

## What NOT to Translate

- Tool names (Signal, Proton Mail, Brave, etc.) — keep as-is
- URLs
- The QR code image

## Process

1. Fork the repo
2. Create a folder: `translations/[lang-code]/` (e.g., `translations/es/`)
3. Copy the English text strings (see `src/data/tools.json`)
4. Translate all values
5. Submit a PR — we'll handle the Penpot layout adaptation

## Text Strings File

All translatable text lives in `src/data/tools.json`. Each entry looks like:
json { "category": "maps", "label": "Maps", "privacy_tools": ["OrganicMaps", "OsmAnd"], "mainstream_tools": ["Google Maps", "Apple Maps", "Waze"], "annotation": "Offline-first maps using OpenStreetMap data" }

Only translate `label`, `annotation`, and any free-text fields. Tool names stay unchanged.

## Questions?

Open an issue with the "translation" label.
