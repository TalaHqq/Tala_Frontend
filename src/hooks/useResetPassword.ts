import { useState } from 'react'
import { fetchJSON, ApiError } from '../utils/api'

interface ResetPasswordData {
  token: string
  password?: string
  confirmPassword?: string
}

interface ResetPasswordResponse {
  message?: string
}

export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const submit = async (data: ResetPasswordData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const response = await fetchJSON<ResetPasswordResponse>(`https://tala-dev-api-26jt.onrender.com/api/auth/reset-password?token=${data.token}`, {
        method: 'POST',
        body: JSON.stringify({
          newPassword: data.password,
          confirmPassword: data.confirmPassword
        })
      })

      setSuccess(true)
      return { success: true, data: response }
    } catch (err: any) {
      let errorMessage = 'Something went wrong. Please try again.'

      if (err instanceof ApiError) {
        console.error('Reset Password Error Full Body:', err.body)
        const rawMessage = err.body?.message || err.message || ''
        const lowerMsg = typeof rawMessage === 'string' ? rawMessage.toLowerCase() : ''

        if (err.status === 400 && lowerMsg.includes('token')) {
          errorMessage = 'The reset link is invalid or has expired.'
        } else if (rawMessage) {
          errorMessage = rawMessage
        }
      } else if (err.message) {
        if (err.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        }
      }

      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, error, success, submit }
}
