const enemySpawner = new EnemySpawner({
    difficulty: 1,
});

var money = new Num(0, 0);
var moneyPerClick = new Num(1, -2);
var idleMoney = new Num(0, 0);
var maxHealth = 100;
var health = maxHealth;
var healthBarOpacity = 0;

var animators = [];
var enemies = [];
var particles = []

var mouseX = 0;
var mouseY = 0;

const upgrades = [
    new Buyable({
        name: "Miner",
        basePrice: new Num(0.1, 0),
        icon: "sprites/miner.png",
        type: "click"
    }),

    new Buyable({
        name: "Merchant",
        basePrice: new Num(5, 0),
        icon: "sprites/merchant.png",
    }),
    
    new Buyable({
        name: "Blacksmith",
        basePrice: new Num(25, 0),
        icon: "sprites/blacksmith.png",
    }),
    
    new Buyable({
        name: "Prince",
        basePrice: new Num(125, 0),
        icon: "sprites/prince.png",
    }),

    new Buyable({
        name: "King",
        basePrice: new Num(625, 0),
        icon: "sprites/king.png",
    }),
    
    new Buyable({
        name: "Apothocary",
        basePrice: new Num(3125, 0),
        icon: "sprites/rat.png",
    }),

    new Buyable({
        name: "Doctor",
        basePrice: new Num(15625, 0),
        icon: "sprites/doctor.png",
    }),

    new Buyable({
        name: "Cyclops",
        basePrice: new Num(78125, 0),
        icon: "sprites/cyclops.png",
    }),

    new Buyable({
        name: "Watcher",
        basePrice: new Num(390625, 0),
        icon: "sprites/watcher.png",
    }),

    new Buyable({
        name: "Fish",
        basePrice: new Num(1953125, 0),
        icon: "sprites/fish.png",
    }),

    new Buyable({
        name: "Sphere",
        basePrice: new Num(9765625, 0),
        icon: "sprites/sphere.png",
    }),

    new Buyable({
        name: "Wall",
        basePrice: new Num(48828125, 0),
        icon: "sprites/wall.png",
    }),

    new Buyable({
        name: "Painter",
        basePrice: new Num(244140625, 0),
        icon: "sprites/painter.png",
    }),
];

const healthContainer = document.getElementById("health");
const healthBar = document.getElementById("health-bar");
const upgradeBar = document.getElementById("upgrade-bar");
const upgradeWindow1 = document.getElementById("upgrade-window1");
const upgradeWindow2 = document.getElementById("upgrade-window2");
upgradeWindow1.innerHTML = "";
upgradeWindow2.innerHTML = "";

const app = new PIXI.Application();
let appInitialized = false;

async function initializeApp() {
    if(appInitialized) return;

    await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        resizeTo: window,
        background: "#000000",
        antialias: true,
        resolution: window.devicePixelRatio,
        autoDensity: true,
    });

    app.canvas.addEventListener("mousedown", (e) => {
        canvasClick(e);
    });

    document.addEventListener("mousemove", (e) => {
        updateMousePosition(e);
    });

    document.body.appendChild(app.canvas);
    appInitialized = true;

    app.start();
}

const worldContainer = new PIXI.Container();
const starfield = new Starfield({
    starCount: 1000,
    minSize: 1,
    maxSize: 3,
    minSpeed: 0.25,
    maxSpeed: 1,
    minBrightness: 0.3,
    maxBrightness: 1,
    container: worldContainer,
});

function fixWorldContainerPosition() {
    worldContainer.x = app.screen.width / 2;
    worldContainer.y = app.screen.height / 2;
}

async function main() {
    await initializeApp();
    app.stage.addChild(worldContainer);

    app.ticker.add((delta) => {
        gameLoop(delta);
    });
}

window.onload = main;

upgrades.forEach((upgrade, index) => {
    const upgradeDiv = document.createElement("div");
    upgradeDiv.className = "upgrade";
    upgradeDiv.id = `factory_${index}`;
    upgradeDiv.onclick = () => buyUpgrade(index);

    const textDiv = document.createElement("div");
    textDiv.className = "upgrade-text";

    const nameDiv = document.createElement("div");
    nameDiv.className = "upgrade-name";
    nameDiv.textContent = upgrade.name;

    const costDiv = document.createElement("div");
    costDiv.className = "upgrade-cost";
    costDiv.id = `factory_${index}_cost`;
    costDiv.textContent = `Cost: ${upgrade.getPrice()}`;

    const valueDiv = document.createElement("div");
    valueDiv.className = "upgrade-value";
    valueDiv.id = `factory_${index}_value`;
    valueDiv.textContent = `Value: ${upgrade.getValue()}`;

    // Append text elements to the text container
    textDiv.appendChild(nameDiv);
    textDiv.appendChild(costDiv);
    textDiv.appendChild(valueDiv);

    const iconDiv = document.createElement("div");
    iconDiv.className = "icon";
    iconDiv.style.backgroundImage = `url(${upgrade.icon})`;

    // Append the text container and icon to the upgrade div
    upgradeDiv.appendChild(textDiv);
    upgradeDiv.appendChild(iconDiv);
    upgradeWindow1.appendChild(upgradeDiv);
});

function handleClick() {
    addMoney(moneyPerClick);
    new NumberPopup({
        string: moneyPerClick.toString(),
        x: mouseX,
        y: mouseY,
        fontSize: 24,
        color: 0xFFFFFF,
        randomOffset: 15,
    });
}

function buyUpgrade(upgradeId, amount = 1) {
    const upgrade = upgrades[upgradeId];
    if(upgrade.upgrade(money, amount)) {
        refreshUpgrades();
        refreshMoney();

        const id = `factory_${upgradeId}_cost`;
        document.getElementById(id).innerHTML = `Cost: ${upgrade.getPrice()}`;

        const valueId = `factory_${upgradeId}_value`;
        document.getElementById(valueId).innerHTML = `Value: ${upgrade.getValue()}`;
    }
}

function addMoney(amount) {
    money.add(amount);
    refreshMoney();
}

function addHealth(amount) {
    health += amount;
    if(health > maxHealth) {
        health = maxHealth;
    }
    healthBarOpacity = 2;
    refreshHealth();
}

async function fire(x, y) {
    if(Math.random() < 0.8) {
        playSound(laserSound, 0.3);
    } else {
        playSound(gunSound, 0.3);
    }   

    createAnimation({
        sheet: "resources/fire0.png",
        frameWidth: 200,
        frameHeight: 200,
        frameCount: 11,
        worldContainer: worldContainer,
        x: x,
        y: y,
        animationSpeed: 0.5,
        loop: false,
        scale: 0.35,
        destroyOnComplete: true,
    });

    for(const enemy of enemies) {
        if(enemy.collider.collidesWithCircle(x, y, 25)) {
            enemy.hurt(num(10));
            new NumberPopup({
                string: "10",
                x: x,
                y: y,
                fontSize: 24,
                color: 0xFFFFFF,
            });
        }
    }

    for(const particle of particles) {
        particle.update();
    }
}

function refreshMoney() {
    document.getElementById("money").innerHTML = money.toString();
}

function refreshUpgrades() {
    moneyPerClick = new Num(1, -2);
    idleMoney = new Num(0, 0);
    console.log("refreshed");
    for(const upgrade of upgrades) {
        if(upgrade.level.value <= 0) continue;
        if(upgrade.type === "click") {
            moneyPerClick.add(upgrade.value);
        } else {
            idleMoney.add(upgrade.value);
        }
    }
}

function refreshHealth() {
    healthBar.style.width = `${health / maxHealth * 100}%`;
}

function gameLoop(deltaTime) {
    const delta = deltaTime.deltaTime * (1000 / 60);

    healthBarOpacity -= 0.01;
    if(healthBarOpacity < 0) {
        healthBarOpacity = 0;
    }
    healthContainer.style.opacity = healthBarOpacity;

    for(const enemy of enemies) {
        enemy.update();
    }
    
    for(const particle of particles) {
        particle.update();
    }

    starfield.update();
    enemySpawner.update(delta);

    fixWorldContainerPosition();
    addMoney(Num.mul(idleMoney, new Num(60/1000, 0)));
    refreshHealth();
}

function closeWindow() {
    if (upgradeBar.classList.contains("inactive")) {
        upgradeBar.classList.remove("inactive");
        new NumberPopup({
            string: "OPENED",
            x: mouseX - 75  ,
            y: mouseY,
            fontSize: 16,
            color: 0xFFFFFF,
            randomOffset: 15,
        });
    } else {
        upgradeBar.classList.add("inactive");
        new NumberPopup({
            string: "CLOSED",
            x: mouseX - 75,
            y: mouseY,
            fontSize: 16,
            color: 0xFFFFFF,
            randomOffset: 15,
        });
    }
}

function switchWindow(num) {
    const windows = document.querySelectorAll(".upgrade-window");
    windows.forEach(window => {
        if(window.id === windowKey[num]) {
            window.style.display = "flex";
        } else {
            window.style.display = "none";
        }
    });
}
    

function canvasClick(e) {
    fire(e.clientX - worldContainer.x, e.clientY - worldContainer.y);
}

function updateMousePosition(e) {
    mouseX = e.clientX - worldContainer.x;
    mouseY = e.clientY - worldContainer.y;
}



