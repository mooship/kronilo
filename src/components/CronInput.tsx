import { FaInfoCircle } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { CopyButton } from "./CopyButton";

interface CronInputProps {
	value: string;
	onChange: (value: string) => void;
	error?: string;
}

export function CronInput({ value, onChange, error }: CronInputProps) {
	return (
		<div className="mb-8">
			<label
				htmlFor="cron-input"
				className="block text-xl font-semibold text-base-content mb-6 text-center"
			>
				Cron Expression
			</label>
			<div className="flex items-center justify-center gap-3 max-w-4xl mx-auto w-full">
				<button
					type="button"
					className="flex items-center focus:outline-none shrink-0"
					data-tooltip-id="cron-placeholder-tip"
					data-tooltip-content="*/5 * * * *  →  every 5 minutes (minute hour day month weekday)"
					aria-label="Cron format info"
					tabIndex={0}
				>
					<FaInfoCircle className="text-2xl text-primary hover:text-accent focus:text-accent transition-colors" />
				</button>
				<input
					id="cron-input"
					name="cron-input"
					type="text"
					className={`input input-bordered bg-base-100 text-base-content placeholder-base-content/60 font-mono text-lg px-4 py-3 flex-1 min-w-0 h-12 rounded-xl border-2 transition-colors duration-200 focus:outline-none ${error ? "border-yellow-400/40 bg-yellow-400/5" : "border-base-300 hover:border-primary/50 focus:border-primary"}`}
					placeholder="*/5 * * * *"
					maxLength={100}
					aria-label="Enter cron expression"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					autoComplete="off"
					aria-invalid={!!error}
					aria-describedby={error ? "cron-error" : undefined}
				/>
				<CopyButton
					value={value}
					label="Copy"
					disabled={!value || !!error}
					className="shrink-0 btn btn-primary h-12 px-2 sm:px-6 min-w-[100px] sm:min-w-[80px]"
				/>
				<Tooltip
					id="cron-placeholder-tip"
					place="top"
					className="max-w-xs text-sm !bg-[#282a36] !text-[#f8f8f2] !border-[#44475a] !rounded-lg !shadow-xl !px-4 !py-2"
					style={{
						background: "#282a36",
						color: "#f8f8f2",
						border: "1px solid #44475a",
						borderRadius: "0.75rem",
						boxShadow: "0 4px 24px 0 #0006",
						padding: "0.75rem 1.25rem",
					}}
				/>
			</div>
			{error && (
				<div id="cron-error" className="mt-4 max-w-3xl mx-auto">
					<div className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-xl p-4">
						<span>{error}</span>
					</div>
				</div>
			)}
		</div>
	);
}
