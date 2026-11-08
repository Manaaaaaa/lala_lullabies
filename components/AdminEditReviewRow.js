"use client";

export default function AdminEditReviewRow({ entry, language, t, onApprove, onReject, busy }) {
  // entry holds the ENTIRE original published entry row, plus merged fields:
  //   pending_title, pending_description, pending_contributor, pending_place,
  //   pending_submitted_at, pending_edit_id
  const currentTitle = entry.title?.[language] || entry.title?.en || entry.title?.km || "";
  const proposedTitle = entry.pending_title?.[language] || entry.pending_title?.en || entry.pending_title?.km || "";
  const currentDesc = entry.description?.[language] || t.noDescription;
  const proposedDesc = entry.pending_description?.[language] || entry.pending_description?.en || "";
  const currentContrib = entry.contributor?.[language] || "";
  const proposedContrib = entry.pending_contributor?.[language] || entry.pending_contributor?.en || "";
  const currentPlace = entry.place?.[language] || entry.place?.en || "";
  const proposedPlace = entry.pending_place?.[language] || entry.pending_place?.en || "";
  const submitDate = entry.pending_submitted_at
    ? new Date(entry.pending_submitted_at).toLocaleDateString(
        language === "km" ? "km-KH" : "en-US",
        { year: "numeric", month: "short", day: "numeric" }
      )
    : "";
  const ownerLabel = entry.owner ? entry.owner.slice(0, 8) : "—";

  const rows = [
    [t.contributeTitle || "Title", currentTitle, proposedTitle],
    [t.descriptionLabel, currentDesc, proposedDesc],
    [t.contributor || "Contributor", currentContrib, proposedContrib],
    [t.place || "Place", currentPlace, proposedPlace],
  ];

  const s = {
    card: {
      padding: 20, borderRadius: 14,
      backgroundColor: "rgba(19, 25, 43, 0.8)", border: "1px solid #222f4a",
    },
    banner: {
      display: "inline-block", padding: "2px 12px", borderRadius: 999,
      fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
      color: "#F0C040", backgroundColor: "rgba(240, 192, 64, 0.12)",
      border: "1px solid rgba(240, 192, 64, 0.3)", marginBottom: 8,
    },
    mediaCol: { display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 },
    thumb: { width: 120, height: 120, objectFit: "cover", borderRadius: 8, backgroundColor: "#0F172A" },
    meta: { margin: "0 0 8px", fontSize: 12, color: "#5A6373" },
    colHeader: { fontSize: 12, color: "#5A6373", fontWeight: 600, fontFamily: "'Courier New', monospace", margin: 0 },
    propHeader: { fontSize: 12, color: "#F0C040", fontWeight: 600, fontFamily: "'Courier New', monospace", margin: 0 },
    fieldLabel: { fontSize: 11, color: "#5A6373", fontFamily: "'Courier New', monospace", margin: "0 0 2px" },
    value: { margin: 0, fontSize: 14, lineHeight: 1.5, color: "#97A1B3" },
    diffValue: { margin: 0, fontSize: 14, lineHeight: 1.5, color: "#E8EDF2" },
    actions: { marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" },
    approveBtn: {
      padding: "10px 20px", borderRadius: 999, cursor: busy ? "not-allowed" : "pointer",
      fontSize: 14, fontWeight: 600, color: "#060818", backgroundColor: "#2EE6A8",
      border: "none", opacity: busy ? 0.6 : 1,
    },
    rejectBtn: {
      padding: "10px 20px", borderRadius: 999, cursor: busy ? "not-allowed" : "pointer",
      fontSize: 14, fontWeight: 500, color: "#E85D5D",
      backgroundColor: "transparent", border: "1px solid rgba(232, 93, 93, 0.5)",
      opacity: busy ? 0.4 : 1,
    },
  };

  return (
    <li style={{ listStyle: "none" }}>
      <div style={s.card}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
          {(entry.image_url || entry.audio_url) && (
            <div style={s.mediaCol}>
              {entry.image_url && <img src={entry.image_url} alt="" style={s.thumb} />}
              {entry.audio_url && (
                <audio controls preload="none" style={{ width: 120, borderRadius: 8 }}>
                  <source src={entry.audio_url} />
                </audio>
              )}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 320 }}>
            <span style={s.banner}>{t.editProposedBadge}</span>
            <p style={s.meta}>
              {t.byLabel} {ownerLabel} · {submitDate}
            </p>

            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <p style={s.colHeader}>{t.publishedVersionLabel}</p>
                {rows.map(([label, pubVal]) => (
                  <div style={{ margin: "0 0 8px" }} key={`pub-${label}`}>
                    <p style={s.fieldLabel}>{label}</p>
                    <p style={s.value}>{pubVal || "—"}</p>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <p style={s.propHeader}>{t.proposedVersionLabel}</p>
                {rows.map(([label, , propVal]) => (
                  <div style={{ margin: "0 0 8px" }} key={`prop-${label}`}>
                    <p style={s.fieldLabel}>{label}</p>
                    <p style={s.diffValue}>{propVal || "—"}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={s.actions}>
              <button
                style={s.approveBtn}
                onClick={() => onApprove(entry.pending_edit_id)}
                disabled={busy}
                aria-label={`${t.approveEditAction || "Approve Edit"}: ${currentTitle}`}
              >
                {busy ? t.publishAction || "Publishing..." : t.approveEditAction || "Approve Edit"}
              </button>
              <button
                style={s.rejectBtn}
                onClick={() => onReject(entry.pending_edit_id)}
                disabled={busy}
              >
                {busy ? t.reviewFailed || "Rejecting..." : t.rejectEditAction || "Reject Edit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}