import { useState } from 'react'
import { fetchJSON, ApiError, API_BASE_URL } from '../utils/api'

interface LoginData {
  email?: string
  password?: string
}

interface LoginResponse {
  message?: string
  data?: {
    token?: {
      accessToken?: string
      refreshToken?: string
    }
    user?: any
  }
}


export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (data: LoginData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetchJSON<LoginResponse>(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify(data)
      })

      if (response.data?.token?.accessToken) {
        localStorage.setItem('tala_token', response.data.token.accessToken)
      }
      return { success: true, data: response }
    } catch (err: any) {
      let errorMessage = 'Something went wrong. Please try again.'

      if (err instanceof ApiError) {
        console.error('Login Error Full Body:', err.body)
        
        const rawMessage = err.body?.message || err.message || ''
        const lowerMsg = typeof rawMessage === 'string' ? rawMessage.toLowerCase() : ''

        if (lowerMsg && (lowerMsg.includes('not confirmed') || lowerMsg.includes('not verified') || lowerMsg.includes('verify your email'))) {
          errorMessage = 'Please verify your email before logging in. Check your inbox for a confirmation link.'
        } else if (err.status === 401 || (lowerMsg && (lowerMsg.includes('invalid') || lowerMsg.includes('incorrect')))) {
          errorMessage = 'Incorrect email or password. Please try again.'
        } else if (err.status === 404 || (lowerMsg && (lowerMsg.includes('not found')))) {
          errorMessage = 'We couldn\'t find an account with that email.'
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
