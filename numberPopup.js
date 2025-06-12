class NumberPopup {
    constructor(options = {text, x, y, font, fontSize, color, lifeTime, velocity, fadeSpeed, randomOffset}) {
        this.text = options.string ?? "0";
        this.x = options.x ?? 0;
        this.y = options.y ?? 0;
        this.font = options.font ?? "Arial";
        this.fontSize = options.fontSize ?? 24;
        this.color = options.color ?? 0xFFFFFF;
        this.lifetime = options.lifetime ?? 60; // frames
        this.currentFrame = 0;
        this.velocity = options.velocity ?? { x: 0, y: -2 };
        this.fadeSpeed = options.fadeSpeed ?? 0.02;
        this.randomOffset = options.randomOffset ?? 0;

        this.x += Math.random() * this.randomOffset * 2 - this.randomOffset;
        this.y += Math.random() * this.randomOffset * 2 - this.randomOffset;

        // Create PIXI text
        this.sprite = new PIXI.Text({
            text: this.text,
            style: {
                fontFamily: this.font,
                fontSize: this.fontSize,
                fill: this.color,
                align: 'center'
            }
        });

        this.sprite.anchor.set(0.5);
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.alpha = 1;

        // Add to particles array
        particles.push(this);
        worldContainer.addChild(this.sprite);
    }

    update() {
        this.currentFrame++;
        
        // Update position
        this.sprite.x += this.velocity.x;
        this.sprite.y += this.velocity.y;
        
        // Fade out
        this.sprite.alpha -= this.fadeSpeed;

        // Remove if lifetime exceeded or fully transparent
        if (this.currentFrame >= this.lifetime || this.sprite.alpha <= 0) {
            this.destroy();
        }
    }

    destroy() {
        this.sprite.destroy();
        const index = particles.indexOf(this);
        if (index !== -1) {
            particles.splice(index, 1);
        }
    }
}
