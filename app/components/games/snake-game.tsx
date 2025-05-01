'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// Game constants
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const GAME_SPEED = 100; // milliseconds
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = 'RIGHT';
const INITIAL_FOOD = { x: 15, y: 10 };

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  
  // Refs to hold current state values (for use in event handlers)
  const directionRef = useRef<Direction>(direction);
  const snakeRef = useRef<Position[]>(snake);
  const isPausedRef = useRef<boolean>(isPaused);
  const gameStartedRef = useRef<boolean>(gameStarted);
  const isGameOverRef = useRef<boolean>(isGameOver);

  // Keep refs in sync with state
  useEffect(() => {
    directionRef.current = direction;
    snakeRef.current = snake;
    isPausedRef.current = isPaused;
    gameStartedRef.current = gameStarted;
    isGameOverRef.current = isGameOver;
  }, [direction, snake, isPaused, gameStarted, isGameOver]);

  // Function to generate random food position
  const generateFood = useCallback((): Position => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    
    // Make sure food doesn't appear on snake
    if (snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      return generateFood();
    }
    
    return newFood;
  }, []);

  // Draw game
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    ctx.fillStyle = '#4CAF50'; // Green
    snakeRef.current.forEach(segment => {
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
      
      // Add snake eyes to head
      if (segment === snakeRef.current[0]) {
        ctx.fillStyle = 'black';
        const eyeSize = CELL_SIZE / 5;
        
        // Position eyes based on direction
        if (directionRef.current === 'RIGHT' || directionRef.current === 'LEFT') {
          const eyeX = segment.x * CELL_SIZE + (directionRef.current === 'RIGHT' ? 3*CELL_SIZE/4 : CELL_SIZE/4);
          ctx.fillRect(eyeX, segment.y * CELL_SIZE + CELL_SIZE/4, eyeSize, eyeSize);
          ctx.fillRect(eyeX, segment.y * CELL_SIZE + 3*CELL_SIZE/4, eyeSize, eyeSize);
        } else {
          const eyeY = segment.y * CELL_SIZE + (directionRef.current === 'DOWN' ? 3*CELL_SIZE/4 : CELL_SIZE/4);
          ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE/4, eyeY, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + 3*CELL_SIZE/4, eyeY, eyeSize, eyeSize);
        }
        ctx.fillStyle = '#4CAF50'; // Reset color
      }
    });
    
    // Draw food
    ctx.fillStyle = '#FF5722'; // Orange
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
  }, [food]);

  // Game loop
  useEffect(() => {
    let gameLoop: NodeJS.Timeout;
    
    const updateGame = () => {
      if (isPausedRef.current || !gameStartedRef.current || isGameOverRef.current) return;
      
      const head = { ...snakeRef.current[0] };
      
      // Move head based on direction
      switch (directionRef.current) {
        case 'UP':
          head.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case 'DOWN':
          head.y = (head.y + 1) % GRID_SIZE;
          break;
        case 'LEFT':
          head.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case 'RIGHT':
          head.x = (head.x + 1) % GRID_SIZE;
          break;
      }
      
      // Check for collision with self
      if (snakeRef.current.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        setIsGameOver(true);
        return;
      }
      
      // Create new snake
      const newSnake = [head, ...snakeRef.current];
      
      // Check if snake has eaten food
      if (head.x === food.x && head.y === food.y) {
        // Increase score
        setScore(prev => prev + 1);
        // Generate new food
        setFood(generateFood());
      } else {
        // Remove tail if no food eaten
        newSnake.pop();
      }
      
      // Update snake
      setSnake(newSnake);
    };
    
    // eslint-disable-next-line prefer-const
    gameLoop = setInterval(updateGame, GAME_SPEED);
    
    return () => clearInterval(gameLoop);
  }, [generateFood, food]);

  // Draw game whenever snake or food changes
  useEffect(() => {
    drawGame();
  }, [snake, food, drawGame]);

  // ----------------------------Handle keyboard controls ----------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStartedRef.current && !isGameOverRef.current) {
        setGameStarted(true);
      }
      
      if (isGameOverRef.current) return;
      
      if (e.key === ' ' || e.key === 'Escape') {
        setIsPaused(!isPausedRef.current);
        return;
      }
      
      if (isPausedRef.current) return;

      //---------------------------- Map WASD keys to arrow directions----------------------------
    const key = e.key.toLowerCase();
    const mappedKey = ({
      w: 'ArrowUp',
      a: 'ArrowLeft',
      s: 'ArrowDown',
      d: 'ArrowRight',
    } as Record<string, string>)[key] || e.key;
      
      //---------------------------- Prevent reverse direction changes (can't go opposite direction)----------------------------
      switch (mappedKey) {
        case 'ArrowUp':
          if (directionRef.current !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (directionRef.current !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (directionRef.current !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (directionRef.current !== 'LEFT') setDirection('RIGHT');
          break;
      }     
       

    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ----------------------------Reset game----------------------------
  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
    setGameStarted(false);
  };

  // ----------------------------Touch controls for mobile----------------------------
  const handleSwipe = (direction: Direction) => {
    if (!gameStartedRef.current && !isGameOverRef.current) {
      setGameStarted(true);
    }
    
    if (isGameOverRef.current || isPausedRef.current) return;
    
    // Prevent reverse direction
    if (
      (direction === 'UP' && directionRef.current !== 'DOWN') ||
      (direction === 'DOWN' && directionRef.current !== 'UP') ||
      (direction === 'LEFT' && directionRef.current !== 'RIGHT') ||
      (direction === 'RIGHT' && directionRef.current !== 'LEFT')
    ) {
      setDirection(direction);
    }
  };

  //--------------------------- Main Container---------------------------

  return (
    <div className="flex flex-col items-center justify-between min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Snake Game</h1>
      
      <div className="mb-4">
        <p className="text-lg">Score: {score}</p>
      </div>
      
      <div className="relative mb-4 border-4 border-gray-700 rounded">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="bg-black"
        />
        
        {!gameStarted && !isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
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
        
        {isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
            <div className="text-center p-4">
              <h2 className="text-xl font-bold mb-2">Game Over!</h2>
              <p className="mb-2">Your Score: {score}</p>
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
        
        {isPaused && gameStarted && !isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
            <div className="text-center p-4">
              <h2 className="text-xl font-bold mb-2">Paused</h2>
              <button
                onClick={() => setIsPaused(false)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
              >
                Resume
              </button>
            </div>
          </div>
        )}
      </div>

      
      
      {/* Mobile controls */}
      <div className="lg:hidden p-4 ">
        <div className="lg:hidden grid grid-cols-3 gap-2  w-48 mb-4">
          <div className="col-start-2">
            <button
              onClick={() => handleSwipe('UP')}
              className="w-full p-3 bg-gray-700 text-white rounded-t-lg"
            >
              ↑
            </button>
          </div>
          <div className="col-start-1 row-start-2">
            <button
              onClick={() => handleSwipe('LEFT')}
              className="w-full p-3 bg-gray-700 text-white rounded-l-lg"
            >
              ←
            </button>
          </div>
          <div className="col-start-2 row-start-2 ">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="w-full p-3 bg-gray-700 text-white"
            >
              {isPaused ? '▶' : '❚❚'}
            </button>
          </div>
          <div className="col-start-3 row-start-2">
            <button
              onClick={() => handleSwipe('RIGHT')}
              className="w-full p-3 bg-gray-700 text-white rounded-r-lg"
            >
              →
            </button>
          </div>
          <div className="col-start-2 row-start-3">
            <button
              onClick={() => handleSwipe('DOWN')}
              className="w-full p-3 bg-gray-700 text-white rounded-b-lg"
            >
              ↓
            </button>
          </div>
        </div>
      </div>
            
      <div className="text-center mt-3"> 
        
        <div className="hidden lg:flex justify-center mb-6">
          <button
            onClick={() => setIsPaused(!isPaused)}
              className="px-6 py-3 bg-gray-700 text-white rounded-md"
            >
            {isPaused ? '▶' : '❚❚'}
          </button>
        </div>
                     
        <h3 className="text-lg font-semibold mb-2">How to Play</h3>
        <ul className="text-sm text-gray-300 list-disc list-inside">
          <li>Use arrow keys or WASD to control the snake</li>
          <li>Eat the orange food to grow and earn points</li>
          <li>Avoid hitting your own tail</li>
          <li>Press Space or Escape to pause the game</li>
        </ul>
      </div>
    </div>
  );
};

export default SnakeGame;