import { useEffect, useState, useCallback } from "react";
import type { ElderProfile, GameObject } from "../types";
import { F, REMEMBER_SECONDS, ALL_OBJECTS, shuffle } from "../data/content";
import { StatusBar, BackBtn, SpeakerBtn } from "../components/common";

function MRIntroScreen({ profile, onBack, onStart }: { profile: ElderProfile; onBack: ()=>void; onStart: ()=>void }) {
  const firstName = profile.name.trim().split(" ")[0] || "Asha";
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor:"transparent" }}>
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

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2">
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
    <div className="flex flex-col h-full" style={{ backgroundColor:"transparent" }}>
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
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
        <div className="grid grid-cols-2 gap-3.5">
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
    <div className="flex flex-col h-full" style={{ backgroundColor:"transparent" }}>
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
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
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
    <div className="flex flex-col h-full" style={{ backgroundColor:"transparent" }}>
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

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
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
          <div className="grid grid-cols-4 gap-3">
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


export { MRIntroScreen, MRRememberScreen, MRRecallScreen, MRResultScreen };
