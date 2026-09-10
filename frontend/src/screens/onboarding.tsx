import { useState, type CSSProperties } from "react";
import type { ElderProfile } from "../types";
import { F, LANGUAGES } from "../data/content";
import { StatusBar } from "../components/common";
import { ElderlyWomanIllustration } from "../components/illustrations";

function SplashScreen({ onNext }: { onNext: ()=>void }) {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "#FAFAF8" }}>
      <StatusBar/>

      {/* Illustration area — grows to fill available space */}
      <div className="flex-1 flex flex-col items-center justify-center px-6" style={{ paddingTop: 8 }}>
        {/* Illustration */}
        <div style={{ width: 300, height: 270, marginBottom: 8 }}>
          <ElderlyWomanIllustration/>
        </div>

        {/* App name row: brain icon + title */}
        <div className="flex items-center gap-3 mb-3">
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
          <h1 style={{ fontSize: 30, fontWeight: 900, color: "#3D2E8A", fontFamily: F, letterSpacing: -0.4 }}>
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
      <div className="flex-shrink-0 px-6 pb-10 pt-4 flex flex-col gap-3">
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
    <div className="flex flex-col h-full"
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
    <div className="flex flex-col h-full"
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
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <h1 style={{ fontSize:24, fontWeight:900, color:"#25283D", fontFamily:F, marginBottom:4 }}>Tell us about yourself</h1>
        <p style={{ fontSize:14, fontWeight:500, color:"#25283D", opacity:0.5, fontFamily:F, marginBottom:24 }}>We'll personalise your experience</p>

        <div className="flex flex-col gap-5">
          {/* Name */}
          <div>
            <label style={{ display:"block", fontSize:13, fontWeight:700, color:"#25283D", fontFamily:F, marginBottom:8 }}>Your Name</label>
            <input type="text" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
              placeholder="e.g. Asha Sharma" style={inputStyle as CSSProperties}
              onFocus={e=>(e.target.style.borderColor="#8B7BC8")} onBlur={e=>(e.target.style.borderColor="#DCD8F5")}/>
          </div>
          {/* Age */}
          <div>
            <label style={{ display:"block", fontSize:13, fontWeight:700, color:"#25283D", fontFamily:F, marginBottom:8 }}>Your Age</label>
            <input type="number" value={form.age} onChange={e=>setForm(f=>({...f,age:e.target.value}))}
              placeholder="e.g. 72" min={50} max={110} style={inputStyle as CSSProperties}
              onFocus={e=>(e.target.style.borderColor="#8B7BC8")} onBlur={e=>(e.target.style.borderColor="#DCD8F5")}/>
          </div>
          {/* Language */}
          <div>
            <label style={{ display:"block", fontSize:13, fontWeight:700, color:"#25283D", fontFamily:F, marginBottom:8 }}>Preferred Language</label>
            <div className="relative">
              <select value={form.language} onChange={e=>setForm(f=>({...f,language:e.target.value}))}
                style={{ ...inputStyle, appearance:"none", paddingRight:44 } as CSSProperties}
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
                       borderColor: pinFocused?"#8B7BC8":"#DCD8F5" } as CSSProperties}
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


export { SplashScreen, RoleScreen, ElderSetupScreen };
