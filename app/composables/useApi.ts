import { resolveApiBase } from '~/utils/apiBase'

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

type QueryParams = Record<string, string | number | boolean | null | undefined>

function buildUrl(baseUrl: string, path: string, query?: QueryParams) {
  const normalizedBase = baseUrl.replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${normalizedBase}${normalizedPath}`)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') continue
      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
}

export const useApi = () => {
  const config = useRuntimeConfig()

  function getBaseUrl() {
    return resolveApiBase(String(config.public.apiBase ?? ''))
  }

  async function request<T>(
    method: 'GET' | 'POST',
    path: string,
    options?: {
      query?: QueryParams
      body?: Record<string, unknown>
    }
  ): Promise<T> {
    try {
      return await $fetch<T>(buildUrl(getBaseUrl(), path, options?.query), {
        method,
        body: options?.body,
      })
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'statusCode' in error) {
        const fetchError = error as {
          statusCode?: number
          data?: unknown
          message?: string
        }

        throw new ApiError(
          fetchError.message ??
            `Request failed with status ${fetchError.statusCode}`,
          fetchError.statusCode,
          fetchError.data
        )
      }

      throw new ApiError(
        error instanceof Error
          ? error.message
          : 'An unexpected API error occurred'
      )
    }
  }

  function get<T>(path: string, query?: QueryParams) {
    return request<T>('GET', path, { query })
  }

  function post<T>(
    path: string,
    body?: Record<string, unknown>,
    query?: QueryParams
  ) {
    return request<T>('POST', path, { query, body })
  }

  return { get, post, getBaseUrl }
}
