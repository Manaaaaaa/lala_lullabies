# App Folder Context Documentation

## Project Overview
This is a **Khmer Living Archive** project for ICT 340 at AUPP (American University of Phnom Penh). The project is a Next.js 15 application using the App Router with React 19, built to archive Khmer cultural content - specifically "Localized lullabies" collected from recordings of mothers and grandmothers singing lullabies to their children in Cambodia.

## App Folder Structure
```
app/
├── layout.js    # Root layout with metadata and global styles
└── page.js      # Home page displaying archive information and audio entries
```
```
public/
├── images/      # Cover images for archive entries
└── audio/       # Audio files for archive entries
```
```
components/
└── EntryCard.js # Audio archive card component for displaying entries
```
 
## File Details

### `app/layout.js`
- **Purpose**: Root layout component that wraps all pages
- **Key Features**:
  - Imports collection config for dynamic metadata
  - Sets page metadata (title, description) from `collection.config.js`
  - Defines global styles: dark theme (#14181F background, #E8EDF2 text)
  - Uses system font stack for typography
  - Minimum height of 100vh for full viewport coverage

### `app/page.js`
- **Purpose**: Home page displaying the archive's identity and audio archive entries
- **Key Features**:
  - Imports collection config for all display content
  - Imports EntryCard component for displaying audio archive entries
  - Uses inline style objects for styling (following project convention)
  - Displays:
    - Kicker: "KHMER LIVING ARCHIVE"
    - Title: Collection name ("Localized lullabies")
    - Description: Collection description
    - Two info cards: "CURATED BY" (Kimsourmana) and "SOURCE" (community recordings)
    - Entry count: Shows actual number of audio entries (5) using `sampleEntries.length`
    - Audio entries section: Displays 5 sample lullaby entries as audio cards with cover images and audio players
    - Footer with course/project information
  - Sample entries include:
    - 1 Khmer entry: "និយាយជាម្ចរដៃទឹកភ្នែកសៃនៅតំបន់សៀមរាប" with contributor "ជំមានស" and place "សៀមរាប"
    - 2 English entries: "Lullaby of the Mekong Riverside" with contributor "Chandara" and place "Phnom Penh"
    - 1 Khmer entry: "និយាយភ្លើងឆេះ" with contributor "ចន" and place "កំពង់សព្ប"
    - 1 English entry: "Grandmother's Evening Melody" with contributor "Sokha" and place "Battambang"
    - 1 English entry: "River Child's Song" with contributor "Srey Srey" and place "Kampong Cham"
- **Styling Pattern**: Inline style objects with consistent color scheme:
  - Primary accent: #2EE6A8 (green)
  - Muted text: #97A1B3
  - Card background: #1C222C
  - Border: #2E3644
  - Footer text: #5A6373
  - Card layout: Flexbox wrapping for responsive grid

## Configuration

### `collection.config.js` (Single Source of Truth)
```javascript
const collection = {
  name: "Localized lullabies",
  description: "A living archive of a piece of Khmer culture, built for ICT 340.",
  curator: "Kimsourmana",
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
- Lab 1: Basic archive identity page complete
- 5 audio archive cards implemented with cover images and audio players
- Entry count shows 5 (for now) via `sampleEntries.length`
- EntryCard component supports image, audio, title, description, contributor, and place
- Public directories created: `public/images/` and `public/audio/` (empty - ready for media files)
- Three sprints planned: browse/search, contributor accounts, own-your-entries, submit-review-publish