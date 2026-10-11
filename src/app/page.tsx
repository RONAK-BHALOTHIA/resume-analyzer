import Analyzer from "@/components/Analyzer";
import AuroraBackground from "@/components/AuroraBackground";

export default function Home() {
  return (
    <main className="relative isolate min-h-screen text-white px-6 py-16">
      <AuroraBackground />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold">Resume Analyzer</h1>
        <p className="text-slate-400 mt-2 mb-10">
          Upload your resume, paste a job description, and see how well they match.
        </p>
        <Analyzer />
      </div>
    </main>
  );
}