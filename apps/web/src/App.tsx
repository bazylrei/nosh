import { Routes, Route } from 'react-router-dom'
import RecipeBrowserPage from '@/pages/RecipeBrowserPage'
import DesignPage from '@/pages/DesignPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RecipeBrowserPage />} />
      <Route path="/design" element={<DesignPage />} />
    </Routes>
  )
}
