"use client";

import { useRef, useState, useEffect } from "react";
import { useLanguage } from "./LanguageProvider";
import { useAudio } from "./AudioContext";
import uiText from "./uiText";
import "./entry-card.css";

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
  const { language } = useLanguage();
  const t = uiText[language];
  const { registerAudio, unregisterAudio, requestPlay, requestPause } = useAudio();

  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      registerAudio(audioRef.current.dataset.id, audioRef.current);
    }

    return () => {
      if (audioRef.current) {
        unregisterAudio(audioRef.current.dataset.id);
      }
    };
  }, [audioRef, registerAudio, unregisterAudio]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (playing) {
      requestPause(audioRef.current.dataset.id);
    } else {
      requestPlay(audioRef.current.dataset.id);
    }
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
    imageContainer: {
      width: "100%",
      aspectRatio: "16 / 9",
      overflow: "hidden",
      marginBottom: 16,
      flexShrink: 0,
    },
    cover: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: 8,
    },
    contentContainer: {
      flex: 1,
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
    },
    title: {
      fontSize: 22,
      fontWeight: 600,
      margin: "0 0 12px",
      color: "#E8EDF2",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },
    description: {
      fontSize: 16,
      lineHeight: 1.6,
      color: "#97A1B3",
      margin: "0 0 16px",
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
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
      gap: 16,
      marginTop: "auto",
      padding: "8px 0",
      width: "100%",
      minWidth: 0,
      boxSizing: "border-box",
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
      gap: 3,
      cursor: "pointer",
      minWidth: 0,
      overflow: "hidden",
    },
    bar: {
      flex: 1,
      minWidth: 1,
      maxWidth: 8,
      borderRadius: 4,
      backgroundColor: "#343C4B",
    },
  };

  return (
    <article className="archive-card">
      <div style={styles.imageContainer}>
        <img src={image} alt={title[language]} style={styles.cover} />
      </div>

      <div style={styles.contentContainer}>
        <h2 style={styles.title}>{title[language]}</h2>

        <p style={styles.description}>
          {description[language] || t.noDescription}
        </p>

        <div style={styles.meta}>
          <p style={styles.metaItem}>
            <span style={styles.metaLabel}>{t.contributor}</span>
            <span style={styles.metaValue}>{contributor[language]}</span>
          </p>

          <p style={styles.metaItem}>
            <span style={styles.metaLabel}>{t.place}</span>
            <span style={styles.metaValue}>{place[language] || "Unknown"}</span>
          </p>
        </div>
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
          data-id={audio}
          src={audio}
          onTimeUpdate={updateProgress}
          onEnded={() => {
            setPlaying(false);
            setProgress(0);
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setPlaying(false)}
          style={{ display: "none" }}
        />
      </div>
    </article>
  );
}