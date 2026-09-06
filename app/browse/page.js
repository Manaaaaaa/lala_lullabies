import collection from "../../collection.config.js";
import entries from "../../data/entries.js";
import SearchFilter from "../../components/SearchFilter";
import "../home.css";

export default function Browse() {
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
  <p
    style={{
      fontFamily: "'Courier New', monospace",
      color: "#2EE6A8",
      fontSize: 14,
      letterSpacing: 1,
    }}
  >
    KHMER LIVING ARCHIVE
  </p>

  <h1
    style={{
      fontSize: 48,
      fontWeight: 700,
      margin: "16px 0 12px",
      lineHeight: 1.1,
      color: "#E8EDF2",
    }}
  >
    {collection.name}
  </h1>

  <p
    style={{
      fontSize: 18,
      color: "#97A1B3",
      lineHeight: 1.6,
      margin: 0,
    }}
  >
    {collection.description}
  </p>

      <SearchFilter entries={entries} />
    </main>
  );
}
