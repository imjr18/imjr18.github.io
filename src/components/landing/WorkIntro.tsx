import { SectionHeading } from "@/components/ui/SectionHeading";

export function WorkIntro() {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">
      <div className="max-w-[52ch]">
        <SectionHeading index="02" label="SELECTED WORK" />
        <p className="mt-6 font-display text-[clamp(1.5rem,3.4vw,2.4rem)] font-500 leading-[1.15] tracking-[-0.015em] text-ink0">
          Four projects, one throughline: build the model, then distrust it
          honestly.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-ink1">
          Biomedical deep learning, multi-agent RL, and agentic AI — each with a
          rigor hook, each with a deep-dive.
        </p>
      </div>
    </div>
  );
}
