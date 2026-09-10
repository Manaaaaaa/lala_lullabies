"use client";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
import uiText from "./uiText";
import collection from "../collection.config.js";

export default function Header() {
  const { language, toggleLanguage } = useLanguage();
  const t = uiText[language];

  const styles = {
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 24,
    },
    title: {
      fontSize: 25,
      fontWeight: 500,
      color: "#2EE6A8",
      textDecoration: "none",
      transition: "color 0.2s ease",
    },
    button: {
      padding: "8px 15px",
      borderRadius: 9,
      fontSize: 16,
      fontWeight: 500,
      color: "#E8EDF2",
      backgroundColor: "transparent",
      border: "1px solid #2E3644",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
    active: {
      fontWeight: 700,
    },
    separator: {
      margin: "0 8px",
    },
  };

  return (
    <header style={styles.header}>
      <Link href="/" style={styles.title}>
        {collection.name}
      </Link>
      <button
        onClick={toggleLanguage}
        style={styles.button}
        aria-label="Switch language"
      >
        <span style={language === "en" ? styles.active : {}}>EN</span>
        <span style={styles.separator}>/</span>
        <span style={language === "km" ? styles.active : {}}>ខ្មែរ</span>
      </button>
    </header>
  );
}