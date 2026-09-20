"use client";

import collection from "../../collection.config.js";
import entries from "../../data/entries.js";
import SearchFilter from "../../components/SearchFilter";
import Header from "../../components/Header";
import { useLanguage } from "../../components/LanguageProvider";
import { useSearchParams } from "next/navigation";
import uiText from "../../components/uiText";
import "../home.css";

export default function Browse() {
  const { language } = useLanguage();
  const t = uiText[language];
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <main className="page-wrap" style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Header />

      <p
        style={{
          fontFamily: "'Courier New', monospace",
          color: "#2EE6A8",
          fontSize: 14,
          letterSpacing: 1,
        }}
      >
        {t.kicker}
      </p>

      <h1
        style={{
          fontSize: 48,
          fontWeight: 700,
          margin: "16px 0 12px",
          lineHeight: 1.1,
          color: "#E8EDF2",
        }}
      >
        {collection.name}
      </h1>

      <p
        style={{
          fontSize: 18,
          color: "#97A1B3",
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {collection.description}
      </p>

      <SearchFilter entries={entries} initialQuery={query} />
    </main>
  );
}