/**
 * Result object for rate limit checking operations.
 */
export interface RateLimitResult {
	rateLimited: boolean;
	status: number;
	details?: string | object;
}

/**
 * Response structure from the health endpoint containing rate limit information.
 */
export interface HealthResponse {
	status: string;
	rateLimit?: {
		perUser?: {
			max: number;
			windowMs: number;
			currentUsers: number;
		};
		daily?: {
			limit: number;
			used: number;
			remaining: number;
			date: string;
		};
	};
}

/**
 * Generic result structure for API requests.
 * @template T - The expected type of the response data
 */
export interface ApiRequestResult<T> {
	data?: T;
	error?: string;
	status: number;
}

/**
 * Successful API response containing the generated cron expression.
 */
export interface ApiSuccess {
	cron: string;
	model: string;
	input: string;
}

/**
 * Error response from the API with optional rate limiting information.
 */
export interface ApiError {
	error: string;
	details?: unknown;
	rateLimitType?: "perUser" | "daily";
}

/**
 * Extended error response for rate limiting scenarios.
 */
export interface RateLimitError extends ApiError {
	rateLimitType: "perUser" | "daily";
	details: {
		daily: {
			count: number;
			date: string;
			remaining: number;
		};
		perUser: {
			maxPerHour: number;
			windowMs: number;
		};
	};
}

/**
 * Union type representing either a successful response or an error.
 */
export type ApiResponse = ApiSuccess | ApiError;

/**
 * Request payload for translation operations.
 */
export interface TranslateRequest {
	input: string;
}
