const URL_REGEX = /https?:\/\//;
const STATUS_CODE_REGEX = /\d{3}/;

export function getApiErrorMessage(err: unknown): string {
	if (typeof err === "string") {
		if (
			err.length < 100 &&
			!URL_REGEX.test(err) &&
			!STATUS_CODE_REGEX.test(err)
		) {
			return err;
		}
		return "Sorry, something went wrong. Please try again or contact support.";
	}
	if (err instanceof Error) {
		if (
			err.message.length < 100 &&
			!URL_REGEX.test(err.message) &&
			!STATUS_CODE_REGEX.test(err.message)
		) {
			return err.message;
		}
		return "Sorry, something went wrong. Please try again or contact support.";
	}

	if (typeof err === "object" && err !== null) {
		if (
			"error" in err &&
			typeof (err as Record<string, unknown>).error === "string"
		) {
			const msg = (err as Record<string, unknown>).error as string;
			if (
				msg.length < 100 &&
				!URL_REGEX.test(msg) &&
				!STATUS_CODE_REGEX.test(msg)
			)
				return msg;
			return "Sorry, something went wrong. Please try again or contact support.";
		}
		if (
			"message" in err &&
			typeof (err as Record<string, unknown>).message === "string"
		) {
			const msg = (err as Record<string, unknown>).message as string;
			if (
				msg.length < 100 &&
				!URL_REGEX.test(msg) &&
				!STATUS_CODE_REGEX.test(msg)
			)
				return msg;
			return "Sorry, something went wrong. Please try again or contact support.";
		}
	}
	return "An unexpected error occurred. Please try again or contact support.";
}
