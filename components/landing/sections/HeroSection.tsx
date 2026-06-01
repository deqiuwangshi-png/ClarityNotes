import { Button } from "@/components/ui/button";
import { HERO_BADGE, HERO_DESCRIPTION } from "@/constants/landing";

interface HeroSectionProps {
  onStart: () => void;
  onWatchDemo: () => void;
}

export function HeroSection({ onStart, onWatchDemo }: HeroSectionProps) {
  return (
    <section className="overflow-hidden px-6 pb-16 pt-32 md:pb-24 md:pt-40">
      <div className="mx-auto max-w-6xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-surface-container-high/60 px-4 py-1.5 text-label-caps text-primary shadow-soft backdrop-blur-sm">
          <span className="material-symbols-outlined text-sm">{HERO_BADGE.icon}</span>
          <span>{HERO_BADGE.text}</span>
        </div>

        <h1 className="mx-auto max-w-4xl text-display-lg leading-[1.1] tracking-tight text-on-surface">
          让思绪自由流动
          <br />
          笔记工具<span className="text-primary"> 回归本质</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-body-lg leading-relaxed text-on-surface-variant">
          {HERO_DESCRIPTION}
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button variant="primary" icon="download" onClick={onStart}>
            开始免费使用
          </Button>
          <Button variant="secondary" icon="play_circle" onClick={onWatchDemo}>
            观看演示
          </Button>
        </div>

        <div className="relative mt-16 flex justify-center">
          <div className="h-1 w-32 rounded-full bg-primary-container/30" />
        </div>
      </div>
    </section>
  );
}
