import collection from "../collection.config.js";
import EntryCard from "../components/EntryCard";

const sampleEntries = [
  {
    title: "បំពេរកូន",
    description: "នេះជាចម្រៀងដែលប្រជាជនខ្មែរ បានច្រៀងឲ្យកូនៗរបស់ពួកគេគេងលក់។",
    contributor: "ថោង អមរា",
    place: "ពោធិ៍សាត់",
    image: "/images/lullaby-01.jpg",
    audio: "/audio/lullaby-01.ogg"
  },
  {
    title: "មាន់រងាវ",
    description: "នេះជាចម្រៀងដែលលោកយាយបាន​ច្រៀងឲ្យក្មេងៗគេងលក់ព្រោះមានសំលេងរន្តំចិត្ត។",
    contributor: "លោកយាយ អ៊ាង",
    place: "តាកែវ",
    image: "/images/lullaby-02.jpg",
    audio: "/audio/lullaby-02.mp3"
  },
  {
    title: "Grandmother's Evening Melody",
    description: "An evening lullaby passed down through generations in a rural village near Battambang. Sung by grandmothers to their grandchildren during evening prayers.",
    contributor: "Sokha",
    place: "Battambang",
    image: "/images/lullaby-03.jpg",
    audio: "/audio/lullaby-03.mp3"
  },
  {
    title: "តាក់ទីងណឹងៗ",
    description: "និយាយពីបងស្រីច្រៀងឲ្យប្អូនៗគេងលក់។",
    contributor: "ចន្នី",
    place: "តាកែវ",
    image: "/images/lullaby-04.jpg",
    audio: "/audio/lullaby-04.mp3"
  },
  {
    title: "Waterside Lullaby",
    description: "A lullaby from families living along the Mekong River delta. Sung by waterside mothers to children before sleep, carrying the rhythm of water and wind.",
    contributor: "Srey Srey",
    place: "Kampong Cham",
    image: "/images/lullaby-05.jpg",
    audio: "/audio/lullaby-05.mp3"
  }
];

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "80px 24px",
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: "#2EE6A8",
    fontSize: 14,
    letterSpacing: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
    margin: "16px 0 12px",
    lineHeight: 1.1,
  },
  description: {
    fontSize: 18,
    color: "#97A1B3",
    lineHeight: 1.6,
    margin: 0,
  },
  card: {
    marginTop: 48,
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
  },
  cardLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#97A1B3",
    margin: 0,
  },
  cardValue: {
    fontSize: 16,
    margin: "6px 0 0",
  },
  count: {
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    color: "#2EE6A8",
    marginTop: 48,
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: "1px solid #2E3644",
    fontSize: 13,
    color: "#5A6373",
  },
  section: {
    display: "flex",
    flexWrap: "wrap",
    gap: 24,
    justifyContent: "center",
    marginTop: 48,
  },
};

export default function Home() {
  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>{collection.name}</h1>
      <p style={styles.description}>{collection.description}</p>

      <div style={styles.card}>
        <p style={styles.cardLabel}>CREATED BY</p>
        <p style={styles.cardValue}>{collection.creator}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.cardLabel}>SOURCE</p>
        <p style={styles.cardValue}>{collection.source}</p>
      </div>

      <p style={styles.count}>entries in the archive: {sampleEntries.length} (for now)</p>

      <section style={styles.section}>
        {sampleEntries.map((entry, index) => (
          <EntryCard
            key={index}
            title={entry.title}
            description={entry.description}
            contributor={entry.contributor}
            place={entry.place}
            image={entry.image}
            audio={entry.audio}
          />
        ))}
      </section>

      <footer style={styles.footer}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026. This archive is under construction all semester. Come back in
        December.
      </footer>
    </main>
  );
}
