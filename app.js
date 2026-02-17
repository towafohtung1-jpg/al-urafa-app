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
function getLiveRamadanDay() {
    const today = new Date();
    const diffInTime = today.getTime() - EXPECTED_START_DATE.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
    const liveDay = diffInDays + 1 + MOON_OFFSET;
    return liveDay > 0 ? liveDay : 0;
}

function updateUI(index) {
    const data = ramadanData[index];
    
    // If it's before Ramadan, show the 'Coming Soon' state
    if (!data) {
        dayDisplay.innerText = "AL-URAFA";
        titleDisplay.innerText = `Salam, ${userName}!`; 
        textDisplay.innerText = "The first wisdom will reveal itself when the moon is sighted. Prepare your heart!";
        sourceDisplay.innerText = "- Ramadan is Near";
        return; // <--- MAKE SURE THIS 'return' IS HERE
    }
    
    // This part only runs if 'data' actually exists
    dayDisplay.innerText = `RAMADAN DAY ${data.day}`;
    titleDisplay.innerText = data.title;
    textDisplay.innerText = data.text;
    sourceDisplay.innerText = `- ${data.source}`;
}

// 5. BUTTON EVENTS
nextBtn.addEventListener('click', () => {
    const liveDay = getLiveRamadanDay();
    if (currentDayIndex + 1 < liveDay && currentDayIndex < ramadanData.length - 1) {
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

document.getElementById('login-btn').addEventListener('click', () => {
    const input = document.getElementById('user-name-input');
    const nameValue = input.value.trim();

    if (nameValue !== "") {
        userName = nameValue; // This sets the global userName variable
        localStorage.setItem('alUrafaUserName', nameValue);
        
        // 1. Hide the login overlay
        loginOverlay.classList.add('hidden'); 
        
        // 2. Show the help modal for first-time users
        helpModal.classList.remove('hidden'); 
        
        // 3. Calculate and show the correct day
        const liveDay = getLiveRamadanDay();
        currentDayIndex = liveDay > 0 ? liveDay - 1 : 0;
        
        // 4. Trigger the UI update
        updateUI(currentDayIndex);
    } else {
        alert("Please enter a name to proceed!");
    }
});

// Secret Developer "Test Mode"
document.getElementById('secret-test-btn').addEventListener('click', () => {
    // This forces the index to 0 (Day 1) regardless of the actual date
    currentDayIndex = 0; 
    updateUI(currentDayIndex);
    
    // Feedback so you know it worked
    console.log("Al-Urafa: Day 1 Test Mode Active");
    alert("Test Mode: Displaying Day 1 Content");
});