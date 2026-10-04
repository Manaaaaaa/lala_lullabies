"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import collection from "../collection.config.js";
import EntryCard from "../components/EntryCard";
import { useLanguage } from "../components/LanguageProvider";
import uiText from "../components/uiText";
import { createClient } from "../lib/supabase/client";
import "./home.css";

const CompassIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2EE6A8" strokeWidth="1.6">
    <circle cx="12" cy="12" r="9" />
    <polygon points="15,9 13,13 9,15 11,11" fill="#2EE6A8" stroke="none" />
  </svg>
);

export default function Home() {
  const { language } = useLanguage();
  const t = uiText[language];
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const nameWords = collection.name.trim().split(" ");
  const lastWord = nameWords.pop();
  const heroLead = nameWords.join(" ");

  useEffect(() => {
    let active = true;

    async function loadEntries() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Unable to load entries for the home page:", error);
      }

      if (active) {
        setEntries(data || []);
        setLoading(false);
      }
    }

    loadEntries();

    return () => {
      active = false;
    };
  }, []);

  const featuredRecordings = entries.slice(0, 3);

  const styles = {
    wrap: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "0 24px 48px",
      backgroundColor: "transparent",
      boxSizing: "border-box",
    },
    hero: {
      textAlign: "center",
      marginBottom: 56,
      marginTop: 24,
    },
    heroTitle: {
      fontSize: 48,
      fontWeight: 700,
      margin: "0 0 12px",
      lineHeight: 1.1,
      color: "#E8EDF2",
    },
    heroTitleAccent: {
      background: "linear-gradient(90deg, #2EE6A8, #E8EDF2)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      WebkitTextFillColor: "transparent",
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
      {/* Hero Section */}
      <section style={styles.hero}>
        <p className="hero-kicker">{t.kicker}</p>
        <h1 style={styles.heroTitle}>
          {heroLead} <span style={styles.heroTitleAccent}>{lastWord}</span>
        </h1>
        <p style={styles.heroDescription}>{collection.description}</p>
      </section>

      {/* Explore the Archive Section */}
      <section className="explore-card">
        <div className="explore-card-icon">
          <CompassIcon />
        </div>
        <div className="explore-card-text">
          <h2 className="explore-card-heading">{t.exploreHeading}</h2>
          <p className="explore-card-desc">{t.exploreDesc}</p>
        </div>
        <Link href="/browse" className="cta-button explore-card-cta">
          {t.browseLink} <span className="cta-arrow">→</span>
        </Link>
      </section>

      {/* Featured Recordings Section */}
      <section style={styles.featuredSection}>
        <div style={styles.featuredHeader}>
          <h2 style={styles.featuredHeading}>{t.featuredHeading}</h2>
          <div style={styles.divider} />
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#97A1B3" }}>{t.loading}</p>
        ) : featuredRecordings.length === 0 ? (
          <p style={{ textAlign: "center", color: "#97A1B3" }}>{t.emptyArchive}</p>
        ) : (
          <div className="card-grid">
            {featuredRecordings.map((entry) => (
              <EntryCard
                key={entry.id}
                title={entry.title}
                description={entry.description}
                contributor={entry.contributor}
                place={entry.place}
                image_url={entry.image_url}
                audio_url={entry.audio_url}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={styles.footer}>{t.footer}</footer>
    </main>
  );
}