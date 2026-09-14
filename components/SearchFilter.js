"use client";

import { useState } from "react";
import { useLanguage } from "./LanguageProvider";
import uiText from "./uiText";
import EntryCard from "./EntryCard";

export default function SearchFilter({ entries }) {
  const { language } = useLanguage();
  const t = uiText[language];
  const [query, setQuery] = useState("");

  const trimmed = query.trim().toLowerCase();
  const filtered =
    trimmed === ""
      ? entries
      : entries.filter((entry) => {
          const title = (entry.title[language] || "").toLowerCase();
          const description = (entry.description[language] || "").toLowerCase();
          const contributor = (entry.contributor[language] || "").toLowerCase();
          const place = (entry.place[language] || "").toLowerCase();
          return (
            title.includes(trimmed) ||
            description.includes(trimmed) ||
            contributor.includes(trimmed) ||
            place.includes(trimmed)
          );
        });

  return (
    <>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.searchPlaceholder}
        aria-label={t.searchPlaceholder}
        style={{
          width: "100%",
          maxWidth: 480,
          padding: "12px 16px",
          marginBottom: 24,
          backgroundColor: "rgba(28, 34, 44, 0.55)",
          border: "1px solid #2E3644",
          borderRadius: 8,
          color: "#E8EDF2",
          fontSize: 16,
          fontFamily: "inherit",
          outline: "none",
          boxSizing: "border-box",
          display: "block",
        }}
      />

      {filtered.length === 0 ? (
        <div
          style={{
            marginTop: 48,
            padding: "32px 24px",
            textAlign: "center",
            border: "1px solid #2E3644",
            borderRadius: 10,
            backgroundColor: "rgba(28, 34, 44, 0.4)",
          }}
        >
          <p
            style={{
              fontSize: 18,
              color: "#E8EDF2",
              margin: "0 0 8px",
            }}
          >
            {t.emptyKhmer}
          </p>
          <p
            style={{
              fontSize: 15,
              color: "#97A1B3",
              margin: 0,
            }}
          >
            {t.emptyDetail(query)}
          </p>
        </div>
      ) : (
        <section className="card-grid" style={{ marginTop: 48 }}>
          {filtered.map((entry) => (
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
        </section>
      )}
    </>
  );
}