"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";

const AudioContext = createContext(null);

export function useAudio() {
  return useContext(AudioContext);
}

export default function AudioProvider({ children }) {
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const audioElements = useRef(new Map());

  const registerAudio = useCallback((id, audioEl) => {
    audioElements.current.set(id, audioEl);
  }, []);

  const unregisterAudio = useCallback((id) => {
    audioElements.current.delete(id);
  }, []);

  const requestPlay = useCallback((id) => {
    const audioEl = audioElements.current.get(id);
    if (!audioEl) return;

    const currentId = currentPlayingId;

    // If a different card is currently playing, pause it
    if (currentId && currentId !== id) {
      const currentAudio = audioElements.current.get(currentId);
      if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
      }
    }

    if (currentId === id) {
      // Same card clicked — toggle off
      audioEl.pause();
      setCurrentPlayingId(null);
    } else {
      audioEl.currentTime = 0;
      audioEl.play().catch(() => {});
      setCurrentPlayingId(id);
    }
  }, [currentPlayingId]);

  const requestPause = useCallback((id) => {
    const audioEl = audioElements.current.get(id);
    if (audioEl && !audioEl.paused) {
      audioEl.pause();
    }
    setCurrentPlayingId((prev) => (prev === id ? null : prev));
  }, []);

  return (
    <AudioContext.Provider
      value={{ currentPlayingId, registerAudio, unregisterAudio, requestPlay, requestPause }}
    >
      {children}
    </AudioContext.Provider>
  );
}