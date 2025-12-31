import { GRAVITY, GAME_SPEED, PIPE_GAP_PX, PIPE_WIDTH_PX } from './Constants';
import { ClampValue } from './Utils';

class GameObject {
    constructor(width, height)
    {
        this.horizontalVeloctiy = 0.0;
        this.verticalVelocity = 0.0;

        this.SetBounds(-Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE);
        this.SetWidthHeight(width, height);
        this.SetPosition(0.0, 0.0);
    }

    SetWidthHeight(width, height)
    {
        this.width = width;
        this.height = height;
    }

    SetBounds(lowerX, upperX, lowerY, upperY)
    {
        this.xBoundLower = lowerX;
        this.xBoundUpper = upperX;
        this.yBoundLower = lowerY;
        this.yBoundUpper = upperY;
    }

    SetPosition(x, y)
    {
        let newX = ClampValue(x, this.xBoundLower, this.xBoundUpper);
        let newY = ClampValue(y, this.yBoundLower, this.yBoundUpper);

        // If an object has hit a boundary, stop its movement in that direction
        if (newX !== x)
        {
            this.horizontalVeloctiy = 0.0;
        }
        if (newY !== y)
        {
            this.verticalVelocity = 0.0;
        }

        this.x = newX;
        this.y = newY;
    }

    // Returns true if the point (px, py) is within this object
    Within(x, y, width, height)
    {
        // If one rectangle is to the left of the other
        if (x + width < this.x) return false;
        if (this.x + this.width < x) return false;

        // If one rectangle is above the other
        if (y + height < this.y) return false;
        if (this.y + this.height < y) return false;

        // Otherwise, they overlap or touch
        return true;
    }

    Update()
    {
        throw new Error('Update method must be implemented in subclass');
    }

    Draw(context)
    {
        throw new Error('Draw method must be implemented in subclass');
    }
}

export class Bird extends GameObject {
    #LYFT = -12.0; // upward velocity when the bird "flies"

    constructor()
    {
        super(0.0, 0.0);
        this.image = new Image();
    }

    Update()
    {
        this.verticalVelocity += GRAVITY;
        this.SetPosition(this.x, this.y + this.verticalVelocity);
    }

    Draw(context)
    {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    Fly()
    {
        this.verticalVelocity = this.#LYFT;
    }
}

export class Pipe extends GameObject {

    static #PIPE_MOUTH_HEIGHT_PX = 20; // Height of the pipe top
    static #MIN_TOP_BOTTOM_PIPE_HEIGHT_PX = Pipe.#PIPE_MOUTH_HEIGHT_PX + 10.0; // Minimum height for top and bottom pipes

    constructor(height, x, y, bottomImage, topImage, bottomMouthImage, topMouthImage)
    {
        super(PIPE_WIDTH_PX, height);
        this.gapY = ClampValue(Math.random() * (height - PIPE_GAP_PX), Pipe.#MIN_TOP_BOTTOM_PIPE_HEIGHT_PX, height - Pipe.#MIN_TOP_BOTTOM_PIPE_HEIGHT_PX); // Random gap position
        this.bottomImage = bottomImage;
        this.topImage = topImage;
        this.bottomMouthImage = bottomMouthImage;
        this.topMouthImage = topMouthImage;
        this.SetPosition(x, y);
    }

    Update()
    {
        this.SetPosition(this.x - GAME_SPEED, this.y);
    }

    Draw(context)
    {
        // Draw pipes
        context.drawImage(this.topImage, this.x, this.y, this.width, this.gapY - Pipe.#PIPE_MOUTH_HEIGHT_PX); // top pipe
        context.drawImage(this.bottomImage, this.x, this.gapY + PIPE_GAP_PX + Pipe.#PIPE_MOUTH_HEIGHT_PX, this.width, this.height - this.gapY - PIPE_GAP_PX - Pipe.#PIPE_MOUTH_HEIGHT_PX); // bottom pipe

        // Draw mouths
        context.drawImage(this.topMouthImage, this.x, this.gapY - Pipe.#PIPE_MOUTH_HEIGHT_PX, this.width, Pipe.#PIPE_MOUTH_HEIGHT_PX); // top pipe mouth
        context.drawImage(this.bottomMouthImage, this.x, this.gapY + PIPE_GAP_PX, this.width, Pipe.#PIPE_MOUTH_HEIGHT_PX); // top pipe mouth
    }
}