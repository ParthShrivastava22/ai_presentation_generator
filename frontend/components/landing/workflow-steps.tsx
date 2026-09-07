const steps = [
  {
    number: "1",
    title: "Describe your presentation",
    description: "Tell Slate the topic, audience, and tone you want.",
  },
  {
    number: "2",
    title: "Let AI structure it",
    description:
      "Slate turns your description into a structured slide outline.",
  },
  {
    number: "3",
    title: "Customize and export",
    description: "Refine the content and layout, then export when it's ready.",
  },
];

export function WorkflowSteps() {
  return (
    <div className="grid gap-8 sm:grid-cols-3">
      {steps.map((step) => (
        <div key={step.number} className="flex flex-col gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-sm font-medium text-ink">
            {step.number}
          </div>
          <h3 className="text-base font-medium text-ink">{step.title}</h3>
          <p className="text-sm leading-relaxed text-muted">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );
}
