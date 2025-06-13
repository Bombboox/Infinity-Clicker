const ENEMY_TYPES = [
    Reaper
];

class EnemySpawner {
    constructor(options = {}) {
        this.baseDifficulty = options.baseDifficulty ?? 1;
        this.difficulty = this.baseDifficulty;

        this.timeBetweenSpawns = options.timeBetweenSpawns ?? 1000;
        this.timer = this.timeBetweenSpawns;

        this.enemyRange = options.enemyRange ?? ENEMIES.length - 1;

    }

    update(deltaTime) {
        this.timer -= deltaTime;
        if(this.timer <= 0) {
            this.timer = this.timeBetweenSpawns;
            this.spawnEnemy();
        }
    }

    spawnEnemy() {
        const randomEdge = Math.random();
        var edge;

        if(randomEdge < 0.25) {
            edge = "left"
        } else if(randomEdge < 0.5) {
            edge = "top"
        } else if(randomEdge < 0.75) {
            edge = "right"
        } else {
            edge = "bottom"
        }

        var randomX, randomY;
        switch(edge) {
            case "left":
                randomX = -100;
                randomY = Math.random() * window.innerHeight;
                break;
            case "top":
                randomX = Math.random() * window.innerWidth;
                randomY = -100;
                break;
            case "right":
                randomX = window.innerWidth + 100;
                randomY = Math.random() * window.innerHeight;
                break;
            case "bottom":
                randomX = Math.random() * window.innerWidth;
                randomY = window.innerHeight + 100;
                break;
        }

        const options = {
            x: randomX,
            y: randomY,
            difficulty: this.difficulty
        }

        const enemy = new ENEMY_TYPES[Math.floor(Math.random() * this.enemyRange)]();
        enemies.push(enemy);
    }
}