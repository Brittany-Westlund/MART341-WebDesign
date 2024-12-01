//===================================================================================
// ADJUSTED BASE TIMER TUTORIAL
//===================================================================================
// Credit: Mateusz Rybczonec

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: { color: "green" },
  warning: { color: "orange", threshold: WARNING_THRESHOLD },
  alert: { color: "red", threshold: ALERT_THRESHOLD }
};

const TIME_LIMIT = 60; // Adjust timer duration in seconds

//===================================================================================
// FUNCTION TO INITIALIZE A TIMER
//===================================================================================

function initializeTimer(timerId) {
  let timePassed = 0;
  let timeLeft = TIME_LIMIT;
  let timerInterval = null;
  let remainingPathColor = COLOR_CODES.info.color;

  // Set the timer's HTML structure
  document.getElementById(timerId).innerHTML = `
    <div class="base-timer">
      <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
          <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
          <path
            id="${timerId}-path-remaining"
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
      <span id="${timerId}-label" class="base-timer__label">${formatTime(timeLeft)}</span>
    </div>
    <button id="${timerId}-start-button">Start</button>
    <button id="${timerId}-stop-button">Stop</button>
  `;

  // Add Start button functionality
  document.getElementById(`${timerId}-start-button`).addEventListener("click", function () {
    if (timerInterval !== null) return; // Prevent multiple intervals
    timerInterval = setInterval(() => {
      timePassed += 1;
      timeLeft = TIME_LIMIT - timePassed;
      document.getElementById(`${timerId}-label`).innerHTML = formatTime(timeLeft);
      setCircleDasharray(timeLeft, timerId);
      setRemainingPathColor(timeLeft, timerId);

      if (timeLeft === 0) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }, 1000);
  });

  // Add Stop button functionality
  document.getElementById(`${timerId}-stop-button`).addEventListener("click", function () {
    clearInterval(timerInterval);
    timerInterval = null; // Reset timer interval
  });

  // Format time into MM:SS
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
  }

  // Update path color based on time left
  function setRemainingPathColor(timeLeft, timerId) {
    const { alert, warning, info } = COLOR_CODES;
    const pathRemaining = document.getElementById(`${timerId}-path-remaining`);

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

  // Calculate the circle's stroke-dasharray
  function calculateTimeFraction(timeLeft) {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
  }

  // Update stroke-dasharray to reflect time left
  function setCircleDasharray(timeLeft, timerId) {
    const circleDasharray = `${(calculateTimeFraction(timeLeft) * FULL_DASH_ARRAY).toFixed(0)} 283`;
    document
      .getElementById(`${timerId}-path-remaining`)
      .setAttribute("stroke-dasharray", circleDasharray);
  }
}

//===================================================================================
// INITIALIZE MULTIPLE TIMERS HERE
//===================================================================================

initializeTimer("timer1");
initializeTimer("timer2");
initializeTimer("timer3");



