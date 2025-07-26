import { z } from "zod";

export const naturalLanguageSchema = z
	.string()
	.trim()
	.min(1, { message: "Please enter a description (at least 1 character)." })
	.max(200, { message: "Input is too long (max 200 characters)." });
