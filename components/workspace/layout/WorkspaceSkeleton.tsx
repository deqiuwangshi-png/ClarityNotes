"use client";

export function WorkspaceSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-[280px] space-y-3 p-5 animate-pulse">
        <div className="h-8 bg-mint-border/20 rounded" />
        <div className="h-8 bg-mint-border/20 rounded" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-6 bg-mint-border/10 rounded ml-4" />
        ))}
      </div>
      <div className="flex-1 p-6 space-y-3 animate-pulse">
        <div className="h-4 w-48 bg-mint-border/20 rounded" />
        <div className="h-8 w-64 bg-mint-border/20 rounded" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-mint-border/10 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
