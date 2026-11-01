import { Routes, Route } from 'react-router-dom'
import RecipeBrowserPage from '@/pages/RecipeBrowserPage'
import RecipeDetailPage from '@/pages/RecipeDetailPage'
import RecipeFormPage from '@/pages/RecipeFormPage'
import DesignPage from '@/pages/DesignPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RecipeBrowserPage />} />
      <Route path="/recipes/new" element={<RecipeFormPage />} />
      <Route path="/recipes/:id" element={<RecipeDetailPage />} />
      <Route path="/recipes/:id/edit" element={<RecipeFormPage />} />
      <Route path="/design" element={<DesignPage />} />
    </Routes>
  )
}
