"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "./LanguageProvider";
import uiText from "./uiText";
import collection from "../collection.config.js";
import "./header.css";
import { createClient } from "../lib/supabase/client";

const FlowerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2EE6A8" strokeWidth="1.4">
    <circle cx="12" cy="12" r="2.2" fill="#2EE6A8" stroke="none" />
    <ellipse cx="12" cy="6" rx="2.4" ry="4" />
    <ellipse cx="12" cy="18" rx="2.4" ry="4" />
    <ellipse cx="6" cy="12" rx="4" ry="2.4" />
    <ellipse cx="18" cy="12" rx="4" ry="2.4" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#97A1B3" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#97A1B3" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
  </svg>
);

const PersonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2EE6A8" strokeWidth="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

export default function Header() {
  const { language, toggleLanguage } = useLanguage();
  const t = uiText[language];
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const navItems = [
    { href: "/", label: t.homeLink },
    { href: "/browse", label: t.browseLink },
    { href: "/about", label: t.aboutLink },
  ];

  const [query, setQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(`/browse?q=${encodeURIComponent(query)}`);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const styles = {
    wrap: { position: "sticky", top: 12, zIndex: 40, marginBottom: 24 },
    pill: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      maxWidth: 1100,
      margin: "0 auto",
      padding: "10px 20px",
      borderRadius: 999,
      backgroundColor: "rgba(10, 14, 28, 0.55)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(46, 230, 168, 0.15)",
    },
    logoGroup: { display: "flex", alignItems: "center", gap: 10, flexShrink: 0 },
    title: {
      fontFamily: "Georgia, 'Times New Roman', serif",
      fontSize: 16,
      fontWeight: 600,
      letterSpacing: 1,
      textTransform: "uppercase",
      color: "#E8EDF2",
      textDecoration: "none",
      whiteSpace: "nowrap",
    },
    link: { color: "#97A1B3", textDecoration: "none", fontSize: 15, paddingBottom: 4 },
    activeLink: {
      color: "#2EE6A8",
      textDecoration: "none",
      fontSize: 15,
      paddingBottom: 4,
      borderBottom: "2px solid #2EE6A8",
    },
    searchWrap: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flex: 1,
      minWidth: 0,
      padding: "6px 14px",
      borderRadius: 999,
      border: "1px solid #2E3644",
      backgroundColor: "rgba(255,255,255,0.03)",
    },
    searchInput: {
      flex: 1,
      minWidth: 0,
      border: "none",
      outline: "none",
      background: "transparent",
      color: "#E8EDF2",
      fontSize: 14,
    },
    langButton: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 14px",
      borderRadius: 999,
      fontSize: 14,
      color: "#E8EDF2",
      backgroundColor: "transparent",
      border: "1px solid #2E3644",
      cursor: "pointer",
      whiteSpace: "nowrap",
    },
    active: { fontWeight: 700, color: "#2EE6A8" },
    signInButton: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 16px",
      borderRadius: 999,
      fontSize: 14,
      color: "#2EE6A8",
      backgroundColor: "rgba(46, 230, 168, 0.08)",
      border: "1px solid rgba(46, 230, 168, 0.4)",
      cursor: "pointer",
      whiteSpace: "nowrap",
    },
    hamburger: {
      width: 36,
      height: 36,
      borderRadius: "50%",
      border: "1px solid #2E3644",
      backgroundColor: "transparent",
      color: "#E8EDF2",
      cursor: "pointer",
      flexShrink: 0,
    },
    mobilePanel: {
      marginTop: 8,
      maxWidth: 1100,
      margin: "8px auto 0",
      padding: "16px 20px",
      borderRadius: 20,
      backgroundColor: "rgba(10, 14, 28, 0.7)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(46, 230, 168, 0.15)",
      flexDirection: "column",
      gap: 12,
    },
  };

  return (
    <div style={styles.wrap}>
      <header style={styles.pill}>
        <Link href="/" style={styles.logoGroup}>
          <FlowerIcon />
          <span style={styles.title}>{collection.name}</span>
        </Link>

        <nav className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={pathname === item.href ? styles.activeLink : styles.link}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form
          className="header-search"
          style={{ ...styles.searchWrap, ...(pathname === "/browse" ? { display: "none" } : {}) }}
          onSubmit={handleSearchSubmit}
        >
          <SearchIcon />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={t.searchPlaceholder}
            style={styles.searchInput}
            aria-label={t.searchPlaceholder}
          />
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <button onClick={toggleLanguage} style={styles.langButton} aria-label="Switch language">
            <GlobeIcon />
            <span style={language === "en" ? styles.active : {}}>EN</span>
            <span>/</span>
            <span style={language === "km" ? styles.active : {}}>ខ្មែរ</span>
          </button>

          {user ? (
            <>
              <span style={{ ...styles.signInButton, cursor: "default", backgroundColor: "transparent", border: "none", color: "#E8EDF2" }}>
                {user.email}
              </span>
              <button
                className="sign-in-btn"
                style={styles.signInButton}
                onClick={() => {
                  createClient().auth.signOut();
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <Link href="/login" className="sign-in-btn" style={styles.signInButton}>
                Log in
              </Link>
              <Link href="/signup" style={styles.signInButton}>
                Sign up
              </Link>
            </div>
          )}

          <button
            className="hamburger-btn"
            style={styles.hamburger}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            ☰
          </button>
        </div>
      </header>

      <div className={`mobile-panel${menuOpen ? " open" : ""}`} style={styles.mobilePanel}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={pathname === item.href ? styles.activeLink : styles.link}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        {user ? (
          <button style={styles.signInButton} onClick={() => {
            createClient().auth.signOut();
            setMenuOpen(false);
          }}>
            Log out
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
            <Link href="/login" className="sign-in-btn" style={styles.signInButton} onClick={() => setMenuOpen(false)}>
              Log in
            </Link>
            <Link href="/signup" style={styles.signInButton} onClick={() => setMenuOpen(false)}>
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}