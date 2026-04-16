import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import "./App.css";

// ─────────────────────────────────────────────────────────────────
// THEME TOKENS
// ─────────────────────────────────────────────────────────────────
interface Theme {
  name: string;
  bg: string;
  bgSolid: string;
  surface: string;
  surfaceHover: string;
  border: string;
  borderStrong: string;
  text: string;
  textMid: string;
  textDim: string;
  accent: string;
  accentBg: string;
  green: string;
  greenBg: string;
  greenBorder: string;
  red: string;
  redBg: string;
  redBorder: string;
  amber: string;
  amberBg: string;
  pearlGrad1: string;
  pearlGrad2: string;
  shimmer1: string;
  shimmer2: string;
  shimmer3: string;
  shadow: string;
  shadowStrong: string;
  tabBar: string;
  navBg: string;
  toggleBg: string;
  toggleKnob: string;
  icon: string;
}

const THEMES: Record<string, Theme> = {
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
    icon: "flower",
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
    icon: "moon",
  }
};

// ─────────────────────────────────────────────────────────────────
// CATEGORY INFO
// ─────────────────────────────────────────────────────────────────
const CATEGORY_INFO: Record<string, { color: string; icon: string; label: string }> = {
  cardiovascular: { color: "#e04545", icon: "heart", label: "Cardiovascular" },
  diabetes: { color: "#f0b840", icon: "glucose", label: "Diabetes" },
  pain: { color: "#d4579a", icon: "bandage", label: "Pain Relief" },
  mental: { color: "#5b9ef7", icon: "brain", label: "Mental Health" },
  supplement: { color: "#2eaa6b", icon: "leaf", label: "Supplement" },
  other: { color: "#7090c8", icon: "medical", label: "Other" },
};

// ─────────────────────────────────────────────────────────────────
// STORAGE HOOK - PERSISTENT DATA
// ─────────────────────────────────────────────────────────────────
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Storage error:", error);
    }
  }, [key]);

  return [storedValue, setValue];
}

// ─────────────────────────────────────────────────────────────────
// TYPES - IMPROVED
// ─────────────────────────────────────────────────────────────────
interface DoseLog {
  scheduledTime: string;
  status: "taken" | "missed" | "skipped";
  actualTime?: string;
  wasLate?: boolean;
  notes?: string;
}

interface Medication {
  id: number;
  name: string;
  dosage: string;
  treatment: string; // NEW: Group by condition (e.g., "Malaria", "Peptic Ulcer")
  category: "cardiovascular" | "diabetes" | "pain" | "mental" | "supplement" | "other";
  times: string[];
  frequency: string;
  isActive: boolean;
  notes?: string;
  refillsRemaining?: number;
  refillDate?: string;
  addedAt: string;
  history: Record<string, DoseLog[]>; // YYYY-MM-DD => DoseLog[]
  takenToday?: boolean[]; // Keep for backwards compatibility
}

interface WeekData {
  day: string;
  date: string;
  taken: number;
  missed: number;
  skipped: number;
  late: number;
  total: number;
  isToday: boolean;
}

interface TreatmentStats {
  treatment: string;
  adherence: number;
  onTimeRate: number;
  medications: Medication[];
  todayTaken: number;
  todayTotal: number;
  todayMissed: number;
  lowRefillMeds: Medication[];
}

interface GlassCardProps {
  children: ReactNode;
  style?: React.CSSProperties;
  T: Theme;
  tilt: { x: number; y: number };
  onClick?: () => void;
  noTilt?: boolean;
}

// ─────────────────────────────────────────────────────────────────
// TILT HOOK
// ─────────────────────────────────────────────────────────────────
function useTilt(): { x: number; y: number } {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const mouseRef = useRef({ active: false });

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null) {
        const x = Math.max(-25, Math.min(25, e.gamma));
        const y = Math.max(-25, Math.min(25, (e.beta || 0) - 10));
        setTilt({ x, y });
      }
    };

    const handleMouse = (e: MouseEvent) => {
      if (mouseRef.current.active) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const x = ((e.clientX - cx) / cx) * 18;
      const y = ((e.clientY - cy) / cy) * 12;
      setTilt({ x, y });
    };

    window.addEventListener("deviceorientation", handleOrientation as EventListener);
    window.addEventListener("mousemove", handleMouse);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation as EventListener);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return tilt;
}

// ─────────────────────────────────────────────────────────────────
// GLASS CARD
// ─────────────────────────────────────────────────────────────────
function GlassCard({ children, style = {}, T, tilt, onClick, noTilt }: GlassCardProps) {
  const tx = noTilt ? 0 : tilt.x;
  const ty = noTilt ? 0 : tilt.y;
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
        boxShadow: `0 8px 32px ${T.shadow}, 0 2px 8px ${T.shadow}, inset 0 1px 0 rgba(255,255,255,0.3)`,
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        background: `radial-gradient(ellipse 120% 100% at ${shimmerX}% ${shimmerY}%, ${T.shimmer1} 0%, ${T.shimmer2} 35%, ${T.shimmer3} 65%, transparent 100%)`,
        opacity: 0.55,
        transition: "background 0.1s ease-out",
        mixBlendMode: "screen",
      }} />
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.7) ${40 + tx * 2}%, transparent)`,
        pointerEvents: "none",
        zIndex: 1,
      }} />
      <div style={{ position: "relative", zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ADHERENCE RING
// ─────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────
// GET NEXT DOSE
// ─────────────────────────────────────────────────────────────────






// ─────────────────────────────────────────────────────────────────
// ADD MEDICATION MODAL
// ─────────────────────────────────────────────────────────────────
interface AddMedModalProps {
  T: Theme;
  tilt: { x: number; y: number };
  onClose: () => void;
  onSave: (med: Medication) => void;
}

function AddMedModal({ T, tilt, onClose, onSave }: AddMedModalProps) {
  const [name, setName] = useState("");
  const [injury, setInjury] = useState("");
  const [treatmentSuggestions, setTreatmentSuggestions] = useState<string[]>([]);
  const [dosage, setDosage] = useState("");
  const [category, setCategory] = useState<Medication['category']>("other");
  const [times, setTimes] = useState(["08:00"]);
  const [refills, setRefills] = useState("5");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const commonTreatments = ["Diabetes", "Type 1 Diabetes", "Type 2 Diabetes", "Hypertension", "Blood Pressure", "Anxiety", "Depression", "Asthma", "Arthritis", "Migraine", "Headache", "Allergies", "Thyroid", "Hypothyroidism", "Hyperthyroidism", "Cholesterol", "Heart Disease", "GERD", "Acid Reflux", "Back Pain", "Insomnia", "Sleep Disorder", "ADHD", "Bipolar", "Schizophrenia", "OCD", "PTSD", "Ulcer", "Gastric Ulcer", "Peptic Ulcer", "IBS", "Crohn's Disease", "Ulcerative Colitis", "Afib", "Arrhythmia", "Angina", "Cancer", "Breast Cancer", "Lung Cancer", "Prostate Cancer", "Kidney Disease", "Kidney Stones", "Urinary Tract Infection", "UTI", "Liver Disease", "Hepatitis", "Liver Cirrhosis", "COPD", "Emphysema", "Bronchitis", "Pneumonia", "Tuberculosis", "Menopause", "Osteoporosis", "Osteoarthritis", "Lupus", "Bacterial Infection", "Viral Infection", "Fungal Infection", "Dermatological", "Eczema", "Psoriasis", "Acne", "Rosacea", "Glaucoma", "Cataracts", "Macular Degeneration", "Hearing Loss", "Tinnitus", "Vertigo", "Parkinson's Disease", "Alzheimer's Disease", "Dementia", "Multiple Sclerosis", "Epilepsy", "Seizure Disorder", "Chronic Pain", "Fibromyalgia", "Obesity", "Weight Management", "Sleep Apnea", "Narcolepsy", "Panic Disorder", "Generalized Anxiety Disorder", "Social Anxiety", "Persistent Depressive Disorder", "Seasonal Affective Disorder", "Alcohol Dependence", "Opioid Addiction", "Anorexia Nervosa", "Bulimia Nervosa", "Erectile Dysfunction", "Infertility", "PCOS", "Endometriosis", "Gestational Diabetes", "Postpartum Depression", "Fever", "Cough", "Cold", "Flu", "COVID-19"]

  const handleTreatmentChange = (value: string) => {
    setInjury(value);
    if (value.length > 0) {
      const filtered = commonTreatments.filter(t => t.toLowerCase().includes(value.toLowerCase()));
      setTreatmentSuggestions(filtered);
    } else {
      setTreatmentSuggestions([]);
    }
  };

  const inputStyle: React.CSSProperties = {
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
    if (!name.trim() || !dosage.trim() || !injury.trim()) return;
    const newMed: Medication = {
      id: Date.now(),
      name: name.trim(),
      dosage: dosage.trim(),
      treatment: injury.trim(),
      category,
      times,
      frequency: "daily",
      isActive: true,
      notes: notes.trim() || undefined,
      refillsRemaining: parseInt(refills) || 0,
      addedAt: new Date().toISOString(),
      history: {},
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
          <div style={{ color: T.green, fontWeight: 800, fontSize: 18, marginTop: 12 }}>Added!</div>
          <div style={{ color: T.textMid, fontSize: 13, marginTop: 6 }}>Start tracking today</div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.35)",
      backdropFilter: "blur(10px)",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      zIndex: 200,
    }} onClick={(e) => (e.target as HTMLElement) === e.currentTarget && onClose()}>
      <div style={{
        width: "100%",
        maxWidth: 480,
        background: T.tabBar,
        backdropFilter: "blur(32px) saturate(1.8)",
        WebkitBackdropFilter: "blur(32px) saturate(1.8)",
        borderRadius: "24px 24px 0 0",
        border: `1px solid ${T.border}`,
        borderBottom: "none",
        padding: "0 20px 36px",
        boxShadow: `0 -8px 40px ${T.shadowStrong}`,
        maxHeight: "90vh",
        overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: T.textDim, opacity: 0.5 }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 19, color: T.text }}>Add Medication</div>
          <div onClick={onClose} style={{ color: T.textDim, cursor: "pointer", fontSize: 20, padding: "4px 8px", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M15 5L5 15M5 5l10 10" /></svg></div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, display: "block" }}>
            Treatment/Condition
          </label>
          <div style={{ position: "relative" }}>
            <input style={inputStyle} placeholder="e.g. Diabetes, Hypertension" value={injury} onChange={e => handleTreatmentChange(e.target.value)} />
            {treatmentSuggestions.length > 0 && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4,
                background: T.tabBar, border: `1px solid ${T.border}`, borderRadius: 8,
                maxHeight: 200, overflowY: "auto", zIndex: 101
              }}>
                {treatmentSuggestions.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setInjury(s);
                      setTreatmentSuggestions([]);
                    }}
                    style={{
                      padding: "10px 12px", cursor: "pointer",
                      borderBottom: i < treatmentSuggestions.length - 1 ? `1px solid ${T.border}` : "none",
                      color: T.text, fontSize: 13,
                      background: "transparent",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.accentBg; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, display: "block" }}>
            Medication Name
          </label>
          <input style={inputStyle} placeholder="e.g. Metformin" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, display: "block" }}>
            Dosage
          </label>
          <input style={inputStyle} placeholder="e.g. 500mg" value={dosage} onChange={e => setDosage(e.target.value)} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, display: "block" }}>
            Category
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {Object.entries(CATEGORY_INFO).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setCategory(k as Medication['category'])}
                style={{
                  padding: "12px 10px",
                  background: category === k ? T.accent : T.accentBg,
                  border: `2px solid ${category === k ? T.accent : T.border}`,
                  borderRadius: 10,
                  color: category === k ? "#fff" : T.text,
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CategoryIcon type={v.icon} color={category === k ? "#fff" : v.color} size={20} />
                </div>
                <span style={{ lineHeight: 1 }}>{v.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, display: "block" }}>
            Reminder Times
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {times.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <input type="time" value={t} onChange={e => { const n = [...times]; n[i] = e.target.value; setTimes(n); }} style={{ ...inputStyle, width: "auto", padding: "10px 12px" }} />
                {times.length > 1 && <div onClick={() => setTimes(times.filter((_, j) => j !== i))} style={{ marginLeft: 4, color: T.red, cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}><svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M15 5L5 15M5 5l10 10" /></svg></div>}
              </div>
            ))}
            <button onClick={() => setTimes([...times, "12:00"])} style={{ background: T.accentBg, border: `1px dashed ${T.accent}`, borderRadius: 12, color: T.accent, padding: "10px 14px", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>
              + Add Time
            </button>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, display: "block" }}>
            Refills Remaining
          </label>
          <input type="number" style={inputStyle} placeholder="5" value={refills} onChange={e => setRefills(e.target.value)} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, display: "block" }}>
            Special Notes (Optional)
          </label>
          <textarea style={{ ...inputStyle, minHeight: 60 }} placeholder="Take with food, side effects..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        <button onClick={handleSave} style={{
          width: "100%",
          padding: 16,
          background: name && dosage && injury ? `linear-gradient(135deg, ${T.accent}, ${T.accent}bb)` : T.border,
          border: "none",
          borderRadius: 16,
          color: name && dosage && injury ? "#fff" : T.textDim,
          fontWeight: 800,
          fontSize: 16,
          cursor: name && dosage && injury ? "pointer" : "not-allowed",
          fontFamily: "inherit",
          boxShadow: name && dosage && injury ? `0 4px 20px ${T.accent}55` : "none",
          transition: "all 0.2s",
        }}>
          Add to Treatment
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────
// BUILD WEEK DATA - IMPROVED
// ─────────────────────────────────────────────────────────────────
function buildWeekData(medications: Medication[]): WeekData[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  return Array.from({ length: 7 }, (_, offset) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - offset));
    const dateStr = d.toISOString().split('T')[0];
    const isToday = offset === 6;
    const isPast = dateStr < today;

    let taken = 0, missed = 0, skipped = 0, late = 0, total = 0;

    medications.forEach(med => {
      const dayLogs = med.history[dateStr] || [];
      const expectedCount = med.times.length;
      total += expectedCount;

      dayLogs.forEach(log => {
        if (log.status === "taken") {
          taken++;
          if (log.wasLate) late++;
        } else if (log.status === "missed") {
          missed++;
        } else if (log.status === "skipped") {
          skipped++;
        }
      });

      // Auto-mark unlogged doses as missed
      if (isPast || isToday) {
        const explicitlyLogged = dayLogs.length;
        const unlogged = expectedCount - explicitlyLogged;
        
        if (unlogged > 0) {
          if (isPast) {
            // Past days: all unlogged doses are marked as missed
            missed += unlogged;
          } else if (isToday) {
            // Today: only mark as missed if the time has passed
            med.times.forEach(timeStr => {
              const [hours, mins] = timeStr.split(':').map(Number);
              const doseTime = new Date(now);
              doseTime.setHours(hours, mins, 0);
              
              // Check if this dose time has a log entry
              const hasLog = dayLogs.some(log => log.scheduledTime === timeStr);
              if (!hasLog && now >= doseTime) {
                missed++;
              }
            });
          }
        }
      }
    });

    return { day: days[d.getDay()], date: dateStr, taken, missed, skipped, late, total, isToday };
  });
}

// ─────────────────────────────────────────────────────────────────
// COMPUTE STATS - IMPROVED
// ─────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────
// NEWS FEED GENERATOR - DAILY REFRESH
// ─────────────────────────────────────────────────────────────────
const ALL_NEWS = [
  { icon: "research", title: "How to Improve Medication Adherence", snippet: "Studies show that medication reminders increase adherence by up to 45%. Track your doses daily for better health outcomes.", category: "Research", url: "https://www.mayo clinic.org/healthy-lifestyle/consumer-health/expert-answers/medication-adherence/faq-20058140" },
  { icon: "exercise", title: "Exercise & Medication Effectiveness", snippet: "Regular physical activity enhances the efficacy of most medications. Aim for 30 minutes daily.", category: "Health Tip", url: "https://www.heart.org/en/healthy-living/fitness/getting-active" },
  { icon: "nutrition", title: "Food & Drug Interactions Guide", snippet: "Certain foods can affect how your body absorbs medications. Always check with your doctor about dietary restrictions.", category: "Nutrition", url: "https://www.fda.gov/consumers/consumer-updates/5-things-know-about-dietary-supplements" },
  { icon: "sleep", title: "Sleep Quality Improves Recovery", snippet: "Quality sleep improves medication effectiveness and immune function. Aim for 7-9 hours nightly.", category: "Wellness", url: "https://www.sleep foundation.org/sleep-hygiene" },
  { icon: "tech", title: "Digital Health & Medication Tracking", snippet: "Apps help track vital signs and medication adherence. Combined tracking provides comprehensive health insights.", category: "Technology", url: "https://www.healthline.com/health/consumer-health-app-benefits" },
  { icon: "research", title: "Patient Safety in Medications", snippet: "Understanding medication side effects and interactions improves treatment outcomes and patient safety.", category: "Research", url: "https://www.drugs.com/" },
  { icon: "exercise", title: "Stress & Medication Efficacy", snippet: "Reducing stress through exercise or meditation can improve medication efficacy. Try 10 minutes daily.", category: "Wellness", url: "https://www.mayoclinic.org/healthy-lifestyle/stress-management/basics/stress-management/hlv-20049495" },
  { icon: "nutrition", title: "Hydration & Health", snippet: "Proper hydration improves medication absorption and overall health. Drink at least 8 glasses of water daily.", category: "Nutrition", url: "https://www.cdc.gov/nutrition/" },
  { icon: "exercise", title: "Daily Activity for Wellness", snippet: "A 20-minute walk daily can significantly improve cardiovascular health and medication effectiveness.", category: "Health Tip", url: "https://www.cdc.gov/physicalactivity/basics/" },
  { icon: "tech", title: "Understanding Your Medications", snippet: "Learn about prescription information, dosage, and potential interactions with other drugs.", category: "Technology", url: "https://www.webmd.com/medications/" },
];

function getDailyNews(count: number = 5): typeof ALL_NEWS {
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const shuffled = [...ALL_NEWS].sort(() => 0.5 - Math.random());
  shuffled.sort((a, b) => (dayOfYear * 7 + ALL_NEWS.indexOf(a)) % ALL_NEWS.length - (dayOfYear * 7 + ALL_NEWS.indexOf(b)) % ALL_NEWS.length);
  return shuffled.slice(0, count);
}

function NewsIcon({ type, color }: { type: string; color: string }) {
  const iconProps: React.SVGProps<SVGSVGElement> = { width: 32, height: 32, viewBox: "0 0 32 32", stroke: color, fill: "none", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  
  switch (type) {
    case "research":
      return (
        <svg {...iconProps}>
          <path d="M8 6h16v18H8z" />
          <path d="M12 10h8M12 14h8M12 18h5" />
          <circle cx="8" cy="8" r="1.5" fill={color} />
        </svg>
      );
    case "exercise":
      return (
        <svg {...iconProps}>
          <circle cx="16" cy="7" r="2.5" />
          <path d="M16 10v6M12 13l-3 4M20 13l3 4M12 16v6M20 16v6" />
        </svg>
      );
    case "nutrition":
      return (
        <svg {...iconProps}>
          <path d="M8 10c0-2 2-4 4-4h8c2 0 4 2 4 4v12c0 2-2 4-4 4h-8c-2 0-4-2-4-4z" />
          <path d="M12 10v10M20 10v10M16 10v10" />
        </svg>
      );
    case "sleep":
      return (
        <svg {...iconProps}>
          <path d="M12 8c-4 0-6 4-6 8s2 8 6 8" />
          <path d="M20 8c4 0 6 4 6 8s-2 8-6 8" />
          <path d="M16 20c0 2 1 3 0 4" />
        </svg>
      );
    case "tech":
      return (
        <svg {...iconProps}>
          <rect x="4" y="6" width="24" height="16" rx="2" />
          <path d="M8 22h16M12 26h8" />
        </svg>
      );
    case "health":
      return (
        <svg {...iconProps}>
          <circle cx="16" cy="16" r="10" />
          <path d="M16 12v8M12 16h8" stroke={color} fill="none" />
        </svg>
      );
    default:
      return null;
  }
}

function CategoryIcon({ type, color, size = 24 }: { type: string; color: string; size?: number }) {
  const iconProps: React.SVGProps<SVGSVGElement> = { width: size, height: size, viewBox: "0 0 24 24", stroke: color, fill: "none", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (type) {
    case "heart":
      return <svg {...iconProps}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;
    case "glucose":
      return <svg {...iconProps}><path d="M12 2v20M4 8h16M4 12h16M4 16h16" /><circle cx="8" cy="6" r="1.5" fill={color} /></svg>;
    case "bandage":
      return <svg {...iconProps}><path d="M6 6h12v12H6z" /><circle cx="12" cy="12" r="1.5" fill={color} /><path d="M9 9l6 6M15 9l-6 6" strokeWidth={1} /></svg>;
    case "brain":
      return <svg {...iconProps}><path d="M9.59 4.59A2 2 0 1 1 7.59 6.59M9.59 4.59A10 10 0 0 0 7.59 14.59M9.59 4.59a10 10 0 0 1 5.66 10M16.41 19.41a2 2 0 1 1 2-2m-2 2a10 10 0 0 1-5.66-5.66M16.41 19.41a10 10 0 0 0 5.66-5.66M16.41 19.41L12 15.82m4.41 3.59L12 15.82m0 0 3.59-3.59" /></svg>;
    case "leaf":
      return <svg {...iconProps}><path d="M11 20A7 7 0 0 1 9.8 4.3A7 7 0 0 0 20 17Z" /></svg>;
    case "medical":
      return <svg {...iconProps}><path d="M12 2v20M2 12h20" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" /></svg>;
    default:
      return null;
  }
}

function TabIcon({ type, color, isActive = false }: { type: string; color: string; isActive?: boolean }) {
  const opacity = isActive ? 1 : 0.5;
  const iconProps: React.SVGProps<SVGSVGElement> = { width: 24, height: 24, viewBox: "0 0 24 24", stroke: color, fill: "none", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, style: { opacity, transition: "opacity 0.2s" } };

  switch (type) {
    case "dashboard":
      return <svg {...iconProps}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>;
    case "treatments":
      return <svg {...iconProps}><path d="M12 2L2 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill={isActive ? color : "none"} /><path d="M9 13l2 2 4-4" stroke={color} /></svg>;
    case "meds":
      return <svg {...iconProps}><circle cx="9" cy="9" r="3" /><circle cx="15" cy="9" r="3" /><circle cx="12" cy="15" r="3" /><circle cx="9" cy="21" r="1" fill={color} /><circle cx="15" cy="21" r="1" fill={color} /></svg>;
    case "history":
      return <svg {...iconProps}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
    default:
      return null;
  }
}

function StatusIcon({ status, color }: { status: "taken" | "missed" | "skipped"; color: string }) {
  const iconProps: React.SVGProps<SVGSVGElement> = { width: 20, height: 20, viewBox: "0 0 20 20", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  if (status === "taken") {
    return <svg {...iconProps}><polyline points="17 6 9.5 13.5 3 7" fill="none" stroke={color} /><circle cx="10" cy="10" r="9" fill="none" stroke={color} /></svg>;
  } else if (status === "skipped") {
    return <svg {...iconProps}><path d="M6 14l8-8M14 14l-8-8" stroke={color} /><circle cx="10" cy="10" r="9" fill="none" stroke={color} /></svg>;
  } else {
    return <svg {...iconProps}><circle cx="10" cy="10" r="9" /><path d="M10 6v8" stroke={color} /><path d="M6 10h8" stroke={color} /></svg>;
  }
}
function groupByTreatment(medications: Medication[]): string[] {
  return [...new Set(medications.map(m => m.treatment))];
}

function computeTreatmentStats(medications: Medication[], treatment: string): TreatmentStats {
  const treatmentMeds = medications.filter(m => m.treatment === treatment);
  const treatmentWeekData = buildWeekData(treatmentMeds);
  const past = treatmentWeekData.slice(0, 7);
  const totalPast = past.reduce((a, d) => a + d.total, 0);
  const takenPast = past.reduce((a, d) => a + d.taken, 0);
  const adherence = totalPast ? Math.round((takenPast / totalPast) * 100) : 100;
  const lateCount = past.reduce((a, d) => a + d.late, 0);
  const onTimeRate = takenPast > 0 ? Math.round(((takenPast - lateCount) / takenPast) * 100) : 0;

  const today = new Date().toISOString().split('T')[0];
  const todayLogs = treatmentMeds.flatMap(m => m.history[today] || []);
  const todayTaken = todayLogs.filter(l => l.status === "taken").length;
  const todayMissed = todayLogs.filter(l => l.status === "missed").length;
  const todayTotal = treatmentMeds.reduce((a, m) => a + m.times.length, 0);
  const lowRefillMeds = treatmentMeds.filter(m => m.isActive && m.refillsRemaining !== undefined && m.refillsRemaining <= 2);

  return { treatment, adherence, onTimeRate, medications: treatmentMeds, todayTaken, todayTotal, todayMissed, lowRefillMeds };
}

// ─────────────────────────────────────────────────────────────────
// HISTORY SCREEN - TREATMENT BASED WITH ADHERENCE TRACKING
// ─────────────────────────────────────────────────────────────────
function HistoryScreen({ medications, T, tilt }: { medications: Medication[]; T: Theme; tilt: { x: number; y: number } }) {
  const [viewMode, setViewMode] = useState<"treatments" | "timeline">("treatments");
  const [searchQuery, setSearchQuery] = useState("");

  if (medications.length === 0) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth={1.5}>
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div style={{ fontWeight: 700, fontSize: 17, color: T.text, marginBottom: 8 }}>No history yet</div>
        <div style={{ color: T.textMid, fontSize: 14 }}>Log medications to see your adherence history</div>
      </div>
    );
  }

  const treatments = groupByTreatment(medications);

  return (
    <div style={{ padding: "20px 16px" }}>
      {/* VIEW MODE TOGGLE */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {(["treatments", "timeline"] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            style={{
              flex: 1,
              padding: "10px 12px",
              background: viewMode === mode ? T.accent : "transparent",
              border: `1px solid ${viewMode === mode ? T.accent : T.border}`,
              borderRadius: 8,
              color: viewMode === mode ? "white" : T.text,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {mode === "treatments" ? "By Treatment" : "Timeline"}
          </button>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search records by medication name or treatment..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            color: T.text,
            fontSize: 13,
            outline: "none",
            fontFamily: "inherit",
          }}
        />
      </div>

      {viewMode === "treatments" ? (
        <>
          {treatments.map(treatment => {
            const treatmentMeds = medications.filter(m => m.treatment === treatment);
            const weekData = buildWeekData(treatmentMeds);
            const pastWeek = weekData.slice(0, 7).reverse();
            const totalDoses = pastWeek.reduce((a, d) => a + d.total, 0);
            const takenDoses = pastWeek.reduce((a, d) => a + d.taken, 0);
            const adherence = totalDoses ? Math.round((takenDoses / totalDoses) * 100) : 0;

            return (
              <GlassCard key={treatment} T={T} tilt={tilt} style={{ padding: "16px", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: T.accentBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CategoryIcon type={CATEGORY_INFO[treatmentMeds[0]?.category || "other"].icon} color={T.accent} size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: T.text }}>{treatment}</div>
                    <div style={{ fontSize: 12, color: T.textMid }}>
                      {treatmentMeds.length} medication{treatmentMeds.length !== 1 ? "s" : ""} tracked
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: adherence >= 80 ? T.green : adherence >= 50 ? T.amber : T.red }}>
                      {adherence}%
                    </div>
                    <div style={{ fontSize: 10, color: T.textDim, marginTop: 2 }}>7-day avg</div>
                  </div>
                </div>

                {/* ADHERENCE PROGRESS BAR */}
                <div style={{ background: T.border, height: 4, borderRadius: 2, marginBottom: 12, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${adherence}%`,
                      background: adherence >= 80 ? T.green : adherence >= 50 ? T.amber : T.red,
                      transition: "width 0.3s",
                    }}
                  />
                </div>

                {/* DAILY BREAKDOWN */}
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  {pastWeek.map((day, i) => {
                    const dayAdherence = day.total ? Math.round((day.taken / day.total) * 100) : 0;
                    const dayColor = dayAdherence === 100 ? T.green : dayAdherence >= 50 ? T.amber : T.red;
                    return (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          textAlign: "center",
                          padding: "8px 4px",
                          background: T.accentBg,
                          borderRadius: 6,
                          border: `1px solid ${T.border}`,
                        }}
                        title={day.day}
                      >
                        <div style={{ fontSize: 10, fontWeight: 700, color: dayColor, marginBottom: 4 }}>
                          {dayAdherence === 100 ? "✓" : dayAdherence === 0 ? "✗" : dayAdherence + "%"}
                        </div>
                        <div style={{ fontSize: 9, color: T.textDim }}>{day.day.slice(0, 3)}</div>
                      </div>
                    );
                  })}
                </div>

                {/* STATS */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
                  <div style={{ padding: 8, background: T.greenBg, borderRadius: 6, border: `1px solid ${T.greenBorder}`, textAlign: "center" }}>
                    <div style={{ fontWeight: 700, color: T.green }}>{takenDoses} taken</div>
                    <div style={{ fontSize: 10, color: T.textMid }}>this week</div>
                  </div>
                  <div style={{ padding: 8, background: T.redBg, borderRadius: 6, border: `1px solid ${T.redBorder}`, textAlign: "center" }}>
                    <div style={{ fontWeight: 700, color: T.red }}>{totalDoses - takenDoses} missed</div>
                    <div style={{ fontSize: 10, color: T.textMid }}>this week</div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </>
      ) : (
        <>
          {/* CALENDAR VIEW - 30 DAY HISTORY */}
          <div style={{ marginBottom: 20, padding: "14px", background: T.accentBg, borderRadius: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 12 }}>30-Day Adherence Calendar</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={`header-${i}`} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: T.textDim, marginBottom: 6, paddingBottom: 8, borderBottom: `1px solid ${T.border}` }}>
                  {d}
                </div>
              ))}
              {Array.from({ length: 30 }, (_, offset) => {
                const now = new Date();
                const month = now.getMonth();
                const year = now.getFullYear();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const dayOfMonth = Math.min((offset % daysInMonth) + 1, daysInMonth);
                const d = new Date(year, month, dayOfMonth);
                const dateStr = d.toISOString().split('T')[0];
                
                let expectedToday = 0;
                let takenToday = 0;
                
                medications.forEach(med => {
                  const medAddedDate = med.addedAt?.split('T')[0] || null;
                  if (!medAddedDate || medAddedDate <= dateStr) {
                    expectedToday += med.times.length;
                    
                    const dayLogs = med.history[dateStr] || [];
                    const takenLogs = dayLogs.filter(l => l.status === "taken").length;
                    takenToday += takenLogs;
                  }
                });
                
                const adherence = expectedToday > 0 ? Math.round((takenToday / expectedToday) * 100) : 0;
                const dayColor = adherence === 100 ? T.green : adherence >= 50 ? T.amber : adherence > 0 ? T.red : "transparent";
                const isToday = dateStr === new Date().toISOString().split('T')[0];

                return (
                  <div
                    key={dateStr}
                    style={{
                      aspectRatio: "1", borderRadius: 6, display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: 2,
                      background: dayColor === "transparent" ? T.border + "33" : dayColor + "33",
                      border: `1px solid ${isToday ? T.accent : dayColor === "transparent" ? T.border : dayColor}`,
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                    title={`${d.toLocaleDateString()}: ${expectedToday > 0 ? adherence + "% (" + takenToday + "/" + expectedToday + ")" : "No doses"}`}
                  >
                    <div style={{ fontSize: 9, fontWeight: 700, color: dayColor === "transparent" ? T.textDim : dayColor }}>
                      {d.getDate()}
                    </div>
                    <div style={{ fontSize: 8, color: dayColor === "transparent" ? T.textDim : dayColor, fontWeight: 600 }}>
                      {expectedToday > 0 ? adherence + "%" : "-"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7 DAY DETAILED LIST */}
          {Array.from({ length: 7 }, (_, offset) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - offset));
            const dateStr = d.toISOString().split('T')[0];
            const isToday = offset === 6;
            const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.getDay()];
            return (
              <div key={dateStr} style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.textDim, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {isToday ? "TODAY" : dayName.toUpperCase()}
                </div>
                {medications.map(med => {
                  const dayLogs = med.history[dateStr] || [];
                  return dayLogs.length > 0 ? dayLogs.map((log, j) => {
                    const statusColor = log.status === "taken" ? T.green : log.status === "skipped" ? T.amber : T.red;
                    return (
                      <GlassCard key={`${dateStr}-${med.id}-${j}`} T={T} tilt={tilt} style={{ padding: "12px 14px", marginBottom: 6, border: `1px solid ${log.status === "taken" ? T.greenBorder : log.status === "skipped" ? T.amber + "44" : T.redBorder}`, background: statusColor + "09" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ flex: "0 0 20px" }}>
                            <StatusIcon status={log.status} color={statusColor} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, color: T.text, fontSize: 14 }}>{med.name}</div>
                            <div style={{ fontSize: 12, color: T.textMid, marginTop: 2 }}>{med.dosage} • {med.treatment}</div>
                            <div style={{ fontSize: 11, color: statusColor, marginTop: 4, fontWeight: 600 }}>
                              {log.status === "taken" ? `Taken at ${log.actualTime || log.scheduledTime}${log.wasLate ? " • Late" : ""}` : 
                               log.status === "skipped" ? "Intentionally skipped" : `Missed (scheduled: ${log.scheduledTime})`}
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    );
                  }) : null;
                })}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MEDICATIONS LIST SCREEN
// ─────────────────────────────────────────────────────────────────
function MedicationsScreen({ medications, T, tilt, onDelete, onToggleDose }: { medications: Medication[]; T: Theme; tilt: { x: number; y: number }; onDelete: (id: number) => void; onToggleDose: (id: number, status: "taken" | "missed" | "skipped") => void }) {
  if (medications.length === 0) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth={1.5}><circle cx="6" cy="12" r="3" /><circle cx="18" cy="12" r="3" /><circle cx="12" cy="18" r="3" /><circle cx="9" cy="21" r="1" fill={T.text} /><circle cx="15" cy="21" r="1" fill={T.text} /></svg>
        </div>
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
              <div
                style={{
                  background: T.greenBg,
                  border: `1px solid ${T.greenBorder}`,
                  borderRadius: 20,
                  padding: "4px 10px",
                  fontSize: 11,
                  color: T.green,
                  fontWeight: 600,
                }}
              >
                Active
              </div>
              <div
                onClick={() => onDelete(med.id)}
                style={{
                  color: T.red,
                  cursor: "pointer",
                  padding: "4px 6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Remove"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M15 5L5 15M5 5l10 10" /></svg>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            {med.times.map((t, i) => (
              <div
                key={i}
                style={{
                  background: T.accentBg,
                  border: `1px solid ${T.accent}44`,
                  borderRadius: 20,
                  padding: "5px 12px",
                  fontSize: 12,
                  color: T.accent,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg> {t}
              </div>
            ))}
          </div>

          {/* DOSE LOGGING BUTTONS */}
          <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
            <button onClick={() => onToggleDose(med.id, "taken")} style={{
              flex: 1,
              padding: "8px 12px",
              background: T.green,
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }} title="Mark as taken">
              ✓ Taken
            </button>
            <button onClick={() => onToggleDose(med.id, "missed")} style={{
              flex: 1,
              padding: "8px 12px",
              background: T.red,
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }} title="Mark as missed">
              ✗ Missed
            </button>
            <button onClick={() => onToggleDose(med.id, "skipped")} style={{
              flex: 1,
              padding: "8px 12px",
              background: T.amber,
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }} title="Mark as skipped">
              ⊳ Skipped
            </button>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SPLASH SCREEN COMPONENT
// ─────────────────────────────────────────────────────────────────
function SplashScreen({ T }: { T: Theme }) {
  const motivationalQuotes = [
    "Your health is your wealth",
    "Consistency is key to better health",
    "Track today, thrive tomorrow",
    "Small steps lead to big results",
    "Every dose brings you closer to wellness",
    "Take care of your health, it's your most precious asset",
    "Staying on track keeps you on point",
    "Your future self will thank you",
    "Health is a journey, not a destination",
    "Medication adherence saves lives"
  ];

  const [quote] = useState(() => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: T.bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
    }}>
      <div style={{ textAlign: "center", maxWidth: 300 }}>
        <div style={{
          fontSize: 64,
          marginBottom: 24,
          fontWeight: 900,
          background: `linear-gradient(135deg, ${T.accent}, ${T.accentBg})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          MT
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: T.text, marginBottom: 8 }}>MedTracker</div>
        <div style={{ fontSize: 14, color: T.textDim, marginBottom: 32 }}>Health Management Made Simple</div>
        <div style={{
          fontSize: 16,
          fontWeight: 600,
          color: T.accent,
          fontStyle: "italic",
          padding: "16px 20px",
          borderLeft: `3px solid ${T.accent}`,
          textAlign: "left",
        }}>
          "{quote}"
        </div>
        <div style={{ marginTop: 48 }}>
          <div style={{
            width: 40,
            height: 40,
            margin: "0 auto",
            border: `2px solid ${T.accent}`,
            borderRadius: "50%",
            borderTop: `2px solid transparent`,
            animation: "spin 1s linear infinite",
          }} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// LOCK SCREEN COMPONENT
// ─────────────────────────────────────────────────────────────────
function LockScreen({ T, onUnlock }: { T: Theme; onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handlePinEntry = (digit: string) => {
    if (pin.length < 6) {
      setPin(pin + digit);
      setError("");
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError("");
  };

  const handleSubmit = () => {
    const savedPin = localStorage.getItem("medtracker_pin");
    if (pin === savedPin) {
      setPin("");
      onUnlock();
    } else {
      setError("Incorrect PIN");
      setPin("");
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: T.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, backdropFilter: "blur(24px)",
    }}>
      <div style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 24,
        padding: "48px 24px",
        maxWidth: 300,
        width: "90%",
        boxShadow: `0 20px 60px rgba(0,0,0,0.3)`,
        backdropFilter: "blur(16px)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 8 }}>Enter PIN</div>
          <div style={{ fontSize: 12, color: T.textDim }}>Your medications are locked</div>
        </div>

        {/* PIN DISPLAY */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 32 }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: i < pin.length ? T.accent : T.surface,
                border: `2px solid ${i < pin.length ? T.accent : T.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 18,
                color: i < pin.length ? "#fff" : "transparent",
                transition: "all 0.2s",
              }}
            >
              {i < pin.length ? "•" : ""}
            </div>
          ))}
        </div>

        {error && (
          <div style={{ textAlign: "center", color: T.red, fontSize: 12, fontWeight: 700, marginBottom: 16 }}>
            {error}
          </div>
        )}

        {/* KEYPAD */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
            <button
              key={digit}
              onClick={() => handlePinEntry(digit.toString())}
              style={{
                padding: "14px 0",
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                fontSize: 18,
                fontWeight: 700,
                color: T.text,
                cursor: "pointer",
                transition: "all 0.1s",
                fontFamily: "inherit",
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.95)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {digit}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
          <div />
          <button
            onClick={() => handlePinEntry("0")}
            style={{
              padding: "14px 0",
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              fontSize: 18,
              fontWeight: 700,
              color: T.text,
              cursor: "pointer",
              transition: "all 0.1s",
              fontFamily: "inherit",
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.95)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            style={{
              padding: "14px 0",
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              color: T.text,
              cursor: "pointer",
              transition: "all 0.1s",
              fontFamily: "inherit",
              fontSize: 18,
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.95)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            ⌫
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={pin.length !== 6}
          style={{
            width: "100%",
            padding: "14px 0",
            background: pin.length === 6 ? `linear-gradient(135deg, ${T.accent}, ${T.accent}cc)` : T.surface,
            border: `1px solid ${pin.length === 6 ? T.accent : T.border}`,
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            color: pin.length === 6 ? "#fff" : T.textDim,
            cursor: pin.length === 6 ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            fontFamily: "inherit",
          }}
        >
          Unlock
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// PIN SETTINGS MODAL
// ─────────────────────────────────────────────────────────────────
function PinSettingsModal({ T, onClose, onSave, onDisable }: { T: Theme; onClose: () => void; onSave: (pin: string) => void; onDisable?: () => void }) {
  const [step, setStep] = useState<"setup" | "confirm" | "disable">("setup");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [hasPinSet] = useState(() => !!localStorage.getItem("medtracker_pin"));

  const handlePinEntry = (digit: string, isConfirm: boolean) => {
    const currentPin = isConfirm ? confirmPin : pin;
    if (currentPin.length < 6) {
      if (isConfirm) {
        setConfirmPin(currentPin + digit);
      } else {
        setPin(currentPin + digit);
      }
      setError("");
    }
  };

  const handleBackspace = (isConfirm: boolean) => {
    if (isConfirm) {
      setConfirmPin(confirmPin.slice(0, -1));
    } else {
      setPin(pin.slice(0, -1));
    }
    setError("");
  };

  const handleNext = () => {
    if (pin.length !== 6) {
      setError("PIN must be 6 digits");
      return;
    }
    setStep("confirm");
  };

  const handleConfirm = () => {
    if (confirmPin.length !== 6) {
      setError("PIN must be 6 digits");
      return;
    }
    if (pin !== confirmPin) {
      setError("PINs do not match");
      setPin("");
      setConfirmPin("");
      setStep("setup");
      return;
    }
    onSave(pin);
  };

  const currentPin = step === "setup" ? pin : confirmPin;

  const renderKeypad = (isConfirm: boolean) => (
    <>
      {/* PIN DISPLAY */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 32 }}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: i < currentPin.length ? T.accent : T.surface,
              border: `2px solid ${i < currentPin.length ? T.accent : T.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 18,
              color: i < currentPin.length ? "#fff" : "transparent",
              transition: "all 0.2s",
            }}
          >
            {i < currentPin.length ? "•" : ""}
          </div>
        ))}
      </div>

      {error && (
        <div style={{ textAlign: "center", color: T.red, fontSize: 12, fontWeight: 700, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* KEYPAD */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
          <button
            key={digit}
            onClick={() => handlePinEntry(digit.toString(), isConfirm)}
            style={{
              padding: "14px 0",
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              fontSize: 18,
              fontWeight: 700,
              color: T.text,
              cursor: "pointer",
              transition: "all 0.1s",
              fontFamily: "inherit",
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.95)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {digit}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
        <div />
        <button
          onClick={() => handlePinEntry("0", isConfirm)}
          style={{
            padding: "14px 0",
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 700,
            color: T.text,
            cursor: "pointer",
            transition: "all 0.1s",
            fontFamily: "inherit",
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.95)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          0
        </button>
        <button
          onClick={() => handleBackspace(isConfirm)}
          style={{
            padding: "14px 0",
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            color: T.text,
            cursor: "pointer",
            transition: "all 0.1s",
            fontFamily: "inherit",
            fontSize: 18,
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.95)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ⌫
        </button>
      </div>
    </>
  );

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      zIndex: 100,
    }}>
      <div style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: "24px 24px 0 0",
        padding: "32px 24px",
        maxWidth: 430,
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        animation: "slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>PIN</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 8 }}>
            {step === "setup" ? (hasPinSet ? "Update PIN" : "Create PIN") : step === "confirm" ? "Confirm PIN" : "Disable PIN"}
          </div>
          <div style={{ fontSize: 12, color: T.textDim }}>
            {step === "setup" ? (hasPinSet ? "Enter a new 6-digit PIN" : "Create a 6-digit PIN to lock your app") : step === "confirm" ? "Enter the same PIN to confirm" : "Remove PIN protection from your app"}
          </div>
        </div>

        {step !== "disable" && renderKeypad(step === "confirm")}

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: step === "disable" ? 24 : 0 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              minWidth: 100,
              padding: "14px 0",
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              color: T.text,
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
          {hasPinSet && step === "setup" && (
            <button
              onClick={() => setStep("disable")}
              style={{
                flex: 1,
                minWidth: 100,
                padding: "14px 0",
                background: T.redBg,
                border: `1px solid ${T.red}`,
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                color: T.red,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              Disable
            </button>
          )}
          {step === "disable" && (
            <button
              onClick={() => setStep("setup")}
              style={{
                flex: 1,
                minWidth: 100,
                padding: "14px 0",
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                color: T.text,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              Back
            </button>
          )}
          {step === "disable" ? (
            <button
              onClick={() => {
                if (onDisable) onDisable();
              }}
              style={{
                flex: 1,
                minWidth: 100,
                padding: "14px 0",
                background: `linear-gradient(135deg, ${T.red}, ${T.red}cc)`,
                border: `1px solid ${T.red}`,
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              Confirm Disable
            </button>
          ) : (
            <button
              onClick={step === "setup" ? handleNext : handleConfirm}
              disabled={currentPin.length !== 6}
              style={{
                flex: 1,
                minWidth: 100,
                padding: "14px 0",
                background: currentPin.length === 6 ? `linear-gradient(135deg, ${T.accent}, ${T.accent}cc)` : T.surface,
                border: `1px solid ${currentPin.length === 6 ? T.accent : T.border}`,
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                color: currentPin.length === 6 ? "#fff" : T.textDim,
                cursor: currentPin.length === 6 ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              {step === "setup" ? "Next" : "Create PIN"}
            </button>
          )}
        </div>
      </div>
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
  const [medications, setMedications] = useLocalStorage<Medication[]>("medtracker_medications", []);
  const [isLocked, setIsLocked] = useState(true);
  const [pinSetup, setPinSetup] = useState(false);
  const [showPinSettings, setShowPinSettings] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [notification, setNotification] = useState<{ id: string; message: string; type: "success" | "info" | "warning" } | null>(null);
  const [notifiedMeds, setNotifiedMeds] = useState<Set<string>>(new Set());
  
  // Check if PIN is set on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedPin = localStorage.getItem("medtracker_pin");
      if (savedPin) {
        setIsLocked(true);
        setPinSetup(true);
      } else {
        setIsLocked(false);
        setPinSetup(false);
      }
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Notification system - check for upcoming medications
  useEffect(() => {
    const checkMedications = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
      const today = now.toISOString().split('T')[0];

      medications.forEach((med) => {
        med.times.forEach((time) => {
          // Check if current time matches medication time (within 2 minute window)
          const [medHour, medMin] = time.split(':').map(Number);
          const [nowHour, nowMin] = currentTime.split(':').map(Number);
          const timeDiff = Math.abs(medHour * 60 + medMin - (nowHour * 60 + nowMin));

          if (timeDiff <= 2) {
            const notificationKey = `${med.id}-${time}-${today}`;
            
            // Only notify once per medication per day
            if (!notifiedMeds.has(notificationKey)) {
              const todayLogs = med.history[today] || [];
              const alreadyTaken = todayLogs.some(log => log.scheduledTime === time && log.status === "taken");

              if (!alreadyTaken) {
                // Show in-app notification
                setNotification({
                  id: notificationKey,
                  message: `Time to take ${med.name}`,
                  type: "info"
                });

                // Clear notification after 5 seconds
                setTimeout(() => setNotification(null), 5000);

                // Show browser notification if permitted
                if ("Notification" in window && Notification.permission === "granted") {
                  new Notification("MedTracker Reminder", {
                    body: `Time to take ${med.name} (${med.dosage})`,
                    icon: "/favicon.svg",
                    tag: notificationKey,
                  });
                }

                setNotifiedMeds(prev => new Set(prev).add(notificationKey));
              }
            }
          }
        });
      });
    };

    // Request notification permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Check every minute
    const interval = setInterval(checkMedications, 60000);
    checkMedications(); // Check immediately on mount

    return () => clearInterval(interval);
  }, [medications, notifiedMeds]);

  const T = isDark ? THEMES.dark : THEMES.light;
  const tilt = useTilt();

  // IMPORTANT: ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  const handleToggleDose = useCallback((medId: number, status: "taken" | "missed" | "skipped") => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);
    
    const updated = medications.map((m: Medication) => {
      if (m.id !== medId) return m;
      const med = medications.find((pm: Medication) => pm.id === medId)!;
      const dayLogs = med.history[today] || [];
      const scheduledTime = med.times[0]; // Use first time as reference
      
      return {
          ...m,
          history: {
            ...m.history,
            [today]: [
              ...dayLogs,
              {
                scheduledTime,
                status,
                actualTime: status === "taken" ? timeStr : undefined,
                wasLate: status === "taken" ? false : undefined,
              }
            ]
          }
      };
    });
    setMedications(updated);
  }, [setMedications, medications]);

  const handleAddMed = useCallback((newMed: Medication) => {
    setMedications([...medications, newMed]);
  }, [medications, setMedications]);

  const handleDeleteMed = useCallback((medId: number) => {
    setMedications(medications.filter((m: Medication) => m.id !== medId));
  }, [medications, setMedications]);

  if (showSplash) {
    return <SplashScreen T={T} />;
  }

  if (isLocked && pinSetup) {
    return <LockScreen T={T} onUnlock={() => setIsLocked(false)} />;
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", iconType: "dashboard" as const },
    { id: "treatments", label: "Treatments", iconType: "treatments" as const },
    { id: "meds", label: "Meds", iconType: "meds" as const },
    { id: "history", label: "History", iconType: "history" as const },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: T.bg,
      fontFamily: "'Nunito', 'DM Sans', system-ui, sans-serif",
      color: T.text,
      maxWidth: 430,
      margin: "0 auto",
      position: "relative",
      paddingBottom: 120,
      overflowY: "auto",
      transition: "background 0.5s ease, color 0.3s ease",
    }}>
      
      {/* IN-APP NOTIFICATION TOAST */}
      {notification && (
        <div style={{
          position: "fixed",
          top: 20,
          left: 16,
          right: 16,
          maxWidth: 398,
          background: notification.type === "info" ? "rgba(102, 126, 234, 0.9)" : notification.type === "success" ? "#10b981" : "#f59e0b",
          color: "white",
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
          zIndex: 999,
          animation: "slideDown 0.3s ease-out",
          fontSize: "14px",
          fontWeight: "600",
        }}>
          {notification.message}
        </div>
      )}
      
      {/* HEADER */}
      <div style={{
        padding: "20px 16px 16px",
        background: T.navBg,
        backdropFilter: "blur(20px) saturate(1.5)",
        WebkitBackdropFilter: "blur(20px) saturate(1.5)",
        position: "sticky",
        top: 0,
        zIndex: 40,
        borderBottom: `1px solid ${T.border}`,
        width: "100%",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: T.textDim, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>
              {tab === "dashboard" ? "Your Health" : tab === "meds" ? "Medications" : "History"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <div onClick={() => setIsDark(d => !d)} style={{
              width: 52, height: 28, borderRadius: 14,
              background: T.toggleBg,
              border: `1px solid ${T.border}`,
              position: "relative", cursor: "pointer",
              transition: "all 0.3s", flexShrink: 0,
            }}>
            <div style={{
              position: "absolute", top: 3,
              left: isDark ? 27 : 3,
              width: 20, height: 20, borderRadius: "50%",
              background: T.toggleKnob,
              transition: "left 0.3s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: `0 2px 6px ${T.toggleKnob}66`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {isDark ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#fff" }}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#fff" }}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              )}
            </div>
            </div>
            <button onClick={() => setShowPinSettings(true)} style={{
              width: 36, height: 36, borderRadius: 8,
              background: T.surface,
              border: `1px solid ${T.border}`,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: T.accent, transition: "all 0.2s",
            }} title="PIN Settings">
              PIN
            </button>
            <button onClick={() => setShowAdd(true)} style={{
              background: `linear-gradient(135deg, ${T.accent}, ${T.accent}cc)`,
              border: "none", borderRadius: 10,
              color: "#fff", fontWeight: 700,
              padding: "8px 14px", cursor: "pointer",
              fontSize: 12, fontFamily: "inherit",
              boxShadow: `0 4px 12px ${T.accent}44`,
              whiteSpace: "nowrap",
            }}>
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* DASHBOARD */}
      {tab === "dashboard" && (
        <div style={{ padding: "18px 16px 0", position: "relative", zIndex: 10 }}>
          {medications.length === 0 ? (
            <GlassCard T={T} tilt={tilt} style={{ padding: "40px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth={1.5}><circle cx="6" cy="12" r="3" /><circle cx="18" cy="12" r="3" /><circle cx="12" cy="18" r="3" /><circle cx="9" cy="21" r="1" fill={T.text} /><circle cx="15" cy="21" r="1" fill={T.text} /></svg>
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, color: T.text, marginBottom: 6 }}>No medications yet</div>
              <div style={{ color: T.textMid, fontSize: 13 }}>Tap "+ Add" to start tracking your health</div>
            </GlassCard>
          ) : (
            <>
              {/* HORIZONTAL SCROLLABLE MED CARDS */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.textDim, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Your Medications
                </div>
                <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}>
                  {medications.filter(m => m.isActive).map(med => {
                    const today = new Date().toISOString().split('T')[0];
                    const now = new Date();
                    const todayLogs = med.history[today] || [];
                    
                    // Calculate doses that matter for today's progress
                    let totalDosesToday = 0;
                    let takenToday = 0;
                    
                    med.times.forEach(timeStr => {
                      const [hours, mins] = timeStr.split(':').map(Number);
                      const doseTime = new Date(now);
                      doseTime.setHours(hours, mins, 0);
                      
                      // Only count doses that have passed or are currently happening
                      if (now >= doseTime) {
                        totalDosesToday++;
                        
                        // Check if this dose time has a log
                        const hasLog = todayLogs.some(log => log.scheduledTime === timeStr && log.status === "taken");
                        if (hasLog) {
                          takenToday++;
                        }
                      }
                    });
                    
                    // If no doses have passed yet, show full unavailable state
                    const medAdherence = totalDosesToday > 0 ? Math.round((takenToday / totalDosesToday) * 100) : 100;

                    return (
                      <div key={med.id} style={{ flex: "0 0 140px", minWidth: 140 }}>
                        <GlassCard T={T} tilt={tilt} style={{ padding: "16px", textAlign: "center", height: "100%" }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                            {/* Mini Progress Ring */}
                            <svg width="80" height="80" viewBox="0 0 80 80">
                              <circle cx="40" cy="40" r="36" fill="none" stroke={T.border} strokeWidth="2" />
                              <circle
                                cx="40"
                                cy="40"
                                r="36"
                                fill="none"
                                stroke={medAdherence >= 80 ? T.green : medAdherence >= 50 ? T.amber : T.red}
                                strokeWidth="2"
                                strokeDasharray={`${(medAdherence / 100) * 226} 226`}
                                strokeLinecap="round"
                                style={{ transform: "rotate(-90deg)", transformOrigin: "40px 40px", transition: "stroke-dasharray 0.3s" }}
                              />
                              <text x="40" y="45" textAnchor="middle" style={{ fontSize: 18, fontWeight: 700, fill: T.text }}>
                                {medAdherence}%
                              </text>
                            </svg>

                            {/* Med Info */}
                            <div style={{ minHeight: 60 }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: T.text, lineHeight: 1.2, marginBottom: 4 }}>
                                {med.name}
                              </div>
                              <div style={{ fontSize: 10, color: T.textDim }}>{med.dosage}</div>
                              <div style={{ fontSize: 9, color: T.textMid, marginTop: 4 }}>
                                {med.treatment}
                              </div>
                            </div>

                            {/* Quick Actions - Taken / Missed / Skipped */}
                            <div style={{ display: "flex", gap: 4, width: "100%" }}>
                              <button onClick={() => handleToggleDose(med.id, "taken")} style={{
                                flex: 1,
                                padding: "6px 4px",
                                background: T.green,
                                border: "none",
                                borderRadius: 6,
                                color: "#fff",
                                fontSize: 9,
                                fontWeight: 700,
                                cursor: "pointer",
                                fontFamily: "inherit",
                              }} title="Mark as taken">
                                ✓
                              </button>
                              <button onClick={() => handleToggleDose(med.id, "missed")} style={{
                                flex: 1,
                                padding: "6px 4px",
                                background: T.red,
                                border: "none",
                                borderRadius: 6,
                                color: "#fff",
                                fontSize: 9,
                                fontWeight: 700,
                                cursor: "pointer",
                                fontFamily: "inherit",
                              }} title="Mark as missed">
                                ✗
                              </button>
                              <button onClick={() => handleToggleDose(med.id, "skipped")} style={{
                                flex: 1,
                                padding: "6px 4px",
                                background: T.amber,
                                border: "none",
                                borderRadius: 6,
                                color: "#fff",
                                fontSize: 9,
                                fontWeight: 700,
                                cursor: "pointer",
                                fontFamily: "inherit",
                              }} title="Mark as skipped">
                                ⏭
                              </button>
                            </div>
                          </div>
                        </GlassCard>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* MEDICAL NEWS FEED */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.textDim, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Medical Updates
                </div>

                {getDailyNews(5).map((news, idx) => (
                  <a
                    key={idx}
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ textDecoration: "none", cursor: "pointer" }}
                  >
                    <div onMouseEnter={(e: any) => { e.currentTarget.style.borderColor = T.accent + "66"; }} onMouseLeave={(e: any) => { e.currentTarget.style.borderColor = "transparent"; }}>
                      <GlassCard T={T} tilt={tilt} style={{ padding: "14px 16px", marginBottom: 10, cursor: "pointer", transition: "border-color 0.2s, background 0.2s" }}>
                        <div style={{ display: "flex", gap: 12 }}>
                          <div style={{ flex: "0 0 32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <NewsIcon type={news.icon} color={T.accent} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                              <div style={{ fontWeight: 700, fontSize: 13, color: T.text, lineHeight: 1.2 }}>
                                {news.title}
                              </div>
                            </div>
                            <div style={{ fontSize: 11, color: T.textMid, lineHeight: 1.4, marginBottom: 6 }}>
                              {news.snippet}
                            </div>
                            <div style={{
                              display: "inline-block",
                              padding: "2px 8px",
                              background: T.accentBg,
                              borderRadius: 12,
                              fontSize: 9,
                              fontWeight: 700,
                              color: T.accent,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em"
                            }}>
                              {news.category}
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* TREATMENTS TAB */}
      {tab === "treatments" && (
        <div style={{ padding: "20px 16px", position: "relative", zIndex: 10 }}>
          {medications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}><svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth={1.5}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M12 8v8M8 12h8" stroke={T.text} strokeWidth={1.5} strokeLinecap="round" /></svg></div>
              <div style={{ fontWeight: 700, fontSize: 16, color: T.text, marginBottom: 6 }}>No treatments tracked</div>
              <div style={{ fontSize: 13, color: T.textMid }}>Add a medication to start</div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.textDim, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Your Treatments
              </div>
              {groupByTreatment(medications).map(treatment => {
                const treatmentStats = computeTreatmentStats(medications, treatment);
                const handleCompleteTreatment = () => {
                  if (window.confirm(`Mark "${treatment}" as completed? This will remove all associated medications.`)) {
                    setMedications(medications.filter((m: Medication) => m.treatment !== treatment));
                  }
                };
                return (
                  <GlassCard
                    key={treatment}
                    T={T}
                    tilt={tilt}
                    onClick={() => {
                      setTab("dashboard");
                    }}
                    style={{
                      padding: "18px 16px",
                      marginBottom: 12,
                      cursor: "pointer",
                      transition: "transform 0.2s, border-color 0.2s",
                      border: `2px solid ${T.accent}44`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 6, background: T.accentBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <CategoryIcon type="pill" color={T.accent} size={16} />
                          </div>
                          <div style={{ fontWeight: 800, fontSize: 17, color: T.text }}>{treatment}</div>
                        </div>
                        <div style={{ fontSize: 12, color: T.textMid, marginBottom: 8 }}>
                          {treatmentStats.medications.length} medication{treatmentStats.medications.length !== 1 ? "s" : ""} · {treatmentStats.todayTaken}/{treatmentStats.todayTotal} today
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <StatusIcon status="taken" color={T.green} />
                            <span style={{ fontSize: 12, fontWeight: 700, color: T.green }}>{treatmentStats.adherence}%</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            <span style={{ fontSize: 12, fontWeight: 700, color: T.accent }}>{treatmentStats.onTimeRate}%</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <svg width="60" height="60" viewBox="0 0 60 60" style={{ marginTop: 4 }}>
                          <circle
                            cx="30"
                            cy="30"
                            r="28"
                            fill="none"
                            stroke={T.border}
                            strokeWidth="2"
                          />
                          <circle
                            cx="30"
                            cy="30"
                            r="28"
                            fill="none"
                            stroke={treatmentStats.adherence >= 80 ? T.green : treatmentStats.adherence >= 50 ? T.amber : T.red}
                            strokeWidth="2"
                            strokeDasharray={`${(treatmentStats.adherence / 100) * 176} 176`}
                            strokeLinecap="round"
                            style={{ transform: "rotate(-90deg)", transformOrigin: "30px 30px", transition: "stroke-dasharray 0.3s" }}
                          />
                          <text x="30" y="32" textAnchor="middle" style={{ fontSize: 16, fontWeight: 700, fill: T.text }}>
                            {treatmentStats.adherence}%
                          </text>
                        </svg>
                      </div>
                    </div>

                    {/* TREATMENT COMPLETED BUTTON */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompleteTreatment();
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: `linear-gradient(135deg, ${T.green}, ${T.green}dd)`,
                        border: `1px solid ${T.greenBorder}`,
                        borderRadius: 8,
                        color: "white",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                        transition: "opacity 0.2s, transform 0.1s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        fontFamily: "inherit",
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.transform = "scale(0.98)";
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                      Treatment Completed
                    </button>
                  </GlassCard>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* MEDICATIONS TAB */}
      {tab === "meds" && (
        <div style={{ position: "relative", zIndex: 10 }}>
          <MedicationsScreen medications={medications} T={T} tilt={tilt} onDelete={handleDeleteMed} onToggleDose={handleToggleDose} />
        </div>
      )}

      {/* HISTORY TAB */}
      {tab === "history" && (
        <div style={{ position: "relative", zIndex: 10 }}>
          <HistoryScreen medications={medications} T={T} tilt={tilt} />
        </div>
      )}

      {/* BOTTOM TAB BAR */}
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
              transform: tab === t.id ? "scale(1.15)" : "scale(1)",
              transition: "transform 0.2s",
            }}><TabIcon type={t.iconType} color={tab === t.id ? T.accent : T.textDim} isActive={tab === t.id} /></div>
            <div style={{
              fontSize: 10, fontWeight: 700,
              color: tab === t.id ? T.accent : T.textDim,
              letterSpacing: "0.04em",
              transition: "color 0.2s",
            }}>{t.label}</div>
            {tab === t.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.accent }} />}
          </button>
        ))}
      </div>

      {/* ADD MODAL */}
      {showAdd && (
        <AddMedModal T={T} tilt={tilt} onClose={() => setShowAdd(false)} onSave={handleAddMed} />
      )}

      {/* PIN SETTINGS MODAL */}
      {showPinSettings && (
        <PinSettingsModal T={T} onClose={() => setShowPinSettings(false)} onSave={(pin: string) => {
          localStorage.setItem("medtracker_pin", pin);
          setPinSetup(true);
          setIsLocked(true);
          setShowPinSettings(false);
        }} onDisable={() => {
          localStorage.removeItem("medtracker_pin");
          setPinSetup(false);
          setIsLocked(false);
          setShowPinSettings(false);
        }} />
      )}
    </div>
  );
}

