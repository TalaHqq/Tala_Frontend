import { useState } from 'react'
import { fetchJSON, ApiError } from '../utils/api'

interface SignUpData {
  name?: string
  email?: string
  password?: string
}

interface SignUpResponse {
  message?: string
  token?: string
  user?: any
}

export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (data: SignUpData) => {
    setIsLoading(true)
    setError(null)
    try {
      // Map 'name' to 'full_name' as required by the API schema
      const payload = {
        full_name: data.name,
        email: data.email,
        password: data.password,
      }
      const response = await fetchJSON<SignUpResponse>('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      if (response.token) {
        localStorage.setItem('tala_token', response.token)
      }
      return { success: true, data: response }
    } catch (err: any) {
      let errorMessage = 'Something went wrong. Please try again.'
      
      if (err instanceof ApiError) {
        const rawMessage = err.body?.message || err.message || ''
        const lowerMsg = rawMessage.toLowerCase()
        
        if (lowerMsg.includes('email') && (lowerMsg.includes('exist') || lowerMsg.includes('taken'))) {
          errorMessage = 'An account with that email already exists.'
        } else if (rawMessage) {
           // Provide safe fallback mapping for normal errors, but stay calm and abstract
           errorMessage = 'We couldn\'t create your account at this time. Please check your details and try again.'
           if (lowerMsg.includes('password') && lowerMsg.includes('character')) {
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
