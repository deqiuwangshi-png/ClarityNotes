interface LogoProps {
  href?: string;
}

export function Logo({ href = "/" }: LogoProps) {
  return (
    <a href={href} className="flex items-center gap-2 group cursor-pointer">
      <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
        <span
          className="material-symbols-outlined text-xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          draw
        </span>
      </div>
      <span className="font-bold text-headline-md tracking-tight text-primary">
        ClarityNotes
      </span>
    </a>
  );
}
