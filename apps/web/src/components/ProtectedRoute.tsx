import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: 'rgba(139,92,246,0.6)', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/connexion" state={{ from: location }} replace />
  }

  return <>{children}</>
}
