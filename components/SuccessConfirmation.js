"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "./LanguageProvider";
import uiText from "./uiText";

const CheckIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <circle cx="24" cy="24" r="22" fill="rgba(46, 230, 168, 0.12)" />
    <path
      d="M14 14 L24 26 L30 20"
      stroke="#2EE6A8"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function SuccessConfirmation() {
  const { language } = useLanguage();
  const t = uiText[language];
  const router = useRouter();
  const viewRef = useRef(null);

  useEffect(() => {
    viewRef.current?.focus();
  }, []);

  const styles = {
    backdrop: {
      position: "fixed",
      inset: 0,
      zIndex: 100,
      padding: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(3, 5, 14, 0.75)",
    },
    box: {
      width: "100%",
      maxWidth: 480,
      padding: "40px 32px 32px",
      borderRadius: 20,
      backgroundColor: "#0F172A",
      border: "1px solid #222f4a",
      textAlign: "center",
    },
    iconWrap: { marginBottom: 20 },
    heading: {
      margin: "0 0 12px",
      fontSize: 22,
      fontWeight: 700,
      color: "#E8EDF2",
      lineHeight: 1.3,
    },
    message: {
      margin: "0 0 28px",
      fontSize: 15,
      lineHeight: 1.7,
      color: "#97A1B3",
    },
    note: {
      margin: "0 0 28px",
      padding: "12px 16px",
      fontSize: 13,
      lineHeight: 1.6,
      color: "#F0C040",
      backgroundColor: "rgba(240, 192, 64, 0.08)",
      border: "1px solid rgba(240, 192, 64, 0.25)",
      borderRadius: 10,
    },
    actions: {
      display: "flex",
      gap: 12,
      justifyContent: "center",
      flexWrap: "wrap",
    },
    primary: {
      padding: "12px 24px",
      borderRadius: 999,
      cursor: "pointer",
      fontSize: 15,
      fontWeight: 600,
      color: "#060818",
      backgroundColor: "#2EE6A8",
      border: "none",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
    },
    secondary: {
      padding: "12px 24px",
      borderRadius: 999,
      cursor: "pointer",
      fontSize: 15,
      fontWeight: 500,
      color: "#2EE6A8",
      backgroundColor: "transparent",
      border: "1px solid rgba(46, 230, 168, 0.4)",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
    },
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-heading"
      style={styles.backdrop}
    >
      <div
        style={styles.box}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.iconWrap}>
          <CheckIcon />
        </div>

        <h2 id="success-heading" style={styles.heading}>
          {t.successHeading}
        </h2>

        <p style={styles.message}>{t.successMessage}</p>

        <div style={styles.note} role="status">
          {t.pendingReviewNote}
        </div>

        <div style={styles.actions}>
          <button
            ref={viewRef}
            style={styles.primary}
            onClick={() => router.push("/my-contributions")}
          >
            {t.successView}
          </button>
          <button
            style={styles.secondary}
            onClick={() => router.push("/browse")}
          >
            {t.successBrowse}
          </button>
        </div>
      </div>
    </div>
  );
}