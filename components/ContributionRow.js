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

  // Actual database statuses:
  //   NULL  → legacy entry (already published before status tracking)
  //   "published" → Published
  //   "pending"   → Pending Review
  //   "draft"     → Draft
  //   "returned"  → Returned
  const status = entry.status ?? null;

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
      : statusStyles[status] || neutralStyle),
  };

  const styles = {
    card: {
      display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start",
      padding: 16, borderRadius: 14,
      backgroundColor: "rgba(19, 25, 43, 0.8)", border: "1px solid #222f4a",
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
  };

  return (
    <li style={{ listStyle: "none" }}>
      <div style={styles.card}>
        {entry.image_url && <img src={entry.image_url} alt="" style={styles.thumb} />}
        <div style={styles.info}>
          <div style={styles.titleRow}>
            <h3 style={styles.title}>{title}</h3>
            <span style={badgeStyle} aria-label={statusLabel}>
              {statusLabel}
            </span>
          </div>
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