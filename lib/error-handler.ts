/**
 * Error handling utilities for API routes and fetch operations
 */

export class TimeoutError extends Error {
  constructor(message: string = "Request timed out") {
    super(message);
    this.name = "TimeoutError";
  }
}

export class FetchError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public cause?: Error,
  ) {
    super(message);
    this.name = "FetchError";
  }
}

/**
 * Handle and log fetch errors with proper categorization
 */
export function handleFetchError(
  error: unknown,
  context: string = "Fetch Operation",
) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    context,
    error: null as Record<string, unknown> | null,
  };

  if (error instanceof Error) {
    errorLog.error = {
      name: error.name,
      message: error.message,
      cause: error.cause ? String(error.cause) : null,
    };

    // Log timeout errors (common with slow external images)
    if (
      error.message.includes("timeout") ||
      error.message.includes("ETIMEDOUT")
    ) {
      console.warn(
        `[TIMEOUT] ${context}: ${error.message}. Consider using unoptimized images or increasing timeout.`,
      );
      return {
        error:
          "Request timed out. This is likely a slow external image source.",
        retry: true,
        statusCode: 504,
      };
    }

    // Log network errors
    if (
      error.message.includes("fetch failed") ||
      error.message.includes("network")
    ) {
      console.warn(
        `[NETWORK_ERROR] ${context}: ${error.message}. Check network connectivity.`,
      );
      return {
        error: "Network error occurred",
        retry: true,
        statusCode: 503,
      };
    }
  }

  console.error(`[ERROR] ${context}:`, errorLog.error);
  return {
    error: "An unexpected error occurred",
    retry: false,
    statusCode: 500,
  };
}

/**
 * Retry logic for failed requests
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelayMs: number = 1000,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxAttempts) {
        const delayMs = baseDelayMs * Math.pow(2, attempt - 1);
        console.warn(
          `Attempt ${attempt} failed. Retrying in ${delayMs}ms...`,
          lastError.message,
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError || new Error("Max attempts reached");
}
