# App Folder Context Documentation

## Project Overview
This is a **Khmer Living Archive** project for ICT 340 at AUPP (American University of Phnom Penh). The project is a Next.js 15 application using the App Router with React 19, built to archive Khmer cultural content - specifically "Localized lullabies" collected from recordings of mothers and grandmothers singing lullabies to their children in Cambodia.

## App Folder Structure
```
app/
├── layout.js    # Root layout with metadata and global styles
└── page.js      # Home page displaying archive information
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
- **Purpose**: Home page displaying the archive's identity
- **Key Features**:
  - Imports collection config for all display content
  - Uses inline style objects for styling (following project convention)
  - Displays:
    - Kicker: "KHMER LIVING ARCHIVE"
    - Title: Collection name ("Localized lullabies")
    - Description: Collection description
    - Two info cards: "CURATED BY" (Kimsourmana) and "SOURCE" (community recordings)
    - Entry count placeholder: "entries in the archive: 0 (for now)"
    - Footer with course/project information
- **Styling Pattern**: Inline style objects with consistent color scheme:
  - Primary accent: #2EE6A8 (green)
  - Muted text: #97A1B3
  - Card background: #1C222C
  - Border: #2E3644
  - Footer text: #5A6373

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
- Entry count shows 0 (placeholder for future sprints)
- Three sprints planned: browse/search, contributor accounts, own-your-entries, submit-review-publish