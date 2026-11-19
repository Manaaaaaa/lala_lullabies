"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import collection from "../../collection.config.js";
import SearchFilter from "../../components/SearchFilter";
import { useLanguage } from "../../components/LanguageProvider";
import { useSearchParams } from "next/navigation";
import uiText from "../../components/uiText";
import { createClient } from "../../lib/supabase/client";
import "../home.css";

// Sub-component that safely uses useSearchParams
function BrowseContent() {
  const { language } = useLanguage();
  const t = uiText[language];
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadEntries() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .or("status.eq.published,status.is.null")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Unable to load entries for browse:", error);
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

  return (
    <main className="page-wrap" style={{ maxWidth: 1200, margin: "0 auto" }}>
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
        className="browse-heading"
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
        {collection[`description_${language}`] || collection.description}
      </p>

      {loading ? (
        <p style={{ marginTop: 48, color: "#97A1B3" }}>{t.loading}</p>
      ) : (
        <SearchFilter entries={entries} initialQuery={query} />
      )}
    </main>
  );
}

// Main page component wrapped with Suspense boundary
export default function Browse() {
  return (
    <Suspense fallback={<div style={{ padding: 20, color: "#E8EDF2" }}>Loading...</div>}>
      <BrowseContent />
    </Suspense>
  );
}