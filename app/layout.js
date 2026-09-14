import collection from "../collection.config.js";
import NightSky from "../components/NightSky";
import LanguageProvider from "../components/LanguageProvider";
import AudioProvider from "../components/AudioContext";

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        style={{
          margin: 0,
          backgroundColor: "#060818",
          color: "#E8EDF2",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          minHeight: "100vh",
        }}
      >
        <NightSky />
        <LanguageProvider>
          <AudioProvider>
            {children}
          </AudioProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}