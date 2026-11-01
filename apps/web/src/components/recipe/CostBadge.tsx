interface Props {
  costPerPerson: number
  serves: number
}

export default function CostBadge({ costPerPerson, serves }: Props) {
  const totalCost = costPerPerson * serves

  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground gap-1">
      ~£{costPerPerson.toFixed(2)}/person
      {serves > 1 && (
        <span className="text-muted-foreground/60">· £{totalCost.toFixed(2)} total</span>
      )}
    </span>
  )
}
