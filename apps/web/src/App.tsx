import { Routes, Route } from 'react-router-dom'
import DesignPage from '@/pages/DesignPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<div className="p-8 font-heading text-2xl text-nosh-green">Nosh is alive 🌿</div>} />
      <Route path="/design" element={<DesignPage />} />
    </Routes>
  )
}
