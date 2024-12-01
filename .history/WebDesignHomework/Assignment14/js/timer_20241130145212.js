//===================================================================================
// BASE TIMER TUTORIAL
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

// Function to initialize a timer with a specific time limit
function initializeTimer(timerId, timeLimit) {
  let timePassed = 0;
  let timeLeft = timeLimit;
  let timerInterval = null;
  const timerElement = document.getElementById(timerId);

  const remainingPathColor = COLOR_CODES.info.color;

  // Add timer's HTML
  timerElement.innerHTML = `
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
  `;

  const startButton = timerElement.querySelector(".start-button");
  const stopButton = timerElement.querySelector(".stop-button");
  const label = timerElement.querySelector(`#${timerId}-label`);
  const pathRemaining = timerElement.querySelector(`#${timerId}-path-remaining`);

  // Start button functionality
  startButton.addEventListener("click", () => {
    if (timerInterval !== null) return; // Prevent multiple intervals
    timerInterval = setInterval(() => {
      timePassed++;
      timeLeft = timeLimit - timePassed;
      label.innerHTML = formatTime(timeLeft);
      setCircleDasharray();
      setRemainingPathColor();

      if (timeLeft === 0) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }, 1000);
  });

  // Stop button functionality
  stopButton.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null; // Reset timer interval
  });

  // Helper functions
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
  }

  function setRemainingPathColor() {
    const { alert, warning, info } = COLOR_CODES;

    if (timeLeft <= ALERT_THRESHOLD) {
      pathRemaining.classList.remove(warning.color);
      pathRemaining.classList.add(alert.color);
    } else if (timeLeft <= WARNING_THRESHOLD) {
      pathRemaining.classList.remove(info.color);
      pathRemaining.classList.add(warning.color);
    } else {
      pathRemaining.classList.remove(warning.color, alert.color);
      pathRemaining.classList.add(info.color);
    }
  }

  function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / timeLimit;
    return rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction);
  }

  function setCircleDasharray() {
    const circleDasharray = `${(calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0)} 283`;
    pathRemaining.setAttribute("stroke-dasharray", circleDasharray);
  }
}

// Initialize timers with specific times
initializeTimer("timer1", 60); // 1 minute
initializeTimer("timer2", 120); // 2 minutes
initializeTimer("timer3", 90); // 1.5 minutes
