// ============================================================
//  ARCHIVE ENTRIES
//
//  Each entry follows the schema documented in the lab task.
//  Data is drawn from existing, verified project sources only:
//    - app/page.js (featured recordings on the home page)
//    - app/browse/page.js (Khmer titles, descriptions, contributors, places)
//    - public/images/ and public/audio/ (only files that actually exist
//      on disk are referenced)
//
//  Audio files for lullaby-02 through lullaby-05 are referenced in
//  app/page.js and app/browse/page.js, but the .mp3 files do not
//  currently exist in public/audio/. To respect the rule that audio
//  must point to an existing project audio path, those entries are
//  not included here until the corresponding audio files are added.
// ============================================================

const entries = [
  {
    id: "lullaby-01",
    title: "បំពេរកូន",
    description:
      "Traditional lullaby sung by mothers in Takeo province to soothe their children to sleep.",
    contributor: "ថោង អមរា",
    place: "Takeo",
    image: "/images/lullaby-01.jpg",
    audio: "/audio/lullaby-01.ogg",
    category: "Lullaby",
    language: "Khmer",
  },
];

export default entries;
