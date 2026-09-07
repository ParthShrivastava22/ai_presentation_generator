import { SiteHeader } from "@/components/site-header";
import { PresentationForm } from "@/components/create/presentation-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Describe your presentation
          </h1>
          <p className="text-sm text-muted">
            Give Slate a topic and a few details, and it will draft a structured
            outline you can refine.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Presentation details</CardTitle>
            <CardDescription>
              These fields shape the structure Slate generates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PresentationForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
