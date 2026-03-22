import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { SignUpPage } from './pages/SignUpPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { LibraryPage } from './pages/LibraryPage'
import { LoadingPage } from './pages/LoadingPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/library" element={<LibraryPage />} />
      <Route path="/loading" element={<LoadingPage />} />
      
      {/* TODO: Add protected route logic in task 0.4. For now, redirect unauthenticated users to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
