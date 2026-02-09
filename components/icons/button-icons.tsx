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
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
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
      className={cn("shrink-0", className)}
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Arrow Right</title>
      <path
        d="M10.864 10.4C11.024 10.0587 11.1787 9.76 11.328 9.504C11.488 9.248 11.6427 9.03467 11.792 8.864H2.464V8.192H11.792C11.6427 8.01067 11.488 7.792 11.328 7.536C11.1787 7.28 11.024 6.98667 10.864 6.656H11.424C12.096 7.43467 12.8 8.01067 13.536 8.384V8.672C12.8 9.03467 12.096 9.61067 11.424 10.4H10.864Z"
        fill="currentColor"
      />
    </svg>
  );
}
