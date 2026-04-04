import { useState } from 'react'
import { fetchJSON, ApiError } from '../utils/api'

interface SignUpData {
  email?: string
  password?: string
  confirmPassword?: string
}

interface SignUpResponse {
  message?: string
  data?: {
    token?: {
      accessToken?: string
      refreshToken?: string
    }
    user?: any
  }
}

const API_BASE_URL = 'https://tala-dev-api-26jt.onrender.com'

export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (data: SignUpData) => {
    setIsLoading(true)
    setError(null)
    try {
      const payload = {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }
      const response = await fetchJSON<SignUpResponse>(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      if (response.data?.token?.accessToken) {
        localStorage.setItem('tala_token', response.data.token.accessToken)
      }
      return { success: true, data: response }
    } catch (err: any) {
      let errorMessage = 'Something went wrong. Please try again.'

      if (err instanceof ApiError) {
        // Log the full error body to help debug 400 Bad Request
        console.error('Signup Error Full Body:', err.body)

        const rawMessage = err.body?.message || err.message || ''
        const lowerMsg = typeof rawMessage === 'string' ? rawMessage.toLowerCase() : ''

        if (lowerMsg && (lowerMsg.includes('email') && (lowerMsg.includes('exist') || lowerMsg.includes('taken')))) {
          errorMessage = 'An account with that email already exists.'
        } else if (rawMessage) {
          // If it's a validation error object, we might want to extract more detail or just show a general error
          errorMessage = 'We couldn\'t create your account at this time. Please check your details and try again.'
          if (lowerMsg && lowerMsg.includes('password') && lowerMsg.includes('character')) {
            errorMessage = 'Password does not meet requirements.'
          }
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

  return { isLoading, error, submit }
}
