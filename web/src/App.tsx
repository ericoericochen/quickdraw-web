import { useCallback, useState } from "react";
import { DrawingPad, IDrawingChange } from "./components/DrawingPad";
import { ScoresTable, ILabelProbabilities } from "./components/ScoresTable";
import { labels } from "./label";

const INITIAL_PROBABILITY = {
  "aircraft carrier": 0,
  airplane: 0,
  "alarm clock": 0,
  ambulance: 0,
  angel: 0,
};

function App() {
  const [probabilities, setProbabilities] =
    useState<ILabelProbabilities>(INITIAL_PROBABILITY);

  const performInference = (uri: string) => {
    return fetch("http://127.0.0.1:5000/inference", {
      method: "POST",
      body: JSON.stringify({
        image: uri,
      }),
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => res.json());
  };

  const handleDrawingChange = useCallback((change: IDrawingChange) => {
    const { isEmpty, imageUri } = change;

    if (isEmpty) {
      return setProbabilities(INITIAL_PROBABILITY);
    }

    return performInference(imageUri).then((data) => {
      console.log({ data });
      setProbabilities(data.probabilities);
    });
  }, []);

  return (
    <div className="App">
      <div className="w-[320px] m-auto">
        <div className="mb-6">
          <h1 className="font-semibold text-[32px] text-white">Quickdraw</h1>
          <p className="font-medium text-base text-[var(--text)]">
            Pick a doodle, draw it, and see a neural network classify it in
            real-time.
          </p>
        </div>

        <DrawingPad
          drawingChangeThrottle={1000}
          onDrawingChange={handleDrawingChange}
          labels={labels}
        />

        <div className="mt-6">
          <ScoresTable labelProbabilities={probabilities} />
        </div>
      </div>
    </div>
  );
}

export default App;
