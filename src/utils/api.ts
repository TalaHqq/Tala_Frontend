export class ApiError extends Error {
  status: number
  body: any

  constructor(status: number, body: any) {
    super(body?.message || 'An unexpected error occurred')
    this.status = status
    this.body = body
    this.name = 'ApiError'
  }
}

export async function fetchJSON<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {})
  
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(url, { ...options, headers })

  if (!response.ok) {
    let body
    try {
      body = await response.json()
    } catch (e) {
      body = { message: 'Failed to parse error response' }
    }
    throw new ApiError(response.status, body)
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}
