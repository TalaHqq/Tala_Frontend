// App.tsx
import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { SignUpPage } from './pages/SignUpPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { LibraryPage } from './pages/LibraryPage'
import { LoadingPage } from './pages/LoadingPage'
import { ProfilePage } from './pages/ProfilePage'
import { TimelinePage } from './pages/TimelinePage'
import { TeamsPage } from './pages/TeamsPage'
import { SettingsPage } from './pages/SettingsPage'
import { BillingPage } from './pages/BillingPage'

function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  const handleToggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route 
        path="/library" 
        element={<LibraryPage sidebarExpanded={sidebarExpanded} onToggleSidebar={handleToggleSidebar} />} 
      />
      <Route 
        path="/timeline" 
        element={<TimelinePage sidebarExpanded={sidebarExpanded} onToggleSidebar={handleToggleSidebar} />} 
      />
      <Route 
        path="/team" 
        element={<TeamsPage sidebarExpanded={sidebarExpanded} onToggleSidebar={handleToggleSidebar} />} 
      />
      <Route 
        path="/settings" 
        element={<SettingsPage sidebarExpanded={sidebarExpanded} onToggleSidebar={handleToggleSidebar} />} 
      />
      <Route 
        path="/billing" 
        element={<BillingPage sidebarExpanded={sidebarExpanded} onToggleSidebar={handleToggleSidebar} />} 
      />
      <Route 
        path="/profile" 
        element={<ProfilePage sidebarExpanded={sidebarExpanded} onToggleSidebar={handleToggleSidebar} />} 
      />
      <Route 
        path="/profile/:username" 
        element={<ProfilePage sidebarExpanded={sidebarExpanded} onToggleSidebar={handleToggleSidebar} />} 
      />
      <Route path="/loading" element={<LoadingPage />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App