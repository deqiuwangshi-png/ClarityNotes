"use client";

import { AuthGuard } from "@/components/layout/auth-guard";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="page-transition-enter">{children}</div>
    </AuthGuard>
  );
}
