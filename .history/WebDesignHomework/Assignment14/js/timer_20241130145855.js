//===================================================================================
// ADJUSTED TIMER TUTORIAL
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

//===================================================================================
// FUNCTION TO INITIALIZE A TIMER
//===================================================================================

function initializeTimer(timerId, timeLimit) {
  let timePassed = 0;
  let timeLeft = timeLimit;
  let timerInterval = null;
  let remainingPathColor = COLOR_CODES.info.color;

  // Find the timer container
  const timerElement = document.getElementById(timerId);

  // Inject only the timer display (preserve existing buttons)
  const timerDisplay = document.createElement("div");
  timerDisplay.className = "base-timer";
  timerDisplay.innerHTML = `
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
  `;
  timerElement.prepend(timerDisplay); // Add the timer display above the buttons

  const startButton = timerElement.querySelector(".start-button");
  const stopButton = timerElement.querySelector(".stop-button");
  const label = timerElement.querySelector(".base-timer__label");
  const pathRemaining = timerElement.querySelector(".base-timer__path-remaining");

  // Start button functionality
  startButton.addEventListener("click", function () {
    if (timerInterval !== null) return; // Prevent multiple intervals
    timerInterval = setInterval(() => {
      timePassed += 1;
      timeLeft = timeLimit - timePassed;
      label.innerHTML = formatTime(timeLeft);
      setCircleDasharray(timeLeft);
      setRemainingPathColor(timeLeft);

      if (timeLeft === 0) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }, 1000);
  });

  // Stop button functionality
  stopButton.addEventListener("click", function () {
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
  function setRemainingPathColor(timeLeft) {
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

  // Calculate the circle's stroke-dasharray
  function calculateTimeFraction(timeLeft) {
    const rawTimeFraction = timeLeft / timeLimit;
    return rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction);
  }

  // Update stroke-dasharray to reflect time left
  function setCircleDasharray(timeLeft) {
    const circleDasharray = `${(calculateTimeFraction(timeLeft) * FULL_DASH_ARRAY).toFixed(0)} 283`;
    pathRemaining.setAttribute("stroke-dasharray", circleDasharray);
  }
}

//===================================================================================
// INITIALIZE MULTIPLE TIMERS WITH SPECIFIC TIMES
//===================================================================================

initializeTimer("timer1", 60); // 1 minute
initializeTimer("timer2", 120); // 2 minutes
initializeTimer("timer3", 90); // 1.5 minutes
