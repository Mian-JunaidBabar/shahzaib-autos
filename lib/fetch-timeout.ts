/**
 * Hook and utility functions to handle fetch timeouts gracefully
 */

export const FETCH_TIMEOUT_MS = 30000; // 30 seconds

/**
 * Wrapper for fetch with timeout handling
 */
export async function fetchWithTimeout(
  url: string,
  options?: RequestInit,
  timeout: number = FETCH_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `Fetch request timed out after ${timeout}ms for URL: ${url}`,
      );
    }
    throw error;
  }
}

export default fetchWithTimeout;
