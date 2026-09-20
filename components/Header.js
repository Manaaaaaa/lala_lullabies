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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2EE6A8" strokeWidth="1.5">
    <circle cx="12" cy="12" r="2.2" fill="#2EE6A8" stroke="none" />
    <ellipse cx="12" cy="6" rx="2.4" ry="4" />
    <ellipse cx="12" cy="18" rx="2.4" ry="4" />
    <ellipse cx="6" cy="12" rx="4" ry="2.4" />
    <ellipse cx="18" cy="12" rx="4" ry="2.4" />
  </svg>
);

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#97A1B3" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#97A1B3" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
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
    if (query.trim()) {
      router.push(`/browse?q=${encodeURIComponent(query)}`);
    }
  };

  const styles = {
    wrap: {
      position: "sticky",
      top: 16,
      zIndex: 50,
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: 32,
      padding: "0 16px",
    },
    pill: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      width: "100%",
      maxWidth: 1000,
      margin: "0 auto",
      padding: "8px 16px",
      borderRadius: 999,
      backgroundColor: "rgba(10, 14, 28, 0.85)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
    },
    logoGroup: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexShrink: 0,
      textDecoration: "none",
    },
    title: {
      fontFamily: "var(--font-serif, serif)",
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: "0.8px",
      textTransform: "uppercase",
      color: "#E8EDF2",
      textDecoration: "none",
      whiteSpace: "nowrap",
    },
    navGroup: {
      display: "flex",
      alignItems: "center",
      gap: 20,
    },
    link: {
      color: "#97A1B3",
      textDecoration: "none",
      fontSize: 14,
      fontWeight: 500,
      whiteSpace: "nowrap",
      transition: "color 0.2s ease",
    },
    activeLink: {
      color: "#2EE6A8",
      textDecoration: "none",
      fontSize: 14,
      fontWeight: 600,
      whiteSpace: "nowrap",
    },
    searchWrap: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      minWidth: 160,
      maxWidth: 220,
      padding: "6px 12px",
      borderRadius: 999,
      border: "1px solid rgba(255, 255, 255, 0.08)",
      backgroundColor: "rgba(255, 255, 255, 0.03)",
    },
    searchInput: {
      width: "100%",
      border: "none",
      outline: "none",
      background: "transparent",
      color: "#E8EDF2",
      fontSize: 13,
    },
    rightControls: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexShrink: 0,
    },
    langButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      height: 34,
      padding: "0 12px",
      borderRadius: 999,
      fontSize: 13,
      lineHeight: "1.2",
      color: "#97A1B3",
      backgroundColor: "rgba(255, 255, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      cursor: "pointer",
      whiteSpace: "nowrap",
    },
    langActive: {
      fontWeight: 600,
      color: "#2EE6A8",
    },
    authLink: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      height: 34,
      padding: "0 14px",
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 500,
      color: "#E8EDF2",
      textDecoration: "none",
      whiteSpace: "nowrap",
      transition: "all 0.2s ease",
    },
    primaryAuthBtn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      height: 34,
      padding: "0 16px",
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 600,
      color: "#0A0E1C",
      backgroundColor: "#2EE6A8",
      border: "none",
      textDecoration: "none",
      cursor: "pointer",
      whiteSpace: "nowrap",
    },
  };

  return (
    <div style={styles.wrap}>
      <header style={styles.pill}>
        {/* Brand / Logo */}
        <Link href="/" style={styles.logoGroup}>
          <FlowerIcon />
          <span style={styles.title}>{collection.name}</span>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links" style={styles.navGroup}>
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

        {/* Compact Search Bar */}
        {pathname !== "/browse" && (
          <form
            className="header-search"
            style={styles.searchWrap}
            onSubmit={handleSearchSubmit}
          >
            <SearchIcon />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              style={styles.searchInput}
              aria-label={t.searchPlaceholder}
            />
          </form>
        )}

        {/* Language & Auth Actions */}
        <div style={styles.rightControls}>
          <button
            onClick={toggleLanguage}
            style={styles.langButton}
            aria-label="Switch language"
          >
            <GlobeIcon />
            <span style={language === "en" ? styles.langActive : {}}>EN</span>
            <span style={{ opacity: 0.4 }}>/</span>
            <span style={language === "km" ? styles.langActive : {}}>ខ្មែរ</span>
          </button>

          {user ? (
            <button
              style={styles.langButton}
              onClick={() => createClient().auth.signOut()}
            >
              Log out
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Link href="/login" style={styles.authLink}>
                Log in
              </Link>
              <Link href="/signup" style={styles.primaryAuthBtn}>
                Sign up
              </Link>
            </div>
          )}

          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-panel${menuOpen ? " open" : ""}`}>
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
          <button
            style={styles.langButton}
            onClick={() => {
              createClient().auth.signOut();
              setMenuOpen(false);
            }}
          >
            Log out
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            <Link href="/login" style={styles.authLink} onClick={() => setMenuOpen(false)}>
              Log in
            </Link>
            <Link href="/signup" style={styles.primaryAuthBtn} onClick={() => setMenuOpen(false)}>
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}