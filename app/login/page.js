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
    wrap: { maxWidth: 420, margin: "0 auto" },
    heading: {
      fontSize: 32,
      fontWeight: 700,
      color: "#E8EDF2",
      margin: "0 0 24px",
      textAlign: "center",
    },
    form: { display: "flex", flexDirection: "column", gap: 16 },
    label: { fontSize: 14, color: "#97A1B3", marginBottom: 6, display: "block" },
    input: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: 8,
      border: "1px solid #2E3644",
      backgroundColor: "rgba(255,255,255,0.03)",
      color: "#E8EDF2",
      fontSize: 15,
      boxSizing: "border-box",
    },
    button: {
      marginTop: 8,
      padding: "12px",
      borderRadius: 999,
      border: "1px solid rgba(46, 230, 168, 0.4)",
      backgroundColor: "rgba(46, 230, 168, 0.08)",
      color: "#2EE6A8",
      fontSize: 15,
      fontWeight: 600,
      cursor: "pointer",
    },
    error: {
      color: "#E85D5D",
      fontSize: 14,
      textAlign: "center",
      margin: 0,
    },
    footer: {
      marginTop: 20,
      textAlign: "center",
      fontSize: 14,
      color: "#97A1B3",
    },
    link: { color: "#2EE6A8", textDecoration: "none" },
  };

  return (
    <main className="page-wrap" style={styles.wrap}>
      <Header />
      <h1 style={styles.heading}>Log in</h1>

      <form style={styles.form} onSubmit={handleSubmit}>
        <div>
          <label style={styles.label} htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label style={styles.label} htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
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
        Don't have an account? <Link href="/signup" style={styles.link}>Sign up</Link>
      </p>
    </main>
  );
}