"use client";

import { useId, useState } from "react";
import provinces from "./provinces";

function findProvinceIndex(place) {
  if (!place || !place.en) return "";
  const match = provinces.find((p) => p.en === place.en && p.km === place.km);
  return match !== undefined ? String(provinces.indexOf(match)) : "";
}

// Inline styles can't reach ::placeholder, :focus or scrollbars, so those
// live in one small scoped stylesheet below.
const fieldCss = `
.entry-field::placeholder { color: #CBD5E1; opacity: 1; }
.entry-field:focus { border-color: rgba(46, 230, 168, 0.7); box-shadow: 0 0 0 3px rgba(46, 230, 168, 0.15); }
.entry-field:disabled { cursor: not-allowed; }
select.entry-field option { background-color: #13192b; color: #FFFFFF; }
select.entry-field option:disabled { color: #CBD5E1; }
textarea.entry-field { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.25) transparent; }
textarea.entry-field::-webkit-scrollbar { width: 8px; }
textarea.entry-field::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.25); border-radius: 999px; }
textarea.entry-field::-webkit-scrollbar-track { background: transparent; }
`;

const s = {
  form: { display: "flex", flexDirection: "column", gap: 20, width: "100%" },
  group: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 14, fontWeight: 500, lineHeight: 1.4, color: "#E2E8F0" },
  field: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    fontSize: 15,
    lineHeight: 1.6,
    fontFamily: "inherit",
    color: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    outline: "none",
    margin: 0,
  },
  textarea: {
    minHeight: 120,
    resize: "vertical",
    overflowY: "auto",
    // Extra right padding keeps text clear of the scrollbar.
    padding: "10px 16px 10px 12px",
    display: "block",
  },
  select: { appearance: "auto", cursor: "pointer" },
  readOnly: { opacity: 0.75, minHeight: 0 },
  hint: { margin: 0, fontSize: 13, color: "#F0C040" },
  actions: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 },
  previewImg: {
    width: 160, height: 110, objectFit: "cover", borderRadius: 8,
    border: "1px solid rgba(255, 255, 255, 0.1)", backgroundColor: "#0F172A",
  },
  previewAudio: { width: "100%", maxWidth: 320 },
  fileSelected: { margin: 0, fontSize: 13, color: "#2EE6A8" },
  fileKeep: { margin: 0, fontSize: 13, color: "#97A1B3" },
};

export default function EntryEditor({ entry, language, t, onSave, onCancel, saving, allowContributor = true }) {
  const uid = useId();
  const [titleEn, setTitleEn] = useState(entry.title?.en || "");
  const [titleKm, setTitleKm] = useState(entry.title?.km || "");
  const [descEn, setDescEn] = useState(entry.description?.en || "");
  const [descKm, setDescKm] = useState(entry.description?.km || "");
  const [contribEn, setContribEn] = useState(entry.contributor?.en || "");
  const [contribKm, setContribKm] = useState(entry.contributor?.km || "");
  const [placeIdx, setPlaceIdx] = useState(findProvinceIndex(entry.place));
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

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
      // Selected replacement files, if any. When null, the caller keeps the
      // entry's current image/audio unchanged.
      imageFile,
      audioFile,
    });
  };

  const id = (name) => `${uid}-${name}`;

  return (
    <div style={s.form}>
      <style>{fieldCss}</style>

      <div style={s.group}>
        <label style={s.label} htmlFor={id("title-en")}>Title (English)</label>
        <input
          id={id("title-en")}
          className="entry-field"
          style={s.field}
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
        />
      </div>

      <div style={s.group}>
        <label style={s.label} htmlFor={id("title-km")}>ចំណងជើង (ភាសាខ្មែរ)</label>
        <input
          id={id("title-km")}
          className="entry-field"
          style={s.field}
          value={titleKm}
          onChange={(e) => setTitleKm(e.target.value)}
        />
      </div>

      <div style={s.group}>
        <label style={s.label} htmlFor={id("desc-en")}>Description (English)</label>
        <textarea
          id={id("desc-en")}
          className="entry-field"
          style={{ ...s.field, ...s.textarea }}
          value={descEn}
          onChange={(e) => setDescEn(e.target.value)}
        />
      </div>

      <div style={s.group}>
        <label style={s.label} htmlFor={id("desc-km")}>ការពិពណ៌នា (ភាសាខ្មែរ)</label>
        <textarea
          id={id("desc-km")}
          className="entry-field"
          style={{ ...s.field, ...s.textarea }}
          value={descKm}
          onChange={(e) => setDescKm(e.target.value)}
        />
      </div>

      <div style={s.group}>
        <label style={s.label} htmlFor={id("contrib-en")}>Contributor's Name (Lastname, Firstname)</label>
        {allowContributor ? (
          <input
            id={id("contrib-en")}
            className="entry-field"
            style={s.field}
            value={contribEn}
            onChange={(e) => setContribEn(e.target.value)}
          />
        ) : (
          <>
            <div id={id("contrib-en")} style={{ ...s.field, ...s.readOnly }}>{contribEn || "—"}</div>
            <p style={s.hint}>{t.contributorReadOnly}</p>
          </>
        )}
      </div>

      <div style={s.group}>
        <label style={s.label} htmlFor={id("contrib-km")}>ឈ្មោះរបស់អ្នកចូលរួម (ត្រកូល , នាម )</label>
        {allowContributor ? (
          <input
            id={id("contrib-km")}
            className="entry-field"
            style={s.field}
            value={contribKm}
            onChange={(e) => setContribKm(e.target.value)}
          />
        ) : (
          <div id={id("contrib-km")} style={{ ...s.field, ...s.readOnly }}>{contribKm || "—"}</div>
        )}
      </div>

      <div style={s.group}>
        <label style={s.label} htmlFor={id("province")}>Province</label>
        <select
          id={id("province")}
          className="entry-field"
          style={{ ...s.field, ...s.select }}
          value={placeIdx}
          onChange={(e) => setPlaceIdx(e.target.value)}
        >
          <option value="" disabled>Select a province</option>
          {provinces.map((p, i) => (
            <option key={p.en} value={String(i)}>{language === "km" ? p.km : p.en}</option>
          ))}
        </select>
      </div>

      <div style={s.group}>
        <label style={s.label} htmlFor={id("image")}>Cover Image</label>
        {entry.image_url && <img src={entry.image_url} alt="" style={s.previewImg} />}
        <input
          id={id("image")}
          type="file"
          accept="image/*"
          className="entry-field"
          style={{ ...s.field, padding: "8px 12px" }}
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
        {imageFile ? (
          <p style={s.fileSelected}>New image: {imageFile.name}</p>
        ) : entry.image_url ? (
          <p style={s.fileKeep}>Leave unchanged to keep the current image.</p>
        ) : null}
      </div>

      <div style={s.group}>
        <label style={s.label} htmlFor={id("audio")}>Audio File</label>
        {entry.audio_url && (
          <audio controls preload="none" src={entry.audio_url} style={s.previewAudio} />
        )}
        <input
          id={id("audio")}
          type="file"
          accept="audio/*"
          className="entry-field"
          style={{ ...s.field, padding: "8px 12px" }}
          onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
        />
        {audioFile ? (
          <p style={s.fileSelected}>New audio: {audioFile.name}</p>
        ) : entry.audio_url ? (
          <p style={s.fileKeep}>Leave unchanged to keep the current audio.</p>
        ) : null}
      </div>

      <div style={s.actions}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "10px 20px", borderRadius: 999, cursor: saving ? "not-allowed" : "pointer",
            fontSize: 14, fontWeight: 600, color: "#060818", backgroundColor: "#2EE6A8",
            border: "none", opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? t.submitting || "Submitting..." : t.submitAction || "Resubmit"}
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          style={{
            padding: "10px 20px", borderRadius: 999, cursor: saving ? "not-allowed" : "pointer",
            fontSize: 14, fontWeight: 500, color: "#CBD5E1",
            backgroundColor: "transparent", border: "1px solid rgba(203, 213, 225, 0.4)",
          }}
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
}