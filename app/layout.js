import collection from "../collection.config.js";
import NightSky from "../components/NightSky";
import LanguageProvider from "../components/LanguageProvider";
import AudioProvider from "../components/AudioContext";
import Header from "../components/Header";

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
          padding: 0,
          backgroundColor: "#060818",
          color: "#E8EDF2",
          fontFamily:
            "'Kantumruy Pro', 'Siemreap', 'Leelawadee UI', 'Khmer UI', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <NightSky />
        <LanguageProvider>
          <AudioProvider>
            {/* Header stays globally centered at top */}
            <Header />
            <div style={{ width: "100%", flex: 1 }}>
              {children}
            </div>
          </AudioProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}