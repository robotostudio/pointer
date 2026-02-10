import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <svg
      className={cn(
        "lucide lucide-arrow-down-to-line-icon lucide-arrow-down-to-line",
        className
      )}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Download</title>
      <path d="M12 17V3" />
      <path d="m6 11 6 6 6-6" />
      <path d="M19 21H5" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg
      className={cn(
        "lucide lucide-arrow-right-icon lucide-arrow-right",
        className
      )}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Arrow Right</title>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg
      className={cn(
        "lucide lucide-arrow-up-right-icon lucide-arrow-up-right",
        className
      )}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Arrow Up Right</title>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}
