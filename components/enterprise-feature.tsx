import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EnterpriseFeatureProps {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
}

export function EnterpriseFeature({
  children,
  className,
  reverse,
}: EnterpriseFeatureProps) {
  return (
    <section
      className={cn(
        "my-6 grid items-center gap-8 border border-muted/60 bg-muted/30 p-4 text-foreground md:my-12 md:gap-12 md:py-4 lg:grid-cols-3",
        reverse && "lg:[&>*:first-child]:order-2",
        className
      )}
    >
      {children}
    </section>
  );
}

interface EnterpriseFeatureContentProps {
  children: ReactNode;
  className?: string;
}

export function EnterpriseFeatureContent({
  children,
  className,
}: EnterpriseFeatureContentProps) {
  return <div className={cn("flex flex-col gap-4", className)}>{children}</div>;
}

interface EnterpriseFeatureTitleProps {
  children: ReactNode;
  className?: string;
}

export function EnterpriseFeatureTitle({
  children,
  className,
}: EnterpriseFeatureTitleProps) {
  return (
    <h2
      className={cn(
        "my-0! text-balance font-medium text-3xl text-foreground tracking-tight md:text-4xl",
        className
      )}
    >
      {children}
    </h2>
  );
}

interface EnterpriseFeatureDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function EnterpriseFeatureDescription({
  children,
  className,
}: EnterpriseFeatureDescriptionProps) {
  return (
    <div
      className={cn(
        "max-w-lg text-md! text-muted-foreground leading-relaxed md:text-lg! [&>p]:my-0! [&_p]:text-inherit!",
        className
      )}
    >
      {children}
    </div>
  );
}

interface EnterpriseFeatureTestimonialProps {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
  className?: string;
}

export function EnterpriseFeatureTestimonial({
  quote,
  author,
  role,
  avatar,
  className,
}: EnterpriseFeatureTestimonialProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 border-white/10 border-l pl-6",
        className
      )}
    >
      <div className="font-normal text-md text-neutral-400 leading-relaxed">
        "{quote}"
      </div>
      <div className="flex items-center gap-3">
        {avatar && (
          <div className="relative size-8 overflow-hidden rounded-[4px] border border-white/10">
            <Image alt={author} className="object-cover" fill src={avatar} />
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-medium text-foreground text-sm">{author}</span>
          <span className="text-muted-foreground text-xs">{role}</span>
        </div>
      </div>
    </div>
  );
}

interface EnterpriseFeatureMediaProps {
  children?: ReactNode;
  backgroundSrc?: string;
  windowSrc?: string;
  alt?: string;
  className?: string;
}

export function EnterpriseFeatureMedia({
  children,
  className,
  backgroundSrc,
  windowSrc,
  alt = "Enterprise feature media",
}: EnterpriseFeatureMediaProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-square items-center justify-center overflow-hidden rounded-lg shadow-xl lg:col-span-2",
        className
      )}
    >
      {backgroundSrc && (
        <Image
          alt={alt}
          className="object-cover"
          fill
          priority
          src={backgroundSrc}
        />
      )}
      {windowSrc && (
        <div className="relative z-10 h-10/12 w-10/12 overflow-hidden rounded-lg border border-white/10 shadow-2xl">
          <Image
            alt={`${alt} - focus`}
            className="h-auto w-full"
            height={900}
            src={windowSrc}
            width={1600}
          />
        </div>
      )}
      {children}
    </div>
  );
}
