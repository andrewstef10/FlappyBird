export const initializeGame = (canvas, setScore) => {
  const context = canvas.getContext('2d');

  let bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0
  };

  const drawBird = () => {
    context.fillStyle = 'yellow';
    context.fillRect(bird.x, bird.y, bird.width, bird.height);
  };

  const updateBird = () => {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height) {
      bird.y = canvas.height - bird.height;
      bird.velocity = 0;
    }

    if (bird.y < 0) {
      bird.y = 0;
      bird.velocity = 0;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === ' ') {
      bird.velocity += bird.lift;
    }
  };

  window.addEventListener('keydown', handleKeyPress);

  const gameLoop = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    updateBird();
    drawBird();
    requestAnimationFrame(gameLoop);
  };

  gameLoop();

  return () => {
    window.removeEventListener('keydown', handleKeyPress);
  };
};