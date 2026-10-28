"use client";

import { useState } from "react";
import provinces from "./provinces";

function findProvinceIndex(place) {
  if (!place || !place.en) return "";
  const match = provinces.find((p) => p.en === place.en && p.km === place.km);
  return match !== undefined ? String(provinces.indexOf(match)) : "";
}

export default function EntryEditor({ entry, language, t, onSave, onCancel, saving, allowContributor = true }) {
  const [titleEn, setTitleEn] = useState(entry.title?.en || "");
  const [titleKm, setTitleKm] = useState(entry.title?.km || "");
  const [descEn, setDescEn] = useState(entry.description?.en || "");
  const [descKm, setDescKm] = useState(entry.description?.km || "");
  const [contribEn, setContribEn] = useState(entry.contributor?.en || "");
  const [contribKm, setContribKm] = useState(entry.contributor?.km || "");
  const [placeIdx, setPlaceIdx] = useState(findProvinceIndex(entry.place));

  const handleSave = () => {
    const selected = placeIdx !== "" ? provinces[Number(placeIdx)] : entry.place;
    onSave({
      title: { en: titleEn, km: titleKm },
      description: { en: descEn, km: descKm },
      // When the contributor is not editable (admin mode), send the original
      // value back untouched so it can never be replaced with the admin's name.
      contributor: allowContributor
        ? { en: contribEn, km: contribKm }
        : entry.contributor || { en: "", km: "" },
      place: selected,
    });
  };

  const label = (text) => ({ margin: "0 0 4px", fontSize: 12, color: "#5A6373", fontFamily: "'Courier New', monospace" });
  const input = {
    width: "100%", boxSizing: "border-box", padding: "8px 10px", borderRadius: 8,
    border: "1px solid #222f4a", backgroundColor: "#0F172A", color: "#E8EDF2",
    fontSize: 14, marginBottom: 6,
  };
  const textarea = { ...input, minHeight: 60, resize: "vertical" };
  const select = { ...input, padding: "8px 10px" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <p style={label()}>Title (English)</p>
      <input style={input} value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />

      <p style={label()}>ចំណងជើង (ភាសាខ្មែរ)</p>
      <input style={input} value={titleKm} onChange={(e) => setTitleKm(e.target.value)} />

      <p style={label()}>Description (English)</p>
      <textarea style={textarea} value={descEn} onChange={(e) => setDescEn(e.target.value)} />

      <p style={label()}>ការពិពណ៌នា (ភាសាខ្មែរ)</p>
      <textarea style={textarea} value={descKm} onChange={(e) => setDescKm(e.target.value)} />

      <p style={label()}>Contributor (English)</p>
      {allowContributor ? (
        <input style={input} value={contribEn} onChange={(e) => setContribEn(e.target.value)} />
      ) : (
        <>
          <p style={{ ...input, minHeight: 0, opacity: 0.75 }}>{contribEn || "—"}</p>
          <p style={{ margin: "0 0 8px", fontSize: 12, color: "#F0C040" }}>{t.contributorReadOnly}</p>
        </>
      )}

      <p style={label()}>អ្នកចូលរួម (ភាសាខ្មែរ)</p>
      {allowContributor ? (
        <input style={input} value={contribKm} onChange={(e) => setContribKm(e.target.value)} />
      ) : (
        <p style={{ ...input, minHeight: 0, opacity: 0.75 }}>{contribKm || "—"}</p>
      )}

      <p style={label()}>Province</p>
      <select style={select} value={placeIdx} onChange={(e) => setPlaceIdx(e.target.value)}>
        <option value="" disabled>Select a province</option>
        {provinces.map((p, i) => (
          <option key={p.en} value={String(i)}>{language === "km" ? p.km : p.en}</option>
        ))}
      </select>

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "8px 18px", borderRadius: 999, cursor: saving ? "not-allowed" : "pointer",
            fontSize: 14, fontWeight: 600, color: "#060818", backgroundColor: "#2EE6A8",
            border: "none", opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? t.saving || "Saving..." : t.saveAction || "Save"}
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          style={{
            padding: "8px 18px", borderRadius: 999, cursor: saving ? "not-allowed" : "pointer",
            fontSize: 14, fontWeight: 500, color: "#97A1B3",
            backgroundColor: "transparent", border: "1px solid rgba(151, 161, 179, 0.5)",
          }}
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
}