const API_URL = 'http://localhost:5049/api'

function getAuthHeaders(): HeadersInit {
  const stored = localStorage.getItem('currentUser')
  if (!stored) return {}

  try {
    const user = JSON.parse(stored) as { token?: string }
    if (user?.token) {
      return { Authorization: `Bearer ${user.token}` }
    }
  } catch {
    return {}
  }

  return {}
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(init.headers ?? {}),
    },
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    try {
      const body = (await response.json()) as { message?: string }
      if (body?.message) message = body.message
    } catch {
      // keep fallback message
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
