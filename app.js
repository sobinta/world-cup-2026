// FIFA World Cup 2026 - Main Application Logic

let currentLanguage = "fa"; // Default language
let currentTheme = "emerald";

// Track trivia state
let triviaState = {
  currentQuestionIndex: 0,
  score: 0,
  answered: false
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  initLanguage();
  initTheme();
  initRouter();
  initCountdown();
  updateProgressTracker();
  initGroupsPage();
  initPredictionsPage();
  initComparePage();
  initStadiumsPage();
  initQuizPage();

  // Load and render bracket
  window.syncBracketWithStandings();
  window.renderBracketView();
  window.setupBracketGrabbing();

  // Live simulation UI init
  window.updateLiveMatchUI();

  // Listen to match predictions update to refresh calculations
  window.addEventListener("fixturesUpdated", () => {
    updateProgressTracker();
    updateStandingsTables();
    // Re-render active group in predictor if open
    const activeTab = document.querySelector(".predict-group-tab.active");
    if (activeTab) {
      renderPredictorGroup(activeTab.dataset.group);
    }
  });

  // Global close modal handler
  window.closeExpandedGroup = () => {
    document.getElementById("group-expanded-overlay").classList.remove("active");
  };
  window.closeTeamModal = () => {
    document.getElementById("team-modal-overlay").classList.remove("active");
  };
});

// --- Theme Selector ---
const initTheme = () => {
  const savedTheme = localStorage.getItem("wc2026_theme") || "emerald";
  setTheme(savedTheme);

  // Setup theme button event listeners
  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;
      setTheme(theme);
    });
  });
};

const setTheme = (themeName) => {
  currentTheme = themeName;
  document.documentElement.setAttribute("data-theme", themeName);
  localStorage.setItem("wc2026_theme", themeName);

  // Update active state on buttons
  document.querySelectorAll(".theme-btn").forEach(btn => {
    if (btn.dataset.theme === themeName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
};

// --- Bilingual Engine (Persian / English) ---
const initLanguage = () => {
  const savedLang = localStorage.getItem("wc2026_lang") || "fa";
  setLanguage(savedLang);

  // Language button toggler
  const langBtn = document.getElementById("lang-toggle-btn");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      const nextLang = currentLanguage === "fa" ? "en" : "fa";
      setLanguage(nextLang);
    });
  }
};

const setLanguage = (lang) => {
  currentLanguage = lang;
  window.currentLanguage = lang;
  localStorage.setItem("wc2026_lang", lang);

  const isRtl = lang === "fa";
  document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
  document.body.className = isRtl ? "lang-fa" : "lang-en";

  // Translate all UI text using translations keys
  const dict = window.translations[lang];
  
  // Update translation key elements
  document.querySelectorAll("[data-trans]").forEach(el => {
    const key = el.dataset.trans;
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Re-render dynamic elements in active language
  initGroupsPage();
  updateStandingsTables();
  
  const activeTab = document.querySelector(".predict-group-tab.active");
  if (activeTab) {
    renderPredictorGroup(activeTab.dataset.group);
  }

  // Update compare dropdowns & board
  updateCompareDropdowns();
  compareTeams();

  // Update stadiums list
  initStadiumsPage();

  // Update trivia interface
  renderTriviaQuestion();

  // Update live simulator text
  window.updateLiveMatchUI();
  
  // Update bracket rendering
  window.renderBracketView();
};

// --- Router (Tab Switching) ---
const initRouter = () => {
  const navItems = document.querySelectorAll(".nav-item");
  const views = document.querySelectorAll(".view-panel");

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const targetView = item.dataset.view;

      // Update active nav item
      navItems.forEach(nav => nav.classList.remove("active"));
      item.classList.add("active");

      // Show correct page view
      views.forEach(view => {
        if (view.id === targetView) {
          view.classList.add("active");
        } else {
          view.classList.remove("active");
        }
      });

      // Special initializations on tab enter
      if (targetView === "bracket") {
        window.renderBracketView();
      }
    });
  });
};

// --- Countdown Clock ---
const initCountdown = () => {
  const kickoffTime = new Date("2026-06-11T20:00:00-06:00").getTime(); // Host time offset approximate

  const updateClock = () => {
    const now = new Date().getTime();
    const diff = kickoffTime - now;

    if (diff <= 0) {
      document.getElementById("countdown-widget").innerHTML = `<div style="font-size:2rem; font-weight:800; color:var(--glow);">Tournament has started! / تورنمنت آغاز شد!</div>`;
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    // Apply value to UI
    document.getElementById("cd-days").textContent = days;
    document.getElementById("cd-hours").textContent = String(hours).padStart(2, '0');
    document.getElementById("cd-mins").textContent = String(mins).padStart(2, '0');
    document.getElementById("cd-secs").textContent = String(secs).padStart(2, '0');
  };

  updateClock();
  setInterval(updateClock, 1000);
};

// --- Dashboard Progress Tracker ---
const updateProgressTracker = () => {
  const { predicted, total, percent } = window.getPredictionProgress();
  const fill = document.getElementById("progress-fill-bar");
  const text = document.getElementById("progress-text-lbl");

  if (fill && text) {
    fill.style.width = `${percent}%`;
    const textT = currentLanguage === "fa" 
      ? `${predicted} بازی از ${total} بازی پیش‌بینی شده (${percent}%)`
      : `${predicted} of ${total} matches predicted (${percent}%)`;
    text.textContent = textT;
  }
};

// --- Groups Page ---
const initGroupsPage = () => {
  const container = document.getElementById("groups-list-container");
  if (!container) return;

  let html = "";
  window.groupsList.forEach(groupLetter => {
    // Calculate standings to get current ranking in group
    const standings = window.calculateStandings(groupLetter);

    html += `
      <div class="glass-card group-card" onclick="window.expandGroup('${groupLetter}')">
        <h3>
          <span>${currentLanguage === "fa" ? 'گروه ' + groupLetter : 'Group ' + groupLetter}</span>
          <span class="group-badge">FIFA 2026</span>
        </h3>
        <div style="display:flex; flex-direction:column; gap:0.4rem;">
    `;

    standings.forEach(row => {
      const team = window.teamsData[row.name];
      const flagUrl = team ? `https://flagcdn.com/w40/${team.code}.png` : "";
      const teamLabel = team ? (currentLanguage === "fa" ? team.nameFa : row.name) : row.name;
      
      html += `
        <div class="group-team-item">
          <img src="${flagUrl}" alt="${row.name}" class="flag-icon">
          <span class="team-name-lbl">${teamLabel}</span>
          <span class="team-pts-lbl">${row.pts} ${currentLanguage === "fa" ? 'امتیاز' : 'pts'}</span>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
};

// Modal Expanded Group View
window.expandGroup = (groupLetter) => {
  const overlay = document.getElementById("group-expanded-overlay");
  const modalTitle = document.getElementById("expanded-group-title");
  
  if (!overlay) return;

  modalTitle.textContent = currentLanguage === "fa" ? `جزئیات گروه ${groupLetter}` : `Group ${groupLetter} Details`;
  overlay.classList.add("active");

  // Setup tabs
  const tabContainer = document.getElementById("expanded-modal-tabs");
  tabContainer.innerHTML = `
    <button class="modal-tab-btn active" onclick="switchModalTab(event, 'table', '${groupLetter}')" data-trans="table">${window.translations[currentLanguage].table}</button>
    <button class="modal-tab-btn" onclick="switchModalTab(event, 'matches', '${groupLetter}')" data-trans="matches">${window.translations[currentLanguage].matches}</button>
  `;

  // Render Table content initially
  renderExpandedGroupTable(groupLetter);
};

// Switch sub-tabs inside Group detail modal
window.switchModalTab = (event, tabName, groupLetter) => {
  document.querySelectorAll(".modal-tab-btn").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");

  if (tabName === 'table') {
    renderExpandedGroupTable(groupLetter);
  } else {
    renderExpandedGroupMatches(groupLetter);
  }
};

// Render Standing Table inside Modal
const renderExpandedGroupTable = (groupLetter) => {
  const container = document.getElementById("expanded-group-content");
  const standings = window.calculateStandings(groupLetter);
  const dict = window.translations[currentLanguage];

  let tableHtml = `
    <div class="table-responsive">
      <table class="standings-table">
        <thead>
          <tr>
            <th>${dict.pos}</th>
            <th>${dict.team}</th>
            <th>${dict.played}</th>
            <th>${dict.won}</th>
            <th>${dict.drawn}</th>
            <th>${dict.lost}</th>
            <th>${dict.gf}</th>
            <th>${dict.ga}</th>
            <th>${dict.gd}</th>
            <th>${dict.pts}</th>
          </tr>
        </thead>
        <tbody>
  `;

  standings.forEach((row, index) => {
    const team = window.teamsData[row.name];
    const flagUrl = team ? `https://flagcdn.com/w40/${team.code}.png` : "";
    const teamLabel = team ? (currentLanguage === "fa" ? team.nameFa : row.name) : row.name;

    tableHtml += `
      <tr class="clickable-team" onclick="window.showTeamProfile('${row.name}')">
        <td style="font-weight:700; color:var(--accent);">${index + 1}</td>
        <td>
          <div class="team-cell">
            <img src="${flagUrl}" alt="${row.name}" class="flag-icon">
            <span>${teamLabel}</span>
          </div>
        </td>
        <td>${row.played}</td>
        <td>${row.won}</td>
        <td>${row.drawn}</td>
        <td>${row.lost}</td>
        <td>${row.gf}</td>
        <td>${row.ga}</td>
        <td style="font-weight:700; color:${row.gd > 0 ? 'var(--glow)' : (row.gd < 0 ? '#ff3860' : 'var(--text-muted)')};">
          ${row.gd > 0 ? '+' + row.gd : row.gd}
        </td>
        <td style="font-weight:800; color:var(--accent);">${row.pts}</td>
      </tr>
    `;
  });

  tableHtml += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = tableHtml;
};

// Render Matches inside Modal
const renderExpandedGroupMatches = (groupLetter) => {
  const container = document.getElementById("expanded-group-content");
  const groupMatches = window.currentPredictions.filter(m => m.group === groupLetter);

  let matchesHtml = `<div class="matches-list">`;

  groupMatches.forEach(match => {
    const t1 = window.teamsData[match.team1];
    const t2 = window.teamsData[match.team2];

    const t1Label = t1 ? (currentLanguage === "fa" ? t1.nameFa : match.team1) : match.team1;
    const t2Label = t2 ? (currentLanguage === "fa" ? t2.nameFa : match.team2) : match.team2;

    const flag1 = t1 ? `https://flagcdn.com/w40/${t1.code}.png` : "";
    const flag2 = t2 ? `https://flagcdn.com/w40/${t2.code}.png` : "";

    const scoreText = (match.score1 !== null && match.score2 !== null && match.score1 !== "" && match.score2 !== "")
      ? `<span style="font-size:1.6rem; font-weight:800; color:var(--accent); letter-spacing:5px;">${match.score1} - ${match.score2}</span>`
      : `<span style="color:var(--text-muted); font-size:1rem; font-weight:600;">VS / در مقابل</span>`;

    matchesHtml += `
      <div class="match-card">
        <div class="match-meta">
          <span class="stadium-lbl">${match.stadium}</span>
          <span>${match.city}</span>
          <span>${match.date}</span>
        </div>
        <div class="match-prediction-row">
          <div class="team-prediction home" style="width:160px;">
            <span class="team-name-lbl" style="margin: 0 8px;">${t1Label}</span>
            <img src="${flag1}" alt="" class="flag-icon">
          </div>
          <div style="flex-grow:0; text-align:center; min-width:80px;">
            ${scoreText}
          </div>
          <div class="team-prediction away" style="width:160px;">
            <img src="${flag2}" alt="" class="flag-icon">
            <span class="team-name-lbl" style="margin: 0 8px;">${t2Label}</span>
          </div>
        </div>
      </div>
    `;
  });

  matchesHtml += `</div>`;
  container.innerHTML = matchesHtml;
};

// Re-calculate standing values and update open overlay tables
const updateStandingsTables = () => {
  initGroupsPage();
  const overlay = document.getElementById("group-expanded-overlay");
  if (overlay && overlay.classList.contains("active")) {
    const titleText = document.getElementById("expanded-group-title").textContent;
    // Extract group letter from title
    const match = titleText.match(/([A-L])/);
    if (match && match[1]) {
      const activeTab = document.querySelector(".modal-tab-btn.active");
      if (activeTab && activeTab.getAttribute("onclick").includes("matches")) {
        renderExpandedGroupMatches(match[1]);
      } else {
        renderExpandedGroupTable(match[1]);
      }
    }
  }
};

// Modal Team Profile Viewer
window.showTeamProfile = (teamName) => {
  const overlay = document.getElementById("team-modal-overlay");
  const content = document.getElementById("team-modal-content");
  
  if (!overlay || !content) return;

  const team = window.teamsData[teamName];
  if (!team) return;

  const flagUrl = `https://flagcdn.com/w160/${team.code}.png`;
  const teamLabel = currentLanguage === "fa" ? team.nameFa : teamName;
  const dict = window.translations[currentLanguage];

  content.innerHTML = `
    <img src="${flagUrl}" alt="${teamName}" class="modal-team-flag">
    <h3>${teamLabel}</h3>
    <div class="team-modal-detail-row">
      <span class="label">${dict.ranking}</span>
      <span class="val">#${team.ranking}</span>
    </div>
    <div class="team-modal-detail-row">
      <span class="label">${dict.coach}</span>
      <span class="val">${team.coach}</span>
    </div>
    <div class="team-modal-detail-row">
      <span class="label">${dict.starPlayer}</span>
      <span class="val">${team.star}</span>
    </div>
    <div class="team-modal-detail-row" style="border-bottom:none;">
      <span class="label">${currentLanguage === "fa" ? 'گروه بازی ها' : 'Tournament Group'}</span>
      <span class="val" style="color:var(--accent); font-weight:800;">${team.group}</span>
    </div>
  `;

  overlay.classList.add("active");
};

// --- Prediction Center ---
const initPredictionsPage = () => {
  const tabContainer = document.getElementById("predictor-tabs-container");
  if (!tabContainer) return;

  // Build letters tabs A to L
  let tabsHtml = "";
  window.groupsList.forEach(group => {
    tabsHtml += `
      <div class="predict-group-tab" data-group="${group}" onclick="switchPredictGroupTab(event, '${group}')">
        ${group}
      </div>
    `;
  });
  tabContainer.innerHTML = tabsHtml;

  // Click initial A tab
  const firstTab = tabContainer.querySelector(".predict-group-tab");
  if (firstTab) firstTab.click();
};

window.switchPredictGroupTab = (event, groupLetter) => {
  document.querySelectorAll(".predict-group-tab").forEach(tab => tab.classList.remove("active"));
  event.currentTarget.classList.add("active");

  renderPredictorGroup(groupLetter);
};

const renderPredictorGroup = (groupLetter) => {
  const container = document.getElementById("predictor-matches-container");
  if (!container) return;

  const groupMatches = window.currentPredictions.filter(m => m.group === groupLetter);
  let html = `<div class="matches-list">`;

  groupMatches.forEach(match => {
    const t1 = window.teamsData[match.team1];
    const t2 = window.teamsData[match.team2];

    const t1Label = t1 ? (currentLanguage === "fa" ? t1.nameFa : match.team1) : match.team1;
    const t2Label = t2 ? (currentLanguage === "fa" ? t2.nameFa : match.team2) : match.team2;

    const flag1 = t1 ? `https://flagcdn.com/w40/${t1.code}.png` : "";
    const flag2 = t2 ? `https://flagcdn.com/w40/${t2.code}.png` : "";

    const val1 = match.score1 !== null ? match.score1 : "";
    const val2 = match.score2 !== null ? match.score2 : "";

    html += `
      <div class="match-card">
        <div class="match-meta">
          <span class="stadium-lbl">${match.stadium}</span>
          <span>${match.city}</span>
          <span>${match.date}</span>
        </div>
        <div class="match-prediction-row">
          <div class="team-prediction home">
            <span class="team-name-lbl" style="margin: 0 10px;">${t1Label}</span>
            <img src="${flag1}" alt="" class="flag-icon">
          </div>
          
          <div style="display:flex; align-items:center; gap:0.5rem; justify-content:center;">
            <input type="number" min="0" max="99" class="score-input" 
              value="${val1}"
              onchange="window.saveMatchScore('${match.id}', 1, this.value)">
            
            <span class="score-input-print-val">${val1}</span>
            <span style="font-weight:700; color:var(--text-muted);">:</span>
            <span class="score-input-print-val">${val2}</span>
            
            <input type="number" min="0" max="99" class="score-input" 
              value="${val2}"
              onchange="window.saveMatchScore('${match.id}', 2, this.value)">
          </div>

          <div class="team-prediction away">
            <img src="${flag2}" alt="" class="flag-icon">
            <span class="team-name-lbl" style="margin: 0 10px;">${t2Label}</span>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
};

// Save individual predicted score input
window.saveMatchScore = (matchId, teamNum, scoreVal) => {
  const matchIndex = window.currentPredictions.findIndex(m => m.id === matchId);
  if (matchIndex === -1) return;

  const val = scoreVal === "" ? null : parseInt(scoreVal, 10);

  if (teamNum === 1) {
    window.currentPredictions[matchIndex].score1 = val;
  } else {
    window.currentPredictions[matchIndex].score2 = val;
  }

  window.savePredictions(); // Updates local storage and triggers calculations
};

// Prediction general action buttons
window.triggerSimulateAll = () => {
  window.simulateAllGroupMatches();
  // Refresh current group prediction inputs
  const activeTab = document.querySelector(".predict-group-tab.active");
  if (activeTab) {
    renderPredictorGroup(activeTab.dataset.group);
  }
};

window.triggerResetAll = () => {
  window.resetAllPredictions();
  const activeTab = document.querySelector(".predict-group-tab.active");
  if (activeTab) {
    renderPredictorGroup(activeTab.dataset.group);
  }
};

// --- Team Head-to-Head Compare Screen ---
const initComparePage = () => {
  const s1 = document.getElementById("compare-team-1");
  const s2 = document.getElementById("compare-team-2");

  if (!s1 || !s2) return;

  updateCompareDropdowns();

  // Pick default initial selections
  s1.value = "IR Iran";
  s2.value = "United States";
  
  compareTeams();
};

const updateCompareDropdowns = () => {
  const s1 = document.getElementById("compare-team-1");
  const s2 = document.getElementById("compare-team-2");
  
  if (!s1 || !s2) return;

  const prev1 = s1.value;
  const prev2 = s2.value;

  const sortedTeamNames = Object.keys(window.teamsData).sort();

  let html1 = `<option value="" disabled>${window.translations[currentLanguage].selectTeam1}</option>`;
  let html2 = `<option value="" disabled>${window.translations[currentLanguage].selectTeam2}</option>`;

  sortedTeamNames.forEach(name => {
    const team = window.teamsData[name];
    const lbl = currentLanguage === "fa" ? team.nameFa : name;
    html1 += `<option value="${name}">${lbl}</option>`;
    html2 += `<option value="${name}">${lbl}</option>`;
  });

  s1.innerHTML = html1;
  s2.innerHTML = html2;

  // Restore values
  if (prev1) s1.value = prev1;
  if (prev2) s2.value = prev2;
};

window.compareTeams = () => {
  const name1 = document.getElementById("compare-team-1").value;
  const name2 = document.getElementById("compare-team-2").value;

  const board = document.getElementById("compare-results-board");
  if (!board) return;

  if (!name1 || !name2) return;

  if (name1 === name2) {
    board.style.opacity = 0.5;
    alert(window.translations[currentLanguage].chooseTeamsWarning);
    return;
  }

  board.style.opacity = 1;

  const t1 = window.teamsData[name1];
  const t2 = window.teamsData[name2];

  const t1Name = currentLanguage === "fa" ? t1.nameFa : name1;
  const t2Name = currentLanguage === "fa" ? t2.nameFa : name2;

  const flag1 = `https://flagcdn.com/w160/${t1.code}.png`;
  const flag2 = `https://flagcdn.com/w160/${t2.code}.png`;

  const dict = window.translations[currentLanguage];

  board.innerHTML = `
    <!-- Left Team (A) -->
    <div class="compare-side glass-card">
      <img src="${flag1}" alt="${name1}">
      <h3>${t1Name}</h3>
      <div class="compare-stats-list">
        <div class="compare-stat-row">
          <span>${dict.ranking}</span>
          <span style="font-weight:700;">#${t1.ranking}</span>
        </div>
        <div class="compare-stat-row">
          <span>${dict.coach}</span>
          <span>${t1.coach}</span>
        </div>
        <div class="compare-stat-row">
          <span>${dict.starPlayer}</span>
          <span>${t1.star}</span>
        </div>
        <div class="compare-stat-row" style="border-bottom:none;">
          <span>${currentLanguage === "fa" ? 'گروه' : 'Group'}</span>
          <span style="font-weight:800; color:var(--accent);">${t1.group}</span>
        </div>
      </div>
    </div>

    <!-- VS Center divider -->
    <div class="compare-center">
      <div style="font-size:2.5rem; letter-spacing:2px;">VS</div>
      <div style="font-size:0.9rem; color:var(--text-muted); text-transform:uppercase;">MATCHUP</div>
    </div>

    <!-- Right Team (B) -->
    <div class="compare-side glass-card">
      <img src="${flag2}" alt="${name2}">
      <h3>${t2Name}</h3>
      <div class="compare-stats-list">
        <div class="compare-stat-row">
          <span>${dict.ranking}</span>
          <span style="font-weight:700;">#${t2.ranking}</span>
        </div>
        <div class="compare-stat-row">
          <span>${dict.coach}</span>
          <span>${t2.coach}</span>
        </div>
        <div class="compare-stat-row">
          <span>${dict.starPlayer}</span>
          <span>${t2.star}</span>
        </div>
        <div class="compare-stat-row" style="border-bottom:none;">
          <span>${currentLanguage === "fa" ? 'گروه' : 'Group'}</span>
          <span style="font-weight:800; color:var(--accent);">${t2.group}</span>
        </div>
      </div>
    </div>
  `;
};

// --- Stadiums Page ---
const initStadiumsPage = () => {
  const container = document.getElementById("stadiums-grid-container");
  if (!container) return;

  let html = "";
  window.stadiumsData.forEach(stadium => {
    const labelMatches = currentLanguage === "fa" 
      ? `میزبانی ${stadium.matches} بازی`
      : `Hosts ${stadium.matches} matches`;
    const labelCap = currentLanguage === "fa"
      ? `${stadium.capacity.toLocaleString('fa-IR')} نفر`
      : `${stadium.capacity.toLocaleString('en-US')}`;

    html += `
      <div class="glass-card stadium-card">
        <img src="${stadium.image}" alt="${stadium.name}" class="stadium-img">
        <div class="stadium-info">
          <h3>${stadium.name}</h3>
          <p>📍 <strong>${stadium.city}, ${stadium.country}</strong></p>
          <p>👥 ${currentLanguage === "fa" ? 'ظرفیت:' : 'Capacity:'} <strong>${labelCap}</strong></p>
          <p>⚽ ${labelMatches}</p>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
};

// --- Trivia Quiz Page ---
const initQuizPage = () => {
  triviaState.currentQuestionIndex = 0;
  triviaState.score = 0;
  triviaState.answered = false;
  renderTriviaQuestion();
};

const renderTriviaQuestion = () => {
  const container = document.getElementById("quiz-container-box");
  if (!container) return;

  const idx = triviaState.currentQuestionIndex;
  const questions = window.triviaQuestions;
  const dict = window.translations[currentLanguage];

  if (idx >= questions.length) {
    // Show final score
    const congrats = currentLanguage === "fa" 
      ? `تبریک! شما به تمام سوالات پاسخ دادید.`
      : `Congratulations! You answered all questions.`;

    container.innerHTML = `
      <div class="glass-card quiz-box" style="padding:3rem;">
        <h2 style="font-size:2.5rem; color:var(--glow); margin-bottom:1.5rem;">🎮 Finished! / پایان</h2>
        <p style="font-size:1.2rem; margin-bottom: 2rem;">${congrats}</p>
        <div class="quiz-score-indicator" style="font-size: 2.2rem; margin-bottom:2rem;">
          ${dict.score}: ${triviaState.score} / ${questions.length}
        </div>
        <button class="action-btn" onclick="window.restartQuiz()">${dict.restartQuiz}</button>
      </div>
    `;
    return;
  }

  const q = questions[idx];
  const questionText = currentLanguage === "fa" ? q.qFa : q.qEn;
  const options = currentLanguage === "fa" ? q.optionsFa : q.optionsEn;

  let optionsHtml = "";
  options.forEach((opt, optIdx) => {
    optionsHtml += `
      <button class="quiz-opt-btn" id="quiz-opt-${optIdx}" onclick="window.answerQuiz(${optIdx})">${opt}</button>
    `;
  });

  const nextBtnLabel = dict.nextQuestion;

  container.innerHTML = `
    <div class="glass-card quiz-box">
      <div style="font-weight:600; color:var(--text-muted); margin-bottom:1rem;">
        Question / سوال ${idx + 1} از ${questions.length}
      </div>
      <div class="quiz-question">${questionText}</div>
      <div class="quiz-options">
        ${optionsHtml}
      </div>
      
      <div id="quiz-feedback-box" style="min-height: 40px; margin-bottom:1.5rem; font-weight:700; font-size:1.1rem;"></div>

      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div class="quiz-score-indicator">${dict.score}: ${triviaState.score}</div>
        <button id="quiz-next-btn" class="action-btn" style="display:none;" onclick="window.nextQuizQuestion()">${nextBtnLabel}</button>
      </div>
    </div>
  `;
};

window.answerQuiz = (selectedIdx) => {
  if (triviaState.answered) return;

  triviaState.answered = true;
  const q = window.triviaQuestions[triviaState.currentQuestionIndex];
  const correct = q.correctIndex;
  const dict = window.translations[currentLanguage];

  const selectedBtn = document.getElementById(`quiz-opt-${selectedIdx}`);
  const correctBtn = document.getElementById(`quiz-opt-${correct}`);
  const feedbackEl = document.getElementById("quiz-feedback-box");

  if (selectedIdx === correct) {
    triviaState.score += 1;
    selectedBtn.classList.add("correct-opt");
    feedbackEl.textContent = dict.correct;
    feedbackEl.style.color = "var(--glow)";
  } else {
    selectedBtn.classList.add("wrong-opt");
    correctBtn.classList.add("correct-opt");
    feedbackEl.textContent = dict.wrong;
    feedbackEl.style.color = "#ff3860";
  }

  // Show next button
  document.getElementById("quiz-next-btn").style.display = "block";
};

window.nextQuizQuestion = () => {
  triviaState.currentQuestionIndex += 1;
  triviaState.answered = false;
  renderTriviaQuestion();
};

window.restartQuiz = () => {
  initQuizPage();
};

// --- Dynamic Print Trigger ---
window.triggerPrint = () => {
  window.print();
};
