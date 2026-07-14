/**
 * Bespoke schematic SVGs — one per deep-dive. Static, theme-token colored,
 * captioned by the wrapping <Figure>. No external deps.
 */

const P = "#4af2a1";
const S = "#6bc7ff";
const A = "#ffb454";
const V = "#b98cff";
const HAIR = "rgba(232,238,244,0.18)";
const INK1 = "#9aa8b5";
const INK2 = "#5f6e7c";

const box = {
  fill: "#0d1318",
  stroke: HAIR,
};

const mono = {
  fontFamily: "var(--font-plex-mono), monospace",
  fill: INK1,
} as const;

/* ── 01 · Glucose: HR-centric cross-modal attention fusion ─────── */
export function GlucoseFusionDiagram() {
  const mods = [
    { y: 26, label: "HR", c: P, q: true },
    { y: 66, label: "ECG-HRV", c: S },
    { y: 106, label: "EMG", c: S },
    { y: 146, label: "EEG", c: S },
    { y: 186, label: "CBF", c: S },
  ];
  return (
    <svg viewBox="0 0 560 230" width="100%" role="img" aria-label="HR-centric cross-modal attention fusion">
      {mods.map((m) => (
        <g key={m.label}>
          <rect x={8} y={m.y} width={96} height={26} rx={2} fill={box.fill} stroke={m.c} strokeWidth={m.q ? 1.4 : 1} />
          <text x={56} y={m.y + 17} textAnchor="middle" style={mono} fontSize={12} fill={m.q ? P : INK1}>
            {m.label}
          </text>
          <text x={112} y={m.y + 17} style={mono} fontSize={10} fill={INK2}>
            enc
          </text>
          <line x1={140} y1={m.y + 13} x2={214} y2={112} stroke={m.q ? P : HAIR} strokeWidth={m.q ? 1.3 : 0.8} />
        </g>
      ))}
      {/* fusion core */}
      <rect x={214} y={78} width={130} height={70} rx={3} fill="#131b23" stroke={P} strokeWidth={1.2} />
      <text x={279} y={104} textAnchor="middle" style={mono} fontSize={11} fill={P}>
        cross-modal
      </text>
      <text x={279} y={120} textAnchor="middle" style={mono} fontSize={11} fill={P}>
        attention
      </text>
      <text x={279} y={137} textAnchor="middle" style={mono} fontSize={9} fill={INK2}>
        Q = HR
      </text>
      <line x1={344} y1={113} x2={400} y2={113} stroke={HAIR} strokeWidth={1} />
      {/* heads */}
      <rect x={400} y={64} width={150} height={44} rx={2} fill={box.fill} stroke={S} />
      <text x={475} y={82} textAnchor="middle" style={mono} fontSize={10.5} fill={INK1}>
        μ̂  glucose
      </text>
      <text x={475} y={97} textAnchor="middle" style={mono} fontSize={9} fill={INK2}>
        forecast head
      </text>
      <rect x={400} y={118} width={150} height={44} rx={2} fill={box.fill} stroke={A} />
      <text x={475} y={136} textAnchor="middle" style={mono} fontSize={10.5} fill={A}>
        σ  uncertainty
      </text>
      <text x={475} y={151} textAnchor="middle" style={mono} fontSize={9} fill={INK2}>
        log-variance head
      </text>
      <line x1={344} y1={100} x2={400} y2={86} stroke={HAIR} strokeWidth={0.8} />
      <line x1={344} y1={126} x2={400} y2={140} stroke={HAIR} strokeWidth={0.8} />
    </svg>
  );
}

/* ── 02 · Lesion: slice- vs patient-level split ────────────────── */
export function SplitDiagram() {
  return (
    <svg viewBox="0 0 560 210" width="100%" role="img" aria-label="Slice-level vs patient-level splitting">
      {/* leaked */}
      <text x={8} y={20} style={mono} fontSize={11} fill="#ff6b6b">
        SLICE-LEVEL SPLIT — leaks
      </text>
      {[0, 1, 2, 3].map((patient) =>
        [0, 1, 2, 3, 4].map((slice) => {
          const train = (slice + patient) % 2 === 0;
          return (
            <rect
              key={`l${patient}-${slice}`}
              x={8 + slice * 30}
              y={32 + patient * 20}
              width={26}
              height={16}
              rx={1.5}
              fill={train ? "rgba(107,199,255,0.18)" : "rgba(255,107,107,0.22)"}
              stroke={train ? S : "#ff6b6b"}
              strokeWidth={0.8}
            />
          );
        }),
      )}
      <text x={168} y={62} style={mono} fontSize={9} fill={INK2}>
        same patient →
      </text>
      <text x={168} y={74} style={mono} fontSize={9} fill={INK2}>
        both sides
      </text>

      {/* honest */}
      <text x={300} y={20} style={mono} fontSize={11} fill={P}>
        PATIENT-LEVEL SPLIT — clean
      </text>
      {[0, 1, 2, 3].map((patient) => {
        const train = patient < 3;
        return [0, 1, 2, 3, 4].map((slice) => (
          <rect
            key={`p${patient}-${slice}`}
            x={300 + slice * 30}
            y={32 + patient * 20}
            width={26}
            height={16}
            rx={1.5}
            fill={train ? "rgba(107,199,255,0.18)" : "rgba(74,242,161,0.2)"}
            stroke={train ? S : P}
            strokeWidth={0.8}
          />
        ));
      })}
      {/* legend */}
      <rect x={8} y={150} width={14} height={12} fill="rgba(107,199,255,0.18)" stroke={S} strokeWidth={0.8} />
      <text x={28} y={160} style={mono} fontSize={10} fill={INK1}>train</text>
      <rect x={78} y={150} width={14} height={12} fill="rgba(74,242,161,0.2)" stroke={P} strokeWidth={0.8} />
      <text x={98} y={160} style={mono} fontSize={10} fill={INK1}>val (held-out patient)</text>
      <text x={8} y={190} style={mono} fontSize={11} fill={INK1}>
        89% Dice
      </text>
      <text x={78} y={190} style={mono} fontSize={11} fill={INK2}>
        (leaked)  →
      </text>
      <text x={300} y={190} style={mono} fontSize={11} fill={P}>
        51.7% Dice
      </text>
      <text x={392} y={190} style={mono} fontSize={11} fill={INK2}>
        (honest)
      </text>
    </svg>
  );
}

/* ── 03 · Ride-sharing: MADDPG centralized critic ──────────────── */
export function MaddpgDiagram() {
  const agents = [
    { x: 40, label: "π₁" },
    { x: 160, label: "π₂" },
    { x: 280, label: "π₃" },
  ];
  return (
    <svg viewBox="0 0 560 220" width="100%" role="img" aria-label="MADDPG centralized critic, decentralized actors">
      {/* critic */}
      <rect x={360} y={20} width={180} height={54} rx={3} fill="#131b23" stroke={A} strokeWidth={1.2} />
      <text x={450} y={42} textAnchor="middle" style={mono} fontSize={11} fill={A}>
        centralized critic
      </text>
      <text x={450} y={58} textAnchor="middle" style={mono} fontSize={9} fill={INK2}>
        Q(s₁..ₙ, a₁..ₙ)
      </text>
      {/* actors */}
      {agents.map((ag) => (
        <g key={ag.label}>
          <rect x={ag.x} y={130} width={90} height={44} rx={2} fill={box.fill} stroke={P} />
          <text x={ag.x + 45} y={150} textAnchor="middle" style={mono} fontSize={11} fill={P}>
            actor {ag.label}
          </text>
          <text x={ag.x + 45} y={165} textAnchor="middle" style={mono} fontSize={8.5} fill={INK2}>
            local obs
          </text>
          {/* dashed = training-only gradient from critic */}
          <line x1={ag.x + 45} y1={130} x2={430} y2={74} stroke={A} strokeWidth={0.8} strokeDasharray="3 3" />
        </g>
      ))}
      <text x={360} y={100} style={mono} fontSize={9} fill={INK2}>
        --- gradient (train only)
      </text>
      {/* reward shaping */}
      <rect x={40} y={190} width={470} height={24} rx={2} fill="#0d1318" stroke={HAIR} />
      <text x={275} y={206} textAnchor="middle" style={mono} fontSize={10.5} fill={INK1}>
        R = individual + λ · altruism-score
      </text>
    </svg>
  );
}

/* ── 04 · GoodFoods: agent orchestration loop ──────────────────── */
export function OrchestrationDiagram() {
  const nodes = [
    { x: 20, label: "user turn", c: INK1 },
    { x: 128, label: "intent", c: S },
    { x: 224, label: "tool select", c: V },
    { x: 344, label: "execute", c: P },
    { x: 444, label: "stream", c: S },
  ];
  return (
    <svg viewBox="0 0 560 210" width="100%" role="img" aria-label="Hand-written agent orchestration loop">
      {nodes.map((n, i) => (
        <g key={n.label}>
          <rect x={n.x} y={30} width={i === 2 ? 92 : 84} height={30} rx={2} fill={box.fill} stroke={n.c} />
          <text x={n.x + (i === 2 ? 46 : 42)} y={49} textAnchor="middle" style={mono} fontSize={10.5} fill={n.c}>
            {n.label}
          </text>
          {i < nodes.length - 1 && (
            <line x1={n.x + (i === 2 ? 92 : 84)} y1={45} x2={nodes[i + 1].x} y2={45} stroke={HAIR} strokeWidth={1} markerEnd="url(#arr)" />
          )}
        </g>
      ))}
      {/* state feedback loop */}
      <path d="M 490 60 Q 500 120 275 120 Q 62 120 62 62" fill="none" stroke={INK2} strokeWidth={0.9} strokeDasharray="4 3" markerEnd="url(#arr)" />
      <text x={275} y={116} textAnchor="middle" style={mono} fontSize={9} fill={INK2}>
        conversation state ↺
      </text>
      {/* tools rail */}
      <rect x={224} y={150} width={244} height={46} rx={2} fill="#0d1318" stroke={V} strokeWidth={0.8} />
      <text x={346} y={168} textAnchor="middle" style={mono} fontSize={9} fill={V}>
        MCP-style tools
      </text>
      <text x={346} y={184} textAnchor="middle" style={mono} fontSize={8.5} fill={INK2}>
        search · availability · hold · create · modify · cancel
      </text>
      <line x1={270} y1={60} x2={300} y2={150} stroke={V} strokeWidth={0.7} strokeDasharray="2 2" />
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={INK2} />
        </marker>
      </defs>
    </svg>
  );
}

/* ── 05 · Protein: conserved surface-exposed motif mining ──────── */
export function MotifMiningDiagram() {
  const R = "#ff7eb6";
  return (
    <svg viewBox="0 0 560 220" width="100%" role="img" aria-label="Conserved surface-exposed motif mining pipeline">
      {/* proteome corpus */}
      <rect x={8} y={64} width={104} height={92} rx={3} fill={box.fill} stroke={HAIR} />
      <text x={60} y={54} textAnchor="middle" style={mono} fontSize={10} fill={INK2}>1,200+ proteomes</text>
      {[0, 1, 2, 3, 4, 5].map((r) =>
        [0, 1, 2, 3, 4, 5, 6, 7].map((c) => (
          <rect key={`${r}-${c}`} x={16 + c * 11} y={72 + r * 13} width={8} height={9} rx={1}
            fill={(r + c) % 3 === 0 ? "rgba(255,126,182,0.5)" : "rgba(107,199,255,0.18)"} />
        )),
      )}
      {/* embeddings */}
      <line x1={112} y1={110} x2={146} y2={110} stroke={HAIR} strokeWidth={1} markerEnd="url(#marr)" />
      <rect x={146} y={80} width={112} height={60} rx={3} fill="#131b23" stroke={S} strokeWidth={1.1} />
      <text x={202} y={104} textAnchor="middle" style={mono} fontSize={10.5} fill={S}>attention</text>
      <text x={202} y={119} textAnchor="middle" style={mono} fontSize={10.5} fill={S}>embeddings</text>
      <text x={202} y={133} textAnchor="middle" style={mono} fontSize={8.5} fill={INK2}>seq + structure</text>
      {/* conservation filter */}
      <line x1={258} y1={110} x2={292} y2={110} stroke={HAIR} strokeWidth={1} markerEnd="url(#marr)" />
      <rect x={292} y={80} width={120} height={60} rx={3} fill={box.fill} stroke={A} />
      <text x={352} y={102} textAnchor="middle" style={mono} fontSize={10} fill={A}>conserved</text>
      <text x={352} y={116} textAnchor="middle" style={mono} fontSize={10} fill={A}>&amp; surface-exposed</text>
      <text x={352} y={131} textAnchor="middle" style={mono} fontSize={8.5} fill={INK2}>&gt;87% cross-strain</text>
      {/* epitope shortlist */}
      <line x1={412} y1={110} x2={446} y2={110} stroke={HAIR} strokeWidth={1} markerEnd="url(#marr)" />
      <rect x={446} y={82} width={106} height={56} rx={3} fill="#131b23" stroke={R} strokeWidth={1.2} />
      <text x={499} y={104} textAnchor="middle" style={mono} fontSize={10.5} fill={R}>epitope</text>
      <text x={499} y={119} textAnchor="middle" style={mono} fontSize={10.5} fill={R}>shortlist</text>
      <text x={499} y={133} textAnchor="middle" style={mono} fontSize={8.5} fill={INK2}>−65% target space</text>
      <text x={280} y={186} textAnchor="middle" style={mono} fontSize={9} fill={INK2}>
        mine motifs that are conserved across strains AND exposed on the viral surface → pan-virus targets
      </text>
      <defs>
        <marker id="marr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={INK2} />
        </marker>
      </defs>
    </svg>
  );
}
