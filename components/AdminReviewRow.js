"use client";

export default function AdminReviewRow({ entry, language, t, onPublish, onReturn, busy }) {
  const title = entry.title?.[language] || entry.title?.en || entry.title?.km || "";
  const description = entry.description?.[language] || t.noDescription;
  const contributor = entry.contributor?.[language] || "";
  const contribEn = entry.contributor?.en || "";
  const place = entry.place?.[language] || entry.place?.en || "";
  const category = entry.category || "";
  const date = entry.created_at
    ? new Date(entry.created_at).toLocaleDateString(language === "km" ? "km-KH" : "en-US", {
        year: "numeric", month: "short", day: "numeric",
      })
    : "";
  const ownerLabel = entry.owner ? entry.owner.slice(0, 8) : "—";

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
    desc: {
      margin: "12px 0 0", fontSize: 14, lineHeight: 1.6, color: "#97A1B3",
      whiteSpace: "pre-wrap",
    },
    actions: { marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" },
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
        <div style={styles.row}>
          {(entry.image_url || entry.audio_url) && (
            <div style={styles.mediaCol}>
              {entry.image_url && (
                <img src={entry.image_url} alt="" style={styles.thumb} />
              )}
              {entry.audio_url && (
                <audio controls preload="none" style={styles.audioPlayer} aria-label={t.playAudio}>
                  <source src={entry.audio_url} />
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
            </p>
            <p style={styles.desc}>{description}</p>
          </div>
        </div>
        <div style={styles.actions}>
          <button
            style={styles.publishBtn}
            onClick={() => onPublish(entry)}
            disabled={busy}
            aria-label={`${t.publishAction}: ${title}`}
          >
            {busy ? t.publishing : t.publishAction}
          </button>
          <button
            style={styles.returnBtn}
            onClick={() => onReturn(entry)}
            disabled={busy}
            aria-label={`${t.returnAction}: ${title}`}
          >
            {busy ? t.returning : t.returnAction}
          </button>
        </div>
      </div>
    </li>
  );
}