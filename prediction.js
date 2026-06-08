// FIFA World Cup 2026 - Prediction and Standings Engine

const PREDICTIONS_KEY = "wc2026_user_predictions";

// Load predictions from LocalStorage or use initial fixtures
const loadPredictions = () => {
  const saved = localStorage.getItem(PREDICTIONS_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Ensure all initial fixtures are present even if layout changed
      return window.initialFixtures.map(fixture => {
        const found = parsed.find(f => f.id === fixture.id);
        if (found) {
          return { ...fixture, score1: found.score1, score2: found.score2 };
        }
        return fixture;
      });
    } catch (e) {
      console.error("Error loading predictions, resetting...", e);
    }
  }
  return JSON.parse(JSON.stringify(window.initialFixtures));
};

let currentPredictions = loadPredictions();

// Save to LocalStorage
const savePredictions = () => {
  localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(currentPredictions));
  // Fire update event so other modules know matches changed
  window.dispatchEvent(new CustomEvent("fixturesUpdated"));
};

// Reset all predictions
const resetAllPredictions = () => {
  currentPredictions = JSON.parse(JSON.stringify(window.initialFixtures));
  savePredictions();
};

// Simulate all group matches randomly but realistically
const simulateAllGroupMatches = () => {
  // Realistic soccer score distributions (higher chance of 0, 1, 2 goals)
  const getRandomScore = (ratingDiff) => {
    // ratingDiff = team1Ranking - team2Ranking (lower rank is better)
    // Adjust probability based on FIFA rank difference
    const lambda = 1.3 - (ratingDiff / 60); // Average goals per team
    const boundedLambda = Math.max(0.4, Math.min(3.0, lambda));
    
    // Poisson distribution approximation
    const L = Math.exp(-boundedLambda);
    let k = 0;
    let p = 1.0;
    do {
      k++;
      p *= Math.random();
    } while (p > L && k < 10);
    return k - 1;
  };

  currentPredictions.forEach(match => {
    const t1 = window.teamsData[match.team1];
    const t2 = window.teamsData[match.team2];
    
    if (t1 && t2) {
      const diff = t1.ranking - t2.ranking;
      match.score1 = getRandomScore(diff);
      match.score2 = getRandomScore(-diff);
    } else {
      match.score1 = Math.floor(Math.random() * 3);
      match.score2 = Math.floor(Math.random() * 3);
    }
  });

  savePredictions();
};

// Calculate standings for a specific group based on predictions
const calculateStandings = (groupLetter) => {
  // Initialize table rows for group teams
  const groupTeams = Object.keys(window.teamsData).filter(
    teamName => window.teamsData[teamName].group === groupLetter
  );

  const standings = {};
  groupTeams.forEach(team => {
    standings[team] = {
      name: team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0
    };
  });

  // Calculate stats from predicted matches
  const groupMatches = currentPredictions.filter(m => m.group === groupLetter);

  groupMatches.forEach(match => {
    const s1 = match.score1;
    const s2 = match.score2;

    // Check if score is entered (not null, not undefined, and not empty string)
    if (s1 !== null && s2 !== null && s1 !== "" && s2 !== "") {
      const g1 = parseInt(s1, 10);
      const g2 = parseInt(s2, 10);

      if (isNaN(g1) || isNaN(g2)) return;

      const t1 = match.team1;
      const t2 = match.team2;

      if (!standings[t1] || !standings[t2]) return;

      standings[t1].played += 1;
      standings[t2].played += 1;
      standings[t1].gf += g1;
      standings[t1].ga += g2;
      standings[t2].gf += g2;
      standings[t2].ga += g1;

      if (g1 > g2) {
        standings[t1].won += 1;
        standings[t1].pts += 3;
        standings[t2].lost += 1;
      } else if (g1 < g2) {
        standings[t2].won += 1;
        standings[t2].pts += 3;
        standings[t1].lost += 1;
      } else {
        standings[t1].drawn += 1;
        standings[t1].pts += 1;
        standings[t2].drawn += 1;
        standings[t2].pts += 1;
      }
    }
  });

  // Calculate Goal Difference
  Object.keys(standings).forEach(team => {
    standings[team].gd = standings[team].gf - standings[team].ga;
  });

  // Convert to array and sort according to FIFA rules:
  // 1. Points
  // 2. Goal Difference
  // 3. Goals For
  // 4. Alphabetical (fallback)
  const standingsArray = Object.values(standings);
  standingsArray.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.name.localeCompare(b.name);
  });

  return standingsArray;
};

// Calculate count of predicted matches for completion tracking
const getPredictionProgress = () => {
  const predicted = currentPredictions.filter(
    m => m.score1 !== null && m.score2 !== null && m.score1 !== "" && m.score2 !== ""
  ).length;
  const total = currentPredictions.length;
  return { predicted, total, percent: Math.round((predicted / total) * 100) };
};

// Expose elements to window
window.currentPredictions = currentPredictions;
window.savePredictions = savePredictions;
window.resetAllPredictions = resetAllPredictions;
window.simulateAllGroupMatches = simulateAllGroupMatches;
window.calculateStandings = calculateStandings;
window.getPredictionProgress = getPredictionProgress;
