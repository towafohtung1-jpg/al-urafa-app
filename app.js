// 0. IMPORT THE DATA
import ramadanData from './content.js';

// 1. REGISTER SERVICE WORKER
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

// 2. CONFIGURATION
const EXPECTED_START_DATE = new Date('2026-02-18'); 
const MOON_OFFSET = 0; 

let currentDayIndex = 0;
let userName = "";
let isTestMode = false;

// 3. ELEMENTS
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

helpBtn.addEventListener('click', () => helpModal.classList.remove('hidden'));
closeHelp.addEventListener('click', () => helpModal.classList.add('hidden'));

// 6. LOGIN & INITIALIZATION
window.addEventListener('load', () => {
    const savedName = localStorage.getItem('alUrafaUserName');
    if (savedName) {
        userName = savedName;
        loginOverlay.classList.add('hidden');
        const liveDay = getLiveRamadanDay();
        currentDayIndex = liveDay > 0 ? liveDay - 1 : 0;
        updateUI(currentDayIndex);
    }
});

// FIXED: Changed 'ddocument' to 'document' and added the missing logic
document.getElementById('login-btn').addEventListener('click', () => {
    console.log("Login button clicked!"); 
    const input = document.getElementById('user-name-input');
    const nameValue = input.value.trim(); // This line was missing

    if (nameValue !== "") {
        userName = nameValue;
        localStorage.setItem('alUrafaUserName', nameValue);
        loginOverlay.classList.add('hidden'); 
        helpModal.classList.remove('hidden'); 
        const liveDay = getLiveRamadanDay();
        currentDayIndex = liveDay > 0 ? liveDay - 1 : 0;
        updateUI(currentDayIndex);
    } else {
        alert("Please enter a name to proceed!");
    }
});
// 7. SECRET DEVELOPER TEST MODE
const secretBtn = document.getElementById('secret-test-btn');
if (secretBtn) {
    secretBtn.addEventListener('click', () => {
        isTestMode = true; 
        currentDayIndex = 0; 
        updateUI(currentDayIndex); 
        alert("Developer Mode Active: You can now browse all days!");
    });
}