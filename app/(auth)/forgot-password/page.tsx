"use client";

import { useState, useCallback } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { RequestSentCard } from "@/components/auth/RequestSentCard";

type Step = "form" | "sent";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("form");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleSent = useCallback((email: string) => {
    setSubmittedEmail(email);
    setStep("sent");
  }, []);

  return (
    <AuthCard>
      {step === "form" ? (
        <ForgotPasswordForm onSent={(email) => handleSent(email)} />
      ) : (
        <RequestSentCard email={submittedEmail} />
      )}
    </AuthCard>
  );
}
