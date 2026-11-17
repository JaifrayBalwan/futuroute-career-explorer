import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui-kit";

/** Shared frame for the sign-in, registration and password pages — keeps the Futuroute identity. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="ambient grid min-h-screen place-items-center px-4 py-10">
      <main id="main" className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-flex rounded-xl" aria-label="Futuroute home">
          <Logo />
        </Link>
        <div className="glass p-6 sm:p-8">
          <h1 className="font-display text-2xl font-semibold sm:text-[1.7rem]">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-text-2">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-5 text-center text-sm text-text-2">{footer}</div>}
      </main>
    </div>
  );
}
