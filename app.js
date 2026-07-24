"use strict";

/* ==========================================================================
   ストレージキー / 初期データ
   ========================================================================== */

const STORAGE_KEYS = {
  scrollState: "myhome:scrollState",
  reasons: "myhome:reasons",
  durations: "myhome:durations",
  selectedApps: "myhome:selectedApps",
  activeCategory: "myhome:activeCategory",
  activeSns: "myhome:activeSns",
  appearance: "myhome:appearance",
  pin: "myhome:pin",
  feedRefreshHours: "myhome:feedRefreshHours",
  dockCollapsed: "myhome:dockCollapsed",
  appLockEnabled: "myhome:appLockEnabled",
  appLockPin: "myhome:appLockPin",
  onboardingComplete: "myhome:onboardingComplete",
  interests: "myhome:interests",
  interestsText: "myhome:interestsText",
  language: "myhome:language",
  focusTimer: "myhome:focusTimer",
  appInsights: "myhome:appInsights",
  scrollOnCount: "myhome:scrollOnCount",
  scrollGestureCount: "myhome:scrollGestureCount",
  scrollOnTimeMs: "myhome:scrollOnTimeMs",
};

const DEFAULT_APPEARANCE = { accent: "#65a30d", bg: "#ffffff", bgImage: null };
const DEFAULT_PIN = "0000";
const DEFAULT_FEED_REFRESH_HOURS = 24;
const DEFAULT_APP_LOCK_PIN = "0000";
const DEFAULT_LANGUAGE = "en";

// 自動判定される「興味のある分野」のカテゴリ一覧（自由記述テキストから読み取る際のタグ）。
const INTEREST_TOPICS = [
  "Technology", "Sports", "Finance", "Entertainment", "Health & Fitness",
  "Travel", "Food", "Science", "Gaming", "Fashion",
];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
  { code: "es", name: "Español" },
  { code: "zh", name: "中文" },
  { code: "ko", name: "한국어" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "pt", name: "Português" },
];

// 興味を自由記述するステップの案内文（選んだ言語で表示する）。
const ONBOARDING_I18N = {
  en: { title: "What are you interested in?", desc: "Write a few sentences about what you like. We'll pick out topics automatically.", placeholder: "e.g. I love watching soccer, and I'm really into new phones and gadgets...", next: "Next" },
  ja: { title: "興味のある分野は何ですか？", desc: "好きなことを自由に書いてください。自動でトピックを読み取ります。", placeholder: "例：サッカー観戦が好きで、最近は新しいスマホやガジェットにも興味があります…", next: "次へ" },
  es: { title: "¿Qué te interesa?", desc: "Escribe algunas frases sobre lo que te gusta. Detectaremos los temas automáticamente.", placeholder: "Ej. Me encanta ver fútbol y también me interesan los nuevos teléfonos y gadgets...", next: "Siguiente" },
  zh: { title: "你对什么感兴趣？", desc: "写几句你喜欢的东西，我们会自动识别相关话题。", placeholder: "例如：我喜欢看足球，也对新手机和数码产品很感兴趣…", next: "下一步" },
  ko: { title: "관심 있는 분야는 무엇인가요?", desc: "좋아하는 것에 대해 몇 문장 적어주세요. 자동으로 주제를 찾아드립니다.", placeholder: "예: 축구 보는 것을 좋아하고, 요즘은 새로운 스마트폰과 가젯에도 관심이 많아요...", next: "다음" },
  fr: { title: "Qu'est-ce qui vous intéresse ?", desc: "Écrivez quelques phrases sur ce que vous aimez. Nous détecterons les sujets automatiquement.", placeholder: "Ex. J'adore regarder le foot, et je m'intéresse aussi aux nouveaux téléphones et gadgets...", next: "Suivant" },
  de: { title: "Wofür interessierst du dich?", desc: "Schreib ein paar Sätze darüber, was du magst. Wir erkennen die Themen automatisch.", placeholder: "z. B. Ich liebe Fußball und interessiere mich auch für neue Handys und Gadgets...", next: "Weiter" },
  pt: { title: "No que você se interessa?", desc: "Escreva algumas frases sobre o que você gosta. Vamos identificar os temas automaticamente.", placeholder: "Ex. Adoro assistir futebol e também me interesso por novos celulares e gadgets...", next: "Próximo" },
};

// 各トピックを自由記述テキストから見つけるためのキーワード辞書（言語ごと）。
// 本物のAI/NLPではなく単純な部分一致によるキーワード検出（クライアント側のみ、
// 外部APIキーを晒さない設計方針に合わせた簡易版）。
const TOPIC_KEYWORDS = {
  "Technology": { en: ["tech", "technology", "gadget", "computer", "software", " ai ", "phone", "app"], ja: ["テクノロジー", "技術", "ガジェット", "パソコン", "スマホ", "アプリ"], es: ["tecnología", "gadget", "computadora", "aplicación"], zh: ["科技", "技术", "电脑", "手机", "应用"], ko: ["기술", "테크", "컴퓨터", "스마트폰", "앱"], fr: ["technologie", "gadget", "ordinateur", "application"], de: ["technologie", "gadget", "computer", "app"], pt: ["tecnologia", "gadget", "computador", "aplicativo"] },
  "Sports": { en: ["sport", "soccer", "football", "basketball", "baseball", "tennis", "running", "gym"], ja: ["スポーツ", "サッカー", "野球", "バスケ", "テニス", "ランニング", "筋トレ"], es: ["deporte", "fútbol", "baloncesto", "tenis", "correr"], zh: ["运动", "足球", "篮球", "网球", "跑步"], ko: ["스포츠", "축구", "야구", "농구", "테니스", "달리기"], fr: ["sport", "football", "basketball", "tennis", "course"], de: ["sport", "fußball", "basketball", "tennis", "laufen"], pt: ["esporte", "futebol", "basquete", "tênis", "corrida"] },
  "Finance": { en: ["finance", "money", "stock", "invest", "economy", "crypto"], ja: ["金融", "お金", "株", "投資", "経済", "仮想通貨"], es: ["finanzas", "dinero", "bolsa", "inversión", "economía"], zh: ["金融", "股票", "投资", "经济"], ko: ["금융", "주식", "투자", "경제"], fr: ["finance", "argent", "bourse", "investir", "économie"], de: ["finanzen", "geld", "aktie", "investieren", "wirtschaft"], pt: ["finanças", "dinheiro", "ações", "investir", "economia"] },
  "Entertainment": { en: ["movie", "music", " tv ", "show", "celebrity", "film"], ja: ["映画", "音楽", "テレビ", "エンタメ", "芸能"], es: ["película", "música", "televisión", "entretenimiento"], zh: ["电影", "音乐", "电视", "娱乐"], ko: ["영화", "음악", "텔레비전", "연예"], fr: ["film", "musique", "télévision", "divertissement"], de: ["film", "musik", "fernsehen", "unterhaltung"], pt: ["filme", "música", "televisão", "entretenimento"] },
  "Health & Fitness": { en: ["health", "fitness", "workout", "diet", "wellness", "yoga"], ja: ["健康", "フィットネス", "ダイエット", "ヨガ"], es: ["salud", "fitness", "ejercicio", "dieta", "yoga"], zh: ["健康", "健身", "锻炼", "瑜伽"], ko: ["건강", "피트니스", "운동", "다이어트", "요가"], fr: ["santé", "fitness", "exercice", "régime", "yoga"], de: ["gesundheit", "fitness", "training", "diät", "yoga"], pt: ["saúde", "fitness", "exercício", "dieta", "ioga"] },
  "Travel": { en: ["travel", "trip", "vacation", "flight", "destination"], ja: ["旅行", "旅", "観光", "出張"], es: ["viaje", "viajar", "vacaciones", "destino"], zh: ["旅行", "旅游", "度假"], ko: ["여행", "휴가", "여행지"], fr: ["voyage", "vacances", "destination"], de: ["reisen", "urlaub", "reise"], pt: ["viagem", "viajar", "férias"] },
  "Food": { en: ["food", "cooking", "recipe", "restaurant", "coffee"], ja: ["料理", "食べ物", "レシピ", "カフェ", "グルメ"], es: ["comida", "cocina", "receta", "restaurante"], zh: ["美食", "做饭", "食谱", "餐厅"], ko: ["음식", "요리", "레시피", "맛집"], fr: ["nourriture", "cuisine", "recette", "restaurant"], de: ["essen", "kochen", "rezept", "restaurant"], pt: ["comida", "cozinha", "receita", "restaurante"] },
  "Science": { en: ["science", "research", "space", "physics", "biology"], ja: ["科学", "研究", "宇宙", "物理", "生物"], es: ["ciencia", "investigación", "espacio", "física"], zh: ["科学", "研究", "太空", "物理"], ko: ["과학", "연구", "우주", "물리"], fr: ["science", "recherche", "espace", "physique"], de: ["wissenschaft", "forschung", "weltraum", "physik"], pt: ["ciência", "pesquisa", "espaço", "física"] },
  "Gaming": { en: ["game", "gaming", "esports", "console"], ja: ["ゲーム", "eスポーツ", "ゲーミング"], es: ["juego", "videojuego", "juegos"], zh: ["游戏", "电竞"], ko: ["게임", "이스포츠"], fr: ["jeu", "jeux vidéo"], de: ["spiel", "videospiel"], pt: ["jogo", "videogame"] },
  "Fashion": { en: ["fashion", "style", "clothes", "outfit"], ja: ["ファッション", "おしゃれ", "コーデ"], es: ["moda", "ropa", "estilo"], zh: ["时尚", "服装", "穿搭"], ko: ["패션", "스타일"], fr: ["mode", "vêtements", "style"], de: ["mode", "kleidung", "stil"], pt: ["moda", "roupas", "estilo"] },
};

function isOnboardingComplete() {
  return loadJSON(STORAGE_KEYS.onboardingComplete, false);
}

function saveOnboardingComplete(value) {
  saveJSON(STORAGE_KEYS.onboardingComplete, value);
}

function saveInterests(interests) {
  saveJSON(STORAGE_KEYS.interests, interests);
}

function saveInterestsText(text) {
  saveJSON(STORAGE_KEYS.interestsText, text);
}

function getLanguage() {
  return loadJSON(STORAGE_KEYS.language, DEFAULT_LANGUAGE);
}

function saveLanguage(code) {
  saveJSON(STORAGE_KEYS.language, code);
}

// 自由記述テキストから、キーワード辞書に部分一致するトピックを拾い出す簡易判定。
// 本物のAI解析ではなく、あくまでクライアント側だけで完結する単純なキーワード検索。
function extractInterestsFromText(text, lang) {
  const lower = ` ${text.toLowerCase()} `;
  return INTEREST_TOPICS.filter((topic) => {
    const keywords = (TOPIC_KEYWORDS[topic] && TOPIC_KEYWORDS[topic][lang]) || TOPIC_KEYWORDS[topic].en;
    return keywords.some((kw) => lower.includes(kw.toLowerCase()));
  });
}

function getPin() {
  return loadJSON(STORAGE_KEYS.pin, DEFAULT_PIN);
}

function savePin(pin) {
  saveJSON(STORAGE_KEYS.pin, pin);
}

function isAppLockEnabled() {
  return loadJSON(STORAGE_KEYS.appLockEnabled, false);
}

function saveAppLockEnabled(enabled) {
  saveJSON(STORAGE_KEYS.appLockEnabled, enabled);
}

function getAppLockPin() {
  return loadJSON(STORAGE_KEYS.appLockPin, DEFAULT_APP_LOCK_PIN);
}

function saveAppLockPin(pin) {
  saveJSON(STORAGE_KEYS.appLockPin, pin);
}

const DEFAULT_APP_LOCK_TITLE = "MyHome Browser is locked";

// App Lockの全画面ロックを、設定のON/OFFに関係なく強制的に表示する。
// フォーカスタイマーが「時間になったらロックする」モードで満了した時などに使う。
function showAppLockScreen(message) {
  const screen = document.getElementById("appLockScreen");
  const titleEl = document.getElementById("appLockTitleText");
  if (titleEl) titleEl.textContent = message || DEFAULT_APP_LOCK_TITLE;
  screen.hidden = false;
  const pinInput = document.getElementById("appLockPinInput");
  if (pinInput) pinInput.focus();
}

// 起動時のロック画面。有効な場合、正しいPINを入力するまで#appLockScreenが
// 画面全体を覆い、下のアプリの操作をブロックする（初期表示自体はindex.html内の
// インラインスクリプトが担当し、外部スクリプト読み込みによるチラつきを防いでいる）。
function initAppLock() {
  const screen = document.getElementById("appLockScreen");
  const pinInput = document.getElementById("appLockPinInput");
  const unlockBtn = document.getElementById("appLockUnlockBtn");
  const error = document.getElementById("appLockError");
  const titleEl = document.getElementById("appLockTitleText");

  function attemptUnlock() {
    if (pinInput.value.trim() === getAppLockPin()) {
      screen.hidden = true;
      error.hidden = true;
      pinInput.value = "";
      if (titleEl) titleEl.textContent = DEFAULT_APP_LOCK_TITLE;
    } else {
      error.hidden = false;
      pinInput.value = "";
      pinInput.focus();
    }
  }

  unlockBtn.addEventListener("click", attemptUnlock);
  pinInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") attemptUnlock();
  });

  if (isAppLockEnabled()) {
    screen.hidden = false;
    pinInput.focus();
  } else {
    screen.hidden = true;
  }

  const enabledInput = document.getElementById("appLockEnabledInput");
  enabledInput.checked = isAppLockEnabled();
  enabledInput.addEventListener("change", () => {
    saveAppLockEnabled(enabledInput.checked);
    showToast(enabledInput.checked ? "App Lock enabled" : "App Lock disabled");
  });

  document.getElementById("saveAppLockPinBtn").addEventListener("click", () => {
    const input = document.getElementById("newAppLockPinInput");
    const value = input.value.trim();
    if (!/^\d{4}$/.test(value)) {
      showToast("PIN must be exactly 4 digits");
      return;
    }
    saveAppLockPin(value);
    input.value = "";
    showToast("App Lock PIN updated");
  });
}

// 初回起動時のセットアップ（言語選択 → 興味のある分野を自由記述 → 使うSNSの選択 → 各SNSへのログイン導線）。
// 一度完了すると#onboardingScreenは二度と表示しない（初期表示自体はindex.html内の
// インラインスクリプトが担当し、外部スクリプト読み込みによるチラつきを防いでいる）。
function initOnboarding() {
  const screen = document.getElementById("onboardingScreen");
  if (isOnboardingComplete()) {
    screen.hidden = true;
    return;
  }
  screen.hidden = false;

  const stepLanguage = document.getElementById("onboardingStepLanguage");
  const stepInterests = document.getElementById("onboardingStepInterests");
  const stepSns = document.getElementById("onboardingStepSns");
  const stepLogin = document.getElementById("onboardingStepLogin");

  let selectedLanguage = DEFAULT_LANGUAGE;

  /* ---- Step 1: language ---- */
  function applyOnboardingLanguage(code) {
    const t = ONBOARDING_I18N[code] || ONBOARDING_I18N[DEFAULT_LANGUAGE];
    document.getElementById("interestsStepTitle").textContent = t.title;
    document.getElementById("interestsStepDesc").textContent = t.desc;
    document.getElementById("interestsTextInput").placeholder = t.placeholder;
    document.getElementById("interestsNextBtn").textContent = t.next;
  }

  const languageList = document.getElementById("onboardingLanguageList");
  languageList.innerHTML = "";
  LANGUAGES.forEach((lang) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "language-option";
    btn.textContent = lang.name;
    btn.addEventListener("click", () => {
      selectedLanguage = lang.code;
      saveLanguage(lang.code);
      applyOnboardingLanguage(lang.code);
      stepLanguage.hidden = true;
      stepInterests.hidden = false;
      document.getElementById("interestsTextInput").focus();
    });
    languageList.appendChild(btn);
  });

  /* ---- Step 2: interests, written freely in the chosen language ---- */
  document.getElementById("interestsNextBtn").addEventListener("click", () => {
    const text = document.getElementById("interestsTextInput").value.trim();
    saveInterestsText(text);
    saveInterests(extractInterestsFromText(text, selectedLanguage));
    stepInterests.hidden = true;
    stepSns.hidden = false;
    renderOnboardingSnsList();
  });

  /* ---- Step 3: which SNS to use ---- */
  document.getElementById("onboardingSnsNextBtn").addEventListener("click", () => {
    const checked = Array.from(
      document.querySelectorAll('#onboardingSnsList input[type="checkbox"]:checked')
    ).map((cb) => cb.value);
    saveJSON(STORAGE_KEYS.selectedApps, checked);
    stepSns.hidden = true;
    stepLogin.hidden = false;
    renderOnboardingLoginList(checked);
  });

  /* ---- Step 4: log in to the chosen SNS ---- */
  document.getElementById("onboardingFinishBtn").addEventListener("click", () => {
    saveOnboardingComplete(true);
    screen.hidden = true;
    renderDock();
    applyDockCollapsed();
    updateFriendsTabVisibility();
    showToast("Setup complete");
  });
}

function renderOnboardingSnsList() {
  const list = document.getElementById("onboardingSnsList");
  const snsCandidates = APP_CANDIDATES.filter((app) => SNS_FEED_PLATFORMS.includes(app.id));
  buildAppCandidateListItems(list, snsCandidates, [], "onboarding-sns");
}

function renderOnboardingLoginList(ids) {
  const list = document.getElementById("onboardingLoginList");
  list.innerHTML = "";

  if (ids.length === 0) {
    const li = document.createElement("li");
    li.className = "onboarding-login-empty";
    li.textContent = "No social media selected. You can add some later from Edit Apps.";
    list.appendChild(li);
    return;
  }

  ids.forEach((id) => {
    const app = APP_CANDIDATES.find((a) => a.id === id);
    if (!app) return;

    const li = document.createElement("li");
    li.className = "onboarding-login-row";

    const iconWrap = document.createElement("span");
    iconWrap.className = "candidate-icon";
    iconWrap.appendChild(buildAppIcon(app));
    li.appendChild(iconWrap);

    const name = document.createElement("span");
    name.className = "onboarding-login-name";
    name.textContent = app.name;
    li.appendChild(name);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-small";
    btn.textContent = "Log in";
    btn.addEventListener("click", () => openApp(app));
    li.appendChild(btn);

    list.appendChild(li);
  });
}

function getFeedRefreshHours() {
  return loadJSON(STORAGE_KEYS.feedRefreshHours, DEFAULT_FEED_REFRESH_HOURS);
}

function saveFeedRefreshHours(hours) {
  saveJSON(STORAGE_KEYS.feedRefreshHours, hours);
}

// フィード更新間隔ごとに変わる「サイクル番号」。この番号が変わるたびに
// サンプル投稿の並び順・相対時刻をローテーションし、新着投稿が来たように見せる。
function currentFeedCycle() {
  const hours = getFeedRefreshHours();
  return Math.floor(Date.now() / (hours * 3600 * 1000));
}

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(array, seed) {
  const rand = mulberry32(seed);
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const RELATIVE_TIME_LABELS = ["Just now", "12 min ago", "45 min ago", "1 hour ago", "3 hours ago", "5 hours ago", "8 hours ago", "Yesterday", "2 days ago", "3 days ago"];

const DEFAULT_REASONS = [
  "Checking the news",
  "Chatting with friends on social media",
  "Looking something up",
  "Taking a break",
];

const DEFAULT_DURATIONS = [
  { label: "5 min", minutes: 5 },
  { label: "10 min", minutes: 10 },
  { label: "30 min", minutes: 30 },
];

// スマホにインストール済みのアプリ一覧はWebページから自動取得できないため、
// あらかじめ用意した候補からユーザーが選ぶ方式にしている。
// scheme: アプリを直接開くURL、web: アプリが無い場合のフォールバック先、
// domain: 本物のアイコン(favicon)をその場で読み込むための参照元ドメイン
// （ロゴ画像ファイル自体は同梱せず、常に公式サイトから直接取得する）。
const APP_CANDIDATES = [
  { id: "instagram", name: "Instagram", initial: "I", scheme: "instagram://app", web: "https://www.instagram.com/", domain: "instagram.com" },
  { id: "x", name: "X", initial: "X", scheme: "twitter://", web: "https://x.com/", domain: "x.com" },
  { id: "facebook", name: "Facebook", initial: "F", scheme: "fb://", web: "https://www.facebook.com/", domain: "facebook.com" },
  { id: "youtube", name: "YouTube", initial: "Y", scheme: "youtube://", web: "https://www.youtube.com/", domain: "youtube.com" },
  { id: "tiktok", name: "TikTok", initial: "T", scheme: "tiktok://", web: "https://www.tiktok.com/", domain: "tiktok.com" },
  { id: "threads", name: "Threads", initial: "T", scheme: "barcelona://", web: "https://www.threads.net/", domain: "threads.net" },
  { id: "netflix", name: "Netflix", initial: "N", scheme: "nflx://", web: "https://www.netflix.com/", domain: "netflix.com" },
  { id: "amazon", name: "Amazon", initial: "A", scheme: "com.amazon.mobile.shopping://", web: "https://www.amazon.co.jp/", domain: "amazon.co.jp" },
  { id: "slack", name: "Slack", initial: "S", scheme: "slack://", web: "https://slack.com/", domain: "slack.com" },
];

// 公式サイトの実物のアイコン(favicon)をその場で取得するためのURL。
// ロゴ画像そのものはこのアプリに一切含めず、毎回サービス側から直接読み込む。
function faviconUrl(domain) {
  return `https://www.google.com/s2/favicons?sz=128&domain=${encodeURIComponent(domain)}`;
}

// アイコン画像を読み込めた場合は本物のfaviconを、読み込めなかった場合(オフライン等)は
// 絵文字にフォールバックする<span>を作る。
function buildAppIcon(app) {
  const wrapper = document.createElement("span");
  wrapper.className = "dock-icon";
  const img = document.createElement("img");
  img.src = faviconUrl(app.domain);
  img.alt = "";
  img.loading = "lazy";
  img.addEventListener("error", () => { wrapper.textContent = app.initial; }, { once: true });
  wrapper.appendChild(img);
  return wrapper;
}

// All of this is sample (mock) data. To hook up a real news/social API,
// replace these arrays with the result of a fetch() call in renderFeeds().
const SAMPLE_FEEDS = {
  interest: [
    { source: "Tech Daily", time: "3 hours ago", title: "New AI chip design cuts power draw in half", body: "Expected to significantly boost inference performance on mobile devices." },
    { source: "Design Weekly", time: "5 hours ago", title: "The 2026 UI trend is 'quiet'", body: "Designs that cut down on information and protect the user's focus are gaining attention." },
    { source: "Sports Now", time: "Yesterday", title: "Local team extends win streak to 4 with comeback victory", body: "A late substitute scored the winning goal." },
  ],
  noninterest: [
    { source: "World Finance", time: "1 hour ago", title: "Emerging market currencies mixed against the dollar", body: "Market watchers are focused on upcoming interest rate moves." },
    { source: "Science Journal", time: "6 hours ago", title: "New deep-sea species found in Pacific trench", body: "Researchers hope it will shed light on adaptation to extreme environments." },
    { source: "Local Gov News", time: "Yesterday", title: "City announces accessibility renovation plan for public facilities", body: "The renovations will be carried out in phases over three years." },
  ],
  top: [
    { source: "Headlines", time: "30 min ago", title: "Today's top stories at a glance", body: "A digest of the biggest topics at home and abroad." },
    { source: "Headlines", time: "2 hours ago", title: "Weather agency issues outlook for next week", body: "Near-average temperatures expected across most regions." },
    { source: "Headlines", time: "4 hours ago", title: "Holiday travel volume at major stations on par with past years", body: "Transit operators are urging travelers to spread out peak times." },
  ],
};

const SAMPLE_FRIEND_POSTS = {
  instagram: [
    { name: "Aria", handle: "@aria", time: "10 min ago", text: "The latte art at the cafe I went to this weekend was adorable" },
    { name: "Kenta", handle: "@kenta_run", time: "1 hour ago", text: "Caught the sunrise on my morning run today, incredible" },
    { name: "Mina", handle: "@mina.k", time: "3 hours ago", text: "Got new sneakers and they're so comfortable~" },
    { name: "Sora", handle: "@sora.travels", time: "4 hours ago", text: "Finally made it to the coast, the water was so clear" },
    { name: "Haruto", handle: "@haruto_cooks", time: "6 hours ago", text: "Tried a new pasta recipe tonight, turned out great" },
    { name: "Yui", handle: "@yui.art", time: "8 hours ago", text: "Finished a new painting, took me all week" },
    { name: "Ren", handle: "@ren_hikes", time: "Yesterday", text: "Made it to the summit right before sunset" },
    { name: "Nanami", handle: "@nanami.reads", time: "Yesterday", text: "Started a new book series, already hooked" },
    { name: "Daiki", handle: "@daiki.fit", time: "2 days ago", text: "Hit a new personal best at the gym today" },
    { name: "Emi", handle: "@emi.plants", time: "2 days ago", text: "My balcony garden is finally blooming" },
  ],
  facebook: [
    { name: "Taro Tanaka", handle: "Taro Tanaka", time: "45 min ago", text: "The reunion date is set! I'll send details in a message." },
    { name: "Hanako Sato", handle: "Hanako Sato", time: "2 hours ago", text: "Just moved. Loving the quiet new neighborhood so far." },
    { name: "Ichiro Suzuki", handle: "Ichiro Suzuki", time: "5 hours ago", text: "Thanks to everyone who came out to the fundraiser this weekend." },
    { name: "Yumi Kobayashi", handle: "Yumi Kobayashi", time: "Yesterday", text: "Celebrated my parents' anniversary, what a lovely evening." },
    { name: "Kenji Watanabe", handle: "Kenji Watanabe", time: "Yesterday", text: "Started a new job today, excited for this next chapter." },
    { name: "Sakura Ito", handle: "Sakura Ito", time: "2 days ago", text: "Our book club is reading something new this month, join us!" },
    { name: "Ryo Yamamoto", handle: "Ryo Yamamoto", time: "3 days ago", text: "Finished renovating the kitchen, finally done." },
    { name: "Aoi Nakamura", handle: "Aoi Nakamura", time: "3 days ago", text: "Had a great time at the community garden cleanup." },
  ],
  x: [
    { name: "Yuto", handle: "@yuto_dev", time: "5 min ago", text: "This library is way too convenient, everyone should be using it" },
    { name: "Rio", handle: "@rio_photo", time: "40 min ago", text: "Today's sky looked like a painting" },
    { name: "Kenji", handle: "@kenji_biz", time: "3 hours ago", text: "Kicking off a new project soon. Details coming shortly." },
    { name: "Manami", handle: "@manami_writes", time: "5 hours ago", text: "First draft finally done, editing starts tomorrow" },
    { name: "Sota", handle: "@sota_codes", time: "7 hours ago", text: "Refactored the whole module, so much cleaner now" },
    { name: "Hina", handle: "@hina_designs", time: "9 hours ago", text: "New portfolio site is live, feedback welcome" },
    { name: "Riku", handle: "@riku_music", time: "Yesterday", text: "Working on a new track, dropping a preview soon" },
    { name: "Airi", handle: "@airi_studies", time: "Yesterday", text: "Finally passed the exam I've been studying for" },
  ],
  threads: [
    { name: "Miku", handle: "@miku.t", time: "12 min ago", text: "Rewatching an old favorite show tonight, no regrets" },
    { name: "Tatsuya", handle: "@tatsuya.b", time: "1 hour ago", text: "Coffee shop down the street just reopened, worth the wait" },
    { name: "Nozomi", handle: "@nozomi.k", time: "3 hours ago", text: "Finished a 5k this morning, first one in months" },
    { name: "Kaito", handle: "@kaito.m", time: "6 hours ago", text: "Trying to learn guitar again, wish me luck" },
    { name: "Yua", handle: "@yua.h", time: "Yesterday", text: "Repainted my room this weekend, feels brand new" },
    { name: "Shun", handle: "@shun.o", time: "Yesterday", text: "Found a great little bookstore I'd never noticed before" },
    { name: "Rina", handle: "@rina.f", time: "2 days ago", text: "Meal prepped for the whole week, feeling accomplished" },
    { name: "Kota", handle: "@kota.y", time: "2 days ago", text: "Finally fixed the bug that's been bothering me for days" },
  ],
};

const SAMPLE_VIDEO_FEEDS = {
  youtube: [
    { title: "How this new chip design actually works", channel: "TechExplained", views: "312K views", duration: "14:22", url: "https://youtube.example.com/watch?v=1" },
    { title: "A calm morning routine that actually sticks", channel: "DailyNews", views: "88K views", duration: "9:47", url: "https://youtube.example.com/watch?v=2" },
    { title: "I tried every pasta recipe in one week", channel: "HowToHub", views: "540K views", duration: "22:10", url: "https://youtube.example.com/watch?v=3" },
    { title: "Is this the best budget laptop right now?", channel: "ReviewCentral", views: "201K views", duration: "16:05", url: "https://youtube.example.com/watch?v=4" },
    { title: "48 hours exploring the old town", channel: "TravelVibes", views: "1.2M views", duration: "18:33", url: "https://youtube.example.com/watch?v=5" },
    { title: "Five habits that changed how I work", channel: "QuickTips", views: "76K views", duration: "7:58", url: "https://youtube.example.com/watch?v=6" },
    { title: "Building a home garden from scratch", channel: "DailyNews", views: "150K views", duration: "20:14", url: "https://youtube.example.com/watch?v=7" },
    { title: "What nobody tells you about remote work", channel: "TechExplained", views: "95K views", duration: "11:40", url: "https://youtube.example.com/watch?v=8" },
  ],
  tiktok: [
    { title: "This 30 second recipe hack is genius", channel: "@quick.bites", views: "2.1M views", duration: "0:31", url: "https://tiktok.example.com/video/1" },
    { title: "POV: your Monday morning commute", channel: "@dailylife", views: "890K views", duration: "0:18", url: "https://tiktok.example.com/video/2" },
    { title: "Desk setup tour, minimal edition", channel: "@deskgoals", views: "445K views", duration: "0:42", url: "https://tiktok.example.com/video/3" },
    { title: "Try this stretch before bed", channel: "@movewell", views: "1.5M views", duration: "0:25", url: "https://tiktok.example.com/video/4" },
    { title: "Packing for a weekend trip in under a minute", channel: "@travelquick", views: "670K views", duration: "0:55", url: "https://tiktok.example.com/video/5" },
    { title: "The only three chords you need to start", channel: "@learnguitar", views: "320K views", duration: "0:38", url: "https://tiktok.example.com/video/6" },
    { title: "Rating budget kitchen gadgets", channel: "@quick.bites", views: "980K views", duration: "0:47", url: "https://tiktok.example.com/video/7" },
    { title: "A day in the life of a night shift nurse", channel: "@dailylife", views: "1.8M views", duration: "1:02", url: "https://tiktok.example.com/video/8" },
  ],
  interestWatch: [
    { title: "The Last Circuit", channel: "Streaming Original", views: "New", duration: "48m", url: "https://watch.example.com/title/1" },
    { title: "Quiet Design: A Documentary", channel: "Docs Channel", views: "Trending", duration: "1h 12m", url: "https://watch.example.com/title/2" },
    { title: "Match Point: Season 2", channel: "Sports Network", views: "Popular", duration: "42m", url: "https://watch.example.com/title/3" },
    { title: "Chip Wars", channel: "Streaming Original", views: "New", duration: "55m", url: "https://watch.example.com/title/4" },
    { title: "Comeback Season", channel: "Sports Network", views: "Popular", duration: "38m", url: "https://watch.example.com/title/5" },
    { title: "Inside the Lab", channel: "Docs Channel", views: "Trending", duration: "1h 05m", url: "https://watch.example.com/title/6" },
    { title: "Interface", channel: "Streaming Original", views: "New", duration: "51m", url: "https://watch.example.com/title/7" },
    { title: "Weekend League", channel: "Sports Network", views: "Popular", duration: "44m", url: "https://watch.example.com/title/8" },
  ],
  noninterestWatch: [
    { title: "Market Watch: Weekly Roundup", channel: "Finance Network", views: "New", duration: "35m", url: "https://watch.example.com/title/9" },
    { title: "Deep Trench", channel: "Docs Channel", views: "Trending", duration: "58m", url: "https://watch.example.com/title/10" },
    { title: "City Hall", channel: "Streaming Original", views: "New", duration: "46m", url: "https://watch.example.com/title/11" },
    { title: "Currency", channel: "Finance Network", views: "Popular", duration: "40m", url: "https://watch.example.com/title/12" },
    { title: "Beneath the Surface", channel: "Docs Channel", views: "Trending", duration: "1h 02m", url: "https://watch.example.com/title/13" },
    { title: "The Renovation Plan", channel: "Streaming Original", views: "New", duration: "39m", url: "https://watch.example.com/title/14" },
    { title: "Rate Hike", channel: "Finance Network", views: "Popular", duration: "33m", url: "https://watch.example.com/title/15" },
    { title: "Field Notes", channel: "Docs Channel", views: "Trending", duration: "50m", url: "https://watch.example.com/title/16" },
  ],
};

/* ==========================================================================
   ストレージ ヘルパー
   ========================================================================== */

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ==========================================================================
   見た目のカスタマイズ (アクセントカラー / 背景色 / 背景画像)
   ========================================================================== */

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bytes = clean.match(/.{1,2}/g) || ["ff", "ff", "ff"];
  return bytes.map((b) => parseInt(b, 16));
}

function rgbToHex([r, g, b]) {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
}

function mixColor(hex, amount, toward) {
  const [r, g, b] = hexToRgb(hex);
  const [tr, tg, tb] = toward;
  return rgbToHex([r + (tr - r) * amount, g + (tg - g) * amount, b + (tb - b) * amount]);
}

function lighten(hex, amount) { return mixColor(hex, amount, [255, 255, 255]); }
function darken(hex, amount) { return mixColor(hex, amount, [0, 0, 0]); }

function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getAppearance() {
  // loadJSON()'s fallback path returns the DEFAULT_APPEARANCE object itself, not a copy,
  // so this always spreads into a fresh object to avoid mutating that shared default.
  return { ...loadJSON(STORAGE_KEYS.appearance, DEFAULT_APPEARANCE) };
}

function saveAppearance(appearance) {
  try {
    saveJSON(STORAGE_KEYS.appearance, appearance);
    return true;
  } catch (err) {
    showToast("Not enough storage to save that");
    return false;
  }
}

function applyAppearance() {
  const a = getAppearance();
  const root = document.documentElement.style;

  root.setProperty("--accent", a.accent);
  root.setProperty("--accent-strong", darken(a.accent, 0.25));
  root.setProperty("--accent-bright", lighten(a.accent, 0.15));

  root.setProperty("--bg", a.bg);
  const isDark = relativeLuminance(a.bg) < 0.5;
  if (isDark) {
    root.setProperty("--bg-elevated", lighten(a.bg, 0.08));
    root.setProperty("--bg-card", lighten(a.bg, 0.14));
    root.setProperty("--border", lighten(a.bg, 0.28));
    root.setProperty("--text", lighten(a.bg, 0.92));
    root.setProperty("--text-dim", lighten(a.bg, 0.62));
  } else {
    root.setProperty("--bg-elevated", darken(a.bg, 0.03));
    root.setProperty("--bg-card", darken(a.bg, 0.06));
    root.setProperty("--border", darken(a.bg, 0.16));
    root.setProperty("--text", darken(a.bg, 0.88));
    root.setProperty("--text-dim", darken(a.bg, 0.55));
  }

  document.body.style.backgroundImage = a.bgImage ? `url(${a.bgImage})` : "";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = "fixed";

  renderInsightsBar();
}

// アクセントカラーを起点に、棒グラフの区画ごとに見分けやすい濃淡を作る
// （最大10個までのドックアプリを想定した固定の濃淡パターン）。
const INSIGHTS_SHADE_STEPS = [0, -0.3, 0.35, -0.55, 0.15, -0.15, 0.5, -0.4, 0.25, -0.6];

function insightsShade(accent, index) {
  const step = INSIGHTS_SHADE_STEPS[index % INSIGHTS_SHADE_STEPS.length];
  return step >= 0 ? lighten(accent, step) : darken(accent, -step);
}

// 検索バーとカテゴリタブの間に表示する、ドックアプリを開いた回数の内訳を示す
// 薄い横棒グラフ。アクセントカラーの濃淡だけで区画を塗り分ける。
function renderInsightsBar() {
  const wrap = document.getElementById("insightsBarWrap");
  const track = document.getElementById("insightsBarTrack");
  const legend = document.getElementById("insightsBarLegend");
  const scrollLine = document.getElementById("insightsScrollLine");
  if (!wrap || !track || !legend || !scrollLine) return;

  const data = getAppInsights();
  const ids = Object.keys(data).filter((id) => data[id].opens > 0);
  const scrollOnCount = getScrollOnCount();
  const scrollGestureCount = getScrollGestureCount();
  const scrollOnTimeMs = getScrollOnTimeMs();
  const hasScrollData = scrollOnCount > 0 || scrollGestureCount > 0;

  if (ids.length === 0 && !hasScrollData) {
    wrap.hidden = true;
    return;
  }
  wrap.hidden = false;

  if (ids.length === 0) {
    track.hidden = true;
    legend.hidden = true;
  } else {
    track.hidden = false;
    legend.hidden = false;
    track.innerHTML = "";
    legend.innerHTML = "";

    ids.sort((a, b) => data[b].opens - data[a].opens);
    const total = ids.reduce((sum, id) => sum + data[id].opens, 0);
    const accent = getAppearance().accent;

    ids.forEach((id, index) => {
      const app = APP_CANDIDATES.find((a) => a.id === id);
      const name = app ? app.name : id;
      const color = insightsShade(accent, index);
      const pct = (data[id].opens / total) * 100;

      const segment = document.createElement("div");
      segment.className = "insights-bar-segment";
      segment.style.width = `${pct}%`;
      segment.style.background = color;
      track.appendChild(segment);

      const entry = data[id];
      const label = entry.sessionCount > 0
        ? `${name} ${entry.opens} · ${formatInsightDuration(entry.totalTimeMs)}`
        : `${name} ${entry.opens}`;

      const item = document.createElement("div");
      item.className = "insights-bar-legend-item";
      const dot = document.createElement("span");
      dot.className = "insights-bar-legend-dot";
      dot.style.background = color;
      item.appendChild(dot);
      item.appendChild(document.createTextNode(label));
      legend.appendChild(item);
    });
  }

  if (hasScrollData) {
    scrollLine.hidden = false;
    const turnedOnPart = `Scroll turned ON ${scrollOnCount} time${scrollOnCount === 1 ? "" : "s"}`
      + (scrollOnTimeMs > 0 ? ` (${formatInsightDuration(scrollOnTimeMs)})` : "");
    const parts = [turnedOnPart];
    if (scrollGestureCount > 0) parts.push(`scrolled ${scrollGestureCount} time${scrollGestureCount === 1 ? "" : "s"}`);
    scrollLine.textContent = parts.join(" · ");
  } else {
    scrollLine.hidden = true;
  }
}

function resizeImageFile(file, maxDim, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round(height * (maxDim / width));
            width = maxDim;
          } else {
            width = Math.round(width * (maxDim / height));
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Could not read that image"));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error("Could not read that file"));
    reader.readAsDataURL(file);
  });
}

function populateAppearanceInputs() {
  const a = getAppearance();
  document.getElementById("accentColorInput").value = a.accent;
  document.getElementById("bgColorInput").value = a.bg;
}

/* ==========================================================================
   トースト通知
   ========================================================================== */

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2600);
}

/* ==========================================================================
   スクロール ON / OFF 制御
   ========================================================================== */

const ScrollLock = (() => {
  let countdownTimer = null;

  function getState() {
    return loadJSON(STORAGE_KEYS.scrollState, { isOn: false, expiresAt: null, reason: null, durationLabel: null, startedAt: null });
  }

  function setState(state) {
    saveJSON(STORAGE_KEYS.scrollState, state);
  }

  function isInsideAllowedArea(target) {
    return !!(target && target.closest && target.closest(".scrollable-allow"));
  }

  function blockEvent(e) {
    if (isInsideAllowedArea(e.target)) return;
    e.preventDefault();
  }

  function applyLockedDom() {
    document.documentElement.classList.add("scroll-locked");
    document.body.classList.add("scroll-locked");
    document.addEventListener("touchmove", blockEvent, { passive: false });
    document.addEventListener("wheel", blockEvent, { passive: false });
  }

  function applyUnlockedDom() {
    document.documentElement.classList.remove("scroll-locked");
    document.body.classList.remove("scroll-locked");
    document.removeEventListener("touchmove", blockEvent, { passive: false });
    document.removeEventListener("wheel", blockEvent, { passive: false });
  }

  function updateToggleUI(isOn) {
    const btn = document.getElementById("scrollToggleBtn");
    const label = document.getElementById("scrollToggleLabel");
    btn.classList.toggle("is-on", isOn);
    btn.classList.toggle("is-off", !isOn);
    label.textContent = isOn ? "Scroll ON" : "Scroll OFF";
  }

  function updateTimerUI(state) {
    const timerEl = document.getElementById("scrollTimer");
    if (!state.isOn || !state.expiresAt) {
      timerEl.hidden = true;
      return;
    }
    const remainingMs = state.expiresAt - Date.now();
    if (remainingMs <= 0) {
      timerEl.hidden = true;
      return;
    }
    const totalSec = Math.ceil(remainingMs / 1000);
    const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
    const ss = String(totalSec % 60).padStart(2, "0");
    timerEl.hidden = false;
    timerEl.textContent = `${state.reason} · ${mm}:${ss} left`;
  }

  function stopCountdown() {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }

  function tick() {
    const state = getState();
    if (!state.isOn) { stopCountdown(); return; }
    if (Date.now() >= state.expiresAt) {
      turnOff({ silent: false, expired: true });
      return;
    }
    updateTimerUI(state);
  }

  function turnOn(reason, durationLabel, minutes) {
    const expiresAt = Date.now() + minutes * 60 * 1000;
    const state = { isOn: true, expiresAt, reason, durationLabel, startedAt: Date.now() };
    setState(state);
    applyUnlockedDom();
    updateToggleUI(true);
    updateTimerUI(state);
    stopCountdown();
    countdownTimer = setInterval(tick, 1000);
    refreshSearchResultsIfOpen();
    incrementScrollOnCount();
    renderAppInsights();
    renderInsightsBar();
  }

  function turnOff(opts = {}) {
    const prevState = getState();
    if (prevState.isOn && prevState.startedAt) {
      addScrollOnTimeMs(Date.now() - prevState.startedAt);
    }
    setState({ isOn: false, expiresAt: null, reason: null, durationLabel: null, startedAt: null });
    applyLockedDom();
    updateToggleUI(false);
    document.getElementById("scrollTimer").hidden = true;
    stopCountdown();
    if (opts.expired) {
      showToast("Time's up — scroll switched back OFF");
    }
    refreshSearchResultsIfOpen();
    renderAppInsights();
    renderInsightsBar();
  }

  function init() {
    const state = getState();
    if (state.isOn && state.expiresAt && state.expiresAt > Date.now()) {
      applyUnlockedDom();
      updateToggleUI(true);
      updateTimerUI(state);
      countdownTimer = setInterval(tick, 1000);
    } else if (state.isOn) {
      // 前回開いていた時にタイマーが満了していた場合。ONだった時間を記録してから
      // 通常のOFF状態に揃える。
      turnOff({ expired: true });
    } else {
      applyLockedDom();
      updateToggleUI(false);
    }
  }

  return { init, turnOn, turnOff, getState };
})();

/* ==========================================================================
   フォーカスタイマー（スクロールOFFボタンの隣）
   ただのタイマーとしても、満了時にアプリをロックする用途としても使える。
   ========================================================================== */

const FocusTimer = (() => {
  let countdownTimer = null;

  function getState() {
    return loadJSON(STORAGE_KEYS.focusTimer, { expiresAt: null, lockOnExpire: false });
  }

  function setState(state) {
    saveJSON(STORAGE_KEYS.focusTimer, state);
  }

  function formatRemaining(expiresAt) {
    const totalSec = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
    const hh = Math.floor(totalSec / 3600);
    const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const ss = String(totalSec % 60).padStart(2, "0");
    return hh > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
  }

  function updateUI(state) {
    const btn = document.getElementById("focusTimerBtn");
    const setup = document.getElementById("focusTimerSetup");
    const running = document.getElementById("focusTimerRunning");
    const runningText = document.getElementById("focusTimerRunningText");

    if (!state.expiresAt || state.expiresAt <= Date.now()) {
      btn.textContent = "Timer";
      setup.hidden = false;
      running.hidden = true;
      return;
    }

    const remaining = formatRemaining(state.expiresAt);
    btn.textContent = remaining;
    setup.hidden = true;
    running.hidden = false;
    runningText.textContent = state.lockOnExpire
      ? `${remaining} left — the app will lock when this reaches 0:00.`
      : `${remaining} left. This is just a timer; nothing else happens at 0:00.`;
  }

  function stopCountdown() {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }

  function expire(state) {
    setState({ expiresAt: null, lockOnExpire: false });
    stopCountdown();
    updateUI({ expiresAt: null });
    if (state.lockOnExpire) {
      showAppLockScreen("Time's up! MyHome Browser is locked until you unlock it.");
    } else {
      showToast("Timer's up");
    }
  }

  function tick() {
    const state = getState();
    if (!state.expiresAt) {
      stopCountdown();
      return;
    }
    if (Date.now() >= state.expiresAt) {
      expire(state);
      return;
    }
    updateUI(state);
  }

  function start(totalSeconds, lockOnExpire) {
    const expiresAt = Date.now() + totalSeconds * 1000;
    const state = { expiresAt, lockOnExpire };
    setState(state);
    updateUI(state);
    stopCountdown();
    countdownTimer = setInterval(tick, 1000);
  }

  function cancel() {
    setState({ expiresAt: null, lockOnExpire: false });
    stopCountdown();
    updateUI({ expiresAt: null });
    showToast("Timer canceled");
  }

  function init() {
    const state = getState();
    if (state.expiresAt && state.expiresAt > Date.now()) {
      updateUI(state);
      countdownTimer = setInterval(tick, 1000);
    } else if (state.expiresAt) {
      // アプリが閉じている間にタイマーが満了していた場合
      expire(state);
    } else {
      updateUI(state);
    }
  }

  return { init, start, cancel };
})();

/* ==========================================================================
   スクロールON確認モーダル (理由 + 制限時間の選択)
   ========================================================================== */

function getReasons() {
  return loadJSON(STORAGE_KEYS.reasons, DEFAULT_REASONS.slice());
}
function getDurations() {
  return loadJSON(STORAGE_KEYS.durations, DEFAULT_DURATIONS.slice());
}

function populateScrollOnModal() {
  const reasonSelect = document.getElementById("reasonSelect");
  const durationSelect = document.getElementById("durationSelect");

  reasonSelect.innerHTML = "";
  getReasons().forEach((reason) => {
    const opt = document.createElement("option");
    opt.value = reason;
    opt.textContent = reason;
    reasonSelect.appendChild(opt);
  });

  durationSelect.innerHTML = "";
  getDurations().forEach((d) => {
    const opt = document.createElement("option");
    opt.value = String(d.minutes);
    opt.dataset.label = d.label;
    opt.textContent = d.label;
    durationSelect.appendChild(opt);
  });
}

function openScrollOnModal() {
  populateScrollOnModal();
  document.getElementById("scrollPinInput").value = "";
  document.getElementById("scrollOnModal").hidden = false;
}
function closeScrollOnModal() {
  document.getElementById("scrollOnModal").hidden = true;
  document.getElementById("scrollPinInput").value = "";
}

/* ==========================================================================
   設定モーダル (理由 / 制限時間の追加・削除)
   ========================================================================== */

function renderReasonList() {
  const list = document.getElementById("reasonList");
  const reasons = getReasons();
  list.innerHTML = "";
  reasons.forEach((reason, idx) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = reason;
    li.appendChild(span);
    if (reasons.length > 1) {
      const btn = document.createElement("button");
      btn.className = "remove-btn";
      btn.type = "button";
      btn.textContent = "×";
      btn.setAttribute("aria-label", `Remove "${reason}"`);
      btn.addEventListener("click", () => {
        const updated = getReasons();
        updated.splice(idx, 1);
        saveJSON(STORAGE_KEYS.reasons, updated);
        renderReasonList();
      });
      li.appendChild(btn);
    }
    list.appendChild(li);
  });
}

function renderDurationList() {
  const list = document.getElementById("durationList");
  const durations = getDurations();
  list.innerHTML = "";
  durations.forEach((d, idx) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = `${d.label} (${d.minutes} min)`;
    li.appendChild(span);
    if (durations.length > 1) {
      const btn = document.createElement("button");
      btn.className = "remove-btn";
      btn.type = "button";
      btn.textContent = "×";
      btn.setAttribute("aria-label", `Remove "${d.label}"`);
      btn.addEventListener("click", () => {
        const updated = getDurations();
        updated.splice(idx, 1);
        saveJSON(STORAGE_KEYS.durations, updated);
        renderDurationList();
      });
      li.appendChild(btn);
    }
    list.appendChild(li);
  });
}

function openSettingsModal() {
  renderReasonList();
  renderDurationList();
  populateAppearanceInputs();
  document.getElementById("feedRefreshSelect").value = String(getFeedRefreshHours());
  renderAppInsights();
  document.getElementById("settingsModal").hidden = false;
}
function closeSettingsModal() {
  document.getElementById("settingsModal").hidden = true;
}

function formatInsightDuration(ms) {
  const totalSec = Math.round(ms / 1000);
  const mm = Math.floor(totalSec / 60);
  const ss = totalSec % 60;
  return mm > 0 ? `${mm}m ${ss}s` : `${ss}s`;
}

function renderAppInsights() {
  const list = document.getElementById("appInsightsList");
  list.innerHTML = "";

  const scrollCount = getScrollOnCount();
  const gestureCount = getScrollGestureCount();
  const scrollTimeMs = getScrollOnTimeMs();
  if (scrollCount > 0 || gestureCount > 0) {
    const li = document.createElement("li");
    li.className = "insights-row";
    const name = document.createElement("div");
    name.className = "insights-name";
    name.textContent = "Scroll";
    const stats = document.createElement("div");
    stats.className = "insights-stats";
    const turnedOnPart = `Turned ON ${scrollCount} time${scrollCount === 1 ? "" : "s"}`
      + (scrollTimeMs > 0 ? ` (${formatInsightDuration(scrollTimeMs)})` : "");
    const parts = [turnedOnPart];
    if (gestureCount > 0) parts.push(`scrolled ${gestureCount} time${gestureCount === 1 ? "" : "s"}`);
    stats.textContent = parts.join(" · ");
    li.append(name, stats);
    list.appendChild(li);
  }

  const data = getAppInsights();
  const ids = Object.keys(data).filter((id) => data[id].opens > 0 || data[id].canceled > 0);

  if (ids.length === 0) {
    if (scrollCount === 0 && gestureCount === 0) {
      const empty = document.createElement("li");
      empty.className = "insights-empty";
      empty.textContent = "No data yet. Insights appear once you open an app from the dock or turn scroll ON.";
      list.appendChild(empty);
    }
    return;
  }

  ids.sort((a, b) => data[b].opens - data[a].opens);

  ids.forEach((id) => {
    const app = APP_CANDIDATES.find((a) => a.id === id);
    const entry = data[id];
    const avgMs = entry.sessionCount > 0 ? entry.totalTimeMs / entry.sessionCount : 0;

    const li = document.createElement("li");
    li.className = "insights-row";

    const name = document.createElement("div");
    name.className = "insights-name";
    name.textContent = app ? app.name : id;
    li.appendChild(name);

    const stats = document.createElement("div");
    stats.className = "insights-stats";
    const parts = [`Opened ${entry.opens} time${entry.opens === 1 ? "" : "s"}`];
    if (entry.canceled > 0) parts.push(`canceled ${entry.canceled}`);
    if (entry.sessionCount > 0) {
      parts.push(`~${formatInsightDuration(entry.totalTimeMs)} total (avg ${formatInsightDuration(avgMs)})`);
    }
    stats.textContent = parts.join(" · ");
    li.appendChild(stats);

    list.appendChild(li);
  });
}

// トップバー右上の小さな「Tips」ボタン。使い方の要点（何もしなくても投稿が見られる、
// フィードは自動更新される、新しくフォローしたい時はドックのアプリを開く、
// スクロール機能について）をもれなく一箇所にまとめて説明する。
function initTipsPanel() {
  const toggleBtn = document.getElementById("tipsToggleBtn");
  const panel = document.getElementById("tipsPanel");

  function closePanel() {
    panel.hidden = true;
    toggleBtn.setAttribute("aria-expanded", "false");
  }

  function openPanel() {
    panel.hidden = false;
    toggleBtn.setAttribute("aria-expanded", "true");
  }

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (panel.hidden) openPanel(); else closePanel();
  });

  document.getElementById("tipsCloseBtn").addEventListener("click", closePanel);

  document.addEventListener("click", (e) => {
    if (!panel.hidden && !panel.contains(e.target) && e.target !== toggleBtn) closePanel();
  });
}

// スクロールOFFボタンの隣にあるタイマー。ただのタイマーとしても、
// 満了時にアプリをロックして操作できなくする用途としても使える。
function initFocusTimerPanel() {
  const toggleBtn = document.getElementById("focusTimerBtn");
  const panel = document.getElementById("focusTimerPanel");

  function closePanel() {
    panel.hidden = true;
    toggleBtn.setAttribute("aria-expanded", "false");
  }

  function openPanel() {
    panel.hidden = false;
    toggleBtn.setAttribute("aria-expanded", "true");
  }

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (panel.hidden) openPanel(); else closePanel();
  });

  document.addEventListener("click", (e) => {
    if (!panel.hidden && !panel.contains(e.target) && e.target !== toggleBtn) closePanel();
  });

  document.getElementById("focusTimerStartBtn").addEventListener("click", () => {
    const hours = parseInt(document.getElementById("focusTimerHours").value, 10) || 0;
    const minutes = parseInt(document.getElementById("focusTimerMinutes").value, 10) || 0;
    const seconds = parseInt(document.getElementById("focusTimerSeconds").value, 10) || 0;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds < 1) {
      showToast("Set at least 1 second");
      return;
    }
    const lockOnExpire = document.getElementById("focusTimerLockInput").checked;
    FocusTimer.start(totalSeconds, lockOnExpire);
    closePanel();
    const label = [hours && `${hours}h`, minutes && `${minutes}m`, seconds && `${seconds}s`].filter(Boolean).join(" ") || "0s";
    showToast(lockOnExpire ? `Timer started — app locks in ${label}` : `Timer started for ${label}`);
  });

  document.getElementById("focusTimerCancelBtn").addEventListener("click", () => {
    FocusTimer.cancel();
    closePanel();
  });
}

/* ==========================================================================
   カテゴリタブ / SNSタブ
   ========================================================================== */

function initCategoryTabs() {
  const tabs = document.querySelectorAll(".tab");
  const saved = loadJSON(STORAGE_KEYS.activeCategory, "interest");

  function activate(cat) {
    tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.cat === cat));
    document.querySelectorAll(".panel").forEach((p) => {
      p.classList.toggle("is-active", p.dataset.panel === cat);
    });
    saveJSON(STORAGE_KEYS.activeCategory, cat);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activate(tab.dataset.cat));
  });

  activate(saved);
}

// Friendsタブに出せるSNSの一覧。実際に表示するのは、この中で
// 下部のアプリドックにユーザーが選んでいるものだけ（人によって使うSNSは違うため）。
const SNS_FEED_PLATFORMS = ["instagram", "facebook", "x", "youtube", "tiktok", "threads"];

function getVisibleSnsPlatforms() {
  const selected = getSelectedAppIds();
  return SNS_FEED_PLATFORMS.filter((id) => selected.includes(id));
}

function activateSnsTab(sns) {
  document.querySelectorAll(".sns-tab").forEach((t) => t.classList.toggle("is-active", t.dataset.sns === sns));
  document.querySelectorAll(".sns-panel").forEach((p) => {
    p.classList.toggle("is-active", p.dataset.snsPanel === sns);
  });
  saveJSON(STORAGE_KEYS.activeSns, sns);
}

// ドックで選ばれているSNSに応じて、Friendsのタブ・パネルの表示/非表示を切り替える。
// 現在アクティブなタブが非表示になった場合は、表示可能な最初のタブに自動で切り替える。
// 1つも選ばれていない場合は空状態のメッセージを出す。
function updateFriendsTabVisibility() {
  const visible = getVisibleSnsPlatforms();
  const visibleSet = new Set(visible);

  document.querySelectorAll(".sns-tab").forEach((t) => {
    t.hidden = !visibleSet.has(t.dataset.sns);
  });
  document.querySelectorAll(".sns-panel").forEach((p) => {
    p.hidden = !visibleSet.has(p.dataset.snsPanel);
  });

  const tabsNav = document.querySelector(".sns-tabs");
  const emptyState = document.getElementById("friendsEmptyState");
  const hasVisible = visible.length > 0;
  if (tabsNav) tabsNav.hidden = !hasVisible;
  if (emptyState) emptyState.hidden = hasVisible;

  if (!hasVisible) {
    document.querySelectorAll(".sns-tab, .sns-panel").forEach((el) => el.classList.remove("is-active"));
    return;
  }

  const currentlyActive = document.querySelector(".sns-tab.is-active");
  if (!currentlyActive || currentlyActive.hidden) {
    activateSnsTab(visible[0]);
  }
}

function initSnsTabs() {
  const tabs = document.querySelectorAll(".sns-tab");
  const saved = loadJSON(STORAGE_KEYS.activeSns, "instagram");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateSnsTab(tab.dataset.sns));
  });

  activateSnsTab(saved);
  updateFriendsTabVisibility();
}

// Your Interests / Outside Your Bubbleの中にあるRead/Watchサブタブ。
// パネルごとにスコープして切り替え、選択状態はパネルごとに記憶する。
function initReadWatchTabs(panelId) {
  const panel = document.getElementById(panelId);
  const tabs = panel.querySelectorAll(".rw-tab");
  const storageKey = `myhome:rw:${panelId}`;
  const saved = loadJSON(storageKey, "read");

  function activate(rw) {
    tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.rw === rw));
    panel.querySelectorAll(".rw-panel").forEach((p) => {
      p.classList.toggle("is-active", p.dataset.rwPanel === rw);
    });
    saveJSON(storageKey, rw);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activate(tab.dataset.rw));
  });

  activate(saved);
}

/* ==========================================================================
   フィード描画 (サンプルデータ)
   ========================================================================== */

function buildArticleCard(item) {
  const card = document.createElement("div");
  card.className = "search-result-card";
  const meta = document.createElement("div");
  meta.className = "result-url";
  meta.textContent = `${item.source} · ${item.time}`;
  const title = document.createElement("div");
  title.className = "result-title";
  title.textContent = item.title;
  const body = document.createElement("div");
  body.className = "result-snippet";
  body.textContent = item.body;
  card.append(meta, title, body);
  return card;
}

function buildFriendPostCard(post) {
  const card = document.createElement("div");
  card.className = "search-result-card";
  const title = document.createElement("div");
  title.className = "result-title";
  title.textContent = `${post.name} (${post.handle})`;
  const time = document.createElement("div");
  time.className = "result-url";
  time.textContent = post.time;
  const text = document.createElement("div");
  text.className = "result-snippet";
  text.textContent = post.text;
  card.append(title, time, text);
  return card;
}

/* Instagram/Facebookのフォロー中リスト: 検索結果と同じくスクロールOFF中はページ送り、
   ONの間は通常スクロールの一覧になる。X（常時スクロール可）とは別方式。 */
function createPaginatedFeed({ listId, prevId, nextId, pageNumbersId, cardBuilder }) {
  const perPage = 4;
  let items = [];
  let page = 0;

  function render() {
    const list = document.getElementById(listId);
    const pagination = document.getElementById(prevId).closest(".search-pagination");
    const scrollAllowed = ScrollLock.getState().isOn;
    list.classList.toggle("is-scrollable", scrollAllowed);
    list.innerHTML = "";

    if (scrollAllowed) {
      pagination.hidden = true;
      items.forEach((item) => list.appendChild(cardBuilder(item)));
      return;
    }

    pagination.hidden = false;
    const totalPages = Math.max(1, Math.ceil(items.length / perPage));
    if (page >= totalPages) page = totalPages - 1;
    const start = page * perPage;
    items.slice(start, start + perPage).forEach((item) => list.appendChild(cardBuilder(item)));

    document.getElementById(prevId).disabled = page === 0;
    document.getElementById(nextId).disabled = page >= totalPages - 1;

    const pageNumbers = document.getElementById(pageNumbersId);
    pageNumbers.innerHTML = "";
    for (let i = 0; i < totalPages; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "page-number-btn" + (i === page ? " is-active" : "");
      btn.textContent = String(i + 1);
      btn.addEventListener("click", () => {
        page = i;
        render();
      });
      pageNumbers.appendChild(btn);
    }
  }

  document.getElementById(prevId).addEventListener("click", () => {
    if (page > 0) {
      page--;
      render();
    }
  });
  document.getElementById(nextId).addEventListener("click", () => {
    const totalPages = Math.max(1, Math.ceil(items.length / perPage));
    if (page < totalPages - 1) {
      page++;
      render();
    }
  });

  return {
    setItems(newItems) {
      items = newItems;
      page = 0;
      render();
    },
    refresh: render,
  };
}

const PAGINATED_FEEDS = {
  instagram: createPaginatedFeed({ listId: "feed-instagram", prevId: "instagramPrevBtn", nextId: "instagramNextBtn", pageNumbersId: "instagramPageNumbers", cardBuilder: buildFriendPostCard }),
  facebook: createPaginatedFeed({ listId: "feed-facebook", prevId: "facebookPrevBtn", nextId: "facebookNextBtn", pageNumbersId: "facebookPageNumbers", cardBuilder: buildFriendPostCard }),
  x: createPaginatedFeed({ listId: "feed-x", prevId: "xPrevBtn", nextId: "xNextBtn", pageNumbersId: "xPageNumbers", cardBuilder: buildFriendPostCard }),
  threads: createPaginatedFeed({ listId: "feed-threads", prevId: "threadsPrevBtn", nextId: "threadsNextBtn", pageNumbersId: "threadsPageNumbers", cardBuilder: buildFriendPostCard }),
  youtube: createPaginatedFeed({ listId: "feed-youtube", prevId: "youtubePrevBtn", nextId: "youtubeNextBtn", pageNumbersId: "youtubePageNumbers", cardBuilder: (item) => buildResultCard(item, "videos") }),
  tiktok: createPaginatedFeed({ listId: "feed-tiktok", prevId: "tiktokPrevBtn", nextId: "tiktokNextBtn", pageNumbersId: "tiktokPageNumbers", cardBuilder: (item) => buildResultCard(item, "videos") }),
  interestWatch: createPaginatedFeed({ listId: "feed-interest-watch", prevId: "interestWatchPrevBtn", nextId: "interestWatchNextBtn", pageNumbersId: "interestWatchPageNumbers", cardBuilder: (item) => buildResultCard(item, "videos") }),
  noninterestWatch: createPaginatedFeed({ listId: "feed-noninterest-watch", prevId: "noninterestWatchPrevBtn", nextId: "noninterestWatchNextBtn", pageNumbersId: "noninterestWatchPageNumbers", cardBuilder: (item) => buildResultCard(item, "videos") }),
  interest: createPaginatedFeed({ listId: "feed-interest", prevId: "interestPrevBtn", nextId: "interestNextBtn", pageNumbersId: "interestPageNumbers", cardBuilder: buildArticleCard }),
  noninterest: createPaginatedFeed({ listId: "feed-noninterest", prevId: "noninterestPrevBtn", nextId: "noninterestNextBtn", pageNumbersId: "noninterestPageNumbers", cardBuilder: buildArticleCard }),
  top: createPaginatedFeed({ listId: "feed-top", prevId: "topPrevBtn", nextId: "topNextBtn", pageNumbersId: "topPageNumbers", cardBuilder: buildArticleCard }),
};

function renderFeeds() {
  ["interest", "noninterest", "top"].forEach((cat) => {
    PAGINATED_FEEDS[cat].setItems(SAMPLE_FEEDS[cat]);
  });

  PAGINATED_FEEDS.interestWatch.setItems(SAMPLE_VIDEO_FEEDS.interestWatch);
  PAGINATED_FEEDS.noninterestWatch.setItems(SAMPLE_VIDEO_FEEDS.noninterestWatch);

  refreshFriendFeeds();
}

// フィード更新間隔(設定で6/12/24時間から選択)のサイクルごとに、
// 並び順と相対時刻をローテーションしてサンプル投稿を「更新」する。
let lastRenderedFeedCycle = null;

function refreshFriendFeeds() {
  const cycle = currentFeedCycle();
  lastRenderedFeedCycle = cycle;

  ["instagram", "facebook", "x", "threads"].forEach((key, idx) => {
    const shuffled = seededShuffle(SAMPLE_FRIEND_POSTS[key], cycle * 100 + idx).map((post, i) => ({
      ...post,
      time: RELATIVE_TIME_LABELS[i % RELATIVE_TIME_LABELS.length],
    }));
    PAGINATED_FEEDS[key].setItems(shuffled);
  });

  ["youtube", "tiktok"].forEach((key, idx) => {
    PAGINATED_FEEDS[key].setItems(seededShuffle(SAMPLE_VIDEO_FEEDS[key], cycle * 100 + idx + 10));
  });
}

/* ==========================================================================
   下部アプリドック
   ========================================================================== */

function getSelectedAppIds() {
  return loadJSON(STORAGE_KEYS.selectedApps, ["instagram", "x", "youtube"]);
}

function isDockCollapsed() {
  return loadJSON(STORAGE_KEYS.dockCollapsed, false);
}

function saveDockCollapsed(collapsed) {
  saveJSON(STORAGE_KEYS.dockCollapsed, collapsed);
}

function applyDockCollapsed() {
  const collapsed = isDockCollapsed();
  const btn = document.getElementById("dockCollapseBtn");
  document.getElementById("dockContent").hidden = collapsed;
  btn.textContent = collapsed ? "Show Apps" : "Hide Apps";
  btn.setAttribute("aria-expanded", String(!collapsed));
}

function renderDock() {
  const grid = document.getElementById("dockGrid");
  const selectedIds = getSelectedAppIds();
  grid.innerHTML = "";

  if (selectedIds.length === 0) {
    const empty = document.createElement("div");
    empty.className = "dock-empty";
    empty.textContent = "Add up to 10 apps from \"Edit Apps\"";
    grid.appendChild(empty);
    return;
  }

  selectedIds.forEach((id) => {
    const app = APP_CANDIDATES.find((a) => a.id === id);
    if (!app) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "dock-app";
    btn.appendChild(buildAppIcon(app));
    const label = document.createElement("span");
    label.className = "dock-label";
    label.textContent = app.name;
    btn.appendChild(label);
    btn.addEventListener("click", () => openAppOpenConfirm(app));
    grid.appendChild(btn);
  });
}

// 各SNSの「投稿を作成」画面へのリンク。scheme はアプリの投稿作成画面を試み、
// 失敗したらwebにフォールバックする（openApp()と同じ仕組みを再利用）。
// Facebook/Instagram/TikTok/Threadsのアプリ内投稿作成への直接スキームは
// 各社が公式に保証しているものではないため、うまく開けない端末もあり得る
// （その場合は自動的にWeb版へフォールバックする）。X/YouTubeのWeb版URLは公式の
// 投稿・アップロード画面。
const SNS_COMPOSE_LINKS = {
  instagram: { scheme: "instagram://camera", web: "https://www.instagram.com/" },
  facebook: { scheme: "fb://composer", web: "https://www.facebook.com/" },
  x: { scheme: "twitter://post", web: "https://twitter.com/intent/tweet" },
  youtube: { scheme: "vnd.youtube://upload", web: "https://www.youtube.com/upload" },
  tiktok: { scheme: "snssdk1233://", web: "https://www.tiktok.com/upload" },
  threads: { scheme: "barcelona://camera", web: "https://www.threads.net/intent/post" },
};

/* ==========================================================================
   アプリを開く操作のインサイト
   （何回開いた/キャンセルしたか、離脱〜復帰の経過時間から見た滞在時間の目安、
   スクロールをONにした回数）
   ========================================================================== */

function getScrollOnCount() {
  return loadJSON(STORAGE_KEYS.scrollOnCount, 0);
}

function incrementScrollOnCount() {
  saveJSON(STORAGE_KEYS.scrollOnCount, getScrollOnCount() + 1);
}

function getScrollOnTimeMs() {
  return loadJSON(STORAGE_KEYS.scrollOnTimeMs, 0);
}

function addScrollOnTimeMs(ms) {
  saveJSON(STORAGE_KEYS.scrollOnTimeMs, getScrollOnTimeMs() + ms);
}

function getScrollGestureCount() {
  return loadJSON(STORAGE_KEYS.scrollGestureCount, 0);
}

function incrementScrollGestureCount() {
  saveJSON(STORAGE_KEYS.scrollGestureCount, getScrollGestureCount() + 1);
}

// スクロール操作の「回数」を数える。個々のscrollイベントは1回の指の動きで
// 何十回も発火するため、一定時間(400ms)動きが止まったら1回のスクロールとして
// カウントする（Instagram等と違い、これは自アプリ内のスクロールなので直接検知できる）。
let scrollGestureIdleTimer = null;

function initScrollGestureTracking() {
  document.addEventListener("scroll", () => {
    if (scrollGestureIdleTimer) {
      clearTimeout(scrollGestureIdleTimer);
    } else {
      incrementScrollGestureCount();
      renderAppInsights();
    }
    scrollGestureIdleTimer = setTimeout(() => { scrollGestureIdleTimer = null; }, 400);
  }, true);
}

function getAppInsights() {
  return loadJSON(STORAGE_KEYS.appInsights, {});
}

function saveAppInsights(data) {
  saveJSON(STORAGE_KEYS.appInsights, data);
}

function ensureInsightsEntry(data, appId) {
  if (!data[appId]) data[appId] = { opens: 0, canceled: 0, totalTimeMs: 0, sessionCount: 0 };
  return data[appId];
}

function recordAppOpenDecision(appId, confirmed) {
  const data = getAppInsights();
  const entry = ensureInsightsEntry(data, appId);
  if (confirmed) entry.opens += 1; else entry.canceled += 1;
  saveAppInsights(data);
}

function recordAppSession(appId, durationMs) {
  const data = getAppInsights();
  const entry = ensureInsightsEntry(data, appId);
  entry.totalTimeMs += durationMs;
  entry.sessionCount += 1;
  saveAppInsights(data);
}

// アプリの中身は見えないため、「開くために離脱してから、このタブに戻ってくるまでの
// 経過時間」を滞在時間の目安として記録する（詳細は前回の会話で説明した通りの近似値）。
let pendingAwaySession = null;

function startAwaySession(appId) {
  if (!appId) return;
  pendingAwaySession = { appId, startedAt: Date.now() };
}

function endAwaySessionIfAny() {
  if (!pendingAwaySession) return;
  const durationMs = Date.now() - pendingAwaySession.startedAt;
  recordAppSession(pendingAwaySession.appId, durationMs);
  pendingAwaySession = null;
}

function initAwaySessionTracking() {
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      endAwaySessionIfAny();
      renderInsightsBar();
    }
  });
}

function openApp(app) {
  // アプリが端末にインストール済みならscheme URLで直接開き、
  // 既にログイン済みのセッションのままスムーズに開ける。
  // 未インストールの場合はタイムアウト後にWeb版へフォールバックする。
  let didHide = false;
  const onVisibilityChange = () => {
    if (document.hidden) {
      didHide = true;
      startAwaySession(app.id);
    }
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  window.location.href = app.scheme;

  setTimeout(() => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    if (!didHide) {
      window.open(app.web, "_blank", "noopener");
      startAwaySession(app.id);
    }
  }, 800);
}

/* ==========================================================================
   ドックのアプリを開く前の確認モーダル
   ========================================================================== */

let pendingConfirmApp = null;

function openAppOpenConfirm(app) {
  pendingConfirmApp = app;
  document.getElementById("appOpenConfirmTitle").textContent = `Open ${app.name}?`;
  document.getElementById("appOpenConfirmDesc").textContent =
    `You're about to leave MyHome Browser to open ${app.name}.`;
  document.getElementById("appOpenConfirmModal").hidden = false;
}

function closeAppOpenConfirm() {
  document.getElementById("appOpenConfirmModal").hidden = true;
  pendingConfirmApp = null;
}

// アプリ候補のチェックボックス一覧を作る共通処理。
// Edit Appsモーダルと初回起動時のSNS選択ステップの両方から使う。
function buildAppCandidateListItems(list, candidates, selectedIds, idPrefix) {
  list.innerHTML = "";

  candidates.forEach((app) => {
    const li = document.createElement("li");
    const checked = selectedIds.includes(app.id);
    const inputId = `${idPrefix}-${app.id}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = inputId;
    checkbox.value = app.id;
    checkbox.checked = checked;
    li.appendChild(checkbox);

    const label = document.createElement("label");
    label.htmlFor = inputId;
    label.className = "app-candidate-label";
    const iconWrap = document.createElement("span");
    iconWrap.className = "candidate-icon";
    iconWrap.appendChild(buildAppIcon(app));
    label.appendChild(iconWrap);
    label.appendChild(document.createTextNode(app.name));
    li.appendChild(label);

    list.appendChild(li);
  });
}

function renderAppPickerList() {
  const list = document.getElementById("appCandidateList");
  buildAppCandidateListItems(list, APP_CANDIDATES, getSelectedAppIds(), "app");
  updateAppPickerDisabledState();
}

function updateAppPickerDisabledState() {
  const list = document.getElementById("appCandidateList");
  const checkboxes = list.querySelectorAll('input[type="checkbox"]');
  const checkedCount = Array.from(checkboxes).filter((c) => c.checked).length;
  checkboxes.forEach((cb) => {
    const li = cb.closest("li");
    const disable = !cb.checked && checkedCount >= 10;
    cb.disabled = disable;
    li.classList.toggle("is-disabled", disable);
  });
}

function openAppPicker() {
  renderAppPickerList();
  document.getElementById("appPickerModal").hidden = false;
}
function closeAppPicker() {
  document.getElementById("appPickerModal").hidden = true;
}

/* ==========================================================================
   検索結果 (ページ送り方式・スクロールしない)
   終わりのない情報の流れを止めるため、結果は無限スクロールではなく
   ページ単位で区切って表示する。実際の検索APIと連携する場合は
   generateMockResults() をfetch()呼び出しに差し替える。
   ========================================================================== */

const RESULT_TEMPLATES = [
  { titlePrefix: "", titleSuffix: " — Official Site", domain: "example.com", snippet: (q) => `Learn more about ${q} on the official site. Find the latest news, products, and support.` },
  { titlePrefix: "", titleSuffix: " - Wikipedia", domain: "en.wikipedia.org/wiki", snippet: (q) => `${q} is covered in this encyclopedia article, including history, background, and related topics.` },
  { titlePrefix: "Buy ", titleSuffix: " online — best prices", domain: "shop.example.com", snippet: (q) => `Compare prices and shop for ${q} online. Free shipping on qualifying orders.` },
  { titlePrefix: "", titleSuffix: " news and updates", domain: "news.example.com", snippet: (q) => `The latest news and headlines about ${q} from trusted sources around the world.` },
  { titlePrefix: "What is ", titleSuffix: "? A complete guide", domain: "guide.example.com", snippet: (q) => `Everything you need to know about ${q}, explained simply with examples.` },
  { titlePrefix: "", titleSuffix: " reviews and ratings", domain: "reviews.example.com", snippet: (q) => `Real user reviews and ratings for ${q}. See what people are saying.` },
];

function slugify(query) {
  return query.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "search";
}

function generateMockResults(query, count) {
  const slug = slugify(query);
  const results = [];
  for (let i = 0; i < count; i++) {
    const t = RESULT_TEMPLATES[i % RESULT_TEMPLATES.length];
    const round = Math.floor(i / RESULT_TEMPLATES.length);
    results.push({
      title: `${t.titlePrefix}${query}${t.titleSuffix}`,
      url: `https://${round > 0 ? `p${round + 1}.` : ""}${t.domain}${t.domain.includes("wikipedia") ? "/" + slug : ""}`,
      snippet: t.snippet(query),
    });
  }
  return results;
}

function generateMockVideoResults(query, count) {
  const channels = ["TechExplained", "DailyNews", "HowToHub", "ReviewCentral", "TravelVibes", "QuickTips"];
  const durations = ["3:12", "8:45", "1:02:30", "0:45", "12:09", "5:58"];
  const slug = slugify(query);
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push({
      title: `${query} — video ${i + 1}`,
      channel: channels[i % channels.length],
      views: `${50 + i * 17}K views`,
      duration: durations[i % durations.length],
      url: `https://video.example.com/watch?v=${slug}-${i}`,
    });
  }
  return results;
}

function generateMockImageResults(query, count) {
  const hues = [340, 20, 50, 140, 200, 260];
  const slug = slugify(query);
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push({
      label: `${query} ${i + 1}`,
      hue: hues[i % hues.length],
      url: `https://images.example.com/${slug}-${i}`,
    });
  }
  return results;
}

function generateMockMapResults(query, count) {
  const streets = ["Main St", "Oak Ave", "Market Sq", "Park Rd", "River Ln", "5th Ave"];
  const slug = slugify(query);
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push({
      name: `${query} ${i % 2 === 0 ? "Store" : "Center"} ${i + 1}`,
      address: `${100 + i * 11} ${streets[i % streets.length]}`,
      rating: (3.5 + (i % 3) * 0.5).toFixed(1),
      distance: `${(0.3 + i * 0.4).toFixed(1)} mi`,
      url: `https://maps.example.com/place/${slug}-${i}`,
    });
  }
  return results;
}

function generateMockShoppingResults(query, count) {
  const stores = ["ShopHub", "MarketPlace", "QuickBuy", "TrustedGoods", "DailyDeals", "PrimeStore"];
  const slug = slugify(query);
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push({
      title: `${query} — Item ${i + 1}`,
      price: `$${(9.99 + i * 7.5).toFixed(2)}`,
      store: stores[i % stores.length],
      url: `https://shop.example.com/item/${slug}-${i}`,
    });
  }
  return results;
}

const RESULT_TYPES = {
  all: { count: 18, perPage: 4, generate: generateMockResults },
  videos: { count: 18, perPage: 5, generate: generateMockVideoResults },
  images: { count: 24, perPage: 6, generate: generateMockImageResults },
  maps: { count: 18, perPage: 5, generate: generateMockMapResults },
  shopping: { count: 18, perPage: 5, generate: generateMockShoppingResults },
};

// AIによる要約はモックのテンプレート文で、実際のLLM API連携は行っていない。
// クライアント側のコードだけでLLMのAPIキーを直接扱うと画面のソースに露出してしまうため、
// 本物のAI要約を実装する場合はサーバー/サーバーレス関数を経由してこの関数を置き換える。
function generateMockSummary(query) {
  return `${query} is a broad topic covered by official sites, encyclopedia entries, and community discussion. Sources generally agree on the core facts, though specifics vary. See the results below for more detail.`;
}

const searchState = { query: "", type: "all", results: [], page: 0 };

function buildResultCard(item, type) {
  const card = document.createElement("a");
  card.className = `search-result-card result-type-${type}`;
  card.href = item.url;
  card.target = "_blank";
  card.rel = "noopener";

  if (type === "videos") {
    const thumb = document.createElement("div");
    thumb.className = "result-video-thumb";
    thumb.textContent = item.duration;
    const info = document.createElement("div");
    info.className = "result-video-info";
    const title = document.createElement("div");
    title.className = "result-title";
    title.textContent = item.title;
    const meta = document.createElement("div");
    meta.className = "result-url";
    meta.textContent = `${item.channel} · ${item.views}`;
    info.append(title, meta);
    card.append(thumb, info);
  } else if (type === "images") {
    const swatch = document.createElement("div");
    swatch.className = "result-image-swatch";
    swatch.style.background = `hsl(${item.hue}, 60%, 55%)`;
    const label = document.createElement("div");
    label.className = "result-image-label";
    label.textContent = item.label;
    card.append(swatch, label);
  } else if (type === "maps") {
    const title = document.createElement("div");
    title.className = "result-title";
    title.textContent = item.name;
    const addr = document.createElement("div");
    addr.className = "result-url";
    addr.textContent = item.address;
    const meta = document.createElement("div");
    meta.className = "result-snippet";
    meta.textContent = `★ ${item.rating} · ${item.distance}`;
    card.append(title, addr, meta);
  } else if (type === "shopping") {
    const thumb = document.createElement("div");
    thumb.className = "result-shop-thumb";
    const info = document.createElement("div");
    info.className = "result-video-info";
    const title = document.createElement("div");
    title.className = "result-title";
    title.textContent = item.title;
    const store = document.createElement("div");
    store.className = "result-url";
    store.textContent = item.store;
    const price = document.createElement("div");
    price.className = "result-snippet";
    price.textContent = item.price;
    info.append(title, store, price);
    card.append(thumb, info);
  } else {
    const title = document.createElement("div");
    title.className = "result-title";
    title.textContent = item.title;
    const url = document.createElement("div");
    url.className = "result-url";
    url.textContent = item.url;
    const snippet = document.createElement("div");
    snippet.className = "result-snippet";
    snippet.textContent = item.snippet;
    card.append(title, url, snippet);
  }

  return card;
}

function renderSearchResultsPage() {
  const { results, page, type } = searchState;
  const perPage = RESULT_TYPES[type].perPage;
  const list = document.getElementById("searchResultsList");
  const pagination = document.querySelector(".search-pagination");
  const scrollAllowed = ScrollLock.getState().isOn;

  list.classList.toggle("is-grid", type === "images");
  list.classList.toggle("is-scrollable", scrollAllowed);
  list.innerHTML = "";

  // スクロールONの間は従来通りページ送りなしの一覧表示、OFFの間はページ単位で区切る
  if (scrollAllowed) {
    pagination.hidden = true;
    results.forEach((item) => list.appendChild(buildResultCard(item, type)));
    return;
  }

  pagination.hidden = false;
  const totalPages = Math.max(1, Math.ceil(results.length / perPage));
  const start = page * perPage;
  const pageResults = results.slice(start, start + perPage);
  pageResults.forEach((item) => list.appendChild(buildResultCard(item, type)));

  document.getElementById("searchPrevBtn").disabled = page === 0;
  document.getElementById("searchNextBtn").disabled = page >= totalPages - 1;

  const pageNumbers = document.getElementById("searchPageNumbers");
  pageNumbers.innerHTML = "";
  for (let i = 0; i < totalPages; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "page-number-btn" + (i === page ? " is-active" : "");
    btn.textContent = String(i + 1);
    btn.addEventListener("click", () => {
      searchState.page = i;
      renderSearchResultsPage();
    });
    pageNumbers.appendChild(btn);
  }
}

function refreshSearchResultsIfOpen() {
  const view = document.getElementById("searchResultsView");
  if (view && !view.hidden) renderSearchResultsPage();
  Object.values(PAGINATED_FEEDS).forEach((feed) => feed.refresh());
}

function loadSearchResultsForType(type) {
  const config = RESULT_TYPES[type];
  searchState.type = type;
  searchState.results = config.generate(searchState.query, config.count);
  searchState.page = 0;
  document.querySelectorAll("#searchTypeTabs .result-type-tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.type === type);
  });

  const summaryBox = document.getElementById("aiSummaryBox");
  if (type === "all") {
    document.getElementById("aiSummaryText").textContent = generateMockSummary(searchState.query);
    summaryBox.hidden = false;
  } else {
    summaryBox.hidden = true;
  }

  renderSearchResultsPage();
}

function openSearchResults(query) {
  searchState.query = query;
  document.getElementById("searchResultsQuery").textContent = `Results for "${query}"`;
  loadSearchResultsForType("all");
  document.querySelector(".content").hidden = true;
  document.getElementById("searchResultsView").hidden = false;
}

function closeSearchResults() {
  document.getElementById("searchResultsView").hidden = true;
  document.querySelector(".content").hidden = false;
}

/* ==========================================================================
   初期化 / イベント登録
   ========================================================================== */

function init() {
  initAppLock();
  initOnboarding();
  applyAppearance();
  ScrollLock.init();
  FocusTimer.init();
  initFocusTimerPanel();
  initAwaySessionTracking();
  initScrollGestureTracking();
  initCategoryTabs();
  initSnsTabs();
  renderFeeds();
  initReadWatchTabs("panel-interest");
  initReadWatchTabs("panel-noninterest");
  renderDock();
  applyDockCollapsed();

  document.getElementById("dockCollapseBtn").addEventListener("click", () => {
    const collapsed = !isDockCollapsed();
    saveDockCollapsed(collapsed);
    applyDockCollapsed();
  });

  document.getElementById("scrollToggleBtn").addEventListener("click", () => {
    const state = ScrollLock.getState();
    if (state.isOn) {
      ScrollLock.turnOff();
    } else {
      openScrollOnModal();
    }
  });

  document.getElementById("cancelScrollOn").addEventListener("click", closeScrollOnModal);
  document.getElementById("confirmScrollOn").addEventListener("click", () => {
    const reasonSelect = document.getElementById("reasonSelect");
    const durationSelect = document.getElementById("durationSelect");
    const pinInput = document.getElementById("scrollPinInput");
    const reason = reasonSelect.value;
    const minutes = Number(durationSelect.value);
    const durationLabel = durationSelect.selectedOptions[0]?.dataset.label || `${minutes} min`;
    if (!reason || !minutes) return;
    if (pinInput.value !== getPin()) {
      showToast("Incorrect PIN");
      pinInput.value = "";
      pinInput.focus();
      return;
    }
    ScrollLock.turnOn(reason, durationLabel, minutes);
    closeScrollOnModal();
  });

  document.getElementById("savePinBtn").addEventListener("click", () => {
    const input = document.getElementById("newPinInput");
    const value = input.value.trim();
    if (!/^\d{4}$/.test(value)) {
      showToast("PIN must be exactly 4 digits");
      return;
    }
    savePin(value);
    input.value = "";
    showToast("PIN updated");
  });

  document.getElementById("settingsBtn").addEventListener("click", openSettingsModal);
  document.getElementById("closeSettings").addEventListener("click", closeSettingsModal);

  document.getElementById("appOpenCancelBtn").addEventListener("click", () => {
    if (pendingConfirmApp) recordAppOpenDecision(pendingConfirmApp.id, false);
    closeAppOpenConfirm();
    renderInsightsBar();
  });
  document.getElementById("appOpenConfirmBtn").addEventListener("click", () => {
    const app = pendingConfirmApp;
    closeAppOpenConfirm();
    if (app) {
      recordAppOpenDecision(app.id, true);
      renderInsightsBar();
      openApp(app);
    }
  });

  initTipsPanel();

  document.getElementById("addReasonBtn").addEventListener("click", () => {
    const input = document.getElementById("newReasonInput");
    const value = input.value.trim();
    if (!value) return;
    const reasons = getReasons();
    reasons.push(value);
    saveJSON(STORAGE_KEYS.reasons, reasons);
    input.value = "";
    renderReasonList();
  });

  document.getElementById("addDurationBtn").addEventListener("click", () => {
    const labelInput = document.getElementById("newDurationLabel");
    const minutesInput = document.getElementById("newDurationMinutes");
    const label = labelInput.value.trim();
    const minutes = Number(minutesInput.value);
    if (!label || !minutes || minutes <= 0) return;
    const durations = getDurations();
    durations.push({ label, minutes });
    saveJSON(STORAGE_KEYS.durations, durations);
    labelInput.value = "";
    minutesInput.value = "";
    renderDurationList();
  });

  document.getElementById("presetRow").addEventListener("click", (e) => {
    const swatch = e.target.closest(".preset-swatch");
    if (!swatch) return;
    const appearance = getAppearance();
    appearance.accent = swatch.dataset.accent;
    appearance.bg = swatch.dataset.bg;
    saveAppearance(appearance);
    applyAppearance();
    populateAppearanceInputs();
  });

  document.getElementById("accentColorInput").addEventListener("input", (e) => {
    const appearance = getAppearance();
    appearance.accent = e.target.value;
    saveAppearance(appearance);
    applyAppearance();
  });

  document.getElementById("bgColorInput").addEventListener("input", (e) => {
    const appearance = getAppearance();
    appearance.bg = e.target.value;
    saveAppearance(appearance);
    applyAppearance();
  });

  document.getElementById("bgImageInput").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    try {
      const dataUrl = await resizeImageFile(file, 1600, 0.82);
      const appearance = getAppearance();
      appearance.bgImage = dataUrl;
      if (saveAppearance(appearance)) applyAppearance();
    } catch (err) {
      showToast("Could not load that image");
    }
  });

  document.getElementById("removeBgImageBtn").addEventListener("click", () => {
    const appearance = getAppearance();
    appearance.bgImage = null;
    saveAppearance(appearance);
    applyAppearance();
  });

  document.getElementById("resetAppearanceBtn").addEventListener("click", () => {
    saveAppearance({ ...DEFAULT_APPEARANCE });
    applyAppearance();
    populateAppearanceInputs();
  });

  document.getElementById("feedRefreshSelect").addEventListener("change", (e) => {
    saveFeedRefreshHours(Number(e.target.value));
    refreshFriendFeeds();
  });

  // 設定した間隔が経過したら自動でフィードをローテーションする
  setInterval(() => {
    if (currentFeedCycle() !== lastRenderedFeedCycle) refreshFriendFeeds();
  }, 60000);

  document.getElementById("panel-friends").addEventListener("click", (e) => {
    const btn = e.target.closest(".sns-post-btn");
    if (!btn) return;
    const link = SNS_COMPOSE_LINKS[btn.dataset.sns];
    if (link) openApp(link);
  });

  document.getElementById("editDockBtn").addEventListener("click", openAppPicker);
  document.getElementById("cancelAppPicker").addEventListener("click", closeAppPicker);
  document.getElementById("appCandidateList").addEventListener("change", (e) => {
    if (e.target.matches('input[type="checkbox"]')) updateAppPickerDisabledState();
  });
  document.getElementById("saveAppPicker").addEventListener("click", () => {
    const checked = Array.from(
      document.querySelectorAll('#appCandidateList input[type="checkbox"]:checked')
    ).map((cb) => cb.value);
    saveJSON(STORAGE_KEYS.selectedApps, checked.slice(0, 10));
    renderDock();
    updateFriendsTabVisibility();
    closeAppPicker();
  });

  document.getElementById("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;
    openSearchResults(query);
  });

  document.getElementById("closeSearchResults").addEventListener("click", closeSearchResults);

  document.getElementById("searchTypeTabs").addEventListener("click", (e) => {
    const tab = e.target.closest(".result-type-tab");
    if (!tab) return;
    loadSearchResultsForType(tab.dataset.type);
  });

  document.getElementById("searchPrevBtn").addEventListener("click", () => {
    if (searchState.page > 0) {
      searchState.page--;
      renderSearchResultsPage();
    }
  });

  document.getElementById("searchNextBtn").addEventListener("click", () => {
    const totalPages = Math.ceil(searchState.results.length / searchState.perPage);
    if (searchState.page < totalPages - 1) {
      searchState.page++;
      renderSearchResultsPage();
    }
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
