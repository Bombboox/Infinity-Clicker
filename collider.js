var DRAWING_COLLIDERS = false;

class BoxCollider {
    constructor(options = {parent, x, y, width, height}) {
        this.parent = options.parent;
        this.x = options.x ?? this.parent.x;
        this.y = options.y ?? this.parent.y;
        this.width = options.width ?? 0;
        this.height = options.height ?? 0;
        this.anchorX = options.anchorX ?? 0.5;
        this.anchorY = options.anchorY ?? 0.5;

        this.graphics = new PIXI.Graphics();
        worldContainer.addChild(this.graphics);
    }

    update() {
        this.x = this.parent.x;
        this.y = this.parent.y;

        if(DRAWING_COLLIDERS) {
            this.graphics.clear();
            this.graphics.rect(
                this.x - (this.width * this.anchorX),
                this.y - (this.height * this.anchorY),
                this.width,
                this.height
            );
            this.graphics.fill({color: 0xFFFFFF, alpha: 0.2});
        } else {
            this.graphics.clear();
        }
    }

    destroy() {
        this.graphics.destroy();
        worldContainer.removeChild(this.graphics);
    }

    collidesWithBox(other) {
        return this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y;
    }

    collidesWithPoint(x, y) {
        return x > this.x && x < this.x + this.width &&
            y > this.y && y < this.y + this.height;
    }

    collidesWithCircle(x, y, radius) {
        // Find closest point on box to circle center
        const closestX = Math.max(this.x - (this.width * this.anchorX), Math.min(x, this.x - (this.width * this.anchorX) + this.width));
        const closestY = Math.max(this.y - (this.height * this.anchorY), Math.min(y, this.y - (this.height * this.anchorY) + this.height));
        
        // Calculate distance between closest point and circle center
        const distanceX = x - closestX;
        const distanceY = y - closestY;
        const distanceSquared = distanceX * distanceX + distanceY * distanceY;
        
        return distanceSquared < (radius * radius);
    }
}