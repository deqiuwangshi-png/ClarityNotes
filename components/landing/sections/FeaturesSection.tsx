import type { Feature } from "@/types/landing";
import { FEATURES } from "@/constants/landing";
import { SectionHeader } from "@/components/ui/section-header";

interface FeaturesSectionProps {
  features?: Feature[];
}

function FeatureCard({ icon, title, description }: Feature) {
  return (
    <div className="feature-card rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-soft transition-all hover:shadow-elevation">
      <div className="feature-icon mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary-container/20 text-primary">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="text-headline-md font-semibold text-on-surface">{title}</h3>
      <p className="mt-2 text-body-md text-on-surface-variant">{description}</p>
    </div>
  );
}

export function FeaturesSection({ features = FEATURES }: FeaturesSectionProps) {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="为清晰思考而生"
          subtitle="精心设计每一个细节，让想法真正落地。"
        />
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
