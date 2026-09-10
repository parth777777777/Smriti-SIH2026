import type { ReactElement } from "react";
import { F, timeStr } from "../data/content";

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


export { StatusBar, BackBtn, SpeakerBtn, BottomNav };
