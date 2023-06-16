import React, { useCallback, useEffect, useRef, useState } from "react";
import throttle from "lodash.throttle";

interface Props {
  drawingChangeThrottle?: number;
  resizeTo?: number; // size to resize canvas image to for onDrawingChange
  onDrawingChange?: (change: IDrawingChange) => any;
}

export interface IDrawingChange {
  isEmpty: boolean;
  image: ImageData;
}

interface Position {
  x: number;
  y: number;
}

export const DrawingPad: React.FC<Props> = ({
  drawingChangeThrottle = 1000,
  resizeTo,
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
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // set up draw settings
      ctx.lineWidth = 30;
      ctx.lineCap = "round";

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    console.log(canvasRef);
  }, []);

  useEffect(() => {
    const resize = () => {
      runIfCanvasAndContextExists((canvas, ctx) => {
        const imageData = getImageData(canvas);

        if (imageData) {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;

          ctx.lineWidth = 30;
          ctx.lineCap = "round";

          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.putImageData(imageData, 0, 0);
        }
      });
    };

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledOnDrawingChange = useCallback(
    throttle((isEmpty: boolean) => {
      runIfCanvasAndContextExists((canvas) => {
        if (onDrawingChange) {
          const imageData = getImageData(canvas, resizeTo);

          if (imageData) {
            onDrawingChange({ isEmpty, image: imageData });
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
    });
  };

  const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    console.log("mousedown: drawing=true");

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const position: Position = { x, y };

    console.log(position);

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

  const getImageData = (
    canvas: HTMLCanvasElement,
    resizeTo?: number
  ): ImageData | undefined => {
    const resizedCanvas = document.createElement("canvas");
    const resizedCtx = resizedCanvas.getContext("2d");

    if (resizeTo) {
      resizedCanvas.width = resizeTo;
      resizedCanvas.height = resizeTo;
    } else {
      resizedCanvas.width = canvas.width;
      resizedCanvas.height = canvas.height;
    }

    if (resizedCtx) {
      resizedCtx.drawImage(
        canvas,
        0,
        0,
        resizedCanvas.width,
        resizedCanvas.height
      );
      const resizedImageDataURL = resizedCanvas.toDataURL();
      const imageData = resizedCtx.getImageData(
        0,
        0,
        resizedCanvas.width,
        resizedCanvas.height
      );

      console.log(resizedImageDataURL);
      console.log(imageData);

      return imageData;
    }
  };

  return (
    <div className="w-full h-full">
      {<pre>{JSON.stringify(isDrawing)}</pre>}
      {/* <button
        onClick={() => {
          const imageData = getImageData(canvasRef.current!, resizeTo);

          console.log({ imageData });
        }}
      >
        Get Image URL
      </button> */}
      <button onClick={handleOnClear}>Clear</button>
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
