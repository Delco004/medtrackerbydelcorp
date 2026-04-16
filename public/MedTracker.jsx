import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────
// THEME TOKENS
// ─────────────────────────────────────────────────────────────────
const THEMES = {
  light: {
    name: "light",
    bg: "linear-gradient(145deg, #fdf0f5 0%, #fce8f0 30%, #f5eaf8 60%, #eee8f8 100%)",
    bgSolid: "#fdf0f5",
    surface: "rgba(255,255,255,0.55)",
    surfaceHover: "rgba(255,255,255,0.72)",
    border: "rgba(220,170,200,0.35)",
    borderStrong: "rgba(220,150,190,0.55)",
    text: "#2d1a2e",
    textMid: "#7a4f6e",
    textDim: "#b890aa",
    accent: "#d4579a",
    accentBg: "rgba(212,87,154,0.1)",
    green: "#2eaa6b",
    greenBg: "rgba(46,170,107,0.1)",
    greenBorder: "rgba(46,170,107,0.35)",
    red: "#e04545",
    redBg: "rgba(224,69,69,0.1)",
    redBorder: "rgba(224,69,69,0.35)",
    amber: "#d4891a",
    amberBg: "rgba(212,137,26,0.1)",
    // Pearl iridescent gradient layers
    pearlGrad1: "linear-gradient(135deg, rgba(255,200,230,0.6) 0%, rgba(230,200,255,0.4) 50%, rgba(200,230,255,0.5) 100%)",
    pearlGrad2: "linear-gradient(225deg, rgba(255,230,245,0.7) 0%, rgba(245,210,255,0.5) 50%, rgba(210,240,255,0.6) 100%)",
    shimmer1: "rgba(255,180,220,0.5)",
    shimmer2: "rgba(200,180,255,0.4)",
    shimmer3: "rgba(180,230,255,0.45)",
    shadow: "rgba(180,100,160,0.15)",
    shadowStrong: "rgba(180,100,160,0.28)",
    tabBar: "rgba(255,240,250,0.82)",
    navBg: "rgba(255,245,252,0.88)",
    toggleBg: "rgba(212,87,154,0.15)",
    toggleKnob: "#d4579a",
    icon: "🌸",
  },
  dark: {
    name: "dark",
    bg: "linear-gradient(145deg, #050d1a 0%, #070f20 30%, #080d1f 60%, #060c1c 100%)",
    bgSolid: "#060d1b",
    surface: "rgba(10,20,45,0.65)",
    surfaceHover: "rgba(15,28,58,0.78)",
    border: "rgba(60,100,200,0.25)",
    borderStrong: "rgba(80,130,240,0.45)",
    text: "#e8f0ff",
    textMid: "#7090c8",
    textDim: "#3d5a90",
    accent: "#5b9ef7",
    accentBg: "rgba(91,158,247,0.12)",
    green: "#3ecf8e",
    greenBg: "rgba(62,207,142,0.1)",
    greenBorder: "rgba(62,207,142,0.3)",
    red: "#f06070",
    redBg: "rgba(240,96,112,0.1)",
    redBorder: "rgba(240,96,112,0.3)",
    amber: "#f0b840",
    amberBg: "rgba(240,184,64,0.1)",
    pearlGrad1: "linear-gradient(135deg, rgba(40,80,180,0.55) 0%, rgba(60,40,140,0.4) 50%, rgba(20,80,160,0.5) 100%)",
    pearlGrad2: "linear-gradient(225deg, rgba(20,60,160,0.6) 0%, rgba(50,30,120,0.45) 50%, rgba(30,100,200,0.5) 100%)",
    shimmer1: "rgba(80,140,255,0.4)",
    shimmer2: "rgba(100,60,220,0.35)",
    shimmer3: "rgba(40,160,255,0.38)",
    shadow: "rgba(0,20,80,0.5)",
    shadowStrong: "rgba(0,20,80,0.75)",
    tabBar: "rgba(6,14,32,0.88)",
    navBg: "rgba(5,12,28,0.92)",
    toggleBg: "rgba(91,158,247,0.18)",
    toggleKnob: "#5b9ef7",
    icon: "🌙",
  }
};

// ─────────────────────────────────────────────────────────────────
// TILT / LIQUID GLASS HOOK
// ─────────────────────────────────────────────────────────────────
function useTilt() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hasGyro, setHasGyro] = useState(false);
  const mouseRef = useRef({ active: false });

  useEffect(() => {
    // Try gyroscope first
    const handleOrientation = (e) => {
      if (e.gamma !== null) {
        setHasGyro(true);
        const x = Math.max(-25, Math.min(25, e.gamma));  // left/right
        const y = Math.max(-25, Math.min(25, e.beta - 10)); // front/back
        setTilt({ x, y });
      }
    };

    // Mouse fallback for desktop
    const handleMouse = (e) => {
      if (mouseRef.current.active) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const x = ((e.clientX - cx) / cx) * 18;
      const y = ((e.clientY - cy) / cy) * 12;
      setTilt({ x, y });
    };

    window.addEventListener("deviceorientation", handleOrientation);
    window.addEventListener("mousemove", handleMouse);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return tilt;
}

// ─────────────────────────────────────────────────────────────────
// LIQUID GLASS CARD
// ─────────────────────────────────────────────────────────────────
function GlassCard({ children, style, T, tilt, onClick, noTilt }) {
  const tx = noTilt ? 0 : tilt.x;
  const ty = noTilt ? 0 : tilt.y;

  // Shimmer position shifts with tilt
  const shimmerX = 50 + tx * 1.5;
  const shimmerY = 50 + ty * 1.5;

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        background: T.surface,
        backdropFilter: "blur(24px) saturate(1.6)",
        WebkitBackdropFilter: "blur(24px) saturate(1.6)",
        border: `1px solid ${T.border}`,
        borderRadius: 20,
        overflow: "hidden",
        transform: `perspective(800px) rotateY(${tx * 0.35}deg) rotateX(${-ty * 0.25}deg)`,
        transition: "transform 0.15s ease-out, box-shadow 0.15s ease-out",
        boxShadow: `
          0 8px 32px ${T.shadow},
          0 2px 8px ${T.shadow},
          inset 0 1px 0 rgba(255,255,255,0.3)
        `,
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {/* Iridescent shimmer layer — moves with tilt */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 120% 100% at ${shimmerX}% ${shimmerY}%, 
            ${T.shimmer1} 0%, 
            ${T.shimmer2} 35%, 
            ${T.shimmer3} 65%,
            transparent 100%
          )
        `,
        opacity: 0.55,
        transition: "background 0.1s ease-out",
        mixBlendMode: "screen",
      }} />
      {/* Top highlight edge */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.7) ${40 + tx * 2}%, transparent)`,
        pointerEvents: "none", zIndex: 1,
      }} />
      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ADHERENCE RING
// ─────────────────────────────────────────────────────────────────
function AdherenceRing({ pct, T }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 80 ? T.green : pct >= 50 ? T.amber : T.red;

  return (
    <div style={{ position: "relative", width: 136, height: 136, margin: "0 auto" }}>
      <svg width={136} height={136} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={68} cy={68} r={r} fill="none" stroke={T.border} strokeWidth={9} />
        <circle
          cx={68} cy={68} r={r}
          fill="none" stroke={color}
          strokeWidth={9}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontSize: 30, fontWeight: 900, color, lineHeight: 1 }}>{pct}%</div>
        <div style={{ fontSize: 10, color: T.textDim, marginTop: 3, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          adherence
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// BAR CHART
// ─────────────────────────────────────────────────────────────────
function BarChart({ data, T }) {
  const max = Math.max(...data.map(d => d.total), 1);

  return (
    <div style={{ display: "flex", gap: 5, alignItems: "flex-end", height: 90 }}>
      {data.map((d, i) => {
        const takenH = (d.taken / max) * 78;
        const missedH = (d.missed / max) * 78;
        const isEmpty = d.taken === 0 && d.missed === 0 && !d.isToday;

        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{
              width: "100%", display: "flex", flexDirection: "column",
              justifyContent: "flex-end", height: 78, borderRadius: 8, overflow: "hidden",
              gap: 2,
            }}>
              {isEmpty ? (
                <div style={{ flex: 1, background: T.border, borderRadius: 8, opacity: 0.4 }} />
              ) : d.taken === 0 && d.missed === 0 && d.isToday ? (
                <div style={{
                  flex: 1, borderRadius: 8,
                  background: `repeating-linear-gradient(45deg, ${T.border} 0px, ${T.border} 2px, transparent 2px, transparent 8px)`,
                  opacity: 0.6,
                }} />
              ) : (
                <>
                  {d.missed > 0 && (
                    <div style={{
                      height: missedH, minHeight: 5,
                      background: `linear-gradient(180deg, ${T.red}, ${T.red}88)`,
                      borderRadius: d.taken === 0 ? "8px 8px 0 0" : 0,
                    }} />
                  )}
                  {d.taken > 0 && (
                    <div style={{
                      height: takenH, minHeight: 5,
                      background: `linear-gradient(180deg, ${T.green}, ${T.green}88)`,
                      borderRadius: d.missed === 0 ? "8px 8px 0 0" : 0,
                    }} />
                  )}
                </>
              )}
            </div>
            <div style={{
              fontSize: 9.5,
              fontWeight: d.isToday ? 800 : 500,
              color: d.isToday ? T.accent : T.textDim,
            }}>
              {d.isToday ? "▲" : d.day}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ADD MEDICATION MODAL
// ─────────────────────────────────────────────────────────────────
function AddMedModal({ T, tilt, onClose, onSave }) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [times, setTimes] = useState(["08:00"]);
  const [freq, setFreq] = useState("daily");
  const [saved, setSaved] = useState(false);

  const inputStyle = {
    width: "100%",
    background: T.surface,
    backdropFilter: "blur(12px)",
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    padding: "13px 15px",
    color: T.text,
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  };

  const handleSave = () => {
    if (!name.trim() || !dosage.trim()) return;
    const newMed = {
      id: Date.now(),
      name: name.trim(),
      dosage: dosage.trim(),
      times,
      frequency: freq,
      isActive: true,
      takenToday: times.map(() => false),
      addedAt: new Date().toISOString(),
    };
    onSave(newMed);
    setSaved(true);
    setTimeout(onClose, 1600);
  };

  if (saved) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(8px)" }}>
        <GlassCard T={T} tilt={tilt} style={{ padding: "40px 48px", textAlign: "center" }}>
          <div style={{ fontSize: 52 }}>✅</div>
          <div style={{ color: T.green, fontWeight: 800, fontSize: 18, marginTop: 12 }}>Saved!</div>
          <div style={{ color: T.textMid, fontSize: 13, marginTop: 6 }}>Reminders scheduled on device</div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.35)",
      backdropFilter: "blur(10px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      zIndex: 200,
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        width: "100%", maxWidth: 480,
        background: T.tabBar,
        backdropFilter: "blur(32px) saturate(1.8)",
        WebkitBackdropFilter: "blur(32px) saturate(1.8)",
        borderRadius: "24px 24px 0 0",
        border: `1px solid ${T.border}`,
        borderBottom: "none",
        padding: "0 20px 36px",
        boxShadow: `0 -8px 40px ${T.shadowStrong}`,
      }}>
        {/* Handle bar */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: T.textDim, opacity: 0.5 }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 19, color: T.text }}>Add Medication</div>
          <div onClick={onClose} style={{ color: T.textDim, cursor: "pointer", fontSize: 20, padding: "4px 8px" }}>✕</div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            Medication Name
          </div>
          <input style={inputStyle} placeholder="e.g. Metformin" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            Dosage
          </div>
          <input style={inputStyle} placeholder="e.g. 500mg" value={dosage} onChange={e => setDosage(e.target.value)} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            Reminder Times
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {times.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <input type="time" value={t}
                  onChange={e => { const n = [...times]; n[i] = e.target.value; setTimes(n); }}
                  style={{ ...inputStyle, width: "auto", padding: "10px 12px" }} />
                {times.length > 1 && (
                  <div onClick={() => setTimes(times.filter((_, j) => j !== i))}
                    style={{ marginLeft: 4, color: T.red, cursor: "pointer", fontSize: 16, padding: "4px" }}>✕</div>
                )}
              </div>
            ))}
            <button onClick={() => setTimes([...times, "12:00"])}
              style={{
                background: T.accentBg,
                border: `1px dashed ${T.accent}`,
                borderRadius: 12, color: T.accent,
                padding: "10px 14px", cursor: "pointer",
                fontSize: 13, fontWeight: 700, fontFamily: "inherit",
              }}>
              + Add
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{
            width: "100%", padding: 16,
            background: name && dosage
              ? `linear-gradient(135deg, ${T.accent}, ${T.accent}bb)`
              : T.border,
            border: "none", borderRadius: 16,
            color: name && dosage ? "#fff" : T.textDim,
            fontWeight: 800, fontSize: 16,
            cursor: name && dosage ? "pointer" : "not-allowed",
            fontFamily: "inherit",
            boxShadow: name && dosage ? `0 4px 20px ${T.accent}55` : "none",
            transition: "all 0.2s",
          }}>
          💊 Save & Schedule Reminders
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// TODAY DOSE ROW
// ─────────────────────────────────────────────────────────────────
function TodayDoseRow({ med, T, tilt, onToggle }) {
  return (
    <GlassCard T={T} tilt={tilt} style={{ padding: "16px", marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontWeight: 700, color: T.text, fontSize: 15 }}>{med.name}</div>
          <div style={{ fontSize: 12, color: T.textMid, marginTop: 2 }}>{med.dosage}</div>
        </div>
        <div style={{
          fontSize: 11, color: T.accent,
          background: T.accentBg, padding: "3px 10px",
          borderRadius: 20, border: `1px solid ${T.accent}55`,
          fontWeight: 600,
        }}>
          {med.times.length}× daily
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        {med.times.map((t, i) => {
          const taken = med.takenToday[i];
          return (
            <div key={i} onClick={() => onToggle(med.id, i)} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 22,
              border: `1.5px solid ${taken ? T.green : T.border}`,
              background: taken ? T.greenBg : "transparent",
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: 13, fontWeight: 600,
              color: taken ? T.green : T.textDim,
            }}>
              <span>{taken ? "✓" : "○"}</span>
              <span>{t}</span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

// ─────────────────────────────────────────────────────────────────
// STATS COMPUTATION
// ─────────────────────────────────────────────────────────────────
function buildWeekData(medications) {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  return Array.from({ length: 7 }, (_, offset) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - offset));
    const isToday = offset === 6;
    const total = medications.reduce((acc, m) => acc + m.times.length, 0);
    // Simulate past data; today is partial
    if (isToday) {
      const taken = medications.reduce((acc, m) => acc + m.takenToday.filter(Boolean).length, 0);
      return { day: days[d.getDay()], taken, missed: 0, total, isToday: true };
    }
    // For demo: past days have some random-ish but deterministic data
    const seed = d.getDate();
    const missed = total > 0 ? (seed % 3 === 0 ? 1 : 0) : 0;
    return { day: days[d.getDay()], taken: total - missed, missed, total };
  });
}

function computeStats(medications, weekData) {
  const past = weekData.slice(0, 6);
  const totalPast = past.reduce((a, d) => a + d.total, 0);
  const takenPast = past.reduce((a, d) => a + d.taken, 0);
  const adherence = totalPast ? Math.round((takenPast / totalPast) * 100) : 100;
  const missedWeek = past.reduce((a, d) => a + d.missed, 0);

  let streak = 0;
  for (let i = 5; i >= 0; i--) {
    if (past[i].total > 0 && past[i].missed === 0) streak++;
    else break;
  }

  const todayTaken = medications.reduce((a, m) => a + m.takenToday.filter(Boolean).length, 0);
  const todayTotal = medications.reduce((a, m) => a + m.times.length, 0);

  return { adherence, missedWeek, streak, todayTaken, todayTotal };
}

// ─────────────────────────────────────────────────────────────────
// HISTORY SCREEN
// ─────────────────────────────────────────────────────────────────
function HistoryScreen({ medications, T, tilt }) {
  const weekData = buildWeekData(medications);

  return (
    <div style={{ padding: "20px 16px" }}>
      {weekData.slice().reverse().map((day, i) => (
        <div key={i} style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {day.isToday ? "Today" : day.day}
          </div>
          {medications.length === 0 && (
            <div style={{ color: T.textDim, fontSize: 13, fontStyle: "italic", paddingLeft: 4 }}>No medications added yet</div>
          )}
          {medications.map(med => {
            const isTakenSim = day.isToday
              ? med.takenToday[0]
              : (new Date().getDate() + i) % 3 !== 0;
            return med.times.map((t, j) => {
              const taken = day.isToday ? med.takenToday[j] : ((new Date().getDate() + i + j) % 4 !== 0);
              return (
                <GlassCard key={`${i}-${j}`} T={T} tilt={tilt}
                  style={{
                    padding: "12px 16px", marginBottom: 6,
                    border: `1px solid ${taken ? T.greenBorder : T.redBorder}`,
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 18 }}>{taken ? "✅" : "❌"}</span>
                    <div>
                      <div style={{ fontWeight: 600, color: taken ? T.green : T.red, fontSize: 14 }}>
                        {med.name} {med.dosage}
                      </div>
                      <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>
                        {taken ? "Taken" : "Missed"} · {t}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              );
            });
          })}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MEDICATIONS LIST SCREEN
// ─────────────────────────────────────────────────────────────────
function MedicationsScreen({ medications, T, tilt, onDelete }) {
  if (medications.length === 0) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>💊</div>
        <div style={{ fontWeight: 700, fontSize: 17, color: T.text, marginBottom: 8 }}>No medications yet</div>
        <div style={{ color: T.textMid, fontSize: 14 }}>Tap "+ Add Med" above to get started</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 16px" }}>
      {medications.map(med => (
        <GlassCard key={med.id} T={T} tilt={tilt} style={{ padding: "18px 16px", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 17, color: T.text }}>{med.name}</div>
              <div style={{ fontSize: 13, color: T.textMid, marginTop: 4 }}>{med.dosage} · {med.times.length}× daily</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{
                background: T.greenBg, border: `1px solid ${T.greenBorder}`,
                borderRadius: 20, padding: "4px 10px",
                fontSize: 11, color: T.green, fontWeight: 600,
              }}>Active</div>
              <div onClick={() => onDelete(med.id)} style={{
                color: T.red, cursor: "pointer", fontSize: 18, opacity: 0.7,
                padding: "2px 4px",
              }} title="Remove">✕</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            {med.times.map((t, i) => (
              <div key={i} style={{
                background: T.accentBg, border: `1px solid ${T.accent}44`,
                borderRadius: 20, padding: "5px 12px",
                fontSize: 12, color: T.accent, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 5,
              }}>
                🔔 {t}
              </div>
            ))}
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────
export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [showAdd, setShowAdd] = useState(false);
  const [medications, setMedications] = useState([
    {
      id: 1, name: "Metformin", dosage: "500mg",
      times: ["08:00", "20:00"], frequency: "daily",
      isActive: true, takenToday: [true, false],
    },
    {
      id: 2, name: "Lisinopril", dosage: "10mg",
      times: ["08:00"], frequency: "daily",
      isActive: true, takenToday: [true],
    },
  ]);

  const T = isDark ? THEMES.dark : THEMES.light;
  const tilt = useTilt();

  const weekData = buildWeekData(medications);
  const stats = computeStats(medications, weekData);
  const adherenceColor = stats.adherence >= 80 ? T.green : stats.adherence >= 50 ? T.amber : T.red;

  const handleToggleDose = useCallback((medId, timeIndex) => {
    setMedications(prev => prev.map(m => {
      if (m.id !== medId) return m;
      const newTaken = [...m.takenToday];
      newTaken[timeIndex] = !newTaken[timeIndex];
      return { ...m, takenToday: newTaken };
    }));
  }, []);

  const handleAddMed = useCallback((newMed) => {
    setMedications(prev => [...prev, newMed]);
  }, []);

  const handleDeleteMed = useCallback((medId) => {
    setMedications(prev => prev.filter(m => m.id !== medId));
  }, []);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "meds",      label: "Meds",       icon: "💊" },
    { id: "history",   label: "History",    icon: "📋" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      fontFamily: "'Nunito', 'DM Sans', system-ui, sans-serif",
      color: T.text,
      maxWidth: 430,
      margin: "0 auto",
      position: "relative",
      paddingBottom: 80,
      transition: "background 0.5s ease, color 0.3s ease",
    }}>

      {/* Background pearl shimmer — full viewport */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        maxWidth: 430, margin: "0 auto",
        background: `
          radial-gradient(ellipse 160% 120% at ${50 + tilt.x * 2}% ${40 + tilt.y * 1.5}%, 
            ${T.shimmer1} 0%, 
            ${T.shimmer2} 30%,
            ${T.shimmer3} 55%,
            transparent 75%
          )
        `,
        opacity: 0.35,
        transition: "background 0.1s ease-out",
        mixBlendMode: isDark ? "screen" : "multiply",
      }} />

      {/* ── HEADER ── */}
      <div style={{
        padding: "48px 20px 14px",
        background: T.navBg,
        backdropFilter: "blur(20px) saturate(1.5)",
        WebkitBackdropFilter: "blur(20px) saturate(1.5)",
        position: "sticky", top: 0, zIndex: 30,
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: T.textDim, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </div>
            <div style={{ fontSize: 21, fontWeight: 900, marginTop: 1, letterSpacing: "-0.02em" }}>
              {tab === "dashboard" ? "Your Health" : tab === "meds" ? "My Medications" : "Dose History"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {/* Theme toggle */}
            <div
              onClick={() => setIsDark(d => !d)}
              style={{
                width: 52, height: 28, borderRadius: 14,
                background: T.toggleBg,
                border: `1px solid ${T.border}`,
                position: "relative", cursor: "pointer",
                transition: "all 0.3s",
                flexShrink: 0,
              }}
            >
              <div style={{
                position: "absolute", top: 3,
                left: isDark ? 27 : 3,
                width: 20, height: 20, borderRadius: "50%",
                background: T.toggleKnob,
                transition: "left 0.3s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: `0 2px 6px ${T.toggleKnob}66`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11,
              }}>
                {isDark ? "🌙" : "🌸"}
              </div>
            </div>
            {/* Add button */}
            <button onClick={() => setShowAdd(true)} style={{
              background: `linear-gradient(135deg, ${T.accent}, ${T.accent}cc)`,
              border: "none", borderRadius: 14,
              color: "#fff", fontWeight: 800,
              padding: "9px 15px", cursor: "pointer",
              fontSize: 13, fontFamily: "inherit",
              boxShadow: `0 4px 16px ${T.accent}44`,
              whiteSpace: "nowrap",
            }}>
              + Add Med
            </button>
          </div>
        </div>
      </div>

      {/* ── DASHBOARD ── */}
      {tab === "dashboard" && (
        <div style={{ padding: "18px 16px", position: "relative", zIndex: 1 }}>

          {/* Hero adherence card */}
          <GlassCard T={T} tilt={tilt} style={{ padding: "24px 20px", marginBottom: 14, textAlign: "center" }}>
            <AdherenceRing pct={stats.adherence} T={T} />
            <div style={{ marginTop: 12, fontSize: 14, color: T.textMid, fontWeight: 500 }}>
              {stats.adherence >= 80
                ? "🌟 Great job this week! Keep it up."
                : stats.adherence >= 50
                ? "💪 Room to improve — you can do this!"
                : "⚠️ Several doses missed this week."}
            </div>
          </GlassCard>

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <GlassCard T={T} tilt={tilt} style={{ padding: "18px 15px" }}>
              <div style={{ fontSize: 22 }}>🔥</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: stats.streak >= 1 ? T.amber : T.textDim, lineHeight: 1.1, marginTop: 6 }}>
                {stats.streak}d
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.textMid, textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 3 }}>
                Day Streak
              </div>
              <div style={{ fontSize: 11, color: T.textDim, marginTop: 3 }}>
                {stats.streak > 0 ? "No misses!" : "Keep going"}
              </div>
            </GlassCard>
            <GlassCard T={T} tilt={tilt} style={{ padding: "18px 15px" }}>
              <div style={{ fontSize: 22 }}>❌</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: stats.missedWeek === 0 ? T.green : T.red, lineHeight: 1.1, marginTop: 6 }}>
                {stats.missedWeek}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.textMid, textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 3 }}>
                Missed (7d)
              </div>
              <div style={{ fontSize: 11, color: T.textDim, marginTop: 3 }}>
                {stats.missedWeek === 0 ? "Perfect week!" : "doses missed"}
              </div>
            </GlassCard>
          </div>

          {/* Today status */}
          <GlassCard T={T} tilt={tilt} style={{
            padding: "14px 16px", marginBottom: 14,
            border: `1px solid ${stats.todayTaken >= stats.todayTotal && stats.todayTotal > 0 ? T.greenBorder : T.border}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 28 }}>
                {stats.todayTotal === 0 ? "📋" : stats.todayTaken >= stats.todayTotal ? "✅" : "⏰"}
              </div>
              <div>
                <div style={{
                  fontWeight: 700, fontSize: 15,
                  color: stats.todayTotal === 0 ? T.textMid : stats.todayTaken >= stats.todayTotal ? T.green : T.amber,
                }}>
                  {stats.todayTotal === 0
                    ? "No medications added yet"
                    : stats.todayTaken >= stats.todayTotal
                    ? "All doses taken today! 🎉"
                    : `${stats.todayTotal - stats.todayTaken} dose${stats.todayTotal - stats.todayTaken > 1 ? "s" : ""} remaining`}
                </div>
                <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>
                  {stats.todayTaken}/{stats.todayTotal} medications logged today
                </div>
              </div>
            </div>
          </GlassCard>

          {/* 7-Day chart */}
          <GlassCard T={T} tilt={tilt} style={{ padding: "18px 16px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>7-Day Overview</div>
              <div style={{ display: "flex", gap: 12 }}>
                {[{ c: T.green, l: "Taken" }, { c: T.red, l: "Missed" }].map(({ c, l }) => (
                  <span key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: c, fontWeight: 600 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: "inline-block" }} />
                    {l}
                  </span>
                ))}
              </div>
            </div>
            <BarChart data={weekData} T={T} />
          </GlassCard>

          {/* Today's doses */}
          {medications.length > 0 && (
            <>
              <div style={{ fontWeight: 700, fontSize: 12, color: T.textDim, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Today's Doses — tap to log
              </div>
              {medications.map(med => (
                <TodayDoseRow key={med.id} med={med} T={T} tilt={tilt} onToggle={handleToggleDose} />
              ))}
            </>
          )}

          {medications.length === 0 && (
            <GlassCard T={T} tilt={tilt} style={{ padding: "30px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>💊</div>
              <div style={{ fontWeight: 700, color: T.text, marginBottom: 6 }}>No medications yet</div>
              <div style={{ color: T.textMid, fontSize: 13 }}>Tap "+ Add Med" above to add your first medication</div>
            </GlassCard>
          )}
        </div>
      )}

      {/* ── MEDICATIONS TAB ── */}
      {tab === "meds" && (
        <div style={{ position: "relative", zIndex: 1 }}>
          <MedicationsScreen medications={medications} T={T} tilt={tilt} onDelete={handleDeleteMed} />
        </div>
      )}

      {/* ── HISTORY TAB ── */}
      {tab === "history" && (
        <div style={{ position: "relative", zIndex: 1 }}>
          <HistoryScreen medications={medications} T={T} tilt={tilt} />
        </div>
      )}

      {/* ── BOTTOM TAB BAR ── */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: T.tabBar,
        backdropFilter: "blur(24px) saturate(1.6)",
        WebkitBackdropFilter: "blur(24px) saturate(1.6)",
        borderTop: `1px solid ${T.border}`,
        display: "flex", paddingBottom: 8, zIndex: 40,
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, background: "none", border: "none",
            padding: "11px 0 5px", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            fontFamily: "inherit",
          }}>
            <div style={{
              fontSize: 20,
              filter: tab === t.id ? "none" : "grayscale(80%) opacity(0.45)",
              transform: tab === t.id ? "scale(1.15)" : "scale(1)",
              transition: "transform 0.2s",
            }}>{t.icon}</div>
            <div style={{
              fontSize: 10, fontWeight: 700,
              color: tab === t.id ? T.accent : T.textDim,
              letterSpacing: "0.04em",
              transition: "color 0.2s",
            }}>{t.label}</div>
            {tab === t.id && (
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.accent }} />
            )}
          </button>
        ))}
      </div>

      {/* ── ADD MODAL ── */}
      {showAdd && (
        <AddMedModal T={T} tilt={tilt} onClose={() => setShowAdd(false)} onSave={handleAddMed} />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; margin: 0; padding: 0; }
        input { color-scheme: ${isDark ? "dark" : "light"}; font-family: inherit; }
        input::placeholder { color: ${T.textDim}; }
        ::-webkit-scrollbar { display: none; }
        body { overflow-x: hidden; }
      `}</style>
    </div>
  );
}
