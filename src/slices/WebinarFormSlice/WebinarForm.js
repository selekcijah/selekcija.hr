"use client";

import { useId, useState } from "react";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import * as prismic from "@prismicio/client";
import { Button } from "@/components/ui/Button";
import { Checkbox, FormStatus, Input, Label } from "@/components/ui/Field";

const LABELS = {
  hr: {
    firstName: "Ime",
    lastName: "Prezime",
    company: "Tvrtka",
    email: "E-mail adresa",
    sending: "Slanje...",
    success: "Uspješno ste se prijavili! Javit ćemo vam se uskoro.",
    error: "Došlo je do pogreške. Pokušajte ponovo.",
    consentRequired: "Morate prihvatiti uvjete prije slanja.",
  },
  en: {
    firstName: "First Name",
    lastName: "Last Name",
    company: "Company",
    email: "Email Address",
    sending: "Sending...",
    success: "You have successfully registered! We'll be in touch soon.",
    error: "Something went wrong. Please try again.",
    consentRequired: "You must accept the terms before submitting.",
  },
};

export default function WebinarForm({ submitLabel, consentLabel, brevoListId, lang = "hr" }) {
  const consentId = useId();
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const labels = LABELS[lang] ?? LABELS.hr;

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const formData = new FormData(e.target);
    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const company = String(formData.get("company") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const consent = formData.get("consent") === "on";

    if (!consent) {
      setStatus("error");
      setErrorMsg(labels.consentRequired);
      return;
    }

    try {
      const res = await fetch("/api/webinar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, company, email, listId: brevoListId }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        e.target.reset();
      } else {
        setStatus("error");
        setErrorMsg(data.error || labels.error);
      }
    } catch {
      setStatus("error");
      setErrorMsg(labels.error);
    }
  }

  if (status === "success") {
    return <FormStatus status="success">{labels.success}</FormStatus>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div>
        <Label htmlFor="webinar-first" required>
          {labels.firstName}
        </Label>
        <Input id="webinar-first" name="firstName" type="text" required disabled={status === "sending"} placeholder={lang === "hr" ? "Ana" : "John"} />
      </div>
      <div>
        <Label htmlFor="webinar-last" required>
          {labels.lastName}
        </Label>
        <Input id="webinar-last" name="lastName" type="text" required disabled={status === "sending"} placeholder={lang === "hr" ? "Horvat" : "Doe"} />
      </div>
      <div>
        <Label htmlFor="webinar-company">{labels.company}</Label>
        <Input id="webinar-company" name="company" type="text" disabled={status === "sending"} placeholder={lang === "hr" ? "Tvrtka d.o.o." : "Company Inc."} />
      </div>
      <div>
        <Label htmlFor="webinar-email" required>
          {labels.email}
        </Label>
        <Input id="webinar-email" name="email" type="email" required disabled={status === "sending"} placeholder={lang === "hr" ? "ana@primjer.hr" : "john@example.com"} />
      </div>

      {prismic.isFilled.richText(consentLabel) && (
        <div className="sm:col-span-2">
          <div className="flex items-start gap-3 rounded-xl border border-line bg-white/[0.03] p-4">
            <Checkbox id={consentId} name="consent" required disabled={status === "sending"} />
            <label htmlFor={consentId} className="text-[13px] leading-relaxed text-body">
              <PrismicRichText
                field={consentLabel}
                components={{
                  paragraph: ({ children }) => <span>{children}</span>,
                  hyperlink: ({ children, node }) => (
                    <PrismicNextLink field={node.data} className="text-ink underline decoration-primary/50 underline-offset-4 hover:text-primary">
                      {children}
                    </PrismicNextLink>
                  ),
                  strong: ({ children }) => <strong className="text-ink">{children}</strong>,
                  em: ({ children }) => <em>{children}</em>,
                }}
              />
            </label>
          </div>
        </div>
      )}

      <div className="sm:col-span-2 flex flex-col items-center gap-3">
        {status === "error" && errorMsg && <FormStatus status="error">{errorMsg}</FormStatus>}
        <Button type="submit" disabled={status === "sending"} size="lg">
          {status === "sending" ? labels.sending : submitLabel}
        </Button>
      </div>
    </form>
  );
}
