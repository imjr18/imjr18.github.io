import type { Project, ProjectSlug } from "@/lib/types";

export const projects: Project[] = [
  {
    slug: "glucose",
    index: "01",
    codename: "MULTIMODAL-GLUCOSE",
    title: "Multimodal Transformer for Glucose Prediction",
    domain: "BIOMEDICAL DEEP LEARNING",
    thesis:
      "Per-modality transformer encoders fused by HR-centric cross-modal attention, with a heteroscedastic head that emits calibrated aleatoric uncertainty on every glucose estimate.",
    abstract:
      "A multimodal transformer for non-invasive blood-glucose estimation and forecasting from five physiological channels (HR, ECG-derived HRV, EMG, EEG, cerebral blood flow). Each modality is encoded by an independent transformer stack; a heart-rate-conditioned cross-modal attention block (queries drawn from the HR stream) performs the fusion. A second output head parameterises per-sample log-variance and is trained under a heteroscedastic Gaussian negative-log-likelihood, so the model reports calibrated ±σ intervals rather than point estimates alone. First-order MAML (FOMAML) with a per-subject token supports few-shot personalisation, and attention rollout plus integrated gradients are used for attribution. The architecture is capacity-constrained by design (d_model = 64) to train and run within 6 GB of VRAM.",
    metrics: [
      { value: "21.81", label: "mg/dL RMSE", caveat: "single reported run", countTo: 21.81 },
      { value: "100%", label: "Clarke A+B", caveat: "one run, not a clinical benchmark", countTo: 100 },
      { value: "5", label: "modalities fused", caveat: "HR · HRV · EMG · EEG · CBF", countTo: 5 },
      { value: "6 GB", label: "VRAM budget", caveat: "d_model = 64 by design" },
    ],
    tags: [
      "PyTorch",
      "Transformer encoders",
      "Cross-modal attention",
      "Heteroscedastic NLL",
      "FOMAML",
      "Attention rollout",
      "Integrated gradients",
    ],
    repo: "https://github.com/imjr18/Multimodal-Transformer-for-Glucose-Prediction",
    cluster: { color: "#6bc7ff", position: [-3.4, 1.5, 0.4] },
    og: {
      title: "Multimodal Transformer for Glucose Prediction",
      description:
        "Cross-modal attention over five physiological channels with a heteroscedastic uncertainty head, trained within a 6 GB VRAM budget.",
    },
  },
  {
    slug: "lesion",
    index: "02",
    codename: "LESION-SEG",
    title: "CT Stroke Lesion Segmentation",
    domain: "MEDICAL IMAGING · EVALUATION RIGOR",
    thesis:
      "An end-to-end CT lesion-segmentation pipeline built around a forensic data audit — patient-level splits that trade an inflated score for a defensible one.",
    abstract:
      "A supervised stroke-lesion segmentation pipeline whose central contribution is evaluation integrity. A forensic pre-training audit infers array dimensionality and mask structure, verifies NPZ–DICOM alignment, enforces empty-mask negatives, and applies clinical CT windowing before any model is fit. The decisive finding was leakage: adjacent same-patient slices had been distributed across train and validation, so a slice-level split reported a flattering ~89% Dice that measured memorisation, not generalisation. Re-partitioning at the patient level collapsed held-out Dice to an honest 43–53%; the champion configuration reaches 51.7% Dice / 62.5% recall on a genuinely held-out patient cohort. Models are scored on Dice/IoU and sensitivity/precision, with qualitative mask overlays used to characterise failure modes and clinical plausibility.",
    metrics: [
      { value: "51.7%", label: "held-out Dice", caveat: "patient-level split", countTo: 51.7 },
      { value: "62.5%", label: "recall", caveat: "champion configuration", countTo: 62.5 },
      { value: "43–53%", label: "honest Dice range", caveat: "post-leakage-fix" },
      { value: "~89%", label: "leaked Dice", caveat: "slice-level split — discarded" },
    ],
    tags: [
      "PyTorch",
      "Patient-level CV",
      "NPZ–DICOM audit",
      "CT windowing",
      "Focal Tversky",
      "Dice / IoU",
      "Segmentation",
    ],
    repo: "https://github.com/imjr18/Lesion-Segmentation",
    cluster: { color: "#4af2a1", position: [3.2, 1.7, -0.5] },
    og: {
      title: "CT Stroke Lesion Segmentation",
      description:
        "A forensic data audit and patient-level splits — trading an inflated 89% Dice for a defensible 51.7%.",
    },
  },
  {
    slug: "ridesharing",
    index: "03",
    codename: "ALTRUISTIC-FLEET",
    title: "Altruistic Ride-Sharing — Multi-Agent RL",
    domain: "MULTI-AGENT RL · MECHANISM DESIGN",
    thesis:
      "A MADDPG fleet in which an altruism term folded into reward shaping stabilises learning under non-stationary population turnover and shifts the system equilibrium.",
    abstract:
      "A multi-objective ride-sharing framework trained with MADDPG (centralised critic, decentralised actors) to optimise fleet efficiency in high-demand urban settings. An explicit Altruism Score models driver–rider reciprocity and is folded into reward shaping to enforce fairness and stabilise learning under the non-stationarity induced by stochastic population turnover and participation — reframing reward design as mechanism design. Evaluated through A/B simulations against profit-driven greedy baselines, the altruistic policy yields higher fleet utilisation, lower detours and CO₂, and more stable long-run equilibria, with the widest margins under volatile demand. Results are directional and simulation-based rather than deployment metrics.",
    metrics: [
      { value: "MADDPG", label: "algorithm", caveat: "centralised critic, decentralised actors" },
      { value: "↑", label: "fleet utilisation", caveat: "vs greedy baseline (sim.)" },
      { value: "↓", label: "detours & CO₂", caveat: "directional, simulated" },
      { value: "stable", label: "long-run equilibria", caveat: "under volatile demand" },
    ],
    tags: [
      "MADDPG",
      "Multi-agent RL",
      "Reward shaping",
      "Mechanism design",
      "Non-stationarity",
      "A/B simulation",
    ],
    repoNote: "Code available on request",
    cluster: { color: "#ffb454", position: [-3.0, -1.8, 0.6] },
    og: {
      title: "Altruistic Ride-Sharing — Multi-Agent RL",
      description:
        "MADDPG with an altruism-shaped reward: stabilising non-stationary learning and shifting the fleet equilibrium toward fairness.",
    },
  },
  {
    slug: "goodfoods",
    index: "04",
    codename: "GOODFOODS-AI",
    title: "GoodFoodsAI — Agentic Reservations",
    domain: "AGENTIC AI · FULL-STACK SYSTEMS",
    thesis:
      "A hand-written agent orchestration loop over deterministic, MCP-style tools — with a regression suite that asserts claimed actions against database state.",
    abstract:
      "A full-stack conversational reservation agent designed so that it cannot narrate a booking that did not happen. A hand-written orchestration loop (intent detection → tool selection → execution → state update → streamed response) drives a set of deterministic, MCP-style tools (search, availability, hold, create, modify, cancel) exposed over FastAPI, backed by SQLite and a FAISS retrieval index; tokens stream from a Groq-hosted Llama 3.1 8B. The load-bearing artefact is an automated reliability/regression suite that replays scripted conversations and asserts the agent's claimed actions against actual persisted state — turning “seems to work” into a checkable property.",
    metrics: [
      { value: "6", label: "deterministic tools", caveat: "search · hold · create · modify · cancel · availability", countTo: 6 },
      { value: "Next.js", label: "+ FastAPI", caveat: "streamed full-stack" },
      { value: "SQLite", label: "+ FAISS RAG", caveat: "local retrieval" },
      { value: "Groq", label: "llama-3.1-8b", caveat: "token streaming" },
    ],
    tags: [
      "Next.js",
      "FastAPI",
      "Agent orchestration",
      "MCP-style tools",
      "FAISS RAG",
      "Regression suite",
    ],
    repo: "https://github.com/imjr18/GoodFoodsAI",
    cluster: { color: "#b98cff", position: [3.0, -1.6, -0.4] },
    og: {
      title: "GoodFoodsAI — Agentic Reservations",
      description:
        "A hand-written orchestration loop over deterministic MCP-style tools, with a regression suite that verifies actions against database state.",
    },
  },
  {
    slug: "protein",
    index: "05",
    codename: "MOTIF-MINING",
    title: "Protein Motif Detection for Vaccine Targets",
    domain: "GENOMICS · COMPUTATIONAL IMMUNOLOGY",
    thesis:
      "A hybrid sequence–structure motif-mining pipeline that mines conserved, surface-exposed epitopes across 1,200+ viral proteomes to prioritise pan-virus vaccine targets.",
    abstract:
      "A computational-immunology pipeline for antigen prioritisation in pan-virus vaccine design. Attention-based sequence embeddings are combined with structural context and epitope prediction to mine motifs that are simultaneously conserved across strains and surface-exposed — the signature of a durable, broadly protective target. Applied across 1,200+ viral proteomes, the pipeline surfaces regions exceeding 87% cross-strain conservation while contracting the candidate target space by roughly 65% and preserving predicted neutralising epitopes, sharply reducing the set of sequences that need wet-lab validation. The framing is deliberately deployment-aware: rapid antigen prioritisation for emerging variants and peptide-vaccine design in outbreak and low-resource settings.",
    metrics: [
      { value: "1,200+", label: "viral proteomes", caveat: "cross-strain corpus" },
      { value: ">87%", label: "cross-strain conservation", caveat: "surfaced motifs", countTo: 87 },
      { value: "−65%", label: "target space", caveat: "candidate reduction", countTo: 65 },
      { value: "epitopes", label: "neutralising, preserved", caveat: "prioritised for validation" },
    ],
    tags: [
      "Attention embeddings",
      "Epitope prediction",
      "Motif mining",
      "Conservation analysis",
      "Immunoinformatics",
      "Genomics",
    ],
    repoNote: "Code available on request",
    cluster: { color: "#ff7eb6", position: [0.0, 2.7, 0.5] },
    og: {
      title: "Protein Motif Detection for Vaccine Targets",
      description:
        "Mining 1,200+ viral proteomes for conserved, surface-exposed epitopes — contracting the pan-virus vaccine target space by 65%.",
    },
  },
];

export const projectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

export const projectSlugs: ProjectSlug[] = projects.map((p) => p.slug);
