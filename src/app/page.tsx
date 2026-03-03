import Hero from "./components/Hero";
import WorkflowBuilder from "./components/WorkflowBuilder";
import StatsBar from "./components/StatsBar";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import CTA from "./components/CTA";

export default function Home() {
  return (
    <main className="font-sans antialiased bg-[#020617] text-white">
      <Hero />
      <StatsBar />
      <WorkflowBuilder />
      <Features />
      <HowItWorks />
      <CTA />
    </main>
  );
}
