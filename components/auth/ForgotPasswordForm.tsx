"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/store/authStore";
import { FormInput } from "@/components/ui/form-input";
import { SubmitButton } from "@/components/ui/submit-button";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ForgotPasswordFormProps {
  onSent: (email: string) => void;
}

export function ForgotPasswordForm({ onSent }: ForgotPasswordFormProps) {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = useCallback((value: string): boolean => {
    if (!value.trim()) {
      setError("请输入邮箱地址");
      return false;
    }
    if (!EMAIL_REGEX.test(value)) {
      setError("请输入有效的邮箱地址");
      return false;
    }
    setError(null);
    return true;
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (error && value) {
      validateEmail(value);
    }
  }, [error, validateEmail]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    setIsSubmitting(true);
    try {
      const result = await sendPasswordReset(email);
      if (result.success) {
        onSent(email);
      } else {
        setError(result.error || "发送失败，请稍后重试");
      }
    } catch {
      setError("发送失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  }, [email, validateEmail, sendPasswordReset, onSent]);

  return (
    <div className="space-y-6">
      <h2 className="text-center text-2xl font-semibold text-on-surface">
        忘记密码
      </h2>
      <p className="text-center text-sm text-on-surface-variant">
        输入您的注册邮箱，我们将向您发送重置密码的链接。
      </p>
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          label="邮箱地址"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={handleChange}
          onBlur={() => email && validateEmail(email)}
          disabled={isSubmitting}
        />
        <SubmitButton label="发送重置邮件" loading={isSubmitting} />
      </form>
      <div className="text-center">
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
