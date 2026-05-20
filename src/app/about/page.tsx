import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About — ResumeVerse",
};

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
        <span className="chip-neon mb-4">About</span>
        <h1 className="font-display text-3xl sm:text-5xl heading-gradient leading-tight">
          A resume should feel like stepping into someone's head.
        </h1>
        <div className="prose prose-invert mt-6 text-white/80 leading-relaxed space-y-4">
          <p>
            Resumes are usually a flat list of bullet points. ResumeVerse turns
            them into an explorable 3D room — your skills become a hologram, your
            projects become workstations, your achievements glow on a trophy
            shelf.
          </p>
          <p>
            Everything happens in your browser. The PDF is parsed locally with
            pdf.js. The 3D experience is rendered with React Three Fiber. There
            is no upload — your data never leaves your device.
          </p>
          <p>
            Built with Next.js 14, React 18, TypeScript, Tailwind CSS, Three.js,
            React Three Fiber, Drei, Framer Motion and pdf.js.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
