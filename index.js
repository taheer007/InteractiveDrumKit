// Sound map
const soundMap = {
  B: "sounds/tom-1.mp3",
  E: "sounds/tom-2.mp3",
  A: "sounds/tom-3.mp3",
  T: "sounds/tom-4.mp3",
  D: "sounds/snare.mp3",
  R: "sounds/crash.mp3",
  U: "sounds/kick-bass.mp3",
  M: "sounds/crash.mp3",
  S: "sounds/tom-4.mp3",
  Y: "sounds/tom-1.mp3"
};

// Global state
let isRecording = false;
let recording = [];
let startTime = null;
let currentVolume = 1.0;

// Detecting button press
document.querySelectorAll(".drum").forEach(button => {
  button.addEventListener("click", function () {
    const key = this.innerHTML.toUpperCase();
    handleInteraction(key);
  });
});

// Detecting keyboard press
document.addEventListener("keypress", function (event) {
  const key = event.key.toUpperCase();
  handleInteraction(key);
});

// Core interaction handler
function handleInteraction(key) {
  makeSound(key);
  buttonAnimation(key);
  triggerMeter();

  if (isRecording) {
    recording.push({ key, time: Date.now() });
  }
}

// Play sound
function makeSound(key) {
  const sound = soundMap[key];
  if (sound) {
    const audio = new Audio(sound);
    audio.volume = currentVolume;
    audio.play();
  } else {
    console.log("Unmapped key:", key);
  }
}

// Animate button
function buttonAnimation(key) {
  const activeButton = document.querySelector("." + key);
  if (activeButton) {
    activeButton.classList.add("pressed");
    setTimeout(() => activeButton.classList.remove("pressed"), 100);
  }
}

// Visual waveform meter
function triggerMeter() {
  const bars = document.querySelectorAll(".bar");
  bars.forEach(bar => {
    const randomHeight = Math.floor(Math.random() * 90 + 10);
    bar.style.height = randomHeight + "px";
    setTimeout(() => {
      bar.style.height = "10px";
    }, 200);
  });
}

// Theme toggle
const themes = ["dark", "light-theme", "neon-theme"];
let currentThemeIndex = 0;

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.remove(...themes);
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  const newTheme = themes[currentThemeIndex];
  if (newTheme !== "dark") {
    document.body.classList.add(newTheme);
  }
});

// Recording controls
document.getElementById("startRecord").addEventListener("click", () => {
  isRecording = true;
  recording = [];
  startTime = Date.now();
  alert("⏺️ Recording started!");
});

document.getElementById("stopRecord").addEventListener("click", () => {
  isRecording = false;
  localStorage.setItem("savedRecording", JSON.stringify(recording));
  alert("🛑 Recording stopped and saved!");
});

document.getElementById("playRecord").addEventListener("click", () => {
  const saved = JSON.parse(localStorage.getItem("savedRecording"));
  if (!saved || saved.length === 0) {
    alert("⚠️ No recording found.");
    return;
  }

  const start = saved[0].time;
  saved.forEach(event => {
    setTimeout(() => {
      handleInteraction(event.key);
    }, event.time - start);
  });
});

// Volume slider logic
const volumeSlider = document.getElementById("volumeSlider");
const volumeControlDiv = document.getElementById("volume-control");
let volumeTimeout;

volumeSlider.addEventListener("input", function () {
  currentVolume = parseFloat(this.value);
});

// Show volume slider when + or - is pressed
document.addEventListener("keydown", function (event) {
  if (event.key === "+" || event.key === "=") {
    currentVolume = Math.min(currentVolume + 0.1, 1);
    volumeSlider.value = currentVolume;
    showVolumeSlider();
  } else if (event.key === "-") {
    currentVolume = Math.max(currentVolume - 0.1, 0);
    volumeSlider.value = currentVolume;
    showVolumeSlider();
  }
});

function showVolumeSlider() {
  volumeControlDiv.style.display = "flex";
  clearTimeout(volumeTimeout);
  volumeTimeout = setTimeout(() => {
    volumeControlDiv.style.display = "none";
  }, 3000);
}
