import { useState, type CSSProperties } from "react";
import type { CaregiverProfile, Patient, CGTab } from "../types";
import { F, LANGUAGES, CARE_THEMES, buildGRGame, buildMMPairs } from "../data/content";
import { StatusBar, BackBtn } from "../components/common";

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

  const inputBase: CSSProperties = {
    backgroundColor:"#FFFDF7", color:"#25283D", fontFamily:F,
    border:"2px solid #DCD8F5", borderRadius:16, padding:"15px 18px",
    fontSize:16, fontWeight:600, width:"100%", outline:"none",
    boxShadow:"0 2px 10px rgba(37,40,61,0.05)",
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor:"transparent" }}>
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

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4">

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
    <div className="flex flex-col h-full" style={{ backgroundColor:"transparent" }}>

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
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">

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
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">

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
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">

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
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">

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

export { CaregiverSetupScreen, CGBottomNav, CaregiverDashboard };
