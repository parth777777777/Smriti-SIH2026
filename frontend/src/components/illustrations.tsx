import type { ReactElement } from "react";

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


export { NERBackground, TeaCupSVG, KeysSVG, AppleSVG, SpectaclesSVG, BookSVG, FlowerSVG, ClockSVG, UmbrellaSVG,
  RiceSVG, PotatoSVG, OnionSVG, TomatoSVG, PeasSVG, CarrotSVG, BananaSVG, BreadSVG, EggSVG, MilkSVG,
  DalSVG, FishSVG, MangoSVG, MustardOilSVG, FlowerPotSVG, WateringCanSVG, SpadeSVG, SeedsSVG, PlantSVG,
  GamosaItemSVG, DiyaSVG, DholSVG, LanternSVG, CowSVG, HenSVG, BirdSVG, BroomSVG, KettleSVG, MatSVG,
  SchoolBagSVG, SickleSVG, LoomShuttleSVG, ElderlyWomanIllustration };
