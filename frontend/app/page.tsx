import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { HeroVisual } from "@/components/landing/hero-visual";
import { WorkflowSteps } from "@/components/landing/workflow-steps";

export default function Home() {
  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />

      <main>
        <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-2 lg:items-center lg:gap-8">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Create beautiful presentations with AI
            </h1>
            <p className="max-w-md text-base leading-relaxed text-muted">
              Turn a topic or idea into a structured presentation in minutes.
              Slate drafts the outline and slides for you, so you can start
              customizing right away instead of starting from a blank page.
            </p>
            <div>
              <Link href="/create">
                <Button size="lg">Create Presentation</Button>
              </Link>
            </div>
          </div>

          <HeroVisual />
        </section>

        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <WorkflowSteps />
          </div>
        </section>
      </main>
    </div>
  );
}
