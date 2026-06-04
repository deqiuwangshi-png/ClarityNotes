"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/authStore";
import { FormInput } from "@/components/ui/form-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { PasswordToggle } from "@/components/ui/password-toggle";

interface UpdatePasswordFormProps {
  tokenHash: string | null;
}

export function UpdatePasswordForm({ tokenHash }: UpdatePasswordFormProps) {
  const router = useRouter();
  const { changePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!password) {
      newErrors.password = "请输入新密码";
    } else if (password.length < 8) {
      newErrors.password = "密码至少需要 8 位字符";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "请确认新密码";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "两次输入的密码不一致";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [password, confirmPassword]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!tokenHash) {
      setErrors({ form: "链接无效或已过期，请重新发起密码重置请求" });
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await changePassword(password);
      if (ok) {
        router.push("/login?reset=success");
      } else {
        setErrors({ form: "密码更新失败，请确认您已点击邮件中的重置链接" });
      }
    } catch {
      setErrors({ form: "密码更新失败，请重试" });
    } finally {
      setIsSubmitting(false);
    }
  }, [password, tokenHash, validate, changePassword, router]);

  return (
    <div className="space-y-6">
      <h2 className="text-center text-2xl font-semibold text-on-surface">
        重置密码
      </h2>
      <p className="text-center text-sm text-on-surface-variant">
        请设置您的新密码。
      </p>
      {errors.form && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.form}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          label="新密码"
          type={showPassword ? "text" : "password"}
          placeholder="至少 8 位字符"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
          }}
          error={errors.password}
          disabled={isSubmitting}
          suffix={
            <PasswordToggle
              visible={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
            />
          }
        />
        <FormInput
          label="确认新密码"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="重复您的新密码"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
          }}
          error={errors.confirmPassword}
          disabled={isSubmitting}
          suffix={
            <PasswordToggle
              visible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((v) => !v)}
            />
          }
        />
        <SubmitButton label="更新密码" loading={isSubmitting} />
      </form>
    </div>
  );
}
