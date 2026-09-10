import { useState, type CSSProperties } from "react";
import type { ElderProfile } from "../types";
import { F, activities, today, LANGUAGES } from "../data/content";
import { StatusBar, SpeakerBtn, BottomNav } from "../components/common";
import { MMCardBack } from "../games/memory-match";

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

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-2">

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

  const inputStyle: CSSProperties = {
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

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4">

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

function HomeScreen({ profile, onPlayMemoryRecall, onPlayGroceryRecall, onPlayMemoryMatch }: { profile: ElderProfile; onPlayMemoryRecall: ()=>void; onPlayGroceryRecall: ()=>void; onPlayMemoryMatch: ()=>void }) {
  const [activeTab, setActiveTab] = useState("home");
  const [done, setDone] = useState<Set<number>>(new Set([2]));
  const firstName = profile.name.trim().split(" ")[0] || "Asha";

  const toggle = (id:number) => setDone(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor:"transparent" }}>

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
        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2">
          {/* Game cards */}
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize:16, fontWeight:800, color:"#25283D", fontFamily:F }}>Today's Games</p>
            <span style={{ fontSize:12, fontWeight:600, color:"#8B7BC8", fontFamily:F }}>2 available</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5">

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


export { HomeScreen };
