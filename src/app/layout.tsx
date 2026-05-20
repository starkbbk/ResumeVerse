import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResumeVerse — Your resume as an interactive 3D room",
  description:
    "Upload your resume and ResumeVerse turns it into a personalized, explorable 3D room. Skills, projects, achievements and experience come alive.",
  keywords: [
    "resume",
    "3D resume",
    "interactive portfolio",
    "ResumeVerse",
    "react three fiber",
  ],
  openGraph: {
    title: "ResumeVerse",
    description: "Turn your resume into an interactive 3D room.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#06070d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
