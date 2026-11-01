import { Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<div className="p-8 font-heading text-2xl text-nosh-green">Nosh is alive 🌿</div>} />
      </Routes>
    </div>
  )
}
