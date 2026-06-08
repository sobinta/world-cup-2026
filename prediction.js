// FIFA World Cup 2026 - Prediction and Standings Engine

const PREDICTIONS_KEY = "wc2026_user_predictions";
const OFFICIAL_RESULTS_KEY = "wc2026_official_results";

// Load user predictions
const loadPredictions = () => {
  const saved = localStorage.getItem(PREDICTIONS_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return window.initialFixtures.map(fixture => {
        const found = parsed.find(f => f.id === fixture.id);
        if (found) {
          return { ...fixture, score1: found.score1, score2: found.score2 };
        }
        return { ...fixture, score1: null, score2: null };
      });
    } catch (e) {
      console.error("Error loading predictions", e);
    }
  }
  // Default predictions: all null (empty)
  return window.initialFixtures.map(f => ({ ...f, score1: null, score2: null }));
};

// Load official results (defaults to empty since games haven't started)
const loadOfficialResults = () => {
  const saved = localStorage.getItem(OFFICIAL_RESULTS_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return window.initialFixtures.map(fixture => {
        const found = parsed.find(f => f.id === fixture.id);
        if (found) {
          return { ...fixture, score1: found.score1, score2: found.score2 };
        }
        return { ...fixture, score1: null, score2: null };
      });
    } catch (e) {
      console.error("Error loading official results", e);
    }
  }
  return window.initialFixtures.map(f => ({ ...f, score1: null, score2: null }));
};

let currentPredictions = loadPredictions();
let officialResults = loadOfficialResults();

const savePredictions = () => {
  localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(currentPredictions));
  window.dispatchEvent(new CustomEvent("fixturesUpdated"));
};

const saveOfficialResults = () => {
  localStorage.setItem(OFFICIAL_RESULTS_KEY, JSON.stringify(officialResults));
  window.dispatchEvent(new CustomEvent("fixturesUpdated"));
};

const resetAllPredictions = () => {
  currentPredictions = window.initialFixtures.map(f => ({ ...f, score1: null, score2: null }));
  savePredictions();
};

const resetAllOfficialResults = () => {
  officialResults = window.initialFixtures.map(f => ({ ...f, score1: null, score2: null }));
  saveOfficialResults();
};

// Simulate predictions
const simulateAllGroupMatches = () => {
  const getRandomScore = (ratingDiff) => {
    const lambda = 1.3 - (ratingDiff / 60);
    const boundedLambda = Math.max(0.4, Math.min(3.0, lambda));
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

// Calculate standings (type = "official" or "prediction")
const calculateStandings = (groupLetter, type = "official") => {
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

  const sourceData = type === "prediction" ? currentPredictions : officialResults;
  const groupMatches = sourceData.filter(m => m.group === groupLetter);

  groupMatches.forEach(match => {
    const s1 = match.score1;
    const s2 = match.score2;

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

  Object.keys(standings).forEach(team => {
    standings[team].gd = standings[team].gf - standings[team].ga;
  });

  const standingsArray = Object.values(standings);
  standingsArray.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.name.localeCompare(b.name);
  });

  return standingsArray;
};

const getPredictionProgress = () => {
  const predicted = currentPredictions.filter(
    m => m.score1 !== null && m.score2 !== null && m.score1 !== "" && m.score2 !== ""
  ).length;
  const total = currentPredictions.length;
  return { predicted, total, percent: Math.round((predicted / total) * 100) };
};

const saveOfficialScore = (matchId, teamNum, scoreVal) => {
  const matchIndex = officialResults.findIndex(m => m.id === matchId);
  if (matchIndex === -1) return;

  const val = scoreVal === "" ? null : parseInt(scoreVal, 10);

  if (teamNum === 1) {
    officialResults[matchIndex].score1 = val;
  } else {
    officialResults[matchIndex].score2 = val;
  }

  saveOfficialResults();
};

// Expose elements to window
window.currentPredictions = currentPredictions;
window.officialResults = officialResults;
window.savePredictions = savePredictions;
window.saveOfficialResults = saveOfficialResults;
window.resetAllPredictions = resetAllPredictions;
window.resetAllOfficialResults = resetAllOfficialResults;
window.simulateAllGroupMatches = simulateAllGroupMatches;
window.calculateStandings = calculateStandings;
window.getPredictionProgress = getPredictionProgress;
window.saveOfficialScore = saveOfficialScore;
