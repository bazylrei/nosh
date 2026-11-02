interface Props {
  steps: string[]
}

export default function MethodSteps({ steps }: Props) {
  return (
    <ol className="space-y-4">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-heading" aria-hidden="true">
            {i + 1}
          </span>
          <span className="sr-only">Step {i + 1}:</span>
          <p className="text-sm leading-relaxed pt-0.5">{step}</p>
        </li>
      ))}
    </ol>
  )
}
