import { GRAVITY, GAME_SPEED } from './Constants';
import { ClampValue } from './Utils';

class GameObject {
    constructor(width, height)
    {
        this.horizontalVeloctiy = 0.0;
        this.verticalVelocity = 0.0;

        this.SetBounds(Number.MIN_VALUE, Number.MAX_VALUE, Number.MIN_VALUE, Number.MAX_VALUE);
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
    Within(x, y)
    {
        return (
            x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height
        );
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

// export class Pipe extends GameObject {
//     constructor(width, height) {
//         super(width, height);
//     }

//     draw(context) {
//         context.fillStyle = 'green';
//         context.fillRect(this.x, this.y, this.width, this.height);
//     }
// }