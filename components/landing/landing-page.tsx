"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useScroll } from "@/hooks/use-scroll";
import { Navbar } from "@/components/landing/layout/Navbar";
import { Footer } from "@/components/landing/layout/Footer";
import { HeroSection } from "@/components/landing/sections/HeroSection";
import { ProductPreview } from "@/components/landing/sections/ProductPreview";
import { FeaturesSection } from "@/components/landing/sections/FeaturesSection";
import { DesignPhilosophy } from "@/components/landing/sections/DesignPhilosophy";
import { StatsSection } from "@/components/landing/sections/StatsSection";
import { CTASection } from "@/components/landing/sections/CTASection";
import { Toast } from "@/components/ui/toast";

export default function LandingPage() {
  const scrolled = useScroll(20);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const router = useRouter();

  const handleDemoClick = useCallback(() => {
    setToastMessage(
      "✨ ClarityNotes 演示模式 — 完整版即将上线，欢迎体验设计系统。",
    );
    setShowToast(true);
  }, []);

  const handleStartClick = useCallback(() => {
    router.push("/login");
  }, [router]);

  return (
    <>
      <Navbar scrolled={scrolled} onDemoClick={handleDemoClick} />

      <main>
        <HeroSection onStart={handleStartClick} onWatchDemo={handleDemoClick} />
        <ProductPreview />
        <FeaturesSection />
        <DesignPhilosophy />
        <StatsSection />
        <CTASection
          onStartWriting={handleStartClick}
          onContactSales={handleDemoClick}
        />
      </main>

      <Footer />

      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
          duration={3000}
        />
      )}
    </>
  );
}
