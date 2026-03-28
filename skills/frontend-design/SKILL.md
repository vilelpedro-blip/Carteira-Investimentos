---
name: frontend-design
source: https://skills.sh/anthropics/skills/frontend-design
installedBy: local-import
version: 2026-03-16
description: Distinctive, production-grade frontend interface design + implementation steering (avoid generic "AI slop" aesthetics; commit to a bold aesthetic direction; meticulous typography/color/motion/composition details).
---

# Frontend Design (Anthropic skill import)

## What this skill is for

Use when the user asks you to **design/build frontend UI** (component/page/app) and wants it to look **intentional, memorable, and production-grade**.

## Operating rules

### Design thinking (before coding)

1) **Purpose**: what problem does this solve and who uses it?
2) **Tone**: pick a clear aesthetic extreme (e.g., brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian).
3) **Constraints**: framework/stack, performance, a11y.
4) **Differentiation**: what’s the one unforgettable detail?

CRITICAL: choose a conceptual direction and execute it with precision.

### Aesthetics guidelines

Focus on:
- **Typography**: distinctive font choices; avoid generic defaults. Pair a characterful display font with a refined body font.
- **Color & theme**: cohesive palette via CSS variables; dominant colors + sharp accents.
- **Motion**: prefer one orchestrated high-impact load/transition over lots of tiny effects; use staggered reveals, hover surprises, scroll triggers when relevant.
- **Spatial composition**: asymmetry, overlap, grid-breaking elements, generous negative space *or* controlled density.
- **Backgrounds & detail**: depth/atmosphere with meshes, noise, patterns, translucency, dramatic shadows, decorative borders, custom cursor, grain.

Avoid:
- Overused fonts (Inter/Roboto/Arial/system) and cliché gradients/layouts.
- Cookie-cutter component patterns that lack context-specific character.

### Implementation

Deliver **working code** (HTML/CSS/JS or framework) that matches the chosen aesthetic’s complexity.
- Maximalist → elaborate effects/animations.
- Minimalist/refined → restraint + precision.

## How to invoke

Say: “Use the frontend-design skill” and provide:
- what you’re building (component/page/app)
- target users + tone
- tech stack (React/Vue/vanilla, Tailwind/SCSS, etc.)
- any brand constraints
