// FIFA World Cup 2026 - Knockout Bracket Engine

const PREDICTION_BRACKET_KEY = "wc2026_user_bracket_prediction";
const OFFICIAL_BRACKET_KEY = "wc2026_user_bracket_official";

const getBracketKey = () => {
  const mode = window.bracketViewMode || "prediction";
  return mode === "official" ? OFFICIAL_BRACKET_KEY : PREDICTION_BRACKET_KEY;
};

const createEmptyBracketState = () => ({
  round32: Array(16).fill(null).map((_, i) => ({ team1: "", team2: "", winner: null })),
  round16: Array(8).fill(null).map((_, i) => ({ team1: "", team2: "", winner: null })),
  quarters: Array(4).fill(null).map((_, i) => ({ team1: "", team2: "", winner: null })),
  semis: Array(2).fill(null).map((_, i) => ({ team1: "", team2: "", winner: null })),
  final: { team1: "", team2: "", winner: null },
  champion: null
});

let bracketState = createEmptyBracketState();

const loadActiveBracketState = () => {
  const key = getBracketKey();
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      bracketState = JSON.parse(saved);
      return;
    } catch(e) {
      console.error("Error loading bracket state", e);
    }
  }
  bracketState = createEmptyBracketState();
};

// Helper to check if a group's matches are fully played (6 matches)
const isGroupFinished = (groupLetter) => {
  const mode = window.bracketViewMode || "prediction";
  const fixtures = mode === "official" ? window.officialResults : window.currentPredictions;
  if (!fixtures) return false;
  const groupFixtures = fixtures.filter(f => f.group === groupLetter);
  const playedCount = groupFixtures.filter(f => f.score1 !== null && f.score2 !== null && f.score1 !== "" && f.score2 !== "").length;
  return playedCount === 6;
};

// Helper to check if a team slot is a placeholder
const isPlaceholder = (teamName) => {
  if (!teamName) return true;
  return teamName.startsWith("Winner Group") || 
         teamName.startsWith("Runner-up Group") || 
         teamName.startsWith("3rd Group") || 
         teamName.includes("/");
};

// Helper to translate team names and placeholders dynamically
const translateTeamName = (teamName, lang) => {
  if (!teamName || teamName === "TBD" || teamName === "???") {
    return lang === "fa" ? "نامشخص" : "TBD";
  }
  
  if (teamName.startsWith("Winner Group ")) {
    const group = teamName.replace("Winner Group ", "");
    return lang === "fa" ? `قهرمان گروه ${group}` : `Winner Group ${group}`;
  }
  if (teamName.startsWith("Runner-up Group ")) {
    const group = teamName.replace("Runner-up Group ", "");
    return lang === "fa" ? `تیم دوم گروه ${group}` : `Runner-up Group ${group}`;
  }
  if (teamName.startsWith("3rd Group ")) {
    const group = teamName.replace("3rd Group ", "");
    return lang === "fa" ? `تیم سوم گروه ${group}` : `3rd Group ${group}`;
  }

  const teamData = window.teamsData[teamName];
  if (teamData) {
    return lang === "fa" ? teamData.nameFa : teamName;
  }
  return teamName;
};

// Seeding setup: Get qualified teams from group standings
const getQualifiedTeamsFromStandings = () => {
  const winners = [];     // 1st place
  const runnersUp = [];   // 2nd place
  const thirdPlaces = []; // 3rd place
  const mode = window.bracketViewMode || "prediction";

  window.groupsList.forEach(groupLetter => {
    const standings = window.calculateStandings(groupLetter, mode);
    const finished = isGroupFinished(groupLetter);

    if (standings.length >= 3) {
      const wName = finished ? standings[0].name : `Winner Group ${groupLetter}`;
      const rName = finished ? standings[1].name : `Runner-up Group ${groupLetter}`;
      const tName = finished ? standings[2].name : `3rd Group ${groupLetter}`;

      winners.push({ team: wName, points: standings[0].pts, gd: standings[0].gd, gf: standings[0].gf });
      runnersUp.push({ team: rName, points: standings[1].pts, gd: standings[1].gd, gf: standings[1].gf });
      thirdPlaces.push({ team: tName, points: standings[2].pts, gd: standings[2].gd, gf: standings[2].gf });
    }
  });

  // Rank 3rd place teams
  thirdPlaces.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.team.localeCompare(b.team);
  });

  // Take the best 8 third-place teams
  const bestThird = thirdPlaces.slice(0, 8).map(t => t.team);

  return {
    winners: winners.map(w => w.team),
    runnersUp: runnersUp.map(r => r.team),
    bestThird: bestThird
  };
};

// Seed the Round of 32 matches
const seedRound32 = () => {
  const { winners, runnersUp, bestThird } = getQualifiedTeamsFromStandings();

  // Matchup configuration
  const matchups = [
    { t1: winners[0],  t2: bestThird[7] || "3rd Group C/D" },  // M1: Winner A vs 3rd-8
    { t1: runnersUp[1], t2: runnersUp[5] },                   // M2: Runner B vs Runner F
    { t1: winners[2],  t2: bestThird[6] || "3rd Group A/B" },  // M3: Winner C vs 3rd-7
    { t1: winners[3],  t2: runnersUp[4] },                   // M4: Winner D vs Runner E
    { t1: winners[4],  t2: bestThird[5] || "3rd Group I/J" },  // M5: Winner E vs 3rd-6
    { t1: runnersUp[0], t2: runnersUp[2] },                   // M6: Runner A vs Runner C
    { t1: winners[6],  t2: bestThird[4] || "3rd Group H/I" },  // M7: Winner G vs 3rd-5
    { t1: winners[7],  t2: runnersUp[6] },                   // M8: Winner H vs Runner G
    { t1: winners[1],  t2: bestThird[3] || "3rd Group K/L" },  // M9: Winner B vs 3rd-4
    { t1: runnersUp[3], t2: runnersUp[7] },                   // M10: Runner D vs Runner H
    { t1: winners[5],  t2: bestThird[2] || "3rd Group E/F" },  // M11: Winner F vs 3rd-3
    { t1: winners[8],  t2: runnersUp[9] },                   // M12: Winner I vs Runner J
    { t1: winners[9],  t2: bestThird[1] || "3rd Group G/H" },  // M13: Winner J vs 3rd-2
    { t1: winners[10], t2: runnersUp[11] },                  // M14: Winner K vs Runner L
    { t1: winners[11], t2: bestThird[0] || "3rd Group A/C" },  // M15: Winner L vs 3rd-1
    { t1: runnersUp[8], t2: runnersUp[10] }                  // M16: Runner I vs Runner K
  ];

  return matchups;
};

// Sync bracket with standings, preserving predictions if possible
const syncBracketWithStandings = () => {
  loadActiveBracketState();
  const localState = JSON.parse(JSON.stringify(bracketState));

  const seeded = seedRound32();

  // Update Round of 32
  bracketState.round32 = seeded.map((matchup, idx) => {
    const prevMatch = localState ? localState.round32[idx] : null;
    let winner = null;

    // Preserve winner if that team is still part of the seeded matchup and not a placeholder
    if (prevMatch && prevMatch.winner && (prevMatch.winner === matchup.t1 || prevMatch.winner === matchup.t2) && !isPlaceholder(prevMatch.winner)) {
      winner = prevMatch.winner;
    }

    return {
      team1: matchup.t1,
      team2: matchup.t2,
      winner: winner
    };
  });

  // Propagate other rounds based on winners
  propagateBracket();
  saveBracket();
};

// Propagate winners to the next rounds dynamically
const propagateBracket = () => {
  const state = bracketState;

  // Round of 32 -> Round of 16
  for (let i = 0; i < 8; i++) {
    const w1 = state.round32[2 * i].winner;
    const w2 = state.round32[2 * i + 1].winner;
    const prev = state.round16[i];
    let winner = null;

    if (prev && prev.winner && (prev.winner === w1 || prev.winner === w2) && !isPlaceholder(prev.winner)) {
      winner = prev.winner;
    }

    state.round16[i] = {
      team1: w1 || "",
      team2: w2 || "",
      winner: winner
    };
  }

  // Round of 16 -> Quarter-finals
  for (let i = 0; i < 4; i++) {
    const w1 = state.round16[2 * i].winner;
    const w2 = state.round16[2 * i + 1].winner;
    const prev = state.quarters[i];
    let winner = null;

    if (prev && prev.winner && (prev.winner === w1 || prev.winner === w2) && !isPlaceholder(prev.winner)) {
      winner = prev.winner;
    }

    state.quarters[i] = {
      team1: w1 || "",
      team2: w2 || "",
      winner: winner
    };
  }

  // Quarter-finals -> Semi-finals
  for (let i = 0; i < 2; i++) {
    const w1 = state.quarters[2 * i].winner;
    const w2 = state.quarters[2 * i + 1].winner;
    const prev = state.semis[i];
    let winner = null;

    if (prev && prev.winner && (prev.winner === w1 || prev.winner === w2) && !isPlaceholder(prev.winner)) {
      winner = prev.winner;
    }

    state.semis[i] = {
      team1: w1 || "",
      team2: w2 || "",
      winner: winner
    };
  }

  // Semi-finals -> Final
  const f1 = state.semis[0].winner;
  const f2 = state.semis[1].winner;
  const prevFinal = state.final;
  let finalWinner = null;

  if (prevFinal && prevFinal.winner && (prevFinal.winner === f1 || prevFinal.winner === f2) && !isPlaceholder(prevFinal.winner)) {
    finalWinner = prevFinal.winner;
  }

  state.final = {
    team1: f1 || "",
    team2: f2 || "",
    winner: finalWinner
  };

  // Champion
  state.champion = state.final.winner || null;
};

// Select a winner and advance them (prevent placeholders)
const advanceTeam = (roundName, matchIndex, teamNum) => {
  if (roundName === 'final') {
    const match = bracketState.final;
    const selectedTeam = teamNum === 1 ? match.team1 : match.team2;
    if (!selectedTeam || isPlaceholder(selectedTeam)) return;

    if (match.winner === selectedTeam) {
      match.winner = null; // Toggle off
    } else {
      match.winner = selectedTeam;
    }
  } else {
    const roundMatches = bracketState[roundName];
    if (!roundMatches || !roundMatches[matchIndex]) return;

    const match = roundMatches[matchIndex];
    const selectedTeam = teamNum === 1 ? match.team1 : match.team2;
    if (!selectedTeam || isPlaceholder(selectedTeam)) return;

    if (match.winner === selectedTeam) {
      match.winner = null; // Toggle off
    } else {
      match.winner = selectedTeam;
    }
  }

  // Recalculate bracket from this point forward
  propagateBracket();
  saveBracket();
  
  // Render updated bracket view
  renderBracketView();
};

const saveBracket = () => {
  localStorage.setItem(getBracketKey(), JSON.stringify(bracketState));
};

// Listen for standings updates to re-seed Round of 32
window.addEventListener("fixturesUpdated", () => {
  syncBracketWithStandings();
});

// Render the bracket HTML dynamically (Bilateral / Symmetrical 9-Column Layout)
const renderBracketView = () => {
  const container = document.getElementById("bracket-view-container");
  if (!container) return;

  const currentLang = window.currentLanguage || "fa";
  const state = bracketState;

  let html = `<div class="bracket-wrapper">`;

  // Left Column 1: Round of 32 (Matches 0 - 7)
  html += `<div class="bracket-round">`;
  for (let idx = 0; idx < 8; idx++) {
    html += renderBracketMatchup('round32', idx, state.round32[idx], currentLang);
  }
  html += `</div>`;

  // Left Column 2: Round of 16 (Matches 0 - 3)
  html += `<div class="bracket-round">`;
  for (let idx = 0; idx < 4; idx++) {
    html += renderBracketMatchup('round16', idx, state.round16[idx], currentLang);
  }
  html += `</div>`;

  // Left Column 3: Quarter-finals (Matches 0 - 1)
  html += `<div class="bracket-round">`;
  for (let idx = 0; idx < 2; idx++) {
    html += renderBracketMatchup('quarters', idx, state.quarters[idx], currentLang);
  }
  html += `</div>`;

  // Left Column 4: Semi-finals (Match 0)
  html += `<div class="bracket-round">`;
  html += renderBracketMatchup('semis', 0, state.semis[0], currentLang);
  html += `</div>`;

  // Center Column 5: Final & Champion Card
  html += `<div class="bracket-round final-column">`;
  html += `<div style="text-align:center; font-weight:800; color:var(--accent); font-size:1.1rem; margin-bottom: 0.5rem;">${currentLang === 'fa' ? 'فینال' : 'FINAL'}</div>`;
  html += renderBracketMatchup('final', 0, state.final, currentLang);
  
  if (state.champion) {
    const team = window.teamsData[state.champion];
    const flagUrl = team ? `https://flagcdn.com/w160/${team.code}.png` : "";
    const teamName = team ? (currentLang === "fa" ? team.nameFa : state.champion) : state.champion;
    
    html += `
      <div class="champion-card glass-card">
        <h4 style="color:var(--glow); font-weight:800; font-size:1.2rem; margin-bottom: 0.5rem;">🏆 ${window.translations[currentLang].champion} 🏆</h4>
        <div style="font-size: 1.5rem; font-weight:900; margin-bottom:0.5rem;">${teamName}</div>
        <img src="${flagUrl}" alt="${state.champion}" style="border-radius:6px; border: 1px solid var(--border-color); box-shadow:0 5px 15px rgba(0,0,0,0.5); width: 120px;">
      </div>
    `;
  }
  html += `</div>`; // End Column 5

  // Right Column 6: Semi-finals (Match 1)
  html += `<div class="bracket-round">`;
  html += renderBracketMatchup('semis', 1, state.semis[1], currentLang);
  html += `</div>`;

  // Right Column 7: Quarter-finals (Matches 2 - 3)
  html += `<div class="bracket-round">`;
  for (let idx = 2; idx < 4; idx++) {
    html += renderBracketMatchup('quarters', idx, state.quarters[idx], currentLang);
  }
  html += `</div>`;

  // Right Column 8: Round of 16 (Matches 4 - 7)
  html += `<div class="bracket-round">`;
  for (let idx = 4; idx < 8; idx++) {
    html += renderBracketMatchup('round16', idx, state.round16[idx], currentLang);
  }
  html += `</div>`;

  // Right Column 9: Round of 32 (Matches 8 - 15)
  html += `<div class="bracket-round">`;
  for (let idx = 8; idx < 16; idx++) {
    html += renderBracketMatchup('round32', idx, state.round32[idx], currentLang);
  }
  html += `</div>`;

  html += `</div>`; // End Wrapper
  container.innerHTML = html;
};

// Helper to render a single matchup block (with symmetrical right-side layout support)
const renderBracketMatchup = (roundName, matchIndex, match, lang) => {
  const t1 = match ? match.team1 : "";
  const t2 = match ? match.team2 : "";

  const team1Data = window.teamsData[t1];
  const team2Data = window.teamsData[t2];

  const t1Name = translateTeamName(t1, lang);
  const t2Name = translateTeamName(t2, lang);

  const flag1 = team1Data ? `<img src="https://flagcdn.com/w40/${team1Data.code}.png" class="flag-icon">` : "";
  const flag2 = team2Data ? `<img src="https://flagcdn.com/w40/${team2Data.code}.png" class="flag-icon">` : "";

  const isT1Winner = match && match.winner && match.winner === t1;
  const isT2Winner = match && match.winner && match.winner === t2;

  const t1Class = (match && match.winner) ? (isT1Winner ? 'winner' : 'loser') : '';
  const t2Class = (match && match.winner) ? (isT2Winner ? 'winner' : 'loser') : '';

  // Check if this matchup is rendered on the right side of the bracket
  const isRightSide = 
    (roundName === 'round32' && matchIndex >= 8) ||
    (roundName === 'round16' && matchIndex >= 4) ||
    (roundName === 'quarters' && matchIndex >= 2) ||
    (roundName === 'semis' && matchIndex === 1);
  
  const rightSideClass = isRightSide ? "right-side-card" : "";

  return `
    <div class="bracket-matchup">
      <div class="bracket-team-card ${t1Class} ${rightSideClass}" onclick="window.advanceTeam('${roundName}', ${matchIndex}, 1)">
        ${flag1}
        <span class="team-name-lbl">${t1Name}</span>
        ${isT1Winner ? '<span class="score">✓</span>' : ''}
      </div>
      <div class="bracket-team-card ${t2Class} ${rightSideClass}" onclick="window.advanceTeam('${roundName}', ${matchIndex}, 2)">
        ${flag2}
        <span class="team-name-lbl">${t2Name}</span>
        ${isT2Winner ? '<span class="score">✓</span>' : ''}
      </div>
    </div>
  `;
};

// Setup scroll grabbing drag functionality on bracket view
const setupBracketGrabbing = () => {
  const slider = document.querySelector('.bracket-scroll-container');
  if (!slider) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener('mouseleave', () => {
    isDown = false;
  });
  slider.addEventListener('mouseup', () => {
    isDown = false;
  });
  slider.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5; //scroll-fast
    slider.scrollLeft = scrollLeft - walk;
  });
};

// Expose functions globally
window.bracketState = bracketState;
window.syncBracketWithStandings = syncBracketWithStandings;
window.advanceTeam = advanceTeam;
window.renderBracketView = renderBracketView;
window.setupBracketGrabbing = setupBracketGrabbing;
