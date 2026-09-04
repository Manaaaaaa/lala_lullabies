# App Folder Context Documentation

## Project Overview
This is a **Khmer Living Archive** project for ICT 340 at AUPP (American University of Phnom Penh). The project is a Next.js 15 application using the App Router with React 19, built to archive Khmer cultural content - specifically "Localized lullabies" collected from recordings of mothers and grandmothers singing lullabies to their children in Cambodia.

## App Folder Structure
```
app/
├── layout.js         # Root layout with metadata and global styles
├── page.js           # Home page with hero, CTA, and featured recordings grid
├── home.css          # CSS styles for card grid (responsive) and CTA buttons
├── globals.css       # Global CSS (if present)
├── browse/
│   └── page.js       # Browse page showing all entries in responsive grid
└── (other routes)
```
```
public/
├── images/           # Cover images (lullaby-01.jpg to lullaby-05.jpg)
└── audio/            # Audio files (.ogg, .mp3)
```
```
components/
├── EntryCard.js      # Audio card for browse page (64px play button)
├── RecordingCard.js  # Audio card for home page (48px play button)
└── NightSky.js       # Animated star background effect
```
```
collection.config.js  # Single source of truth for archive identity
```

## Card Layout System

### Consistent Card Design
All cards use a unified layout structure ensuring equal heights across grid rows:

**Card Structure:**
```
CARD (flex column)
├── Image Container (aspect-ratio: 16/9, overflow: hidden)
│   └── Image (object-fit: cover, 100% width/height)
├── Content Container (flex: 1)
│   ├── Title (2-line clamp with -webkit-line-clamp)
│   ├── Description (3-line clamp with -webkit-line-clamp)
│   ├── Metadata (contributor, place)
│   └── Duration/Year (conditional)
└── Audio Player (margin-top: auto - pushed to bottom)
    ├── Play Button
    └── Waveform (flex: 1, constrained with minWidth: 0)
```

**Grid System (app/home.css):**
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));  /* Desktop: 3 columns */
  gap: 24px;
}
@media (max-width: 1024px) { .card-grid { grid-template-columns: repeat(2, 1fr); } } /* Tablet: 2 columns */
@media (max-width: 768px)  { .card-grid { grid-template-columns: 1fr; } }        /* Mobile: 1 column */
```

**Key Techniques for Consistency:**
1. **Fixed image aspect ratio**: `aspect-ratio: 16/9` prevents varying image heights
2. **Line clamping**: Title and description reserve fixed vertical space regardless of content length
3. **Flexbox with margin-top: auto**: Audio player always aligns to card bottom
4. **minWidth: 0 on waveform**: Allows waveform bars to shrink below minimum content size
5. **overflow: hidden on waveform**: Clips any overflow during resize

## File Details

### `app/layout.js`
- **Purpose**: Root layout component that wraps all pages
- **Key Features**:
  - Imports collection config for dynamic metadata
  - Sets page metadata (title, description) from `collection.config.js`
  - Defines global styles: dark navy theme (#060818 background, #E8EDF2 text)
  - Uses system font stack for typography
  - Minimum height of 100vh for full viewport coverage
  - Includes NightSky animated background component

### `app/page.js`
- **Purpose**: Home page displaying the archive's identity and featured recordings
- **Key Features**:
  - Imports collection config for all display content
  - Imports RecordingCard component for featured audio entries
  - Uses inline style objects for styling (following project convention)
  - Displays:
    - Kicker: "KHMER LIVING ARCHIVE"
    - Title: Collection name ("Localized lullabies")
    - Description: Collection description
    - Hero section with CTA button linking to browse page
    - Featured recordings section with 3 sample lullabies
    - Footer with course/project information
  - Featured entries include:
    - "បំពេរកូន" (Takeo) - Traditional lullaby
    - "មាន់រងាវ" (Takeo) - Gentle melody from grandmother
    - "ពេលមេឃស្រទុំ" (Takeo) - Melancholic tune
- **Styling Pattern**: Inline style objects with consistent color scheme:
  - Primary accent: #2EE6A8 (green)
  - Muted text: #97A1B3
  - Card background: rgba(28, 34, 44, 0.55) with glassmorphism
  - Border: #2E3644
  - Footer text: #5A6373
  - Card layout: CSS Grid with responsive breakpoints

### `app/browse/page.js`
- **Purpose**: Browse page showing all entries in responsive grid
- **Key Features**:
  - Imports EntryCard component for all audio entries
  - Displays all 5 entries in grid layout
  - Imports `../home.css` for card grid styles

### `app/home.css`
- **Purpose**: CSS styles for card grid and CTA buttons
- **Key Features**:
  - Responsive 3-column grid (desktop), 2-column (tablet), 1-column (mobile)
  - CTA button styles with hover effects
  - `.card-grid` class for consistent card layout

## Card Components

### RecordingCard.js (Home Page)
- **Purpose**: Featured recording card with audio playback
- **Props**: title, description, contributor, place, image, audio, duration, year
- **Features**:
  - 48px play button (smaller variant)
  - Click anywhere on card to toggle play
  - Waveform visualization with progress tracking
  - Duration and year metadata display

### EntryCard.js (Browse Page)
- **Purpose**: Full entry card with audio playback
- **Props**: title, description, contributor, place, image, audio
- **Features**:
  - 64px play button (larger variant)
  - Click on waveform to seek
  - Waveform visualization with progress tracking

### NightSky.js
- **Purpose**: Animated star background effect
- **Features**:
  - Pre-generated star positions
  - Animated twinkling stars
  - Milky way band effect
  - Mountain silhouette

## Configuration

### `collection.config.js` (Single Source of Truth)
```javascript
const collection = {
  name: "Localized lullabies",
  description: "A living archive of a piece of Khmer culture, built for ICT 340.",
  creator: "Kimsourmana",
  source: "To be gathered from recording mothers and grandmothers singing lullabies to their children, and from the Khmer community in Cambodia."
};
```
**Rule**: Never hard-code these values - always import from this file.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **React**: 19.1.0
- **Language**: JavaScript only (no TypeScript)
- **Styling**: Inline style objects or plain CSS files
- **Dependencies**: Only `next`, `react`, `react-dom`

## Project Rules (from AGENTS.md)
1. No additional dependencies allowed
2. No modifications to package.json, next.config.mjs, or .gitignore unless explicitly asked
3. No API keys/tokens in code
4. One component per file in `components/` (max ~80 lines)
5. Khmer text is first-class content - never strip or transliterate
6. Build only what current task asks for - no building ahead

## Current State
- Lab 1: Archive skeleton with consistent card layout complete
- 3 featured recordings on home page, 5 total in browse
- All cards have consistent heights, fixed aspect ratio images, line-clamped text
- Waveform stays within card boundaries with proper overflow handling
- Responsive grid: 3 columns (desktop), 2 columns (tablet), 1 column (mobile)
- Public directories ready: `public/images/` and `public/audio/`
- Sprint features planned: browse/search, contributor accounts, own-your-entries, submit-review-publish