import { useEffect, useState } from "react";
import type { MMPair, MMCard } from "../types";
import { F, shuffle } from "../data/content";
import { StatusBar, BackBtn, SpeakerBtn } from "../components/common";

function MMGamosaSVG() {
  return (
    <svg viewBox="0 0 90 72" fill="none" className="w-full h-full">
      <rect x="4" y="10" width="82" height="52" rx="5" fill="#C8001A"/>
      {[20,28,36,44,52].map(y=>(
        <line key={y} x1="4" y1={y} x2="86" y2={y} stroke="white" strokeWidth={y===28||y===44?1.5:2.8} opacity={y===28||y===44?0.6:1}/>
      ))}
      {/* Diamond motifs on main stripes */}
      {[15,30,45,60,75].map(x=>(
        <path key={x} d={`M${x} 36 L${x+4} 41 L${x+8} 36 L${x+4} 31Z`} fill="white" opacity="0.95"/>
      ))}
      {/* Cross motifs between diamonds */}
      {[22,37,52,67].map(x=>(
        <g key={x}>
          <line x1={x+2} y1={33} x2={x+2} y2={39} stroke="white" strokeWidth="1.5" opacity="0.7"/>
          <line x1={x-1} y1={36} x2={x+5} y2={36} stroke="white" strokeWidth="1.5" opacity="0.7"/>
        </g>
      ))}
      {/* Fringe */}
      {[14,20,26,32,38,44,50,56].map((x,i)=>(
        <line key={i} x1={x} y1={10} x2={x+2} y2={4} stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.8"/>
      ))}
      {[14,20,26,32,38,44,50,56].map((x,i)=>(
        <line key={i} x1={x} y1={62} x2={x+2} y2={68} stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.8"/>
      ))}
      <rect x="4" y="10" width="82" height="52" rx="5" stroke="#8B0010" strokeWidth="1.5" fill="none" opacity="0.5"/>
    </svg>
  );
}

function MMMarigoldSVG() {
  return (
    <svg viewBox="0 0 90 90" fill="none" className="w-full h-full">
      <ellipse cx="45" cy="78" rx="20" ry="6" fill="#C8601A" opacity="0.3"/>
      {/* Outer petals */}
      {Array.from({length:12},(_,i)=>{
        const a=(i*30-90)*Math.PI/180, r=30, cx=45+r*Math.cos(a), cy=45+r*Math.sin(a);
        return <ellipse key={i} cx={cx} cy={cy} rx="9" ry="5.5" fill="#F5A800" transform={`rotate(${i*30} ${cx} ${cy})`}/>;
      })}
      {/* Mid petals */}
      {Array.from({length:10},(_,i)=>{
        const a=(i*36-90)*Math.PI/180, r=21, cx=45+r*Math.cos(a), cy=45+r*Math.sin(a);
        return <ellipse key={i} cx={cx} cy={cy} rx="8" ry="4.5" fill="#F0C020" transform={`rotate(${i*36} ${cx} ${cy})`}/>;
      })}
      {/* Inner petals */}
      {Array.from({length:8},(_,i)=>{
        const a=(i*45-90)*Math.PI/180, r=13, cx=45+r*Math.cos(a), cy=45+r*Math.sin(a);
        return <ellipse key={i} cx={cx} cy={cy} rx="6" ry="3.5" fill="#E8A800" transform={`rotate(${i*45} ${cx} ${cy})`}/>;
      })}
      <circle cx="45" cy="45" r="11" fill="#D08000"/>
      <circle cx="45" cy="45" r="7"  fill="#E8A800"/>
      <circle cx="45" cy="45" r="3.5" fill="#C07000"/>
      {/* Stem + leaf */}
      <line x1="45" y1="74" x2="45" y2="83" stroke="#5A8820" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 78 C38 73 34 68 38 64" stroke="#5A8820" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function MMTeaBasketSVG() {
  return (
    <svg viewBox="0 0 90 90" fill="none" className="w-full h-full">
      <ellipse cx="45" cy="82" rx="24" ry="6" fill="#C85010" opacity="0.3"/>
      {/* Basket body - conical shape */}
      <path d="M25 30 L18 75 Q18 79 22 79 L68 79 Q72 79 72 75 L65 30Z" fill="#D0601A"/>
      {/* Weave lines horizontal */}
      {[38,46,54,62,70].map(y=>(
        <path key={y} d={`M${25+(y-30)*0.35} ${y} L${65-(y-30)*0.35} ${y}`}
          stroke="#B04808" strokeWidth="1.8" opacity="0.6"/>
      ))}
      {/* Weave lines diagonal */}
      {[-4,-2,0,2,4,6,8,10].map((offset,i)=>(
        <path key={i} d={`M${25+offset*4} 30 L${18+offset*4} 75`}
          stroke="#E8802A" strokeWidth="1.2" opacity="0.35"/>
      ))}
      {/* Rim */}
      <path d="M25 30 L65 30" stroke="#B04808" strokeWidth="3" strokeLinecap="round"/>
      <ellipse cx="45" cy="30" rx="20" ry="5" fill="#C05010" opacity="0.8"/>
      {/* Green tea leaves */}
      <path d="M30 24 C32 16 38 14 42 18 C44 14 50 12 52 18 C56 14 62 16 64 24" fill="#5A9830" opacity="0.9"/>
      <path d="M35 22 C37 15 45 13 50 20" stroke="#7AB840" strokeWidth="1.5" fill="none" opacity="0.6"/>
      {/* Handle arc */}
      <path d="M28 32 Q45 18 62 32" stroke="#A04008" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function MMLotussSVG() {
  return (
    <svg viewBox="0 0 90 90" fill="none" className="w-full h-full">
      {/* Water */}
      <ellipse cx="45" cy="78" rx="32" ry="8" fill="#9FD5E8" opacity="0.5"/>
      {/* Lily pad */}
      <path d="M16 72 Q18 58 45 56 Q72 58 74 72 Q74 80 45 80 Q16 80 16 72Z" fill="#3A8830"/>
      <path d="M45 56 L45 72" stroke="#2A6820" strokeWidth="1.5" opacity="0.5"/>
      <path d="M28 66 Q36 62 45 62 Q54 62 62 66" stroke="#4A9840" strokeWidth="1.2" fill="none" opacity="0.4"/>
      {/* Outer petals */}
      {[[-18,14],[0,8],[18,14],[-28,28],[-10,20],[10,20],[28,28]].map(([dx,dy],i)=>(
        <ellipse key={i} cx={45+dx} cy={50+dy} rx="9" ry="6" fill="#E870A8"
          transform={`rotate(${dx*2} ${45+dx} ${50+dy})`} opacity="0.9"/>
      ))}
      {/* Inner petals */}
      {[[-10,10],[0,6],[10,10],[-6,18],[6,18]].map(([dx,dy],i)=>(
        <ellipse key={i} cx={45+dx} cy={46+dy} rx="7" ry="5" fill="#F090C0"
          transform={`rotate(${dx*2.5} ${45+dx} ${46+dy})`} opacity="0.95"/>
      ))}
      {/* Center */}
      <ellipse cx="45" cy="52" rx="9" ry="7" fill="#F8D0E0"/>
      <circle cx="45" cy="52" r="5" fill="#F5C020"/>
      {[0,60,120,180,240,300].map((a,i)=>(
        <circle key={i} cx={45+3.5*Math.cos(a*Math.PI/180)} cy={52+3.5*Math.sin(a*Math.PI/180)} r="1.5" fill="#E89000"/>
      ))}
    </svg>
  );
}

function MMElephantSVG() {
  return (
    <svg viewBox="0 0 90 90" fill="none" className="w-full h-full">
      <ellipse cx="45" cy="82" rx="26" ry="6" fill="#7898B8" opacity="0.3"/>
      {/* Body */}
      <ellipse cx="48" cy="58" rx="28" ry="22" fill="#7898B8"/>
      {/* Head */}
      <circle cx="32" cy="42" r="22" fill="#8AAAC8"/>
      {/* Ear */}
      <ellipse cx="14" cy="42" rx="10" ry="14" fill="#9BBAD8"/>
      <ellipse cx="14" cy="42" rx="7" ry="10" fill="#E9C5D0" opacity="0.7"/>
      {/* Trunk */}
      <path d="M20 52 C14 58 12 66 16 70 C18 74 24 74 26 70 C28 74 28 78 30 78"
        stroke="#7898B8" strokeWidth="8" strokeLinecap="round" fill="none"/>
      {/* Trunk highlight */}
      <path d="M20 52 C15 58 13 66 17 70"
        stroke="#9BBAD8" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5"/>
      {/* Tusk */}
      <path d="M28 56 C24 60 20 66 22 70" stroke="#F5F0E0" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      {/* Eye */}
      <circle cx="26" cy="38" r="5" fill="#25283D"/>
      <circle cx="26" cy="38" r="3" fill="white"/>
      <circle cx="27" cy="37" r="1.5" fill="#25283D"/>
      <circle cx="28" cy="36" r="1" fill="white" opacity="0.8"/>
      {/* Decorative headpiece */}
      <path d="M20 24 Q32 16 44 24" stroke="#E0A526" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {[24,32,40].map((x,i)=>(
        <circle key={i} cx={x} cy={22+(i===1?-2:0)} r="2.5" fill="#E0A526" opacity="0.9"/>
      ))}
      {/* Forehead bindi */}
      <circle cx="32" cy="28" r="3.5" fill="#D8724A"/>
      <circle cx="32" cy="28" r="1.5" fill="#F5A040"/>
      {/* Leg suggestions */}
      <rect x="28" y="72" width="10" height="10" rx="5" fill="#7898B8"/>
      <rect x="52" y="72" width="10" height="10" rx="5" fill="#6888A8"/>
    </svg>
  );
}

function MMPeacockSVG() {
  return (
    <svg viewBox="0 0 90 90" fill="none" className="w-full h-full">
      <ellipse cx="45" cy="83" rx="20" ry="5" fill="#0058A0" opacity="0.3"/>
      {/* Fan tail feathers */}
      {[[-30,-18],[-18,-26],[-4,-30],[4,-30],[18,-26],[30,-18],[36,-6],[32,8],[-32,8],[-36,-6]].map(([dx,dy],i)=>(
        <path key={i} d={`M45 55 Q${45+dx*0.6} ${55+dy*0.6} ${45+dx} ${55+dy}`}
          stroke={i%3===0?"#1890D0":i%3===1?"#40C020":"#2060A8"} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      ))}
      {/* Eye spots on tail */}
      {[[-28,-14],[-14,-24],[0,-28],[14,-24],[28,-14],[34,-2]].map(([dx,dy],i)=>(
        <g key={i}>
          <circle cx={45+dx} cy={55+dy} r="4.5" fill="#005080"/>
          <circle cx={45+dx} cy={55+dy} r="2.5" fill="#40C060"/>
          <circle cx={45+dx} cy={55+dy} r="1"   fill="#80E090"/>
        </g>
      ))}
      {/* Body */}
      <ellipse cx="45" cy="66" rx="10" ry="14" fill="#1858B0"/>
      {/* Neck */}
      <path d="M45 52 C42 46 42 40 45 36" stroke="#1890C0" strokeWidth="7" strokeLinecap="round" fill="none"/>
      <path d="M45 52 C42 46 42 40 45 36" stroke="#40C0E0" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5"/>
      {/* Head */}
      <circle cx="45" cy="32" r="9" fill="#1890C0"/>
      {/* Crest */}
      {[[-4,-8],[0,-10],[4,-8]].map(([dx,dy],i)=>(
        <g key={i}>
          <line x1={45+dx*0.3} y1={23} x2={45+dx} y2={23+dy} stroke="#1890C0" strokeWidth="1.8"/>
          <circle cx={45+dx} cy={23+dy} r="2.5" fill="#40C0E0"/>
        </g>
      ))}
      {/* Eye */}
      <circle cx="49" cy="30" r="3.5" fill="white"/>
      <circle cx="50" cy="30" r="2" fill="#25283D"/>
      <circle cx="51" cy="29" r="0.8" fill="white" opacity="0.8"/>
      {/* Beak */}
      <path d="M54 33 L59 35 L54 37Z" fill="#F0C030"/>
    </svg>
  );
}

function MMBananaSVG() {
  return (
    <svg viewBox="0 0 90 90" fill="none" className="w-full h-full">
      <ellipse cx="45" cy="82" rx="22" ry="5.5" fill="#5A8820" opacity="0.3"/>
      {/* Bunch stem */}
      <path d="M42 14 C44 10 50 10 52 14 C52 18 50 22 48 22" stroke="#4A7010" strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* Back row bananas */}
      <path d="M38 20 C28 22 22 34 26 46 C28 52 34 54 40 50" stroke="#70A818" strokeWidth="10" fill="none" strokeLinecap="round"/>
      <path d="M50 18 C62 20 68 34 64 46 C62 52 56 54 50 50" stroke="#70A818" strokeWidth="10" fill="none" strokeLinecap="round"/>
      {/* Front row bananas */}
      <path d="M32 26 C20 28 14 44 20 56 C22 62 30 64 36 58" stroke="#88C020" strokeWidth="11" fill="none" strokeLinecap="round"/>
      <path d="M45 24 C45 24 46 36 46 50 C46 58 44 62 42 62" stroke="#88C020" strokeWidth="11" fill="none" strokeLinecap="round"/>
      <path d="M58 26 C70 28 76 44 70 56 C68 62 60 64 54 58" stroke="#88C020" strokeWidth="11" fill="none" strokeLinecap="round"/>
      {/* Highlight on front row */}
      <path d="M34 30 C24 32 18 46 22 56" stroke="#AADE40" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
      <path d="M47 28 C47 38 47 50 46 58" stroke="#AADE40" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
      <path d="M56 30 C66 32 72 46 68 56" stroke="#AADE40" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
      {/* Tip ends */}
      <circle cx="36" cy="58" r="3.5" fill="#3A6808"/>
      <circle cx="42" cy="62" r="3" fill="#3A6808"/>
      <circle cx="54" cy="58" r="3.5" fill="#3A6808"/>
    </svg>
  );
}

// ─── Memory Match: card data & helpers ───────────────────────────────────────

const MM_PAIRS: MMPair[] = [
  { pairId:1, label:"Gamosa",    frontBg:"#FEF0F0", Illustration:MMGamosaSVG    },
  { pairId:2, label:"Marigold",  frontBg:"#FDF7E4", Illustration:MMMarigoldSVG  },
  { pairId:3, label:"Tea Basket",frontBg:"#E5F2F8", Illustration:MMTeaBasketSVG },
  { pairId:4, label:"Lotus",     frontBg:"#FDF0F6", Illustration:MMLotussSVG    },
  { pairId:5, label:"Elephant",  frontBg:"#EEEDFB", Illustration:MMElephantSVG  },
  { pairId:6, label:"Peacock",   frontBg:"#EBF8F5", Illustration:MMPeacockSVG   },
];

function createMMCards(pairs: MMPair[] = MM_PAIRS): MMCard[] {
  return shuffle([
    ...pairs.map(p => ({ ...p, uid: p.pairId + "a" })),
    ...pairs.map(p => ({ ...p, uid: p.pairId + "b" })),
  ]);
}

// ─── MM Card Back (pastel gamosa weave) ──────────────────────────────────────

const BACK_PALETTE = ["#9FD5E8","#DCD8F5","#F8D8CC","#E9C5D0"] as const;

function MMCardBack({ variant }: { variant: number }) {
  const bg = BACK_PALETTE[variant % 4];
  // Use white motif on blue/peach/pink, navy motif on lavender for best contrast
  const motif = variant === 1 ? "rgba(37,40,61,0.55)" : "rgba(255,255,255,0.95)";
  const motifSoft = variant === 1 ? "rgba(37,40,61,0.3)" : "rgba(255,255,255,0.55)";
  return (
    <svg viewBox="0 0 100 100" fill="none" style={{ width:"100%", height:"100%" }}>
      <rect width="100" height="100" fill={bg}/>
      {/* Thin soft secondary lines */}
      {[22,44,66,88].map(y=>(
        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke={motifSoft} strokeWidth="1.5"/>
      ))}
      {/* Main bold weave bands */}
      {[11,33,55,77].map(y=>(
        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke={motif} strokeWidth="3.5"/>
      ))}
      {/* Central diamond motif row */}
      {[18,42,66,90].map(cx=>(
        <path key={cx} d={`M${cx} 50 L${cx+8} 58 L${cx+16} 50 L${cx+8} 42Z`} fill={motif}/>
      ))}
      {/* Cross accents between diamonds */}
      {[30,54,78].map(cx=>(
        <g key={cx}>
          <line x1={cx} y1={45} x2={cx} y2={55} stroke={motif} strokeWidth="2.5" strokeLinecap="round"/>
          <line x1={cx-5} y1={50} x2={cx+5} y2={50} stroke={motif} strokeWidth="2.5" strokeLinecap="round"/>
        </g>
      ))}
      {/* Subtle corner ornaments */}
      <circle cx="6" cy="6" r="3" fill={motifSoft}/>
      <circle cx="94" cy="6" r="3" fill={motifSoft}/>
      <circle cx="6" cy="94" r="3" fill={motifSoft}/>
      <circle cx="94" cy="94" r="3" fill={motifSoft}/>
      {/* Border */}
      <rect x="1.5" y="1.5" width="97" height="97" rx="14" stroke={motif} strokeWidth="2" fill="none" opacity="0.6"/>
    </svg>
  );
}

// ─── MM Mascot (lavender elephant) ───────────────────────────────────────────

function MMMascot({ happy, matched }: { happy: boolean; matched: number }) {
  return (
    <div style={{ position:"relative", width:52, height:52, flexShrink:0 }}>
      <svg viewBox="0 0 52 52" fill="none" style={{ width:"100%", height:"100%" }}>
        {/* Ears */}
        <ellipse cx="8"  cy="28" rx="7.5" ry="10" fill="#C8C0E8"/>
        <ellipse cx="44" cy="28" rx="7.5" ry="10" fill="#C8C0E8"/>
        <ellipse cx="8"  cy="28" rx="4.5" ry="6.5" fill="#E9C5D0" opacity="0.75"/>
        <ellipse cx="44" cy="28" rx="4.5" ry="6.5" fill="#E9C5D0" opacity="0.75"/>
        {/* Head */}
        <circle cx="26" cy="26" r="19" fill="#DCD8F5"/>
        {/* Trunk */}
        <path d="M19 38 C14 43 13 49 17 51" stroke="#C8C0E8" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <path d="M19 38 C15 43 14 49 17 51" stroke="#E5E2F8" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6"/>
        {/* Eyes */}
        {happy ? (
          <>
            <path d="M17 24 Q19.5 20.5 22 24" stroke="#25283D" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M30 24 Q32.5 20.5 35 24" stroke="#25283D" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </>
        ) : (
          <>
            <circle cx="19.5" cy="24" r="3.5" fill="#25283D"/>
            <circle cx="32.5" cy="24" r="3.5" fill="#25283D"/>
            <circle cx="20.5" cy="22.8" r="1.4" fill="white" opacity="0.8"/>
            <circle cx="33.5" cy="22.8" r="1.4" fill="white" opacity="0.8"/>
          </>
        )}
        {/* Mouth */}
        {happy
          ? <path d="M19 34 Q26 41 33 34" stroke="#25283D" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          : <path d="M20 33 Q26 37 32 33" stroke="#25283D" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        }
        {/* Bindi */}
        <circle cx="26" cy="16" r="3" fill="#8B7BC8"/>
        <circle cx="26" cy="16" r="1.3" fill="#B0A0E0"/>
        {/* Happy sparkles */}
        {happy && (
          <>
            <path d="M3 8 L4.2 5 L5.4 8 L8.4 9 L5.4 10 L4.2 13 L3 10 L0 9Z" fill="#8B7BC8"/>
            <path d="M42 3 L43 1 L44 3 L46 4 L44 5 L43 7 L42 5 L40 4Z" fill="#9FD5E8"/>
            <circle cx="48" cy="14" r="2" fill="#F8D8CC"/>
            <circle cx="3"  cy="18" r="1.5" fill="#DCD8F5"/>
          </>
        )}
      </svg>
      {matched > 0 && (
        <div style={{
          position:"absolute", top:-5, right:-5,
          width:20, height:20, borderRadius:"50%",
          backgroundColor:"#8B7BC8", border:"2.5px solid white",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 2px 8px rgba(139,123,200,0.45)",
        }}>
          <span style={{ fontSize:10, fontWeight:900, color:"white", fontFamily:F }}>{matched}</span>
        </div>
      )}
    </div>
  );
}

// ─── Screen: MM Game ─────────────────────────────────────────────────────────

type MMPhase = "peek" | "play";

function MMGameScreen({ onDone, onBack, pairs }: { onDone: (moves: number) => void; onBack: ()=>void; pairs?: MMPair[] }) {
  const [cards]   = useState<MMCard[]>(()=>createMMCards(pairs));
  const [phase,    setPhase]   = useState<MMPhase>("peek");
  const [peekCount,setPeekCount] = useState(3);
  const [flipped,  setFlipped]  = useState<Set<string>>(new Set());
  const [matched,  setMatched]  = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string | null>(null);
  const [shaking,  setShaking]  = useState<Set<string>>(new Set());
  const [checking, setChecking] = useState(false);
  const [moves,    setMoves]    = useState(0);
  const [matchPopup, setMatchPopup] = useState(false);
  const [mismatchHint, setMismatchHint] = useState(false);
  const [happyMascot,  setHappyMascot]  = useState(false);
  const [lastMatchedPair, setLastMatchedPair] = useState<string>("");

  useEffect(() => {
    if (phase !== "peek") return;
    if (peekCount <= 0) { setPhase("play"); return; }
    const t = setTimeout(() => setPeekCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, peekCount]);

  const matchCount = matched.size / 2;
  const totalPairs = MM_PAIRS.length;

  const handleTap = (uid: string) => {
    if (phase !== "play") return;
    if (checking) return;
    if (matched.has(uid)) return;
    if (flipped.has(uid)) return;
    if (selected === uid) return;

    const newFlipped = new Set(flipped);
    newFlipped.add(uid);
    setFlipped(newFlipped);

    if (!selected) { setSelected(uid); return; }

    const newMoves = moves + 1;
    setMoves(newMoves);
    const c1 = cards.find(c => c.uid === selected)!;
    const c2 = cards.find(c => c.uid === uid)!;

    if (c1.pairId === c2.pairId) {
      const newMatched = new Set(matched);
      newMatched.add(selected); newMatched.add(uid);
      setMatched(newMatched);
      setFlipped(new Set()); setSelected(null);
      setLastMatchedPair(c1.label);
      setMatchPopup(true); setHappyMascot(true);
      setTimeout(() => { setMatchPopup(false); setHappyMascot(false); }, 1700);
      if (newMatched.size === cards.length) setTimeout(() => onDone(newMoves), 1800);
    } else {
      setChecking(true);
      setShaking(new Set([selected, uid]));
      setMismatchHint(true);
      setTimeout(() => {
        setFlipped(new Set()); setSelected(null);
        setChecking(false); setShaking(new Set()); setMismatchHint(false);
      }, 900);
    }
  };

  const isFaceUp = (uid: string) => phase==="peek" || flipped.has(uid) || matched.has(uid);
  const pctDone = matchCount / totalPairs;

  return (
    <div className="flex flex-col h-full" style={{ position:"relative" }}>

      {/* ── Top bar ── */}
      <div style={{ backgroundColor:"#FFFDF7", flexShrink:0,
                    boxShadow:"0 2px 16px rgba(37,40,61,0.07)", borderRadius:"0 0 24px 24px" }}>
        <StatusBar/>

        {/* Title row */}
        <div className="flex items-center justify-between px-4 pb-3">
          <button onClick={onBack}
            className="flex items-center gap-1.5 rounded-2xl transition-all active:scale-90"
            style={{ backgroundColor:"#F0ECFD", padding:"8px 14px" }}>
            <svg viewBox="0 0 20 20" fill="none" style={{ width:20, height:20 }}>
              <path d="M12 15L7 10L12 5" stroke="#25283D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize:18, fontWeight:800, color:"#25283D", fontFamily:F }}>Back</span>
          </button>

          <span style={{ fontSize:19, fontWeight:900, color:"#25283D", fontFamily:F }}>Memory Match</span>

          <MMMascot happy={happyMascot} matched={matchCount}/>
        </div>

        {/* Instruction / status banner */}
        {phase === "peek" ? (
          <div className="mx-4 mb-3 rounded-2xl flex items-center justify-between px-4 py-3"
            style={{ backgroundColor:"#DCD8F5" }}>
            <div>
              <p style={{ fontSize:16, fontWeight:800, color:"#25283D", fontFamily:F }}>Remember the pictures!</p>
              <p style={{ fontSize:13, fontWeight:600, color:"#25283D", opacity:0.65, fontFamily:F, marginTop:1 }}>Find the matching pairs.</p>
            </div>
            <div style={{
              width:42, height:42, borderRadius:"50%",
              backgroundColor:"#8B7BC8",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 4px 14px rgba(139,123,200,0.45)",
            }}>
              <span style={{ fontSize:22, fontWeight:900, color:"white", fontFamily:F }}>
                {peekCount > 0 ? peekCount : "!"}
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-4 mb-3 rounded-2xl flex items-center justify-between px-4 py-2.5"
            style={{ backgroundColor:"#F8D8CC" }}>
            <p style={{ fontSize:15, fontWeight:700, color:"#25283D", fontFamily:F }}>
              Tap cards to find pairs.
            </p>
            <div style={{
              backgroundColor:"#25283D", borderRadius:16,
              padding:"4px 12px",
            }}>
              <span style={{ fontSize:13, fontWeight:800, color:"white", fontFamily:F }}>
                {moves} move{moves !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}

        {/* Pairs progress */}
        <div className="flex items-center justify-between px-4 pb-1">
          <div className="flex items-center gap-1.5">
            {Array.from({length: totalPairs}, (_,i) => (
              <svg key={i} viewBox="0 0 20 20" fill="none" style={{ width:22, height:22 }}>
                <path d="M10 2L12.4 7.3L18.1 8L14 12L15.1 18L10 15.2L4.9 18L6 12L1.9 8L7.6 7.3Z"
                  fill={i < matchCount ? "#8B7BC8" : "none"}
                  stroke={i < matchCount ? "#8B7BC8" : "#DCD8F5"}
                  strokeWidth="1.8"/>
              </svg>
            ))}
          </div>
          <span style={{ fontSize:13, fontWeight:700, color:"#25283D", opacity:0.55, fontFamily:F }}>
            Pairs found: {matchCount} / {totalPairs}
          </span>
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-3 pt-1.5">
          <div style={{ height:6, borderRadius:10, backgroundColor:"#DCD8F5" }}>
            <div style={{
              height:6, borderRadius:10, width:`${pctDone*100}%`,
              backgroundColor:"#8B7BC8",
              transition:"width 0.45s ease",
            }}/>
          </div>
        </div>
      </div>

      {/* ── Card grid ── */}
      <div className="flex-1 overflow-y-auto py-4 px-3" style={{ position:"relative" }}>

        {/* Mismatch "Almost!" hint */}
        {mismatchHint && (
          <div className="mm-mismatch-hint flex items-center justify-center gap-2 rounded-2xl mb-3 mx-1 py-2.5"
            style={{ backgroundColor:"#E9C5D0", boxShadow:"0 2px 10px rgba(233,197,208,0.5)" }}>
            <span style={{ fontSize:15, fontWeight:800, color:"#25283D", fontFamily:F }}>Almost!</span>
            <span style={{ fontSize:14, fontWeight:600, color:"#25283D", opacity:0.6, fontFamily:F }}>Try another pair.</span>
          </div>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {cards.map((card, idx) => {
            const faceUp    = isFaceUp(card.uid);
            const isMatched = matched.has(card.uid);
            const isShaking = shaking.has(card.uid);
            return (
              <button key={card.uid} onClick={() => handleTap(card.uid)}
                className={isShaking ? "mm-shake" : isMatched ? "mm-matched" : ""}
                style={{
                  borderRadius:16, overflow:"hidden", aspectRatio:"1", position:"relative",
                  border: isMatched
                    ? "2.5px solid #8B7BC8"
                    : faceUp && !isMatched
                      ? "2px solid rgba(159,213,232,0.6)"
                      : "2px solid rgba(220,216,245,0.55)",
                  boxShadow: isMatched
                    ? "0 0 0 3px rgba(139,123,200,0.3), 0 6px 20px rgba(139,123,200,0.18)"
                    : "0 4px 14px rgba(37,40,61,0.1), 0 1px 4px rgba(37,40,61,0.06)",
                  backgroundColor: faceUp ? card.frontBg : "transparent",
                  transform: faceUp && !isMatched && phase==="play" ? "translateY(-2px)" : "none",
                  transition:"transform 0.18s ease, border 0.25s, box-shadow 0.25s",
                }}>

                {faceUp ? (
                  /* Card front */
                  <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", position:"relative" }}>
                    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:10 }}>
                      <card.Illustration/>
                    </div>
                    {/* Label — solid dark navy block */}
                    <div style={{ backgroundColor:"#25283D", padding:"5px 8px 6px" }}>
                      <p style={{ fontSize:12, fontWeight:800, color:"#FFFDF7", fontFamily:F, textAlign:"center", lineHeight:1.1 }}>
                        {card.label}
                      </p>
                    </div>
                    {/* Match check badge */}
                    {isMatched && (
                      <div style={{
                        position:"absolute", top:6, right:6, width:22, height:22, borderRadius:"50%",
                        backgroundColor:"#8B7BC8", display:"flex", alignItems:"center", justifyContent:"center",
                        boxShadow:"0 2px 8px rgba(139,123,200,0.55)",
                      }}>
                        <svg viewBox="0 0 14 14" fill="none" style={{ width:13, height:13 }}>
                          <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Card back */
                  <MMCardBack variant={idx}/>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── "Amazing Match!" popup overlay ── */}
      {matchPopup && (
        <div style={{
          position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
          backgroundColor:"rgba(229,242,248,0.5)", backdropFilter:"blur(3px)",
          zIndex:50, pointerEvents:"none",
        }}>
          <div className="mm-popup"
            style={{
              backgroundColor:"#FFFDF7", borderRadius:28,
              padding:"24px 32px", textAlign:"center",
              boxShadow:"0 16px 48px rgba(139,123,200,0.28), 0 4px 16px rgba(37,40,61,0.1)",
              border:"2px solid #DCD8F5",
              maxWidth:260,
            }}>
            <div style={{ fontSize:44, lineHeight:1, marginBottom:8 }}>🎉</div>
            <p style={{ fontSize:22, fontWeight:900, color:"#8B7BC8", fontFamily:F, marginBottom:4 }}>
              Amazing Match!
            </p>
            <p style={{ fontSize:15, fontWeight:700, color:"#25283D", opacity:0.75, fontFamily:F, marginBottom:6 }}>
              You found a pair!
            </p>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:6, padding:"6px 14px",
              backgroundColor:"#DCD8F5", borderRadius:20,
            }}>
              <svg viewBox="0 0 16 16" fill="none" style={{ width:14, height:14 }}>
                <path d="M8 1L9.8 5.5L14.5 6L11 9.2L12 14L8 11.7L4 14L5 9.2L1.5 6L6.2 5.5Z"
                  fill="#8B7BC8"/>
              </svg>
              <span style={{ fontSize:13, fontWeight:800, color:"#8B7BC8", fontFamily:F }}>{lastMatchedPair}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Screen: MM Result ───────────────────────────────────────────────────────

function MMResultScreen({ moves, onPlayAgain, onHome }: {
  moves: number; onPlayAgain: ()=>void; onHome: ()=>void;
}) {
  const totalPairs = MM_PAIRS.length;
  const stars = moves <= totalPairs + 2 ? 3 : moves <= totalPairs * 2 ? 2 : 1;
  const cfg = stars === 3
    ? { emoji:"🏆", title:"Great job! 🎉",   msg:"You matched all the pairs with excellent memory!" }
    : stars === 2
    ? { emoji:"⭐", title:"Well Done!",       msg:"You matched all the pairs! Try again for a perfect score." }
    : { emoji:"💪", title:"Good Effort!",    msg:"You found all the pairs! Every game makes your memory stronger." };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor:"transparent" }}>
      {/* Hero — soft lavender gradient matching app palette */}
      <div style={{ background:"linear-gradient(150deg,#8B7BC8 0%,#9BACD8 55%,#9FD5E8 100%)",
                    flexShrink:0, borderRadius:"0 0 36px 36px", paddingBottom:28 }}>
        <StatusBar light/>
        <div className="flex flex-col items-center px-6 pt-2 gap-3">
          <MMMascot happy matched={totalPairs}/>

          <div style={{
            width:80, height:80, borderRadius:"50%",
            backgroundColor:"rgba(255,255,255,0.25)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:40, boxShadow:"0 8px 28px rgba(0,0,0,0.12)",
          }}>{cfg.emoji}</div>

          {/* Stars */}
          <div style={{ display:"flex", gap:6 }}>
            {[1,2,3].map(s=>(
              <svg key={s} viewBox="0 0 30 30" fill="none" style={{ width:34, height:34 }}>
                <path d="M15 2L18 9.5L26.5 10.5L20.5 16L22.5 25L15 21L7.5 25L9.5 16L3.5 10.5L12 9.5Z"
                  fill={s<=stars?"rgba(255,255,255,0.95)":"rgba(255,255,255,0.22)"}
                  stroke={s<=stars?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.2)"} strokeWidth="1.2"/>
              </svg>
            ))}
          </div>

          <div className="text-center">
            <h1 style={{ fontSize:26, fontWeight:900, color:"white", fontFamily:F }}>{cfg.title}</h1>
            <p style={{ fontSize:14, fontWeight:600, color:"rgba(255,255,255,0.8)", fontFamily:F, marginTop:4, lineHeight:1.55, maxWidth:270 }}>
              {cfg.msg}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { val:`${moves}`, label:"Total Moves", icon:"🎴", color:"#8B7BC8", bg:"#F0ECFD" },
            { val:`${totalPairs}/${totalPairs}`, label:"Pairs Found", icon:"🎊", color:"#4BAAC8", bg:"#E5F2F8" },
          ].map(({ val,label,icon,color,bg }) => (
            <div key={label} className="rounded-3xl flex flex-col items-center py-5 gap-1"
              style={{ backgroundColor:bg, boxShadow:"0 4px 18px rgba(37,40,61,0.10), 0 1px 4px rgba(37,40,61,0.05)" }}>
              <span style={{ fontSize:22 }}>{icon}</span>
              <p style={{ fontSize:26, fontWeight:900, color, fontFamily:F }}>{val}</p>
              <p style={{ fontSize:12, fontWeight:700, color:"#25283D", opacity:0.5, fontFamily:F }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Stars earned card */}
        <div className="rounded-3xl p-4 mb-4 text-center"
          style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 18px rgba(37,40,61,0.10), 0 1px 4px rgba(37,40,61,0.05)" }}>
          <p style={{ fontSize:13, fontWeight:800, color:"#25283D", opacity:0.45, fontFamily:F, marginBottom:12, textTransform:"uppercase", letterSpacing:0.5 }}>Stars earned</p>
          <div className="flex justify-center gap-3">
            {[1,2,3].map(s=>(
              <svg key={s} viewBox="0 0 36 36" fill="none" style={{ width:42, height:42 }}>
                <path d="M18 3L22 12.5L32.5 13.8L24.5 21.5L26.8 32L18 27L9.2 32L11.5 21.5L3.5 13.8L14 12.5Z"
                  fill={s<=stars?"#8B7BC8":"#DCD8F5"}
                  stroke={s<=stars?"#8B7BC8":"#DCD8F5"} strokeWidth="1"/>
              </svg>
            ))}
          </div>
          <p style={{ fontSize:15, fontWeight:700, color:"#25283D", fontFamily:F, marginTop:10 }}>
            {stars===3?"Perfect score!":stars===2?"Keep practising!":"You can do it!"}
          </p>
        </div>

        {/* Pair preview */}
        <p style={{ fontSize:12, fontWeight:800, color:"#25283D", opacity:0.4, fontFamily:F, marginBottom:10, textTransform:"uppercase", letterSpacing:0.5 }}>
          All pairs matched
        </p>
        <div className="grid grid-cols-6 gap-2 mb-4">
          {MM_PAIRS.map(p=>(
            <div key={p.pairId} className="rounded-2xl overflow-hidden"
              style={{ border:"2px solid #8B7BC8", boxShadow:"0 2px 8px rgba(139,123,200,0.2)" }}>
              <div style={{ backgroundColor:p.frontBg, aspectRatio:"1", display:"flex", alignItems:"center", justifyContent:"center", padding:5 }}>
                <p.Illustration/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex-shrink-0 px-5 pb-8 pt-3 flex flex-col gap-3"
        style={{ background:"linear-gradient(to top, #E5F2F8 70%, transparent)" }}>
        <button onClick={onPlayAgain}
          className="w-full rounded-3xl font-800 text-white transition-all active:scale-95"
          style={{ padding:"17px 0", fontSize:18, background:"linear-gradient(135deg,#8B7BC8,#A594DC)",
                   boxShadow:"0 8px 28px rgba(139,123,200,0.45)", fontFamily:F }}>
          Play Again 🔄
        </button>
        <button onClick={onHome}
          className="w-full rounded-3xl font-700 transition-all active:scale-95"
          style={{ padding:"14px 0", fontSize:16, backgroundColor:"white",
                   color:"#25283D", opacity:0.85,
                   boxShadow:"0 2px 12px rgba(37,40,61,0.1)", fontFamily:F }}>
          Back to Games
        </button>
      </div>
    </div>
  );
}


export { MMGameScreen, MMResultScreen, MMCardBack };
