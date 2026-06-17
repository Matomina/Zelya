import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-z-bg">
      <Header />
      <main className="flex-1" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  )
}
