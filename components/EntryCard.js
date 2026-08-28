"use client";

import { useRef, useState } from "react";

const bars = [
  14, 22, 34, 42, 30, 18, 12, 28, 38, 46,
  36, 24, 18, 32, 44, 52, 40, 28, 20, 30,
  42, 48, 34, 24, 18, 28, 40, 50, 44, 32,
  22, 16, 26, 38, 46, 34, 24, 18, 30, 40,
  48, 36, 26, 18, 24, 34, 42, 30, 20, 14,
];

export default function EntryCard({
  title,
  description,
  contributor,
  place,
  image,
  audio,
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

  const seek = (event) => {
    const player = audioRef.current;
    if (!player || !player.duration) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;

    player.currentTime = percent * player.duration;
    setProgress(percent * 100);
  };

  const styles = {
    card: {
      width: "100%",
      boxSizing: "border-box",
      padding: 24,
      backgroundColor: "#1C222C",
      border: "1px solid #2E3644",
      borderRadius: 10,
      marginTop: 24,
    },
    cover: {
      width: "100%",
      height: "5/4",
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
      width: 64,
      height: 64,
      flexShrink: 0,
      borderRadius: "50%",
      border: "1px solid rgba(126, 211, 184, 0.25)",
      backgroundColor: "rgba(46, 230, 168, 0.08)",
      color: "#7ED3B8",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 24,
    },
    waveform: {
      flex: 1,
      height: 64,
      display: "flex",
      alignItems: "center",
      gap: 5,
      cursor: "pointer",
    },
    bar: {
      flex: 1,
      minWidth: 3,
      maxWidth: 9,
      borderRadius: 5,
      backgroundColor: "#343C4B",
    },
  };

  return (
    <article style={styles.card}>
      <img src={image} alt={title} style={styles.cover} />

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

      <div style={styles.player}>
        <button
          type="button"
          onClick={togglePlay}
          style={styles.button}
          aria-label={playing ? "Pause audio" : "Play audio"}
        >
          {playing ? "Ⅱ" : "▶"}
        </button>

        <div
          style={styles.waveform}
          onClick={seek}
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
                  index / bars.length * 100 < progress
                    ? "#2EE6A8"
                    : "#343C4B",
              }}
            />
          ))}
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
      </div>
    </article>
  );
}