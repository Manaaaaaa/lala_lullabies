"use client";

export default function ContributionRow({ entry, language, t, showOwner, onDelete }) {
  const title = entry.title?.[language] || entry.title?.en || entry.title?.km || "";
  const description = entry.description?.[language] || t.noDescription;
  const contributor = entry.contributor?.[language] || "";
  const date = entry.created_at
    ? new Date(entry.created_at).toLocaleDateString(language === "km" ? "km-KH" : "en-US", {
        year: "numeric", month: "short", day: "numeric",
      })
    : "";

  const styles = {
    card: {
      display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start",
      padding: 16, borderRadius: 14,
      backgroundColor: "rgba(19, 25, 43, 0.8)", border: "1px solid #222f4a",
    },
    thumb: { width: 96, height: 96, objectFit: "cover", borderRadius: 8, flexShrink: 0, backgroundColor: "#0F172A" },
    info: { flex: 1, minWidth: 200 },
    title: { margin: "0 0 4px", fontSize: 18, fontWeight: 600, color: "#E8EDF2" },
    meta: { margin: "0 0 8px", fontSize: 12, color: "#5A6373", fontFamily: "'Courier New', monospace" },
    desc: {
      margin: 0, fontSize: 14, lineHeight: 1.5, color: "#97A1B3",
      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
    },
    del: {
      padding: "8px 16px", borderRadius: 999, cursor: "pointer", fontSize: 13,
      color: "#E85D5D", backgroundColor: "transparent", border: "1px solid rgba(232, 93, 93, 0.5)",
    },
  };

  return (
    <li style={{ listStyle: "none" }}>
      <div style={styles.card}>
        {entry.image_url && <img src={entry.image_url} alt="" style={styles.thumb} />}
        <div style={styles.info}>
          <h3 style={styles.title}>{title}</h3>
          <p style={styles.meta}>
            {entry.category}
            {date && ` · ${t.submittedOn} ${date}`}
            {showOwner && ` · ${t.byLabel} ${contributor || "—"} (${entry.owner ? entry.owner.slice(0, 8) : "no owner"})`}
          </p>
          <p style={styles.desc}>{description}</p>
        </div>
        <button style={styles.del} onClick={() => onDelete(entry)} aria-label={`${t.deleteAction}: ${title}`}>
          {t.deleteAction}
        </button>
      </div>
    </li>
  );
}