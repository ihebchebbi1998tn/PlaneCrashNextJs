"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plane, Target, Missile } from '@/lib/game-objects';
import { cn } from '@/lib/utils';

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameObjectsRef = useRef({
    plane: new Plane(400, 300),
    targets: [] as Target[],
    missiles: [] as Missile[],
    lastTargetSpawn: 0,
    keys: new Set<string>(),
  });

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      if (!gameStarted) return;
      
      const { plane, targets, missiles, keys } = gameObjectsRef.current;

      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Handle plane movement
      if (keys.has('ArrowLeft')) plane.x -= 5;
      if (keys.has('ArrowRight')) plane.x += 5;
      if (keys.has('ArrowUp')) plane.y -= 5;
      if (keys.has('ArrowDown')) plane.y += 5;

      // Keep plane in bounds
      plane.x = Math.max(20, Math.min(canvas.width - 20, plane.x));
      plane.y = Math.max(20, Math.min(canvas.height - 20, plane.y));

      // Spawn new targets
      if (Date.now() - gameObjectsRef.current.lastTargetSpawn > 2000) {
        targets.push(new Target(
          Math.random() * (canvas.width - 40) + 20,
          Math.random() * (canvas.height - 40) + 20
        ));
        gameObjectsRef.current.lastTargetSpawn = Date.now();
      }

      // Update and draw missiles
      missiles.forEach((missile, index) => {
        missile.update();
        missile.draw(ctx);

        // Remove missiles that are out of bounds
        if (missile.y < 0) {
          missiles.splice(index, 1);
        }

        // Check for missile hits on targets
        targets.forEach((target, targetIndex) => {
          const dx = missile.x - target.x;
          const dy = missile.y - target.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 20) {
            targets.splice(targetIndex, 1);
            missiles.splice(index, 1);
            setScore(prev => prev + 100);
            createExplosion(ctx, target.x, target.y);
          }
        });
      });

      // Update and draw targets
      targets.forEach((target, index) => {
        target.update();
        target.draw(ctx);

        // Check for collision with plane
        const dx = plane.x - target.x;
        const dy = plane.y - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 30) {
          setGameOver(true);
          setGameStarted(false);
        }

        // Remove targets that are out of bounds
        if (target.y > canvas.height) {
          targets.splice(index, 1);
        }
      });

      // Draw plane
      plane.draw(ctx);

      requestAnimationFrame(gameLoop);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      gameObjectsRef.current.keys.add(e.key);
      if (e.key === ' ') {
        gameObjectsRef.current.missiles.push(
          new Missile(gameObjectsRef.current.plane.x, gameObjectsRef.current.plane.y)
        );
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameObjectsRef.current.keys.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const animationId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationId);
    };
  }, [gameStarted]);

  const createExplosion = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    let size = 1;
    const maxSize = 30;
    const speed = 2;

    const explode = () => {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, ${Math.random() * 100 + 100}, 0, ${1 - size / maxSize})`;
      ctx.fill();

      size += speed;

      if (size < maxSize) {
        requestAnimationFrame(explode);
      }
    };

    explode();
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    gameObjectsRef.current = {
      plane: new Plane(400, 300),
      targets: [],
      missiles: [],
      lastTargetSpawn: 0,
      keys: new Set<string>(),
    };
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className={cn(
          "rounded-lg border-4 border-blue-500 bg-black",
          !gameStarted && "opacity-50"
        )}
      />
      
      {!gameStarted && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="rounded-lg bg-black/80 p-8 text-center">
            {gameOver && (
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-red-500">Game Over!</h2>
                <p className="text-xl text-white">Final Score: {score}</p>
              </div>
            )}
            <Button
              onClick={startGame}
              className="bg-blue-500 px-8 py-4 text-lg hover:bg-blue-600"
            >
              {gameOver ? 'Play Again' : 'Start Game'}
            </Button>
          </div>
        </div>
      )}

      {gameStarted && (
        <div className="absolute left-4 top-4 rounded-md bg-black/50 p-2 text-xl text-white">
          Score: {score}
        </div>
      )}
    </div>
  );
}