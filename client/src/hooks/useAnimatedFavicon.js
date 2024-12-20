import { useEffect, useRef } from "react";

const useAnimatedFavicon = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 64;
    canvas.height = 64;
    let angle = 0;

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Background circle
      context.beginPath();
      context.arc(32, 32, 30, 0, 2 * Math.PI);
      context.fillStyle = "#2C3E50"; // Circle color
      context.fill();

      // Rotating "O"
      context.save();
      context.translate(32, 32);
      context.rotate(angle);
      context.font = "bold 50px Poppins";
      context.fillStyle = "#FFFFFF"; // Text color
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("O", 0, 0);
      context.restore();

      // Update angle
      angle += 0.1;

      // Set the favicon
      const favicon = document.querySelector("link[rel='icon']");
      if (favicon) {
        favicon.href = canvas.toDataURL("image/png");
      }
    };

    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);

  return canvasRef;
};

export default useAnimatedFavicon;
