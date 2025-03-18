import React, { useState, useEffect, useRef } from 'react';
import { initializeGame } from '../utils/gameLogic';

const Game = () => {
  const [score, setScore] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cleanup = initializeGame(canvas, setScore);

    console.log('Game component mounted');
    return () => {
      cleanup();
      console.log('Game component unmounted');
    };
  }, []);

  return (
    <div>
      <h1>Flappy Bird</h1>
      <p>Score: {score}</p>
      <canvas ref={canvasRef} width="800" height="600" style={{ border: '1px solid black' }}></canvas>
    </div>
  );
};

export default Game;