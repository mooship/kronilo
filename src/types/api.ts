export interface RateLimitResult {
	rateLimited: boolean;
	status: number;
	details?: string | object;
}

export interface HealthResponse {
	status: "ok" | "error";
	error?: string;
	rateLimit?: {
		perUser: {
			max: number;
			windowMs: number;
		};
		daily: {
			limit: number;
			used: number;
			remaining: number;
			date: string;
		};
	};
}

export interface ApiRequestResult<T> {
	data?: T;
	error?: string;
	status: number;
}

export interface ApiSuccess {
	cron: string;
	model: string;
	input: string;
	language: string;
}

export interface ApiError {
	error: string;
	details?: unknown;
	rateLimitType?: "perUser" | "daily";
}

export interface RateLimitError extends ApiError {
	rateLimitType: "perUser" | "daily";
	details: {
		daily: {
			limit: number;
			used: number;
			remaining: number;
			date: string;
		};
		perUser: {
			maxPerHour: number;
			windowMs: number;
		};
	};
}

export type ApiResponse = ApiSuccess | ApiError;
export interface TranslateRequest {
	input: string;
	language?: string;
}
