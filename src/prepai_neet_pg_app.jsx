import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Brain,
  Clock3,
  BookOpen,
  Target,
  Activity,
  CalendarDays,
  Stethoscope,
  BarChart3,
  NotebookPen,
  TimerReset,
  AlarmClock,
  Microscope,
  Flame,
  ClipboardList,
  TrendingUp,
  ShieldAlert,
  HeartPulse,
} from "lucide-react";

const SUBJECTS = [
  "Anatomy",
  "Physiology",
  "Biochemistry",
  "Pathology",
  "Pharmacology",
  "Microbiology",
  "Forensic Medicine",
  "PSM",
  "Medicine",
  "Surgery",
  "OBG",
  "Pediatrics",
  "ENT",
  "Ophthalmology",
  "Orthopedics",
  "Radiology",
  "Dermatology",
  "Psychiatry",
];

const LECTURE_DATA = [
  { subject: "Pathology", planned: 120, completed: 48, todayTarget: 3 },
  { subject: "Pharmacology", planned: 95, completed: 32, todayTarget: 2 },
  { subject: "Medicine", planned: 180, completed: 64, todayTarget: 3 },
  { subject: "Surgery", planned: 150, completed: 52, todayTarget: 2 },
  { subject: "OBG", planned: 110, completed: 41, todayTarget: 2 },
  { subject: "Microbiology", planned: 80, completed: 25, todayTarget: 2 },
];

const QBANK_DATA = [
  { subject: "Pathology", total: 1800, solved: 620, accuracy: 61, topicWeakness: ["Neoplasia", "Inflammation"] },
  { subject: "Pharmacology", total: 1500, solved: 510, accuracy: 54, topicWeakness: ["ANS Drugs", "Antibiotics"] },
  { subject: "Medicine", total: 2400, solved: 950, accuracy: 59, topicWeakness: ["Cardiology", "Endocrinology"] },
  { subject: "Surgery", total: 2100, solved: 700, accuracy: 57, topicWeakness: ["Trauma", "Thyroid"] },
  { subject: "OBG", total: 1600, solved: 580, accuracy: 63, topicWeakness: ["CTG", "Infertility"] },
  { subject: "Microbiology", total: 1200, solved: 350, accuracy: 49, topicWeakness: ["Virology", "Antimicrobials"] },
];

const GT_DATA = [
  { id: 1, score: 102, attempted: 163, accuracy: 56, silly: 14, conceptual: 31 },
  { id: 2, score: 118, attempted: 170, accuracy: 59, silly: 12, conceptual: 28 },
  { id: 3, score: 126, attempted: 174, accuracy: 61, silly: 11, conceptual: 25 },
  { id: 4, score: 133, attempted: 176, accuracy: 63, silly: 9, conceptual: 23 },
  { id: 5, score: 129, attempted: 171, accuracy: 61, silly: 13, conceptual: 24 },
  { id: 6, score: 141, attempted: 178, accuracy: 66, silly: 8, conceptual: 20 },
];

const WEEKLY_PACKS = [
  { week: "Week 1", topics: ["Inflammation", "Autonomics", "CVS Physiology"], mcqs: 180, pyqs: 40, clinical: 8 },
  { week: "Week 2", topics: ["Neoplasia", "ANS Drugs", "Blood"], mcqs: 220, pyqs: 50, clinical: 10 },
  { week: "Week 3", topics: ["Cell Injury", "Antibiotics", "Cardiology"], mcqs: 250, pyqs: 60, clinical: 12 },
  { week: "Week 4", topics: ["Hemodynamics", "CNS Drugs", "Respiratory Medicine"], mcqs: 260, pyqs: 55, clinical: 12 },
];

const REVISION_DUE = [
  { topic: "Inflammation", subject: "Pathology", due: "Today", stage: "R2" },
  { topic: "Autonomics", subject: "Pharmacology", due: "Today", stage: "R3" },
  { topic: "CVS", subject: "Medicine", due: "Today", stage: "R1" },
  { topic: "Anemia", subject: "Medicine", due: "Tomorrow", stage: "R2" },
  { topic: "Shock", subject: "Surgery", due: "Today", stage: "R1" },
];

const ERROR_BOOK_SEED = [
  { id: 1, subject: "Pharmacology", topic: "Beta blockers", type: "Conceptual", nextRevision: "Day 7" },
  { id: 2, subject: "Pathology", topic: "Amyloidosis", type: "Recall", nextRevision: "Day 1" },
  { id: 3, subject: "Medicine", topic: "Heart failure drugs", type: "Clinical", nextRevision: "Day 21" },
];

const CASES = [
  {
    id: 1,
    subject: "Medicine",
    case: "45-year-old male with acute chest pain, sweating, and ST elevation in leads II, III, aVF.",
    asks: ["Likely diagnosis?", "Immediate management?", "Best drug mechanism asked in MCQ?"],
  },
  {
    id: 2,
    subject: "OBG",
    case: "28-year-old primigravida with BP 160/100, pedal edema, and proteinuria at 34 weeks.",
    asks: ["Most likely diagnosis?", "Drug of choice?", "Complication to watch?"],
  },
  {
    id: 3,
    subject: "Surgery",
    case: "60-year-old smoker with painless progressive dysphagia and weight loss.",
    asks: ["Most likely diagnosis?", "Next investigation?", "Common pathology asked?"],
  },
];

function RingStat({ title, value, subtitle, icon: Icon, tone = "sky" }) {
  const tones = {
    sky: "bg-sky-50 text-sky-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
  };
  return (
    <Card className="rounded-3xl border-0 shadow-lg shadow-slate-200/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-900">{value}</h3>
            {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
          </div>
          <div className={`rounded-2xl p-3 ${tones[tone] || tones.sky}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HeatCell({ hours }) {
  const cls =
    hours === 0
      ? "bg-slate-100"
      : hours < 2
      ? "bg-emerald-200"
      : hours < 4
      ? "bg-emerald-400"
      : hours < 6
      ? "bg-emerald-500"
      : "bg-emerald-700";
  return <div className={`h-8 rounded-lg ${cls}`} title={`${hours} hrs`} />;
}

export default function PrepAINEETPGSuperApp() {
  const [topTab, setTopTab] = useState("command");
  const [focusMinutes, setFocusMinutes] = useState(45);
  const [focusRunning, setFocusRunning] = useState(false);
  const [focusSecondsLeft, setFocusSecondsLeft] = useState(45 * 60);
  const [focusTopic, setFocusTopic] = useState("Pathology - Inflammation");
  const [focusSubject, setFocusSubject] = useState("Pathology");
  const [focusMcq, setFocusMcq] = useState(0);
  const [focusNotes, setFocusNotes] = useState("");
  const [dailyLogs, setDailyLogs] = useState([]);
  const [errorBook, setErrorBook] = useState(ERROR_BOOK_SEED);
  const [errorSubject, setErrorSubject] = useState("Pharmacology");
  const [errorTopic, setErrorTopic] = useState("");
  const [errorType, setErrorType] = useState("Conceptual");
  const [plannerMode, setPlannerMode] = useState("balanced");
  const [caseIndex, setCaseIndex] = useState(0);

  useEffect(() => {
    if (!focusRunning) return;
    const timer = setInterval(() => {
      setFocusSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setFocusRunning(false);
          setDailyLogs((logs) => [
            {
              id: Date.now(),
              subject: focusSubject,
              topic: focusTopic,
              minutes: focusMinutes,
              mcqs: focusMcq,
              notes: focusNotes || "No notes added",
              date: new Date().toLocaleDateString("en-IN"),
            },
            ...logs,
          ]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [focusRunning, focusMcq, focusMinutes, focusNotes, focusSubject, focusTopic]);

  const lecturePct = useMemo(() => {
    const done = LECTURE_DATA.reduce((a, b) => a + b.completed, 0);
    const total = LECTURE_DATA.reduce((a, b) => a + b.planned, 0);
    return Math.round((done / total) * 100);
  }, []);

  const qbankPct = useMemo(() => {
    const done = QBANK_DATA.reduce((a, b) => a + b.solved, 0);
    const total = QBANK_DATA.reduce((a, b) => a + b.total, 0);
    return Math.round((done / total) * 100);
  }, []);

  const avgAccuracy = useMemo(() => Math.round(QBANK_DATA.reduce((a, b) => a + b.accuracy, 0) / QBANK_DATA.length), []);
  const latestGT = GT_DATA[GT_DATA.length - 1];
  const weakSubjects = useMemo(() => [...QBANK_DATA].sort((a, b) => a.accuracy - b.accuracy).slice(0, 5), []);
  const readiness = Math.round(lecturePct * 0.25 + qbankPct * 0.25 + avgAccuracy * 0.2 + latestGT.accuracy * 0.3);
  const projectedRank = useMemo(() => {
    const score = latestGT.score;
    if (score >= 155) return "AIR 500–1200";
    if (score >= 145) return "AIR 1200–2500";
    if (score >= 135) return "AIR 2500–5000";
    return "AIR 5000+";
  }, [latestGT.score]);

  const aiDailyPlan = useMemo(() => {
    const weakest = weakSubjects[0];
    const strongest = [...QBANK_DATA].sort((a, b) => b.accuracy - a.accuracy)[0];
    if (plannerMode === "repair") {
      return [
        `Morning: ${weakest.subject} lecture + revision`,
        `Afternoon: ${weakest.subject} 120 MCQs`,
        `Evening: Error Book review for ${weakest.topicWeakness[0]}`,
        `Night: Quick GT review and one clinical case`,
      ];
    }
    if (plannerMode === "sprint") {
      return [
        `Morning: ${strongest.subject} high-yield rapid revision`,
        `Afternoon: Mixed 200 MCQs block`,
        `Evening: One mini GT + analysis`,
        `Night: Revision engine due topics`,
      ];
    }
    return [
      `Morning: Pathology 2 lectures + Pharmacology 1 lecture`,
      `Afternoon: 150 MCQs mixed block`,
      `Evening: Revision due (${REVISION_DUE.filter((x) => x.due === "Today").length} topics)`,
      `Night: Error Book + one clinical case`,
    ];
  }, [plannerMode, weakSubjects]);

  const heatmap = useMemo(() => {
    const pattern = [0, 2, 3, 5, 1, 4, 6, 0, 2, 3, 4, 5, 0, 1, 2, 4, 6, 3, 2, 0, 5, 4, 3, 1, 2, 6, 5, 4];
    return pattern;
  }, []);

  const completionProjection = useMemo(() => {
    const lectureRemaining = 100 - lecturePct;
    const qbankRemaining = 100 - qbankPct;
    return {
      lecturesFinishDays: Math.max(18, lectureRemaining * 2),
      qbankFinishDays: Math.max(24, qbankRemaining * 1.7),
      beforeExamReadiness: Math.min(98, readiness + 12),
    };
  }, [lecturePct, qbankPct, readiness]);

  const currentCase = CASES[caseIndex];
  const mm = String(Math.floor(focusSecondsLeft / 60)).padStart(2, "0");
  const ss = String(focusSecondsLeft % 60).padStart(2, "0");

  const startFocus = () => {
    setFocusSecondsLeft(focusMinutes * 60);
    setFocusRunning(true);
  };

  const addError = () => {
    if (!errorTopic.trim()) return;
    setErrorBook((prev) => [
      {
        id: Date.now(),
        subject: errorSubject,
        topic: errorTopic,
        type: errorType,
        nextRevision: "Day 1",
      },
      ...prev,
    ]);
    setErrorTopic("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 text-slate-900">
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-600 p-2 text-white">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">PrepAI NEET PG</h1>
                <p className="text-sm text-slate-500">Super App for NEET PG / INI-CET preparation</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="rounded-full bg-sky-100 px-4 py-2 text-sky-700 hover:bg-sky-100">Super App Preview</Badge>
              <Badge className="rounded-full bg-emerald-100 px-4 py-2 text-emerald-700 hover:bg-emerald-100">AI Ready</Badge>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-2 md:grid-cols-5">
            {[
              ["command", "Command Centre"],
              ["focus", "Focus Mode"],
              ["study", "Lecture + QBank"],
              ["tests", "GT + Rank"],
              ["ai", "AI Brain"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTopTab(key)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  topTab === key ? "bg-white text-sky-700 shadow" : "text-slate-600 hover:bg-white/70"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {topTab === "command" && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <RingStat title="Lecture Completion" value={`${lecturePct}%`} subtitle="Overall lecture progress" icon={BookOpen} tone="sky" />
              <RingStat title="QBank Completion" value={`${qbankPct}%`} subtitle="MCQ coverage till now" icon={Target} tone="emerald" />
              <RingStat title="Readiness Score" value={`${readiness}%`} subtitle="Projected readiness" icon={Brain} tone="amber" />
              <RingStat title="Latest GT Score" value={String(latestGT.score)} subtitle="Grand test momentum" icon={BarChart3} tone="rose" />
              <RingStat title="Projected Rank" value={projectedRank} subtitle="Based on current GT trend" icon={TrendingUp} tone="sky" />
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
              <Card className="rounded-3xl border-0 shadow-lg lg:col-span-7">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-sky-600" /> Command Centre</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-sky-50 p-4">
                      <p className="text-sm font-semibold text-sky-700">Today’s Study Mission</p>
                      <ul className="mt-3 space-y-2 text-sm text-slate-700">
                        <li>• Pathology lectures: 2</li>
                        <li>• Pharmacology lectures: 1</li>
                        <li>• QBank target: 150 MCQs</li>
                        <li>• Revision due: {REVISION_DUE.filter((x) => x.due === "Today").length} topics</li>
                        <li>• One clinical case trainer block</li>
                      </ul>
                    </div>
                    <div className="rounded-2xl bg-emerald-50 p-4">
                      <p className="text-sm font-semibold text-emerald-700">AI Daily Planner</p>
                      <ul className="mt-3 space-y-2 text-sm text-slate-700">
                        {aiDailyPlan.map((item) => <li key={item}>• {item}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-700">Revision Engine</p>
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Auto due</Badge>
                      </div>
                      <div className="mt-3 space-y-2">
                        {REVISION_DUE.filter((x) => x.due === "Today").map((item) => (
                          <div key={item.topic} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                            <span>{item.subject} — {item.topic}</span>
                            <Badge variant="secondary">{item.stage}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-700">Weekly Question Pack</p>
                        <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100">Generated</Badge>
                      </div>
                      <div className="mt-3 text-sm text-slate-700">
                        <p className="font-medium">{WEEKLY_PACKS[2].week}</p>
                        <p className="mt-2">Topics: {WEEKLY_PACKS[2].topics.join(", ")}</p>
                        <p className="mt-2">{WEEKLY_PACKS[2].mcqs} MCQs + {WEEKLY_PACKS[2].pyqs} PYQs + {WEEKLY_PACKS[2].clinical} clinical cases</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 shadow-lg lg:col-span-5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Flame className="h-5 w-5 text-sky-600" /> Heatmap Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {heatmap.map((hrs, idx) => <HeatCell key={idx} hours={hrs} />)}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {topTab === "focus" && (
          <div className="grid gap-6 lg:grid-cols-12">
            <Card className="rounded-3xl border-0 shadow-lg lg:col-span-7">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock3 className="h-5 w-5 text-sky-600" /> Focus Mode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input value={focusTopic} onChange={(e) => setFocusTopic(e.target.value)} placeholder="Topic" />
                  <Select value={focusSubject} onValueChange={setFocusSubject}>
                    <SelectTrigger className="rounded-2xl"><SelectValue placeholder="Subject" /></SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((subject) => <SelectItem key={subject} value={subject}>{subject}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Input type="number" value={focusMinutes} onChange={(e) => setFocusMinutes(Number(e.target.value || 45))} placeholder="Minutes" />
                  <div className="rounded-2xl bg-slate-900 px-4 py-3 text-center text-4xl font-black text-white">{mm}:{ss}</div>
                  <div className="flex gap-2">
                    <Button onClick={startFocus} className="flex-1 rounded-2xl bg-sky-600 hover:bg-sky-700">Start</Button>
                    <Button variant="outline" onClick={() => setFocusRunning(false)} className="rounded-2xl">Pause</Button>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">MCQ Counter</p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl" onClick={() => setFocusMcq((x) => Math.max(0, x - 1))}>-</Button>
                    <div className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-center text-xl font-bold">{focusMcq}</div>
                    <Button variant="outline" className="rounded-xl" onClick={() => setFocusMcq((x) => x + 1)}>+</Button>
                  </div>
                </div>
                <Textarea value={focusNotes} onChange={(e) => setFocusNotes(e.target.value)} placeholder="Quick notes for this session" className="min-h-[130px] rounded-2xl" />
                <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">
                  When the timer completes, PrepAI will automatically log subject, topic, minutes, MCQs, and notes.
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-lg lg:col-span-5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><NotebookPen className="h-5 w-5 text-sky-600" /> Auto Session Logs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dailyLogs.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">No focus sessions logged yet.</div>
                ) : (
                  dailyLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{log.subject}</p>
                          <p className="text-sm text-slate-500">{log.topic}</p>
                        </div>
                        <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100">{log.minutes} min</Badge>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{log.mcqs} MCQs • {log.date}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {topTab === "study" && (
          <Tabs defaultValue="lectures" className="space-y-5">
            <TabsList className="grid w-full grid-cols-4 rounded-2xl bg-slate-100 p-1">
              <TabsTrigger value="lectures">Lecture Tracker</TabsTrigger>
              <TabsTrigger value="qbank">QBank Intelligence</TabsTrigger>
              <TabsTrigger value="errors">Error Book</TabsTrigger>
              <TabsTrigger value="revision">Revision Engine</TabsTrigger>
            </TabsList>

            <TabsContent value="lectures">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {LECTURE_DATA.map((item) => {
                  const pct = Math.round((item.completed / item.planned) * 100);
                  return (
                    <Card key={item.subject} className="rounded-3xl border-0 shadow-lg">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold">{item.subject}</h3>
                          <Badge>{pct}%</Badge>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">{item.completed}/{item.planned} lectures completed</p>
                        <Progress className="mt-4 h-3" value={pct} />
                        <p className="mt-3 text-xs text-slate-500">Today target: {item.todayTarget} lectures</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="qbank">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {QBANK_DATA.map((item) => {
                  const pct = Math.round((item.solved / item.total) * 100);
                  return (
                    <Card key={item.subject} className="rounded-3xl border-0 shadow-lg">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold">{item.subject}</h3>
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Acc {item.accuracy}%</Badge>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">{item.solved}/{item.total} solved</p>
                        <Progress className="mt-4 h-3" value={pct} />
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.topicWeakness.map((x) => <Badge key={x} variant="secondary">{x}</Badge>)}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="errors">
              <div className="grid gap-6 lg:grid-cols-12">
                <Card className="rounded-3xl border-0 shadow-lg lg:col-span-4">
                  <CardHeader><CardTitle>Add to Error Book</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <Select value={errorSubject} onValueChange={setErrorSubject}>
                      <SelectTrigger className="rounded-2xl"><SelectValue placeholder="Subject" /></SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((subject) => <SelectItem key={subject} value={subject}>{subject}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input value={errorTopic} onChange={(e) => setErrorTopic(e.target.value)} placeholder="Wrong topic / concept" />
                    <Select value={errorType} onValueChange={setErrorType}>
                      <SelectTrigger className="rounded-2xl"><SelectValue placeholder="Error type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Conceptual">Conceptual</SelectItem>
                        <SelectItem value="Recall">Recall</SelectItem>
                        <SelectItem value="Clinical">Clinical</SelectItem>
                        <SelectItem value="Silly">Silly</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={addError} className="w-full rounded-2xl bg-sky-600 hover:bg-sky-700">Add Error</Button>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl border-0 shadow-lg lg:col-span-8">
                  <CardHeader><CardTitle>Smart Error Book</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {errorBook.map((item) => (
                      <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-semibold">{item.subject} — {item.topic}</p>
                            <p className="text-sm text-slate-500">Type: {item.type}</p>
                          </div>
                          <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">Next revision: {item.nextRevision}</Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="revision">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {REVISION_DUE.map((item) => (
                  <Card key={`${item.subject}-${item.topic}`} className="rounded-3xl border-0 shadow-lg">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold">{item.topic}</h3>
                        <Badge>{item.stage}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">{item.subject}</p>
                      <p className="mt-4 text-sm text-slate-700">Due: {item.due}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {topTab === "tests" && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-12">
              <Card className="rounded-3xl border-0 shadow-lg lg:col-span-7">
                <CardHeader><CardTitle>Grand Test Analyzer</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {GT_DATA.map((gt) => (
                    <div key={gt.id} className="rounded-2xl bg-slate-50 p-4">
                      <div className="grid gap-3 md:grid-cols-5">
                        <div><p className="text-xs text-slate-500">GT</p><p className="font-bold">#{gt.id}</p></div>
                        <div><p className="text-xs text-slate-500">Score</p><p className="font-bold">{gt.score}</p></div>
                        <div><p className="text-xs text-slate-500">Attempted</p><p className="font-bold">{gt.attempted}</p></div>
                        <div><p className="text-xs text-slate-500">Accuracy</p><p className="font-bold">{gt.accuracy}%</p></div>
                        <div><p className="text-xs text-slate-500">Errors</p><p className="font-bold">S {gt.silly} • C {gt.conceptual}</p></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="rounded-3xl border-0 shadow-lg lg:col-span-5">
                <CardHeader><CardTitle>Rank Predictor</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl bg-sky-50 p-5">
                    <p className="text-sm font-semibold text-sky-700">Current Projection</p>
                    <p className="mt-3 text-3xl font-black">{projectedRank}</p>
                    <p className="mt-2 text-sm text-slate-600">Derived from latest GT score, accuracy, and trend momentum.</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-5">
                    <p className="text-sm font-semibold text-emerald-700">How to improve</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      <li>• Raise accuracy above 68%</li>
                      <li>• Reduce silly mistakes below 5</li>
                      <li>• Increase mixed GT review blocks</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader><CardTitle>Clinical Case Trainer</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500">Subject</p>
                      <p className="font-bold">{currentCase.subject}</p>
                    </div>
                    <Button variant="outline" className="rounded-2xl" onClick={() => setCaseIndex((i) => (i + 1) % CASES.length)}>Next Case</Button>
                  </div>
                  <p className="mt-4 text-slate-800">{currentCase.case}</p>
                  <div className="mt-4 space-y-2">
                    {currentCase.asks.map((ask) => (
                      <div key={ask} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">{ask}</div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {topTab === "ai" && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-12">
              <Card className="rounded-3xl border-0 shadow-lg lg:col-span-4">
                <CardHeader><CardTitle>AI Daily Planner Mode</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Select value={plannerMode} onValueChange={setPlannerMode}>
                    <SelectTrigger className="rounded-2xl"><SelectValue placeholder="Mode" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="repair">Weakness Repair</SelectItem>
                      <SelectItem value="sprint">Sprint Mode</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="space-y-2">
                    {aiDailyPlan.map((item) => (
                      <div key={item} className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">{item}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 shadow-lg lg:col-span-4">
                <CardHeader><CardTitle>Weak Subject Radar</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {weakSubjects.map((item, index) => (
                    <div key={item.subject}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>{index + 1}. {item.subject}</span>
                        <span>{item.accuracy}%</span>
                      </div>
                      <Progress value={item.accuracy} className="h-3" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 shadow-lg lg:col-span-4">
                <CardHeader><CardTitle>Completion Predictor</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Lecture finish</p>
                    <p className="mt-1 text-2xl font-black">{completionProjection.lecturesFinishDays} days</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">QBank finish</p>
                    <p className="mt-1 text-2xl font-black">{completionProjection.qbankFinishDays} days</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-sm text-emerald-700">Projected readiness before exam</p>
                    <p className="mt-1 text-2xl font-black">{completionProjection.beforeExamReadiness}%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader><CardTitle>AI Brain Logic Flow</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    ["Inputs", "Lectures, QBank accuracy, GT scores, revision due, error book"],
                    ["Priority Predictor", "Finds subjects and topics requiring immediate repair"],
                    ["Question Pack Generator", "Creates weekly MCQ, PYQ, and clinical packs"],
                    ["Rank Predictor", "Maps GT momentum into likely rank band"],
                    ["Revision Engine", "Schedules Day 1, 7, 21, 45 revisions"],
                    ["Clinical Trainer", "Adds applied learning to theory-heavy prep"],
                    ["Heatmap Analytics", "Measures daily momentum and intensity"],
                    ["Adaptive Daily Plan", "Switches plan mode to balanced, repair, or sprint"],
                  ].map(([title, desc]) => (
                    <div key={title} className="rounded-2xl bg-slate-50 p-4">
                      <p className="font-semibold text-slate-900">{title}</p>
                      <p className="mt-2 text-sm text-slate-600">{desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
