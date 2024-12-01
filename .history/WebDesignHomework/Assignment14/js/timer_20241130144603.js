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

// Function to initialize a timer
function initializeTimer(timerContainer) {
  let timePassed = 0;
  let timeLeft = TIME_LIMIT;
  let timerInterval = null;

  const remainingPathColor = COLOR_CODES.info.color;

  // Add timer's HTML
  timerContainer.innerHTML = `
    <div class="base-timer">
      <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
          <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
          <path
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
      <span class="base-timer__label">${formatTime(timeLeft)}</span>
    </div>
  `;

  const startButton = timerContainer.querySelector(".start-button");
  const stopButton = timerContainer.querySelector(".stop-button");
  const label = timerContainer.querySelector(".base-timer__label");
  const pathRemaining = timerContainer.querySelector(".base-timer__path-remaining");

  // Start button functionality
  startButton.addEventListener("click", () => {
    if (timerInterval !== null) return; // Prevent multiple intervals
    timerInterval = setInterval(() => {
      timePassed++;
      timeLeft = TIME_LIMIT - timePassed;
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
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
  }

  function setCircleDasharray() {
    const circleDasharray = `${(calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0)} 283`;
    pathRemaining.setAttribute("stroke-dasharray", circleDasharray);
  }
}

// Initialize timers
document.querySelectorAll(".timer").forEach((timer) => initializeTimer(timer));
