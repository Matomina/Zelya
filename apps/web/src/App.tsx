import { Routes, Route } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import AgeGate from '@/components/AgeGate'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAgeGate } from '@/hooks/useAgeGate'
import { AuthProvider } from '@/contexts/AuthContext'

import HomePage from '@/pages/HomePage'
import ListingPage from '@/pages/ListingPage'
import ProfileDetailPage from '@/pages/ProfileDetailPage'
import SearchPage from '@/pages/SearchPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import ContactPage from '@/pages/ContactPage'
import OnlinePage from '@/pages/OnlinePage'
import NouveauxPage from '@/pages/NouveauxPage'
import EspaceCreateurPage from '@/pages/EspaceCreateurPage'
import MessagesPage from '@/pages/MessagesPage'
import { MentionsLegalesPage, ConfidentialitePage, CguPage } from '@/pages/LegalPage'

export default function App() {
  const { isConfirmed, isLoading, confirm, reject } = useAgeGate()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-z-bg flex items-center justify-center">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'rgba(139,92,246,0.6)', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  if (!isConfirmed) {
    return <AgeGate onConfirm={confirm} onReject={reject} />
  }

  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profils" element={<ListingPage />} />
          <Route path="/profil/:id" element={<ProfileDetailPage />} />
          <Route path="/recherche" element={<SearchPage />} />
          <Route path="/en-ligne" element={<OnlinePage />} />
          <Route path="/nouveaux" element={<NouveauxPage />} />
          <Route path="/connexion" element={<LoginPage />} />
          <Route path="/inscription" element={<RegisterPage />} />
          <Route
            path="/espace"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route path="/espace-createur" element={<EspaceCreateurPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
          <Route path="/confidentialite" element={<ConfidentialitePage />} />
          <Route path="/cgu" element={<CguPage />} />
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-[60vh] text-center px-4">
                <div className="animate-fade-in-scale">
                  <p
                    className="text-7xl font-black gradient-text mb-6"
                    style={{ letterSpacing: '-0.04em' }}
                  >
                    404
                  </p>
                  <p className="text-z-text text-xl font-bold mb-2">Page introuvable</p>
                  <p className="text-z-muted text-sm mb-8">
                    La page que vous recherchez n'existe pas.
                  </p>
                  <a href="/" className="btn-primary">
                    Retour à l'accueil
                  </a>
                </div>
              </div>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
