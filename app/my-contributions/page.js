"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "../../components/LanguageProvider";
import uiText from "../../components/uiText";
import { createClient } from "../../lib/supabase/client";
import ContributionRow from "../../components/ContributionRow";
import ConfirmDeleteDialog from "../../components/ConfirmDeleteDialog";
import "../home.css";

const FILE_FIELDS = [
  { bucket: "image", column: "image_url" },
  { bucket: "audio", column: "audio_url" },
];

function storagePath(url, bucket) {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const i = url ? url.indexOf(marker) : -1;
  if (i === -1) return null;
  return decodeURIComponent(url.slice(i + marker.length).split("?")[0]);
}

// Best-effort cleanup AFTER the row is gone. Skips files another entry still uses.
async function removeFiles(supabase, entry) {
  let ok = true;
  for (const { bucket, column } of FILE_FIELDS) {
    const url = entry[column];
    const path = storagePath(url, bucket);
    if (!path) continue;
    const { count, error: countErr } = await supabase
      .from("entries").select("id", { count: "exact", head: true }).eq(column, url);
    if (countErr) { ok = false; continue; }
    if (count > 0) continue;
    const { data, error } = await supabase.storage.from(bucket).remove([path]);
    if (error || !data || data.length === 0) ok = false;
  }
  return ok;
}

export default function MyContributions() {
  const { language } = useLanguage();
  const t = uiText[language];
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [target, setTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState(null);

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

  useEffect(() => {
    if (!checked || !user) return;
    let active = true;
    setLoading(true);
    setLoadError(false);
    const supabase = createClient();
    let query = supabase.from("entries").select("*").order("created_at", { ascending: false });
    if (!(isAdmin && showAll)) query = query.eq("owner", user.id);
    query.then(({ data, error }) => {
      if (!active) return;
      if (error) setLoadError(true);
      else setEntries(data || []);
      setLoading(false);
    });
    return () => { active = false; };
  }, [checked, user, isAdmin, showAll]);

  const confirmDelete = async () => {
    if (!target || deleting) return;
    setDeleting(true);
    setNotice(null);
    const supabase = createClient();

    // .select() matters: RLS-blocked deletes return no error, just zero rows.
    const { data, error } = await supabase
      .from("entries").delete().eq("id", target.id).select("id");

    if (error || !data || data.length === 0) {
      setNotice({ type: "error", text: t.deleteFailed });
      setDeleting(false);
      setTarget(null);
      return;
    }

    setEntries((prev) => prev.filter((e) => e.id !== target.id));
    const filesOk = await removeFiles(supabase, target);
    setNotice(filesOk
      ? { type: "success", text: t.deleteSuccess }
      : { type: "warning", text: t.deleteFilesWarning });
    setDeleting(false);
    setTarget(null);
  };

  const noticeColors = { success: "#2EE6A8", warning: "#E8B84A", error: "#E85D5D" };

  const styles = {
    wrap: { maxWidth: 800, margin: "0 auto" },
    kicker: { fontFamily: "'Courier New', monospace", color: "#2EE6A8", fontSize: 14, letterSpacing: 1, textAlign: "center", marginBottom: 16 },
    title: { fontSize: 40, fontWeight: 700, margin: "0 0 16px", lineHeight: 1.1, color: "#E8EDF2", textAlign: "center" },
    intro: { fontSize: 17, color: "#97A1B3", lineHeight: 1.6, margin: "0 0 28px", textAlign: "center" },
    bar: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, margin: "0 0 20px", color: "#97A1B3", fontSize: 14 },
    toggle: { padding: "6px 14px", borderRadius: 999, cursor: "pointer", fontSize: 13, color: "#2EE6A8", backgroundColor: "rgba(46,230,168,0.08)", border: "1px solid rgba(46,230,168,0.4)" },
    list: { margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 },
    box: { padding: "32px 28px", textAlign: "center", borderRadius: 16, backgroundColor: "rgba(19,25,43,0.8)", border: "1px solid #222f4a" },
    boxTitle: { margin: "0 0 8px", fontSize: 18, color: "#E8EDF2" },
    boxText: { margin: "0 0 20px", color: "#97A1B3", fontSize: 15, lineHeight: 1.6 },
    center: { textAlign: "center", color: "#97A1B3" },
  };

  return (
    <main className="page-wrap" style={styles.wrap}>
      <p style={styles.kicker}>{t.kicker}</p>
      <h1 style={styles.title}>{t.myContributionsTitle}</h1>
      <p style={styles.intro}>{t.myContributionsIntro}</p>

      {notice && (
        <p role={notice.type === "error" ? "alert" : "status"}
           style={{ textAlign: "center", color: noticeColors[notice.type], margin: "0 0 16px" }}>
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
      ) : loadError ? (
        <p role="alert" style={{ ...styles.center, color: "#E85D5D" }}>{t.loadFailed}</p>
      ) : loading ? (
        <p style={styles.center}>{t.loading}</p>
      ) : (
        <>
          <div style={styles.bar}>
            <span>
              {t.contributionsCount(entries.length)}
              {isAdmin && ` · ${t.adminBadge}`}
            </span>
            {isAdmin && (
              <button style={styles.toggle} onClick={() => setShowAll((v) => !v)}>
                {showAll ? t.adminViewMine : t.adminViewAll}
              </button>
            )}
          </div>

          {entries.length === 0 ? (
            <div style={styles.box}>
              <h2 style={styles.boxTitle}>{t.contributionsEmptyTitle}</h2>
              <p style={styles.boxText}>{t.contributionsEmptyBody}</p>
              <Link href="/submit" className="cta-button">{t.contributeCta}</Link>
            </div>
          ) : (
            <ul style={styles.list}>
              {entries.map((entry) => (
                <ContributionRow
                  key={entry.id}
                  entry={entry}
                  language={language}
                  t={t}
                  showOwner={isAdmin && showAll}
                  onDelete={setTarget}
                />
              ))}
            </ul>
          )}
        </>
      )}

      {target && (
        <ConfirmDeleteDialog
          title={target.title?.[language] || target.title?.en || ""}
          t={t}
          deleting={deleting}
          onCancel={() => setTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </main>
  );
}