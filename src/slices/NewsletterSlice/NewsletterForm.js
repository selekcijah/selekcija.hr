"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowIcon } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";

export default function NewsletterForm({ buttonLabel = "Subscribe", brevoListId, accentColor = "primary" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, listId: brevoListId }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  const isMint = accentColor === "secondary";

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <motion.p
          key="success"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto inline-flex items-center gap-3 rounded-full border border-mint/30 bg-mint/10 px-6 py-3 text-[16px] font-medium text-mint"
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-5">
            <path d="M5 10.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          You&apos;re subscribed! Thank you.
        </motion.p>
      ) : (
        <motion.form key="form" onSubmit={handleSubmit} noValidate exit={{ opacity: 0, y: -8 }}>
          <div
            className={cn(
              "mx-auto flex max-w-[560px] flex-col gap-2 rounded-3xl border border-line-strong bg-surface/60 p-2 backdrop-blur-md transition sm:flex-row sm:rounded-full",
              isMint
                ? "focus-within:border-mint/70 focus-within:ring-4 focus-within:ring-mint/15"
                : "focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15",
            )}
          >
            <input
              type="email"
              required
              aria-label="Email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className="min-w-0 flex-1 bg-transparent px-5 py-3 text-[15px] text-ink outline-none placeholder:text-muted focus-visible:!outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === "loading" || !email}
              className={cn(
                "group/btn inline-flex h-12 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full px-7 text-[15px] font-medium transition-all duration-300 focus-visible:!outline-none disabled:cursor-not-allowed disabled:opacity-50",
                isMint
                  ? "bg-mint text-dark hover:bg-[#62e3ab]"
                  : "bg-primary text-white shadow-[0_10px_30px_-10px_rgba(34,124,255,0.8)] hover:bg-primary-hover",
              )}
            >
              <span>{status === "loading" ? "Please wait…" : buttonLabel}</span>
              {status !== "loading" && <ArrowIcon />}
            </button>
          </div>
          {status === "error" && <p className="mt-4 text-[14px] font-medium text-red-300">{errorMsg}</p>}
        </motion.form>
      )}
    </AnimatePresence>
  );
}
