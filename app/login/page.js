"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import { createClient } from "../../lib/supabase/client";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("Invalid email or password");
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
      letterSpacing: "-0.5px",
    },
    subheading: {
      fontSize: 14,
      color: "#97A1B3",
      margin: 0,
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
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: 10,
      border: "1px solid #222f4a",
      backgroundColor: "rgba(10, 13, 24, 0.6)",
      color: "#E8EDF2",
      fontSize: 15,
      outline: "none",
      boxSizing: "border-box",
    },
    button: {
      marginTop: 8,
      padding: "14px",
      borderRadius: 10,
      border: "none",
      backgroundColor: "#2EE6A8",
      color: "#0A0D18",
      fontSize: 15,
      fontWeight: 600,
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
      <Header />

      <div style={styles.card}>
        <div style={styles.headerBox}>
          <h1 style={styles.heading}>Welcome back</h1>
          <p style={styles.subheading}>Log in to access your saved archive</p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="name@example.com"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="password">
              Password
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
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link href="/signup" style={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}