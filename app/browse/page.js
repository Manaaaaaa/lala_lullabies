import collection from "../../collection.config.js";
import EntryCard from "../../components/EntryCard";
import "../home.css";

const allEntries = [
  {
    title: "បំពេរកូន",
    description: "នេះជាចម្រៀងដែលប្រជាជនខ្មែរ បានច្រៀងឲ្យកូនៗរបស់ពួកគេគេងលក់។",
    contributor: "ថោង អមរា",
    place: "តាកែវ",
    image: "/images/lullaby-01.jpg",
    audio: "/audio/lullaby-01.ogg",
  },
  {
    title: "មាន់រងាវ",
    description: "នេះជាចម្រៀងដែលលោកយាយបាន​ច្រៀងឲ្យក្មេងៗគេងលក់ព្រោះមានសំលេងរន្តំចិត្ត។",
    contributor: "លោកយាយ អ៊ាង",
    place: "តាកែវ",
    image: "/images/lullaby-02.jpg",
    audio: "/audio/lullaby-02.mp3",
  },
  {
    title: "ពេលមេឃស្រទុំ",
    description: "ជាបទដែលមានអត្ថន័យក្រៀមក្រោះ បង្កប់ដោយមនោសញ្ចេតនាជ្រាលជ្រៅ ដែលពោរពេញដោយការស្រណោះស្រទន់",
    contributor: "គន្ធា",
    place: "Takeo",
    image: "/images/lullaby-03.jpg",
    audio: "/audio/lullaby-03.mp3",
  },
  {
    title: "តាក់ទីងណឹងៗ",
    description: "និយាយពីបងស្រីជាច្រើនបានច្រៀ​​ងដើម្បីបំពេរ​ឲ្យប្អូនៗរបស់គេគេងលក់។",
    contributor: "ចន្នី",
    place: "តាកែវ",
    image: "/images/lullaby-04.jpg",
    audio: "/audio/lullaby-04.mp3",
  },
  {
    title: "ស្រណោះម្ដាយថ្នម",
    description: "ជាបទបង្កប់ដោយមនោសញ្ចេតនាពីម្តាយស្រឡាញ់មើលថែរកូនពីតូចដល់ពេញវ័យរៀបការ។",
    contributor: "ខាត់ សុឃីម",
    place: "Takeo",
    image: "/images/lullaby-05.jpg",
    audio: "/audio/lullaby-05.mp3",
  },
];

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

      <section className="card-grid" style={{ marginTop: 48 }}>
        {allEntries.map((entry, index) => (
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
    </main>
  );
}