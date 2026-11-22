"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../components/LanguageProvider";
import uiText from "../../components/uiText";
import { createClient } from "../../lib/supabase/client";
import "../home.css";

export default function SignUp() {
  const { language } = useLanguage();
  const t = uiText[language];
  const router = useRouter();
  const [method, setMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const credentials = method === "email"
      ? { email, password }
      : { phone, password };
    const { error: signUpError } = await supabase.auth.signUp(credentials);

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    router.push("/");
  };

  const styles = {
    wrap: {
      maxWidth: 440,
      margin: "0 auto",
      padding: "0 16px 40px",
    },
    card: {
      backgroundColor: "rgba(19, 25, 43, 0.8)",
      backdropFilter: "blur(12px)",
      border: "1px solid #222f4a",
      borderRadius: 16,
      padding: "32px 28px",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
      marginTop: 24,
    },
    headerBox: {
      textAlign: "center",
      marginBottom: 28,
    },
    heading: {
      fontSize: 28,
      fontWeight: 700,
      color: "#FFFFFF",
      margin: "0 0 8px",
      letterSpacing: 0,
      lineHeight: 1.5,
      paddingTop: "0.25em",
      paddingBottom: "0.25em",
    },
    subheading: {
      fontSize: 14,
      color: "#97A1B3",
      margin: 0,
    },
    toggleGroup: {
      display: "flex",
      gap: 0,
      border: "1px solid #222f4a",
      borderRadius: 10,
      overflow: "hidden",
    },
    toggle: {
      flex: 1,
      padding: "10px 16px",
      border: "none",
      backgroundColor: "rgba(10, 13, 24, 0.6)",
      color: "#97A1B3",
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
    toggleActive: {
      flex: 1,
      padding: "10px 16px",
      border: "none",
      backgroundColor: "#2EE6A8",
      color: "#0A0D18",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: 20,
    },
    fieldGroup: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
    },
    label: {
      fontSize: 12,
      fontWeight: 600,
      color: "#2EE6A8",
      letterSpacing: 0,
      lineHeight: 1.5,
      paddingTop: "0.15em",
      paddingBottom: "0.15em",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: 10,
      border: "1px solid #222f4a",
      backgroundColor: "rgba(10, 13, 24, 0.6)",
      color: "#E8EDF2",
      fontSize: 15,
      lineHeight: 1.5,
      outline: "none",
      boxSizing: "border-box",
    },
    button: {
      marginTop: 8,
      padding: "12px 24px",
      borderRadius: 10,
      border: "none",
      backgroundColor: "#2EE6A8",
      color: "#0A0D18",
      fontSize: 15,
      fontWeight: 600,
      lineHeight: 1.4,
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1,
      transition: "background-color 0.2s ease",
    },
    error: {
      color: "#FF6B6B",
      backgroundColor: "rgba(255, 107, 107, 0.1)",
      border: "1px solid rgba(255, 107, 107, 0.2)",
      borderRadius: 8,
      padding: "10px",
      fontSize: 13,
      textAlign: "center",
      margin: 0,
    },
    footer: {
      marginTop: 24,
      textAlign: "center",
      fontSize: 14,
      color: "#97A1B3",
    },
    link: {
      color: "#2EE6A8",
      textDecoration: "none",
      fontWeight: 500,
    },
  };

  return (
    <main className="page-wrap" style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.headerBox}>
          <h1 style={styles.heading}>{t.signUpTitle}</h1>
          <p style={styles.subheading}>
            {t.signUpSubtitle}
          </p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.toggleGroup}>
            <button
              type="button"
              style={method === "email" ? styles.toggleActive : styles.toggle}
              onClick={() => setMethod("email")}
            >
              {t.emailTab}
            </button>
            <button
              type="button"
              style={method === "phone" ? styles.toggleActive : styles.toggle}
              onClick={() => setMethod("phone")}
            >
              {t.phoneTab}
            </button>
          </div>

          {method === "email" ? (
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="email">
                {t.emailLabel}
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder={t.emailPlaceholder}
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          ) : (
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="phone">
                {t.phoneLabel}
              </label>
              <input
                id="phone"
                type="tel"
                required
                placeholder={t.phonePlaceholder}
                style={styles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          )}

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="password">
              {t.passwordLabel}
            </label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? t.creatingAccount : t.signUpAction}
          </button>
        </form>

        <p style={styles.footer}>
          {t.alreadyHaveAccount}{" "}
          <Link href="/login" style={styles.link}>
            {t.loginLink}
          </Link>
        </p>
      </div>
    </main>
  );
}