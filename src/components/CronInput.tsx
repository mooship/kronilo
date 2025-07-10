import clsx from "clsx";
import { useMemo, useRef, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { useClickAway } from "react-use";
import { CRON_SUGGESTIONS } from "../utils/cronValidation";
import { CopyButton } from "./CopyButton";

interface CronInputProps {
	value: string;
	onChange: (value: string) => void;
	error?: string;
}

export function CronInput({ value, onChange, error }: CronInputProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const suggestionsRef = useRef<HTMLDivElement>(null);
	const [showSuggestions, setShowSuggestions] = useState(false);

	useClickAway(suggestionsRef, () => {
		setShowSuggestions(false);
	});

	const inputClassName = useMemo(() => {
		const baseClasses =
			"input input-bordered bg-base-100 text-base-content placeholder-base-content/60 font-mono text-lg px-4 py-3 flex-1 min-w-0 h-12 rounded-xl border-2 transition-colors duration-200 focus:outline-none";
		const errorClasses = "border-yellow-400/40 bg-yellow-400/5";
		const normalClasses =
			"border-base-300 hover:border-primary/50 focus:border-primary";

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
		if (!value) {
			setShowSuggestions(true);
		}
	};

	const handleSuggestionClick = (
		suggestion: (typeof CRON_SUGGESTIONS)[number],
	) => {
		onChange(suggestion.expression);
		setShowSuggestions(false);
		inputRef.current?.focus();
	};

	return (
		<div className="mb-8 flex flex-col w-full">
			<label
				htmlFor="cron-input"
				className="block text-xl font-semibold text-base-content mb-6 text-center w-full"
			>
				Cron Expression
			</label>
			<div className="relative flex items-center justify-center gap-3 w-full">
				<button
					type="button"
					className="flex items-center focus:outline-none shrink-0"
					data-tooltip-id="cron-placeholder-tip"
					data-tooltip-content="star/5 * * * *  →  every 5 minutes (minute hour day month weekday)"
					aria-label="Cron format info"
					tabIndex={0}
				>
					<FaInfoCircle className="text-2xl text-primary hover:text-accent focus:text-accent transition-colors" />
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
						value={value}
						onChange={(e) => onChange(e.target.value)}
						onKeyDown={handleKeyDown}
						onFocus={handleFocus}
						autoComplete="off"
						aria-invalid={!!error}
						aria-describedby={error ? "cron-error" : undefined}
					/>
					{showSuggestions && (
						<div
							ref={suggestionsRef}
							className="absolute top-full left-0 right-0 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
						>
							{CRON_SUGGESTIONS.map((suggestion) => (
								<button
									key={suggestion.expression}
									type="button"
									className="w-full px-4 py-3 text-left hover:bg-base-200 flex flex-col gap-1 border-b border-base-300 last:border-b-0"
									onClick={() => handleSuggestionClick(suggestion)}
								>
									<code className="font-mono text-primary">
										{suggestion.expression}
									</code>
									<span className="text-sm text-base-content/60">
										{suggestion.description}
									</span>
								</button>
							))}
						</div>
					)}
				</div>
				<CopyButton
					value={value}
					label="Copy"
					disabled={!value || !!error}
					className="shrink-0"
				/>
				<Tooltip
					id="cron-placeholder-tip"
					place="top"
					className="max-w-xs text-sm !bg-[#282a36] !text-[#f8f8f2] !border-[#44475a] !rounded-lg !shadow-xl !px-4 !py-2"
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
					<div className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-xl p-4 w-full">
						<span>{error}</span>
					</div>
				</div>
			)}
		</div>
	);
}
