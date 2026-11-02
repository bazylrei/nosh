interface Props {
  costPerPerson: number
  serves: number
}

export default function CostBadge({ costPerPerson, serves }: Props) {
  const totalCost = costPerPerson * serves

  return (
    <span className="inline-flex items-center rounded-full border border-nosh-coral/40 bg-nosh-coral/10 px-2.5 py-0.5 text-xs font-semibold text-nosh-coral gap-1">
      ~£{costPerPerson.toFixed(2)}/person
      {serves > 1 && (
        <span className="opacity-70">· £{totalCost.toFixed(2)} total</span>
      )}
    </span>
  )
}
