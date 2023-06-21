import React, { useCallback, useEffect, useRef, useState } from "react";
import throttle from "lodash.throttle";

interface Props {
  drawingChangeThrottle?: number;
  labels?: string[];
  onDrawingChange?: (change: IDrawingChange) => any;
}

export interface IDrawingChange {
  isEmpty: boolean;
  imageUri: string;
}

interface Position {
  x: number;
  y: number;
}

export const DrawingPad: React.FC<Props> = ({
  drawingChangeThrottle = 1000,
  labels = [],
  onDrawingChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const positionRef = useRef<Position>({ x: 0, y: 0 });

  function runIfCanvasAndContextExists<T>(
    func: (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => T
  ) {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");

      if (context) {
        return func(canvasRef.current, context);
      }
    }
  }

  useEffect(() => {
    runIfCanvasAndContextExists((canvas, ctx) => {
      canvas.width = 320;
      canvas.height = 320;

      // set up draw settings
      // ctx.lineWidth = 30;
      ctx.lineWidth = 15;
      ctx.lineCap = "round";

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    console.log(canvasRef);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledOnDrawingChange = useCallback(
    throttle((isEmpty: boolean) => {
      runIfCanvasAndContextExists((canvas) => {
        if (onDrawingChange) {
          const imageUri = getImageUri(canvas);

          if (imageUri) {
            onDrawingChange({ isEmpty, imageUri });
          }
        }
      });
    }, drawingChangeThrottle),
    [onDrawingChange, drawingChangeThrottle, resizeTo]
  );

  const handleOnClear = () => {
    console.log("clearing");

    runIfCanvasAndContextExists((canvas, context) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "black";
      context.fillRect(0, 0, canvas.width, canvas.height);

      throttledOnDrawingChange(true);
    });
  };

  const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    console.log("mousedown: drawing=true");

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const position: Position = { x, y };

    positionRef.current = position;
    setIsDrawing(true);
  };

  const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (!isDrawing) {
      return;
    }

    runIfCanvasAndContextExists((_, ctx) => {
      const { x: prevX, y: prevY } = positionRef.current;
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;

      ctx.strokeStyle = `#ffffff`;

      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.stroke();

      const position: Position = { x, y };

      positionRef.current = position;

      throttledOnDrawingChange(false);
    });
  };

  const handleMouseUp = () => {
    console.log("mouseup: drawing=false");

    setIsDrawing(false);
  };

  const getImageUri = (canvas: HTMLCanvasElement): string | undefined => {
    // this is overkill: REFACTOR later
    const resizedCanvas = document.createElement("canvas");
    const resizedCtx = resizedCanvas.getContext("2d");

    resizedCanvas.width = canvas.width;
    resizedCanvas.height = canvas.height;

    if (resizedCtx) {
      resizedCtx.drawImage(
        canvas,
        0,
        0,
        resizedCanvas.width,
        resizedCanvas.height
      );
      const resizedImageDataURL = resizedCanvas.toDataURL();

      return resizedImageDataURL;
    }
  };

  return (
    <div className="drawing-pad relative w-full h-full bg-black">
      <div className="tool-bar flex justify-between items-center w-full p-2">
        <button
          className="text-[var(--text)] hover:text-white"
          onClick={handleOnClear}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>

        <select className="text-sm font-medium text-[var(--text)]" id="labels">
          <option disabled selected value="Doodles">
            Doodles
          </option>

          {labels.map((label) => {
            return (
              <option key={label} value={label}>
                {label}
              </option>
            );
          })}
        </select>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};
