import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import AdminLayout from '@/layouts/AdminLayout'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import UsersPage from '@/pages/UsersPage'
import ProfilesPage from '@/pages/ProfilesPage'
import ReportsPage from '@/pages/ReportsPage'
import MediaModerationPage from '@/pages/MediaModerationPage'
import LegalPage from '@/pages/LegalPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-z-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-z-violet border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="profiles" element={<ProfilesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="media" element={<MediaModerationPage />} />
        <Route path="legal" element={<LegalPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
