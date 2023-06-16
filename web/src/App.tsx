import { useState } from "react";
import { DrawingPad } from "./components/DrawingPad";

function App() {
  return (
    <div className="App">
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
