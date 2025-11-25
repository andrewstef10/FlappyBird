import { BIRD_WIDTH_PX } from './Constants';
import { Bird, Pipe } from './FlappyBirdObjects';

export const RunFlappyBird = (canvas, SetScore) => {

  const UpdatePipes = () => {
    // Update each pipe
    pipes.forEach(pipe => { pipe.Update(); });

    // Remove pipes that have moved off screen
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

    // Generate new pipes at intervals. Place at the right edge of the canvas.
    if (frameCount % 100 === 0) {
      let pipe = new Pipe(canvas.height, canvas.width, 0); // height, x, y
      pipes.push(pipe);
    }
  };

  const HandleKeyPress = (e) => {
    if (e.key === ' ') {
      //console.log('Space bar pressed'); // Debugging statement
      bird.Fly();
      gameStarted = true; // Start the game when the space bar is pressed
    }
  };

  const GameLoop = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    //console.log("Game Loop + ", gameStarted);
    if (gameStarted)
    {
      // Update objects every frame
      bird.Update();
      UpdatePipes();
    }

    // Draw objects
    bird.Draw(context);
    pipes.forEach(pipe => { pipe.Draw(context); });


    frameCount++;
    SetScore(Math.floor(frameCount / 100));
    requestAnimationFrame(GameLoop);
  };





  const context = canvas.getContext('2d');

  let bird = new Bird();
  let pipes = [];
  let frameCount = 0;
  let gameStarted = false;

  // Set initial bird size once the image loads based on its image aspect ratio
  bird.image.onload = () => {
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

  return () => {
    window.removeEventListener('keydown', HandleKeyPress);
  };
};