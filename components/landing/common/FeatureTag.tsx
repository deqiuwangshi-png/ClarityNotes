interface FeatureTagProps {
  label: string;
  icon?: string;
}

export function FeatureTag({ label, icon }: FeatureTagProps) {
  return (
    <span className="rounded-full bg-surface-container px-3 py-1 inline-flex items-center gap-1">
      {icon && <span className="material-symbols-outlined text-[12px]">{icon}</span>}
      {label}
    </span>
  );
}
