"use client";

import { useRef, useState } from "react";

const bars = [
  14, 22, 34, 42, 30, 18, 12, 28, 38, 46,
  36, 24, 18, 32, 44, 52, 40, 28, 20, 30,
  42, 48, 34, 24, 18, 28, 40, 50, 44, 32,
  22, 16, 26, 38, 46, 34, 24, 18, 30, 40,
  48, 36, 26, 18, 24, 34, 42, 30, 20, 14,
];

export default function RecordingCard({
  title,
  description,
  contributor,
  place,
  image,
  audio,
  duration,
  year,
}) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setPlaying(!playing);
  };

  const updateProgress = () => {
    const player = audioRef.current;
    if (!player || !player.duration) return;

    setProgress((player.currentTime / player.duration) * 100);
  };

  const styles = {
    card: {
      width: "100%",
      boxSizing: "border-box",
      padding: 24,
      backgroundColor: "rgba(28, 34, 44, 0.55)",
      backdropFilter: "blur(8px)",
      border: "1px solid #2E3644",
      borderRadius: 10,
      marginTop: 24,
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      ":hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
      },
    },
    cover: {
      width: "100%",
      height: "auto",
      objectFit: "cover",
      borderRadius: 8,
      marginBottom: 16,
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
    player: {
      display: "flex",
      alignItems: "center",
      gap: 24,
      marginTop: 24,
      padding: "8px 0",
    },
    button: {
      width: 48,
      height: 48,
      flexShrink: 0,
      borderRadius: "50%",
      border: "1px solid rgba(126, 211, 184, 0.25)",
      backgroundColor: "rgba(46, 230, 168, 0.08)",
      color: "#7ED3B8",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.15s ease, border-color 0.15s ease",
      ":hover": {
        backgroundColor: "rgba(46, 230, 168, 0.15)",
        borderColor: "#7ED3B8",
      },
    },
    waveform: {
      flex: 1,
      height: 48,
      display: "flex",
      alignItems: "center",
      gap: 5,
      cursor: "pointer",
    },
    bar: {
      flex: 1,
      minWidth: 2,
      maxWidth: 7,
      borderRadius: 3,
      backgroundColor: "#343C4B",
    },
    durationLabel: {
      fontFamily: "'Courier New', monospace",
      fontSize: 12,
      color: "#6A7280",
      marginLeft: "auto",
    },
    wrapper: {
      cursor: "pointer",
      ":focus": {
        outline: "2px solid #2EE6A8",
        outlineOffset: 2,
      },
    },
  };

  return (
    <article
      style={styles.card}
      onClick={() => {
        // Could navigate to player page; for now just toggle play
        togglePlay();
      }}
      role="button"
      tabIndex={0}
      aria-label={`${title}, ${contributor || "unknown contributor"}. ${description || ""}. Activate to play.`}
    >
      <img src={image} alt={title} style={styles.cover} />

      <h2 style={styles.title}>{title}</h2>

      <p style={styles.description}>
        {description || "No description currently available."}
      </p>

      <div style={styles.meta}>
        {contributor && (
          <p style={styles.metaItem}>
            <span style={styles.metaLabel}>CONTRIBUTOR</span>
            <span style={styles.metaValue}>{contributor}</span>
          </p>
        )}

        <p style={styles.metaItem}>
          <span style={styles.metaLabel}>PLACE</span>
          <span style={styles.metaValue}>{place || "Unknown"}</span>
        </p>
      </div>

      {duration && (
        <p style={styles.durationLabel}>
          {duration}
        </p>
      )}

      {year && (
        <p style={{ ...styles.metaItem, fontSize: 11, color: "#5A6373" }}>
          <span style={styles.metaLabel}>YEAR</span>
          <span style={styles.metaValue}>{year}</span>
        </p>
      )}

      <div style={styles.player}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          style={styles.button}
          aria-label={playing ? "Pause audio" : "Play audio"}
        >
          {playing ? "Ⅱ" : "▶"}
        </button>

        <div
          style={styles.waveform}
          role="slider"
          aria-label="Audio progress"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={Math.round(progress)}
        >
          {bars.map((height, index) => (
            <span
              key={index}
              style={{
                ...styles.bar,
                height,
                backgroundColor:
                  index / bars.length * 100 < progress ? "#2EE6A8" : "#343C4B",
              }}
            />
          ))}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audio}
        onTimeUpdate={updateProgress}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        style={{ display: "none" }}
      />
    </article>
  );
}