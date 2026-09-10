"use client";
import Link from "next/link";
import collection from "../collection.config.js";
import entries from "../data/entries.js";
import EntryCard from "../components/EntryCard";
import Header from "../components/Header";
import { useLanguage } from "../components/LanguageProvider";
import uiText from "../components/uiText";
import "./home.css";

export default function Home() {
  const { language } = useLanguage();
  const t = uiText[language];
  const featuredRecordings = entries.slice(0, 3);
  const styles = {
    wrap: {
      maxWidth: 1200,
      margin: "0 auto",
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
    <main className="page-wrap" style={styles.wrap}>
      <Header />

      {/* Hero Section */}
      <section style={styles.hero}>
        <p style={styles.kicker}>{t.kicker}</p>
        <h1 style={styles.heroTitle}>{collection.name}</h1>
        <p style={styles.heroDescription}>{collection.description}</p>
      </section>

      {/* Explore the Archive Section */}
      <section style={styles.exploreSection}>
        <h2 style={styles.sectionHeading}>{t.exploreHeading}</h2>
        <p style={styles.sectionDescription}>
          {t.exploreDesc}
        </p>
        <Link href="/browse" className="cta-button">
          {t.browseLink} <span className="cta-arrow">→</span>
        </Link>
      </section>

      {/* Featured Recordings Section */}
      <section style={styles.featuredSection}>
        <div style={styles.featuredHeader}>
          <h2 style={styles.featuredHeading}>{t.featuredHeading}</h2>
          <div style={styles.divider} />
        </div>

        <div className="card-grid">
          {featuredRecordings.map((entry) => (
            <EntryCard
              key={entry.id}
              title={entry.title}
              description={entry.description}
              contributor={entry.contributor}
              place={entry.place}
              image={entry.image}
              audio={entry.audio}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>{t.footer}</footer>
    </main>
  );
}