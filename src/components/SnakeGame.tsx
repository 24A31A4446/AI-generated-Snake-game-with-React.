import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const MOVE_SPEED = 120;

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(true);
    setScore(0);
    onScoreChange(0);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
        case 'r':
        case 'R':
          resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, MOVE_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, moveSnake]);

  return (
    <div className="relative flex flex-col items-center justify-center p-1 bg-black border-4 border-[#00ffff]">
      <div 
        className="grid bg-[#0a0a0a]"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(80vw, 400px)',
          aspectRatio: '1/1',
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.slice(1).some(s => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`w-full h-full border-[0.5px] border-[#00ffff]/10 flex items-center justify-center`}
            >
              {isSnakeHead && (
                <div className="w-full h-full bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]" />
              )}
              {isSnakeBody && (
                <div className="w-[90%] h-[90%] bg-[#ff00ff]/60" />
              )}
              {isFood && (
                <div className="w-[70%] h-[70%] bg-[#00ffff] animate-pulse shadow-[0_0_15px_#00ffff]" />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {(isGameOver || isPaused) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10"
          >
            {isGameOver ? (
              <>
                <h2 
                  className="text-3xl font-pixel text-[#ff00ff] mb-4 glitch-text"
                  data-text="FATAL_ERROR"
                >
                  FATAL_ERROR
                </h2>
                <div className="mb-6 px-6 py-2 border-4 border-[#ff00ff] bg-black">
                  <p className="text-xl font-mono text-[#00ffff] tracking-widest uppercase">
                    SCORE_DUMP: {score}
                  </p>
                </div>
                <button
                  onClick={resetGame}
                  className="px-8 py-3 bg-[#ff00ff] text-black font-pixel text-xs hover:bg-[#00ffff] transition-colors crt-border"
                >
                  REBOOT_SYSTEM
                </button>
              </>
            ) : (
              <>
                <h2 
                  className="text-3xl font-pixel text-[#00ffff] mb-4 glitch-text"
                  data-text="PROCESS_HALTED"
                >
                  PROCESS_HALTED
                </h2>
                <p className="text-[#ff00ff] mb-6 text-xs font-mono uppercase tracking-widest">
                  Awaiting Input Vector...
                </p>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-8 py-3 bg-[#00ffff] text-black font-pixel text-xs hover:bg-[#ff00ff] transition-colors crt-border-cyan"
                >
                  RESUME_EXECUTION
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
