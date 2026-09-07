import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="relative flex h-6 w-6 items-center justify-center">
            <span className="absolute h-5 w-5 rotate-[-8deg] rounded-[3px] bg-line" />
            <span className="absolute h-5 w-5 rotate-[6deg] rounded-[3px] bg-ink" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-ink">
            Slate
          </span>
        </Link>

        <Link href="/create">
          <Button size="sm">Create Presentation</Button>
        </Link>
      </div>
    </header>
  );
}
