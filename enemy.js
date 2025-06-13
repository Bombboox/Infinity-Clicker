class Enemy {
    constructor(options = {x, y, maxHealth, health, damage, reward, animationSettings, colllider, difficulty, speed}) {
        this.x = options.x ?? 0;
        this.y = options.y ?? 0;

        this.difficulty = options.difficulty ?? 1;
        this.maxHealth = options.maxHealth.mul(this.difficulty) ?? new Num(100, 0).mul(this.difficulty);
        this.health = options.health ?? this.maxHealth;
        
        this.damage = options.damage ?? 1;
        this.reward = options.reward ?? new Num(1, 0);
        this.collider = options.collider ?? new BoxCollider({parent: this, x: this.x, y: this.y, width: 200, height: 200});
        
        this.speed = options.speed ?? 1;
        this.dx = 0;
        this.dy = 0;
        
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

    moveTowards(x, y, delta) {
        let direction = vector(x - this.x, y - this.y);
        direction = direction.normalize();
        this.dx = direction.x * this.speed * delta;
        this.dy = direction.y * this.speed * delta;
        this.x += this.dx;
        this.y += this.dy;
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
        if (this.flashTime > 0 && this.animation) {
            this.flashTime -= delta;
            if (this.flashTime <= 0) {
                this.animation.tint = this._originalTint ?? 0xFFFFFF;
            }
        }
        this.updateAnimation();
    }

    updateAnimation() {
        if(!this.animation) return;

        this.animation.x = this.x;
        this.animation.y = this.y;

        if(this.dx > 0) {
            this.animation.scale.x = positive(this.animation.scale.x);
        } else if(this.dx < 0) {
            this.animation.scale.x = negative(this.animation.scale.x);
        }
    }
}

class Reaper extends Enemy {
    constructor(options = {difficulty, x, y}) {
        super({
            x: options.x ?? -150,
            y: options.y ?? 0,
            difficulty: options.difficulty ?? 1,
            maxHealth: new Num(45, 0),
            speed: 1.20,
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

        this.moveTowards(0, 0, delta * 100);
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
            speed: 0.8,
            damage: 1,
            reward: new Num(1, 0),
            animationSettings: {
                sheet: "resources/ghost.png",
                frameWidth: 1024,
                frameHeight: 1024,
                frameCount: 6,
                animationSpeed: 0.5,
                loop: true,
                worldContainer: worldContainer,
                scale: 0.075
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

        this.moveTowards(0, 0, delta * 100);
        super.update(delta);
    }
}
