import { Button } from "@/components/ui/button";
import { CTA_TITLE, CTA_DESCRIPTION, CTA_FOOTNOTE } from "@/constants/landing";

interface CTASectionProps {
  onStartWriting: () => void;
  onContactSales: () => void;
}

export function CTASection({ onStartWriting, onContactSales }: CTASectionProps) {
  return (
    <section className="px-6 pb-28">
      <div className="mx-auto max-w-5xl rounded-3xl border border-outline-variant/10 bg-primary-container/10 p-8 text-center shadow-soft backdrop-blur-sm md:p-12">
        <span className="material-symbols-outlined mb-3 text-5xl text-primary">
          auto_awesome
        </span>
        <h2 className="text-display-md font-bold text-on-surface">{CTA_TITLE}</h2>
        <p className="mx-auto mt-3 max-w-xl text-body-lg text-on-surface-variant">
          {CTA_DESCRIPTION}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button
            variant="primary"
            icon="arrow_forward"
            iconPosition="right"
            onClick={onStartWriting}
          >
            开始免费写作
          </Button>
          <Button variant="secondary" onClick={onContactSales}>
            联系销售团队
          </Button>
        </div>
        <p className="mt-6 text-label-caps text-on-surface-variant">
          {CTA_FOOTNOTE}
        </p>
      </div>
    </section>
  );
}
