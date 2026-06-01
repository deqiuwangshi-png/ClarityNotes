import { FEATURE_TAGS } from "@/constants/landing";

export function ProductPreview() {
  return (
    <section className="px-6 pb-20 md:pb-28">
      <div className="mx-auto max-w-5xl">
        <div className="preview-note overflow-hidden rounded-3xl border border-outline-variant/20 bg-surface-container-low shadow-elevation">
          <div className="grid gap-0 md:grid-cols-5">
            <div className="border-r border-outline-variant/20 bg-surface-container-lowest/70 p-4 md:col-span-1">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-lg bg-primary-container/30">
                  <span className="material-symbols-outlined text-sm text-primary">
                    search
                  </span>
                </div>
                <span className="text-label-caps text-on-surface-variant">
                  快速搜索
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 rounded-xl bg-secondary-container/40 p-2 text-primary">
                  <span className="material-symbols-outlined text-sm">description</span>
                  <span className="text-sm font-medium">产品设计 101</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">description</span>
                  <span className="text-sm">用户体验原则</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">description</span>
                  <span className="text-sm">设计系统变量</span>
                </div>
              </div>
            </div>

            <div className="bg-white/50 p-6 md:col-span-4 md:p-8">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-error/60" />
                  <div className="size-3 rounded-full bg-tertiary/40" />
                  <div className="size-3 rounded-full bg-primary-container" />
                </div>
                <span className="text-label-caps text-on-surface-variant">
                  最后编辑 · 刚刚
                </span>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-on-surface">
                产品设计 101
              </h2>
              <p className="leading-relaxed text-body-md text-on-surface-variant">
                产品设计不仅是外观与感觉，更是关于产品如何运作。ClarityNotes
                追求&ldquo;认知清晰度&rdquo;——减少干扰，专注思考。
                <span className="font-medium text-primary">
                  {' '}
                  每一个像素都服务于目标。
                </span>
              </p>
              <ul className="mt-5 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  <span>视觉层级引导注意力</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  <span>即时反馈降低焦虑</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  <span>离线优先 &amp; 无缝同步</span>
                </li>
              </ul>
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary-container">
                <span className="material-symbols-outlined text-primary">
                  check_circle
                </span>
                <span>认知轻量 · 桌面级体验</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-3 text-label-caps text-on-surface-variant">
          {FEATURE_TAGS.map((tag) => (
            <span key={tag} className="rounded-full bg-surface-container px-3 py-1">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
