import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import throttle from "lodash.throttle";

interface Props {
  onDrawingChange?: (canvas: HTMLCanvasElement) => any;
}

interface Position {
  x: number;
  y: number;
}

export const DrawingPad: React.FC<Props> = ({ onDrawingChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>();
  const [isDrawing, setIsDrawing] = useState(false);
  const positionRef = useRef<Position>({ x: 0, y: 0 });

  const runIfCanvasAndContextExists = (
    func: (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => any
  ) => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");

      if (context) {
        func(canvasRef.current, context);
      }
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      if (ctx) {
        contextRef.current = ctx;

        // set up draw settings
        ctx.lineWidth = 30;
        ctx.lineCap = "round";

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    console.log(canvasRef);
  }, []);

  // useEffect(() => {
  //   const resize = () => {
  //     // figure this out: canvas drawing disappears on resize
  //     const canvas = canvasRef.current as HTMLCanvasElement;
  //     canvas.width = canvas.offsetWidth;
  //     canvas.height = canvas.offsetHeight;
  //   };

  //   window.addEventListener("resize", resize);

  //   return () => window.removeEventListener("resize", resize);
  // }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledOnDrawingChange = useCallback(
    throttle(() => {
      if (onDrawingChange && canvasRef.current) {
        onDrawingChange(canvasRef.current);
      }
    }, 1000),
    [onDrawingChange]
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

    const ctx = contextRef.current;
    if (ctx) {
      console.log("drawing!");

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

      throttledOnDrawingChange();
    }
  };

  const handleMouseUp = () => {
    console.log("mouseup: drawing=false");

    setIsDrawing(false);
  };

  // const getImageURL = () => {
  //   const canvas = canvasRef.current;

  //   if (canvas) {
  //     // Create a new canvas element for the resized image
  //     const resizedCanvas = document.createElement("canvas");
  //     const resizedCtx = resizedCanvas.getContext("2d");

  //     resizedCanvas.width = 28;
  //     resizedCanvas.height = 28;

  //     if (resizedCtx) {
  //       resizedCtx.drawImage(canvas, 0, 0, 28, 28);
  //       const resizedImageDataURL = resizedCanvas.toDataURL();
  //       const imageData = resizedCtx.getImageData(
  //         0,
  //         0,
  //         resizedCanvas.width,
  //         resizedCanvas.height
  //       );

  //       console.log(resizedImageDataURL);
  //       console.log(imageData);
  //     }
  //   }
  // };

  return (
    <div className="w-full h-full">
      {<pre>{JSON.stringify(isDrawing)}</pre>}
      {/* <button onClick={getImageURL}>Get Image URL</button> */}
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
