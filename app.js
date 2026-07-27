"use strict";

/* ==========================================================================
   ストレージキー / 初期データ
   ========================================================================== */

const STORAGE_KEYS = {
  scrollState: "myhome:scrollState",
  reasons: "myhome:reasons",
  durations: "myhome:durations",
  selectedApps: "myhome:selectedApps",
  appearance: "myhome:appearance",
  pin: "myhome:pin",
  dockCollapsed: "myhome:dockCollapsed",
  appLockEnabled: "myhome:appLockEnabled",
  appLockPin: "myhome:appLockPin",
  appLockQuestion: "myhome:appLockQuestion",
  appLockAnswer: "myhome:appLockAnswer",
  onboardingComplete: "myhome:onboardingComplete",
  language: "myhome:language",
  country: "myhome:country",
  focusTimer: "myhome:focusTimer",
  appInsights: "myhome:appInsights",
  scrollOnCount: "myhome:scrollOnCount",
  scrollGestureCount: "myhome:scrollGestureCount",
  scrollOnTimeMs: "myhome:scrollOnTimeMs",
  biometricAppLockEnabled: "myhome:biometricAppLockEnabled",
  biometricAppLockCredentialId: "myhome:biometricAppLockCredentialId",
  biometricScrollEnabled: "myhome:biometricScrollEnabled",
  biometricScrollCredentialId: "myhome:biometricScrollCredentialId",
  biometricCameraPreview: "myhome:biometricCameraPreview",
  insightsHourly: "myhome:insightsHourly",
  insightsGoalMinutes: "myhome:insightsGoalMinutes",
  insightsGoalSetAt: "myhome:insightsGoalSetAt",
  postureRemindersEnabled: "myhome:postureRemindersEnabled",
  browserTabs: "myhome:browserTabs",
  activeTabId: "myhome:activeTabId",
  bookmarks: "myhome:bookmarks",
};

const DEFAULT_APPEARANCE = { accent: "#65a30d", bg: "#ffffff", bgImage: null };
const DEFAULT_PIN = "0000";
const DEFAULT_APP_LOCK_PIN = "0000";
const DEFAULT_LANGUAGE = "en";

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

// 対応国は当面この3か国のみ（今後のニュースAPI連携を難しくしすぎないための制限）。
const COUNTRIES = [
  { code: "jp", name: "Japan" },
  { code: "mx", name: "Mexico" },
  { code: "us", name: "United States" },
];

/* ==========================================================================
   UIの多言語化
   英語の原文をそのままキーにした辞書。index.htmlは英語のまま書いておき、
   applyLanguage()が起動時に一度だけ原文を控えてから、選ばれた言語に差し替える。
   （HTML側に data-i18n を書き足す方式より、追加漏れが起きにくい）
   ========================================================================== */
const UI_I18N = {
  pt: {
    "Scroll OFF": "Rolagem DESAT.",
    "Scroll ON": "Rolagem ATIVA",
    "Timer": "Temporizador",
    "Setting": "Ajustes",
    "Tips": "Dicas",
    "Got it": "Entendi",
    "Hours": "Horas",
    "Minutes": "Minutos",
    "Seconds": "Segundos",
    "Start": "Iniciar",
    "Cancel timer": "Cancelar temporizador",
    "Lock the app when time's up": "Bloquear o app quando o tempo acabar",
    "Use it as a plain timer, or have it lock the app when time's up to limit your phone use.": "Use como um temporizador comum ou faça com que ele bloqueie o app quando o tempo acabar, para limitar o uso do celular.",
    "Scroll is OFF by default to limit distraction. Turn it ON with a reason, a time limit, and your PIN only when you really need to scroll freely.": "A rolagem vem desativada por padrão para reduzir distrações. Ative-a com um motivo, um limite de tempo e seu PIN só quando realmente precisar rolar livremente.",
    "Prev": "Anterior",
    "Next": "Próximo",
    "All time": "Desde o início",
    "Hour": "Hora",
    "Day": "Dia",
    "Month": "Mês",
    "Year": "Ano",
    "Now": "Agora",
    "Time spent per app": "Tempo gasto por app",
    "Scroll": "Rolagem",
    "Choose a time period": "Escolher um período",
    "Previous period": "Período anterior",
    "Next period": "Próximo período",
    "Previous month": "Mês anterior",
    "Next month": "Próximo mês",
    "App Insights": "Estatísticas dos apps",
    "How often you open each app from the dock, and roughly how long you're away for. Times are estimated from when you leave and come back to this app, not from inside the other app.": "Com que frequência você abre cada app pela barra e quanto tempo fica ausente, aproximadamente. Os tempos são estimados entre o momento em que você sai deste app e volta, não de dentro do outro app.",
    "No data yet. Insights appear once you open an app from the dock or turn scroll ON.": "Ainda não há dados. As estatísticas aparecem quando você abre um app pela barra ou ativa a rolagem.",
    "No activity in this hour.": "Nenhuma atividade nesta hora.",
    "No activity on this day.": "Nenhuma atividade neste dia.",
    "No activity in this month.": "Nenhuma atividade neste mês.",
    "No activity in this year.": "Nenhuma atividade neste ano.",
    "Hide Apps": "Ocultar apps",
    "Show Apps": "Mostrar apps",
    "Edit Apps": "Editar apps",
    "Choose apps (up to 10)": "Escolher apps (até 10)",
    "The list of apps installed on your phone can't be read automatically from a web page, so pick from the candidates below instead.": "A lista de apps instalados no seu celular não pode ser lida automaticamente por uma página web, então escolha entre as opções abaixo.",
    "Add up to 10 apps from \"Edit Apps\"": "Adicione até 10 apps em “Editar apps”",
    "Open this app?": "Abrir este app?",
    "Open": "Abrir",
    "Cancel": "Cancelar",
    "Turn scroll ON": "Ativar a rolagem",
    "Choose a reason and a time limit. Scroll will switch back OFF automatically when time is up.": "Escolha um motivo e um limite de tempo. A rolagem será desativada automaticamente quando o tempo acabar.",
    "Reason": "Motivo",
    "Time limit": "Limite de tempo",
    "4-digit PIN": "PIN de 4 dígitos",
    "Turn ON": "Ativar",
    "Unlock with Face ID / Fingerprint": "Desbloquear com Face ID / impressão digital",
    "Choose your language": "Escolha seu idioma",
    "Choose your country": "Escolha seu país",
    "This helps match you with relevant local news later on. More countries will be added over time.": "Isso ajuda a mostrar notícias locais relevantes mais adiante. Mais países serão adicionados com o tempo.",
    "Japan": "Japão",
    "Mexico": "México",
    "United States": "Estados Unidos",
    "Set up your PINs (optional)": "Configure seus PINs (opcional)",
    "Set a PIN to open MyHome Browser, and a separate PIN to turn scroll ON. Leave either blank to skip it. You can turn on Face ID / Fingerprint instead later, in Settings.": "Defina um PIN para abrir o MyHome Browser e outro para ativar a rolagem. Deixe em branco para pular. Depois, você pode usar Face ID / impressão digital nos ajustes.",
    "App Lock PIN (opens the app)": "PIN de bloqueio (abre o app)",
    "Scroll PIN (turns scroll ON)": "PIN de rolagem (ativa a rolagem)",
    "Security question": "Pergunta de segurança",
    "Select a question (optional)": "Selecione uma pergunta (opcional)",
    "What was your first pet's name?": "Qual era o nome do seu primeiro animal de estimação?",
    "What is your mother's maiden name?": "Qual é o nome de solteira da sua mãe?",
    "What was the name of your first school?": "Qual era o nome da sua primeira escola?",
    "What city were you born in?": "Em que cidade você nasceu?",
    "What was your childhood nickname?": "Qual era seu apelido de infância?",
    "What is your favorite food?": "Qual é a sua comida favorita?",
    "Answer": "Resposta",
    "Skip": "Pular",
    "Save & Continue": "Salvar e continuar",
    "Which social media do you use?": "Quais redes sociais você usa?",
    "Choose the ones you want quick access to from your dock.": "Escolha aquelas que você quer acessar rapidamente pela barra.",
    "Log in to your apps": "Entre nos seus apps",
    "Open each app to sign in there. You can also do this later.": "Abra cada app para entrar. Você também pode fazer isso depois.",
    "Finish setup": "Concluir configuração",
    "Log in": "Entrar",
    "No social media selected. You can add some later from Edit Apps.": "Nenhuma rede social selecionada. Você pode adicionar depois em “Editar apps”.",
    "Settings": "Ajustes",
    "Close settings": "Fechar ajustes",
    "Open settings": "Abrir ajustes",
    "How to use this app": "Como usar este app",
    "Set a timer": "Definir um temporizador",
    "Look & Feel": "Aparência",
    "PINs & Unlock": "PINs e desbloqueio",
    "Reasons & Limits": "Motivos e limites",
    "Appearance": "Aparência",
    "Green": "Verde",
    "Blue": "Azul",
    "Accent color": "Cor de destaque",
    "Background color": "Cor de fundo",
    "Choose background image": "Escolher imagem de fundo",
    "Remove image": "Remover imagem",
    "Reset colors": "Redefinir cores",
    "Language": "Idioma",
    "Scroll PIN": "PIN de rolagem",
    "Required to turn scroll ON. Default is 0000 until you change it.": "Necessário para ativar a rolagem. O padrão é 0000 até você alterá-lo.",
    "New 4-digit PIN": "Novo PIN de 4 dígitos",
    "Save": "Salvar",
    "Use Face ID / Fingerprint to turn scroll ON": "Usar Face ID / impressão digital para ativar a rolagem",
    "Face ID / Fingerprint isn't available on this device or browser.": "Face ID / impressão digital não está disponível neste dispositivo ou navegador.",
    "App Lock": "Bloqueio do app",
    "Required every time the app opens. Default is 0000 until you change it.": "Necessário sempre que o app é aberto. O padrão é 0000 até você alterá-lo.",
    "Require PIN to open the app": "Exigir PIN para abrir o app",
    "Use Face ID / Fingerprint to open the app": "Usar Face ID / impressão digital para abrir o app",
    "Recovery question (optional) — the only way to reset a forgotten App Lock PIN.": "Pergunta de recuperação (opcional) — a única forma de redefinir um PIN de bloqueio esquecido.",
    "Save recovery question": "Salvar pergunta de recuperação",
    "Show front camera while authenticating (visual only, doesn't verify you)": "Mostrar a câmera frontal durante a autenticação (apenas visual, não verifica sua identidade)",
    "Reasons": "Motivos",
    "Add a new reason": "Adicionar um motivo",
    "Add": "Adicionar",
    "Time limits": "Limites de tempo",
    "Label (e.g. 15 min)": "Nome (ex.: 15 min)",
    "MyHome Browser is locked": "O MyHome Browser está bloqueado",
    "Unlock": "Desbloquear",
    "Incorrect PIN": "PIN incorreto",
    "Forgot PIN?": "Esqueceu o PIN?",
    "Your answer": "Sua resposta",
    "That answer doesn't match": "Essa resposta não confere",
    "Verify": "Verificar",
    "Set a new PIN": "Definir um novo PIN",
    "Save & Unlock": "Salvar e desbloquear",
    "No recovery question is set": "Nenhuma pergunta de recuperação definida",
    "You didn't set a security question for App Lock, so this PIN can't be recovered from here. To reset it, clear this app's data in your browser/PWA settings — note that this also resets your other MyHome Browser settings.": "Você não definiu uma pergunta de segurança para o bloqueio do app, então este PIN não pode ser recuperado por aqui. Para redefini-lo, limpe os dados deste app nos ajustes do seu navegador/PWA — isso também redefine seus outros ajustes do MyHome Browser.",
    "Back": "Voltar",
    "PIN updated": "PIN atualizado",
    "PIN reset": "PIN redefinido",
    "PIN must be exactly 4 digits": "O PIN deve ter exatamente 4 dígitos",
    "App Lock PIN must be exactly 4 digits": "O PIN de bloqueio deve ter exatamente 4 dígitos",
    "Scroll PIN must be exactly 4 digits": "O PIN de rolagem deve ter exatamente 4 dígitos",
    "App Lock PIN updated": "PIN de bloqueio atualizado",
    "App Lock enabled": "Bloqueio do app ativado",
    "App Lock disabled": "Bloqueio do app desativado",
    "Recovery question saved": "Pergunta de recuperação salva",
    "Enter both a question and an answer": "Informe a pergunta e a resposta",
    "Fill in both the question and answer, or leave both blank": "Preencha a pergunta e a resposta, ou deixe ambas em branco",
    "Setup complete": "Configuração concluída",
    "Scroll turned OFF": "Rolagem desativada",
    "Time's up — scroll switched back OFF": "Tempo esgotado — a rolagem foi desativada",
    "Timer's up": "Tempo do temporizador esgotado",
    "Timer canceled": "Temporizador cancelado",
    "Set at least 1 second": "Defina pelo menos 1 segundo",
    "Could not load that image": "Não foi possível carregar essa imagem",
    "Not enough storage to save that": "Espaço insuficiente para salvar isso",
    "Face ID / Fingerprint enabled for App Lock": "Face ID / impressão digital ativado para o bloqueio do app",
    "Face ID / Fingerprint disabled for App Lock": "Face ID / impressão digital desativado para o bloqueio do app",
    "Face ID / Fingerprint enabled for Scroll PIN": "Face ID / impressão digital ativado para o PIN de rolagem",
    "Face ID / Fingerprint disabled for Scroll PIN": "Face ID / impressão digital desativado para o PIN de rolagem",
    "Face ID / Fingerprint failed": "Falha no Face ID / impressão digital",
    "Couldn't set up Face ID / Fingerprint": "Não foi possível configurar Face ID / impressão digital",
    "Checking the news": "Ver as notícias",
    "Chatting with friends on social media": "Conversar com amigos nas redes sociais",
    "Looking something up": "Procurar alguma coisa",
    "Taking a break": "Fazer uma pausa",
    "5 min": "5 min",
    "10 min": "10 min",
    "30 min": "30 min",
    "Turned ON {count} time": "Ativada {count} vez",
    "Turned ON {count} times": "Ativada {count} vezes",
    "scrolled {count} time": "{count} rolagem",
    "scrolled {count} times": "{count} rolagens",
    "Opened {count} time": "Aberto {count} vez",
    "Opened {count} times": "Aberto {count} vezes",
    "canceled {count}": "{count} cancelados",
    "~{total} total (avg {avg})": "~{total} no total (méd. {avg})",
    "{reason} · {time} left": "{reason} · resta {time}",
    "{time} left — the app will lock when this reaches 0:00.": "Resta {time} — o app será bloqueado ao chegar a 0:00.",
    "{time} left. This is just a timer; nothing else happens at 0:00.": "Resta {time}. É apenas um temporizador; nada mais acontece a 0:00.",
    "{minutes} min": "{minutes} min",
    "Remove \"{name}\"": "Remover “{name}”",
    "{label} ({minutes} min)": "{label} ({minutes} min)",
    "{label} · {index} of {total}": "{label} · {index} de {total}",
    "Timer started — app locks in {label}": "Temporizador iniciado — o app bloqueia em {label}",
    "Timer started for {label}": "Temporizador iniciado para {label}",
    "Open {app}?": "Abrir {app}?",
    "You're about to leave MyHome Browser to open {app}.": "Você está prestes a sair do MyHome Browser para abrir {app}.",
    "{hours}h": "{hours} h",
    "{minutes}m": "{minutes} min",
    "{seconds}s": "{seconds} s",
    "{minutes}m {seconds}s": "{minutes} min {seconds} s",
    "The whole app is shown in this language.": "Todo o app é exibido neste idioma.",
    "Time's up! MyHome Browser is locked until you unlock it.": "Tempo esgotado! O MyHome Browser fica bloqueado até você desbloquear.",
    "Custom…": "Personalizado…",
    "Set a time limit of at least 1 minute": "Defina um limite de pelo menos 1 minuto",
    "{hours}h {minutes}m": "{hours} h {minutes} min",
    "Today": "Hoje",
    "Daily usage goal": "Meta diária",
    "Set your own daily time limit across all apps and scroll time. Insights tracks your progress against your own number, not one this app picked for you.": "Defina seu próprio limite diário somando todos os apps e o tempo de rolagem. As estatísticas acompanham seu progresso em relação ao seu próprio número, não a um número escolhido pelo app.",
    "Minutes per day": "Minutos por dia",
    "Remove goal": "Remover meta",
    "{used} of your {goal} goal": "{used} da sua meta de {goal}",
    "{count} day within your goal": "{count} dia dentro da sua meta",
    "{count} days within your goal": "{count} dias dentro da sua meta",
    "Set a daily goal in Settings to track your progress": "Defina uma meta diária nos ajustes para acompanhar seu progresso",
    "{percent}% above your recent average": "{percent}% acima da sua média recente",
    "{percent}% below your recent average": "{percent}% abaixo da sua média recente",
    "Enter a number of minutes": "Digite um número de minutos",
    "Goal saved": "Meta salva",
    "Goal removed": "Meta removida",
    "Why this app exists": "Por que este app existe",
    "A few things research has found about how we touch, scroll, and swipe our phones — not to make you feel bad, just so the friction in this app is based on something real.": "Algumas coisas que pesquisas descobriram sobre como tocamos, rolamos e deslizamos o celular — não para te fazer sentir mal, só para você saber que o atrito deste app se baseia em algo real.",
    "Touching:": "Tocar na tela:",
    "a 2016 study by the research firm dscout found the average person touches their phone about 2,617 times a day — the heaviest users, over 5,400 times.": "um estudo de 2016 da empresa de pesquisa dscout descobriu que, em média, uma pessoa toca no celular cerca de 2.617 vezes por dia — e quem mais usa, mais de 5.400 vezes.",
    "Scrolling:": "Rolar a tela:",
    "infinite-scroll feeds run on the same unpredictable, variable reward pattern that makes slot machines hard to put down, a design choice researchers and former tech insiders have directly compared to gambling psychology.": "os feeds de rolagem infinita funcionam com o mesmo padrão de recompensa variável e imprevisível que torna as máquinas caça-níqueis difíceis de largar — uma escolha de design que pesquisadores e ex-profissionais de tecnologia já compararam diretamente à psicologia do jogo.",
    "Checking:": "Checar o celular:",
    "a habit-formation study by Oulasvirta and colleagues (2012) found most phone checks last under 30 seconds and are triggered by boredom or habit, not real need — part of why they're hard to even notice.": "um estudo sobre formação de hábitos de Oulasvirta e colegas (2012) descobriu que a maioria das checadas no celular dura menos de 30 segundos e é motivada por tédio ou hábito, não por necessidade real — o que ajuda a explicar por que passam despercebidas.",
    "Posture:": "Postura:",
    "tilting your head forward to look at a phone can add up to 60 lbs of effective strain on your neck, according to spinal-stress research by Dr. Kenneth Hansraj (2014).": "inclinar a cabeça para frente para olhar o celular pode adicionar até cerca de 27 kg de sobrecarga efetiva no pescoço, segundo uma pesquisa sobre estresse na coluna do Dr. Kenneth Hansraj (2014).",
    "None of this is about guilt. It's why a reason, a time limit, and a PIN can do more than willpower alone.": "Nada disso é para gerar culpa. É por isso que um motivo, um limite de tempo e um PIN podem ajudar mais do que só força de vontade.",
    "Last 7 days": "Últimos 7 dias",
    "{count} quick check": "{count} checagem rápida",
    "{count} quick checks": "{count} checagens rápidas",
    "{count} longer session": "{count} sessão mais longa",
    "{count} longer sessions": "{count} sessões mais longas",
    "Posture": "Postura",
    "Remind me to check my posture every 10 minutes while scroll is ON": "Me lembre de checar minha postura a cada 10 minutos enquanto a rolagem estiver ativada",
    "Posture check: try sitting up and holding the phone at eye level for a moment.": "Checagem de postura: tente sentar-se ereto e segurar o celular na altura dos olhos por um instante.",
    "By hour of day": "Por horário do dia",
    "This sets the language for the rest of the app.": "Isso define o idioma de todo o app.",
    "Step 1 of 6": "Passo 1 de 6",
    "Step 2 of 6": "Passo 2 de 6",
    "Step 3 of 6": "Passo 3 de 6",
    "Step 4 of 6": "Passo 4 de 6",
    "Step 5 of 6": "Passo 5 de 6",
    "Step 6 of 6": "Passo 6 de 6",
    "Blocked: this looks like an ad or tracking domain": "Bloqueado: isso parece um domínio de anúncios ou rastreamento",
    "Remove bookmark": "Remover favorito",
    "Bookmark this page": "Adicionar esta página aos favoritos",
    "No bookmarks yet. Open a page and tap the star to save it.": "Ainda não há favoritos. Abra uma página e toque na estrela para salvá-la.",
    "Bookmark removed": "Favorito removido",
    "Bookmark added": "Favorito adicionado",
    "Close tab \"{title}\"": "Fechar aba \"{title}\"",
    "Bookmarks": "Favoritos",
    "Insights": "Estatísticas",
    "Search or enter a website above to start browsing.": "Pesquise ou digite um site acima para começar a navegar.",
    "Open bookmarks": "Abrir favoritos",
    "Open insights": "Abrir estatísticas",
    "Search or go to address": "Pesquisar ou ir para um endereço",
    "Search or enter address": "Pesquisar ou digitar um endereço",
    "Open in browser": "Abrir no navegador",
    "Close insights": "Fechar estatísticas",
    "Close bookmarks": "Fechar favoritos",
    "Type a search or a website above — it opens as a new tab you can browse right here.": "Digite uma pesquisa ou um site acima — ele abre como uma nova aba que você pode navegar bem aqui.",
    "Switch tabs with the pills above the page. Tap the star to bookmark one; Bookmarks and Insights up top stay empty until you tap them.": "Alterne entre as abas com os botões em pílula acima da página. Toque na estrela para adicionar aos favoritos; os botões Favoritos e Estatísticas no topo não mostram nada até você tocá-los.",
    "Ad blocking only stops navigating straight to known ad/tracking domains — it can't remove ads from a page you're already on.": "O bloqueio de anúncios só impede navegar diretamente para domínios de anúncios/rastreamento conhecidos — não remove anúncios de uma página que você já está vendo.",
  },
  de: {
    "Scroll OFF": "Scrollen AUS",
    "Scroll ON": "Scrollen AN",
    "Timer": "Timer",
    "Setting": "Einstellungen",
    "Tips": "Tipps",
    "Got it": "Verstanden",
    "Hours": "Stunden",
    "Minutes": "Minuten",
    "Seconds": "Sekunden",
    "Start": "Starten",
    "Cancel timer": "Timer abbrechen",
    "Lock the app when time's up": "App sperren, wenn die Zeit um ist",
    "Use it as a plain timer, or have it lock the app when time's up to limit your phone use.": "Nutze ihn als einfachen Timer oder lass ihn die App sperren, wenn die Zeit um ist, um deine Handynutzung zu begrenzen.",
    "Scroll is OFF by default to limit distraction. Turn it ON with a reason, a time limit, and your PIN only when you really need to scroll freely.": "Scrollen ist standardmäßig aus, um Ablenkung zu begrenzen. Schalte es nur mit einem Grund, einem Zeitlimit und deiner PIN ein, wenn du wirklich frei scrollen musst.",
    "Prev": "Zurück",
    "Next": "Weiter",
    "All time": "Gesamt",
    "Hour": "Stunde",
    "Day": "Tag",
    "Month": "Monat",
    "Year": "Jahr",
    "Now": "Jetzt",
    "Time spent per app": "Zeit pro App",
    "Scroll": "Scrollen",
    "Choose a time period": "Zeitraum wählen",
    "Previous period": "Vorheriger Zeitraum",
    "Next period": "Nächster Zeitraum",
    "Previous month": "Vorheriger Monat",
    "Next month": "Nächster Monat",
    "App Insights": "App-Nutzung",
    "How often you open each app from the dock, and roughly how long you're away for. Times are estimated from when you leave and come back to this app, not from inside the other app.": "Wie oft du jede App aus dem Dock öffnest und wie lange du ungefähr weg bist. Die Zeiten werden daraus geschätzt, wann du diese App verlässt und zurückkehrst – nicht aus der anderen App heraus.",
    "No data yet. Insights appear once you open an app from the dock or turn scroll ON.": "Noch keine Daten. Die Nutzung erscheint, sobald du eine App aus dem Dock öffnest oder Scrollen einschaltest.",
    "No activity in this hour.": "Keine Aktivität in dieser Stunde.",
    "No activity on this day.": "Keine Aktivität an diesem Tag.",
    "No activity in this month.": "Keine Aktivität in diesem Monat.",
    "No activity in this year.": "Keine Aktivität in diesem Jahr.",
    "Hide Apps": "Apps ausblenden",
    "Show Apps": "Apps anzeigen",
    "Edit Apps": "Apps bearbeiten",
    "Choose apps (up to 10)": "Apps wählen (max. 10)",
    "The list of apps installed on your phone can't be read automatically from a web page, so pick from the candidates below instead.": "Die Liste der auf deinem Handy installierten Apps kann von einer Webseite nicht automatisch gelesen werden – wähle stattdessen aus den Vorschlägen unten.",
    "Add up to 10 apps from \"Edit Apps\"": "Füge über „Apps bearbeiten“ bis zu 10 Apps hinzu",
    "Open this app?": "Diese App öffnen?",
    "Open": "Öffnen",
    "Cancel": "Abbrechen",
    "Turn scroll ON": "Scrollen einschalten",
    "Choose a reason and a time limit. Scroll will switch back OFF automatically when time is up.": "Wähle einen Grund und ein Zeitlimit. Das Scrollen schaltet sich automatisch wieder aus, wenn die Zeit um ist.",
    "Reason": "Grund",
    "Time limit": "Zeitlimit",
    "4-digit PIN": "4-stellige PIN",
    "Turn ON": "Einschalten",
    "Unlock with Face ID / Fingerprint": "Mit Face ID / Fingerabdruck entsperren",
    "Choose your language": "Sprache wählen",
    "Choose your country": "Land wählen",
    "This helps match you with relevant local news later on. More countries will be added over time.": "Das hilft später dabei, dir passende lokale Nachrichten zu zeigen. Weitere Länder kommen nach und nach dazu.",
    "Japan": "Japan",
    "Mexico": "Mexiko",
    "United States": "Vereinigte Staaten",
    "Set up your PINs (optional)": "PINs einrichten (optional)",
    "Set a PIN to open MyHome Browser, and a separate PIN to turn scroll ON. Leave either blank to skip it. You can turn on Face ID / Fingerprint instead later, in Settings.": "Lege eine PIN zum Öffnen von MyHome Browser fest und eine separate PIN zum Einschalten des Scrollens. Leer lassen, um zu überspringen. Du kannst später in den Einstellungen stattdessen Face ID / Fingerabdruck aktivieren.",
    "App Lock PIN (opens the app)": "App-Sperr-PIN (öffnet die App)",
    "Scroll PIN (turns scroll ON)": "Scroll-PIN (schaltet Scrollen ein)",
    "Security question": "Sicherheitsfrage",
    "Select a question (optional)": "Frage wählen (optional)",
    "What was your first pet's name?": "Wie hieß dein erstes Haustier?",
    "What is your mother's maiden name?": "Wie lautet der Mädchenname deiner Mutter?",
    "What was the name of your first school?": "Wie hieß deine erste Schule?",
    "What city were you born in?": "In welcher Stadt bist du geboren?",
    "What was your childhood nickname?": "Wie war dein Spitzname als Kind?",
    "What is your favorite food?": "Was ist dein Lieblingsessen?",
    "Answer": "Antwort",
    "Skip": "Überspringen",
    "Save & Continue": "Speichern und fortfahren",
    "Which social media do you use?": "Welche sozialen Medien nutzt du?",
    "Choose the ones you want quick access to from your dock.": "Wähle die aus, auf die du schnell über das Dock zugreifen möchtest.",
    "Log in to your apps": "Bei deinen Apps anmelden",
    "Open each app to sign in there. You can also do this later.": "Öffne jede App, um dich dort anzumelden. Das geht auch später.",
    "Finish setup": "Einrichtung abschließen",
    "Log in": "Anmelden",
    "No social media selected. You can add some later from Edit Apps.": "Keine sozialen Medien ausgewählt. Du kannst später über „Apps bearbeiten“ welche hinzufügen.",
    "Settings": "Einstellungen",
    "Close settings": "Einstellungen schließen",
    "Open settings": "Einstellungen öffnen",
    "How to use this app": "So benutzt du diese App",
    "Set a timer": "Timer stellen",
    "Look & Feel": "Aussehen",
    "PINs & Unlock": "PINs & Entsperren",
    "Reasons & Limits": "Gründe & Limits",
    "Appearance": "Aussehen",
    "Green": "Grün",
    "Blue": "Blau",
    "Accent color": "Akzentfarbe",
    "Background color": "Hintergrundfarbe",
    "Choose background image": "Hintergrundbild wählen",
    "Remove image": "Bild entfernen",
    "Reset colors": "Farben zurücksetzen",
    "Language": "Sprache",
    "Scroll PIN": "Scroll-PIN",
    "Required to turn scroll ON. Default is 0000 until you change it.": "Zum Einschalten des Scrollens nötig. Standard ist 0000, bis du sie änderst.",
    "New 4-digit PIN": "Neue 4-stellige PIN",
    "Save": "Speichern",
    "Use Face ID / Fingerprint to turn scroll ON": "Face ID / Fingerabdruck zum Einschalten des Scrollens verwenden",
    "Face ID / Fingerprint isn't available on this device or browser.": "Face ID / Fingerabdruck ist auf diesem Gerät oder Browser nicht verfügbar.",
    "App Lock": "App-Sperre",
    "Required every time the app opens. Default is 0000 until you change it.": "Bei jedem Öffnen der App nötig. Standard ist 0000, bis du sie änderst.",
    "Require PIN to open the app": "PIN zum Öffnen der App verlangen",
    "Use Face ID / Fingerprint to open the app": "Face ID / Fingerabdruck zum Öffnen der App verwenden",
    "Recovery question (optional) — the only way to reset a forgotten App Lock PIN.": "Wiederherstellungsfrage (optional) – die einzige Möglichkeit, eine vergessene App-Sperr-PIN zurückzusetzen.",
    "Save recovery question": "Wiederherstellungsfrage speichern",
    "Show front camera while authenticating (visual only, doesn't verify you)": "Frontkamera während der Authentifizierung anzeigen (nur visuell, dient nicht der Überprüfung)",
    "Reasons": "Gründe",
    "Add a new reason": "Neuen Grund hinzufügen",
    "Add": "Hinzufügen",
    "Time limits": "Zeitlimits",
    "Label (e.g. 15 min)": "Bezeichnung (z. B. 15 Min.)",
    "MyHome Browser is locked": "MyHome Browser ist gesperrt",
    "Unlock": "Entsperren",
    "Incorrect PIN": "Falsche PIN",
    "Forgot PIN?": "PIN vergessen?",
    "Your answer": "Deine Antwort",
    "That answer doesn't match": "Diese Antwort stimmt nicht überein",
    "Verify": "Bestätigen",
    "Set a new PIN": "Neue PIN festlegen",
    "Save & Unlock": "Speichern und entsperren",
    "No recovery question is set": "Keine Wiederherstellungsfrage festgelegt",
    "You didn't set a security question for App Lock, so this PIN can't be recovered from here. To reset it, clear this app's data in your browser/PWA settings — note that this also resets your other MyHome Browser settings.": "Du hast keine Sicherheitsfrage für die App-Sperre festgelegt, daher kann diese PIN hier nicht wiederhergestellt werden. Zum Zurücksetzen lösche die Daten dieser App in deinen Browser-/PWA-Einstellungen – das setzt auch deine übrigen MyHome-Browser-Einstellungen zurück.",
    "Back": "Zurück",
    "PIN updated": "PIN aktualisiert",
    "PIN reset": "PIN zurückgesetzt",
    "PIN must be exactly 4 digits": "Die PIN muss genau 4 Ziffern haben",
    "App Lock PIN must be exactly 4 digits": "Die App-Sperr-PIN muss genau 4 Ziffern haben",
    "Scroll PIN must be exactly 4 digits": "Die Scroll-PIN muss genau 4 Ziffern haben",
    "App Lock PIN updated": "App-Sperr-PIN aktualisiert",
    "App Lock enabled": "App-Sperre aktiviert",
    "App Lock disabled": "App-Sperre deaktiviert",
    "Recovery question saved": "Wiederherstellungsfrage gespeichert",
    "Enter both a question and an answer": "Gib sowohl eine Frage als auch eine Antwort ein",
    "Fill in both the question and answer, or leave both blank": "Fülle Frage und Antwort aus oder lasse beide leer",
    "Setup complete": "Einrichtung abgeschlossen",
    "Scroll turned OFF": "Scrollen ausgeschaltet",
    "Time's up — scroll switched back OFF": "Zeit um – Scrollen wurde wieder ausgeschaltet",
    "Timer's up": "Timer abgelaufen",
    "Timer canceled": "Timer abgebrochen",
    "Set at least 1 second": "Stelle mindestens 1 Sekunde ein",
    "Could not load that image": "Dieses Bild konnte nicht geladen werden",
    "Not enough storage to save that": "Nicht genug Speicher, um das zu sichern",
    "Face ID / Fingerprint enabled for App Lock": "Face ID / Fingerabdruck für die App-Sperre aktiviert",
    "Face ID / Fingerprint disabled for App Lock": "Face ID / Fingerabdruck für die App-Sperre deaktiviert",
    "Face ID / Fingerprint enabled for Scroll PIN": "Face ID / Fingerabdruck für die Scroll-PIN aktiviert",
    "Face ID / Fingerprint disabled for Scroll PIN": "Face ID / Fingerabdruck für die Scroll-PIN deaktiviert",
    "Face ID / Fingerprint failed": "Face ID / Fingerabdruck fehlgeschlagen",
    "Couldn't set up Face ID / Fingerprint": "Face ID / Fingerabdruck konnte nicht eingerichtet werden",
    "Checking the news": "Nachrichten lesen",
    "Chatting with friends on social media": "Mit Freunden in sozialen Medien schreiben",
    "Looking something up": "Etwas nachschlagen",
    "Taking a break": "Eine Pause machen",
    "5 min": "5 Min.",
    "10 min": "10 Min.",
    "30 min": "30 Min.",
    "Turned ON {count} time": "{count}× eingeschaltet",
    "Turned ON {count} times": "{count}× eingeschaltet",
    "scrolled {count} time": "{count}× gescrollt",
    "scrolled {count} times": "{count}× gescrollt",
    "Opened {count} time": "{count}× geöffnet",
    "Opened {count} times": "{count}× geöffnet",
    "canceled {count}": "{count}× abgebrochen",
    "~{total} total (avg {avg})": "~{total} insgesamt (Ø {avg})",
    "{reason} · {time} left": "{reason} · noch {time}",
    "{time} left — the app will lock when this reaches 0:00.": "Noch {time} — die App wird bei 0:00 gesperrt.",
    "{time} left. This is just a timer; nothing else happens at 0:00.": "Noch {time}. Das ist nur ein Timer; bei 0:00 passiert sonst nichts.",
    "{minutes} min": "{minutes} Min.",
    "Remove \"{name}\"": "„{name}“ entfernen",
    "{label} ({minutes} min)": "{label} ({minutes} Min.)",
    "{label} · {index} of {total}": "{label} · {index} von {total}",
    "Timer started — app locks in {label}": "Timer gestartet — App sperrt in {label}",
    "Timer started for {label}": "Timer für {label} gestartet",
    "Open {app}?": "{app} öffnen?",
    "You're about to leave MyHome Browser to open {app}.": "Du verlässt gleich MyHome Browser, um {app} zu öffnen.",
    "{hours}h": "{hours} Std.",
    "{minutes}m": "{minutes} Min.",
    "{seconds}s": "{seconds} Sek.",
    "{minutes}m {seconds}s": "{minutes} Min. {seconds} Sek.",
    "The whole app is shown in this language.": "Die gesamte App wird in dieser Sprache angezeigt.",
    "Time's up! MyHome Browser is locked until you unlock it.": "Zeit abgelaufen! MyHome Browser bleibt gesperrt, bis du entsperrst.",
    "Custom…": "Eigene Dauer…",
    "Set a time limit of at least 1 minute": "Stelle ein Zeitlimit von mindestens 1 Minute ein",
    "{hours}h {minutes}m": "{hours} Std. {minutes} Min.",
    "Today": "Heute",
    "Daily usage goal": "Tagesziel",
    "Set your own daily time limit across all apps and scroll time. Insights tracks your progress against your own number, not one this app picked for you.": "Lege dein eigenes Tageslimit für alle Apps und die Scrollzeit zusammen fest. Die Nutzung wird an deiner eigenen Zahl gemessen, nicht an einer, die diese App für dich ausgesucht hat.",
    "Minutes per day": "Minuten pro Tag",
    "Remove goal": "Ziel entfernen",
    "{used} of your {goal} goal": "{used} von deinem Ziel {goal}",
    "{count} day within your goal": "{count} Tag im Rahmen deines Ziels",
    "{count} days within your goal": "{count} Tage im Rahmen deines Ziels",
    "Set a daily goal in Settings to track your progress": "Lege in den Einstellungen ein Tagesziel fest, um deinen Fortschritt zu sehen",
    "{percent}% above your recent average": "{percent}% über deinem letzten Durchschnitt",
    "{percent}% below your recent average": "{percent}% unter deinem letzten Durchschnitt",
    "Enter a number of minutes": "Gib eine Anzahl Minuten ein",
    "Goal saved": "Ziel gespeichert",
    "Goal removed": "Ziel entfernt",
    "Why this app exists": "Warum es diese App gibt",
    "A few things research has found about how we touch, scroll, and swipe our phones — not to make you feel bad, just so the friction in this app is based on something real.": "Ein paar Dinge, die die Forschung darüber herausgefunden hat, wie wir unser Handy berühren, scrollen und wischen — nicht um dir ein schlechtes Gewissen zu machen, sondern damit du weißt, dass die kleinen Hürden in dieser App auf echten Erkenntnissen beruhen.",
    "Touching:": "Berühren:",
    "a 2016 study by the research firm dscout found the average person touches their phone about 2,617 times a day — the heaviest users, over 5,400 times.": "eine Studie des Forschungsunternehmens dscout aus dem Jahr 2016 ergab, dass eine durchschnittliche Person ihr Handy etwa 2617 Mal am Tag berührt — bei den intensivsten Nutzern waren es über 5400 Mal.",
    "Scrolling:": "Scrollen:",
    "infinite-scroll feeds run on the same unpredictable, variable reward pattern that makes slot machines hard to put down, a design choice researchers and former tech insiders have directly compared to gambling psychology.": "Feeds mit endlosem Scrollen funktionieren nach demselben unvorhersehbaren, variablen Belohnungsmuster, das auch Spielautomaten so schwer loslassbar macht — ein Design, das Forschende und ehemalige Tech-Insider direkt mit der Psychologie des Glücksspiels verglichen haben.",
    "Checking:": "Ständiges Nachsehen:",
    "a habit-formation study by Oulasvirta and colleagues (2012) found most phone checks last under 30 seconds and are triggered by boredom or habit, not real need — part of why they're hard to even notice.": "eine Studie zur Gewohnheitsbildung von Oulasvirta und Kollegen (2012) fand heraus, dass die meisten Blicke aufs Handy weniger als 30 Sekunden dauern und durch Langeweile oder Gewohnheit ausgelöst werden, nicht durch echten Bedarf — auch deshalb fallen sie kaum auf.",
    "Posture:": "Haltung:",
    "tilting your head forward to look at a phone can add up to 60 lbs of effective strain on your neck, according to spinal-stress research by Dr. Kenneth Hansraj (2014).": "wenn du den Kopf nach vorne neigst, um aufs Handy zu schauen, kann das laut einer Studie zur Wirbelsäulenbelastung von Dr. Kenneth Hansraj (2014) eine effektive Belastung von bis zu rund 27 kg auf den Nacken bedeuten.",
    "None of this is about guilt. It's why a reason, a time limit, and a PIN can do more than willpower alone.": "Bei alldem geht es nicht um Schuldgefühle. Genau deshalb können ein Grund, ein Zeitlimit und eine PIN mehr bewirken als Willenskraft allein.",
    "Last 7 days": "Letzte 7 Tage",
    "{count} quick check": "{count} kurzer Blick",
    "{count} quick checks": "{count} kurze Blicke",
    "{count} longer session": "{count} längere Sitzung",
    "{count} longer sessions": "{count} längere Sitzungen",
    "Posture": "Haltung",
    "Remind me to check my posture every 10 minutes while scroll is ON": "Erinnere mich alle 10 Minuten an meine Haltung, solange Scrollen aktiviert ist",
    "Posture check: try sitting up and holding the phone at eye level for a moment.": "Haltungscheck: Setz dich für einen Moment aufrecht hin und halte das Handy auf Augenhöhe.",
    "By hour of day": "Nach Tageszeit",
    "This sets the language for the rest of the app.": "Das legt die Sprache der gesamten App fest.",
    "Step 1 of 6": "Schritt 1 von 6",
    "Step 2 of 6": "Schritt 2 von 6",
    "Step 3 of 6": "Schritt 3 von 6",
    "Step 4 of 6": "Schritt 4 von 6",
    "Step 5 of 6": "Schritt 5 von 6",
    "Step 6 of 6": "Schritt 6 von 6",
    "Blocked: this looks like an ad or tracking domain": "Blockiert: sieht nach einer Werbe- oder Tracking-Domain aus",
    "Remove bookmark": "Lesezeichen entfernen",
    "Bookmark this page": "Diese Seite als Lesezeichen speichern",
    "No bookmarks yet. Open a page and tap the star to save it.": "Noch keine Lesezeichen. Öffne eine Seite und tippe auf den Stern, um sie zu speichern.",
    "Bookmark removed": "Lesezeichen entfernt",
    "Bookmark added": "Lesezeichen hinzugefügt",
    "Close tab \"{title}\"": "Tab „{title}“ schließen",
    "Bookmarks": "Lesezeichen",
    "Insights": "Nutzung",
    "Search or enter a website above to start browsing.": "Suche oben oder gib eine Website ein, um mit dem Surfen zu beginnen.",
    "Open bookmarks": "Lesezeichen öffnen",
    "Open insights": "Nutzung öffnen",
    "Search or go to address": "Suchen oder Adresse aufrufen",
    "Search or enter address": "Suche oder Adresse eingeben",
    "Open in browser": "Im Browser öffnen",
    "Close insights": "Nutzung schließen",
    "Close bookmarks": "Lesezeichen schließen",
    "Type a search or a website above — it opens as a new tab you can browse right here.": "Gib oben eine Suche oder eine Website ein – sie öffnet sich als neuer Tab, den du direkt hier durchstöbern kannst.",
    "Switch tabs with the pills above the page. Tap the star to bookmark one; Bookmarks and Insights up top stay empty until you tap them.": "Wechsle Tabs mit den Pillen über der Seite. Tippe auf den Stern, um ein Lesezeichen zu setzen; Lesezeichen und Nutzung oben zeigen nichts, bis du sie antippst.",
    "Ad blocking only stops navigating straight to known ad/tracking domains — it can't remove ads from a page you're already on.": "Die Werbeblockierung verhindert nur die direkte Navigation zu bekannten Werbe-/Tracking-Domains – sie kann keine Werbung aus einer bereits geöffneten Seite entfernen.",
  },
  fr: {
    "Scroll OFF": "Défil. DÉSACT.",
    "Scroll ON": "Défil. ACTIVÉ",
    "Timer": "Minuteur",
    "Setting": "Réglages",
    "Tips": "Astuces",
    "Got it": "Compris",
    "Hours": "Heures",
    "Minutes": "Minutes",
    "Seconds": "Secondes",
    "Start": "Démarrer",
    "Cancel timer": "Annuler le minuteur",
    "Lock the app when time's up": "Verrouiller l'app à la fin du temps",
    "Use it as a plain timer, or have it lock the app when time's up to limit your phone use.": "Utilisez-le comme simple minuteur, ou faites-le verrouiller l'app à la fin du temps pour limiter votre usage du téléphone.",
    "Scroll is OFF by default to limit distraction. Turn it ON with a reason, a time limit, and your PIN only when you really need to scroll freely.": "Le défilement est désactivé par défaut pour limiter les distractions. Activez-le avec une raison, une limite de temps et votre code PIN uniquement quand vous en avez vraiment besoin.",
    "Prev": "Préc.",
    "Next": "Suiv.",
    "All time": "Depuis le début",
    "Hour": "Heure",
    "Day": "Jour",
    "Month": "Mois",
    "Year": "Année",
    "Now": "Maintenant",
    "Time spent per app": "Temps passé par application",
    "Scroll": "Défilement",
    "Choose a time period": "Choisir une période",
    "Previous period": "Période précédente",
    "Next period": "Période suivante",
    "Previous month": "Mois précédent",
    "Next month": "Mois suivant",
    "App Insights": "Statistiques des apps",
    "How often you open each app from the dock, and roughly how long you're away for. Times are estimated from when you leave and come back to this app, not from inside the other app.": "À quelle fréquence vous ouvrez chaque app depuis le dock, et combien de temps vous êtes absent·e environ. Les durées sont estimées entre le moment où vous quittez cette app et celui où vous y revenez, pas depuis l'intérieur de l'autre app.",
    "No data yet. Insights appear once you open an app from the dock or turn scroll ON.": "Pas encore de données. Les statistiques apparaissent dès que vous ouvrez une app depuis le dock ou activez le défilement.",
    "No activity in this hour.": "Aucune activité pendant cette heure.",
    "No activity on this day.": "Aucune activité ce jour-là.",
    "No activity in this month.": "Aucune activité ce mois-ci.",
    "No activity in this year.": "Aucune activité cette année.",
    "Hide Apps": "Masquer les apps",
    "Show Apps": "Afficher les apps",
    "Edit Apps": "Modifier les apps",
    "Choose apps (up to 10)": "Choisir des apps (10 max)",
    "The list of apps installed on your phone can't be read automatically from a web page, so pick from the candidates below instead.": "La liste des apps installées sur votre téléphone ne peut pas être lue automatiquement depuis une page web ; choisissez plutôt parmi les propositions ci-dessous.",
    "Add up to 10 apps from \"Edit Apps\"": "Ajoutez jusqu'à 10 apps depuis « Modifier les apps »",
    "Open this app?": "Ouvrir cette app ?",
    "Open": "Ouvrir",
    "Cancel": "Annuler",
    "Turn scroll ON": "Activer le défilement",
    "Choose a reason and a time limit. Scroll will switch back OFF automatically when time is up.": "Choisissez une raison et une limite de temps. Le défilement se désactivera automatiquement à la fin du temps.",
    "Reason": "Raison",
    "Time limit": "Limite de temps",
    "4-digit PIN": "Code PIN à 4 chiffres",
    "Turn ON": "Activer",
    "Unlock with Face ID / Fingerprint": "Déverrouiller avec Face ID / empreinte",
    "Choose your language": "Choisissez votre langue",
    "Choose your country": "Choisissez votre pays",
    "This helps match you with relevant local news later on. More countries will be added over time.": "Cela permettra de vous proposer des actualités locales pertinentes. D'autres pays seront ajoutés progressivement.",
    "Japan": "Japon",
    "Mexico": "Mexique",
    "United States": "États-Unis",
    "Set up your PINs (optional)": "Configurez vos codes PIN (facultatif)",
    "Set a PIN to open MyHome Browser, and a separate PIN to turn scroll ON. Leave either blank to skip it. You can turn on Face ID / Fingerprint instead later, in Settings.": "Définissez un code PIN pour ouvrir MyHome Browser, et un autre pour activer le défilement. Laissez vide pour ignorer. Vous pourrez utiliser Face ID / l'empreinte à la place plus tard, dans les réglages.",
    "App Lock PIN (opens the app)": "PIN de verrouillage (ouvre l'app)",
    "Scroll PIN (turns scroll ON)": "PIN de défilement (active le défilement)",
    "Security question": "Question de sécurité",
    "Select a question (optional)": "Sélectionner une question (facultatif)",
    "What was your first pet's name?": "Quel était le nom de votre premier animal de compagnie ?",
    "What is your mother's maiden name?": "Quel est le nom de jeune fille de votre mère ?",
    "What was the name of your first school?": "Quel était le nom de votre première école ?",
    "What city were you born in?": "Dans quelle ville êtes-vous né·e ?",
    "What was your childhood nickname?": "Quel était votre surnom d'enfance ?",
    "What is your favorite food?": "Quel est votre plat préféré ?",
    "Answer": "Réponse",
    "Skip": "Ignorer",
    "Save & Continue": "Enregistrer et continuer",
    "Which social media do you use?": "Quels réseaux sociaux utilisez-vous ?",
    "Choose the ones you want quick access to from your dock.": "Choisissez ceux auxquels vous voulez accéder rapidement depuis le dock.",
    "Log in to your apps": "Connectez-vous à vos apps",
    "Open each app to sign in there. You can also do this later.": "Ouvrez chaque app pour vous y connecter. Vous pouvez aussi le faire plus tard.",
    "Finish setup": "Terminer la configuration",
    "Log in": "Se connecter",
    "No social media selected. You can add some later from Edit Apps.": "Aucun réseau social sélectionné. Vous pourrez en ajouter plus tard depuis « Modifier les apps ».",
    "Settings": "Réglages",
    "Close settings": "Fermer les réglages",
    "Open settings": "Ouvrir les réglages",
    "How to use this app": "Comment utiliser cette app",
    "Set a timer": "Régler un minuteur",
    "Look & Feel": "Apparence",
    "PINs & Unlock": "PIN et déverrouillage",
    "Reasons & Limits": "Raisons et limites",
    "Appearance": "Apparence",
    "Green": "Vert",
    "Blue": "Bleu",
    "Accent color": "Couleur d'accent",
    "Background color": "Couleur de fond",
    "Choose background image": "Choisir une image de fond",
    "Remove image": "Supprimer l'image",
    "Reset colors": "Réinitialiser les couleurs",
    "Language": "Langue",
    "Scroll PIN": "PIN de défilement",
    "Required to turn scroll ON. Default is 0000 until you change it.": "Requis pour activer le défilement. 0000 par défaut jusqu'à modification.",
    "New 4-digit PIN": "Nouveau code PIN à 4 chiffres",
    "Save": "Enregistrer",
    "Use Face ID / Fingerprint to turn scroll ON": "Utiliser Face ID / l'empreinte pour activer le défilement",
    "Face ID / Fingerprint isn't available on this device or browser.": "Face ID / l'empreinte n'est pas disponible sur cet appareil ou ce navigateur.",
    "App Lock": "Verrouillage de l'app",
    "Required every time the app opens. Default is 0000 until you change it.": "Requis à chaque ouverture de l'app. 0000 par défaut jusqu'à modification.",
    "Require PIN to open the app": "Exiger un PIN pour ouvrir l'app",
    "Use Face ID / Fingerprint to open the app": "Utiliser Face ID / l'empreinte pour ouvrir l'app",
    "Recovery question (optional) — the only way to reset a forgotten App Lock PIN.": "Question de récupération (facultatif) — le seul moyen de réinitialiser un PIN de verrouillage oublié.",
    "Save recovery question": "Enregistrer la question de récupération",
    "Show front camera while authenticating (visual only, doesn't verify you)": "Afficher la caméra frontale pendant l'authentification (visuel uniquement, ne vous identifie pas)",
    "Reasons": "Raisons",
    "Add a new reason": "Ajouter une raison",
    "Add": "Ajouter",
    "Time limits": "Limites de temps",
    "Label (e.g. 15 min)": "Libellé (ex. 15 min)",
    "MyHome Browser is locked": "MyHome Browser est verrouillé",
    "Unlock": "Déverrouiller",
    "Incorrect PIN": "Code PIN incorrect",
    "Forgot PIN?": "PIN oublié ?",
    "Your answer": "Votre réponse",
    "That answer doesn't match": "Cette réponse ne correspond pas",
    "Verify": "Vérifier",
    "Set a new PIN": "Définir un nouveau PIN",
    "Save & Unlock": "Enregistrer et déverrouiller",
    "No recovery question is set": "Aucune question de récupération définie",
    "You didn't set a security question for App Lock, so this PIN can't be recovered from here. To reset it, clear this app's data in your browser/PWA settings — note that this also resets your other MyHome Browser settings.": "Vous n'avez pas défini de question de sécurité pour le verrouillage, ce PIN ne peut donc pas être récupéré ici. Pour le réinitialiser, effacez les données de cette app dans les réglages de votre navigateur/PWA — cela réinitialisera aussi vos autres réglages MyHome Browser.",
    "Back": "Retour",
    "PIN updated": "PIN mis à jour",
    "PIN reset": "PIN réinitialisé",
    "PIN must be exactly 4 digits": "Le PIN doit comporter exactement 4 chiffres",
    "App Lock PIN must be exactly 4 digits": "Le PIN de verrouillage doit comporter exactement 4 chiffres",
    "Scroll PIN must be exactly 4 digits": "Le PIN de défilement doit comporter exactement 4 chiffres",
    "App Lock PIN updated": "PIN de verrouillage mis à jour",
    "App Lock enabled": "Verrouillage de l'app activé",
    "App Lock disabled": "Verrouillage de l'app désactivé",
    "Recovery question saved": "Question de récupération enregistrée",
    "Enter both a question and an answer": "Saisissez à la fois une question et une réponse",
    "Fill in both the question and answer, or leave both blank": "Remplissez la question et la réponse, ou laissez les deux vides",
    "Setup complete": "Configuration terminée",
    "Scroll turned OFF": "Défilement désactivé",
    "Time's up — scroll switched back OFF": "Temps écoulé — le défilement a été désactivé",
    "Timer's up": "Minuteur terminé",
    "Timer canceled": "Minuteur annulé",
    "Set at least 1 second": "Définissez au moins 1 seconde",
    "Could not load that image": "Impossible de charger cette image",
    "Not enough storage to save that": "Espace de stockage insuffisant pour enregistrer cela",
    "Face ID / Fingerprint enabled for App Lock": "Face ID / empreinte activé pour le verrouillage de l'app",
    "Face ID / Fingerprint disabled for App Lock": "Face ID / empreinte désactivé pour le verrouillage de l'app",
    "Face ID / Fingerprint enabled for Scroll PIN": "Face ID / empreinte activé pour le PIN de défilement",
    "Face ID / Fingerprint disabled for Scroll PIN": "Face ID / empreinte désactivé pour le PIN de défilement",
    "Face ID / Fingerprint failed": "Échec de Face ID / empreinte",
    "Couldn't set up Face ID / Fingerprint": "Impossible de configurer Face ID / l'empreinte",
    "Checking the news": "Consulter les actualités",
    "Chatting with friends on social media": "Discuter avec des amis sur les réseaux sociaux",
    "Looking something up": "Chercher une information",
    "Taking a break": "Faire une pause",
    "5 min": "5 min",
    "10 min": "10 min",
    "30 min": "30 min",
    "Turned ON {count} time": "Activé {count} fois",
    "Turned ON {count} times": "Activé {count} fois",
    "scrolled {count} time": "{count} défilement",
    "scrolled {count} times": "{count} défilements",
    "Opened {count} time": "Ouverte {count} fois",
    "Opened {count} times": "Ouverte {count} fois",
    "canceled {count}": "{count} annulées",
    "~{total} total (avg {avg})": "~{total} au total (moy. {avg})",
    "{reason} · {time} left": "{reason} · {time} restant",
    "{time} left — the app will lock when this reaches 0:00.": "{time} restant — l'app se verrouillera à 0:00.",
    "{time} left. This is just a timer; nothing else happens at 0:00.": "{time} restant. Ce n'est qu'un minuteur ; rien d'autre ne se passe à 0:00.",
    "{minutes} min": "{minutes} min",
    "Remove \"{name}\"": "Supprimer « {name} »",
    "{label} ({minutes} min)": "{label} ({minutes} min)",
    "{label} · {index} of {total}": "{label} · {index} sur {total}",
    "Timer started — app locks in {label}": "Minuteur lancé — l'app se verrouille dans {label}",
    "Timer started for {label}": "Minuteur lancé pour {label}",
    "Open {app}?": "Ouvrir {app} ?",
    "You're about to leave MyHome Browser to open {app}.": "Vous êtes sur le point de quitter MyHome Browser pour ouvrir {app}.",
    "{hours}h": "{hours} h",
    "{minutes}m": "{minutes} min",
    "{seconds}s": "{seconds} s",
    "{minutes}m {seconds}s": "{minutes} min {seconds} s",
    "The whole app is shown in this language.": "Toute l'application s'affiche dans cette langue.",
    "Time's up! MyHome Browser is locked until you unlock it.": "Temps écoulé ! MyHome Browser reste verrouillé jusqu'à ce que vous le déverrouilliez.",
    "Custom…": "Personnalisé…",
    "Set a time limit of at least 1 minute": "Choisissez une limite d'au moins 1 minute",
    "{hours}h {minutes}m": "{hours} h {minutes} min",
    "Today": "Aujourd'hui",
    "Daily usage goal": "Objectif quotidien",
    "Set your own daily time limit across all apps and scroll time. Insights tracks your progress against your own number, not one this app picked for you.": "Définissez votre propre limite de temps quotidienne, toutes apps et défilement confondus. Les statistiques suivent votre progression par rapport à votre propre chiffre, pas un chiffre choisi par l'app.",
    "Minutes per day": "Minutes par jour",
    "Remove goal": "Supprimer l'objectif",
    "{used} of your {goal} goal": "{used} sur votre objectif de {goal}",
    "{count} day within your goal": "{count} jour dans les limites de votre objectif",
    "{count} days within your goal": "{count} jours dans les limites de votre objectif",
    "Set a daily goal in Settings to track your progress": "Définissez un objectif quotidien dans les réglages pour suivre votre progression",
    "{percent}% above your recent average": "{percent}% au-dessus de votre moyenne récente",
    "{percent}% below your recent average": "{percent}% en dessous de votre moyenne récente",
    "Enter a number of minutes": "Saisissez un nombre de minutes",
    "Goal saved": "Objectif enregistré",
    "Goal removed": "Objectif supprimé",
    "Why this app exists": "Pourquoi cette app existe",
    "A few things research has found about how we touch, scroll, and swipe our phones — not to make you feel bad, just so the friction in this app is based on something real.": "Quelques constats de la recherche sur la façon dont on touche, on fait défiler et on balaie l'écran de son téléphone, pas pour vous culpabiliser, mais pour que vous sachiez que la friction de cette app repose sur des faits réels.",
    "Touching:": "Toucher l'écran :",
    "a 2016 study by the research firm dscout found the average person touches their phone about 2,617 times a day — the heaviest users, over 5,400 times.": "une étude de 2016 menée par le cabinet dscout a montré qu'une personne touche en moyenne son téléphone environ 2617 fois par jour, et jusqu'à plus de 5400 fois chez les plus gros utilisateurs.",
    "Scrolling:": "Faire défiler :",
    "infinite-scroll feeds run on the same unpredictable, variable reward pattern that makes slot machines hard to put down, a design choice researchers and former tech insiders have directly compared to gambling psychology.": "les fils à défilement infini reposent sur le même schéma de récompense variable et imprévisible qui rend les machines à sous difficiles à quitter, un choix de conception que des chercheurs et d'anciens employés de la tech ont directement comparé à la psychologie du jeu d'argent.",
    "Checking:": "Vérifier son téléphone :",
    "a habit-formation study by Oulasvirta and colleagues (2012) found most phone checks last under 30 seconds and are triggered by boredom or habit, not real need — part of why they're hard to even notice.": "une étude de 2012 sur la formation des habitudes (Oulasvirta et ses collègues) a montré que la plupart des vérifications du téléphone durent moins de 30 secondes et sont déclenchées par l'ennui ou l'habitude, pas par un vrai besoin, ce qui explique en partie pourquoi elles passent inaperçues.",
    "Posture:": "Posture :",
    "tilting your head forward to look at a phone can add up to 60 lbs of effective strain on your neck, according to spinal-stress research by Dr. Kenneth Hansraj (2014).": "pencher la tête en avant pour regarder son téléphone peut ajouter jusqu'à environ 27 kg de tension effective sur la nuque, selon une étude sur le stress vertébral du Dr Kenneth Hansraj (2014).",
    "None of this is about guilt. It's why a reason, a time limit, and a PIN can do more than willpower alone.": "Rien de tout cela n'a pour but de vous culpabiliser. C'est pour ça qu'une raison, une limite de temps et un code PIN peuvent faire plus que la seule volonté.",
    "Last 7 days": "7 derniers jours",
    "{count} quick check": "{count} coup d'œil réflexe",
    "{count} quick checks": "{count} coups d'œil réflexes",
    "{count} longer session": "{count} session plus longue",
    "{count} longer sessions": "{count} sessions plus longues",
    "Posture": "Posture",
    "Remind me to check my posture every 10 minutes while scroll is ON": "Me rappeler de vérifier ma posture toutes les 10 minutes tant que le défilement est activé",
    "Posture check: try sitting up and holding the phone at eye level for a moment.": "Vérification de posture : essayez de vous redresser et de tenir le téléphone à hauteur des yeux un instant.",
    "By hour of day": "Par heure de la journée",
    "This sets the language for the rest of the app.": "Cela définit la langue de toute l'application.",
    "Step 1 of 6": "Étape 1 sur 6",
    "Step 2 of 6": "Étape 2 sur 6",
    "Step 3 of 6": "Étape 3 sur 6",
    "Step 4 of 6": "Étape 4 sur 6",
    "Step 5 of 6": "Étape 5 sur 6",
    "Step 6 of 6": "Étape 6 sur 6",
    "Blocked: this looks like an ad or tracking domain": "Bloqué : ceci ressemble à un domaine publicitaire ou de suivi",
    "Remove bookmark": "Retirer le favori",
    "Bookmark this page": "Ajouter cette page aux favoris",
    "No bookmarks yet. Open a page and tap the star to save it.": "Aucun favori pour l'instant. Ouvrez une page et touchez l'étoile pour l'enregistrer.",
    "Bookmark removed": "Favori retiré",
    "Bookmark added": "Favori ajouté",
    "Close tab \"{title}\"": "Fermer l'onglet « {title} »",
    "Bookmarks": "Favoris",
    "Insights": "Statistiques",
    "Search or enter a website above to start browsing.": "Recherchez ou saisissez un site ci-dessus pour commencer à naviguer.",
    "Open bookmarks": "Ouvrir les favoris",
    "Open insights": "Ouvrir les statistiques",
    "Search or go to address": "Rechercher ou aller à une adresse",
    "Search or enter address": "Rechercher ou saisir une adresse",
    "Open in browser": "Ouvrir dans le navigateur",
    "Close insights": "Fermer les statistiques",
    "Close bookmarks": "Fermer les favoris",
    "Type a search or a website above — it opens as a new tab you can browse right here.": "Saisissez une recherche ou un site web ci-dessus : il s'ouvre comme un nouvel onglet que vous pouvez parcourir ici même.",
    "Switch tabs with the pills above the page. Tap the star to bookmark one; Bookmarks and Insights up top stay empty until you tap them.": "Changez d'onglet avec les pastilles au-dessus de la page. Touchez l'étoile pour ajouter un favori ; les boutons Favoris et Statistiques en haut restent vides tant que vous ne les touchez pas.",
    "Ad blocking only stops navigating straight to known ad/tracking domains — it can't remove ads from a page you're already on.": "Le blocage des publicités empêche seulement de naviguer directement vers des domaines publicitaires ou de suivi connus — il ne peut pas retirer les publicités d'une page que vous consultez déjà.",
  },
  ko: {
    "Scroll OFF": "스크롤 OFF",
    "Scroll ON": "스크롤 ON",
    "Timer": "타이머",
    "Setting": "설정",
    "Tips": "도움말",
    "Got it": "닫기",
    "Hours": "시간",
    "Minutes": "분",
    "Seconds": "초",
    "Start": "시작",
    "Cancel timer": "타이머 취소",
    "Lock the app when time's up": "시간이 다 되면 앱 잠그기",
    "Use it as a plain timer, or have it lock the app when time's up to limit your phone use.": "일반 타이머로 쓸 수도 있고, 시간이 다 되면 앱을 잠가 휴대폰 사용을 제한할 수도 있습니다.",
    "Scroll is OFF by default to limit distraction. Turn it ON with a reason, a time limit, and your PIN only when you really need to scroll freely.": "주의가 흐트러지지 않도록 스크롤은 기본적으로 꺼져 있습니다. 정말 필요할 때만 이유와 제한 시간, PIN을 입력해 켜세요.",
    "Prev": "이전",
    "Next": "다음",
    "All time": "전체 기간",
    "Hour": "시간",
    "Day": "일",
    "Month": "월",
    "Year": "년",
    "Now": "지금",
    "Time spent per app": "앱별 사용 시간",
    "Scroll": "스크롤",
    "Choose a time period": "기간 선택",
    "Previous period": "이전 기간",
    "Next period": "다음 기간",
    "Previous month": "이전 달",
    "Next month": "다음 달",
    "App Insights": "앱 통계",
    "How often you open each app from the dock, and roughly how long you're away for. Times are estimated from when you leave and come back to this app, not from inside the other app.": "독에서 각 앱을 연 횟수와 대략적인 이용 시간입니다. 시간은 이 앱을 떠났다가 돌아올 때까지로 추정한 값이며, 상대 앱 내부를 본 것은 아닙니다.",
    "No data yet. Insights appear once you open an app from the dock or turn scroll ON.": "아직 데이터가 없습니다. 독에서 앱을 열거나 스크롤을 켜면 표시됩니다.",
    "No activity in this hour.": "이 시간대에는 기록이 없습니다.",
    "No activity on this day.": "이 날에는 기록이 없습니다.",
    "No activity in this month.": "이 달에는 기록이 없습니다.",
    "No activity in this year.": "이 해에는 기록이 없습니다.",
    "Hide Apps": "앱 숨기기",
    "Show Apps": "앱 표시",
    "Edit Apps": "앱 편집",
    "Choose apps (up to 10)": "앱 선택 (최대 10개)",
    "The list of apps installed on your phone can't be read automatically from a web page, so pick from the candidates below instead.": "웹 페이지에서는 휴대폰에 설치된 앱 목록을 자동으로 읽을 수 없으므로, 아래 후보에서 선택해 주세요.",
    "Add up to 10 apps from \"Edit Apps\"": "‘앱 편집’에서 최대 10개까지 추가할 수 있습니다",
    "Open this app?": "이 앱을 열까요?",
    "Open": "열기",
    "Cancel": "취소",
    "Turn scroll ON": "스크롤 켜기",
    "Choose a reason and a time limit. Scroll will switch back OFF automatically when time is up.": "이유와 제한 시간을 선택하세요. 시간이 지나면 자동으로 다시 꺼집니다.",
    "Reason": "이유",
    "Time limit": "제한 시간",
    "4-digit PIN": "4자리 PIN",
    "Turn ON": "켜기",
    "Unlock with Face ID / Fingerprint": "Face ID / 지문으로 잠금 해제",
    "Choose your language": "언어를 선택하세요",
    "Choose your country": "국가를 선택하세요",
    "This helps match you with relevant local news later on. More countries will be added over time.": "앞으로 지역에 맞는 뉴스를 보여주기 위해 사용됩니다. 지원 국가는 계속 추가될 예정입니다.",
    "Japan": "일본",
    "Mexico": "멕시코",
    "United States": "미국",
    "Set up your PINs (optional)": "PIN 설정 (선택)",
    "Set a PIN to open MyHome Browser, and a separate PIN to turn scroll ON. Leave either blank to skip it. You can turn on Face ID / Fingerprint instead later, in Settings.": "MyHome Browser를 여는 PIN과 스크롤을 켜는 PIN을 각각 설정합니다. 비워 두면 건너뜁니다. 나중에 설정에서 Face ID / 지문으로 바꿀 수도 있습니다.",
    "App Lock PIN (opens the app)": "앱 잠금 PIN (앱 열기용)",
    "Scroll PIN (turns scroll ON)": "스크롤 PIN (스크롤 켜기용)",
    "Security question": "보안 질문",
    "Select a question (optional)": "질문 선택 (선택)",
    "What was your first pet's name?": "처음 키운 반려동물의 이름은?",
    "What is your mother's maiden name?": "어머니의 결혼 전 성은?",
    "What was the name of your first school?": "처음 다닌 학교의 이름은?",
    "What city were you born in?": "태어난 도시는?",
    "What was your childhood nickname?": "어릴 때 별명은?",
    "What is your favorite food?": "가장 좋아하는 음식은?",
    "Answer": "답",
    "Skip": "건너뛰기",
    "Save & Continue": "저장하고 계속",
    "Which social media do you use?": "어떤 SNS를 사용하나요?",
    "Choose the ones you want quick access to from your dock.": "독에서 바로 열고 싶은 앱을 선택하세요.",
    "Log in to your apps": "앱에 로그인",
    "Open each app to sign in there. You can also do this later.": "각 앱을 열어 로그인하세요. 나중에 해도 됩니다.",
    "Finish setup": "설정 완료",
    "Log in": "로그인",
    "No social media selected. You can add some later from Edit Apps.": "선택한 SNS가 없습니다. 나중에 ‘앱 편집’에서 추가할 수 있습니다.",
    "Settings": "설정",
    "Close settings": "설정 닫기",
    "Open settings": "설정 열기",
    "How to use this app": "사용 방법",
    "Set a timer": "타이머 설정",
    "Look & Feel": "화면",
    "PINs & Unlock": "PIN 및 잠금 해제",
    "Reasons & Limits": "이유 및 제한 시간",
    "Appearance": "화면",
    "Green": "초록",
    "Blue": "파랑",
    "Accent color": "강조 색",
    "Background color": "배경색",
    "Choose background image": "배경 이미지 선택",
    "Remove image": "이미지 삭제",
    "Reset colors": "색 초기화",
    "Language": "언어",
    "Scroll PIN": "스크롤 PIN",
    "Required to turn scroll ON. Default is 0000 until you change it.": "스크롤을 켤 때 필요합니다. 변경 전까지 기본값은 0000입니다.",
    "New 4-digit PIN": "새 4자리 PIN",
    "Save": "저장",
    "Use Face ID / Fingerprint to turn scroll ON": "스크롤을 켤 때 Face ID / 지문 사용",
    "Face ID / Fingerprint isn't available on this device or browser.": "이 기기나 브라우저에서는 Face ID / 지문을 사용할 수 없습니다.",
    "App Lock": "앱 잠금",
    "Required every time the app opens. Default is 0000 until you change it.": "앱을 열 때마다 필요합니다. 변경 전까지 기본값은 0000입니다.",
    "Require PIN to open the app": "앱을 열 때 PIN 요구",
    "Use Face ID / Fingerprint to open the app": "앱을 열 때 Face ID / 지문 사용",
    "Recovery question (optional) — the only way to reset a forgotten App Lock PIN.": "복구 질문 (선택) — 앱 잠금 PIN을 잊었을 때 재설정할 수 있는 유일한 방법입니다.",
    "Save recovery question": "복구 질문 저장",
    "Show front camera while authenticating (visual only, doesn't verify you)": "인증 중 전면 카메라 표시 (연출용이며 본인 확인에는 사용되지 않음)",
    "Reasons": "이유",
    "Add a new reason": "이유 추가",
    "Add": "추가",
    "Time limits": "제한 시간",
    "Label (e.g. 15 min)": "이름 (예: 15분)",
    "MyHome Browser is locked": "MyHome Browser가 잠겨 있습니다",
    "Unlock": "잠금 해제",
    "Incorrect PIN": "PIN이 올바르지 않습니다",
    "Forgot PIN?": "PIN을 잊으셨나요?",
    "Your answer": "당신의 답",
    "That answer doesn't match": "답이 일치하지 않습니다",
    "Verify": "확인",
    "Set a new PIN": "새 PIN 설정",
    "Save & Unlock": "저장하고 잠금 해제",
    "No recovery question is set": "복구 질문이 설정되어 있지 않습니다",
    "You didn't set a security question for App Lock, so this PIN can't be recovered from here. To reset it, clear this app's data in your browser/PWA settings — note that this also resets your other MyHome Browser settings.": "앱 잠금용 보안 질문을 설정하지 않아 여기서는 PIN을 복구할 수 없습니다. 재설정하려면 브라우저/PWA 설정에서 이 앱의 데이터를 삭제하세요(다른 설정도 함께 초기화됩니다).",
    "Back": "뒤로",
    "PIN updated": "PIN을 변경했습니다",
    "PIN reset": "PIN을 재설정했습니다",
    "PIN must be exactly 4 digits": "PIN은 4자리 숫자여야 합니다",
    "App Lock PIN must be exactly 4 digits": "앱 잠금 PIN은 4자리 숫자여야 합니다",
    "Scroll PIN must be exactly 4 digits": "스크롤 PIN은 4자리 숫자여야 합니다",
    "App Lock PIN updated": "앱 잠금 PIN을 변경했습니다",
    "App Lock enabled": "앱 잠금을 켰습니다",
    "App Lock disabled": "앱 잠금을 껐습니다",
    "Recovery question saved": "복구 질문을 저장했습니다",
    "Enter both a question and an answer": "질문과 답을 모두 입력하세요",
    "Fill in both the question and answer, or leave both blank": "질문과 답을 모두 입력하거나 둘 다 비워 두세요",
    "Setup complete": "설정이 완료되었습니다",
    "Scroll turned OFF": "스크롤을 껐습니다",
    "Time's up — scroll switched back OFF": "시간이 다 되어 스크롤을 다시 껐습니다",
    "Timer's up": "타이머 종료",
    "Timer canceled": "타이머를 취소했습니다",
    "Set at least 1 second": "1초 이상으로 설정하세요",
    "Could not load that image": "이미지를 불러오지 못했습니다",
    "Not enough storage to save that": "저장할 공간이 부족합니다",
    "Face ID / Fingerprint enabled for App Lock": "앱 잠금에 Face ID / 지문을 사용합니다",
    "Face ID / Fingerprint disabled for App Lock": "앱 잠금의 Face ID / 지문을 껐습니다",
    "Face ID / Fingerprint enabled for Scroll PIN": "스크롤 PIN에 Face ID / 지문을 사용합니다",
    "Face ID / Fingerprint disabled for Scroll PIN": "스크롤 PIN의 Face ID / 지문을 껐습니다",
    "Face ID / Fingerprint failed": "Face ID / 지문 인증에 실패했습니다",
    "Couldn't set up Face ID / Fingerprint": "Face ID / 지문을 설정하지 못했습니다",
    "Checking the news": "뉴스 보기",
    "Chatting with friends on social media": "SNS에서 친구와 이야기하기",
    "Looking something up": "무언가 찾아보기",
    "Taking a break": "잠시 쉬기",
    "5 min": "5분",
    "10 min": "10분",
    "30 min": "30분",
    "Turned ON {count} time": "켠 횟수 {count}회",
    "Turned ON {count} times": "켠 횟수 {count}회",
    "scrolled {count} time": "스크롤 {count}회",
    "scrolled {count} times": "스크롤 {count}회",
    "Opened {count} time": "연 횟수 {count}회",
    "Opened {count} times": "연 횟수 {count}회",
    "canceled {count}": "취소 {count}회",
    "~{total} total (avg {avg})": "합계 약 {total}(평균 {avg})",
    "{reason} · {time} left": "{reason} · {time} 남음",
    "{time} left — the app will lock when this reaches 0:00.": "{time} 남음 — 0:00이 되면 앱이 잠깁니다.",
    "{time} left. This is just a timer; nothing else happens at 0:00.": "{time} 남음. 단순한 타이머이며 0:00이 되어도 다른 일은 일어나지 않습니다.",
    "{minutes} min": "{minutes}분",
    "Remove \"{name}\"": "'{name}' 삭제",
    "{label} ({minutes} min)": "{label}({minutes}분)",
    "{label} · {index} of {total}": "{label} · {index} / {total}",
    "Timer started — app locks in {label}": "타이머 시작 — {label} 후 앱이 잠깁니다",
    "Timer started for {label}": "{label} 타이머를 시작했습니다",
    "Open {app}?": "{app}을(를) 열까요?",
    "You're about to leave MyHome Browser to open {app}.": "MyHome Browser를 나가서 {app}을(를) 열려고 합니다.",
    "{hours}h": "{hours}시간",
    "{minutes}m": "{minutes}분",
    "{seconds}s": "{seconds}초",
    "{minutes}m {seconds}s": "{minutes}분 {seconds}초",
    "The whole app is shown in this language.": "앱 전체가 이 언어로 표시됩니다.",
    "Time's up! MyHome Browser is locked until you unlock it.": "시간이 되었습니다. 잠금을 해제할 때까지 MyHome Browser는 잠깁니다.",
    "Custom…": "직접 입력…",
    "Set a time limit of at least 1 minute": "제한 시간은 1분 이상으로 설정하세요",
    "{hours}h {minutes}m": "{hours}시간 {minutes}분",
    "Today": "오늘",
    "Daily usage goal": "하루 목표",
    "Set your own daily time limit across all apps and scroll time. Insights tracks your progress against your own number, not one this app picked for you.": "모든 앱과 스크롤 시간을 합친 하루 시간 한도를 직접 정하세요. 통계는 이 앱이 정한 숫자가 아니라 본인이 정한 숫자를 기준으로 진행 상황을 보여줍니다.",
    "Minutes per day": "하루 분 수",
    "Remove goal": "목표 삭제",
    "{used} of your {goal} goal": "목표 {goal} 중 {used} 사용",
    "{count} day within your goal": "목표 이내로 {count}일 연속",
    "{count} days within your goal": "목표 이내로 {count}일 연속",
    "Set a daily goal in Settings to track your progress": "설정에서 하루 목표를 정하면 진행 상황을 볼 수 있습니다",
    "{percent}% above your recent average": "최근 평균보다 {percent}% 많음",
    "{percent}% below your recent average": "최근 평균보다 {percent}% 적음",
    "Enter a number of minutes": "분 수를 입력하세요",
    "Goal saved": "목표를 저장했습니다",
    "Goal removed": "목표를 삭제했습니다",
    "Why this app exists": "이 앱을 만든 이유",
    "A few things research has found about how we touch, scroll, and swipe our phones — not to make you feel bad, just so the friction in this app is based on something real.": "우리가 스마트폰을 만지고, 스크롤하고, 스와이프하는 방식에 대해 연구가 밝혀낸 몇 가지 사실입니다. 기분 나쁘게 하려는 게 아니라, 이 앱의 '작은 번거로움'이 실제 근거에 바탕을 두고 있다는 것을 알려드리기 위해서입니다.",
    "Touching:": "터치 횟수:",
    "a 2016 study by the research firm dscout found the average person touches their phone about 2,617 times a day — the heaviest users, over 5,400 times.": "2016년 조사기관 dscout의 연구에 따르면 평균적으로 하루에 약 2,617번 스마트폰을 터치하며, 가장 많이 사용하는 사람은 5,400번을 넘었습니다.",
    "Scrolling:": "스크롤:",
    "infinite-scroll feeds run on the same unpredictable, variable reward pattern that makes slot machines hard to put down, a design choice researchers and former tech insiders have directly compared to gambling psychology.": "무한 스크롤 피드는 슬롯머신을 끊기 어렵게 만드는 것과 같은, 예측할 수 없는 가변 보상 패턴으로 설계되어 있습니다. 연구자들과 전직 테크업계 관계자들은 이를 도박 심리와 직접 비교해 왔습니다.",
    "Checking:": "확인 습관:",
    "a habit-formation study by Oulasvirta and colleagues (2012) found most phone checks last under 30 seconds and are triggered by boredom or habit, not real need — part of why they're hard to even notice.": "Oulasvirta와 동료들의 2012년 습관 형성 연구에 따르면, 대부분의 폰 확인은 30초 미만으로 이루어지며 실제 필요보다는 지루함이나 습관에 의해 촉발됩니다. 이것이 눈치채기 어려운 이유이기도 합니다.",
    "Posture:": "자세:",
    "tilting your head forward to look at a phone can add up to 60 lbs of effective strain on your neck, according to spinal-stress research by Dr. Kenneth Hansraj (2014).": "Kenneth Hansraj 박사의 2014년 척추 부담 연구에 따르면, 폰을 보기 위해 고개를 숙이면 목에 최대 약 27kg에 달하는 부담이 가해질 수 있습니다.",
    "None of this is about guilt. It's why a reason, a time limit, and a PIN can do more than willpower alone.": "이 모든 것은 죄책감을 주기 위한 것이 아닙니다. 그래서 이유, 제한 시간, PIN이 의지력만으로는 부족한 부분을 채워줄 수 있습니다.",
    "Last 7 days": "최근 7일",
    "{count} quick check": "반사적 확인 {count}회",
    "{count} quick checks": "반사적 확인 {count}회",
    "{count} longer session": "의도적 사용 {count}회",
    "{count} longer sessions": "의도적 사용 {count}회",
    "Posture": "자세",
    "Remind me to check my posture every 10 minutes while scroll is ON": "스크롤이 켜져 있는 동안 10분마다 자세를 확인하도록 알려주세요",
    "Posture check: try sitting up and holding the phone at eye level for a moment.": "자세 확인: 잠시 허리를 펴고 휴대폰을 눈높이에 맞춰 들어보세요.",
    "By hour of day": "시간대별",
    "This sets the language for the rest of the app.": "앱 전체의 표시 언어가 됩니다.",
    "Step 1 of 6": "6단계 중 1단계",
    "Step 2 of 6": "6단계 중 2단계",
    "Step 3 of 6": "6단계 중 3단계",
    "Step 4 of 6": "6단계 중 4단계",
    "Step 5 of 6": "6단계 중 5단계",
    "Step 6 of 6": "6단계 중 6단계",
    "Blocked: this looks like an ad or tracking domain": "차단됨: 광고 또는 추적 도메인으로 보입니다",
    "Remove bookmark": "북마크 삭제",
    "Bookmark this page": "이 페이지 북마크",
    "No bookmarks yet. Open a page and tap the star to save it.": "아직 북마크가 없습니다. 페이지를 열고 별표를 눌러 저장하세요.",
    "Bookmark removed": "북마크가 삭제되었습니다",
    "Bookmark added": "북마크가 추가되었습니다",
    "Close tab \"{title}\"": "탭 \"{title}\" 닫기",
    "Bookmarks": "북마크",
    "Insights": "사용 통계",
    "Search or enter a website above to start browsing.": "위에서 검색하거나 웹사이트 주소를 입력해 탐색을 시작하세요.",
    "Open bookmarks": "북마크 열기",
    "Open insights": "사용 통계 열기",
    "Search or go to address": "검색 또는 주소로 이동",
    "Search or enter address": "검색어 또는 주소 입력",
    "Open in browser": "브라우저에서 열기",
    "Close insights": "사용 통계 닫기",
    "Close bookmarks": "북마크 닫기",
    "Type a search or a website above — it opens as a new tab you can browse right here.": "위에 검색어나 웹사이트를 입력하면 새 탭으로 열려 바로 여기서 볼 수 있습니다.",
    "Switch tabs with the pills above the page. Tap the star to bookmark one; Bookmarks and Insights up top stay empty until you tap them.": "페이지 위의 알약 모양 탭으로 전환하세요. 별표를 누르면 북마크에 저장되고, 상단의 북마크와 인사이트 버튼은 누르기 전까지 아무것도 표시되지 않습니다.",
    "Ad blocking only stops navigating straight to known ad/tracking domains — it can't remove ads from a page you're already on.": "광고 차단은 알려진 광고/추적 도메인으로 바로 이동하는 것만 막습니다. 이미 열려 있는 페이지 안의 광고까지는 제거하지 못합니다.",
  },
  zh: {
    "Scroll OFF": "滚动 关闭",
    "Scroll ON": "滚动 开启",
    "Timer": "计时器",
    "Setting": "设置",
    "Tips": "提示",
    "Got it": "知道了",
    "Hours": "小时",
    "Minutes": "分钟",
    "Seconds": "秒",
    "Start": "开始",
    "Cancel timer": "取消计时器",
    "Lock the app when time's up": "时间到时锁定应用",
    "Use it as a plain timer, or have it lock the app when time's up to limit your phone use.": "可当作普通计时器使用，也可以在时间到时锁定应用，帮助你控制手机使用时间。",
    "Scroll is OFF by default to limit distraction. Turn it ON with a reason, a time limit, and your PIN only when you really need to scroll freely.": "为减少干扰，滚动默认关闭。只有确实需要自由滚动时，才输入理由、时间限制和 PIN 来开启。",
    "Prev": "上一页",
    "Next": "下一页",
    "All time": "全部时间",
    "Hour": "小时",
    "Day": "天",
    "Month": "月",
    "Year": "年",
    "Now": "现在",
    "Time spent per app": "各应用的使用时长",
    "Scroll": "滚动",
    "Choose a time period": "选择时间范围",
    "Previous period": "上一个时间段",
    "Next period": "下一个时间段",
    "Previous month": "上个月",
    "Next month": "下个月",
    "App Insights": "应用统计",
    "How often you open each app from the dock, and roughly how long you're away for. Times are estimated from when you leave and come back to this app, not from inside the other app.": "你从下方栏中打开各应用的次数，以及大致离开的时长。时长是根据你离开本应用到返回之间估算的，并非来自其他应用内部。",
    "No data yet. Insights appear once you open an app from the dock or turn scroll ON.": "暂无数据。从下方栏打开应用或开启滚动后即会显示。",
    "No activity in this hour.": "这一小时内没有记录。",
    "No activity on this day.": "这一天没有记录。",
    "No activity in this month.": "这个月没有记录。",
    "No activity in this year.": "这一年没有记录。",
    "Hide Apps": "隐藏应用",
    "Show Apps": "显示应用",
    "Edit Apps": "编辑应用",
    "Choose apps (up to 10)": "选择应用（最多 10 个）",
    "The list of apps installed on your phone can't be read automatically from a web page, so pick from the candidates below instead.": "网页无法自动读取手机上已安装的应用列表，请从下面的候选中选择。",
    "Add up to 10 apps from \"Edit Apps\"": "可从「编辑应用」中最多添加 10 个",
    "Open this app?": "要打开这个应用吗？",
    "Open": "打开",
    "Cancel": "取消",
    "Turn scroll ON": "开启滚动",
    "Choose a reason and a time limit. Scroll will switch back OFF automatically when time is up.": "请选择理由和时间限制。时间到后会自动关闭滚动。",
    "Reason": "理由",
    "Time limit": "时间限制",
    "4-digit PIN": "4 位 PIN",
    "Turn ON": "开启",
    "Unlock with Face ID / Fingerprint": "使用面容 / 指纹解锁",
    "Choose your language": "选择语言",
    "Choose your country": "选择国家",
    "This helps match you with relevant local news later on. More countries will be added over time.": "用于今后为你匹配相关的本地新闻。将陆续增加更多国家。",
    "Japan": "日本",
    "Mexico": "墨西哥",
    "United States": "美国",
    "Set up your PINs (optional)": "设置 PIN（可选）",
    "Set a PIN to open MyHome Browser, and a separate PIN to turn scroll ON. Leave either blank to skip it. You can turn on Face ID / Fingerprint instead later, in Settings.": "分别设置打开 MyHome Browser 的 PIN 和开启滚动的 PIN。留空即可跳过。之后也可以在设置中改用面容 / 指纹。",
    "App Lock PIN (opens the app)": "应用锁 PIN（用于打开应用）",
    "Scroll PIN (turns scroll ON)": "滚动 PIN（用于开启滚动）",
    "Security question": "安全问题",
    "Select a question (optional)": "选择一个问题（可选）",
    "What was your first pet's name?": "你第一只宠物叫什么名字？",
    "What is your mother's maiden name?": "你母亲的婚前姓氏是什么？",
    "What was the name of your first school?": "你就读的第一所学校叫什么？",
    "What city were you born in?": "你出生在哪个城市？",
    "What was your childhood nickname?": "你小时候的绰号是什么？",
    "What is your favorite food?": "你最喜欢的食物是什么？",
    "Answer": "答案",
    "Skip": "跳过",
    "Save & Continue": "保存并继续",
    "Which social media do you use?": "你使用哪些社交应用？",
    "Choose the ones you want quick access to from your dock.": "请选择希望在下方栏中快速打开的应用。",
    "Log in to your apps": "登录你的应用",
    "Open each app to sign in there. You can also do this later.": "逐个打开应用进行登录。也可以稍后再做。",
    "Finish setup": "完成设置",
    "Log in": "登录",
    "No social media selected. You can add some later from Edit Apps.": "尚未选择社交应用。之后可从「编辑应用」中添加。",
    "Settings": "设置",
    "Close settings": "关闭设置",
    "Open settings": "打开设置",
    "How to use this app": "使用方法",
    "Set a timer": "设置计时器",
    "Look & Feel": "外观",
    "PINs & Unlock": "PIN 与解锁",
    "Reasons & Limits": "理由与时间限制",
    "Appearance": "外观",
    "Green": "绿色",
    "Blue": "蓝色",
    "Accent color": "强调色",
    "Background color": "背景色",
    "Choose background image": "选择背景图片",
    "Remove image": "移除图片",
    "Reset colors": "重置颜色",
    "Language": "语言",
    "Scroll PIN": "滚动 PIN",
    "Required to turn scroll ON. Default is 0000 until you change it.": "开启滚动时需要。修改前默认为 0000。",
    "New 4-digit PIN": "新的 4 位 PIN",
    "Save": "保存",
    "Use Face ID / Fingerprint to turn scroll ON": "使用面容 / 指纹开启滚动",
    "Face ID / Fingerprint isn't available on this device or browser.": "此设备或浏览器不支持面容 / 指纹认证。",
    "App Lock": "应用锁",
    "Required every time the app opens. Default is 0000 until you change it.": "每次打开应用时都需要。修改前默认为 0000。",
    "Require PIN to open the app": "打开应用时需要 PIN",
    "Use Face ID / Fingerprint to open the app": "使用面容 / 指纹打开应用",
    "Recovery question (optional) — the only way to reset a forgotten App Lock PIN.": "找回问题（可选）——忘记应用锁 PIN 时唯一的重置方式。",
    "Save recovery question": "保存找回问题",
    "Show front camera while authenticating (visual only, doesn't verify you)": "认证时显示前置摄像头（仅作视觉效果，不用于验证身份）",
    "Reasons": "理由",
    "Add a new reason": "添加理由",
    "Add": "添加",
    "Time limits": "时间限制",
    "Label (e.g. 15 min)": "名称（例如：15 分钟）",
    "MyHome Browser is locked": "MyHome Browser 已锁定",
    "Unlock": "解锁",
    "Incorrect PIN": "PIN 不正确",
    "Forgot PIN?": "忘记 PIN？",
    "Your answer": "你的答案",
    "That answer doesn't match": "答案不匹配",
    "Verify": "验证",
    "Set a new PIN": "设置新的 PIN",
    "Save & Unlock": "保存并解锁",
    "No recovery question is set": "未设置找回问题",
    "You didn't set a security question for App Lock, so this PIN can't be recovered from here. To reset it, clear this app's data in your browser/PWA settings — note that this also resets your other MyHome Browser settings.": "你没有为应用锁设置安全问题，因此无法在此找回 PIN。若要重置，请在浏览器/PWA 设置中清除本应用的数据（这也会重置其他设置）。",
    "Back": "返回",
    "PIN updated": "PIN 已更新",
    "PIN reset": "PIN 已重置",
    "PIN must be exactly 4 digits": "PIN 必须是 4 位数字",
    "App Lock PIN must be exactly 4 digits": "应用锁 PIN 必须是 4 位数字",
    "Scroll PIN must be exactly 4 digits": "滚动 PIN 必须是 4 位数字",
    "App Lock PIN updated": "应用锁 PIN 已更新",
    "App Lock enabled": "已启用应用锁",
    "App Lock disabled": "已停用应用锁",
    "Recovery question saved": "找回问题已保存",
    "Enter both a question and an answer": "请同时填写问题和答案",
    "Fill in both the question and answer, or leave both blank": "问题和答案请同时填写，或同时留空",
    "Setup complete": "设置已完成",
    "Scroll turned OFF": "已关闭滚动",
    "Time's up — scroll switched back OFF": "时间到，滚动已关闭",
    "Timer's up": "计时结束",
    "Timer canceled": "已取消计时器",
    "Set at least 1 second": "请设置至少 1 秒",
    "Could not load that image": "无法加载该图片",
    "Not enough storage to save that": "存储空间不足，无法保存",
    "Face ID / Fingerprint enabled for App Lock": "已为应用锁启用面容 / 指纹",
    "Face ID / Fingerprint disabled for App Lock": "已为应用锁停用面容 / 指纹",
    "Face ID / Fingerprint enabled for Scroll PIN": "已为滚动 PIN 启用面容 / 指纹",
    "Face ID / Fingerprint disabled for Scroll PIN": "已为滚动 PIN 停用面容 / 指纹",
    "Face ID / Fingerprint failed": "面容 / 指纹认证失败",
    "Couldn't set up Face ID / Fingerprint": "无法设置面容 / 指纹认证",
    "Checking the news": "看新闻",
    "Chatting with friends on social media": "在社交平台和朋友聊天",
    "Looking something up": "查资料",
    "Taking a break": "休息一下",
    "5 min": "5 分钟",
    "10 min": "10 分钟",
    "30 min": "30 分钟",
    "Turned ON {count} time": "开启 {count} 次",
    "Turned ON {count} times": "开启 {count} 次",
    "scrolled {count} time": "滚动 {count} 次",
    "scrolled {count} times": "滚动 {count} 次",
    "Opened {count} time": "打开 {count} 次",
    "Opened {count} times": "打开 {count} 次",
    "canceled {count}": "取消 {count} 次",
    "~{total} total (avg {avg})": "共约 {total}（平均 {avg}）",
    "{reason} · {time} left": "{reason} · 剩余 {time}",
    "{time} left — the app will lock when this reaches 0:00.": "剩余 {time} —— 到 0:00 时应用会被锁定。",
    "{time} left. This is just a timer; nothing else happens at 0:00.": "剩余 {time}。这只是一个计时器，到 0:00 时不会发生其他事情。",
    "{minutes} min": "{minutes} 分钟",
    "Remove \"{name}\"": "删除“{name}”",
    "{label} ({minutes} min)": "{label}（{minutes} 分钟）",
    "{label} · {index} of {total}": "{label} · 第 {index} / {total} 页",
    "Timer started — app locks in {label}": "计时开始 —— {label}后锁定应用",
    "Timer started for {label}": "已开始 {label} 的计时",
    "Open {app}?": "要打开 {app} 吗？",
    "You're about to leave MyHome Browser to open {app}.": "你即将离开 MyHome Browser 去打开 {app}。",
    "{hours}h": "{hours} 小时",
    "{minutes}m": "{minutes} 分",
    "{seconds}s": "{seconds} 秒",
    "{minutes}m {seconds}s": "{minutes} 分 {seconds} 秒",
    "The whole app is shown in this language.": "整个应用都会以此语言显示。",
    "Time's up! MyHome Browser is locked until you unlock it.": "时间到了！在你解锁之前，MyHome Browser 将保持锁定。",
    "Custom…": "自定义…",
    "Set a time limit of at least 1 minute": "时间限制请设置为至少 1 分钟",
    "{hours}h {minutes}m": "{hours} 小时 {minutes} 分",
    "Today": "今天",
    "Daily usage goal": "每日目标",
    "Set your own daily time limit across all apps and scroll time. Insights tracks your progress against your own number, not one this app picked for you.": "为所有应用加上滚动时间设定属于你自己的每日时间上限。统计会对照你自己设定的数字来显示进度，而不是本应用替你决定的数字。",
    "Minutes per day": "每天的分钟数",
    "Remove goal": "删除目标",
    "{used} of your {goal} goal": "已用 {used}，目标为 {goal}",
    "{count} day within your goal": "已连续 {count} 天达标",
    "{count} days within your goal": "已连续 {count} 天达标",
    "Set a daily goal in Settings to track your progress": "在设置中设定每日目标即可查看进度",
    "{percent}% above your recent average": "比近期平均值高 {percent}%",
    "{percent}% below your recent average": "比近期平均值低 {percent}%",
    "Enter a number of minutes": "请输入分钟数",
    "Goal saved": "目标已保存",
    "Goal removed": "目标已删除",
    "Why this app exists": "为什么会有这款应用",
    "A few things research has found about how we touch, scroll, and swipe our phones — not to make you feel bad, just so the friction in this app is based on something real.": "以下是一些关于我们如何触摸、滚动、滑动手机的研究发现——不是为了让你难受，只是想让你知道这款应用里的“小麻烦”是有依据的。",
    "Touching:": "触摸次数：",
    "a 2016 study by the research firm dscout found the average person touches their phone about 2,617 times a day — the heaviest users, over 5,400 times.": "调研机构 dscout 在 2016 年的一项研究发现，普通人平均每天触摸手机约 2617 次，使用最频繁的人甚至超过 5400 次。",
    "Scrolling:": "滚动刷新：",
    "infinite-scroll feeds run on the same unpredictable, variable reward pattern that makes slot machines hard to put down, a design choice researchers and former tech insiders have directly compared to gambling psychology.": "无限滚动的信息流采用的是和老虎机一样的不确定、可变奖励机制，让人很难停下来。研究者和前科技公司从业者都曾将其直接类比为赌博心理学。",
    "Checking:": "反复查看：",
    "a habit-formation study by Oulasvirta and colleagues (2012) found most phone checks last under 30 seconds and are triggered by boredom or habit, not real need — part of why they're hard to even notice.": "Oulasvirta 等人在 2012 年的一项习惯养成研究发现，大多数查看手机的行为持续不到 30 秒，是由无聊或习惯触发的，而非真正的需要——这也是它难以被察觉的部分原因。",
    "Posture:": "姿势负担：",
    "tilting your head forward to look at a phone can add up to 60 lbs of effective strain on your neck, according to spinal-stress research by Dr. Kenneth Hansraj (2014).": "根据 Kenneth Hansraj 博士 2014 年的脊柱压力研究，低头看手机会给颈部带来相当于约 27 公斤的额外负荷。",
    "None of this is about guilt. It's why a reason, a time limit, and a PIN can do more than willpower alone.": "这些都不是为了让你有负罪感。正因如此，一个理由、一个时间限制和一个 PIN，往往比单靠意志力更管用。",
    "Last 7 days": "最近 7 天",
    "{count} quick check": "反射性查看 {count} 次",
    "{count} quick checks": "反射性查看 {count} 次",
    "{count} longer session": "有意使用 {count} 次",
    "{count} longer sessions": "有意使用 {count} 次",
    "Posture": "姿势",
    "Remind me to check my posture every 10 minutes while scroll is ON": "滚动开启期间，每 10 分钟提醒我检查姿势",
    "Posture check: try sitting up and holding the phone at eye level for a moment.": "姿势提醒：试着坐直，把手机拿到与眼睛齐平的高度片刻。",
    "By hour of day": "按时段",
    "This sets the language for the rest of the app.": "这将作为整个应用的显示语言。",
    "Step 1 of 6": "第1步（共6步）",
    "Step 2 of 6": "第2步（共6步）",
    "Step 3 of 6": "第3步（共6步）",
    "Step 4 of 6": "第4步（共6步）",
    "Step 5 of 6": "第5步（共6步）",
    "Step 6 of 6": "第6步（共6步）",
    "Blocked: this looks like an ad or tracking domain": "已拦截：这看起来是广告或跟踪域名",
    "Remove bookmark": "移除书签",
    "Bookmark this page": "收藏此页面",
    "No bookmarks yet. Open a page and tap the star to save it.": "还没有书签。打开一个页面并点击星标即可保存。",
    "Bookmark removed": "书签已移除",
    "Bookmark added": "书签已添加",
    "Close tab \"{title}\"": "关闭标签页“{title}”",
    "Bookmarks": "书签",
    "Insights": "使用统计",
    "Search or enter a website above to start browsing.": "在上方搜索或输入网址即可开始浏览。",
    "Open bookmarks": "打开书签",
    "Open insights": "打开使用统计",
    "Search or go to address": "搜索或前往网址",
    "Search or enter address": "搜索或输入网址",
    "Open in browser": "在浏览器中打开",
    "Close insights": "关闭使用统计",
    "Close bookmarks": "关闭书签",
    "Type a search or a website above — it opens as a new tab you can browse right here.": "在上方输入搜索词或网址，即可作为新标签页在此打开浏览。",
    "Switch tabs with the pills above the page. Tap the star to bookmark one; Bookmarks and Insights up top stay empty until you tap them.": "用上方的小药丸切换标签页。点击星标可收藏；上方的书签和使用统计按钮在你点开之前都不会显示任何内容。",
    "Ad blocking only stops navigating straight to known ad/tracking domains — it can't remove ads from a page you're already on.": "广告拦截只会阻止直接前往已知的广告/跟踪域名，无法清除你已打开页面内部的广告。",
  },
  es: {
    "Scroll OFF": "Scroll DESACT.",
    "Scroll ON": "Scroll ACTIVO",
    "Timer": "Temporizador",
    "Setting": "Ajustes",
    "Tips": "Consejos",
    "Got it": "Entendido",
    "Hours": "Horas",
    "Minutes": "Minutos",
    "Seconds": "Segundos",
    "Start": "Iniciar",
    "Cancel timer": "Cancelar temporizador",
    "Lock the app when time's up": "Bloquear la app al terminar el tiempo",
    "Use it as a plain timer, or have it lock the app when time's up to limit your phone use.": "Úsalo como temporizador normal, o haz que bloquee la app al terminar para limitar el uso del móvil.",
    "Scroll is OFF by default to limit distraction. Turn it ON with a reason, a time limit, and your PIN only when you really need to scroll freely.": "El scroll está desactivado por defecto para evitar distracciones. Actívalo con un motivo, un límite de tiempo y tu PIN solo cuando de verdad lo necesites.",
    "Prev": "Anterior",
    "Next": "Siguiente",
    "All time": "Todo el tiempo",
    "Hour": "Hora",
    "Day": "Día",
    "Month": "Mes",
    "Year": "Año",
    "Now": "Ahora",
    "Time spent per app": "Tiempo por aplicación",
    "Scroll": "Scroll",
    "Choose a time period": "Elegir un periodo",
    "Previous period": "Periodo anterior",
    "Next period": "Periodo siguiente",
    "Previous month": "Mes anterior",
    "Next month": "Mes siguiente",
    "App Insights": "Estadísticas de apps",
    "How often you open each app from the dock, and roughly how long you're away for. Times are estimated from when you leave and come back to this app, not from inside the other app.": "Con qué frecuencia abres cada app desde el dock y cuánto tiempo estás fuera, aproximadamente. Los tiempos se estiman desde que sales hasta que vuelves a esta app, no desde dentro de la otra.",
    "No data yet. Insights appear once you open an app from the dock or turn scroll ON.": "Aún no hay datos. Las estadísticas aparecen cuando abres una app desde el dock o activas el scroll.",
    "No activity in this hour.": "Sin actividad en esta hora.",
    "No activity on this day.": "Sin actividad este día.",
    "No activity in this month.": "Sin actividad este mes.",
    "No activity in this year.": "Sin actividad este año.",
    "Hide Apps": "Ocultar apps",
    "Show Apps": "Mostrar apps",
    "Edit Apps": "Editar apps",
    "Choose apps (up to 10)": "Elegir apps (hasta 10)",
    "The list of apps installed on your phone can't be read automatically from a web page, so pick from the candidates below instead.": "Una página web no puede leer automáticamente las apps instaladas en tu móvil, así que elige entre las opciones de abajo.",
    "Add up to 10 apps from \"Edit Apps\"": "Añade hasta 10 apps desde «Editar apps»",
    "Open this app?": "¿Abrir esta app?",
    "Open": "Abrir",
    "Cancel": "Cancelar",
    "Turn scroll ON": "Activar el scroll",
    "Choose a reason and a time limit. Scroll will switch back OFF automatically when time is up.": "Elige un motivo y un límite de tiempo. El scroll se desactivará solo cuando se acabe el tiempo.",
    "Reason": "Motivo",
    "Time limit": "Límite de tiempo",
    "4-digit PIN": "PIN de 4 dígitos",
    "Turn ON": "Activar",
    "Unlock with Face ID / Fingerprint": "Desbloquear con Face ID / huella",
    "Choose your language": "Elige tu idioma",
    "Choose your country": "Elige tu país",
    "This helps match you with relevant local news later on. More countries will be added over time.": "Sirve para mostrarte noticias locales relevantes más adelante. Se añadirán más países con el tiempo.",
    "Japan": "Japón",
    "Mexico": "México",
    "United States": "Estados Unidos",
    "Set up your PINs (optional)": "Configura tus PIN (opcional)",
    "Set a PIN to open MyHome Browser, and a separate PIN to turn scroll ON. Leave either blank to skip it. You can turn on Face ID / Fingerprint instead later, in Settings.": "Define un PIN para abrir MyHome Browser y otro distinto para activar el scroll. Deja cualquiera en blanco para omitirlo. Más adelante puedes usar Face ID / huella desde Ajustes.",
    "App Lock PIN (opens the app)": "PIN de bloqueo (para abrir la app)",
    "Scroll PIN (turns scroll ON)": "PIN de scroll (para activarlo)",
    "Security question": "Pregunta de seguridad",
    "Select a question (optional)": "Elige una pregunta (opcional)",
    "What was your first pet's name?": "¿Cómo se llamaba tu primera mascota?",
    "What is your mother's maiden name?": "¿Cuál es el apellido de soltera de tu madre?",
    "What was the name of your first school?": "¿Cómo se llamaba tu primera escuela?",
    "What city were you born in?": "¿En qué ciudad naciste?",
    "What was your childhood nickname?": "¿Cuál era tu apodo de niño?",
    "What is your favorite food?": "¿Cuál es tu comida favorita?",
    "Answer": "Respuesta",
    "Skip": "Omitir",
    "Save & Continue": "Guardar y continuar",
    "Which social media do you use?": "¿Qué redes sociales usas?",
    "Choose the ones you want quick access to from your dock.": "Elige las que quieras tener a mano en el dock.",
    "Log in to your apps": "Inicia sesión en tus apps",
    "Open each app to sign in there. You can also do this later.": "Abre cada app para iniciar sesión. También puedes hacerlo más tarde.",
    "Finish setup": "Finalizar configuración",
    "Log in": "Iniciar sesión",
    "No social media selected. You can add some later from Edit Apps.": "No has elegido ninguna red social. Puedes añadirlas después desde «Editar apps».",
    "Settings": "Ajustes",
    "Close settings": "Cerrar ajustes",
    "Open settings": "Abrir ajustes",
    "How to use this app": "Cómo usar esta app",
    "Set a timer": "Poner un temporizador",
    "Look & Feel": "Aspecto",
    "PINs & Unlock": "PIN y desbloqueo",
    "Reasons & Limits": "Motivos y límites",
    "Appearance": "Apariencia",
    "Green": "Verde",
    "Blue": "Azul",
    "Accent color": "Color de acento",
    "Background color": "Color de fondo",
    "Choose background image": "Elegir imagen de fondo",
    "Remove image": "Quitar imagen",
    "Reset colors": "Restablecer colores",
    "Language": "Idioma",
    "Scroll PIN": "PIN de scroll",
    "Required to turn scroll ON. Default is 0000 until you change it.": "Necesario para activar el scroll. Por defecto es 0000 hasta que lo cambies.",
    "New 4-digit PIN": "Nuevo PIN de 4 dígitos",
    "Save": "Guardar",
    "Use Face ID / Fingerprint to turn scroll ON": "Usar Face ID / huella para activar el scroll",
    "Face ID / Fingerprint isn't available on this device or browser.": "Face ID / huella no está disponible en este dispositivo o navegador.",
    "App Lock": "Bloqueo de la app",
    "Required every time the app opens. Default is 0000 until you change it.": "Necesario cada vez que se abre la app. Por defecto es 0000 hasta que lo cambies.",
    "Require PIN to open the app": "Pedir PIN para abrir la app",
    "Use Face ID / Fingerprint to open the app": "Usar Face ID / huella para abrir la app",
    "Recovery question (optional) — the only way to reset a forgotten App Lock PIN.": "Pregunta de recuperación (opcional): la única forma de restablecer un PIN olvidado.",
    "Save recovery question": "Guardar pregunta de recuperación",
    "Show front camera while authenticating (visual only, doesn't verify you)": "Mostrar la cámara frontal al autenticar (solo visual, no te verifica)",
    "Reasons": "Motivos",
    "Add a new reason": "Añadir un motivo",
    "Add": "Añadir",
    "Time limits": "Límites de tiempo",
    "Label (e.g. 15 min)": "Etiqueta (p. ej. 15 min)",
    "MyHome Browser is locked": "MyHome Browser está bloqueado",
    "Unlock": "Desbloquear",
    "Incorrect PIN": "PIN incorrecto",
    "Forgot PIN?": "¿Olvidaste el PIN?",
    "Your answer": "Tu respuesta",
    "That answer doesn't match": "La respuesta no coincide",
    "Verify": "Verificar",
    "Set a new PIN": "Define un PIN nuevo",
    "Save & Unlock": "Guardar y desbloquear",
    "No recovery question is set": "No hay pregunta de recuperación",
    "You didn't set a security question for App Lock, so this PIN can't be recovered from here. To reset it, clear this app's data in your browser/PWA settings — note that this also resets your other MyHome Browser settings.": "No configuraste una pregunta de seguridad para el bloqueo, así que el PIN no se puede recuperar desde aquí. Para restablecerlo, borra los datos de esta app en los ajustes del navegador/PWA (esto también borrará tus demás ajustes).",
    "Back": "Volver",
    "PIN updated": "PIN actualizado",
    "PIN reset": "PIN restablecido",
    "PIN must be exactly 4 digits": "El PIN debe tener exactamente 4 dígitos",
    "App Lock PIN must be exactly 4 digits": "El PIN de bloqueo debe tener exactamente 4 dígitos",
    "Scroll PIN must be exactly 4 digits": "El PIN de scroll debe tener exactamente 4 dígitos",
    "App Lock PIN updated": "PIN de bloqueo actualizado",
    "App Lock enabled": "Bloqueo de la app activado",
    "App Lock disabled": "Bloqueo de la app desactivado",
    "Recovery question saved": "Pregunta de recuperación guardada",
    "Enter both a question and an answer": "Introduce la pregunta y la respuesta",
    "Fill in both the question and answer, or leave both blank": "Rellena la pregunta y la respuesta, o deja las dos en blanco",
    "Setup complete": "Configuración completada",
    "Scroll turned OFF": "Scroll desactivado",
    "Time's up — scroll switched back OFF": "Se acabó el tiempo: el scroll se ha desactivado",
    "Timer's up": "Tiempo cumplido",
    "Timer canceled": "Temporizador cancelado",
    "Set at least 1 second": "Indica al menos 1 segundo",
    "Could not load that image": "No se pudo cargar esa imagen",
    "Not enough storage to save that": "No hay espacio suficiente para guardarlo",
    "Face ID / Fingerprint enabled for App Lock": "Face ID / huella activado para el bloqueo",
    "Face ID / Fingerprint disabled for App Lock": "Face ID / huella desactivado para el bloqueo",
    "Face ID / Fingerprint enabled for Scroll PIN": "Face ID / huella activado para el PIN de scroll",
    "Face ID / Fingerprint disabled for Scroll PIN": "Face ID / huella desactivado para el PIN de scroll",
    "Face ID / Fingerprint failed": "Face ID / huella no funcionó",
    "Couldn't set up Face ID / Fingerprint": "No se pudo configurar Face ID / huella",
    "Checking the news": "Ver las noticias",
    "Chatting with friends on social media": "Hablar con amigos en redes sociales",
    "Looking something up": "Buscar algo",
    "Taking a break": "Tomar un descanso",
    "5 min": "5 min",
    "10 min": "10 min",
    "30 min": "30 min",
    "Turned ON {count} time": "Activado {count} vez",
    "Turned ON {count} times": "Activado {count} veces",
    "scrolled {count} time": "{count} desplazamiento",
    "scrolled {count} times": "{count} desplazamientos",
    "Opened {count} time": "Abierta {count} vez",
    "Opened {count} times": "Abierta {count} veces",
    "canceled {count}": "{count} canceladas",
    "~{total} total (avg {avg})": "~{total} en total (media {avg})",
    "{reason} · {time} left": "{reason} · quedan {time}",
    "{time} left — the app will lock when this reaches 0:00.": "Quedan {time}: la app se bloqueará al llegar a 0:00.",
    "{time} left. This is just a timer; nothing else happens at 0:00.": "Quedan {time}. Es solo un temporizador; no pasa nada más al llegar a 0:00.",
    "{minutes} min": "{minutes} min",
    "Remove \"{name}\"": "Eliminar «{name}»",
    "{label} ({minutes} min)": "{label} ({minutes} min)",
    "{label} · {index} of {total}": "{label} · {index} de {total}",
    "Timer started — app locks in {label}": "Temporizador iniciado: la app se bloquea en {label}",
    "Timer started for {label}": "Temporizador iniciado para {label}",
    "Open {app}?": "¿Abrir {app}?",
    "You're about to leave MyHome Browser to open {app}.": "Vas a salir de MyHome Browser para abrir {app}.",
    "{hours}h": "{hours} h",
    "{minutes}m": "{minutes} min",
    "{seconds}s": "{seconds} s",
    "{minutes}m {seconds}s": "{minutes} min {seconds} s",
    "The whole app is shown in this language.": "Toda la app se muestra en este idioma.",
    "Time's up! MyHome Browser is locked until you unlock it.": "Se acabó el tiempo. MyHome Browser queda bloqueado hasta que lo desbloquees.",
    "Custom…": "Personalizado…",
    "Set a time limit of at least 1 minute": "Elige un límite de al menos 1 minuto",
    "{hours}h {minutes}m": "{hours} h {minutes} min",
    "Today": "Hoy",
    "Daily usage goal": "Meta diaria",
    "Set your own daily time limit across all apps and scroll time. Insights tracks your progress against your own number, not one this app picked for you.": "Define tu propio límite de tiempo diario entre todas las apps y el tiempo con scroll. Las estadísticas miden tu progreso frente a tu propio número, no uno que haya elegido esta app.",
    "Minutes per day": "Minutos al día",
    "Remove goal": "Eliminar meta",
    "{used} of your {goal} goal": "{used} de tu meta de {goal}",
    "{count} day within your goal": "{count} día dentro de tu meta",
    "{count} days within your goal": "{count} días dentro de tu meta",
    "Set a daily goal in Settings to track your progress": "Define una meta diaria en Ajustes para ver tu progreso",
    "{percent}% above your recent average": "{percent}% por encima de tu media reciente",
    "{percent}% below your recent average": "{percent}% por debajo de tu media reciente",
    "Enter a number of minutes": "Introduce un número de minutos",
    "Goal saved": "Meta guardada",
    "Goal removed": "Meta eliminada",
    "Why this app exists": "Por qué existe esta app",
    "A few things research has found about how we touch, scroll, and swipe our phones — not to make you feel bad, just so the friction in this app is based on something real.": "Algunas cosas que la investigación ha descubierto sobre cómo tocamos, hacemos scroll y deslizamos el teléfono, no para hacerte sentir mal, sino para que sepas que la fricción de esta app se basa en algo real.",
    "Touching:": "Tocar la pantalla:",
    "a 2016 study by the research firm dscout found the average person touches their phone about 2,617 times a day — the heaviest users, over 5,400 times.": "un estudio de 2016 de la firma dscout encontró que la persona promedio toca su teléfono unas 2617 veces al día, y quienes más lo usan, más de 5400 veces.",
    "Scrolling:": "Hacer scroll:",
    "infinite-scroll feeds run on the same unpredictable, variable reward pattern that makes slot machines hard to put down, a design choice researchers and former tech insiders have directly compared to gambling psychology.": "los feeds de scroll infinito funcionan con el mismo patrón de recompensa variable e impredecible que hace que las máquinas tragamonedas sean difíciles de dejar, un diseño que investigadores y exempleados de grandes tecnológicas han comparado directamente con la psicología del juego.",
    "Checking:": "Revisar el teléfono:",
    "a habit-formation study by Oulasvirta and colleagues (2012) found most phone checks last under 30 seconds and are triggered by boredom or habit, not real need — part of why they're hard to even notice.": "un estudio sobre formación de hábitos de Oulasvirta y colegas (2012) encontró que la mayoría de las veces que revisamos el teléfono duran menos de 30 segundos y están motivadas por aburrimiento o costumbre, no por una necesidad real, lo que explica en parte por qué cuesta darse cuenta de que ocurren.",
    "Posture:": "Postura:",
    "tilting your head forward to look at a phone can add up to 60 lbs of effective strain on your neck, according to spinal-stress research by Dr. Kenneth Hansraj (2014).": "inclinar la cabeza hacia adelante para mirar el teléfono puede añadir hasta unos 27 kg de tensión efectiva sobre el cuello, según una investigación sobre estrés de la columna del Dr. Kenneth Hansraj (2014).",
    "None of this is about guilt. It's why a reason, a time limit, and a PIN can do more than willpower alone.": "Nada de esto busca hacerte sentir culpable. Por eso un motivo, un límite de tiempo y un PIN pueden ayudar más que la fuerza de voluntad por sí sola.",
    "Last 7 days": "Últimos 7 días",
    "{count} quick check": "{count} vistazo rápido",
    "{count} quick checks": "{count} vistazos rápidos",
    "{count} longer session": "{count} sesión más larga",
    "{count} longer sessions": "{count} sesiones más largas",
    "Posture": "Postura",
    "Remind me to check my posture every 10 minutes while scroll is ON": "Avísame para revisar mi postura cada 10 minutos mientras el scroll esté activado",
    "Posture check: try sitting up and holding the phone at eye level for a moment.": "Revisa tu postura: intenta sentarte derecho y sostener el teléfono a la altura de los ojos por un momento.",
    "By hour of day": "Por hora del día",
    "This sets the language for the rest of the app.": "Esto define el idioma de toda la app.",
    "Step 1 of 6": "Paso 1 de 6",
    "Step 2 of 6": "Paso 2 de 6",
    "Step 3 of 6": "Paso 3 de 6",
    "Step 4 of 6": "Paso 4 de 6",
    "Step 5 of 6": "Paso 5 de 6",
    "Step 6 of 6": "Paso 6 de 6",
    "Blocked: this looks like an ad or tracking domain": "Bloqueado: parece un dominio publicitario o de rastreo",
    "Remove bookmark": "Quitar marcador",
    "Bookmark this page": "Marcar esta página",
    "No bookmarks yet. Open a page and tap the star to save it.": "Aún no tienes marcadores. Abre una página y toca la estrella para guardarla.",
    "Bookmark removed": "Marcador eliminado",
    "Bookmark added": "Marcador añadido",
    "Close tab \"{title}\"": "Cerrar pestaña \"{title}\"",
    "Bookmarks": "Marcadores",
    "Insights": "Estadísticas",
    "Search or enter a website above to start browsing.": "Busca o escribe un sitio web arriba para empezar a navegar.",
    "Open bookmarks": "Abrir marcadores",
    "Open insights": "Abrir estadísticas",
    "Search or go to address": "Buscar o ir a una dirección",
    "Search or enter address": "Buscar o escribir una dirección",
    "Open in browser": "Abrir en el navegador",
    "Close insights": "Cerrar estadísticas",
    "Close bookmarks": "Cerrar marcadores",
    "Type a search or a website above — it opens as a new tab you can browse right here.": "Escribe una búsqueda o un sitio web arriba: se abrirá como una pestaña nueva que puedes navegar aquí mismo.",
    "Switch tabs with the pills above the page. Tap the star to bookmark one; Bookmarks and Insights up top stay empty until you tap them.": "Cambia de pestaña con las píldoras de arriba. Toca la estrella para guardar un marcador; Marcadores y Estadísticas arriba no muestran nada hasta que los toques.",
    "Ad blocking only stops navigating straight to known ad/tracking domains — it can't remove ads from a page you're already on.": "El bloqueo de anuncios solo impide navegar directamente a dominios publicitarios o de rastreo conocidos; no puede quitar anuncios de una página que ya estás viendo.",
  },
  ja: {
    // ---- トップバー / 共通 ----
    "Scroll OFF": "スクロール OFF",
    "Scroll ON": "スクロール ON",
    "Timer": "タイマー",
    "Setting": "設定",
    "Tips": "ヒント",
    "Got it": "閉じる",
    "Hours": "時間",
    "Minutes": "分",
    "Seconds": "秒",
    "Start": "開始",
    "Cancel timer": "タイマーを取り消す",
    "Lock the app when time's up": "時間になったらアプリをロックする",
    "Use it as a plain timer, or have it lock the app when time's up to limit your phone use.": "普通のタイマーとしても、時間になったらアプリをロックして使いすぎを防ぐ用途にも使えます。",
    "Scroll is OFF by default to limit distraction. Turn it ON with a reason, a time limit, and your PIN only when you really need to scroll freely.": "気が散らないよう、スクロールは既定でOFFです。本当に必要なときだけ、理由と制限時間とPINを入れてONにしてください。",
    // ---- 検索 ----
    "Prev": "前へ",
    "Next": "次へ",
    // ---- カテゴリ ----
    // ---- インサイト ----
    "All time": "全期間",
    "Hour": "時間",
    "Day": "日",
    "Month": "月",
    "Year": "年",
    "Now": "現在",
    "Time spent per app": "アプリごとの利用時間",
    "Scroll": "スクロール",
    "Choose a time period": "期間を選ぶ",
    "Previous period": "前の期間",
    "Next period": "次の期間",
    "Previous month": "前の月",
    "Next month": "次の月",
    "App Insights": "アプリのインサイト",
    "How often you open each app from the dock, and roughly how long you're away for. Times are estimated from when you leave and come back to this app, not from inside the other app.": "ドックから各アプリを開いた回数と、おおよその滞在時間です。時間はこのアプリを離れてから戻るまでで推定しており、相手のアプリの中を見ているわけではありません。",
    "No data yet. Insights appear once you open an app from the dock or turn scroll ON.": "まだデータがありません。ドックからアプリを開くか、スクロールをONにすると表示されます。",
    "No activity in this hour.": "この時間帯の記録はありません。",
    "No activity on this day.": "この日の記録はありません。",
    "No activity in this month.": "この月の記録はありません。",
    "No activity in this year.": "この年の記録はありません。",
    // ---- ドック ----
    "Hide Apps": "アプリを隠す",
    "Show Apps": "アプリを表示",
    "Edit Apps": "アプリを編集",
    "Choose apps (up to 10)": "アプリを選ぶ（最大10個）",
    "The list of apps installed on your phone can't be read automatically from a web page, so pick from the candidates below instead.": "スマホにインストール済みのアプリ一覧はWebページからは自動取得できないため、以下の候補から選んでください。",
    "Add up to 10 apps from \"Edit Apps\"": "「アプリを編集」から最大10個まで追加できます",
    "Open this app?": "このアプリを開きますか？",
    "Open": "開く",
    "Cancel": "キャンセル",
    // ---- スクロールON ----
    "Turn scroll ON": "スクロールをONにする",
    "Choose a reason and a time limit. Scroll will switch back OFF automatically when time is up.": "理由と制限時間を選んでください。時間になると自動的にOFFに戻ります。",
    "Reason": "理由",
    "Time limit": "制限時間",
    "4-digit PIN": "4桁のPIN",
    "Turn ON": "ONにする",
    "Unlock with Face ID / Fingerprint": "Face ID / 指紋認証で解除",
    // ---- オンボーディング ----
    "Choose your language": "言語を選んでください",
    "Choose your country": "国を選んでください",
    "This helps match you with relevant local news later on. More countries will be added over time.": "今後、地域に合ったニュースを表示するために使います。対応国は順次追加予定です。",
    "Japan": "日本",
    "Mexico": "メキシコ",
    "United States": "アメリカ合衆国",
    "Set up your PINs (optional)": "PINを設定する（任意）",
    "Set a PIN to open MyHome Browser, and a separate PIN to turn scroll ON. Leave either blank to skip it. You can turn on Face ID / Fingerprint instead later, in Settings.": "MyHome Browserを開くためのPINと、スクロールをONにするためのPINをそれぞれ設定します。空欄のままにすれば省略できます。あとから設定でFace ID / 指紋認証に切り替えることもできます。",
    "App Lock PIN (opens the app)": "アプリロックPIN（アプリを開く用）",
    "Scroll PIN (turns scroll ON)": "スクロールPIN（スクロールON用）",
    "Security question": "秘密の質問",
    "Select a question (optional)": "質問を選ぶ（任意）",
    "What was your first pet's name?": "最初に飼ったペットの名前は？",
    "What is your mother's maiden name?": "母親の旧姓は？",
    "What was the name of your first school?": "最初に通った学校の名前は？",
    "What city were you born in?": "生まれた市区町村は？",
    "What was your childhood nickname?": "子どもの頃のあだ名は？",
    "What is your favorite food?": "好きな食べ物は？",
    "Answer": "答え",
    "Skip": "スキップ",
    "Save & Continue": "保存して次へ",
    "Which social media do you use?": "どのSNSを使っていますか？",
    "Choose the ones you want quick access to from your dock.": "ドックからすぐ開けるようにしたいものを選んでください。",
    "Log in to your apps": "アプリにログイン",
    "Open each app to sign in there. You can also do this later.": "各アプリを開いてログインしてください。あとで行うこともできます。",
    "Finish setup": "設定を完了",
    "Log in": "ログイン",
    "No social media selected. You can add some later from Edit Apps.": "SNSが選ばれていません。あとから「アプリを編集」で追加できます。",
    // ---- 設定 ----
    "Settings": "設定",
    "Close settings": "設定を閉じる",
    "Open settings": "設定を開く",
    "How to use this app": "使い方",
    "Set a timer": "タイマーを設定",
    "Look & Feel": "外観",
    "PINs & Unlock": "PINとロック解除",
    "Reasons & Limits": "理由と制限時間",
    "Appearance": "外観",
    "Green": "グリーン",
    "Blue": "ブルー",
    "Accent color": "アクセントカラー",
    "Background color": "背景色",
    "Choose background image": "背景画像を選ぶ",
    "Remove image": "画像を削除",
    "Reset colors": "色をリセット",
    "Language": "言語",
    "Scroll PIN": "スクロールPIN",
    "Required to turn scroll ON. Default is 0000 until you change it.": "スクロールをONにするために必要です。変更するまでは初期値の0000です。",
    "New 4-digit PIN": "新しい4桁のPIN",
    "Save": "保存",
    "Use Face ID / Fingerprint to turn scroll ON": "スクロールONにFace ID / 指紋認証を使う",
    "Face ID / Fingerprint isn't available on this device or browser.": "この端末またはブラウザではFace ID / 指紋認証を利用できません。",
    "App Lock": "アプリロック",
    "Required every time the app opens. Default is 0000 until you change it.": "アプリを開くたびに必要です。変更するまでは初期値の0000です。",
    "Require PIN to open the app": "アプリを開くときにPINを要求する",
    "Use Face ID / Fingerprint to open the app": "アプリを開くときにFace ID / 指紋認証を使う",
    "Recovery question (optional) — the only way to reset a forgotten App Lock PIN.": "秘密の質問（任意）— PINを忘れたときに再設定できる唯一の手段です。",
    "Save recovery question": "秘密の質問を保存",
    "Show front camera while authenticating (visual only, doesn't verify you)": "認証中に内カメラを表示する（演出のみ。本人確認には使われません）",
    "Reasons": "理由",
    "Add a new reason": "理由を追加",
    "Add": "追加",
    "Time limits": "制限時間",
    "Label (e.g. 15 min)": "ラベル（例：15分）",
    // ---- アプリロック画面 ----
    "MyHome Browser is locked": "MyHome Browserはロックされています",
    "Unlock": "ロック解除",
    "Incorrect PIN": "PINが違います",
    "Forgot PIN?": "PINを忘れた場合",
    "Your answer": "あなたの答え",
    "That answer doesn't match": "答えが一致しません",
    "Verify": "確認",
    "Set a new PIN": "新しいPINを設定",
    "Save & Unlock": "保存して解除",
    "No recovery question is set": "秘密の質問が設定されていません",
    "You didn't set a security question for App Lock, so this PIN can't be recovered from here. To reset it, clear this app's data in your browser/PWA settings — note that this also resets your other MyHome Browser settings.": "アプリロックの秘密の質問が未設定のため、ここからPINを復旧できません。再設定するにはブラウザ/PWAの設定でこのアプリのデータを消去してください（他の設定もリセットされます）。",
    "Back": "戻る",
    // ---- トースト ----
    "PIN updated": "PINを更新しました",
    "PIN reset": "PINを再設定しました",
    "PIN must be exactly 4 digits": "PINは4桁の数字で入力してください",
    "App Lock PIN must be exactly 4 digits": "アプリロックPINは4桁の数字で入力してください",
    "Scroll PIN must be exactly 4 digits": "スクロールPINは4桁の数字で入力してください",
    "App Lock PIN updated": "アプリロックPINを更新しました",
    "App Lock enabled": "アプリロックを有効にしました",
    "App Lock disabled": "アプリロックを無効にしました",
    "Recovery question saved": "秘密の質問を保存しました",
    "Enter both a question and an answer": "質問と答えの両方を入力してください",
    "Fill in both the question and answer, or leave both blank": "質問と答えは両方入力するか、両方空欄にしてください",
    "Setup complete": "設定が完了しました",
    "Scroll turned OFF": "スクロールをOFFにしました",
    "Time's up — scroll switched back OFF": "時間になったのでスクロールをOFFに戻しました",
    "Timer's up": "タイマー終了",
    "Timer canceled": "タイマーを取り消しました",
    "Set at least 1 second": "1秒以上を指定してください",
    "Could not load that image": "画像を読み込めませんでした",
    "Not enough storage to save that": "保存する空き容量が足りません",
    "Face ID / Fingerprint enabled for App Lock": "アプリロックでFace ID / 指紋認証を有効にしました",
    "Face ID / Fingerprint disabled for App Lock": "アプリロックのFace ID / 指紋認証を無効にしました",
    "Face ID / Fingerprint enabled for Scroll PIN": "スクロールPINでFace ID / 指紋認証を有効にしました",
    "Face ID / Fingerprint disabled for Scroll PIN": "スクロールPINのFace ID / 指紋認証を無効にしました",
    "Face ID / Fingerprint failed": "Face ID / 指紋認証に失敗しました",
    "Couldn't set up Face ID / Fingerprint": "Face ID / 指紋認証を設定できませんでした",
    "Checking the news": "ニュースを見る",
    "Chatting with friends on social media": "SNSで友だちとやりとりする",
    "Looking something up": "調べものをする",
    "Taking a break": "休憩する",
    "5 min": "5分",
    "10 min": "10分",
    "30 min": "30分",
    "Turned ON {count} time": "ONにした回数 {count}回",
    "Turned ON {count} times": "ONにした回数 {count}回",
    "scrolled {count} time": "スクロール {count}回",
    "scrolled {count} times": "スクロール {count}回",
    "Opened {count} time": "開いた回数 {count}回",
    "Opened {count} times": "開いた回数 {count}回",
    "canceled {count}": "キャンセル {count}回",
    "~{total} total (avg {avg})": "合計 約{total}（平均 {avg}）",
    "{reason} · {time} left": "{reason} · 残り{time}",
    "{time} left — the app will lock when this reaches 0:00.": "残り{time} — 0:00になるとアプリがロックされます。",
    "{time} left. This is just a timer; nothing else happens at 0:00.": "残り{time}。これは単なるタイマーで、0:00になっても何も起きません。",
    "{minutes} min": "{minutes}分",
    "Remove \"{name}\"": "「{name}」を削除",
    "{label} ({minutes} min)": "{label}（{minutes}分）",
    "{label} · {index} of {total}": "{label} · {index} / {total}",
    "Timer started — app locks in {label}": "タイマー開始 — {label}後にアプリをロックします",
    "Timer started for {label}": "{label}のタイマーを開始しました",
    "Open {app}?": "{app}を開きますか？",
    "You're about to leave MyHome Browser to open {app}.": "MyHome Browserを離れて{app}を開こうとしています。",
    "{hours}h": "{hours}時間",
    "{minutes}m": "{minutes}分",
    "{seconds}s": "{seconds}秒",
    "{minutes}m {seconds}s": "{minutes}分{seconds}秒",
    "The whole app is shown in this language.": "アプリ全体がこの言語で表示されます。",
    "Time's up! MyHome Browser is locked until you unlock it.": "時間になりました。解除するまでMyHome Browserはロックされます。",
    "Custom…": "自由に決める…",
    "Set a time limit of at least 1 minute": "制限時間は1分以上にしてください",
    "{hours}h {minutes}m": "{hours}時間{minutes}分",
    "Today": "今日",
    "Daily usage goal": "1日の目標",
    "Set your own daily time limit across all apps and scroll time. Insights tracks your progress against your own number, not one this app picked for you.": "アプリ全体とスクロール時間を合わせた、1日の時間の上限を自分で決めてください。インサイトはこのアプリが決めた数字ではなく、あなた自身が決めた数字に対しての進み具合を表示します。",
    "Minutes per day": "1日あたりの分数",
    "Remove goal": "目標を削除",
    "{used} of your {goal} goal": "目標{goal}のうち{used}",
    "{count} day within your goal": "目標内で{count}日連続",
    "{count} days within your goal": "目標内で{count}日連続",
    "Set a daily goal in Settings to track your progress": "設定で1日の目標を決めると、進み具合を確認できます",
    "{percent}% above your recent average": "直近の平均より{percent}%多い",
    "{percent}% below your recent average": "直近の平均より{percent}%少ない",
    "Enter a number of minutes": "分数を入力してください",
    "Goal saved": "目標を保存しました",
    "Goal removed": "目標を削除しました",
    "Why this app exists": "このアプリを作った理由",
    "A few things research has found about how we touch, scroll, and swipe our phones — not to make you feel bad, just so the friction in this app is based on something real.": "スマホを触る・スクロールする・スワイプすることについて、研究で分かっていることをいくつか紹介します。責めるためではなく、このアプリの「ひと手間」が根拠のあるものだと知ってもらうためです。",
    "Touching:": "タッチする回数：",
    "a 2016 study by the research firm dscout found the average person touches their phone about 2,617 times a day — the heaviest users, over 5,400 times.": "2016年の調査会社dscoutの研究によると、平均的な人は1日に約2,617回スマホに触れており、最も多い人では5,400回を超えていました。",
    "Scrolling:": "スクロール：",
    "infinite-scroll feeds run on the same unpredictable, variable reward pattern that makes slot machines hard to put down, a design choice researchers and former tech insiders have directly compared to gambling psychology.": "無限スクロールのフィードは、スロットマシンをやめられなくするのと同じ「不規則な報酬」の仕組みで作られています。研究者や元テック業界関係者は、これをギャンブルの心理と直接比較しています。",
    "Checking:": "確認する行動：",
    "a habit-formation study by Oulasvirta and colleagues (2012) found most phone checks last under 30 seconds and are triggered by boredom or habit, not real need — part of why they're hard to even notice.": "Oulasvirtaらによる2012年の習慣形成の研究では、スマホの確認のほとんどは30秒未満で、実際の必要性ではなく退屈さや習慣によって引き起こされていることが分かりました。これが、気づかないうちに繰り返してしまう理由の一つです。",
    "Posture:": "姿勢：",
    "tilting your head forward to look at a phone can add up to 60 lbs of effective strain on your neck, according to spinal-stress research by Dr. Kenneth Hansraj (2014).": "Kenneth Hansraj博士による2014年の脊椎への負荷に関する研究によると、スマホを見るために頭を前に傾けると、首には最大で約27kg分の負荷がかかるとされています。",
    "None of this is about guilt. It's why a reason, a time limit, and a PIN can do more than willpower alone.": "これは罪悪感を持たせるためのものではありません。だからこそ、理由・制限時間・PINが、意志の力だけよりも役に立つのです。",
    "Last 7 days": "直近7日間",
    "{count} quick check": "反射的な確認 {count}回",
    "{count} quick checks": "反射的な確認 {count}回",
    "{count} longer session": "意図的な利用 {count}回",
    "{count} longer sessions": "意図的な利用 {count}回",
    "Posture": "姿勢",
    "Remind me to check my posture every 10 minutes while scroll is ON": "スクロールがONの間、10分ごとに姿勢を確認するよう知らせる",
    "Posture check: try sitting up and holding the phone at eye level for a moment.": "姿勢チェック：少しの間、背筋を伸ばしてスマホを目の高さに持ってみましょう。",
    "By hour of day": "時間帯別",
    "This sets the language for the rest of the app.": "アプリ全体の表示言語になります。",
    "Step 1 of 6": "第1ステップ（全6ステップ）",
    "Step 2 of 6": "第2ステップ（全6ステップ）",
    "Step 3 of 6": "第3ステップ（全6ステップ）",
    "Step 4 of 6": "第4ステップ（全6ステップ）",
    "Step 5 of 6": "第5ステップ（全6ステップ）",
    "Step 6 of 6": "第6ステップ（全6ステップ）",
    "Blocked: this looks like an ad or tracking domain": "ブロックしました：広告・トラッキング用のドメインのようです",
    "Remove bookmark": "ブックマークを削除",
    "Bookmark this page": "このページをブックマーク",
    "No bookmarks yet. Open a page and tap the star to save it.": "まだブックマークがありません。ページを開いて星マークをタップすると保存できます。",
    "Bookmark removed": "ブックマークを削除しました",
    "Bookmark added": "ブックマークに追加しました",
    "Close tab \"{title}\"": "タブ「{title}」を閉じる",
    "Bookmarks": "ブックマーク",
    "Insights": "インサイト",
    "Search or enter a website above to start browsing.": "上の欄で検索するか、サイトのアドレスを入力すると閲覧できます。",
    "Open bookmarks": "ブックマークを開く",
    "Open insights": "インサイトを開く",
    "Search or go to address": "検索またはアドレスへ移動",
    "Search or enter address": "検索またはアドレスを入力",
    "Open in browser": "ブラウザで開く",
    "Close insights": "インサイトを閉じる",
    "Close bookmarks": "ブックマークを閉じる",
    "Type a search or a website above — it opens as a new tab you can browse right here.": "上の欄に検索語かサイトのアドレスを入力すると、新しいタブとしてここで開けます。",
    "Switch tabs with the pills above the page. Tap the star to bookmark one; Bookmarks and Insights up top stay empty until you tap them.": "タブはページ上部のピルで切り替えます。星マークでブックマーク、ブックマークとインサイトは上部のボタンをタップするまで何も表示されません。",
    "Ad blocking only stops navigating straight to known ad/tracking domains — it can't remove ads from a page you're already on.": "広告ブロックは既知の広告・トラッキングドメインへの遷移を止めるだけです。すでに開いているページの中の広告までは取り除けません。",
  },
};

function isOnboardingComplete() {
  return loadJSON(STORAGE_KEYS.onboardingComplete, false);
}

function saveOnboardingComplete(value) {
  saveJSON(STORAGE_KEYS.onboardingComplete, value);
}

function getLanguage() {
  return loadJSON(STORAGE_KEYS.language, DEFAULT_LANGUAGE);
}

function saveLanguage(code) {
  saveJSON(STORAGE_KEYS.language, code);
}

/* --------------------------------------------------------------------------
   翻訳の実行部分
   currentLanguage をキャッシュしておき、t() は同期的に引けるようにする。
   静的なHTMLは applyLanguage() が初回に原文を控えてから差し替える。
   JSで組み立てる文字列は生成時に t() を通す（言語切替時は再描画する）。
   -------------------------------------------------------------------------- */
let currentLanguage = DEFAULT_LANGUAGE;

// 英語の原文を渡すと、選択中の言語の訳を返す。訳が無ければ原文のまま。
function t(en) {
  const dict = UI_I18N[currentLanguage];
  if (!dict) return en;
  const hit = dict[en];
  return typeof hit === "string" && hit ? hit : en;
}

// 値を埋め込む文言用。原文側に {name} を書いておき、訳文でも同じ名前を使う。
// （言語によって語順が変わるので、文字列連結ではなくプレースホルダで持つ）
function tf(en, params) {
  return t(en).replace(/\{(\w+)\}/g, (whole, key) =>
    Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : whole
  );
}

// 差し替え対象の属性。テキストと同じ辞書で引く。
const I18N_ATTRIBUTES = ["placeholder", "aria-label", "title"];

// 原文の控え。初回に一度だけ走査し、以後はこの控えを使って毎回原文から作り直す。
// （JSで後から作った要素は t() を通して生成済みなので、ここでは触らない。
//  触ってしまうと訳文を「原文」として記録し、次の言語切替で戻せなくなる）
let i18nStaticText = null;
let i18nStaticAttrs = null;

// 翻訳しても意味がない（あるいは壊れる）要素は丸ごと飛ばす。
function isI18nSkipped(node) {
  const el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
  if (!el) return true;
  return Boolean(el.closest("script, style, .i18n-skip"));
}

function collectI18nTextNodes(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      if (isI18nSkipped(node)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const out = [];
  let node = walker.nextNode();
  while (node) {
    out.push(node);
    node = walker.nextNode();
  }
  return out;
}

// 選択中の言語をUI全体に反映する。何度呼んでも原文からやり直すので冪等。
function applyLanguage(code) {
  if (code) currentLanguage = code;
  else currentLanguage = getLanguage();
  if (!LANGUAGES.some((l) => l.code === currentLanguage)) currentLanguage = DEFAULT_LANGUAGE;
  document.documentElement.lang = currentLanguage;

  if (!i18nStaticText) {
    i18nStaticText = collectI18nTextNodes(document.body).map((node) => ({ node, original: node.nodeValue }));
  }
  if (!i18nStaticAttrs) {
    i18nStaticAttrs = [];
    document.querySelectorAll("[placeholder], [aria-label], [title]").forEach((el) => {
      if (isI18nSkipped(el)) return;
      const saved = {};
      I18N_ATTRIBUTES.forEach((name) => {
        const value = el.getAttribute(name);
        if (value) saved[name] = value;
      });
      if (Object.keys(saved).length) i18nStaticAttrs.push({ el, saved });
    });
  }

  i18nStaticText.forEach(({ node, original }) => {
    if (!node.isConnected) return;
    // 前後の空白（インデント）は原文のまま残し、中身だけ差し替える。
    const leading = original.match(/^\s*/)[0];
    const trailing = original.match(/\s*$/)[0];
    node.nodeValue = leading + t(original.trim()) + trailing;
  });

  i18nStaticAttrs.forEach(({ el, saved }) => {
    if (!el.isConnected) return;
    Object.keys(saved).forEach((name) => el.setAttribute(name, t(saved[name])));
  });
}

function getCountry() {
  return loadJSON(STORAGE_KEYS.country, null);
}

function saveCountry(code) {
  saveJSON(STORAGE_KEYS.country, code);
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

function getAppLockQuestion() {
  return loadJSON(STORAGE_KEYS.appLockQuestion, "");
}

function saveAppLockQuestion(question) {
  saveJSON(STORAGE_KEYS.appLockQuestion, question);
}

function getAppLockAnswer() {
  return loadJSON(STORAGE_KEYS.appLockAnswer, "");
}

function saveAppLockAnswer(answer) {
  saveJSON(STORAGE_KEYS.appLockAnswer, answer);
}

function isBiometricAppLockEnabled() {
  return loadJSON(STORAGE_KEYS.biometricAppLockEnabled, false);
}
function saveBiometricAppLockEnabled(value) {
  saveJSON(STORAGE_KEYS.biometricAppLockEnabled, value);
}
function getBiometricAppLockCredentialId() {
  return loadJSON(STORAGE_KEYS.biometricAppLockCredentialId, null);
}
function saveBiometricAppLockCredentialId(id) {
  saveJSON(STORAGE_KEYS.biometricAppLockCredentialId, id);
}

function isBiometricScrollEnabled() {
  return loadJSON(STORAGE_KEYS.biometricScrollEnabled, false);
}
function saveBiometricScrollEnabled(value) {
  saveJSON(STORAGE_KEYS.biometricScrollEnabled, value);
}
function getBiometricScrollCredentialId() {
  return loadJSON(STORAGE_KEYS.biometricScrollCredentialId, null);
}
function saveBiometricScrollCredentialId(id) {
  saveJSON(STORAGE_KEYS.biometricScrollCredentialId, id);
}

function isBiometricCameraPreviewEnabled() {
  return loadJSON(STORAGE_KEYS.biometricCameraPreview, false);
}
function saveBiometricCameraPreviewEnabled(value) {
  saveJSON(STORAGE_KEYS.biometricCameraPreview, value);
}

const DEFAULT_APP_LOCK_TITLE = "MyHome Browser is locked";

// App Lockの全画面ロックを、設定のON/OFFに関係なく強制的に表示する。
// フォーカスタイマーが「時間になったらロックする」モードで満了した時などに使う。
function showAppLockScreen(message) {
  const screen = document.getElementById("appLockScreen");
  const titleEl = document.getElementById("appLockTitleText");
  if (titleEl) titleEl.textContent = message || t(DEFAULT_APP_LOCK_TITLE);
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
  const biometricBtn = document.getElementById("appLockBiometricBtn");
  const cameraPreview = document.getElementById("appLockCameraPreview");

  function attemptUnlock() {
    if (pinInput.value.trim() === getAppLockPin()) {
      screen.hidden = true;
      error.hidden = true;
      pinInput.value = "";
      if (titleEl) titleEl.textContent = t(DEFAULT_APP_LOCK_TITLE);
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

  biometricBtn.addEventListener("click", async () => {
    const credentialId = getBiometricAppLockCredentialId();
    if (!credentialId) return;
    startCameraPreviewIfEnabled(cameraPreview);
    try {
      await BiometricAuth.verify(credentialId);
      stopCameraPreview(cameraPreview);
      screen.hidden = true;
      error.hidden = true;
      pinInput.value = "";
      if (titleEl) titleEl.textContent = t(DEFAULT_APP_LOCK_TITLE);
    } catch (e) {
      stopCameraPreview(cameraPreview);
      error.hidden = false;
    }
  });

  if (isAppLockEnabled()) {
    screen.hidden = false;
    pinInput.focus();
  } else {
    screen.hidden = true;
  }
  applyBiometricAvailabilityUI();

  const enabledInput = document.getElementById("appLockEnabledInput");
  enabledInput.checked = isAppLockEnabled();
  enabledInput.addEventListener("change", () => {
    saveAppLockEnabled(enabledInput.checked);
    showToast(enabledInput.checked ? t("App Lock enabled") : t("App Lock disabled"));
  });

  document.getElementById("saveAppLockPinBtn").addEventListener("click", () => {
    const input = document.getElementById("newAppLockPinInput");
    const value = input.value.trim();
    if (!/^\d{4}$/.test(value)) {
      showToast(t("PIN must be exactly 4 digits"));
      return;
    }
    saveAppLockPin(value);
    input.value = "";
    showToast(t("App Lock PIN updated"));
  });

  document.getElementById("biometricAppLockToggle").addEventListener("change", async (e) => {
    if (e.target.checked) {
      try {
        const credentialId = await BiometricAuth.register("MyHome Browser App Lock");
        saveBiometricAppLockCredentialId(credentialId);
        saveBiometricAppLockEnabled(true);
        showToast(t("Face ID / Fingerprint enabled for App Lock"));
      } catch (err) {
        e.target.checked = false;
        showToast(t("Couldn't set up Face ID / Fingerprint"));
      }
    } else {
      saveBiometricAppLockEnabled(false);
      saveBiometricAppLockCredentialId(null);
      showToast(t("Face ID / Fingerprint disabled for App Lock"));
    }
    applyBiometricAvailabilityUI();
  });

  document.getElementById("biometricScrollToggle").addEventListener("change", async (e) => {
    if (e.target.checked) {
      try {
        const credentialId = await BiometricAuth.register("MyHome Browser Scroll PIN");
        saveBiometricScrollCredentialId(credentialId);
        saveBiometricScrollEnabled(true);
        showToast(t("Face ID / Fingerprint enabled for Scroll PIN"));
      } catch (err) {
        e.target.checked = false;
        showToast(t("Couldn't set up Face ID / Fingerprint"));
      }
    } else {
      saveBiometricScrollEnabled(false);
      saveBiometricScrollCredentialId(null);
      showToast(t("Face ID / Fingerprint disabled for Scroll PIN"));
    }
    applyBiometricAvailabilityUI();
  });

  document.getElementById("biometricCameraToggle").addEventListener("change", (e) => {
    saveBiometricCameraPreviewEnabled(e.target.checked);
  });

  document.getElementById("postureReminderToggle").addEventListener("change", (e) => {
    savePostureRemindersEnabled(e.target.checked);
  });

  document.getElementById("saveAppLockRecoveryBtn").addEventListener("click", () => {
    const question = document.getElementById("appLockQuestionInput").value.trim();
    const answer = document.getElementById("appLockAnswerSetupInput").value.trim();
    if (!question || !answer) {
      showToast(t("Enter both a question and an answer"));
      return;
    }
    saveAppLockQuestion(question);
    saveAppLockAnswer(answer);
    showToast(t("Recovery question saved"));
  });

  /* ---- "Forgot PIN?" recovery flow on the lock screen ---- */
  const main = document.getElementById("appLockMain");
  const recovery = document.getElementById("appLockRecovery");
  const questionStep = document.getElementById("appLockRecoveryQuestionStep");
  const resetStep = document.getElementById("appLockRecoveryResetStep");
  const noQuestionStep = document.getElementById("appLockRecoveryNoQuestion");
  const answerInput = document.getElementById("appLockAnswerInput");
  const answerError = document.getElementById("appLockAnswerError");

  function showRecoveryStep(step) {
    questionStep.hidden = step !== "question";
    resetStep.hidden = step !== "reset";
    noQuestionStep.hidden = step !== "noQuestion";
  }

  document.getElementById("appLockForgotBtn").addEventListener("click", () => {
    main.hidden = true;
    recovery.hidden = false;
    answerInput.value = "";
    answerError.hidden = true;
    const question = getAppLockQuestion();
    if (question) {
      document.getElementById("appLockRecoveryQuestionText").textContent = question;
      showRecoveryStep("question");
      answerInput.focus();
    } else {
      showRecoveryStep("noQuestion");
    }
  });

  function backToMain() {
    recovery.hidden = true;
    main.hidden = false;
    pinInput.value = "";
    pinInput.focus();
  }

  document.getElementById("appLockRecoveryCancelBtn").addEventListener("click", backToMain);
  document.getElementById("appLockRecoveryBackBtn").addEventListener("click", backToMain);

  function verifyAnswer() {
    const given = answerInput.value.trim().toLowerCase();
    const saved = getAppLockAnswer().trim().toLowerCase();
    if (given && given === saved) {
      answerError.hidden = true;
      showRecoveryStep("reset");
      document.getElementById("appLockNewPinAfterRecovery").focus();
    } else {
      answerError.hidden = false;
    }
  }

  document.getElementById("appLockRecoveryVerifyBtn").addEventListener("click", verifyAnswer);
  answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") verifyAnswer();
  });

  function saveNewPinAndUnlock() {
    const newPinInput = document.getElementById("appLockNewPinAfterRecovery");
    const value = newPinInput.value.trim();
    if (!/^\d{4}$/.test(value)) {
      showToast(t("PIN must be exactly 4 digits"));
      return;
    }
    saveAppLockPin(value);
    newPinInput.value = "";
    recovery.hidden = true;
    main.hidden = false;
    screen.hidden = true;
    if (titleEl) titleEl.textContent = t(DEFAULT_APP_LOCK_TITLE);
    showToast(t("PIN reset"));
  }

  document.getElementById("appLockRecoverySaveBtn").addEventListener("click", saveNewPinAndUnlock);
  document.getElementById("appLockNewPinAfterRecovery").addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveNewPinAndUnlock();
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
  const stepResearch = document.getElementById("onboardingStepResearch");
  const stepCountry = document.getElementById("onboardingStepCountry");
  const stepPin = document.getElementById("onboardingStepPin");
  const stepSns = document.getElementById("onboardingStepSns");
  const stepLogin = document.getElementById("onboardingStepLogin");

  /* ---- Step 1: language ---- */
  function applyOnboardingLanguage(code) {
    // 残りのオンボーディングとアプリ本体も、選んだ言語に揃える。
    // 起動時に英語で組み立て済みの表示（スクロールボタン等）も作り直す必要がある。
    applyLanguage(code);
    refreshTranslatedViews();
    renderOnboardingCountryList();
  }

  const languageList = document.getElementById("onboardingLanguageList");
  languageList.innerHTML = "";
  LANGUAGES.forEach((lang) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "language-option";
    btn.textContent = lang.name;
    btn.addEventListener("click", () => {
      saveLanguage(lang.code);
      applyOnboardingLanguage(lang.code);
      stepLanguage.hidden = true;
      stepResearch.hidden = false;
    });
    languageList.appendChild(btn);
  });

  /* ---- Step 2: 触る/スクロールする/スワイプするに関する研究の紹介 ---- */
  document.getElementById("onboardingResearchNextBtn").addEventListener("click", () => {
    stepResearch.hidden = true;
    stepCountry.hidden = false;
  });

  /* ---- Step 3: country ---- */
  function renderOnboardingCountryList() {
    const countryList = document.getElementById("onboardingCountryList");
    countryList.innerHTML = "";
    COUNTRIES.forEach((country) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "language-option";
      btn.textContent = t(country.name);
      btn.addEventListener("click", () => {
        saveCountry(country.code);
        stepCountry.hidden = true;
        stepPin.hidden = false;
      });
      countryList.appendChild(btn);
    });
  }
  renderOnboardingCountryList();

  /* ---- Step 4: app lock PIN + recovery question (optional) ---- */
  function goToSnsStep() {
    stepPin.hidden = true;
    stepSns.hidden = false;
    renderOnboardingSnsList();
  }

  document.getElementById("onboardingPinSkipBtn").addEventListener("click", goToSnsStep);

  document.getElementById("onboardingPinNextBtn").addEventListener("click", () => {
    const pin = document.getElementById("onboardingPinInput").value.trim();
    const question = document.getElementById("onboardingQuestionInput").value.trim();
    const answer = document.getElementById("onboardingAnswerInput").value.trim();
    const scrollPin = document.getElementById("onboardingScrollPinInput").value.trim();

    if (pin && !/^\d{4}$/.test(pin)) {
      showToast(t("App Lock PIN must be exactly 4 digits"));
      return;
    }
    if (pin && Boolean(question) !== Boolean(answer)) {
      showToast(t("Fill in both the question and answer, or leave both blank"));
      return;
    }
    if (scrollPin && !/^\d{4}$/.test(scrollPin)) {
      showToast(t("Scroll PIN must be exactly 4 digits"));
      return;
    }

    if (pin) {
      saveAppLockPin(pin);
      saveAppLockEnabled(true);
      if (question && answer) {
        saveAppLockQuestion(question);
        saveAppLockAnswer(answer);
      }
    }
    if (scrollPin) {
      savePin(scrollPin);
    }
    goToSnsStep();
  });

  /* ---- Step 5: which SNS to use ---- */
  document.getElementById("onboardingSnsNextBtn").addEventListener("click", () => {
    const checked = Array.from(
      document.querySelectorAll('#onboardingSnsList input[type="checkbox"]:checked')
    ).map((cb) => cb.value);
    saveJSON(STORAGE_KEYS.selectedApps, checked);
    stepSns.hidden = true;
    stepLogin.hidden = false;
    renderOnboardingLoginList(checked);
  });

  /* ---- Step 6: log in to the chosen SNS ---- */
  document.getElementById("onboardingFinishBtn").addEventListener("click", () => {
    saveOnboardingComplete(true);
    screen.hidden = true;
    renderDock();
    applyDockCollapsed();
    showToast(t("Setup complete"));
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
    li.textContent = t("No social media selected. You can add some later from Edit Apps.");
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
    btn.textContent = t("Log in");
    btn.addEventListener("click", () => openApp(app));
    li.appendChild(btn);

    list.appendChild(li);
  });
}

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
// web: タップした時に新しいタブで開くURL（Instagram/Facebook/X/TikTok等は
// 埋め込み表示をX-Frame-Options等で拒否しているため、常にWeb版を新規タブで開く）、
// domain: 本物のアイコン(favicon)をその場で読み込むための参照元ドメイン
// （ロゴ画像ファイル自体は同梱せず、常に公式サイトから直接取得する）。
const APP_CANDIDATES = [
  { id: "instagram", name: "Instagram", initial: "I", web: "https://www.instagram.com/", domain: "instagram.com" },
  { id: "x", name: "X", initial: "X", web: "https://x.com/", domain: "x.com" },
  { id: "facebook", name: "Facebook", initial: "F", web: "https://www.facebook.com/", domain: "facebook.com" },
  { id: "youtube", name: "YouTube", initial: "Y", web: "https://www.youtube.com/", domain: "youtube.com" },
  { id: "tiktok", name: "TikTok", initial: "T", web: "https://www.tiktok.com/", domain: "tiktok.com" },
  { id: "threads", name: "Threads", initial: "T", web: "https://www.threads.net/", domain: "threads.net" },
  { id: "netflix", name: "Netflix", initial: "N", web: "https://www.netflix.com/", domain: "netflix.com" },
  { id: "amazon", name: "Amazon", initial: "A", web: "https://www.amazon.co.jp/", domain: "amazon.co.jp" },
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

// ヒートマップ用: アクセントカラーを指定の不透明度のrgba()にする。
function insightsAlpha(hex, alpha) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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
    showToast(t("Not enough storage to save that"));
    return false;
  }
}

function applyAppearance() {
  const a = getAppearance();
  const root = document.documentElement.style;

  root.setProperty("--accent", a.accent);
  root.setProperty("--accent-strong", darken(a.accent, 0.25));
  root.setProperty("--accent-bright", lighten(a.accent, 0.15));

  // スクロールOFF/ONのグラデーションは、テーマのアクセントに影響されない
  // 固定の配色（OFF=赤→白→黄緑 / ON=青→白→黄緑）をstyles.cssで指定している。

  const isDark = relativeLuminance(a.bg) < 0.5;
  if (isDark) {
    root.setProperty("--bg", a.bg);
    root.setProperty("--bg-elevated", lighten(a.bg, 0.08));
    root.setProperty("--bg-card", lighten(a.bg, 0.14));
    root.setProperty("--bg-subtle", lighten(a.bg, 0.2));
    root.setProperty("--border", lighten(a.bg, 0.24));
    root.setProperty("--text", lighten(a.bg, 0.92));
    root.setProperty("--text-dim", lighten(a.bg, 0.62));
  } else {
    // カードを「地の色より明るい面」として浮かせ、ページ側をわずかに沈ませる。
    // 影と余白で階層を出すため、境界線は最小限にする。
    root.setProperty("--bg", darken(a.bg, 0.05));
    root.setProperty("--bg-elevated", a.bg);
    root.setProperty("--bg-card", a.bg);
    root.setProperty("--bg-subtle", darken(a.bg, 0.08));
    root.setProperty("--border", darken(a.bg, 0.11));
    root.setProperty("--text", darken(a.bg, 0.88));
    root.setProperty("--text-dim", darken(a.bg, 0.5));
  }

  document.body.style.backgroundImage = a.bgImage ? `url(${a.bgImage})` : "";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = "fixed";
}

// アクセントカラーを起点に、棒グラフの区画ごとに見分けやすい濃淡を作る
// （最大10個までのドックアプリを想定した固定の濃淡パターン）。
const INSIGHTS_SHADE_STEPS = [0, -0.3, 0.35, -0.55, 0.15, -0.15, 0.5, -0.4, 0.25, -0.6];

function insightsShade(accent, index) {
  const step = INSIGHTS_SHADE_STEPS[index % INSIGHTS_SHADE_STEPS.length];
  return step >= 0 ? lighten(accent, step) : darken(accent, -step);
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
   生体認証 (Face ID / Touch ID / 指紋認証)
   サーバーを持たないアプリなので、遠隔で検証する相手はいない。OS側のプラット
   フォーム認証器(Face ID/Touch ID/指紋センサー)がuserVerification:"required"で
   本人確認に成功した場合にのみnavigator.credentials.get()が解決することを、
   PINの代わりの「ローカルな鍵」として利用している。実際の顔・指紋データは
   OSの外に出ず、このアプリ(や、まして外部サーバー)には一切渡らない。
   ========================================================================== */
const BiometricAuth = (() => {
  function randomBytes(len) {
    return crypto.getRandomValues(new Uint8Array(len));
  }

  function bufToBase64(buf) {
    const bytes = new Uint8Array(buf);
    let binary = "";
    bytes.forEach((b) => { binary += String.fromCharCode(b); });
    return btoa(binary);
  }

  function base64ToBuf(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  }

  function isSupported() {
    return !!(window.PublicKeyCredential && navigator.credentials && navigator.credentials.create);
  }

  async function isAvailable() {
    if (!isSupported()) return false;
    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch (e) {
      return false;
    }
  }

  async function register(label) {
    const credential = await navigator.credentials.create({
      publicKey: {
        rp: { name: "MyHome Browser" },
        user: { id: randomBytes(16), name: label, displayName: label },
        challenge: randomBytes(32),
        pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
        timeout: 60000,
      },
    });
    if (!credential) throw new Error("No credential returned");
    return bufToBase64(credential.rawId);
  }

  async function verify(credentialIdBase64) {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: randomBytes(32),
        allowCredentials: [{ id: base64ToBuf(credentialIdBase64), type: "public-key" }],
        userVerification: "required",
        timeout: 60000,
      },
    });
    return !!assertion;
  }

  return { isSupported, isAvailable, register, verify };
})();

let biometricAvailable = false;
async function initBiometricSupport() {
  biometricAvailable = await BiometricAuth.isAvailable();
  applyBiometricAvailabilityUI();
}

// Face ID/指紋認証の「本人確認」自体はOSが担い、このアプリのカメラ映像は一切
// 使わない。ここで映すのはあくまで演出用のプレビューで、本人確認には使われない
// ことをUI文言でも明示している。
let cameraPreviewStream = null;
async function startCameraPreviewIfEnabled(videoEl) {
  if (!isBiometricCameraPreviewEnabled() || !videoEl || !navigator.mediaDevices) return;
  try {
    cameraPreviewStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
    videoEl.srcObject = cameraPreviewStream;
    videoEl.hidden = false;
    await videoEl.play().catch(() => {});
  } catch (e) {
    videoEl.hidden = true;
  }
}
function stopCameraPreview(videoEl) {
  if (cameraPreviewStream) {
    cameraPreviewStream.getTracks().forEach((t) => t.stop());
    cameraPreviewStream = null;
  }
  if (videoEl) {
    videoEl.srcObject = null;
    videoEl.hidden = true;
  }
}

function applyBiometricAvailabilityUI() {
  const appLockRow = document.getElementById("biometricAppLockRow");
  const appLockNote = document.getElementById("biometricAppLockUnavailableNote");
  const scrollRow = document.getElementById("biometricScrollRow");
  const scrollNote = document.getElementById("biometricScrollUnavailableNote");
  if (appLockRow) appLockRow.hidden = !biometricAvailable;
  if (appLockNote) appLockNote.hidden = biometricAvailable;
  if (scrollRow) scrollRow.hidden = !biometricAvailable;
  if (scrollNote) scrollNote.hidden = biometricAvailable;

  const appLockBtn = document.getElementById("appLockBiometricBtn");
  if (appLockBtn) {
    appLockBtn.hidden = !(biometricAvailable && isBiometricAppLockEnabled() && getBiometricAppLockCredentialId());
  }
  const scrollBtn = document.getElementById("scrollOnBiometricBtn");
  if (scrollBtn) {
    scrollBtn.hidden = !(biometricAvailable && isBiometricScrollEnabled() && getBiometricScrollCredentialId());
  }
}

/* ==========================================================================
   スクロール ON / OFF 制御
   ========================================================================== */

// 姿勢リマインダーの間隔（分）。頻繁すぎず、かつ意味のある間隔として10分ごとにする。
const POSTURE_REMINDER_INTERVAL_MIN = 10;

const ScrollLock = (() => {
  let countdownTimer = null;
  let lastPostureReminderMinute = -1;

  function getState() {
    return loadJSON(STORAGE_KEYS.scrollState, { isOn: false, expiresAt: null, reason: null, durationLabel: null, startedAt: null });
  }

  function setState(state) {
    saveJSON(STORAGE_KEYS.scrollState, state);
  }

  function isInsideAllowedArea(target) {
    // モーダル(設定画面など)は「際限なく流れてくるコンテンツ」ではなく単なるUIなので、
    // スクロールOFF中でも中身をスクロールして閉じるボタン等に到達できるようにする。
    return !!(target && target.closest && (target.closest(".scrollable-allow") || target.closest(".modal")));
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
    label.textContent = isOn ? t("Scroll ON") : t("Scroll OFF");
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
    timerEl.textContent = tf("{reason} · {time} left", { reason: t(state.reason), time: `${mm}:${ss}` });
  }

  function stopCountdown() {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }

  function maybeShowPostureReminder(state) {
    if (!isPostureRemindersEnabled() || !state.startedAt) return;
    const elapsedMin = Math.floor((Date.now() - state.startedAt) / 60000);
    if (elapsedMin <= 0 || elapsedMin % POSTURE_REMINDER_INTERVAL_MIN !== 0) return;
    if (elapsedMin === lastPostureReminderMinute) return;
    lastPostureReminderMinute = elapsedMin;
    showToast(t("Posture check: try sitting up and holding the phone at eye level for a moment."));
  }

  function tick() {
    const state = getState();
    if (!state.isOn) { stopCountdown(); return; }
    if (Date.now() >= state.expiresAt) {
      turnOff({ silent: false, expired: true });
      return;
    }
    updateTimerUI(state);
    maybeShowPostureReminder(state);
  }

  function turnOn(reason, durationLabel, minutes) {
    const expiresAt = Date.now() + minutes * 60 * 1000;
    const state = { isOn: true, expiresAt, reason, durationLabel, startedAt: Date.now() };
    setState(state);
    applyUnlockedDom();
    updateToggleUI(true);
    updateTimerUI(state);
    stopCountdown();
    lastPostureReminderMinute = -1;
    countdownTimer = setInterval(tick, 1000);
    incrementScrollOnCount();
    renderAppInsights();
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
      showToast(t("Time's up — scroll switched back OFF"));
    }
    renderAppInsights();
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

  // 言語切替時に、状態は変えずに表示だけ作り直す。
  function refreshUI() {
    const state = getState();
    updateToggleUI(Boolean(state.isOn));
    updateTimerUI(state);
  }

  return { init, turnOn, turnOff, getState, refreshUI };
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
      btn.textContent = t("Timer");
      setup.hidden = false;
      running.hidden = true;
      return;
    }

    const remaining = formatRemaining(state.expiresAt);
    btn.textContent = remaining;
    setup.hidden = true;
    running.hidden = false;
    runningText.textContent = state.lockOnExpire
      ? tf("{time} left — the app will lock when this reaches 0:00.", { time: remaining })
      : tf("{time} left. This is just a timer; nothing else happens at 0:00.", { time: remaining });
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
      showAppLockScreen(t("Time's up! MyHome Browser is locked until you unlock it."));
    } else {
      showToast(t("Timer's up"));
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
    showToast(t("Timer canceled"));
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

  // 言語切替時に、状態は変えずに表示だけ作り直す。
  function refreshUI() {
    updateUI(getState());
  }

  return { init, start, cancel, refreshUI };
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
    opt.textContent = t(reason);
    reasonSelect.appendChild(opt);
  });

  durationSelect.innerHTML = "";
  getDurations().forEach((d) => {
    const opt = document.createElement("option");
    opt.value = String(d.minutes);
    opt.dataset.label = t(d.label);
    opt.textContent = t(d.label);
    durationSelect.appendChild(opt);
  });

  // よく使う候補のほかに、その場で好きな長さを入れられる選択肢を用意する。
  const customOpt = document.createElement("option");
  customOpt.value = CUSTOM_DURATION_VALUE;
  customOpt.textContent = t("Custom…");
  durationSelect.appendChild(customOpt);

  applyCustomDurationVisibility();
}

// 「自由に決める」を選んでいる間だけ、時間・分の入力欄を出す。
const CUSTOM_DURATION_VALUE = "custom";

function applyCustomDurationVisibility() {
  const durationSelect = document.getElementById("durationSelect");
  const row = document.getElementById("customDurationRow");
  if (!durationSelect || !row) return;
  row.hidden = durationSelect.value !== CUSTOM_DURATION_VALUE;
}

// 入力された時間・分を分単位にまとめる。範囲外の値は入力欄ごと丸める。
function readCustomDurationMinutes() {
  const hoursInput = document.getElementById("customDurationHours");
  const minutesInput = document.getElementById("customDurationMinutes");
  const clamp = (input, max) => {
    const value = Math.min(max, Math.max(0, parseInt(input.value, 10) || 0));
    input.value = String(value);
    return value;
  };
  const hours = clamp(hoursInput, 23);
  const minutes = clamp(minutesInput, 59);
  return hours * 60 + minutes;
}

function openScrollOnModal() {
  populateScrollOnModal();
  document.getElementById("scrollPinInput").value = "";
  applyBiometricAvailabilityUI();
  document.getElementById("scrollOnModal").hidden = false;
}
function closeScrollOnModal() {
  document.getElementById("scrollOnModal").hidden = true;
  document.getElementById("scrollPinInput").value = "";
  stopCameraPreview(document.getElementById("scrollOnCameraPreview"));
}

function pickScrollOnReasonDuration() {
  const reasonSelect = document.getElementById("reasonSelect");
  const durationSelect = document.getElementById("durationSelect");
  const reason = reasonSelect.value;
  if (!reason) return null;

  if (durationSelect.value === CUSTOM_DURATION_VALUE) {
    const minutes = readCustomDurationMinutes();
    if (minutes < 1) {
      showToast(t("Set a time limit of at least 1 minute"));
      return null;
    }
    return { reason, minutes, durationLabel: formatDurationLabel(minutes) };
  }

  const minutes = Number(durationSelect.value);
  if (!minutes) return null;
  const durationLabel = durationSelect.selectedOptions[0]?.dataset.label || formatDurationLabel(minutes);
  return { reason, minutes, durationLabel };
}

// 分数を「1時間30分」「45分」のように表示用の文字列にする。
function formatDurationLabel(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours && minutes) return tf("{hours}h {minutes}m", { hours, minutes });
  if (hours) return tf("{hours}h", { hours });
  return tf("{minutes} min", { minutes });
}

/* ==========================================================================
   設定モーダル (理由 / 制限時間の追加・削除)
   ========================================================================== */

// 設定ページの「1日の目標」入力欄を、保存済みの値に合わせて表示する。
function refreshInsightsGoalSettingUI() {
  const input = document.getElementById("insightsGoalInput");
  const clearBtn = document.getElementById("clearInsightsGoalBtn");
  if (!input || !clearBtn) return;
  const minutes = getInsightsGoalMinutes();
  input.value = minutes || "";
  clearBtn.hidden = !minutes;
}

function renderReasonList() {
  const list = document.getElementById("reasonList");
  const reasons = getReasons();
  list.innerHTML = "";
  reasons.forEach((reason, idx) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = t(reason);
    li.appendChild(span);
    if (reasons.length > 1) {
      const btn = document.createElement("button");
      btn.className = "remove-btn";
      btn.type = "button";
      btn.textContent = "×";
      btn.setAttribute("aria-label", tf('Remove "{name}"', { name: t(reason) }));
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
    span.textContent = tf("{label} ({minutes} min)", { label: t(d.label), minutes: d.minutes });
    li.appendChild(span);
    if (durations.length > 1) {
      const btn = document.createElement("button");
      btn.className = "remove-btn";
      btn.type = "button";
      btn.textContent = "×";
      btn.setAttribute("aria-label", tf('Remove "{name}"', { name: t(d.label) }));
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

// スクロールをさせないため、Settings内も1画面ずつ送るページ形式にしている
// （長いコンテンツをmodal内でスクロールさせる代わりに、関連セクションをまとめて
// 4ページ以内に収め、ページ送りのラベルも番号ではなく内容の要約にしている）。
const SETTINGS_PAGES = [
  { id: "settingsPage-appearance", label: "Look & Feel" },
  { id: "settingsPage-pins", label: "PINs & Unlock" },
  { id: "settingsPage-insights", label: "App Insights" },
  { id: "settingsPage-limits", label: "Reasons & Limits" },
];
let settingsPageIndex = 0;

function renderSettingsPage() {
  SETTINGS_PAGES.forEach((page, i) => {
    document.getElementById(page.id).hidden = i !== settingsPageIndex;
  });

  const current = SETTINGS_PAGES[settingsPageIndex];
  document.getElementById("settingsPageIndicator").textContent =
    tf("{label} · {index} of {total}", {
      label: t(current.label),
      index: settingsPageIndex + 1,
      total: SETTINGS_PAGES.length,
    });

  // 非表示のうちは高さが0で行数を測れないので、表示になった時点で組み直す。
  if (current.id === "settingsPage-insights" && PAGINATED_INSIGHTS.settings) {
    PAGINATED_INSIGHTS.settings.refresh();
  }

  document.getElementById("settingsPrevBtn").disabled = settingsPageIndex === 0;
  document.getElementById("settingsNextBtn").disabled = settingsPageIndex === SETTINGS_PAGES.length - 1;

  const pageNumbers = document.getElementById("settingsPageNumbers");
  pageNumbers.innerHTML = "";
  SETTINGS_PAGES.forEach((page, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "page-number-btn settings-page-tab" + (i === settingsPageIndex ? " is-active" : "");
    btn.textContent = t(page.label);
    btn.addEventListener("click", () => goToSettingsPage(i));
    pageNumbers.appendChild(btn);
  });
}

function goToSettingsPage(index) {
  settingsPageIndex = Math.max(0, Math.min(SETTINGS_PAGES.length - 1, index));
  renderSettingsPage();
}

function openSettingsModal() {
  renderReasonList();
  renderDurationList();
  populateAppearanceInputs();
  renderAppInsights();
  document.getElementById("appLockQuestionInput").value = getAppLockQuestion();
  document.getElementById("appLockAnswerSetupInput").value = getAppLockAnswer();
  document.getElementById("biometricAppLockToggle").checked = isBiometricAppLockEnabled();
  document.getElementById("biometricScrollToggle").checked = isBiometricScrollEnabled();
  document.getElementById("biometricCameraToggle").checked = isBiometricCameraPreviewEnabled();
  document.getElementById("postureReminderToggle").checked = isPostureRemindersEnabled();
  applyBiometricAvailabilityUI();
  settingsPageIndex = 0;
  renderSettingsPage();
  document.getElementById("settingsModal").hidden = false;
}
function closeSettingsModal() {
  document.getElementById("settingsModal").hidden = true;
}

function formatInsightDuration(ms) {
  const totalSec = Math.round(ms / 1000);
  const mm = Math.floor(totalSec / 60);
  const ss = totalSec % 60;
  return mm > 0
    ? tf("{minutes}m {seconds}s", { minutes: mm, seconds: ss })
    : tf("{seconds}s", { seconds: ss });
}

// SettingsのApp Insightsページは常に全期間の合計を表示する。
// メインのInsightsタブは選ばれている期間(時間/日/月/年/全期間)に応じて内容が変わる。
function renderAppInsights() {
  if (PAGINATED_INSIGHTS.settings) {
    PAGINATED_INSIGHTS.settings.setData({
      apps: getAppInsights(),
      scrollOnCount: getScrollOnCount(),
      scrollGestureCount: getScrollGestureCount(),
      scrollOnTimeMs: getScrollOnTimeMs(),
    }, t("No data yet. Insights appear once you open an app from the dock or turn scroll ON."));
  }
  renderMainInsightsPanel();
}

function appendInsightsBarRow(list, { name, value, maxValue, color, statsText }) {
  const li = document.createElement("li");
  li.className = "insights-row";

  const nameEl = document.createElement("div");
  nameEl.className = "insights-name";
  nameEl.textContent = name;
  li.appendChild(nameEl);

  const track = document.createElement("div");
  track.className = "insights-row-bar-track";
  const fill = document.createElement("div");
  fill.className = "insights-row-bar-fill";
  const pct = value > 0 ? Math.max((value / maxValue) * 100, 4) : 0;
  fill.style.width = `${pct}%`;
  fill.style.background = color;
  track.appendChild(fill);
  li.appendChild(track);

  const stats = document.createElement("div");
  stats.className = "insights-stats";
  stats.textContent = statsText;
  li.appendChild(stats);

  list.appendChild(li);
}

// 縦軸=利用時間、横軸=各SNSの縦棒グラフ。回数ではなく「どれだけ時間を使ったか」を
// アプリ同士で直接比べられるようにするためのもの。
function renderInsightsTimeChart(apps) {
  const chart = document.getElementById("insightsTimeChart");
  const cols = document.getElementById("insightsTimeChartCols");
  const axis = document.getElementById("insightsTimeChartAxis");
  if (!chart || !cols || !axis) return;

  const ids = Object.keys(apps || {}).filter((id) => (apps[id].totalTimeMs || 0) > 0);
  // Day表示ではカレンダーが主役。小さい画面だとカレンダーとグラフの両方は
  // 収まりきらないため、この時だけグラフは畳んで一覧に高さを譲る。
  if (ids.length === 0 || insightsPeriodType === "day") {
    chart.hidden = true;
    return;
  }
  chart.hidden = false;

  ids.sort((a, b) => apps[b].totalTimeMs - apps[a].totalTimeMs);
  const maxMs = Math.max(...ids.map((id) => apps[id].totalTimeMs));
  const accent = getAppearance().accent;

  // 縦軸の目盛り: 上から最大値・半分・0 の3段階
  axis.innerHTML = "";
  [maxMs, maxMs / 2, 0].forEach((ms) => {
    const tick = document.createElement("div");
    tick.className = "insights-time-chart-tick";
    tick.textContent = formatInsightDuration(ms);
    axis.appendChild(tick);
  });

  cols.innerHTML = "";
  ids.forEach((id, index) => {
    const app = APP_CANDIDATES.find((a) => a.id === id);
    const ms = apps[id].totalTimeMs;

    const col = document.createElement("div");
    col.className = "insights-time-chart-col";

    const barWrap = document.createElement("div");
    barWrap.className = "insights-time-chart-bar-wrap";
    const bar = document.createElement("div");
    bar.className = "insights-time-chart-bar";
    bar.style.height = `${Math.max((ms / maxMs) * 100, 3)}%`;
    bar.style.background = insightsShade(accent, index);
    bar.title = `${app ? app.name : id}: ${formatInsightDuration(ms)}`;
    barWrap.appendChild(bar);
    col.appendChild(barWrap);

    const value = document.createElement("div");
    value.className = "insights-time-chart-value";
    value.textContent = formatInsightDuration(ms);
    col.appendChild(value);

    const label = document.createElement("div");
    label.className = "insights-time-chart-label";
    label.textContent = app ? app.name : id;
    col.appendChild(label);

    cols.appendChild(col);
  });
}

// 数字の羅列だけだと一目で比較しづらいため、開いた回数(Scrollは回数)を基準に
// 横棒グラフとして視覚化する。時間の長さではなく回数を揃えることで、
// アプリとScrollを同じ物差しで比較できるようにしている。
function collectInsightsRows(data) {
  const scrollCount = data.scrollOnCount || 0;
  const gestureCount = data.scrollGestureCount || 0;
  const scrollTimeMs = data.scrollOnTimeMs || 0;
  const apps = data.apps || {};
  const ids = Object.keys(apps).filter((id) => apps[id].opens > 0 || apps[id].canceled > 0);

  if (scrollCount === 0 && gestureCount === 0 && ids.length === 0) return [];

  ids.sort((a, b) => apps[b].opens - apps[a].opens);

  const accent = getAppearance().accent;
  const maxValue = Math.max(scrollCount, ...ids.map((id) => apps[id].opens), 1);
  const rows = [];

  if (scrollCount > 0 || gestureCount > 0) {
    const turnedOnPart = tf(
      scrollCount === 1 ? "Turned ON {count} time" : "Turned ON {count} times",
      { count: scrollCount }
    ) + (scrollTimeMs > 0 ? ` (${formatInsightDuration(scrollTimeMs)})` : "");
    const parts = [turnedOnPart];
    if (gestureCount > 0) {
      parts.push(tf(
        gestureCount === 1 ? "scrolled {count} time" : "scrolled {count} times",
        { count: gestureCount }
      ));
    }
    rows.push({
      name: t("Scroll"),
      value: scrollCount,
      maxValue,
      color: "var(--text-dim)",
      statsText: parts.join(" · "),
    });
  }

  ids.forEach((id, index) => {
    const app = APP_CANDIDATES.find((a) => a.id === id);
    const entry = apps[id];
    const avgMs = entry.sessionCount > 0 ? entry.totalTimeMs / entry.sessionCount : 0;

    const parts = [tf(
      entry.opens === 1 ? "Opened {count} time" : "Opened {count} times",
      { count: entry.opens }
    )];
    if (entry.canceled > 0) parts.push(tf("canceled {count}", { count: entry.canceled }));
    if (entry.sessionCount > 0) {
      // 反射的な確認（30秒未満）と、それより長い意図的な利用を分けて見せる。
      const quickCount = entry.quickCheckCount || 0;
      const longCount = entry.sessionCount - quickCount;
      if (quickCount > 0) {
        parts.push(tf(quickCount === 1 ? "{count} quick check" : "{count} quick checks", { count: quickCount }));
      }
      if (longCount > 0) {
        parts.push(tf(longCount === 1 ? "{count} longer session" : "{count} longer sessions", { count: longCount }));
      }
      parts.push(tf("~{total} total (avg {avg})", {
        total: formatInsightDuration(entry.totalTimeMs),
        avg: formatInsightDuration(avgMs),
      }));
    }

    rows.push({
      name: app ? app.name : id,
      value: entry.opens,
      maxValue,
      color: insightsShade(accent, index),
      statsText: parts.join(" · "),
    });
  });

  return rows;
}

// アプリが増えるとインサイト一覧も下に伸びてスクロールが必要になってしまうため、
// 他のフィードと同じくページ送り形式にする（スクロールON中は通常の一覧に戻す）。
function createPaginatedInsightsList({ listId, prevId, nextId, pageNumbersId }) {
  const ROW_GAP = 6;
  const FALLBACK_PER_PAGE = 2;
  let rows = [];
  let emptyMessage = "";
  let page = 0;
  let signature = null;
  let perPage = FALLBACK_PER_PAGE;

  // 一覧に割り当てられている高さに何行入るかを実測して決める。行数を固定にすると
  // 端末の画面サイズ次第でどうしてもはみ出す（=下に伸びる）ため。
  function measurePerPage(list) {
    const available = list.clientHeight;
    if (!available) return perPage;
    appendInsightsBarRow(list, rows[0]);
    const rowHeight = list.firstElementChild.getBoundingClientRect().height;
    list.innerHTML = "";
    if (!rowHeight) return perPage;
    return Math.max(1, Math.floor((available + ROW_GAP) / (rowHeight + ROW_GAP)));
  }

  function render() {
    const list = document.getElementById(listId);
    const pagination = document.getElementById(prevId).closest(".search-pagination");
    if (!list || !pagination) return;
    list.innerHTML = "";
    list.classList.remove("is-scrollable");

    if (rows.length === 0) {
      pagination.hidden = true;
      const empty = document.createElement("li");
      empty.className = "insights-empty";
      empty.textContent = emptyMessage;
      list.appendChild(empty);
      return;
    }

    if (ScrollLock.getState().isOn) {
      pagination.hidden = true;
      list.classList.add("is-scrollable");
      rows.forEach((row) => appendInsightsBarRow(list, row));
      return;
    }

    perPage = measurePerPage(list);

    pagination.hidden = rows.length <= perPage;
    const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
    if (page >= totalPages) page = totalPages - 1;
    rows.slice(page * perPage, page * perPage + perPage).forEach((row) => appendInsightsBarRow(list, row));

    document.getElementById(prevId).disabled = page === 0;
    document.getElementById(nextId).disabled = page >= totalPages - 1;

    const pageNumbers = document.getElementById(pageNumbersId);
    pageNumbers.innerHTML = "";
    for (let i = 0; i < totalPages; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "page-number-btn" + (i === page ? " is-active" : "");
      btn.textContent = String(i + 1);
      btn.addEventListener("click", () => { page = i; render(); });
      pageNumbers.appendChild(btn);
    }
  }

  document.getElementById(prevId).addEventListener("click", () => {
    if (page > 0) { page--; render(); }
  });
  document.getElementById(nextId).addEventListener("click", () => {
    const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
    if (page < totalPages - 1) { page++; render(); }
  });

  return {
    setData(data, message) {
      rows = collectInsightsRows(data);
      emptyMessage = message;
      // スクロール操作のたびにrenderAppInsights()が呼ばれるため、中身が変わって
      // いない再描画で見ているページが1ページ目に戻ってしまわないようにする。
      // 件数(スクロール回数など)は毎回変わりうるので、行の顔ぶれだけで比較する。
      const nextSignature = rows.map((r) => r.name).join("|");
      if (nextSignature !== signature) {
        signature = nextSignature;
        page = 0;
      }
      render();
    },
    refresh: render,
  };
}

/* ==========================================================================
   メインのInsightsタブ: 期間切り替え(全期間/時間/日/月/年)とカレンダー
   ========================================================================== */

let insightsPeriodType = "all";
let insightsPeriodDate = new Date();
let insightsCalendarMonth = new Date();

function insightsPeriodPrefix() {
  const d = insightsPeriodDate;
  const y = d.getFullYear(), m = pad2(d.getMonth() + 1), day = pad2(d.getDate()), h = pad2(d.getHours());
  switch (insightsPeriodType) {
    case "hour": return `${y}-${m}-${day}T${h}`;
    case "day": return `${y}-${m}-${day}`;
    case "month": return `${y}-${m}`;
    case "year": return `${y}`;
    default: return "";
  }
}

const INSIGHTS_PERIOD_LABEL = {
  hour: (d) => d.toLocaleString(currentLanguage, { month: "short", day: "numeric", hour: "numeric" }),
  day: (d) => d.toLocaleDateString(currentLanguage, { month: "short", day: "numeric", year: "numeric" }),
  month: (d) => d.toLocaleDateString(currentLanguage, { month: "long", year: "numeric" }),
  year: (d) => String(d.getFullYear()),
};

const INSIGHTS_PERIOD_EMPTY_MESSAGE = {
  all: "No data yet. Insights appear once you open an app from the dock or turn scroll ON.",
  hour: "No activity in this hour.",
  day: "No activity on this day.",
  month: "No activity in this month.",
  year: "No activity in this year.",
};

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function renderMainInsightsPanel() {
  if (!PAGINATED_INSIGHTS.main) return;

  const data = insightsPeriodType === "all"
    ? {
        apps: getAppInsights(),
        scrollOnCount: getScrollOnCount(),
        scrollGestureCount: getScrollGestureCount(),
        scrollOnTimeMs: getScrollOnTimeMs(),
      }
    : aggregateInsightsForPrefix(insightsPeriodPrefix());

  // 一覧は「残りの高さ」を実測して行数を決めるので、周辺(目標カード・期間ナビ・
  // カレンダー・グラフ)の表示切り替えを先に済ませてから最後に組む。順番を逆にすると、
  // 上の要素が出た分だけ一覧がはみ出してしまう。
  renderInsightsGoalCard();
  updateInsightsPeriodUI();
  renderInsightsTimeChart(data.apps);
  PAGINATED_INSIGHTS.main.setData(data, t(INSIGHTS_PERIOD_EMPTY_MESSAGE[insightsPeriodType]));
}

// 「今日」の合計を、本人が決めた目標・直近平均と照らし合わせて見せるカード。
// どの期間タブを見ていても常に「今日」についての表示で、ナビの日付には従わない。
function renderInsightsGoalCard() {
  const card = document.getElementById("insightsGoalCard");
  if (!card) return;

  const today = new Date();
  const goalMinutes = getInsightsGoalMinutes();
  const goalMs = goalMinutes ? goalMinutes * 60000 : null;
  const todayMs = totalUsageMsForDay(today);
  const avgMs = recentAverageUsageMs(today);

  if (goalMs === null && avgMs === null) {
    card.hidden = true;
    return;
  }
  card.hidden = false;

  const bar = document.getElementById("insightsGoalBar");
  const fill = document.getElementById("insightsGoalBarFill");
  const text = document.getElementById("insightsGoalText");
  const streakEl = document.getElementById("insightsGoalStreak");
  const trendEl = document.getElementById("insightsGoalTrend");

  if (goalMs !== null) {
    const isOver = todayMs > goalMs;
    bar.hidden = false;
    fill.style.width = `${Math.min(100, (todayMs / goalMs) * 100)}%`;
    fill.classList.toggle("is-over", isOver);
    fill.classList.toggle("is-under", !isOver);
    text.textContent = tf("{used} of your {goal} goal", {
      used: formatInsightDuration(todayMs),
      goal: tf("{minutes} min", { minutes: goalMinutes }),
    });

    const streak = goalStreakDays(today, goalMs);
    if (streak > 0) {
      streakEl.hidden = false;
      streakEl.textContent = tf(streak === 1 ? "{count} day within your goal" : "{count} days within your goal", { count: streak });
    } else {
      streakEl.hidden = true;
    }
  } else {
    bar.hidden = true;
    streakEl.hidden = true;
    text.textContent = t("Set a daily goal in Settings to track your progress");
  }

  if (avgMs !== null && avgMs > 0) {
    const percent = Math.round(Math.abs(todayMs - avgMs) / avgMs * 100);
    trendEl.hidden = false;
    trendEl.textContent = tf(
      todayMs >= avgMs ? "{percent}% above your recent average" : "{percent}% below your recent average",
      { percent }
    );
  } else {
    trendEl.hidden = true;
  }

  renderInsightsWeekChart(today, goalMs);
  renderInsightsHourHeatmap(today);
}

// 直近30日分を時間帯ごとに合算し、24マスの色の濃さで危ない時間帯を一目で示す。
function renderInsightsHourHeatmap(today) {
  const heatmap = document.getElementById("insightsHourHeatmap");
  const cells = document.getElementById("insightsHourHeatmapCells");
  if (!heatmap || !cells) return;

  const totals = aggregateUsageByHourOfDay(today, 30);
  const max = Math.max(...totals, 1);
  if (max <= 1) {
    heatmap.hidden = true;
    return;
  }
  heatmap.hidden = false;

  const accent = getAppearance().accent;
  cells.innerHTML = "";
  totals.forEach((ms, hour) => {
    const cell = document.createElement("div");
    cell.className = "insights-hour-heatmap-cell";
    const intensity = ms / max;
    cell.style.background = intensity > 0 ? insightsAlpha(accent, Math.max(0.12, intensity)) : "";
    cell.title = `${formatHourLabel(hour)}: ${formatInsightDuration(ms)}`;
    cells.appendChild(cell);
  });

  const hourFormat = new Intl.DateTimeFormat(currentLanguage, { hour: "numeric" });
  [0, 6, 12, 18].forEach((hour) => {
    const label = document.getElementById(`insightsHourHeatmapLabel${hour}`);
    if (label) label.textContent = hourFormat.format(new Date(2024, 0, 1, hour));
  });
}

function formatHourLabel(hour) {
  return new Intl.DateTimeFormat(currentLanguage, { hour: "numeric" }).format(new Date(2024, 0, 1, hour));
}

// 直近7日間（今日含む）の合計利用時間を棒グラフにする。1行の%表示だけより、
// 波があるのか下がってきているのかが一目で分かるようにするため。
function renderInsightsWeekChart(today, goalMs) {
  const chart = document.getElementById("insightsWeekChart");
  const cols = document.getElementById("insightsWeekChartCols");
  if (!chart || !cols) return;

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(day.getDate() - i);
    days.push({ date: day, ms: totalUsageMsForDay(day), isToday: i === 0 });
  }

  const hasAnyData = days.some((d) => d.ms > 0) || goalMs !== null;
  if (!hasAnyData) {
    chart.hidden = true;
    return;
  }
  chart.hidden = false;

  const max = Math.max(goalMs || 0, ...days.map((d) => d.ms), 1);
  const weekdayFormat = new Intl.DateTimeFormat(currentLanguage, { weekday: "short" });

  cols.innerHTML = "";
  days.forEach((d) => {
    const col = document.createElement("div");
    col.className = "insights-week-chart-col";

    const barTrack = document.createElement("div");
    barTrack.className = "insights-week-chart-bar-track";
    const bar = document.createElement("div");
    bar.className = "insights-week-chart-bar";
    if (goalMs !== null) bar.classList.add(d.ms > goalMs ? "is-over" : "is-under");
    bar.style.height = `${Math.max(2, (d.ms / max) * 100)}%`;
    bar.title = formatInsightDuration(d.ms);
    barTrack.appendChild(bar);

    const label = document.createElement("div");
    label.className = "insights-week-chart-label";
    if (d.isToday) label.classList.add("is-today");
    label.textContent = d.isToday ? t("Today") : weekdayFormat.format(d.date);

    col.append(barTrack, label);
    cols.appendChild(col);
  });
}

function updateInsightsPeriodUI() {
  document.querySelectorAll(".insights-period-tab").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.period === insightsPeriodType);
  });

  const nav = document.getElementById("insightsPeriodNav");
  const calendar = document.getElementById("insightsCalendar");
  const isAll = insightsPeriodType === "all";
  if (nav) nav.hidden = isAll;
  if (calendar) calendar.hidden = insightsPeriodType !== "day";

  if (!isAll) {
    const label = document.getElementById("insightsPeriodLabel");
    if (label) label.textContent = INSIGHTS_PERIOD_LABEL[insightsPeriodType](insightsPeriodDate);
  }

  if (insightsPeriodType === "day") {
    renderInsightsCalendar();
  }
}

function shiftInsightsPeriod(direction) {
  const d = new Date(insightsPeriodDate);
  switch (insightsPeriodType) {
    case "hour": d.setHours(d.getHours() + direction); break;
    case "day": d.setDate(d.getDate() + direction); break;
    case "month": d.setMonth(d.getMonth() + direction); break;
    case "year": d.setFullYear(d.getFullYear() + direction); break;
    default: return;
  }
  insightsPeriodDate = d;
  renderMainInsightsPanel();
}

function renderInsightsCalendar() {
  if (
    insightsCalendarMonth.getFullYear() !== insightsPeriodDate.getFullYear()
    || insightsCalendarMonth.getMonth() !== insightsPeriodDate.getMonth()
  ) {
    insightsCalendarMonth = new Date(insightsPeriodDate.getFullYear(), insightsPeriodDate.getMonth(), 1);
  }

  const monthLabel = document.getElementById("calendarMonthLabel");
  if (monthLabel) {
    monthLabel.textContent = insightsCalendarMonth.toLocaleDateString(currentLanguage, { month: "long", year: "numeric" });
  }

  // 曜日の見出しは選択中の言語のロケールから作る（日曜始まり）。
  const weekdays = document.getElementById("insightsCalendarWeekdays");
  if (weekdays) {
    weekdays.innerHTML = "";
    const format = new Intl.DateTimeFormat(currentLanguage, { weekday: "narrow" });
    for (let i = 0; i < 7; i++) {
      const span = document.createElement("span");
      span.textContent = format.format(new Date(2024, 0, 7 + i)); // 2024-01-07 は日曜
      weekdays.appendChild(span);
    }
  }

  const grid = document.getElementById("insightsCalendarGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const year = insightsCalendarMonth.getFullYear();
  const month = insightsCalendarMonth.getMonth();
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  for (let i = 0; i < startOffset; i++) {
    const pad = document.createElement("div");
    pad.className = "insights-calendar-day is-empty";
    grid.appendChild(pad);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "insights-calendar-day";
    if (cellDate.getDay() === 0) btn.classList.add("is-sunday");
    if (cellDate.getDay() === 6) btn.classList.add("is-saturday");
    if (dayHasActivity(cellDate)) btn.classList.add("has-data");
    if (isSameDay(cellDate, insightsPeriodDate)) btn.classList.add("is-selected");
    if (isSameDay(cellDate, today)) btn.classList.add("is-today");
    btn.textContent = String(day);
    btn.addEventListener("click", () => {
      insightsPeriodDate = cellDate;
      renderMainInsightsPanel();
    });
    grid.appendChild(btn);
  }
}

/* ==========================================================================
   言語設定（設定 > Look & Feel）
   オンボーディングで選んだ言語を、あとからでも変えられるようにする。
   ========================================================================== */

// 言語切替のあと、JS側で組み立てている文字列も作り直す。
// （静的なHTMLは applyLanguage() が控えておいた原文から差し替える）
function refreshTranslatedViews() {
  applyLanguage();
  ScrollLock.refreshUI();
  FocusTimer.refreshUI();
  renderReasonList();
  renderDurationList();
  refreshInsightsGoalSettingUI();
  renderSettingsPage();
  renderDock();
  applyDockCollapsed();
  renderAppInsights();
  // オンボーディング中はまだページ送りが用意されていないので、その時は飛ばす。
  if (PAGINATED_INSIGHTS.main) renderMainInsightsPanel();
  renderBrowser();
}

function initLanguageSetting() {
  const select = document.getElementById("languageSelect");
  if (!select) return;
  select.innerHTML = "";
  LANGUAGES.forEach((lang) => {
    const opt = document.createElement("option");
    opt.value = lang.code;
    opt.textContent = lang.name; // 言語名はその言語自身の表記のままにする
    select.appendChild(opt);
  });
  select.value = currentLanguage;
  select.addEventListener("change", () => {
    saveLanguage(select.value);
    applyLanguage(select.value);
    refreshTranslatedViews();
  });
}

// ページ送り制御はDOMを参照するため、init()から生成する。
const PAGINATED_INSIGHTS = { main: null, settings: null };

function initInsightsPanel() {
  PAGINATED_INSIGHTS.main = createPaginatedInsightsList({
    listId: "mainInsightsList",
    prevId: "mainInsightsPrevBtn",
    nextId: "mainInsightsNextBtn",
    pageNumbersId: "mainInsightsPageNumbers",
  });
  PAGINATED_INSIGHTS.settings = createPaginatedInsightsList({
    listId: "appInsightsList",
    prevId: "appInsightsPrevBtn",
    nextId: "appInsightsNextBtn",
    pageNumbersId: "appInsightsPageNumbers",
  });

  document.querySelectorAll(".insights-period-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      insightsPeriodType = btn.dataset.period;
      insightsPeriodDate = new Date();
      renderMainInsightsPanel();
    });
  });

  document.getElementById("insightsPeriodPrevBtn").addEventListener("click", () => shiftInsightsPeriod(-1));
  document.getElementById("insightsPeriodNextBtn").addEventListener("click", () => shiftInsightsPeriod(1));
  document.getElementById("insightsPeriodTodayBtn").addEventListener("click", () => {
    insightsPeriodDate = new Date();
    renderMainInsightsPanel();
  });

  document.getElementById("calendarPrevMonthBtn").addEventListener("click", () => {
    insightsCalendarMonth = new Date(insightsCalendarMonth.getFullYear(), insightsCalendarMonth.getMonth() - 1, 1);
    renderInsightsCalendar();
  });
  document.getElementById("calendarNextMonthBtn").addEventListener("click", () => {
    insightsCalendarMonth = new Date(insightsCalendarMonth.getFullYear(), insightsCalendarMonth.getMonth() + 1, 1);
    renderInsightsCalendar();
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
      showToast(t("Set at least 1 second"));
      return;
    }
    const lockOnExpire = document.getElementById("focusTimerLockInput").checked;
    FocusTimer.start(totalSeconds, lockOnExpire);
    closePanel();
    const label = [
      hours && tf("{hours}h", { hours }),
      minutes && tf("{minutes}m", { minutes }),
      seconds && tf("{seconds}s", { seconds }),
    ].filter(Boolean).join(" ") || tf("{seconds}s", { seconds: 0 });
    showToast(lockOnExpire
      ? tf("Timer started — app locks in {label}", { label })
      : tf("Timer started for {label}", { label }));
  });

  document.getElementById("focusTimerCancelBtn").addEventListener("click", () => {
    FocusTimer.cancel();
    closePanel();
  });
}

// 「どのSNSを使っていますか」のオンボーディング画面を、APP_CANDIDATESの中でも
// SNS系アプリだけに絞り込むための一覧。
const SNS_FEED_PLATFORMS = ["instagram", "facebook", "x", "youtube", "tiktok", "threads"];

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

// 検索中など、保存された設定を書き換えずに一時的にドックを畳みたい場合に使う。
// nullの間は保存された設定に従う。
let dockCollapsedOverride = null;

function setDockCollapsedOverride(value) {
  dockCollapsedOverride = value;
  applyDockCollapsed();
}

function applyDockCollapsed() {
  const collapsed = dockCollapsedOverride !== null ? dockCollapsedOverride : isDockCollapsed();
  const btn = document.getElementById("dockCollapseBtn");
  document.getElementById("dockContent").hidden = collapsed;
  btn.textContent = collapsed ? t("Show Apps") : t("Hide Apps");
  btn.setAttribute("aria-expanded", String(!collapsed));
}

function renderDock() {
  const grid = document.getElementById("dockGrid");
  const selectedIds = getSelectedAppIds();
  grid.innerHTML = "";

  if (selectedIds.length === 0) {
    const empty = document.createElement("div");
    empty.className = "dock-empty";
    empty.textContent = t("Add up to 10 apps from \"Edit Apps\"");
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
  recordHourly((bucket) => { bucket.scrollOnCount += 1; });
}

function getScrollOnTimeMs() {
  return loadJSON(STORAGE_KEYS.scrollOnTimeMs, 0);
}

function addScrollOnTimeMs(ms) {
  saveJSON(STORAGE_KEYS.scrollOnTimeMs, getScrollOnTimeMs() + ms);
  recordHourly((bucket) => { bucket.scrollOnTimeMs += ms; });
}

function getScrollGestureCount() {
  return loadJSON(STORAGE_KEYS.scrollGestureCount, 0);
}

function incrementScrollGestureCount() {
  saveJSON(STORAGE_KEYS.scrollGestureCount, getScrollGestureCount() + 1);
  recordHourly((bucket) => { bucket.scrollGestureCount += 1; });
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
  if (!data[appId]) data[appId] = { opens: 0, canceled: 0, totalTimeMs: 0, sessionCount: 0, quickCheckCount: 0 };
  if (data[appId].quickCheckCount === undefined) data[appId].quickCheckCount = 0;
  return data[appId];
}

function recordAppOpenDecision(appId, confirmed) {
  const data = getAppInsights();
  const entry = ensureInsightsEntry(data, appId);
  if (confirmed) entry.opens += 1; else entry.canceled += 1;
  saveAppInsights(data);

  recordHourly((bucket) => {
    const e = ensureInsightsEntry(bucket.apps, appId);
    if (confirmed) e.opens += 1; else e.canceled += 1;
  });
}

// Oulasvirta他(2012)の知見（確認の多くは30秒未満で、実際の必要からではなく
// 習慣やその場の暇つぶしで起きる）を踏まえ、短い「反射的な確認」と、それより
// 長い「意図的な利用」を分けて記録する。
const QUICK_CHECK_THRESHOLD_MS = 30000;

function recordAppSession(appId, durationMs) {
  const isQuickCheck = durationMs < QUICK_CHECK_THRESHOLD_MS;
  const data = getAppInsights();
  const entry = ensureInsightsEntry(data, appId);
  entry.totalTimeMs += durationMs;
  entry.sessionCount += 1;
  if (isQuickCheck) entry.quickCheckCount += 1;
  saveAppInsights(data);

  recordHourly((bucket) => {
    const e = ensureInsightsEntry(bucket.apps, appId);
    e.totalTimeMs += durationMs;
    e.sessionCount += 1;
    if (isQuickCheck) e.quickCheckCount += 1;
  });
}

/* ==========================================================================
   時間帯別インサイト (時間/日/月/年ごとの集計とカレンダー表示に使う)
   1時間単位のバケットにイベントを記録しておき、表示時にプレフィックス一致で
   日/月/年に集計する。粒度を時間単位に統一することで、保存先は1つで済む。
   ========================================================================== */

function pad2(n) {
  return String(n).padStart(2, "0");
}

function hourBucketKey(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}`;
}

function dayPrefix(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function getInsightsHourly() {
  return loadJSON(STORAGE_KEYS.insightsHourly, {});
}

function saveInsightsHourly(data) {
  saveJSON(STORAGE_KEYS.insightsHourly, data);
}

function recordHourly(mutate) {
  const data = getInsightsHourly();
  const key = hourBucketKey(new Date());
  if (!data[key]) {
    data[key] = { apps: {}, scrollOnCount: 0, scrollGestureCount: 0, scrollOnTimeMs: 0 };
  }
  mutate(data[key]);
  saveInsightsHourly(data);
}

// prefixは "2026" (年) / "2026-07" (月) / "2026-07-25" (日) / "2026-07-25T14" (時間) のいずれか。
function aggregateInsightsForPrefix(prefix) {
  const hourly = getInsightsHourly();
  const result = { apps: {}, scrollOnCount: 0, scrollGestureCount: 0, scrollOnTimeMs: 0 };
  Object.keys(hourly).forEach((key) => {
    if (!key.startsWith(prefix)) return;
    const bucket = hourly[key];
    result.scrollOnCount += bucket.scrollOnCount || 0;
    result.scrollGestureCount += bucket.scrollGestureCount || 0;
    result.scrollOnTimeMs += bucket.scrollOnTimeMs || 0;
    Object.keys(bucket.apps || {}).forEach((appId) => {
      const entry = ensureInsightsEntry(result.apps, appId);
      const src = bucket.apps[appId];
      entry.opens += src.opens || 0;
      entry.canceled += src.canceled || 0;
      entry.totalTimeMs += src.totalTimeMs || 0;
      entry.sessionCount += src.sessionCount || 0;
      entry.quickCheckCount += src.quickCheckCount || 0;
    });
  });
  return result;
}

function dayHasActivity(date) {
  const prefix = dayPrefix(date);
  const hourly = getInsightsHourly();
  return Object.keys(hourly).some((key) => key.startsWith(prefix));
}

/* --------------------------------------------------------------------------
   1日ごとの目標（自分で決めた1日の合計利用時間）
   「アプリの判断で恥をかかせる」のではなく、本人が決めた基準に対しての
   進捗として見せる。基準そのものが無ければ、直近平均との比較だけ示す。
   -------------------------------------------------------------------------- */

function getInsightsGoalMinutes() {
  return loadJSON(STORAGE_KEYS.insightsGoalMinutes, null);
}

// 目標を保存した日時も一緒に控えておく。ストリークはこの日より前には遡らない
// （さもないと「記録の無い日は自動的に達成扱い」になり、決めた直後から
// 何日もの偽の連続達成が出てしまう）。
function saveInsightsGoalMinutes(minutes) {
  saveJSON(STORAGE_KEYS.insightsGoalMinutes, minutes);
  saveJSON(STORAGE_KEYS.insightsGoalSetAt, minutes ? Date.now() : null);
}

function getInsightsGoalSetAt() {
  return loadJSON(STORAGE_KEYS.insightsGoalSetAt, null);
}

// Hansraj(2014)の研究（頭を前に傾けて画面を見続けると首に負荷がかかる）を踏まえ、
// スクロールONが続いている間、一定間隔で姿勢を確認するよう促す（既定はオフ）。
function isPostureRemindersEnabled() {
  return loadJSON(STORAGE_KEYS.postureRemindersEnabled, false);
}

function savePostureRemindersEnabled(value) {
  saveJSON(STORAGE_KEYS.postureRemindersEnabled, value);
}

// その日の合計利用時間（各アプリの滞在時間 + スクロールONだった時間）をミリ秒で返す。
function totalUsageMsForDay(date) {
  const data = aggregateInsightsForPrefix(dayPrefix(date));
  const appsMs = Object.values(data.apps).reduce((sum, entry) => sum + (entry.totalTimeMs || 0), 0);
  return appsMs + (data.scrollOnTimeMs || 0);
}

// 直近7日間（今日は含まない）で記録がある日だけを対象にした平均利用時間。
// 比較できる過去が無ければ null を返す。
function recentAverageUsageMs(referenceDate) {
  const samples = [];
  for (let i = 1; i <= 7; i++) {
    const day = new Date(referenceDate);
    day.setDate(day.getDate() - i);
    if (dayHasActivity(day)) samples.push(totalUsageMsForDay(day));
  }
  if (samples.length === 0) return null;
  return samples.reduce((sum, ms) => sum + ms, 0) / samples.length;
}

// dscout(2016)の知見（利用は1日を通して散発的に起きる）を踏まえ、直近30日分の
// 記録を時間帯(0〜23時)ごとに合算し、どの時間帯に利用が集中しているかを見せる。
function aggregateUsageByHourOfDay(referenceDate, windowDays) {
  const hourly = getInsightsHourly();
  const totals = new Array(24).fill(0);
  const cutoff = new Date(referenceDate);
  cutoff.setDate(cutoff.getDate() - windowDays);
  Object.keys(hourly).forEach((key) => {
    const match = key.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2})$/);
    if (!match) return;
    const [, y, m, d, h] = match;
    const bucketDate = new Date(Number(y), Number(m) - 1, Number(d));
    if (bucketDate < cutoff) return;
    const bucket = hourly[key];
    const appsMs = Object.values(bucket.apps || {}).reduce((sum, e) => sum + (e.totalTimeMs || 0), 0);
    totals[Number(h)] += appsMs + (bucket.scrollOnTimeMs || 0);
  });
  return totals;
}

// 昨日から遡って、その日の合計が目標以内だった連続日数。
// 記録が全く無い日も0として目標達成扱いにする一方、際限なく遡らないよう30日で打ち切る。
function goalStreakDays(referenceDate, goalMs) {
  const setAt = getInsightsGoalSetAt();
  const setAtPrefix = setAt ? dayPrefix(new Date(setAt)) : null;
  let streak = 0;
  for (let i = 1; i <= 30; i++) {
    const day = new Date(referenceDate);
    day.setDate(day.getDate() - i);
    // この目標を決めるより前の日は、達成扱いにも未達扱いにもしない。
    if (setAtPrefix && dayPrefix(day) < setAtPrefix) break;
    if (totalUsageMsForDay(day) > goalMs) break;
    streak++;
  }
  return streak;
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
      renderAppInsights();
    }
  });
}

function openApp(app) {
  // Instagram/Facebook/X/TikTokは埋め込み表示をX-Frame-Options等で拒否しており、
  // このアプリからは中身を操作できないため、ネイティブアプリのschemeへ直接遷移する
  // 従来方式はやめ、常にWeb版を新しいタブで開く（ユーザーの選択に基づく仕様）。
  window.open(app.web, "_blank", "noopener");
  startAwaySession(app.id);
}

/* ==========================================================================
   ドックのアプリを開く前の確認モーダル
   ========================================================================== */

let pendingConfirmApp = null;

function openAppOpenConfirm(app) {
  pendingConfirmApp = app;
  document.getElementById("appOpenConfirmTitle").textContent = tf("Open {app}?", { app: app.name });
  document.getElementById("appOpenConfirmDesc").textContent =
    tf("You're about to leave MyHome Browser to open {app}.", { app: app.name });
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
   タブブラウザ (<iframe>の配列を切り替えて表示する簡易ブラウザ)
   本物の<webview>タブやsession.webRequestによる広告ブロックはElectron
   (デスクトップアプリ)専用のAPIで、ブラウザのWebページ内では動かない。
   ここではWeb標準技術だけで近い形にする:
   タブ=<iframe>の配列を切り替えるだけ、広告ブロック=既知の広告/トラッキング
   ドメインへの遷移そのものを拒否するだけ（読み込み済みページ内部の通信までは
   クロスオリジンの制約上検知できない）。
   ========================================================================== */

// 既知の広告・トラッキング配信ドメインへの遷移を拒否する簡易ブロックリスト。
const AD_BLOCK_DOMAINS = [
  "doubleclick.net", "googlesyndication.com", "googleadservices.com",
  "adservice.google.com", "amazon-adsystem.com", "taboola.com", "outbrain.com",
  "criteo.com", "scorecardresearch.com", "moatads.com", "pubmatic.com",
  "rubiconproject.com", "adnxs.com", "adsrvr.org", "media.net", "adform.net",
];

function hostnameOf(url) {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return "";
  }
}

function isAdBlockedUrl(url) {
  const host = hostnameOf(url).toLowerCase();
  if (!host) return false;
  return AD_BLOCK_DOMAINS.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

// アドレスらしい入力(http(s)://始まり、またはドット区切りで空白を含まない)かどうかの簡易判定。
// それ以外は検索クエリとして扱う。
function looksLikeUrl(input) {
  if (/^https?:\/\//i.test(input)) return true;
  return !input.includes(" ") && /^[^\s]+\.[^\s]{2,}([/?#].*)?$/.test(input);
}

function normalizeUrl(input) {
  return /^https?:\/\//i.test(input) ? input : `https://${input}`;
}

// APIキーなしで使える簡易検索として、DuckDuckGoのHTML版結果ページを使う。
function buildSearchUrl(query) {
  return `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
}

function resolveNavigationUrl(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;
  return looksLikeUrl(trimmed) ? normalizeUrl(trimmed) : buildSearchUrl(trimmed);
}

function getBrowserTabs() {
  return loadJSON(STORAGE_KEYS.browserTabs, []);
}
function saveBrowserTabs(tabs) {
  saveJSON(STORAGE_KEYS.browserTabs, tabs);
}
function getActiveTabId() {
  return loadJSON(STORAGE_KEYS.activeTabId, null);
}
function saveActiveTabId(id) {
  saveJSON(STORAGE_KEYS.activeTabId, id);
}
function makeTabId() {
  return `tab-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

let tabStripPage = 0;
const TAB_STRIP_PER_PAGE = 4;

function tabStripPageForIndex(index) {
  return index < 0 ? 0 : Math.floor(index / TAB_STRIP_PER_PAGE);
}

function openTab(rawInput) {
  const url = resolveNavigationUrl(rawInput);
  if (!url) return;
  if (isAdBlockedUrl(url)) {
    showToast(t("Blocked: this looks like an ad or tracking domain"));
    return;
  }
  const tabs = getBrowserTabs();
  const tab = { id: makeTabId(), url, title: hostnameOf(url) || url };
  tabs.push(tab);
  saveBrowserTabs(tabs);
  saveActiveTabId(tab.id);
  tabStripPage = tabStripPageForIndex(tabs.length - 1);
  document.getElementById("searchInput").value = "";
  renderBrowser();
}

function closeTab(id) {
  let tabs = getBrowserTabs();
  const closingIndex = tabs.findIndex((tb) => tb.id === id);
  if (closingIndex === -1) return;
  tabs = tabs.filter((tb) => tb.id !== id);
  saveBrowserTabs(tabs);

  if (getActiveTabId() === id) {
    const nextIndex = Math.min(closingIndex, tabs.length - 1);
    const next = tabs[nextIndex];
    saveActiveTabId(next ? next.id : null);
    tabStripPage = tabStripPageForIndex(nextIndex);
  }
  const frame = document.getElementById(`browserFrame-${id}`);
  if (frame) frame.remove();
  renderBrowser();
}

function switchTab(id) {
  saveActiveTabId(id);
  const index = getBrowserTabs().findIndex((tb) => tb.id === id);
  tabStripPage = tabStripPageForIndex(index);
  renderBrowser();
}

// 表示中のタブに対応する<iframe>だけをその場で作る（他のタブは切り替えるまで
// 読み込まない。バックグラウンドで無駄な通信を発生させないため）。
function ensureFrameForTab(tab) {
  let frame = document.getElementById(`browserFrame-${tab.id}`);
  if (frame) return frame;
  frame = document.createElement("iframe");
  frame.id = `browserFrame-${tab.id}`;
  frame.className = "browser-frame";
  frame.src = tab.url;
  frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox");
  frame.setAttribute("referrerpolicy", "no-referrer");
  document.getElementById("browserFrames").appendChild(frame);
  return frame;
}

function renderTabStrip(tabs, activeId) {
  const strip = document.getElementById("tabStrip");
  const list = document.getElementById("tabStripList");
  const pagination = document.getElementById("tabStripPagination");
  strip.hidden = tabs.length === 0;
  if (tabs.length === 0) return;

  const totalPages = Math.max(1, Math.ceil(tabs.length / TAB_STRIP_PER_PAGE));
  if (tabStripPage >= totalPages) tabStripPage = totalPages - 1;
  if (tabStripPage < 0) tabStripPage = 0;

  list.innerHTML = "";
  const start = tabStripPage * TAB_STRIP_PER_PAGE;
  tabs.slice(start, start + TAB_STRIP_PER_PAGE).forEach((tab) => {
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "tab-strip-pill" + (tab.id === activeId ? " is-active" : "");
    const label = document.createElement("span");
    label.className = "tab-strip-pill-label";
    label.textContent = tab.title;
    pill.appendChild(label);
    pill.addEventListener("click", () => switchTab(tab.id));

    const closeBtn = document.createElement("span");
    closeBtn.className = "tab-strip-pill-close";
    closeBtn.textContent = "×";
    closeBtn.setAttribute("role", "button");
    closeBtn.setAttribute("aria-label", tf('Close tab "{title}"', { title: tab.title }));
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeTab(tab.id);
    });
    pill.appendChild(closeBtn);

    list.appendChild(pill);
  });

  pagination.hidden = totalPages <= 1;
  document.getElementById("tabStripPrevBtn").disabled = tabStripPage === 0;
  document.getElementById("tabStripNextBtn").disabled = tabStripPage >= totalPages - 1;
  const pageNumbers = document.getElementById("tabStripPageNumbers");
  pageNumbers.innerHTML = "";
  for (let i = 0; i < totalPages; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "page-number-btn" + (i === tabStripPage ? " is-active" : "");
    btn.textContent = String(i + 1);
    btn.addEventListener("click", () => {
      tabStripPage = i;
      renderBrowser();
    });
    pageNumbers.appendChild(btn);
  }
}

function renderBrowser() {
  const tabs = getBrowserTabs();
  let activeId = getActiveTabId();
  if (activeId && !tabs.some((tb) => tb.id === activeId)) activeId = null;
  if (!activeId && tabs.length > 0) {
    activeId = tabs[tabs.length - 1].id;
    saveActiveTabId(activeId);
  }

  renderTabStrip(tabs, activeId);

  const empty = document.getElementById("browserEmpty");
  const viewport = document.getElementById("browserViewport");

  if (!activeId) {
    empty.hidden = false;
    viewport.hidden = true;
    setDockCollapsedOverride(null);
    return;
  }

  empty.hidden = true;
  viewport.hidden = false;
  setDockCollapsedOverride(true);

  const activeTab = tabs.find((tb) => tb.id === activeId);
  document.querySelectorAll("#browserFrames .browser-frame").forEach((frame) => {
    frame.hidden = frame.id !== `browserFrame-${activeId}`;
  });
  ensureFrameForTab(activeTab);

  document.getElementById("browserViewportUrl").textContent = activeTab.title;
  document.getElementById("browserOpenExternalBtn").href = activeTab.url;
  updateBookmarkButtonState(activeTab.url);
}

/* ==========================================================================
   ブックマーク (URLとタイトルをlocalStorageに保存するだけの簡易版)
   ========================================================================== */

function getBookmarks() {
  return loadJSON(STORAGE_KEYS.bookmarks, []);
}
function saveBookmarksData(bookmarks) {
  saveJSON(STORAGE_KEYS.bookmarks, bookmarks);
}
function isBookmarked(url) {
  return getBookmarks().some((b) => b.url === url);
}
function addBookmark(url, title) {
  const bookmarks = getBookmarks();
  if (bookmarks.some((b) => b.url === url)) return;
  bookmarks.unshift({ url, title, savedAt: Date.now() });
  saveBookmarksData(bookmarks);
}
function removeBookmark(url) {
  saveBookmarksData(getBookmarks().filter((b) => b.url !== url));
}

function updateBookmarkButtonState(url) {
  const btn = document.getElementById("bookmarkTabBtn");
  if (!btn) return;
  const saved = isBookmarked(url);
  btn.textContent = saved ? "★" : "☆";
  btn.setAttribute("aria-label", saved ? t("Remove bookmark") : t("Bookmark this page"));
  btn.classList.toggle("is-active", saved);
}

let bookmarksPage = 0;
const BOOKMARKS_FALLBACK_PER_PAGE = 3;
const BOOKMARKS_ROW_GAP = 5;

function buildBookmarkRow(bookmark) {
  const li = document.createElement("li");
  li.className = "bookmark-row";

  const open = document.createElement("button");
  open.type = "button";
  open.className = "bookmark-open-btn";
  const title = document.createElement("span");
  title.className = "bookmark-title";
  title.textContent = bookmark.title;
  const url = document.createElement("span");
  url.className = "bookmark-url";
  url.textContent = hostnameOf(bookmark.url) || bookmark.url;
  open.append(title, url);
  open.addEventListener("click", () => {
    closeBookmarksModal();
    openTab(bookmark.url);
  });
  li.appendChild(open);

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.type = "button";
  removeBtn.textContent = "×";
  removeBtn.setAttribute("aria-label", tf('Remove "{name}"', { name: bookmark.title }));
  removeBtn.addEventListener("click", () => {
    removeBookmark(bookmark.url);
    renderBookmarksList();
    const tabs = getBrowserTabs();
    const activeTab = tabs.find((tb) => tb.id === getActiveTabId());
    if (activeTab) updateBookmarkButtonState(activeTab.url);
  });
  li.appendChild(removeBtn);

  return li;
}

// 一覧に割り当てられている高さに何件入るかを実測して決める（他の一覧と同じ手法）。
// 固定件数にすると端末の画面サイズ次第でモーダルからはみ出してしまうため。
function measureBookmarksPerPage(list, bookmarks) {
  const available = list.clientHeight;
  if (!available) return BOOKMARKS_FALLBACK_PER_PAGE;
  list.appendChild(buildBookmarkRow(bookmarks[0]));
  const rowHeight = list.firstElementChild.getBoundingClientRect().height;
  list.innerHTML = "";
  if (!rowHeight) return BOOKMARKS_FALLBACK_PER_PAGE;
  return Math.max(1, Math.floor((available + BOOKMARKS_ROW_GAP) / (rowHeight + BOOKMARKS_ROW_GAP)));
}

function renderBookmarksList() {
  const list = document.getElementById("bookmarksList");
  const pagination = document.querySelector("#bookmarksModal .search-pagination");
  const bookmarks = getBookmarks();
  list.innerHTML = "";

  if (bookmarks.length === 0) {
    pagination.hidden = true;
    const li = document.createElement("li");
    li.className = "insights-empty";
    li.textContent = t("No bookmarks yet. Open a page and tap the star to save it.");
    list.appendChild(li);
    return;
  }

  const perPage = measureBookmarksPerPage(list, bookmarks);
  const totalPages = Math.max(1, Math.ceil(bookmarks.length / perPage));
  if (bookmarksPage >= totalPages) bookmarksPage = totalPages - 1;
  pagination.hidden = totalPages <= 1;

  const start = bookmarksPage * perPage;
  bookmarks.slice(start, start + perPage).forEach((bookmark) => list.appendChild(buildBookmarkRow(bookmark)));

  document.getElementById("bookmarksPrevBtn").disabled = bookmarksPage === 0;
  document.getElementById("bookmarksNextBtn").disabled = bookmarksPage >= totalPages - 1;
  const pageNumbers = document.getElementById("bookmarksPageNumbers");
  pageNumbers.innerHTML = "";
  for (let i = 0; i < totalPages; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "page-number-btn" + (i === bookmarksPage ? " is-active" : "");
    btn.textContent = String(i + 1);
    btn.addEventListener("click", () => {
      bookmarksPage = i;
      renderBookmarksList();
    });
    pageNumbers.appendChild(btn);
  }
}

function openBookmarksModal() {
  bookmarksPage = 0;
  renderBookmarksList();
  document.getElementById("bookmarksModal").hidden = false;
}
function closeBookmarksModal() {
  document.getElementById("bookmarksModal").hidden = true;
}

function openInsightsModal() {
  document.getElementById("insightsModal").hidden = false;
  renderAppInsights();
}
function closeInsightsModal() {
  document.getElementById("insightsModal").hidden = true;
}

/* ==========================================================================
   初期化 / イベント登録
   ========================================================================== */

function init() {
  // 画面を組み立てる前に言語を確定させ、以降 t() が正しい訳を返せるようにする。
  applyLanguage(getLanguage());
  initAppLock();
  initOnboarding();
  initBiometricSupport();
  initLanguageSetting();
  applyAppearance();
  ScrollLock.init();
  FocusTimer.init();
  initFocusTimerPanel();
  initAwaySessionTracking();
  initScrollGestureTracking();
  initInsightsPanel();
  renderAppInsights();
  renderDock();
  applyDockCollapsed();
  renderBrowser();

  document.getElementById("dockCollapseBtn").addEventListener("click", () => {
    // 検索中の自動折りたたみ中でも、押した時は「今見えている状態」から
    // 反転させる（保存された設定から反転させると押しても変わらないため）。
    const collapsed = !document.getElementById("dockContent").hidden;
    dockCollapsedOverride = null;
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

  // 選択肢は開くたびに作り直すが、select自体は使い回すのでここで一度だけ繋ぐ。
  document.getElementById("durationSelect").addEventListener("change", applyCustomDurationVisibility);

  document.getElementById("cancelScrollOn").addEventListener("click", closeScrollOnModal);
  document.getElementById("confirmScrollOn").addEventListener("click", () => {
    const picked = pickScrollOnReasonDuration();
    if (!picked) return;
    const pinInput = document.getElementById("scrollPinInput");
    if (pinInput.value !== getPin()) {
      showToast(t("Incorrect PIN"));
      pinInput.value = "";
      pinInput.focus();
      return;
    }
    ScrollLock.turnOn(picked.reason, picked.durationLabel, picked.minutes);
    closeScrollOnModal();
  });

  document.getElementById("scrollOnBiometricBtn").addEventListener("click", async () => {
    const picked = pickScrollOnReasonDuration();
    if (!picked) return;
    const credentialId = getBiometricScrollCredentialId();
    if (!credentialId) return;
    const videoEl = document.getElementById("scrollOnCameraPreview");
    startCameraPreviewIfEnabled(videoEl);
    try {
      await BiometricAuth.verify(credentialId);
      stopCameraPreview(videoEl);
      ScrollLock.turnOn(picked.reason, picked.durationLabel, picked.minutes);
      closeScrollOnModal();
    } catch (e) {
      stopCameraPreview(videoEl);
      showToast(t("Face ID / Fingerprint failed"));
    }
  });

  document.getElementById("savePinBtn").addEventListener("click", () => {
    const input = document.getElementById("newPinInput");
    const value = input.value.trim();
    if (!/^\d{4}$/.test(value)) {
      showToast(t("PIN must be exactly 4 digits"));
      return;
    }
    savePin(value);
    input.value = "";
    showToast(t("PIN updated"));
  });

  document.getElementById("settingsBtn").addEventListener("click", openSettingsModal);
  document.getElementById("closeSettings").addEventListener("click", closeSettingsModal);
  document.getElementById("settingsPrevBtn").addEventListener("click", () => goToSettingsPage(settingsPageIndex - 1));
  document.getElementById("settingsNextBtn").addEventListener("click", () => goToSettingsPage(settingsPageIndex + 1));

  document.getElementById("appOpenCancelBtn").addEventListener("click", () => {
    if (pendingConfirmApp) recordAppOpenDecision(pendingConfirmApp.id, false);
    closeAppOpenConfirm();
    renderAppInsights();
  });
  document.getElementById("appOpenConfirmBtn").addEventListener("click", () => {
    const app = pendingConfirmApp;
    closeAppOpenConfirm();
    if (app) {
      recordAppOpenDecision(app.id, true);
      renderAppInsights();
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

  refreshInsightsGoalSettingUI();

  document.getElementById("saveInsightsGoalBtn").addEventListener("click", () => {
    const input = document.getElementById("insightsGoalInput");
    const minutes = Number(input.value);
    if (!minutes || minutes <= 0) {
      showToast(t("Enter a number of minutes"));
      return;
    }
    saveInsightsGoalMinutes(minutes);
    refreshInsightsGoalSettingUI();
    renderInsightsGoalCard();
    showToast(t("Goal saved"));
  });

  document.getElementById("clearInsightsGoalBtn").addEventListener("click", () => {
    saveInsightsGoalMinutes(null);
    refreshInsightsGoalSettingUI();
    renderInsightsGoalCard();
    showToast(t("Goal removed"));
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
      showToast(t("Could not load that image"));
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
    closeAppPicker();
  });

  document.getElementById("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("searchInput").value.trim();
    if (!input) return;
    openTab(input);
  });

  document.getElementById("tabStripPrevBtn").addEventListener("click", () => {
    if (tabStripPage > 0) {
      tabStripPage--;
      renderBrowser();
    }
  });
  document.getElementById("tabStripNextBtn").addEventListener("click", () => {
    const tabs = getBrowserTabs();
    const totalPages = Math.max(1, Math.ceil(tabs.length / TAB_STRIP_PER_PAGE));
    if (tabStripPage < totalPages - 1) {
      tabStripPage++;
      renderBrowser();
    }
  });

  document.getElementById("bookmarkTabBtn").addEventListener("click", () => {
    const tabs = getBrowserTabs();
    const activeTab = tabs.find((tb) => tb.id === getActiveTabId());
    if (!activeTab) return;
    if (isBookmarked(activeTab.url)) {
      removeBookmark(activeTab.url);
      showToast(t("Bookmark removed"));
    } else {
      addBookmark(activeTab.url, activeTab.title);
      showToast(t("Bookmark added"));
    }
    updateBookmarkButtonState(activeTab.url);
  });

  document.getElementById("bookmarksBtn").addEventListener("click", openBookmarksModal);
  document.getElementById("closeBookmarks").addEventListener("click", closeBookmarksModal);
  document.getElementById("bookmarksPrevBtn").addEventListener("click", () => {
    if (bookmarksPage > 0) {
      bookmarksPage--;
      renderBookmarksList();
    }
  });
  document.getElementById("bookmarksNextBtn").addEventListener("click", () => {
    if (!document.getElementById("bookmarksNextBtn").disabled) {
      bookmarksPage++;
      renderBookmarksList();
    }
  });

  document.getElementById("insightsBtn").addEventListener("click", openInsightsModal);
  document.getElementById("closeInsights").addEventListener("click", closeInsightsModal);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  handleShortcutAction();
}

// ホーム画面アイコン長押しのショートカット(manifest.jsonのshortcuts)から
// ?action=scrollOn / ?action=scrollOff 付きで開かれた場合の処理。
// OFFにするのはPIN不要のためその場で即実行、ONにする方は既存のPIN/生体認証の
// 確認フローを必ず経由させる(ショートカットで保護を迂回させないため)。
function handleShortcutAction() {
  const params = new URLSearchParams(location.search);
  const action = params.get("action");
  if (!action) return;

  history.replaceState(null, "", location.pathname + location.hash);

  if (!isOnboardingComplete()) return;

  if (action === "scrollOff") {
    if (ScrollLock.getState().isOn) {
      ScrollLock.turnOff();
      showToast(t("Scroll turned OFF"));
    }
  } else if (action === "scrollOn") {
    if (!ScrollLock.getState().isOn) {
      openScrollOnModal();
    }
  }
}

document.addEventListener("DOMContentLoaded", init);
