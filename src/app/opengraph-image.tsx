import { ImageResponse } from "next/og";

export const alt = "MindForge: AI tutors that turn every session into long-term memory";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 88, fontWeight: 700 }}>MindForge</div>
        <div style={{ fontSize: 40, marginTop: 24, opacity: 0.9 }}>AI tutors that turn every session into long-term memory</div>
        <div style={{ fontSize: 28, marginTop: 48, opacity: 0.7 }}>Streaming voice tutors · Cited answers from your notes · FSRS spaced repetition</div>
      </div>
    ),
    size,
  );
}
