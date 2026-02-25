const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  document.cookie = `access_token=${accessToken}; path=/`;
}

export function clearTokens(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

function buildHeaders(hasBody: boolean, customHeaders?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = { ...customHeaders };
  
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    throw new ApiError(response.status, response.statusText, data);
  }

  // Handle empty responses
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    setTokens(data.access_token, data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit,
  retry = true
): Promise<T> {
  const response = await fetch(url, options);

  // If unauthorized and retry enabled, try to refresh token
  if (response.status === 401 && retry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Update authorization header with new token
      const newHeaders = buildHeaders(!!options.body);
      return fetchWithRetry<T>(url, { ...options, headers: newHeaders }, false);
    }
    // Refresh failed, clear tokens and redirect to login
    clearTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }

  return handleResponse<T>(response);
}

export const apiClient = {
  get: async <T>(path: string, customHeaders?: Record<string, string>): Promise<T> => {
    if (!API_BASE) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
    
    return fetchWithRetry<T>(`${API_BASE}${path}`, {
      method: 'GET',
      credentials: 'include',
      headers: buildHeaders(false, customHeaders),
    });
  },

  post: async <TRequest, TResponse>(
    path: string,
    body: TRequest,
    customHeaders?: Record<string, string>
  ): Promise<TResponse> => {
    if (!API_BASE) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
    
    return fetchWithRetry<TResponse>(`${API_BASE}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: buildHeaders(true, customHeaders),
      body: JSON.stringify(body),
    });
  },

  put: async <TRequest, TResponse>(
    path: string,
    body: TRequest,
    customHeaders?: Record<string, string>
  ): Promise<TResponse> => {
    if (!API_BASE) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
    
    return fetchWithRetry<TResponse>(`${API_BASE}${path}`, {
      method: 'PUT',
      credentials: 'include',
      headers: buildHeaders(true, customHeaders),
      body: JSON.stringify(body),
    });
  },

  patch: async <TRequest, TResponse>(
    path: string,
    body: TRequest,
    customHeaders?: Record<string, string>
  ): Promise<TResponse> => {
    if (!API_BASE) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
    
    return fetchWithRetry<TResponse>(`${API_BASE}${path}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: buildHeaders(true, customHeaders),
      body: JSON.stringify(body),
    });
  },

  delete: async <T>(path: string, customHeaders?: Record<string, string>): Promise<T> => {
    if (!API_BASE) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
    
    return fetchWithRetry<T>(`${API_BASE}${path}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: buildHeaders(false, customHeaders),
    });
  },

  upload: async <T>(
    path: string,
    formData: FormData,
    customHeaders?: Record<string, string>
  ): Promise<T> => {
    if (!API_BASE) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
    
    const token = getAccessToken();
    const headers: Record<string, string> = { ...customHeaders };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Don't set Content-Type for FormData - browser will set it with boundary
    
    return fetchWithRetry<T>(`${API_BASE}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: formData,
    });
  },
};

// Legacy exports for backward compatibility
export const apiGet = apiClient.get;
export const apiPost = apiClient.post;
