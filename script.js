// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const attendeesList = document.getElementById("attendeesList");
const attendeesEmpty = document.getElementById("attendeesEmpty");
const attendeeListCount = document.getElementById("attendeeListCount");

// Track attendance
let count = 0;
const maxCount = 50;

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);

  // Increment count
  count++;
  console.log("Total check-ins: ", count);
  attendeeCount.textContent = count;

  // Calculate percentage and update progress bar width
  const percentage = Math.min(100, Math.round((count / maxCount) * 100)) + "%";
  console.log(`Progress: ${percentage}`);
  progressBar.style.width = percentage;

  // Update team counter and fill up the team's box
  const teamCounter = document.getElementById(team + "Count");
  if (teamCounter) {
    const currentTeamCount = parseInt(teamCounter.textContent || 0) + 1;
    teamCounter.textContent = currentTeamCount;

    // Pop animation on number
    teamCounter.classList.add("pulse");
    setTimeout(function () {
      teamCounter.classList.remove("pulse");
    }, 300);

    // Calculate percentage to fill up the team box (goal of 20 per team)
    const teamGoal = 20;
    const teamPercent = Math.min(100, Math.round((currentTeamCount / teamGoal) * 100)) + "%";

    // Fill up the background of the team card
    const teamFill = document.getElementById(team + "Fill");
    if (teamFill) {
      teamFill.style.width = teamPercent;
    }

    // Fill up the progress bar inside the team card
    const teamBar = document.getElementById(team + "Bar");
    if (teamBar) {
      teamBar.style.width = teamPercent;
    }
  }

  // Choose team emoji
  let teamEmoji = "";
  if (team === "water") {
    teamEmoji = "🌊";
  } else if (team === "zero") {
    teamEmoji = "🌿";
  } else if (team === "power") {
    teamEmoji = "⚡";
  }

  // Show welcome message
  const message = `${teamEmoji} Welcome, ${name} to ${teamName}`;
  console.log(message);
  greeting.textContent = message;
  greeting.className = "success-message";
  greeting.style.display = "block";

  // Add attendee to attendees list
  if (attendeesEmpty) {
    attendeesEmpty.style.display = "none";
  }

  if (attendeesList) {
    const li = document.createElement("li");
    li.className = "attendee-item";
    li.innerHTML = `
      <span class="attendee-item-name">
        <i class="fas fa-user"></i>
        ${name}
      </span>
      <span class="attendee-item-badge ${team}">
        ${teamEmoji} ${teamName}
      </span>
    `;
    attendeesList.prepend(li);
  }

  if (attendeeListCount) {
    attendeeListCount.textContent = count;
  }

  // Check if attendance goal is reached
  if (count >= maxCount) {
    const water = parseInt(document.getElementById("waterCount").textContent) || 0;
    const zero = parseInt(document.getElementById("zeroCount").textContent) || 0;
    const power = parseInt(document.getElementById("powerCount").textContent) || 0;

    let winningTeam = "Team Water Wise";
    let highestCount = water;

    if (zero > highestCount) {
      winningTeam = "Team Net Zero";
      highestCount = zero;
    } else if (zero === highestCount) {
      winningTeam = winningTeam + " & Team Net Zero";
    }

    if (power > highestCount) {
      winningTeam = "Team Renewables";
      highestCount = power;
    } else if (power === highestCount) {
      winningTeam = winningTeam + " & Team Renewables";
    }

    const celebrationMessage = `🏆 Goal Reached! Summit is at full capacity! Congratulations to ${winningTeam} for having the highest attendance! 🎉`;
    console.log(celebrationMessage);
    greeting.textContent = celebrationMessage;
    greeting.className = "success-message celebration";
  }

  // Reset form for next attendee
  form.reset();
});
