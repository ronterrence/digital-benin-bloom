
# Benin Digital Exhibition — Refined Museum Experience

## Overview
Transform the current blank Lovable project into a polished, immersive dark museum gallery showcasing the Benin artifact collection. Images will load from GitHub raw URLs. The experience features a smooth scroll narrative through artifact clusters with a progress tracker showing what's been viewed.

## Design System
- **Dark museum palette**: Deep charcoal/near-black backgrounds (#0a0a0a), warm gold accents (#c9a84c) for headings and highlights, off-white (#e8e4dc) for body text
- **Typography**: Serif font (Playfair Display) for headings, clean sans-serif for body
- **Spacing**: Generous whitespace to give artifacts room to breathe, like a real gallery

## Pages & Components

### 1. Hero / Landing Section
- Full-viewport dark hero with exhibition title "Benin Digital Exhibition"
- Subtitle: historical context from the Pitt Rivers 1900 publication
- "Enter the Archive" call-to-action scrolls smoothly into the gallery
- Subtle fade-in animation on load

### 2. Methodology Section
- Brief explanation of the AI-assisted reconstruction pipeline (original → enhanced → bronze)
- Clean card layout with the three processing stages described

### 3. Gallery — Cluster-by-Cluster Narrative
- Each cluster rendered as a full-width section with a section header ("Cluster 00 — 29 artifacts")
- Artifacts displayed in a responsive masonry-style grid
- Each artifact card shows: plate image, figure ID, truncated description
- Cards use hover effects (subtle lift/glow) revealing more info
- **Intersection Observer** triggers fade-in animations as each cluster scrolls into view

### 4. Artifact Detail Modal
- Clicking any artifact opens a modal/overlay with:
  - Larger plate image
  - Full historical description from the manifest
  - Cluster info and artifact ID
  - Close button returns to gallery position

### 5. Progress Tracker (New Feature)
- Floating sidebar or bottom bar showing:
  - Total artifacts count (239 artifacts across 11 clusters)
  - "Viewed" count — tracked via Intersection Observer as artifacts scroll into viewport
  - Visual progress bar with percentage
  - Cluster mini-map showing which clusters have been visited
- State stored in localStorage so progress persists across sessions

## Data Architecture
- Artifact manifest data (IDs, descriptions, clusters) embedded as a JSON constant parsed from the CSV data
- Images served from `https://raw.githubusercontent.com/ronterrence/benin-artifact-exhibition/main/benin_output/plates/`
- Artifact detail pages linked to `benin_output/html_exhibition/artifact_pages/`

## File Structure
- `src/data/artifacts.ts` — artifact manifest data as typed array
- `src/pages/Index.tsx` — main exhibition page with all sections
- `src/components/HeroSection.tsx` — landing hero
- `src/components/MethodologySection.tsx` — pipeline explanation
- `src/components/ClusterSection.tsx` — renders one cluster's artifact grid
- `src/components/ArtifactCard.tsx` — individual artifact thumbnail card
- `src/components/ArtifactModal.tsx` — detail overlay
- `src/components/ProgressTracker.tsx` — floating progress indicator
- `src/hooks/useViewProgress.ts` — Intersection Observer + localStorage tracking
