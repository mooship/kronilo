import clsx from "clsx";
import type { FC } from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";
import { useHover, useUnmount } from "usehooks-ts";
import { useKroniloStore } from "../../stores/useKroniloStore";
import type { I18nCronError } from "../../types";
import type { CronInputProps } from "../../types/components";
import { CRON_SUGGESTIONS } from "../../utils/cronSuggestions";
import { MemoizedCopyButton } from "../ui/CopyButton";
import { CronInputWarning } from "./CronInputWarning";

function isI18nCronError(obj: unknown): obj is I18nCronError {
	return (
		typeof obj === "object" &&
		obj !== null &&
		"key" in obj &&
		typeof (obj as { key?: unknown }).key === "string"
	);
}

const inputClassName = clsx(
	"input input-bordered bg-gray-50 text-gray-900 placeholder-gray-500 font-mono text-lg px-4 py-3 flex-1 min-w-0 h-12 rounded-xl border-2 transition-colors duration-200 focus:outline-none dark:bg-neutral-800 dark:text-neutral-50 dark:placeholder-gray-400",
	"border-gray-200 hover:border-gray-400 focus:border-gray-600 dark:border-neutral-700 dark:hover:border-neutral-500 dark:focus:border-neutral-400",
);

const CronInput: FC<CronInputProps> = ({ error }) => {
	const handleSuggestionClick = (
		suggestion: (typeof CRON_SUGGESTIONS)[number],
	) => {
		setCron(suggestion.expression);
		setShowSuggestions(false);
		inputRef.current?.focus();
	};
	const { t } = useTranslation();
	const inputRef = useRef<HTMLInputElement>(null);
	const suggestionsRef = useRef<HTMLDivElement>(null);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const infoRef = useRef<HTMLButtonElement>(null);
	const isHovered = useHover(infoRef as React.RefObject<HTMLElement>);
	const cron = useKroniloStore((s) => s.cron);
	const setCron = useKroniloStore((s) => s.setCron);

	const handleClick = useCallback((event: MouseEvent) => {
		if (
			suggestionsRef.current &&
			!suggestionsRef.current.contains(event.target as Node)
		) {
			setShowSuggestions(false);
		}
	}, []);

	useEffect(() => {
		if (showSuggestions) {
			document.addEventListener("mousedown", handleClick);
		}
		return () => {
			document.removeEventListener("mousedown", handleClick);
		};
	}, [showSuggestions, handleClick]);

	useUnmount(() => {
		document.removeEventListener("mousedown", handleClick);
	});

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

	return (
		<div className="mb-8 flex w-full flex-col">
			<div className="mb-6 flex w-full items-center justify-between">
				<label
					htmlFor="cron-input"
					className="block font-semibold text-black text-xl dark:text-neutral-50"
				>
					{t("cronInput.label")}
				</label>
			</div>
			<div className="relative flex w-full items-center justify-center gap-3">
				<button
					type="button"
					ref={infoRef}
					className={clsx(
						"flex shrink-0 items-center transition-transform duration-100 focus:outline-none",
						isHovered && "scale-105",
					)}
					data-tooltip-id="cron-placeholder-tip"
					data-tooltip-content={t("cronInput.infoTooltip")}
					aria-label={t("cronInput.infoAriaLabel")}
					tabIndex={0}
				>
					<svg
						className="h-6 w-6 text-black transition-colors hover:text-gray-600 focus:text-gray-600 dark:text-gray-100 dark:focus:text-gray-400 dark:hover:text-gray-400"
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
				<div className="relative w-full min-w-0 flex-1">
					<input
						ref={inputRef}
						id="cron-input"
						name="cron-input"
						type="text"
						className={clsx(inputClassName, "w-full")}
						placeholder={t("cronInput.placeholder")}
						maxLength={100}
						aria-label={t("cronInput.ariaLabel")}
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
							className="absolute top-full right-0 left-0 z-10 mt-1 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 shadow-lg dark:border-gray-600 dark:bg-gray-700"
							style={{ position: "absolute" }}
						>
							{CRON_SUGGESTIONS.map((suggestion) => (
								<button
									key={suggestion.expression}
									type="button"
									className="flex w-full flex-col gap-1 border-gray-200 border-b px-4 py-3 text-left first:rounded-t-lg last:rounded-b-lg last:border-b-0 hover:bg-gray-100 dark:border-gray-500 dark:hover:bg-gray-600"
									onClick={() => handleSuggestionClick(suggestion)}
								>
									<code className="font-mono text-gray-800 dark:text-gray-300">
										{suggestion.expression}
									</code>
									<span className="text-gray-500 text-sm dark:text-gray-400">
										{suggestion.description}
									</span>
								</button>
							))}
						</div>
					)}
				</div>
				<MemoizedCopyButton
					value={cron}
					label={t("actions.copy")}
					disabled={!cron || !!error}
					className="shrink-0"
					size="sm"
				/>
				<Tooltip
					id="cron-placeholder-tip"
					place="top"
					className="!bg-[#282a36] !text-[#f8f8f2] !border-[#44475a] !rounded-xl !shadow-xl !px-4 !py-2 max-w-xs text-sm"
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
					<CronInputWarning>
						{Array.isArray(error) ? (
							<ul className="list-disc pl-5">
								{error.map((err) =>
									isI18nCronError(err) ? (
										<li key={err.key + JSON.stringify(err.values)}>
											{t(err.key, err.values)}
										</li>
									) : (
										<li key={String(err)}>{err}</li>
									),
								)}
							</ul>
						) : isI18nCronError(error) ? (
							t(error.key, error.values)
						) : (
							error
						)}
					</CronInputWarning>
				</div>
			)}
		</div>
	);
};

export const MemoizedCronInput = memo(CronInput);
