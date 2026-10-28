import { Link } from "@tanstack/react-router";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Logo({ size = 32, withName = true }: { size?: number; withName?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <defs>
          <linearGradient id="fr-g" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="var(--lavender-bright)" />
            <stop offset="1" stopColor="var(--cyan)" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="38" height="38" rx="11" fill="oklch(1 0 0 / 0.06)" stroke="oklch(1 0 0 / 0.2)" />
        <path d="M9 30 C 15 30, 15 20, 21 20 S 27 11, 31 10" stroke="url(#fr-g)" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M21 20 C 25 20, 27 25, 31 27" stroke="url(#fr-g)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
        <circle cx="9" cy="30" r="2.6" fill="var(--lavender-bright)" />
        <circle cx="21" cy="20" r="2.4" fill="var(--pink)" />
        <circle cx="31" cy="27" r="2" fill="var(--turquoise)" />
        <circle cx="31" cy="10" r="3.2" fill="var(--cyan)" />
      </svg>
      {withName && <span className="font-display text-lg font-semibold tracking-tight">Futuroute</span>}
    </span>
  );
}

export function Glass({ className, children, as: As = "div" }: { className?: string; children: ReactNode; as?: "div" | "section" | "article" | "aside" }) {
  return <As className={cn("glass p-5 sm:p-6", className)}>{children}</As>;
}

type BtnVariant = "primary" | "ghost" | "outline" | "soft";
const btn: Record<BtnVariant, string> = {
  primary: "bg-brand text-primary-foreground font-semibold glow hover:brightness-110",
  ghost: "text-text-2 hover:bg-secondary hover:text-foreground",
  outline: "border border-glass-border bg-secondary text-foreground hover:bg-accent",
  soft: "bg-accent text-lavender-bright border border-lavender/30 hover:bg-lavender/25",
};
export const btnClass = (v: BtnVariant = "primary", extra?: string) =>
  cn("inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm transition disabled:pointer-events-none disabled:opacity-50", btn[v], extra);

export function Button({ variant = "primary", className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant }) {
  return <button type="button" {...p} className={btnClass(variant, className)} />;
}

export function Chip({ active, children, onClick, className }: { active?: boolean; children: ReactNode; onClick?: () => void; className?: string }) {
  const cls = cn(
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition",
    active ? "border-lavender/60 bg-lavender/20 text-foreground glow" : "border-glass-border bg-secondary text-text-2 hover:text-foreground hover:bg-accent",
    className,
  );
  if (!onClick) return <span className={cls}>{children}</span>;
  return <button type="button" aria-pressed={!!active} onClick={onClick} className={cls}>{children}</button>;
}

export function ProgressRing({ value, size = 120, stroke = 10, label }: { value: number; size?: number; stroke?: number; label?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }} role="img" aria-label={`${v}% complete`}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`pr-${size}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--lavender-bright)" />
            <stop offset="1" stopColor="var(--cyan)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="oklch(1 0 0 / 0.1)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={`url(#pr-${size})`} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (v / 100) * c} style={{ transition: "stroke-dashoffset .6s ease" }} />
      </svg>
      <div className="absolute text-center">{label ?? <span className="font-display text-2xl font-semibold">{v}%</span>}</div>
    </div>
  );
}

export function Bar({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-1" aria-label={`${value} of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={cn("h-1.5 w-5 rounded-full", i < value ? "bg-brand" : "bg-secondary")} />
      ))}
    </div>
  );
}

export function EmptyState({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: { label: string; to: string } }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-glass-border px-6 py-10 text-center">
      <div className="grid size-12 place-items-center rounded-2xl bg-accent text-lavender-bright">{icon}</div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{text}</p>
      {action && <Link to={action.to} className={btnClass("soft")}>{action.label}</Link>}
    </div>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-2.5 py-1 text-xs text-warning", className)}>
      <span className="size-1.5 rounded-full bg-warning" /> Demo Mode — sample recommendations; live AI not connected.
    </span>
  );
}

export function PageHeader({ eyebrow, title, text, children }: { eyebrow?: string; title: string; text?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan">{eyebrow}</p>}
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
        {text && <p className="mt-2 max-w-2xl text-text-2">{text}</p>}
      </div>
      {children}
    </div>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "warn" | "success"; children: ReactNode }) {
  const t = { info: "border-cyan/30 bg-cyan/10 text-text-2", warn: "border-warning/30 bg-warning/10 text-warning", success: "border-success/30 bg-success/10 text-success" }[tone];
  return <div role={tone === "warn" ? "alert" : "status"} className={cn("rounded-xl border px-4 py-3 text-sm", t)}>{children}</div>;
}
