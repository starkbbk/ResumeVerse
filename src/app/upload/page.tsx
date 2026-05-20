import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UploadBox from "@/components/UploadBox";

export const metadata = {
  title: "Upload your resume — ResumeVerse",
  description: "Upload your resume PDF and ResumeVerse will generate a personalized 3D room.",
};

export default function UploadPage() {
  return (
    <main className="min-h-[calc(100vh-2rem)]">
      <Navbar />
      <section className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="chip-neon mb-4">Step 1 of 1</span>
          <h1 className="font-display text-3xl sm:text-5xl heading-gradient leading-tight">
            Upload your resume
          </h1>
          <p className="mt-3 text-white/70">
            We extract text on-device with pdf.js. Nothing leaves your browser.
          </p>
        </div>
        <UploadBox />
      </section>
      <Footer />
    </main>
  );
}
