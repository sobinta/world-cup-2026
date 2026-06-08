// FIFA World Cup 2026 - Live Score Simulator

let liveSimInterval = null;
let liveMatchState = {
  active: false,
  match: null,
  minute: 0,
  score1: 0,
  score2: 0,
  events: []
};

// Start the live match simulator
const startLiveSimulation = () => {
  if (liveMatchState.active) return;

  const isOfficial = window.standingsViewMode === "official";
  const sourceArray = isOfficial ? window.officialResults : window.currentPredictions;

  // Pick a match that hasn't been played/predicted yet
  let eligibleMatches = sourceArray.filter(
    m => m.score1 === null || m.score2 === null || m.score1 === "" || m.score2 === ""
  );

  if (eligibleMatches.length === 0) {
    eligibleMatches = sourceArray; // Fallback to any match
  }

  const selectedMatch = eligibleMatches[Math.floor(Math.random() * eligibleMatches.length)];
  if (!selectedMatch) return;

  // Initialize simulator state
  liveMatchState.active = true;
  liveMatchState.match = selectedMatch;
  liveMatchState.minute = 0;
  liveMatchState.score1 = 0;
  liveMatchState.score2 = 0;
  liveMatchState.events = [];

  // Update UI indicators
  document.getElementById("live-indicator").classList.add("active");
  const simBtn = document.getElementById("live-sim-toggle-btn");
  if (simBtn) {
    const currentLang = window.currentLanguage || "fa";
    simBtn.textContent = window.translations[currentLang].liveSimStopBtn;
    simBtn.style.background = "#ff3860";
    simBtn.style.borderColor = "#ff3860";
  }

  // Add initial kickoff event
  addLiveEvent(0, "Kickoff!", "شروع بازی!");

  // Render initial match view
  updateLiveMatchUI();

  // Run the interval (e.g. every 500ms is 1 minute of match time)
  liveSimInterval = setInterval(() => {
    tickLiveMatch();
  }, 400);
};

// Stop the live match simulation
const stopLiveSimulation = (completeMatch = false) => {
  if (!liveMatchState.active) return;

  clearInterval(liveSimInterval);
  liveSimInterval = null;
  liveMatchState.active = false;

  const currentLang = window.currentLanguage || "fa";

  if (completeMatch && liveMatchState.match) {
    const matchId = liveMatchState.match.id;
    const isOfficial = window.standingsViewMode === "official";
    const sourceArray = isOfficial ? window.officialResults : window.currentPredictions;
    const matchIndex = sourceArray.findIndex(m => m.id === matchId);
    if (matchIndex !== -1) {
      sourceArray[matchIndex].score1 = liveMatchState.score1;
      sourceArray[matchIndex].score2 = liveMatchState.score2;
      if (isOfficial) {
        window.saveOfficialResults();
      } else {
        window.savePredictions();
      }
    }
    addLiveEvent(90, "Full Time!", "پایان بازی!");
  } else {
    addLiveEvent(liveMatchState.minute, "Simulation Stopped", "شبیه سازی متوقف شد");
  }

  document.getElementById("live-indicator").classList.remove("active");
  const simBtn = document.getElementById("live-sim-toggle-btn");
  if (simBtn) {
    simBtn.textContent = window.translations[currentLang].liveSimBtn;
    simBtn.style.background = "";
    simBtn.style.borderColor = "";
  }

  updateLiveMatchUI();
};

// Tick the match minute forward
const tickLiveMatch = () => {
  if (liveMatchState.minute >= 90) {
    stopLiveSimulation(true);
    return;
  }

  liveMatchState.minute += 1;

  // Event generator logic based on random probabilities
  const rand = Math.random();

  // 1. Goal Event (~2% chance per minute)
  if (rand < 0.025) {
    const scoringTeam = Math.random() < 0.5 ? 1 : 2;
    const teamName = scoringTeam === 1 ? liveMatchState.match.team1 : liveMatchState.match.team2;
    const teamData = window.teamsData[teamName];

    // Pick a mock player name
    const scorer = teamData ? teamData.star : "Striker";

    if (scoringTeam === 1) {
      liveMatchState.score1 += 1;
    } else {
      liveMatchState.score2 += 1;
    }

    const goalMsgEn = `GOAL! ${teamName} - ${scorer} scores!`;
    const goalMsgFa = `گلللل! برای ${teamData ? teamData.nameFa : teamName} توسط ${scorer}!`;

    addLiveEvent(liveMatchState.minute, goalMsgEn, goalMsgFa, true);
    triggerGoalBanner(teamName, liveMatchState.score1, liveMatchState.score2);
  }
  // 2. Yellow Card (~3% chance)
  else if (rand < 0.055) {
    const cardTeam = Math.random() < 0.5 ? 1 : 2;
    const teamName = cardTeam === 1 ? liveMatchState.match.team1 : liveMatchState.match.team2;
    const teamData = window.teamsData[teamName];
    const player = teamData ? teamData.star : "Defender";

    const cardMsgEn = `Yellow Card - ${player} (${teamName})`;
    const cardMsgFa = `کارت زرد - ${player} (${teamData ? teamData.nameFa : teamName})`;

    addLiveEvent(liveMatchState.minute, cardMsgEn, cardMsgFa);
  }
  // 3. General Events (Shots, Corners, Fouls - ~8% chance)
  else if (rand < 0.13) {
    const team = Math.random() < 0.5 ? liveMatchState.match.team1 : liveMatchState.match.team2;
    const teamData = window.teamsData[team];
    const teamName = teamData ? teamData.nameFa : team;
    const genericEvents = [
      { en: `Corner kick for ${team}`, fa: `ضربه‌ کرنر برای ${teamName}` },
      { en: `Shot on target by ${team}`, fa: `شوت در چارچوب توسط ${teamName}` },
      { en: `Foul committed by ${team}`, fa: `خطا از بازیکنان ${teamName}` }
    ];
    const ev = genericEvents[Math.floor(Math.random() * genericEvents.length)];
    addLiveEvent(liveMatchState.minute, ev.en, ev.fa);
  }

  updateLiveMatchUI();
};

// Add event to the live log
const addLiveEvent = (minute, descEn, descFa, isGoal = false) => {
  liveMatchState.events.unshift({
    minute,
    descEn,
    descFa,
    isGoal
  });
};

// Trigger UI slide-in banner for Goals
const triggerGoalBanner = (teamName, s1, s2) => {
  const banner = document.getElementById("goal-flash-banner");
  if (!banner) return;

  const currentLang = window.currentLanguage || "fa";
  const team = window.teamsData[teamName];
  const tName = team ? (currentLang === "fa" ? team.nameFa : teamName) : teamName;

  const titleText = currentLang === "fa" ? "گللللللل!" : "GOALLLLLL!";
  const scoreText = `${s1} - ${s2}`;

  banner.innerHTML = `
    <div class="goal-banner-title">${titleText}</div>
    <div style="font-size:1.1rem; font-weight:700;">
      ${tName}
      <span style="margin: 0 10px; padding: 3px 8px; background: rgba(0,0,0,0.5); border-radius:5px;">${scoreText}</span>
    </div>
  `;

  banner.classList.add("show");

  // Hide after 3.5 seconds
  setTimeout(() => {
    banner.classList.remove("show");
  }, 3500);
};

// Update the live score simulator interface elements
const updateLiveMatchUI = () => {
  const team1El = document.getElementById("live-t1-name");
  const team2El = document.getElementById("live-t2-name");
  const flag1El = document.getElementById("live-t1-flag");
  const flag2El = document.getElementById("live-t2-flag");
  const scoreEl = document.getElementById("live-score-text");
  const minuteEl = document.getElementById("live-minute-badge");
  const feedEl = document.getElementById("live-events-feed");

  if (!team1El) return;

  const match = liveMatchState.match;
  const currentLang = window.currentLanguage || "fa";

  if (!match) {
    team1El.textContent = currentLang === "fa" ? "تیم اول" : "Team A";
    team2El.textContent = currentLang === "fa" ? "تیم دوم" : "Team B";
    flag1El.src = "https://flagcdn.com/w80/un.png";
    flag2El.src = "https://flagcdn.com/w80/un.png";
    scoreEl.textContent = "0 - 0";
    minuteEl.textContent = "--";
    feedEl.innerHTML = `<div style="color:var(--text-muted); text-align:center; padding-top:2rem;">
      ${currentLang === "fa" ? "برای شروع شبیه‌سازی روی دکمه کلیک کنید" : "Click button to start live match simulation"}
    </div>`;
    return;
  }

  const t1Data = window.teamsData[match.team1];
  const t2Data = window.teamsData[match.team2];

  team1El.textContent = t1Data ? (currentLang === "fa" ? t1Data.nameFa : match.team1) : match.team1;
  team2El.textContent = t2Data ? (currentLang === "fa" ? t2Data.nameFa : match.team2) : match.team2;
  flag1El.src = t1Data ? `https://flagcdn.com/w80/${t1Data.code}.png` : "https://flagcdn.com/w80/un.png";
  flag2El.src = t2Data ? `https://flagcdn.com/w80/${t2Data.code}.png` : "https://flagcdn.com/w80/un.png";
  scoreEl.textContent = `${liveMatchState.score1} - ${liveMatchState.score2}`;
  minuteEl.textContent = `${liveMatchState.minute}'`;

  // Render events feed
  let feedHtml = "";
  liveMatchState.events.forEach(ev => {
    const desc = currentLang === "fa" ? ev.descFa : ev.descEn;
    const style = ev.isGoal ? "color:var(--glow); font-weight:bold;" : "";
    feedHtml += `
      <div class="event-line" style="${style}">
        <span class="minute">${ev.minute}'</span>
        <span>${desc}</span>
      </div>
    `;
  });
  feedEl.innerHTML = feedHtml;
};

// Export to window
window.liveMatchState = liveMatchState;
window.startLiveSimulation = startLiveSimulation;
window.stopLiveSimulation = stopLiveSimulation;
window.updateLiveMatchUI = updateLiveMatchUI;
