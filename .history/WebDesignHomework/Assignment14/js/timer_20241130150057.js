//===================================================================================
// ADJUSTED TIMER TUTORIAL
//===================================================================================
// Credit: Mateusz Rybczonec

const FULL_DASH_ARRAY = 283; // Total stroke-dasharray value for the timer circle
const WARNING_THRESHOLD = 10; // Time threshold for switching to "warning" color
const ALERT_THRESHOLD = 5; // Time threshold for switching to "alert" color

// Define the color codes and thresholds for the timer
const COLOR_CODES = {
  info: { color: "green" }, // Default color (info level)
  warning: { color: "orange", threshold: WARNING_THRESHOLD }, // Warning color and threshold
  alert: { color: "red", threshold: ALERT_THRESHOLD } // Alert color and threshold
};

//===================================================================================
// FUNCTION TO INITIALIZE A TIMER
//===================================================================================

function initializeTimer(timerId, timeLimit) {
  let timePassed = 0; // Tracks how much time has passed
  let timeLeft = timeLimit; // Remaining time, initialized to the given time limit
  let timerInterval = null; // Stores the interval ID for the timer
  let remainingPathColor = COLOR_CODES.info.color; // Start with the default "info" color

  // Find the timer container by its ID
  const timerElement = document.getElementById(timerId);

  // Create the timer's visual display and add it above the buttons
  const timerDisplay = document.createElement("div"); // Create a container for the timer
  timerDisplay.className = "base-timer"; // Add a class for styling the timer
  timerDisplay.innerHTML = `
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle> <!-- Grey background circle -->
        <path
          class="base-timer__path-remaining ${remainingPathColor}" <!-- Initial green color -->
          d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
          "
        ></path> <!-- The colored timer path -->
      </g>
    </svg>
    <span class="base-timer__label">${formatTime(timeLeft)}</span> <!-- Displays the remaining time -->
  `;
  timerElement.prepend(timerDisplay); // Add the timer display to the top of the container

  // Find the Start and Stop buttons inside the timer container
  const startButton = timerElement.querySelector(".start-button"); // Find the Start button
  const stopButton = timerElement.querySelector(".stop-button"); // Find the Stop button
  const label = timerElement.querySelector(".base-timer__label"); // The text label showing time
  const pathRemaining = timerElement.querySelector(".base-timer__path-remaining"); // The dynamic colored path

  // Add functionality to the Start button
  startButton.addEventListener("click", function () {
    if (timerInterval !== null) return; // Prevent multiple timers from running simultaneously
    timerInterval = setInterval(() => { // Start a timer interval
      timePassed += 1; // Increment the time passed
      timeLeft = timeLimit - timePassed; // Update the remaining time
      label.innerHTML = formatTime(timeLeft); // Update the displayed time
      setCircleDasharray(timeLeft); // Adjust the circle's stroke-dasharray
      setRemainingPathColor(timeLeft); // Adjust the circle's color based on remaining time

      if (timeLeft === 0) { // If the timer reaches zero
        clearInterval(timerInterval); // Stop the timer
        timerInterval = null; // Reset the interval variable
      }
    }, 1000); // Run the interval every second
  });

  // Add functionality to the Stop button
  stopButton.addEventListener("click", function () {
    clearInterval(timerInterval); // Stop the timer
    timerInterval = null; // Reset the interval variable
  });

  // Helper function: Format the time as MM:SS
  function formatTime(time) {
    const minutes = Math.floor(time / 60); // Calculate the number of minutes
    let seconds = time % 60; // Calculate the number of seconds

    if (seconds < 10) {
      seconds = `0${seconds}`; // Add a leading zero to single-digit seconds
    }
    return `${minutes}:${seconds}`; // Return the formatted time as a string
  }

  // Helper function: Update the color of the remaining path based on time left
  function setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = COLOR_CODES; // Destructure the color codes

    if (timeLeft <= ALERT_THRESHOLD) { // If the remaining time is below the alert threshold
      pathRemaining.classList.remove(warning.color); // Remove the warning color
      pathRemaining.classList.add(alert.color); // Add the alert color
    } else if (timeLeft <= WARNING_THRESHOLD) { // If the remaining time is below the warning threshold
      pathRemaining.classList.remove(info.color); // Remove the info color
      pathRemaining.classList.add(warning.color); // Add the warning color
    } else { // If the remaining time is above the warning threshold
      pathRemaining.classList.remove(warning.color, alert.color); // Remove any alert or warning colors
      pathRemaining.classList.add(info.color); // Add the info color
    }
  }

  // Helper function: Calculate the stroke-dasharray value for the timer path
  function calculateTimeFraction(timeLeft) {
    const rawTimeFraction = timeLeft / timeLimit; // Calculate the fraction of time left
    return rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction); // Adjust for smooth transitions
  }

  // Helper function: Update the stroke-dasharray of the timer path
  function setCircleDasharray(timeLeft) {
    const circleDasharray = `${(calculateTimeFraction(timeLeft) * FULL_DASH_ARRAY).toFixed(0)} 283`; // Calculate the dasharray
    pathRemaining.setAttribute("stroke-dasharray", circleDasharray); // Update the path's dasharray attribute
  }
}

//===================================================================================
// INITIALIZE MULTIPLE TIMERS WITH SPECIFIC TIMES
//===================================================================================

initializeTimer("timer1", 60); // Initialize timer1 with a 1-minute limit
initializeTimer("timer2", 120); // Initialize timer2 with a 2-minute limit
initializeTimer("timer3", 90); // Initialize timer3 with a 1.5-minute limit
