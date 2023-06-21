import React, { useId } from "react";
import { ScoreLabel } from "./ScoreLabel";

export interface ILabelProbabilities {
  [x: string]: number;
}

interface Props {
  labelProbabilities: ILabelProbabilities;
}

interface ILabelScore {
  label: string;
  score: number;
}

export const ScoresTable: React.FC<Props> = ({ labelProbabilities }) => {
  const labelsArray: ILabelScore[] = Object.entries(labelProbabilities).map(
    ([label, score]) => ({ label, score })
  );

  const sortedLabels = labelsArray.sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col gap-2">
      {sortedLabels.map(({ label, score }, i) => {
        return (
          <ScoreLabel key={i} active={i === 0} label={label} score={score} />
        );
      })}
    </div>
  );
};
