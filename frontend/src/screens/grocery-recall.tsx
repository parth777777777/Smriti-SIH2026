import { useEffect, useState, useCallback } from "react";
import type { ElderProfile, GroceryItem } from "../types";
import { F, GR_SECONDS, ALL_GROCERIES, shuffle } from "../data/content";
import { StatusBar, BackBtn, SpeakerBtn } from "../components/common";

function GRIntroScreen({ profile, onBack, onStart }: { profile: ElderProfile; onBack: ()=>void; onStart: ()=>void }) {
  const firstName = profile.name.trim().split(" ")[0] || "Asha";
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor:"transparent" }}>
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

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2">
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
    <div className="flex flex-col h-full" style={{ backgroundColor:"#FFF8F5" }}>
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
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
        <div className="grid grid-cols-2 gap-3.5">
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
    <div className="flex flex-col h-full" style={{ backgroundColor:"#FFF8F5" }}>
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
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
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
    <div className="flex flex-col h-full" style={{ backgroundColor:"#FFF8F5" }}>
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

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
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
          <div className="grid grid-cols-5 gap-2">
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


export { GRIntroScreen, GRRememberScreen, GRRecallScreen, GRResultScreen };
