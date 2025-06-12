async function createAnimation(options = {sheet, frameWidth, frameHeight, frameCount, worldContainer, destroyOnComplete, x, y, animationSpeed, loop, scale}) {
    const sheet = await PIXI.Assets.load(options.sheet);
    const frameWidth = options.frameWidth ?? 200;
    const frameHeight = options.frameHeight ?? 200;
    const frameCount = options.frameCount ?? 11;
    const worldContainer = options.worldContainer ?? worldContainer;
    const destroyOnComplete = options.destroyOnComplete ?? false;
    const x = options.x ?? 0;
    const y = options.y ?? 0;
    const scale = options.scale ?? 1;
    const animationSpeed = options.animationSpeed ?? 0.5;
    const loop = options.loop ?? false;
    const frames = [];

    for(let i = 0; i < frameCount; i++) {
        frames.push(new PIXI.Texture({
            source: sheet,
            frame: new PIXI.Rectangle(i * frameWidth, 0, frameWidth, frameHeight)
        }));
    }
    
    const animation = new PIXI.AnimatedSprite(frames);
    animation.anchor.set(0.5);
    animation.x = x;
    animation.y = y;
    animation.animationSpeed = animationSpeed;
    animation.loop = loop;
    animation.scale.set(scale);
    worldContainer.addChild(animation);

    animation.play();

    if(destroyOnComplete) {
        animation.onComplete = () => {
            animation.destroy();
        };
    }

    animators.push(animation);
    return animation;
}
