"use client";

import { useState } from "react";
import { FormInput } from "@/components/ui/form-input";
import { Checkbox } from "@/components/ui/checkbox";
import { SubmitButton } from "@/components/ui/submit-button";
import { PasswordToggle } from "@/components/ui/password-toggle";
import type { RegisterPayload } from "@/types/auth";

interface AuthFormProps {
  type: "login" | "register";
  isSubmitting: boolean;
  onSubmit: (payload: { email: string; password: string; rememberMe?: boolean } | RegisterPayload) => void;
  serverError?: string | null;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthForm({ type, isSubmitting, onSubmit, serverError }: AuthFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isLogin = type === "login";
  const displayError = serverError || errors.form;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!isLogin && !fullName.trim()) newErrors.fullName = "请输入您的姓名";
    if (!email.trim()) {
      newErrors.email = "请输入邮箱地址";
    } else if (!isLogin && !EMAIL_REGEX.test(email)) {
      newErrors.email = "请输入有效的邮箱地址";
    }
    if (!password) {
      newErrors.password = "请输入密码";
    } else if (!isLogin && password.length < 8) {
      newErrors.password = "密码至少需要 8 位字符";
    }
    if (!isLogin) {
      if (!confirmPassword) {
        newErrors.confirmPassword = "请确认密码";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "两次输入的密码不一致";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (isLogin) {
      (onSubmit as (payload: { email: string; password: string; rememberMe?: boolean }) => void)({ email, password, rememberMe });
    } else {
      (onSubmit as (payload: RegisterPayload) => void)({ fullName, email, password });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="mb-8 text-center text-2xl font-semibold text-on-surface">
        {isLogin ? "欢迎回来" : "创建您的账户"}
      </h2>
      {displayError && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {displayError}
        </div>
      )}
      <form onSubmit={handleSubmit} className={isLogin ? "space-y-5" : "space-y-4"}>
        {!isLogin && (
          <FormInput
            label="全名"
            type="text"
            placeholder="您的姓名"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
            disabled={isSubmitting}
          />
        )}
        <FormInput
          label="邮箱地址"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={isSubmitting}
        />
        <FormInput
          label={isLogin ? "密码" : "设置密码"}
          type={showPassword ? "text" : "password"}
          placeholder={isLogin ? "••••••••" : "至少 8 位字符"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={isSubmitting}
          suffix={
            <PasswordToggle
              visible={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
            />
          }
        />
        {!isLogin && (
          <FormInput
            label="确认密码"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="重复您的密码"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            disabled={isSubmitting}
            suffix={
              <PasswordToggle
                visible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((v) => !v)}
              />
            }
          />
        )}
        {isLogin && (
          <div className="flex items-center justify-between px-1">
            <Checkbox
              id="remember"
              label="记住我"
              checked={rememberMe}
              onChange={setRememberMe}
              disabled={isSubmitting}
            />
            <a
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              忘记密码？
            </a>
          </div>
        )}
        {!isLogin && <div className="pt-4" />}
        <SubmitButton label={isLogin ? "立即登录" : "免费注册"} loading={isSubmitting} />
      </form>
      {!isLogin && (
        <p className="px-2 text-center text-xs text-on-surface-variant">
          注册即代表您同意我们的{" "}
          <a
            href="#"
            className="font-medium text-primary hover:underline"
            onClick={(e) => {
              e.preventDefault();
              console.log("【预留路由】服务条款");
            }}
          >
            服务条款
          </a>{" "}
          和{" "}
          <a
            href="#"
            className="font-medium text-primary hover:underline"
            onClick={(e) => {
              e.preventDefault();
              console.log("【预留路由】隐私政策");
            }}
          >
            隐私政策
          </a>
          。
        </p>
      )}
    </div>
  );
}
