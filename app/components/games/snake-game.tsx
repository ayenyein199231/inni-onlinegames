'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const GAME_SPEED = 100;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = 'RIGHT';
const INITIAL_FOOD = { x: 15, y: 10 };

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const SnakeGame = () => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const directionRef = useRef(direction);
  const snakeRef = useRef(snake);
  const isPausedRef = useRef(isPaused);
  const gameStartedRef = useRef(gameStarted);
  const isGameOverRef = useRef(isGameOver);

  useEffect(() => {
    directionRef.current = direction;
    snakeRef.current = snake;
    isPausedRef.current = isPaused;
    gameStartedRef.current = gameStarted;
    isGameOverRef.current = isGameOver;
  }, [direction, snake, isPaused, gameStarted, isGameOver]);

  const generateFood = useCallback((): Position => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      return generateFood();
    }
    return newFood;
  }, []);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? '#1f1f1f' : '#2c2c2c';
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    snakeRef.current.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#4CAF50' : '#8BC34A';
      ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

      if (index === 0) {
        ctx.fillStyle = 'black';
        const eyeSize = CELL_SIZE / 5;
        if (directionRef.current === 'RIGHT' || directionRef.current === 'LEFT') {
          const eyeX = segment.x * CELL_SIZE + (directionRef.current === 'RIGHT' ? 3 * CELL_SIZE / 4 : CELL_SIZE / 4);
          ctx.fillRect(eyeX, segment.y * CELL_SIZE + CELL_SIZE / 4, eyeSize, eyeSize);
          ctx.fillRect(eyeX, segment.y * CELL_SIZE + 3 * CELL_SIZE / 4 - eyeSize, eyeSize, eyeSize);
        } else {
          const eyeY = segment.y * CELL_SIZE + (directionRef.current === 'DOWN' ? 3 * CELL_SIZE / 4 : CELL_SIZE / 4);
          ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE / 4, eyeY, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + 3 * CELL_SIZE / 4 - eyeSize, eyeY, eyeSize, eyeSize);
        }
      }
    });

    ctx.fillStyle = '#FF5722';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }, [food]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (!gameStartedRef.current || isPausedRef.current || isGameOverRef.current) return;
      const head = { ...snakeRef.current[0] };
      switch (directionRef.current) {
        case 'UP': head.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE; break;
        case 'DOWN': head.y = (head.y + 1) % GRID_SIZE; break;
        case 'LEFT': head.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE; break;
        case 'RIGHT': head.x = (head.x + 1) % GRID_SIZE; break;
      }
      if (snakeRef.current.slice(1).some(s => s.x === head.x && s.y === head.y)) {
        setIsGameOver(true);
        return;
      }
      const newSnake = [head, ...snakeRef.current];
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 1);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }
      if (newSnake.length === GRID_SIZE * GRID_SIZE) {
        setIsGameOver(true);
        setIsWin(true);
        return;
      }
      setSnake(newSnake);
    }, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [generateFood, food, score]);

  useEffect(() => { drawGame(); }, [snake, food, drawGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStartedRef.current && !isGameOverRef.current) setGameStarted(true);
      if (isGameOverRef.current || isPausedRef.current) return;
      const key = e.key.toLowerCase();
      const mapped = { w: 'ArrowUp', a: 'ArrowLeft', s: 'ArrowDown', d: 'ArrowRight' }[key] || e.key;
      switch (mapped) {
        case 'ArrowUp': if (directionRef.current !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (directionRef.current !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (directionRef.current !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (directionRef.current !== 'LEFT') setDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameStarted && typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden'; // Locks scroll
    } else {
      document.body.style.overflow = ''; // Unlocks when game ends or pauses
    }
  
    return () => {
      document.body.style.overflow = ''; // Cleanup
    };
  }, [gameStarted]);
  

  useEffect(() => {
    if (gameStarted && typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [gameStarted]);

  useEffect(() => {
    const startX = { current: null as number | null };
    const startY = { current: null as number | null };
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX.current = touch.clientX;
      startY.current = touch.clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!startX.current || !startY.current) return;
      const dx = e.touches[0].clientX - startX.current;
      const dy = e.touches[0].clientY - startY.current;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 10 && directionRef.current !== 'LEFT') setDirection('RIGHT');
        else if (dx < -10 && directionRef.current !== 'RIGHT') setDirection('LEFT');
      } else {
        if (dy > 10 && directionRef.current !== 'UP') setDirection('DOWN');
        else if (dy < -10 && directionRef.current !== 'DOWN') setDirection('UP');
      }
      startX.current = null;
      startY.current = null;
    };
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-white text-black">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold">Snake Game</h1>
        <p className="text-md">Score: {score}</p>
      </div>
      <div className="relative">
      <div className="relative w-full max-w-[400px] aspect-square">
  <canvas
    ref={canvasRef}
    width={GRID_SIZE * CELL_SIZE}
    height={GRID_SIZE * CELL_SIZE}
    className="w-full h-full rounded shadow-lg border-2 border-gray-700"
  />
</div>


        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setIsPaused(prev => !prev)}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded"
          >
            {isPaused ? '▶' : '❚❚'}
          </button>

          <button
            onClick={() => {
              setIsPaused(true);
              router.push('/games');
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Home
          </button>
        </div>
        

        {!gameStarted && !isGameOver && !isPaused && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-center p-4">
              <h2 className="text-xl font-bold mb-2">Snake Game</h2>
              <p className="mb-4">Use arrow keys to move</p>
              <button
                onClick={() => setGameStarted(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {isGameOver && !isWin && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
            <div className="text-center p-6 bg-white rounded shadow-lg">
              <h2 className="text-2xl font-bold text-red-600 mb-2">Game Over</h2>
              <p className="text-lg mb-4">Final Score: {score}</p>
              <button
                onClick={() => {
                  setSnake(INITIAL_SNAKE);
                  setFood(generateFood());
                  setDirection(INITIAL_DIRECTION);
                  setIsGameOver(false);
                  setScore(0);
                  setIsPaused(false);
                  setGameStarted(false);
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {isWin && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-800 bg-opacity-80">
            <div className="text-center p-6 bg-white rounded shadow-lg animate__animated animate__fadeIn">
              <h2 className="text-2xl font-bold text-green-600 mb-2">🎉 Congratulations!</h2>
              <p className="text-lg mb-4">You filled the entire grid!</p>
              <button
                onClick={() => {
                  setSnake(INITIAL_SNAKE);
                  setFood(generateFood());
                  setDirection(INITIAL_DIRECTION);
                  setIsGameOver(false);
                  setIsWin(false);
                  setScore(0);
                  setIsPaused(false);
                  setGameStarted(false);
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SnakeGame;
