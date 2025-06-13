class Enemy {
    constructor(options = {x, y, maxHealth, health, damage, reward, animationSettings, colllider, difficulty}) {
        this.x = options.x ?? 0;
        this.y = options.y ?? 0;

        this.difficulty = options.difficulty ?? 1;
        this.maxHealth = options.maxHealth.mul(this.difficulty) ?? new Num(100, 0).mul(this.difficulty);
        this.health = options.health ?? this.maxHealth;
        
        this.damage = options.damage ?? 1;
        this.reward = options.reward ?? new Num(1, 0);
        this.collider = options.collider ?? new BoxCollider({parent: this, x: this.x, y: this.y, width: 200, height: 200});
        this.animationSettings = options.animationSettings ?? {
            sheet: "resources/reaper.png",
            frameWidth: 200,
            frameHeight: 200,
            frameCount: 6,
            animationSpeed: 0.5,
            loop: true,
            worldContainer: worldContainer,
            scale: 0.5,
            x: this.x,
            y: this.y,
        };

        this.flashTime = 0;
        this.flashDuration = 0.15; 

        createAnimation(this.animationSettings).then(animation => {
            this.animation = animation;
            // Store original tint for restoration
            this._originalTint = animation.tint ?? 0xFFFFFF;
        });
    }

    moveTowards(x, y) {
        const direction = new Vec2(x - this.x, y - this.y);
        const distance = direction.length();
        const speed = 100;
        const time = distance / speed;
        const dx = direction.x * time;
        const dy = direction.y * time;
        this.x += dx;
        this.y += dy;
    } 
 
    hurt(amount) {
        this.health.sub(amount);

        // Start flash effect
        this.flashTime = this.flashDuration;
        if (this.animation) {
            this.animation.tint = 0xFF4444; // Red flash
        }

        if(this.health.smallerThan(new Num(0, 0))) {
            this.destroy();
        }
    }

    destroy() {
        if (this.animation) {
            this.animation.destroy();
        }
        this.collider.destroy();
        const index = enemies.indexOf(this);
        if(index !== -1) {
            enemies.splice(index, 1);
        }
    }

    update(delta = 1/60) {
        // Flash logic
        if (this.flashTime > 0 && this.animation) {
            this.flashTime -= delta;
            if (this.flashTime <= 0) {
                this.animation.tint = this._originalTint ?? 0xFFFFFF;
            }
        }
        // OVERRIDE IN SUBCLASS
        // console.log("Enemy update");
    }
}

class Reaper extends Enemy {
    constructor(options = {difficulty, x, y}) {
        super({
            x: options.x ?? -150,
            y: options.y ?? 0,
            difficulty: options.difficulty ?? 1,
            maxHealth: new Num(100, 0),
            damage: 1,
            reward: new Num(1, 0),
            animationSettings: {
                sheet: "resources/reaper.png",
                frameWidth: 200,
                frameHeight: 200,
                frameCount: 6,
                animationSpeed: 0.5,
                loop: true,
                worldContainer: worldContainer,
                scale: 0.5
            },
        });
        this.collider = new BoxCollider({parent: this, x: this.x, y: this.y, width: 100, height: 100})
    }

    update(delta = 1/60) {
        if(this.health.smallerThan(new Num(0, 0))) {
            this.destroy();
            return;
        }

        this.collider.update();

        if(this.animation) {
            this.animation.x = this.x;
        }

        // Call parent update for flash effect
        super.update(delta);
    }
}

class Ghost extends Enemy {
    constructor(options = {difficulty, x, y}) {
        super({
            x: options.x ?? -150,
            y: options.y ?? 0,
            difficulty: options.difficulty ?? 1,
            maxHealth: new Num(100, 0),
            damage: 1,
            reward: new Num(1, 0),
            animationSettings: {
                sheet: "resources/ghost.png",
                frameWidth: 200,
                frameHeight: 200,
                frameCount: 6,
                animationSpeed: 0.5,
                loop: true,
                worldContainer: worldContainer,
                scale: 0.5
            },
        });
        this.collider = new BoxCollider({parent: this, x: this.x, y: this.y, width: 100, height: 100})
    }

    update(delta = 1/60) {
        if(this.health.smallerThan(new Num(0, 0))) {
            this.destroy();
            return;
        }

        this.collider.update();

        if(this.animation) {
            this.animation.x = this.x;
        }

        // Call parent update for flash effect
        super.update(delta);
    }
}
