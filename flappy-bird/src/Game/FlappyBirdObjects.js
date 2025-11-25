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
    constructor(height, x, y) {
        super(PIPE_WIDTH_PX, height);
        this.gapY = Math.random() * (height - PIPE_GAP_PX); // Random gap position
        this.SetPosition(x, y);
    }

    Update()
    {
        this.SetPosition(this.x - GAME_SPEED, this.y);
    }

    Draw(context)
    {
        context.fillStyle = 'green';
        context.fillRect(this.x, this.y, this.width, this.gapY); // top pipe
        context.fillRect(this.x, this.gapY + PIPE_GAP_PX, this.width, this.height - this.gapY - PIPE_GAP_PX); // bottom pipe
    }
}