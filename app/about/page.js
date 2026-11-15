"use client";
import collection from "../../collection.config.js";
import { useLanguage } from "../../components/LanguageProvider";
import uiText from "../../components/uiText";
import "../home.css";

export default function About() {
  const { language } = useLanguage();
  const t = uiText[language];

  const styles = {
    wrap: { maxWidth: 800, margin: "0 auto" },
    kicker: {
      fontFamily: "'Courier New', monospace",
      color: "#2EE6A8",
      fontSize: 14,
      letterSpacing: 1,
      textAlign: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 40,
      fontWeight: 700,
      margin: "0 0 24px",
      lineHeight: 1.1,
      color: "#E8EDF2",
      textAlign: "center",
    },
    description: {
      fontSize: 18,
      color: "#97A1B3",
      lineHeight: 1.7,
      margin: "0 0 40px",
      textAlign: "center",
    },
    block: {
      marginBottom: 28,
      paddingTop: 24,
      borderTop: "1px solid #2E3644",
    },
    label: {
      fontFamily: "'Courier New', monospace",
      fontSize: 12,
      letterSpacing: 1,
      color: "#5A6373",
      marginBottom: 8,
    },
    value: {
      fontSize: 16,
      color: "#E8EDF2",
      lineHeight: 1.6,
    },
  };

  return (
    <main className="page-wrap" style={styles.wrap}>
      <p style={styles.kicker}>{t.kicker}</p>
      <h1 style={styles.title}>{t.aboutTitle}</h1>
      <p style={styles.description}>{collection[`description_${language}`] || collection.description}</p>

      <div style={styles.block}>
        <p style={styles.label}>{t.curatorLabel}</p>
        <p style={styles.value}>{collection[`curator_${language}`] || collection.curator}</p>
      </div>

      <div style={styles.block}>
        <p style={styles.label}>{t.sourceLabel}</p>
        <p style={styles.value}>{collection[`source_${language}`] || collection.source}</p>
      </div>
    </main>
  );
}