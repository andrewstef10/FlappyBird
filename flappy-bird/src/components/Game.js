import React, { useState, useEffect, useRef } from 'react';
import { RunFlappyBird } from '../Game/FlappyBirdLogic';

const Game = () => {
  const [score, SetScore] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const Cleanup = RunFlappyBird(canvas, SetScore);

    console.log('Game component mounted');
    return () => {
      Cleanup();
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