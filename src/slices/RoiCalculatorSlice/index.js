"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import * as prismic from "@prismicio/client";
import { PrismicText } from "@prismicio/react";
import { AnimatePresence, motion } from "motion/react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import CountUp from "@/components/reactbits/CountUp";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { NeuralMark } from "@/components/ui/NeuralMark";
import { axisProps, chartColors, gridProps } from "@/components/ui/chartTheme";
import { cn } from "@/components/ui/cn";

/**
 * @typedef {import("@prismicio/client").Content.RoiCalculatorSliceSlice} RoiCalculatorSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<RoiCalculatorSliceSlice>} RoiCalculatorSliceProps
 * @type {import("react").FC<RoiCalculatorSliceProps>}
 */

const FIXED_HIRE_COST = 5000;
const FIXED_REDUCTION_PCT = 35;
const FIXED_ANNUAL_HOURS = 1680;

// All labels in both supported languages.
// Croatian is the default; English is used when lang === "en".
const LABELS = {
  hr: {
    inputPanelTitle: "Vaši podaci",
    labelAvgSalary: "Prosječna godišnja bruto plaća (€)",
    labelNewHires: "Broj novih zaposlenja",
    labelTimeToHire: "Rok zapošljavanja (dani)",
    labelAttritionRate: "Stopa fluktuacije (%)",
    labelApplicationsPerRole: "Broj prijava po poziciji",
    labelScreeningHours: "Sati screeninga po prijavi",
    ctaLabel: "Izračunaj",
    roiCardLabel: "Povrat investicije (ROI)",
    roiCardCaption: "uz korištenje Selekcija platforme",
    moneySavedLabel: "Novčana ušteda",
    timeSavedLabel: "Ušteda vremena",
    attritionSavedLabel: "Ušteda fluktuacije",
    chartHeading: "Usporedba ušteda (€)",
    chartMoneyLabel: "Novčana ušteda",
    chartAttritionLabel: "Ušteda fluktuacije",
    emptyStateTitle: "Unesite podatke i kliknite \"Izračunaj\"",
    emptyStateDescription: "Prikazat ćemo personalizirani prikaz vaših potencijalnih ušteda.",
    disclaimer: "Procjene se temelje na pretpostavci da se platforma Selekcija koristi od početka faze selekcije kandidata. Stvarni rezultati mogu odstupati ovisno o kontekstu i načinu korištenja.",
  },
  en: {
    inputPanelTitle: "Your data",
    labelAvgSalary: "Average annual gross salary (€)",
    labelNewHires: "Number of new hires",
    labelTimeToHire: "Time to hire (days)",
    labelAttritionRate: "Attrition rate (%)",
    labelApplicationsPerRole: "Applications per position",
    labelScreeningHours: "Screening hours per application",
    ctaLabel: "Calculate",
    roiCardLabel: "Return on Investment (ROI)",
    roiCardCaption: "using the Selekcija platform",
    moneySavedLabel: "Monetary savings",
    timeSavedLabel: "Time saved",
    attritionSavedLabel: "Attrition savings",
    chartHeading: "Savings comparison (€)",
    chartMoneyLabel: "Monetary savings",
    chartAttritionLabel: "Attrition savings",
    emptyStateTitle: "Enter your data and click \"Calculate\"",
    emptyStateDescription: "We will show a personalised view of your potential savings.",
    disclaimer: "Estimates are based on the assumption that the Selekcija platform is used from the start of the candidate screening phase. Actual results may vary depending on context and usage.",
  },
};

function fmt(value) {
  return new Intl.NumberFormat("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

// Controlled numeric input. Uses a local string draft so:
// - the user can fully clear the field without seeing a stray "0"
// - typing "5" never produces "05"
// - an empty/invalid blurred field resets back to defaultValue
function InputField({ id, label, value, onChange, defaultValue, prefix, suffix }) {
  const [draft, setDraft] = useState(() => String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setDraft(String(value));
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleChange(e) {
    const raw = e.target.value;
    if (raw === "" || /^-?\d*\.?\d*$/.test(raw)) {
      setDraft(raw);
      const n = parseFloat(raw);
      if (!isNaN(n)) onChange(n);
    }
  }

  function handleBlur() {
    setFocused(false);
    const n = parseFloat(draft);
    if (draft === "" || isNaN(n) || n <= 0) {
      const reset = defaultValue ?? 0;
      setDraft(String(reset));
      onChange(reset);
    } else {
      setDraft(String(n));
      onChange(n);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[13px] font-medium text-ink/75">
        {label}
      </label>
      <div className="flex items-center overflow-hidden rounded-xl border border-line-strong bg-white/[0.03] transition duration-200 focus-within:border-primary focus-within:bg-white/[0.05] focus-within:ring-4 focus-within:ring-primary/15 hover:border-white/25">
        {prefix && (
          <span className="select-none border-r border-line px-3.5 py-3 text-[13px] font-medium text-muted">{prefix}</span>
        )}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={draft}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          className="min-w-0 flex-1 bg-transparent px-3.5 py-3 font-heading text-[16px] font-medium text-ink outline-none"
        />
        {suffix && (
          <span className="select-none border-l border-line px-3.5 py-3 text-[13px] font-medium text-muted">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function ResultCard({ label, value, suffix, highlight = false }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl border px-5 py-5",
        highlight ? "border-mint/30 bg-mint/[0.08]" : "border-line bg-white/[0.03]",
      )}
    >
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</span>
      <span className={cn("font-heading text-[24px] font-bold leading-tight tracking-tight", highlight ? "text-mint" : "text-ink")}>
        <CountUp to={value} duration={1.2} separator="." />
        <span className="ml-1 text-[15px] font-medium text-body">{suffix}</span>
      </span>
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-line-strong bg-surface-2/95 px-3.5 py-2.5 text-[13px] shadow-2xl backdrop-blur">
      <p className="mb-0.5 font-semibold text-ink">{label}</p>
      <p className="text-mint">{fmt(payload[0]?.value ?? 0)} EUR</p>
    </div>
  );
}

function calculate({ avgSalary, newHires, reductionPct, timeToHire, annualHours, attritionRate, applicationsPerRole, screeningHoursPerApplication }) {
  const reduction = reductionPct / 100;
  const hourlyRate = annualHours > 0 ? avgSalary / annualHours : 0;

  const totalMonetaryBenefit = newHires * avgSalary;
  const totalHiringCost = avgSalary + FIXED_HIRE_COST;
  const roi = totalHiringCost > 0 ? ((totalMonetaryBenefit - totalHiringCost) / totalHiringCost) * 100 : 0;

  const daysSavedPerHire = timeToHire * reduction;
  const hiringTimeHoursPerHire = daysSavedPerHire * 8;
  const hiringTimeValuePerHire = hiringTimeHoursPerHire * hourlyRate;

  const screeningHoursPerHire = applicationsPerRole * screeningHoursPerApplication * reduction;
  const screeningValuePerHire = screeningHoursPerHire * hourlyRate;

  const moneySaved = (hiringTimeValuePerHire + screeningValuePerHire) * newHires;
  const timeSavedHours = (hiringTimeHoursPerHire + screeningHoursPerHire) * newHires;
  const fluctuationSaved = avgSalary * 1.75 * newHires * (attritionRate / 100) * reduction;

  return {
    roi: Math.round(roi),
    moneySaved: Math.round(moneySaved),
    timeSavedHours: Math.round(timeSavedHours * 10) / 10,
    fluctuationSaved: Math.round(fluctuationSaved),
    chartData: [
      { name: "money", value: Math.round(moneySaved) },
      { name: "attrition", value: Math.round(fluctuationSaved) },
    ],
  };
}

const RoiCalculatorSlice = ({ slice }) => {
  const p = slice.primary;
  const params = useParams();
  const lang = params?.lang === "en" ? "en" : "hr";
  const L = LABELS[lang];

  const [avgSalary, setAvgSalary] = useState(30000);
  const [newHires, setNewHires] = useState(2);
  const [timeToHire, setTimeToHire] = useState(30);
  const [attritionRate, setAttritionRate] = useState(20);
  const [applicationsPerRole, setApplicationsPerRole] = useState(10);
  const [screeningHoursPerApplication, setScreeningHoursPerApplication] = useState(5);
  const [results, setResults] = useState(null);
  const [runId, setRunId] = useState(0);

  function handleCalculate() {
    setResults(
      calculate({
        avgSalary,
        newHires,
        reductionPct: FIXED_REDUCTION_PCT,
        timeToHire,
        annualHours: FIXED_ANNUAL_HOURS,
        attritionRate,
        applicationsPerRole,
        screeningHoursPerApplication,
      }),
    );
    setRunId((n) => n + 1);
  }

  const chartData = results
    ? results.chartData.map((item) => ({
        ...item,
        name: item.name === "money" ? L.chartMoneyLabel : L.chartAttritionLabel,
      }))
    : [];

  return (
    <Section variant="glow" data-slice-type={slice.slice_type} data-slice-variation={slice.variation} className="scroll-mt-24">
      <SectionHeader
        tagline={prismic.isFilled.richText(p.section_label) ? prismic.asText(p.section_label) : undefined}
        heading={p.heading}
        description={p.description}
        autoMarker={1}
        className="mb-14 md:mb-16"
      />

      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-6">
        <Reveal className="h-full">
          <GlassCard spotlight={false} className="h-full" innerClassName="flex flex-col p-6 md:p-8">
            <div className="mb-7 flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <NeuralMark className="w-4 text-primary" />
              </span>
              <h3 className="font-heading text-[18px] font-semibold text-ink">{L.inputPanelTitle}</h3>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <InputField id="roi-salary" label={L.labelAvgSalary} value={avgSalary} onChange={setAvgSalary} defaultValue={30000} prefix="EUR" />
              </div>
              <InputField id="roi-hires" label={L.labelNewHires} value={newHires} onChange={setNewHires} defaultValue={2} />
              <InputField id="roi-time" label={L.labelTimeToHire} value={timeToHire} onChange={setTimeToHire} defaultValue={30} suffix={lang === "en" ? "days" : "dana"} />
              <InputField id="roi-attrition" label={L.labelAttritionRate} value={attritionRate} onChange={setAttritionRate} defaultValue={20} suffix="%" />
              <InputField id="roi-applications" label={L.labelApplicationsPerRole} value={applicationsPerRole} onChange={setApplicationsPerRole} defaultValue={10} />
              <div className="sm:col-span-2">
                <InputField id="roi-screening" label={L.labelScreeningHours} value={screeningHoursPerApplication} onChange={setScreeningHoursPerApplication} defaultValue={5} suffix="h" />
              </div>
            </div>
            <Button onClick={handleCalculate} size="lg" className="mt-8 w-full">
              {L.ctaLabel}
            </Button>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.12} className="h-full">
          <div className="relative h-full min-h-[420px] overflow-hidden rounded-2xl border border-line bg-surface-2/60 backdrop-blur-sm">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_100%_0%,rgba(69,217,150,0.12),transparent_60%),radial-gradient(ellipse_60%_60%_at_0%_100%,rgba(34,124,255,0.16),transparent_60%)]" />
            <AnimatePresence mode="wait">
              {results ? (
                <motion.div
                  key={`result-${runId}`}
                  initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex h-full flex-col gap-5 p-6 md:p-8"
                >
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{L.roiCardLabel}</p>
                      <p className="font-heading text-[64px] font-bold leading-none tracking-[-0.04em] text-ink md:text-[84px]">
                        <CountUp to={results.roi} duration={1.4} separator="." />
                        <span className="text-primary">%</span>
                      </p>
                    </div>
                    <p className="max-w-[220px] pb-2 text-[14px] text-body">{L.roiCardCaption}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <ResultCard label={L.moneySavedLabel} value={results.moneySaved} suffix="EUR" highlight />
                    <ResultCard label={L.timeSavedLabel} value={results.timeSavedHours} suffix="h" />
                    <ResultCard label={L.attritionSavedLabel} value={results.fluctuationSaved} suffix="EUR" />
                  </div>

                  <div className="mt-auto rounded-2xl border border-line bg-surface/50 p-5">
                    <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{L.chartHeading}</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }} barSize={64}>
                        <defs>
                          <linearGradient id="roi-bar-mint" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={chartColors.mint} stopOpacity={1} />
                            <stop offset="100%" stopColor={chartColors.mint} stopOpacity={0.25} />
                          </linearGradient>
                          <linearGradient id="roi-bar-blue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={chartColors.primary} stopOpacity={1} />
                            <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0.25} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="name" {...axisProps} axisLine={false} />
                        <YAxis {...axisProps} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                        <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                        <Bar dataKey="value" radius={[10, 10, 2, 2]} animationDuration={900}>
                          {chartData.map((_, i) => (
                            <Cell key={i} fill={i === 0 ? "url(#roi-bar-mint)" : "url(#roi-bar-blue)"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, filter: "blur(6px)" }}
                  className="relative flex h-full min-h-[420px] flex-col items-center justify-center gap-4 px-8 text-center"
                >
                  <div className="relative flex size-20 items-center justify-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-primary/15 [animation-duration:2.4s]" />
                    <span className="absolute inset-2 rounded-full border border-primary/30 bg-primary/10" />
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="relative size-8 text-primary">
                      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="font-heading text-[18px] font-semibold text-ink">{L.emptyStateTitle}</p>
                  <p className="max-w-[320px] text-[14px] text-body">{L.emptyStateDescription}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>

      <p className="mx-auto mt-8 max-w-[820px] text-center text-[12px] leading-relaxed text-muted">
        {prismic.isFilled.richText(p.disclaimer) ? <PrismicText field={p.disclaimer} /> : L.disclaimer}
      </p>
    </Section>
  );
};

export default RoiCalculatorSlice;
