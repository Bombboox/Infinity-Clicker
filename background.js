class Starfield {
    constructor(options = {}) {
        this.starCount = options.starCount ?? 100;
        this.minSize = options.minSize ?? 1;
        this.maxSize = options.maxSize ?? 3;
        this.minSpeed = options.minSpeed ?? 0.5;
        this.maxSpeed = options.maxSpeed ?? 2;
        this.minBrightness = options.minBrightness ?? 0.3;
        this.maxBrightness = options.maxBrightness ?? 1;
        this.container = options.container ?? worldContainer;
        
        this.stars = [];
        this.galaxies = [];
        this.createStars();
        this.createGalaxies();
    }

    createStars() {
        for (let i = 0; i < this.starCount; i++) {
            const star = new PIXI.Graphics();
            
            // Store original spawn position (relative to screen center)
            const originalX = (Math.random() - 0.5) * window.innerWidth * 2;
            const originalY = (Math.random() - 0.5) * window.innerHeight * 2;
            const z = Math.random() * 2000 + 1;
            
            // Random size and brightness
            const size = Math.random() * (this.maxSize - this.minSize) + this.minSize;
            const brightness = Math.random() * (this.maxBrightness - this.minBrightness) + this.minBrightness;
            
            // Random star color (70% white, 30% other colors)
            const colorRoll = Math.random();
            let starColor;
            if (colorRoll < 0.7) {
                starColor = 0xFFFFFF; // White
            } else if (colorRoll < 0.85) {
                starColor = 0xFFD700; // Gold
            } else if (colorRoll < 0.95) {
                starColor = 0x87CEEB; // Sky Blue
            } else {
                starColor = 0xFF69B4; // Hot Pink
            }
            
            // Draw star with glow
            star.clear();
            
            // Draw core star
            star.circle(0, 0, size);
            star.fill({color: starColor, alpha: brightness});

            // Store properties on the star object
            star.originalX = originalX;
            star.originalY = originalY;
            star.z = z;
            star.baseSize = size;
            star.speed = Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
            
            this.stars.push(star);
            this.container.addChild(star);
        }
    }

    createGalaxies() {
        // Create 3-5 galaxies
        const galaxyCount = Math.floor(Math.random() * 3) + 3;
        
        for (let i = 0; i < galaxyCount; i++) {
            const galaxy = new PIXI.Graphics();
            
            // Random galaxy position
            const originalX = (Math.random() - 0.5) * window.innerWidth * 2;
            const originalY = (Math.random() - 0.5) * window.innerHeight * 2;
            const z = Math.random() * 3000 + 500; // Galaxies are further away
            
            // Random galaxy properties
            const size = Math.random() * 100 + 50; // Larger than stars
            const brightness = Math.random() * 0.3 + 0.1; // Subtle glow
            
            // Random galaxy color
            const colors = [0x4169E1, 0x9370DB, 0x4B0082, 0x800080]; // Blue/Purple shades
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // Draw galaxy using tiny circles
            galaxy.clear();
            
            // Create spiral pattern with circles
            const numArms = 4;
            const pointsPerArm = 20;
            const spiralTightness = 0.3;
            
            for (let arm = 0; arm < numArms; arm++) {
                const baseAngle = (arm * 2 * Math.PI) / numArms;
                
                for (let point = 0; point < pointsPerArm; point++) {
                    const distance = (point / pointsPerArm) * size;
                    const angle = baseAngle + (point * spiralTightness);
                    
                    // Calculate position of circle
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                    
                    // Draw circle
                    const circleSize = Math.max(1, 3 * (1 - point / pointsPerArm));
                    galaxy.circle(x, y, circleSize);
                    galaxy.fill({color: color, alpha: brightness * (1 - point / pointsPerArm)});
                }
            }
            
            // Store properties
            galaxy.originalX = originalX;
            galaxy.originalY = originalY;
            galaxy.z = z;
            galaxy.baseSize = size;
            galaxy.speed = Math.random() * 0.5 + 0.2; // Slower than stars
            
            this.galaxies.push(galaxy);
            this.container.addChild(galaxy);
        }
    }

    update() {
        const centerX = 0;
        const centerY = 0;
        
        // Update stars
        for (const star of this.stars) {
            star.z -= star.speed;
            
            if (star.z <= 1) {
                star.z = 2000;
                star.originalX = (Math.random() - 0.5) * window.innerWidth * 2;
                star.originalY = (Math.random() - 0.5) * window.innerHeight * 2;
            }
            
            const perspective = 1000 / star.z;
            star.scale.set(perspective);
            star.x = star.originalX * perspective + centerX;
            star.y = star.originalY * perspective + centerY;
            star.alpha = Math.min(1, Math.max(0.1, star.z / 1000));
        }

        // Update galaxies
        for (const galaxy of this.galaxies) {
            galaxy.z -= galaxy.speed;
            
            if (galaxy.z <= 100) {
                galaxy.z = 3000;
                galaxy.originalX = (Math.random() - 0.5) * window.innerWidth * 2;
                galaxy.originalY = (Math.random() - 0.5) * window.innerHeight * 2;
            }
            
            const perspective = 1000 / galaxy.z;
            galaxy.scale.set(perspective);
            galaxy.x = galaxy.originalX * perspective + centerX;
            galaxy.y = galaxy.originalY * perspective + centerY;
            galaxy.alpha = Math.min(0.8, Math.max(0.05, galaxy.z / 2000));
        }
    }
}