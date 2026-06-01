"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/landing/logo";
import { NAV_LINKS } from "@/constants/landing";

interface NavbarProps {
  scrolled: boolean;
  onDemoClick: () => void;
}

export function Navbar({ scrolled, onDemoClick }: NavbarProps) {
  const router = useRouter();

  return (
    <header
      className="glass-nav fixed top-0 z-50 w-full transition-all"
      style={{
        background: scrolled
          ? "rgba(246, 250, 247, 0.88)"
          : "rgba(246, 250, 247, 0.72)",
        boxShadow: scrolled
          ? "0 12px 30px rgba(0, 0, 0, 0.03), 0 4px 8px rgba(0, 0, 0, 0.02)"
          : "none",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 text-body-md font-medium text-on-surface-variant md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="text"
            size="sm"
            onClick={() => router.push("/login")}
          >
            登录
          </Button>
          <Button variant="primary" size="sm" onClick={onDemoClick}>
            免费试用
          </Button>
        </div>
      </div>
    </header>
  );
}
