"use client";

import { MenuIcon } from "lucide-react";
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
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function Navbar() {
  return (
    <header className="w-full border-white/5 border-b">
      <div className="container">
        <nav className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-80"
            href="/"
          >
            <PointerLogo />
            <span className="font-medium text-sm tracking-wide">POINTER</span>
          </Link>

          {/* Center Navigation - Desktop */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                className={buttonVariants({ variant: "ghost", size: "sm" })}
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
                buttonVariants({ variant: "ghost", size: "sm" }),
                "hidden md:inline-flex"
              )}
              href="/sign-in"
            >
              Sign in
            </Link>
            <Link
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-full border-foreground/20 bg-foreground/5 text-foreground hover:border-foreground/30 hover:bg-foreground/10"
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
