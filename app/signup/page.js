"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import { createClient } from "../../lib/supabase/client";

export default function Signup() {
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
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.push("/");
    } else {
      setError("Account created — check your email to confirm before logging in.");
    }
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
      <h1 style={styles.heading}>Sign up</h1>

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
            minLength={6}
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p style={styles.footer}>
        Already have an account? <Link href="/login" style={styles.link}>Log in</Link>
      </p>
    </main>
  );
}