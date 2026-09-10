import { useState, useEffect, useCallback, type ReactElement } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen =
  | "splash" | "role" | "elder-setup" | "home"
  | "mr-intro" | "mr-remember" | "mr-recall" | "mr-result"
  | "gr-intro" | "gr-remember" | "gr-recall" | "gr-result"
  | "mm-game" | "mm-result"
  | "caregiver-setup" | "caregiver";

interface CaregiverProfile { name: string; language: string; selectedPatientId: string; patientThemes: string[]; }
interface Patient { id: string; name: string; age: string; relation: string; avatar: string; statusNote: string; statusColor: string; statusBg: string; }
type CGTab = "overview" | "progress" | "care" | "settings";

interface ElderProfile { name: string; age: string; language: string; pin: string; voice: boolean; }
interface GameObject   { id: string; label: string; correct: boolean; bg: string; accent: string; Illustration: () => ReactElement; }

const REMEMBER_SECONDS = 15;
const F = "'Nunito', sans-serif";

// ─── Personalisation: care themes ─────────────────────────────────────────────
const CARE_THEMES = [
  { id:"Cooking",    label:"Cooking",    emoji:"🍳" },
  { id:"Farming",    label:"Farming",    emoji:"🌾" },
  { id:"Gardening",  label:"Gardening",  emoji:"🌱" },
  { id:"Festivals",  label:"Festivals",  emoji:"🪔" },
  { id:"Animals",    label:"Animals",    emoji:"🐄" },
  { id:"Household",  label:"Household",  emoji:"🏠" },
  { id:"Profession", label:"Profession", emoji:"📚" },
] as const;

// ─── NER Cultural Background ──────────────────────────────────────────────────
// Subtle North Eastern Indian embroidery/textile motifs — gamosa diamond,
// bamboo sprig, 8-petal folk flower, tea leaves, mountain silhouette, cross-stitch.

function NERBackground() {
  return (
    <svg
      aria-hidden="true"
      style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="ner-motif" x="0" y="0" width="240" height="240" patternUnits="userSpaceOnUse">

          {/* ── Gamosa diamond & crosshair ── */}
          <path d="M36 18L54 36L36 54L18 36Z"
            stroke="rgba(139,123,200,.08)" fill="none" strokeWidth="1"/>
          <line x1="18" y1="36" x2="54" y2="36"
            stroke="rgba(139,123,200,.07)" strokeWidth=".9"/>
          <line x1="36" y1="18" x2="36" y2="54"
            stroke="rgba(139,123,200,.07)" strokeWidth=".9"/>
          <circle cx="18" cy="36" r="2.2" fill="rgba(139,123,200,.09)"/>
          <circle cx="54" cy="36" r="2.2" fill="rgba(139,123,200,.09)"/>
          <circle cx="36" cy="18" r="2.2" fill="rgba(139,123,200,.09)"/>
          <circle cx="36" cy="54" r="2.2" fill="rgba(139,123,200,.09)"/>
          <circle cx="36" cy="36" r="1.5" fill="rgba(139,123,200,.11)"/>
          <circle cx="29" cy="36" r="1.1" fill="rgba(139,123,200,.07)"/>
          <circle cx="43" cy="36" r="1.1" fill="rgba(139,123,200,.07)"/>
          <circle cx="36" cy="29" r="1.1" fill="rgba(139,123,200,.07)"/>
          <circle cx="36" cy="43" r="1.1" fill="rgba(139,123,200,.07)"/>

          {/* ── Bamboo sprig ── */}
          <line x1="196" y1="6" x2="196" y2="58"
            stroke="rgba(139,123,200,.05)" strokeWidth=".9"/>
          <path d="M196 22Q179 14 181 27Q183 38 196 33Z"
            stroke="rgba(139,123,200,.07)" fill="rgba(159,213,232,.06)" strokeWidth=".8"/>
          <path d="M196 40Q213 32 211 45Q209 56 196 50Z"
            stroke="rgba(139,123,200,.07)" fill="rgba(159,213,232,.06)" strokeWidth=".8"/>
          <line x1="193" y1="25" x2="185" y2="29"
            stroke="rgba(139,123,200,.04)" strokeWidth=".5"/>
          <line x1="199" y1="43" x2="207" y2="47"
            stroke="rgba(139,123,200,.04)" strokeWidth=".5"/>

          {/* ── 8-petal folk flower ── */}
          {[0,45,90,135,180,225,270,315].map(a => (
            <ellipse key={a} cx={122} cy={116} rx={2.8} ry={7}
              transform={`rotate(${a} 122 123)`}
              stroke="rgba(220,216,245,.11)" fill="rgba(220,216,245,.07)" strokeWidth=".7"/>
          ))}
          <circle cx="122" cy="123" r="4.5" fill="rgba(220,216,245,.18)"/>
          <circle cx="122" cy="123" r="2" fill="rgba(139,123,200,.13)"/>

          {/* ── Tea leaf cluster ── */}
          <ellipse cx="56" cy="194" rx="6.5" ry="2.2" transform="rotate(-42 56 194)"
            stroke="rgba(159,213,232,.09)" fill="rgba(159,213,232,.06)" strokeWidth=".8"/>
          <ellipse cx="69" cy="189" rx="6.5" ry="2.2" transform="rotate(-8 69 189)"
            stroke="rgba(159,213,232,.09)" fill="rgba(159,213,232,.06)" strokeWidth=".8"/>
          <ellipse cx="80" cy="196" rx="6.5" ry="2.2" transform="rotate(-32 80 196)"
            stroke="rgba(159,213,232,.09)" fill="rgba(159,213,232,.06)" strokeWidth=".8"/>
          <path d="M64 199Q69 196 74 199" stroke="rgba(159,213,232,.07)" fill="none" strokeWidth=".6"/>

          {/* ── Mountain silhouettes ── */}
          <path d="M82 234L112 198L142 234Z"
            stroke="rgba(139,123,200,.045)" fill="rgba(139,123,200,.022)" strokeWidth=".7"/>
          <path d="M126 234L156 207L186 234Z"
            stroke="rgba(139,123,200,.038)" fill="rgba(139,123,200,.016)" strokeWidth=".7"/>

          {/* ── Gamosa edge dots (top) ── */}
          <circle cx="10"  cy="9" r="2.2" fill="rgba(248,216,204,.13)"/>
          <circle cx="20"  cy="9" r="2.2" fill="rgba(248,216,204,.13)"/>
          <circle cx="30"  cy="9" r="2.2" fill="rgba(248,216,204,.13)"/>
          <circle cx="100" cy="9" r="2"   fill="rgba(248,216,204,.10)"/>
          <circle cx="110" cy="9" r="2"   fill="rgba(248,216,204,.10)"/>
          <circle cx="186" cy="9" r="2"   fill="rgba(248,216,204,.10)"/>
          <circle cx="196" cy="9" r="2"   fill="rgba(248,216,204,.10)"/>

          {/* ── Cross-stitch embroidery marks ── */}
          <path d="M196 178L202 184M202 178L196 184"
            stroke="rgba(233,197,208,.13)" strokeWidth=".9" strokeLinecap="round"/>
          <path d="M210 182L216 188M216 182L210 188"
            stroke="rgba(233,197,208,.13)" strokeWidth=".9" strokeLinecap="round"/>
          <path d="M202 192L208 198M208 192L202 198"
            stroke="rgba(233,197,208,.13)" strokeWidth=".9" strokeLinecap="round"/>

        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ner-motif)"/>
    </svg>
  );
}
const LANGUAGES = ["English","Hindi","Tamil","Telugu","Kannada","Malayalam","Bengali","Gujarati"];

const today = new Date().toLocaleDateString("en-US",{ weekday:"long", month:"long", day:"numeric" });
const timeStr = new Date().toLocaleTimeString("en-US",{ hour:"2-digit", minute:"2-digit", hour12: false });

const activities = [
  { id:1, label:"Memory Recall Game", time:"5 min",   icon:"🧠", accent:"#8B7BC8", bg:"#F0ECFD" },
  { id:2, label:"Morning Medicine",   time:"8:00 AM",  icon:"💊", accent:"#E9A080", bg:"#FFF0EA" },
  { id:3, label:"Drink Water",        time:"10:00 AM", icon:"💧", accent:"#5BBCD6", bg:"#E5F6FC" },
  { id:4, label:"Evening Walk",       time:"6:00 PM",  icon:"🚶", accent:"#C97A96", bg:"#FCEEF3" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length-1; i>0; i--) { const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}

// ─── SVG Illustrations ────────────────────────────────────────────────────────

function TeaCupSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="70" rx="24" ry="6" fill="#E9C5D0" opacity="0.35"/>
      <path d="M16 34 L21 63 Q21 67 25 67 L55 67 Q59 67 59 63 L64 34Z" fill="#FFF8F0" stroke="#F0D8C8" strokeWidth="1.5"/>
      <path d="M64 40 Q78 40 78 52 Q78 64 64 64" stroke="#E9C5D0" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="40" cy="69" rx="28" ry="5.5" fill="#F8D8CC"/>
      <ellipse cx="40" cy="69" rx="21" ry="3.5" fill="#FFF8F0"/>
      <path d="M21 44 Q40 49 59 44" stroke="#C8956C" strokeWidth="1.5" opacity="0.45" fill="none"/>
      <path d="M28 28 Q30 21 28 14" stroke="#9FD5E8" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.7"/>
      <path d="M40 26 Q42 19 40 12" stroke="#9FD5E8" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.7"/>
      <path d="M52 28 Q54 21 52 14" stroke="#9FD5E8" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.7"/>
    </svg>
  );
}

function KeysSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="38" cy="72" rx="24" ry="5" fill="#DCD8F5" opacity="0.4"/>
      <circle cx="30" cy="30" r="15" stroke="#8B7BC8" strokeWidth="4.5" fill="#F0ECFD"/>
      <circle cx="30" cy="30" r="7.5" stroke="#8B7BC8" strokeWidth="2.5" fill="#FFFDF7"/>
      <rect x="41" y="27.5" width="30" height="5.5" rx="2.75" fill="#8B7BC8"/>
      <rect x="60" y="33" width="5" height="8" rx="2" fill="#8B7BC8"/>
      <rect x="50" y="33" width="4.5" height="5.5" rx="1.5" fill="#8B7BC8"/>
      <circle cx="27" cy="26" r="3" fill="white" opacity="0.7"/>
    </svg>
  );
}

function AppleSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="70" rx="22" ry="5.5" fill="#E9C5D0" opacity="0.4"/>
      <path d="M40 22 C27 22 15 33 15 49 C15 62 23 69 32 69 C36 69 38 67 40 67 C42 67 44 69 48 69 C57 69 65 62 65 49 C65 33 53 22 40 22Z" fill="#FFCFC0"/>
      <path d="M34 22 C36 17 38 15 40 15" stroke="#F0A898" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="29" cy="37" rx="6" ry="10" fill="white" opacity="0.35" transform="rotate(-20 29 37)"/>
      <path d="M40 15 C40 9 45 5 49 7" stroke="#8B7BC8" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M40 13 C44 7 52 7 50 14 C48 19 40 16 40 13Z" fill="#9FD5E8" opacity="0.85"/>
      <circle cx="25" cy="50" r="5.5" fill="#F0A898" opacity="0.5"/>
    </svg>
  );
}

function SpectaclesSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="24" ry="4.5" fill="#9FD5E8" opacity="0.3"/>
      <rect x="5" y="28" width="28" height="22" rx="11" fill="#E0F4FC" stroke="#2E3250" strokeWidth="2.5" opacity="0.85"/>
      <rect x="47" y="28" width="28" height="22" rx="11" fill="#E0F4FC" stroke="#2E3250" strokeWidth="2.5" opacity="0.85"/>
      <path d="M33 39 L47 39" stroke="#2E3250" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
      <path d="M5 39 L0 41" stroke="#2E3250" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
      <path d="M75 39 L80 41" stroke="#2E3250" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
      <circle cx="16" cy="35" r="3.5" fill="white" opacity="0.7"/>
      <circle cx="58" cy="35" r="3.5" fill="white" opacity="0.7"/>
    </svg>
  );
}

function BookSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="22" ry="4.5" fill="#F8D8CC" opacity="0.4"/>
      <rect x="15" y="18" width="50" height="52" rx="5" fill="#F8D8CC"/>
      <rect x="15" y="18" width="10" height="52" rx="5" fill="#E9C5D0"/>
      <path d="M30 30 L57 30 M30 39 L57 39 M30 48 L52 48" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.8"/>
      <rect x="15" y="62" width="50" height="8" rx="4" fill="#E9C5D0" opacity="0.6"/>
    </svg>
  );
}

function FlowerSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="70" rx="14" ry="4" fill="#E9C5D0" opacity="0.4"/>
      <path d="M40 58 L40 72" stroke="#A8D8C0" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M36 65 C30 63 27 58 32 56" stroke="#A8D8C0" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      {[0,60,120,180,240,300].map((deg,i)=>(
        <ellipse key={i}
          cx={40+15*Math.cos((deg*Math.PI)/180)} cy={38+15*Math.sin((deg*Math.PI)/180)}
          rx="9" ry="5.5" fill="#E9C5D0"
          transform={`rotate(${deg} ${40+15*Math.cos((deg*Math.PI)/180)} ${38+15*Math.sin((deg*Math.PI)/180)})`}
          opacity="0.9"/>
      ))}
      <circle cx="40" cy="38" r="10" fill="#F8D8CC"/>
      <circle cx="40" cy="38" r="5.5" fill="#FFF8F5"/>
    </svg>
  );
}

function ClockSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="70" rx="20" ry="4.5" fill="#DCD8F5" opacity="0.4"/>
      <circle cx="40" cy="40" r="25" fill="#FFFDF7" stroke="#DCD8F5" strokeWidth="3"/>
      <circle cx="40" cy="40" r="21" fill="#F0ECFD" opacity="0.35"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg,i)=>(
        <line key={i}
          x1={40+18*Math.cos(((deg-90)*Math.PI)/180)} y1={40+18*Math.sin(((deg-90)*Math.PI)/180)}
          x2={40+(i%3===0?22:21)*Math.cos(((deg-90)*Math.PI)/180)} y2={40+(i%3===0?22:21)*Math.sin(((deg-90)*Math.PI)/180)}
          stroke="#8B7BC8" strokeWidth={i%3===0?2:1} opacity="0.55"/>
      ))}
      <line x1="40" y1="40" x2="40" y2="24" stroke="#25283D" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
      <line x1="40" y1="40" x2="51" y2="45" stroke="#8B7BC8" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="40" cy="40" r="3" fill="#8B7BC8"/>
    </svg>
  );
}

function UmbrellaSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="72" rx="17" ry="4.5" fill="#9FD5E8" opacity="0.4"/>
      <path d="M14 40 C14 22 66 22 66 40Z" fill="#9FD5E8"/>
      <path d="M14 40 C14 22 40 18 40 40Z" fill="#DCD8F5" opacity="0.6"/>
      <path d="M66 40 C66 22 40 18 40 40Z" fill="#DCD8F5" opacity="0.4"/>
      <path d="M27 40 C27 22 40 18 40 40Z" fill="white" opacity="0.2"/>
      <line x1="40" y1="40" x2="40" y2="67" stroke="#25283D" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
      <path d="M40 67 C40 72 35 74 35 69" stroke="#25283D" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="40" cy="20" r="2.5" fill="#8B7BC8" opacity="0.6"/>
    </svg>
  );
}

const ALL_OBJECTS: GameObject[] = [
  { id:"teacup",     label:"Tea Cup",    correct:true,  bg:"#FFF3EC", accent:"#E9A080", Illustration:TeaCupSVG     },
  { id:"keys",       label:"Keys",       correct:true,  bg:"#F0ECFD", accent:"#8B7BC8", Illustration:KeysSVG       },
  { id:"apple",      label:"Apple",      correct:true,  bg:"#FFF0F4", accent:"#D96B8A", Illustration:AppleSVG      },
  { id:"spectacles", label:"Spectacles", correct:true,  bg:"#E8F5FC", accent:"#4BAAC8", Illustration:SpectaclesSVG },
  { id:"book",       label:"Book",       correct:false, bg:"#FFF4EE", accent:"#E9A080", Illustration:BookSVG       },
  { id:"flower",     label:"Flower",     correct:false, bg:"#FFF0F4", accent:"#D96B8A", Illustration:FlowerSVG     },
  { id:"clock",      label:"Clock",      correct:false, bg:"#F0ECFD", accent:"#8B7BC8", Illustration:ClockSVG      },
  { id:"umbrella",   label:"Umbrella",   correct:false, bg:"#E8F5FC", accent:"#4BAAC8", Illustration:UmbrellaSVG   },
];

const GR_SECONDS = 20;

// ─── Grocery SVG Illustrations ───────────────────────────────────────────────

function RiceSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="26" ry="7" fill="#E9C5D0" opacity="0.3"/>
      <path d="M14 48 L20 62 Q20 66 25 66 L55 66 Q60 66 60 62 L66 48Z" fill="#FFFDF7" stroke="#E8E4D8" strokeWidth="1.5"/>
      <ellipse cx="40" cy="48" rx="26" ry="8" fill="#F5F2E8"/>
      <ellipse cx="40" cy="46" rx="22" ry="6" fill="#FFFDF7"/>
      {[34,38,42,46,36,44,40].map((x,i)=>(
        <ellipse key={i} cx={x} cy={44+(i%3)*3} rx="2.5" ry="1.5" fill="#F5F2E8" stroke="#E8E0C8" strokeWidth="0.8" transform={`rotate(${i*25} ${x} ${44+(i%3)*3})`}/>
      ))}
      <path d="M28 38 Q28 30 32 26 Q40 20 48 26 Q52 30 52 38" fill="#E8DCC0" stroke="#D4C898" strokeWidth="1.5"/>
      <ellipse cx="40" cy="39" rx="12" ry="5" fill="#F0E8D0"/>
    </svg>
  );
}

function PotatoSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="22" ry="5.5" fill="#E9C5D0" opacity="0.3"/>
      <path d="M18 42 C18 28 26 20 40 20 C54 20 62 28 62 42 C62 56 54 64 40 64 C26 64 18 56 18 42Z" fill="#D4B878"/>
      <path d="M18 42 C18 28 26 20 40 20 C54 20 62 28 62 42" fill="#C8A860" opacity="0.4"/>
      <circle cx="28" cy="38" r="3" fill="#B89448" opacity="0.6"/>
      <circle cx="50" cy="44" r="2.5" fill="#B89448" opacity="0.5"/>
      <circle cx="38" cy="52" r="2" fill="#B89448" opacity="0.45"/>
      <circle cx="24" cy="48" r="2" fill="#B89448" opacity="0.4"/>
      <circle cx="32" cy="26" r="4" fill="#C8A860" opacity="0.6"/>
      <ellipse cx="30" cy="30" r="4" fill="#E8D090" opacity="0.4"/>
    </svg>
  );
}

function OnionSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="20" ry="5" fill="#E9C5D0" opacity="0.3"/>
      <path d="M20 48 C20 34 28 22 40 22 C52 22 60 34 60 48 C60 60 52 66 40 66 C28 66 20 60 20 48Z" fill="#C870A0"/>
      <path d="M20 48 C20 34 28 22 40 22" fill="none" stroke="#B05888" strokeWidth="2" opacity="0.5"/>
      <path d="M25 35 C28 28 34 24 40 24 C46 24 52 28 55 35" stroke="#E898C0" strokeWidth="2" fill="none" opacity="0.6"/>
      <path d="M23 43 C24 36 30 28 40 27 C50 28 56 36 57 43" stroke="#E898C0" strokeWidth="1.5" fill="none" opacity="0.4"/>
      <path d="M36 20 Q38 14 40 10 Q42 14 44 20" stroke="#88B858" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <circle cx="40" cy="10" r="3.5" fill="#70A040"/>
    </svg>
  );
}

function TomatoSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="21" ry="5" fill="#E9C5D0" opacity="0.3"/>
      <path d="M18 44 C18 30 26 20 40 20 C54 20 62 30 62 44 C62 58 54 66 40 66 C26 66 18 58 18 44Z" fill="#E84848"/>
      <path d="M18 44 C18 30 26 20 40 20 C54 20 62 30 62 44" fill="#F06060" opacity="0.35"/>
      <ellipse cx="30" cy="32" r="8" fill="#F07070" opacity="0.3"/>
      <path d="M36 19 L34 10 M40 18 L40 9 M44 19 L46 10" stroke="#5C9830" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M32 13 Q40 8 48 13" stroke="#5C9830" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function PeasSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="22" ry="5" fill="#E9C5D0" opacity="0.3"/>
      <path d="M12 40 C14 28 22 22 40 22 C58 22 66 28 68 40 C66 52 58 58 40 58 C22 58 14 52 12 40Z" fill="#88C848"/>
      <path d="M14 40 C14 30 22 24 40 24 C58 24 66 30 66 40" fill="#A8D868" opacity="0.5"/>
      {[24,33,40,47,56].map((cx,i)=>(
        <circle key={i} cx={cx} cy={40} r={i===0||i===4?7:9} fill="#60B030"/>
      ))}
      {[24,33,40,47,56].map((cx,i)=>(
        <circle key={i} cx={cx-1} cy={38} r={3} fill="#88D050" opacity="0.6"/>
      ))}
      <path d="M12 40 Q12 35 16 33" stroke="#70A030" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
      <path d="M68 40 Q68 35 64 33" stroke="#70A030" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
    </svg>
  );
}

function SpicesSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="22" ry="5" fill="#E9C5D0" opacity="0.3"/>
      <rect x="24" y="32" width="32" height="32" rx="8" fill="#E8782A"/>
      <ellipse cx="40" cy="32" rx="16" ry="6" fill="#D86018"/>
      <ellipse cx="40" cy="32" rx="12" ry="4" fill="#F09040"/>
      <path d="M28 44 L52 44 M28 52 L52 52" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="34" y="20" width="12" height="14" rx="4" fill="#C05010"/>
      <ellipse cx="40" cy="20" rx="6" ry="3" fill="#D86018"/>
      <circle cx="40" cy="48" r="6" fill="rgba(255,255,255,0.15)"/>
      <path d="M37 48 L39 50 L43 45" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
    </svg>
  );
}

function CarrotSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="18" ry="5" fill="#E9C5D0" opacity="0.3"/>
      <path d="M36 22 L44 22 L52 60 Q52 66 40 66 Q28 66 28 60Z" fill="#F07830"/>
      <path d="M36 22 L44 22 L38 60 Q32 60 28 60Z" fill="#F89050" opacity="0.5"/>
      <path d="M38 32 L34 42 M40 38 L38 48 M42 28 L40 38" stroke="#E06010" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M30 20 Q33 14 36 20 M40 18 Q40 12 40 18 M44 20 Q47 14 50 20" stroke="#68B030" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function BananaSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="20" ry="5" fill="#E9C5D0" opacity="0.3"/>
      <path d="M22 54 C18 40 24 22 38 16 C52 10 62 18 62 32 C62 38 58 44 52 48" stroke="#F0C820" strokeWidth="14" strokeLinecap="round" fill="none"/>
      <path d="M22 54 C18 40 24 22 38 16 C52 10 62 18 62 32 C62 38 58 44 52 48" stroke="#F8D840" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.6"/>
      <circle cx="22" cy="54" r="5" fill="#C89010"/>
      <circle cx="52" cy="48" r="4" fill="#C89010"/>
    </svg>
  );
}

function BreadSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="24" ry="5.5" fill="#E9C5D0" opacity="0.3"/>
      <rect x="14" y="40" width="52" height="24" rx="8" fill="#D8943A"/>
      <path d="M14 44 Q40 36 66 44" fill="#F0B050" opacity="0.6"/>
      <path d="M20 32 C20 22 28 18 40 18 C52 18 60 22 60 32 C60 38 54 42 40 42 C26 42 20 38 20 32Z" fill="#E8A040"/>
      <path d="M20 34 C24 28 32 24 40 24 C48 24 56 28 60 34" fill="#F0B858" opacity="0.5"/>
      <path d="M28 50 L52 50 M26 57 L54 57" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function EggSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="18" ry="5" fill="#E9C5D0" opacity="0.3"/>
      <path d="M22 46 C22 28 30 14 40 14 C50 14 58 28 58 46 C58 58 50 66 40 66 C30 66 22 58 22 46Z" fill="#F8F0E0"/>
      <path d="M22 46 C22 28 30 14 40 14 C50 14 58 28 58 46" fill="#FFFDF7" opacity="0.6"/>
      <ellipse cx="36" cy="34" rx="8" ry="10" fill="white" opacity="0.5"/>
    </svg>
  );
}

function MilkSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="20" ry="5" fill="#E9C5D0" opacity="0.3"/>
      <rect x="24" y="36" width="32" height="28" rx="8" fill="#E8F4FC"/>
      <rect x="26" y="34" width="28" height="6" rx="4" fill="#C8E8F8"/>
      <rect x="30" y="26" width="20" height="12" rx="4" fill="#D8F0FC"/>
      <ellipse cx="40" cy="26" rx="10" ry="4" fill="#E8F8FF"/>
      <path d="M28 48 Q40 44 52 48" stroke="#9FD5E8" strokeWidth="2" fill="none" opacity="0.6"/>
      <rect x="32" y="44" width="16" height="10" rx="4" fill="white" opacity="0.4"/>
    </svg>
  );
}


// ─── Content Library Illustrations ───────────────────────────────────────────

function DalSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="24" ry="6" fill="#E9C5D0" opacity="0.3"/>
      <path d="M16 46 L20 60 Q20 66 40 66 Q60 66 60 60 L64 46 Z" fill="#D88040"/>
      <ellipse cx="40" cy="46" rx="24" ry="8" fill="#E89048"/>
      <ellipse cx="40" cy="44" rx="20" ry="6" fill="#F4A858"/>
      {[32,38,44,50,35,41,47,38,44].map((x,i)=>(
        <ellipse key={i} cx={x} cy={38+(i%3)*4} rx="2.8" ry="2" fill="#E8C060" opacity="0.85"/>
      ))}
    </svg>
  );
}
function FishSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="20" ry="5" fill="#E9C5D0" opacity="0.3"/>
      <path d="M60 18 L70 28 L60 38 Z" fill="#4898C8"/>
      <path d="M18 28 C18 18 28 12 44 16 C60 20 66 26 62 32 C58 38 50 44 36 44 C22 44 18 38 18 28 Z" fill="#5AAAD8"/>
      <path d="M20 24 C22 18 30 14 44 16 C56 18 62 24 60 28" fill="#82C4E8" opacity="0.45"/>
      <circle cx="28" cy="24" r="4" fill="#25283D"/>
      <circle cx="29.5" cy="22.5" r="1.8" fill="white" opacity="0.8"/>
      <path d="M38 30 C42 28 50 29 54 32 M36 36 C40 34 48 35 52 38" stroke="#3888B8" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.5"/>
    </svg>
  );
}
function MangoSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="20" ry="5" fill="#E9C5D0" opacity="0.3"/>
      <path d="M22 44 C20 28 28 12 40 10 C52 10 58 24 56 42 C54 56 48 66 40 66 C30 66 24 58 22 44 Z" fill="#F0B020"/>
      <path d="M24 38 C24 24 30 14 40 12 C50 12 56 24 54 40" fill="#F8C838" opacity="0.4"/>
      <ellipse cx="32" cy="30" r="10" fill="#F8D040" opacity="0.28"/>
      <path d="M38 10 Q36 4 40 2 Q44 4 42 10" stroke="#5C9830" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M40 4 C38 0 30 0 28 6" stroke="#70B040" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
function MustardOilSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="18" ry="5" fill="#E9C5D0" opacity="0.3"/>
      <rect x="26" y="32" width="28" height="32" rx="8" fill="#E8C020"/>
      <rect x="28" y="30" width="24" height="8" rx="5" fill="#D0A810"/>
      <rect x="32" y="22" width="16" height="12" rx="6" fill="#C89810"/>
      <ellipse cx="40" cy="22" rx="8" ry="4" fill="#D8A818"/>
      <rect x="30" y="42" width="20" height="14" rx="4" fill="rgba(255,255,255,0.2)"/>
      <path d="M30 36 Q40 32 50 36" stroke="#F8E050" strokeWidth="1.5" fill="none" opacity="0.5"/>
    </svg>
  );
}
function FlowerPotSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="22" ry="5.5" fill="#E9C5D0" opacity="0.3"/>
      <path d="M22 46 L26 66 Q26 68 40 68 Q54 68 54 66 L58 46 Z" fill="#C87040"/>
      <ellipse cx="40" cy="46" rx="18" ry="6" fill="#D88050"/>
      <path d="M40 44 L40 28" stroke="#60A030" strokeWidth="3" strokeLinecap="round"/>
      <path d="M40 38 C34 32 26 34 26 40 C32 40 38 36 40 38 Z" fill="#78C040" opacity="0.9"/>
      <path d="M40 30 C46 24 54 26 54 32 C48 32 42 28 40 30 Z" fill="#90D050" opacity="0.9"/>
      <circle cx="40" cy="26" r="6" fill="#F8A0B0"/>
      <circle cx="40" cy="26" r="3" fill="#F07090"/>
    </svg>
  );
}
function WateringCanSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="36" cy="70" rx="24" ry="5.5" fill="#E9C5D0" opacity="0.3"/>
      <path d="M14 44 L62 44 C64 44 66 46 66 50 L62 58 C60 62 20 62 18 58 L14 50 C14 46 14 44 14 44 Z" fill="#6AAAD8"/>
      <path d="M14 44 L62 44 C62 44 60 48 20 48 Z" fill="#82BEE8" opacity="0.4"/>
      <path d="M62 42 C70 36 72 30 72 26" stroke="#4888B8" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <ellipse cx="72" cy="25" rx="5" ry="4" fill="#3878A8"/>
      {[68,70,72,74].map((x,i)=>(
        <line key={i} x1={x} y1="29" x2={x+2} y2="37" stroke="#5AAAD8" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      ))}
      <path d="M18 38 C24 34 54 34 58 38" stroke="#4888B8" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
function SpadeSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="70" rx="14" ry="4" fill="#E9C5D0" opacity="0.3"/>
      <rect x="37" y="32" width="6" height="34" rx="3" fill="#9A6830"/>
      <rect x="32" y="60" width="16" height="6" rx="3" fill="#B88848"/>
      <path d="M26 16 C26 6 38 2 40 2 C42 2 54 6 54 16 C54 24 48 32 44 34 L40 36 L36 34 C32 32 26 24 26 16 Z" fill="#8898A8"/>
      <path d="M28 14 C28 8 34 4 40 4 C46 4 52 8 52 16" fill="#A8B8C8" opacity="0.5"/>
    </svg>
  );
}
function SeedsSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="22" ry="5.5" fill="#E9C5D0" opacity="0.3"/>
      <rect x="22" y="28" width="36" height="38" rx="8" fill="#E8C888"/>
      <rect x="22" y="28" width="36" height="10" rx="8" fill="#D8A848"/>
      <path d="M38 28 L42 28 L42 22 L38 22 Z" fill="#C89838"/>
      <ellipse cx="40" cy="22" rx="4" ry="3" fill="#B88828"/>
      {[30,36,42,48,33,39,45,37,43].map((x,i)=>(
        <ellipse key={i} cx={x} cy={42+(i%3)*5} rx="3.5" ry="2.5"
          fill="#B89040" transform={`rotate(${i*30} ${x} ${42+(i%3)*5})`}/>
      ))}
    </svg>
  );
}
function PlantSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="20" ry="5" fill="#E9C5D0" opacity="0.3"/>
      <path d="M24 50 L28 66 Q28 68 40 68 Q52 68 52 66 L56 50 Z" fill="#B86830"/>
      <ellipse cx="40" cy="50" rx="16" ry="5.5" fill="#C87840"/>
      <path d="M40 50 L40 28" stroke="#50A030" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M40 44 C36 36 26 34 24 40 C30 44 38 42 40 44 Z" fill="#68B840"/>
      <path d="M40 36 C44 28 54 26 56 32 C50 36 42 34 40 36 Z" fill="#80CC50"/>
      <path d="M40 28 C38 22 32 18 30 22 C34 26 40 26 40 28 Z" fill="#68B840"/>
    </svg>
  );
}
function GamosaItemSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="70" rx="26" ry="5.5" fill="#E9C5D0" opacity="0.3"/>
      <rect x="12" y="28" width="56" height="38" rx="6" fill="#D82820"/>
      <rect x="12" y="28" width="56" height="10" rx="6" fill="#FFFDF7"/>
      <rect x="12" y="56" width="56" height="10" rx="0 0 6 6" fill="#FFFDF7"/>
      {[20,28,36,44,52,60].map(x=>(
        <path key={x} d={`M ${x} 32 L ${x+3} 35 L ${x} 38 L ${x-3} 35 Z`} fill="#D82820" opacity="0.6"/>
      ))}
      {[20,28,36,44,52,60].map(x=>(
        <path key={x} d={`M ${x} 58 L ${x+3} 61 L ${x} 64 L ${x-3} 61 Z`} fill="#D82820" opacity="0.6"/>
      ))}
      <path d="M12 40 L68 40 M12 48 L68 48" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function DiyaSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="22" ry="5.5" fill="#E9C5D0" opacity="0.3"/>
      <path d="M18 54 C18 46 24 40 40 40 C56 40 62 46 62 54 L58 62 Q52 68 40 68 Q28 68 22 62 Z" fill="#C87828"/>
      <path d="M20 52 C20 46 26 42 40 42 C54 42 60 46 60 54" fill="#E09038" opacity="0.5"/>
      <ellipse cx="40" cy="42" rx="22" ry="6" fill="#D88830"/>
      <ellipse cx="40" cy="40" rx="16" ry="4.5" fill="#E8A040"/>
      <path d="M40 36 Q36 26 40 14 Q44 26 40 36 Z" fill="#F8B020"/>
      <path d="M40 36 Q37 28 40 20 Q43 28 40 36 Z" fill="#FFF0A0" opacity="0.8"/>
      <ellipse cx="40" cy="15" rx="3" ry="5" fill="#F8D040" opacity="0.6"/>
    </svg>
  );
}
function DholSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="70" rx="22" ry="5" fill="#E9C5D0" opacity="0.3"/>
      <rect x="14" y="30" width="52" height="36" rx="12" fill="#C87038"/>
      <ellipse cx="14" cy="48" rx="10" ry="18" fill="#D88848"/>
      <ellipse cx="66" cy="48" rx="10" ry="18" fill="#B86028"/>
      <ellipse cx="14" cy="48" rx="8" ry="15" fill="#E89C5C" opacity="0.6"/>
      <ellipse cx="66" cy="48" rx="8" ry="15" fill="#C87840" opacity="0.6"/>
      {[36,44,52].map(x=>(
        <line key={x} x1={x} y1="32" x2={x-3} y2="64" stroke="#A85820" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      ))}
      <rect x="16" y="26" width="48" height="8" rx="4" fill="#B86028"/>
      <rect x="16" y="62" width="48" height="8" rx="4" fill="#B86028"/>
    </svg>
  );
}
function LanternSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="70" rx="16" ry="4.5" fill="#E9C5D0" opacity="0.3"/>
      <rect x="37" y="12" width="6" height="8" rx="2" fill="#C89848"/>
      <path d="M34 12 Q40 8 46 12" stroke="#B88838" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M26 22 L54 22 L58 58 Q56 64 40 64 Q24 64 22 58 Z" fill="#E8A820"/>
      <path d="M26 22 L54 22 L52 30 L28 30 Z" fill="#F0C030" opacity="0.6"/>
      {[30,38,46,54].map(x=>(
        <path key={x} d={`M ${x} 24 L ${x-2} 58`} stroke="#D09018" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      ))}
      <ellipse cx="40" cy="44" rx="8" ry="12" fill="#FFF8D0" opacity="0.35"/>
      <path d="M40 44 Q37 36 40 28 Q43 36 40 44 Z" fill="#F8D040" opacity="0.65"/>
    </svg>
  );
}
function CowSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="28" ry="6" fill="#E9C5D0" opacity="0.3"/>
      <ellipse cx="40" cy="50" rx="26" ry="16" fill="#F0EEE8"/>
      <path d="M14 50 L14 64 Q14 68 20 68 L22 68 L22 56" fill="#F0EEE8"/>
      <path d="M66 50 L66 64 Q66 68 60 68 L58 68 L58 56" fill="#F0EEE8"/>
      <path d="M28 50 L28 64 Q28 68 32 68 L34 68 L34 56" fill="#F0EEE8"/>
      <path d="M52 50 L52 64 Q52 68 48 68 L46 68 L46 56" fill="#F0EEE8"/>
      <circle cx="40" cy="36" r="16" fill="#F0EEE8"/>
      <path d="M28 30 C26 22 22 18 24 14 C26 12 30 16 30 22" fill="#E0D8C8"/>
      <path d="M52 30 C54 22 58 18 56 14 C54 12 50 16 50 22" fill="#E0D8C8"/>
      <circle cx="34" cy="36" r="3.5" fill="#25283D"/>
      <circle cx="35.5" cy="34.5" r="1.5" fill="white" opacity="0.8"/>
      <circle cx="46" cy="36" r="3.5" fill="#25283D"/>
      <circle cx="47.5" cy="34.5" r="1.5" fill="white" opacity="0.8"/>
      <ellipse cx="40" cy="46" rx="8" ry="5" fill="#F8D8E0"/>
      <ellipse cx="30" cy="44" rx="7" ry="5" fill="#C0A868" opacity="0.45"/>
    </svg>
  );
}
function HenSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="70" rx="22" ry="5" fill="#E9C5D0" opacity="0.3"/>
      <ellipse cx="38" cy="52" rx="20" ry="16" fill="#D89040"/>
      <circle cx="44" cy="34" r="14" fill="#E8A040"/>
      <path d="M44 26 Q50 20 52 22 Q54 26 50 28" fill="#E84848"/>
      <path d="M44 22 Q40 16 42 14 Q46 14 46 18" fill="#E84848" opacity="0.7"/>
      <circle cx="50" cy="32" r="3.5" fill="#25283D"/>
      <circle cx="51.5" cy="30.5" r="1.5" fill="white" opacity="0.8"/>
      <path d="M54 38 L62 42 L54 44" fill="#E8A040"/>
      <path d="M22 64 L26 56 L30 64 M30 64 L34 56 L38 64" stroke="#E8C040" strokeWidth="4" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
function BirdSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="70" rx="18" ry="4.5" fill="#E9C5D0" opacity="0.3"/>
      <path d="M28 44 C20 38 16 28 22 22 C28 16 36 18 40 24 C44 18 52 16 58 22 C64 28 60 38 52 44 C48 47 44 48 40 48 C36 48 32 47 28 44 Z" fill="#5898C8"/>
      <path d="M28 44 C22 38 20 30 24 24 C28 18 36 18 40 24" fill="#78B0D8" opacity="0.4"/>
      <circle cx="40" cy="36" r="10" fill="#6AAAD8"/>
      <circle cx="44" cy="34" r="3.5" fill="#25283D"/>
      <circle cx="45.5" cy="32.5" r="1.5" fill="white" opacity="0.8"/>
      <path d="M48 40 L56 38 L50 42 Z" fill="#E8A020"/>
      <path d="M38 52 L36 62 L40 64 L44 62 L42 52" fill="#5898C8"/>
    </svg>
  );
}
function BroomSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="70" rx="18" ry="4.5" fill="#E9C5D0" opacity="0.3"/>
      <rect x="38" y="14" width="5" height="36" rx="2.5" fill="#9A6830"/>
      <path d="M22 50 C24 46 32 42 40.5 42 C49 42 58 46 58 50 L56 62 Q52 68 40 68 Q28 68 24 62 Z" fill="#C8A848"/>
      <path d="M22 50 C24 46 32 42 40.5 42 C49 42 58 46 58 50" fill="#E8C060" opacity="0.5"/>
      {[26,32,38,44,50,54].map(x=>(
        <path key={x} d={`M ${x} 50 L ${x-1} 64`} stroke="#B89840" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      ))}
      <rect x="34" y="46" width="13" height="4" rx="2" fill="#B88830"/>
    </svg>
  );
}
function KettleSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="22" ry="5.5" fill="#E9C5D0" opacity="0.3"/>
      <path d="M18 46 L62 46 Q66 48 66 54 L62 62 Q58 64 18 62 Q14 60 14 52 Z" fill="#8AAAD8"/>
      <path d="M20 46 Q40 40 60 46" fill="#A0C0E0" opacity="0.4"/>
      <path d="M62 44 C70 40 74 36 74 30" stroke="#6888B8" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <ellipse cx="40" cy="36" rx="12" ry="6" fill="#6888B8"/>
      <ellipse cx="40" cy="34" rx="10" ry="4.5" fill="#8AAAD8"/>
      <path d="M16 52 C14 44 14 36 16 30" stroke="#6888B8" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
function MatSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="72" rx="30" ry="5" fill="#E9C5D0" opacity="0.3"/>
      <rect x="8" y="28" width="64" height="40" rx="6" fill="#E8C060"/>
      <rect x="8" y="28" width="64" height="7" rx="6" fill="#B88830"/>
      <rect x="8" y="61" width="64" height="7" rx="3" fill="#B88830"/>
      {[36,43,50,57].map(y=>(
        <line key={y} x1="10" y1={y} x2="70" y2={y} stroke="#C89840" strokeWidth="1.5" opacity="0.5"/>
      ))}
      {[18,28,38,48,58].map(x=>(
        <line key={x} x1={x} y1="35" x2={x} y2="62" stroke="#C89840" strokeWidth="1.5" opacity="0.5"/>
      ))}
    </svg>
  );
}
function SchoolBagSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="68" rx="22" ry="5.5" fill="#E9C5D0" opacity="0.3"/>
      <path d="M34 18 L34 26 L46 26 L46 18 Q46 14 40 14 Q34 14 34 18 Z" fill="#6878C8"/>
      <rect x="20" y="26" width="40" height="40" rx="10" fill="#7888D8"/>
      <path d="M20 28 L60 28 C64 28 64 34 60 34 L20 34 C16 34 16 28 20 28 Z" fill="#8898E8" opacity="0.45"/>
      <rect x="28" y="38" width="24" height="16" rx="6" fill="#6878C8"/>
      <circle cx="40" cy="54" r="3" fill="#9898D8"/>
    </svg>
  );
}
function SickleSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="70" rx="18" ry="4.5" fill="#E9C5D0" opacity="0.3"/>
      <rect x="36" y="48" width="8" height="14" rx="4" fill="#B88840"/>
      <path d="M42 50 C50 44 58 32 56 20 C54 10 44 8 36 14 C28 20 26 30 30 40 C32 46 38 48 42 50"
        stroke="#A8A888" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M42 50 C50 44 58 32 56 20 C54 12 46 10 38 16"
        stroke="#C8C8A8" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6"/>
    </svg>
  );
}
function LoomShuttleSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="70" rx="24" ry="5" fill="#E9C5D0" opacity="0.3"/>
      <path d="M10 42 C10 36 18 28 40 28 C62 28 70 36 70 42 C70 48 62 56 40 56 C18 56 10 48 10 42 Z" fill="#B88840"/>
      <path d="M12 40 C12 34 20 28 40 28 C60 28 68 34 68 40" fill="#D4A858" opacity="0.45"/>
      <rect x="22" y="36" width="36" height="12" rx="4" fill="#C89848"/>
      {[28,34,40,46,52].map(x=>(
        <line key={x} x1={x} y1="36" x2={x} y2="48" stroke="#B89040" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      ))}
      <path d="M10 42 Q8 42 6 40 Q8 38 10 42 Z M70 42 Q72 42 74 40 Q72 38 70 42 Z" fill="#9A7030"/>
    </svg>
  );
}

interface GroceryItem { id: string; label: string; correct: boolean; bg: string; accent: string; Illustration: ()=>ReactElement; }

const ALL_GROCERIES: GroceryItem[] = [
  { id:"rice",    label:"Rice",    correct:true,  bg:"#FFF8EC", accent:"#C8A860", Illustration:RiceSVG    },
  { id:"potato",  label:"Potato",  correct:true,  bg:"#FFF4E0", accent:"#C8A860", Illustration:PotatoSVG  },
  { id:"onion",   label:"Onion",   correct:true,  bg:"#FDF0F8", accent:"#C870A0", Illustration:OnionSVG   },
  { id:"tomato",  label:"Tomato",  correct:true,  bg:"#FFF0F0", accent:"#E84848", Illustration:TomatoSVG  },
  { id:"peas",    label:"Peas",    correct:true,  bg:"#F0FAE8", accent:"#60B030", Illustration:PeasSVG    },
  { id:"carrot",  label:"Carrot",  correct:false, bg:"#FFF4EC", accent:"#F07830", Illustration:CarrotSVG  },
  { id:"banana",  label:"Banana",  correct:false, bg:"#FFFBE8", accent:"#D8A010", Illustration:BananaSVG  },
  { id:"bread",   label:"Bread",   correct:false, bg:"#FFF8EC", accent:"#D8943A", Illustration:BreadSVG   },
  { id:"egg",     label:"Egg",     correct:false, bg:"#FFFDF0", accent:"#C8A840", Illustration:EggSVG     },
  { id:"milk",    label:"Milk",    correct:false, bg:"#EEF8FC", accent:"#4BAAC8", Illustration:MilkSVG    },
];


// ─── Personalisation: content library ─────────────────────────────────────────

interface ContentItem {
  id: string; label: string; bg: string; accent: string;
  themes: string[]; Illustration: () => ReactElement;
}

const CONTENT_LIBRARY: ContentItem[] = [
  // Cooking / Kitchen
  { id:"rice",        label:"Rice",         bg:"#FFF8EC", accent:"#C8A860", themes:["Cooking"],                    Illustration:RiceSVG        },
  { id:"potato",      label:"Potato",       bg:"#FFF4E0", accent:"#C8A860", themes:["Cooking","Farming"],          Illustration:PotatoSVG      },
  { id:"onion",       label:"Onion",        bg:"#FDF0F8", accent:"#C870A0", themes:["Cooking"],                    Illustration:OnionSVG       },
  { id:"tomato",      label:"Tomato",       bg:"#FFF0F0", accent:"#E84848", themes:["Cooking"],                    Illustration:TomatoSVG      },
  { id:"peas",        label:"Peas",         bg:"#F0FAE8", accent:"#60B030", themes:["Cooking","Gardening"],        Illustration:PeasSVG        },
  { id:"carrot",      label:"Carrot",       bg:"#FFF4EC", accent:"#F07830", themes:["Cooking","Gardening"],        Illustration:CarrotSVG      },
  { id:"banana",      label:"Banana",       bg:"#FFFBE8", accent:"#D8A010", themes:["Cooking","Festivals"],        Illustration:BananaSVG      },
  { id:"bread",       label:"Bread",        bg:"#FFF8EC", accent:"#D8943A", themes:["Cooking"],                    Illustration:BreadSVG       },
  { id:"egg",         label:"Egg",          bg:"#FFFDF0", accent:"#C8A840", themes:["Cooking","Farming"],          Illustration:EggSVG         },
  { id:"milk",        label:"Milk",         bg:"#EEF8FC", accent:"#4BAAC8", themes:["Cooking","Farming"],          Illustration:MilkSVG        },
  { id:"dal",         label:"Dal",          bg:"#FFF4E8", accent:"#E88040", themes:["Cooking"],                    Illustration:DalSVG         },
  { id:"fish",        label:"Fish",         bg:"#E8F8FF", accent:"#3CAAD8", themes:["Cooking","Animals"],          Illustration:FishSVG        },
  { id:"mango",       label:"Mango",        bg:"#FFF8E0", accent:"#E8A820", themes:["Cooking","Festivals"],        Illustration:MangoSVG       },
  { id:"mustardoil",  label:"Mustard Oil",  bg:"#FFF8E0", accent:"#D8C020", themes:["Cooking"],                    Illustration:MustardOilSVG  },
  // Gardening
  { id:"flowerpot",   label:"Flower Pot",   bg:"#FFF0E8", accent:"#C87840", themes:["Gardening"],                  Illustration:FlowerPotSVG   },
  { id:"wateringcan", label:"Watering Can", bg:"#E8F4FF", accent:"#4898D8", themes:["Gardening"],                  Illustration:WateringCanSVG },
  { id:"spade",       label:"Spade",        bg:"#F0F0F4", accent:"#7888A8", themes:["Gardening","Farming","Profession"],Illustration:SpadeSVG  },
  { id:"seeds",       label:"Seeds",        bg:"#F8F4E8", accent:"#9A7840", themes:["Gardening","Farming"],        Illustration:SeedsSVG       },
  { id:"plant",       label:"Plant",        bg:"#F0FAF0", accent:"#50A050", themes:["Gardening"],                  Illustration:PlantSVG       },
  // Festivals / Culture
  { id:"gamosaitem",  label:"Gamosa",       bg:"#FEF0F0", accent:"#D03028", themes:["Festivals"],                  Illustration:GamosaItemSVG  },
  { id:"diya",        label:"Diya",         bg:"#FFF8E8", accent:"#E8A820", themes:["Festivals"],                  Illustration:DiyaSVG        },
  { id:"dhol",        label:"Dhol",         bg:"#FDF0F8", accent:"#C87038", themes:["Festivals"],                  Illustration:DholSVG        },
  { id:"lantern",     label:"Lantern",      bg:"#FFF8E0", accent:"#D8A020", themes:["Festivals","Household"],      Illustration:LanternSVG     },
  // Animals / Nature
  { id:"cow",         label:"Cow",          bg:"#F8FAF4", accent:"#688848", themes:["Animals","Farming"],          Illustration:CowSVG         },
  { id:"hen",         label:"Hen",          bg:"#FFF8EC", accent:"#E89840", themes:["Animals","Farming"],          Illustration:HenSVG         },
  { id:"bird",        label:"Bird",         bg:"#E8F4FF", accent:"#4898C8", themes:["Animals"],                    Illustration:BirdSVG        },
  // Household
  { id:"broom",       label:"Broom",        bg:"#F8F4E8", accent:"#9A7840", themes:["Household"],                  Illustration:BroomSVG       },
  { id:"kettle",      label:"Kettle",       bg:"#EEF4FF", accent:"#5888C8", themes:["Household","Cooking"],        Illustration:KettleSVG      },
  { id:"umbrella",    label:"Umbrella",     bg:"#E8F5FC", accent:"#4BAAC8", themes:["Household"],                  Illustration:UmbrellaSVG    },
  { id:"mat",         label:"Mat",          bg:"#FFF8E8", accent:"#B89840", themes:["Household"],                  Illustration:MatSVG         },
  // Profession
  { id:"schoolbag",   label:"School Bag",   bg:"#F0F4FF", accent:"#6878C8", themes:["Profession"],                 Illustration:SchoolBagSVG   },
  { id:"sickle",      label:"Sickle",       bg:"#F4F4F0", accent:"#808860", themes:["Farming","Profession"],       Illustration:SickleSVG      },
  { id:"loomshuttle", label:"Loom Shuttle", bg:"#F8F4EC", accent:"#B88848", themes:["Profession"],                 Illustration:LoomShuttleSVG },
];

function buildGRGame(themes: string[]): GroceryItem[] {
  const themed    = themes.length === 0 ? CONTENT_LIBRARY
    : CONTENT_LIBRARY.filter(item => item.themes.some(t => themes.includes(t)));
  const nonThemed = CONTENT_LIBRARY.filter(item => !item.themes.some(t => themes.includes(t)));
  const correctPool = shuffle(themed.length >= 5 ? [...themed] : [...themed, ...nonThemed]);
  const correctItems = correctPool.slice(0, 5);
  const correctIds   = new Set(correctItems.map(i => i.id));
  const distractors  = shuffle(CONTENT_LIBRARY.filter(i => !correctIds.has(i.id))).slice(0, 5);
  return [
    ...correctItems.map(item => ({ id:item.id, label:item.label, correct:true,  bg:item.bg, accent:item.accent, Illustration:item.Illustration })),
    ...distractors .map(item => ({ id:item.id, label:item.label, correct:false, bg:item.bg, accent:item.accent, Illustration:item.Illustration })),
  ];
}

function buildMMPairs(themes: string[]): MMPair[] {
  const themed    = themes.length === 0 ? CONTENT_LIBRARY
    : CONTENT_LIBRARY.filter(item => item.themes.some(t => themes.includes(t)));
  const nonThemed = CONTENT_LIBRARY.filter(item => !item.themes.some(t => themes.includes(t)));
  const pool = shuffle(themed.length >= 6 ? [...themed] : [...themed, ...nonThemed]);
  return pool.slice(0, 6).map((item, i) => ({
    pairId:      i + 1,
    label:       item.label,
    frontBg:     item.bg,
    Illustration:item.Illustration,
  }));
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function StatusBar({ light = false }: { light?: boolean }) {
  const color = light ? "rgba(255,255,255,0.9)" : "#25283D";
  return (
    <div className="flex items-center justify-between px-6 pt-4 pb-1 flex-shrink-0" style={{ paddingTop: 18 }}>
      <span className="text-sm font-800" style={{ color, fontFamily: F }}>{timeStr}</span>
      <div className="flex items-center gap-1.5">
        {/* Signal */}
        <svg viewBox="0 0 18 14" fill="none" className="w-4 h-3.5">
          {[2,5,8,11].map((x,i)=> <rect key={x} x={x} y={13-(i+1)*3} width="2.5" height={(i+1)*3} rx="1" fill={color} opacity={i<3?0.5:1}/>)}
        </svg>
        {/* WiFi */}
        <svg viewBox="0 0 18 14" fill="none" className="w-4 h-3.5">
          <path d="M9 11 L9 11" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M6 8.5 Q9 6.5 12 8.5" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.75"/>
          <path d="M3.5 6 Q9 2.5 14.5 6" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.5"/>
        </svg>
        {/* Battery */}
        <svg viewBox="0 0 22 12" fill="none" className="w-5 h-3">
          <rect x="0.5" y="0.5" width="18" height="11" rx="3" stroke={color} strokeWidth="1.2" opacity="0.8"/>
          <rect x="2" y="2" width="13" height="8" rx="2" fill={color} opacity="0.85"/>
          <path d="M19.5 4 L19.5 8" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        </svg>
      </div>
    </div>
  );
}

function BackBtn({ onBack, light=false }: { onBack: ()=>void; light?: boolean }) {
  return (
    <button onClick={onBack} aria-label="Back"
      className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90"
      style={{ backgroundColor: light ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.95)",
               boxShadow: light ? "none" : "0 2px 12px rgba(37,40,61,0.1)" }}>
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path d="M15 18L9 12L15 6" stroke={light ? "white" : "#25283D"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

function SpeakerBtn({ onPress, variant="lavender" }: { onPress?: ()=>void; variant?: "lavender"|"white" }) {
  return (
    <button onClick={onPress} aria-label="Voice"
      className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90"
      style={{ backgroundColor: variant==="lavender" ? "#DCD8F5" : "rgba(255,255,255,0.95)",
               boxShadow: "0 2px 10px rgba(139,123,200,0.15)" }}>
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="#8B7BC8"/>
        <path d="M15.54 8.46C16.48 9.4 17 10.67 17 12C17 13.33 16.48 14.6 15.54 15.54" stroke="#8B7BC8" strokeWidth="2" strokeLinecap="round"/>
        <path d="M19.07 4.93C21.02 6.88 22 9.37 22 12C22 14.63 21.02 17.12 19.07 19.07" stroke="#8B7BC8" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      </svg>
    </button>
  );
}

// ─── Bottom Nav (3 items) ─────────────────────────────────────────────────────

function BottomNav({ active, onChange }: { active: string; onChange: (id: string)=>void }) {
  return (
    <div className="flex-shrink-0 px-4 pb-5 pt-2"
      style={{ background: "linear-gradient(to top, white 80%, transparent)" }}>
      <div className="flex items-center justify-around rounded-3xl py-2 px-2"
        style={{ backgroundColor: "white", boxShadow: "0 -2px 28px rgba(37,40,61,0.11), 0 4px 20px rgba(37,40,61,0.08)", border: "1px solid rgba(220,216,245,0.55)" }}>

        {/* Home */}
        {(["home","care","settings"] as const).map(id => {
          const on = active === id;
          const label = id === "home" ? "Home" : id === "care" ? "Care" : "Settings";
          return (
            <button key={id} onClick={() => onChange(id)}
              className="flex flex-col items-center gap-1 py-2 px-5 rounded-2xl transition-all active:scale-90"
              style={{ backgroundColor: on ? "#EDE7FC" : "transparent", minWidth: 80, border: on ? "1px solid rgba(139,123,200,0.2)" : "1px solid transparent" }}>
              {id === "home" && (
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                  <path d="M3 12L12 4L21 12V21H15V15H9V21H3V12Z"
                    fill={on ? "#8B7BC8" : "#25283D"} opacity={on ? 1 : 0.35}/>
                </svg>
              )}
              {id === "care" && (
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                  <path d="M12 21C12 21 4 15.5 4 9.5C4 7.01 5.99 5 8.5 5C10 5 11.38 5.76 12 7C12.62 5.76 14 5 15.5 5C18.01 5 20 7.01 20 9.5C20 15.5 12 21 12 21Z"
                    fill={on ? "#8B7BC8" : "#25283D"} opacity={on ? 1 : 0.35}/>
                  <path d="M9 9.5H15M12 7V12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
              {id === "settings" && (
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                  <circle cx="12" cy="12" r="3" fill={on ? "#8B7BC8" : "#25283D"} opacity={on ? 1 : 0.35}/>
                  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                    stroke={on ? "#8B7BC8" : "#25283D"} strokeWidth="2" strokeLinecap="round" opacity={on ? 1 : 0.35}/>
                </svg>
              )}
              <span className="text-xs font-700" style={{ color: on ? "#8B7BC8" : "#25283D", opacity: on ? 1 : 0.35, fontFamily: F }}>
                {label}
              </span>
              {on && <div className="w-4 h-1 rounded-full" style={{ backgroundColor: "#8B7BC8", marginTop: -2 }}/>}
            </button>
          );
        })}

      </div>
    </div>
  );
}

// ─── Care tab content ─────────────────────────────────────────────────────────

function CareTab() {
  const [medDone,  setMedDone]  = useState<Set<string>>(new Set());
  const [glasses,  setGlasses]  = useState(3);
  const [actDone,  setActDone]  = useState<Set<string>>(new Set(["morning"]));

  const meds = [
    { id:"am", label:"Morning Tablets", time:"8:00 AM", icon:"💊", accent:"#8B7BC8", bg:"#F0ECFD" },
    { id:"pm", label:"Evening Tablets",  time:"8:00 PM", icon:"💊", accent:"#E9A080", bg:"#FFF0EA" },
    { id:"noon", label:"Noon Vitamins", time:"1:00 PM", icon:"🧴",  accent:"#4BAAC8", bg:"#E5F2F8" },
  ];
  const careActivities = [
    { id:"morning", label:"Morning Walk",     time:"7:00 AM",  icon:"🚶", accent:"#8B7BC8", bg:"#F0ECFD" },
    { id:"stretch", label:"Light Stretching", time:"10:00 AM", icon:"🧘", accent:"#4BAAC8", bg:"#E5F2F8" },
    { id:"rest",    label:"Afternoon Rest",   time:"2:00 PM",  icon:"😴", accent:"#E9A080", bg:"#FFF0EA" },
  ];

  const toggleMed = (id:string) => setMedDone(p=>{ const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  const toggleAct = (id:string) => setActDone(p=>{ const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  const totalGlasses = 8;

  return (
    <>
      {/* Header */}
      <div style={{ background:"linear-gradient(150deg,#8B7BC8 0%,#9BACD8 55%,#9FD5E8 100%)", flexShrink:0, borderRadius:"0 0 28px 28px", paddingBottom:20 }}>
        <StatusBar light/>
        <div className="px-5 pt-1 pb-2">
          <h1 style={{ fontSize:24, fontWeight:900, color:"white", fontFamily:F }}>Care</h1>
          <p style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.75)", fontFamily:F }}>Your daily wellness check-in</p>
        </div>
      </div>

      <div className="responsive-scroll flex-1 overflow-y-auto px-5 pt-4 pb-2">

        {/* ── Medication ── */}
        <div className="flex items-center gap-2 mb-3">
          <div style={{ width:30, height:30, borderRadius:10, backgroundColor:"#F0ECFD", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:16 }}>💊</span>
          </div>
          <p style={{ fontSize:16, fontWeight:800, color:"#25283D", fontFamily:F }}>Medication</p>
          <span style={{ marginLeft:"auto", fontSize:12, fontWeight:700, color:"#8B7BC8", fontFamily:F }}>
            {medDone.size}/{meds.length} taken
          </span>
        </div>
        <div className="rounded-3xl overflow-hidden mb-5"
          style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
          {meds.map((m,i)=>{
            const done = medDone.has(m.id);
            return (
              <button key={m.id} onClick={()=>toggleMed(m.id)}
                className="flex items-center gap-3 w-full text-left active:scale-98 transition-all"
                style={{ padding:"14px 16px", borderBottom:i<meds.length-1?"1px solid rgba(220,216,245,0.4)":"none",
                         backgroundColor: done?"rgba(240,236,253,0.3)":"transparent" }}>
                <div style={{ width:44, height:44, borderRadius:14, backgroundColor:done?`${m.bg}99`:m.bg,
                              display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                  <span style={{ opacity:done?0.5:1 }}>{m.icon}</span>
                </div>
                <div className="flex-1">
                  <p style={{ fontSize:14, fontWeight:700, color:"#25283D", fontFamily:F,
                              opacity:done?0.4:1, textDecoration:done?"line-through":"none" }}>{m.label}</p>
                  <p style={{ fontSize:12, fontWeight:500, color:m.accent, fontFamily:F, marginTop:2, opacity:done?0.5:1 }}>{m.time}</p>
                </div>
                <div style={{ width:30, height:30, borderRadius:"50%", flexShrink:0,
                              backgroundColor:done?m.accent:"transparent",
                              border:done?"none":`2px solid ${m.bg}`,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              boxShadow:done?`0 3px 10px ${m.accent}55`:"none" }}>
                  {done && <svg viewBox="0 0 16 16" fill="none" style={{ width:16,height:16 }}>
                    <path d="M3 8L6.5 11.5L13 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Hydration ── */}
        <div className="flex items-center gap-2 mb-3">
          <div style={{ width:30, height:30, borderRadius:10, backgroundColor:"#E5F2F8", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:16 }}>💧</span>
          </div>
          <p style={{ fontSize:16, fontWeight:800, color:"#25283D", fontFamily:F }}>Hydration</p>
        </div>
        <div className="rounded-3xl p-4 mb-5" style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize:14, fontWeight:600, color:"#25283D", opacity:0.6, fontFamily:F }}>
              {glasses < totalGlasses ? `${glasses} of ${totalGlasses} glasses today` : "Goal reached! Great job! 🎉"}
            </p>
            <div style={{ padding:"4px 12px", borderRadius:20, backgroundColor:"#E5F2F8" }}>
              <span style={{ fontSize:13, fontWeight:800, color:"#4BAAC8", fontFamily:F }}>{glasses}/{totalGlasses}</span>
            </div>
          </div>
          {/* Water bar */}
          <div style={{ height:10, borderRadius:20, backgroundColor:"#E5F2F8", marginBottom:16 }}>
            <div style={{ height:10, borderRadius:20, width:`${(glasses/totalGlasses)*100}%`,
                          backgroundColor:"#9FD5E8", transition:"width 0.35s ease" }}/>
          </div>
          {/* Glass buttons */}
          <div className="flex gap-2 flex-wrap">
            {Array.from({length:totalGlasses},(_,i)=>(
              <button key={i} onClick={()=>setGlasses(i<glasses?i:i+1)}
                className="flex items-center justify-center rounded-xl transition-all active:scale-90"
                style={{ width:36, height:36, backgroundColor:i<glasses?"#9FD5E8":"#E5F2F8",
                         border:i<glasses?"2px solid #4BAAC8":"2px solid #DCD8F5" }}>
                <span style={{ fontSize:18 }}>💧</span>
              </button>
            ))}
          </div>
          <p style={{ fontSize:12, fontWeight:500, color:"#25283D", opacity:0.4, fontFamily:F, marginTop:10 }}>
            Tap a glass to mark it as drunk
          </p>
        </div>

        {/* ── Daily Activity ── */}
        <div className="flex items-center gap-2 mb-3">
          <div style={{ width:30, height:30, borderRadius:10, backgroundColor:"#FFF0EA", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:16 }}>🌿</span>
          </div>
          <p style={{ fontSize:16, fontWeight:800, color:"#25283D", fontFamily:F }}>Daily Activity</p>
          <span style={{ marginLeft:"auto", fontSize:12, fontWeight:700, color:"#E9A080", fontFamily:F }}>
            {actDone.size}/{careActivities.length} done
          </span>
        </div>
        <div className="rounded-3xl overflow-hidden mb-4"
          style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
          {careActivities.map((a,i)=>{
            const done = actDone.has(a.id);
            return (
              <button key={a.id} onClick={()=>toggleAct(a.id)}
                className="flex items-center gap-3 w-full text-left active:scale-98 transition-all"
                style={{ padding:"14px 16px", borderBottom:i<careActivities.length-1?"1px solid rgba(220,216,245,0.4)":"none",
                         backgroundColor:done?"rgba(240,236,253,0.3)":"transparent" }}>
                <div style={{ width:44, height:44, borderRadius:14, backgroundColor:done?`${a.bg}99`:a.bg,
                              display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                  <span style={{ opacity:done?0.5:1 }}>{a.icon}</span>
                </div>
                <div className="flex-1">
                  <p style={{ fontSize:14, fontWeight:700, color:"#25283D", fontFamily:F,
                              opacity:done?0.4:1, textDecoration:done?"line-through":"none" }}>{a.label}</p>
                  <p style={{ fontSize:12, fontWeight:500, color:a.accent, fontFamily:F, marginTop:2, opacity:done?0.5:1 }}>{a.time}</p>
                </div>
                <div style={{ width:30, height:30, borderRadius:"50%", flexShrink:0,
                              backgroundColor:done?a.accent:"transparent",
                              border:done?"none":`2px solid ${a.bg}`,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              boxShadow:done?`0 3px 10px ${a.accent}55`:"none" }}>
                  {done && <svg viewBox="0 0 16 16" fill="none" style={{ width:16,height:16 }}>
                    <path d="M3 8L6.5 11.5L13 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── Settings tab content ─────────────────────────────────────────────────────

function SettingsTab({ profile }: { profile: ElderProfile }) {
  const [lang,  setLang]  = useState(profile.language || "English");
  const [voice, setVoice] = useState(profile.voice);

  const inputStyle: React.CSSProperties = {
    backgroundColor:"#FFFDF7", color:"#25283D", fontFamily:F,
    border:"2px solid #DCD8F5", borderRadius:16, padding:"15px 20px",
    fontSize:16, fontWeight:600, width:"100%", outline:"none",
    boxShadow:"0 2px 10px rgba(37,40,61,0.05)",
    appearance:"none",
  };

  return (
    <>
      {/* Header */}
      <div style={{ background:"linear-gradient(150deg,#8B7BC8 0%,#9BACD8 55%,#9FD5E8 100%)", flexShrink:0, borderRadius:"0 0 28px 28px", paddingBottom:20 }}>
        <StatusBar light/>
        <div className="px-5 pt-1 pb-2">
          <h1 style={{ fontSize:24, fontWeight:900, color:"white", fontFamily:F }}>Settings</h1>
          <p style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.75)", fontFamily:F }}>Your preferences</p>
        </div>
      </div>

      <div className="responsive-scroll flex-1 overflow-y-auto px-5 pt-5 pb-4">

        {/* Profile card */}
        <div className="rounded-3xl p-4 mb-5 flex items-center gap-4"
          style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
          <div style={{
            width:54, height:54, borderRadius:"50%", flexShrink:0,
            background:"linear-gradient(135deg,#DCD8F5,#E9C5D0)",
            border:"3px solid rgba(139,123,200,0.25)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:26,
          }}>👤</div>
          <div>
            <p style={{ fontSize:18, fontWeight:900, color:"#25283D", fontFamily:F }}>{profile.name || "User"}</p>
            <p style={{ fontSize:13, fontWeight:600, color:"#8B7BC8", fontFamily:F }}>Age {profile.age || "—"}</p>
          </div>
        </div>

        {/* Language */}
        <p style={{ fontSize:13, fontWeight:800, color:"#25283D", opacity:0.5, fontFamily:F, marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>Language</p>
        <div className="rounded-3xl p-4 mb-5" style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div style={{ width:40, height:40, borderRadius:12, backgroundColor:"#F0ECFD",
                          display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🌐</div>
            <div>
              <p style={{ fontSize:15, fontWeight:700, color:"#25283D", fontFamily:F }}>Preferred Language</p>
              <p style={{ fontSize:12, fontWeight:500, color:"#25283D", opacity:0.45, fontFamily:F }}>Used for instructions and voice</p>
            </div>
          </div>
          <div style={{ position:"relative" }}>
            <select value={lang} onChange={e=>setLang(e.target.value)} style={inputStyle}
              onFocus={e=>(e.target.style.borderColor="#8B7BC8")} onBlur={e=>(e.target.style.borderColor="#DCD8F5")}>
              {LANGUAGES.map(l=><option key={l} value={l}>{l}</option>)}
            </select>
            <div style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
              <svg viewBox="0 0 20 20" fill="none" style={{ width:20, height:20 }}>
                <path d="M5 7.5L10 12.5L15 7.5" stroke="#8B7BC8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Voice assistance */}
        <p style={{ fontSize:13, fontWeight:800, color:"#25283D", opacity:0.5, fontFamily:F, marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>Voice</p>
        <div className="rounded-3xl p-4 mb-5" style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
          <div className="flex items-center gap-3">
            <div style={{ width:40, height:40, borderRadius:12,
                          backgroundColor:voice?"#DCD8F5":"#F5F3FF",
                          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg viewBox="0 0 24 24" fill="none" style={{ width:22, height:22 }}>
                <path d="M11 5L6 9H2V15H6L11 19V5Z" fill={voice?"#8B7BC8":"#b0aac0"}/>
                <path d="M15.54 8.46C16.48 9.4 17 10.67 17 12C17 13.33 16.48 14.6 15.54 15.54" stroke={voice?"#8B7BC8":"#b0aac0"} strokeWidth="2" strokeLinecap="round"/>
                <path d="M19.07 4.93C21.02 6.88 22 9.37 22 12C22 14.63 21.02 17.12 19.07 19.07" stroke={voice?"#8B7BC8":"#b0aac0"} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
              </svg>
            </div>
            <div className="flex-1">
              <p style={{ fontSize:15, fontWeight:700, color:"#25283D", fontFamily:F }}>Voice Assistance</p>
              <p style={{ fontSize:12, fontWeight:500, color:"#25283D", opacity:0.45, fontFamily:F, marginTop:1 }}>
                {voice ? "On — Instructions read aloud" : "Off"}
              </p>
            </div>
            <button onClick={()=>setVoice(v=>!v)}
              style={{ width:52, height:30, borderRadius:15, backgroundColor:voice?"#8B7BC8":"#DCD8F5",
                       position:"relative", flexShrink:0, transition:"background-color 0.2s" }}>
              <div style={{
                position:"absolute", top:3, width:24, height:24, borderRadius:"50%", backgroundColor:"white",
                left:voice?"calc(100% - 27px)":"3px", transition:"left 0.2s",
                boxShadow:"0 2px 8px rgba(0,0,0,0.18)",
              }}/>
            </button>
          </div>
        </div>

        {/* App info */}
        <div className="rounded-3xl p-4 flex items-center justify-center"
          style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
          <div className="text-center">
            <p style={{ fontSize:14, fontWeight:700, color:"#25283D", opacity:0.4, fontFamily:F }}>Mindful Memory</p>
            <p style={{ fontSize:12, fontWeight:600, color:"#25283D", opacity:0.25, fontFamily:F }}>by Heuristic · v1.0</p>
          </div>
        </div>

      </div>
    </>
  );
}

// ─── Screen: Splash ───────────────────────────────────────────────────────────

function ElderlyWomanIllustration() {
  return (
    <svg viewBox="0 0 300 270" fill="none" className="w-full h-full">
      {/* Soft lavender glow blob behind figure */}
      <ellipse cx="150" cy="160" rx="108" ry="92" fill="#EDE8F8"/>
      <ellipse cx="150" cy="160" rx="80" ry="70" fill="#E8E2F8" opacity="0.6"/>

      {/* ── Decorative stars ── */}
      {/* Teal/green 4-pointed star, upper-left */}
      <path d="M72 72 L75.5 62 L79 72 L89 68.5 L79 72 L79 82 L75.5 72 L62 75.5Z" fill="#4ECBA0" opacity="0.0"/>
      {/* 4-pointed cross star, teal */}
      <path d="M76 58 L79 50 L82 58 L90 61 L82 64 L79 72 L76 64 L68 61Z" fill="#3FC8A4" opacity="0.9"/>
      {/* Gold 5-pointed star, upper-right */}
      <path d="M213 48 L216.5 38 L220 48 L230 51 L220 54 L216.5 64 L213 54 L203 51Z" fill="#F5C542" opacity="0.95"/>

      {/* ── Floating dots ── */}
      <circle cx="62" cy="130" r="6.5" fill="#3FC8A4" opacity="0.75"/>
      <circle cx="236" cy="110" r="9" fill="#F8A898" opacity="0.8"/>
      <circle cx="230" cy="178" r="5.5" fill="#E9C5D0" opacity="0.85"/>
      <circle cx="70" cy="185" r="4" fill="#C4E8F0" opacity="0.8"/>
      <circle cx="88" cy="100" r="3.5" fill="#DCD8F5" opacity="0.9"/>
      <circle cx="210" cy="148" r="3" fill="#DCD8F5" opacity="0.7"/>

      {/* ── Chair / seat base ── */}
      <ellipse cx="150" cy="248" rx="52" ry="14" fill="#C8BFEA" opacity="0.7"/>
      <path d="M102 235 C102 220 118 215 150 215 C182 215 198 220 198 235 L198 248 C198 252 188 255 150 255 C112 255 102 252 102 248Z" fill="#C8BFEA"/>

      {/* ── Left arm ── */}
      <path d="M114 185 C100 180 88 192 93 207 C97 218 110 222 125 219" fill="#F5D0B5"/>
      {/* Left hand + cup */}
      <ellipse cx="105" cy="210" rx="14" ry="12" fill="#F5D0B5"/>

      {/* ── Right arm ── */}
      <path d="M186 185 C200 180 212 192 207 207 C203 218 190 222 175 219" fill="#F5D0B5"/>
      {/* Right hand + book */}
      <ellipse cx="195" cy="210" rx="14" ry="12" fill="#F5D0B5"/>

      {/* ── Body (purple/lavender sweater) ── */}
      <path d="M116 225 C113 198 118 175 150 168 C182 175 187 198 184 225 C182 238 118 238 116 225Z" fill="#7B6BC0"/>
      {/* Sweater texture lines */}
      <path d="M135 180 C135 190 135 200 135 210" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M150 178 C150 188 150 198 150 210" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M165 180 C165 190 165 200 165 210" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round"/>
      {/* Collar */}
      <path d="M136 172 Q150 182 164 172" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

      {/* ── Neck ── */}
      <rect x="136" y="152" width="28" height="22" rx="14" fill="#F5D0B5"/>

      {/* ── Head ── */}
      <circle cx="150" cy="130" r="42" fill="#F5D0B5"/>

      {/* ── Hair – silver bun style ── */}
      {/* Base hair shape */}
      <path d="M112 122 C113 95 128 82 150 82 C172 82 187 95 188 122" fill="#D4D0E0"/>
      <path d="M114 119 C116 94 130 84 150 84 C170 84 184 94 186 119" fill="#E0DCF0"/>
      {/* Hair highlights */}
      <path d="M130 88 C136 86 144 84 150 84" stroke="white" strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>
      {/* Bun */}
      <circle cx="162" cy="88" r="11" fill="#D4D0E0"/>
      <circle cx="162" cy="88" r="7.5" fill="#E0DCF0"/>
      {/* Bun shine */}
      <circle cx="159" cy="84" r="2.5" fill="white" opacity="0.45"/>
      {/* Hair pin / flower */}
      <circle cx="165" cy="84" r="4.5" fill="#F8A898" opacity="0.9"/>
      <circle cx="165" cy="84" r="2" fill="#FFFDF7"/>

      {/* ── Eyebrows ── */}
      <path d="M132 114 Q137 111 142 113" stroke="#9B8BA0" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M158 113 Q163 111 168 114" stroke="#9B8BA0" strokeWidth="2" strokeLinecap="round" fill="none"/>

      {/* ── Glasses (purple frames) ── */}
      {/* Left lens */}
      <rect x="121" y="120" width="22" height="15" rx="7.5" stroke="#6B5BAE" strokeWidth="2.8" fill="white" fillOpacity="0.6"/>
      {/* Right lens */}
      <rect x="147" y="120" width="22" height="15" rx="7.5" stroke="#6B5BAE" strokeWidth="2.8" fill="white" fillOpacity="0.6"/>
      {/* Bridge */}
      <path d="M143 127.5 L147 127.5" stroke="#6B5BAE" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Arms */}
      <path d="M121 127.5 L115 126" stroke="#6B5BAE" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M169 127.5 L175 126" stroke="#6B5BAE" strokeWidth="2.2" strokeLinecap="round"/>

      {/* ── Eyes behind glasses ── */}
      <ellipse cx="132" cy="128" rx="3.5" ry="3" fill="#4A3A88"/>
      <ellipse cx="158" cy="128" rx="3.5" ry="3" fill="#4A3A88"/>
      {/* Eye shine */}
      <circle cx="134" cy="126.5" r="1.2" fill="white" opacity="0.8"/>
      <circle cx="160" cy="126.5" r="1.2" fill="white" opacity="0.8"/>

      {/* ── Nose ── */}
      <path d="M148 133 Q150 137 152 133" stroke="#DBA888" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

      {/* ── Smile ── */}
      <path d="M136 144 Q143 151 164 144" stroke="#C88A68" strokeWidth="2.2" fill="none" strokeLinecap="round"/>

      {/* ── Cheeks ── */}
      <ellipse cx="122" cy="140" rx="9" ry="7" fill="#F8A898" opacity="0.28"/>
      <ellipse cx="178" cy="140" rx="9" ry="7" fill="#F8A898" opacity="0.28"/>

      {/* ── Tea cup (left hand) ── */}
      <rect x="88" y="196" width="38" height="28" rx="7" fill="#E8603A"/>
      <rect x="90" y="198" width="34" height="9" rx="4" fill="#F07848" opacity="0.7"/>
      {/* Cup handle */}
      <path d="M126 201 Q138 201 138 210 Q138 219 126 219" stroke="#C8481A" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Steam wisps */}
      <path d="M100 193 Q102 186 100 179" stroke="#C8BFEA" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.75"/>
      <path d="M108 191 Q110 184 108 177" stroke="#C8BFEA" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.75"/>
      <path d="M116 193 Q118 186 116 180" stroke="#C8BFEA" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>

      {/* ── Book (right hand) ── */}
      <rect x="172" y="190" width="32" height="38" rx="5" fill="#9BACD8"/>
      <rect x="172" y="190" width="7" height="38" rx="4" fill="#7B8CC0"/>
      <path d="M184 202 L200 202 M184 210 L198 210 M184 218 L195 218" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/>
      {/* Book pages edge */}
      <path d="M204 192 L204 226" stroke="#C4D0E8" strokeWidth="1.5" opacity="0.5"/>
    </svg>
  );
}

function SplashScreen({ onNext }: { onNext: ()=>void }) {
  return (
    <div className="smriti-screen flex flex-col h-full" style={{ backgroundColor: "#FAFAF8" }}>
      <StatusBar/>

      {/* Illustration area — grows to fill available space */}
      <div className="splash-main flex-1 flex flex-col items-center justify-center px-6" style={{ paddingTop: 8 }}>
        {/* Illustration */}
        <div className="splash-illustration" style={{ marginBottom: 8 }}>
          <ElderlyWomanIllustration/>
        </div>

        {/* App name row: brain icon + title */}
        <div className="splash-title-row flex items-center gap-3 mb-3">
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            backgroundColor: "#7B6BC0",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            boxShadow: "0 4px 14px rgba(123,107,192,0.4)",
          }}>
            <svg viewBox="0 0 26 22" fill="none" style={{ width: 22, height: 18 }}>
              <path d="M13 2C11 2 9.5 3.2 9 4.8C7.8 4.3 6.2 4.8 5.4 6C4.4 6 3 7.2 3 9C3 10.4 3.8 11.5 5 12C3.8 12.5 3 13.6 3 15C3 16.8 4.4 18 5.4 18C5.9 19.6 7.4 20.8 9 20.4C9.5 21.1 10.5 21.5 11.5 21.5C12.2 21.5 13 21.1 13 20V3.5C13 2.7 13 2 13 2Z" fill="rgba(255,255,255,0.92)"/>
              <path d="M13 2C15 2 16.5 3.2 17 4.8C18.2 4.3 19.8 4.8 20.6 6C21.6 6 23 7.2 23 9C23 10.4 22.2 11.5 21 12C22.2 12.5 23 13.6 23 15C23 16.8 21.6 18 20.6 18C20.1 19.6 18.6 20.8 17 20.4C16.5 21.1 15.5 21.5 14.5 21.5C13.8 21.5 13 21.1 13 20V3.5C13 2.7 13 2 13 2Z" fill="rgba(255,255,255,0.92)"/>
            </svg>
          </div>
          <h1 className="splash-title" style={{ fontSize: 30, fontWeight: 900, color: "#3D2E8A", fontFamily: F, letterSpacing: -0.4 }}>
            Mindful Memory
          </h1>
        </div>

        {/* Tagline */}
        <p style={{ fontSize: 16, fontWeight: 500, color: "#7B6580", fontFamily: F, textAlign: "center", lineHeight: 1.55, maxWidth: 260 }}>
          Helping you remember, one day at a time.
        </p>

        {/* by Heuristic */}
        <p style={{ fontSize: 12, fontWeight: 600, color: "#25283D", opacity: 0.28, fontFamily: F, marginTop: 8, letterSpacing: 0.3 }}>
          by Heuristic
        </p>
      </div>

      {/* Bottom buttons */}
      <div className="splash-actions flex-shrink-0 px-6 pb-10 pt-4 flex flex-col gap-3">
        <button onClick={onNext}
          className="w-full font-800 text-white transition-all active:scale-95"
          style={{ padding: "19px 0", fontSize: 18, borderRadius: 100,
                   backgroundColor: "#7B6BC0",
                   boxShadow: "0 8px 28px rgba(123,107,192,0.45)", fontFamily: F }}>
          Get Started →
        </button>
        <button
          className="w-full font-600 flex items-center justify-center gap-2 transition-all active:scale-95"
          style={{ padding: "16px 0", fontSize: 15, borderRadius: 100,
                   backgroundColor: "transparent",
                   border: "1.5px solid rgba(123,107,192,0.28)",
                   color: "#6B5BAE", fontFamily: F }}>
          <svg viewBox="0 0 20 20" fill="none" style={{ width: 17, height: 17 }}>
            <rect x="7" y="2" width="6" height="10" rx="3" fill="#6B5BAE"/>
            <path d="M4 9.5C4 12.8 6.7 15.5 10 15.5C13.3 15.5 16 12.8 16 9.5" stroke="#6B5BAE" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
            <line x1="10" y1="15.5" x2="10" y2="18.5" stroke="#6B5BAE" strokeWidth="1.6" strokeLinecap="round"/>
            <line x1="7" y1="18.5" x2="13" y2="18.5" stroke="#6B5BAE" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          Tap to speak instead
        </button>
      </div>
    </div>
  );
}

// ─── Screen: Role Selection ───────────────────────────────────────────────────

function RoleScreen({ onElder, onCaregiver }: { onElder: ()=>void; onCaregiver: ()=>void }) {
  return (
    <div className="smriti-screen flex flex-col h-full"
      style={{ background:"linear-gradient(175deg,#EEF5FB 0%,#E6EEF8 40%,#EDE8F8 100%)" }}>
      <StatusBar/>
      <div className="flex-1 flex flex-col px-6 pt-4 pb-6 overflow-y-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center text-3xl"
            style={{ backgroundColor:"#DCD8F5", boxShadow:"0 6px 20px rgba(139,123,200,0.25)" }}>🌸</div>
          <h1 style={{ fontSize:26, fontWeight:900, color:"#25283D", fontFamily:F, lineHeight:1.2 }}>
            How will you use<br/>Mindful Memory?
          </h1>
          <p style={{ fontSize:14, fontWeight:500, color:"#25283D", opacity:0.5, fontFamily:F, marginTop:6 }}>
            Choose your role to get started
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Elder */}
          <button onClick={onElder}
            className="w-full rounded-3xl text-left flex items-center gap-4 transition-all active:scale-97"
            style={{ padding:"20px 20px", backgroundColor:"#FFFDF7",
                     boxShadow:"0 6px 24px rgba(139,123,200,0.16), 0 1px 4px rgba(37,40,61,0.06)",
                     border:"2px solid #DCD8F5" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
              style={{ backgroundColor:"#F0ECFD" }}>👴</div>
            <div className="flex-1">
              <p style={{ fontSize:19, fontWeight:800, color:"#25283D", fontFamily:F }}>Elder</p>
              <p style={{ fontSize:13, fontWeight:500, color:"#25283D", opacity:0.5, fontFamily:F, marginTop:2 }}>Play games &amp; track activities</p>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background:"linear-gradient(135deg,#8B7BC8,#A594DC)", boxShadow:"0 4px 12px rgba(139,123,200,0.4)" }}>
              <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                <path d="M7 10H13M13 10L10.5 7.5M13 10L10.5 12.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>

          {/* Caregiver — now active */}
          <button onClick={onCaregiver}
            className="w-full rounded-3xl text-left flex items-center gap-4 transition-all active:scale-97"
            style={{ padding:"20px 20px", backgroundColor:"#FFFDF7",
                     boxShadow:"0 6px 24px rgba(233,197,208,0.35), 0 1px 4px rgba(37,40,61,0.06)",
                     border:"2px solid #E9C5D0" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
              style={{ backgroundColor:"#FDF0F6" }}>👩</div>
            <div className="flex-1">
              <p style={{ fontSize:19, fontWeight:800, color:"#25283D", fontFamily:F }}>Caregiver</p>
              <p style={{ fontSize:13, fontWeight:500, color:"#25283D", opacity:0.5, fontFamily:F, marginTop:2 }}>Monitor progress &amp; manage care</p>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background:"linear-gradient(135deg,#E9C5D0,#F2A8B8)", boxShadow:"0 4px 12px rgba(233,197,208,0.5)" }}>
              <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                <path d="M7 10H13M13 10L10.5 7.5M13 10L10.5 12.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </div>

        <p className="text-center text-sm font-500 mt-auto pt-8" style={{ color:"#25283D", opacity:0.3, fontFamily:F }}>
          You can change this later in Settings
        </p>
      </div>
    </div>
  );
}

// ─── Screen: Elder Setup ──────────────────────────────────────────────────────

function ElderSetupScreen({ onContinue }: { onContinue: (p: ElderProfile)=>void }) {
  const [form, setForm] = useState<ElderProfile>({ name:"", age:"", language:"English", pin:"", voice:true });
  const [pinFocused, setPinFocused] = useState(false);
  const isValid = form.name.trim().length>0 && form.age.trim().length>0 && form.pin.length===4;

  const handlePin = (v: string) => setForm(f=>({ ...f, pin: v.replace(/\D/g,"").slice(0,4) }));

  const inputStyle = {
    backgroundColor:"white", color:"#25283D", fontFamily:F,
    border:"2px solid #DCD8F5", borderRadius:16, padding:"16px 20px",
    fontSize:16, fontWeight:600, width:"100%", outline:"none",
    boxShadow:"0 2px 10px rgba(37,40,61,0.05)",
  };

  return (
    <div className="smriti-screen flex flex-col h-full"
      style={{ background:"linear-gradient(175deg,#EEF5FB 0%,#E6EEF8 40%,#EDE8F8 100%)" }}>
      <StatusBar/>

      {/* Progress */}
      <div className="px-6 pt-2 pb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontSize:12, fontWeight:700, color:"#8B7BC8", fontFamily:F }}>Profile Setup</span>
          <span style={{ fontSize:12, fontWeight:600, color:"#25283D", opacity:0.4, fontFamily:F }}>1 of 1</span>
        </div>
        <div style={{ height:5, borderRadius:10, backgroundColor:"#DCD8F5" }}>
          <div style={{ height:5, borderRadius:10, width:"100%", background:"linear-gradient(90deg,#8B7BC8,#A594DC)" }}/>
        </div>
      </div>

      {/* Scrollable form */}
      <div className="responsive-scroll flex-1 overflow-y-auto px-6 pb-4">
        <h1 style={{ fontSize:24, fontWeight:900, color:"#25283D", fontFamily:F, marginBottom:4 }}>Tell us about yourself</h1>
        <p style={{ fontSize:14, fontWeight:500, color:"#25283D", opacity:0.5, fontFamily:F, marginBottom:24 }}>We'll personalise your experience</p>

        <div className="flex flex-col gap-5">
          {/* Name */}
          <div>
            <label style={{ display:"block", fontSize:13, fontWeight:700, color:"#25283D", fontFamily:F, marginBottom:8 }}>Your Name</label>
            <input type="text" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
              placeholder="e.g. Asha Sharma" style={inputStyle as React.CSSProperties}
              onFocus={e=>(e.target.style.borderColor="#8B7BC8")} onBlur={e=>(e.target.style.borderColor="#DCD8F5")}/>
          </div>
          {/* Age */}
          <div>
            <label style={{ display:"block", fontSize:13, fontWeight:700, color:"#25283D", fontFamily:F, marginBottom:8 }}>Your Age</label>
            <input type="number" value={form.age} onChange={e=>setForm(f=>({...f,age:e.target.value}))}
              placeholder="e.g. 72" min={50} max={110} style={inputStyle as React.CSSProperties}
              onFocus={e=>(e.target.style.borderColor="#8B7BC8")} onBlur={e=>(e.target.style.borderColor="#DCD8F5")}/>
          </div>
          {/* Language */}
          <div>
            <label style={{ display:"block", fontSize:13, fontWeight:700, color:"#25283D", fontFamily:F, marginBottom:8 }}>Preferred Language</label>
            <div className="relative">
              <select value={form.language} onChange={e=>setForm(f=>({...f,language:e.target.value}))}
                style={{ ...inputStyle, appearance:"none", paddingRight:44 } as React.CSSProperties}
                onFocus={e=>(e.target.style.borderColor="#8B7BC8")} onBlur={e=>(e.target.style.borderColor="#DCD8F5")}>
                {LANGUAGES.map(l=><option key={l} value={l}>{l}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#8B7BC8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          {/* PIN */}
          <div>
            <label style={{ display:"block", fontSize:13, fontWeight:700, color:"#25283D", fontFamily:F, marginBottom:4 }}>4-Digit PIN</label>
            <p style={{ fontSize:12, fontWeight:500, color:"#25283D", opacity:0.45, fontFamily:F, marginBottom:12 }}>Used to log in quickly</p>
            <div className="flex items-center justify-center gap-5 rounded-2xl py-4 mb-3" style={{ backgroundColor:"#F0ECFD" }}>
              {[0,1,2,3].map(i=>(
                <div key={i} style={{
                  width:16, height:16, borderRadius:"50%", transition:"all 0.2s",
                  backgroundColor: i<form.pin.length ? "#8B7BC8" : "#DCD8F5",
                  transform: i<form.pin.length ? "scale(1.3)" : "scale(1)",
                }}/>
              ))}
            </div>
            <input type="password" inputMode="numeric" pattern="[0-9]*" maxLength={4}
              value={form.pin} onChange={e=>handlePin(e.target.value)}
              placeholder="• • • •"
              style={{ ...inputStyle, textAlign:"center", letterSpacing:"0.6em",
                       borderColor: pinFocused?"#8B7BC8":"#DCD8F5" } as React.CSSProperties}
              onFocus={()=>setPinFocused(true)} onBlur={()=>setPinFocused(false)}/>
          </div>
          {/* Voice toggle */}
          <div className="flex items-center justify-between rounded-2xl p-4"
            style={{ backgroundColor:"white", border:"2px solid #DCD8F5", boxShadow:"0 2px 10px rgba(37,40,61,0.05)" }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: form.voice?"#DCD8F5":"#F5F3FF" }}>
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                  <path d="M11 5L6 9H2V15H6L11 19V5Z" fill={form.voice?"#8B7BC8":"#b0aac0"}/>
                  <path d="M15.54 8.46C16.48 9.4 17 10.67 17 12C17 13.33 16.48 14.6 15.54 15.54" stroke={form.voice?"#8B7BC8":"#b0aac0"} strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize:14, fontWeight:700, color:"#25283D", fontFamily:F }}>Voice Assistance</p>
                <p style={{ fontSize:12, fontWeight:500, color:"#25283D", opacity:0.45, fontFamily:F }}>Hear instructions aloud</p>
              </div>
            </div>
            <button onClick={()=>setForm(f=>({...f,voice:!f.voice}))}
              className="relative flex-shrink-0 transition-all"
              style={{ width:52, height:30, borderRadius:15, backgroundColor: form.voice?"#8B7BC8":"#DCD8F5" }}>
              <div style={{
                position:"absolute", top:3, width:24, height:24, borderRadius:"50%", backgroundColor:"white",
                left: form.voice?"calc(100% - 27px)":"3px",
                transition:"left 0.2s", boxShadow:"0 2px 8px rgba(0,0,0,0.18)",
              }}/>
            </button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex-shrink-0 px-6 pb-8 pt-3"
        style={{ background:"linear-gradient(to top, #EDE8F8 70%, transparent)" }}>
        <button onClick={()=>isValid&&onContinue(form)}
          className="w-full rounded-3xl text-lg font-800 transition-all active:scale-95"
          style={{
            padding:"17px 0",
            background: isValid?"linear-gradient(135deg,#8B7BC8,#A594DC)":"#DCD8F5",
            boxShadow: isValid?"0 8px 28px rgba(139,123,200,0.45)":"none",
            color: isValid?"white":"#9E8FC0", fontFamily:F,
            cursor: isValid?"pointer":"not-allowed",
          }}>
          Continue →
        </button>
      </div>
    </div>
  );
}

// ─── Screen: Home ─────────────────────────────────────────────────────────────

function HomeScreen({ profile, onPlayMemoryRecall, onPlayGroceryRecall, onPlayMemoryMatch }: { profile: ElderProfile; onPlayMemoryRecall: ()=>void; onPlayGroceryRecall: ()=>void; onPlayMemoryMatch: ()=>void }) {
  const [activeTab, setActiveTab] = useState("home");
  const [done, setDone] = useState<Set<number>>(new Set([2]));
  const firstName = profile.name.trim().split(" ")[0] || "Asha";

  const toggle = (id:number) => setDone(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });

  return (
    <div className="smriti-screen flex flex-col h-full" style={{ backgroundColor:"transparent" }}>

      {/* Care tab */}
      {activeTab === "care" && <CareTab/>}

      {/* Settings tab */}
      {activeTab === "settings" && <SettingsTab profile={profile}/>}

      {/* Home tab */}
      {activeTab === "home" && <>
        {/* Hero header */}
        <div style={{ background:"linear-gradient(150deg,#8B7BC8 0%,#9BACD8 55%,#9FD5E8 100%)", flexShrink:0, borderRadius:"0 0 32px 32px", paddingBottom:24 }}>
          <StatusBar light/>
          <div className="flex items-center justify-between px-5 pt-2">
            <div className="flex items-center gap-3">
              <div style={{
                width:54, height:54, borderRadius:"50%", flexShrink:0, overflow:"hidden",
                background:"linear-gradient(135deg,#DCD8F5,#E9C5D0)",
                border:"3px solid rgba(255,255,255,0.8)",
                boxShadow:"0 4px 16px rgba(0,0,0,0.18)",
              }}>
                <svg viewBox="0 0 54 54" fill="none" className="w-full h-full">
                  <circle cx="27" cy="21" r="11" fill="#F8D8CC"/>
                  <path d="M6 50C6 38.4 15.8 29 27 29C38.2 29 48 38.4 48 50" fill="#DCD8F5"/>
                  <circle cx="23" cy="19" r="1.5" fill="#25283D" opacity="0.65"/>
                  <circle cx="31" cy="19" r="1.5" fill="#25283D" opacity="0.65"/>
                  <path d="M23 25 Q27 28 31 25" stroke="#25283D" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
                  <path d="M16 19 C16 11 21 7 27 7 C33 7 38 11 38 19" fill="#8B7BC8" opacity="0.7"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.75)", fontFamily:F }}>Good Morning,</p>
                <p style={{ fontSize:22, fontWeight:900, color:"white", fontFamily:F, lineHeight:1.1 }}>{firstName}! 👋</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90"
                style={{ backgroundColor:"rgba(255,255,255,0.2)" }}>
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                  <path d="M12 2C8.686 2 6 4.686 6 8V14L4 16H20L18 14V8C18 4.686 15.314 2 12 2Z" fill="white" opacity="0.9"/>
                  <path d="M10 18C10 19.105 10.895 20 12 20C13.105 20 14 19.105 14 18" stroke="white" strokeWidth="1.5" opacity="0.8"/>
                </svg>
                <span style={{ position:"absolute", top:8, right:8, width:8, height:8, borderRadius:"50%", backgroundColor:"#F8D8CC", border:"1.5px solid rgba(139,123,200,0.7)" }}/>
              </button>
              <SpeakerBtn variant="white"/>
            </div>
          </div>
          <div className="px-5 mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl"
              style={{ backgroundColor:"rgba(255,255,255,0.2)", backdropFilter:"blur(8px)" }}>
              <span style={{ fontSize:14 }}>📅</span>
              <span style={{ fontSize:13, fontWeight:700, color:"white", fontFamily:F }}>{today}</span>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="responsive-scroll flex-1 overflow-y-auto px-5 pt-5 pb-2">
          {/* Game cards */}
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize:16, fontWeight:800, color:"#25283D", fontFamily:F }}>Today's Games</p>
            <span style={{ fontSize:12, fontWeight:600, color:"#8B7BC8", fontFamily:F }}>2 available</span>
          </div>
          <div className="adaptive-grid home-activities-grid grid grid-cols-2 gap-3 mb-5">

            {/* Memory Match */}
            <div className="rounded-3xl overflow-hidden flex flex-col"
              style={{ backgroundColor:"#FFFDF7", boxShadow:"0 6px 24px rgba(139,123,200,0.15), 0 2px 6px rgba(37,40,61,0.06)" }}>
              <div className="flex items-center justify-center p-3" style={{ backgroundColor:"#F0ECFD", height:110 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4 }}>
                  {[0,1,2,3].map(i=>(
                    <div key={i} style={{ width:44, height:44, borderRadius:10, overflow:"hidden",
                      border:"1.5px solid rgba(139,123,200,0.2)", boxShadow:"0 2px 6px rgba(37,40,61,0.08)" }}>
                      <MMCardBack variant={i}/>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-3.5 flex flex-col gap-1.5 flex-1">
                <p style={{ fontSize:15, fontWeight:800, color:"#25283D", fontFamily:F }}>Memory Match</p>
                <div className="flex items-center gap-1.5">
                  <div style={{ width:6, height:6, borderRadius:"50%", backgroundColor:"#8B7BC8" }}/>
                  <p style={{ fontSize:12, fontWeight:600, color:"#25283D", opacity:0.45, fontFamily:F }}>~5 minutes</p>
                </div>
                <button onClick={onPlayMemoryMatch}
                  className="mt-1 w-full rounded-2xl font-800 text-white transition-all active:scale-95"
                  style={{ padding:"10px 0", fontSize:14, background:"linear-gradient(135deg,#8B7BC8,#A594DC)",
                           boxShadow:"0 4px 14px rgba(139,123,200,0.4)", fontFamily:F }}>
                  Play ▶
                </button>
              </div>
            </div>

            {/* Grocery Recall */}
            <div className="rounded-3xl overflow-hidden flex flex-col"
              style={{ backgroundColor:"#FFFDF7", boxShadow:"0 6px 24px rgba(248,216,204,0.5), 0 2px 6px rgba(37,40,61,0.06)" }}>
              <div className="flex items-center justify-center p-4" style={{ backgroundColor:"#FFF0EA", height:110 }}>
                <svg viewBox="0 0 100 84" fill="none" className="w-full h-full">
                  <ellipse cx="50" cy="76" rx="30" ry="7" fill="#F8D8CC" opacity="0.45"/>
                  <rect x="22" y="38" width="56" height="42" rx="10" fill="#F8D8CC"/>
                  <path d="M36 38C36 26 43 18 50 18C57 18 64 26 64 38" stroke="#E9C5D0" strokeWidth="4" strokeLinecap="round" fill="none"/>
                  <circle cx="38" cy="32" r="8" fill="#9FD5E8" opacity="0.9"/>
                  <circle cx="62" cy="30" r="6.5" fill="#8B7BC8" opacity="0.75"/>
                  <path d="M68 26C72 20 78 22 76 28C74 34 68 32 68 26Z" fill="#9FD5E8" opacity="0.7"/>
                  <path d="M28 50Q50 46 72 50" stroke="white" strokeWidth="1.8" opacity="0.55" strokeLinecap="round"/>
                  <path d="M26 61Q50 57 74 61" stroke="white" strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="p-3.5 flex flex-col gap-1.5 flex-1">
                <p style={{ fontSize:15, fontWeight:800, color:"#25283D", fontFamily:F }}>Grocery Recall</p>
                <div className="flex items-center gap-1.5">
                  <div style={{ width:6, height:6, borderRadius:"50%", backgroundColor:"#E9A080" }}/>
                  <p style={{ fontSize:12, fontWeight:600, color:"#25283D", opacity:0.45, fontFamily:F }}>5 minutes</p>
                </div>
                <button onClick={onPlayGroceryRecall} className="mt-1 w-full rounded-2xl font-800 text-white transition-all active:scale-95"
                  style={{ padding:"10px 0", fontSize:14, background:"linear-gradient(135deg,#E9A080,#F8C4A8)",
                           boxShadow:"0 4px 14px rgba(233,160,128,0.4)", fontFamily:F }}>
                  Play ▶
                </button>
              </div>
            </div>
          </div>

          {/* Today's Activities */}
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize:16, fontWeight:800, color:"#25283D", fontFamily:F }}>{"Today's Activities"}</p>
            <div style={{ backgroundColor:"#DCD8F5", borderRadius:20, padding:"3px 10px" }}>
              <span style={{ fontSize:12, fontWeight:700, color:"#8B7BC8", fontFamily:F }}>{done.size}/{activities.length} done</span>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden mb-4"
            style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
            {activities.map((act, idx) => {
              const isDone = done.has(act.id);
              return (
                <button key={act.id} onClick={()=>toggle(act.id)}
                  className="flex items-center gap-3 w-full text-left transition-all active:scale-97"
                  style={{
                    padding:"14px 16px",
                    borderBottom: idx<activities.length-1?"1px solid rgba(220,216,245,0.4)":"none",
                    backgroundColor: isDone?"rgba(240,236,253,0.3)":"transparent",
                  }}>
                  <div className="flex items-center justify-center rounded-2xl text-xl flex-shrink-0"
                    style={{ width:44, height:44, backgroundColor: isDone?`${act.bg}99`:act.bg, transition:"all 0.2s" }}>
                    <span style={{ opacity: isDone?0.55:1 }}>{act.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize:14, fontWeight:700, color:"#25283D", fontFamily:F,
                                opacity: isDone?0.4:1, textDecoration: isDone?"line-through":"none" }}>
                      {act.label}
                    </p>
                    <p style={{ fontSize:12, fontWeight:500, color:act.accent, fontFamily:F, marginTop:1, opacity: isDone?0.5:0.9 }}>
                      {act.time}
                    </p>
                  </div>
                  <div className="flex items-center justify-center rounded-full flex-shrink-0 transition-all"
                    style={{ width:28, height:28,
                             backgroundColor: isDone?act.accent:"transparent",
                             border: isDone?"none":`2px solid ${act.bg}`,
                             boxShadow: isDone?`0 3px 10px ${act.accent}55`:"none" }}>
                    {isDone && (
                      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                        <path d="M3 8L6.5 11.5L13 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </>}

      <BottomNav active={activeTab} onChange={setActiveTab}/>
    </div>
  );
}

// ─── Screen: MR Intro ─────────────────────────────────────────────────────────

function MRIntroScreen({ profile, onBack, onStart }: { profile: ElderProfile; onBack: ()=>void; onStart: ()=>void }) {
  const firstName = profile.name.trim().split(" ")[0] || "Asha";
  return (
    <div className="smriti-screen flex flex-col h-full" style={{ backgroundColor:"transparent" }}>
      {/* Purple header */}
      <div style={{ background:"linear-gradient(150deg,#8B7BC8 0%,#9BACD8 100%)", flexShrink:0, borderRadius:"0 0 28px 28px", paddingBottom:20 }}>
        <StatusBar light/>
        <div className="flex items-center justify-between px-5 pt-1">
          <BackBtn onBack={onBack} light/>
          <div style={{ backgroundColor:"rgba(255,255,255,0.2)", borderRadius:20, padding:"6px 14px",
                        backdropFilter:"blur(8px)" }}>
            <span style={{ fontSize:13, fontWeight:700, color:"white", fontFamily:F }}>🧠 Memory Recall</span>
          </div>
          <SpeakerBtn variant="white"/>
        </div>
        {/* Large brain in header */}
        <div className="flex items-center justify-center pt-4 pb-2">
          <div style={{ width:180, height:150 }}>
            <svg viewBox="0 0 180 140" fill="none" className="w-full h-full">
              <ellipse cx="90" cy="130" rx="55" ry="11" fill="rgba(0,0,0,0.15)"/>
              <path d="M56 88C42 84 32 66 38 50C44 34 60 28 72 38C76 26 90 20 104 26C118 14 136 20 138 38C150 42 156 60 148 76C142 88 128 94 116 88L106 98L90 104L74 98Z"
                fill="rgba(255,255,255,0.25)"/>
              <path d="M72 38C75 47 78 57 78 66M104 26C101 37 99 49 99 62M56 62C63 60 72 60 78 66M138 50C131 50 121 54 116 62M78 66C86 64 98 64 106 68"
                stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <circle cx="46" cy="40" r="5" fill="rgba(255,255,255,0.6)"/>
              <circle cx="144" cy="36" r="4" fill="#F8D8CC" opacity="0.8"/>
              <circle cx="150" cy="72" r="3" fill="#E9C5D0" opacity="0.7"/>
              <path d="M44 34L46 40L48 34L46 28Z" fill="rgba(255,255,255,0.4)"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="responsive-scroll flex-1 overflow-y-auto px-5 pt-5 pb-2">
        <h1 style={{ fontSize:24, fontWeight:900, color:"#25283D", fontFamily:F, lineHeight:1.2, marginBottom:4 }}>
          Let's exercise your memory, {firstName}!
        </h1>
        <p style={{ fontSize:14, fontWeight:500, color:"#25283D", opacity:0.5, fontFamily:F, marginBottom:20 }}>
          A gentle 5-minute brain workout ✨
        </p>

        {/* How to play card */}
        <div className="rounded-3xl p-5 mb-4"
          style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
          <p style={{ fontSize:13, fontWeight:800, color:"#25283D", opacity:0.55, fontFamily:F, marginBottom:14, textTransform:"uppercase", letterSpacing:0.5 }}>
            How to play
          </p>
          {[
            { n:"1", text:"Look at 4 familiar objects shown on screen.", color:"#8B7BC8", bg:"#F0ECFD" },
            { n:"2", text:"Remember as many as you can in 15 seconds.", color:"#E9A080", bg:"#FFF3EC" },
            { n:"3", text:"Pick the objects you saw from a larger set.", color:"#4BAAC8", bg:"#E8F5FC" },
          ].map(({ n,text,color,bg }) => (
            <div key={n} className="flex items-start gap-3 mb-3 last:mb-0">
              <div className="flex items-center justify-center rounded-full flex-shrink-0 text-sm font-900"
                style={{ width:30, height:30, backgroundColor:bg, color, fontFamily:F }}>{n}</div>
              <p style={{ fontSize:14, fontWeight:600, color:"#25283D", opacity:0.75, fontFamily:F, lineHeight:1.5, paddingTop:4 }}>{text}</p>
            </div>
          ))}
        </div>

        {/* Voice button */}
        <button className="w-full flex items-center justify-center gap-2 rounded-2xl transition-all active:scale-95"
          style={{ padding:"14px 0", backgroundColor:"#DCD8F5" }}>
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="#8B7BC8"/>
            <path d="M15.54 8.46C16.48 9.4 17 10.67 17 12" stroke="#8B7BC8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize:14, fontWeight:700, color:"#8B7BC8", fontFamily:F }}>🔊 Hear Instructions</span>
        </button>
      </div>

      <div className="flex-shrink-0 px-5 pb-8 pt-3">
        <button onClick={onStart}
          className="w-full rounded-3xl font-800 text-white transition-all active:scale-95"
          style={{ padding:"17px 0", fontSize:18, background:"linear-gradient(135deg,#8B7BC8,#A594DC)",
                   boxShadow:"0 8px 28px rgba(139,123,200,0.45)", fontFamily:F }}>
          Start Game ▶
        </button>
      </div>
    </div>
  );
}

// ─── Screen: MR Remember ─────────────────────────────────────────────────────

function MRRememberScreen({ onProceed }: { onProceed: ()=>void }) {
  const [timeLeft, setTimeLeft] = useState(REMEMBER_SECONDS);
  const correct = ALL_OBJECTS.filter(o=>o.correct);
  const cbRef = useCallback(onProceed, []);

  useEffect(() => {
    if (timeLeft<=0){ cbRef(); return; }
    const t = setTimeout(()=>setTimeLeft(s=>s-1), 1000);
    return ()=>clearTimeout(t);
  }, [timeLeft, cbRef]);

  const pct = timeLeft/REMEMBER_SECONDS;
  const R=30, C=2*Math.PI*R;
  const urgent = timeLeft<=5;
  const ringColor = urgent ? "#E9A080" : "#8B7BC8";

  return (
    <div className="smriti-screen flex flex-col h-full" style={{ backgroundColor:"transparent" }}>
      {/* Header */}
      <div style={{ backgroundColor:"#FFFDF7", flexShrink:0, borderRadius:"0 0 24px 24px", boxShadow:"0 4px 16px rgba(37,40,61,0.06)" }}>
        <StatusBar/>
        <div className="flex items-center justify-between px-5 pb-4">
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:"#8B7BC8", fontFamily:F, textTransform:"uppercase", letterSpacing:0.8, marginBottom:2 }}>Step 1 of 2</p>
            <h2 style={{ fontSize:20, fontWeight:900, color:"#25283D", fontFamily:F }}>Remember these objects</h2>
          </div>
          {/* Countdown ring */}
          <div style={{ position:"relative", width:72, height:72 }}>
            <svg width="72" height="72" viewBox="0 0 72 72" style={{ position:"absolute", inset:0, transform:"rotate(-90deg)" }}>
              <circle cx="36" cy="36" r={R} stroke="#F0ECFD" strokeWidth="5" fill="none"/>
              <circle cx="36" cy="36" r={R} stroke={ringColor} strokeWidth="5" fill="none"
                strokeDasharray={`${C*pct} ${C}`} strokeLinecap="round"
                style={{ transition:"stroke-dasharray 1s linear, stroke 0.4s" }}/>
            </svg>
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:22, fontWeight:900, color:ringColor, fontFamily:F }}>{timeLeft}</span>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="px-5 pb-4">
          <div style={{ height:5, borderRadius:10, backgroundColor:"#F0ECFD" }}>
            <div style={{ height:5, borderRadius:10, width:`${pct*100}%`, background:`linear-gradient(90deg,${ringColor},#a796db)`, transition:"width 1s linear, background 0.4s" }}/>
          </div>
          <p style={{ fontSize:12, fontWeight:600, color:"#25283D", opacity:0.4, fontFamily:F, textAlign:"center", marginTop:6 }}>
            {urgent ? "⚠️ Hurry up!" : "Look carefully and remember!"}
          </p>
        </div>
      </div>

      {/* Object grid */}
      <div className="responsive-scroll flex-1 overflow-y-auto px-4 pt-4 pb-2">
        <div className="adaptive-grid recall-grid grid grid-cols-2 gap-3.5">
          {correct.map(obj=>(
            <div key={obj.id} className="rounded-3xl overflow-hidden"
              style={{ backgroundColor:"#FFFDF7", boxShadow:"0 6px 20px rgba(37,40,61,0.08)" }}>
              <div className="flex items-center justify-center p-5" style={{ backgroundColor:obj.bg, height:130 }}>
                <div style={{ width:95, height:95 }}><obj.Illustration/></div>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-3">
                <div style={{ width:8, height:8, borderRadius:"50%", backgroundColor:obj.accent, flexShrink:0 }}/>
                <p style={{ fontSize:15, fontWeight:800, color:"#25283D", fontFamily:F }}>{obj.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Game button + voice nudge */}
      <div className="flex-shrink-0 px-4 pb-7 pt-3 flex flex-col gap-3">
        <button onClick={onProceed}
          className="w-full rounded-3xl font-800 text-white transition-all active:scale-95"
          style={{ padding:"17px 0", fontSize:18, background:"linear-gradient(135deg,#8B7BC8,#A594DC)",
                   boxShadow:"0 8px 28px rgba(139,123,200,0.45)", fontFamily:F }}>
          I Remember! Start Game ▶
        </button>
        <div className="flex items-center justify-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="#9FD5E8"/>
            <path d="M15.54 8.46C16.48 9.4 17 10.67 17 12" stroke="#9FD5E8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p style={{ fontSize:12, fontWeight:600, color:"#25283D", opacity:0.35, fontFamily:F }}>Reading objects aloud</p>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: MR Recall ────────────────────────────────────────────────────────

function MRRecallScreen({ onCheck }: { onCheck: (s: Set<string>)=>void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [shuffled] = useState(()=>shuffle(ALL_OBJECTS));

  const toggle = (id:string) => setSelected(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });

  return (
    <div className="smriti-screen flex flex-col h-full" style={{ backgroundColor:"transparent" }}>
      {/* Header */}
      <div style={{ backgroundColor:"#FFFDF7", flexShrink:0, borderRadius:"0 0 24px 24px", boxShadow:"0 4px 16px rgba(37,40,61,0.06)" }}>
        <StatusBar/>
        <div className="px-5 pb-4">
          <p style={{ fontSize:11, fontWeight:700, color:"#8B7BC8", fontFamily:F, textTransform:"uppercase", letterSpacing:0.8, marginBottom:2 }}>Step 2 of 2</p>
          <h2 style={{ fontSize:20, fontWeight:900, color:"#25283D", fontFamily:F }}>Which objects did you see?</h2>
          <div className="flex items-center justify-between mt-2">
            <p style={{ fontSize:13, fontWeight:500, color:"#25283D", opacity:0.5, fontFamily:F }}>Tap all the ones you remember</p>
            <div style={{
              padding:"4px 12px", borderRadius:20, transition:"all 0.2s",
              backgroundColor: selected.size>0?"#DCD8F5":"#F5F3FF",
            }}>
              <span style={{ fontSize:12, fontWeight:700, color:"#8B7BC8", fontFamily:F }}>
                {selected.size>0 ? `${selected.size} selected` : "Tap to select"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Object grid */}
      <div className="responsive-scroll flex-1 overflow-y-auto px-4 py-4">
        <div className="adaptive-grid recall-choice-grid grid grid-cols-2 gap-3">
          {shuffled.map(obj=>{
            const on = selected.has(obj.id);
            return (
              <button key={obj.id} onClick={()=>toggle(obj.id)}
                className="rounded-3xl overflow-hidden flex flex-col transition-all active:scale-97"
                style={{
                  backgroundColor: on?"#F0ECFD":"#FFFDF7",
                  boxShadow: on?`0 0 0 2.5px ${obj.accent}, 0 6px 20px ${obj.accent}30`:"0 4px 16px rgba(37,40,61,0.07)",
                  transform: on?"scale(1.025)":"scale(1)",
                  transition:"all 0.15s ease",
                }}>
                <div className="flex items-center justify-center relative" style={{ backgroundColor: on?`${obj.bg}CC`:obj.bg, height:100, padding:16 }}>
                  <div style={{ width:70, height:70 }}><obj.Illustration/></div>
                  {on && (
                    <div style={{
                      position:"absolute", top:8, right:8, width:26, height:26, borderRadius:"50%",
                      backgroundColor:obj.accent, display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow:`0 3px 10px ${obj.accent}60`,
                    }}>
                      <svg viewBox="0 0 16 16" fill="none" style={{ width:14, height:14 }}>
                        <path d="M3 8L6.5 11.5L13 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
                <p style={{ fontSize:13, fontWeight:800, color: on?obj.accent:"#25283D", fontFamily:F, textAlign:"center", padding:"10px 8px 12px" }}>
                  {obj.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="flex-shrink-0 px-5 pb-8 pt-3"
        style={{ background:"linear-gradient(to top, #E5F2F8 70%, transparent)" }}>
        <button onClick={()=>selected.size>0&&onCheck(selected)}
          className="w-full rounded-3xl font-800 transition-all active:scale-95"
          style={{
            padding:"17px 0", fontSize:18,
            background: selected.size>0?"linear-gradient(135deg,#8B7BC8,#A594DC)":"#DCD8F5",
            boxShadow: selected.size>0?"0 8px 28px rgba(139,123,200,0.45)":"none",
            color: selected.size>0?"white":"#9E8FC0", fontFamily:F,
            cursor: selected.size>0?"pointer":"not-allowed",
          }}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}

// ─── Screen: MR Result ────────────────────────────────────────────────────────

function MRResultScreen({ profile, selected, onPlayAgain, onHome }: {
  profile: ElderProfile; selected: Set<string>; onPlayAgain: ()=>void; onHome: ()=>void;
}) {
  const firstName = profile.name.trim().split(" ")[0] || "Asha";
  const correctIds = new Set(ALL_OBJECTS.filter(o=>o.correct).map(o=>o.id));
  const tp = [...selected].filter(id=>correctIds.has(id)).length;
  const acc = Math.round((tp/4)*100);

  const cfg =
    acc===100 ? { emoji:"🏆", title:"Perfect Score!", msg:`Amazing, ${firstName}! You remembered every object!`, stars:3, grad:"linear-gradient(150deg,#8B7BC8,#9BACD8)" } :
    acc>=75   ? { emoji:"⭐", title:"Well Done!",     msg:"Great memory! You're doing brilliantly.", stars:3, grad:"linear-gradient(150deg,#9BACD8,#9FD5E8)" } :
    acc>=50   ? { emoji:"🎉", title:"Good Effort!",   msg:"Nice work! A little more practice and you'll ace it.", stars:2, grad:"linear-gradient(150deg,#E9A080,#F8C4A8)" } :
                { emoji:"💪", title:"Keep Going!",    msg:"Every attempt makes your memory stronger!", stars:1, grad:"linear-gradient(150deg,#E9C5D0,#DCD8F5)" };

  const correctObjs = ALL_OBJECTS.filter(o=>o.correct);

  return (
    <div className="smriti-screen flex flex-col h-full" style={{ backgroundColor:"transparent" }}>
      {/* Hero */}
      <div style={{ background:cfg.grad, flexShrink:0, borderRadius:"0 0 36px 36px", paddingBottom:28 }}>
        <StatusBar light/>
        <div className="flex flex-col items-center px-6 pt-2 gap-3">
          <div style={{
            width:84, height:84, borderRadius:"50%",
            backgroundColor:"rgba(255,255,255,0.25)",
            backdropFilter:"blur(8px)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:42,
            boxShadow:"0 8px 32px rgba(0,0,0,0.15)",
          }}>{cfg.emoji}</div>

          <div style={{ display:"flex", gap:6 }}>
            {[1,2,3].map(s=>(
              <svg key={s} viewBox="0 0 28 28" fill="none" style={{ width:32, height:32 }}>
                <path d="M14 2L17.5 9.5L26 10.5L20 16.5L21.5 25L14 21L6.5 25L8 16.5L2 10.5L10.5 9.5Z"
                  fill={s<=cfg.stars?"rgba(255,255,255,0.95)":"rgba(255,255,255,0.25)"}/>
              </svg>
            ))}
          </div>

          <div className="text-center">
            <h1 style={{ fontSize:30, fontWeight:900, color:"white", fontFamily:F }}>{cfg.title}</h1>
            <p style={{ fontSize:14, fontWeight:600, color:"rgba(255,255,255,0.8)", fontFamily:F, marginTop:4, lineHeight:1.5 }}>{cfg.msg}</p>
          </div>
        </div>
      </div>

      <div className="responsive-scroll flex-1 overflow-y-auto px-5 pt-5 pb-2">
        {/* Stats */}
        <div className="adaptive-grid stats-grid grid grid-cols-3 gap-3 mb-4">
          {[
            { val:`${tp}/4`, label:"Correct",  color:"#8B7BC8", bg:"#F0ECFD" },
            { val:`${acc}%`, label:"Accuracy", color:"#4BAAC8", bg:"#E8F5FC" },
            { val:"15s",     label:"Time",     color:"#E9A080", bg:"#FFF3EC" },
          ].map(({ val,label,color,bg }) => (
            <div key={label} className="rounded-2xl flex flex-col items-center py-4"
              style={{ backgroundColor:bg, boxShadow:`0 4px 16px ${color}20` }}>
              <p style={{ fontSize:22, fontWeight:900, color, fontFamily:F }}>{val}</p>
              <p style={{ fontSize:11, fontWeight:700, color:"#25283D", opacity:0.55, fontFamily:F, marginTop:2 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Object breakdown */}
        <div className="rounded-3xl p-4 mb-4"
          style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 18px rgba(37,40,61,0.10), 0 1px 4px rgba(37,40,61,0.05)" }}>
          <p style={{ fontSize:13, fontWeight:800, color:"#25283D", opacity:0.55, fontFamily:F, marginBottom:14 }}>Objects to remember</p>
          <div className="adaptive-grid object-grid grid grid-cols-4 gap-3">
            {correctObjs.map(obj=>{
              const hit = selected.has(obj.id);
              return (
                <div key={obj.id} className="flex flex-col items-center gap-2">
                  <div style={{ position:"relative", width:58, height:58 }}>
                    <div style={{
                      width:58, height:58, borderRadius:16,
                      backgroundColor: hit?obj.bg:"#F5F5F8",
                      border:`2px solid ${hit?obj.accent:"#E8E4F0"}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>
                      <div style={{ width:38, height:38 }}><obj.Illustration/></div>
                    </div>
                    <div style={{
                      position:"absolute", top:-4, right:-4, width:20, height:20, borderRadius:"50%",
                      backgroundColor: hit?obj.accent:"#F8D8CC",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow: hit?`0 2px 8px ${obj.accent}60`:"none",
                    }}>
                      {hit ? (
                        <svg viewBox="0 0 12 12" fill="none" style={{ width:11, height:11 }}>
                          <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 12 12" fill="none" style={{ width:10, height:10 }}>
                          <path d="M3 9L9 3M3 3L9 9" stroke="#E9A080" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize:11, fontWeight:700, color:"#25283D", opacity:0.6, fontFamily:F, textAlign:"center", lineHeight:1.3 }}>{obj.label}</p>
                </div>
              );
            })}
          </div>
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
          Back to Home
        </button>
      </div>
    </div>
  );
}

// ─── Screen: GR Intro ────────────────────────────────────────────────────────

function GRIntroScreen({ profile, onBack, onStart }: { profile: ElderProfile; onBack: ()=>void; onStart: ()=>void }) {
  const firstName = profile.name.trim().split(" ")[0] || "Asha";
  return (
    <div className="smriti-screen flex flex-col h-full" style={{ backgroundColor:"transparent" }}>
      <div style={{ background:"linear-gradient(150deg,#E9A080 0%,#F8C4A8 100%)", flexShrink:0, borderRadius:"0 0 28px 28px", paddingBottom:20 }}>
        <StatusBar light/>
        <div className="flex items-center justify-between px-5 pt-1">
          <BackBtn onBack={onBack} light/>
          <div style={{ backgroundColor:"rgba(255,255,255,0.25)", borderRadius:20, padding:"6px 14px", backdropFilter:"blur(8px)" }}>
            <span style={{ fontSize:13, fontWeight:700, color:"white", fontFamily:F }}>🛒 Grocery Recall</span>
          </div>
          <SpeakerBtn variant="white"/>
        </div>
        {/* Header illustration */}
        <div className="flex items-center justify-center pt-3 pb-1">
          <svg viewBox="0 0 200 130" fill="none" style={{ width:200, height:130 }}>
            <ellipse cx="100" cy="118" rx="65" ry="12" fill="rgba(0,0,0,0.1)"/>
            {/* Market stall backdrop */}
            <rect x="20" y="50" width="160" height="65" rx="12" fill="rgba(255,255,255,0.2)"/>
            {/* Awning */}
            <path d="M12 50 L188 50 L188 40 L12 40Z" fill="rgba(255,255,255,0.3)"/>
            {/* Stripes */}
            {[24,44,64,84,104,124,144,164].map((x,i)=>(
              <rect key={i} x={x} y={40} width={10} height={10} fill="rgba(255,255,255,0.2)"/>
            ))}
            {/* Produce items */}
            <circle cx="52" cy="80" r="16" fill="#E84848" opacity="0.9"/>
            <circle cx="88" cy="75" r="14" fill="#88C848" opacity="0.9"/>
            <circle cx="120" cy="80" r="13" fill="#F07830" opacity="0.9"/>
            <ellipse cx="152" cy="78" rx="12" ry="16" fill="#D4B878" opacity="0.9"/>
            <circle cx="52" cy="80" r="7" fill="#F06060" opacity="0.4"/>
            <circle cx="88" cy="75" r="6" fill="#A8D868" opacity="0.4"/>
            {/* Stars */}
            <path d="M30 30 L32 24 L34 30 L40 28 L34 32 L36 38 L32 34 L28 38 L30 32 L24 28Z" fill="rgba(255,255,255,0.7)"/>
            <path d="M160 22 L162 16 L164 22 L170 20 L164 24 L166 30 L162 26 L158 30 L160 24 L154 20Z" fill="rgba(255,255,255,0.85)"/>
            <circle cx="170" cy="45" r="5" fill="rgba(255,255,255,0.5)"/>
            <circle cx="30" cy="48" r="4" fill="rgba(255,255,255,0.4)"/>
          </svg>
        </div>
      </div>

      <div className="responsive-scroll flex-1 overflow-y-auto px-5 pt-5 pb-2">
        <h1 style={{ fontSize:24, fontWeight:900, color:"#25283D", fontFamily:F, lineHeight:1.2, marginBottom:4 }}>
          Time to shop, {firstName}!
        </h1>
        <p style={{ fontSize:14, fontWeight:500, color:"#25283D", opacity:0.5, fontFamily:F, marginBottom:20 }}>
          Remember the grocery list for a delicious meal 🍲
        </p>

        <div className="rounded-3xl p-5 mb-4"
          style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
          <p style={{ fontSize:13, fontWeight:800, color:"#25283D", opacity:0.55, fontFamily:F, marginBottom:14, textTransform:"uppercase", letterSpacing:0.5 }}>
            How to play
          </p>
          {[
            { n:"1", text:"Study 5 grocery items needed for a simple dish.", color:"#E9A080", bg:"#FFF3EC" },
            { n:"2", text:"Remember them all in the given time.", color:"#8B7BC8", bg:"#F0ECFD" },
            { n:"3", text:"Pick the correct items at the virtual market!", color:"#4BAAC8", bg:"#E8F5FC" },
          ].map(({ n,text,color,bg }) => (
            <div key={n} className="flex items-start gap-3 mb-3 last:mb-0">
              <div className="flex items-center justify-center rounded-full flex-shrink-0 text-sm font-900"
                style={{ width:30, height:30, backgroundColor:bg, color, fontFamily:F }}>{n}</div>
              <p style={{ fontSize:14, fontWeight:600, color:"#25283D", opacity:0.75, fontFamily:F, lineHeight:1.5, paddingTop:4 }}>{text}</p>
            </div>
          ))}
        </div>

        <button className="w-full flex items-center justify-center gap-2 rounded-2xl transition-all active:scale-95"
          style={{ padding:"14px 0", backgroundColor:"#FFF3EC" }}>
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="#E9A080"/>
            <path d="M15.54 8.46C16.48 9.4 17 10.67 17 12" stroke="#E9A080" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize:14, fontWeight:700, color:"#E9A080", fontFamily:F }}>🔊 Hear Instructions</span>
        </button>
      </div>

      <div className="flex-shrink-0 px-5 pb-8 pt-3">
        <button onClick={onStart}
          className="w-full rounded-3xl font-800 text-white transition-all active:scale-95"
          style={{ padding:"17px 0", fontSize:18, background:"linear-gradient(135deg,#E9A080,#F8C4A8)",
                   boxShadow:"0 8px 28px rgba(233,160,128,0.5)", fontFamily:F }}>
          Start Game ▶
        </button>
      </div>
    </div>
  );
}

// ─── Screen: GR Remember ─────────────────────────────────────────────────────

function GRRememberScreen({ onProceed, items }: { onProceed: ()=>void; items?: GroceryItem[] }) {
  const [timeLeft, setTimeLeft] = useState(GR_SECONDS);
  const correct = (items ?? ALL_GROCERIES).filter(g=>g.correct);
  const cbRef = useCallback(onProceed, []);

  useEffect(() => {
    if (timeLeft<=0){ cbRef(); return; }
    const t = setTimeout(()=>setTimeLeft(s=>s-1), 1000);
    return ()=>clearTimeout(t);
  }, [timeLeft, cbRef]);

  const pct = timeLeft/GR_SECONDS;
  const R=30, C=2*Math.PI*R;
  const urgent = timeLeft<=5;
  const ringColor = urgent ? "#E84848" : "#E9A080";

  return (
    <div className="smriti-screen flex flex-col h-full" style={{ backgroundColor:"#FFF8F5" }}>
      {/* Header */}
      <div style={{ backgroundColor:"#FFFDF7", flexShrink:0, borderRadius:"0 0 24px 24px", boxShadow:"0 4px 16px rgba(37,40,61,0.06)" }}>
        <StatusBar/>
        <div className="flex items-center justify-between px-5 pb-4">
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:"#E9A080", fontFamily:F, textTransform:"uppercase", letterSpacing:0.8, marginBottom:2 }}>Step 1 of 2</p>
            <h2 style={{ fontSize:20, fontWeight:900, color:"#25283D", fontFamily:F }}>Remember these groceries</h2>
          </div>
          <div style={{ position:"relative", width:72, height:72 }}>
            <svg width="72" height="72" viewBox="0 0 72 72" style={{ position:"absolute", inset:0, transform:"rotate(-90deg)" }}>
              <circle cx="36" cy="36" r={R} stroke="#FDEEE8" strokeWidth="5" fill="none"/>
              <circle cx="36" cy="36" r={R} stroke={ringColor} strokeWidth="5" fill="none"
                strokeDasharray={`${C*pct} ${C}`} strokeLinecap="round"
                style={{ transition:"stroke-dasharray 1s linear, stroke 0.4s" }}/>
            </svg>
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:22, fontWeight:900, color:ringColor, fontFamily:F }}>{timeLeft}</span>
            </div>
          </div>
        </div>
        <div className="px-5 pb-4">
          <div style={{ height:5, borderRadius:10, backgroundColor:"#FDEEE8" }}>
            <div style={{ height:5, borderRadius:10, width:`${pct*100}%`, background:`linear-gradient(90deg,${ringColor},#F8C4A8)`, transition:"width 1s linear, background 0.4s" }}/>
          </div>
          <p style={{ fontSize:12, fontWeight:600, color:"#25283D", opacity:0.4, fontFamily:F, textAlign:"center", marginTop:6 }}>
            {urgent ? "⚠️ Hurry up!" : "You need these to cook a delicious meal!"}
          </p>
        </div>
      </div>

      {/* Grocery grid — 2 cols, 3 rows for 5 items (last spans full) */}
      <div className="responsive-scroll flex-1 overflow-y-auto px-4 pt-4 pb-2">
        <div className="adaptive-grid recall-grid grid grid-cols-2 gap-3.5">
          {correct.map((item, idx) => {
            const isLast = idx === correct.length - 1 && correct.length % 2 !== 0;
            return (
              <div key={item.id}
                className="rounded-3xl overflow-hidden"
                style={{ gridColumn: isLast?"1 / span 2":"auto", backgroundColor:"#FFFDF7", boxShadow:"0 6px 20px rgba(37,40,61,0.08)" }}>
                <div className="flex items-center justify-center p-4"
                  style={{ backgroundColor:item.bg, height: isLast ? 100 : 120 }}>
                  <div style={{ width: isLast?85:90, height: isLast?85:90 }}><item.Illustration/></div>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-3">
                  <div style={{ width:8, height:8, borderRadius:"50%", backgroundColor:item.accent, flexShrink:0 }}/>
                  <p style={{ fontSize:15, fontWeight:800, color:"#25283D", fontFamily:F }}>{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Start Game button */}
      <div className="flex-shrink-0 px-4 pb-7 pt-3 flex flex-col gap-3">
        <button onClick={onProceed}
          className="w-full rounded-3xl font-800 text-white transition-all active:scale-95"
          style={{ padding:"17px 0", fontSize:18, background:"linear-gradient(135deg,#E9A080,#F8C4A8)",
                   boxShadow:"0 8px 28px rgba(233,160,128,0.5)", fontFamily:F }}>
          I Remember! Start Game ▶
        </button>
        <div className="flex items-center justify-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="#F8C4A8"/>
            <path d="M15.54 8.46C16.48 9.4 17 10.67 17 12" stroke="#F8C4A8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p style={{ fontSize:12, fontWeight:600, color:"#25283D", opacity:0.35, fontFamily:F }}>Reading groceries aloud</p>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: GR Recall ───────────────────────────────────────────────────────

function GRRecallScreen({ onCheck, items }: { onCheck: (s: Set<string>)=>void; items?: GroceryItem[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [shuffled] = useState(()=>shuffle(items ?? ALL_GROCERIES));

  const toggle = (id:string) => setSelected(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });

  return (
    <div className="smriti-screen flex flex-col h-full" style={{ backgroundColor:"#FFF8F5" }}>
      {/* Header */}
      <div style={{ backgroundColor:"#FFFDF7", flexShrink:0, borderRadius:"0 0 24px 24px", boxShadow:"0 4px 16px rgba(37,40,61,0.06)" }}>
        <StatusBar/>
        <div className="px-5 pb-3">
          <p style={{ fontSize:11, fontWeight:700, color:"#E9A080", fontFamily:F, textTransform:"uppercase", letterSpacing:0.8, marginBottom:2 }}>Step 2 of 2</p>
          <h2 style={{ fontSize:20, fontWeight:900, color:"#25283D", fontFamily:F }}>Pick what you remembered</h2>
          <p style={{ fontSize:13, fontWeight:500, color:"#25283D", opacity:0.5, fontFamily:F, marginTop:3 }}>
            🛒 You're at the market — tap the items from your list!
          </p>
          {/* Market banner */}
          <div className="mt-3 rounded-2xl flex items-center gap-2 px-4 py-2.5"
            style={{ background:"linear-gradient(90deg,#FFF3EC,#FDEEE8)" }}>
            <span style={{ fontSize:18 }}>🏪</span>
            <p style={{ fontSize:13, fontWeight:700, color:"#E9A080", fontFamily:F }}>Fresh Market</p>
            <div className="ml-auto" style={{
              padding:"3px 10px", borderRadius:20,
              backgroundColor: selected.size>0?"#E9A080":"#F8D8CC",
            }}>
              <span style={{ fontSize:12, fontWeight:700, color:"white", fontFamily:F }}>
                {selected.size} in cart
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grocery grid */}
      <div className="responsive-scroll flex-1 overflow-y-auto px-4 py-4">
        <div className="adaptive-grid recall-choice-grid grid grid-cols-2 gap-3">
          {shuffled.map(item => {
            const on = selected.has(item.id);
            return (
              <button key={item.id} onClick={()=>toggle(item.id)}
                className="rounded-3xl overflow-hidden flex flex-col transition-all active:scale-97"
                style={{
                  backgroundColor: on?"#FFF3EC":"#FFFDF7",
                  boxShadow: on?`0 0 0 2.5px ${item.accent}, 0 6px 20px ${item.accent}30`:"0 4px 16px rgba(37,40,61,0.07)",
                  transform: on?"scale(1.025)":"scale(1)",
                  transition:"all 0.15s ease",
                }}>
                <div className="flex items-center justify-center relative"
                  style={{ backgroundColor: on?`${item.bg}CC`:item.bg, height:95, padding:14 }}>
                  <div style={{ width:68, height:68 }}><item.Illustration/></div>
                  {on && (
                    <div style={{
                      position:"absolute", top:8, right:8, width:26, height:26, borderRadius:"50%",
                      backgroundColor:item.accent, display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow:`0 3px 10px ${item.accent}60`,
                    }}>
                      <svg viewBox="0 0 16 16" fill="none" style={{ width:14, height:14 }}>
                        <path d="M3 8L6.5 11.5L13 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
                <p style={{ fontSize:13, fontWeight:800, color: on?item.accent:"#25283D", fontFamily:F, textAlign:"center", padding:"9px 8px 11px" }}>
                  {item.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="flex-shrink-0 px-5 pb-8 pt-3"
        style={{ background:"linear-gradient(to top, #FFF8F5 70%, transparent)" }}>
        <button onClick={()=>selected.size>0&&onCheck(selected)}
          className="w-full rounded-3xl font-800 transition-all active:scale-95"
          style={{
            padding:"17px 0", fontSize:18,
            background: selected.size>0?"linear-gradient(135deg,#E9A080,#F8C4A8)":"#F8D8CC",
            boxShadow: selected.size>0?"0 8px 28px rgba(233,160,128,0.5)":"none",
            color: selected.size>0?"white":"#C8A090", fontFamily:F,
            cursor: selected.size>0?"pointer":"not-allowed",
          }}>
          Check My Cart ✓
        </button>
      </div>
    </div>
  );
}

// ─── Screen: GR Result ───────────────────────────────────────────────────────

function GRResultScreen({ profile, selected, onPlayAgain, onHome, items }: {
  profile: ElderProfile; selected: Set<string>; onPlayAgain: ()=>void; onHome: ()=>void; items?: GroceryItem[];
}) {
  const firstName = profile.name.trim().split(" ")[0] || "Asha";
  const correctIds = new Set((items ?? ALL_GROCERIES).filter(g=>g.correct).map(g=>g.id));
  const tp = [...selected].filter(id=>correctIds.has(id)).length;
  const total = correctIds.size;
  const acc = Math.round((tp/total)*100);

  const cfg =
    acc===100 ? { emoji:"🏆", title:"Perfect Shopper!", msg:`Wonderful, ${firstName}! You got every item!`, stars:3, grad:"linear-gradient(150deg,#E9A080,#F8C4A8)" } :
    acc>=80   ? { emoji:"🛒", title:"Great Shopping!",  msg:"Nearly perfect — you remembered almost everything!", stars:3, grad:"linear-gradient(150deg,#F8C4A8,#F0D8C8)" } :
    acc>=60   ? { emoji:"🌟", title:"Good Effort!",     msg:"Nice work! A little more practice and you'll nail it.", stars:2, grad:"linear-gradient(150deg,#DCD8F5,#C4BCE8)" } :
                { emoji:"💪", title:"Keep Practising!", msg:"Each try makes your memory stronger. You can do it!", stars:1, grad:"linear-gradient(150deg,#E9C5D0,#DCD8F5)" };

  const correctItems = (items ?? ALL_GROCERIES).filter(g=>g.correct);

  return (
    <div className="smriti-screen flex flex-col h-full" style={{ backgroundColor:"#FFF8F5" }}>
      {/* Hero */}
      <div style={{ background:cfg.grad, flexShrink:0, borderRadius:"0 0 36px 36px", paddingBottom:28 }}>
        <StatusBar light/>
        <div className="flex flex-col items-center px-6 pt-2 gap-3">
          <div style={{
            width:84, height:84, borderRadius:"50%",
            backgroundColor:"rgba(255,255,255,0.3)", backdropFilter:"blur(8px)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:42, boxShadow:"0 8px 32px rgba(0,0,0,0.12)",
          }}>{cfg.emoji}</div>

          <div style={{ display:"flex", gap:6 }}>
            {[1,2,3].map(s=>(
              <svg key={s} viewBox="0 0 28 28" fill="none" style={{ width:32, height:32 }}>
                <path d="M14 2L17.5 9.5L26 10.5L20 16.5L21.5 25L14 21L6.5 25L8 16.5L2 10.5L10.5 9.5Z"
                  fill={s<=cfg.stars?"rgba(255,255,255,0.95)":"rgba(255,255,255,0.25)"}/>
              </svg>
            ))}
          </div>

          <div className="text-center">
            <h1 style={{ fontSize:28, fontWeight:900, color:"white", fontFamily:F }}>{cfg.title}</h1>
            <p style={{ fontSize:14, fontWeight:600, color:"rgba(255,255,255,0.85)", fontFamily:F, marginTop:4, lineHeight:1.5 }}>{cfg.msg}</p>
          </div>
        </div>
      </div>

      <div className="responsive-scroll flex-1 overflow-y-auto px-5 pt-5 pb-2">
        {/* Stats */}
        <div className="adaptive-grid stats-grid grid grid-cols-3 gap-3 mb-4">
          {[
            { val:`${tp}/${total}`, label:"Correct",  color:"#E9A080", bg:"#FFF3EC" },
            { val:`${acc}%`,        label:"Accuracy", color:"#8B7BC8", bg:"#F0ECFD" },
            { val:`${GR_SECONDS}s`, label:"Time",     color:"#4BAAC8", bg:"#E8F5FC" },
          ].map(({ val,label,color,bg }) => (
            <div key={label} className="rounded-2xl flex flex-col items-center py-4"
              style={{ backgroundColor:bg, boxShadow:`0 4px 16px ${color}20` }}>
              <p style={{ fontSize:22, fontWeight:900, color, fontFamily:F }}>{val}</p>
              <p style={{ fontSize:11, fontWeight:700, color:"#25283D", opacity:0.55, fontFamily:F, marginTop:2 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Item breakdown */}
        <div className="rounded-3xl p-4 mb-4"
          style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 18px rgba(37,40,61,0.10), 0 1px 4px rgba(37,40,61,0.05)" }}>
          <p style={{ fontSize:13, fontWeight:800, color:"#25283D", opacity:0.55, fontFamily:F, marginBottom:14 }}>Your grocery list</p>
          <div className="adaptive-grid grocery-list-grid grid grid-cols-5 gap-2">
            {correctItems.map(item=>{
              const hit = selected.has(item.id);
              return (
                <div key={item.id} className="flex flex-col items-center gap-1.5">
                  <div style={{ position:"relative", width:52, height:52 }}>
                    <div style={{
                      width:52, height:52, borderRadius:14,
                      backgroundColor: hit?item.bg:"#F5F5F8",
                      border:`2px solid ${hit?item.accent:"#EDE8F0"}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>
                      <div style={{ width:34, height:34 }}><item.Illustration/></div>
                    </div>
                    <div style={{
                      position:"absolute", top:-4, right:-4, width:18, height:18, borderRadius:"50%",
                      backgroundColor: hit?item.accent:"#F8D8CC",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow: hit?`0 2px 8px ${item.accent}60`:"none",
                    }}>
                      {hit ? (
                        <svg viewBox="0 0 12 12" fill="none" style={{ width:10, height:10 }}>
                          <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 12 12" fill="none" style={{ width:9, height:9 }}>
                          <path d="M3 9L9 3M3 3L9 9" stroke="#E9A080" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize:10, fontWeight:700, color:"#25283D", opacity:0.55, fontFamily:F, textAlign:"center", lineHeight:1.2 }}>{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex-shrink-0 px-5 pb-8 pt-3 flex flex-col gap-3"
        style={{ background:"linear-gradient(to top, #FFF8F5 70%, transparent)" }}>
        <button onClick={onPlayAgain}
          className="w-full rounded-3xl font-800 text-white transition-all active:scale-95"
          style={{ padding:"17px 0", fontSize:18, background:"linear-gradient(135deg,#E9A080,#F8C4A8)",
                   boxShadow:"0 8px 28px rgba(233,160,128,0.5)", fontFamily:F }}>
          Play Again 🔄
        </button>
        <button onClick={onHome}
          className="w-full rounded-3xl font-700 transition-all active:scale-95"
          style={{ padding:"14px 0", fontSize:16, backgroundColor:"white",
                   color:"#25283D", opacity:0.85,
                   boxShadow:"0 2px 12px rgba(37,40,61,0.1)", fontFamily:F }}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

// ─── Memory Match: Illustrations ─────────────────────────────────────────────

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

interface MMPair {
  pairId: number;
  label: string;
  frontBg: string;
  Illustration: () => ReactElement;
}

const MM_PAIRS: MMPair[] = [
  { pairId:1, label:"Gamosa",    frontBg:"#FEF0F0", Illustration:MMGamosaSVG    },
  { pairId:2, label:"Marigold",  frontBg:"#FDF7E4", Illustration:MMMarigoldSVG  },
  { pairId:3, label:"Tea Basket",frontBg:"#E5F2F8", Illustration:MMTeaBasketSVG },
  { pairId:4, label:"Lotus",     frontBg:"#FDF0F6", Illustration:MMLotussSVG    },
  { pairId:5, label:"Elephant",  frontBg:"#EEEDFB", Illustration:MMElephantSVG  },
  { pairId:6, label:"Peacock",   frontBg:"#EBF8F5", Illustration:MMPeacockSVG   },
];

interface MMCard extends MMPair { uid: string; }

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
    <div className="smriti-screen flex flex-col h-full" style={{ position:"relative" }}>

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
      <div className="responsive-scroll flex-1 overflow-y-auto py-4 px-3" style={{ position:"relative" }}>

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
    <div className="smriti-screen flex flex-col h-full" style={{ backgroundColor:"transparent" }}>
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

      <div className="responsive-scroll flex-1 overflow-y-auto px-5 pt-5 pb-2">
        {/* Stats */}
        <div className="adaptive-grid mm-stats-grid grid grid-cols-2 gap-3 mb-5">
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
        <div className="adaptive-grid result-pairs-grid grid grid-cols-6 gap-2 mb-4">
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

// ─── Caregiver data ───────────────────────────────────────────────────────────

const DEMO_PATIENTS: Patient[] = [
  { id:"p1", name:"Asha Sharma",  age:"72", relation:"Mother", avatar:"👵",
    statusNote:"Doing well today", statusColor:"#8B7BC8", statusBg:"#F0ECFD" },
  { id:"p2", name:"Rajan Sharma", age:"75", relation:"Father", avatar:"👴",
    statusNote:"Needs attention",  statusColor:"#C97A6A", statusBg:"#F8D8CC" },
];
const CG_WEEK = [
  { day:"Mon", val:2 }, { day:"Tue", val:3 }, { day:"Wed", val:1 },
  { day:"Thu", val:4 }, { day:"Fri", val:2 }, { day:"Sat", val:3 }, { day:"Sun", val:1 },
];
const CG_TRENDS = [
  { game:"Memory Match",   pct:82, trend:"Improving",       trendColor:"#8B7BC8", trendBg:"#F0ECFD", arrow:"↑" },
  { game:"Grocery Recall", pct:68, trend:"Stable",          trendColor:"#4BAAC8", trendBg:"#E5F2F8", arrow:"→" },
  { game:"Memory Recall",  pct:54, trend:"Needs Attention", trendColor:"#C97A6A", trendBg:"#F8D8CC", arrow:"↓" },
];
const CG_RECENT = [
  { game:"Memory Match",   icon:"🃏", time:"Today, 10:30 AM",       detail:"10 pairs · 7 moves",  pct:85, bg:"#F0ECFD" },
  { game:"Grocery Recall", icon:"🛒", time:"Yesterday, 3:00 PM",    detail:"4 of 5 correct",      pct:72, bg:"#FFF0EA" },
  { game:"Memory Recall",  icon:"🧠", time:"2 days ago, 11:15 AM",  detail:"3 of 4 correct",      pct:68, bg:"#DCD8F5" },
];
const CG_ALERTS_DATA = [
  { id:1, icon:"📉", title:"Lower accuracy noted", desc:"Memory Recall score dropped 15% this week",   bg:"#F8D8CC", accent:"#C97A6A", time:"Today" },
  { id:2, icon:"⏰", title:"Missed activity",       desc:"Afternoon stretch not completed yesterday",  bg:"#E9C5D0", accent:"#C97A90", time:"Yesterday" },
  { id:3, icon:"💊", title:"Medication reminder",   desc:"Evening tablets not marked as taken",        bg:"#DCD8F5", accent:"#8B7BC8", time:"8:00 PM" },
];

// ─── C01 — Caregiver Setup ────────────────────────────────────────────────────

function CaregiverSetupScreen({ onContinue, onBack, initialThemes }: {
  onContinue: (cg: CaregiverProfile) => void;
  onBack: () => void;
  initialThemes: string[];
}) {
  const [name,           setName]           = useState("Priya Sharma");
  const [language,       setLanguage]       = useState("English");
  const [selectedId,     setSelectedId]     = useState("p1");
  const [selectedThemes, setSelectedThemes] = useState<string[]>(initialThemes);
  const canContinue = name.trim().length > 0;

  const inputBase: React.CSSProperties = {
    backgroundColor:"#FFFDF7", color:"#25283D", fontFamily:F,
    border:"2px solid #DCD8F5", borderRadius:16, padding:"15px 18px",
    fontSize:16, fontWeight:600, width:"100%", outline:"none",
    boxShadow:"0 2px 10px rgba(37,40,61,0.05)",
  };

  return (
    <div className="smriti-screen flex flex-col h-full" style={{ backgroundColor:"transparent" }}>
      <div style={{ background:"linear-gradient(150deg,#8B7BC8 0%,#9BACD8 55%,#9FD5E8 100%)", flexShrink:0, borderRadius:"0 0 28px 28px", paddingBottom:22 }}>
        <StatusBar light/>
        <div className="flex items-center gap-3 px-5 pt-1">
          <button onClick={onBack}
            className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
            style={{ backgroundColor:"rgba(255,255,255,0.2)" }}>
            <svg viewBox="0 0 20 20" fill="none" style={{ width:20, height:20 }}>
              <path d="M13 4L7 10L13 16" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div>
            <p style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.75)", fontFamily:F }}>Welcome back 👋</p>
            <h1 style={{ fontSize:20, fontWeight:900, color:"white", fontFamily:F, lineHeight:1.2 }}>Caregiver Setup</h1>
          </div>
        </div>
      </div>

      <div className="responsive-scroll flex-1 overflow-y-auto px-5 pt-5 pb-4">

        {/* Avatar */}
        <div className="flex justify-center mb-5">
          <div style={{ width:76, height:76, borderRadius:"50%",
                        background:"linear-gradient(135deg,#E9C5D0,#DCD8F5)",
                        border:"3px solid rgba(139,123,200,0.22)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:34, boxShadow:"0 6px 22px rgba(139,123,200,0.22)" }}>
            👩‍⚕️
          </div>
        </div>

        {/* Name */}
        <p style={{ fontSize:12, fontWeight:800, color:"#25283D", opacity:0.45, fontFamily:F, marginBottom:7, textTransform:"uppercase", letterSpacing:0.6 }}>Your Name</p>
        <input type="text" value={name} onChange={e=>setName(e.target.value)}
          placeholder="Enter your full name"
          style={{ ...inputBase, marginBottom:18, display:"block" }}
          onFocus={e=>(e.target.style.borderColor="#8B7BC8")}
          onBlur={e=>(e.target.style.borderColor="#DCD8F5")}/>

        {/* Language */}
        <p style={{ fontSize:12, fontWeight:800, color:"#25283D", opacity:0.45, fontFamily:F, marginBottom:7, textTransform:"uppercase", letterSpacing:0.6 }}>Preferred Language</p>
        <div style={{ position:"relative", marginBottom:22 }}>
          <select value={language} onChange={e=>setLanguage(e.target.value)}
            style={{ ...inputBase, appearance:"none" as const }}
            onFocus={e=>(e.target.style.borderColor="#8B7BC8")}
            onBlur={e=>(e.target.style.borderColor="#DCD8F5")}>
            {LANGUAGES.map(l=><option key={l} value={l}>{l}</option>)}
          </select>
          <div style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
            <svg viewBox="0 0 20 20" fill="none" style={{ width:20, height:20 }}>
              <path d="M5 7.5L10 12.5L15 7.5" stroke="#8B7BC8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Patients */}
        <div className="flex items-center justify-between mb-3">
          <p style={{ fontSize:12, fontWeight:800, color:"#25283D", opacity:0.45, fontFamily:F, textTransform:"uppercase", letterSpacing:0.6 }}>Your Patients</p>
          <button className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5 transition-all active:scale-95"
            style={{ backgroundColor:"#8B7BC8", boxShadow:"0 3px 10px rgba(139,123,200,0.35)" }}>
            <svg viewBox="0 0 16 16" fill="none" style={{ width:13, height:13 }}>
              <path d="M8 3V13M3 8H13" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize:12, fontWeight:800, color:"white", fontFamily:F }}>Add</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {DEMO_PATIENTS.map(p => {
            const on = p.id === selectedId;
            return (
              <button key={p.id} onClick={()=>setSelectedId(p.id)}
                className="flex items-center gap-3 rounded-3xl p-4 text-left w-full transition-all active:scale-97"
                style={{
                  backgroundColor:"#FFFDF7",
                  border: on ? "2px solid #8B7BC8" : "2px solid #DCD8F5",
                  boxShadow: on
                    ? "0 4px 20px rgba(139,123,200,0.22), 0 1px 4px rgba(37,40,61,0.06)"
                    : "0 2px 12px rgba(37,40,61,0.07), 0 1px 4px rgba(37,40,61,0.04)",
                }}>
                <div style={{ width:52, height:52, borderRadius:"50%", flexShrink:0,
                              background: on ? "linear-gradient(135deg,#DCD8F5,#E9C5D0)" : "linear-gradient(135deg,#E5F2F8,#DCD8F5)",
                              border: on ? "2.5px solid rgba(139,123,200,0.3)" : "2px solid rgba(220,216,245,0.5)",
                              display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>
                  {p.avatar}
                </div>
                <div className="flex-1">
                  <p style={{ fontSize:16, fontWeight:800, color:"#25283D", fontFamily:F }}>{p.name}</p>
                  <p style={{ fontSize:12, fontWeight:600, color:"#25283D", opacity:0.5, fontFamily:F, marginTop:2 }}>Age {p.age} · {p.relation}</p>
                  <div style={{ display:"inline-flex", alignItems:"center", marginTop:5, padding:"3px 10px", borderRadius:20, backgroundColor:p.statusBg }}>
                    <span style={{ fontSize:11, fontWeight:700, color:p.statusColor, fontFamily:F }}>{p.statusNote}</span>
                  </div>
                </div>
                <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0,
                              backgroundColor: on ? "#8B7BC8" : "transparent",
                              border: on ? "none" : "2px solid #DCD8F5",
                              display:"flex", alignItems:"center", justifyContent:"center",
                              boxShadow: on ? "0 2px 10px rgba(139,123,200,0.4)" : "none" }}>
                  {on && <svg viewBox="0 0 16 16" fill="none" style={{ width:14, height:14 }}>
                    <path d="M3 8L6.5 11.5L13 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>}
                </div>
              </button>
            );
          })}
        </div>


        {/* Patient theme preferences */}
        <div className="flex items-center justify-between mb-3">
          <p style={{ fontSize:12, fontWeight:800, color:"#25283D", opacity:0.45, fontFamily:F, textTransform:"uppercase", letterSpacing:0.6 }}>
            What does {(DEMO_PATIENTS.find(p=>p.id===selectedId)?.name ?? "Patient").split(" ")[0]} enjoy?
          </p>
          <span style={{ fontSize:11, fontWeight:700, color:"#8B7BC8", fontFamily:F }}>
            {selectedThemes.length}/3 chosen
          </span>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:24 }}>
          {CARE_THEMES.map(t => {
            const on = selectedThemes.includes(t.id);
            return (
              <button key={t.id}
                onClick={()=>setSelectedThemes(prev => {
                  if (on) return prev.filter(x=>x!==t.id);
                  if (prev.length >= 3) return prev;
                  return [...prev, t.id];
                })}
                className="flex items-center gap-1.5 transition-all active:scale-95"
                style={{
                  padding:"9px 14px", borderRadius:24, fontSize:13, fontWeight:700, fontFamily:F,
                  backgroundColor: on ? "#8B7BC8" : "#F0ECFD",
                  color: on ? "white" : "#8B7BC8",
                  border: on ? "none" : "1.5px solid rgba(139,123,200,0.2)",
                  boxShadow: on ? "0 3px 10px rgba(139,123,200,0.35)" : "none",
                }}>
                <span style={{ fontSize:16 }}>{t.emoji}</span>
                {t.label}
              </button>
            );
          })}
        </div>
        <p style={{ fontSize:11, fontWeight:600, color:"#25283D", opacity:0.38, fontFamily:F, marginTop:-18, marginBottom:20, lineHeight:1.5 }}>
          Games will show items from chosen themes. Select 1–3 themes.
        </p>

        {/* Continue */}
        <button
          onClick={()=>canContinue && onContinue({ name:name.trim(), language, selectedPatientId:selectedId, patientThemes:selectedThemes })}
          style={{
            width:"100%", padding:"18px 0", borderRadius:24, fontSize:17, fontWeight:900, fontFamily:F,
            background: canContinue ? "linear-gradient(135deg,#8B7BC8,#A594DC)" : "#DCD8F5",
            color: canContinue ? "white" : "#9B93B8",
            boxShadow: canContinue ? "0 6px 22px rgba(139,123,200,0.42)" : "none",
            border:"none", cursor: canContinue ? "pointer" : "default", transition:"all 0.2s",
          }}>
          Continue →
        </button>

      </div>
    </div>
  );
}

// ─── Caregiver Bottom Nav ─────────────────────────────────────────────────────

function CGBottomNav({ active, onChange }: { active: CGTab; onChange: (t: CGTab) => void }) {
  const labels: Record<CGTab,string> = { overview:"Overview", progress:"Progress", care:"Care", settings:"Settings" };
  return (
    <div className="flex-shrink-0 px-3 pb-5 pt-2"
      style={{ background:"linear-gradient(to top, white 80%, transparent)" }}>
      <div className="flex items-stretch rounded-3xl py-1.5 px-1"
        style={{ backgroundColor:"white",
                 boxShadow:"0 -2px 28px rgba(37,40,61,0.11), 0 4px 20px rgba(37,40,61,0.08)",
                 border:"1px solid rgba(220,216,245,0.55)" }}>
        {(["overview","progress","care","settings"] as const).map(id => {
          const on = active === id;
          return (
            <button key={id} onClick={()=>onChange(id)}
              className="flex flex-col items-center gap-0.5 py-2 px-2 rounded-2xl transition-all active:scale-90 flex-1"
              style={{ backgroundColor:on?"#EDE7FC":"transparent",
                       border:on?"1px solid rgba(139,123,200,0.2)":"1px solid transparent" }}>
              {id === "overview" && (
                <svg viewBox="0 0 24 24" fill="none" style={{ width:22, height:22 }}>
                  <rect x="3" y="3" width="8" height="8" rx="2" fill={on?"#8B7BC8":"#25283D"} opacity={on?1:0.35}/>
                  <rect x="13" y="3" width="8" height="8" rx="2" fill={on?"#8B7BC8":"#25283D"} opacity={on?1:0.25}/>
                  <rect x="3" y="13" width="8" height="8" rx="2" fill={on?"#8B7BC8":"#25283D"} opacity={on?1:0.25}/>
                  <rect x="13" y="13" width="8" height="8" rx="2" fill={on?"#8B7BC8":"#25283D"} opacity={on?1:0.35}/>
                </svg>
              )}
              {id === "progress" && (
                <svg viewBox="0 0 24 24" fill="none" style={{ width:22, height:22 }}>
                  <rect x="3" y="15" width="4" height="6" rx="1.5" fill={on?"#8B7BC8":"#25283D"} opacity={on?1:0.35}/>
                  <rect x="10" y="9" width="4" height="12" rx="1.5" fill={on?"#8B7BC8":"#25283D"} opacity={on?1:0.5}/>
                  <rect x="17" y="4" width="4" height="17" rx="1.5" fill={on?"#8B7BC8":"#25283D"} opacity={on?1:0.35}/>
                </svg>
              )}
              {id === "care" && (
                <svg viewBox="0 0 24 24" fill="none" style={{ width:22, height:22 }}>
                  <path d="M12 21C12 21 4 15.5 4 9.5C4 7.01 5.99 5 8.5 5C10 5 11.38 5.76 12 7C12.62 5.76 14 5 15.5 5C18.01 5 20 7.01 20 9.5C20 15.5 12 21 12 21Z"
                    fill={on?"#8B7BC8":"#25283D"} opacity={on?1:0.35}/>
                  <path d="M9 9.5H15M12 7V12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
              {id === "settings" && (
                <svg viewBox="0 0 24 24" fill="none" style={{ width:22, height:22 }}>
                  <circle cx="12" cy="12" r="3" fill={on?"#8B7BC8":"#25283D"} opacity={on?1:0.35}/>
                  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                    stroke={on?"#8B7BC8":"#25283D"} strokeWidth="2" strokeLinecap="round" opacity={on?1:0.35}/>
                </svg>
              )}
              <span style={{ fontSize:10, fontWeight:on?800:600, color:on?"#8B7BC8":"#25283D", opacity:on?1:0.4, fontFamily:F }}>
                {labels[id]}
              </span>
              {on && <div style={{ width:14, height:3, borderRadius:2, backgroundColor:"#8B7BC8", marginTop:-1 }}/>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── C02 — Caregiver Dashboard ────────────────────────────────────────────────

function CaregiverDashboard({ cgProfile, onBack }: { cgProfile: CaregiverProfile; onBack: ()=>void }) {
  const [cgTab, setCgTab] = useState<CGTab>("overview");
  const patient    = DEMO_PATIENTS.find(p=>p.id===cgProfile.selectedPatientId) ?? DEMO_PATIENTS[0];
  const cgFirst    = cgProfile.name.trim().split(" ")[0] || "Caregiver";
  const maxWeek    = Math.max(...CG_WEEK.map(d=>d.val));

  // Overview alerts
  const [ovDismissed, setOvDismissed] = useState<Set<number>>(new Set());

  // Care tab state
  const [medDone,   setMedDone]   = useState<Set<string>>(new Set());
  const [cgReminders, setCgReminders] = useState([
    { id:"med-am",    label:"Morning Tablets",   time:"8:00 AM",       icon:"💊", active:true  },
    { id:"hydration", label:"Drink Water",        time:"Every 2 hours", icon:"💧", active:true  },
    { id:"cognitive", label:"Brain Games",        time:"11:00 AM",      icon:"🧠", active:false },
    { id:"med-pm",    label:"Evening Tablets",    time:"8:00 PM",       icon:"💊", active:true  },
  ]);
  const [carePlanNote, setCarePlanNote] = useState("Asha seems more responsive in the morning. Responds well to memory games. Prefers shorter sessions with breaks.");
  const [editNote, setEditNote] = useState(false);

  // Settings
  const [cgLang,  setCgLang]  = useState(cgProfile.language);
  const [cgVoice, setCgVoice] = useState(true);

  const cgMeds = [
    { id:"am",   label:"Morning Tablets", time:"8:00 AM", icon:"💊", accent:"#8B7BC8", bg:"#F0ECFD" },
    { id:"noon", label:"Noon Vitamins",   time:"1:00 PM", icon:"🧴", accent:"#4BAAC8", bg:"#E5F2F8" },
    { id:"pm",   label:"Evening Tablets", time:"8:00 PM", icon:"💊", accent:"#E9A080", bg:"#FFF0EA" },
  ];
  const cgActivities = [
    { id:"morning", label:"Morning Walk",     time:"7:00 AM",  icon:"🚶", accent:"#8B7BC8", bg:"#F0ECFD" },
    { id:"stretch", label:"Light Stretching", time:"10:00 AM", icon:"🧘", accent:"#4BAAC8", bg:"#E5F2F8" },
    { id:"rest",    label:"Afternoon Rest",   time:"2:00 PM",  icon:"😴", accent:"#E9A080", bg:"#FFF0EA" },
  ];
  const [actDone, setActDone] = useState<Set<string>>(new Set(["morning"]));

  const SL = (text: string) => (
    <p style={{ fontSize:12, fontWeight:800, color:"#25283D", opacity:0.45, fontFamily:F, marginBottom:8, textTransform:"uppercase" as const, letterSpacing:0.5 }}>
      {text}
    </p>
  );

  return (
    <div className="smriti-screen flex flex-col h-full" style={{ backgroundColor:"transparent" }}>

      {/* ── Header ── */}
      <div style={{ background:"linear-gradient(150deg,#8B7BC8 0%,#9BACD8 55%,#9FD5E8 100%)", flexShrink:0, borderRadius:"0 0 28px 28px", paddingBottom:16 }}>
        <StatusBar light/>
        <div className="flex items-center gap-3 px-5 pt-1">
          <button onClick={onBack}
            className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
            style={{ backgroundColor:"rgba(255,255,255,0.2)" }}>
            <svg viewBox="0 0 20 20" fill="none" style={{ width:20, height:20 }}>
              <path d="M13 4L7 10L13 16" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="flex-1">
            <p style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.75)", fontFamily:F }}>Good Morning, {cgFirst} 👋</p>
            <p style={{ fontSize:17, fontWeight:900, color:"white", fontFamily:F, lineHeight:1.2 }}>Monitoring {patient.name.split(" ")[0]}</p>
          </div>
          <div style={{ width:42, height:42, borderRadius:"50%", flexShrink:0,
                        background:"linear-gradient(135deg,#E9C5D0,#F2A8B8)",
                        border:"2.5px solid rgba(255,255,255,0.7)",
                        boxShadow:"0 3px 12px rgba(0,0,0,0.15)",
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>
            👩‍⚕️
          </div>
        </div>
      </div>

      {/* ── OVERVIEW ── */}
      {cgTab === "overview" && (
        <div className="responsive-scroll flex-1 overflow-y-auto px-4 pt-4 pb-2">

          {/* Patient status card */}
          <div className="rounded-3xl p-4 mb-4"
            style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width:58, height:58, borderRadius:"50%", flexShrink:0,
                            background:"linear-gradient(135deg,#DCD8F5,#E9C5D0)",
                            border:`3px solid ${patient.statusBg}`,
                            display:"flex", alignItems:"center", justifyContent:"center", fontSize:30 }}>
                {patient.avatar}
              </div>
              <div className="flex-1">
                <p style={{ fontSize:17, fontWeight:900, color:"#25283D", fontFamily:F }}>{patient.name}</p>
                <p style={{ fontSize:12, fontWeight:600, color:"#25283D", opacity:0.45, fontFamily:F }}>Age {patient.age} · {patient.relation}</p>
                <div style={{ display:"inline-flex", alignItems:"center", marginTop:5,
                              padding:"4px 12px", borderRadius:20, backgroundColor:patient.statusBg }}>
                  <span style={{ fontSize:12, fontWeight:800, color:patient.statusColor, fontFamily:F }}>{patient.statusNote}</span>
                </div>
              </div>
            </div>
            <div style={{ height:1, backgroundColor:"rgba(220,216,245,0.5)", marginBottom:12 }}/>
            <div className="flex justify-around">
              {[
                { icon:"🎮", val:"2",    label:"Games today" },
                { icon:"✅", val:"3/5",  label:"Activities"  },
                { icon:"🎯", val:"78%",  label:"Accuracy"    },
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center gap-0.5">
                  <span style={{ fontSize:20 }}>{s.icon}</span>
                  <p style={{ fontSize:17, fontWeight:900, color:"#25283D", fontFamily:F }}>{s.val}</p>
                  <p style={{ fontSize:11, fontWeight:600, color:"#25283D", opacity:0.45, fontFamily:F }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active alerts */}
          {SL("Active Alerts")}
          <div className="flex flex-col gap-2.5 mb-4">
            {CG_ALERTS_DATA.filter(a=>!ovDismissed.has(a.id)).length === 0 ? (
              <div className="rounded-3xl p-4 flex items-center gap-3"
                style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 18px rgba(37,40,61,0.10), 0 1px 4px rgba(37,40,61,0.05)" }}>
                <span style={{ fontSize:24 }}>✅</span>
                <p style={{ fontSize:14, fontWeight:700, color:"#25283D", opacity:0.55, fontFamily:F }}>No alerts right now. All good!</p>
              </div>
            ) : CG_ALERTS_DATA.filter(a=>!ovDismissed.has(a.id)).map(a => (
              <div key={a.id} className="rounded-3xl p-3.5 flex items-start gap-3"
                style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 18px rgba(37,40,61,0.10), 0 1px 4px rgba(37,40,61,0.05)",
                         borderLeft:`4px solid ${a.accent}44` }}>
                <div style={{ width:40, height:40, borderRadius:13, backgroundColor:a.bg, flexShrink:0,
                              display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
                  {a.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <p style={{ fontSize:13, fontWeight:800, color:"#25283D", fontFamily:F }}>{a.title}</p>
                    <button onClick={()=>setOvDismissed(p=>{const n=new Set(p);n.add(a.id);return n;})}
                      style={{ fontSize:15, color:"#25283D", opacity:0.3, lineHeight:1, flexShrink:0, marginLeft:8, background:"none", border:"none" }}>✕</button>
                  </div>
                  <p style={{ fontSize:11, fontWeight:500, color:"#25283D", opacity:0.5, fontFamily:F, marginTop:2, lineHeight:1.5 }}>{a.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick performance */}
          {SL("Quick Performance")}
          <div className="rounded-3xl overflow-hidden mb-4"
            style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
            {CG_TRENDS.map((t,i) => (
              <div key={t.game}
                style={{ padding:"12px 16px", borderBottom:i<CG_TRENDS.length-1?"1px solid rgba(220,216,245,0.4)":"none" }}>
                <div className="flex items-center justify-between mb-2">
                  <p style={{ fontSize:13, fontWeight:700, color:"#25283D", fontFamily:F }}>{t.game}</p>
                  <div style={{ padding:"2px 9px", borderRadius:20, backgroundColor:t.trendBg }}>
                    <span style={{ fontSize:11, fontWeight:800, color:t.trendColor, fontFamily:F }}>{t.arrow} {t.trend}</span>
                  </div>
                </div>
                <div style={{ height:7, borderRadius:10, backgroundColor:"#EDF0F5" }}>
                  <div style={{ height:7, borderRadius:10, width:`${t.pct}%`,
                                background:i===0?"linear-gradient(90deg,#DCD8F5,#8B7BC8)":
                                           i===1?"linear-gradient(90deg,#9FD5E8,#4BAAC8)":
                                                 "linear-gradient(90deg,#F8D8CC,#C97A6A)" }}/>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ── PROGRESS ── */}
      {cgTab === "progress" && (
        <div className="responsive-scroll flex-1 overflow-y-auto px-4 pt-4 pb-2">

          {SL("Activity History")}
          <div className="rounded-3xl overflow-hidden mb-4"
            style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
            {CG_RECENT.map((r,i) => (
              <div key={r.game} className="flex items-center gap-3"
                style={{ padding:"13px 16px", borderBottom:i<CG_RECENT.length-1?"1px solid rgba(220,216,245,0.4)":"none" }}>
                <div style={{ width:44, height:44, borderRadius:14, backgroundColor:r.bg, flexShrink:0,
                              display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
                  {r.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize:14, fontWeight:700, color:"#25283D", fontFamily:F }}>{r.game}</p>
                  <p style={{ fontSize:11, fontWeight:500, color:"#25283D", opacity:0.4, fontFamily:F }}>{r.time}</p>
                  <p style={{ fontSize:11, fontWeight:600, color:"#8B7BC8", fontFamily:F, marginTop:1 }}>{r.detail}</p>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <p style={{ fontSize:18, fontWeight:900, color:"#25283D", fontFamily:F }}>{r.pct}<span style={{ fontSize:11 }}>%</span></p>
                  <p style={{ fontSize:10, fontWeight:600, color:"#25283D", opacity:0.35, fontFamily:F }}>accuracy</p>
                </div>
              </div>
            ))}
          </div>

          {SL("Game Performance")}
          <div className="rounded-3xl overflow-hidden mb-4"
            style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
            {CG_TRENDS.map((t,i) => (
              <div key={t.game}
                style={{ padding:"14px 16px", borderBottom:i<CG_TRENDS.length-1?"1px solid rgba(220,216,245,0.4)":"none" }}>
                <div className="flex items-center justify-between mb-2">
                  <p style={{ fontSize:14, fontWeight:700, color:"#25283D", fontFamily:F }}>{t.game}</p>
                  <div style={{ padding:"3px 10px", borderRadius:20, backgroundColor:t.trendBg }}>
                    <span style={{ fontSize:12, fontWeight:800, color:t.trendColor, fontFamily:F }}>{t.arrow} {t.trend}</span>
                  </div>
                </div>
                <div style={{ height:8, borderRadius:10, backgroundColor:"#EDF0F5", marginBottom:4 }}>
                  <div style={{ height:8, borderRadius:10, width:`${t.pct}%`,
                                background:i===0?"linear-gradient(90deg,#DCD8F5,#8B7BC8)":
                                           i===1?"linear-gradient(90deg,#9FD5E8,#4BAAC8)":
                                                 "linear-gradient(90deg,#F8D8CC,#C97A6A)" }}/>
                </div>
                <p style={{ fontSize:11, fontWeight:600, color:"#25283D", opacity:0.35, fontFamily:F }}>{t.pct}% average accuracy</p>
              </div>
            ))}
          </div>

          {SL("Weekly Engagement")}
          <div className="rounded-3xl p-4 mb-2"
            style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
            <p style={{ fontSize:12, fontWeight:600, color:"#25283D", opacity:0.4, fontFamily:F, marginBottom:12 }}>Games completed per day</p>
            <div className="flex items-end justify-between gap-1" style={{ height:80 }}>
              {CG_WEEK.map((d,i) => {
                const isToday = i===6;
                const h = Math.round((d.val/maxWeek)*68);
                return (
                  <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
                    <div style={{ width:"100%", height:h, borderRadius:"6px 6px 4px 4px", minHeight:6,
                                  backgroundColor:isToday?"#8B7BC8":d.val>=3?"#9FD5E8":"#DCD8F5",
                                  boxShadow:isToday?"0 3px 10px rgba(139,123,200,0.45)":"none" }}/>
                    <p style={{ fontSize:10, fontWeight:700, fontFamily:F,
                                color:isToday?"#8B7BC8":"#25283D", opacity:isToday?1:0.4 }}>{d.day}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-3">
              {[["#8B7BC8","Today"],["#9FD5E8","Active"],["#DCD8F5","Light"]].map(([c,l])=>(
                <div key={l} className="flex items-center gap-1.5">
                  <div style={{ width:10, height:10, borderRadius:3, backgroundColor:c }}/>
                  <p style={{ fontSize:10, fontWeight:600, color:"#25283D", opacity:0.45, fontFamily:F }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── CARE ── */}
      {cgTab === "care" && (
        <div className="responsive-scroll flex-1 overflow-y-auto px-4 pt-4 pb-2">

          {/* Medication */}
          <div className="flex items-center gap-2 mb-3">
            <div style={{ width:30, height:30, borderRadius:10, backgroundColor:"#F0ECFD",
                          display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:16 }}>💊</span>
            </div>
            <p style={{ fontSize:15, fontWeight:800, color:"#25283D", fontFamily:F }}>Medication</p>
            <span style={{ marginLeft:"auto", fontSize:12, fontWeight:700, color:"#8B7BC8", fontFamily:F }}>
              {medDone.size}/{cgMeds.length} taken
            </span>
          </div>
          <div className="rounded-3xl overflow-hidden mb-5"
            style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
            {cgMeds.map((m,i) => {
              const done = medDone.has(m.id);
              return (
                <button key={m.id}
                  onClick={()=>setMedDone(p=>{const n=new Set(p);n.has(m.id)?n.delete(m.id):n.add(m.id);return n;})}
                  className="flex items-center gap-3 w-full text-left active:scale-98 transition-all"
                  style={{ padding:"13px 15px", borderBottom:i<cgMeds.length-1?"1px solid rgba(220,216,245,0.4)":"none",
                           backgroundColor:done?"rgba(240,236,253,0.3)":"transparent" }}>
                  <div style={{ width:42, height:42, borderRadius:13, backgroundColor:done?`${m.bg}99`:m.bg,
                                display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                    <span style={{ opacity:done?0.5:1 }}>{m.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p style={{ fontSize:14, fontWeight:700, color:"#25283D", fontFamily:F, opacity:done?0.4:1,
                                textDecoration:done?"line-through":"none" }}>{m.label}</p>
                    <p style={{ fontSize:12, fontWeight:500, color:m.accent, fontFamily:F, marginTop:1, opacity:done?0.5:1 }}>{m.time}</p>
                  </div>
                  <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0,
                                backgroundColor:done?m.accent:"transparent",
                                border:done?"none":`2px solid ${m.bg}`,
                                display:"flex", alignItems:"center", justifyContent:"center",
                                boxShadow:done?`0 3px 10px ${m.accent}55`:"none" }}>
                    {done && <svg viewBox="0 0 16 16" fill="none" style={{ width:14, height:14 }}>
                      <path d="M3 8L6.5 11.5L13 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Reminders */}
          <div className="flex items-center gap-2 mb-3">
            <div style={{ width:30, height:30, borderRadius:10, backgroundColor:"#E5F2F8",
                          display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:16 }}>⏰</span>
            </div>
            <p style={{ fontSize:15, fontWeight:800, color:"#25283D", fontFamily:F }}>Reminders</p>
            <button className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5 ml-auto transition-all active:scale-95"
              style={{ backgroundColor:"#8B7BC8", boxShadow:"0 3px 10px rgba(139,123,200,0.35)" }}>
              <svg viewBox="0 0 16 16" fill="none" style={{ width:13, height:13 }}>
                <path d="M8 3V13M3 8H13" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize:12, fontWeight:800, color:"white", fontFamily:F }}>Add</span>
            </button>
          </div>
          <div className="rounded-3xl overflow-hidden mb-5"
            style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
            {cgReminders.map((r,i) => (
              <div key={r.id} className="flex items-center gap-3"
                style={{ padding:"13px 15px", borderBottom:i<cgReminders.length-1?"1px solid rgba(220,216,245,0.4)":"none" }}>
                <div style={{ width:42, height:42, borderRadius:13, flexShrink:0,
                              backgroundColor:r.active?"#F0ECFD":"#F5F3FF",
                              display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
                  <span style={{ opacity:r.active?1:0.45 }}>{r.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize:14, fontWeight:700, color:"#25283D", opacity:r.active?1:0.4, fontFamily:F }}>{r.label}</p>
                  <p style={{ fontSize:11, fontWeight:600, color:"#8B7BC8", opacity:r.active?0.8:0.3, fontFamily:F, marginTop:1 }}>{r.time}</p>
                </div>
                <button
                  onClick={()=>setCgReminders(rs=>rs.map(x=>x.id===r.id?{...x,active:!x.active}:x))}
                  style={{ width:46, height:26, borderRadius:13, flexShrink:0, marginLeft:6, border:"none",
                           backgroundColor:r.active?"#8B7BC8":"#DCD8F5", position:"relative", transition:"background-color 0.2s" }}>
                  <div style={{ position:"absolute", top:2, width:22, height:22, borderRadius:"50%", backgroundColor:"white",
                                left:r.active?"calc(100% - 24px)":"2px", transition:"left 0.2s",
                                boxShadow:"0 2px 6px rgba(0,0,0,0.16)" }}/>
                </button>
              </div>
            ))}
          </div>

          {/* Daily Activity */}
          <div className="flex items-center gap-2 mb-3">
            <div style={{ width:30, height:30, borderRadius:10, backgroundColor:"#FFF0EA",
                          display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:16 }}>🌿</span>
            </div>
            <p style={{ fontSize:15, fontWeight:800, color:"#25283D", fontFamily:F }}>Daily Activity</p>
            <span style={{ marginLeft:"auto", fontSize:12, fontWeight:700, color:"#E9A080", fontFamily:F }}>
              {actDone.size}/{cgActivities.length} done
            </span>
          </div>
          <div className="rounded-3xl overflow-hidden mb-5"
            style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
            {cgActivities.map((a,i) => {
              const done = actDone.has(a.id);
              return (
                <button key={a.id}
                  onClick={()=>setActDone(p=>{const n=new Set(p);n.has(a.id)?n.delete(a.id):n.add(a.id);return n;})}
                  className="flex items-center gap-3 w-full text-left active:scale-98 transition-all"
                  style={{ padding:"13px 15px", borderBottom:i<cgActivities.length-1?"1px solid rgba(220,216,245,0.4)":"none",
                           backgroundColor:done?"rgba(240,236,253,0.3)":"transparent" }}>
                  <div style={{ width:42, height:42, borderRadius:13, backgroundColor:done?`${a.bg}99`:a.bg,
                                display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                    <span style={{ opacity:done?0.5:1 }}>{a.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p style={{ fontSize:14, fontWeight:700, color:"#25283D", fontFamily:F, opacity:done?0.4:1,
                                textDecoration:done?"line-through":"none" }}>{a.label}</p>
                    <p style={{ fontSize:12, fontWeight:500, color:a.accent, fontFamily:F, marginTop:1, opacity:done?0.5:1 }}>{a.time}</p>
                  </div>
                  <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0,
                                backgroundColor:done?a.accent:"transparent",
                                border:done?"none":`2px solid ${a.bg}`,
                                display:"flex", alignItems:"center", justifyContent:"center",
                                boxShadow:done?`0 3px 10px ${a.accent}55`:"none" }}>
                    {done && <svg viewBox="0 0 16 16" fill="none" style={{ width:14, height:14 }}>
                      <path d="M3 8L6.5 11.5L13 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Care Plan */}
          <div className="flex items-center gap-2 mb-3">
            <div style={{ width:30, height:30, borderRadius:10, backgroundColor:"#FDF0F6",
                          display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:16 }}>📋</span>
            </div>
            <p style={{ fontSize:15, fontWeight:800, color:"#25283D", fontFamily:F }}>Care Plan Notes</p>
            <button onClick={()=>setEditNote(e=>!e)}
              style={{ marginLeft:"auto", padding:"5px 12px", borderRadius:12, fontSize:12, fontWeight:700,
                       backgroundColor:editNote?"#8B7BC8":"#F0ECFD", color:editNote?"white":"#8B7BC8",
                       fontFamily:F, border:"none" }}>
              {editNote?"Save":"Edit"}
            </button>
          </div>
          <div className="rounded-3xl p-4 mb-2"
            style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
            {editNote ? (
              <textarea value={carePlanNote} onChange={e=>setCarePlanNote(e.target.value)} rows={5}
                style={{ width:"100%", border:"2px solid #DCD8F5", borderRadius:12,
                         padding:"12px", fontSize:14, fontWeight:500, color:"#25283D",
                         fontFamily:F, outline:"none", resize:"none" as const, backgroundColor:"#F8F6FF", lineHeight:1.6 }}
                onFocus={e=>(e.target.style.borderColor="#8B7BC8")}
                onBlur={e=>(e.target.style.borderColor="#DCD8F5")}/>
            ) : (
              <p style={{ fontSize:14, fontWeight:500, color:"#25283D", fontFamily:F, lineHeight:1.7, opacity:0.75 }}>
                {carePlanNote}
              </p>
            )}
          </div>

        </div>
      )}

      {/* ── SETTINGS ── */}
      {cgTab === "settings" && (
        <div className="responsive-scroll flex-1 overflow-y-auto px-4 pt-4 pb-2">

          {/* Caregiver profile */}
          <div className="rounded-3xl p-4 flex items-center gap-4 mb-5"
            style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
            <div style={{ width:56, height:56, borderRadius:"50%", flexShrink:0,
                          background:"linear-gradient(135deg,#E9C5D0,#DCD8F5)",
                          border:"3px solid rgba(139,123,200,0.2)",
                          display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>
              👩‍⚕️
            </div>
            <div className="flex-1">
              <p style={{ fontSize:18, fontWeight:900, color:"#25283D", fontFamily:F }}>{cgProfile.name || "Caregiver"}</p>
              <p style={{ fontSize:13, fontWeight:600, color:"#8B7BC8", fontFamily:F }}>Caregiver</p>
            </div>
            <button style={{ padding:"8px 16px", borderRadius:20, backgroundColor:"#F0ECFD",
                             fontSize:13, fontWeight:700, color:"#8B7BC8", fontFamily:F, border:"none" }}>
              Edit
            </button>
          </div>

          {/* Currently monitoring */}
          {SL("Currently Monitoring")}
          <div className="rounded-3xl p-4 flex items-center gap-3 mb-5"
            style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
            <div style={{ width:46, height:46, borderRadius:"50%", flexShrink:0,
                          background:"linear-gradient(135deg,#DCD8F5,#E9C5D0)",
                          display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>
              {patient.avatar}
            </div>
            <div className="flex-1">
              <p style={{ fontSize:15, fontWeight:700, color:"#25283D", fontFamily:F }}>{patient.name}</p>
              <p style={{ fontSize:12, fontWeight:600, color:"#25283D", opacity:0.45, fontFamily:F }}>Age {patient.age} · {patient.relation}</p>
            </div>
            <button onClick={onBack}
              style={{ padding:"8px 14px", borderRadius:20, backgroundColor:"#F8D8CC",
                       fontSize:12, fontWeight:700, color:"#C97A6A", fontFamily:F, border:"none" }}>
              Switch
            </button>
          </div>

          {/* Language */}
          {SL("Language")}
          <div className="rounded-3xl p-4 mb-5"
            style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width:38, height:38, borderRadius:12, backgroundColor:"#F0ECFD",
                            display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🌐</div>
              <div>
                <p style={{ fontSize:15, fontWeight:700, color:"#25283D", fontFamily:F }}>Preferred Language</p>
                <p style={{ fontSize:12, fontWeight:500, color:"#25283D", opacity:0.45, fontFamily:F }}>For instructions and voice</p>
              </div>
            </div>
            <div style={{ position:"relative" }}>
              <select value={cgLang} onChange={e=>setCgLang(e.target.value)}
                style={{ backgroundColor:"#FFFDF7", color:"#25283D", fontFamily:F, border:"2px solid #DCD8F5",
                         borderRadius:14, padding:"13px 18px", fontSize:15, fontWeight:600,
                         width:"100%", outline:"none", appearance:"none" as const }}>
                {LANGUAGES.map(l=><option key={l} value={l}>{l}</option>)}
              </select>
              <div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                <svg viewBox="0 0 20 20" fill="none" style={{ width:18, height:18 }}>
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#8B7BC8" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Voice */}
          {SL("Voice")}
          <div className="rounded-3xl p-4 mb-5"
            style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
            <div className="flex items-center gap-3">
              <div style={{ width:40, height:40, borderRadius:12,
                            backgroundColor:cgVoice?"#DCD8F5":"#F5F3FF",
                            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg viewBox="0 0 24 24" fill="none" style={{ width:22, height:22 }}>
                  <path d="M11 5L6 9H2V15H6L11 19V5Z" fill={cgVoice?"#8B7BC8":"#b0aac0"}/>
                  <path d="M15.54 8.46C16.48 9.4 17 10.67 17 12C17 13.33 16.48 14.6 15.54 15.54" stroke={cgVoice?"#8B7BC8":"#b0aac0"} strokeWidth="2" strokeLinecap="round"/>
                  <path d="M19.07 4.93C21.02 6.88 22 9.37 22 12C22 14.63 21.02 17.12 19.07 19.07" stroke={cgVoice?"#8B7BC8":"#b0aac0"} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                </svg>
              </div>
              <div className="flex-1">
                <p style={{ fontSize:15, fontWeight:700, color:"#25283D", fontFamily:F }}>Voice Assistance</p>
                <p style={{ fontSize:12, fontWeight:500, color:"#25283D", opacity:0.45, fontFamily:F, marginTop:1 }}>
                  {cgVoice ? "On — Instructions read aloud" : "Off"}
                </p>
              </div>
              <button onClick={()=>setCgVoice(v=>!v)}
                style={{ width:50, height:28, borderRadius:14, backgroundColor:cgVoice?"#8B7BC8":"#DCD8F5",
                         position:"relative", flexShrink:0, transition:"background-color 0.2s", border:"none" }}>
                <div style={{ position:"absolute", top:3, width:22, height:22, borderRadius:"50%", backgroundColor:"white",
                              left:cgVoice?"calc(100% - 25px)":"3px", transition:"left 0.2s",
                              boxShadow:"0 2px 8px rgba(0,0,0,0.18)" }}/>
              </button>
            </div>
          </div>

          {/* App info */}
          <div className="rounded-3xl p-4 flex items-center justify-center"
            style={{ backgroundColor:"#FFFDF7", boxShadow:"0 4px 22px rgba(37,40,61,0.10), 0 1px 5px rgba(37,40,61,0.05)" }}>
            <div className="text-center">
              <p style={{ fontSize:14, fontWeight:700, color:"#25283D", opacity:0.4, fontFamily:F }}>Mindful Memory — Caregiver</p>
              <p style={{ fontSize:12, fontWeight:600, color:"#25283D", opacity:0.25, fontFamily:F }}>by Heuristic · v1.0</p>
            </div>
          </div>

        </div>
      )}

      <CGBottomNav active={cgTab} onChange={setCgTab}/>
    </div>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [profile, setProfile] = useState<ElderProfile>({ name:"Asha Sharma", age:"72", language:"English", pin:"", voice:true });
  const [recallSelected, setRecallSelected] = useState<Set<string>>(new Set());
  const [grSelected, setGrSelected] = useState<Set<string>>(new Set());
  const [mmMoves, setMmMoves] = useState(0);
  const defaultThemes = ["Cooking", "Festivals", "Animals"];
  const [cgProfile, setCgProfile] = useState<CaregiverProfile>({ name:"", language:"English", selectedPatientId:"p1", patientThemes:defaultThemes });
  const [activeThemes, setActiveThemes] = useState<string[]>(defaultThemes);
  const [grItems, setGrItems]   = useState<GroceryItem[]>(()=>buildGRGame(defaultThemes));
  const [mmPairs, setMmPairs]   = useState<MMPair[]>(()=>buildMMPairs(defaultThemes));

  let content: ReactElement | null = null;
  if (screen==="splash")       content = <SplashScreen onNext={()=>setScreen("role")}/>;
  else if (screen==="role")              content = <RoleScreen onElder={()=>setScreen("elder-setup")} onCaregiver={()=>setScreen("caregiver-setup")}/>;
  else if (screen==="elder-setup")       content = <ElderSetupScreen onContinue={p=>{ setProfile(p); setScreen("home"); }}/>;
  else if (screen==="home")              content = <HomeScreen profile={profile} onPlayMemoryRecall={()=>setScreen("mr-intro")} onPlayGroceryRecall={()=>setScreen("gr-intro")} onPlayMemoryMatch={()=>{ setMmPairs(buildMMPairs(activeThemes)); setScreen("mm-game"); }}/>;
  else if (screen==="mr-intro")          content = <MRIntroScreen profile={profile} onBack={()=>setScreen("home")} onStart={()=>setScreen("mr-remember")}/>;
  else if (screen==="mr-remember")       content = <MRRememberScreen onProceed={()=>setScreen("mr-recall")}/>;
  else if (screen==="mr-recall")         content = <MRRecallScreen onCheck={sel=>{ setRecallSelected(sel); setScreen("mr-result"); }}/>;
  else if (screen==="mr-result")         content = <MRResultScreen profile={profile} selected={recallSelected} onPlayAgain={()=>setScreen("mr-remember")} onHome={()=>setScreen("home")}/>;
  else if (screen==="gr-intro")          content = <GRIntroScreen profile={profile} onBack={()=>setScreen("home")} onStart={()=>{ setGrItems(buildGRGame(activeThemes)); setScreen("gr-remember"); }}/>;
  else if (screen==="gr-remember")       content = <GRRememberScreen items={grItems} onProceed={()=>setScreen("gr-recall")}/>;
  else if (screen==="gr-recall")         content = <GRRecallScreen items={grItems} onCheck={sel=>{ setGrSelected(sel); setScreen("gr-result"); }}/>;
  else if (screen==="gr-result")         content = <GRResultScreen items={grItems} profile={profile} selected={grSelected} onPlayAgain={()=>{ setGrItems(buildGRGame(activeThemes)); setScreen("gr-remember"); }} onHome={()=>setScreen("home")}/>;
  else if (screen==="mm-game")           content = <MMGameScreen pairs={mmPairs} onDone={m=>{ setMmMoves(m); setScreen("mm-result"); }} onBack={()=>setScreen("home")}/>;
  else if (screen==="mm-result")         content = <MMResultScreen moves={mmMoves} onPlayAgain={()=>setScreen("mm-game")} onHome={()=>setScreen("home")}/>;
  else if (screen==="caregiver-setup")   content = <CaregiverSetupScreen initialThemes={cgProfile.patientThemes} onContinue={cg=>{ setCgProfile(cg); setActiveThemes(cg.patientThemes); setGrItems(buildGRGame(cg.patientThemes)); setMmPairs(buildMMPairs(cg.patientThemes)); setScreen("caregiver"); }} onBack={()=>setScreen("role")}/>;
  else if (screen==="caregiver")         content = <CaregiverDashboard cgProfile={cgProfile} onBack={()=>setScreen("caregiver-setup")}/>;

  return (
    <div className="smriti-app-root" style={{ position:"relative", width:"100%", minWidth:0, minHeight:"100dvh" }}>
      <NERBackground/>
      {content}
    </div>
  );
}
