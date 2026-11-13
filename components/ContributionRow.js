"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase/client";
import uploadMedia from "../lib/mediaUpload";
import EntryEditor from "./EntryEditor";

export default function ContributionRow({ entry, language, t, showOwner, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [currentEntry, setCurrentEntry] = useState(entry);
  const [editSubmitted, setEditSubmitted] = useState(false);

  const title = currentEntry.title?.[language] || currentEntry.title?.en || currentEntry.title?.km || "";
  const description = currentEntry.description?.[language] || t.noDescription;
  const contributor = currentEntry.contributor?.[language] || "";
  const date = currentEntry.created_at
    ? new Date(currentEntry.created_at).toLocaleDateString(language === "km" ? "km-KH" : "en-US", {
        year: "numeric", month: "short", day: "numeric",
      })
    : "";

  const handleSave = async (updates) => {
    setSaving(true);
    setSaveError(null);
    try {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("User not authenticated.");

      // Upload newly selected files; keep existing URLs when none chosen.
      let imageUrl = currentEntry.image_url || null;
      let audioUrl = currentEntry.audio_url || null;
      if (updates.imageFile) imageUrl = await uploadMedia(supabase, user.id, updates.imageFile, "image");
      if (updates.audioFile) audioUrl = await uploadMedia(supabase, user.id, updates.audioFile, "audio");

      if (isPublished && !editSubmitted) {
        // Published entry edit → submitted for admin re-review
        const { data, error } = await supabase.rpc("submit_edit_published_entry", {
          p_entry_id: currentEntry.id,
          p_title: updates.title,
          p_description: updates.description,
          p_contributor: updates.contributor,
          p_place: updates.place,
          p_image_url: imageUrl,
          p_audio_url: audioUrl,
        });
        if (error) throw error;
        if (!data.ok) throw new Error(data.error || "Save failed");
        // Do NOT overwrite currentEntry — the original values stay displayed;
        // just flag the edit as submitted so the badge changes.
        setEditSubmitted(true);
      } else {
        // status === "returned" — existing resubmit flow (status changes to pending)
        const { data, error } = await supabase.rpc("resubmit_entry", {
          p_entry_id: currentEntry.id,
          p_title: updates.title,
          p_description: updates.description,
          p_contributor: updates.contributor,
          p_place: updates.place,
          p_image_url: imageUrl,
          p_audio_url: audioUrl,
        });
        if (error) throw error;
        if (!data.ok) throw new Error(data.error || "Save failed");
        setCurrentEntry({
          ...currentEntry,
          title: updates.title,
          description: updates.description,
          contributor: updates.contributor,
          place: updates.place,
          image_url: imageUrl,
          audio_url: audioUrl,
          status: "pending",
        });
      }

      setEditing(false);
    } catch (err) {
      console.error("Save error:", err);
      setSaveError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // Actual database statuses:
  //   NULL  → legacy entry (already published before status tracking)
  //   "published" → Published
  //   "pending"   → Pending Review
  //   "draft"     → Draft
  //   "returned"  → Returned
  const status = currentEntry.status ?? null;
  const isPublished = status === "published" || status === null;

  const statusStyles = {
    legacy: {
      color: "#2EE6A8",
      backgroundColor: "rgba(46, 230, 168, 0.1)",
      border: "1px solid rgba(46, 230, 168, 0.3)",
    },
    published: {
      color: "#2EE6A8",
      backgroundColor: "rgba(46, 230, 168, 0.1)",
      border: "1px solid rgba(46, 230, 168, 0.3)",
    },
    pending: {
      color: "#F0C040",
      backgroundColor: "rgba(240, 192, 64, 0.1)",
      border: "1px solid rgba(240, 192, 64, 0.3)",
    },
    draft: {
      color: "#97A1B3",
      backgroundColor: "rgba(151, 161, 179, 0.1)",
      border: "1px solid rgba(151, 161, 179, 0.3)",
    },
    returned: {
      color: "#E85D5D",
      backgroundColor: "rgba(232, 93, 93, 0.1)",
      border: "1px solid rgba(232, 93, 93, 0.3)",
    },
  };

  const neutralStyle = {
    color: "#97A1B3",
    backgroundColor: "rgba(151, 161, 179, 0.06)",
    border: "1px solid rgba(151, 161, 179, 0.2)",
  };

  const statusLabel
    = status === null
      ? t.statusPublished
      : status === "published" && editSubmitted
        ? t.pendingReview
        : status === "published"
          ? t.statusPublished
          : status === "pending"
            ? t.pendingReview
            : status === "draft"
              ? t.statusDraft
              : status === "returned"
                ? t.statusReturned
                : t.statusUnknown;

  const badgeStyle = {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.5,
    whiteSpace: "nowrap",
    ...(status === null
      ? statusStyles.legacy
      : status === "published" && editSubmitted
        ? statusStyles.pending
        : statusStyles[status] || neutralStyle),
  };

  const styles = {
    card: {
      display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start",
      padding: 16, borderRadius: 14,
      backgroundColor: "rgba(19, 25, 43, 0.8)", border: "1px solid #222f4a",
    },
    feedbackBox: {
      margin: "12px 0 0", padding: "12px 14px", borderRadius: 10,
      backgroundColor: "rgba(232, 93, 93, 0.06)", border: "1px solid rgba(232, 93, 93, 0.2)",
    },
    feedbackLabel: {
      margin: "0 0 4px", fontSize: 12, fontWeight: 600,
      color: "#E85D5D", fontFamily: "'Courier New', monospace", letterSpacing: 0.5,
    },
    feedbackText: {
      margin: 0, fontSize: 14, lineHeight: 1.5, color: "#E2E8F0",
      whiteSpace: "pre-wrap",
    },
    thumb: { width: 96, height: 96, objectFit: "cover", borderRadius: 8, flexShrink: 0, backgroundColor: "#0F172A" },
    info: { flex: 1, minWidth: 200 },
    titleRow: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap",
      margin: "0 0 4px",
    },
    title: { fontSize: 18, fontWeight: 600, color: "#E8EDF2" },
    meta: { margin: "0 0 8px", fontSize: 12, color: "#5A6373", fontFamily: "'Courier New', monospace" },
    desc: {
      margin: 0, fontSize: 14, lineHeight: 1.5, color: "#97A1B3",
      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
    },
    del: {
      padding: "8px 16px", borderRadius: 999, cursor: "pointer", fontSize: 13,
      color: "#E85D5D", backgroundColor: "transparent", border: "1px solid rgba(232, 93, 93, 0.5)",
    },
    resubmit: {
      padding: "8px 16px", borderRadius: 999, cursor: "pointer", fontSize: 13,
      color: "#F0C040", backgroundColor: "rgba(240, 192, 64, 0.08)",
      border: "1px solid rgba(240, 192, 64, 0.5)",
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
            />
          </>
        ) : (
          <>
            {currentEntry.image_url && <img src={currentEntry.image_url} alt="" style={styles.thumb} />}
            <div style={styles.info}>
              <div style={styles.titleRow}>
                <h3 style={styles.title}>{title}</h3>
                <span style={badgeStyle} aria-label={statusLabel}>
                  {statusLabel}
                </span>
              </div>
              <p style={styles.meta}>
                {currentEntry.category}
                {date && ` · ${t.submittedOn} ${date}`}
                {showOwner && ` · ${t.byLabel} ${contributor || "—"} (${currentEntry.owner ? currentEntry.owner.slice(0, 8) : "no owner"})`}
              </p>
              <p style={styles.desc}>{description}</p>
            {status === "returned" && currentEntry.review_comment && (
              <div style={styles.feedbackBox}>
                <p style={styles.feedbackLabel}>{t.adminFeedbackLabel}</p>
                <p style={styles.feedbackText}>{currentEntry.review_comment}</p>
              </div>
            )}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-start" }}>
              {(status === "returned" || (isPublished && !editSubmitted)) && (
                <button
                  style={isPublished ? { ...styles.resubmit, color: "#2EE6A8", borderColor: "rgba(46, 230, 168, 0.5)" } : styles.resubmit}
                  onClick={() => setEditing(true)}
                  aria-label={`Edit: ${title}`}
                >
                  {isPublished ? t.editAction : t.editAndResubmit || "Edit & Resubmit"}
                </button>
              )}
              <button style={styles.del} onClick={() => onDelete(currentEntry)} aria-label={`${t.deleteAction}: ${title}`}>
                {t.deleteAction}
              </button>
            </div>
          </>
        )}
      </div>
    </li>
  );
}