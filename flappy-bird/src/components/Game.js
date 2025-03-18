import React, { useState, useEffect } from 'react';

const Game = () => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Component did mount logic
    console.log('Game component mounted');
    return () => {
      // Component will unmount logic
      console.log('Game component unmounted');
    };
  }, []);

  return (
    <div>
      <h1>Flappy Bird</h1>
      <p>Score: {score}</p>
      {/* Game logic and UI here */}
    </div>
  );
};

export default Game;