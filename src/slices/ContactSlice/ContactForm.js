"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { FIELD, FormStatus, Input, Label, Select, Textarea } from "@/components/ui/Field";
import { cn } from "@/components/ui/cn";

const COUNTRY_CODES = [
  { code: "+385", label: "🇭🇷 +385", country: "HR" },
  { code: "+386", label: "🇸🇮 +386", country: "SI" },
  { code: "+387", label: "🇧🇦 +387", country: "BA" },
  { code: "+389", label: "🇲🇰 +389", country: "MK" },
  { code: "+381", label: "🇷🇸 +381", country: "RS" },
  { code: "+382", label: "🇲🇪 +382", country: "ME" },
  { code: "+1", label: "🇺🇸 +1", country: "US" },
  { code: "+44", label: "🇬🇧 +44", country: "GB" },
  { code: "+49", label: "🇩🇪 +49", country: "DE" },
  { code: "+33", label: "🇫🇷 +33", country: "FR" },
  { code: "+39", label: "🇮🇹 +39", country: "IT" },
  { code: "+34", label: "🇪🇸 +34", country: "ES" },
  { code: "+41", label: "🇨🇭 +41", country: "CH" },
  { code: "+43", label: "🇦🇹 +43", country: "AT" },
  { code: "+31", label: "🇳🇱 +31", country: "NL" },
  { code: "+32", label: "🇧🇪 +32", country: "BE" },
  { code: "+45", label: "🇩🇰 +45", country: "DK" },
  { code: "+46", label: "🇸🇪 +46", country: "SE" },
  { code: "+47", label: "🇳🇴 +47", country: "NO" },
  { code: "+48", label: "🇵🇱 +48", country: "PL" },
  { code: "+420", label: "🇨🇿 +420", country: "CZ" },
  { code: "+421", label: "🇸🇰 +421", country: "SK" },
  { code: "+36", label: "🇭🇺 +36", country: "HU" },
  { code: "+40", label: "🇷🇴 +40", country: "RO" },
  { code: "+359", label: "🇧🇬 +359", country: "BG" },
  { code: "+30", label: "🇬🇷 +30", country: "GR" },
  { code: "+90", label: "🇹🇷 +90", country: "TR" },
  { code: "+7", label: "🇷🇺 +7", country: "RU" },
  { code: "+380", label: "🇺🇦 +380", country: "UA" },
  { code: "+972", label: "🇮🇱 +972", country: "IL" },
  { code: "+971", label: "🇦🇪 +971", country: "AE" },
  { code: "+91", label: "🇮🇳 +91", country: "IN" },
  { code: "+86", label: "🇨🇳 +86", country: "CN" },
  { code: "+81", label: "🇯🇵 +81", country: "JP" },
  { code: "+82", label: "🇰🇷 +82", country: "KR" },
  { code: "+61", label: "🇦🇺 +61", country: "AU" },
  { code: "+64", label: "🇳🇿 +64", country: "NZ" },
  { code: "+55", label: "🇧🇷 +55", country: "BR" },
  { code: "+52", label: "🇲🇽 +52", country: "MX" },
  { code: "+27", label: "🇿🇦 +27", country: "ZA" },
  { code: "+20", label: "🇪🇬 +20", country: "EG" },
];

const INTEREST_OPTIONS = {
  hr: [
    { value: "", label: "Odaberite opciju" },
    { value: "hiring", label: "Zapošljavanje talenata" },
    { value: "outsourcing", label: "Outsourcing / Remote tim" },
    { value: "consulting", label: "HR konzalting" },
    { value: "other", label: "Ostalo" },
  ],
  en: [
    { value: "", label: "Select an Option" },
    { value: "hiring", label: "Hiring Talent" },
    { value: "outsourcing", label: "Outsourcing / Remote Team" },
    { value: "consulting", label: "HR Consulting" },
    { value: "other", label: "Other" },
  ],
};

const EXTRA_ROLE_OPTIONS = {
  hr: [
    { value: "psiholog", label: "Psiholog" },
    { value: "ostalo", label: "Ostalo" },
  ],
  en: [
    { value: "psychologist", label: "Psychologist" },
    { value: "other", label: "Other" },
  ],
};

const LABELS = {
  hr: {
    firstName: "Ime",
    lastName: "Prezime",
    email: "E-mail adresa",
    company: "Tvrtka",
    phone: "Telefon",
    role: "Vaša pozicija u tvrtki:",
    interest: "Zainteresiran/a sam za",
    message: "Poruka",
    sending: "Slanje...",
    success: "Poruka je uspješno poslana. Javit ćemo se uskoro!",
    error: "Došlo je do pogreške. Pokušajte ponovo.",
  },
  en: {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    company: "Company",
    phone: "Phone",
    role: "Your role in the company:",
    interest: "I'm Interested In",
    message: "Message",
    sending: "Sending...",
    success: "Message sent successfully. We'll get back to you soon!",
    error: "Something went wrong. Please try again.",
  },
};

export function ContactForm({ submitLabel, lang = "hr", roleOptions = [], roleLabel }) {
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [countryCode, setCountryCode] = useState("+385");
  const options = INTEREST_OPTIONS[lang] ?? INTEREST_OPTIONS.en;
  const labels = LABELS[lang] ?? LABELS.en;

  const cmsRoleOpts = (roleOptions ?? [])
    .filter((r) => r.role_label && r.role_value)
    .map((r) => ({ value: r.role_value, label: r.role_label }));
  const extraRoles = (EXTRA_ROLE_OPTIONS[lang] ?? EXTRA_ROLE_OPTIONS.en).filter(
    (extra) =>
      !cmsRoleOpts.some(
        (opt) =>
          opt.value === extra.value ||
          opt.label.toLowerCase() === extra.label.toLowerCase(),
      ),
  );
  const roleOpts = [
    { value: "", label: lang === "hr" ? "Odaberite opciju" : "Select an option" },
    ...cmsRoleOpts,
    ...extraRoles,
  ];

  const displayRoleLabel = roleLabel || labels.role;

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const formData = new FormData(e.target);
      const phoneNumber = formData.get("phoneNumber") || "";
      const fullPhone = phoneNumber ? `${countryCode} ${phoneNumber}`.trim() : "";
      formData.set("phone", fullPhone);

      const roleValue = formData.get("role");
      const selectedRole = roleOpts.find((o) => o.value === roleValue);
      if (selectedRole?.label) {
        formData.set("role", selectedRole.label);
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      setStatus(json.success ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <motion.div key="success" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <FormStatus status="success">{labels.success}</FormStatus>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={handleSubmit} exit={{ opacity: 0, y: -12 }} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="cf-first" required>{labels.firstName}</Label>
            <Input id="cf-first" name="firstName" type="text" required placeholder={lang === "hr" ? "Ana" : "John"} />
          </div>
          <div>
            <Label htmlFor="cf-last" required>{labels.lastName}</Label>
            <Input id="cf-last" name="lastName" type="text" required placeholder={lang === "hr" ? "Horvat" : "Doe"} />
          </div>
          <div>
            <Label htmlFor="cf-email" required>{labels.email}</Label>
            <Input id="cf-email" name="email" type="email" required placeholder={lang === "hr" ? "ana@primjer.hr" : "john@example.com"} />
          </div>
          <div>
            <Label htmlFor="cf-company" required>{labels.company}</Label>
            <Input id="cf-company" name="company" type="text" required placeholder={lang === "hr" ? "Tvrtka d.o.o." : "Company Inc."} />
          </div>
          <div className="min-w-0 sm:col-span-2">
            <Label htmlFor="cf-phone" required>{labels.phone}</Label>
            <div className="grid grid-cols-[7.75rem_minmax(0,1fr)] gap-2 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <div className="relative min-w-0">
                <select
                  name="countryCode"
                  aria-label={lang === "hr" ? "Pozivni broj" : "Country code"}
                  className={cn(
                    FIELD,
                    "cursor-pointer appearance-none px-3 pr-11 text-[14px] sm:text-[15px] [&>option]:bg-surface-2",
                  )}
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted"
                >
                  <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <Input
                id="cf-phone"
                name="phoneNumber"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                required
                placeholder="99 123 4567"
                className="min-w-0"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="cf-role">{displayRoleLabel}</Label>
            <Select id="cf-role" name="role">
              {roleOpts.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="cf-interest" required>{labels.interest}</Label>
            <Select id="cf-interest" name="interest" required>
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="cf-message" required>{labels.message}</Label>
            <Textarea
              id="cf-message"
              name="message"
              required
              rows={6}
              placeholder={lang === "hr" ? "Kako vam možemo pomoći..." : "Tell us how we can help you..."}
            />
          </div>
          <div className="flex flex-col gap-4 sm:col-span-2">
            {status === "error" && <FormStatus status="error">{labels.error}</FormStatus>}
            <Button type="submit" size="lg" disabled={status === "sending"} className="w-full sm:w-auto sm:self-start">
              {status === "sending" ? labels.sending : submitLabel}
            </Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
