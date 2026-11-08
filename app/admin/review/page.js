"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../../components/LanguageProvider";
import uiText from "../../../components/uiText";
import { createClient } from "../../../lib/supabase/client";
import AdminReviewRow from "../../../components/AdminReviewRow";
import AdminEditReviewRow from "../../../components/AdminEditReviewRow";
import "../../home.css";

export default function AdminReview() {
  const { language } = useLanguage();
  const t = uiText[language];
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [sortOrder, setSortOrder] = useState("oldest");
  const [sortFocus, setSortFocus] = useState(false);

  // Authenticate and check admin status
  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user ?? null;
      setUser(u);
      if (u) {
        const { data: row } = await supabase
          .from("admins").select("user_id").eq("user_id", u.id).maybeSingle();
        setIsAdmin(!!row);
      }
      setChecked(true);
    })();
  }, []);

  // Load pending entries and pending edit proposals
  useEffect(() => {
    if (!checked || !isAdmin) return;
    let active = true;
    setLoading(true);
    setLoadError(false);
    const supabase = createClient();

    Promise.all([
      // 1. New submissions (status = pending)
      supabase.from("entries").select("*").eq("status", "pending"),
      // 2. Proposed edits joined with their original entries
      supabase.from("pending_entry_edits").select("*, entries!entry_id(*)"),
    ]).then(async ([pendingRes, editsRes]) => {
      if (!active) return;

      if (pendingRes.error && editsRes.error) {
        setLoadError(true);
        setLoading(false);
        return;
      }

      const pending = pendingRes.data || [];
      // Map each pending edit into a flattened row with the original entry data
      // plus the pending values, so AdminEditReviewRow gets all fields it needs.
      const editRows = (editsRes.data || []).map((pe) => {
        const orig = pe.entries || {};
        return {
          // Spread the original entry values (title, description, etc.)
          ...orig,
          // Override with the proposed values under the pending_ prefix
          pending_title: pe.title,
          pending_description: pe.description,
          pending_contributor: pe.contributor,
          pending_place: pe.place,
          pending_submitted_at: pe.created_at,
          pending_edit_id: pe.id,
        };
      });

      setEntries([...pending, ...editRows]);
      setLoading(false);
    });
    return () => { active = false; };
  }, [checked, isAdmin]);

  // Client-side stable sort. Missing created_at is treated as the oldest.
  const sortedEntries = useMemo(() => {
    const toTime = (s) => {
      if (!s) return -Infinity;
      const t = new Date(s).getTime();
      return Number.isNaN(t) ? -Infinity : t;
    };
    const list = [...entries];
    list.sort((a, b) => {
      const aTime = toTime(a.created_at);
      const bTime = toTime(b.created_at);
      if (sortOrder === "oldest") return aTime - bTime;
      return bTime - aTime;
    });
    return list;
  }, [entries, sortOrder]);

  const handleReview = async (entry, newStatus) => {
    if (busy) return;
    setBusy(true);
    setNotice(null);
    const supabase = createClient();

    try {
      const { data, error } = await supabase.rpc("admin_review_entry", {
        p_entry_id: entry.id,
        p_new_status: newStatus,
      });

      if (error) throw error;
      if (!data.ok) throw new Error(data.error);

      // Remove the reviewed entry from the local list
      setEntries((prev) => prev.filter((e) => e.id !== entry.id));
      setNotice({ type: "success", text: t.reviewSuccess(newStatus) });
    } catch (err) {
      console.error("Review error:", err);
      setNotice({ type: "error", text: err.message || t.reviewFailed });
    } finally {
      setBusy(false);
    }
  };

  const handleApproveEdit = async (entry) => {
    if (busy) return;
    setBusy(true);
    setNotice(null);
    const supabase = createClient();
    try {
      const { data, error } = await supabase.rpc("admin_approve_edit", {
        p_edit_id: entry.pending_edit_id,
      });
      if (error) throw error;
      if (!data.ok) throw new Error(data.error || "Failed to approve edit");
      setEntries((prev) => prev.filter((e) => e.id !== entry.id));
      setNotice({ type: "success", text: t.editApproved || "Edit approved and published." });
    } catch (err) {
      setNotice({ type: "error", text: err.message || t.reviewFailed });
    } finally {
      setBusy(false);
    }
  };

  const handleRejectEdit = async (entry) => {
    if (busy) return;
    setBusy(true);
    setNotice(null);
    const supabase = createClient();
    try {
      const { data, error } = await supabase.rpc("admin_reject_edit", {
        p_edit_id: entry.pending_edit_id,
      });
      if (error) throw error;
      if (!data.ok) throw new Error(data.error || "Failed to reject edit");
      setEntries((prev) => prev.filter((e) => e.id !== entry.id));
      setNotice({ type: "success", text: t.editRejected || "Edit rejected. Original preserved." });
    } catch (err) {
      setNotice({ type: "error", text: err.message || t.reviewFailed });
    } finally {
      setBusy(false);
    }
  };

  const noticeColors = { success: "#2EE6A8", error: "#E85D5D" };

  const styles = {
    wrap: { maxWidth: 900, margin: "0 auto" },
    kicker: {
      fontFamily: "'Courier New', monospace", color: "#2EE6A8",
      fontSize: 14, letterSpacing: 1, textAlign: "center", marginBottom: 16,
    },
    title: {
      fontSize: 36, fontWeight: 700, margin: "0 0 12px",
      lineHeight: 1.1, color: "#E8EDF2", textAlign: "center",
    },
    intro: {
      fontSize: 16, color: "#97A1B3", lineHeight: 1.6,
      margin: "0 0 32px", textAlign: "center",
    },
    list: { margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 16 },
    center: { textAlign: "center", color: "#97A1B3" },
    box: {
      padding: "32px 28px", textAlign: "center", borderRadius: 16,
      backgroundColor: "rgba(19,25,43,0.8)", border: "1px solid #222f4a",
    },
    boxTitle: { margin: "0 0 8px", fontSize: 18, color: "#E8EDF2" },
    boxText: { margin: "0 0 20px", color: "#97A1B3", fontSize: 15, lineHeight: 1.6 },
    sortBar: {
      display: "flex", alignItems: "center", justifyContent: "flex-end",
      gap: 10, flexWrap: "wrap", margin: "0 0 16px",
    },
    sortLabel: { fontSize: 14, color: "#E2E8F0" },
    sortSelect: {
      backgroundColor: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10,
      color: "#E8EDF2",
      // colorScheme tells the browser to render the native dropdown popup
      // (and its selection highlight) with the dark palette instead of the
      // OS light theme's white background / blue highlight.
      colorScheme: "dark",
      padding: "8px 12px",
      fontSize: 14,
      cursor: "pointer",
      fontFamily: "inherit",
    },
    sortOption: {
      backgroundColor: "#0F172A",
      color: "#E8EDF2",
    },
    sortFocusRing: { outline: "2px solid #2EE6A8", outlineOffset: 2 },
  };

  return (
    <main className="page-wrap" style={styles.wrap}>
      <p style={styles.kicker}>{t.kicker}</p>
      <h1 style={styles.title}>{t.adminReviewTitle}</h1>
      <p style={styles.intro}>{t.adminReviewIntro}</p>

      {notice && (
        <p
          role={notice.type === "error" ? "alert" : "status"}
          style={{ textAlign: "center", color: noticeColors[notice.type], margin: "0 0 16px" }}
        >
          {notice.text}
        </p>
      )}

      {!checked ? (
        <p style={styles.center}>{t.loading}</p>
      ) : !user ? (
        <div style={styles.box}>
          <p style={styles.boxText}>{t.loginRequired}</p>
          <Link href="/login" className="cta-button">{t.loginLink}</Link>
        </div>
      ) : !isAdmin ? (
        <div style={styles.box}>
          <p style={styles.boxTitle}>{t.adminBadge}</p>
          <p style={styles.boxText}>You do not have administrator access.</p>
          <Link href="/" className="cta-button">{t.homeLink}</Link>
        </div>
      ) : loadError ? (
        <p role="alert" style={{ ...styles.center, color: "#E85D5D" }}>{t.adminReviewError}</p>
      ) : loading ? (
        <p style={styles.center}>{t.adminReviewLoading}</p>
      ) : entries.length === 0 ? (
        <div style={styles.box}>
          <h2 style={styles.boxTitle}>{t.adminReviewEmpty}</h2>
          <Link href="/my-contributions" className="cta-button">{t.myContributionsNav}</Link>
        </div>
      ) : (
        <>
          <div style={styles.sortBar}>
            <label htmlFor="review-sort" style={styles.sortLabel}>
              {t.sortLabel}
            </label>
            <select
              id="review-sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              onFocus={() => setSortFocus(true)}
              onBlur={() => setSortFocus(false)}
              style={{ ...styles.sortSelect, ...(sortFocus ? styles.sortFocusRing : {}) }}
            >
              <option value="oldest" style={styles.sortOption}>{t.sortOldest}</option>
              <option value="newest" style={styles.sortOption}>{t.sortNewest}</option>
            </select>
          </div>
          <ul style={styles.list}>
            {sortedEntries.map((entry) => (
              entry.pending_edit_id ? (
                <AdminEditReviewRow
                  key={entry.pending_edit_id}
                  entry={entry}
                  language={language}
                  t={t}
                  onApprove={handleApproveEdit}
                  onReject={handleRejectEdit}
                  busy={busy}
                />
              ) : (
                <AdminReviewRow
                  key={entry.id}
                  entry={entry}
                  language={language}
                  t={t}
                  onPublish={(e) => handleReview(e, "published")}
                  onReturn={(e) => handleReview(e, "returned")}
                  busy={busy}
                />
              )
            ))}
          </ul>
        </>
      )}
    </main>
  );
}