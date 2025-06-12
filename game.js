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
        name: "Click Factory",
        basePrice: new Num(0.1, 0),
        type: "click"
    }),

    new Buyable({
        name: "Factory 1",
        basePrice: new Num(5, 0),
    }),
    
    new Buyable({
        name: "Factory 2",
        basePrice: new Num(25, 0),
    }),
    
    new Buyable({
        name: "Factory 3",
        basePrice: new Num(125, 0),
    }),
    
    new Buyable({
        name: "Factory 3",
        basePrice: new Num(625, 0),
    }),

    new Buyable({
        name: "Factory 3",
        basePrice: new Num(3125, 0),
    }),

    new Buyable({
        name: "Factory 3",
        basePrice: new Num(15625, 0),
    }),

    new Buyable({
        name: "Factory 3",
        basePrice: new Num(78125, 0),
    }),

    new Buyable({
        name: "Factory 3",
        basePrice: new Num(390625, 0),
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

    upgradeDiv.appendChild(nameDiv);
    upgradeDiv.appendChild(costDiv);
    upgradeDiv.appendChild(valueDiv);
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
        playSound(laserSound, 0.5);
    } else {
        playSound(gunSound, 0.5);
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
            enemy.health.sub(num(10));
            console.log(enemy.health);
            return;
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
    for(const upgrade of upgrades) {
        if(upgrade.level.value <= 0) return;
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

function gameLoop(delta) {
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



