import { cn } from "./cn";

export const FIELD =
  "w-full rounded-xl border border-line-strong bg-white/[0.03] px-4 py-3.5 text-[15px] text-ink placeholder:text-muted outline-none transition duration-200 hover:border-white/25 focus:border-primary focus:bg-white/[0.05] focus:ring-4 focus:ring-primary/15 disabled:opacity-60";

export function Label({ htmlFor, children, className, required }) {
  if (!children) return null;
  return (
    <label htmlFor={htmlFor} className={cn("mb-2 block text-[13px] font-medium tracking-wide text-ink/80", className)}>
      {children}
      {required && <span className="ml-0.5 text-primary">*</span>}
    </label>
  );
}

export function Input({ className, ...props }) {
  return <input className={cn(FIELD, className)} {...props} />;
}

export function Textarea({ className, rows = 5, ...props }) {
  return <textarea rows={rows} className={cn(FIELD, "resize-y", className)} {...props} />;
}

export function Select({ className, children, ...props }) {
  return (
    <div className="relative">
      <select className={cn(FIELD, "cursor-pointer appearance-none pr-11 [&>option]:bg-surface-2", className)} {...props}>
        {children}
      </select>
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted">
        <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function Checkbox({ className, ...props }) {
  return (
    <input
      type="checkbox"
      className={cn(
        "mt-0.5 size-[18px] shrink-0 cursor-pointer appearance-none rounded-[5px] border border-line-strong bg-white/[0.03] transition checked:border-primary checked:bg-primary checked:bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 8.5l2.5 2.5L12 5.5' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")] bg-center bg-no-repeat focus-visible:ring-4 focus-visible:ring-primary/20",
        className,
      )}
      {...props}
    />
  );
}

export function FormStatus({ status, children }) {
  if (!children) return null;
  const tone =
    status === "success"
      ? "border-mint/30 bg-mint/10 text-mint"
      : status === "error"
        ? "border-red-400/30 bg-red-500/10 text-red-300"
        : "border-line bg-white/5 text-body";
  return <div role="status" className={cn("rounded-xl border px-4 py-3 text-[14px]", tone)}>{children}</div>;
}
