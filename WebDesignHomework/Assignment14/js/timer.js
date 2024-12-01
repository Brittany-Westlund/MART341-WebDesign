//===================================================================================
// ADJUSTED TIMER TUTORIAL
//===================================================================================
// Credit: Mateusz Rybczonec

// Below are constants used to define specific values for the behavior and appearance of the timer
const FULL_DASH_ARRAY = 283; // Represents circumference of timer's circle; 283 determines the length of the circle's path
const WARNING_THRESHOLD = 10; // Time left in seconds when appearence (the color in our case) changes to the warning state
const ALERT_THRESHOLD = 5; // Time left in seconds when the appearence changes to the alert state

// Define the color codes you'd like to use and thresholds for the timer below
const COLOR_CODES = {
  info: { color: "green" }, // Default color, let's call it "green"
  warning: { color: "orange", threshold: WARNING_THRESHOLD }, // Warning color and threshold codes, called "orange" and "WARNING_THRESHOLD"
  alert: { color: "red", threshold: ALERT_THRESHOLD } // Alert color and threshold codes
};

//===================================================================================
// FUNCTION TO INITIALIZE A TIMER
//===================================================================================

// This function controls the behavior of the timer
function initializeTimer(timerId, timeLimit) { // timerID refers to the ID of the timer container in the HTML, like 'timer1', 'timer2', 'timer3' if you want multiple timers on the same page. timeLimit refers to the duration the timer should run.
  let timePassed = 0; // Tracks how much time has passed, starts at 0.
  let timeLeft = timeLimit; // Tracks remaining time
  let timerInterval = null; // Stores the interval ID that lets the timer perform actions at certain intervals. We're using it to stop the timer when we use clearInterval(timerInterval).
  let remainingPathColor = COLOR_CODES.info.color; // Tells what start color to start with, in this case the 'info:' color, "green", that we set above.

  // Finds the specific timer container from the HTML; e.g., timer1, timer2, timer3
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
// You can add more timers here and adjust their times. I have three timers together in the same block which I divided by 3 to make each timer width 33.33%. If we added another timer, you could use 25% if you want them on the same line. See timer.css line 17.

initializeTimer("timer1", 60); // 1 minute
initializeTimer("timer2", 20); // 20 seconds
initializeTimer("timer3", 90); // 1.5 minutes
