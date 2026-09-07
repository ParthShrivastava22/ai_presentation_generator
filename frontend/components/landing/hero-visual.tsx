export function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto h-[320px] w-full max-w-sm sm:h-[380px]"
    >
      {/* back card */}
      <div className="absolute left-1/2 top-6 h-[220px] w-[260px] -translate-x-1/2 -rotate-6 rounded-xl border border-line bg-paper shadow-sm sm:h-[250px] sm:w-[290px]">
        <div className="m-4 h-2 w-16 rounded-full bg-line" />
        <div className="mx-4 mt-3 h-2 w-24 rounded-full bg-line" />
        <div className="mx-4 mt-2 h-2 w-20 rounded-full bg-line" />
      </div>

      {/* middle card */}
      <div className="absolute left-1/2 top-10 h-[220px] w-[260px] -translate-x-1/2 rotate-2 rounded-xl bg-ink shadow-md sm:h-[250px] sm:w-[290px]">
        <div className="m-4 h-2 w-14 rounded-full bg-accent-warm" />
        <div className="mx-4 mt-4 flex items-end gap-2">
          <div className="h-10 w-4 rounded-sm bg-white/20" />
          <div className="h-16 w-4 rounded-sm bg-white/30" />
          <div className="h-8 w-4 rounded-sm bg-white/20" />
          <div className="h-14 w-4 rounded-sm bg-white/40" />
        </div>
      </div>

      {/* front card */}
      <div className="absolute left-1/2 top-16 h-[220px] w-[260px] -translate-x-1/2 rotate-[-2deg] rounded-xl border border-line bg-white shadow-lg sm:h-[250px] sm:w-[290px]">
        <div className="m-4 h-2 w-20 rounded-full bg-accent" />
        <div className="mx-4 mt-4 h-2 w-full max-w-[200px] rounded-full bg-line" />
        <div className="mx-4 mt-2 h-2 w-[160px] rounded-full bg-line" />
        <div className="mx-4 mt-2 h-2 w-[180px] rounded-full bg-line" />
      </div>
    </div>
  );
}
