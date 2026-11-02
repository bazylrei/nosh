import { QRCodeSVG } from 'qrcode.react'

const APP_URL = 'https://nosh-lac.vercel.app/'

export default function QRPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-heading text-nosh-green">Nosh</h1>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <QRCodeSVG value={APP_URL} size={240} />
      </div>
      <p className="text-sm text-muted-foreground">{APP_URL}</p>
    </div>
  )
}
