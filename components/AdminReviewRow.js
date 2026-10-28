"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase/client";
import EntryEditor from "./EntryEditor";

export default function AdminReviewRow({ entry, language, t, onPublish, onReturn, busy }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [currentEntry, setCurrentEntry] = useState(entry);

  const title = currentEntry.title?.[language] || currentEntry.title?.en || currentEntry.title?.km || "";
  const description = currentEntry.description?.[language] || t.noDescription;
  const contributor = currentEntry.contributor?.[language] || "";
  const contribEn = currentEntry.contributor?.en || "";
  const place = currentEntry.place?.[language] || currentEntry.place?.en || "";
  const category = currentEntry.category || "";
  const date = currentEntry.created_at
    ? new Date(currentEntry.created_at).toLocaleDateString(language === "km" ? "km-KH" : "en-US", {
        year: "numeric", month: "short", day: "numeric",
      })
    : "";
  const ownerLabel = currentEntry.owner ? currentEntry.owner.slice(0, 8) : "—";

  const handleSave = async (updates) => {
    setSaving(true);
    setSaveError(null);
    try {
      const supabase = createClient();
      // The admin RPC updates title/description/place only. Contributor is
      // preserved server-side and cannot be replaced with the admin's name.
      const { data, error } = await supabase.rpc("admin_update_entry", {
        p_entry_id: currentEntry.id,
        p_title: updates.title,
        p_description: updates.description,
        p_place: updates.place,
      });
      if (error) throw error;
      if (!data.ok) throw new Error(data.error || "Save failed");
      setCurrentEntry({
        ...currentEntry,
        ...updates,
        admin_edited_by: data.admin_edited_by ?? currentEntry.admin_edited_by,
        admin_edited_at: data.admin_edited_at ?? currentEntry.admin_edited_at,
      });
      setEditing(false);
    } catch (err) {
      console.error("Edit save error:", err);
      setSaveError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const styles = {
    card: {
      padding: 20, borderRadius: 14,
      backgroundColor: "rgba(19, 25, 43, 0.8)", border: "1px solid #222f4a",
    },
    row: { display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" },
    mediaCol: { display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 },
    thumb: { width: 120, height: 120, objectFit: "cover", borderRadius: 8, backgroundColor: "#0F172A" },
    audioPlayer: { width: 120, borderRadius: 8 },
    infoCol: { flex: 1, minWidth: 200 },
    title: { margin: "0 0 6px", fontSize: 20, fontWeight: 600, color: "#E8EDF2" },
    badge: {
      display: "inline-block", padding: "2px 10px", borderRadius: 999,
      fontSize: 11, fontWeight: 600, letterSpacing: 0.5, whiteSpace: "nowrap",
      color: "#F0C040", backgroundColor: "rgba(240, 192, 64, 0.1)",
      border: "1px solid rgba(240, 192, 64, 0.3)", marginBottom: 8,
    },
    meta: { margin: "0 0 4px", fontSize: 13, color: "#97A1B3", lineHeight: 1.6 },
    label: { color: "#5A6373", fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 0.5 },
    editedLabel: { color: "#F0C040", fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 0.5 },
    desc: {
      margin: "12px 0 0", fontSize: 14, lineHeight: 1.6, color: "#97A1B3",
      whiteSpace: "pre-wrap",
    },
    actions: { marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" },
    editBtn: {
      padding: "10px 20px", borderRadius: 999, cursor: busy ? "not-allowed" : "pointer",
      fontSize: 14, fontWeight: 500, color: "#97A1B3",
      backgroundColor: "transparent", border: "1px solid rgba(151, 161, 179, 0.5)",
      opacity: busy ? 0.4 : 1,
    },
    publishBtn: {
      padding: "10px 20px", borderRadius: 999, cursor: busy ? "not-allowed" : "pointer",
      fontSize: 14, fontWeight: 600, color: "#060818", backgroundColor: "#2EE6A8",
      border: "none", opacity: busy ? 0.6 : 1, transition: "opacity 0.2s",
    },
    returnBtn: {
      padding: "10px 20px", borderRadius: 999, cursor: busy ? "not-allowed" : "pointer",
      fontSize: 14, fontWeight: 500, color: "#E85D5D",
      backgroundColor: "transparent", border: "1px solid rgba(232, 93, 93, 0.5)",
      opacity: busy ? 0.4 : 1, transition: "opacity 0.2s",
    },
  };

  return (
    <li style={{ listStyle: "none" }}>
      <div style={styles.card}>
        {editing ? (
          <>
            {saveError && (
              <p role="alert" style={{ color: "#E85D5D", margin: "0 0 10px" }}>{saveError}</p>
            )}
            <EntryEditor
              entry={currentEntry}
              language={language}
              t={t}
              onSave={handleSave}
              onCancel={() => { setEditing(false); setSaveError(null); }}
              saving={saving}
              allowContributor={false}
            />
          </>
        ) : (
          <>
            <div style={styles.row}>
              {(currentEntry.image_url || currentEntry.audio_url) && (
                <div style={styles.mediaCol}>
                  {currentEntry.image_url && (
                    <img src={currentEntry.image_url} alt="" style={styles.thumb} />
                  )}
                  {currentEntry.audio_url && (
                    <audio controls preload="none" style={styles.audioPlayer} aria-label={t.playAudio}>
                      <source src={currentEntry.audio_url} />
                    </audio>
                  )}
                </div>
              )}
              <div style={styles.infoCol}>
                <h3 style={styles.title}>{title}</h3>
                <span style={styles.badge}>{t.pendingReview}</span>
                <p style={styles.meta}>
                  <span style={styles.label}>{t.submittedOn}</span> {date}<br />
                  <span style={styles.label}>{t.byLabel}</span> {contributor || contribEn || "—"}{" "}
                  ({ownerLabel})<br />
                  <span style={styles.label}>{t.place}</span> {place}<br />
                  {category && <><span style={styles.label}>{t.category || "Category"}</span> {category}</>}
                  {currentEntry.admin_edited_at && (
                    <>
                      <br />
                      <span style={styles.editedLabel}>
                        {t.editedByAdmin} ·{" "}
                        {new Date(currentEntry.admin_edited_at).toLocaleDateString(
                          language === "km" ? "km-KH" : "en-US",
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </span>
                    </>
                  )}
                </p>
                <p style={styles.desc}>{description}</p>
              </div>
            </div>
            <div style={styles.actions}>
              <button
                style={styles.editBtn}
                onClick={() => setEditing(true)}
                disabled={busy}
                aria-label={`Edit: ${title}`}
              >
                {t.editAction || "Edit"}
              </button>
              <button
                style={styles.publishBtn}
                onClick={() => onPublish(currentEntry)}
                disabled={busy}
                aria-label={`${t.publishAction}: ${title}`}
              >
                {busy ? t.publishing : t.publishAction}
              </button>
              <button
                style={styles.returnBtn}
                onClick={() => onReturn(currentEntry)}
                disabled={busy}
                aria-label={`${t.returnAction}: ${title}`}
              >
                {busy ? t.returning : t.returnAction}
              </button>
            </div>
          </>
        )}
      </div>
    </li>
  );
}