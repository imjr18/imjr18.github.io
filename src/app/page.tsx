import { projects } from "@/data/projects";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { HeroPoster } from "@/components/landing/HeroPoster";
import { WorkIntro } from "@/components/landing/WorkIntro";
import { ProjectCard } from "@/components/landing/ProjectCard";
import { About } from "@/components/landing/About";
import { Timeline } from "@/components/experience/Timeline";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";
import { CinematicClient } from "@/components/scroll/CinematicClient";

export default function Home() {
  return (
    <>
      <Nav />

      {/* WebGL layer + scroll director — mount only when the tier probe opted in.
          Everything below renders and reads perfectly without them. */}
      <CinematicClient />

      {/* Always-on stage label: guarantees there's never a stretch of scroll
          with nothing legible on screen, even mid-transition between panels. */}
      <div id="cine-ticker" className="cine-ticker" aria-hidden>
        <span id="cine-ticker-index" className="cine-ticker-index">01/05</span>
        <span id="cine-ticker-title" className="cine-ticker-title">SIGNAL</span>
        <span id="cine-ticker-blurb" className="cine-ticker-blurb">
          biosignal waveform — ECG · EEG
        </span>
      </div>

      <main id="main">
        <div id="cine">
          <div className="cine-stage">
            {/* Hero */}
            <section
              id="panel-hero"
              className="cine-panel flex min-h-[90vh] items-center py-24"
              data-panel="hero"
            >
              <HeroPoster />
              <Hero />
            </section>

            {/* Selected work lead-in */}
            <section
              id="work"
              className="cine-panel flex min-h-[70vh] items-center py-20"
              data-panel="work"
            >
              <WorkIntro />
            </section>

            {/* Project cards — grid in fallback, latent-cluster rail in cinematic */}
            <div className="work-cards">
              {projects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>

            {/* About */}
            <section
              id="about"
              className="cine-panel flex min-h-[70vh] items-center py-20"
              data-panel="about"
            >
              <About />
            </section>
          </div>
        </div>

        {/* Post-cinematic: normal vertical scroll */}
        <Timeline />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
