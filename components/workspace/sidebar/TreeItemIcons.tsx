"use client";

export function FolderIcon({ selected }: { selected: boolean }) {
  const fill = selected ? "#007A66" : "#6B7280";
  const innerFill = selected ? "#E4F5EF" : "#F6FAF8";
  return (
    <svg aria-hidden="true" className="size-[18px] shrink-0" fill="none" viewBox="0 0 20 20">
      <path d="M2.75 5.75c0-.83.67-1.5 1.5-1.5h3.1c.43 0 .84.18 1.12.5l.92 1h6.36c.83 0 1.5.67 1.5 1.5v1.1H2.75v-2.6Z" fill={fill} opacity="0.18" />
      <path d="M2.75 7.25h14.5v6.5c0 .83-.67 1.5-1.5 1.5H4.25c-.83 0-1.5-.67-1.5-1.5v-6.5Z" fill={innerFill} />
      <path d="M2.75 7.25v-1.5c0-.83.67-1.5 1.5-1.5h3.1c.43 0 .84.18 1.12.5l.92 1h6.36c.83 0 1.5.67 1.5 1.5v6.5c0 .83-.67 1.5-1.5 1.5H4.25c-.83 0-1.5-.67-1.5-1.5v-6.5Z" stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
    </svg>
  );
}

export function FileIcon({ selected }: { selected: boolean }) {
  const fill = selected ? "#007A66" : "#6B7280";
  const innerFill = selected ? "#E4F5EF" : "#FFFFFF";
  return (
    <svg aria-hidden="true" className="size-[18px] shrink-0" fill="none" viewBox="0 0 20 20">
      <path d="M5 2.75h6.5L15 6.25v11H5v-14Z" fill={innerFill} />
      <path d="M11.5 2.75v3.5H15M5 2.75h6.5L15 6.25v11H5v-14Z" stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
      <path d="M7.5 9.25h5M7.5 12h5" stroke={fill} strokeLinecap="round" strokeWidth="1.2" />
    </svg>
  );
}
