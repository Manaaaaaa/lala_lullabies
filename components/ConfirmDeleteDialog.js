"use client";
import { useEffect } from "react";

export default function ConfirmDeleteDialog({ title, t, deleting, onCancel, onConfirm }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !deleting && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleting, onCancel]);

  const styles = {
    backdrop: {
      position: "fixed", inset: 0, zIndex: 100, padding: 16,
      display: "flex", alignItems: "center", justifyContent: "center",
      backgroundColor: "rgba(3, 5, 14, 0.75)",
    },
    box: {
      width: "100%", maxWidth: 440, padding: 24, borderRadius: 16,
      backgroundColor: "#0F172A", border: "1px solid #343C4B",
    },
    heading: { margin: "0 0 12px", fontSize: 20, color: "#E8EDF2" },
    body: { margin: "0 0 24px", fontSize: 15, lineHeight: 1.6, color: "#97A1B3" },
    actions: { display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" },
    cancel: {
      padding: "10px 18px", borderRadius: 999, cursor: "pointer", fontSize: 14,
      color: "#E8EDF2", backgroundColor: "transparent", border: "1px solid #343C4B",
    },
    danger: {
      padding: "10px 18px", borderRadius: 999, cursor: "pointer", fontSize: 14,
      fontWeight: 600, color: "#fff", backgroundColor: "#C0392B", border: "none",
    },
  };

  return (
    <div style={styles.backdrop} onClick={() => !deleting && onCancel()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        style={styles.box}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-delete-title" style={styles.heading}>{t.confirmDeleteTitle}</h2>
        <p style={styles.body}>{t.confirmDeleteBody(title)}</p>
        <div style={styles.actions}>
          <button autoFocus style={styles.cancel} onClick={onCancel} disabled={deleting}>
            {t.cancel}
          </button>
          <button
            style={{ ...styles.danger, opacity: deleting ? 0.6 : 1 }}
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? t.deleting : t.confirmDelete}
          </button>
        </div>
      </div>
    </div>
  );
}