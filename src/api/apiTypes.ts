export interface ApiSuccess {
	cron: string;
	model: string;
	input: string;
}

export interface ApiError {
	error: string;
	details?: unknown;
}

export type ApiResponse = ApiSuccess | ApiError;

export interface TranslateRequest {
	input: string;
}
