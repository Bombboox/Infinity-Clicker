const laserSound = new Audio('sounds/laser.mp3');
const gunSound = new Audio('sounds/gun.mp3');

function playSound(sound, volume = 1.0) {
    sound.currentTime = 0;
    sound.volume = volume;
    sound.play();
}
