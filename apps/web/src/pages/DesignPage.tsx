import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const BRAND_COLORS = [
  { name: 'Nosh Green', hex: '#62CC9B', token: 'nosh-green', role: 'Primary' },
  { name: 'Deep Teal', hex: '#3AA58F', token: 'nosh-teal', role: 'Secondary' },
  { name: 'Nosh Charcoal', hex: '#2E373E', token: 'nosh-charcoal', role: 'Background' },
  { name: 'Flame Coral', hex: '#F3764B', token: 'nosh-coral', role: 'Accent' },
  { name: 'Leaf', hex: '#D5C52D', token: 'nosh-leaf', role: 'Accent' },
  { name: 'Cloud Grey', hex: '#B7BFC0', token: 'nosh-grey', role: 'Muted' },
] as const

const DIETARY_BADGES = ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Halal']

export default function DesignPage() {
  return (
    <div className="min-h-screen bg-background p-8 space-y-16">
      <header>
        <h1 className="text-4xl font-heading text-nosh-green">Nosh Design System</h1>
        <p className="text-muted-foreground mt-2">Brand tokens, typography, and components</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-heading">Colour Palette</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {BRAND_COLORS.map(({ name, hex, token, role }) => (
            <div key={token} className="space-y-2">
              <div
                className="h-20 w-full rounded-lg border border-border"
                style={{ backgroundColor: hex }}
              />
              <div>
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-xs text-muted-foreground mt-1">{hex}</p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-2xl font-heading">Typography</h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Nunito Bold — heading</p>
            <h1 className="text-5xl font-heading">Heading 1</h1>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Nunito Bold — heading</p>
            <h2 className="text-3xl font-heading">Heading 2</h2>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Nunito Bold — heading</p>
            <h3 className="text-xl font-heading">Heading 3</h3>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Nunito Sans — body</p>
            <p className="text-base font-body">
              Nosh helps food banks and community kitchens plan nutritious, culturally inclusive
              meals. Body text is set in Nunito Sans at comfortable reading sizes.
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Nunito Sans — small / muted</p>
            <p className="text-sm text-muted-foreground">
              Serves 4 · 30 min · Vegetarian
            </p>
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-2xl font-heading">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button size="lg">Large</Button>
          <Button>Default</Button>
          <Button size="sm">Small</Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-2xl font-heading">Badges</h2>
        <div className="flex flex-wrap gap-2">
          {DIETARY_BADGES.map((label) => (
            <Badge key={label}>{label}</Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-2xl font-heading">Cards</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle>Jollof Rice</CardTitle>
                <Badge>Dinner</Badge>
              </div>
              <CardDescription>West African · Serves 4</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                A one-pot tomato rice dish fragrant with thyme and bay leaf.
                Popular across West Africa.
              </p>
              <div className="flex gap-2 mt-4">
                <Badge variant="outline">Vegan</Badge>
                <Badge variant="outline">Gluten-free</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle>Lentil Dahl</CardTitle>
                <Badge>Lunch</Badge>
              </div>
              <CardDescription>South Asian · Serves 6</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Warming red lentil dahl with cumin, turmeric, and fresh coriander.
              </p>
              <div className="flex gap-2 mt-4">
                <Badge variant="outline">Vegan</Badge>
                <Badge variant="outline">Dairy-free</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle>Shakshuka</CardTitle>
                <Badge>Breakfast</Badge>
              </div>
              <CardDescription>Middle Eastern · Serves 2</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Eggs poached in a spiced tomato and pepper sauce. Serve with flatbread.
              </p>
              <div className="flex gap-2 mt-4">
                <Badge variant="outline">Vegetarian</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
