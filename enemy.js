class Enemy {
    constructor(options = {x, y, maxHealth, health, damage, reward, animationSettings, colllider}) {
        this.x = options.x ?? 0;
        this.y = options.y ?? 0;
        this.maxHealth = options.maxHealth ?? new Num(100, 0);
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

        createAnimation(this.animationSettings).then(animation => {
            this.animation = animation;
        });
    }

    destroy() {
        this.animation.destroy();
        this.collider.destroy();
        const index = enemies.indexOf(this);
        if(index !== -1) {
            enemies.splice(index, 1);
        }
    }

    update() {
        // OVERRIDE IN SUBCLASS
        console.log("Enemy update");
    }
}

class Reaper extends Enemy {
    constructor() {
        super({
            x: -150,
            y: 0,
            maxHealth: new Num(100, 0),
            health: new Num(100, 0),
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

    update() {
        if(this.health.smallerThan(new Num(0, 0))) {
            this.destroy();
            return;
        }

        this.collider.update();

        if(this.animation) {
            this.animation.x = this.x;
        }
    }
}

