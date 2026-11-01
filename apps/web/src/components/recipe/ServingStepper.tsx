import { Button } from '@/components/ui/button'

interface Props {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
}

export default function ServingStepper({ value, min = 1, max = 12, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        aria-label="Decrease serves"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        −
      </Button>
      <span className="w-6 text-center text-lg font-heading" aria-label={`${value} serves`}>{value}</span>
      <Button
        variant="outline"
        size="icon"
        aria-label="Increase serves"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        +
      </Button>
    </div>
  )
}
