export const site = {
  name: "Jawahar Ranganathan",
  url: "https://imjr18.github.io",
  title:
    "Jawahar Ranganathan — Biomedical Deep Learning, Multi-Agent RL & Agentic AI",
  description:
    "CS + Economics at BITS Pilani. Research intern at Temple building deep learning for wearable physiological signals; previously data analytics at Roche.",
  headline: "I build learning systems that read the body and reason about the world.",
  subline:
    "Biomedical deep learning, multi-agent RL, and agentic AI. CS + Economics at BITS Pilani. Currently a research intern at Temple working on deep learning for wearable physiological signals; previously data analytics at Roche.",
  kicker: "CS + Economics · BITS Pilani",
  // Personal address — internship emails expire, so the site shows the Gmail.
  email: "jawahar.ranganathan@gmail.com",
  github: "https://github.com/imjr18",
  githubHandle: "imjr18",
  linkedin: "https://www.linkedin.com/in/jawahar-ranganathan-a1a2a9246",
  cv: "/cv.pdf",
  education: {
    school: "BITS Pilani, K.K. Birla Goa Campus",
    degree: "B.E. (Hons.) Computer Science + M.Sc. (Hons.) Economics",
    span: "2022 – present",
    cgpa: "7.3",
  },
  knowsAbout: [
    "Deep Learning",
    "Biomedical Signal Processing",
    "Transformers",
    "Multi-Agent Reinforcement Learning",
    "Uncertainty Quantification",
    "Agentic AI",
    "Medical Image Segmentation",
  ],
} as const;

/** Email split for lightweight obfuscation at render time. */
export const emailParts = {
  user: "jawahar.ranganathan",
  domain: "gmail.com",
};
