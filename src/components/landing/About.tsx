import { SectionHeading } from "@/components/ui/SectionHeading";

export function About() {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">
      <div className="max-w-[68ch]">
        <SectionHeading index="04" label="ABOUT" />
        <div className="mt-7 space-y-4 text-[clamp(1rem,1.5vw,1.12rem)] leading-relaxed text-ink1">
          <p>
            I&apos;m an undergraduate at BITS Pilani, Goa, doing a dual degree in{" "}
            <strong className="font-500 text-ink0">Computer Science</strong> and{" "}
            <strong className="font-500 text-ink0">Economics</strong> — and that
            pairing is the whole point of how I work.
          </p>
          <p>
            CS builds the models; economics teaches distrust of them — uncertainty,
            incentives, and what a number actually means once you account for how it
            was produced. That&apos;s why my work keeps circling back to the same
            four ideas: <strong className="font-500 text-ink0">calibration</strong>{" "}
            (an uncertainty head that says when it doesn&apos;t know),{" "}
            <strong className="font-500 text-ink0">honest evaluation</strong> (catching
            my own data leak and reporting the worse, truer number),{" "}
            <strong className="font-500 text-ink0">incentives</strong> (an altruism
            score that reshapes a multi-agent equilibrium), and{" "}
            <strong className="font-500 text-ink0">reliability</strong> (a test suite
            that proves an agent can&apos;t hallucinate the thing it claims to have
            done).
          </p>
          <p>
            Right now I&apos;m a research intern at Temple, working on deep learning
            for wearable physiological signals — the domain behind the multimodal
            glucose work above.
          </p>
        </div>
      </div>
    </div>
  );
}
