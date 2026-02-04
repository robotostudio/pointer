import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container">
      <div className="mx-auto flex min-h-[calc(100vh-400px)] max-w-[400px] flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 className="text-6xl text-foreground">404</h1>
        <p className="animate-fade-in text-lg text-muted-foreground">
          The page you’re looking for has wandered off, but don’t worry!
        </p>
        <p className="mb-8 animate-fade-in text-balance text-muted-foreground text-xs">
          Let’s get you back on track.
        </p>
        <Link
          aria-label="Return Home"
          className="animate-fade-in-up rounded-[5px] bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-all duration-200 ease-in-out hover:scale-105 hover:bg-primary/90"
          href="/"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
