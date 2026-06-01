import { FOOTER_SECTIONS, SOCIAL_ICONS } from "@/constants/landing";

export function Footer() {
  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    console.log("【预留路由】", href);
  };

  return (
    <footer className="border-t border-outline-variant/20 bg-surface-container-low px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 pb-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-white">
                <span className="material-symbols-outlined text-sm">draw</span>
              </div>
              <span className="text-xl font-bold text-primary">ClarityNotes</span>
            </div>
            <p className="max-w-sm text-body-md text-on-surface-variant">
              认知清晰，轻量至上 — 新一代笔记工具，为深度思考者设计。
            </p>
            <div className="mt-5 flex gap-4">
              {SOCIAL_ICONS.map((icon) => (
                <span
                  key={icon}
                  className="material-symbols-outlined cursor-pointer text-on-surface-variant transition-colors hover:text-primary"
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>

          {Object.values(FOOTER_SECTIONS).map((section) => (
            <div key={section.title}>
              <h4 className="mb-3 font-semibold text-on-surface">{section.title}</h4>
              <ul className="space-y-2 text-body-md text-on-surface-variant">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="transition-colors hover:text-primary"
                      onClick={(e) => handleLinkClick(e, link.href)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-outline-variant/20 pt-6 text-center text-label-caps text-on-surface-variant">
          &copy; 2026 ClarityNotes — 认知优先的设计革命
        </div>
      </div>
    </footer>
  );
}
