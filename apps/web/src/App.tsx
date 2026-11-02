import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import RecipeBrowserPage from '@/pages/RecipeBrowserPage'
import RecipeDetailPage from '@/pages/RecipeDetailPage'
import RecipeFormPage from '@/pages/RecipeFormPage'
import PreferencesPage from '@/pages/PreferencesPage'
import PlannerPage from '@/pages/PlannerPage'
import ShoppingListPage from '@/pages/ShoppingListPage'
import DesignPage from '@/pages/DesignPage'
import QRPage from '@/pages/QRPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<RecipeBrowserPage />} />
        <Route path="/recipes/new" element={<RecipeFormPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/recipes/:id/edit" element={<RecipeFormPage />} />
        <Route path="/preferences" element={<PreferencesPage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/shopping-list" element={<ShoppingListPage />} />
        <Route path="/design" element={<DesignPage />} />
        <Route path="/qr" element={<QRPage />} />
      </Routes>
    </Layout>
  )
}
