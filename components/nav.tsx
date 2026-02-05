"use client";

import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Features", href: "/features" },
  { name: "Enterprise", href: "/enterprise" },
  { name: "Pricing", href: "/pricing" },
  { name: "Resources", href: "/resources" },
];

function PointerLogo() {
  return (
    <Image
      alt="Pointer Logo"
      className="size-5"
      decoding="sync"
      height={20}
      loading="eager"
      priority
      src="/logo.svg"
      width={20}
    />
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container">
        <nav className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-80"
            href="/"
          >
            <PointerLogo />
            <span className="font-bold text-sm tracking-wide">POINTER</span>
          </Link>

          {/* Center Navigation - Desktop */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-muted-foreground transition-colors hover:text-foreground"
                )}
                href={item.href}
                key={item.name}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link
              className={cn(
                "hidden rounded-full border px-4 py-2 font-medium text-sm transition-all hover:bg-neutral-100 md:inline-flex dark:border-white/5 dark:hover:bg-white/5",
                "text-muted-foreground hover:text-foreground"
              )}
              href="/sign-in"
            >
              Sign in
            </Link>
            <Link
              className={cn(
                "inline-flex items-center justify-center rounded-full bg-black px-5 py-2 font-medium text-neutral-100 text-sm transition-all active:scale-[0.98] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100/90",
                "hover:bg-neutral-800"
              )}
              href="/download"
            >
              Download
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    className="md:hidden"
                    size="icon-sm"
                    variant="ghost"
                  />
                }
              >
                <MenuIcon className="size-5" />
                <span className="sr-only">Open menu</span>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>
                    <Link
                      className="flex items-center gap-2 text-foreground"
                      href="/"
                    >
                      <PointerLogo />
                      <span className="font-medium text-sm tracking-wide">
                        POINTER
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 px-4">
                  {navItems.map((item) => (
                    <Link
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "justify-start"
                      )}
                      href={item.href}
                      key={item.name}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-auto flex flex-col gap-2 border-t p-4">
                  <Link
                    className={buttonVariants({ variant: "ghost" })}
                    href="/sign-in"
                  >
                    Sign in
                  </Link>
                  <Link
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "rounded-full border-foreground/20 bg-foreground/5 text-foreground hover:border-foreground/30 hover:bg-foreground/10"
                    )}
                    href="/download"
                  >
                    Download
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
