import Variables from '../config.js';
import helpers from '../helpers.js';
import beerPourVideo from '../../assets/beerpourV2_VP9.webm';

const { globalVars, globalConst } = Variables;

// Constants
const AVATAR_LIFESPAN = 15000;
const BEER_FADE_IN_DELAY = 0;
const BEER_FADE_OUT_DELAY = 13;
const BEER_FADE_DURATION = 2;
const BASE_INTERVAL = 250;
const DROP_HEIGHT_RANGE = [500, 600];
const AVATAR_OFFSET = 175;
const AVATAR_SCALE = 0.8;

/**
 * Entry point for the animation.
 */
export function create(images) {
    const imgCount = images.length;
    const baseWidth = helpers.Randomizer(innerWidth / 2 - 50, innerWidth / 2 + 50);
    const xPositions = [baseWidth, baseWidth - AVATAR_OFFSET];
    const dropHeights = [
        innerHeight - DROP_HEIGHT_RANGE[0],
        innerHeight - DROP_HEIGHT_RANGE[1],
    ];

    images.forEach((image, index) => {
        const imageIndex = index % imgCount;
        setTimeout(() => {
            createAvatar(image, xPositions[imageIndex], dropHeights[imageIndex]);
        }, index * BASE_INTERVAL);
    });

    const beerDiv = createBeerDiv();
    globalConst.warp.appendChild(beerDiv);

    animateBeerGlass(beerDiv);
    appendBeerVideo(beerDiv);

    setTimeout(() => {
        helpers.removeelement(beerDiv.id);
    }, AVATAR_LIFESPAN);
}

/**
 * Creates and animates an avatar image.
 */
function createAvatar(imageUrl, x, drop) {
    const avatar = document.createElement('div');
    avatar.id = globalVars.divnumber++;
    avatar.style.background = `url(${imageUrl})`;
    avatar.style.backgroundSize = '100% 100%';

    gsap.set(avatar, {
        className: 'beer-avatar',
        x,
        y: -250,
        z: 10,
        scale: AVATAR_SCALE,
        transformOrigin: '50% 50%',
    });

    globalConst.warp.appendChild(avatar);
    animateDrop(avatar, drop);

    setTimeout(() => {
        helpers.removeelement(avatar.id);
    }, AVATAR_LIFESPAN);
}

/**
 * Creates the main beer glass container.
 */
function createBeerDiv() {
    const beerDiv = document.createElement('div');
    beerDiv.id = globalVars.divnumber++;
    beerDiv.style.backgroundSize = '100% 100%';

    gsap.set(beerDiv, {
        className: 'beer-glass',
        x: innerWidth / 2,
        y: 0,
        z: 0,
        opacity: 0,
        transformOrigin: 'center',
        xPercent: -50,
    });

    return beerDiv;
}

/**
 * Appends and configures the beer video inside the beer container.
 */
function appendBeerVideo(container) {
    const video = document.createElement('video');
    video.src = beerPourVideo;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.controls = false;
    video.style.width = '100%';
    video.style.height = '100%';

    container.appendChild(video);
}

/**
 * Animates the beer glass (fade in/out).
 */
function animateBeerGlass(element) {
    gsap.to(element, {
        opacity: 1,
        duration: BEER_FADE_DURATION,
        delay: BEER_FADE_IN_DELAY,
    });

    gsap.to(element, {
        opacity: 0,
        duration: BEER_FADE_DURATION,
        delay: BEER_FADE_OUT_DELAY,
    });
}

/**
 * Controls the bounce animation of a falling avatar.
 */
function animateDrop(element, dropTargetY) {
    const bounceSequence = [
        { offset: -175, duration: 1.45 },
        { offset: -125, duration: 1.55 },
        { offset: -100, duration: 1.65 },
    ];

    gsap.to(element, {
        rotation: helpers.Randomizer(-15, 15),
        delay: 1,
        duration: 4,
        ease: 'sine.inOut',
    });

    gsap.to(element, {
        y: dropTargetY,
        delay: 3,
        duration: 1.5,
        ease: 'power1.out',
        onComplete: () => bounceAvatar(element, dropTargetY, bounceSequence, 0),
    });
}

/**
 * Recursively animates the bounce sequence, then fades out.
 */
function bounceAvatar(element, baseY, sequence, index) {
    if (index >= sequence.length) return;

    const { offset, duration } = sequence[index];

    gsap.to(element, {
        y: baseY + offset,
        duration,
        yoyo: true,
        repeat: 1,
        ease: 'sine.inOut',
        onComplete: () => {
            if (index === sequence.length - 1) {
                fadeOut(element);
            } else {
                bounceAvatar(element, baseY, sequence, index + 1);
            }
        },
    });
}

/**
 * Fades out the provided element.
 */
function fadeOut(element) {
    gsap.to(element, {
        duration: 4,
        opacity: 0,
        ease: 'sine.inOut',
    });
}
