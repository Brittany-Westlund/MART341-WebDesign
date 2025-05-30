// Credit: Mateusz Rybczonec
//===================================================================================
// BASE TIMER TUTORIAL
//===================================================================================

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: { color: "green" },
  warning: { color: "orange", threshold: WARNING_THRESHOLD },
  alert: { color: "red", threshold: ALERT_THRESHOLD }
};

const TIME_LIMIT = 60; // Here is where you can adjust the time
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("timer1, timer2, timer3").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(timeLeft)}</span>
</div>
<button id="start-button">Start</button>
<button id="stop-button">Stop</button>
`;

function onTimesUp() {
  clearInterval(timerInterval);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  const pathRemaining = document.getElementById("base-timer-path-remaining");

  if (timeLeft <= alert.threshold) {
    pathRemaining.classList.remove(warning.color);
    pathRemaining.classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    pathRemaining.classList.remove(info.color);
    pathRemaining.classList.add(warning.color);
  } else {
    pathRemaining.classList.remove(warning.color, alert.color);
    pathRemaining.classList.add(info.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}


// End of base timer code tutorial


//===================================================================================
// BUTTONS
//===================================================================================

// Let's add some functionality to our buttons
// Button Event Listeners
document.getElementById("start-button").addEventListener("click", startTimer);
document.getElementById("stop-button").addEventListener("click", stopTimer);

function startTimer() {
  if (timerInterval !== null) return; // Prevent multiple intervals
  timerInterval = setInterval(() => {
    timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null; // Reset timer interval
}



