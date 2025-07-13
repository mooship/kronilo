import clsx from "clsx";
import type { FC } from "react";
import { useMemo, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useClickAway } from "react-use";
import { usePressAnimation } from "../hooks/usePressAnimation";
import { useKroniloStore } from "../store";
import type { CronInputProps } from "../types/components";
import { CRON_SUGGESTIONS } from "../utils/cronValidation";
import { CopyButton } from "./CopyButton";
import { ModeToggle } from "./ModeToggle";

/**
 * Input component for entering and editing cron expressions.
 * Features include validation feedback, suggestion dropdown, keyboard shortcuts,
 * and integration with the application's mode toggle.
 *
 * @param error - Optional error message to display when the cron expression is invalid
 *
 * @example
 * ```tsx
 * <CronInput error={validationError} />
 * ```
 */
export const CronInput: FC<CronInputProps> = ({ error }) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const suggestionsRef = useRef<HTMLDivElement>(null);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const infoAnim = usePressAnimation();
	const cron = useKroniloStore((s) => s.cron);
	const setCron = useKroniloStore((s) => s.setCron);

	useClickAway(suggestionsRef, () => {
		setShowSuggestions(false);
	});

	const inputClassName = useMemo(() => {
		const baseClasses =
			"input input-bordered bg-gray-50 text-gray-900 placeholder-gray-500 font-mono text-lg px-4 py-3 flex-1 min-w-0 h-12 rounded-xl border-2 transition-colors duration-200 focus:outline-none dark:bg-neutral-800 dark:text-neutral-50 dark:placeholder-gray-400";
		const errorClasses =
			"border-yellow-400/40 bg-yellow-100 dark:border-yellow-600/40 dark:bg-yellow-900";
		const normalClasses =
			"border-gray-200 hover:border-gray-400 focus:border-gray-600 dark:border-neutral-700 dark:hover:border-neutral-500 dark:focus:border-neutral-400";

		return clsx(baseClasses, error ? errorClasses : normalClasses);
	}, [error]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.ctrlKey && e.key === "a") {
			e.preventDefault();
			e.currentTarget.select();
		}

		if (e.key === "Escape") {
			setShowSuggestions(false);
		}
	};

	const handleFocus = () => {
		if (!cron) {
			setShowSuggestions(true);
		}
	};

	const handleSuggestionClick = (
		suggestion: (typeof CRON_SUGGESTIONS)[number],
	) => {
		setCron(suggestion.expression);
		setShowSuggestions(false);
		inputRef.current?.focus();
	};

	return (
		<div className="mb-8 flex flex-col w-full">
			<div className="flex items-center justify-between mb-6 w-full">
				<label
					htmlFor="cron-input"
					className="block text-xl font-semibold text-black dark:text-neutral-50"
				>
					Cron Expression
				</label>
				<ModeToggle />
			</div>
			<div className="relative flex items-center justify-center gap-3 w-full">
				<button
					type="button"
					className={clsx(
						"flex items-center focus:outline-none shrink-0 transition-transform duration-100",
						infoAnim.isPressed && "scale-95",
					)}
					data-tooltip-id="cron-placeholder-tip"
					data-tooltip-content="*/5 * * * *  →  every 5 minutes (minute hour day month weekday)"
					aria-label="Cron format info"
					tabIndex={0}
					onMouseDown={infoAnim.handlePressStart}
					onMouseUp={infoAnim.handlePressEnd}
					onMouseLeave={infoAnim.handlePressEnd}
					onBlur={infoAnim.handlePressEnd}
					onTouchStart={infoAnim.handlePressStart}
					onTouchEnd={infoAnim.handlePressEnd}
				>
					<svg
						className="w-6 h-6 text-black hover:text-gray-600 focus:text-gray-600 transition-colors dark:text-gray-100 dark:hover:text-gray-400 dark:focus:text-gray-400"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path
							fillRule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
							clipRule="evenodd"
						/>
					</svg>
				</button>
				<div className="relative flex-1 min-w-0 w-full">
					<input
						ref={inputRef}
						id="cron-input"
						name="cron-input"
						type="text"
						className={clsx(inputClassName, "w-full")}
						placeholder="*/5 * * * *"
						maxLength={100}
						aria-label="Enter cron expression"
						value={cron}
						onChange={(e) => setCron(e.target.value)}
						onKeyDown={handleKeyDown}
						onFocus={handleFocus}
						autoComplete="off"
						aria-invalid={!!error}
						aria-describedby={error ? "cron-error" : undefined}
						aria-autocomplete="list"
						aria-controls={
							showSuggestions ? "cron-suggestions-list" : undefined
						}
					/>
					{showSuggestions && (
						<div
							ref={suggestionsRef}
							id="cron-suggestions-list"
							className="absolute top-full left-0 right-0 mt-1 bg-gray-50 border border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto dark:bg-gray-700 dark:border-gray-600"
						>
							{CRON_SUGGESTIONS.map((suggestion) => (
								<button
									key={suggestion.expression}
									type="button"
									className="w-full px-4 py-3 text-left hover:bg-gray-100 flex flex-col gap-1 border-b border-gray-200 last:border-b-0 first:rounded-t-lg last:rounded-b-lg dark:hover:bg-gray-600 dark:border-gray-500"
									onClick={() => handleSuggestionClick(suggestion)}
								>
									<code className="font-mono text-gray-800 dark:text-gray-300">
										{suggestion.expression}
									</code>
									<span className="text-sm text-gray-500 dark:text-gray-400">
										{suggestion.description}
									</span>
								</button>
							))}
						</div>
					)}
				</div>
				<CopyButton
					value={cron}
					label="Copy"
					disabled={!cron || !!error}
					className="shrink-0"
				/>
				<Tooltip
					id="cron-placeholder-tip"
					place="top"
					className="max-w-xs text-sm !bg-[#282a36] !text-[#f8f8f2] !border-[#44475a] !rounded-xl !shadow-xl !px-4 !py-2"
					border="#44475a"
					style={{
						background: "#282a36",
						color: "#f8f8f2",
						borderRadius: "0.75rem",
						boxShadow: "0 4px 24px 0 #0006",
						padding: "0.75rem 1.25rem",
					}}
				/>
			</div>
			{error && (
				<div id="cron-error" className="mt-4 w-full">
					<div className="bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-xl p-4 w-full dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-300">
						<span>{error}</span>
					</div>
				</div>
			)}
		</div>
	);
};
