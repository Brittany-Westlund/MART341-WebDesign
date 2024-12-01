//===================================================================================
// ADJUSTED TIMER TUTORIAL
//===================================================================================
// Credit: Mateusz Rybczonec

const FULL_DASH_ARRAY = 283; // Full stroke-dasharray value for the timer's circle
const WARNING_THRESHOLD = 10; // Time threshold to switch to "warning" color
const ALERT_THRESHOLD = 5; // Time threshold to switch to "alert" color

const COLOR_CODES = {
  info: { color: "green" }, // Default color for the timer
  warning: { color: "orange", threshold: WARNING_THRESHOLD }, // Warning color and threshold
  alert: { color: "red", threshold: ALERT_THRESHOLD } // Alert color and threshold
};

//===================================================================================
// FUNCTION TO INITIALIZE A TIMER
//===================================================================================

function initializeTimer(timerId, timeLimit) {
  let timePassed = 0; // Tracks how much time has passed
  let timeLeft = timeLimit; // Starts with the given time limit
  let timerInterval = null; // Stores the interval ID for the timer
  let remainingPathColor = COLOR_CODES.info.color; // Initial color for the timer circle

  // Find the timer container by its ID
  const timerElement = document.getElementById(timerId);

  // Create the timer's visual display
  const timerDisplay = document.createElement("div"); // Create a container for the timer
  timerDisplay.className = "base-timer"; // Add a class for styling
  timerDisplay.innerHTML = `
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle> <!-- Background circle -->
        <path
          class="base-timer__path-remaining ${remainingPathColor}" <!-- Colored timer path -->
          d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
          "
        ></path>
      </g>
    </svg>
    <span class="base-timer__label">${formatTime(timeLeft)}</span> <!-- Timer label -->
  `;
  timerElement.prepend(timerDisplay); // Add the timer display above the existing buttons

  // Get the start and stop buttons
  const startButton = timerElement.querySelector(".start-button"); // Find the start button
  const stopButton = timerElement.querySelector(".stop-button"); // Find the stop button
  const label = timerElement.querySelector(".base-timer__label"); // Find the label for updating time
  const pathRemaining = timerElement.querySelector(".base-timer__path-remaining"); // Find the colored path

  // Start button functionality
  startButton.addEventListener("click", function () {
    if (timerInterval !== null) return; // Prevent multiple intervals from being created
    timerInterval = setInterval(() => { // Start a new interval
      timePassed += 1; // Increment time passed
      timeLeft = timeLimit - timePassed; // Calculate remaining time
      label.innerHTML = formatTime(timeLeft); // Update the label with formatted time
      setCircleDasharray(timeLeft); // Update the circle's dasharray
      setRemainingPathColor(timeLeft); // Update the circle's color based on time left

      if (timeLeft === 0) { // If time runs out
        clearInterval(timerInterval); // Stop the timer
        timerInterval = null; // Reset the interval
      }
    }, 1000); // Run every second
  });

  // Stop button functionality
  stopButton.addEventListener("click", function () {
    clearInterval(timerInterval); // Stop the timer
    timerInterval = null; // Reset the interval
  });

  // Format time into MM:SS
  function formatTime(time) {
    const minutes = Math.floor(time / 60); // Calculate minutes
    let seconds = time % 60; // Calculate seconds

    if (seconds < 10) {
      seconds = `0${seconds}`; // Add a leading zero for single-digit seconds
    }
    return `${minutes}:${seconds}`; // Return formatted time as MM:SS
  }

  // Update path color based on time left
  function setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = COLOR_CODES; // Destructure color codes

    if (timeLeft <= ALERT_THRESHOLD) { // If time is in the alert range
      pathRemaining.classList.remove(warning.color); // Remove warning color
      pathRemaining.classList.add(alert.color); // Add alert color
    } else if (timeLeft <= WARNING_THRESHOLD) { // If time is in the warning range
      pathRemaining.classList.remove(info.color); // Remove info color
      pathRemaining.classList.add(warning.color); // Add warning color
    } else { // If time is in the info range
      pathRemaining.classList.remove(warning.color, alert.color); // Remove any warning/alert color
      pathRemaining.classList.add(info.color); // Add info color
    }
  }

  // Calculate the circle's stroke-dasharray
  function calculateTimeFraction(timeLeft) {
    const rawTimeFraction = timeLeft / timeLimit; // Fraction of time remaining
    return rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction); // Adjust to ensure smooth transition
  }

  // Update stroke-dasharray to reflect time left
  function setCircleDasharray(timeLeft) {
    const circleDasharray = `${(calculateTimeFraction(timeLeft) * FULL_DASH_ARRAY).toFixed(0)} 283`; // Calculate dasharray
    pathRemaining.setAttribute("stroke-dasharray", circleDasharray); // Update the path's dasharray
  }
}

//===================================================================================
// INITIALIZE MULTIPLE TIMERS WITH SPECIFIC TIMES
//===================================================================================

initializeTimer("timer1", 60); // Initialize timer1 with a 1-minute limit
initializeTimer("timer2", 120); // Initialize timer2 with a 2-minute limit
initializeTimer("timer3", 90); // Initialize timer3 with a 1.5-minute limit
