import React from "react";

interface Props {
  active?: boolean;
  label: string;
  score: number; // number between 0 and 1
}

export const ScoreLabel: React.FC<Props> = ({
  active = false,
  label,
  score,
}) => {
  const textColor = active ? "text-white" : "text-[var(--text)]";
  const progressBarColor = active ? "bg-[var(--blue)]" : "bg-[var(--text)]";

  const percentage = (score * 100).toFixed(3);
  const percentageDisplay = `${percentage}%`;

  return (
    <span className={`w-full font-medium text-base ${textColor}`}>
      <span className="w-full flex justify-between items-center mb-2">
        <span>{label}</span>
        <span>{percentageDisplay}</span>
      </span>

      <div
        className={`h-0.5 ${progressBarColor} rounded-full progress-bar`}
        style={{ width: percentageDisplay }}
      />
    </span>
  );
};
