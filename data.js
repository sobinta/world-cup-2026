// FIFA World Cup 2026 - Dataset and Configurations

const teamsData = {
  // Group A
  "Mexico": { code: "mx", nameFa: "مکزیک", ranking: 15, coach: "Jaime Lozano", star: "Santiago Giménez", group: "A" },
  "South Africa": { code: "za", nameFa: "آفریقای جنوبی", ranking: 59, coach: "Hugo Broos", star: "Percy Tau", group: "A" },
  "South Korea": { code: "kr", nameFa: "کره جنوبی", ranking: 22, coach: "Hong Myung-bo", star: "Son Heung-min", group: "A" },
  "Czechia": { code: "cz", nameFa: "جمهوری چک", ranking: 36, coach: "Ivan Hašek", star: "Patrik Schick", group: "A" },

  // Group B
  "Canada": { code: "ca", nameFa: "کانادا", ranking: 49, coach: "Jesse Marsch", star: "Alphonso Davies", group: "B" },
  "Italy": { code: "it", nameFa: "ایتالیا", ranking: 9, coach: "Luciano Spalletti", star: "Nicolò Barella", group: "B" },
  "Qatar": { code: "qa", nameFa: "قطر", ranking: 34, coach: "Tintín Márquez", star: "Akram Afif", group: "B" },
  "Switzerland": { code: "ch", nameFa: "سوئیس", ranking: 19, coach: "Murat Yakin", star: "Granit Xhaka", group: "B" },

  // Group C
  "Brazil": { code: "br", nameFa: "برزیل", ranking: 5, coach: "Dorival Júnior", star: "Vinícius Júnior", group: "C" },
  "Morocco": { code: "ma", nameFa: "مراکش", ranking: 12, coach: "Walid Regragui", star: "Achraf Hakimi", group: "C" },
  "Haiti": { code: "ht", nameFa: "هائیتی", ranking: 86, coach: "Sébastien Migné", star: "Duckens Nazon", group: "C" },
  "Scotland": { code: "gb-sct", nameFa: "اسکاتلند", ranking: 39, coach: "Steve Clarke", star: "Andrew Robertson", group: "C" },

  // Group D
  "United States": { code: "us", nameFa: "ایالات متحده", ranking: 11, coach: "Mauricio Pochettino", star: "Christian Pulisic", group: "D" },
  "Paraguay": { code: "py", nameFa: "پاراگوئه", ranking: 56, coach: "Gustavo Alfaro", star: "Julio Enciso", group: "D" },
  "Australia": { code: "au", nameFa: "استرالیا", ranking: 23, coach: "Tony Popovic", star: "Harry Souttar", group: "D" },
  "Türkiye": { code: "tr", nameFa: "ترکیه", ranking: 26, coach: "Vincenzo Montella", star: "Hakan Çalhanoğlu", group: "D" },

  // Group E
  "Germany": { code: "de", nameFa: "آلمان", ranking: 16, coach: "Julian Nagelsmann", star: "Jamal Musiala", group: "E" },
  "Curaçao": { code: "cw", nameFa: "کوراسائو", ranking: 90, coach: "Dick Advocaat", star: "Juninho Bacuna", group: "E" },
  "Côte d'Ivoire": { code: "ci", nameFa: "ساحل عاج", ranking: 38, coach: "Emerse Faé", star: "Simon Adingra", group: "E" },
  "Ecuador": { code: "ec", nameFa: "اکوادور", ranking: 30, coach: "Sebastián Beccacece", star: "Piero Hincapié", group: "E" },

  // Group F
  "Netherlands": { code: "nl", nameFa: "هلند", ranking: 7, coach: "Ronald Koeman", star: "Virgil van Dijk", group: "F" },
  "Japan": { code: "jp", nameFa: "ژاپن", ranking: 18, coach: "Hajime Moriyasu", star: "Kaoru Mitoma", group: "F" },
  "Sweden": { code: "se", nameFa: "سوئد", ranking: 28, coach: "Jon Dahl Tomasson", star: "Viktor Gyökeres", group: "F" },
  "Tunisia": { code: "tn", nameFa: "تونس", ranking: 41, coach: "Faouzi Benzarti", star: "Ellyes Skhiri", group: "F" },

  // Group G
  "Belgium": { code: "be", nameFa: "بلژیک", ranking: 3, coach: "Domenico Tedesco", star: "Kevin De Bruyne", group: "G" },
  "Egypt": { code: "eg", nameFa: "مصر", ranking: 37, coach: "Hossam Hassan", star: "Mohamed Salah", group: "G" },
  "IR Iran": { code: "ir", nameFa: "ایران", ranking: 20, coach: "Amir Ghalenoei", star: "Mehdi Taremi", group: "G" },
  "New Zealand": { code: "nz", nameFa: "نیوزیلند", ranking: 104, coach: "Darren Bazeley", star: "Chris Wood", group: "G" },

  // Group H
  "Spain": { code: "es", nameFa: "اسپانیا", ranking: 8, coach: "Luis de la Fuente", star: "Lamine Yamal", group: "H" },
  "Cabo Verde": { code: "cv", nameFa: "کیپ ورد", ranking: 65, coach: "Bubista", star: "Ryan Mendes", group: "H" },
  "Saudi Arabia": { code: "sa", nameFa: "عربستان سعودی", ranking: 53, coach: "Roberto Mancini", star: "Salem Al-Dawsari", group: "H" },
  "Uruguay": { code: "uy", nameFa: "اروگوئه", ranking: 11, coach: "Marcelo Bielsa", star: "Federico Valverde", group: "H" },

  // Group I
  "France": { code: "fr", nameFa: "فرانسه", ranking: 2, coach: "Didier Deschamps", star: "Kylian Mbappé", group: "I" },
  "Senegal": { code: "sn", nameFa: "سنگال", ranking: 21, coach: "Aliou Cissé", star: "Sadio Mané", group: "I" },
  "Iraq": { code: "iq", nameFa: "عراق", ranking: 58, coach: "Jesús Casas", star: "Aymen Hussein", group: "I" },
  "Norway": { code: "no", nameFa: "نروژ", ranking: 47, coach: "Ståle Solbakken", star: "Erling Haaland", group: "I" },

  // Group J
  "Argentina": { code: "ar", nameFa: "آرژانتین", ranking: 1, coach: "Lionel Scaloni", star: "Lionel Messi", group: "J" },
  "Algeria": { code: "dz", nameFa: "الجزایر", ranking: 44, coach: "Vladimir Petković", star: "Riyad Mahrez", group: "J" },
  "Austria": { code: "at", nameFa: "اتریش", ranking: 25, coach: "Ralf Rangnick", star: "David Alaba", group: "J" },
  "Jordan": { code: "jo", nameFa: "اردن", ranking: 71, coach: "Jamal Sellami", star: "Musa Al-Taamari", group: "J" },

  // Group K
  "Portugal": { code: "pt", nameFa: "پرتغال", ranking: 6, coach: "Roberto Martínez", star: "Cristiano Ronaldo", group: "K" },
  "DR Congo": { code: "cd", nameFa: "جمهوری دموکراتیک کنگو", ranking: 62, coach: "Sébastien Desabre", star: "Chancel Mbemba", group: "K" },
  "Uzbekistan": { code: "uz", nameFa: "ازبکستان", ranking: 64, coach: "Srečko Katanec", star: "Eldor Shomurodov", group: "K" },
  "Colombia": { code: "co", nameFa: "کلمبیا", ranking: 12, coach: "Néstor Lorenzo", star: "Luis Díaz", group: "K" },

  // Group L
  "England": { code: "gb-eng", nameFa: "انگلستان", ranking: 4, coach: "Thomas Tuchel", star: "Jude Bellingham", group: "L" },
  "Croatia": { code: "hr", nameFa: "کرواسی", ranking: 10, coach: "Zlatko Dalić", star: "Luka Modrić", group: "L" },
  "Ghana": { code: "gh", nameFa: "غنا", ranking: 68, coach: "Otto Addo", star: "Mohammed Kudus", group: "L" },
  "Panama": { code: "pa", nameFa: "پاناما", ranking: 35, coach: "Thomas Christiansen", star: "Adalberto Carrasquilla", group: "L" }
};

const groupsList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

// 16 Stadiums for FIFA World Cup 2026
const stadiumsData = [
  { name: "Azteca Stadium", city: "Mexico City", country: "Mexico", capacity: 87523, matches: 5, image: "images/stadiums/azteca.jpg" },
  { name: "MetLife Stadium", city: "East Rutherford", country: "USA", capacity: 82500, matches: 8, image: "images/stadiums/metlife.jpg" },
  { name: "AT&T Stadium", city: "Arlington", country: "USA", capacity: 80000, matches: 9, image: "images/stadiums/att.jpg" },
  { name: "Arrowhead Stadium", city: "Kansas City", country: "USA", capacity: 76416, matches: 6, image: "images/stadiums/arrowhead.jpg" },
  { name: "NRG Stadium", city: "Houston", country: "USA", capacity: 72220, matches: 7, image: "images/stadiums/nrg.jpg" },
  { name: "Mercedes-Benz Stadium", city: "Atlanta", country: "USA", capacity: 71000, matches: 8, image: "images/stadiums/mercedes_benz.jpg" },
  { name: "SoFi Stadium", city: "Inglewood", country: "USA", capacity: 70240, matches: 8, image: "images/stadiums/sofi.jpg" },
  { name: "Lincoln Financial Field", city: "Philadelphia", country: "USA", capacity: 69796, matches: 6, image: "images/stadiums/lincoln_financial.jpg" },
  { name: "Lumen Field", city: "Seattle", country: "USA", capacity: 69000, matches: 6, image: "images/stadiums/lumen.jpg" },
  { name: "Levi's Stadium", city: "Santa Clara", country: "USA", capacity: 68500, matches: 6, image: "images/stadiums/levis.jpg" },
  { name: "Gillette Stadium", city: "Foxborough", country: "USA", capacity: 65878, matches: 7, image: "images/stadiums/gillette.jpg" },
  { name: "Hard Rock Stadium", city: "Miami Gardens", country: "USA", capacity: 64767, matches: 7, image: "images/stadiums/hard_rock.jpg" },
  { name: "BC Place", city: "Vancouver", country: "Canada", capacity: 54500, matches: 7, image: "images/stadiums/bc_place.jpg" },
  { name: "BBVA Stadium", city: "Guadalupe", country: "Mexico", capacity: 53500, matches: 4, image: "images/stadiums/bbva.jpg" },
  { name: "Akron Stadium", city: "Zapopan", country: "Mexico", capacity: 48071, matches: 4, image: "images/stadiums/akron.jpg" },
  { name: "BMO Field", city: "Toronto", country: "Canada", capacity: 45736, matches: 6, image: "images/stadiums/bmo_field.jpg" }
];

// World Cup Trivia Questions
const triviaQuestions = [
  {
    qFa: "کدام کشور با ۵ قهرمانی موفق‌ترین تیم در تاریخ جام جهانی فوتبال است؟",
    qEn: "Which country is the most successful team in FIFA World Cup history with 5 titles?",
    optionsFa: ["آلمان", "ایتالیا", "برزیل", "آرژانتین"],
    optionsEn: ["Germany", "Italy", "Brazil", "Argentina"],
    correctIndex: 2
  },
  {
    qFa: "آقای گل تاریخ ادوار جام جهانی با ۱۶ گل کیست؟",
    qEn: "Who is the all-time top scorer in FIFA World Cup history with 16 goals?",
    optionsFa: ["رونالدو نازاریو", "میروسلاو کلوزه", "پله", "لیونل مسی"],
    optionsEn: ["Ronaldo Nazario", "Miroslav Klose", "Pelé", "Lionel Messi"],
    correctIndex: 1
  },
  {
    qFa: "جام جهانی ۲۰۲۶ به طور مشترک در کدام کشورها برگزار می‌شود؟",
    qEn: "Which countries are jointly hosting the FIFA World Cup 2026?",
    optionsFa: ["آمریکا، کانادا، مکزیک", "آلمان، فرانسه، اسپانیا", "قطر، عربستان، امارات", "برزیل، آرژانتین، اروگوئه"],
    optionsEn: ["USA, Canada, Mexico", "Germany, France, Spain", "Qatar, Saudi Arabia, UAE", "Brazil, Argentina, Uruguay"],
    correctIndex: 0
  },
  {
    qFa: "کدام بازیکن جوان‌ترین گلزن تاریخ فینال‌های جام جهانی است؟",
    qEn: "Who is the youngest goalscorer in a World Cup Final?",
    optionsFa: ["کیلیان امباپه", "پله", "مسی", "دیگو مارادونا"],
    optionsEn: ["Kylian Mbappé", "Pelé", "Lionel Messi", "Diego Maradona"],
    correctIndex: 1
  },
  {
    qFa: "اولین دوره جام جهانی فوتبال در سال ۱۹۳۰ در کدام کشور برگزار شد؟",
    qEn: "In which country was the first FIFA World Cup held in 1930?",
    optionsFa: ["برزیل", "اروگوئه", "ایتالیا", "انگلستان"],
    optionsEn: ["Brazil", "Uruguay", "Italy", "England"],
    correctIndex: 1
  }
];

// Translations dictionary
const translations = {
  en: {
    title: "WORLD CUP 2026",
    subtitle: "Tournament Center & Predictor",
    navDashboard: "Dashboard",
    navGroups: "Groups & Standings",
    navPredictions: "Prediction Center",
    navBracket: "Knockout Bracket",
    navCompare: "Team Compare",
    navStadiums: "Host Stadiums",
    navQuiz: "Trivia Quiz",
    daysToGo: "Days to Kickoff",
    hoursToGo: "Hours",
    minsToGo: "Minutes",
    secsToGo: "Seconds",
    countdownTitle: "FIFA World Cup 2026 Countdown",
    langSwitch: "فارسی",
    quickStats: "Quick Tournament Stats",
    teamsCount: "48 Teams",
    groupsCount: "12 Groups",
    matchesCount: "104 Matches",
    venuesCount: "16 Cities",
    predictionProgress: "Your Prediction Progress",
    predictedMatches: "Matches Predicted",
    simulateAll: "Simulate All Groups",
    resetAll: "Reset Predictions",
    groupDetails: "Group Details",
    matches: "Matches",
    table: "Table",
    pos: "Pos",
    team: "Team",
    played: "P",
    won: "W",
    drawn: "D",
    lost: "L",
    gf: "GF",
    ga: "GA",
    gd: "GD",
    pts: "Pts",
    teamInfo: "Team Profile",
    ranking: "FIFA Ranking",
    coach: "Head Coach",
    starPlayer: "Star Player",
    close: "Close",
    vs: "VS",
    saveSuccess: "Predictions saved successfully!",
    predictionsReset: "Predictions reset to default.",
    bracketTitle: "Knockout Stage Bracket",
    bracketSubtitle: "Click on a team to advance them to the next round!",
    champion: "CHAMPION",
    headToHead: "Head-to-Head Comparison",
    selectTeam1: "Select Team A",
    selectTeam2: "Select Team B",
    compareBtn: "Compare Teams",
    chooseTeamsWarning: "Please select two different teams to compare.",
    triviaTitle: "World Cup Trivia Arena",
    triviaSubtitle: "Test your football knowledge!",
    score: "Score",
    nextQuestion: "Next Question",
    restartQuiz: "Restart Quiz",
    correct: "Correct!",
    wrong: "Incorrect!",
    liveSim: "Live Match Simulator",
    liveSimBtn: "Start Live Simulation",
    liveSimStopBtn: "Stop Simulation",
    activeLiveMatch: "Simulated Live Match",
    liveTicker: "Match Events Feed",
    goalAlert: "GOAL!!!",
    printBtn: "Print Predictions Report",
    printTitle: "My FIFA World Cup 2026 Prediction Sheet",
    themeLabel: "Theme:",
    themeEmerald: "Emerald Turf",
    themeCyber: "Cyber Neon",
    themeGold: "Golden Trophy",
    themeLightMint: "Light Mint",
    themeLightCream: "Light Cream",
    quickPredictInfo: "Fill group results to automatically seed the Bracket, or click directly on the bracket matches to advance teams manually!",
    standingsOfficial: "Official Standings",
    standingsPrediction: "Predicted Standings",
    adminModeBtn: "Record Final Results (Admin)",
    adminModeActiveText: "Admin Mode: Active",
    bracketPredicted: "Predicted Bracket",
    bracketOfficial: "Official Bracket"
  },
  fa: {
    title: "جام جهانی ۲۰۲۶",
    subtitle: "مرکز مسابقات و پیش‌بینی پویا",
    navDashboard: "داشبورد",
    navGroups: "گروه‌ها و جدول رده‌بندی",
    navPredictions: "مرکز پیش‌بینی",
    navBracket: "نمودار شاخه‌ای (حذفی)",
    navCompare: "مقایسه تیم‌ها",
    navStadiums: "ورزشگاه‌های میزبان",
    navQuiz: "مسابقه اطلاعات عمومی",
    daysToGo: "روز تا افتتاحیه",
    hoursToGo: "ساعت",
    minsToGo: "دقیقه",
    secsToGo: "ثانیه",
    countdownTitle: "شمارش معکوس تا آغاز جام جهانی ۲۰۲۶",
    langSwitch: "English",
    quickStats: "آمار کلی تورنمنت",
    teamsCount: "۴۸ تیم",
    groupsCount: "۱۲ گروه",
    matchesCount: "۱۰۴ بازی",
    venuesCount: "۱۶ شهر میزبان",
    predictionProgress: "پیشرفت پیش‌بینی‌های شما",
    predictedMatches: "بازی‌های پیش‌بینی شده",
    simulateAll: "شبیه‌سازی خودکار نتایج",
    resetAll: "پاکسازی پیش‌بینی‌ها",
    groupDetails: "جزئیات گروه",
    matches: "بازی‌ها",
    table: "جدول",
    pos: "رتبه",
    team: "تیم",
    played: "بازی",
    won: "برد",
    drawn: "مساوی",
    lost: "باخت",
    gf: "زده",
    ga: "خورده",
    gd: "تفاضل",
    pts: "امتیاز",
    teamInfo: "پروفایل تیم",
    ranking: "رتبه فیفا",
    coach: "سرمربی",
    starPlayer: "ستاره تیم",
    close: "بستن",
    vs: "در مقابل",
    saveSuccess: "پیش‌بینی‌ها با موفقیت ذخیره شدند!",
    predictionsReset: "پیش‌بینی‌ها به حالت اولیه بازگردانده شدند.",
    bracketTitle: "نمودار حذفی مسابقات",
    bracketSubtitle: "روی تیم مورد نظر خود کلیک کنید تا به مرحله بعدی صعود کند!",
    champion: "جام قهرمانی",
    headToHead: "مقایسه رودرروی تیم‌ها",
    selectTeam1: "انتخاب تیم اول",
    selectTeam2: "انتخاب تیم دوم",
    compareBtn: "مقایسه کن",
    chooseTeamsWarning: "لطفاً دو تیم متفاوت را برای مقایسه انتخاب کنید.",
    triviaTitle: "عرصه اطلاعات فوتبالی",
    triviaSubtitle: "دانش فوتبالی خود را به چالش بکشید!",
    score: "امتیاز شما",
    nextQuestion: "سوال بعدی",
    restartQuiz: "شروع مجدد مسابقه",
    correct: "پاسخ صحیح!",
    wrong: "پاسخ اشتباه!",
    liveSim: "شبیه‌ساز زنده مسابقات",
    liveSimBtn: "شروع شبیه‌ساز زنده",
    liveSimStopBtn: "توقف شبیه‌ساز",
    activeLiveMatch: "بازی زنده شبیه‌سازی شده",
    liveTicker: "گزارش زنده رویدادهای بازی",
    goalAlert: "گلللللل!!!",
    printBtn: "چاپ برگه پیش‌بینی‌ها",
    printTitle: "برگه پیش‌بینی‌های من برای جام جهانی ۲۰۲۶",
    themeLabel: "پوسته:",
    themeEmerald: "چمن زمردین",
    themeCyber: "نئون سایبری",
    themeGold: "جام طلایی",
    themeLightMint: "نعنایی روشن",
    themeLightCream: "کرمی روشن",
    quickPredictInfo: "نتایج مرحله گروهی را پر کنید تا نمودار حذفی خودکار چیده شود، یا مستقیم روی تیم‌های نمودار حذفی کلیک کنید تا برنده صعود کند!",
    standingsOfficial: "جدول رده‌بندی رسمی",
    standingsPrediction: "جدول پیش‌بینی شما",
    adminModeBtn: "ثبت نتایج نهایی (مدیر)",
    adminModeActiveText: "حالت مدیریت: فعال",
    bracketPredicted: "نمودار پیش‌بینی شما",
    bracketOfficial: "نمودار رسمی مسابقات"
  }
};

// Official match schedule dates for each group in the 2026 FIFA World Cup
const groupMatchDates = {
  "A": ["2026-06-11", "2026-06-12", "2026-06-17", "2026-06-18", "2026-06-24", "2026-06-24"],
  "B": ["2026-06-12", "2026-06-13", "2026-06-18", "2026-06-18", "2026-06-24", "2026-06-24"],
  "C": ["2026-06-13", "2026-06-13", "2026-06-19", "2026-06-19", "2026-06-24", "2026-06-24"],
  "D": ["2026-06-12", "2026-06-13", "2026-06-19", "2026-06-19", "2026-06-24", "2026-06-24"],
  "E": ["2026-06-14", "2026-06-14", "2026-06-20", "2026-06-20", "2026-06-25", "2026-06-25"],
  "F": ["2026-06-14", "2026-06-14", "2026-06-20", "2026-06-20", "2026-06-25", "2026-06-25"],
  "G": ["2026-06-15", "2026-06-15", "2026-06-21", "2026-06-21", "2026-06-25", "2026-06-25"],
  "H": ["2026-06-15", "2026-06-15", "2026-06-21", "2026-06-21", "2026-06-25", "2026-06-25"],
  "I": ["2026-06-16", "2026-06-16", "2026-06-22", "2026-06-22", "2026-06-26", "2026-06-26"],
  "J": ["2026-06-16", "2026-06-16", "2026-06-22", "2026-06-22", "2026-06-26", "2026-06-26"],
  "K": ["2026-06-17", "2026-06-17", "2026-06-23", "2026-06-23", "2026-06-26", "2026-06-26"],
  "L": ["2026-06-17", "2026-06-17", "2026-06-23", "2026-06-23", "2026-06-26", "2026-06-26"]
};

// Generate matches programmatically
const generateGroupFixtures = () => {
  const fixtures = [];
  const groupTeams = {};

  // Group teams by their letter
  Object.keys(teamsData).forEach(teamName => {
    const team = teamsData[teamName];
    if (!groupTeams[team.group]) {
      groupTeams[team.group] = [];
    }
    groupTeams[team.group].push(teamName);
  });

  let matchId = 1;

  groupsList.forEach((groupLetter, groupIndex) => {
    const teams = groupTeams[groupLetter];
    if (!teams || teams.length < 4) return;

    // Standard round robin schedule for 4 teams
    const pairings = [
      { t1: teams[0], t2: teams[1], round: 1 },
      { t1: teams[2], t2: teams[3], round: 1 },
      { t1: teams[0], t2: teams[2], round: 2 },
      { t1: teams[1], t2: teams[3], round: 2 },
      { t1: teams[3], t2: teams[0], round: 3 },
      { t1: teams[1], t2: teams[2], round: 3 }
    ];

    pairings.forEach((pair, pairIndex) => {
      // Get the official match date from our mapping
      const dateStr = groupMatchDates[groupLetter][pairIndex];

      // Assign stadium cyclically
      const stadium = stadiumsData[(matchId - 1) % stadiumsData.length];

      fixtures.push({
        id: `match-${groupLetter}-${pairIndex + 1}`,
        group: groupLetter,
        round: pair.round,
        team1: pair.t1,
        team2: pair.t2,
        score1: null,
        score2: null,
        date: dateStr,
        stadium: stadium.name,
        city: stadium.city
      });
      matchId++;
    });
  });

  return fixtures;
};

const initialFixtures = generateGroupFixtures();

// Expose elements to window so they are globally accessible across files
window.teamsData = teamsData;
window.groupsList = groupsList;
window.stadiumsData = stadiumsData;
window.triviaQuestions = triviaQuestions;
window.translations = translations;
window.initialFixtures = initialFixtures;
