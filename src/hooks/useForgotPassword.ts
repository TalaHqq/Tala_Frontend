import { useState } from 'react'
import { fetchJSON, ApiError } from '../utils/api'

interface ForgotPasswordData {
  email: string
}

interface ForgotPasswordResponse {
  message?: string
}

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const submit = async (data: ForgotPasswordData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const response = await fetchJSON<ForgotPasswordResponse>('https://tala-dev-api-26jt.onrender.com/api/auth/request-password-reset', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      setSuccess(true)
      return { success: true, data: response }
    } catch (err: any) {
      let errorMessage = 'Something went wrong. Please try again.'

      if (err instanceof ApiError) {
        console.error('Forgot Password Error Full Body:', err.body)
        const rawMessage = err.body?.message || err.message || ''
        const lowerMsg = typeof rawMessage === 'string' ? rawMessage.toLowerCase() : ''

        if (err.status === 404 || (lowerMsg && (lowerMsg.includes('not found') || lowerMsg.includes('no account')))) {
          errorMessage = 'We couldn\'t find an account with that email.'
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
