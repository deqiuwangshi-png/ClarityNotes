import Image from "next/image";

interface LogoProps {
  href?: string;
}

export function Logo({ href = "/" }: LogoProps) {
  return (
    <a href={href} className="flex items-center gap-2.5 group cursor-pointer">
      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-xl shadow-sm">
        <Image
          src="/1.svg"
          alt="ClarityNotes"
          fill
          className="object-cover"
          sizes="32px"
        />
      </div>
      <span className="font-bold text-headline-md tracking-tight text-primary">
        ClarityNotes
      </span>
    </a>
  );
}
