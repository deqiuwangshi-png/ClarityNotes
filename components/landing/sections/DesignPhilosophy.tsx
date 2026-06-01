import { PHILOSOPHY_BADGE, PHILOSOPHY_TITLE, PHILOSOPHY_DESCRIPTION, PHILOSOPHY_POINTS, TESTIMONIAL } from "@/constants/landing";

export function DesignPhilosophy() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-6xl rounded-3xl border border-outline-variant/10 bg-surface-container-high/40 p-6 shadow-soft md:p-12">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <div className="mb-4 inline-block rounded-full bg-primary-container/20 px-3 py-1 text-label-caps text-primary">
              {PHILOSOPHY_BADGE}
            </div>
            <h2 className="text-display-md font-bold tracking-tight text-on-surface">
              {PHILOSOPHY_TITLE}
            </h2>
            <p className="mt-4 leading-relaxed text-body-lg text-on-surface-variant">
              {PHILOSOPHY_DESCRIPTION}
            </p>
            <div className="mt-8 flex flex-col gap-3">
              {PHILOSOPHY_POINTS.map((point) => (
                <div key={point.icon} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">{point.icon}</span>
                  <span className="text-body-md text-on-surface-variant">{point.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-3xl border border-outline-variant/20 bg-white p-6 shadow-elevation">
              <div className="mb-4 flex items-center gap-2 border-b border-outline-variant/20 pb-3">
                <span className="material-symbols-outlined text-primary">format_quote</span>
                <span className="font-medium text-on-surface">
                  我受益于 ClarityNotes 的&ldquo;无压&rdquo;组织
                </span>
              </div>
              <p className="italic text-body-md text-on-surface-variant">
                &ldquo;{TESTIMONIAL.quote}&rdquo;
                <br />—— {TESTIMONIAL.author}
              </p>
              <div className="mt-5 flex text-primary-container">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="material-symbols-outlined">
                    star_rate
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 z-0 size-32 rounded-full bg-primary-container/10 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
