"use client";

import { useEffect, useState, useRef } from "react";

const useSkiGame = () => {
  const SKI_SPEED_LEFT = 2;
  const SKI_SPEED_RIGHT = 2;
  const SKI_SPEED_DOWN = 6;
  const windowWidth = 500;
  const windowHeight = 500;

  const [skiPosition, setSkiPosition] = useState({
    x: windowWidth / 2,
    y: windowHeight / 2,
  });
  const [obstaclePositions, setObstaclePositions] = useState([
    { x: windowWidth / 2, y: windowHeight },
    { x: windowWidth / 1, y: windowHeight / (Math.random() * 2)  },
    { x: windowWidth / 1, y: windowHeight / (Math.random() * 3)  },
    { x: windowWidth / 1, y: windowHeight / (Math.random() * 4)  },
    { x: windowWidth / 1, y: windowHeight / (Math.random() * 5)  },
  ]);
  const [gameOver, setGameOver] = useState(false);
  const [skiDirection, setSkiDirection] = useState("down");
  const [distance, setDistance] = useState(1);

  const generateObjects = () => {
    setObstaclePositions()
  };

  const handleKeyDown = (event) => {
    if (!gameOver) {
      if (event.key === "ArrowLeft") {
        cycleDirection("left");
      } else if (event.key === "ArrowRight") {
        cycleDirection("right");
      }
    }
  };

  const moveSki = (direction) => {
    setSkiDirection(direction);
  };

  const cycleDirection = (key) => {
    switch (skiDirection) {
      case "left":
        if (key === "right") {
          moveSki("down");
        }
        break;
      case "right":
        if (key === "left") {
          moveSki("down");
        }
        break;
      case "down":
        if (key == "right") {
          moveSki("right");
        } else if (key == "left") {
          moveSki("left");
        }

        break;
      default:
        break;
    }
  };

  const updateGame = () => {
    if (!gameOver) {
      let speed;
      switch (skiDirection) {
        case "left":
          speed = SKI_SPEED_LEFT;
          setObstaclePositions((prevPositions) =>
            prevPositions.map((position) => ({
              x: position.x + speed,
              y: position.y - speed,
            }))
          );
          break;
        case "right":
          speed = SKI_SPEED_RIGHT;
          setObstaclePositions((prevPositions) =>
            prevPositions.map((position) => ({
              x: position.x - speed,
              y: position.y - speed,
            }))
          );
          break;
        case "down":
          speed = SKI_SPEED_DOWN;
          setObstaclePositions((prevPositions) =>
            prevPositions.map((position) => ({
              x: position.x,
              y: position.y - speed,
            }))
          );
          break;
        default:
          speed = 0;
      }

      setObstaclePositions((prevPositions) => {
        return prevPositions.map((position) => {
          if (position.y <= 0) {
            // Reset obstacle position when it reaches the top
            return { x: Math.random() * windowWidth, y: windowHeight };
          }
          return position;
        });
      });

      // Check for collision
      const collision = obstaclePositions.some(
        (position) =>
          skiPosition.x < position.x + 10 &&
          skiPosition.x + 10 > position.x &&
          skiPosition.y < position.y + 10 &&
          skiPosition.y + 10 > position.y
      );
      if (collision) {
        setGameOver(true);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    const intervalId = setInterval(updateGame, 24);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skiPosition, obstaclePositions, gameOver]);

  return { skiPosition, obstaclePositions, gameOver, skiDirection, distance };
};

const SkiFree = () => {
  const canvasRef = useRef(null);
  const { skiPosition, obstaclePositions, gameOver, skiDirection, distance } =
    useSkiGame();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const drawSki = () => {
      const img = new Image();

      ctx.fillStyle = "#00f";
      ctx.save();
      ctx.translate(skiPosition.x, skiPosition.y);

      switch (skiDirection) {
        case "left":
          img.src = "sprites/player_left.png";
          ctx.scale(-1, 1);
          break;
        case "right":
          img.src = "sprites/player_left.png";
          ctx.scale(1, 1);
          break;
        default:
          img.src = "sprites/player_down.jpg"; // Default image
      }
      if (gameOver) {
        img.src = "sprites/player_dead.png"; // Default image
      }
      ctx.drawImage(img, -5, -5, 10, 20);
      ctx.restore();
    };
    const drawObstacles = () => {
      const img = new Image();
      const imageArray = ["sprites/rock.png", "sprites/tree.png", "sprites/dead_tree.png"];
      const random = Math.random() * 2;
      img.src = imageArray[2];
      
      obstaclePositions.forEach((position) => {
        ctx.drawImage(img, position.x, position.y, 10, 10);
      });
    };
    const drawGame = () => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawSki();
      drawObstacles();
    };

    drawGame();
  }, [skiPosition, obstaclePositions, gameOver, skiDirection, distance]);

  return (
    <div>
      <h1>{gameOver ? "Game Over!" : "SkiFree Clone"}</h1>
      <h2>{distance}</h2>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ display: "block", border: "1px solid #000" }}
      />
    </div>
  );
};

export default SkiFree;
