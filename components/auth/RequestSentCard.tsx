"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/store/authStore";
import { Button } from "@/components/ui/button";

interface RequestSentCardProps {
  email: string;
}

export function RequestSentCard({ email }: RequestSentCardProps) {
  const { sendPasswordReset } = useAuth();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = useCallback(async () => {
    setResending(true);
    try {
      const result = await sendPasswordReset(email);
      if (result.success) {
        setResent(true);
        setTimeout(() => setResent(false), 3000);
      }
    } catch {
      // silent
    } finally {
      setResending(false);
    }
  }, [email, sendPasswordReset]);

  return (
    <div className="space-y-6 text-center">
      {/* 成功图标 */}
      <div className="flex justify-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
          <svg
            aria-hidden="true"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M22 2 11 13" />
            <path d="M22 2 15 22 11 13 2 9 22 2z" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-on-surface">
        邮件已发送
      </h2>

      <p className="text-sm text-on-surface-variant">
        我们已向 <span className="font-medium text-on-surface">{email}</span>{" "}
        发送了一封密码重置邮件，请查收并按照邮件中的指引完成密码重置。
      </p>

      {resent && (
        <p className="text-xs text-primary">
          邮件已重新发送，请查收
        </p>
      )}

      <div className="flex flex-col items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleResend}
          disabled={resending}
        >
          {resending ? "发送中..." : "重新发送"}
        </Button>
        <Link
          href="/login"
          className="text-xs font-medium text-primary hover:underline"
        >
          返回登录
        </Link>
      </div>
    </div>
  );
}
