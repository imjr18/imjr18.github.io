import type { Project, ProjectSlug } from "@/lib/types";

export const projects: Project[] = [
  {
    slug: "glucose",
    index: "01",
    codename: "MULTIMODAL-GLUCOSE",
    title: "Multimodal Transformer for Glucose Prediction",
    domain: "BIOMEDICAL DEEP LEARNING",
    thesis:
      "Five physiological signals, one transformer — forecasting blood glucose with calibrated uncertainty on a 6 GB GPU.",
    abstract:
      "A transformer that fuses five physiological signals (HR, ECG-derived HRV, EMG, EEG, cerebral blood flow) to forecast blood glucose — and estimate it non-invasively — while reporting how much to trust each prediction. HR-centric cross-modal attention does the fusion, a heteroscedastic uncertainty head reports calibrated ±σ, and FOMAML meta-learning adapts per user. Sized deliberately (d_model = 64) to train and run on a single 6 GB GPU.",
    metrics: [
      { value: "21.81", label: "mg/dL RMSE", caveat: "single reported run", countTo: 21.81 },
      { value: "100%", label: "Clarke A+B", caveat: "one run, not clinical", countTo: 100 },
      { value: "5", label: "modalities", caveat: "HR · HRV · EMG · EEG · CBF", countTo: 5 },
      { value: "6 GB", label: "VRAM", caveat: "d_model = 64 by design" },
    ],
    tags: [
      "PyTorch",
      "Transformers",
      "Cross-modal attention",
      "FOMAML",
      "Heteroscedastic NLL",
      "Integrated gradients",
    ],
    repo: "https://github.com/imjr18/Multimodal-Transformer-for-Glucose-Prediction",
    cluster: { color: "#6bc7ff", position: [-3.4, 1.5, 0.4] },
    og: {
      title: "Multimodal Transformer for Glucose Prediction",
      description:
        "Five physiological signals, one transformer: forecasting blood glucose with calibrated uncertainty on a 6 GB GPU.",
    },
  },
  {
    slug: "lesion",
    index: "02",
    codename: "LESION-SEG",
    title: "CT Stroke Lesion Segmentation",
    domain: "MEDICAL IMAGING · RESEARCH RIGOR",
    thesis:
      "A segmentation model that got worse on purpose — catching my own data leak and reporting the honest number.",
    abstract:
      "A CT stroke-lesion segmentation project whose real subject is honest evaluation. An early model looked excellent — until an audit revealed same-patient slices split across train and validation. Moving to patient-level splits dropped held-out Dice from an inflated ~89% to an honest 43–53%, and the champion UNet++ with Focal Tversky loss reaches 51.7% Dice / 62.5% recall on a genuinely held-out patient set.",
    metrics: [
      { value: "51.7%", label: "held-out Dice", caveat: "patient-level split", countTo: 51.7 },
      { value: "62.5%", label: "recall", caveat: "champion model", countTo: 62.5 },
      { value: "43–53%", label: "honest Dice range", caveat: "post-leak-fix" },
      { value: "v1→v5", label: "iterations", caveat: "documented arc" },
    ],
    tags: [
      "PyTorch",
      "UNet++",
      "Focal Tversky",
      "Swin-UNet",
      "Patient-level CV",
      "Segmentation",
    ],
    repo: "https://github.com/imjr18/Lesion-Segmentation",
    cluster: { color: "#4af2a1", position: [3.2, 1.7, -0.5] },
    og: {
      title: "CT Stroke Lesion Segmentation",
      description:
        "The story of catching my own data leak and reporting the honest number instead of the flattering one.",
    },
  },
  {
    slug: "ridesharing",
    index: "03",
    codename: "ALTRUISTIC-FLEET",
    title: "Altruistic Ride-Sharing (Multi-Agent RL)",
    domain: "MULTI-AGENT RL · CS × ECONOMICS",
    thesis:
      "What if ride-sharing agents optimized for the network, not just the fare? An altruism score turns selfish drivers into a stable, fair system.",
    abstract:
      "A multi-agent RL fleet where an explicit altruism score, folded into reward shaping, turns individually selfish drivers into a stable, fair system. Trained with MADDPG (centralized critic, decentralized actors) under non-stationarity from stochastic population turnover, and A/B-tested against greedy profit-driven baselines. The project deliberately bridges the CS and Economics halves of the degree — reward shaping as mechanism design.",
    metrics: [
      { value: "↑", label: "utilization", caveat: "vs greedy baseline" },
      { value: "↓", label: "detours & CO₂", caveat: "directional, simulated" },
      { value: "MADDPG", label: "algorithm", caveat: "centralized critic" },
      { value: "stable", label: "long-run equilibria", caveat: "under volatile demand" },
    ],
    tags: [
      "MADDPG",
      "Multi-Agent RL",
      "Reward shaping",
      "Mechanism design",
      "Non-stationarity",
      "Simulation",
    ],
    repoNote: "Code available on request",
    cluster: { color: "#ffb454", position: [-3.0, -1.8, 0.6] },
    og: {
      title: "Altruistic Ride-Sharing (Multi-Agent RL)",
      description:
        "A multi-agent RL fleet where an altruism score turns selfish drivers into a stable, fair system.",
    },
  },
  {
    slug: "goodfoods",
    index: "04",
    codename: "GOODFOODS-AI",
    title: "GoodFoodsAI",
    domain: "AGENTIC AI · FULL-STACK",
    thesis:
      "A conversational reservation agent that actually completes the booking — hand-written orchestration, MCP-style tools, and a reliability suite to prove it.",
    abstract:
      "A full-stack conversational reservation agent that completes real bookings rather than just chatting about them. A hand-written orchestration loop (intent → tool selection → execution → state → stream) drives deterministic MCP-style tools over a SQLite + FAISS backend, with token streaming from a Groq-hosted Llama 3.1 8B. An automated reliability/regression suite exists specifically to prove the agent doesn't hallucinate reservations.",
    metrics: [
      { value: "Next.js", label: "+ FastAPI", caveat: "full-stack" },
      { value: "MCP-style", label: "tool layer", caveat: "6 deterministic tools" },
      { value: "SQLite", label: "+ FAISS RAG", caveat: "local retrieval" },
      { value: "Groq", label: "llama-3.1-8b", caveat: "streaming" },
    ],
    tags: [
      "Next.js",
      "FastAPI",
      "Agent orchestration",
      "MCP-style tools",
      "FAISS",
      "Reliability suite",
    ],
    repo: "https://github.com/imjr18/GoodFoodsAI",
    cluster: { color: "#b98cff", position: [3.0, -1.6, -0.4] },
    og: {
      title: "GoodFoodsAI",
      description:
        "A conversational reservation agent that completes the booking — orchestration, MCP-style tools, RAG, and a reliability suite.",
    },
  },
];

export const projectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

export const projectSlugs: ProjectSlug[] = projects.map((p) => p.slug);
