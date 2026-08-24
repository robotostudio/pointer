"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function MonitorIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="14"
    >
      <rect height="14" rx="2" ry="2" width="20" x="2" y="3" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="14"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" x2="12" y1="1" y2="3" />
      <line x1="12" x2="12" y1="21" y2="23" />
      <line x1="4.22" x2="5.64" y1="4.22" y2="5.64" />
      <line x1="18.36" x2="19.78" y1="18.36" y2="19.78" />
      <line x1="1" x2="3" y1="12" y2="12" />
      <line x1="21" x2="23" y1="12" y2="12" />
      <line x1="4.22" x2="5.64" y1="19.78" y2="18.36" />
      <line x1="18.36" x2="19.78" y1="5.64" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="14"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const themes = [
  { icon: MonitorIcon, label: "System theme", value: "system" },
  { icon: SunIcon, label: "Light theme", value: "light" },
  { icon: MoonIcon, label: "Dark theme", value: "dark" },
] as const;

function ThemeButton({
  Icon,
  isActive,
  label,
  onSelect,
  value,
}: {
  Icon: (typeof themes)[number]["icon"];
  isActive: boolean;
  label: string;
  onSelect: (value: string) => void;
  value: string;
}) {
  const handleClick = useCallback(() => {
    onSelect(value);
  }, [onSelect, value]);

  return (
    <button
      aria-label={label}
      aria-pressed={isActive}
      className={cn(
        "relative flex size-5 items-center justify-center rounded-full transition-all duration-200",
        isActive
          ? "bg-foreground/10 text-foreground"
          : "text-muted-foreground hover:text-foreground/70"
      )}
      onClick={handleClick}
      type="button"
    >
      <Icon />
    </button>
  );
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div aria-hidden="true" className="h-7 w-19 rounded-full bg-muted/50" />
    );
  }

  return (
    <div className="flex h-7 items-center gap-0.5 rounded-full bg-muted/50 p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <ThemeButton
          Icon={Icon}
          isActive={theme === value}
          key={value}
          label={label}
          onSelect={setTheme}
          value={value}
        />
      ))}
    </div>
  );
}
