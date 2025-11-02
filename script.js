const DOT_COUNT = 40;
const MIN_THICKNESS = 1;
const MAX_THICKNESS = 2;
const MIN_LENGTH = 10;
const MAX_LENGTH = 30;
const MIN_DURATION = 0.5;
const MAX_DURATION = 2;

const TARGET_TITLE = "Купер"; 
const SCRAMBLE_CHARS = "░▒▓█▀▄█▌▐░█▀♦•◘○♣♠♪♫►◄⌂▼▲"; 

function createDot() {
    const dotContainer = document.getElementById('dot-container');
    const dot = document.createElement('div');
    dot.className = 'dot';

    const thickness = Math.random() * (MAX_THICKNESS - MIN_THICKNESS) + MIN_THICKNESS;
    const length = Math.random() * (MAX_LENGTH - MIN_LENGTH) + MIN_LENGTH;

    dot.style.width = `${thickness}px`;
    dot.style.height = `${length}px`;

    const startX = Math.random() * 100;
    dot.style.left = `${startX}vw`;

    const duration = Math.random() * (MAX_DURATION - MIN_DURATION) + MIN_DURATION;
    dot.style.animation = `fall ${duration}s linear infinite`;
    dot.style.opacity = Math.random() * 0.5 + 0.3;
    dot.style.animationDelay = `-${Math.random() * duration}s`;

    dotContainer.appendChild(dot);
}


function updateLocalTime() {
    const now = new Date();

    
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    const formattedTime = now.toLocaleTimeString('en-US', timeOptions);

    
    const timezoneOptions = { timeZoneName: 'short' };
    const timezoneParts = now.toLocaleTimeString('en-US', timezoneOptions).split(' ');
    const timezoneString = timezoneParts[timezoneParts.length - 1] || '';

    
    const timeText = `${formattedTime} ${timezoneString}`;

    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
        timeDisplay.textContent = timeText;
    }
}


function getRandomScrambleChar() {
    return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}


function scrambleAndSetTitle(targetIndex, currentBase) {
    const targetChar = TARGET_TITLE[targetIndex - 1];
    const scrambleDuration = 500;
    const scrambleSteps = 8;
    const stepDelay = scrambleDuration / scrambleSteps;

    let currentStep = 0;

    function nextStep() {
        if (currentStep < scrambleSteps) {
            
            document.title = currentBase + getRandomScrambleChar();
            currentStep++;
            setTimeout(nextStep, stepDelay);
        } else {
            
            document.title = currentBase + targetChar;
        }
    }

    nextStep();
}


function startTitleAnimation() {
    const delayStep = 500;
    const fullDisplayHold = 2000;
    const clearHold = 500;

    let totalDelay = 0;
    const BLANK_TITLE = "\u00A0";

    
    document.title = BLANK_TITLE;

    
    for (let i = 1; i <= TARGET_TITLE.length; i++) {
       
        const currentBase = TARGET_TITLE.substring(0, i - 1);

        setTimeout(() => {
           
            scrambleAndSetTitle(i, currentBase);
        }, totalDelay);

        
        totalDelay += delayStep;
    }

    
    totalDelay += fullDisplayHold;

    
    setTimeout(() => {
        document.title = BLANK_TITLE;
    }, totalDelay);

    
    totalDelay += clearHold;

    
    setTimeout(() => {
        startTitleAnimation();
    }, totalDelay);
}


document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const video = document.getElementById('background-video');
    const mainContent = document.getElementById('main-content');

    
    for (let i = 0; i < DOT_COUNT; i++) createDot();

    
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        @keyframes fall {
            0% { transform: translateY(-10vh); }
            100% { transform: translateY(110vh); }
        }
    `;
    document.head.appendChild(styleSheet);

    
    updateLocalTime();
    setInterval(updateLocalTime, 1000);
    startTitleAnimation();

    
    overlay.addEventListener('click', () => {
        document.getElementById('click-text').style.opacity = '0';
        video.muted = false;
        video.play().catch(() => { });

        
        overlay.style.opacity = '0';
        mainContent.classList.remove('hidden');
        mainContent.style.opacity = '1';

        document.body.style.overflow = 'auto';

        
        setTimeout(() => {
            overlay.remove();
        }, 1000);
    });

});
