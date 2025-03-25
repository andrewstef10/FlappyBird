export const initializeGame = (canvas, setScore) => {
  const context = canvas.getContext('2d');

  let bird = {
    x: 50,
    y: canvas.height / 2 - 20, // Center the bird vertically
    width: 64, // Adjust width to match the image
    height: 40, // Adjust height to match the image
    gravity: 0.6,
    lift: -12,
    velocity: 0,
    image: new Image()
  };

  bird.image.src = '/FlappyBird.png'; // Direct path to the bird image in the public directory

  let pipes = [];
  const pipeWidth = 50;
  const pipeGap = 200;
  const pipeSpeed = 2;
  let frameCount = 0;
  let gameStarted = false;

  const drawBird = () => {
    context.drawImage(bird.image, bird.x, bird.y, bird.width, bird.height);
  };

  const updateBird = () => {
    if (gameStarted) {
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
    }
  };

  const generatePipe = () => {
    const pipeHeight = Math.random() * (canvas.height - pipeGap);
    pipes.push({
      x: canvas.width,
      y: 0,
      width: pipeWidth,
      height: pipeHeight
    });
    pipes.push({
      x: canvas.width,
      y: pipeHeight + pipeGap,
      width: pipeWidth,
      height: canvas.height - pipeHeight - pipeGap
    });
  };

  const updatePipes = () => {
    pipes.forEach(pipe => {
      pipe.x -= pipeSpeed;
    });

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

    if (frameCount % 100 === 0) {
      generatePipe();
    }
  };

  const drawPipes = () => {
    context.fillStyle = 'green';
    pipes.forEach(pipe => {
      context.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === ' ') {
      console.log('Space bar pressed'); // Debugging statement
      bird.velocity = bird.lift;
      gameStarted = true; // Start the game when the space bar is pressed
    }
  };

  window.addEventListener('keydown', handleKeyPress);

  const gameLoop = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    console.log("Game Loop + ", gameStarted);
    if (gameStarted) {
      updateBird();
      updatePipes();
    }
    drawBird();
    drawPipes();
    frameCount++;
    requestAnimationFrame(gameLoop);
  };

  bird.image.onload = gameLoop; // Start the game loop once the image is loaded

  return () => {
    window.removeEventListener('keydown', handleKeyPress);
  };
};