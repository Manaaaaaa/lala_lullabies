export default function EntryCard({ title, description, contributor, place, image, audio }) {
  const styles = {
    card: {
      padding: "24px",
      backgroundColor: "#1C222C",
      border: "1px solid #2E3644",
      borderRadius: 10,
      marginTop: 24,
    },
    title: {
      fontSize: 22,
      fontWeight: 600,
      margin: "0 0 12px",
      color: "#E8EDF2",
    },
    description: {
      fontSize: 16,
      lineHeight: 1.6,
      color: "#97A1B3",
      margin: "0 0 16px",
    },
    meta: {
      display: "flex",
      gap: 24,
      flexWrap: "wrap",
    },
    metaItem: {
      margin: 0,
    },
    metaLabel: {
      fontFamily: "'Courier New', monospace",
      fontSize: 11,
      color: "#5A6373",
      display: "block",
      margin: "0 0 4px",
    },
    metaValue: {
      fontSize: 14,
      color: "#E8EDF2",
    },
    cover: {
      width: "100%",
      height: "auto",
      objectFit: "cover",
      borderRadius: 8,
      marginBottom: 16,
    },
  };

  return (
    <article style={styles.card}>
      <img
        src={image}
        alt={title}
        style={styles.cover}
      />
      <h2 style={styles.title}>{title}</h2>
      <p style={styles.description}>
        {description || "No description currently available."}
      </p>
      <div style={styles.meta}>
        <p style={styles.metaItem}>
          <span style={styles.metaLabel}>CONTRIBUTOR</span>
          <span style={styles.metaValue}>{contributor}</span>
        </p>
        <p style={styles.metaItem}>
          <span style={styles.metaLabel}>PLACE</span>
          <span style={styles.metaValue}>{place}</span>
        </p>
      </div>
      <audio controls src={audio} />
    </article>
  );
}