import Link from "next/link";
import collection from "../collection.config.js";
import RecordingCard from "../components/RecordingCard";
import "./home.css";

const featuredRecordings = [
  {
    title: "បំពេរកូន",
    description:
      "Traditional lullaby sung by mothers in Takeo province to soothe their children to sleep.",
    contributor: "ថោង អមរា",
    place: "Takeo",
    image: "/images/lullaby-01.jpg",
    audio: "/audio/lullaby-01.ogg",
    duration: "0:18",
    year: "2026",
  },
  {
    title: "មាន់រងាវ",
    description:
      "Gentle melody from grandmother អ៊ាង, known for its calming rhythm that quiets restless children.",
    contributor: "លោកយាយ អ៊ាង",
    place: "Takeo",
    image: "/images/lullaby-02.jpg",
    audio: "/audio/lullaby-02.mp3",
    duration: "1:00",
    year: "2026",
  },
  {
    title: "ពេលមេឃស្រទុំ",
    description:
      "A melancholic tune expressing deep longing and tenderness, filled with heartfelt emotion.",
    contributor: "គន្ធា",
    place: "Takeo",
    image: "/images/lullaby-03.jpg",
    audio: "/audio/lullaby-03.mp3",
    duration: "1:30",
    year: "2026",
  },
];

export default function Home() {
  const styles = {
    wrap: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "80px 24px",
      backgroundColor: "transparent",
    },
    hero: {
      textAlign: "center",
      marginBottom: 80,
    },
    kicker: {
      fontFamily: "'Courier New', monospace",
      color: "#2EE6A8",
      fontSize: 14,
      letterSpacing: 1,
      marginBottom: 16,
    },
    heroTitle: {
      fontSize: 48,
      fontWeight: 700,
      margin: "0 0 12px",
      lineHeight: 1.1,
      color: "#E8EDF2",
    },
    heroDescription: {
      fontSize: 18,
      color: "#97A1B3",
      lineHeight: 1.6,
      margin: 0,
      maxWidth: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
    exploreSection: {
      marginTop: 64,
      textAlign: "center",
    },
    sectionHeading: {
      fontSize: 32,
      fontWeight: 600,
      margin: "0 0 12px",
      color: "#E8EDF2",
      letterSpacing: "-0.5px",
    },
    sectionDescription: {
      fontSize: 16,
      color: "#97A1B3",
      lineHeight: 1.6,
      margin: "0 0 24px",
    },
    featuredSection: {
      marginTop: 96,
    },
    featuredHeader: {
      textAlign: "center",
      marginBottom: 48,
    },
    featuredHeading: {
      fontSize: 28,
      fontWeight: 600,
      margin: "0 0 16px",
      color: "#E8EDF2",
    },
    divider: {
      width: 60,
      height: 2,
      backgroundColor: "rgba(46, 230, 168, 0.4)",
      margin: "0 auto",
      borderRadius: 1,
    },
    cardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: 24,
    },
    footer: {
      marginTop: 96,
      paddingTop: 24,
      borderTop: "1px solid #2E3644",
      fontSize: 13,
      color: "#5A6373",
      textAlign: "center",
    },
  };

  return (
    <main style={styles.wrap}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
        <h1 style={styles.heroTitle}>{collection.name}</h1>
        <p style={styles.heroDescription}>{collection.description}</p>
      </section>

      {/* Explore the Archive Section */}
      <section style={styles.exploreSection}>
        <h2 style={styles.sectionHeading}>Explore the Archive</h2>
        <p style={styles.sectionDescription}>
          Discover lullabies collected from Khmer communities.
        </p>
        <Link href="/browse" className="cta-button">
          Browse lullabies <span className="cta-arrow">→</span>
        </Link>
      </section>

      {/* Featured Recordings Section */}
      <section style={styles.featuredSection}>
        <div style={styles.featuredHeader}>
          <h2 style={styles.featuredHeading}>Featured recordings</h2>
          <div style={styles.divider} />
        </div>

        <div className="card-grid">
          {featuredRecordings.map((recording, index) => (
            <RecordingCard
              key={index}
              title={recording.title}
              description={recording.description}
              contributor={recording.contributor}
              place={recording.place}
              image={recording.image}
              audio={recording.audio}
              duration={recording.duration}
              year={recording.year}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh,
        Fall 2026.
      </footer>
    </main>
  );
}