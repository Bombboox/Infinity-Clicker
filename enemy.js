class Enemy {
    constructor(options = {x, y, maxHealth, health, damage, reward, animationSettings, colllider, difficulty, speed, attackCooldown}) {
        this.x = options.x ?? 0;
        this.y = options.y ?? 0;

        this.difficulty = options.difficulty ?? 1;
        this.maxHealth = options.maxHealth.mul(this.difficulty) ?? new Num(100, 0).mul(this.difficulty);
        this.health = options.health ?? this.maxHealth;
        
        this.damage = options.damage ?? 10;
        this.reward = options.reward ?? new Num(1, 0);
        this.collider = options.collider ?? new BoxCollider({parent: this, x: this.x, y: this.y, width: 200, height: 200});
        
        this.speed = options.speed ?? 1;
        this.speed *= 0.1; // scaling to avoid supa fast enemies (1 is benchmark speed)

        this.dx = 0;
        this.dy = 0;

        this.attackCooldown = options.attackCooldown ?? 3000;
        this.attackTimer = this.attackCooldown;
        
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
        this.flashDuration = 150; 

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

    attackPlayer(delta) {
        if(this.attackTimer < 0) {
            this.attackTimer = this.attackCooldown;
            
            const originalX = this.x;
            const originalY = this.y;
            
            this.moveTowards(0, 0, delta * 5); 
            
            addHealth(-this.damage);

            setTimeout(() => {
                this.x = originalX;
                this.y = originalY;
            }, 100);
        }
        this.attackTimer -= delta;
    }

    moveAndAttackPlayer(delta) {
        const pos = vector(this.x, this.y);
        const target = vector(0, 0);
        const dist = pos.distance(target);

        if(dist > 120) {
            this.moveTowards(0, 0, delta);
        } else {
            this.attackPlayer(delta);
        }
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
            speed: 1.2,
            damage: 10,
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

        this.moveAndAttackPlayer(delta);
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
            speed: 0.7,
            damage: 15,
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

        this.moveAndAttackPlayer(delta);
        super.update(delta);
    }
}
