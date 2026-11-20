"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "../../components/LanguageProvider";
import uiText from "../../components/uiText";
import { createClient } from "../../lib/supabase/client";
import SubmitEntryForm from "../../components/SubmitEntryForm";
import "../home.css";

export default function Submit() {
  const { language } = useLanguage();
  const t = uiText[language];
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const styles = {
    wrap: { maxWidth: 800, margin: "0 auto" },
    kicker: {
      fontFamily: "'Courier New', monospace",
      color: "#2EE6A8",
      fontSize: 14,
      letterSpacing: 1,
      textAlign: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 40,
      fontWeight: 700,
      margin: "0 0 24px",
      lineHeight: 1.1,
      color: "#E8EDF2",
      textAlign: "center",
    },
    description: {
      fontSize: 18,
      color: "#97A1B3",
      lineHeight: 1.7,
      margin: "0 0 12px",
      textAlign: "center",
    },
    gate: {
      maxWidth: 480,
      margin: "0 auto",
      padding: "32px 28px",
      textAlign: "center",
      backgroundColor: "rgba(19, 25, 43, 0.8)",
      backdropFilter: "blur(12px)",
      border: "1px solid #222f4a",
      borderRadius: 16,
    },
    gateText: {
      fontSize: 16,
      color: "#97A1B3",
      lineHeight: 1.6,
      margin: "0 0 20px",
    },
    gateLinks: {
      display: "flex",
      gap: 12,
      justifyContent: "center",
    },
    loading: {
      textAlign: "center",
      color: "#97A1B3",
    },
  };

  return (
    <main className="page-wrap" style={styles.wrap}>
      <p style={styles.kicker}>{t.kicker}</p>
      <h1 style={styles.title}>{t.contributeTitle}</h1>
      <p style={styles.description}>{t.contributeIntro}</p>

      {!checked ? (
        <p style={styles.loading}>{t.loading}</p>
      ) : user ? (
        <SubmitEntryForm />
      ) : (
        <div style={styles.gate}>
          <p style={styles.gateText}>{t.contributeLoggedOut}</p>
          <div style={styles.gateLinks}>
            <Link href="/login" className="cta-button">
              {t.loginLink}
            </Link>
            <Link href="/signup" className="cta-button">
              {t.signupLink}
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}