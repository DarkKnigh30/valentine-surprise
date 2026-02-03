/**
 * 💕 Minimal Valentine's Webapp - JavaScript
 */

// =========================================
// Elements
// =========================================

const screens = {
    entrance: document.getElementById('entranceScreen'),
    game1: document.getElementById('game1Screen'),
    pictureReveal: document.getElementById('pictureRevealScreen'),
    game2: document.getElementById('game2Screen'),
    game3: document.getElementById('game3Screen'),
    kisses: document.getElementById('kissesScreen'),
    question: document.getElementById('questionScreen'),
    yay: document.getElementById('yayScreen')
};

// =========================================
// Configuration - ADD YOUR PHOTO HERE!
// =========================================

const CONFIG = {
    // Replace this with your couple photo URL or local path
    couplePhoto: 'photo.jpg', // Put your photo as 'photo.jpg' in the same folder

    // Or use a direct URL:
    // couplePhoto: 'https://your-image-url.jpg',
};

// =========================================
// Initialization
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    initSubtleHearts();
    initEntrance();
    initPuzzleGame();
    initGame2();
    initQuestion();

    // Set the photo
    document.getElementById('couplePhoto').src = CONFIG.couplePhoto;
});

// =========================================
// Subtle Background Hearts
// =========================================

function initSubtleHearts() {
    const container = document.getElementById('heartsBg');

    for (let i = 0; i < 8; i++) {
        setTimeout(() => createMiniHeart(container), i * 1500);
    }

    setInterval(() => createMiniHeart(container), 2000);
}

function createMiniHeart(container) {
    const heart = document.createElement('span');
    heart.className = 'mini-heart';
    heart.textContent = '♥';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (12 + Math.random() * 8) + 's';
    heart.style.color = '#ff6b9d';
    container.appendChild(heart);

    setTimeout(() => heart.remove(), 20000);
}

// =========================================
// Screen Navigation
// =========================================

function goToScreen(screenId) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenId].classList.add('active');
}

// =========================================
// Entrance Screen
// =========================================

function initEntrance() {
    document.getElementById('startBtn').addEventListener('click', () => {
        goToScreen('game1');
    });
}

// =========================================
// Game 1: Memory Puzzle - Reveal Picture
// =========================================

let revealedPieces = 0;
const totalPieces = 9;

function initPuzzleGame() {
    const grid = document.getElementById('puzzleGrid');

    // Create 9 puzzle pieces (3x3 grid)
    for (let i = 0; i < totalPieces; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.dataset.index = i;
        // Calculate background position for this piece (shows part of photo)
        const col = i % 3;
        const row = Math.floor(i / 3);
        const bgPosX = col * 50; // percentage
        const bgPosY = row * 50; // percentage

        // Heart icon on the back, photo piece on front
        piece.innerHTML = `
            <div class="piece-back">💕</div>
            <div class="piece-front" style="background-image: url('${CONFIG.couplePhoto}'); background-size: 300%; background-position: ${bgPosX}% ${bgPosY}%;"></div>
        `;

        piece.addEventListener('click', () => revealPiece(piece, i));
        grid.appendChild(piece);
    }

    // Continue button from picture reveal
    document.getElementById('continueFromPicture').addEventListener('click', () => {
        goToScreen('game2');
        showQuiz(0);
    });
}

function revealPiece(piece, index) {
    if (piece.classList.contains('revealed')) return;

    piece.classList.add('revealed');
    revealedPieces++;

    document.getElementById('puzzleProgress').textContent = `${revealedPieces}/${totalPieces} pieces found`;

    // All pieces revealed!
    if (revealedPieces >= totalPieces) {
        setTimeout(() => {
            goToScreen('pictureReveal');
            animatePictureReveal();
        }, 800);
    }
}

function animatePictureReveal() {
    const overlay = document.getElementById('pictureOverlay');

    // Create puzzle pieces overlay that fade out
    for (let i = 0; i < 9; i++) {
        const piece = document.createElement('div');
        piece.className = 'overlay-piece';
        piece.style.left = (i % 3) * 33.33 + '%';
        piece.style.top = Math.floor(i / 3) * 33.33 + '%';
        piece.style.animationDelay = (i * 0.1) + 's';
        overlay.appendChild(piece);
    }
}

// =========================================
// Game 2: Personal Love Quiz
// =========================================

const quizData = [
    {
        question: "Where did it all begin? 💭",
        options: [
            { text: "27th March 2020", story: "The day I finally gathered all my courage and told you how I feel... My heart was racing so fast! 💓" },
            { text: "7th April 2020", story: "The most magical day... when YOU said you love me too! I literally couldn't stop smiling or lets say blushing.. 🥰" },
            { text: "10th November 2019", story: "\"Spotted and caught 👻\" — The text that started everything. Little did we know this would change our lives forever 💕" }
        ],
        type: "nostalgic"
    },
    {
        question: "What do I think about most? 😏",
        options: [
            { text: "Your cute face 👀", reaction: "True but .. more of those oceany eyes 😘" },
            { text: "Cuddling with you 🤗", reaction: "Getting warmer...🤗" },
            { text: "All of the above + more 😈", reaction: "Shhhh babe.. Lets keep this between us. 😉🤭💕" }
        ],
        type: "naughty"
    },
    {
        question: "What's our future looking like? 🔮",
        options: [
            { text: "More adventures together 🌍", reaction: "Absolutely! Every trip with you is special" },
            { text: "Growing old annoying each other 👴👵", reaction: "Can't wait to be that cute couple even then!" },
            { text: "Forever & always 💍", reaction: "ufff! This is the only answer 💕" }
        ],
        type: "future"
    }
];

let currentQuiz = 0;

function initGame2() {
    // Quiz will start when screen is shown
}

function showQuiz(index) {
    if (index >= quizData.length) {
        goToScreen('game3');
        startCatchGame();
        return;
    }

    currentQuiz = index;
    const q = quizData[index];
    document.getElementById('quizQuestion').textContent = q.question;

    const optionsDiv = document.getElementById('quizOptions');
    optionsDiv.innerHTML = '';

    const storyBox = document.getElementById('storyBox');
    storyBox.classList.remove('show');
    storyBox.innerHTML = '';

    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-btn';
        btn.textContent = opt.text;
        btn.addEventListener('click', () => handleQuizAnswer(btn, opt, q.type, index));
        optionsDiv.appendChild(btn);
    });
}

function handleQuizAnswer(btn, option, type, index) {
    btn.classList.add('selected');

    const storyBox = document.getElementById('storyBox');

    if (type === 'nostalgic') {
        storyBox.innerHTML = `<p class="story-text">${option.story}</p>`;
    } else {
        storyBox.innerHTML = `<p class="story-text">${option.reaction}</p>`;
    }

    storyBox.classList.add('show');

    setTimeout(() => {
        storyBox.classList.remove('show');
        setTimeout(() => showQuiz(index + 1), 300);
    }, 2500);
}

// =========================================
// Game 3: Catch Hearts with Timer
// =========================================

let caughtHearts = 0;
let gameActive = false;
let timerStarted = false;
let timeLeft = 10;
let timerInterval = null;

function startCatchGame() {
    caughtHearts = 0;
    gameActive = true;
    timerStarted = false;
    timeLeft = 10;

    document.getElementById('heartCount').textContent = '0';
    document.getElementById('timerDisplay').textContent = '⏱️ --';
    document.getElementById('game3Subtitle').textContent = 'Catch at least 5 hearts to start the timer!';

    dropHeart();

    // Start dropping clocks occasionally after timer starts
    setTimeout(dropClock, 3000);
}

function dropHeart() {
    if (!gameActive) return;

    const area = document.getElementById('catchArea');
    const heart = document.createElement('div');
    heart.className = 'falling-heart';
    heart.textContent = '💖';
    heart.style.left = (10 + Math.random() * 80) + '%';

    heart.addEventListener('click', () => catchHeart(heart));

    // Touch support
    heart.addEventListener('touchstart', (e) => {
        e.preventDefault();
        catchHeart(heart);
    }, { passive: false });

    area.appendChild(heart);

    setTimeout(() => {
        if (!heart.classList.contains('caught')) {
            heart.remove();
        }
    }, 3000);

    // Keep dropping hearts while game is active
    if (gameActive) {
        setTimeout(dropHeart, 600 + Math.random() * 400);
    }
}

function dropClock() {
    if (!gameActive || !timerStarted) {
        // Try again later if timer hasn't started yet
        if (gameActive) setTimeout(dropClock, 2000);
        return;
    }

    const area = document.getElementById('catchArea');
    const clock = document.createElement('div');
    clock.className = 'falling-heart falling-clock';
    clock.textContent = '⏰';
    clock.style.left = (10 + Math.random() * 80) + '%';

    clock.addEventListener('click', () => catchClock(clock));

    clock.addEventListener('touchstart', (e) => {
        e.preventDefault();
        catchClock(clock);
    }, { passive: false });

    area.appendChild(clock);

    setTimeout(() => {
        if (!clock.classList.contains('caught')) {
            clock.remove();
        }
    }, 2500);

    // Drop another clock after some time
    if (gameActive) {
        setTimeout(dropClock, 4000 + Math.random() * 3000);
    }
}

function catchClock(clock) {
    if (clock.classList.contains('caught') || !gameActive) return;

    clock.classList.add('caught');

    // Add 3 seconds!
    timeLeft += 3;
    document.getElementById('timerDisplay').textContent = `⏱️ ${timeLeft}s`;
    document.getElementById('timerDisplay').classList.add('timer-bonus');
    setTimeout(() => {
        document.getElementById('timerDisplay').classList.remove('timer-bonus');
    }, 500);
}

function catchHeart(heart) {
    if (heart.classList.contains('caught') || !gameActive) return;

    heart.classList.add('caught');
    caughtHearts++;
    document.getElementById('heartCount').textContent = caughtHearts;

    // Start timer after 5 hearts
    if (caughtHearts >= 5 && !timerStarted) {
        startTimer();
    }
}

function startTimer() {
    timerStarted = true;
    document.getElementById('game3Subtitle').textContent = 'Keep catching! 10 seconds left!';
    document.getElementById('timerDisplay').textContent = '⏱️ 10s';

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timerDisplay').textContent = `⏱️ ${timeLeft}s`;

        if (timeLeft <= 3) {
            document.getElementById('timerDisplay').classList.add('timer-warning');
        }

        if (timeLeft <= 0) {
            endCatchGame();
        }
    }, 1000);
}

function endCatchGame() {
    gameActive = false;
    clearInterval(timerInterval);

    // Show kisses screen
    document.getElementById('kissesCount').textContent = caughtHearts;
    goToScreen('kisses');

    // After 5 seconds, go to question
    setTimeout(() => {
        goToScreen('question');
    }, 5000);
}

// =========================================
// The Question - Enhanced No Button
// =========================================

let noClickCount = 0;
const noButtonTexts = [
    "No",
    "Are you sure? 🥺",
    "Really?? 😢",
    "Think again! 💔",
    "Please? 🥹",
    "Pretty please?",
    "I'll be sad 😿",
    "Last chance!",
    "...",
    "Fine, click Yes 👆"
];

function initQuestion() {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');

    yesBtn.addEventListener('click', () => {
        goToScreen('yay');
        celebrate();
    });

    noBtn.addEventListener('mouseover', moveNoButton);
    noBtn.addEventListener('touchstart', handleNoTouch, { passive: false });

    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleNoClick();
    });
}

function moveNoButton() {
    const noBtn = document.getElementById('noBtn');

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const padding = 80;
    const randomX = padding + Math.random() * (vw - padding * 2 - noBtn.offsetWidth);
    const randomY = padding + Math.random() * (vh - padding * 2 - noBtn.offsetHeight);

    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    noBtn.style.zIndex = '1000';
}

function handleNoTouch(e) {
    e.preventDefault();
    handleNoClick();
    moveNoButton();
}

function handleNoClick() {
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');

    noClickCount++;

    if (noClickCount < noButtonTexts.length) {
        noBtn.textContent = noButtonTexts[noClickCount];
    }

    const shrinkFactor = Math.max(0.4, 1 - noClickCount * 0.1);
    noBtn.style.transform = `scale(${shrinkFactor})`;
    noBtn.style.opacity = Math.max(0.3, 1 - noClickCount * 0.1);

    const growFactor = Math.min(1.5, 1 + noClickCount * 0.08);
    yesBtn.style.transform = `scale(${growFactor})`;
    yesBtn.style.boxShadow = `0 ${5 + noClickCount * 3}px ${25 + noClickCount * 5}px rgba(255, 107, 157, ${0.4 + noClickCount * 0.05})`;

    moveNoButton();
}

// =========================================
// Celebration (Minimal)
// =========================================

function celebrate() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.textContent = ['💕', '♥', '💖'][Math.floor(Math.random() * 3)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 4000);
        }, i * 100);
    }
}

console.log('💕 Made with love');
