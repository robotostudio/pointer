import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <svg
      className={cn("shrink-0", className)}
      fill="none"
      height="17"
      viewBox="0 0 9 17"
      width="9"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Download</title>
      <path
        d="M7.36 16.032H1.12V14.896H4.016C3.392 13.664 2.432 12.496 1.12 11.376V10.448C2.24 10.976 3.104 11.488 3.664 11.984V1.472H4.8V12C5.36 11.488 6.224 10.976 7.36 10.448V11.376C6.048 12.496 5.088 13.664 4.464 14.896H7.36V16.032Z"
        fill="currentColor"
      />
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
