import { useState } from "react";
import { DrawingPad } from "./components/DrawingPad";
import { Test } from "./Test";

function App() {
  return (
    <div className="App">
      <Test />
      <DrawingPad
        resizeTo={28}
        drawingChangeThrottle={2000}
        onDrawingChange={(change) => {
          console.log(change);
        }}
      />
    </div>
  );
}

export default App;
