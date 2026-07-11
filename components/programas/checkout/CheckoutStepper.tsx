"use client";

import { cn } from "@/lib/utils";

const STEPS = [
  { num: 1, label: "Elige tu fecha" },
  { num: 2, label: "Tus datos" },
  { num: 3, label: "Pago Yape" },
  { num: 4, label: "¡Listo!" },
] as const;

interface CheckoutStepperProps {
  current: 1 | 2 | 3 | 4;
}

export function CheckoutStepper({ current }: CheckoutStepperProps) {
  return (
    <ol className="flex items-center gap-0 w-full max-w-2xl">
      {STEPS.map((step, i) => {
        const done = step.num < current;
        const active = step.num === current;

        return (
          <li key={step.num} className="flex items-center flex-1 min-w-0 last:flex-none">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={cn(
                  "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  done && "bg-emerald-500 text-white",
                  active && "bg-primary text-primary-foreground",
                  !done && !active && "border border-border text-muted-foreground bg-background"
                )}
              >
                {done ? "✓" : step.num}
              </span>
              <span
                className={cn(
                  "hidden sm:inline text-xs font-medium truncate",
                  active && "text-foreground",
                  done && "text-emerald-600 dark:text-emerald-400",
                  !done && !active && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px flex-1 mx-2 sm:mx-3",
                  done ? "bg-emerald-400" : "bg-border"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
