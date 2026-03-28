---
name: pptx
source: https://skills.sh/anthropics/skills/pptx
installedBy: local-import
version: 2026-03-16
description: Workflow + QA guidance for reading, editing, and creating PPTX (markitdown extraction, thumbnailing, unpack/pack, pptxgenjs creation, strong visual/design rules).
---

# PPTX (Anthropic skill import)

## Quick reference

- Read/analyze content:
  - `python -m markitdown presentation.pptx`
- Edit from template:
  - follow the unpack → edit → clean → pack workflow (see below)
- Create from scratch:
  - use `pptxgenjs` approach

## Reading content

- Text extraction:
  - `python -m markitdown presentation.pptx`
- Visual overview:
  - `python scripts/thumbnail.py presentation.pptx`
- Raw XML:
  - `python scripts/office/unpack.py presentation.pptx unpacked/`

## Editing workflow (template-based)

High level:
1) Analyze template with thumbnails
2) Unpack → manipulate slides → edit content → clean → pack

## Creating from scratch

Use when no template/reference is available.

## Design rules (don’t make boring slides)

- Pick a bold, topic-informed palette (dominant 60–70% + 1–2 supports + sharp accent)
- Consider dark/light contrast structure (e.g., dark title+closing, light content) or commit to dark throughout
- Commit to a repeating motif (one distinctive element carried across slides)
- Every slide should have a visual element (image/chart/icon/shape) — avoid text-only slides
- Vary layouts (2-col, icon rows, grids, half-bleed image + overlay, timelines/process)
- Typography: avoid Arial-by-default; ensure strong size contrast
  - title 36–44pt
  - section 20–24pt
  - body 14–16pt
  - captions 10–12pt
- Spacing: min 0.5" margins; 0.3–0.5" consistent gaps

Avoid:
- Repeating the same layout
- Centered body text
- Low contrast
- Placeholder leftovers
- Accent lines under titles (explicitly discouraged)

## QA (required)

Content QA:
- `python -m markitdown output.pptx`
- Check for placeholders:
  - `python -m markitdown output.pptx | grep -iE "xxxx|lorem|ipsum|this.*(page|slide).*layout"`

Visual QA loop:
- Generate → convert to images → inspect → fix → re-verify
- Look for overlap, overflow, margins (<0.5"), gaps (<0.3"), misalignment, low contrast, collisions

## Converting to images (for inspection)

- PPTX → PDF:
  - `python scripts/office/soffice.py --headless --convert-to pdf output.pptx`
- PDF → JPEGs:
  - `pdftoppm -jpeg -r 150 output.pdf slide`

## Dependencies (when you actually run this)

- `pip install "markitdown[pptx]"`
- `pip install Pillow`
- `npm install -g pptxgenjs`
- LibreOffice (soffice)
- Poppler (pdftoppm)

## How to invoke

Say: “usa a skill pptx” e fornece:
- objetivo da apresentação + audiência
- nº de slides
- template existente (se houver) ou estilo desejado
- conteúdo (tópicos/dados) e assets (logos/imagens)
