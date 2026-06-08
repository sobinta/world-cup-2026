# FIFA World Cup 2026 Interactive Website Walkthrough

This project is a highly premium, interactive, and visually stunning web application for the FIFA World Cup 2026. All files are located at [F:\Antigraviti\Gemini](file:///F:/Antigraviti/Gemini).

---

## 📂 Project Structure

All files have been cleanly modularized and built using Vanilla HTML5, CSS3, and ES6 JavaScript:

1. **[index.html](file:///F:/Antigraviti/Gemini/index.html)**: Main HTML structure, layout grids, sidebar navigation, view panels, countdown clock container, trivia box, dynamic modals, and script references.
2. **[styles.css](file:///F:/Antigraviti/Gemini/styles.css)**: Implements visual aesthetics: glassmorphism panels, multiple themes (Emerald Turf, Cyber Neon, Golden Trophy), micro-animations, glowing effects, fully responsive styles, and print-ready stylesheets (`@media print`).
3. **[data.js](file:///F:/Antigraviti/Gemini/data.js)**: Holds the complete dataset for the 48 teams divided into Groups A-L, stadium cities/capacities, trivia questions, translation strings for English and Persian, and a programmatic round-robin fixture generator (72 matches).
4. **[prediction.js](file:///F:/Antigraviti/Gemini/prediction.js)**: Manages prediction data, updates, persistence in `localStorage`, standing calculations (Points, Goal Difference, Goals Scored), and automatic realistic group stage simulation.
5. **[bracket.js](file:///F:/Antigraviti/Gemini/bracket.js)**: Generates the 32-team tournament knockout bracket (from Round of 32 down to the Final). Seeding propagates dynamically from predicted group standings. It also implements an intuitive click-to-advance system and drag-to-scroll viewport.
6. **[live-sim.js](file:///F:/Antigraviti/Gemini/live-sim.js)**: Runs the simulated live match engine. Speeds up time (1 game minute = 400ms) and fires goals, cards, and fouls with real-time UI logs and glowing alert banners.
7. **[app.js](file:///F:/F:/Antigraviti/Gemini/app.js)**: Coordinates views (tabs routing), translation engine (Language toggler), countdown clock, Head-to-Head Compare screen, and the trivia quiz state.

---

## 🎨 Visual Features & Theme Options
- **Bilingual Interface**: Toggles instantly between **Persian (RTL)** and **English (LTR)**, re-translating team profiles, standings headers, schedules, and menus.
- **Glassmorphism Design**: High-fidelity glass panels using `backdrop-filter: blur(10px)` combined with subtle drop-shadows and glowing green borders.
- **Theme presets**:
  - **Emerald Turf**: Classic deep green stadium grass feel.
  - **Cyber Neon**: Sleek, futuristic tech theme with hot pink and cyan glow.
  - **Golden Trophy**: Luxurious championship atmosphere in black, charcoal, and bright gold.
  - **Light Mint**: Crisp, clean light green palette representing a fresh mint stadium field.
  - **Light Cream**: Elegant warm cream and soft beige aesthetic with semi-transparent white glass.
- **Micro-Animations**: Hover animations on navigation buttons, match cards, and quiz options, plus pulse indicators for live activities.

---

## 🎯 Functional Modules

### 1. Dashboard & Countdown
- Shows live countdown to World Cup 2026 kickoff (June 11, 2026).
- Displays tournament statistics (48 teams, 12 groups, 104 matches, 16 cities).
- Visual progress bar showing prediction completeness.

### 2. Group Standings & Matches
- Display of 12 groups. Click on a group card to expand a detailed modal showing current standings and matches.
- Click on any team row to inspect the **Team Profile modal**: coach, star player name, and FIFA ranking.

### 3. Prediction Center
- Predict scores of all 72 group stage matches.
- Stands recalculate in real-time as you enter goals.
- "Simulate All" instantly generates realistic predictions for all groups.
- "Reset All" clears all user data.
- Persisted locally via `localStorage` so results stay saved on refresh.

### 4. Interactive Bracket (Knockout Stage)
- 32 teams seeded dynamically based on group predictions (top 2 from each group + 8 best 3rd placed teams ranked by Points, GD, and GF).
- Click on any team in a bracket matchup to advance them to the next round, propagating all the way to the Final, displaying a custom Champion Card with team details and flags.
- Scrollable/draggable bracket layout to easily inspect matchups.

### 5. Live Score Simulator
- Selects a match from predictions and simulations the game in "fast-forward" mode.
- Populates a match ticker with minute-by-minute text events (Kickoff, fouls, corner kicks, cards, goals).
- Displays animated goal alert banners ("GOAL!!!") and automatically writes final results back into predictions on completion.

### 6. Team comparison (Head-to-Head)
- Select any two teams from dropdowns to see side-by-side comparative profiles.

### 7. Stadium Guide & Trivia Quiz
- Interactive card gallery showing all 16 stadiums with images, cities, capacities, and number of matches hosted.
- Gamified trivia quiz with multiple-choice questions, live scoring, and instant correct/incorrect visual feedback.

### 8. Print Feature
- Prints a clean, ink-friendly prediction report including match schedules, standings, and the bracket tree, hiding layout elements (sidebars, simulation feeds, buttons).

---

## 🚀 How to Run Locally

You can launch the web application by opening the [index.html](file:///F:/Antigraviti/Gemini/index.html) file directly in any modern web browser (Chrome, Edge, Firefox).

Alternatively, you can run a local development server to preview it:
1. Open PowerShell or Terminal.
2. Run python's built-in server in the project directory:
   ```powershell
   cd F:\Antigraviti\Gemini
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your browser.
