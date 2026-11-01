import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  steps: string[]
  onChange: (steps: string[]) => void
}

export default function MethodFields({ steps, onChange }: Props) {
  function update(index: number, value: string) {
    onChange(steps.map((s, i) => (i === index ? value : s)))
  }

  function remove(index: number) {
    onChange(steps.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-2 items-start">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm mt-2">
            {i + 1}
          </span>
          <Textarea
            placeholder="Step description…"
            value={step}
            onChange={(e) => update(i, e.target.value)}
            rows={2}
            className="flex-1 resize-none"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove step"
            onClick={() => remove(i)}
            disabled={steps.length === 1}
            className="mt-2"
          >
            ×
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...steps, ''])}>
        + Add step
      </Button>
    </div>
  )
}
