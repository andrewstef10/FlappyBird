import { BIRD_WIDTH_PX, PIPE_GAP_PX, PIPE_GENERATION_INTERVAL_FRAMES } from './Constants';
import { Bird, Pipe } from './FlappyBirdObjects';

export const RunFlappyBird = (canvas, SetScore) => {

  const IsBirdAlive = () => {
    for (let pipe of pipes)
    {
      // Check for collision between bird and pipe
      if (bird.Within(pipe.x, pipe.y, pipe.width, pipe.gapY) ||
          bird.Within(pipe.x, pipe.gapY + PIPE_GAP_PX, pipe.width, pipe.height - pipe.gapY - PIPE_GAP_PX))
      {
        return false;
      }
    }

    return true;
  }

  const UpdatePipes = () => {
    // Update each pipe
    pipes.forEach(pipe => { pipe.Update(); });

    // Remove pipes that have moved off screen
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

    // Generate new pipe on the first frame and at intervals. Place at the right edge of the canvas.
    if (frameCount % PIPE_GENERATION_INTERVAL_FRAMES === 0)
    {
      let pipe = new Pipe(canvas.height, canvas.width, 0); // height, x, y
      pipes.push(pipe);
    }
  };

  const HandleKeyPress = (e) => {
    if (e.key === ' ')
    {
      bird.Fly();
      gameStarted = true; // Start the game when the space bar is pressed
    }
    else if (e.key === 'r' && gameOver)
    {
      // Reset the game
      console.log("Resetting game.");
      bird.SetPosition(50, canvas.height / 2 - (bird.height / 2));
      pipes = [];
      frameCount = 0;
      scoreFrameCount = 0;
      passedFirstPipe = false;
      gameOver = false;
      gameStarted = false;
      SetScore(0);
    }
  };

  const GameLoop = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    //console.log("Game Loop + ", gameStarted);
    if (gameStarted && !gameOver)
    {
      // Update objects every frame
      bird.Update();
      UpdatePipes();

      // We have passed the first pipe if feft edge of the bird has passed right edge of first pipe
      if (pipes.length > 0 && !passedFirstPipe)
      {
        passedFirstPipe = bird.x > pipes[0].x + pipes[0].width;
      }

      // Check if bird is still alive
      if (IsBirdAlive())
      {
        if (passedFirstPipe)
        {
          SetScore(Math.floor((scoreFrameCount / PIPE_GENERATION_INTERVAL_FRAMES) + 1));
          scoreFrameCount++;
        }
      }
      else
      {
        console.log("Bird has collided with a pipe. Game Over.");
        gameOver = true;
      }

      frameCount++;
    }

    // Draw objects every frame
    bird.Draw(context);
    pipes.forEach(pipe => { pipe.Draw(context); });

    requestAnimationFrame(GameLoop);
  };





  const context = canvas.getContext('2d');

  let bird = new Bird();
  let pipes = [];
  let frameCount = 0;
  let scoreFrameCount = 0;
  let gameStarted = false;
  let passedFirstPipe = false;
  let gameOver = false;

  // Set initial bird size once the image loads based on its image aspect ratio
  bird.image.onload = () =>
  {
    let imageAspectRatio = bird.image.naturalWidth / bird.image.naturalHeight;
    bird.SetWidthHeight(BIRD_WIDTH_PX, BIRD_WIDTH_PX / imageAspectRatio);

    // (0, 0) is top-left always top left corener
    // positive x is right, positive y is down
    bird.SetBounds(0, canvas.width - bird.width, 0, canvas.height - bird.height);
    bird.SetPosition(50, canvas.height / 2 - (bird.height / 2));
    console.log("Successfully to load bird image");
  };
  bird.image.src = '/FlappyBird.png'; // Direct path to the bird image in the public directory. Initiates image loading.



  window.addEventListener('keydown', HandleKeyPress);
  GameLoop(); // Start the game loop

  return () =>
  {
    window.removeEventListener('keydown', HandleKeyPress);
  };
};