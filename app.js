// 0. IMPORT THE DATA
import ramadanData from './content.js';

// 1. REGISTER SERVICE WORKER
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// 2. CONFIGURATION
const EXPECTED_START_DATE = new Date('2026-02-18'); 
const MOON_OFFSET = 0; 
// ... the rest of your app.js logic continues here

let currentDayIndex = 0;
let userName = "";

// 3. ELEMENTS (All must be listed here)
const dayDisplay = document.getElementById('day-title');
const titleDisplay = document.getElementById('quote-title');
const textDisplay = document.getElementById('daily-text');
const sourceDisplay = document.getElementById('source');
const loginOverlay = document.getElementById('login-overlay');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const helpBtn = document.getElementById('help-btn');
const helpModal = document.getElementById('help-modal');
const closeHelp = document.getElementById('close-help');

// 4. LOGIC FUNCTIONS
let isTestMode = false; // New variable to track if we are testing

function getLiveRamadanDay() {
    const today = new Date();
    const diffInTime = today.getTime() - EXPECTED_START_DATE.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
    const liveDay = diffInDays + 1 + MOON_OFFSET;
    return liveDay > 0 ? liveDay : 0;
}

function updateUI(index) {
    const data = ramadanData[index];
    const liveDay = getLiveRamadanDay();

    // If not in test mode and Ramadan hasn't started, show Coming Soon
    if (!isTestMode && liveDay <= 0) {
        dayDisplay.innerText = "AL-URAFA";
        titleDisplay.innerText = `Salam, ${userName}!`; 
        textDisplay.innerText = "The first wisdom will reveal itself when the moon is sighted. Prepare your heart!";
        sourceDisplay.innerText = "- Ramadan is Near";
        return;
    }

    if (data) {
        dayDisplay.innerText = `RAMADAN DAY ${data.day}`;
        titleDisplay.innerText = data.title;
        textDisplay.innerText = data.text;
        sourceDisplay.innerText = `- ${data.source}`;
    }
}

// 5. BUTTON EVENTS
nextBtn.addEventListener('click', () => {
    const liveDay = getLiveRamadanDay();
    // In Test Mode, we bypass the liveDay check
    if (isTestMode || (currentDayIndex + 1 < liveDay && currentDayIndex < ramadanData.length - 1)) {
        currentDayIndex++;
        updateUI(currentDayIndex);
    } else {
        alert(`Patience, ${userName}! Tomorrow's wisdom is still a secret.`);
    }
});

prevBtn.addEventListener('click', () => {
    if (currentDayIndex > 0) {
        currentDayIndex--;
        updateUI(currentDayIndex);
    }
});

// 6. INITIALIZATION & LOGIN (Keep your existing Section 6 code here...)

// 7. SECRET DEVELOPER TEST MODE
document.getElementById('secret-test-btn').addEventListener('click', () => {
    isTestMode = true; // Turn on "God Mode"
    currentDayIndex = 0; 
    updateUI(currentDayIndex); 
    alert("Developer Mode Active: You can now browse all days!");
});