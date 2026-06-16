// App.tsx
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { SignUpPage } from './pages/SignUpPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { LibraryPage } from './pages/LibraryPage'
import { LoadingPage } from './pages/LoadingPage'
import { ProfilePage } from './pages/ProfilePage'
import { TimelinePage } from './pages/TimelinePage'
import { WorkspacePage } from './pages/WorkspacePage'
import { SettingsPage } from './pages/SettingsPage'
import { BillingPage } from './pages/BillingPage'
import { TeamsPage } from './pages/TeamsPage'
import {HomePage} from './pages/HomePage'

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
        path="/home" 
        element={<HomePage sidebarExpanded={sidebarExpanded} onToggleSidebar={handleToggleSidebar} />} 
      />
      <Route 
        path="/library" 
        element={<LibraryPage sidebarExpanded={sidebarExpanded} onToggleSidebar={handleToggleSidebar} />} 
      />
      <Route 
        path="/timeline" 
        element={<TimelinePage sidebarExpanded={sidebarExpanded} onToggleSidebar={handleToggleSidebar} />} 
      />
      <Route 
        path="/teams" 
        element={<TeamsPage sidebarExpanded={sidebarExpanded} onToggleSidebar={handleToggleSidebar} />} 
      />
      <Route 
        path="/workspace" 
        element={<WorkspacePage sidebarExpanded={sidebarExpanded} onToggleSidebar={handleToggleSidebar} />} 
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

      <Route path="*" element={<LoginPage />}/> 
    </Routes>
  )
}

export default App