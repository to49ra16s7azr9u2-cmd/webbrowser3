"use strict";

/* ==========================================================================
   ストレージキー / 初期データ
   ========================================================================== */

const STORAGE_KEYS = {
  scrollState: "myhome:scrollState",
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
  dictEntries: "myhome:dictEntries",
  dictGroups: "myhome:dictGroups",
  dictSort: "myhome:dictSort",
  browsingTimeMs: "myhome:browsingTimeMs",
  browsingCheckinsEnabled: "myhome:browsingCheckinsEnabled",
  feedAppsNeedScrollOn: "myhome:feedAppsNeedScrollOn",
  scrollGatedApps: "myhome:scrollGatedApps",
  recommendOrder: "myhome:recommendOrder",
  breakEnabled: "myhome:breakEnabled",
  breakIntervalMin: "myhome:breakIntervalMin",
  breakScrollCount: "myhome:breakScrollCount",
  breakState: "myhome:breakState",
  openAppsInSameWindow: "myhome:openAppsInSameWindow",
  closeOnScrollTimeUp: "myhome:closeOnScrollTimeUp",
  pendingAwaySession: "myhome:pendingAwaySession",
  notifyPrefs: "myhome:notifyPrefs",
  notifyGoalDay: "myhome:notifyGoalDay",
  customApps: "myhome:customApps",
  promiseHistory: "myhome:promiseHistory",
  lastLookBackAt: "myhome:lastLookBackAt",
  aspirations: "myhome:aspirations",
  aspirationLog: "myhome:aspirationLog",
  ifThenRules: "myhome:ifThenRules",
  coolOffEnabled: "myhome:coolOffEnabled",
  pendingChanges: "myhome:pendingChanges",
  firstRunMomentSeen: "myhome:firstRunMomentSeen",
  lastScrollDurationMinutes: "myhome:lastScrollDurationMinutes",
  selfBreakState: "myhome:selfBreakState",
  pushEnabled: "myhome:pushEnabled",
  pushSubscriptionId: "myhome:pushSubscriptionId",
  analyticsDeviceId: "myhome:analyticsDeviceId",
  routineRecords: "myhome:routineRecords",
  routineDiary: "myhome:routineDiary",
};

/* --------------------------------------------------------------------------
   閉じていても届く通知（任意・オプトイン）
   push-server/README.md の手順でCloudflare Workers + D1をデプロイした後、
   ここの2つを埋めると設定に「アプリを閉じていても通知する」が現れる。
   空のままなら何も変わらない（これまで通りローカルの通知だけが動く）。
   -------------------------------------------------------------------------- */
const PUSH_SERVER_URL = "";
const PUSH_VAPID_PUBLIC_KEY = "";

const DEFAULT_APPEARANCE = {
  accent: "#9ed17a",
  bg: "#0a0f0a",
  bgImage: null,
  iconSize: "medium",
  iconShape: "rounded",
  showLabels: true,
};
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
    "Add your own site": "Adicionar seu próprio site",
    "Name": "Nome",
    "Website address": "Endereço do site",
    "Order": "Ordem",
    "Use the arrows to change the order apps appear in on your home screen.": "Use as setas para mudar a ordem em que os apps aparecem na sua tela inicial.",
    "Remove {app}": "Remover {app}",
    "Check some apps above to arrange their order.": "Marque alguns apps acima para organizar a ordem deles.",
    "Move {app} earlier": "Mover {app} para cima",
    "Move {app} later": "Mover {app} para baixo",
    "Enter a name and a website address": "Digite um nome e um endereço de site",
    "Enter a valid website address": "Digite um endereço de site válido",
    "Added {app}": "{app} adicionado",
    "The list of apps installed on your phone can't be read automatically from a web page, so pick from the candidates below instead.": "A lista de apps instalados no seu celular não pode ser lida automaticamente por uma página web, então escolha entre as opções abaixo.",
    "Add up to 10 apps from \"Edit Apps\"": "Adicione até 10 apps em “Editar apps”",
    "Open this app?": "Abrir este app?",
    "Open": "Abrir",
    "Cancel": "Cancelar",
    "Turn scroll ON": "Ativar a rolagem",
    "Time limit": "Limite de tempo",
    "4-digit PIN": "PIN de 4 dígitos",
    "Turn ON": "Ativar",
    "Unlock with Face ID / Fingerprint": "Desbloquear com Face ID / impressão digital",
    "Choose your language": "Escolha seu idioma",
    "App Lock PIN (opens the app)": "PIN de bloqueio (abre o app)",
    "Scroll PIN (turns scroll ON)": "PIN de rolagem (ativa a rolagem)",
    "Security question": "Pergunta de segurança",
    "What was your first pet's name?": "Qual era o nome do seu primeiro animal de estimação?",
    "What is your mother's maiden name?": "Qual é o nome de solteira da sua mãe?",
    "What was the name of your first school?": "Qual era o nome da sua primeira escola?",
    "What city were you born in?": "Em que cidade você nasceu?",
    "What was your childhood nickname?": "Qual era seu apelido de infância?",
    "What is your favorite food?": "Qual é a sua comida favorita?",
    "Answer": "Resposta",
    "Save & Continue": "Salvar e continuar",
    "Which social media do you use?": "Quais redes sociais você usa?",
    "Choose the ones you want quick access to from your dock.": "Escolha aquelas que você quer acessar rapidamente pela barra.",
    "Finish setup": "Concluir configuração",
    "Settings": "Ajustes",
    "Close settings": "Fechar ajustes",
    "Open settings": "Abrir ajustes",
    "How to use this app": "Como usar este app",
    "Set a timer": "Definir um temporizador",
    "Look & Feel": "Aparência",
    "PINs & Unlock": "PINs e desbloqueio",
    "Appearance": "Aparência",
    "Green": "Verde",
    "Blue": "Azul",
    "Accent color": "Cor de destaque",
    "Background color": "Cor de fundo",
    "Choose background image": "Escolher imagem de fundo",
    "Remove image": "Remover imagem",
    "Reset colors": "Redefinir cores",
    "Purple": "Roxo",
    "Orange": "Laranja",
    "Pink": "Rosa",
    "Dark": "Escuro",
    "Home Screen Icons": "Ícones da tela inicial",
    "Icon size": "Tamanho do ícone",
    "Small": "Pequeno",
    "Medium": "Médio",
    "Large": "Grande",
    "Icon shape": "Formato do ícone",
    "Rounded square": "Quadrado arredondado",
    "Circle": "Círculo",
    "Show app names under icons": "Mostrar nomes dos apps sob os ícones",
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
    "{time} left — the app will lock when this reaches 0:00.": "Resta {time} — o app será bloqueado ao chegar a 0:00.",
    "{time} left. This is just a timer; nothing else happens at 0:00.": "Resta {time}. É apenas um temporizador; nada mais acontece a 0:00.",
    "{minutes} min": "{minutes} min",
    "Remove \"{name}\"": "Remover “{name}”",
    "{label} ({minutes} min)": "{label} ({minutes} min)",
    "{label} · {index} of {total}": "{label} · {index} de {total}",
    "Timer started — app locks in {label}": "Temporizador iniciado — o app bloqueia em {label}",
    "Timer started for {label}": "Temporizador iniciado para {label}",
    "Open {app}?": "Abrir {app}?",
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
    "Blocked: this looks like an ad or tracking domain": "Bloqueado: isso parece um domínio de anúncios ou rastreamento",
    "Close tab \"{title}\"": "Fechar aba \"{title}\"",
    "Insights": "Estatísticas",
    "Search or enter a website above to start browsing.": "Pesquise ou digite um site acima para começar a navegar.",
    "Open insights": "Abrir estatísticas",
    "Search or go to address": "Pesquisar ou ir para um endereço",
    "Search or enter address": "Pesquisar ou digitar um endereço",
    "Basic search": "Busca simples",
    "Open in browser": "Abrir no navegador",
    "Close insights": "Fechar estatísticas",
    "Browsing": "Navegação",
    "Still finding what you needed? You've been browsing for {minutes} minutes.": "Já encontrou o que procurava? Você está navegando há {minutes} minutos.",
    "Check in with me every 10 minutes while I'm browsing a tab": "Me avise a cada 10 minutos enquanto estou navegando em uma aba",
    "Still browsing": "Ainda navegando",
    "Keep browsing": "Continuar navegando",
    "{domain} doesn't allow embedding, so it opened in your browser instead.": "{domain} não permite ser exibido dentro de outra página, então foi aberto no seu navegador.",
    "Saved": "Salvo",
    "Edit": "Editar",
    "Remove": "Remover",
    "Title": "Título",
    "Dictionary": "Dicionário",
    "Open dictionary": "Abrir dicionário",
    "Close dictionary": "Fechar dicionário",
    "Your Dictionary": "Seu dicionário",
    "Search your dictionary…": "Pesquisar no seu dicionário…",
    "Filter by group": "Filtrar por grupo",
    "Sort words": "Ordenar palavras",
    "My order": "Minha ordem",
    "A to Z": "De A a Z",
    "Newest first": "Mais recentes primeiro",
    "Oldest first": "Mais antigas primeiro",
    "Manage groups": "Gerenciar grupos",
    "+ Add a word": "+ Adicionar palavra",
    "Word": "Palavra",
    "Meaning / note": "Significado / nota",
    "Group": "Grupo",
    "‹ Back to dictionary": "‹ Voltar ao dicionário",
    "Group to edit": "Grupo a editar",
    "Rename this group": "Renomear este grupo",
    "Delete this group": "Excluir este grupo",
    "Deleting a group keeps its words — they move to the first group.": "Excluir um grupo não apaga as palavras — elas vão para o primeiro grupo.",
    "Add a new group": "Criar um novo grupo",
    "New group": "Novo grupo",
    "+ Add group": "+ Adicionar grupo",
    "Ungrouped": "Sem grupo",
    "All groups": "Todos os grupos",
    "{shown} / {total}": "{shown} / {total}",
    "No words saved yet. Look a word up, then tap the star to save it here.": "Nenhuma palavra salva ainda. Pesquise algo e toque na estrela para salvar aqui.",
    "Import…": "Importar…",
    "Each row becomes one word: first column the word, second the meaning, third an optional link. A header row is detected and skipped automatically.": "Cada linha vira uma palavra: a primeira coluna é a palavra, a segunda o significado, a terceira um link opcional. Uma linha de cabeçalho é detectada e ignorada automaticamente.",
    "Excel (.xlsx) or CSV file": "Arquivo Excel (.xlsx) ou CSV",
    "…or a Google Sheets share link": "…ou um link compartilhado do Google Sheets",
    "Fetch": "Buscar",
    "Add into group": "Adicionar ao grupo",
    "Add these words": "Adicionar essas palavras",
    "Reading…": "Lendo…",
    "Fetching…": "Buscando…",
    "Couldn't find any words in that file.": "Não encontramos nenhuma palavra nesse arquivo.",
    "Found {count} words in {source}.": "Encontramos {count} palavras em {source}.",
    "the sheet": "a planilha",
    "Couldn't read that file.": "Não foi possível ler esse arquivo.",
    "That doesn't look like a Google Sheets link.": "Isso não parece um link do Google Sheets.",
    "Couldn't fetch that sheet. Make sure it's shared as \"Anyone with the link can view\".": "Não foi possível buscar essa planilha. Verifique se ela está compartilhada como \"Qualquer pessoa com o link pode ver\".",
    "…and {count} more": "…e mais {count}",
    "Nothing new to add.": "Nada de novo para adicionar.",
    "Added {count} words to your dictionary": "{count} palavras adicionadas ao seu dicionário",
    "Add these {count} words": "Adicionar essas {count} palavras",
    "No words matched.": "Nenhuma palavra encontrada.",
    "Move {word} up": "Mover {word} para cima",
    "Move {word} down": "Mover {word} para baixo",
    "Group: {group}": "Grupo: {group}",
    "Saved {date}": "Salvo em {date}",
    "Group {n}": "Grupo {n}",
    "Please enter a word": "Digite uma palavra",
    "You need at least one group.": "É preciso ter pelo menos um grupo.",
    "Save to your dictionary": "Salvar no seu dicionário",
    "Remove from your dictionary": "Remover do seu dicionário",
    "Added to your dictionary": "Salvo no seu dicionário",
    "Removed from your dictionary": "Removido do seu dicionário",
    "Select a question (optional)": "Selecione uma pergunta (opcional)",
    "Set up your PINs": "Configure seus PINs",
    "A PIN to open MyHome Browser, and a separate PIN to turn scroll ON — both required, so the friction this app relies on can't quietly default to something guessable. You can switch to Face ID / Fingerprint instead later, in Settings.": "Um PIN para abrir o MyHome Browser e outro, separado, para ativar a rolagem — ambos obrigatórios, para que o atrito de que este app depende não vire silenciosamente algo fácil de adivinhar. Depois você pode trocar por Face ID / impressão digital, nos ajustes.",
    "Select a question": "Selecione uma pergunta",
    "Choose a security question and answer it, so you can reset your PIN if you forget it": "Escolha uma pergunta de segurança e responda a ela, para poder redefinir seu PIN se esquecer.",
    "Search results": "Resultados da pesquisa",
    "Close search results": "Fechar resultados da pesquisa",
    "Searching…": "Pesquisando…",
    "Search failed: {message}": "Falha na pesquisa: {message}",
    "No results found.": "Nenhum resultado encontrado.",
    "Search results for \"{query}\"": "Resultados da pesquisa por \"{query}\"",
    "Typed search terms show Wikipedia results as a list inside the app — no setup needed, but only Wikipedia articles, not the wider web. Typing the address of a big site that refuses to be shown inside another page (Google, Instagram, Facebook, X, TikTok, YouTube, DuckDuckGo) opens it in your regular browser instead — that's the site's own policy, not something this app can change.": "Os termos de pesquisa digitados mostram resultados da Wikipédia como uma lista dentro do app — não é preciso nenhuma configuração, mas só pesquisa artigos da Wikipédia, não a web em geral. Digitar o endereço de um site grande que se recusa a ser exibido dentro de outra página (Google, Instagram, Facebook, X, TikTok, YouTube, DuckDuckGo) o abre no seu navegador normal — essa é a política do próprio site, não algo que este app possa mudar.",
    "Ad blocking only stops known ad domains, not ads on a page you already opened.": "O bloqueio de anúncios só impede domínios de anúncio conhecidos, não anúncios em uma página que você já abriu.",
    "Save with your own note": "Salvar com sua própria nota",
    "Your own note": "Sua própria nota",
    "Search shows Wikipedia results here. An address opens as a tab.": "A busca mostra resultados da Wikipédia aqui. Um endereço abre como aba.",
    "Tap the star on a tab, or on a search result, to save it.": "Toque na estrela de uma aba, ou de um resultado, para salvar.",
    "The pencil on a search result lets you write your own note.": "O lápis num resultado permite escrever sua própria nota.",
    "Scroll is OFF": "A rolagem está DESATIVADA",
    "These apps open in your normal browser, where this app can't keep scroll locked — so while scroll is OFF they stay closed.": "Esses apps abrem no seu navegador normal, onde este app não consegue manter a rolagem travada — por isso ficam fechados enquanto a rolagem está desativada.",
    "Not now": "Agora não",
    "Install to your home screen": "Instalar na sua tela inicial",
    "Install": "Instalar",
    "Installed to your home screen": "Instalado na sua tela inicial",
    "Apps that need scroll ON": "Apps que exigem a rolagem ativa",
    "Don't let the apps below open while scroll is OFF": "Não abrir os apps abaixo enquanto a rolagem estiver desativada",
    "{app} opens in a separate browser tab, so you'll leave MyHome Browser and have to find your way back. Installing this app to your home screen usually improves that — see Settings.": "{app} abre em uma aba separada do navegador, então você sairá do MyHome Browser e terá que achar o caminho de volta. Instalar este app na sua tela inicial costuma melhorar isso — veja os Ajustes.",
    "Installed. Other apps still open outside this app, but most phones now show them as a layer you can close to come straight back rather than switching you away. Either way your tabs, dictionary and scroll state are kept. Other apps' Share button can now send links, text and files straight into your Waiting room, too.": "Instalado. Os outros apps ainda abrem fora deste app, mas a maioria dos celulares agora os mostra como uma camada que você pode fechar para voltar direto, em vez de trocar de app. De qualquer forma, suas abas, o dicionário e o estado da rolagem são mantidos. O botão Compartilhar de outros apps agora também pode enviar links, textos e arquivos direto para sua Sala de espera.",
    "Right now other apps open in a separate browser tab, so you leave this app and have to find your way back. Installing it to your home screen usually makes them open as a closable layer instead — the exact behaviour is your phone's choice, not this app's.": "No momento os outros apps abrem em uma aba separada do navegador, então você sai deste app e precisa achar o caminho de volta. Instalá-lo na sua tela inicial costuma fazer com que abram como uma camada que dá para fechar — o comportamento exato é decisão do seu celular, não deste app.",
    "Right now other apps open in a separate browser tab, so you leave this app. In Safari, tap the Share button and choose \"Add to Home Screen\" — that usually helps, though iOS sometimes still switches you over to Safari.": "No momento os outros apps abrem em uma aba separada do navegador, então você sai deste app. No Safari, toque no botão Compartilhar e escolha “Adicionar à Tela de Início” — isso costuma ajudar, embora o iOS às vezes ainda leve você para o Safari.",
    "Open this page in Chrome or Edge and use \"Install app\" (or \"Add to Home Screen\") from the browser menu. Once installed, other apps usually open as a layer you can close to come straight back, instead of taking you away.": "Abra esta página no Chrome ou no Edge e use “Instalar app” (ou “Adicionar à tela inicial”) no menu do navegador. Depois de instalado, os outros apps geralmente abrem como uma camada que você pode fechar para voltar direto, em vez de levar você embora.",
    "How other apps open": "Como os outros apps abrem",
    "Open other apps in this same window": "Abrir os outros apps nesta mesma janela",
    "On means the app loads in this window instead of a new tab, so your phone never switches away from MyHome Browser — press back to return here. Off opens a new tab, which on some phones hands you over to a separate browser. Try both and keep whichever returns more cleanly on your device.": "Ativado, o app carrega nesta janela em vez de uma nova aba, então o seu celular nunca sai do MyHome Browser — toque em voltar para retornar. Desativado, abre uma nova aba, o que em alguns celulares entrega você a um navegador separado. Teste os dois e fique com o que voltar melhor no seu aparelho.",
    "{app} loads in this window, so your phone never switches away from MyHome Browser. Press back to return — everything here will be as you left it.": "{app} carrega nesta janela, então o seu celular não sai do MyHome Browser. Toque em voltar para retornar — tudo aqui estará como você deixou.",
    "Notifications": "Notificações",
    "Allow notifications": "Permitir notificações",
    "This browser can't show notifications.": "Este navegador não consegue exibir notificações.",
    "Notifications are allowed. They can only reach you while this app is still running in the background — once it's fully closed, nothing can wake it.": "Notificações permitidas. Elas só chegam enquanto este app continua rodando em segundo plano — depois de fechado por completo, nada consegue acordá-lo.",
    "Notifications are blocked. Allow them for this app in your browser or phone settings, then come back.": "Notificações bloqueadas. Permita-as para este app nas configurações do navegador ou do celular e volte aqui.",
    "Let this app notify you when scroll time runs out, a timer ends, or you pass your daily limit.": "Deixe este app avisar você quando o tempo de rolagem acabar, um temporizador terminar ou você passar do seu limite diário.",
    "Notifications are on": "Notificações ativadas",
    "This is what they'll look like.": "É assim que elas aparecem.",
    "A minute before scroll time runs out": "Um minuto antes de acabar o tempo de rolagem",
    "When scroll switches back OFF": "Quando a rolagem for desativada",
    "When the timer finishes": "Quando o temporizador terminar",
    "Posture reminders": "Lembretes de postura",
    "When you pass your daily limit": "Quando você passar do limite diário",
    "Scroll time is nearly up": "O tempo de rolagem está acabando",
    "About a minute left before scroll switches back OFF.": "Falta cerca de um minuto para a rolagem ser desativada.",
    "You've passed your daily limit": "Você passou do seu limite diário",
    "Today is over your {minutes} min goal.": "Hoje já passou da sua meta de {minutes} min.",
    "Playing here, without the feed": "Reproduzindo aqui, sem o feed",
    "Showing this post here, without the feed": "Mostrando esta publicação aqui, sem o feed",
    "Close the app I opened when scroll time runs out": "Fechar o app que abri quando o tempo de rolagem acabar",
    "This is the only way the time limit reaches inside the other app: this app keeps hold of the tab it opened and shuts it when your time is up. It needs the setting above to be OFF, since there is no separate tab to close otherwise. The cost is that the site you open can see it was opened by this app and could push this page elsewhere — unlikely with the big sites, but not impossible, so turn this off if you would rather not.": "É a única forma de o limite de tempo alcançar o outro app: este app mantém a aba que abriu e a fecha quando o seu tempo acaba. Exige que a opção acima esteja DESLIGADA, pois do contrário não há aba separada para fechar. O custo é que o site aberto consegue ver que foi aberto por este app e poderia levar esta página para outro lugar — improvável com os grandes sites, mas não impossível; desative se preferir.",
    "Time's up — scroll is back OFF and the app you opened was closed": "Tempo esgotado — a rolagem foi desativada e o app que você abriu foi fechado",
    "Waiting room": "Sala de espera",
    "Shelf": "Estante",
    "Take a breath": "Respire fundo",
    "This device can't keep records (private browsing, perhaps).": "Este aparelho não consegue guardar registros (talvez navegação privada).",
    "day streak": "dias seguidos",
    "pauses today": "pausas hoje",
    "minutes held": "minutos guardados",
    "Hold a file from this device": "Guardar um arquivo deste aparelho",
    "Held on this device: {used} of about {quota}": "Guardado neste aparelho: {used} de cerca de {quota}",
    "Put it on the shelf": "Colocar na estante",
    "Shelved under {wall}": "Guardado em {wall}",
    "The shelf is full. Take something off it first.": "A estante está cheia. Tire algo dela primeiro.",
    "Couldn't put it on the shelf": "Não foi possível guardar na estante",
    "This device is out of room for held files": "Este aparelho não tem mais espaço para arquivos guardados",
    "Couldn't hold that file": "Não foi possível guardar esse arquivo",
    "That file is no longer on this device": "Esse arquivo não está mais neste aparelho",
    "Taken off the shelf": "Retirado da estante",
    "No address": "(sem endereço)",
    "Something to look at": "Algo para ver",
    "Received 1 item from another app": "1 item recebido de outro aplicativo",
    "Received {n} items from another app": "{n} itens recebidos de outro aplicativo",
    "Notice what just happened": "Repare no que acabou de acontecer",
    "Scroll is OFF right now. Try swiping this page — it won't move. That small inconvenience is the whole point: it buys you a moment to choose, instead of scrolling out of habit.": "A rolagem está desativada agora. Tente arrastar esta página — ela não vai se mover. Esse pequeno incômodo é o ponto principal: ele te dá um instante para escolher, em vez de rolar por hábito.",
    "Got it — let me try": "Entendi — deixe-me tentar",
    "You said you wanted to get to \"{goal}\". When you're ready for it, tap \"Scroll OFF\" up top to turn scroll ON with a time limit — on your own terms.": "Você disse que queria chegar a \"{goal}\". Quando estiver pronto para isso, toque em \"Scroll OFF\" no topo para ativar a rolagem com um limite de tempo — nos seus próprios termos.",
    "When you actually want something, tap \"Scroll OFF\" up top to turn scroll ON with a time limit — on your own terms.": "Quando você realmente quiser algo, toque em \"Scroll OFF\" no topo para ativar a rolagem com um limite de tempo — nos seus próprios termos.",
    "Step 1 of 5": "Passo 1 de 5",
    "Step 2 of 5": "Passo 2 de 5",
    "Step 3 of 5": "Passo 3 de 5",
    "Step 4 of 5": "Passo 4 de 5",
    "Step 5 of 5": "Passo 5 de 5",
    "What do you want your time back for?": "Para que você quer seu tempo de volta?",
    "Not \"less phone\" — more of something else. Name one or two things you'd rather be spending it on. This app will remind you of them, not just stop you.": "Não é \"menos celular\" — é mais de outra coisa. Diga uma ou duas coisas em que prefere gastar o tempo. Este app vai lembrá-lo delas, não só impedi-lo.",
    "Skip for now": "Pular por agora",
    "Choose a time limit. When time is up, scroll switches back OFF and the app you opened from here is closed.": "Escolha um limite de tempo. Quando o tempo acabar, a rolagem será desativada e o app aberto daqui será fechado.",
    "Choose a time limit. Scroll will switch back OFF automatically when time is up.": "Escolha um limite de tempo. A rolagem será desativada automaticamente quando o tempo acabar.",
    "None of this is about guilt. It's why a time limit and a PIN can do more than willpower alone.": "Nada disso é para gerar culpa. É por isso que um limite de tempo e um PIN podem ajudar mais do que só força de vontade.",
    "These apps refuse to open inside this app, so they run in your normal browser where this app can't hold the scroll lock. Ticked apps only open once you've turned scroll ON with a time limit. Feed apps are ticked to start with — tick any others that eat your time.": "Estes apps se recusam a abrir dentro deste app, então rodam no seu navegador normal, onde este app não consegue manter a rolagem travada. Os apps marcados só abrem depois que você ativar a rolagem com um limite de tempo. Os apps de feed já vêm marcados — marque outros que consumam o seu tempo.",
    "Turn scroll ON with a time limit, and {app} will open.": "Ative a rolagem com um limite de tempo, e {app} abrirá.",
    "Limits": "Limites",
    "{time} left": "Resta {time}",
    "Add a shelf": "Adicionar estante",
    "One video or one post can show inside. A whole feed can't.": "Um vídeo ou um post cabe aqui. Um feed inteiro não.",
    "While scroll is OFF, the apps you ticked in Settings won't open.": "Com a rolagem desativada, os apps marcados não abrem.",
    "When time runs out, scroll goes OFF and opened tabs close.": "Quando o tempo acaba, a rolagem desliga e as abas fecham.",
    "Held items wait before they open — longest for gated apps.": "O que fica retido espera antes de abrir; mais para apps filtrados.",
    "Open it after a while away and it asks what you came for.": "Aberto depois de um tempo, pergunta para que você veio.",
    "Breaks offer what you set out to do, your shelf, or a saved word.": "As pausas oferecem o que você planejou, sua estante ou uma palavra salva.",
    "Loosening a limit waits 24 hours. Tightening is immediate.": "Afrouxar um limite espera 24 horas. Apertar é imediato.",
    "Add to your home screen to receive from other apps' Share.": "Adicione à tela inicial para receber pelo Compartilhar.",
    "Priority and Done decide what a break offers you next.": "Prioridade e Concluído decidem o que a próxima pausa oferece.",
    "Anything you feel like looking at, this holds for a moment first.": "O que você quiser ver fica retido aqui um momento primeiro.",
    "Interrupt me and offer something better to be doing": "Me interromper e oferecer algo melhor para fazer",
    "Order of the shelf items it reaches for": "Ordem dos itens da estante",
    "The more of when, where and how long you fill in, the easier these are to actually start — and a break landing in that window reaches for them first.": "Quanto mais você preencher quando, onde e por quanto tempo, mais fácil é começar — e uma pausa nessa janela as oferece primeiro.",
    "e.g. Practise guitar": "ex.: Praticar violão",
    "Time of day": "Período do dia",
    "Days": "Dias",
    "Where (optional)": "Onde (opcional)",
    "Any day": "Qualquer dia",
    "Weekdays": "Dias de semana",
    "Weekends": "Fins de semana",
    "{count} from your shelf": "{count} da sua estante",
    "{count} you set out to do": "{count} que você se propôs",
    "This week: {count}": "Esta semana: {count}",
    "{weeks} weeks ago: {count}": "{weeks} semanas atrás: {count}",
    "Morning": "Manhã",
    "Afternoon": "Tarde",
    "Evening": "Noite",
    "Late night": "Madrugada",
    "Any time": "Qualquer hora",
    "done {count}x": "feito {count}x",
    "{idle} of your last {total} opens had nothing particular behind them.": "{idle} das suas últimas {total} aberturas não tinham nada específico por trás.",
    "You finished {count} things these last two weeks.": "Você concluiu {count} coisas nestas últimas duas semanas.",
    "You opened this without anything particular in mind.": "Você abriu isto sem nada específico em mente.",
    "Since you last looked": "Desde a última vez",
    "Good": "Ótimo",
    "What did you come here for?": "Você veio para quê?",
    "No wrong answer — this is just so the reason is yours and not the phone's.": "Não há resposta errada — é só para que o motivo seja seu e não do telefone.",
    "To look something up": "Para procurar algo",
    "To get to something I set aside": "Para ver algo que deixei de lado",
    "No particular reason": "Sem motivo específico",
    "When you open the app": "Ao abrir o app",
    "Ask what I came here for": "Perguntar para que eu vim",
    "Asked at most once every few minutes, never mid-task. Every answer is one tap. Answering \"no particular reason\" brings up something you said you wanted to do instead.": "Perguntado no máximo a cada poucos minutos, nunca no meio de uma tarefa. Cada resposta é um toque. Responder \"sem motivo específico\" traz algo que você disse que queria fazer.",
    "Stop asking what you came for": "Parar de perguntar para que você veio",
    "You said {promised}. It was {actual} — {over} of your last {total} went over.": "Você disse {promised}. Foram {actual} — {over} das suas últimas {total} vezes passaram.",
    "You went past your own limit on {over} of the last {total} times you left, by {avg} on average.": "Você passou do seu próprio limite em {over} das últimas {total} saídas, em média por {avg}.",
    "You came back within your own limit all {total} of the last times you left.": "Você voltou dentro do seu próprio limite todas as {total} últimas vezes.",
    "If {trigger}, then {action}": "Se {trigger}, então {action}",
    "Saved. It takes effect in {wait} — you can cancel until then.": "Salvo. Entra em vigor em {wait} — você pode cancelar até lá.",
    "{change} — in {wait}": "{change} — em {wait}",
    "Cancel this change": "Cancelar esta alteração",
    "Change cancelled": "Alteração cancelada",
    "{text} · done {count}x": "{text} · feito {count}x",
    "Remove this rule": "Remover esta regra",
    "How about this now?": "Que tal isto agora?",
    "Away from the screen": "Longe da tela",
    "Did it": "Feito",
    "There's something you said you wanted to do.": "Há algo que você disse que queria fazer.",
    "Nice.": "Ótimo.",
    "finished": "concluídos",
    "You decided": "Você decidiu",
    "Turn scroll ON anyway": "Ativar a rolagem mesmo assim",
    "Set out what you want to get to, in Settings — then this offers those instead of just something to read.": "Anote nos Ajustes o que você quer fazer — assim isto oferece aquilo em vez de só algo para ler.",
    "What you want to get to": "O que você quer fazer",
    "Your shelf only holds things you put off looking at. List what you actually want to spend the time on, and breaks will offer these first.": "Sua estante só guarda o que você adiou. Anote no que realmente quer gastar tempo, e as pausas oferecerão isso primeiro.",
    "Nothing here yet — breaks will fall back to your shelf, a saved word, and small away-from-screen nudges.": "Nada aqui ainda — as pausas recorrerão à sua estante, a uma palavra salva e a pequenos empurrões longe da tela.",
    "If this, then that": "Se isto, então aquilo",
    "Decide now, while it's easy, what you'll do in the moment it isn't. These are read back to you when an app is held closed.": "Decida agora, enquanto é fácil, o que fará no momento em que não for. Isto é relido para você quando um app fica fechado.",
    "No rules yet.": "Ainda não há regras.",
    "If… (e.g. it's past 11pm)": "Se… (ex.: passou das 23h)",
    "then… (e.g. I'll read one shelved thing)": "então… (ex.: vou ler algo da estante)",
    "Cooling-off period": "Período de reflexão",
    "Make loosening these settings wait 24 hours": "Fazer o afrouxamento destes ajustes esperar 24 horas",
    "The version of you that sets these limits and the version that wants past them are not in the room at the same time. Tightening anything still takes effect at once; only loosening waits, and you can cancel it the whole time.": "A versão de você que define estes limites e a que quer ultrapassá-los nunca estão na sala ao mesmo tempo. Apertar continua valendo na hora; só afrouxar espera, e você pode cancelar o tempo todo.",
    "Waiting to take effect:": "Aguardando entrar em vigor:",
    "Turn forced breaks off": "Desativar as pausas forçadas",
    "Make breaks less frequent": "Espaçar mais as pausas",
    "Raise the scroll count before a break": "Aumentar a contagem de rolagens antes de uma pausa",
    "Turn the cooling-off period off": "Desativar o período de reflexão",
    "Stop requiring scroll ON for those apps": "Parar de exigir rolagem ativada para esses apps",
    "Remove apps from the scroll gate": "Remover apps do filtro de rolagem",
    "Added shelf {name}": "Estante {name} adicionada",
    "File": "Arquivo",
    "Later": "Depois",
    "Shelf space": "Espaço da estante",
    "— empty shelf —": "— prateleira vazia —",
    "Nothing on the shelf yet. Things you keep from the waiting room end up here.": "Nada na estante ainda. O que você guardar da sala de espera vem parar aqui.",
    "Shelf wall": "Parede da estante",
    "Previous wall": "Parede anterior",
    "Next wall": "Próxima parede",
    "{kind} · {size}": "{kind} · {size}",
    "Drink a glass of water, slowly.": "Beba um copo de água, devagar.",
    "Look at the furthest thing out of the window.": "Olhe para a coisa mais distante pela janela.",
    "Lift your shoulders, then let them drop. Three times.": "Levante os ombros e deixe-os cair. Três vezes.",
    "Put three things on your desk back where they belong.": "Coloque três coisas da mesa de volta no lugar.",
    "Close your eyes and count three sounds you can hear.": "Feche os olhos e conte três sons que ouve.",
    "Stand up and walk once around the room.": "Levante-se e dê uma volta pelo cômodo.",
    "Wash your hands. Notice the temperature of the water.": "Lave as mãos. Repare na temperatura da água.",
    "Straighten your back and look up at the ceiling.": "Endireite as costas e olhe para o teto.",
    "Open a window or a curtain and let the air change.": "Abra uma janela ou cortina e renove o ar.",
    "Remember one good thing about today.": "Lembre-se de uma coisa boa de hoje.",
    "Feel where your feet are touching the floor.": "Sinta onde seus pés tocam o chão.",
    "Leave one line of a note for tomorrow's you.": "Deixe uma linha de recado para o você de amanhã.",
    "Look into the distance and let your eyes go soft.": "Olhe para longe e relaxe os olhos.",
    "Breathe in deeply, breathe out slowly. That's enough.": "Inspire fundo, expire devagar. Já basta.",
    "{used} / {total}": "{used} / {total}",
    "Close": "Fechar",
    "Search the shelf…": "Pesquisar na estante…",
    "Nothing on the shelf matched.": "Nada na estante corresponde.",
    "Priority": "Prioridade",
    "High": "Alta",
    "Low": "Baixa",
    "Order on this shelf": "Ordem nesta prateleira",
    "Move earlier": "Mover para cima",
    "Move later": "Mover para baixo",
    "Done": "Concluído",
    "Not done after all": "Marcar como não concluído",
    "Marked as done": "Marcado como concluído",
    "Put back as unfinished": "Voltou a ficar pendente",
    "Done ({count})": "Concluídos ({count})",
    "Break reminders": "Lembretes de pausa",
    "This doesn't wait for you to remember. Whatever screen you're on, once you pass the limits below, a quiet banner appears (a short vibration, no sound) offering what you set out to do, something from your shelf, or a saved word — it doesn't block what you're doing.": "Isto não espera você lembrar. Em qualquer tela, ao passar dos limites abaixo, aparece um aviso discreto (uma vibração curta, sem som) oferecendo o que você planejou, algo da sua estante ou uma palavra salva — sem bloquear o que você está fazendo.",
    "Every (minutes)": "A cada (minutos)",
    "Or after this many scrolls (0 = off)": "Ou após tantas rolagens (0 = desligado)",
    "Highest priority first": "Maior prioridade primeiro",
    "The order I arranged": "A ordem que eu organizei",
    "Time for a break": "Hora de uma pausa",
    "From your shelf": "Da sua estante",
    "You've been at this for {minutes} minutes.": "Você está nisso há {minutes} minutos.",
    "You've scrolled {count} times since your last break.": "Você rolou {count} vezes desde a última pausa.",
    "There's nothing unfinished on your shelf yet. Put something there and this will offer it next time.": "Ainda não há nada pendente na estante. Guarde algo e da próxima vez ele será oferecido.",
    "Mark done": "Marcar concluído",
    "Open this": "Abrir isto",
    "Pick one of your own shelves to share.": "Escolha uma das suas próprias estantes para compartilhar.",
    "This shelf has nothing with a link on it yet.": "Esta estante ainda não tem nada com um link.",
    "My shelf: {name}": "Minha estante: {name}",
    "Link copied. Send it to someone.": "Link copiado. Envie para alguém.",
    "Couldn't share this shelf": "Não foi possível compartilhar esta estante",
    "Someone shared a shelf with you — {count} things on it.": "Alguém compartilhou uma estante com você — {count} itens nela.",
    "Added {count} things to a new shelf": "{count} itens adicionados a uma nova estante",
    "Name this shelf": "Dê um nome a esta estante",
    "You finished {count} things these last two weeks — about {minutes} of your own choosing.": "Você concluiu {count} coisas nestas últimas duas semanas — cerca de {minutes} escolhidos por você.",
    "A word from your dictionary": "Uma palavra do seu dicionário",
    "Nice to know": "Bom saber",
    "Rename": "Renomear",
    "Share this shelf": "Compartilhar esta estante",
    "How long it takes (minutes)": "Quanto tempo leva (minutos)",
    "A shelf from someone": "Uma estante de alguém",
    "Taking it adds a new shelf of your own. Nothing you already have is touched.": "Ao aceitar, uma nova estante sua é criada. Nada do que você já tem é alterado.",
    "No thanks": "Não, obrigado",
    "Add to my shelves": "Adicionar às minhas estantes",
    "e.g. 12": "ex.: 12",
    "Break's over. Nice.": "Pausa terminada. Bom trabalho.",
    "{app} stays closed until your break ends.": "{app} fica fechado até sua pausa terminar.",
    "You're on a break": "Você está em pausa",
    "Back to the break": "Voltar à pausa",
    "End the break early": "Terminar a pausa antes",
    "Break length": "Duração da pausa",
    "Notify me even when this app is fully closed": "Me avise mesmo com o app totalmente fechado",
    "This uses a small external server (not run by you) that holds only the alert times and text above — nothing about what you look at, your dictionary, or your shelf. It can't schedule a daily-limit alert this way, since that depends on watching today's usage as it happens; that one still only fires while this app is open.": "Isto usa um pequeno servidor externo (que você não administra) que guarda apenas os horários e o texto dos avisos acima — nada sobre o que você vê, seu dicionário ou sua estante. Não é possível agendar assim o aviso de limite diário, pois ele depende de observar o uso de hoje em tempo real; esse continua funcionando só com o app aberto.",
    "Couldn't turn this on right now": "Não foi possível ativar isto agora",
    "Notifications on — tap to turn off": "Notificações ativadas — toque para desativar",
    "Notifications off — tap to turn on": "Notificações desativadas — toque para ativar",
    "Share anonymous usage events": "Compartilhar eventos de uso anônimos",
    "Send anonymous usage events to this app's operator": "Enviar eventos de uso anônimos ao operador deste app",
    "Separate from notifications, and off by default. When on, this device sends named moments only — things like \"scroll turned on\", \"a shelf item was marked done\", or \"a dock app was opened\" — tagged with a random device id, never your name or account. It never includes what you searched, dictionary words, shelf titles, or URLs. The full list of what's sent lives in push-server/README.md. Turning this off stops it immediately.": "Separado das notificações, e desativado por padrão. Quando ativado, este aparelho envia apenas momentos nomeados — como \"rolagem ativada\", \"um item da estante foi marcado como concluído\" ou \"um app do dock foi aberto\" — marcados com um id de aparelho aleatório, nunca seu nome ou conta. Nunca inclui o que você pesquisou, palavras do dicionário, títulos da estante ou URLs. A lista completa do que é enviado está em push-server/README.md. Desativar isto interrompe o envio imediatamente.",
    "Time's up — scroll switched back OFF. You kept your word.": "Tempo esgotado — a rolagem foi desativada. Você cumpriu sua palavra.",
    "Time's up — scroll is back OFF and the app you opened was closed. You kept your word.": "Tempo esgotado — a rolagem foi desativada e o app que você abriu foi fechado. Você cumpriu sua palavra.",
    "Things you want to get to": "O que você quer chegar a fazer",
    "Nothing here yet — add something and breaks will offer it first.": "Nada aqui ainda — adicione algo e as pausas oferecerão isso primeiro.",
    "+ Add something": "+ Adicionar algo",
    "Keep at it until (optional)": "Continuar até (opcional)",
    "+ Add a book": "+ Adicionar um livro",
    "Link (optional)": "Link (opcional)",
    "{days} days left": "Faltam {days} dias",
    "1 day left": "Falta 1 dia",
    "Last day": "Último dia",
    "Past your date": "Passou da data",
    "Added to shelf {wall}": "Adicionado à estante {wall}",
    "Anonymous usage events": "Eventos de uso anônimos",
    "This app's server is set up, so this device automatically sends named moments only — things like \"scroll turned on\", \"a shelf item was marked done\", or \"a dock app was opened\" — tagged with a random device id, never your name or account. It never includes what you searched, dictionary words, shelf titles, or URLs. There's no separate switch for this: as long as the server is configured, it's sent. The full list of what's sent lives in push-server/README.md.": "O servidor deste app está configurado, então este dispositivo envia automaticamente apenas momentos nomeados — como \"rolagem ativada\", \"um item da estante foi marcado como concluído\" ou \"um app do dock foi aberto\" — marcados com um id de dispositivo aleatório, nunca seu nome ou conta. Nunca inclui o que você pesquisou, palavras do dicionário, títulos da estante ou URLs. Não há um interruptor separado para isso: enquanto o servidor estiver configurado, será enviado. A lista completa do que é enviado está em push-server/README.md.",
    "Days (optional)": "Dias (opcional)",
    "The more of when, which days and how long you fill in, the easier these are to actually start — and a break landing in that window reaches for them first.": "Quanto mais você preencher sobre quando, em quais dias e por quanto tempo, mais fácil é realmente começar — e uma pausa que caia nessa janela recorre a isso primeiro.",
    "Goals": "Metas",
    "Not recorded": "Não registrado",
    "Not at all": "Nada",
    "Barely": "Quase nada",
    "Minimum done": "Mínimo feito",
    "Pretty good": "Bastante bem",
    "Nailed it!": "Mandei bem!",
    "Note": "Nota",
    "Add something you want to work on, and it'll show up here to track.": "Adicione algo que você quer trabalhar, e vai aparecer aqui para acompanhar.",
    "Date": "Data",
    "No records this month": "Nenhum registro neste mês",
    "Diary saved": "Diário salvo",
    "Active Days": "Dias ativos",
    "last {days}d": "últimos {days}d",
    "Avg Score": "Pontuação média",
    "out of 5.0": "de 5,0",
    "Top Category": "Categoria principal",
    "avg": "média",
    "no data": "sem dados",
    "Activity Heatmap": "Mapa de atividade",
    "Category Balance": "Equilíbrio entre categorias",
    "Progress Trend": "Tendência de progresso",
    "Best Day of Week": "Melhor dia da semana",
    "Streaks & Completion": "Sequências e conclusão",
    "Level Distribution": "Distribuição de níveis",
    "Need 2+ categories": "Precisa de 2+ categorias",
    "Streak": "Sequência",
    "Best": "Melhor",
    "Days done": "Dias concluídos",
    "Rate": "Taxa",
    "History": "Histórico",
    "Diary": "Diário",
    "Stats": "Estatísticas",
    "7 Days": "7 dias",
    "30 Days": "30 dias",
    "90 Days": "90 dias",
    "Previous day": "Dia anterior",
    "Next day": "Próximo dia",
    "Close note": "Fechar nota",
    "What happened today? Thoughts, feelings, reflections…": "O que aconteceu hoje? Pensamentos, sentimentos, reflexões…",
    "Add a note for this day…": "Adicione uma nota para este dia…",
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
    "Add your own site": "Eigene Website hinzufügen",
    "Name": "Name",
    "Website address": "Website-Adresse",
    "Order": "Reihenfolge",
    "Use the arrows to change the order apps appear in on your home screen.": "Nutze die Pfeile, um die Reihenfolge der Apps auf deinem Startbildschirm zu ändern.",
    "Remove {app}": "{app} entfernen",
    "Check some apps above to arrange their order.": "Wähle oben ein paar Apps aus, um ihre Reihenfolge festzulegen.",
    "Move {app} earlier": "{app} nach vorne verschieben",
    "Move {app} later": "{app} nach hinten verschieben",
    "Enter a name and a website address": "Gib einen Namen und eine Website-Adresse ein",
    "Enter a valid website address": "Gib eine gültige Website-Adresse ein",
    "Added {app}": "{app} hinzugefügt",
    "The list of apps installed on your phone can't be read automatically from a web page, so pick from the candidates below instead.": "Die Liste der auf deinem Handy installierten Apps kann von einer Webseite nicht automatisch gelesen werden – wähle stattdessen aus den Vorschlägen unten.",
    "Add up to 10 apps from \"Edit Apps\"": "Füge über „Apps bearbeiten“ bis zu 10 Apps hinzu",
    "Open this app?": "Diese App öffnen?",
    "Open": "Öffnen",
    "Cancel": "Abbrechen",
    "Turn scroll ON": "Scrollen einschalten",
    "Time limit": "Zeitlimit",
    "4-digit PIN": "4-stellige PIN",
    "Turn ON": "Einschalten",
    "Unlock with Face ID / Fingerprint": "Mit Face ID / Fingerabdruck entsperren",
    "Choose your language": "Sprache wählen",
    "App Lock PIN (opens the app)": "App-Sperr-PIN (öffnet die App)",
    "Scroll PIN (turns scroll ON)": "Scroll-PIN (schaltet Scrollen ein)",
    "Security question": "Sicherheitsfrage",
    "What was your first pet's name?": "Wie hieß dein erstes Haustier?",
    "What is your mother's maiden name?": "Wie lautet der Mädchenname deiner Mutter?",
    "What was the name of your first school?": "Wie hieß deine erste Schule?",
    "What city were you born in?": "In welcher Stadt bist du geboren?",
    "What was your childhood nickname?": "Wie war dein Spitzname als Kind?",
    "What is your favorite food?": "Was ist dein Lieblingsessen?",
    "Answer": "Antwort",
    "Save & Continue": "Speichern und fortfahren",
    "Which social media do you use?": "Welche sozialen Medien nutzt du?",
    "Choose the ones you want quick access to from your dock.": "Wähle die aus, auf die du schnell über das Dock zugreifen möchtest.",
    "Finish setup": "Einrichtung abschließen",
    "Settings": "Einstellungen",
    "Close settings": "Einstellungen schließen",
    "Open settings": "Einstellungen öffnen",
    "How to use this app": "So benutzt du diese App",
    "Set a timer": "Timer stellen",
    "Look & Feel": "Aussehen",
    "PINs & Unlock": "PINs & Entsperren",
    "Appearance": "Aussehen",
    "Green": "Grün",
    "Blue": "Blau",
    "Accent color": "Akzentfarbe",
    "Background color": "Hintergrundfarbe",
    "Choose background image": "Hintergrundbild wählen",
    "Remove image": "Bild entfernen",
    "Reset colors": "Farben zurücksetzen",
    "Purple": "Lila",
    "Orange": "Orange",
    "Pink": "Pink",
    "Dark": "Dunkel",
    "Home Screen Icons": "Symbole des Startbildschirms",
    "Icon size": "Symbolgröße",
    "Small": "Klein",
    "Medium": "Mittel",
    "Large": "Groß",
    "Icon shape": "Symbolform",
    "Rounded square": "Abgerundetes Quadrat",
    "Circle": "Kreis",
    "Show app names under icons": "App-Namen unter den Symbolen anzeigen",
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
    "{time} left — the app will lock when this reaches 0:00.": "Noch {time} — die App wird bei 0:00 gesperrt.",
    "{time} left. This is just a timer; nothing else happens at 0:00.": "Noch {time}. Das ist nur ein Timer; bei 0:00 passiert sonst nichts.",
    "{minutes} min": "{minutes} Min.",
    "Remove \"{name}\"": "„{name}“ entfernen",
    "{label} ({minutes} min)": "{label} ({minutes} Min.)",
    "{label} · {index} of {total}": "{label} · {index} von {total}",
    "Timer started — app locks in {label}": "Timer gestartet — App sperrt in {label}",
    "Timer started for {label}": "Timer für {label} gestartet",
    "Open {app}?": "{app} öffnen?",
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
    "Blocked: this looks like an ad or tracking domain": "Blockiert: sieht nach einer Werbe- oder Tracking-Domain aus",
    "Close tab \"{title}\"": "Tab „{title}“ schließen",
    "Insights": "Nutzung",
    "Search or enter a website above to start browsing.": "Suche oben oder gib eine Website ein, um mit dem Surfen zu beginnen.",
    "Open insights": "Nutzung öffnen",
    "Search or go to address": "Suchen oder Adresse aufrufen",
    "Search or enter address": "Suche oder Adresse eingeben",
    "Basic search": "Einfache Suche",
    "Open in browser": "Im Browser öffnen",
    "Close insights": "Nutzung schließen",
    "Browsing": "Browsen",
    "Still finding what you needed? You've been browsing for {minutes} minutes.": "Schon gefunden, wonach du gesucht hast? Du browst seit {minutes} Minuten.",
    "Check in with me every 10 minutes while I'm browsing a tab": "Erinnere mich alle 10 Minuten, während ich einen Tab durchstöbere",
    "Still browsing": "Du browst noch",
    "Keep browsing": "Weiter browsen",
    "{domain} doesn't allow embedding, so it opened in your browser instead.": "{domain} erlaubt keine eingebettete Anzeige und wurde deshalb im Browser geöffnet.",
    "Saved": "Gespeichert",
    "Edit": "Bearbeiten",
    "Remove": "Entfernen",
    "Title": "Titel",
    "Dictionary": "Wörterbuch",
    "Open dictionary": "Wörterbuch öffnen",
    "Close dictionary": "Wörterbuch schließen",
    "Your Dictionary": "Dein Wörterbuch",
    "Search your dictionary…": "Im Wörterbuch suchen…",
    "Filter by group": "Nach Gruppe filtern",
    "Sort words": "Wörter sortieren",
    "My order": "Meine Reihenfolge",
    "A to Z": "A bis Z",
    "Newest first": "Neueste zuerst",
    "Oldest first": "Älteste zuerst",
    "Manage groups": "Gruppen verwalten",
    "+ Add a word": "+ Wort hinzufügen",
    "Word": "Wort",
    "Meaning / note": "Bedeutung / Notiz",
    "Group": "Gruppe",
    "‹ Back to dictionary": "‹ Zurück zum Wörterbuch",
    "Group to edit": "Zu bearbeitende Gruppe",
    "Rename this group": "Diese Gruppe umbenennen",
    "Delete this group": "Diese Gruppe löschen",
    "Deleting a group keeps its words — they move to the first group.": "Beim Löschen einer Gruppe bleiben ihre Wörter erhalten — sie wandern in die erste Gruppe.",
    "Add a new group": "Neue Gruppe anlegen",
    "New group": "Neue Gruppe",
    "+ Add group": "+ Gruppe hinzufügen",
    "Ungrouped": "Ohne Gruppe",
    "All groups": "Alle Gruppen",
    "{shown} / {total}": "{shown} / {total}",
    "No words saved yet. Look a word up, then tap the star to save it here.": "Noch keine Wörter gespeichert. Schlag etwas nach und tippe auf den Stern, um es hier zu speichern.",
    "Import…": "Importieren…",
    "Each row becomes one word: first column the word, second the meaning, third an optional link. A header row is detected and skipped automatically.": "Jede Zeile wird zu einem Wort: erste Spalte das Wort, zweite die Bedeutung, dritte optional ein Link. Eine Kopfzeile wird automatisch erkannt und übersprungen.",
    "Excel (.xlsx) or CSV file": "Excel- (.xlsx) oder CSV-Datei",
    "…or a Google Sheets share link": "…oder ein Google-Sheets-Freigabelink",
    "Fetch": "Abrufen",
    "Add into group": "In Gruppe einfügen",
    "Add these words": "Diese Wörter hinzufügen",
    "Reading…": "Wird gelesen…",
    "Fetching…": "Wird abgerufen…",
    "Couldn't find any words in that file.": "In dieser Datei wurden keine Wörter gefunden.",
    "Found {count} words in {source}.": "{count} Wörter in {source} gefunden.",
    "the sheet": "dem Sheet",
    "Couldn't read that file.": "Diese Datei konnte nicht gelesen werden.",
    "That doesn't look like a Google Sheets link.": "Das sieht nicht nach einem Google-Sheets-Link aus.",
    "Couldn't fetch that sheet. Make sure it's shared as \"Anyone with the link can view\".": "Dieses Sheet konnte nicht abgerufen werden. Stelle sicher, dass es als „Jeder mit dem Link kann es aufrufen“ freigegeben ist.",
    "…and {count} more": "…und {count} weitere",
    "Nothing new to add.": "Nichts Neues zum Hinzufügen.",
    "Added {count} words to your dictionary": "{count} Wörter zu deinem Wörterbuch hinzugefügt",
    "Add these {count} words": "Diese {count} Wörter hinzufügen",
    "No words matched.": "Keine Treffer.",
    "Move {word} up": "{word} nach oben",
    "Move {word} down": "{word} nach unten",
    "Group: {group}": "Gruppe: {group}",
    "Saved {date}": "Gespeichert am {date}",
    "Group {n}": "Gruppe {n}",
    "Please enter a word": "Bitte gib ein Wort ein",
    "You need at least one group.": "Du brauchst mindestens eine Gruppe.",
    "Save to your dictionary": "Im Wörterbuch speichern",
    "Remove from your dictionary": "Aus dem Wörterbuch entfernen",
    "Added to your dictionary": "Im Wörterbuch gespeichert",
    "Removed from your dictionary": "Aus dem Wörterbuch entfernt",
    "Select a question (optional)": "Frage wählen (optional)",
    "Set up your PINs": "PINs einrichten",
    "A PIN to open MyHome Browser, and a separate PIN to turn scroll ON — both required, so the friction this app relies on can't quietly default to something guessable. You can switch to Face ID / Fingerprint instead later, in Settings.": "Eine PIN zum Öffnen von MyHome Browser und eine separate PIN zum Einschalten des Scrollens – beide sind erforderlich, damit die Reibung, auf die diese App angewiesen ist, nicht stillschweigend auf etwas Erratbares zurückfällt. Du kannst später in den Einstellungen stattdessen auf Face ID / Fingerabdruck umsteigen.",
    "Select a question": "Frage wählen",
    "Choose a security question and answer it, so you can reset your PIN if you forget it": "Wähle eine Sicherheitsfrage und beantworte sie, damit du deine PIN zurücksetzen kannst, falls du sie vergisst.",
    "Search results": "Suchergebnisse",
    "Close search results": "Suchergebnisse schließen",
    "Searching…": "Suche läuft…",
    "Search failed: {message}": "Suche fehlgeschlagen: {message}",
    "No results found.": "Keine Ergebnisse gefunden.",
    "Search results for \"{query}\"": "Suchergebnisse für „{query}“",
    "Typed search terms show Wikipedia results as a list inside the app — no setup needed, but only Wikipedia articles, not the wider web. Typing the address of a big site that refuses to be shown inside another page (Google, Instagram, Facebook, X, TikTok, YouTube, DuckDuckGo) opens it in your regular browser instead — that's the site's own policy, not something this app can change.": "Eingegebene Suchbegriffe zeigen Wikipedia-Ergebnisse als Liste innerhalb der App — keine Einrichtung nötig, durchsucht wird aber nur Wikipedia, nicht das gesamte Web. Die Eingabe der Adresse einer großen Website, die sich weigert, in einer anderen Seite angezeigt zu werden (Google, Instagram, Facebook, X, TikTok, YouTube, DuckDuckGo), öffnet diese stattdessen in deinem normalen Browser — das ist die eigene Richtlinie der Website und nichts, was diese App ändern kann.",
    "Ad blocking only stops known ad domains, not ads on a page you already opened.": "Die Werbeblockierung stoppt nur bekannte Werbedomains, nicht Werbung auf einer bereits geöffneten Seite.",
    "Save with your own note": "Mit eigener Notiz speichern",
    "Your own note": "Deine eigene Notiz",
    "Search shows Wikipedia results here. An address opens as a tab.": "Die Suche zeigt hier Wikipedia-Ergebnisse. Eine Adresse öffnet als Tab.",
    "Tap the star on a tab, or on a search result, to save it.": "Tippe auf den Stern eines Tabs oder Suchergebnisses zum Speichern.",
    "The pencil on a search result lets you write your own note.": "Der Stift an einem Ergebnis lässt dich eine eigene Notiz schreiben.",
    "Scroll is OFF": "Scrollen ist AUS",
    "These apps open in your normal browser, where this app can't keep scroll locked — so while scroll is OFF they stay closed.": "Diese Apps öffnen sich in deinem normalen Browser, wo diese App das Scrollen nicht sperren kann — solange Scrollen aus ist, bleiben sie also zu.",
    "Not now": "Jetzt nicht",
    "Install to your home screen": "Auf dem Startbildschirm installieren",
    "Install": "Installieren",
    "Installed to your home screen": "Auf dem Startbildschirm installiert",
    "Apps that need scroll ON": "Apps, die eingeschaltetes Scrollen brauchen",
    "Don't let the apps below open while scroll is OFF": "Die Apps unten nicht öffnen, solange Scrollen AUS ist",
    "{app} opens in a separate browser tab, so you'll leave MyHome Browser and have to find your way back. Installing this app to your home screen usually improves that — see Settings.": "{app} öffnet sich in einem separaten Browser-Tab, du verlässt MyHome Browser also und musst den Weg zurück suchen. Diese App auf dem Startbildschirm zu installieren verbessert das meistens — siehe Einstellungen.",
    "Installed. Other apps still open outside this app, but most phones now show them as a layer you can close to come straight back rather than switching you away. Either way your tabs, dictionary and scroll state are kept. Other apps' Share button can now send links, text and files straight into your Waiting room, too.": "Installiert. Andere Apps öffnen sich weiterhin außerhalb dieser App, aber die meisten Handys zeigen sie jetzt als schließbare Ebene, statt komplett umzuschalten. So oder so bleiben deine Tabs, das Wörterbuch und der Scroll-Status erhalten. Der Teilen-Button anderer Apps kann jetzt außerdem Links, Text und Dateien direkt in deinen Warteraum schicken.",
    "Right now other apps open in a separate browser tab, so you leave this app and have to find your way back. Installing it to your home screen usually makes them open as a closable layer instead — the exact behaviour is your phone's choice, not this app's.": "Derzeit öffnen sich andere Apps in einem separaten Browser-Tab, du verlässt diese App also und musst den Weg zurück suchen. Wenn du sie auf dem Startbildschirm installierst, öffnen sie sich meist als schließbare Ebene — was genau passiert, entscheidet dein Handy, nicht diese App.",
    "Right now other apps open in a separate browser tab, so you leave this app. In Safari, tap the Share button and choose \"Add to Home Screen\" — that usually helps, though iOS sometimes still switches you over to Safari.": "Derzeit öffnen sich andere Apps in einem separaten Browser-Tab, du verlässt diese App also. Tippe in Safari auf „Teilen“ und wähle „Zum Home-Bildschirm“ — das hilft meistens, auch wenn iOS dich manchmal trotzdem zu Safari schickt.",
    "Open this page in Chrome or Edge and use \"Install app\" (or \"Add to Home Screen\") from the browser menu. Once installed, other apps usually open as a layer you can close to come straight back, instead of taking you away.": "Öffne diese Seite in Chrome oder Edge und wähle im Browsermenü „App installieren“ (oder „Zum Startbildschirm hinzufügen“). Nach der Installation öffnen sich andere Apps meist als Ebene, die du schließen kannst, statt dich wegzuführen.",
    "How other apps open": "Wie andere Apps geöffnet werden",
    "Open other apps in this same window": "Andere Apps in diesem Fenster öffnen",
    "On means the app loads in this window instead of a new tab, so your phone never switches away from MyHome Browser — press back to return here. Off opens a new tab, which on some phones hands you over to a separate browser. Try both and keep whichever returns more cleanly on your device.": "Aktiviert lädt die App in diesem Fenster statt in einem neuen Tab, dein Handy wechselt also nie von MyHome Browser weg — mit „Zurück“ kommst du hierher zurück. Deaktiviert öffnet einen neuen Tab, der dich auf manchen Handys an einen separaten Browser übergibt. Probiere beides und behalte, was auf deinem Gerät sauberer zurückkommt.",
    "{app} loads in this window, so your phone never switches away from MyHome Browser. Press back to return — everything here will be as you left it.": "{app} lädt in diesem Fenster, dein Handy wechselt also nicht von MyHome Browser weg. Mit „Zurück“ kommst du hierher zurück — alles ist noch so, wie du es verlassen hast.",
    "Notifications": "Mitteilungen",
    "Allow notifications": "Mitteilungen erlauben",
    "This browser can't show notifications.": "Dieser Browser kann keine Mitteilungen anzeigen.",
    "Notifications are allowed. They can only reach you while this app is still running in the background — once it's fully closed, nothing can wake it.": "Mitteilungen sind erlaubt. Sie erreichen dich nur, solange diese App noch im Hintergrund läuft — ist sie ganz geschlossen, kann nichts sie wecken.",
    "Notifications are blocked. Allow them for this app in your browser or phone settings, then come back.": "Mitteilungen sind blockiert. Erlaube sie für diese App in den Browser- oder Handyeinstellungen und komm dann zurück.",
    "Let this app notify you when scroll time runs out, a timer ends, or you pass your daily limit.": "Lass dich benachrichtigen, wenn die Scrollzeit abläuft, ein Timer endet oder du dein Tageslimit überschreitest.",
    "Notifications are on": "Mitteilungen sind an",
    "This is what they'll look like.": "So sehen sie aus.",
    "A minute before scroll time runs out": "Eine Minute bevor die Scrollzeit abläuft",
    "When scroll switches back OFF": "Wenn Scrollen wieder ausgeschaltet wird",
    "When the timer finishes": "Wenn der Timer endet",
    "Posture reminders": "Haltungserinnerungen",
    "When you pass your daily limit": "Wenn du dein Tageslimit überschreitest",
    "Scroll time is nearly up": "Die Scrollzeit ist fast vorbei",
    "About a minute left before scroll switches back OFF.": "Noch etwa eine Minute, dann wird Scrollen wieder ausgeschaltet.",
    "You've passed your daily limit": "Du hast dein Tageslimit überschritten",
    "Today is over your {minutes} min goal.": "Heute liegst du über deinem Ziel von {minutes} Min.",
    "Playing here, without the feed": "Läuft hier, ohne den Feed",
    "Showing this post here, without the feed": "Dieser Beitrag wird hier gezeigt, ohne den Feed",
    "Close the app I opened when scroll time runs out": "Die geöffnete App schließen, wenn die Scrollzeit abläuft",
    "This is the only way the time limit reaches inside the other app: this app keeps hold of the tab it opened and shuts it when your time is up. It needs the setting above to be OFF, since there is no separate tab to close otherwise. The cost is that the site you open can see it was opened by this app and could push this page elsewhere — unlikely with the big sites, but not impossible, so turn this off if you would rather not.": "Nur so reicht das Zeitlimit in die andere App hinein: Diese App behält den geöffneten Tab und schließt ihn, wenn deine Zeit um ist. Dafür muss die Einstellung darüber AUS sein, sonst gibt es keinen eigenen Tab zum Schließen. Der Preis: Die geöffnete Seite sieht, dass diese App sie geöffnet hat, und könnte diese Seite woanders hin schicken — bei den großen Seiten unwahrscheinlich, aber nicht unmöglich; schalte es sonst ab.",
    "Time's up — scroll is back OFF and the app you opened was closed": "Zeit ist um — Scrollen ist wieder aus und die geöffnete App wurde geschlossen",
    "Waiting room": "Wartezimmer",
    "Shelf": "Regal",
    "Take a breath": "Kurz durchatmen",
    "This device can't keep records (private browsing, perhaps).": "Dieses Gerät kann nichts aufzeichnen (vielleicht privates Surfen).",
    "day streak": "Tage in Folge",
    "pauses today": "Pausen heute",
    "minutes held": "Minuten aufbewahrt",
    "Hold a file from this device": "Eine Datei von hier aufbewahren",
    "Held on this device: {used} of about {quota}": "Auf diesem Gerät: {used} von etwa {quota}",
    "Put it on the shelf": "Ins Regal stellen",
    "Shelved under {wall}": "Unter {wall} eingeräumt",
    "The shelf is full. Take something off it first.": "Das Regal ist voll. Nimm zuerst etwas heraus.",
    "Couldn't put it on the shelf": "Konnte es nicht ins Regal stellen",
    "This device is out of room for held files": "Auf diesem Gerät ist kein Platz mehr für aufbewahrte Dateien",
    "Couldn't hold that file": "Konnte diese Datei nicht aufbewahren",
    "That file is no longer on this device": "Diese Datei ist nicht mehr auf dem Gerät",
    "Taken off the shelf": "Aus dem Regal genommen",
    "No address": "(keine Adresse)",
    "Something to look at": "Etwas zum Ansehen",
    "Received 1 item from another app": "1 Element von einer anderen App empfangen",
    "Received {n} items from another app": "{n} Elemente von einer anderen App empfangen",
    "Notice what just happened": "Bemerke, was gerade passiert ist",
    "Scroll is OFF right now. Try swiping this page — it won't move. That small inconvenience is the whole point: it buys you a moment to choose, instead of scrolling out of habit.": "Scrollen ist gerade ausgeschaltet. Versuch, auf dieser Seite zu wischen — sie bewegt sich nicht. Genau diese kleine Unannehmlichkeit ist der Punkt: Sie verschafft dir einen Moment zum Entscheiden, statt aus Gewohnheit zu scrollen.",
    "Got it — let me try": "Verstanden — lass es mich versuchen",
    "You said you wanted to get to \"{goal}\". When you're ready for it, tap \"Scroll OFF\" up top to turn scroll ON with a time limit — on your own terms.": "Du hast gesagt, du willst zu „{goal}“ kommen. Wenn du dafür bereit bist, tippe oben auf „Scroll OFF“, um Scrollen mit einem Zeitlimit einzuschalten — zu deinen eigenen Bedingungen.",
    "When you actually want something, tap \"Scroll OFF\" up top to turn scroll ON with a time limit — on your own terms.": "Wenn du wirklich etwas willst, tippe oben auf „Scroll OFF“, um Scrollen mit einem Zeitlimit einzuschalten — zu deinen eigenen Bedingungen.",
    "Step 1 of 5": "Schritt 1 von 5",
    "Step 2 of 5": "Schritt 2 von 5",
    "Step 3 of 5": "Schritt 3 von 5",
    "Step 4 of 5": "Schritt 4 von 5",
    "Step 5 of 5": "Schritt 5 von 5",
    "What do you want your time back for?": "Wofür willst du deine Zeit zurück?",
    "Not \"less phone\" — more of something else. Name one or two things you'd rather be spending it on. This app will remind you of them, not just stop you.": "Nicht „weniger Handy“ — mehr von etwas anderem. Nenne ein, zwei Dinge, denen du die Zeit lieber widmen würdest. Diese App erinnert dich daran, statt dich nur zu stoppen.",
    "Skip for now": "Erst mal überspringen",
    "Choose a time limit. When time is up, scroll switches back OFF and the app you opened from here is closed.": "Wähle ein Zeitlimit. Wenn die Zeit um ist, wird Scrollen wieder ausgeschaltet und die von hier geöffnete App geschlossen.",
    "Choose a time limit. Scroll will switch back OFF automatically when time is up.": "Wähle ein Zeitlimit. Das Scrollen schaltet sich automatisch wieder aus, wenn die Zeit um ist.",
    "None of this is about guilt. It's why a time limit and a PIN can do more than willpower alone.": "Bei alldem geht es nicht um Schuldgefühle. Genau deshalb können ein Zeitlimit und eine PIN mehr bewirken als Willenskraft allein.",
    "These apps refuse to open inside this app, so they run in your normal browser where this app can't hold the scroll lock. Ticked apps only open once you've turned scroll ON with a time limit. Feed apps are ticked to start with — tick any others that eat your time.": "Diese Apps lassen sich nicht in dieser App öffnen und laufen deshalb in deinem normalen Browser, wo diese App die Scrollsperre nicht halten kann. Angehakte Apps öffnen sich erst, wenn du Scrollen mit Zeitlimit eingeschaltet hast. Feed-Apps sind von Anfang an angehakt — hake alles Weitere an, das deine Zeit frisst.",
    "Turn scroll ON with a time limit, and {app} will open.": "Schalte Scrollen mit Zeitlimit ein, dann öffnet sich {app}.",
    "Limits": "Limits",
    "{time} left": "Noch {time}",
    "Add a shelf": "Regal hinzufügen",
    "One video or one post can show inside. A whole feed can't.": "Ein Video oder ein Beitrag geht hier. Ein ganzer Feed nicht.",
    "While scroll is OFF, the apps you ticked in Settings won't open.": "Bei ausgeschaltetem Scrollen öffnen die angehakten Apps nicht.",
    "When time runs out, scroll goes OFF and opened tabs close.": "Ist die Zeit um, geht Scrollen aus und offene Tabs schließen.",
    "Held items wait before they open — longest for gated apps.": "Aufgehobenes wartet vor dem Öffnen — am längsten gesperrte Apps.",
    "Open it after a while away and it asks what you came for.": "Nach einer Weile geöffnet, fragt sie, wofür du kommst.",
    "Breaks offer what you set out to do, your shelf, or a saved word.": "Pausen bieten dein Vorhaben, dein Regal oder ein gespeichertes Wort.",
    "Loosening a limit waits 24 hours. Tightening is immediate.": "Eine Grenze lockern wartet 24 Stunden. Verschärfen wirkt sofort.",
    "Add to your home screen to receive from other apps' Share.": "Zum Startbildschirm hinzufügen, um über Teilen zu empfangen.",
    "Priority and Done decide what a break offers you next.": "Priorität und Erledigt bestimmen, was die nächste Pause anbietet.",
    "Anything you feel like looking at, this holds for a moment first.": "Was du ansehen willst, wartet hier erst einen Moment.",
    "Interrupt me and offer something better to be doing": "Mich unterbrechen und etwas Besseres vorschlagen",
    "Order of the shelf items it reaches for": "Reihenfolge der Regalstücke",
    "The more of when, where and how long you fill in, the easier these are to actually start — and a break landing in that window reaches for them first.": "Je mehr du zu Wann, Wo und Wie lange einträgst, desto leichter fängst du an — und eine Pause in dem Zeitfenster greift zuerst danach.",
    "e.g. Practise guitar": "z.B. Gitarre üben",
    "Time of day": "Tageszeit",
    "Days": "Tage",
    "Where (optional)": "Wo (optional)",
    "Any day": "Jeder Tag",
    "Weekdays": "Wochentags",
    "Weekends": "Am Wochenende",
    "{count} from your shelf": "{count} aus deinem Regal",
    "{count} you set out to do": "{count} von dir vorgenommen",
    "This week: {count}": "Diese Woche: {count}",
    "{weeks} weeks ago: {count}": "Vor {weeks} Wochen: {count}",
    "Morning": "Morgens",
    "Afternoon": "Nachmittags",
    "Evening": "Abends",
    "Late night": "Spätnachts",
    "Any time": "Jederzeit",
    "done {count}x": "{count}× erledigt",
    "{idle} of your last {total} opens had nothing particular behind them.": "{idle} deiner letzten {total} Starts hatten keinen bestimmten Anlass.",
    "You finished {count} things these last two weeks.": "In den letzten zwei Wochen hast du {count} Dinge abgeschlossen.",
    "You opened this without anything particular in mind.": "Du hast das ohne bestimmten Anlass geöffnet.",
    "Since you last looked": "Seit dem letzten Blick",
    "Good": "Gut",
    "What did you come here for?": "Wofür bist du hergekommen?",
    "No wrong answer — this is just so the reason is yours and not the phone's.": "Keine falsche Antwort — es geht nur darum, dass der Anlass deiner ist und nicht der des Handys.",
    "To look something up": "Um etwas nachzuschlagen",
    "To get to something I set aside": "Um etwas Aufgehobenes anzugehen",
    "No particular reason": "Kein bestimmter Anlass",
    "When you open the app": "Beim Öffnen der App",
    "Ask what I came here for": "Fragen, wofür ich hergekommen bin",
    "Asked at most once every few minutes, never mid-task. Every answer is one tap. Answering \"no particular reason\" brings up something you said you wanted to do instead.": "Höchstens alle paar Minuten gefragt, nie mitten in einer Aufgabe. Jede Antwort ist ein Tipp. „Kein bestimmter Anlass\" holt etwas hervor, das du tun wolltest.",
    "Stop asking what you came for": "Nicht mehr fragen, wofür du kommst",
    "You said {promised}. It was {actual} — {over} of your last {total} went over.": "Du sagtest {promised}. Es wurden {actual} — {over} deiner letzten {total} Male gingen darüber.",
    "You went past your own limit on {over} of the last {total} times you left, by {avg} on average.": "Bei {over} von deinen letzten {total} Malen bist du über dein eigenes Limit gegangen, im Schnitt um {avg}.",
    "You came back within your own limit all {total} of the last times you left.": "Du bist bei allen letzten {total} Malen innerhalb deines eigenen Limits zurückgekommen.",
    "If {trigger}, then {action}": "Wenn {trigger}, dann {action}",
    "Saved. It takes effect in {wait} — you can cancel until then.": "Gespeichert. Wird in {wait} wirksam — bis dahin kannst du abbrechen.",
    "{change} — in {wait}": "{change} — in {wait}",
    "Cancel this change": "Diese Änderung abbrechen",
    "Change cancelled": "Änderung abgebrochen",
    "{text} · done {count}x": "{text} · {count}× erledigt",
    "Remove this rule": "Diese Regel entfernen",
    "How about this now?": "Wie wäre es jetzt hiermit?",
    "Away from the screen": "Weg vom Bildschirm",
    "Did it": "Gemacht",
    "There's something you said you wanted to do.": "Da ist etwas, das du tun wolltest.",
    "Nice.": "Schön.",
    "finished": "erledigt",
    "You decided": "Du hattest entschieden",
    "Turn scroll ON anyway": "Trotzdem Scrollen einschalten",
    "Set out what you want to get to, in Settings — then this offers those instead of just something to read.": "Trag in den Einstellungen ein, was du angehen willst — dann wird das statt nur einer Lektüre angeboten.",
    "What you want to get to": "Was du angehen willst",
    "Your shelf only holds things you put off looking at. List what you actually want to spend the time on, and breaks will offer these first.": "In deinem Regal liegt nur, was du aufgeschoben hast. Trag ein, wofür du die Zeit wirklich nutzen willst — Pausen bieten das zuerst an.",
    "Nothing here yet — breaks will fall back to your shelf, a saved word, and small away-from-screen nudges.": "Noch nichts hier — Pausen greifen dann auf dein Regal, ein gespeichertes Wort und kleine Anstöße weg vom Bildschirm zurück.",
    "If this, then that": "Wenn dies, dann das",
    "Decide now, while it's easy, what you'll do in the moment it isn't. These are read back to you when an app is held closed.": "Entscheide jetzt, solange es leicht fällt, was du tust, wenn es das nicht tut. Diese Regeln werden dir vorgehalten, wenn eine App zubleibt.",
    "No rules yet.": "Noch keine Regeln.",
    "If… (e.g. it's past 11pm)": "Wenn… (z.B. es ist nach 23 Uhr)",
    "then… (e.g. I'll read one shelved thing)": "dann… (z.B. lese ich etwas aus dem Regal)",
    "Cooling-off period": "Abkühlphase",
    "Make loosening these settings wait 24 hours": "Lockerungen dieser Einstellungen 24 Stunden warten lassen",
    "The version of you that sets these limits and the version that wants past them are not in the room at the same time. Tightening anything still takes effect at once; only loosening waits, and you can cancel it the whole time.": "Die Version von dir, die diese Grenzen setzt, und die, die darüber hinaus will, sind nie gleichzeitig im Raum. Verschärfen wirkt weiterhin sofort; nur Lockern wartet, und du kannst es die ganze Zeit abbrechen.",
    "Waiting to take effect:": "Wartet auf Wirksamkeit:",
    "Turn forced breaks off": "Erzwungene Pausen ausschalten",
    "Make breaks less frequent": "Pausen seltener machen",
    "Raise the scroll count before a break": "Scroll-Anzahl bis zur Pause erhöhen",
    "Turn the cooling-off period off": "Abkühlphase ausschalten",
    "Stop requiring scroll ON for those apps": "Für diese Apps kein eingeschaltetes Scrollen mehr verlangen",
    "Remove apps from the scroll gate": "Apps aus der Scroll-Sperre entfernen",
    "Added shelf {name}": "Regal {name} hinzugefügt",
    "File": "Datei",
    "Later": "Später",
    "Shelf space": "Regalplatz",
    "— empty shelf —": "— leeres Fach —",
    "Nothing on the shelf yet. Things you keep from the waiting room end up here.": "Noch nichts im Regal. Was du aus dem Wartezimmer behältst, landet hier.",
    "Shelf wall": "Regalwand",
    "Previous wall": "Vorherige Wand",
    "Next wall": "Nächste Wand",
    "{kind} · {size}": "{kind} · {size}",
    "Drink a glass of water, slowly.": "Trink ein Glas Wasser, langsam.",
    "Look at the furthest thing out of the window.": "Schau aus dem Fenster auf das Entfernteste.",
    "Lift your shoulders, then let them drop. Three times.": "Zieh die Schultern hoch und lass sie fallen. Dreimal.",
    "Put three things on your desk back where they belong.": "Räum drei Dinge auf dem Tisch an ihren Platz.",
    "Close your eyes and count three sounds you can hear.": "Schließ die Augen und zähl drei Geräusche.",
    "Stand up and walk once around the room.": "Steh auf und geh einmal durchs Zimmer.",
    "Wash your hands. Notice the temperature of the water.": "Wasch dir die Hände. Spür die Wassertemperatur.",
    "Straighten your back and look up at the ceiling.": "Mach den Rücken gerade und schau zur Decke.",
    "Open a window or a curtain and let the air change.": "Öffne ein Fenster oder einen Vorhang, lüfte.",
    "Remember one good thing about today.": "Erinnere dich an eine gute Sache von heute.",
    "Feel where your feet are touching the floor.": "Spür, wo deine Füße den Boden berühren.",
    "Leave one line of a note for tomorrow's you.": "Hinterlass dem Morgen-Ich eine Zeile.",
    "Look into the distance and let your eyes go soft.": "Schau in die Ferne und lass die Augen weich werden.",
    "Breathe in deeply, breathe out slowly. That's enough.": "Tief einatmen, langsam ausatmen. Das genügt.",
    "{used} / {total}": "{used} / {total}",
    "Close": "Schließen",
    "Search the shelf…": "Im Regal suchen…",
    "Nothing on the shelf matched.": "Nichts im Regal passt dazu.",
    "Priority": "Priorität",
    "High": "Hoch",
    "Low": "Niedrig",
    "Order on this shelf": "Reihenfolge in diesem Fach",
    "Move earlier": "Nach oben",
    "Move later": "Nach unten",
    "Done": "Erledigt",
    "Not done after all": "Doch nicht erledigt",
    "Marked as done": "Als erledigt markiert",
    "Put back as unfinished": "Wieder als offen gesetzt",
    "Done ({count})": "Erledigt ({count})",
    "Break reminders": "Pausenerinnerungen",
    "This doesn't wait for you to remember. Whatever screen you're on, once you pass the limits below, a quiet banner appears (a short vibration, no sound) offering what you set out to do, something from your shelf, or a saved word — it doesn't block what you're doing.": "Das wartet nicht darauf, dass du daran denkst. Egal auf welchem Bildschirm — sobald du die Grenzen unten überschreitest, erscheint ein leiser Hinweis (eine kurze Vibration, kein Ton) mit deinem Vorhaben, etwas aus deinem Regal oder einem gespeicherten Wort — ohne zu blockieren, was du gerade tust.",
    "Every (minutes)": "Alle (Minuten)",
    "Or after this many scrolls (0 = off)": "Oder nach so vielen Scrolls (0 = aus)",
    "Highest priority first": "Höchste Priorität zuerst",
    "The order I arranged": "Meine eigene Reihenfolge",
    "Time for a break": "Zeit für eine Pause",
    "From your shelf": "Aus deinem Regal",
    "You've been at this for {minutes} minutes.": "Du bist seit {minutes} Minuten dabei.",
    "You've scrolled {count} times since your last break.": "Du hast seit der letzten Pause {count} Mal gescrollt.",
    "There's nothing unfinished on your shelf yet. Put something there and this will offer it next time.": "Im Regal liegt noch nichts Offenes. Leg etwas hinein, dann wird es beim nächsten Mal vorgeschlagen.",
    "Mark done": "Als erledigt markieren",
    "Open this": "Das öffnen",
    "Pick one of your own shelves to share.": "Wähle eines deiner eigenen Regale zum Teilen aus.",
    "This shelf has nothing with a link on it yet.": "Dieses Regal enthält noch nichts mit einem Link.",
    "My shelf: {name}": "Mein Regal: {name}",
    "Link copied. Send it to someone.": "Link kopiert. Schick ihn jemandem.",
    "Couldn't share this shelf": "Dieses Regal konnte nicht geteilt werden",
    "Someone shared a shelf with you — {count} things on it.": "Jemand hat ein Regal mit dir geteilt — {count} Dinge darauf.",
    "Added {count} things to a new shelf": "{count} Dinge zu einem neuen Regal hinzugefügt",
    "Name this shelf": "Gib diesem Regal einen Namen",
    "You finished {count} things these last two weeks — about {minutes} of your own choosing.": "In den letzten zwei Wochen hast du {count} Dinge abgeschlossen — etwa {minutes} deiner eigenen Wahl.",
    "A word from your dictionary": "Ein Wort aus deinem Wörterbuch",
    "Nice to know": "Gut zu wissen",
    "Rename": "Umbenennen",
    "Share this shelf": "Dieses Regal teilen",
    "How long it takes (minutes)": "Wie lange es dauert (Minuten)",
    "A shelf from someone": "Ein Regal von jemandem",
    "Taking it adds a new shelf of your own. Nothing you already have is touched.": "Beim Annehmen wird ein neues eigenes Regal hinzugefügt. Nichts, was du bereits hast, wird verändert.",
    "No thanks": "Nein danke",
    "Add to my shelves": "Zu meinen Regalen hinzufügen",
    "e.g. 12": "z. B. 12",
    "Break's over. Nice.": "Pause vorbei. Gut gemacht.",
    "{app} stays closed until your break ends.": "{app} bleibt geschlossen, bis deine Pause endet.",
    "You're on a break": "Du machst gerade Pause",
    "Back to the break": "Zurück zur Pause",
    "End the break early": "Pause vorzeitig beenden",
    "Break length": "Pausendauer",
    "Notify me even when this app is fully closed": "Benachrichtige mich, auch wenn die App vollständig geschlossen ist",
    "This uses a small external server (not run by you) that holds only the alert times and text above — nothing about what you look at, your dictionary, or your shelf. It can't schedule a daily-limit alert this way, since that depends on watching today's usage as it happens; that one still only fires while this app is open.": "Dafür wird ein kleiner externer Server verwendet (den nicht du betreibst), der nur die Uhrzeiten und Texte der obigen Hinweise speichert — nichts darüber, was du dir ansiehst, dein Wörterbuch oder dein Regal. Den Hinweis zum Tageslimit kann er so nicht planen, da er davon abhängt, die heutige Nutzung laufend zu beobachten; der funktioniert weiterhin nur, während die App offen ist.",
    "Couldn't turn this on right now": "Konnte das gerade nicht aktivieren",
    "Notifications on — tap to turn off": "Benachrichtigungen an — tippen zum Ausschalten",
    "Notifications off — tap to turn on": "Benachrichtigungen aus — tippen zum Einschalten",
    "Share anonymous usage events": "Anonyme Nutzungsereignisse teilen",
    "Send anonymous usage events to this app's operator": "Anonyme Nutzungsereignisse an den Betreiber dieser App senden",
    "Separate from notifications, and off by default. When on, this device sends named moments only — things like \"scroll turned on\", \"a shelf item was marked done\", or \"a dock app was opened\" — tagged with a random device id, never your name or account. It never includes what you searched, dictionary words, shelf titles, or URLs. The full list of what's sent lives in push-server/README.md. Turning this off stops it immediately.": "Getrennt von Benachrichtigungen und standardmäßig aus. Wenn aktiviert, sendet dieses Gerät nur benannte Momente — etwa „Scrollen eingeschaltet“, „ein Regal-Eintrag wurde als erledigt markiert“ oder „eine Dock-App wurde geöffnet“ — versehen mit einer zufälligen Geräte-ID, nie deinem Namen oder Konto. Es enthält nie, wonach du gesucht hast, Wörterbucheinträge, Regaltitel oder URLs. Die vollständige Liste dessen, was gesendet wird, steht in push-server/README.md. Das Ausschalten stoppt es sofort.",
    "Time's up — scroll switched back OFF. You kept your word.": "Zeit um – Scrollen wurde wieder ausgeschaltet. Du hast dein Wort gehalten.",
    "Time's up — scroll is back OFF and the app you opened was closed. You kept your word.": "Zeit ist um — Scrollen ist wieder aus und die geöffnete App wurde geschlossen. Du hast dein Wort gehalten.",
    "Things you want to get to": "Was du dir vorgenommen hast",
    "Nothing here yet — add something and breaks will offer it first.": "Noch nichts hier — füge etwas hinzu, und Pausen bieten es zuerst an.",
    "+ Add something": "+ Etwas hinzufügen",
    "Keep at it until (optional)": "Dranbleiben bis (optional)",
    "+ Add a book": "+ Ein Buch hinzufügen",
    "Link (optional)": "Link (optional)",
    "{days} days left": "Noch {days} Tage",
    "1 day left": "Noch 1 Tag",
    "Last day": "Letzter Tag",
    "Past your date": "Datum überschritten",
    "Added to shelf {wall}": "Zu Regal {wall} hinzugefügt",
    "Anonymous usage events": "Anonyme Nutzungsereignisse",
    "This app's server is set up, so this device automatically sends named moments only — things like \"scroll turned on\", \"a shelf item was marked done\", or \"a dock app was opened\" — tagged with a random device id, never your name or account. It never includes what you searched, dictionary words, shelf titles, or URLs. There's no separate switch for this: as long as the server is configured, it's sent. The full list of what's sent lives in push-server/README.md.": "Der Server dieser App ist eingerichtet, daher sendet dieses Gerät automatisch nur benannte Momente — wie „Scrollen aktiviert“, „ein Regalelement als erledigt markiert“ oder „eine Dock-App geöffnet“ — versehen mit einer zufälligen Geräte-ID, nie deinem Namen oder Konto. Es enthält nie, wonach du gesucht hast, Wörterbucheinträge, Regaltitel oder URLs. Dafür gibt es keinen separaten Schalter: Solange der Server konfiguriert ist, wird gesendet. Die vollständige Liste dessen, was gesendet wird, steht in push-server/README.md.",
    "Days (optional)": "Tage (optional)",
    "The more of when, which days and how long you fill in, the easier these are to actually start — and a break landing in that window reaches for them first.": "Je mehr du zu wann, an welchen Tagen und wie lange ausfüllst, desto leichter fällt der tatsächliche Einstieg — und eine Pause in diesem Zeitfenster greift zuerst darauf zurück.",
    "Goals": "Ziele",
    "Not recorded": "Nicht erfasst",
    "Not at all": "Gar nicht",
    "Barely": "Kaum",
    "Minimum done": "Minimum erledigt",
    "Pretty good": "Ziemlich gut",
    "Nailed it!": "Perfekt gemacht!",
    "Note": "Notiz",
    "Add something you want to work on, and it'll show up here to track.": "Füge etwas hinzu, woran du arbeiten möchtest, und es erscheint hier zur Verfolgung.",
    "Date": "Datum",
    "No records this month": "Keine Einträge in diesem Monat",
    "Diary saved": "Tagebuch gespeichert",
    "Active Days": "Aktive Tage",
    "last {days}d": "letzte {days}T",
    "Avg Score": "Ø-Wert",
    "out of 5.0": "von 5,0",
    "Top Category": "Top-Kategorie",
    "avg": "Ø",
    "no data": "keine Daten",
    "Activity Heatmap": "Aktivitäts-Heatmap",
    "Category Balance": "Kategorie-Balance",
    "Progress Trend": "Fortschrittstrend",
    "Best Day of Week": "Bester Wochentag",
    "Streaks & Completion": "Serien & Abschluss",
    "Level Distribution": "Stufenverteilung",
    "Need 2+ categories": "Mind. 2 Kategorien nötig",
    "Streak": "Serie",
    "Best": "Beste",
    "Days done": "Erledigte Tage",
    "Rate": "Quote",
    "History": "Verlauf",
    "Diary": "Tagebuch",
    "Stats": "Statistik",
    "7 Days": "7 Tage",
    "30 Days": "30 Tage",
    "90 Days": "90 Tage",
    "Previous day": "Vorheriger Tag",
    "Next day": "Nächster Tag",
    "Close note": "Notiz schließen",
    "What happened today? Thoughts, feelings, reflections…": "Was ist heute passiert? Gedanken, Gefühle, Reflexionen…",
    "Add a note for this day…": "Notiz für diesen Tag hinzufügen…",
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
    "Add your own site": "Ajouter votre propre site",
    "Name": "Nom",
    "Website address": "Adresse du site",
    "Order": "Ordre",
    "Use the arrows to change the order apps appear in on your home screen.": "Utilisez les flèches pour changer l'ordre d'affichage des apps sur votre écran d'accueil.",
    "Remove {app}": "Supprimer {app}",
    "Check some apps above to arrange their order.": "Cochez des apps ci-dessus pour organiser leur ordre.",
    "Move {app} earlier": "Déplacer {app} plus tôt",
    "Move {app} later": "Déplacer {app} plus tard",
    "Enter a name and a website address": "Saisissez un nom et une adresse de site",
    "Enter a valid website address": "Saisissez une adresse de site valide",
    "Added {app}": "{app} ajouté",
    "The list of apps installed on your phone can't be read automatically from a web page, so pick from the candidates below instead.": "La liste des apps installées sur votre téléphone ne peut pas être lue automatiquement depuis une page web ; choisissez plutôt parmi les propositions ci-dessous.",
    "Add up to 10 apps from \"Edit Apps\"": "Ajoutez jusqu'à 10 apps depuis « Modifier les apps »",
    "Open this app?": "Ouvrir cette app ?",
    "Open": "Ouvrir",
    "Cancel": "Annuler",
    "Turn scroll ON": "Activer le défilement",
    "Time limit": "Limite de temps",
    "4-digit PIN": "Code PIN à 4 chiffres",
    "Turn ON": "Activer",
    "Unlock with Face ID / Fingerprint": "Déverrouiller avec Face ID / empreinte",
    "Choose your language": "Choisissez votre langue",
    "App Lock PIN (opens the app)": "PIN de verrouillage (ouvre l'app)",
    "Scroll PIN (turns scroll ON)": "PIN de défilement (active le défilement)",
    "Security question": "Question de sécurité",
    "What was your first pet's name?": "Quel était le nom de votre premier animal de compagnie ?",
    "What is your mother's maiden name?": "Quel est le nom de jeune fille de votre mère ?",
    "What was the name of your first school?": "Quel était le nom de votre première école ?",
    "What city were you born in?": "Dans quelle ville êtes-vous né·e ?",
    "What was your childhood nickname?": "Quel était votre surnom d'enfance ?",
    "What is your favorite food?": "Quel est votre plat préféré ?",
    "Answer": "Réponse",
    "Save & Continue": "Enregistrer et continuer",
    "Which social media do you use?": "Quels réseaux sociaux utilisez-vous ?",
    "Choose the ones you want quick access to from your dock.": "Choisissez ceux auxquels vous voulez accéder rapidement depuis le dock.",
    "Finish setup": "Terminer la configuration",
    "Settings": "Réglages",
    "Close settings": "Fermer les réglages",
    "Open settings": "Ouvrir les réglages",
    "How to use this app": "Comment utiliser cette app",
    "Set a timer": "Régler un minuteur",
    "Look & Feel": "Apparence",
    "PINs & Unlock": "PIN et déverrouillage",
    "Appearance": "Apparence",
    "Green": "Vert",
    "Blue": "Bleu",
    "Accent color": "Couleur d'accent",
    "Background color": "Couleur de fond",
    "Choose background image": "Choisir une image de fond",
    "Remove image": "Supprimer l'image",
    "Reset colors": "Réinitialiser les couleurs",
    "Purple": "Violet",
    "Orange": "Orange",
    "Pink": "Rose",
    "Dark": "Sombre",
    "Home Screen Icons": "Icônes de l'écran d'accueil",
    "Icon size": "Taille des icônes",
    "Small": "Petite",
    "Medium": "Moyenne",
    "Large": "Grande",
    "Icon shape": "Forme des icônes",
    "Rounded square": "Carré arrondi",
    "Circle": "Cercle",
    "Show app names under icons": "Afficher le nom des apps sous les icônes",
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
    "{time} left — the app will lock when this reaches 0:00.": "{time} restant — l'app se verrouillera à 0:00.",
    "{time} left. This is just a timer; nothing else happens at 0:00.": "{time} restant. Ce n'est qu'un minuteur ; rien d'autre ne se passe à 0:00.",
    "{minutes} min": "{minutes} min",
    "Remove \"{name}\"": "Supprimer « {name} »",
    "{label} ({minutes} min)": "{label} ({minutes} min)",
    "{label} · {index} of {total}": "{label} · {index} sur {total}",
    "Timer started — app locks in {label}": "Minuteur lancé — l'app se verrouille dans {label}",
    "Timer started for {label}": "Minuteur lancé pour {label}",
    "Open {app}?": "Ouvrir {app} ?",
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
    "Blocked: this looks like an ad or tracking domain": "Bloqué : ceci ressemble à un domaine publicitaire ou de suivi",
    "Close tab \"{title}\"": "Fermer l'onglet « {title} »",
    "Insights": "Statistiques",
    "Search or enter a website above to start browsing.": "Recherchez ou saisissez un site ci-dessus pour commencer à naviguer.",
    "Open insights": "Ouvrir les statistiques",
    "Search or go to address": "Rechercher ou aller à une adresse",
    "Search or enter address": "Rechercher ou saisir une adresse",
    "Basic search": "Recherche simplifiée",
    "Open in browser": "Ouvrir dans le navigateur",
    "Close insights": "Fermer les statistiques",
    "Browsing": "Navigation",
    "Still finding what you needed? You've been browsing for {minutes} minutes.": "Avez-vous trouvé ce que vous cherchiez ? Vous naviguez depuis {minutes} minutes.",
    "Check in with me every 10 minutes while I'm browsing a tab": "Me le rappeler toutes les 10 minutes pendant que je navigue dans un onglet",
    "Still browsing": "Navigation en cours",
    "Keep browsing": "Continuer à naviguer",
    "{domain} doesn't allow embedding, so it opened in your browser instead.": "{domain} n'autorise pas l'affichage intégré, elle s'est donc ouverte dans votre navigateur.",
    "Saved": "Enregistré",
    "Edit": "Modifier",
    "Remove": "Retirer",
    "Title": "Titre",
    "Dictionary": "Dictionnaire",
    "Open dictionary": "Ouvrir le dictionnaire",
    "Close dictionary": "Fermer le dictionnaire",
    "Your Dictionary": "Votre dictionnaire",
    "Search your dictionary…": "Rechercher dans votre dictionnaire…",
    "Filter by group": "Filtrer par groupe",
    "Sort words": "Trier les mots",
    "My order": "Mon ordre",
    "A to Z": "De A à Z",
    "Newest first": "Plus récents d'abord",
    "Oldest first": "Plus anciens d'abord",
    "Manage groups": "Gérer les groupes",
    "+ Add a word": "+ Ajouter un mot",
    "Word": "Mot",
    "Meaning / note": "Sens / note",
    "Group": "Groupe",
    "‹ Back to dictionary": "‹ Retour au dictionnaire",
    "Group to edit": "Groupe à modifier",
    "Rename this group": "Renommer ce groupe",
    "Delete this group": "Supprimer ce groupe",
    "Deleting a group keeps its words — they move to the first group.": "Supprimer un groupe conserve ses mots — ils passent dans le premier groupe.",
    "Add a new group": "Créer un nouveau groupe",
    "New group": "Nouveau groupe",
    "+ Add group": "+ Ajouter un groupe",
    "Ungrouped": "Sans groupe",
    "All groups": "Tous les groupes",
    "{shown} / {total}": "{shown} / {total}",
    "No words saved yet. Look a word up, then tap the star to save it here.": "Aucun mot enregistré. Cherchez quelque chose, puis touchez l'étoile pour l'enregistrer ici.",
    "Import…": "Importer…",
    "Each row becomes one word: first column the word, second the meaning, third an optional link. A header row is detected and skipped automatically.": "Chaque ligne devient un mot : la première colonne est le mot, la deuxième le sens, la troisième un lien facultatif. Une ligne d'en-tête est détectée et ignorée automatiquement.",
    "Excel (.xlsx) or CSV file": "Fichier Excel (.xlsx) ou CSV",
    "…or a Google Sheets share link": "…ou un lien de partage Google Sheets",
    "Fetch": "Récupérer",
    "Add into group": "Ajouter au groupe",
    "Add these words": "Ajouter ces mots",
    "Reading…": "Lecture…",
    "Fetching…": "Récupération…",
    "Couldn't find any words in that file.": "Aucun mot trouvé dans ce fichier.",
    "Found {count} words in {source}.": "{count} mots trouvés dans {source}.",
    "the sheet": "la feuille",
    "Couldn't read that file.": "Impossible de lire ce fichier.",
    "That doesn't look like a Google Sheets link.": "Cela ne ressemble pas à un lien Google Sheets.",
    "Couldn't fetch that sheet. Make sure it's shared as \"Anyone with the link can view\".": "Impossible de récupérer cette feuille. Vérifiez qu'elle est partagée avec « Tous les utilisateurs disposant du lien ».",
    "…and {count} more": "…et {count} de plus",
    "Nothing new to add.": "Rien de nouveau à ajouter.",
    "Added {count} words to your dictionary": "{count} mots ajoutés à votre dictionnaire",
    "Add these {count} words": "Ajouter ces {count} mots",
    "No words matched.": "Aucun résultat.",
    "Move {word} up": "Déplacer {word} vers le haut",
    "Move {word} down": "Déplacer {word} vers le bas",
    "Group: {group}": "Groupe : {group}",
    "Saved {date}": "Enregistré le {date}",
    "Group {n}": "Groupe {n}",
    "Please enter a word": "Saisissez un mot",
    "You need at least one group.": "Il faut au moins un groupe.",
    "Save to your dictionary": "Enregistrer dans votre dictionnaire",
    "Remove from your dictionary": "Retirer de votre dictionnaire",
    "Added to your dictionary": "Enregistré dans votre dictionnaire",
    "Removed from your dictionary": "Retiré de votre dictionnaire",
    "Select a question (optional)": "Sélectionner une question (facultatif)",
    "Set up your PINs": "Configurez vos codes PIN",
    "A PIN to open MyHome Browser, and a separate PIN to turn scroll ON — both required, so the friction this app relies on can't quietly default to something guessable. You can switch to Face ID / Fingerprint instead later, in Settings.": "Un code PIN pour ouvrir MyHome Browser, et un autre pour activer le défilement — les deux sont obligatoires, afin que la friction dont dépend cette application ne se réduise pas silencieusement à quelque chose de facile à deviner. Vous pourrez passer à Face ID / Empreinte digitale plus tard, dans les paramètres.",
    "Select a question": "Sélectionner une question",
    "Choose a security question and answer it, so you can reset your PIN if you forget it": "Choisissez une question de sécurité et répondez-y, afin de pouvoir réinitialiser votre code PIN si vous l'oubliez.",
    "Search results": "Résultats de recherche",
    "Close search results": "Fermer les résultats de recherche",
    "Searching…": "Recherche en cours…",
    "Search failed: {message}": "Échec de la recherche : {message}",
    "No results found.": "Aucun résultat trouvé.",
    "Search results for \"{query}\"": "Résultats de recherche pour « {query} »",
    "Typed search terms show Wikipedia results as a list inside the app — no setup needed, but only Wikipedia articles, not the wider web. Typing the address of a big site that refuses to be shown inside another page (Google, Instagram, Facebook, X, TikTok, YouTube, DuckDuckGo) opens it in your regular browser instead — that's the site's own policy, not something this app can change.": "Les termes de recherche saisis affichent les résultats Wikipédia sous forme de liste dans l'application — aucune configuration n'est nécessaire, mais seuls les articles Wikipédia sont recherchés, pas le web dans son ensemble. Saisir l'adresse d'un grand site qui refuse d'être affiché dans une autre page (Google, Instagram, Facebook, X, TikTok, YouTube, DuckDuckGo) l'ouvre plutôt dans votre navigateur habituel — c'est la politique du site lui-même, pas quelque chose que cette application peut changer.",
    "Ad blocking only stops known ad domains, not ads on a page you already opened.": "Le blocage des publicités n'arrête que les domaines publicitaires connus, pas les publicités d'une page déjà ouverte.",
    "Save with your own note": "Enregistrer avec ma propre note",
    "Your own note": "Votre propre note",
    "Search shows Wikipedia results here. An address opens as a tab.": "La recherche affiche des résultats Wikipédia ici. Une adresse s'ouvre comme onglet.",
    "Tap the star on a tab, or on a search result, to save it.": "Touchez l'étoile d'un onglet ou d'un résultat pour l'enregistrer.",
    "The pencil on a search result lets you write your own note.": "Le crayon d'un résultat permet d'écrire votre propre note.",
    "Scroll is OFF": "Le défilement est désactivé",
    "These apps open in your normal browser, where this app can't keep scroll locked — so while scroll is OFF they stay closed.": "Ces applis s'ouvrent dans votre navigateur habituel, où cette appli ne peut pas bloquer le défilement — elles restent donc fermées tant que le défilement est désactivé.",
    "Not now": "Pas maintenant",
    "Install to your home screen": "Installer sur votre écran d'accueil",
    "Install": "Installer",
    "Installed to your home screen": "Installé sur votre écran d'accueil",
    "Apps that need scroll ON": "Applis qui exigent le défilement activé",
    "Don't let the apps below open while scroll is OFF": "Ne pas ouvrir les applis ci-dessous tant que le défilement est désactivé",
    "{app} opens in a separate browser tab, so you'll leave MyHome Browser and have to find your way back. Installing this app to your home screen usually improves that — see Settings.": "{app} s'ouvre dans un onglet séparé du navigateur, vous quitterez donc MyHome Browser et devrez retrouver votre chemin. Installer cette appli sur votre écran d'accueil améliore généralement cela — voir les Réglages.",
    "Installed. Other apps still open outside this app, but most phones now show them as a layer you can close to come straight back rather than switching you away. Either way your tabs, dictionary and scroll state are kept. Other apps' Share button can now send links, text and files straight into your Waiting room, too.": "Installé. Les autres applis s'ouvrent toujours en dehors de cette appli, mais la plupart des téléphones les affichent désormais comme une couche que vous pouvez fermer pour revenir directement, au lieu de basculer ailleurs. Dans tous les cas, vos onglets, le dictionnaire et l'état du défilement sont conservés. Le bouton Partager des autres applis peut désormais aussi envoyer des liens, du texte et des fichiers directement dans votre salle d'attente.",
    "Right now other apps open in a separate browser tab, so you leave this app and have to find your way back. Installing it to your home screen usually makes them open as a closable layer instead — the exact behaviour is your phone's choice, not this app's.": "Pour l'instant les autres applis s'ouvrent dans un onglet séparé du navigateur, vous quittez donc cette appli et devez retrouver votre chemin. L'installer sur votre écran d'accueil les fait généralement s'ouvrir comme une couche que l'on peut fermer — le comportement exact dépend de votre téléphone, pas de cette appli.",
    "Right now other apps open in a separate browser tab, so you leave this app. In Safari, tap the Share button and choose \"Add to Home Screen\" — that usually helps, though iOS sometimes still switches you over to Safari.": "Pour l'instant les autres applis s'ouvrent dans un onglet séparé du navigateur, vous quittez donc cette appli. Dans Safari, touchez le bouton Partager et choisissez « Sur l'écran d'accueil » — cela aide généralement, même si iOS vous bascule parfois quand même vers Safari.",
    "Open this page in Chrome or Edge and use \"Install app\" (or \"Add to Home Screen\") from the browser menu. Once installed, other apps usually open as a layer you can close to come straight back, instead of taking you away.": "Ouvrez cette page dans Chrome ou Edge et utilisez « Installer l'application » (ou « Ajouter à l'écran d'accueil ») dans le menu du navigateur. Une fois installée, les autres applis s'ouvrent généralement comme une couche que vous pouvez fermer pour revenir directement, au lieu de vous emmener ailleurs.",
    "How other apps open": "Comment les autres applis s'ouvrent",
    "Open other apps in this same window": "Ouvrir les autres applis dans cette même fenêtre",
    "On means the app loads in this window instead of a new tab, so your phone never switches away from MyHome Browser — press back to return here. Off opens a new tab, which on some phones hands you over to a separate browser. Try both and keep whichever returns more cleanly on your device.": "Activé, l'appli se charge dans cette fenêtre plutôt que dans un nouvel onglet : votre téléphone ne quitte donc jamais MyHome Browser — appuyez sur retour pour revenir ici. Désactivé, un nouvel onglet s'ouvre, ce qui sur certains téléphones vous confie à un navigateur séparé. Essayez les deux et gardez celui qui revient le plus proprement sur votre appareil.",
    "{app} loads in this window, so your phone never switches away from MyHome Browser. Press back to return — everything here will be as you left it.": "{app} se charge dans cette fenêtre, votre téléphone ne quitte donc pas MyHome Browser. Appuyez sur retour pour revenir — tout sera comme vous l'avez laissé.",
    "Notifications": "Notifications",
    "Allow notifications": "Autoriser les notifications",
    "This browser can't show notifications.": "Ce navigateur ne peut pas afficher de notifications.",
    "Notifications are allowed. They can only reach you while this app is still running in the background — once it's fully closed, nothing can wake it.": "Notifications autorisées. Elles ne vous parviennent que tant que cette appli tourne encore en arrière-plan — une fois complètement fermée, rien ne peut la réveiller.",
    "Notifications are blocked. Allow them for this app in your browser or phone settings, then come back.": "Notifications bloquées. Autorisez-les pour cette appli dans les réglages du navigateur ou du téléphone, puis revenez.",
    "Let this app notify you when scroll time runs out, a timer ends, or you pass your daily limit.": "Laissez cette appli vous prévenir quand le temps de défilement s'achève, qu'un minuteur se termine ou que vous dépassez votre limite quotidienne.",
    "Notifications are on": "Notifications activées",
    "This is what they'll look like.": "Voilà à quoi elles ressemblent.",
    "A minute before scroll time runs out": "Une minute avant la fin du temps de défilement",
    "When scroll switches back OFF": "Quand le défilement se désactive",
    "When the timer finishes": "Quand le minuteur se termine",
    "Posture reminders": "Rappels de posture",
    "When you pass your daily limit": "Quand vous dépassez votre limite quotidienne",
    "Scroll time is nearly up": "Le temps de défilement touche à sa fin",
    "About a minute left before scroll switches back OFF.": "Il reste environ une minute avant que le défilement se désactive.",
    "You've passed your daily limit": "Vous avez dépassé votre limite quotidienne",
    "Today is over your {minutes} min goal.": "Aujourd'hui dépasse votre objectif de {minutes} min.",
    "Playing here, without the feed": "Lecture ici, sans le fil",
    "Showing this post here, without the feed": "Ce post s'affiche ici, sans le fil",
    "Close the app I opened when scroll time runs out": "Fermer l'appli ouverte quand le temps de défilement est écoulé",
    "This is the only way the time limit reaches inside the other app: this app keeps hold of the tab it opened and shuts it when your time is up. It needs the setting above to be OFF, since there is no separate tab to close otherwise. The cost is that the site you open can see it was opened by this app and could push this page elsewhere — unlikely with the big sites, but not impossible, so turn this off if you would rather not.": "C'est le seul moyen pour que la limite de temps atteigne l'autre appli : cette appli garde l'onglet qu'elle a ouvert et le ferme quand votre temps est écoulé. Cela exige que le réglage ci-dessus soit désactivé, sinon il n'y a pas d'onglet séparé à fermer. En contrepartie, le site ouvert voit qu'il a été ouvert par cette appli et pourrait envoyer cette page ailleurs — peu probable avec les grands sites, mais pas impossible ; désactivez si vous préférez.",
    "Time's up — scroll is back OFF and the app you opened was closed": "Temps écoulé — le défilement est désactivé et l'appli ouverte a été fermée",
    "Waiting room": "Salle d'attente",
    "Shelf": "Étagère",
    "Take a breath": "Souffler un instant",
    "This device can't keep records (private browsing, perhaps).": "Cet appareil ne peut rien enregistrer (navigation privée, peut-être).",
    "day streak": "jours d'affilée",
    "pauses today": "pauses aujourd'hui",
    "minutes held": "minutes gardées",
    "Hold a file from this device": "Garder un fichier de cet appareil",
    "Held on this device: {used} of about {quota}": "Gardé sur cet appareil : {used} sur environ {quota}",
    "Put it on the shelf": "Ranger sur l'étagère",
    "Shelved under {wall}": "Rangé dans {wall}",
    "The shelf is full. Take something off it first.": "L'étagère est pleine. Retirez-en quelque chose d'abord.",
    "Couldn't put it on the shelf": "Impossible de le ranger",
    "This device is out of room for held files": "Cet appareil n'a plus de place pour les fichiers gardés",
    "Couldn't hold that file": "Impossible de garder ce fichier",
    "That file is no longer on this device": "Ce fichier n'est plus sur l'appareil",
    "Taken off the shelf": "Retiré de l'étagère",
    "No address": "(pas d'adresse)",
    "Something to look at": "Quelque chose à regarder",
    "Received 1 item from another app": "1 élément reçu d'une autre application",
    "Received {n} items from another app": "{n} éléments reçus d'une autre application",
    "Notice what just happened": "Remarquez ce qui vient de se passer",
    "Scroll is OFF right now. Try swiping this page — it won't move. That small inconvenience is the whole point: it buys you a moment to choose, instead of scrolling out of habit.": "Le défilement est désactivé en ce moment. Essayez de faire glisser cette page — elle ne bougera pas. Ce petit désagrément est tout l'intérêt : il vous laisse un instant pour choisir, au lieu de défiler par habitude.",
    "Got it — let me try": "Compris — laissez-moi essayer",
    "You said you wanted to get to \"{goal}\". When you're ready for it, tap \"Scroll OFF\" up top to turn scroll ON with a time limit — on your own terms.": "Vous avez dit vouloir arriver à « {goal} ». Quand vous serez prêt, touchez « Scroll OFF » en haut pour activer le défilement avec une limite de temps — selon vos propres termes.",
    "When you actually want something, tap \"Scroll OFF\" up top to turn scroll ON with a time limit — on your own terms.": "Quand vous voulez vraiment quelque chose, touchez « Scroll OFF » en haut pour activer le défilement avec une limite de temps — selon vos propres termes.",
    "Step 1 of 5": "Étape 1 sur 5",
    "Step 2 of 5": "Étape 2 sur 5",
    "Step 3 of 5": "Étape 3 sur 5",
    "Step 4 of 5": "Étape 4 sur 5",
    "Step 5 of 5": "Étape 5 sur 5",
    "What do you want your time back for?": "Pour quoi voulez-vous récupérer votre temps ?",
    "Not \"less phone\" — more of something else. Name one or two things you'd rather be spending it on. This app will remind you of them, not just stop you.": "Pas « moins de téléphone » — plutôt plus d'autre chose. Nommez une ou deux choses que vous préféreriez faire de ce temps. Cette appli vous les rappellera, au lieu de simplement vous arrêter.",
    "Skip for now": "Passer pour l'instant",
    "Choose a time limit. When time is up, scroll switches back OFF and the app you opened from here is closed.": "Choisissez une limite de temps. À la fin, le défilement se désactive et l'appli ouverte d'ici est fermée.",
    "Choose a time limit. Scroll will switch back OFF automatically when time is up.": "Choisissez une limite de temps. Le défilement se désactivera automatiquement à la fin du temps.",
    "None of this is about guilt. It's why a time limit and a PIN can do more than willpower alone.": "Rien de tout cela n'a pour but de vous culpabiliser. C'est pour ça qu'une limite de temps et un code PIN peuvent faire plus que la seule volonté.",
    "These apps refuse to open inside this app, so they run in your normal browser where this app can't hold the scroll lock. Ticked apps only open once you've turned scroll ON with a time limit. Feed apps are ticked to start with — tick any others that eat your time.": "Ces applis refusent de s'ouvrir dans cette appli ; elles s'ouvrent donc dans votre navigateur habituel, où cette appli ne peut pas bloquer le défilement. Les applis cochées ne s'ouvrent qu'une fois le défilement activé avec une limite de temps. Les applis à fil sont cochées au départ — cochez toutes celles qui vous prennent du temps.",
    "Turn scroll ON with a time limit, and {app} will open.": "Activez le défilement avec une limite de temps, et {app} s'ouvrira.",
    "Limits": "Limites",
    "{time} left": "{time} restant",
    "Add a shelf": "Ajouter une étagère",
    "One video or one post can show inside. A whole feed can't.": "Une vidéo ou un post s'affiche ici. Un fil entier, non.",
    "While scroll is OFF, the apps you ticked in Settings won't open.": "Défilement désactivé : les applis cochées ne s'ouvrent pas.",
    "When time runs out, scroll goes OFF and opened tabs close.": "Temps écoulé : le défilement s'arrête et les onglets se ferment.",
    "Held items wait before they open — longest for gated apps.": "Ce qui est mis en attente patiente ; le plus long pour les applis filtrées.",
    "Open it after a while away and it asks what you came for.": "Ouvert après une pause, il demande pourquoi vous venez.",
    "Breaks offer what you set out to do, your shelf, or a saved word.": "Les pauses proposent votre projet, votre étagère ou un mot enregistré.",
    "Loosening a limit waits 24 hours. Tightening is immediate.": "Assouplir une limite attend 24 h. Durcir est immédiat.",
    "Add to your home screen to receive from other apps' Share.": "Ajoutez-le à l'écran d'accueil pour recevoir via Partager.",
    "Priority and Done decide what a break offers you next.": "La priorité et Terminé décident de ce que la prochaine pause proposera.",
    "Anything you feel like looking at, this holds for a moment first.": "Ce que vous avez envie de regarder patiente ici un instant.",
    "Interrupt me and offer something better to be doing": "M'interrompre et proposer mieux à faire",
    "Order of the shelf items it reaches for": "Ordre des éléments de l'étagère",
    "The more of when, where and how long you fill in, the easier these are to actually start — and a break landing in that window reaches for them first.": "Plus vous précisez quand, où et combien de temps, plus il est facile de s'y mettre — et une pause dans ce créneau les proposera en premier.",
    "e.g. Practise guitar": "ex. Jouer de la guitare",
    "Time of day": "Moment de la journée",
    "Days": "Jours",
    "Where (optional)": "Où (facultatif)",
    "Any day": "N'importe quel jour",
    "Weekdays": "En semaine",
    "Weekends": "Le week-end",
    "{count} from your shelf": "{count} de votre étagère",
    "{count} you set out to do": "{count} que vous vous étiez fixé",
    "This week: {count}": "Cette semaine : {count}",
    "{weeks} weeks ago: {count}": "Il y a {weeks} semaines : {count}",
    "Morning": "Matin",
    "Afternoon": "Après-midi",
    "Evening": "Soir",
    "Late night": "Tard le soir",
    "Any time": "N'importe quand",
    "done {count}x": "fait {count} fois",
    "{idle} of your last {total} opens had nothing particular behind them.": "{idle} de vos {total} dernières ouvertures n'avaient aucune raison particulière.",
    "You finished {count} things these last two weeks.": "Vous avez terminé {count} choses ces deux dernières semaines.",
    "You opened this without anything particular in mind.": "Vous avez ouvert ceci sans rien de particulier en tête.",
    "Since you last looked": "Depuis la dernière fois",
    "Good": "Bien",
    "What did you come here for?": "Vous venez pour quoi ?",
    "No wrong answer — this is just so the reason is yours and not the phone's.": "Pas de mauvaise réponse — c'est juste pour que la raison soit la vôtre et non celle du téléphone.",
    "To look something up": "Pour chercher quelque chose",
    "To get to something I set aside": "Pour reprendre ce que j'avais mis de côté",
    "No particular reason": "Aucune raison particulière",
    "When you open the app": "À l'ouverture de l'appli",
    "Ask what I came here for": "Me demander pourquoi je viens",
    "Asked at most once every few minutes, never mid-task. Every answer is one tap. Answering \"no particular reason\" brings up something you said you wanted to do instead.": "Demandé au plus toutes les quelques minutes, jamais en pleine tâche. Chaque réponse tient en un geste. Répondre « aucune raison particulière » fait remonter quelque chose que vous vouliez faire.",
    "Stop asking what you came for": "Ne plus demander pourquoi vous venez",
    "You said {promised}. It was {actual} — {over} of your last {total} went over.": "Vous aviez dit {promised}. Ce fut {actual} — {over} de vos {total} dernières fois ont dépassé.",
    "You went past your own limit on {over} of the last {total} times you left, by {avg} on average.": "Vous avez dépassé votre propre limite {over} fois sur les {total} dernières sorties, de {avg} en moyenne.",
    "You came back within your own limit all {total} of the last times you left.": "Vous êtes revenu dans votre propre limite les {total} dernières fois.",
    "If {trigger}, then {action}": "Si {trigger}, alors {action}",
    "Saved. It takes effect in {wait} — you can cancel until then.": "Enregistré. Effectif dans {wait} — vous pouvez annuler jusque-là.",
    "{change} — in {wait}": "{change} — dans {wait}",
    "Cancel this change": "Annuler ce changement",
    "Change cancelled": "Changement annulé",
    "{text} · done {count}x": "{text} · fait {count} fois",
    "Remove this rule": "Supprimer cette règle",
    "How about this now?": "Et si vous faisiez ça maintenant ?",
    "Away from the screen": "Loin de l'écran",
    "Did it": "Fait",
    "There's something you said you wanted to do.": "Il y a quelque chose que vous vouliez faire.",
    "Nice.": "Bien.",
    "finished": "terminés",
    "You decided": "Vous aviez décidé",
    "Turn scroll ON anyway": "Activer quand même le défilement",
    "Set out what you want to get to, in Settings — then this offers those instead of just something to read.": "Notez dans les Réglages ce que vous voulez faire : ce sera proposé plutôt qu'une simple lecture.",
    "What you want to get to": "Ce que vous voulez faire",
    "Your shelf only holds things you put off looking at. List what you actually want to spend the time on, and breaks will offer these first.": "Votre étagère ne contient que ce que vous avez remis à plus tard. Notez ce à quoi vous voulez vraiment consacrer du temps : les pauses le proposeront en premier.",
    "Nothing here yet — breaks will fall back to your shelf, a saved word, and small away-from-screen nudges.": "Rien pour l'instant — les pauses se rabattront sur votre étagère, un mot enregistré et de petits gestes loin de l'écran.",
    "If this, then that": "Si ceci, alors cela",
    "Decide now, while it's easy, what you'll do in the moment it isn't. These are read back to you when an app is held closed.": "Décidez maintenant, tant que c'est facile, ce que vous ferez quand ça ne le sera pas. Ces règles vous sont relues quand une appli reste fermée.",
    "No rules yet.": "Aucune règle pour l'instant.",
    "If… (e.g. it's past 11pm)": "Si… (ex. il est plus de 23h)",
    "then… (e.g. I'll read one shelved thing)": "alors… (ex. je lis une chose de l'étagère)",
    "Cooling-off period": "Délai de réflexion",
    "Make loosening these settings wait 24 hours": "Faire attendre 24 heures tout assouplissement de ces réglages",
    "The version of you that sets these limits and the version that wants past them are not in the room at the same time. Tightening anything still takes effect at once; only loosening waits, and you can cancel it the whole time.": "La personne qui fixe ces limites et celle qui veut les franchir ne sont jamais là en même temps. Durcir prend effet immédiatement ; seul l'assouplissement attend, et vous pouvez l'annuler à tout moment.",
    "Waiting to take effect:": "En attente d'effet :",
    "Turn forced breaks off": "Désactiver les pauses imposées",
    "Make breaks less frequent": "Espacer les pauses",
    "Raise the scroll count before a break": "Augmenter le nombre de défilements avant une pause",
    "Turn the cooling-off period off": "Désactiver le délai de réflexion",
    "Stop requiring scroll ON for those apps": "Ne plus exiger le défilement activé pour ces applis",
    "Remove apps from the scroll gate": "Retirer des applis du filtre de défilement",
    "Added shelf {name}": "Étagère {name} ajoutée",
    "File": "Fichier",
    "Later": "Plus tard",
    "Shelf space": "Place sur l'étagère",
    "— empty shelf —": "— rayon vide —",
    "Nothing on the shelf yet. Things you keep from the waiting room end up here.": "Rien sur l'étagère. Ce que vous gardez depuis la salle d'attente arrive ici.",
    "Shelf wall": "Pan d'étagère",
    "Previous wall": "Pan précédent",
    "Next wall": "Pan suivant",
    "{kind} · {size}": "{kind} · {size}",
    "Drink a glass of water, slowly.": "Buvez un verre d'eau, lentement.",
    "Look at the furthest thing out of the window.": "Regardez la chose la plus lointaine par la fenêtre.",
    "Lift your shoulders, then let them drop. Three times.": "Montez les épaules, puis laissez-les tomber. Trois fois.",
    "Put three things on your desk back where they belong.": "Remettez trois objets du bureau à leur place.",
    "Close your eyes and count three sounds you can hear.": "Fermez les yeux et comptez trois sons.",
    "Stand up and walk once around the room.": "Levez-vous et faites un tour de la pièce.",
    "Wash your hands. Notice the temperature of the water.": "Lavez-vous les mains. Sentez la température de l'eau.",
    "Straighten your back and look up at the ceiling.": "Redressez le dos et regardez le plafond.",
    "Open a window or a curtain and let the air change.": "Ouvrez une fenêtre ou un rideau, changez l'air.",
    "Remember one good thing about today.": "Souvenez-vous d'une bonne chose d'aujourd'hui.",
    "Feel where your feet are touching the floor.": "Sentez vos pieds en contact avec le sol.",
    "Leave one line of a note for tomorrow's you.": "Laissez une ligne au vous de demain.",
    "Look into the distance and let your eyes go soft.": "Regardez au loin et relâchez les yeux.",
    "Breathe in deeply, breathe out slowly. That's enough.": "Inspirez profondément, expirez lentement. Cela suffit.",
    "{used} / {total}": "{used} / {total}",
    "Close": "Fermer",
    "Search the shelf…": "Chercher dans l'étagère…",
    "Nothing on the shelf matched.": "Rien ne correspond dans l'étagère.",
    "Priority": "Priorité",
    "High": "Haute",
    "Low": "Basse",
    "Order on this shelf": "Ordre sur ce rayon",
    "Move earlier": "Monter",
    "Move later": "Descendre",
    "Done": "Terminé",
    "Not done after all": "Finalement pas terminé",
    "Marked as done": "Marqué comme terminé",
    "Put back as unfinished": "Remis en non terminé",
    "Done ({count})": "Terminés ({count})",
    "Break reminders": "Rappels de pause",
    "This doesn't wait for you to remember. Whatever screen you're on, once you pass the limits below, a quiet banner appears (a short vibration, no sound) offering what you set out to do, something from your shelf, or a saved word — it doesn't block what you're doing.": "Cela n'attend pas que vous y pensiez. Quel que soit l'écran, dès que vous dépassez les limites ci-dessous, une bannière discrète apparaît (une brève vibration, sans son) et propose ce que vous vouliez faire, quelque chose de votre étagère, ou un mot enregistré — sans bloquer ce que vous faites.",
    "Every (minutes)": "Toutes les (minutes)",
    "Or after this many scrolls (0 = off)": "Ou après ce nombre de défilements (0 = désactivé)",
    "Highest priority first": "Priorité la plus haute d'abord",
    "The order I arranged": "L'ordre que j'ai choisi",
    "Time for a break": "C'est l'heure d'une pause",
    "From your shelf": "De votre étagère",
    "You've been at this for {minutes} minutes.": "Vous y êtes depuis {minutes} minutes.",
    "You've scrolled {count} times since your last break.": "Vous avez fait défiler {count} fois depuis la dernière pause.",
    "There's nothing unfinished on your shelf yet. Put something there and this will offer it next time.": "Rien de non terminé sur l'étagère. Rangez-y quelque chose et ce sera proposé la prochaine fois.",
    "Mark done": "Marquer terminé",
    "Open this": "Ouvrir ceci",
    "Pick one of your own shelves to share.": "Choisissez l'une de vos propres étagères à partager.",
    "This shelf has nothing with a link on it yet.": "Cette étagère ne contient encore rien avec un lien.",
    "My shelf: {name}": "Mon étagère : {name}",
    "Link copied. Send it to someone.": "Lien copié. Envoyez-le à quelqu'un.",
    "Couldn't share this shelf": "Impossible de partager cette étagère",
    "Someone shared a shelf with you — {count} things on it.": "Quelqu'un a partagé une étagère avec vous — {count} choses dessus.",
    "Added {count} things to a new shelf": "{count} choses ajoutées à une nouvelle étagère",
    "Name this shelf": "Nommez cette étagère",
    "You finished {count} things these last two weeks — about {minutes} of your own choosing.": "Vous avez terminé {count} choses ces deux dernières semaines — environ {minutes} de votre choix.",
    "A word from your dictionary": "Un mot de votre dictionnaire",
    "Nice to know": "Bon à savoir",
    "Rename": "Renommer",
    "Share this shelf": "Partager cette étagère",
    "How long it takes (minutes)": "Combien de temps ça prend (minutes)",
    "A shelf from someone": "Une étagère venant de quelqu'un",
    "Taking it adds a new shelf of your own. Nothing you already have is touched.": "L'accepter ajoute une nouvelle étagère à vous. Rien de ce que vous avez déjà n'est modifié.",
    "No thanks": "Non merci",
    "Add to my shelves": "Ajouter à mes étagères",
    "e.g. 12": "ex. 12",
    "Break's over. Nice.": "Pause terminée. Bien joué.",
    "{app} stays closed until your break ends.": "{app} reste fermé jusqu'à la fin de votre pause.",
    "You're on a break": "Vous êtes en pause",
    "Back to the break": "Retour à la pause",
    "End the break early": "Terminer la pause plus tôt",
    "Break length": "Durée de la pause",
    "Notify me even when this app is fully closed": "Me prévenir même quand l'appli est complètement fermée",
    "This uses a small external server (not run by you) that holds only the alert times and text above — nothing about what you look at, your dictionary, or your shelf. It can't schedule a daily-limit alert this way, since that depends on watching today's usage as it happens; that one still only fires while this app is open.": "Cela utilise un petit serveur externe (que vous ne gérez pas) qui ne conserve que les horaires et le texte des alertes ci-dessus — rien sur ce que vous regardez, votre dictionnaire ou votre étagère. Il ne peut pas programmer ainsi l'alerte de limite quotidienne, car elle dépend de l'observation de l'usage du jour en temps réel ; celle-ci ne fonctionne donc encore que quand l'appli est ouverte.",
    "Couldn't turn this on right now": "Impossible d'activer ceci pour le moment",
    "Notifications on — tap to turn off": "Notifications activées — touchez pour désactiver",
    "Notifications off — tap to turn on": "Notifications désactivées — touchez pour activer",
    "Share anonymous usage events": "Partager des événements d'utilisation anonymes",
    "Send anonymous usage events to this app's operator": "Envoyer des événements d'utilisation anonymes à l'opérateur de cette appli",
    "Separate from notifications, and off by default. When on, this device sends named moments only — things like \"scroll turned on\", \"a shelf item was marked done\", or \"a dock app was opened\" — tagged with a random device id, never your name or account. It never includes what you searched, dictionary words, shelf titles, or URLs. The full list of what's sent lives in push-server/README.md. Turning this off stops it immediately.": "Séparé des notifications, et désactivé par défaut. Une fois activé, cet appareil envoie uniquement des moments nommés — comme « défilement activé », « un élément de l'étagère a été marqué comme terminé » ou « une appli du dock a été ouverte » — associés à un identifiant d'appareil aléatoire, jamais votre nom ou compte. Cela n'inclut jamais ce que vous avez recherché, les mots du dictionnaire, les titres de l'étagère ou les URL. La liste complète de ce qui est envoyé se trouve dans push-server/README.md. Désactiver ceci l'arrête immédiatement.",
    "Time's up — scroll switched back OFF. You kept your word.": "Temps écoulé — le défilement a été désactivé. Vous avez tenu parole.",
    "Time's up — scroll is back OFF and the app you opened was closed. You kept your word.": "Temps écoulé — le défilement est désactivé et l'appli ouverte a été fermée. Vous avez tenu parole.",
    "Things you want to get to": "Ce que vous voulez faire",
    "Nothing here yet — add something and breaks will offer it first.": "Rien ici pour l'instant — ajoutez quelque chose et les pauses le proposeront en premier.",
    "+ Add something": "+ Ajouter quelque chose",
    "Keep at it until (optional)": "Continuer jusqu'au (facultatif)",
    "+ Add a book": "+ Ajouter un livre",
    "Link (optional)": "Lien (facultatif)",
    "{days} days left": "Encore {days} jours",
    "1 day left": "Encore 1 jour",
    "Last day": "Dernier jour",
    "Past your date": "Date dépassée",
    "Added to shelf {wall}": "Ajouté à l'étagère {wall}",
    "Anonymous usage events": "Événements d'usage anonymes",
    "This app's server is set up, so this device automatically sends named moments only — things like \"scroll turned on\", \"a shelf item was marked done\", or \"a dock app was opened\" — tagged with a random device id, never your name or account. It never includes what you searched, dictionary words, shelf titles, or URLs. There's no separate switch for this: as long as the server is configured, it's sent. The full list of what's sent lives in push-server/README.md.": "Le serveur de cette appli est configuré, donc cet appareil envoie automatiquement uniquement des moments nommés — comme « défilement activé », « un élément de l'étagère marqué comme terminé » ou « une appli du dock a été ouverte » — associés à un identifiant d'appareil aléatoire, jamais votre nom ou votre compte. Cela n'inclut jamais ce que vous avez recherché, les mots du dictionnaire, les titres de l'étagère ou les URL. Il n'y a pas d'interrupteur séparé pour cela : tant que le serveur est configuré, c'est envoyé. La liste complète de ce qui est envoyé se trouve dans push-server/README.md.",
    "Days (optional)": "Jours (facultatif)",
    "The more of when, which days and how long you fill in, the easier these are to actually start — and a break landing in that window reaches for them first.": "Plus vous précisez quand, quels jours et combien de temps, plus il est facile de vraiment commencer — et une pause qui tombe dans ce créneau s'y réfère en premier.",
    "Goals": "Objectifs",
    "Not recorded": "Non enregistré",
    "Not at all": "Pas du tout",
    "Barely": "À peine",
    "Minimum done": "Minimum fait",
    "Pretty good": "Plutôt bien",
    "Nailed it!": "Parfaitement réussi !",
    "Note": "Note",
    "Add something you want to work on, and it'll show up here to track.": "Ajoutez quelque chose que vous voulez faire, et ça apparaîtra ici pour le suivre.",
    "Date": "Date",
    "No records this month": "Aucun enregistrement ce mois-ci",
    "Diary saved": "Journal enregistré",
    "Active Days": "Jours actifs",
    "last {days}d": "derniers {days}j",
    "Avg Score": "Score moyen",
    "out of 5.0": "sur 5,0",
    "Top Category": "Catégorie principale",
    "avg": "moy.",
    "no data": "aucune donnée",
    "Activity Heatmap": "Carte d'activité",
    "Category Balance": "Équilibre des catégories",
    "Progress Trend": "Tendance de progression",
    "Best Day of Week": "Meilleur jour de la semaine",
    "Streaks & Completion": "Séries et réussite",
    "Level Distribution": "Répartition des niveaux",
    "Need 2+ categories": "Il faut 2 catégories ou plus",
    "Streak": "Série",
    "Best": "Meilleure",
    "Days done": "Jours réussis",
    "Rate": "Taux",
    "History": "Historique",
    "Diary": "Journal",
    "Stats": "Statistiques",
    "7 Days": "7 jours",
    "30 Days": "30 jours",
    "90 Days": "90 jours",
    "Previous day": "Jour précédent",
    "Next day": "Jour suivant",
    "Close note": "Fermer la note",
    "What happened today? Thoughts, feelings, reflections…": "Que s'est-il passé aujourd'hui ? Pensées, sentiments, réflexions…",
    "Add a note for this day…": "Ajouter une note pour ce jour…",
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
    "Add your own site": "나만의 사이트 추가",
    "Name": "이름",
    "Website address": "웹사이트 주소",
    "Order": "순서",
    "Use the arrows to change the order apps appear in on your home screen.": "화살표를 사용해 홈 화면에서 앱이 표시되는 순서를 바꾸세요.",
    "Remove {app}": "{app} 삭제",
    "Check some apps above to arrange their order.": "위에서 앱을 선택하면 순서를 정할 수 있어요.",
    "Move {app} earlier": "{app} 앞으로 이동",
    "Move {app} later": "{app} 뒤로 이동",
    "Enter a name and a website address": "이름과 웹사이트 주소를 입력하세요",
    "Enter a valid website address": "올바른 웹사이트 주소를 입력하세요",
    "Added {app}": "{app} 추가됨",
    "The list of apps installed on your phone can't be read automatically from a web page, so pick from the candidates below instead.": "웹 페이지에서는 휴대폰에 설치된 앱 목록을 자동으로 읽을 수 없으므로, 아래 후보에서 선택해 주세요.",
    "Add up to 10 apps from \"Edit Apps\"": "‘앱 편집’에서 최대 10개까지 추가할 수 있습니다",
    "Open this app?": "이 앱을 열까요?",
    "Open": "열기",
    "Cancel": "취소",
    "Turn scroll ON": "스크롤 켜기",
    "Time limit": "제한 시간",
    "4-digit PIN": "4자리 PIN",
    "Turn ON": "켜기",
    "Unlock with Face ID / Fingerprint": "Face ID / 지문으로 잠금 해제",
    "Choose your language": "언어를 선택하세요",
    "App Lock PIN (opens the app)": "앱 잠금 PIN (앱 열기용)",
    "Scroll PIN (turns scroll ON)": "스크롤 PIN (스크롤 켜기용)",
    "Security question": "보안 질문",
    "What was your first pet's name?": "처음 키운 반려동물의 이름은?",
    "What is your mother's maiden name?": "어머니의 결혼 전 성은?",
    "What was the name of your first school?": "처음 다닌 학교의 이름은?",
    "What city were you born in?": "태어난 도시는?",
    "What was your childhood nickname?": "어릴 때 별명은?",
    "What is your favorite food?": "가장 좋아하는 음식은?",
    "Answer": "답",
    "Save & Continue": "저장하고 계속",
    "Which social media do you use?": "어떤 SNS를 사용하나요?",
    "Choose the ones you want quick access to from your dock.": "독에서 바로 열고 싶은 앱을 선택하세요.",
    "Finish setup": "설정 완료",
    "Settings": "설정",
    "Close settings": "설정 닫기",
    "Open settings": "설정 열기",
    "How to use this app": "사용 방법",
    "Set a timer": "타이머 설정",
    "Look & Feel": "화면",
    "PINs & Unlock": "PIN 및 잠금 해제",
    "Appearance": "화면",
    "Green": "초록",
    "Blue": "파랑",
    "Accent color": "강조 색",
    "Background color": "배경색",
    "Choose background image": "배경 이미지 선택",
    "Remove image": "이미지 삭제",
    "Reset colors": "색 초기화",
    "Purple": "보라색",
    "Orange": "주황색",
    "Pink": "분홍색",
    "Dark": "다크",
    "Home Screen Icons": "홈 화면 아이콘",
    "Icon size": "아이콘 크기",
    "Small": "작게",
    "Medium": "보통",
    "Large": "크게",
    "Icon shape": "아이콘 모양",
    "Rounded square": "둥근 사각형",
    "Circle": "원형",
    "Show app names under icons": "아이콘 아래에 앱 이름 표시",
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
    "{time} left — the app will lock when this reaches 0:00.": "{time} 남음 — 0:00이 되면 앱이 잠깁니다.",
    "{time} left. This is just a timer; nothing else happens at 0:00.": "{time} 남음. 단순한 타이머이며 0:00이 되어도 다른 일은 일어나지 않습니다.",
    "{minutes} min": "{minutes}분",
    "Remove \"{name}\"": "'{name}' 삭제",
    "{label} ({minutes} min)": "{label}({minutes}분)",
    "{label} · {index} of {total}": "{label} · {index} / {total}",
    "Timer started — app locks in {label}": "타이머 시작 — {label} 후 앱이 잠깁니다",
    "Timer started for {label}": "{label} 타이머를 시작했습니다",
    "Open {app}?": "{app}을(를) 열까요?",
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
    "Blocked: this looks like an ad or tracking domain": "차단됨: 광고 또는 추적 도메인으로 보입니다",
    "Close tab \"{title}\"": "탭 \"{title}\" 닫기",
    "Insights": "사용 통계",
    "Search or enter a website above to start browsing.": "위에서 검색하거나 웹사이트 주소를 입력해 탐색을 시작하세요.",
    "Open insights": "사용 통계 열기",
    "Search or go to address": "검색 또는 주소로 이동",
    "Search or enter address": "검색어 또는 주소 입력",
    "Basic search": "간단 검색",
    "Open in browser": "브라우저에서 열기",
    "Close insights": "사용 통계 닫기",
    "Browsing": "브라우징",
    "Still finding what you needed? You've been browsing for {minutes} minutes.": "찾던 걸 찾으셨나요? {minutes}분째 둘러보고 계세요.",
    "Check in with me every 10 minutes while I'm browsing a tab": "탭을 둘러보는 동안 10분마다 알려주기",
    "Still browsing": "계속 둘러보는 중",
    "Keep browsing": "계속 둘러보기",
    "{domain} doesn't allow embedding, so it opened in your browser instead.": "{domain}은(는) 다른 페이지 안에 표시하는 것을 허용하지 않아 브라우저에서 열었습니다.",
    "Saved": "저장되었습니다",
    "Edit": "편집",
    "Remove": "제거",
    "Title": "제목",
    "Dictionary": "사전",
    "Open dictionary": "사전 열기",
    "Close dictionary": "사전 닫기",
    "Your Dictionary": "나의 사전",
    "Search your dictionary…": "사전에서 검색…",
    "Filter by group": "그룹으로 거르기",
    "Sort words": "정렬",
    "My order": "내 순서",
    "A to Z": "가나다·알파벳순",
    "Newest first": "최신순",
    "Oldest first": "오래된순",
    "Manage groups": "그룹 관리",
    "+ Add a word": "+ 단어 추가",
    "Word": "단어",
    "Meaning / note": "뜻 / 메모",
    "Group": "그룹",
    "‹ Back to dictionary": "‹ 사전으로 돌아가기",
    "Group to edit": "편집할 그룹",
    "Rename this group": "이 그룹 이름 바꾸기",
    "Delete this group": "이 그룹 삭제",
    "Deleting a group keeps its words — they move to the first group.": "그룹을 삭제해도 단어는 남습니다. 첫 번째 그룹으로 옮겨집니다.",
    "Add a new group": "새 그룹 만들기",
    "New group": "새 그룹",
    "+ Add group": "+ 그룹 추가",
    "Ungrouped": "미분류",
    "All groups": "모든 그룹",
    "{shown} / {total}": "{shown} / {total}",
    "No words saved yet. Look a word up, then tap the star to save it here.": "저장된 단어가 없습니다. 무언가를 검색한 뒤 별표를 누르면 여기에 저장됩니다.",
    "Import…": "가져오기…",
    "Each row becomes one word: first column the word, second the meaning, third an optional link. A header row is detected and skipped automatically.": "각 행이 하나의 단어가 됩니다: 첫 번째 열은 단어, 두 번째는 뜻, 세 번째는 선택적인 링크입니다. 머리글 행은 자동으로 감지되어 건너뜁니다.",
    "Excel (.xlsx) or CSV file": "Excel(.xlsx) 또는 CSV 파일",
    "…or a Google Sheets share link": "…또는 Google 스프레드시트 공유 링크",
    "Fetch": "불러오기",
    "Add into group": "그룹에 추가",
    "Add these words": "이 단어들 추가",
    "Reading…": "읽는 중…",
    "Fetching…": "불러오는 중…",
    "Couldn't find any words in that file.": "이 파일에서 단어를 찾지 못했습니다.",
    "Found {count} words in {source}.": "{source}에서 단어 {count}개를 찾았습니다.",
    "the sheet": "시트",
    "Couldn't read that file.": "이 파일을 읽을 수 없습니다.",
    "That doesn't look like a Google Sheets link.": "Google 스프레드시트 링크가 아닌 것 같습니다.",
    "Couldn't fetch that sheet. Make sure it's shared as \"Anyone with the link can view\".": "이 시트를 가져올 수 없습니다. \"링크가 있는 모든 사용자\"로 공유되어 있는지 확인해 주세요.",
    "…and {count} more": "…외 {count}개 더",
    "Nothing new to add.": "새로 추가할 것이 없습니다.",
    "Added {count} words to your dictionary": "사전에 단어 {count}개를 추가했습니다",
    "Add these {count} words": "이 단어 {count}개 추가",
    "No words matched.": "결과가 없습니다.",
    "Move {word} up": "{word} 위로",
    "Move {word} down": "{word} 아래로",
    "Group: {group}": "그룹: {group}",
    "Saved {date}": "{date} 저장",
    "Group {n}": "그룹 {n}",
    "Please enter a word": "단어를 입력하세요",
    "You need at least one group.": "그룹은 최소 하나가 필요합니다.",
    "Save to your dictionary": "사전에 저장",
    "Remove from your dictionary": "사전에서 삭제",
    "Added to your dictionary": "사전에 저장했습니다",
    "Removed from your dictionary": "사전에서 삭제했습니다",
    "Select a question (optional)": "질문 선택 (선택)",
    "Set up your PINs": "PIN 설정",
    "A PIN to open MyHome Browser, and a separate PIN to turn scroll ON — both required, so the friction this app relies on can't quietly default to something guessable. You can switch to Face ID / Fingerprint instead later, in Settings.": "MyHome Browser를 여는 PIN과, 스크롤을 켜는 별도의 PIN 모두 필수입니다 — 그렇지 않으면 이 앱이 의존하는 마찰이 누구나 짐작할 수 있는 값으로 슬며시 대체되어 버립니다. 나중에 설정에서 Face ID / 지문으로 바꿀 수 있습니다.",
    "Select a question": "질문 선택",
    "Choose a security question and answer it, so you can reset your PIN if you forget it": "PIN을 잊어버렸을 때 재설정할 수 있도록, 보안 질문을 선택하고 답을 입력해 주세요.",
    "Search results": "검색 결과",
    "Close search results": "검색 결과 닫기",
    "Searching…": "검색 중…",
    "Search failed: {message}": "검색 실패: {message}",
    "No results found.": "결과를 찾을 수 없습니다.",
    "Search results for \"{query}\"": "\"{query}\" 검색 결과",
    "Typed search terms show Wikipedia results as a list inside the app — no setup needed, but only Wikipedia articles, not the wider web. Typing the address of a big site that refuses to be shown inside another page (Google, Instagram, Facebook, X, TikTok, YouTube, DuckDuckGo) opens it in your regular browser instead — that's the site's own policy, not something this app can change.": "입력한 검색어는 위키백과 검색 결과가 앱 내 목록으로 표시됩니다 — 별도 설정은 필요 없지만, 검색 대상은 위키백과 문서로 한정되며 웹 전체가 아닙니다. 다른 페이지 안에 표시되는 것을 거부하는 대형 사이트(Google, Instagram, Facebook, X, TikTok, YouTube, DuckDuckGo)의 주소를 직접 입력하면 대신 기본 브라우저에서 열립니다 — 이는 해당 사이트 자체의 정책이며 이 앱에서 바꿀 수 있는 부분이 아닙니다.",
    "Ad blocking only stops known ad domains, not ads on a page you already opened.": "광고 차단은 알려진 광고 도메인만 막을 뿐, 이미 연 페이지 안의 광고는 없애지 못합니다.",
    "Save with your own note": "직접 쓴 메모로 저장",
    "Your own note": "직접 쓴 메모",
    "Search shows Wikipedia results here. An address opens as a tab.": "검색은 여기 위키백과 결과로 나옵니다. 주소는 탭으로 열립니다.",
    "Tap the star on a tab, or on a search result, to save it.": "탭이나 검색 결과의 별표를 누르면 저장됩니다.",
    "The pencil on a search result lets you write your own note.": "검색 결과의 연필 아이콘으로 직접 메모를 쓸 수 있습니다.",
    "Scroll is OFF": "스크롤이 꺼져 있습니다",
    "These apps open in your normal browser, where this app can't keep scroll locked — so while scroll is OFF they stay closed.": "이 앱들은 일반 브라우저에서 열리고, 그곳에서는 스크롤 잠금을 유지할 수 없습니다. 그래서 스크롤이 꺼져 있는 동안에는 열리지 않습니다.",
    "Not now": "나중에",
    "Install to your home screen": "홈 화면에 설치",
    "Install": "설치",
    "Installed to your home screen": "홈 화면에 설치했습니다",
    "Apps that need scroll ON": "스크롤을 켜야 열리는 앱",
    "Don't let the apps below open while scroll is OFF": "스크롤이 꺼져 있는 동안에는 아래 앱을 열지 않기",
    "{app} opens in a separate browser tab, so you'll leave MyHome Browser and have to find your way back. Installing this app to your home screen usually improves that — see Settings.": "{app}은(는) 별도의 브라우저 탭에서 열리므로 MyHome Browser를 떠나게 되고 돌아올 길을 찾아야 합니다. 이 앱을 홈 화면에 설치하면 대개 나아집니다 — 설정을 확인하세요.",
    "Installed. Other apps still open outside this app, but most phones now show them as a layer you can close to come straight back rather than switching you away. Either way your tabs, dictionary and scroll state are kept. Other apps' Share button can now send links, text and files straight into your Waiting room, too.": "설치되었습니다. 다른 앱은 여전히 이 앱 바깥에서 열리지만, 대부분의 휴대폰에서는 완전히 전환되는 대신 닫으면 바로 돌아올 수 있는 층으로 표시됩니다. 어느 쪽이든 탭과 사전, 스크롤 상태는 그대로 유지됩니다. 이제 다른 앱의 공유 버튼으로 링크, 텍스트, 파일을 대기실로 바로 보낼 수도 있습니다.",
    "Right now other apps open in a separate browser tab, so you leave this app and have to find your way back. Installing it to your home screen usually makes them open as a closable layer instead — the exact behaviour is your phone's choice, not this app's.": "지금은 다른 앱이 별도의 브라우저 탭에서 열려 이 앱을 떠나게 되고, 돌아올 길을 찾아야 합니다. 홈 화면에 설치하면 대개 닫을 수 있는 층으로 열립니다. 정확한 동작은 이 앱이 아니라 휴대폰이 결정합니다.",
    "Right now other apps open in a separate browser tab, so you leave this app. In Safari, tap the Share button and choose \"Add to Home Screen\" — that usually helps, though iOS sometimes still switches you over to Safari.": "지금은 다른 앱이 별도의 브라우저 탭에서 열려 이 앱을 떠나게 됩니다. Safari에서 공유 버튼을 누르고 ‘홈 화면에 추가’를 선택하세요. 대개 도움이 되지만, iOS가 여전히 Safari로 전환하는 경우도 있습니다.",
    "Open this page in Chrome or Edge and use \"Install app\" (or \"Add to Home Screen\") from the browser menu. Once installed, other apps usually open as a layer you can close to come straight back, instead of taking you away.": "이 페이지를 Chrome이나 Edge에서 열고 브라우저 메뉴의 ‘앱 설치’(또는 ‘홈 화면에 추가’)를 사용하세요. 설치하면 다른 앱이 대개 닫으면 바로 돌아올 수 있는 층으로 열리며, 아예 떠나게 되지는 않습니다.",
    "How other apps open": "다른 앱을 여는 방식",
    "Open other apps in this same window": "다른 앱을 이 창에서 열기",
    "On means the app loads in this window instead of a new tab, so your phone never switches away from MyHome Browser — press back to return here. Off opens a new tab, which on some phones hands you over to a separate browser. Try both and keep whichever returns more cleanly on your device.": "켜면 새 탭 대신 이 창에서 앱이 열려, 휴대폰이 MyHome Browser를 벗어나지 않습니다. 뒤로 가기를 누르면 돌아옵니다. 끄면 새 탭에서 열리며, 일부 휴대폰에서는 별도의 브라우저로 넘어갑니다. 두 가지를 모두 시험해 보고 기기에서 더 깔끔하게 돌아오는 쪽을 쓰세요.",
    "{app} loads in this window, so your phone never switches away from MyHome Browser. Press back to return — everything here will be as you left it.": "{app}이(가) 이 창에서 열리므로 휴대폰이 MyHome Browser를 벗어나지 않습니다. 뒤로 가기를 누르면 돌아오며, 여기 있던 것은 그대로입니다.",
    "Notifications": "알림",
    "Allow notifications": "알림 허용",
    "This browser can't show notifications.": "이 브라우저는 알림을 표시할 수 없습니다.",
    "Notifications are allowed. They can only reach you while this app is still running in the background — once it's fully closed, nothing can wake it.": "알림이 허용되었습니다. 이 앱이 백그라운드에서 계속 실행 중일 때만 전달되며, 완전히 종료되면 아무것도 깨울 수 없습니다.",
    "Notifications are blocked. Allow them for this app in your browser or phone settings, then come back.": "알림이 차단되어 있습니다. 브라우저나 휴대폰 설정에서 이 앱의 알림을 허용한 뒤 다시 오세요.",
    "Let this app notify you when scroll time runs out, a timer ends, or you pass your daily limit.": "스크롤 시간이 끝나거나 타이머가 종료되거나 하루 한도를 넘겼을 때 알려드립니다.",
    "Notifications are on": "알림이 켜졌습니다",
    "This is what they'll look like.": "이런 모습으로 표시됩니다.",
    "A minute before scroll time runs out": "스크롤 시간이 끝나기 1분 전",
    "When scroll switches back OFF": "스크롤이 다시 꺼질 때",
    "When the timer finishes": "타이머가 끝났을 때",
    "Posture reminders": "자세 알림",
    "When you pass your daily limit": "하루 한도를 넘겼을 때",
    "Scroll time is nearly up": "스크롤 시간이 거의 끝났습니다",
    "About a minute left before scroll switches back OFF.": "약 1분 뒤에 스크롤이 다시 꺼집니다.",
    "You've passed your daily limit": "하루 한도를 넘겼습니다",
    "Today is over your {minutes} min goal.": "오늘은 {minutes}분 목표를 넘었습니다.",
    "Playing here, without the feed": "피드 없이 여기서 재생합니다",
    "Showing this post here, without the feed": "피드 없이 이 게시물만 여기에 표시합니다",
    "Close the app I opened when scroll time runs out": "스크롤 시간이 끝나면 열었던 앱을 닫기",
    "This is the only way the time limit reaches inside the other app: this app keeps hold of the tab it opened and shuts it when your time is up. It needs the setting above to be OFF, since there is no separate tab to close otherwise. The cost is that the site you open can see it was opened by this app and could push this page elsewhere — unlikely with the big sites, but not impossible, so turn this off if you would rather not.": "시간제한이 다른 앱까지 미치는 유일한 방법입니다. 이 앱이 열었던 탭을 계속 붙잡고 있다가 시간이 끝나면 닫습니다. 위 설정이 꺼져 있어야 합니다. 그렇지 않으면 닫을 별도의 탭이 없습니다. 대신 열린 사이트가 이 앱이 열었다는 사실을 알 수 있고, 이 페이지를 다른 곳으로 보낼 여지가 생깁니다. 큰 사이트에서는 거의 없는 일이지만 불가능하지는 않으니, 꺼리신다면 끄세요.",
    "Time's up — scroll is back OFF and the app you opened was closed": "시간이 끝났습니다 — 스크롤이 꺼지고 열었던 앱도 닫았습니다",
    "Waiting room": "대기실",
    "Shelf": "책장",
    "Take a breath": "한숨 돌리기",
    "This device can't keep records (private browsing, perhaps).": "이 기기에서는 기록을 저장할 수 없습니다(시크릿 모드일 수 있습니다).",
    "day streak": "연속 일수",
    "pauses today": "오늘의 한숨",
    "minutes held": "누적 분",
    "Hold a file from this device": "이 기기의 파일 맡기기",
    "Held on this device: {used} of about {quota}": "이 기기에 보관: {used} / 약 {quota}",
    "Put it on the shelf": "책장에 넣기",
    "Shelved under {wall}": "'{wall}' 칸에 꽂았습니다",
    "The shelf is full. Take something off it first.": "책장이 가득 찼습니다. 먼저 무언가를 빼세요.",
    "Couldn't put it on the shelf": "책장에 넣지 못했습니다",
    "This device is out of room for held files": "이 기기에 둘 수 있는 용량을 넘었습니다",
    "Couldn't hold that file": "파일을 맡아 두지 못했습니다",
    "That file is no longer on this device": "그 파일은 이제 기기에 없습니다",
    "Taken off the shelf": "책장에서 뺐습니다",
    "No address": "(주소 없음)",
    "Something to look at": "이름 없는 보관물",
    "Received 1 item from another app": "다른 앱에서 항목 1개를 받았습니다",
    "Received {n} items from another app": "다른 앱에서 항목 {n}개를 받았습니다",
    "Notice what just happened": "방금 무슨 일이 있었는지 알아차려 보세요",
    "Scroll is OFF right now. Try swiping this page — it won't move. That small inconvenience is the whole point: it buys you a moment to choose, instead of scrolling out of habit.": "지금 스크롤은 꺼져 있습니다. 이 페이지를 밀어 보세요 — 움직이지 않습니다. 이 작은 불편함이 핵심입니다. 습관적으로 스크롤하는 대신 선택할 순간을 벌어 줍니다.",
    "Got it — let me try": "알겠어요 — 해볼게요",
    "You said you wanted to get to \"{goal}\". When you're ready for it, tap \"Scroll OFF\" up top to turn scroll ON with a time limit — on your own terms.": "\"{goal}\"을(를) 하고 싶다고 하셨죠. 준비되면 위쪽의 \"Scroll OFF\"를 눌러 시간제한을 정해 스크롤을 켜세요 — 당신 스스로의 방식으로요.",
    "When you actually want something, tap \"Scroll OFF\" up top to turn scroll ON with a time limit — on your own terms.": "정말 원하는 것이 있을 때, 위쪽의 \"Scroll OFF\"를 눌러 시간제한을 정해 스크롤을 켜세요 — 당신 스스로의 방식으로요.",
    "Step 1 of 5": "5단계 중 1단계",
    "Step 2 of 5": "5단계 중 2단계",
    "Step 3 of 5": "5단계 중 3단계",
    "Step 4 of 5": "5단계 중 4단계",
    "Step 5 of 5": "5단계 중 5단계",
    "What do you want your time back for?": "되찾은 시간을 무엇에 쓰고 싶나요?",
    "Not \"less phone\" — more of something else. Name one or two things you'd rather be spending it on. This app will remind you of them, not just stop you.": "'스마트폰을 덜 쓰기'가 아니라 다른 무언가를 더 하는 것입니다. 그 시간을 쓰고 싶은 것 한두 가지를 적어 보세요. 이 앱은 그저 막는 대신 그것을 상기시켜 줍니다.",
    "Skip for now": "지금은 건너뛰기",
    "Choose a time limit. When time is up, scroll switches back OFF and the app you opened from here is closed.": "제한 시간을 고르세요. 시간이 끝나면 스크롤이 다시 꺼지고 여기서 연 앱도 닫힙니다.",
    "Choose a time limit. Scroll will switch back OFF automatically when time is up.": "제한 시간을 선택하세요. 시간이 지나면 자동으로 다시 꺼집니다.",
    "None of this is about guilt. It's why a time limit and a PIN can do more than willpower alone.": "이 모든 것은 죄책감을 주기 위한 것이 아닙니다. 그래서 제한 시간과 PIN이 의지력만으로는 부족한 부분을 채워줄 수 있습니다.",
    "These apps refuse to open inside this app, so they run in your normal browser where this app can't hold the scroll lock. Ticked apps only open once you've turned scroll ON with a time limit. Feed apps are ticked to start with — tick any others that eat your time.": "이 앱들은 이 앱 안에서 열리지 않아 일반 브라우저에서 실행되며, 그곳에서는 이 앱이 스크롤을 잠글 수 없습니다. 체크한 앱은 시간제한을 정해 스크롤을 켠 뒤에만 열립니다. 피드 앱은 처음부터 체크되어 있으며, 시간을 많이 쓰는 다른 앱도 체크해 두세요.",
    "Turn scroll ON with a time limit, and {app} will open.": "시간제한을 정해 스크롤을 켜면 {app}이(가) 열립니다.",
    "Limits": "제한",
    "{time} left": "{time} 남음",
    "Add a shelf": "선반 추가",
    "One video or one post can show inside. A whole feed can't.": "영상 하나, 게시물 하나는 안에 보입니다. 피드 전체는 안 됩니다.",
    "While scroll is OFF, the apps you ticked in Settings won't open.": "스크롤이 꺼져 있는 동안에는 설정에서 체크한 앱이 열리지 않습니다.",
    "When time runs out, scroll goes OFF and opened tabs close.": "시간이 끝나면 스크롤이 꺼지고 열린 탭도 닫힙니다.",
    "Held items wait before they open — longest for gated apps.": "맡긴 것은 열리기까지 기다립니다. 관문을 건 앱이 가장 깁니다.",
    "Open it after a while away and it asks what you came for.": "한동안 만에 열면 무엇을 하러 왔는지 묻습니다.",
    "Breaks offer what you set out to do, your shelf, or a saved word.": "휴식은 하고 싶은 일, 선반, 또는 저장한 단어를 권합니다.",
    "Loosening a limit waits 24 hours. Tightening is immediate.": "제한을 느슨하게 하면 24시간 대기, 엄격하게 하면 즉시입니다.",
    "Add to your home screen to receive from other apps' Share.": "홈 화면에 추가하면 다른 앱의 공유에서 받을 수 있습니다.",
    "Priority and Done decide what a break offers you next.": "우선순위와 '완료'가 다음 휴식에서 무엇을 권할지 정합니다.",
    "Anything you feel like looking at, this holds for a moment first.": "보고 싶어진 것은 먼저 여기서 잠시 두고 결정합니다.",
    "Interrupt me and offer something better to be doing": "끼어들어 더 나은 할 일을 권하기",
    "Order of the shelf items it reaches for": "선반에서 고를 때의 순서",
    "The more of when, where and how long you fill in, the easier these are to actually start — and a break landing in that window reaches for them first.": "언제·어디서·몇 분인지 채울수록 실제로 시작하기 쉬워지고, 그 시간에 온 휴식은 그것을 먼저 권합니다.",
    "e.g. Practise guitar": "예: 기타 연습하기",
    "Time of day": "시간대",
    "Days": "요일",
    "Where (optional)": "어디서(선택)",
    "Any day": "요일 무관",
    "Weekdays": "평일",
    "Weekends": "주말",
    "{count} from your shelf": "선반에서 {count}건",
    "{count} you set out to do": "스스로 정한 일 {count}건",
    "This week: {count}": "이번 주: {count}건",
    "{weeks} weeks ago: {count}": "{weeks}주 전: {count}건",
    "Morning": "아침",
    "Afternoon": "낮",
    "Evening": "저녁",
    "Late night": "심야",
    "Any time": "언제든",
    "done {count}x": "{count}회",
    "{idle} of your last {total} opens had nothing particular behind them.": "최근 {total}번의 실행 중 {idle}번은 특별한 용건이 없었습니다.",
    "You finished {count} things these last two weeks.": "지난 2주 동안 {count}건을 끝냈습니다.",
    "You opened this without anything particular in mind.": "특별한 용건 없이 열었습니다.",
    "Since you last looked": "지난번 이후",
    "Good": "좋아요",
    "What did you come here for?": "무엇을 하러 오셨나요?",
    "No wrong answer — this is just so the reason is yours and not the phone's.": "정답은 없습니다. 이유가 휴대폰이 아니라 자신에게 있는지 확인할 뿐입니다.",
    "To look something up": "무언가 찾아보려고",
    "To get to something I set aside": "미뤄 둔 것을 보려고",
    "No particular reason": "특별한 용건 없음",
    "When you open the app": "앱을 열 때",
    "Ask what I came here for": "무엇을 하러 왔는지 묻기",
    "Asked at most once every few minutes, never mid-task. Every answer is one tap. Answering \"no particular reason\" brings up something you said you wanted to do instead.": "몇 분에 한 번까지만 묻고, 작업 도중에는 묻지 않습니다. 어떤 답도 한 번의 탭입니다. '특별한 용건 없음'을 고르면 하고 싶다고 했던 일을 대신 보여 줍니다.",
    "Stop asking what you came for": "무엇을 하러 왔는지 묻지 않기",
    "You said {promised}. It was {actual} — {over} of your last {total} went over.": "{promised}이라고 했지만 실제로는 {actual}였습니다. 최근 {total}번 중 {over}번이 초과했습니다.",
    "You went past your own limit on {over} of the last {total} times you left, by {avg} on average.": "최근 {total}번 중 {over}번, 스스로 정한 시간을 넘겼습니다(평균 {avg}).",
    "You came back within your own limit all {total} of the last times you left.": "최근 {total}번 모두 스스로 정한 시간 안에 돌아왔습니다.",
    "If {trigger}, then {action}": "{trigger}면, {action}",
    "Saved. It takes effect in {wait} — you can cancel until then.": "저장했습니다. {wait} 후에 적용되며, 그전까지 언제든 취소할 수 있습니다.",
    "{change} — in {wait}": "{change} — {wait} 후",
    "Cancel this change": "이 변경 취소",
    "Change cancelled": "변경을 취소했습니다",
    "{text} · done {count}x": "{text} · {count}회",
    "Remove this rule": "이 규칙 삭제",
    "How about this now?": "슬슬 이거 어떠세요?",
    "Away from the screen": "화면에서 잠시 떨어져",
    "Did it": "했어요",
    "There's something you said you wanted to do.": "하고 싶다고 했던 일이 있습니다.",
    "Nice.": "좋아요.",
    "finished": "끝낸 것",
    "You decided": "스스로 정한 것",
    "Turn scroll ON anyway": "그래도 스크롤 켜기",
    "Set out what you want to get to, in Settings — then this offers those instead of just something to read.": "설정에 하고 싶은 일을 적어 두면, 읽을거리 대신 그쪽을 먼저 권합니다.",
    "What you want to get to": "하고 싶은 일",
    "Your shelf only holds things you put off looking at. List what you actually want to spend the time on, and breaks will offer these first.": "선반에는 미뤄 둔 것만 쌓입니다. 정말 시간을 쓰고 싶은 일을 적어 두면 휴식 때 이쪽을 먼저 권합니다.",
    "Nothing here yet — breaks will fall back to your shelf, a saved word, and small away-from-screen nudges.": "아직 없습니다. 지금은 선반, 저장한 단어, 화면에서 떨어지는 작은 제안으로 대신합니다.",
    "If this, then that": "이러면, 이렇게 한다",
    "Decide now, while it's easy, what you'll do in the moment it isn't. These are read back to you when an app is held closed.": "여유가 있을 때, 여유가 없을 때 무엇을 할지 미리 정해 둡니다. 앱이 막혔을 때 그대로 다시 보여 줍니다.",
    "No rules yet.": "아직 규칙이 없습니다.",
    "If… (e.g. it's past 11pm)": "만약… (예: 밤 11시가 지나면)",
    "then… (e.g. I'll read one shelved thing)": "그러면… (예: 선반에서 하나 읽는다)",
    "Cooling-off period": "머리를 식히는 시간",
    "Make loosening these settings wait 24 hours": "설정을 느슨하게 하는 변경은 24시간 뒤에 반영",
    "The version of you that sets these limits and the version that wants past them are not in the room at the same time. Tightening anything still takes effect at once; only loosening waits, and you can cancel it the whole time.": "이 제한을 정하는 나와, 그것을 넘고 싶은 나는 같은 자리에 있지 않습니다. 엄격하게 하는 변경은 지금처럼 즉시 적용되고, 느슨하게 하는 변경만 기다립니다. 그동안 언제든 취소할 수 있습니다.",
    "Waiting to take effect:": "적용 대기 중:",
    "Turn forced breaks off": "강제 휴식 끄기",
    "Make breaks less frequent": "휴식 간격 늘리기",
    "Raise the scroll count before a break": "휴식까지의 스크롤 횟수 늘리기",
    "Turn the cooling-off period off": "머리를 식히는 시간 끄기",
    "Stop requiring scroll ON for those apps": "그 앱들에 스크롤 ON을 요구하지 않기",
    "Remove apps from the scroll gate": "스크롤 관문에서 앱 제외하기",
    "Added shelf {name}": "선반 {name} 추가됨",
    "File": "파일",
    "Later": "나중에 읽기",
    "Shelf space": "책장 용량",
    "— empty shelf —": "— 빈 칸 —",
    "Nothing on the shelf yet. Things you keep from the waiting room end up here.": "아직 책이 없습니다. 대기실에서 넣어 둔 것이 여기 꽂힙니다.",
    "Shelf wall": "책장 벽",
    "Previous wall": "이전 벽",
    "Next wall": "다음 벽",
    "{kind} · {size}": "{kind} · {size}",
    "Drink a glass of water, slowly.": "물 한 컵을 천천히 마시기.",
    "Look at the furthest thing out of the window.": "창밖에서 가장 먼 것을 바라보기.",
    "Lift your shoulders, then let them drop. Three times.": "어깨를 올렸다가 툭 떨어뜨리기. 세 번.",
    "Put three things on your desk back where they belong.": "책상 위 물건 세 개를 제자리에 두기.",
    "Close your eyes and count three sounds you can hear.": "눈을 감고 들리는 소리 세 개 세어 보기.",
    "Stand up and walk once around the room.": "일어나서 방을 한 바퀴 돌기.",
    "Wash your hands. Notice the temperature of the water.": "손을 씻기. 물의 온도를 느껴 보기.",
    "Straighten your back and look up at the ceiling.": "등을 펴고 천장을 올려다보기.",
    "Open a window or a curtain and let the air change.": "창이나 커튼을 열어 공기를 바꾸기.",
    "Remember one good thing about today.": "오늘 좋았던 일을 하나 떠올리기.",
    "Feel where your feet are touching the floor.": "발바닥이 바닥에 닿는 느낌에 집중하기.",
    "Leave one line of a note for tomorrow's you.": "내일의 나에게 한 줄 메모 남기기.",
    "Look into the distance and let your eyes go soft.": "먼 곳을 보며 눈의 힘을 빼기.",
    "Breathe in deeply, breathe out slowly. That's enough.": "깊이 들이쉬고 길게 내쉬기. 그것으로 충분합니다.",
    "{used} / {total}": "{used} / {total}",
    "Close": "닫기",
    "Search the shelf…": "책장에서 검색…",
    "Nothing on the shelf matched.": "책장에서 찾지 못했습니다.",
    "Priority": "우선순위",
    "High": "높음",
    "Low": "낮음",
    "Order on this shelf": "이 칸에서의 순서",
    "Move earlier": "위로",
    "Move later": "아래로",
    "Done": "완료",
    "Not done after all": "다시 미완료로",
    "Marked as done": "완료로 표시했습니다",
    "Put back as unfinished": "미완료로 되돌렸습니다",
    "Done ({count})": "완료 ({count})",
    "Break reminders": "휴식 알림",
    "This doesn't wait for you to remember. Whatever screen you're on, once you pass the limits below, a quiet banner appears (a short vibration, no sound) offering what you set out to do, something from your shelf, or a saved word — it doesn't block what you're doing.": "기억해 내기를 기다리지 않습니다. 어느 화면에 있든 아래 기준을 넘으면, 조용한 배너가 나타나(짧은 진동, 소리 없음) 하고 싶다고 한 일, 책장의 항목, 또는 저장한 단어 중 하나를 보여줍니다 — 하던 일을 막지 않습니다.",
    "Every (minutes)": "몇 분마다",
    "Or after this many scrolls (0 = off)": "또는 스크롤 횟수 (0이면 사용 안 함)",
    "Highest priority first": "우선순위 높은 순",
    "The order I arranged": "내가 정한 순서",
    "Time for a break": "쉬어 갈 시간입니다",
    "From your shelf": "책장에서",
    "You've been at this for {minutes} minutes.": "{minutes}분째 계속하고 있습니다.",
    "You've scrolled {count} times since your last break.": "지난 휴식 이후 {count}번 스크롤했습니다.",
    "There's nothing unfinished on your shelf yet. Put something there and this will offer it next time.": "책장에 아직 미완료가 없습니다. 무언가 넣어 두면 다음에 권해 드립니다.",
    "Mark done": "완료로 표시",
    "Open this": "이것 보기",
    "Pick one of your own shelves to share.": "공유할 자신의 선반을 하나 고르세요.",
    "This shelf has nothing with a link on it yet.": "이 선반에는 아직 링크가 있는 항목이 없습니다.",
    "My shelf: {name}": "내 선반: {name}",
    "Link copied. Send it to someone.": "링크가 복사되었습니다. 누군가에게 보내보세요.",
    "Couldn't share this shelf": "이 선반을 공유할 수 없습니다",
    "Someone shared a shelf with you — {count} things on it.": "누군가 선반을 공유했습니다 — {count}개가 담겨 있습니다.",
    "Added {count} things to a new shelf": "새 선반에 {count}개를 추가했습니다",
    "Name this shelf": "이 선반의 이름을 지어주세요",
    "You finished {count} things these last two weeks — about {minutes} of your own choosing.": "지난 2주 동안 {count}건을 끝냈습니다 — 직접 고른 시간 약 {minutes}.",
    "A word from your dictionary": "사전에서 고른 단어",
    "Nice to know": "알아두면 좋아요",
    "Rename": "이름 바꾸기",
    "Share this shelf": "이 선반 공유하기",
    "How long it takes (minutes)": "걸리는 시간 (분)",
    "A shelf from someone": "누군가의 선반",
    "Taking it adds a new shelf of your own. Nothing you already have is touched.": "받으면 나만의 새 선반이 추가됩니다. 이미 가진 것은 전혀 건드리지 않습니다.",
    "No thanks": "괜찮아요",
    "Add to my shelves": "내 선반에 추가",
    "e.g. 12": "예: 12",
    "Break's over. Nice.": "휴식 끝. 잘했어요.",
    "{app} stays closed until your break ends.": "휴식이 끝날 때까지 {app}은(는) 열리지 않습니다.",
    "You're on a break": "지금은 휴식 중입니다",
    "Back to the break": "휴식으로 돌아가기",
    "End the break early": "휴식 미리 끝내기",
    "Break length": "휴식 길이",
    "Notify me even when this app is fully closed": "앱을 완전히 닫아도 알려주기",
    "This uses a small external server (not run by you) that holds only the alert times and text above — nothing about what you look at, your dictionary, or your shelf. It can't schedule a daily-limit alert this way, since that depends on watching today's usage as it happens; that one still only fires while this app is open.": "이 기능은 (당신이 운영하지 않는) 작은 외부 서버를 사용하며, 위 알림의 시간과 문구만 저장합니다 — 무엇을 보는지, 사전, 선반의 내용은 전혀 저장하지 않습니다. 일일 한도 알림은 이 방식으로 예약할 수 없습니다. 오늘 사용량을 실시간으로 지켜봐야 하기 때문이며, 이 알림은 여전히 앱이 열려 있을 때만 울립니다.",
    "Couldn't turn this on right now": "지금은 켤 수 없습니다",
    "Notifications on — tap to turn off": "알림 켜짐 — 탭하면 끕니다",
    "Notifications off — tap to turn on": "알림 꺼짐 — 탭하면 켭니다",
    "Share anonymous usage events": "익명 사용 이벤트 공유",
    "Send anonymous usage events to this app's operator": "이 앱 운영자에게 익명 사용 이벤트 보내기",
    "Separate from notifications, and off by default. When on, this device sends named moments only — things like \"scroll turned on\", \"a shelf item was marked done\", or \"a dock app was opened\" — tagged with a random device id, never your name or account. It never includes what you searched, dictionary words, shelf titles, or URLs. The full list of what's sent lives in push-server/README.md. Turning this off stops it immediately.": "알림과는 별개이며 기본적으로 꺼져 있습니다. 켜면 이 기기는 \"스크롤 켜짐\", \"선반 항목을 완료로 표시함\", \"독 앱을 열었음\"과 같은 정해진 순간의 이름만 보내며, 무작위 기기 id로 표시될 뿐 이름이나 계정은 절대 포함되지 않습니다. 검색한 내용, 사전 단어, 선반 제목, URL은 절대 포함하지 않습니다. 전송되는 전체 목록은 push-server/README.md에 있습니다. 끄면 즉시 중단됩니다.",
    "Time's up — scroll switched back OFF. You kept your word.": "시간이 다 되어 스크롤을 다시 껐습니다. 약속을 지켰습니다.",
    "Time's up — scroll is back OFF and the app you opened was closed. You kept your word.": "시간이 끝났습니다 — 스크롤이 꺼지고 열었던 앱도 닫았습니다. 약속을 지켰습니다.",
    "Things you want to get to": "하고 싶은 일",
    "Nothing here yet — add something and breaks will offer it first.": "아직 아무것도 없습니다 — 무언가를 추가하면 휴식 때 가장 먼저 제안됩니다.",
    "+ Add something": "+ 추가하기",
    "Keep at it until (optional)": "이 날짜까지 계속하기 (선택 사항)",
    "+ Add a book": "+ 책 추가",
    "Link (optional)": "링크 (선택 사항)",
    "{days} days left": "{days}일 남음",
    "1 day left": "1일 남음",
    "Last day": "마지막 날",
    "Past your date": "설정한 날짜가 지났습니다",
    "Added to shelf {wall}": "선반 {wall}에 추가됨",
    "Anonymous usage events": "익명 사용 이벤트",
    "This app's server is set up, so this device automatically sends named moments only — things like \"scroll turned on\", \"a shelf item was marked done\", or \"a dock app was opened\" — tagged with a random device id, never your name or account. It never includes what you searched, dictionary words, shelf titles, or URLs. There's no separate switch for this: as long as the server is configured, it's sent. The full list of what's sent lives in push-server/README.md.": "이 앱의 서버가 설정되어 있어, 이 기기는 \"스크롤 켜짐\", \"선반 항목을 완료로 표시함\", \"독 앱을 열었음\" 같은 정해진 이름의 순간만 무작위 기기 ID와 함께 자동으로 보냅니다. 이름이나 계정은 절대 포함되지 않습니다. 검색어, 사전 단어, 선반 제목, URL은 절대 포함하지 않습니다. 별도의 켜고 끄는 스위치는 없습니다: 서버가 설정되어 있는 한 전송됩니다. 전송되는 항목의 전체 목록은 push-server/README.md에 있습니다.",
    "Days (optional)": "요일 (선택 사항)",
    "The more of when, which days and how long you fill in, the easier these are to actually start — and a break landing in that window reaches for them first.": "언제, 어떤 요일에, 얼마나 오래 할지를 더 많이 채울수록 실제로 시작하기 쉬워지고, 그 시간대에 맞는 휴식이 가장 먼저 이것을 제안합니다.",
    "Goals": "목표",
    "Not recorded": "기록 없음",
    "Not at all": "전혀 못함",
    "Barely": "조금 부족",
    "Minimum done": "최소한 완료",
    "Pretty good": "꽤 잘함",
    "Nailed it!": "완벽하게 해냄!",
    "Note": "메모",
    "Add something you want to work on, and it'll show up here to track.": "하고 싶은 일을 추가하면 여기에서 기록할 수 있어요.",
    "Date": "날짜",
    "No records this month": "이번 달 기록 없음",
    "Diary saved": "일기가 저장되었습니다",
    "Active Days": "활동한 날",
    "last {days}d": "최근 {days}일",
    "Avg Score": "평균 점수",
    "out of 5.0": "/ 5.0",
    "Top Category": "최고 카테고리",
    "avg": "평균",
    "no data": "데이터 없음",
    "Activity Heatmap": "활동 히트맵",
    "Category Balance": "카테고리 균형",
    "Progress Trend": "진행 추세",
    "Best Day of Week": "최고의 요일",
    "Streaks & Completion": "연속 기록 및 달성률",
    "Level Distribution": "레벨 분포",
    "Need 2+ categories": "카테고리가 2개 이상 필요합니다",
    "Streak": "연속 기록",
    "Best": "최고 기록",
    "Days done": "완료한 날",
    "Rate": "달성률",
    "History": "기록",
    "Diary": "일기",
    "Stats": "통계",
    "7 Days": "7일",
    "30 Days": "30일",
    "90 Days": "90일",
    "Previous day": "이전 날",
    "Next day": "다음 날",
    "Close note": "메모 닫기",
    "What happened today? Thoughts, feelings, reflections…": "오늘 무슨 일이 있었나요? 생각, 감정, 성찰…",
    "Add a note for this day…": "이 날의 메모를 추가하세요…",
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
    "Add your own site": "添加你自己的网站",
    "Name": "名称",
    "Website address": "网站地址",
    "Order": "排序",
    "Use the arrows to change the order apps appear in on your home screen.": "使用箭头调整应用在主屏幕上的显示顺序。",
    "Remove {app}": "移除{app}",
    "Check some apps above to arrange their order.": "在上方勾选一些应用即可排列顺序。",
    "Move {app} earlier": "将{app}前移",
    "Move {app} later": "将{app}后移",
    "Enter a name and a website address": "请输入名称和网站地址",
    "Enter a valid website address": "请输入有效的网站地址",
    "Added {app}": "已添加{app}",
    "The list of apps installed on your phone can't be read automatically from a web page, so pick from the candidates below instead.": "网页无法自动读取手机上已安装的应用列表，请从下面的候选中选择。",
    "Add up to 10 apps from \"Edit Apps\"": "可从「编辑应用」中最多添加 10 个",
    "Open this app?": "要打开这个应用吗？",
    "Open": "打开",
    "Cancel": "取消",
    "Turn scroll ON": "开启滚动",
    "Time limit": "时间限制",
    "4-digit PIN": "4 位 PIN",
    "Turn ON": "开启",
    "Unlock with Face ID / Fingerprint": "使用面容 / 指纹解锁",
    "Choose your language": "选择语言",
    "App Lock PIN (opens the app)": "应用锁 PIN（用于打开应用）",
    "Scroll PIN (turns scroll ON)": "滚动 PIN（用于开启滚动）",
    "Security question": "安全问题",
    "What was your first pet's name?": "你第一只宠物叫什么名字？",
    "What is your mother's maiden name?": "你母亲的婚前姓氏是什么？",
    "What was the name of your first school?": "你就读的第一所学校叫什么？",
    "What city were you born in?": "你出生在哪个城市？",
    "What was your childhood nickname?": "你小时候的绰号是什么？",
    "What is your favorite food?": "你最喜欢的食物是什么？",
    "Answer": "答案",
    "Save & Continue": "保存并继续",
    "Which social media do you use?": "你使用哪些社交应用？",
    "Choose the ones you want quick access to from your dock.": "请选择希望在下方栏中快速打开的应用。",
    "Finish setup": "完成设置",
    "Settings": "设置",
    "Close settings": "关闭设置",
    "Open settings": "打开设置",
    "How to use this app": "使用方法",
    "Set a timer": "设置计时器",
    "Look & Feel": "外观",
    "PINs & Unlock": "PIN 与解锁",
    "Appearance": "外观",
    "Green": "绿色",
    "Blue": "蓝色",
    "Accent color": "强调色",
    "Background color": "背景色",
    "Choose background image": "选择背景图片",
    "Remove image": "移除图片",
    "Reset colors": "重置颜色",
    "Purple": "紫色",
    "Orange": "橙色",
    "Pink": "粉色",
    "Dark": "深色",
    "Home Screen Icons": "主屏幕图标",
    "Icon size": "图标大小",
    "Small": "小",
    "Medium": "中",
    "Large": "大",
    "Icon shape": "图标形状",
    "Rounded square": "圆角方形",
    "Circle": "圆形",
    "Show app names under icons": "在图标下方显示应用名称",
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
    "{time} left — the app will lock when this reaches 0:00.": "剩余 {time} —— 到 0:00 时应用会被锁定。",
    "{time} left. This is just a timer; nothing else happens at 0:00.": "剩余 {time}。这只是一个计时器，到 0:00 时不会发生其他事情。",
    "{minutes} min": "{minutes} 分钟",
    "Remove \"{name}\"": "删除“{name}”",
    "{label} ({minutes} min)": "{label}（{minutes} 分钟）",
    "{label} · {index} of {total}": "{label} · 第 {index} / {total} 页",
    "Timer started — app locks in {label}": "计时开始 —— {label}后锁定应用",
    "Timer started for {label}": "已开始 {label} 的计时",
    "Open {app}?": "要打开 {app} 吗？",
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
    "Blocked: this looks like an ad or tracking domain": "已拦截：这看起来是广告或跟踪域名",
    "Close tab \"{title}\"": "关闭标签页“{title}”",
    "Insights": "使用统计",
    "Search or enter a website above to start browsing.": "在上方搜索或输入网址即可开始浏览。",
    "Open insights": "打开使用统计",
    "Search or go to address": "搜索或前往网址",
    "Search or enter address": "搜索或输入网址",
    "Basic search": "简易搜索",
    "Open in browser": "在浏览器中打开",
    "Close insights": "关闭使用统计",
    "Browsing": "浏览",
    "Still finding what you needed? You've been browsing for {minutes} minutes.": "找到你要的内容了吗？你已经浏览了 {minutes} 分钟。",
    "Check in with me every 10 minutes while I'm browsing a tab": "浏览标签页时，每10分钟提醒我一次",
    "Still browsing": "仍在浏览",
    "Keep browsing": "继续浏览",
    "{domain} doesn't allow embedding, so it opened in your browser instead.": "{domain} 不允许被嵌入显示，因此已在你的浏览器中打开。",
    "Saved": "已保存",
    "Edit": "编辑",
    "Remove": "移除",
    "Title": "标题",
    "Dictionary": "词典",
    "Open dictionary": "打开词典",
    "Close dictionary": "关闭词典",
    "Your Dictionary": "你的词典",
    "Search your dictionary…": "在词典中搜索…",
    "Filter by group": "按分组筛选",
    "Sort words": "排序",
    "My order": "我的顺序",
    "A to Z": "按字母顺序",
    "Newest first": "最新优先",
    "Oldest first": "最早优先",
    "Manage groups": "管理分组",
    "+ Add a word": "+ 添加词条",
    "Word": "词条",
    "Meaning / note": "释义 / 备注",
    "Group": "分组",
    "‹ Back to dictionary": "‹ 返回词典",
    "Group to edit": "要编辑的分组",
    "Rename this group": "重命名此分组",
    "Delete this group": "删除此分组",
    "Deleting a group keeps its words — they move to the first group.": "删除分组不会删除词条，它们会移到第一个分组。",
    "Add a new group": "新建分组",
    "New group": "新分组",
    "+ Add group": "+ 添加分组",
    "Ungrouped": "未分组",
    "All groups": "全部分组",
    "{shown} / {total}": "{shown} / {total}",
    "No words saved yet. Look a word up, then tap the star to save it here.": "还没有保存的词条。查询后点击星标即可保存到这里。",
    "Import…": "导入…",
    "Each row becomes one word: first column the word, second the meaning, third an optional link. A header row is detected and skipped automatically.": "每一行会变成一个单词：第一列是单词，第二列是释义，第三列是可选的链接。系统会自动识别并跳过表头行。",
    "Excel (.xlsx) or CSV file": "Excel（.xlsx）或 CSV 文件",
    "…or a Google Sheets share link": "…或粘贴 Google 表格的共享链接",
    "Fetch": "获取",
    "Add into group": "添加到分组",
    "Add these words": "添加这些单词",
    "Reading…": "读取中…",
    "Fetching…": "获取中…",
    "Couldn't find any words in that file.": "在该文件中没有找到任何单词。",
    "Found {count} words in {source}.": "在{source}中找到了 {count} 个单词。",
    "the sheet": "该表格",
    "Couldn't read that file.": "无法读取该文件。",
    "That doesn't look like a Google Sheets link.": "这看起来不像 Google 表格链接。",
    "Couldn't fetch that sheet. Make sure it's shared as \"Anyone with the link can view\".": "无法获取该表格。请确认已将其共享为「知道链接的任何人都可以查看」。",
    "…and {count} more": "…还有 {count} 个",
    "Nothing new to add.": "没有可添加的新内容。",
    "Added {count} words to your dictionary": "已向你的词典添加 {count} 个单词",
    "Add these {count} words": "添加这 {count} 个单词",
    "No words matched.": "没有匹配的词条。",
    "Move {word} up": "将 {word} 上移",
    "Move {word} down": "将 {word} 下移",
    "Group: {group}": "分组：{group}",
    "Saved {date}": "保存于 {date}",
    "Group {n}": "分组 {n}",
    "Please enter a word": "请输入词条",
    "You need at least one group.": "至少需要一个分组。",
    "Save to your dictionary": "保存到词典",
    "Remove from your dictionary": "从词典中删除",
    "Added to your dictionary": "已保存到词典",
    "Removed from your dictionary": "已从词典中删除",
    "Select a question (optional)": "选择一个问题（可选）",
    "Set up your PINs": "设置 PIN",
    "A PIN to open MyHome Browser, and a separate PIN to turn scroll ON — both required, so the friction this app relies on can't quietly default to something guessable. You can switch to Face ID / Fingerprint instead later, in Settings.": "打开 MyHome Browser 需要一个 PIN，打开滚动需要另一个 PIN——两者都是必填项，这样这个应用所依赖的阻力才不会悄悄退化成一个谁都能猜到的值。之后你可以在设置里改用 Face ID / 指纹。",
    "Select a question": "选择一个问题",
    "Choose a security question and answer it, so you can reset your PIN if you forget it": "请选择一个安全问题并作答，这样万一忘记 PIN 时可以重新设置。",
    "Search results": "搜索结果",
    "Close search results": "关闭搜索结果",
    "Searching…": "搜索中…",
    "Search failed: {message}": "搜索失败：{message}",
    "No results found.": "未找到结果。",
    "Search results for \"{query}\"": "“{query}”的搜索结果",
    "Typed search terms show Wikipedia results as a list inside the app — no setup needed, but only Wikipedia articles, not the wider web. Typing the address of a big site that refuses to be shown inside another page (Google, Instagram, Facebook, X, TikTok, YouTube, DuckDuckGo) opens it in your regular browser instead — that's the site's own policy, not something this app can change.": "输入的搜索词会以列表形式显示维基百科的搜索结果——无需任何设置，但只能搜索维基百科的条目，而非整个网络。如果直接输入拒绝在其他页面中显示的大型网站地址（Google、Instagram、Facebook、X、TikTok、YouTube、DuckDuckGo），则会改为在你的常规浏览器中打开——这是该网站自身的政策，本应用无法更改。",
    "Ad blocking only stops known ad domains, not ads on a page you already opened.": "广告拦截只会阻止已知的广告域名，无法去除已经打开的页面中的广告。",
    "Save with your own note": "用自己写的备注保存",
    "Your own note": "你自己写的备注",
    "Search shows Wikipedia results here. An address opens as a tab.": "搜索会在这里显示维基百科结果，网址则会作为标签页打开。",
    "Tap the star on a tab, or on a search result, to save it.": "点击标签页或搜索结果上的星标即可保存。",
    "The pencil on a search result lets you write your own note.": "点击搜索结果上的铅笔图标可以写下自己的备注。",
    "Scroll is OFF": "滚动已关闭",
    "These apps open in your normal browser, where this app can't keep scroll locked — so while scroll is OFF they stay closed.": "这些应用会在你的常规浏览器中打开，本应用无法在那里保持滚动锁定，因此滚动关闭期间它们不会打开。",
    "Not now": "暂时不用",
    "Install to your home screen": "安装到主屏幕",
    "Install": "安装",
    "Installed to your home screen": "已安装到主屏幕",
    "Apps that need scroll ON": "需要开启滚动才能打开的应用",
    "Don't let the apps below open while scroll is OFF": "滚动关闭时不打开下列应用",
    "{app} opens in a separate browser tab, so you'll leave MyHome Browser and have to find your way back. Installing this app to your home screen usually improves that — see Settings.": "{app} 会在单独的浏览器标签页中打开，因此你会离开 MyHome Browser，并且需要自己找回来。把本应用安装到主屏幕通常会改善这一点——请查看设置。",
    "Installed. Other apps still open outside this app, but most phones now show them as a layer you can close to come straight back rather than switching you away. Either way your tabs, dictionary and scroll state are kept. Other apps' Share button can now send links, text and files straight into your Waiting room, too.": "已安装。其他应用仍会在本应用之外打开，但大多数手机现在会把它们显示为一层，关闭即可直接返回，而不是把你整个切换走。无论哪种情况，你的标签页、词典和滚动状态都会保留。其他应用的分享按钮现在也可以把链接、文字和文件直接发送到你的等候室。",
    "Right now other apps open in a separate browser tab, so you leave this app and have to find your way back. Installing it to your home screen usually makes them open as a closable layer instead — the exact behaviour is your phone's choice, not this app's.": "目前其他应用会在单独的浏览器标签页中打开，因此你会离开本应用并需要自己找回来。安装到主屏幕后，它们通常会以可关闭的一层打开——具体行为由你的手机决定，而非本应用。",
    "Right now other apps open in a separate browser tab, so you leave this app. In Safari, tap the Share button and choose \"Add to Home Screen\" — that usually helps, though iOS sometimes still switches you over to Safari.": "目前其他应用会在单独的浏览器标签页中打开，因此你会离开本应用。在 Safari 中点按“分享”按钮并选择“添加到主屏幕”，这通常会有帮助，不过 iOS 有时仍会把你切换到 Safari。",
    "Open this page in Chrome or Edge and use \"Install app\" (or \"Add to Home Screen\") from the browser menu. Once installed, other apps usually open as a layer you can close to come straight back, instead of taking you away.": "请在 Chrome 或 Edge 中打开本页面，并从浏览器菜单中选择“安装应用”（或“添加到主屏幕”）。安装后，其他应用通常会以一层的形式打开，关闭即可直接返回，而不会把你带走。",
    "How other apps open": "其他应用的打开方式",
    "Open other apps in this same window": "在本窗口中打开其他应用",
    "On means the app loads in this window instead of a new tab, so your phone never switches away from MyHome Browser — press back to return here. Off opens a new tab, which on some phones hands you over to a separate browser. Try both and keep whichever returns more cleanly on your device.": "开启后，应用会在本窗口加载而不是新标签页，手机不会离开 MyHome Browser——按返回即可回到这里。关闭则会打开新标签页，在某些手机上会把你交给另一个浏览器。两种都试试，保留在你的设备上返回更顺畅的那种。",
    "{app} loads in this window, so your phone never switches away from MyHome Browser. Press back to return — everything here will be as you left it.": "{app} 会在本窗口加载，手机不会离开 MyHome Browser。按返回即可回来，这里的一切都保持原样。",
    "Notifications": "通知",
    "Allow notifications": "允许通知",
    "This browser can't show notifications.": "此浏览器无法显示通知。",
    "Notifications are allowed. They can only reach you while this app is still running in the background — once it's fully closed, nothing can wake it.": "已允许通知。只有在本应用仍在后台运行时才能送达；完全关闭后，没有任何方式能唤醒它。",
    "Notifications are blocked. Allow them for this app in your browser or phone settings, then come back.": "通知已被阻止。请在浏览器或手机设置中为本应用允许通知，然后再回来。",
    "Let this app notify you when scroll time runs out, a timer ends, or you pass your daily limit.": "在滚动时间结束、计时器结束或超出每日上限时通知你。",
    "Notifications are on": "通知已开启",
    "This is what they'll look like.": "通知就是这个样子。",
    "A minute before scroll time runs out": "滚动时间结束前一分钟",
    "When scroll switches back OFF": "滚动重新关闭时",
    "When the timer finishes": "计时器结束时",
    "Posture reminders": "姿势提醒",
    "When you pass your daily limit": "超出每日上限时",
    "Scroll time is nearly up": "滚动时间快到了",
    "About a minute left before scroll switches back OFF.": "大约还有一分钟，滚动就会重新关闭。",
    "You've passed your daily limit": "你已超出每日上限",
    "Today is over your {minutes} min goal.": "今天已超过你 {minutes} 分钟的目标。",
    "Playing here, without the feed": "在此播放，不打开信息流",
    "Showing this post here, without the feed": "在此显示该帖子，不打开信息流",
    "Close the app I opened when scroll time runs out": "滚动时间结束时关闭我打开的应用",
    "This is the only way the time limit reaches inside the other app: this app keeps hold of the tab it opened and shuts it when your time is up. It needs the setting above to be OFF, since there is no separate tab to close otherwise. The cost is that the site you open can see it was opened by this app and could push this page elsewhere — unlikely with the big sites, but not impossible, so turn this off if you would rather not.": "这是让时限触及另一个应用的唯一方式：本应用会一直握住它打开的标签页，时间到就把它关掉。需要上面的选项处于关闭状态，否则没有单独的标签页可关。代价是被打开的网站能知道是本应用打开的，并可能把本页面带到别处——大型网站几乎不会这么做，但并非不可能；若介意请关闭此项。",
    "Time's up — scroll is back OFF and the app you opened was closed": "时间到——滚动已关闭，你打开的应用也已关闭",
    "Waiting room": "等候室",
    "Shelf": "书架",
    "Take a breath": "喘口气",
    "This device can't keep records (private browsing, perhaps).": "此设备无法保存记录（可能处于无痕模式）。",
    "day streak": "连续天数",
    "pauses today": "今天的暂停",
    "minutes held": "累计分钟",
    "Hold a file from this device": "寄存本机的文件",
    "Held on this device: {used} of about {quota}": "本机已用：{used} / 约 {quota}",
    "Put it on the shelf": "放到书架上",
    "Shelved under {wall}": "已放到「{wall}」",
    "The shelf is full. Take something off it first.": "书架空间不足，请先拿掉一些。",
    "Couldn't put it on the shelf": "无法放到书架上",
    "This device is out of room for held files": "超出本机可存放的容量",
    "Couldn't hold that file": "无法寄存该文件",
    "That file is no longer on this device": "该文件已不在本机上",
    "Taken off the shelf": "已从书架取下",
    "No address": "（无网址）",
    "Something to look at": "无名寄存物",
    "Received 1 item from another app": "已从其他应用收到1个项目",
    "Received {n} items from another app": "已从其他应用收到{n}个项目",
    "Notice what just happened": "留意一下刚刚发生的事",
    "Scroll is OFF right now. Try swiping this page — it won't move. That small inconvenience is the whole point: it buys you a moment to choose, instead of scrolling out of habit.": "现在滚动是关闭的。试着划一下这个页面——它不会动。这一点小小的不便正是关键所在：它给你一个选择的瞬间，而不是出于习惯不停下滑。",
    "Got it — let me try": "明白了，我试试",
    "You said you wanted to get to \"{goal}\". When you're ready for it, tap \"Scroll OFF\" up top to turn scroll ON with a time limit — on your own terms.": "你说过想做到「{goal}」。准备好的时候，点击顶部的「Scroll OFF」，设定时限开启滚动——按你自己的方式。",
    "When you actually want something, tap \"Scroll OFF\" up top to turn scroll ON with a time limit — on your own terms.": "当你真的想要什么时，点击顶部的「Scroll OFF」，设定时限开启滚动——按你自己的方式。",
    "Step 1 of 5": "第1步（共5步）",
    "Step 2 of 5": "第2步（共5步）",
    "Step 3 of 5": "第3步（共5步）",
    "Step 4 of 5": "第4步（共5步）",
    "Step 5 of 5": "第5步（共5步）",
    "What do you want your time back for?": "你想把时间拿回来做什么？",
    "Not \"less phone\" — more of something else. Name one or two things you'd rather be spending it on. This app will remind you of them, not just stop you.": "不是「少玩手机」，而是把时间多花在别的事上。写下一两件你更想花时间做的事。这个应用会提醒你去做，而不只是阻止你。",
    "Skip for now": "暂时跳过",
    "Choose a time limit. When time is up, scroll switches back OFF and the app you opened from here is closed.": "选择时限。时间到后，滚动会重新关闭，从这里打开的应用也会被关闭。",
    "Choose a time limit. Scroll will switch back OFF automatically when time is up.": "请选择时间限制。时间到后会自动关闭滚动。",
    "None of this is about guilt. It's why a time limit and a PIN can do more than willpower alone.": "这些都不是为了让你有负罪感。正因如此，一个时间限制和一个 PIN，往往比单靠意志力更管用。",
    "These apps refuse to open inside this app, so they run in your normal browser where this app can't hold the scroll lock. Ticked apps only open once you've turned scroll ON with a time limit. Feed apps are ticked to start with — tick any others that eat your time.": "这些应用拒绝在本应用内打开，只能在你的常规浏览器中运行，而本应用无法在那里锁定滚动。勾选的应用只有在你填写时限并开启滚动之后才会打开。信息流应用默认已勾选，你也可以勾选其他消耗你时间的应用。",
    "Turn scroll ON with a time limit, and {app} will open.": "填写时限并开启滚动后，{app} 即可打开。",
    "Limits": "限制",
    "{time} left": "剩余 {time}",
    "Add a shelf": "添加书架",
    "One video or one post can show inside. A whole feed can't.": "单个视频或单条帖子可以显示在内，整个信息流不行。",
    "While scroll is OFF, the apps you ticked in Settings won't open.": "滚动关闭期间，你在设置中勾选的应用不会打开。",
    "When time runs out, scroll goes OFF and opened tabs close.": "时间到后，滚动会关闭，打开的标签页也会关掉。",
    "Held items wait before they open — longest for gated apps.": "寄存的内容要等一会儿才能打开，被设门槛的应用等最久。",
    "Open it after a while away and it asks what you came for.": "隔一段时间再打开时，会问你是来做什么的。",
    "Breaks offer what you set out to do, your shelf, or a saved word.": "休息会推荐你想做的事、书架，或收藏的词。",
    "Loosening a limit waits 24 hours. Tightening is immediate.": "放宽限制需等24小时，收紧则立即生效。",
    "Add to your home screen to receive from other apps' Share.": "添加到主屏幕后，就能从其他应用的分享中接收内容。",
    "Priority and Done decide what a break offers you next.": "优先级和「完成」决定下次休息推荐什么。",
    "Anything you feel like looking at, this holds for a moment first.": "想看的东西，会先在这里停一会儿再决定。",
    "Interrupt me and offer something better to be doing": "打断我，并推荐更值得做的事",
    "Order of the shelf items it reaches for": "从书架中选取的顺序",
    "The more of when, where and how long you fill in, the easier these are to actually start — and a break landing in that window reaches for them first.": "把时间、地点、时长填得越具体，就越容易真的开始；落在那个时段的休息也会优先推荐它。",
    "e.g. Practise guitar": "例如：练吉他",
    "Time of day": "时间段",
    "Days": "星期",
    "Where (optional)": "地点（可选）",
    "Any day": "任何一天",
    "Weekdays": "工作日",
    "Weekends": "周末",
    "{count} from your shelf": "书架 {count} 项",
    "{count} you set out to do": "自己定下的 {count} 项",
    "This week: {count}": "本周：{count}",
    "{weeks} weeks ago: {count}": "{weeks} 周前：{count}",
    "Morning": "早晨",
    "Afternoon": "白天",
    "Evening": "傍晚",
    "Late night": "深夜",
    "Any time": "任何时候",
    "done {count}x": "已做{count}次",
    "{idle} of your last {total} opens had nothing particular behind them.": "最近{total}次打开中，有{idle}次并没有具体的事。",
    "You finished {count} things these last two weeks.": "过去两周你完成了{count}项。",
    "You opened this without anything particular in mind.": "你并没有具体的事就打开了。",
    "Since you last looked": "自你上次查看以来",
    "Good": "好",
    "What did you come here for?": "你是来做什么的？",
    "No wrong answer — this is just so the reason is yours and not the phone's.": "没有标准答案——只是为了让理由属于你，而不是手机。",
    "To look something up": "来查点东西",
    "To get to something I set aside": "来看我先前存下的东西",
    "No particular reason": "没有具体的事",
    "When you open the app": "打开应用时",
    "Ask what I came here for": "问我是来做什么的",
    "Asked at most once every few minutes, never mid-task. Every answer is one tap. Answering \"no particular reason\" brings up something you said you wanted to do instead.": "最多每隔几分钟问一次，不会在你做事的中途打断。每个回答都只需一次点击。选择「没有具体的事」时，会拿出你说过想做的事。",
    "Stop asking what you came for": "不再询问你是来做什么的",
    "You said {promised}. It was {actual} — {over} of your last {total} went over.": "你说的是{promised}，实际是{actual}——最近{total}次里有{over}次超时。",
    "You went past your own limit on {over} of the last {total} times you left, by {avg} on average.": "最近{total}次离开中，有{over}次超过了你自己设的时间，平均超出{avg}。",
    "You came back within your own limit all {total} of the last times you left.": "最近{total}次你都在自己设的时间内回来了。",
    "If {trigger}, then {action}": "如果{trigger}，就{action}",
    "Saved. It takes effect in {wait} — you can cancel until then.": "已记录。将在{wait}后生效，在此之前随时可以取消。",
    "{change} — in {wait}": "{change} — 还有{wait}",
    "Cancel this change": "取消此更改",
    "Change cancelled": "已取消更改",
    "{text} · done {count}x": "{text} · 已做{count}次",
    "Remove this rule": "删除此约定",
    "How about this now?": "要不要现在做这个？",
    "Away from the screen": "离开屏幕",
    "Did it": "做了",
    "There's something you said you wanted to do.": "有一件你说过想做的事。",
    "Nice.": "很好。",
    "finished": "已完成",
    "You decided": "你自己定的",
    "Turn scroll ON anyway": "仍然开启滚动",
    "Set out what you want to get to, in Settings — then this offers those instead of just something to read.": "在设置中写下你想做的事，之后这里会优先推荐那些，而不只是待读的内容。",
    "What you want to get to": "你想做的事",
    "Your shelf only holds things you put off looking at. List what you actually want to spend the time on, and breaks will offer these first.": "书架里放的只是你推迟去看的东西。写下你真正想花时间做的事，休息时会优先推荐这些。",
    "Nothing here yet — breaks will fall back to your shelf, a saved word, and small away-from-screen nudges.": "这里还是空的——休息时会改用书架、收藏的词和一些离开屏幕的小提议。",
    "If this, then that": "如果……就……",
    "Decide now, while it's easy, what you'll do in the moment it isn't. These are read back to you when an app is held closed.": "趁现在还轻松，先决定难受的时候要怎么做。当某个应用被拦下时，会把这些念给你听。",
    "No rules yet.": "还没有约定。",
    "If… (e.g. it's past 11pm)": "如果……（例如：过了晚上11点）",
    "then… (e.g. I'll read one shelved thing)": "就……（例如：从书架里读一个）",
    "Cooling-off period": "冷静期",
    "Make loosening these settings wait 24 hours": "放宽这些设置需等待24小时",
    "The version of you that sets these limits and the version that wants past them are not in the room at the same time. Tightening anything still takes effect at once; only loosening waits, and you can cancel it the whole time.": "定下这些限制的你，和想突破它们的你，从来不会同时在场。收紧仍然立刻生效；只有放宽需要等待，而且期间随时可以取消。",
    "Waiting to take effect:": "等待生效：",
    "Turn forced breaks off": "关闭强制休息",
    "Make breaks less frequent": "拉长休息间隔",
    "Raise the scroll count before a break": "提高休息前的滚动次数",
    "Turn the cooling-off period off": "关闭冷静期",
    "Stop requiring scroll ON for those apps": "不再要求这些应用需开启滚动",
    "Remove apps from the scroll gate": "从滚动门槛中移除应用",
    "Added shelf {name}": "已添加书架 {name}",
    "File": "文件",
    "Later": "稍后再读",
    "Shelf space": "书架容量",
    "— empty shelf —": "— 空层 —",
    "Nothing on the shelf yet. Things you keep from the waiting room end up here.": "书架上还没有东西。从等候室保留下来的会放在这里。",
    "Shelf wall": "书架墙面",
    "Previous wall": "上一面",
    "Next wall": "下一面",
    "{kind} · {size}": "{kind} · {size}",
    "Drink a glass of water, slowly.": "慢慢喝一杯水。",
    "Look at the furthest thing out of the window.": "看看窗外最远的东西。",
    "Lift your shoulders, then let them drop. Three times.": "把肩膀耸起来，再放下。三次。",
    "Put three things on your desk back where they belong.": "把桌上的三样东西放回原位。",
    "Close your eyes and count three sounds you can hear.": "闭上眼睛，数出听到的三种声音。",
    "Stand up and walk once around the room.": "站起来，在房间里走一圈。",
    "Wash your hands. Notice the temperature of the water.": "洗个手，留意水的温度。",
    "Straighten your back and look up at the ceiling.": "挺直背，抬头看看天花板。",
    "Open a window or a curtain and let the air change.": "打开窗或窗帘，换换空气。",
    "Remember one good thing about today.": "想起今天一件好事。",
    "Feel where your feet are touching the floor.": "感受脚掌接触地面的感觉。",
    "Leave one line of a note for tomorrow's you.": "给明天的自己留一行字。",
    "Look into the distance and let your eyes go soft.": "望向远处，让眼睛放松。",
    "Breathe in deeply, breathe out slowly. That's enough.": "深深吸气，慢慢呼气。这样就够了。",
    "{used} / {total}": "{used} / {total}",
    "Close": "关闭",
    "Search the shelf…": "在书架中搜索…",
    "Nothing on the shelf matched.": "书架中没有匹配的内容。",
    "Priority": "优先级",
    "High": "高",
    "Low": "低",
    "Order on this shelf": "在此层的顺序",
    "Move earlier": "上移",
    "Move later": "下移",
    "Done": "已看完",
    "Not done after all": "改回未看完",
    "Marked as done": "已标记为看完",
    "Put back as unfinished": "已改回未看完",
    "Done ({count})": "已看完（{count}）",
    "Break reminders": "休息提醒",
    "This doesn't wait for you to remember. Whatever screen you're on, once you pass the limits below, a quiet banner appears (a short vibration, no sound) offering what you set out to do, something from your shelf, or a saved word — it doesn't block what you're doing.": "它不会等你想起来。无论你在哪个页面，一旦超过下面的限度，就会出现一条安静的横幅（短促振动，无声音），推荐你想做的事、书架里的一项，或一个收藏的词——不会打断你正在做的事。",
    "Every (minutes)": "每隔（分钟）",
    "Or after this many scrolls (0 = off)": "或滚动这么多次后（0 为关闭）",
    "Highest priority first": "优先级高的优先",
    "The order I arranged": "我自己排的顺序",
    "Time for a break": "该休息一下了",
    "From your shelf": "来自你的书架",
    "You've been at this for {minutes} minutes.": "你已经连续用了 {minutes} 分钟。",
    "You've scrolled {count} times since your last break.": "距上次休息你已滚动 {count} 次。",
    "There's nothing unfinished on your shelf yet. Put something there and this will offer it next time.": "书架上还没有未看完的东西。放一些进去，下次就会推荐它。",
    "Mark done": "标记为看完",
    "Open this": "打开这个",
    "Pick one of your own shelves to share.": "选择你自己的一个书架来分享。",
    "This shelf has nothing with a link on it yet.": "这个书架上还没有带链接的内容。",
    "My shelf: {name}": "我的书架：{name}",
    "Link copied. Send it to someone.": "链接已复制，发给别人吧。",
    "Couldn't share this shelf": "无法分享这个书架",
    "Someone shared a shelf with you — {count} things on it.": "有人和你分享了一个书架——上面有{count}项。",
    "Added {count} things to a new shelf": "已将{count}项添加到新书架",
    "Name this shelf": "给这个书架起个名字",
    "You finished {count} things these last two weeks — about {minutes} of your own choosing.": "过去两周你完成了{count}项——大约是你自己选择的{minutes}。",
    "A word from your dictionary": "来自你词典的一个词",
    "Nice to know": "了解一下",
    "Rename": "重命名",
    "Share this shelf": "分享这个书架",
    "How long it takes (minutes)": "需要多长时间（分钟）",
    "A shelf from someone": "来自某人的书架",
    "Taking it adds a new shelf of your own. Nothing you already have is touched.": "接受后会给你新增一个书架，不会影响你已有的任何内容。",
    "No thanks": "不用了",
    "Add to my shelves": "添加到我的书架",
    "e.g. 12": "例如 12",
    "Break's over. Nice.": "休息结束，做得好。",
    "{app} stays closed until your break ends.": "在休息结束之前，{app}保持关闭。",
    "You're on a break": "你正在休息",
    "Back to the break": "回到休息",
    "End the break early": "提前结束休息",
    "Break length": "休息时长",
    "Notify me even when this app is fully closed": "即使完全关闭应用也通知我",
    "This uses a small external server (not run by you) that holds only the alert times and text above — nothing about what you look at, your dictionary, or your shelf. It can't schedule a daily-limit alert this way, since that depends on watching today's usage as it happens; that one still only fires while this app is open.": "这会用到一个（不是你运营的）小型外部服务器，只保存上面提醒的时间和文字——不涉及你在看什么、你的词典或书架内容。每日限额提醒无法这样预约，因为它依赖实时观察今天的使用情况；这一项仍然只在应用打开时才会触发。",
    "Couldn't turn this on right now": "现在无法开启此功能",
    "Notifications on — tap to turn off": "通知已开启——点按可关闭",
    "Notifications off — tap to turn on": "通知已关闭——点按可开启",
    "Share anonymous usage events": "分享匿名使用事件",
    "Send anonymous usage events to this app's operator": "向本应用的运营者发送匿名使用事件",
    "Separate from notifications, and off by default. When on, this device sends named moments only — things like \"scroll turned on\", \"a shelf item was marked done\", or \"a dock app was opened\" — tagged with a random device id, never your name or account. It never includes what you searched, dictionary words, shelf titles, or URLs. The full list of what's sent lives in push-server/README.md. Turning this off stops it immediately.": "与通知功能相互独立，默认关闭。开启后，此设备只会发送预先命名的时刻——例如“滚动已开启”“书架项目已标记完成”或“打开了程序坞中的应用”——并标注一个随机设备ID，绝不包含你的姓名或账户。绝不包含你搜索过的内容、词典中的词、书架标题或网址。发送内容的完整列表见push-server/README.md。关闭此项会立即停止发送。",
    "Time's up — scroll switched back OFF. You kept your word.": "时间到，滚动已关闭。你说到做到了。",
    "Time's up — scroll is back OFF and the app you opened was closed. You kept your word.": "时间到——滚动已关闭，你打开的应用也已关闭。你说到做到了。",
    "Things you want to get to": "你想做的事",
    "Nothing here yet — add something and breaks will offer it first.": "这里还什么都没有——添加一项后，休息时会优先推荐它。",
    "+ Add something": "+ 添加",
    "Keep at it until (optional)": "坚持到（可选）",
    "+ Add a book": "+ 添加一本书",
    "Link (optional)": "链接（可选）",
    "{days} days left": "还剩 {days} 天",
    "1 day left": "还剩1天",
    "Last day": "最后一天",
    "Past your date": "已过设定日期",
    "Added to shelf {wall}": "已添加到书架 {wall}",
    "Anonymous usage events": "匿名使用事件",
    "This app's server is set up, so this device automatically sends named moments only — things like \"scroll turned on\", \"a shelf item was marked done\", or \"a dock app was opened\" — tagged with a random device id, never your name or account. It never includes what you searched, dictionary words, shelf titles, or URLs. There's no separate switch for this: as long as the server is configured, it's sent. The full list of what's sent lives in push-server/README.md.": "此应用的服务器已设置好，因此这台设备会自动发送指定的事件名称——例如\"滚动已开启\"\"书架项目标记为完成\"或\"打开了程序坞中的应用\"——并附带一个随机设备ID，绝不包含你的姓名或账号。绝不包含你搜索过的内容、词典中的单词、书架标题或网址。这项功能没有单独的开关：只要服务器已配置，就会发送。发送内容的完整列表见 push-server/README.md。",
    "Days (optional)": "星期（可选）",
    "The more of when, which days and how long you fill in, the easier these are to actually start — and a break landing in that window reaches for them first.": "关于何时、哪几天、需要多久，填写得越具体，就越容易真正开始行动——落在那个时间段的休息也会优先推荐它。",
    "Goals": "目标",
    "Not recorded": "未记录",
    "Not at all": "完全没有",
    "Barely": "几乎没有",
    "Minimum done": "完成最低限度",
    "Pretty good": "相当不错",
    "Nailed it!": "完美完成！",
    "Note": "备注",
    "Add something you want to work on, and it'll show up here to track.": "添加你想努力做的事情，它就会出现在这里供你记录。",
    "Date": "日期",
    "No records this month": "本月没有记录",
    "Diary saved": "日记已保存",
    "Active Days": "活跃天数",
    "last {days}d": "最近{days}天",
    "Avg Score": "平均分",
    "out of 5.0": "满分5.0",
    "Top Category": "最佳类别",
    "avg": "平均",
    "no data": "暂无数据",
    "Activity Heatmap": "活动热力图",
    "Category Balance": "类别平衡",
    "Progress Trend": "进度趋势",
    "Best Day of Week": "表现最佳的星期",
    "Streaks & Completion": "连续记录与完成率",
    "Level Distribution": "等级分布",
    "Need 2+ categories": "需要2个以上类别",
    "Streak": "连续",
    "Best": "最长",
    "Days done": "完成天数",
    "Rate": "完成率",
    "History": "历史",
    "Diary": "日记",
    "Stats": "统计",
    "7 Days": "7天",
    "30 Days": "30天",
    "90 Days": "90天",
    "Previous day": "前一天",
    "Next day": "后一天",
    "Close note": "关闭备注",
    "What happened today? Thoughts, feelings, reflections…": "今天发生了什么？想法、感受、反思……",
    "Add a note for this day…": "为这一天添加备注……",
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
    "Add your own site": "Agrega tu propio sitio",
    "Name": "Nombre",
    "Website address": "Dirección del sitio web",
    "Order": "Orden",
    "Use the arrows to change the order apps appear in on your home screen.": "Usa las flechas para cambiar el orden en que aparecen las apps en tu pantalla de inicio.",
    "Remove {app}": "Quitar {app}",
    "Check some apps above to arrange their order.": "Marca algunas apps arriba para ordenarlas.",
    "Move {app} earlier": "Mover {app} antes",
    "Move {app} later": "Mover {app} después",
    "Enter a name and a website address": "Escribe un nombre y una dirección de sitio web",
    "Enter a valid website address": "Escribe una dirección de sitio web válida",
    "Added {app}": "Se agregó {app}",
    "The list of apps installed on your phone can't be read automatically from a web page, so pick from the candidates below instead.": "Una página web no puede leer automáticamente las apps instaladas en tu móvil, así que elige entre las opciones de abajo.",
    "Add up to 10 apps from \"Edit Apps\"": "Añade hasta 10 apps desde «Editar apps»",
    "Open this app?": "¿Abrir esta app?",
    "Open": "Abrir",
    "Cancel": "Cancelar",
    "Turn scroll ON": "Activar el scroll",
    "Time limit": "Límite de tiempo",
    "4-digit PIN": "PIN de 4 dígitos",
    "Turn ON": "Activar",
    "Unlock with Face ID / Fingerprint": "Desbloquear con Face ID / huella",
    "Choose your language": "Elige tu idioma",
    "App Lock PIN (opens the app)": "PIN de bloqueo (para abrir la app)",
    "Scroll PIN (turns scroll ON)": "PIN de scroll (para activarlo)",
    "Security question": "Pregunta de seguridad",
    "What was your first pet's name?": "¿Cómo se llamaba tu primera mascota?",
    "What is your mother's maiden name?": "¿Cuál es el apellido de soltera de tu madre?",
    "What was the name of your first school?": "¿Cómo se llamaba tu primera escuela?",
    "What city were you born in?": "¿En qué ciudad naciste?",
    "What was your childhood nickname?": "¿Cuál era tu apodo de niño?",
    "What is your favorite food?": "¿Cuál es tu comida favorita?",
    "Answer": "Respuesta",
    "Save & Continue": "Guardar y continuar",
    "Which social media do you use?": "¿Qué redes sociales usas?",
    "Choose the ones you want quick access to from your dock.": "Elige las que quieras tener a mano en el dock.",
    "Finish setup": "Finalizar configuración",
    "Settings": "Ajustes",
    "Close settings": "Cerrar ajustes",
    "Open settings": "Abrir ajustes",
    "How to use this app": "Cómo usar esta app",
    "Set a timer": "Poner un temporizador",
    "Look & Feel": "Aspecto",
    "PINs & Unlock": "PIN y desbloqueo",
    "Appearance": "Apariencia",
    "Green": "Verde",
    "Blue": "Azul",
    "Accent color": "Color de acento",
    "Background color": "Color de fondo",
    "Choose background image": "Elegir imagen de fondo",
    "Remove image": "Quitar imagen",
    "Reset colors": "Restablecer colores",
    "Purple": "Morado",
    "Orange": "Naranja",
    "Pink": "Rosa",
    "Dark": "Oscuro",
    "Home Screen Icons": "Iconos de la pantalla de inicio",
    "Icon size": "Tamaño del icono",
    "Small": "Pequeño",
    "Medium": "Mediano",
    "Large": "Grande",
    "Icon shape": "Forma del icono",
    "Rounded square": "Cuadrado redondeado",
    "Circle": "Círculo",
    "Show app names under icons": "Mostrar el nombre de las apps bajo los iconos",
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
    "{time} left — the app will lock when this reaches 0:00.": "Quedan {time}: la app se bloqueará al llegar a 0:00.",
    "{time} left. This is just a timer; nothing else happens at 0:00.": "Quedan {time}. Es solo un temporizador; no pasa nada más al llegar a 0:00.",
    "{minutes} min": "{minutes} min",
    "Remove \"{name}\"": "Eliminar «{name}»",
    "{label} ({minutes} min)": "{label} ({minutes} min)",
    "{label} · {index} of {total}": "{label} · {index} de {total}",
    "Timer started — app locks in {label}": "Temporizador iniciado: la app se bloquea en {label}",
    "Timer started for {label}": "Temporizador iniciado para {label}",
    "Open {app}?": "¿Abrir {app}?",
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
    "Blocked: this looks like an ad or tracking domain": "Bloqueado: parece un dominio publicitario o de rastreo",
    "Close tab \"{title}\"": "Cerrar pestaña \"{title}\"",
    "Insights": "Estadísticas",
    "Search or enter a website above to start browsing.": "Busca o escribe un sitio web arriba para empezar a navegar.",
    "Open insights": "Abrir estadísticas",
    "Search or go to address": "Buscar o ir a una dirección",
    "Search or enter address": "Buscar o escribir una dirección",
    "Basic search": "Búsqueda básica",
    "Open in browser": "Abrir en el navegador",
    "Close insights": "Cerrar estadísticas",
    "Browsing": "Navegación",
    "Still finding what you needed? You've been browsing for {minutes} minutes.": "¿Ya encontraste lo que buscabas? Llevas {minutes} minutos navegando.",
    "Check in with me every 10 minutes while I'm browsing a tab": "Avísame cada 10 minutos mientras navego por una pestaña",
    "Still browsing": "Sigues navegando",
    "Keep browsing": "Seguir navegando",
    "{domain} doesn't allow embedding, so it opened in your browser instead.": "{domain} no permite mostrarse dentro de otra página, así que se abrió en tu navegador.",
    "Saved": "Guardado",
    "Edit": "Editar",
    "Remove": "Quitar",
    "Title": "Título",
    "Dictionary": "Diccionario",
    "Open dictionary": "Abrir diccionario",
    "Close dictionary": "Cerrar diccionario",
    "Your Dictionary": "Tu diccionario",
    "Search your dictionary…": "Buscar en tu diccionario…",
    "Filter by group": "Filtrar por grupo",
    "Sort words": "Ordenar palabras",
    "My order": "Mi orden",
    "A to Z": "De la A a la Z",
    "Newest first": "Más recientes primero",
    "Oldest first": "Más antiguas primero",
    "Manage groups": "Gestionar grupos",
    "+ Add a word": "+ Añadir palabra",
    "Word": "Palabra",
    "Meaning / note": "Significado / nota",
    "Group": "Grupo",
    "‹ Back to dictionary": "‹ Volver al diccionario",
    "Group to edit": "Grupo a editar",
    "Rename this group": "Cambiar el nombre de este grupo",
    "Delete this group": "Eliminar este grupo",
    "Deleting a group keeps its words — they move to the first group.": "Al eliminar un grupo, sus palabras se conservan: pasan al primer grupo.",
    "Add a new group": "Crear un grupo nuevo",
    "New group": "Grupo nuevo",
    "+ Add group": "+ Añadir grupo",
    "Ungrouped": "Sin grupo",
    "All groups": "Todos los grupos",
    "{shown} / {total}": "{shown} / {total}",
    "No words saved yet. Look a word up, then tap the star to save it here.": "Aún no hay palabras guardadas. Busca algo y toca la estrella para guardarlo aquí.",
    "Import…": "Importar…",
    "Each row becomes one word: first column the word, second the meaning, third an optional link. A header row is detected and skipped automatically.": "Cada fila se convierte en una palabra: la primera columna es la palabra, la segunda el significado, la tercera un enlace opcional. Se detecta y omite automáticamente una fila de encabezado.",
    "Excel (.xlsx) or CSV file": "Archivo de Excel (.xlsx) o CSV",
    "…or a Google Sheets share link": "…o un enlace para compartir de Google Sheets",
    "Fetch": "Obtener",
    "Add into group": "Añadir al grupo",
    "Add these words": "Añadir estas palabras",
    "Reading…": "Leyendo…",
    "Fetching…": "Obteniendo…",
    "Couldn't find any words in that file.": "No se encontraron palabras en ese archivo.",
    "Found {count} words in {source}.": "Se encontraron {count} palabras en {source}.",
    "the sheet": "la hoja",
    "Couldn't read that file.": "No se pudo leer ese archivo.",
    "That doesn't look like a Google Sheets link.": "Eso no parece un enlace de Google Sheets.",
    "Couldn't fetch that sheet. Make sure it's shared as \"Anyone with the link can view\".": "No se pudo obtener esa hoja. Verifica que esté compartida como \"Cualquier persona con el enlace puede verla\".",
    "…and {count} more": "…y {count} más",
    "Nothing new to add.": "No hay nada nuevo que añadir.",
    "Added {count} words to your dictionary": "Se añadieron {count} palabras a tu diccionario",
    "Add these {count} words": "Añadir estas {count} palabras",
    "No words matched.": "Sin resultados.",
    "Move {word} up": "Mover {word} hacia arriba",
    "Move {word} down": "Mover {word} hacia abajo",
    "Group: {group}": "Grupo: {group}",
    "Saved {date}": "Guardado el {date}",
    "Group {n}": "Grupo {n}",
    "Please enter a word": "Escribe una palabra",
    "You need at least one group.": "Necesitas al menos un grupo.",
    "Save to your dictionary": "Guardar en tu diccionario",
    "Remove from your dictionary": "Quitar de tu diccionario",
    "Added to your dictionary": "Guardado en tu diccionario",
    "Removed from your dictionary": "Quitado de tu diccionario",
    "Select a question (optional)": "Elige una pregunta (opcional)",
    "Set up your PINs": "Configura tus PIN",
    "A PIN to open MyHome Browser, and a separate PIN to turn scroll ON — both required, so the friction this app relies on can't quietly default to something guessable. You can switch to Face ID / Fingerprint instead later, in Settings.": "Un PIN para abrir MyHome Browser y otro distinto para activar el scroll — ambos obligatorios, para que la fricción de la que depende esta app no termine siendo, en silencio, algo fácil de adivinar. Más adelante puedes cambiar a Face ID / huella en Ajustes.",
    "Select a question": "Elige una pregunta",
    "Choose a security question and answer it, so you can reset your PIN if you forget it": "Elige una pregunta de seguridad y respóndela, para poder restablecer tu PIN si lo olvidas.",
    "Search results": "Resultados de búsqueda",
    "Close search results": "Cerrar resultados de búsqueda",
    "Searching…": "Buscando…",
    "Search failed: {message}": "Error en la búsqueda: {message}",
    "No results found.": "No se encontraron resultados.",
    "Search results for \"{query}\"": "Resultados de búsqueda de \"{query}\"",
    "Typed search terms show Wikipedia results as a list inside the app — no setup needed, but only Wikipedia articles, not the wider web. Typing the address of a big site that refuses to be shown inside another page (Google, Instagram, Facebook, X, TikTok, YouTube, DuckDuckGo) opens it in your regular browser instead — that's the site's own policy, not something this app can change.": "Los términos de búsqueda escritos muestran resultados de Wikipedia como una lista dentro de la app — no requiere configuración, pero solo busca artículos de Wikipedia, no la web en general. Escribir la dirección de un sitio grande que se niega a mostrarse dentro de otra página (Google, Instagram, Facebook, X, TikTok, YouTube, DuckDuckGo) lo abre en tu navegador habitual — es la política del propio sitio, no algo que esta app pueda cambiar.",
    "Ad blocking only stops known ad domains, not ads on a page you already opened.": "El bloqueo de anuncios solo detiene dominios de anuncios conocidos, no los anuncios de una página que ya abriste.",
    "Save with your own note": "Guardar con mi propia nota",
    "Your own note": "Tu propia nota",
    "Search shows Wikipedia results here. An address opens as a tab.": "La búsqueda muestra resultados de Wikipedia aquí. Una dirección se abre como pestaña.",
    "Tap the star on a tab, or on a search result, to save it.": "Toca la estrella de una pestaña o resultado para guardarlo.",
    "The pencil on a search result lets you write your own note.": "El lápiz de un resultado te permite escribir tu propia nota.",
    "Scroll is OFF": "El scroll está desactivado",
    "These apps open in your normal browser, where this app can't keep scroll locked — so while scroll is OFF they stay closed.": "Estas apps se abren en tu navegador normal, donde esta app no puede mantener bloqueado el scroll, así que permanecen cerradas mientras el scroll está desactivado.",
    "Not now": "Ahora no",
    "Install to your home screen": "Instalar en tu pantalla de inicio",
    "Install": "Instalar",
    "Installed to your home screen": "Instalado en tu pantalla de inicio",
    "Apps that need scroll ON": "Apps que necesitan el scroll activado",
    "Don't let the apps below open while scroll is OFF": "No abrir las apps de abajo mientras el scroll está desactivado",
    "{app} opens in a separate browser tab, so you'll leave MyHome Browser and have to find your way back. Installing this app to your home screen usually improves that — see Settings.": "{app} se abre en una pestaña aparte del navegador, así que saldrás de MyHome Browser y tendrás que encontrar el camino de vuelta. Instalar esta app en tu pantalla de inicio suele mejorarlo; míralo en Ajustes.",
    "Installed. Other apps still open outside this app, but most phones now show them as a layer you can close to come straight back rather than switching you away. Either way your tabs, dictionary and scroll state are kept. Other apps' Share button can now send links, text and files straight into your Waiting room, too.": "Instalado. Las otras apps siguen abriéndose fuera de esta app, pero la mayoría de los móviles ahora las muestran como una capa que puedes cerrar para volver directamente, en lugar de cambiarte de app. En cualquier caso, tus pestañas, el diccionario y el estado del scroll se conservan. El botón Compartir de otras apps ahora también puede enviar enlaces, texto y archivos directamente a tu sala de espera.",
    "Right now other apps open in a separate browser tab, so you leave this app and have to find your way back. Installing it to your home screen usually makes them open as a closable layer instead — the exact behaviour is your phone's choice, not this app's.": "Ahora mismo las otras apps se abren en una pestaña aparte del navegador, así que sales de esta app y tienes que encontrar el camino de vuelta. Instalarla en tu pantalla de inicio suele hacer que se abran como una capa que puedes cerrar; el comportamiento exacto lo decide tu móvil, no esta app.",
    "Right now other apps open in a separate browser tab, so you leave this app. In Safari, tap the Share button and choose \"Add to Home Screen\" — that usually helps, though iOS sometimes still switches you over to Safari.": "Ahora mismo las otras apps se abren en una pestaña aparte del navegador, así que sales de esta app. En Safari, toca el botón Compartir y elige «Añadir a pantalla de inicio»; suele ayudar, aunque iOS a veces te sigue llevando a Safari.",
    "Open this page in Chrome or Edge and use \"Install app\" (or \"Add to Home Screen\") from the browser menu. Once installed, other apps usually open as a layer you can close to come straight back, instead of taking you away.": "Abre esta página en Chrome o Edge y usa «Instalar aplicación» (o «Añadir a pantalla de inicio») en el menú del navegador. Una vez instalada, las otras apps suelen abrirse como una capa que puedes cerrar para volver directamente, en lugar de llevarte fuera.",
    "How other apps open": "Cómo se abren las otras apps",
    "Open other apps in this same window": "Abrir las otras apps en esta misma ventana",
    "On means the app loads in this window instead of a new tab, so your phone never switches away from MyHome Browser — press back to return here. Off opens a new tab, which on some phones hands you over to a separate browser. Try both and keep whichever returns more cleanly on your device.": "Activado, la app se carga en esta ventana en lugar de una pestaña nueva, así que tu teléfono nunca sale de MyHome Browser; pulsa atrás para volver aquí. Desactivado abre una pestaña nueva, que en algunos teléfonos te entrega a un navegador aparte. Prueba las dos y quédate con la que vuelva mejor en tu dispositivo.",
    "{app} loads in this window, so your phone never switches away from MyHome Browser. Press back to return — everything here will be as you left it.": "{app} se carga en esta ventana, así que tu teléfono no sale de MyHome Browser. Pulsa atrás para volver: todo estará como lo dejaste.",
    "Notifications": "Notificaciones",
    "Allow notifications": "Permitir notificaciones",
    "This browser can't show notifications.": "Este navegador no puede mostrar notificaciones.",
    "Notifications are allowed. They can only reach you while this app is still running in the background — once it's fully closed, nothing can wake it.": "Notificaciones permitidas. Solo llegan mientras esta app sigue funcionando en segundo plano; una vez cerrada del todo, nada puede despertarla.",
    "Notifications are blocked. Allow them for this app in your browser or phone settings, then come back.": "Las notificaciones están bloqueadas. Permítelas para esta app en los ajustes del navegador o del teléfono y vuelve aquí.",
    "Let this app notify you when scroll time runs out, a timer ends, or you pass your daily limit.": "Deja que esta app te avise cuando se acabe el tiempo de scroll, termine un temporizador o superes tu límite diario.",
    "Notifications are on": "Notificaciones activadas",
    "This is what they'll look like.": "Así se verán.",
    "A minute before scroll time runs out": "Un minuto antes de que se acabe el tiempo de scroll",
    "When scroll switches back OFF": "Cuando el scroll se desactive",
    "When the timer finishes": "Cuando termine el temporizador",
    "Posture reminders": "Recordatorios de postura",
    "When you pass your daily limit": "Cuando superes tu límite diario",
    "Scroll time is nearly up": "El tiempo de scroll está por acabarse",
    "About a minute left before scroll switches back OFF.": "Queda alrededor de un minuto para que el scroll se desactive.",
    "You've passed your daily limit": "Has superado tu límite diario",
    "Today is over your {minutes} min goal.": "Hoy has superado tu meta de {minutes} min.",
    "Playing here, without the feed": "Reproduciendo aquí, sin el feed",
    "Showing this post here, without the feed": "Mostrando esta publicación aquí, sin el feed",
    "Close the app I opened when scroll time runs out": "Cerrar la app que abrí cuando se acabe el tiempo de scroll",
    "This is the only way the time limit reaches inside the other app: this app keeps hold of the tab it opened and shuts it when your time is up. It needs the setting above to be OFF, since there is no separate tab to close otherwise. The cost is that the site you open can see it was opened by this app and could push this page elsewhere — unlikely with the big sites, but not impossible, so turn this off if you would rather not.": "Es la única forma de que el límite de tiempo llegue dentro de la otra app: esta app conserva la pestaña que abrió y la cierra cuando se acaba tu tiempo. Requiere que la opción de arriba esté desactivada, porque si no, no hay una pestaña aparte que cerrar. A cambio, el sitio abierto puede ver que lo abrió esta app y podría llevar esta página a otro lado; improbable con los sitios grandes, pero no imposible, así que desactívalo si lo prefieres.",
    "Time's up — scroll is back OFF and the app you opened was closed": "Se acabó el tiempo: el scroll se desactivó y la app que abriste se cerró",
    "Waiting room": "Sala de espera",
    "Shelf": "Estantería",
    "Take a breath": "Toma aire",
    "This device can't keep records (private browsing, perhaps).": "Este dispositivo no puede guardar registros (quizá navegación privada).",
    "day streak": "días seguidos",
    "pauses today": "pausas hoy",
    "minutes held": "minutos guardados",
    "Hold a file from this device": "Guardar un archivo de este dispositivo",
    "Held on this device: {used} of about {quota}": "Guardado en este dispositivo: {used} de unos {quota}",
    "Put it on the shelf": "Ponerlo en la estantería",
    "Shelved under {wall}": "Guardado en {wall}",
    "The shelf is full. Take something off it first.": "La estantería está llena. Quita algo primero.",
    "Couldn't put it on the shelf": "No se pudo poner en la estantería",
    "This device is out of room for held files": "Este dispositivo no tiene más espacio para archivos guardados",
    "Couldn't hold that file": "No se pudo guardar ese archivo",
    "That file is no longer on this device": "Ese archivo ya no está en el dispositivo",
    "Taken off the shelf": "Retirado de la estantería",
    "No address": "(sin dirección)",
    "Something to look at": "Algo que mirar",
    "Received 1 item from another app": "Se recibió 1 elemento de otra aplicación",
    "Received {n} items from another app": "Se recibieron {n} elementos de otra aplicación",
    "Notice what just happened": "Fíjate en lo que acaba de pasar",
    "Scroll is OFF right now. Try swiping this page — it won't move. That small inconvenience is the whole point: it buys you a moment to choose, instead of scrolling out of habit.": "El scroll está desactivado ahora mismo. Intenta deslizar esta página: no se moverá. Esa pequeña molestia es justo el punto: te da un instante para elegir, en vez de deslizar por costumbre.",
    "Got it — let me try": "Entendido, déjame probarlo",
    "You said you wanted to get to \"{goal}\". When you're ready for it, tap \"Scroll OFF\" up top to turn scroll ON with a time limit — on your own terms.": "Dijiste que querías llegar a «{goal}». Cuando estés listo, toca «Scroll OFF» arriba para activar el scroll con un límite de tiempo, en tus propios términos.",
    "When you actually want something, tap \"Scroll OFF\" up top to turn scroll ON with a time limit — on your own terms.": "Cuando de verdad quieras algo, toca «Scroll OFF» arriba para activar el scroll con un límite de tiempo, en tus propios términos.",
    "Step 1 of 5": "Paso 1 de 5",
    "Step 2 of 5": "Paso 2 de 5",
    "Step 3 of 5": "Paso 3 de 5",
    "Step 4 of 5": "Paso 4 de 5",
    "Step 5 of 5": "Paso 5 de 5",
    "What do you want your time back for?": "¿Para qué quieres recuperar tu tiempo?",
    "Not \"less phone\" — more of something else. Name one or two things you'd rather be spending it on. This app will remind you of them, not just stop you.": "No se trata de «menos móvil», sino de más de otra cosa. Nombra una o dos cosas en las que preferirías pasar ese tiempo. Esta app te las recordará, no solo te detendrá.",
    "Skip for now": "Saltar por ahora",
    "Choose a time limit. When time is up, scroll switches back OFF and the app you opened from here is closed.": "Elige un límite de tiempo. Al acabarse, el scroll se desactiva y la app abierta desde aquí se cierra.",
    "Choose a time limit. Scroll will switch back OFF automatically when time is up.": "Elige un límite de tiempo. El scroll se desactivará solo cuando se acabe el tiempo.",
    "None of this is about guilt. It's why a time limit and a PIN can do more than willpower alone.": "Nada de esto busca hacerte sentir culpable. Por eso un límite de tiempo y un PIN pueden ayudar más que la fuerza de voluntad por sí sola.",
    "These apps refuse to open inside this app, so they run in your normal browser where this app can't hold the scroll lock. Ticked apps only open once you've turned scroll ON with a time limit. Feed apps are ticked to start with — tick any others that eat your time.": "Estas apps se niegan a abrirse dentro de esta app, así que funcionan en tu navegador normal, donde esta app no puede mantener bloqueado el scroll. Las apps marcadas solo se abren después de que actives el scroll con un límite de tiempo. Las apps de feed vienen marcadas de inicio; marca cualquier otra que te coma el tiempo.",
    "Turn scroll ON with a time limit, and {app} will open.": "Activa el scroll con un límite de tiempo y {app} se abrirá.",
    "Limits": "Límites",
    "{time} left": "Quedan {time}",
    "Add a shelf": "Añadir un estante",
    "One video or one post can show inside. A whole feed can't.": "Un vídeo o una publicación sí caben dentro. Un feed entero no.",
    "While scroll is OFF, the apps you ticked in Settings won't open.": "Con el scroll desactivado, las apps marcadas no se abren.",
    "When time runs out, scroll goes OFF and opened tabs close.": "Al acabarse el tiempo, el scroll se apaga y las pestañas se cierran.",
    "Held items wait before they open — longest for gated apps.": "Lo retenido espera antes de abrirse; más las apps filtradas.",
    "Open it after a while away and it asks what you came for.": "Si lo abres tras un rato, te pregunta a qué vienes.",
    "Breaks offer what you set out to do, your shelf, or a saved word.": "Las pausas ofrecen lo que te propusiste, tu estante o una palabra guardada.",
    "Loosening a limit waits 24 hours. Tightening is immediate.": "Aflojar un límite espera 24 horas. Endurecerlo es inmediato.",
    "Add to your home screen to receive from other apps' Share.": "Añádelo a la pantalla de inicio para recibir desde Compartir.",
    "Priority and Done decide what a break offers you next.": "La prioridad y Hecho deciden qué te ofrecerá la próxima pausa.",
    "Anything you feel like looking at, this holds for a moment first.": "Lo que te apetezca mirar, esto lo retiene un momento primero.",
    "Interrupt me and offer something better to be doing": "Interrumpirme y ofrecerme algo mejor que hacer",
    "Order of the shelf items it reaches for": "Orden de los elementos del estante",
    "The more of when, where and how long you fill in, the easier these are to actually start — and a break landing in that window reaches for them first.": "Cuanto más rellenes cuándo, dónde y cuánto, más fácil es empezarlas; y una pausa en esa franja las ofrecerá primero.",
    "e.g. Practise guitar": "p. ej. Practicar guitarra",
    "Time of day": "Franja del día",
    "Days": "Días",
    "Where (optional)": "Dónde (opcional)",
    "Any day": "Cualquier día",
    "Weekdays": "Entre semana",
    "Weekends": "Fines de semana",
    "{count} from your shelf": "{count} de tu estante",
    "{count} you set out to do": "{count} que te propusiste",
    "This week: {count}": "Esta semana: {count}",
    "{weeks} weeks ago: {count}": "Hace {weeks} semanas: {count}",
    "Morning": "Mañana",
    "Afternoon": "Tarde",
    "Evening": "Noche",
    "Late night": "Madrugada",
    "Any time": "Cualquier momento",
    "done {count}x": "hecho {count} veces",
    "{idle} of your last {total} opens had nothing particular behind them.": "{idle} de tus últimas {total} aperturas no tenían nada concreto detrás.",
    "You finished {count} things these last two weeks.": "Has terminado {count} cosas estas dos últimas semanas.",
    "You opened this without anything particular in mind.": "Abriste esto sin nada concreto en mente.",
    "Since you last looked": "Desde la última vez",
    "Good": "Bien",
    "What did you come here for?": "¿A qué has venido?",
    "No wrong answer — this is just so the reason is yours and not the phone's.": "No hay respuesta incorrecta: solo es para que el motivo sea tuyo y no del teléfono.",
    "To look something up": "A buscar algo",
    "To get to something I set aside": "A por algo que dejé apartado",
    "No particular reason": "Sin motivo concreto",
    "When you open the app": "Al abrir la app",
    "Ask what I came here for": "Preguntarme a qué he venido",
    "Asked at most once every few minutes, never mid-task. Every answer is one tap. Answering \"no particular reason\" brings up something you said you wanted to do instead.": "Se pregunta como mucho cada pocos minutos, nunca a mitad de una tarea. Cada respuesta es un toque. Responder «sin motivo concreto» saca algo que dijiste que querías hacer.",
    "Stop asking what you came for": "Dejar de preguntar a qué vienes",
    "You said {promised}. It was {actual} — {over} of your last {total} went over.": "Dijiste {promised}. Fueron {actual}: {over} de tus últimas {total} veces se pasaron.",
    "You went past your own limit on {over} of the last {total} times you left, by {avg} on average.": "Te pasaste de tu propio límite en {over} de las últimas {total} salidas, por {avg} de media.",
    "You came back within your own limit all {total} of the last times you left.": "Volviste dentro de tu propio límite las {total} últimas veces.",
    "If {trigger}, then {action}": "Si {trigger}, entonces {action}",
    "Saved. It takes effect in {wait} — you can cancel until then.": "Guardado. Se aplicará en {wait}; puedes cancelarlo hasta entonces.",
    "{change} — in {wait}": "{change} — en {wait}",
    "Cancel this change": "Cancelar este cambio",
    "Change cancelled": "Cambio cancelado",
    "{text} · done {count}x": "{text} · hecho {count} veces",
    "Remove this rule": "Eliminar esta regla",
    "How about this now?": "¿Qué tal esto ahora?",
    "Away from the screen": "Lejos de la pantalla",
    "Did it": "Hecho",
    "There's something you said you wanted to do.": "Hay algo que dijiste que querías hacer.",
    "Nice.": "Bien.",
    "finished": "hechas",
    "You decided": "Tú decidiste",
    "Turn scroll ON anyway": "Activar el scroll de todos modos",
    "Set out what you want to get to, in Settings — then this offers those instead of just something to read.": "Anota en Ajustes lo que quieres hacer y esto te ofrecerá eso en vez de solo algo que leer.",
    "What you want to get to": "Lo que quieres hacer",
    "Your shelf only holds things you put off looking at. List what you actually want to spend the time on, and breaks will offer these first.": "Tu estante solo guarda lo que dejaste para después. Anota en qué quieres gastar el tiempo de verdad y las pausas te ofrecerán esto primero.",
    "Nothing here yet — breaks will fall back to your shelf, a saved word, and small away-from-screen nudges.": "Aún no hay nada: las pausas recurrirán a tu estante, a una palabra guardada y a pequeños empujones lejos de la pantalla.",
    "If this, then that": "Si esto, entonces aquello",
    "Decide now, while it's easy, what you'll do in the moment it isn't. These are read back to you when an app is held closed.": "Decide ahora, mientras es fácil, qué harás cuando no lo sea. Se te leerán cuando una app quede cerrada.",
    "No rules yet.": "Aún no hay reglas.",
    "If… (e.g. it's past 11pm)": "Si… (p. ej. pasan de las 23:00)",
    "then… (e.g. I'll read one shelved thing)": "entonces… (p. ej. leeré algo de la estantería)",
    "Cooling-off period": "Periodo de reflexión",
    "Make loosening these settings wait 24 hours": "Que aflojar estos ajustes espere 24 horas",
    "The version of you that sets these limits and the version that wants past them are not in the room at the same time. Tightening anything still takes effect at once; only loosening waits, and you can cancel it the whole time.": "La versión de ti que pone estos límites y la que quiere saltárselos nunca están en la sala a la vez. Endurecer algo sigue aplicándose al instante; solo aflojar espera, y puedes cancelarlo en todo momento.",
    "Waiting to take effect:": "Pendiente de aplicarse:",
    "Turn forced breaks off": "Desactivar las pausas forzadas",
    "Make breaks less frequent": "Espaciar más las pausas",
    "Raise the scroll count before a break": "Subir el número de scrolls antes de una pausa",
    "Turn the cooling-off period off": "Desactivar el periodo de reflexión",
    "Stop requiring scroll ON for those apps": "Dejar de exigir scroll activado para esas apps",
    "Remove apps from the scroll gate": "Quitar apps del filtro de scroll",
    "Added shelf {name}": "Estante {name} añadido",
    "File": "Archivo",
    "Later": "Más tarde",
    "Shelf space": "Espacio de la estantería",
    "— empty shelf —": "— balda vacía —",
    "Nothing on the shelf yet. Things you keep from the waiting room end up here.": "Aún no hay nada. Lo que guardes desde la sala de espera acaba aquí.",
    "Shelf wall": "Pared de la estantería",
    "Previous wall": "Pared anterior",
    "Next wall": "Pared siguiente",
    "{kind} · {size}": "{kind} · {size}",
    "Drink a glass of water, slowly.": "Bebe un vaso de agua, despacio.",
    "Look at the furthest thing out of the window.": "Mira lo más lejano que veas por la ventana.",
    "Lift your shoulders, then let them drop. Three times.": "Sube los hombros y déjalos caer. Tres veces.",
    "Put three things on your desk back where they belong.": "Devuelve tres cosas del escritorio a su sitio.",
    "Close your eyes and count three sounds you can hear.": "Cierra los ojos y cuenta tres sonidos.",
    "Stand up and walk once around the room.": "Levántate y da una vuelta por la habitación.",
    "Wash your hands. Notice the temperature of the water.": "Lávate las manos. Nota la temperatura del agua.",
    "Straighten your back and look up at the ceiling.": "Endereza la espalda y mira al techo.",
    "Open a window or a curtain and let the air change.": "Abre una ventana o cortina y renueva el aire.",
    "Remember one good thing about today.": "Recuerda una cosa buena de hoy.",
    "Feel where your feet are touching the floor.": "Siente dónde tocan tus pies el suelo.",
    "Leave one line of a note for tomorrow's you.": "Deja una línea de nota para el tú de mañana.",
    "Look into the distance and let your eyes go soft.": "Mira a lo lejos y afloja la vista.",
    "Breathe in deeply, breathe out slowly. That's enough.": "Inspira hondo, espira despacio. Con eso basta.",
    "{used} / {total}": "{used} / {total}",
    "Close": "Cerrar",
    "Search the shelf…": "Buscar en la estantería…",
    "Nothing on the shelf matched.": "Nada en la estantería coincide.",
    "Priority": "Prioridad",
    "High": "Alta",
    "Low": "Baja",
    "Order on this shelf": "Orden en esta balda",
    "Move earlier": "Subir",
    "Move later": "Bajar",
    "Done": "Hecho",
    "Not done after all": "Marcar como no hecho",
    "Marked as done": "Marcado como hecho",
    "Put back as unfinished": "Vuelve a estar pendiente",
    "Done ({count})": "Hechos ({count})",
    "Break reminders": "Recordatorios de pausa",
    "This doesn't wait for you to remember. Whatever screen you're on, once you pass the limits below, a quiet banner appears (a short vibration, no sound) offering what you set out to do, something from your shelf, or a saved word — it doesn't block what you're doing.": "Esto no espera a que te acuerdes. Estés en la pantalla que estés, al pasar los límites de abajo aparece un aviso discreto (una vibración breve, sin sonido) que ofrece lo que te propusiste, algo de tu estantería o una palabra guardada — sin bloquear lo que estás haciendo.",
    "Every (minutes)": "Cada (minutos)",
    "Or after this many scrolls (0 = off)": "O tras este número de scrolls (0 = desactivado)",
    "Highest priority first": "Primero la prioridad más alta",
    "The order I arranged": "El orden que yo puse",
    "Time for a break": "Hora de un descanso",
    "From your shelf": "De tu estantería",
    "You've been at this for {minutes} minutes.": "Llevas {minutes} minutos en esto.",
    "You've scrolled {count} times since your last break.": "Has hecho scroll {count} veces desde el último descanso.",
    "There's nothing unfinished on your shelf yet. Put something there and this will offer it next time.": "Todavía no hay nada pendiente en la estantería. Guarda algo y la próxima vez te lo ofrecerá.",
    "Mark done": "Marcar hecho",
    "Open this": "Abrir esto",
    "Pick one of your own shelves to share.": "Elige uno de tus propios estantes para compartir.",
    "This shelf has nothing with a link on it yet.": "Este estante todavía no tiene nada con un enlace.",
    "My shelf: {name}": "Mi estante: {name}",
    "Link copied. Send it to someone.": "Enlace copiado. Envíaselo a alguien.",
    "Couldn't share this shelf": "No se pudo compartir este estante",
    "Someone shared a shelf with you — {count} things on it.": "Alguien compartió un estante contigo — {count} cosas en él.",
    "Added {count} things to a new shelf": "Se añadieron {count} cosas a un estante nuevo",
    "Name this shelf": "Ponle nombre a este estante",
    "You finished {count} things these last two weeks — about {minutes} of your own choosing.": "Has terminado {count} cosas estas dos últimas semanas — unos {minutes} elegidos por ti.",
    "A word from your dictionary": "Una palabra de tu diccionario",
    "Nice to know": "Bueno saberlo",
    "Rename": "Renombrar",
    "Share this shelf": "Compartir este estante",
    "How long it takes (minutes)": "Cuánto tiempo lleva (minutos)",
    "A shelf from someone": "Un estante de alguien",
    "Taking it adds a new shelf of your own. Nothing you already have is touched.": "Si lo aceptas, se añade un estante nuevo tuyo. Nada de lo que ya tienes se toca.",
    "No thanks": "No, gracias",
    "Add to my shelves": "Añadir a mis estantes",
    "e.g. 12": "ej.: 12",
    "Break's over. Nice.": "Pausa terminada. Bien hecho.",
    "{app} stays closed until your break ends.": "{app} permanece cerrado hasta que termine tu pausa.",
    "You're on a break": "Estás en pausa",
    "Back to the break": "Volver a la pausa",
    "End the break early": "Terminar la pausa antes",
    "Break length": "Duración de la pausa",
    "Notify me even when this app is fully closed": "Avísame incluso con la app totalmente cerrada",
    "This uses a small external server (not run by you) that holds only the alert times and text above — nothing about what you look at, your dictionary, or your shelf. It can't schedule a daily-limit alert this way, since that depends on watching today's usage as it happens; that one still only fires while this app is open.": "Esto usa un pequeño servidor externo (que tú no administras) que solo guarda los horarios y el texto de los avisos de arriba — nada sobre lo que miras, tu diccionario o tu estante. El aviso de límite diario no se puede programar así, porque depende de observar el uso de hoy en tiempo real; ese sigue funcionando solo con la app abierta.",
    "Couldn't turn this on right now": "No se pudo activar esto ahora",
    "Notifications on — tap to turn off": "Notificaciones activadas — toca para desactivar",
    "Notifications off — tap to turn on": "Notificaciones desactivadas — toca para activar",
    "Share anonymous usage events": "Compartir eventos de uso anónimos",
    "Send anonymous usage events to this app's operator": "Enviar eventos de uso anónimos al operador de esta app",
    "Separate from notifications, and off by default. When on, this device sends named moments only — things like \"scroll turned on\", \"a shelf item was marked done\", or \"a dock app was opened\" — tagged with a random device id, never your name or account. It never includes what you searched, dictionary words, shelf titles, or URLs. The full list of what's sent lives in push-server/README.md. Turning this off stops it immediately.": "Separado de las notificaciones, y desactivado por defecto. Cuando está activo, este dispositivo envía solo momentos con nombre —como \"scroll activado\", \"un elemento del estante se marcó como hecho\" o \"se abrió una app del dock\"— etiquetados con un id de dispositivo aleatorio, nunca tu nombre o cuenta. Nunca incluye lo que buscaste, palabras del diccionario, títulos del estante ni URLs. La lista completa de lo que se envía está en push-server/README.md. Desactivarlo lo detiene de inmediato.",
    "Time's up — scroll switched back OFF. You kept your word.": "Se acabó el tiempo: el scroll se ha desactivado. Cumpliste tu palabra.",
    "Time's up — scroll is back OFF and the app you opened was closed. You kept your word.": "Se acabó el tiempo: el scroll se desactivó y la app que abriste se cerró. Cumpliste tu palabra.",
    "Things you want to get to": "Lo que quieres hacer",
    "Nothing here yet — add something and breaks will offer it first.": "Nada aquí todavía: añade algo y las pausas lo ofrecerán primero.",
    "+ Add something": "+ Añadir algo",
    "Keep at it until (optional)": "Seguir hasta (opcional)",
    "+ Add a book": "+ Añadir un libro",
    "Link (optional)": "Enlace (opcional)",
    "{days} days left": "Quedan {days} días",
    "1 day left": "Queda 1 día",
    "Last day": "Último día",
    "Past your date": "Fecha ya pasada",
    "Added to shelf {wall}": "Añadido a la estantería {wall}",
    "Anonymous usage events": "Eventos de uso anónimos",
    "This app's server is set up, so this device automatically sends named moments only — things like \"scroll turned on\", \"a shelf item was marked done\", or \"a dock app was opened\" — tagged with a random device id, never your name or account. It never includes what you searched, dictionary words, shelf titles, or URLs. There's no separate switch for this: as long as the server is configured, it's sent. The full list of what's sent lives in push-server/README.md.": "El servidor de esta app está configurado, así que este dispositivo envía automáticamente solo momentos con nombre —como \"scroll activado\", \"un elemento de la estantería marcado como hecho\" o \"se abrió una app del dock\"— etiquetados con un id de dispositivo aleatorio, nunca tu nombre o cuenta. Nunca incluye lo que buscaste, palabras del diccionario, títulos de la estantería ni URLs. No hay un interruptor separado para esto: mientras el servidor esté configurado, se envía. La lista completa de lo que se envía está en push-server/README.md.",
    "Days (optional)": "Días (opcional)",
    "The more of when, which days and how long you fill in, the easier these are to actually start — and a break landing in that window reaches for them first.": "Cuanto más completes sobre cuándo, qué días y cuánto dura, más fácil será empezar de verdad, y una pausa que caiga en esa franja lo ofrecerá primero.",
    "Goals": "Metas",
    "Not recorded": "No registrado",
    "Not at all": "Nada en absoluto",
    "Barely": "Apenas",
    "Minimum done": "Mínimo hecho",
    "Pretty good": "Bastante bien",
    "Nailed it!": "¡Perfecto!",
    "Note": "Nota",
    "Add something you want to work on, and it'll show up here to track.": "Añade algo en lo que quieras trabajar, y aparecerá aquí para hacer seguimiento.",
    "Date": "Fecha",
    "No records this month": "Sin registros este mes",
    "Diary saved": "Diario guardado",
    "Active Days": "Días activos",
    "last {days}d": "últimos {days}d",
    "Avg Score": "Puntuación media",
    "out of 5.0": "de 5.0",
    "Top Category": "Categoría principal",
    "avg": "media",
    "no data": "sin datos",
    "Activity Heatmap": "Mapa de actividad",
    "Category Balance": "Equilibrio de categorías",
    "Progress Trend": "Tendencia de progreso",
    "Best Day of Week": "Mejor día de la semana",
    "Streaks & Completion": "Rachas y cumplimiento",
    "Level Distribution": "Distribución de niveles",
    "Need 2+ categories": "Se necesitan 2+ categorías",
    "Streak": "Racha",
    "Best": "Mejor",
    "Days done": "Días completados",
    "Rate": "Tasa",
    "History": "Historial",
    "Diary": "Diario",
    "Stats": "Estadísticas",
    "7 Days": "7 días",
    "30 Days": "30 días",
    "90 Days": "90 días",
    "Previous day": "Día anterior",
    "Next day": "Día siguiente",
    "Close note": "Cerrar nota",
    "What happened today? Thoughts, feelings, reflections…": "¿Qué pasó hoy? Pensamientos, sentimientos, reflexiones…",
    "Add a note for this day…": "Añade una nota para este día…",
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
    "Add your own site": "自分のサイトを追加",
    "Name": "名前",
    "Website address": "サイトのアドレス",
    "Order": "並び順",
    "Use the arrows to change the order apps appear in on your home screen.": "矢印でホーム画面に表示するアプリの順番を変えられます。",
    "Remove {app}": "{app}を削除",
    "Check some apps above to arrange their order.": "上でアプリにチェックを入れると、順番を並べ替えられます。",
    "Move {app} earlier": "{app}を前に移動",
    "Move {app} later": "{app}を後ろに移動",
    "Enter a name and a website address": "名前とサイトのアドレスを入力してください",
    "Enter a valid website address": "有効なサイトのアドレスを入力してください",
    "Added {app}": "{app}を追加しました",
    "The list of apps installed on your phone can't be read automatically from a web page, so pick from the candidates below instead.": "スマホにインストール済みのアプリ一覧はWebページからは自動取得できないため、以下の候補から選んでください。",
    "Add up to 10 apps from \"Edit Apps\"": "「アプリを編集」から最大10個まで追加できます",
    "Open this app?": "このアプリを開きますか？",
    "Open": "開く",
    "Cancel": "キャンセル",
    // ---- スクロールON ----
    "Turn scroll ON": "スクロールをONにする",
    "Time limit": "制限時間",
    "4-digit PIN": "4桁のPIN",
    "Turn ON": "ONにする",
    "Unlock with Face ID / Fingerprint": "Face ID / 指紋認証で解除",
    // ---- オンボーディング ----
    "Choose your language": "言語を選んでください",
    "App Lock PIN (opens the app)": "アプリロックPIN（アプリを開く用）",
    "Scroll PIN (turns scroll ON)": "スクロールPIN（スクロールON用）",
    "Security question": "秘密の質問",
    "What was your first pet's name?": "最初に飼ったペットの名前は？",
    "What is your mother's maiden name?": "母親の旧姓は？",
    "What was the name of your first school?": "最初に通った学校の名前は？",
    "What city were you born in?": "生まれた市区町村は？",
    "What was your childhood nickname?": "子どもの頃のあだ名は？",
    "What is your favorite food?": "好きな食べ物は？",
    "Answer": "答え",
    "Save & Continue": "保存して次へ",
    "Which social media do you use?": "どのSNSを使っていますか？",
    "Choose the ones you want quick access to from your dock.": "ドックからすぐ開けるようにしたいものを選んでください。",
    "Finish setup": "設定を完了",
    // ---- 設定 ----
    "Settings": "設定",
    "Close settings": "設定を閉じる",
    "Open settings": "設定を開く",
    "How to use this app": "使い方",
    "Set a timer": "タイマーを設定",
    "Look & Feel": "外観",
    "PINs & Unlock": "PINとロック解除",
    "Appearance": "外観",
    "Green": "グリーン",
    "Blue": "ブルー",
    "Accent color": "アクセントカラー",
    "Background color": "背景色",
    "Choose background image": "背景画像を選ぶ",
    "Remove image": "画像を削除",
    "Reset colors": "色をリセット",
    "Purple": "パープル",
    "Orange": "オレンジ",
    "Pink": "ピンク",
    "Dark": "ダーク",
    "Home Screen Icons": "ホーム画面のアイコン",
    "Icon size": "アイコンのサイズ",
    "Small": "小",
    "Medium": "中",
    "Large": "大",
    "Icon shape": "アイコンの形",
    "Rounded square": "角丸四角",
    "Circle": "円形",
    "Show app names under icons": "アイコンの下にアプリ名を表示",
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
    "{time} left — the app will lock when this reaches 0:00.": "残り{time} — 0:00になるとアプリがロックされます。",
    "{time} left. This is just a timer; nothing else happens at 0:00.": "残り{time}。これは単なるタイマーで、0:00になっても何も起きません。",
    "{minutes} min": "{minutes}分",
    "Remove \"{name}\"": "「{name}」を削除",
    "{label} ({minutes} min)": "{label}（{minutes}分）",
    "{label} · {index} of {total}": "{label} · {index} / {total}",
    "Timer started — app locks in {label}": "タイマー開始 — {label}後にアプリをロックします",
    "Timer started for {label}": "{label}のタイマーを開始しました",
    "Open {app}?": "{app}を開きますか？",
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
    "Blocked: this looks like an ad or tracking domain": "ブロックしました：広告・トラッキング用のドメインのようです",
    "Close tab \"{title}\"": "タブ「{title}」を閉じる",
    "Insights": "インサイト",
    "Search or enter a website above to start browsing.": "上の欄で検索するか、サイトのアドレスを入力すると閲覧できます。",
    "Open insights": "インサイトを開く",
    "Search or go to address": "検索またはアドレスへ移動",
    "Search or enter address": "検索またはアドレスを入力",
    "Basic search": "簡易検索",
    "Open in browser": "ブラウザで開く",
    "Close insights": "インサイトを閉じる",
    "Browsing": "ブラウジング",
    "Still finding what you needed? You've been browsing for {minutes} minutes.": "まだ探しているものは見つかりましたか？ {minutes}分間閲覧しています。",
    "Check in with me every 10 minutes while I'm browsing a tab": "タブを閲覧している間、10分ごとに声をかける",
    "Still browsing": "閲覧中",
    "Keep browsing": "閲覧を続ける",
    "{domain} doesn't allow embedding, so it opened in your browser instead.": "{domain} は埋め込み表示を許可していないため、ブラウザで開きました。",
    "Saved": "保存しました",
    "Edit": "編集",
    "Remove": "削除",
    "Title": "タイトル",
    "Dictionary": "辞書",
    "Open dictionary": "辞書を開く",
    "Close dictionary": "辞書を閉じる",
    "Your Dictionary": "あなたの辞書",
    "Search your dictionary…": "辞書の中をさがす…",
    "Filter by group": "グループでしぼりこむ",
    "Sort words": "並び替え",
    "My order": "自分の並び順",
    "A to Z": "五十音・アルファベット順",
    "Newest first": "新しい順",
    "Oldest first": "古い順",
    "Manage groups": "グループの管理",
    "+ Add a word": "＋ 言葉を追加",
    "Word": "言葉",
    "Meaning / note": "意味・メモ",
    "Group": "グループ",
    "‹ Back to dictionary": "‹ 辞書に戻る",
    "Group to edit": "編集するグループ",
    "Rename this group": "このグループの名前を変える",
    "Delete this group": "このグループを削除",
    "Deleting a group keeps its words — they move to the first group.": "グループを削除しても言葉は消えません。最初のグループに移ります。",
    "Add a new group": "新しいグループをつくる",
    "New group": "新しいグループ",
    "+ Add group": "＋ グループを追加",
    "Ungrouped": "未分類",
    "All groups": "すべてのグループ",
    "{shown} / {total}": "{shown} / {total}",
    "No words saved yet. Look a word up, then tap the star to save it here.": "まだ言葉がありません。何かを調べて星マークをタップすると、ここに保存できます。",
    "Import…": "読み込む…",
    "Each row becomes one word: first column the word, second the meaning, third an optional link. A header row is detected and skipped automatically.": "1行が1つの言葉になります。1列目が単語、2列目が意味、3列目は任意のリンクです。見出し行は自動で見つけて読み飛ばします。",
    "Excel (.xlsx) or CSV file": "Excel（.xlsx）またはCSVファイル",
    "…or a Google Sheets share link": "…またはGoogleスプレッドシートの共有リンク",
    "Fetch": "取得",
    "Add into group": "追加先のグループ",
    "Add these words": "これらの言葉を追加",
    "Reading…": "読み込み中…",
    "Fetching…": "取得中…",
    "Couldn't find any words in that file.": "そのファイルからは言葉が見つかりませんでした。",
    "Found {count} words in {source}.": "{source}で{count}件の言葉が見つかりました。",
    "the sheet": "シート",
    "Couldn't read that file.": "そのファイルを読み込めませんでした。",
    "That doesn't look like a Google Sheets link.": "Googleスプレッドシートのリンクではないようです。",
    "Couldn't fetch that sheet. Make sure it's shared as \"Anyone with the link can view\".": "そのシートを取得できませんでした。「リンクを知っている全員が閲覧可」で共有されているか確認してください。",
    "…and {count} more": "…ほか{count}件",
    "Nothing new to add.": "追加できる新しい言葉はありませんでした。",
    "Added {count} words to your dictionary": "辞書に{count}件の言葉を追加しました",
    "Add these {count} words": "この{count}件の言葉を追加",
    "No words matched.": "見つかりませんでした。",
    "Move {word} up": "{word} を上へ",
    "Move {word} down": "{word} を下へ",
    "Group: {group}": "グループ: {group}",
    "Saved {date}": "{date} に保存",
    "Group {n}": "グループ {n}",
    "Please enter a word": "言葉を入力してください",
    "You need at least one group.": "グループは少なくとも1つ必要です。",
    "Save to your dictionary": "辞書に保存",
    "Remove from your dictionary": "辞書から削除",
    "Added to your dictionary": "辞書に保存しました",
    "Removed from your dictionary": "辞書から削除しました",
    "Select a question (optional)": "質問を選ぶ（任意）",
    "Set up your PINs": "PINを設定する",
    "A PIN to open MyHome Browser, and a separate PIN to turn scroll ON — both required, so the friction this app relies on can't quietly default to something guessable. You can switch to Face ID / Fingerprint instead later, in Settings.": "MyHome Browserを開くPINと、スクロールをONにする別のPIN、どちらも必須です。空欄のままだと、このアプリが頼りにしている「一手間」が、誰でも見破れる値のまま静かに骨抜きになってしまうためです。後から設定でFace ID・指紋に切り替えることもできます。",
    "Select a question": "質問を選ぶ",
    "Choose a security question and answer it, so you can reset your PIN if you forget it": "PINを忘れたときに再設定できるよう、秘密の質問を選んで答えを入力してください。",
    "Search results": "検索結果",
    "Close search results": "検索結果を閉じる",
    "Searching…": "検索中…",
    "Search failed: {message}": "検索に失敗しました: {message}",
    "No results found.": "結果が見つかりませんでした。",
    "Search results for \"{query}\"": "「{query}」の検索結果",
    "Typed search terms show Wikipedia results as a list inside the app — no setup needed, but only Wikipedia articles, not the wider web. Typing the address of a big site that refuses to be shown inside another page (Google, Instagram, Facebook, X, TikTok, YouTube, DuckDuckGo) opens it in your regular browser instead — that's the site's own policy, not something this app can change.": "検索語を入力すると、Wikipediaの検索結果がアプリ内の一覧として表示されます — 設定は不要ですが、検索できるのはWikipediaの記事のみで、Web全体ではありません。他のページの中に表示されることを拒否している大手サイト（Google、Instagram、Facebook、X、TikTok、YouTube、DuckDuckGo）のアドレスを直接入力した場合は、代わりに通常のブラウザで開きます。これはそのサイト自身の方針であり、このアプリ側で変えられるものではありません。",
    "Ad blocking only stops known ad domains, not ads on a page you already opened.": "広告ブロックは既知の広告ドメインを止めるだけで、すでに開いたページ内の広告は消せません。",
    "Save with your own note": "自分のメモで保存",
    "Your own note": "自分で書くメモ",
    "Search shows Wikipedia results here. An address opens as a tab.": "検索はここにWikipediaの結果が出ます。アドレスはタブとして開きます。",
    "Tap the star on a tab, or on a search result, to save it.": "タブや検索結果の星をタップすると保存できます。",
    "The pencil on a search result lets you write your own note.": "検索結果の鉛筆マークから、自分の言葉でメモを書けます。",
    "Scroll is OFF": "スクロールはOFFです",
    "These apps open in your normal browser, where this app can't keep scroll locked — so while scroll is OFF they stay closed.": "これらのアプリは通常のブラウザで開くため、このアプリからスクロールを止められません。そのため、スクロールOFFの間は開かないようにしています。",
    "Not now": "いまはやめておく",
    "Install to your home screen": "ホーム画面に追加する",
    "Install": "インストール",
    "Installed to your home screen": "ホーム画面に追加しました",
    "Apps that need scroll ON": "スクロールONが必要なアプリ",
    "Don't let the apps below open while scroll is OFF": "スクロールOFFの間は下のアプリを開かない",
    "{app} opens in a separate browser tab, so you'll leave MyHome Browser and have to find your way back. Installing this app to your home screen usually improves that — see Settings.": "{app} はブラウザの別タブで開くため、MyHome Browserから離れ、自分で戻ってくる必要があります。このアプリをホーム画面に追加しておくと、たいていは改善します（設定をご覧ください）。",
    "Installed. Other apps still open outside this app, but most phones now show them as a layer you can close to come straight back rather than switching you away. Either way your tabs, dictionary and scroll state are kept. Other apps' Share button can now send links, text and files straight into your Waiting room, too.": "インストール済みです。他のアプリは今もこのアプリの外で開きますが、多くの端末では画面ごと切り替わるのではなく、閉じればそのまま戻れる重なり表示になります。どちらの場合でも、タブ・辞書・スクロール状態は保たれます。ほかのアプリの共有ボタンから、リンク・テキスト・ファイルを待合室へ直接送れるようにもなりました。",
    "Right now other apps open in a separate browser tab, so you leave this app and have to find your way back. Installing it to your home screen usually makes them open as a closable layer instead — the exact behaviour is your phone's choice, not this app's.": "いまは他のアプリがブラウザの別タブで開くため、このアプリから離れ、自分で戻ってくる必要があります。ホーム画面に追加すると、たいていは閉じられる重なり表示で開くようになります。実際の挙動を決めるのはこのアプリではなく端末側です。",
    "Right now other apps open in a separate browser tab, so you leave this app. In Safari, tap the Share button and choose \"Add to Home Screen\" — that usually helps, though iOS sometimes still switches you over to Safari.": "いまは他のアプリがブラウザの別タブで開くため、このアプリから離れてしまいます。Safariの共有ボタンから「ホーム画面に追加」を選んでください。たいていは改善しますが、iOSではSafariへ切り替わってしまう場合もあります。",
    "Open this page in Chrome or Edge and use \"Install app\" (or \"Add to Home Screen\") from the browser menu. Once installed, other apps usually open as a layer you can close to come straight back, instead of taking you away.": "このページをChromeまたはEdgeで開き、ブラウザのメニューから「アプリをインストール」（または「ホーム画面に追加」）を選んでください。追加すると、他のアプリはたいてい、閉じればそのまま戻れる重なり表示で開くようになります。",
    "How other apps open": "他のアプリの開き方",
    "Open other apps in this same window": "他のアプリを同じ画面で開く",
    "On means the app loads in this window instead of a new tab, so your phone never switches away from MyHome Browser — press back to return here. Off opens a new tab, which on some phones hands you over to a separate browser. Try both and keep whichever returns more cleanly on your device.": "ONにすると新しいタブではなくこの画面で読み込むため、端末がMyHome Browserから切り替わりません。戻る操作でここに帰ってこられます。OFFだと新しいタブで開き、端末によっては別のブラウザに引き渡されます。両方試して、お使いの端末できれいに戻れるほうをお使いください。",
    "{app} loads in this window, so your phone never switches away from MyHome Browser. Press back to return — everything here will be as you left it.": "{app} はこの画面で読み込むため、端末がMyHome Browserから切り替わりません。戻る操作でここに帰ってこられ、中身も元のままです。",
    "Notifications": "通知",
    "Allow notifications": "通知を許可する",
    "This browser can't show notifications.": "このブラウザは通知を表示できません。",
    "Notifications are allowed. They can only reach you while this app is still running in the background — once it's fully closed, nothing can wake it.": "通知は許可されています。このアプリが裏で動いている間だけ届きます。完全に閉じた後は、何をしても呼び起こせません。",
    "Notifications are blocked. Allow them for this app in your browser or phone settings, then come back.": "通知がブロックされています。ブラウザまたは端末の設定でこのアプリの通知を許可してから、戻ってきてください。",
    "Let this app notify you when scroll time runs out, a timer ends, or you pass your daily limit.": "スクロールの時間切れ、タイマーの終了、1日の上限超過をお知らせします。",
    "Notifications are on": "通知をONにしました",
    "This is what they'll look like.": "こういう形で表示されます。",
    "A minute before scroll time runs out": "スクロールの時間切れ1分前",
    "When scroll switches back OFF": "スクロールがOFFに戻ったとき",
    "When the timer finishes": "タイマーが終わったとき",
    "Posture reminders": "姿勢のリマインド",
    "When you pass your daily limit": "1日の上限を超えたとき",
    "Scroll time is nearly up": "スクロールの時間がもうすぐ終わります",
    "About a minute left before scroll switches back OFF.": "あと1分ほどでスクロールがOFFに戻ります。",
    "You've passed your daily limit": "1日の上限を超えました",
    "Today is over your {minutes} min goal.": "本日は{minutes}分の目標を超えています。",
    "Playing here, without the feed": "フィードは開かず、ここで再生します",
    "Showing this post here, without the feed": "フィードは開かず、この投稿だけここに表示します",
    "Close the app I opened when scroll time runs out": "スクロールの時間が切れたら、開いたアプリを閉じる",
    "This is the only way the time limit reaches inside the other app: this app keeps hold of the tab it opened and shuts it when your time is up. It needs the setting above to be OFF, since there is no separate tab to close otherwise. The cost is that the site you open can see it was opened by this app and could push this page elsewhere — unlikely with the big sites, but not impossible, so turn this off if you would rather not.": "時間制限を相手のアプリにまで効かせる唯一の方法です。このアプリが開いたタブを握り続け、時間が来たら閉じます。上の設定がOFFである必要があります（同じ画面で開くと、閉じる対象のタブがそもそも無いため）。引き換えに、開いた先のサイトから「このアプリが開いた」ことが見え、このページを別の場所へ飛ばす余地が生まれます。大手サイトでまず起きないことですが、皆無ではないので、気になる場合はOFFにしてください。",
    "Time's up — scroll is back OFF and the app you opened was closed": "時間切れ — スクロールをOFFに戻し、開いていたアプリも閉じました",
    "Waiting room": "待合室",
    "Shelf": "本棚",
    "Take a breath": "ひと息つく",
    "This device can't keep records (private browsing, perhaps).": "この端末では記録を保存できません（履歴を残さない設定かもしれません）。",
    "day streak": "れんぞく日数",
    "pauses today": "きょうの一息",
    "minutes held": "つうさん分",
    "Hold a file from this device": "手元のファイルを預ける",
    "Held on this device: {used} of about {quota}": "この端末の書庫: {used} / 約 {quota} まで",
    "Put it on the shelf": "本棚にしまう",
    "Shelved under {wall}": "「{wall}」の棚に並べました",
    "The shelf is full. Take something off it first.": "書庫の容量が足りません。何か処分しましょう。",
    "Couldn't put it on the shelf": "本棚へしまえませんでした",
    "This device is out of room for held files": "この端末に置ける容量を超えました",
    "Couldn't hold that file": "ファイルを預かれませんでした",
    "That file is no longer on this device": "そのファイルはもう端末にありません",
    "Taken off the shelf": "本棚から下ろしました",
    "No address": "（URLなし）",
    "Something to look at": "名もなき預かりもの",
    "Received 1 item from another app": "ほかのアプリから1件届きました",
    "Received {n} items from another app": "ほかのアプリから{n}件届きました",
    "Notice what just happened": "いま起きたことに気づいてください",
    "Scroll is OFF right now. Try swiping this page — it won't move. That small inconvenience is the whole point: it buys you a moment to choose, instead of scrolling out of habit.": "いまスクロールはOFFです。試しにこの画面を動かそうとしても、動きません。この小さな不便さこそが要点です。習慣でスクロールしてしまう前に、選ぶための一瞬を作ります。",
    "Got it — let me try": "わかった、試してみる",
    "You said you wanted to get to \"{goal}\". When you're ready for it, tap \"Scroll OFF\" up top to turn scroll ON with a time limit — on your own terms.": "「{goal}」をしたいと言っていましたね。その準備ができたら、上の「Scroll OFF」をタップして、時間制限を決めてスクロールをONにしてください。自分のペースで。",
    "When you actually want something, tap \"Scroll OFF\" up top to turn scroll ON with a time limit — on your own terms.": "本当に見たいものがあるときは、上の「Scroll OFF」をタップして、時間制限を決めてスクロールをONにしてください。自分のペースで。",
    "Step 1 of 5": "第1ステップ（全5ステップ）",
    "Step 2 of 5": "第2ステップ（全5ステップ）",
    "Step 3 of 5": "第3ステップ（全5ステップ）",
    "Step 4 of 5": "第4ステップ（全5ステップ）",
    "Step 5 of 5": "第5ステップ（全5ステップ）",
    "What do you want your time back for?": "取り戻した時間を、何に使いたいですか",
    "Not \"less phone\" — more of something else. Name one or two things you'd rather be spending it on. This app will remind you of them, not just stop you.": "「スマホを減らす」ことが目的ではなく、その分を何に使うかです。使いたいことを1つか2つ書いてください。このアプリは止めるだけでなく、それを思い出させます。",
    "Skip for now": "いまはスキップ",
    "Choose a time limit. When time is up, scroll switches back OFF and the app you opened from here is closed.": "時間制限を選んでください。時間が来るとスクロールはOFFに戻り、ここから開いたアプリも閉じます。",
    "Choose a time limit. Scroll will switch back OFF automatically when time is up.": "制限時間を選んでください。時間になると自動的にOFFに戻ります。",
    "None of this is about guilt. It's why a time limit and a PIN can do more than willpower alone.": "これは罪悪感を持たせるためのものではありません。だからこそ、制限時間とPINが、意志の力だけよりも役に立つのです。",
    "These apps refuse to open inside this app, so they run in your normal browser where this app can't hold the scroll lock. Ticked apps only open once you've turned scroll ON with a time limit. Feed apps are ticked to start with — tick any others that eat your time.": "これらのアプリはこのアプリの中に表示することを拒否しているため、通常のブラウザで開くことになり、そこではこのアプリはスクロールを止められません。チェックしたアプリは、時間制限を決めてスクロールをONにしたときだけ開けます。フィード系は最初からチェックされています。時間を使ってしまう他のアプリもチェックしておけます。",
    "Turn scroll ON with a time limit, and {app} will open.": "時間制限を決めてスクロールをONにすると、{app} を開けます。",
    "Limits": "制限",
    "{time} left": "残り{time}",
    "Add a shelf": "棚を増やす",
    "One video or one post can show inside. A whole feed can't.": "動画1本・投稿1件なら中に出せます。フィード全体は無理です。",
    "While scroll is OFF, the apps you ticked in Settings won't open.": "スクロールOFFの間は、設定でチェックしたアプリは開きません。",
    "When time runs out, scroll goes OFF and opened tabs close.": "時間が切れるとスクロールはOFFに戻り、開いたタブも閉じます。",
    "Held items wait before they open — longest for gated apps.": "預けたものは開くまで待たされます。ゲート対象ほど長く待ちます。",
    "Open it after a while away and it asks what you came for.": "しばらくぶりに開くと、何をしに来たかを訊きます。",
    "Breaks offer what you set out to do, your shelf, or a saved word.": "休憩は、頑張りたいこと・本棚・辞書の言葉のいずれかを差し出します。",
    "Loosening a limit waits 24 hours. Tightening is immediate.": "制限を緩める変更は24時間待ち。厳しくする変更はすぐ効きます。",
    "Add to your home screen to receive from other apps' Share.": "ホーム画面に追加すると、他アプリの共有から受け取れます。",
    "Priority and Done decide what a break offers you next.": "優先度と「済」が、次に休憩で差し出されるものを決めます。",
    "Anything you feel like looking at, this holds for a moment first.": "見たくなったものは、まずここでひと呼吸おいてから決めます。",
    "Interrupt me and offer something better to be doing": "割り込んで、やった方がいいことを差し出す",
    "Order of the shelf items it reaches for": "本棚から選ぶときの順番",
    "The more of when, where and how long you fill in, the easier these are to actually start — and a break landing in that window reaches for them first.": "いつ・どこで・何分かを埋めるほど実際に始めやすくなり、その時間に来た休憩ではそれを先に差し出します。",
    "e.g. Practise guitar": "例: ギターを弾く",
    "Time of day": "時間帯",
    "Days": "曜日",
    "Where (optional)": "どこで（任意）",
    "Any day": "曜日を問わず",
    "Weekdays": "平日",
    "Weekends": "休日",
    "{count} from your shelf": "本棚から{count}件",
    "{count} you set out to do": "自分で決めたこと{count}件",
    "This week: {count}": "今週: {count}件",
    "{weeks} weeks ago: {count}": "{weeks}週前: {count}件",
    "Morning": "朝",
    "Afternoon": "昼",
    "Evening": "夕方〜夜",
    "Late night": "深夜",
    "Any time": "いつでも",
    "done {count}x": "{count}回",
    "{idle} of your last {total} opens had nothing particular behind them.": "直近{total}回の起動のうち{idle}回は、特に用事がありませんでした。",
    "You finished {count} things these last two weeks.": "この2週間で{count}件を片付けました。",
    "You opened this without anything particular in mind.": "特に用事がないまま開きました。",
    "Since you last looked": "前回見てから",
    "Good": "よし",
    "What did you come here for?": "何をしに来ましたか",
    "No wrong answer — this is just so the reason is yours and not the phone's.": "正解はありません。理由がスマホ側ではなく自分の側にある、という確認だけです。",
    "To look something up": "調べものをしに",
    "To get to something I set aside": "預けたものを見に",
    "No particular reason": "特に用事はない",
    "When you open the app": "アプリを開いたとき",
    "Ask what I came here for": "何をしに来たかを訊く",
    "Asked at most once every few minutes, never mid-task. Every answer is one tap. Answering \"no particular reason\" brings up something you said you wanted to do instead.": "数分に一度までで、作業の途中では訊きません。どの答えも1タップです。「特に用事はない」を選ぶと、やりたいと言っていたことを代わりに差し出します。",
    "Stop asking what you came for": "何をしに来たかを訊かなくする",
    "You said {promised}. It was {actual} — {over} of your last {total} went over.": "{promised}のつもりが、実際は{actual}でした。直近{total}回のうち{over}回が超過です。",
    "You went past your own limit on {over} of the last {total} times you left, by {avg} on average.": "直近{total}回の外出のうち{over}回、自分で決めた時間を超えています（平均{avg}）。",
    "You came back within your own limit all {total} of the last times you left.": "直近{total}回とも、自分で決めた時間の内に戻ってきています。",
    "If {trigger}, then {action}": "もし{trigger}なら、{action}",
    "Saved. It takes effect in {wait} — you can cancel until then.": "受け付けました。{wait}後に反映されます。それまではいつでも取り消せます。",
    "{change} — in {wait}": "{change} — あと{wait}",
    "Cancel this change": "この変更を取り消す",
    "Change cancelled": "変更を取り消しました",
    "{text} · done {count}x": "{text} · {count}回",
    "Remove this rule": "この決めごとを削除",
    "How about this now?": "そろそろこれ、やりませんか",
    "Away from the screen": "画面から離れて",
    "Did it": "やった",
    "There's something you said you wanted to do.": "やりたいと言っていたことがあります。",
    "Nice.": "いいですね。",
    "finished": "片付いた",
    "You decided": "自分で決めたこと",
    "Turn scroll ON anyway": "それでもスクロールをONにする",
    "Set out what you want to get to, in Settings — then this offers those instead of just something to read.": "頑張りたいことを設定に書いておくと、読みものの代わりにそちらを差し出します。",
    "What you want to get to": "頑張りたいこと",
    "Your shelf only holds things you put off looking at. List what you actually want to spend the time on, and breaks will offer these first.": "本棚に貯まるのは「あとで見る」と先送りしたものだけです。本当に時間を使いたいことを書いておくと、休憩ではこちらを先に差し出します。",
    "Nothing here yet — breaks will fall back to your shelf, a saved word, and small away-from-screen nudges.": "まだ何もありません。今は本棚・辞書の言葉・画面から離れる小さな提案で代用します。",
    "If this, then that": "もし〜なら、〜する",
    "Decide now, while it's easy, what you'll do in the moment it isn't. These are read back to you when an app is held closed.": "まだ余裕のあるうちに、余裕が無いときどうするかを決めておきます。アプリを止めたときに、そのまま読み返します。",
    "No rules yet.": "まだ決めごとはありません。",
    "If… (e.g. it's past 11pm)": "もし…（例: 23時を過ぎたら）",
    "then… (e.g. I'll read one shelved thing)": "〜する（例: 本棚から1つ読む）",
    "Cooling-off period": "頭を冷やす時間",
    "Make loosening these settings wait 24 hours": "設定を緩める変更は24時間待ってから反映する",
    "The version of you that sets these limits and the version that wants past them are not in the room at the same time. Tightening anything still takes effect at once; only loosening waits, and you can cancel it the whole time.": "この制限を決めるときの自分と、破りたくなったときの自分は、同じ場所にいません。厳しくする変更は今までどおりその場で効きます。緩める変更だけが待たされ、その間はいつでも取り消せます。",
    "Waiting to take effect:": "反映待ち:",
    "Turn forced breaks off": "強制休憩を切る",
    "Make breaks less frequent": "休憩の間隔を延ばす",
    "Raise the scroll count before a break": "休憩までのスクロール回数を増やす",
    "Turn the cooling-off period off": "頭を冷やす時間を切る",
    "Stop requiring scroll ON for those apps": "アプリにスクロールONを求めるのをやめる",
    "Remove apps from the scroll gate": "スクロールONが必要なアプリを減らす",
    "Added shelf {name}": "棚「{name}」を追加しました",
    "File": "ファイル",
    "Later": "あとで読む",
    "Shelf space": "棚の容量",
    "— empty shelf —": "— 空きの棚 —",
    "Nothing on the shelf yet. Things you keep from the waiting room end up here.": "まだ本がありません。待合室からしまったものが、ここに並びます。",
    "Shelf wall": "本棚の壁",
    "Previous wall": "前の壁",
    "Next wall": "次の壁",
    "{kind} · {size}": "{kind} ・ {size}",
    "Drink a glass of water, slowly.": "水をコップに一杯、ゆっくり飲む。",
    "Look at the furthest thing out of the window.": "窓の外の、いちばん遠いものを見る。",
    "Lift your shoulders, then let them drop. Three times.": "肩をぐっと上げて、すとんと落とす。三回。",
    "Put three things on your desk back where they belong.": "机の上のものを、三つだけ元の場所へ。",
    "Close your eyes and count three sounds you can hear.": "目を閉じて、聞こえる音を三つ数える。",
    "Stand up and walk once around the room.": "立ち上がって、部屋をひとまわり。",
    "Wash your hands. Notice the temperature of the water.": "手を洗う。水の温度に気づいてみる。",
    "Straighten your back and look up at the ceiling.": "背筋を伸ばして、天井を見上げる。",
    "Open a window or a curtain and let the air change.": "窓かカーテンを開けて、空気を入れかえる。",
    "Remember one good thing about today.": "今日よかったことを、ひとつ思い出す。",
    "Feel where your feet are touching the floor.": "足の裏が床に触れている感じに集中する。",
    "Leave one line of a note for tomorrow's you.": "明日の自分に、一行だけメモを残す。",
    "Look into the distance and let your eyes go soft.": "遠くを見て、目のちからを抜く。",
    "Breathe in deeply, breathe out slowly. That's enough.": "深く吸って、長く吐く。それだけでいい。",
    "{used} / {total}": "{used} / {total}",
    "Close": "閉じる",
    "Search the shelf…": "本棚の中をさがす…",
    "Nothing on the shelf matched.": "本棚には見つかりませんでした。",
    "Priority": "優先度",
    "High": "高",
    "Low": "低",
    "Order on this shelf": "この棚での並び順",
    "Move earlier": "前へ",
    "Move later": "後ろへ",
    "Done": "済",
    "Not done after all": "やっぱり未読にする",
    "Marked as done": "済にしました",
    "Put back as unfinished": "未読に戻しました",
    "Done ({count})": "済（{count}）",
    "Break reminders": "休憩リマインド",
    "This doesn't wait for you to remember. Whatever screen you're on, once you pass the limits below, a quiet banner appears (a short vibration, no sound) offering what you set out to do, something from your shelf, or a saved word — it doesn't block what you're doing.": "思い出すのを待ちません。どの画面にいても、下の目安を超えた時点で、静かなバナーが出て（短い振動のみで音は出ません）頑張りたいこと・本棚の未読・辞書の言葉のいずれかを差し出します。今していることを止めることはありません。",
    "Every (minutes)": "何分ごと",
    "Or after this many scrolls (0 = off)": "またはスクロール回数（0で無効）",
    "Highest priority first": "優先度の高い順",
    "The order I arranged": "自分で並べた順",
    "Time for a break": "ひと息つきましょう",
    "From your shelf": "本棚から",
    "You've been at this for {minutes} minutes.": "{minutes}分ほど続けています。",
    "You've scrolled {count} times since your last break.": "前の休憩から{count}回スクロールしています。",
    "There's nothing unfinished on your shelf yet. Put something there and this will offer it next time.": "本棚にまだ未読がありません。何か入れておくと、次はそれを差し出します。",
    "Mark done": "済にする",
    "Open this": "これを見る",
    "Pick one of your own shelves to share.": "共有する自分の本棚を選んでください。",
    "This shelf has nothing with a link on it yet.": "この棚にはまだリンク付きのものがありません。",
    "My shelf: {name}": "わたしの本棚：{name}",
    "Link copied. Send it to someone.": "リンクをコピーしました。誰かに送ってみてください。",
    "Couldn't share this shelf": "この棚を共有できませんでした",
    "Someone shared a shelf with you — {count} things on it.": "誰かが本棚を共有してくれました — {count}件入っています。",
    "Added {count} things to a new shelf": "新しい棚に{count}件を追加しました",
    "Name this shelf": "この棚に名前を付ける",
    "You finished {count} things these last two weeks — about {minutes} of your own choosing.": "この2週間で{count}件を片付けました — 自分で選んだ時間にしておよそ{minutes}。",
    "A word from your dictionary": "辞書からの言葉",
    "Nice to know": "知れてよかった",
    "Rename": "名前を変える",
    "Share this shelf": "この棚を共有する",
    "How long it takes (minutes)": "かかる時間（分）",
    "A shelf from someone": "誰かからの本棚",
    "Taking it adds a new shelf of your own. Nothing you already have is touched.": "受け取ると、自分の新しい棚が一つ増えます。すでにある棚には触れません。",
    "No thanks": "いいえ、結構です",
    "Add to my shelves": "自分の本棚に追加",
    "e.g. 12": "例：12",
    "Break's over. Nice.": "休憩終わり。よくやった。",
    "{app} stays closed until your break ends.": "休憩が終わるまで{app}は開けません。",
    "You're on a break": "いま休憩中です",
    "Back to the break": "休憩に戻る",
    "End the break early": "休憩を早めに終える",
    "Break length": "休憩の長さ",
    "Notify me even when this app is fully closed": "アプリを完全に閉じていても通知する",
    "This uses a small external server (not run by you) that holds only the alert times and text above — nothing about what you look at, your dictionary, or your shelf. It can't schedule a daily-limit alert this way, since that depends on watching today's usage as it happens; that one still only fires while this app is open.": "これは（自分で運営していない）小さな外部サーバーを使い、上の通知の時刻と文言だけを預けます。何を見ているか・辞書・本棚の中身は一切含みません。1日の上限超過の通知だけはこの方式で予約できません。今日どれだけ使ったかをその都度観測する必要があるためで、これだけはこれまで通りアプリを開いている間だけ届きます。",
    "Couldn't turn this on right now": "いまはオンにできませんでした",
    "Notifications on — tap to turn off": "通知オン — タップでオフにする",
    "Notifications off — tap to turn on": "通知オフ — タップでオンにする",
    "Share anonymous usage events": "匿名の利用イベントを共有する",
    "Send anonymous usage events to this app's operator": "このアプリの運営者に匿名の利用イベントを送る",
    "Separate from notifications, and off by default. When on, this device sends named moments only — things like \"scroll turned on\", \"a shelf item was marked done\", or \"a dock app was opened\" — tagged with a random device id, never your name or account. It never includes what you searched, dictionary words, shelf titles, or URLs. The full list of what's sent lives in push-server/README.md. Turning this off stops it immediately.": "通知とは別枠で、既定はオフです。オンにすると、この端末は「スクロールをONにした」「本棚の項目を済にした」「ドックのアプリを開いた」といった、決まった名前の出来事だけを、ランダムな端末IDを添えて送ります。名前やアカウントは含みません。検索した内容・辞書の言葉・本棚のタイトル・URLは一切含みません。送られる内容の全リストはpush-server/README.mdにあります。オフにすればすぐに止まります。",
    "Time's up — scroll switched back OFF. You kept your word.": "時間になったのでスクロールをOFFに戻しました。よく守れました。",
    "Time's up — scroll is back OFF and the app you opened was closed. You kept your word.": "時間切れ — スクロールをOFFに戻し、開いていたアプリも閉じました。よく守れました。",
    "Things you want to get to": "頑張りたいこと",
    "Nothing here yet — add something and breaks will offer it first.": "まだ何もありません。追加すると、休憩のときに真っ先に提案します。",
    "+ Add something": "+ 追加する",
    "Keep at it until (optional)": "いつまで頑張るか（任意）",
    "+ Add a book": "+ 本を追加",
    "Link (optional)": "リンク（任意）",
    "{days} days left": "残り{days}日",
    "1 day left": "残り1日",
    "Last day": "今日が最終日",
    "Past your date": "期限を過ぎました",
    "Added to shelf {wall}": "棚{wall}に追加しました",
    "Anonymous usage events": "匿名の利用ログ",
    "This app's server is set up, so this device automatically sends named moments only — things like \"scroll turned on\", \"a shelf item was marked done\", or \"a dock app was opened\" — tagged with a random device id, never your name or account. It never includes what you searched, dictionary words, shelf titles, or URLs. There's no separate switch for this: as long as the server is configured, it's sent. The full list of what's sent lives in push-server/README.md.": "このアプリのサーバーが設定されているため、この端末は決まった名前の出来事だけを自動的に送ります（例:「スクロールをONにした」「本棚の項目を済にした」「ドックのアプリを開いた」）。ランダムな端末IDだけを添え、名前やアカウントは一切含みません。検索語・辞書の言葉・本棚のタイトル・URLは一切含みません。オン/オフの切り替えは別にありません。サーバーが設定されていれば送られます。送られる内容の全リストはpush-server/README.mdにあります。",
    "Days (optional)": "曜日（任意）",
    "The more of when, which days and how long you fill in, the easier these are to actually start — and a break landing in that window reaches for them first.": "いつ・何曜日・どれくらいの時間かを埋めるほど、実際に始めやすくなります。その条件に合う休憩が来たときに真っ先に差し出されます。",
    "Goals": "頑張りたいこと",
    "Not recorded": "未記録",
    "Not at all": "まったくできなかった",
    "Barely": "物足りない",
    "Minimum done": "最低限できた",
    "Pretty good": "まあまあ",
    "Nailed it!": "よくできた",
    "Note": "メモ",
    "Add something you want to work on, and it'll show up here to track.": "頑張りたいことを追加すると、ここに表示されて記録できるようになります。",
    "Date": "日付",
    "No records this month": "この月の記録はありません",
    "Diary saved": "日記を保存しました",
    "Active Days": "記録日数",
    "last {days}d": "過去{days}日",
    "Avg Score": "平均スコア",
    "out of 5.0": "/ 5.0",
    "Top Category": "トップ",
    "avg": "平均",
    "no data": "データなし",
    "Activity Heatmap": "アクティビティ",
    "Category Balance": "カテゴリバランス",
    "Progress Trend": "進捗トレンド",
    "Best Day of Week": "曜日別パフォーマンス",
    "Streaks & Completion": "ストリーク",
    "Level Distribution": "レベル分布",
    "Need 2+ categories": "2つ以上のカテゴリが必要です",
    "Streak": "連続記録",
    "Best": "最長記録",
    "Days done": "達成日数",
    "Rate": "達成率",
    "History": "履歴",
    "Diary": "日記",
    "Stats": "統計",
    "7 Days": "7日間",
    "30 Days": "30日間",
    "90 Days": "90日間",
    "Previous day": "前の日",
    "Next day": "次の日",
    "Close note": "メモを閉じる",
    "What happened today? Thoughts, feelings, reflections…": "今日の出来事、気づき、感想など…",
    "Add a note for this day…": "この日のメモを入力…",
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

  document.getElementById("browsingCheckinToggle").addEventListener("change", (e) => {
    saveBrowsingCheckinsEnabled(e.target.checked);
  });

  document.getElementById("feedGateToggle").addEventListener("change", (e) => {
    const on = e.target.checked;
    const result = requestSettingChange({
      key: "feedAppsNeedScrollOn",
      value: on,
      label: "Stop requiring scroll ON for those apps",
      loosening: !on,
    });
    reportSettingChange(result);
    refreshProtectedSettingInputs();
  });

  document.getElementById("sameWindowToggle").addEventListener("change", (e) => {
    saveOpenAppsInSameWindow(e.target.checked);
  });

  document.getElementById("closeOnTimeUpToggle").addEventListener("change", (e) => {
    saveCloseOnScrollTimeUpEnabled(e.target.checked);
  });

  // 休憩をゆるめる方向（切る／間隔を延ばす／回数を増やす・0にする）だけ、
  // 24時間の頭を冷やす時間を挟む。厳しくする方向はその場で効く。
  document.getElementById("breakEnabledToggle").addEventListener("change", (e) => {
    const on = e.target.checked;
    const result = requestSettingChange({
      key: "breakEnabled",
      value: on,
      label: "Turn forced breaks off",
      loosening: !on,
    });
    if (result.applied && on) resetBreakCounters();
    reportSettingChange(result);
    refreshProtectedSettingInputs();
  });
  document.getElementById("breakIntervalInput").addEventListener("change", (e) => {
    const next = Math.max(1, Math.round(Number(e.target.value) || BREAK_DEFAULT_MIN));
    const result = requestSettingChange({
      key: "breakIntervalMin",
      value: next,
      label: "Make breaks less frequent",
      loosening: next > getBreakIntervalMin(),
    });
    if (result.applied) resetBreakCounters();
    reportSettingChange(result);
    refreshProtectedSettingInputs();
  });
  document.getElementById("breakScrollInput").addEventListener("change", (e) => {
    const next = Math.max(0, Math.round(Number(e.target.value) || 0));
    const current = getBreakScrollCount();
    // 0 は「回数では割り込まない」なので、常に緩める向き。
    const loosening = next === 0 ? current !== 0 : current === 0 || next > current;
    const result = requestSettingChange({
      key: "breakScrollCount",
      value: next,
      label: "Raise the scroll count before a break",
      loosening,
    });
    if (result.applied) resetBreakCounters();
    reportSettingChange(result);
    refreshProtectedSettingInputs();
  });

  document.getElementById("coolOffToggle").addEventListener("change", (e) => {
    const on = e.target.checked;
    // この仕組み自体を切るのも「緩める」変更。切るには待ってもらう。
    const result = requestSettingChange({
      key: "coolOffEnabled",
      value: on,
      label: "Turn the cooling-off period off",
      loosening: !on,
    });
    reportSettingChange(result);
    refreshProtectedSettingInputs();
  });
  document.getElementById("recommendOrderSelect").addEventListener("change", (e) => {
    saveRecommendOrder(e.target.value);
  });

  document.getElementById("notifyEnableBtn").addEventListener("click", requestNotificationPermission);

  document.getElementById("notifyPrefList").addEventListener("change", (e) => {
    if (e.target.type !== "checkbox") return;
    saveNotifyPrefs({ ...getNotifyPrefs(), [e.target.value]: e.target.checked });
    renderNotifyQuickToggle();
  });

  document.getElementById("pushEnabledToggle").addEventListener("change", async (e) => {
    const wantOn = e.target.checked;
    if (!wantOn) {
      disablePushNotifications();
      renderNotifyQuickToggle();
      return;
    }
    const result = await enablePushNotifications();
    if (!result.ok) {
      e.target.checked = false;
      showToast(
        result.reason === "denied"
          ? t("Notifications are blocked. Allow them for this app in your browser or phone settings, then come back.")
          : t("Couldn't turn this on right now")
      );
    }
    renderNotifyQuickToggle();
  });

  document.getElementById("notifyQuickToggleBtn").addEventListener("click", toggleAllNotifications);
  renderNotifyQuickToggle();

  // 対象から外すのは「緩める」変更。増やすのはその場で効く。
  document.getElementById("scrollGatedAppList").addEventListener("change", (e) => {
    if (e.target.type !== "checkbox") return;
    const next = readScrollGatedAppSelection();
    const current = getScrollGatedAppIds();
    const removed = current.some((id) => !next.includes(id));
    const result = requestSettingChange({
      key: "scrollGatedApps",
      value: next,
      label: "Remove apps from the scroll gate",
      loosening: removed,
    });
    reportSettingChange(result);
    if (!result.applied) renderScrollGatedAppList();
  });

  document.getElementById("installBtn").addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice.catch(() => {});
    // promptは一度しか使えないので、結果に関わらず捨てて表示を作り直す。
    deferredInstallPrompt = null;
    renderInstallSection();
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
  const stepGoals = document.getElementById("onboardingStepGoals");
  const stepPin = document.getElementById("onboardingStepPin");
  const stepSns = document.getElementById("onboardingStepSns");

  /* ---- Step 1: language ---- */
  function applyOnboardingLanguage(code) {
    // 残りのオンボーディングとアプリ本体も、選んだ言語に揃える。
    // 起動時に英語で組み立て済みの表示（スクロールボタン等）も作り直す必要がある。
    applyLanguage(code);
    refreshTranslatedViews();
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
    stepGoals.hidden = false;
    renderOnboardingGoalsList();
  });

  /* ---- Step 3: 何のために時間を取り戻したいか（頑張りたいことの種まき）----
     自己決定理論でいう自律性は、他人に決められた制限より自分で選んだ目標に
     向かうときに働く。「スマホを我慢する」ではなく「これがしたい」を最初に
     一つでも書かせることで、以降の制限がその目標を守るための道具だと
     位置づけ直す。ここで足したものはそのまま頑張りたいことリストに入る。 */
  function renderOnboardingGoalsList() {
    renderAspirationListInto("onboardingGoalsList", null);
  }

  wireAspirationAddForm({
    btn: "onboardingGoalAddBtn",
    input: "onboardingGoalInput",
    when: "onboardingGoalWhen",
    dayRow: "onboardingGoalDayRow",
    minutes: "onboardingGoalMinutes",
    until: "onboardingGoalUntil",
    onAdded: renderOnboardingGoalsList,
  });

  function goToPinStep() {
    stepGoals.hidden = true;
    stepPin.hidden = false;
  }
  document.getElementById("onboardingGoalsSkipBtn").addEventListener("click", goToPinStep);
  document.getElementById("onboardingGoalsNextBtn").addEventListener("click", goToPinStep);

  /* ---- Step 4: app lock PIN + recovery question (optional) ---- */
  function goToSnsStep() {
    stepPin.hidden = true;
    stepSns.hidden = false;
    renderOnboardingSnsList();
  }

  // 未設定のまま次へ進めると、getPin()/getAppLockPin()が既定値の"0000"に
  // フォールバックし、本来ここにあるはずの摩擦が誰でも見破れる形で消えてしまう。
  // そのため両方のPINと、復旧用の質問・答えを、ここで必須にする。
  document.getElementById("onboardingPinNextBtn").addEventListener("click", () => {
    const pin = document.getElementById("onboardingPinInput").value.trim();
    const question = document.getElementById("onboardingQuestionInput").value.trim();
    const answer = document.getElementById("onboardingAnswerInput").value.trim();
    const scrollPin = document.getElementById("onboardingScrollPinInput").value.trim();

    if (!/^\d{4}$/.test(pin)) {
      showToast(t("App Lock PIN must be exactly 4 digits"));
      return;
    }
    if (!question || !answer) {
      showToast(t("Choose a security question and answer it, so you can reset your PIN if you forget it"));
      return;
    }
    if (!/^\d{4}$/.test(scrollPin)) {
      showToast(t("Scroll PIN must be exactly 4 digits"));
      return;
    }

    saveAppLockPin(pin);
    saveAppLockEnabled(true);
    saveAppLockQuestion(question);
    saveAppLockAnswer(answer);
    savePin(scrollPin);
    goToSnsStep();
  });

  /* ---- Step 5: which SNS to use ---- */
  document.getElementById("onboardingSnsNextBtn").addEventListener("click", () => {
    const checked = Array.from(
      document.querySelectorAll('#onboardingSnsList input[type="checkbox"]:checked')
    ).map((cb) => cb.value);
    saveJSON(STORAGE_KEYS.selectedApps, checked);
    saveOnboardingComplete(true);
    screen.hidden = true;
    renderDock();
    applyDockCollapsed();
    showFirstRunMoment();
  });
}

function renderOnboardingSnsList() {
  const list = document.getElementById("onboardingSnsList");
  const snsCandidates = APP_CANDIDATES.filter((app) => SNS_FEED_PLATFORMS.includes(app.id));
  buildAppCandidateListItems(list, snsCandidates, [], "onboarding-sns");
}

/* ==========================================================================
   最初のミッション：不便さそのものを体験させる
   セットアップが終わってすぐ普段の画面へ流すのではなく、いま自分がスクロール
   できない状態にいることに一度だけ意識を向けさせる。この「意図的な不便さ」が
   時間を自分のものに取り戻す仕組みそのものだと、説明ではなく体感で伝えるため。
   ステップ3で目標を書いていれば、それを名指しして「この不便さは何のためか」を
   つなげる（自己決定理論でいう自律性は、他人の制限より自分の目標に向くときに働く）。
   ========================================================================== */
function isFirstRunMomentSeen() {
  return loadJSON(STORAGE_KEYS.firstRunMomentSeen, false);
}
function saveFirstRunMomentSeen(v) {
  saveJSON(STORAGE_KEYS.firstRunMomentSeen, v);
}

function renderFirstRunMoment() {
  const goals = getAspirations();
  document.getElementById("firstRunGoalLine").textContent = goals.length
    ? tf('You said you wanted to get to "{goal}". When you\'re ready for it, tap "Scroll OFF" up top to turn scroll ON with a time limit — on your own terms.', { goal: goals[0].text })
    : t('When you actually want something, tap "Scroll OFF" up top to turn scroll ON with a time limit — on your own terms.');
}

function showFirstRunMoment() {
  if (isFirstRunMomentSeen()) return;
  renderFirstRunMoment();
  document.getElementById("firstRunModal").hidden = false;
}

function initFirstRunMoment() {
  document.getElementById("firstRunGotItBtn").addEventListener("click", () => {
    document.getElementById("firstRunModal").hidden = true;
    saveFirstRunMomentSeen(true);
  });
}

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
   ホーム画面に自由に追加できるカスタムタイル（自分のお気に入りサイト）
   固定候補(APP_CANDIDATES)に無いサイトも、名前とURLだけで即座にアイコン
   タイルとして追加できるようにする。favicon.domainはURLのホスト名から作る。
   ========================================================================== */

function getCustomApps() {
  return loadJSON(STORAGE_KEYS.customApps, []);
}

function saveCustomApps(apps) {
  saveJSON(STORAGE_KEYS.customApps, apps);
}

function makeCustomAppId() {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function addCustomApp(name, url) {
  const domain = hostnameOf(url);
  const app = {
    id: makeCustomAppId(),
    name,
    initial: name.trim().charAt(0).toUpperCase() || "?",
    web: url,
    domain,
    custom: true,
  };
  const apps = getCustomApps();
  apps.push(app);
  saveCustomApps(apps);
  return app;
}

function removeCustomApp(id) {
  saveCustomApps(getCustomApps().filter((a) => a.id !== id));
  const selected = getSelectedAppIds().filter((sid) => sid !== id);
  saveJSON(STORAGE_KEYS.selectedApps, selected);
}

// 固定候補とカスタムタイルをまとめた、ホーム画面に置ける全アプリの一覧。
function getAllAppCandidates() {
  return APP_CANDIDATES.concat(getCustomApps());
}

function findApp(id) {
  return getAllAppCandidates().find((a) => a.id === id);
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
    // 暗い面どうしの差は小さく取る。段差を広げるとカードが浮いて安っぽくなるので、
    // 階層は明度差ではなく余白と細い境界線で出す。
    root.setProperty("--bg", a.bg);
    root.setProperty("--bg-elevated", lighten(a.bg, 0.05));
    root.setProperty("--bg-card", lighten(a.bg, 0.075));
    root.setProperty("--bg-subtle", lighten(a.bg, 0.115));
    root.setProperty("--border", lighten(a.bg, 0.155));
    root.setProperty("--text", lighten(a.bg, 0.94));
    root.setProperty("--text-dim", lighten(a.bg, 0.56));
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

  const iconSizePx = { small: 30, medium: 38, large: 46 }[a.iconSize] || 38;
  root.setProperty("--dock-icon-size", `${iconSizePx}px`);
  root.setProperty("--dock-icon-radius", a.iconShape === "circle" ? "50%" : "12px");

  const dockGrid = document.getElementById("dockGrid");
  if (dockGrid) dockGrid.classList.toggle("hide-labels", a.showLabels === false);
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
  document.getElementById("iconSizeSelect").value = a.iconSize;
  document.getElementById("iconShapeSelect").value = a.iconShape;
  document.getElementById("showLabelsToggle").checked = a.showLabels !== false;
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
   小さな達成感
   縦動画のフィードは「次に何が来るか分からない」予測不能な報酬でドーパミンを
   引き出す。それに対抗できるのは「今、良い時間の使い方をした」という内的な
   満足感で、無ければ育たない。本棚を済にする・辞書に言葉を足す・頑張りたい
   ことを実行する、といった意味のある行動の直後にだけ、ごく小さな祝福を返す。
   派手にしすぎたり毎回同じだと慣れてしまうので、控えめに、文言も何通りか回す。
   ========================================================================== */
function celebrate(message) {
  showToast(message);
  burstConfetti();
}

const CONFETTI_COLORS = ["#65a30d", "#eab308", "#0ea5e9", "#f97316", "#ec4899"];

function burstConfetti() {
  // 動きに敏感な人には出さない。祝福の演出であって、必須の情報ではないので。
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layer = document.createElement("div");
  layer.className = "confetti-layer";
  layer.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 18; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    piece.style.animationDelay = `${Math.random() * 150}ms`;
    piece.style.setProperty("--drift", `${Math.round((Math.random() - 0.5) * 120)}px`);
    piece.style.setProperty("--spin", Math.random() > 0.5 ? "1" : "-1");
    layer.appendChild(piece);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 1300);
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

const SCROLL_ALMOST_UP_MS = 60 * 1000;

const ScrollLock = (() => {
  let countdownTimer = null;
  let lastPostureReminderMinute = -1;
  let almostUpNotified = false;

  function getState() {
    return loadJSON(STORAGE_KEYS.scrollState, { isOn: false, expiresAt: null, durationLabel: null, startedAt: null });
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
    timerEl.textContent = tf("{time} left", { time: `${mm}:${ss}` });
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
    alertUser("posture", t("Posture check: try sitting up and holding the phone at eye level for a moment."));
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
    maybeNotifyScrollAlmostUp(state);
    // スクロールON中の時間も1日の合計に入るので、超えるならたいていこの最中。
    maybeNotifyDailyGoal();
  }

  // 打ち切られる前に一声かけて、切り上げる余地を作る。1回のONにつき一度だけ。
  function maybeNotifyScrollAlmostUp(state) {
    if (almostUpNotified || !state.expiresAt) return;
    const remainingMs = state.expiresAt - Date.now();
    if (remainingMs > SCROLL_ALMOST_UP_MS || remainingMs <= 0) return;
    almostUpNotified = true;
    showNotification("scrollAlmostUp", t("Scroll time is nearly up"), t("About a minute left before scroll switches back OFF."));
  }

  function turnOn(durationLabel, minutes) {
    const expiresAt = Date.now() + minutes * 60 * 1000;
    const state = { isOn: true, expiresAt, durationLabel, startedAt: Date.now() };
    setState(state);
    applyUnlockedDom();
    updateToggleUI(true);
    updateTimerUI(state);
    stopCountdown();
    lastPostureReminderMinute = -1;
    almostUpNotified = false;
    countdownTimer = setInterval(tick, 1000);
    incrementScrollOnCount();
    renderAppInsights();
    scheduleScrollPushes(expiresAt);
    logEvent("scroll_on", { minutes });
  }

  function turnOff(opts = {}) {
    const prevState = getState();
    if (prevState.isOn && prevState.startedAt) {
      addScrollOnTimeMs(Date.now() - prevState.startedAt);
    }
    setState({ isOn: false, expiresAt: null, durationLabel: null, startedAt: null });
    applyLockedDom();
    updateToggleUI(false);
    document.getElementById("scrollTimer").hidden = true;
    stopCountdown();
    cancelScrollPushes();
    logEvent("scroll_off", { expired: Boolean(opts.expired) });
    if (opts.expired) {
      // 約束した時間が来たので、こちらから開いたタブも一緒に畳む。
      const closed = isCloseOnScrollTimeUpEnabled() ? closeOpenedAppWindows() : 0;
      const message = closed > 0
        ? t("Time's up — scroll is back OFF and the app you opened was closed. You kept your word.")
        : t("Time's up — scroll switched back OFF. You kept your word.");
      // 早めに切ったのではなく、決めた時間を最後まで守れた瞬間だけ祝う。
      showNotification("scrollTimeUp", "MyHome Browser", message);
      celebrate(message);
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
    logEvent("focus_timer_finished");
    if (state.lockOnExpire) {
      showAppLockScreen(t("Time's up! MyHome Browser is locked until you unlock it."));
    } else {
      alertUser("focusTimer", t("Timer's up"));
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
    if (getNotifyPrefs().focusTimer) schedulePush("focusTimer", expiresAt, "MyHome Browser", t("Timer's up"));
    logEvent("focus_timer_started", { seconds: totalSeconds, lockOnExpire: Boolean(lockOnExpire) });
  }

  function cancel() {
    setState({ expiresAt: null, lockOnExpire: false });
    stopCountdown();
    updateUI({ expiresAt: null });
    showToast(t("Timer canceled"));
    cancelPush("focusTimer");
    logEvent("focus_timer_canceled");
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
   スクロールON確認モーダル (制限時間の選択)
   ========================================================================== */

function getDurations() {
  return loadJSON(STORAGE_KEYS.durations, DEFAULT_DURATIONS.slice());
}

// 前回選んだ長さを覚えておく。毎回プルダウンを開かせるのは現在バイアスの前では
// ただの「面倒」でしかなく、裏道（制限解除）を探させる方向に働いてしまう。
function getLastScrollDurationMinutes() {
  const v = loadJSON(STORAGE_KEYS.lastScrollDurationMinutes, null);
  return Number.isFinite(v) && v > 0 ? v : null;
}
function saveLastScrollDurationMinutes(minutes) {
  saveJSON(STORAGE_KEYS.lastScrollDurationMinutes, minutes);
}

function populateScrollOnModal() {
  // 時間切れに何が起きるかは設定次第なので、約束する前にその通りに書く。
  document.getElementById("scrollOnDesc").textContent =
    isCloseOnScrollTimeUpEnabled() && !isOpenAppsInSameWindow()
      ? t("Choose a time limit. When time is up, scroll switches back OFF and the app you opened from here is closed.")
      : t("Choose a time limit. Scroll will switch back OFF automatically when time is up.");

  const durationSelect = document.getElementById("durationSelect");
  const chipRow = document.getElementById("durationChips");

  durationSelect.innerHTML = "";
  chipRow.innerHTML = "";

  const last = getLastScrollDurationMinutes();
  let matchedLast = false;

  getDurations().forEach((d) => {
    const opt = document.createElement("option");
    opt.value = String(d.minutes);
    opt.dataset.label = t(d.label);
    opt.textContent = t(d.label);
    durationSelect.appendChild(opt);

    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = t(d.label);
    chip.dataset.minutes = String(d.minutes);
    if (last === d.minutes) {
      chip.classList.add("is-selected");
      opt.selected = true;
      matchedLast = true;
    }
    chipRow.appendChild(chip);
  });

  // よく使う候補のほかに、その場で好きな長さを入れられる選択肢を用意する。
  const customOpt = document.createElement("option");
  customOpt.value = CUSTOM_DURATION_VALUE;
  customOpt.textContent = t("Custom…");
  durationSelect.appendChild(customOpt);

  const customChip = document.createElement("button");
  customChip.type = "button";
  customChip.className = "chip";
  customChip.textContent = t("Custom…");
  customChip.dataset.minutes = CUSTOM_DURATION_VALUE;
  chipRow.appendChild(customChip);

  if (!matchedLast) durationSelect.selectedIndex = 0;
  Array.from(chipRow.children).forEach((c) => {
    c.classList.toggle("is-selected", c.dataset.minutes === durationSelect.value);
  });

  applyCustomDurationVisibility();
}

// チップを押した瞬間に選択を確定し、PINへ視線と入力先を渡す。時間を選ぶ・欄を
// タップする、という二手を一手に近づけるのが狙い（現在バイアスは待たない）。
function selectDurationChip(chip) {
  const chipRow = document.getElementById("durationChips");
  const durationSelect = document.getElementById("durationSelect");
  Array.from(chipRow.children).forEach((c) => c.classList.toggle("is-selected", c === chip));
  durationSelect.value = chip.dataset.minutes;
  applyCustomDurationVisibility();
  if (chip.dataset.minutes === CUSTOM_DURATION_VALUE) {
    document.getElementById("customDurationMinutes").focus();
  } else {
    document.getElementById("scrollPinInput").focus();
  }
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

function pickScrollOnDuration() {
  const durationSelect = document.getElementById("durationSelect");

  if (durationSelect.value === CUSTOM_DURATION_VALUE) {
    const minutes = readCustomDurationMinutes();
    if (minutes < 1) {
      showToast(t("Set a time limit of at least 1 minute"));
      return null;
    }
    return { minutes, durationLabel: formatDurationLabel(minutes) };
  }

  const minutes = Number(durationSelect.value);
  if (!minutes) return null;
  const durationLabel = durationSelect.selectedOptions[0]?.dataset.label || formatDurationLabel(minutes);
  return { minutes, durationLabel };
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
   設定モーダル (制限時間の追加・削除)
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
  { id: "settingsPage-limits", label: "Limits" },
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
  renderDurationList();
  populateAppearanceInputs();
  renderAppInsights();
  document.getElementById("appLockQuestionInput").value = getAppLockQuestion();
  document.getElementById("appLockAnswerSetupInput").value = getAppLockAnswer();
  document.getElementById("biometricAppLockToggle").checked = isBiometricAppLockEnabled();
  document.getElementById("biometricScrollToggle").checked = isBiometricScrollEnabled();
  document.getElementById("biometricCameraToggle").checked = isBiometricCameraPreviewEnabled();
  document.getElementById("postureReminderToggle").checked = isPostureRemindersEnabled();
  document.getElementById("browsingCheckinToggle").checked = isBrowsingCheckinsEnabled();
  document.getElementById("feedGateToggle").checked = isFeedGateEnabled();
  document.getElementById("sameWindowToggle").checked = isOpenAppsInSameWindow();
  document.getElementById("breakEnabledToggle").checked = isBreakEnabled();
  document.getElementById("breakIntervalInput").value = getBreakIntervalMin();
  document.getElementById("breakScrollInput").value = getBreakScrollCount();
  document.getElementById("recommendOrderSelect").value = getRecommendOrder();
  document.getElementById("closeOnTimeUpToggle").checked = isCloseOnScrollTimeUpEnabled();
  document.getElementById("coolOffToggle").checked = isCoolOffEnabled();
  renderAnalyticsSection();
  renderPendingChanges();
  renderPromiseAccuracy();
  renderAspirationList();
  renderIfThenList();
  renderNotificationSection();
  renderScrollGatedAppList();
  renderInstallSection();
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
      browsing: getBrowsingTimeData(),
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
    const app = findApp(id);
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
  const browsing = data.browsing || { totalTimeMs: 0, sessionCount: 0, quickCheckCount: 0 };
  const hasBrowsing = browsing.sessionCount > 0;

  if (scrollCount === 0 && gestureCount === 0 && ids.length === 0 && !hasBrowsing) return [];

  ids.sort((a, b) => apps[b].opens - apps[a].opens);

  const accent = getAppearance().accent;
  const maxValue = Math.max(scrollCount, browsing.sessionCount, ...ids.map((id) => apps[id].opens), 1);
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

  if (hasBrowsing) {
    const avgMs = browsing.totalTimeMs / browsing.sessionCount;
    const quickCount = browsing.quickCheckCount || 0;
    const longCount = browsing.sessionCount - quickCount;
    const parts = [];
    if (quickCount > 0) {
      parts.push(tf(quickCount === 1 ? "{count} quick check" : "{count} quick checks", { count: quickCount }));
    }
    if (longCount > 0) {
      parts.push(tf(longCount === 1 ? "{count} longer session" : "{count} longer sessions", { count: longCount }));
    }
    parts.push(tf("~{total} total (avg {avg})", {
      total: formatInsightDuration(browsing.totalTimeMs),
      avg: formatInsightDuration(avgMs),
    }));
    rows.push({
      name: t("Browsing"),
      value: browsing.sessionCount,
      maxValue,
      color: "var(--text-dim)",
      statsText: parts.join(" · "),
    });
  }

  ids.forEach((id, index) => {
    const app = findApp(id);
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
        browsing: getBrowsingTimeData(),
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
  renderDurationList();
  refreshInsightsGoalSettingUI();
  renderSettingsPage();
  renderDock();
  applyDockCollapsed();
  renderAppInsights();
  // オンボーディング中はまだページ送りが用意されていないので、その時は飛ばす。
  if (PAGINATED_INSIGHTS.main) renderMainInsightsPanel();
  renderBrowser();

  // JSでtextContentを書き換えた箇所は、静的な文字列として控えた元のテキストノードが
  // 差し替わってしまい applyLanguage の対象から外れる。作り直すのはこちらの責任なので、
  // 言語を変えたときは待合室・本棚・設定の動的な部分をまとめて描き直す。
  renderWaitingRoomHome();
  renderShelfView();
  renderAspirationList();
  refreshRoutineTrackerViews();
  renderDayToggleRows();
  renderIfThenList();
  renderPendingChanges();
  renderPromiseAccuracy();
  if (!document.getElementById("scrollOnModal").hidden) populateScrollOnModal();
  if (!document.getElementById("firstRunModal").hidden) renderFirstRunMoment();
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
    const app = findApp(id);
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
      noteBreakScroll();
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
  if (confirmed) logEvent("dock_app_opened", { appId });
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

// タブブラウザで実在サイトを見ている時間。ドックアプリと同じ物差し(反射的な確認/
// 意図的な利用の内訳)で記録する。個々のタブ・URLごとではなく、ブラウジング全体を
// 1つの区分として合算する（タブは頻繁に開閉されるため、アプリのような固定の
// 識別子として扱うのが不自然なため）。
function getBrowsingTimeData() {
  return loadJSON(STORAGE_KEYS.browsingTimeMs, { totalTimeMs: 0, sessionCount: 0, quickCheckCount: 0 });
}

function saveBrowsingTimeData(data) {
  saveJSON(STORAGE_KEYS.browsingTimeMs, data);
}

function recordBrowsingSession(durationMs) {
  if (durationMs <= 0) return;
  const isQuickCheck = durationMs < QUICK_CHECK_THRESHOLD_MS;
  const data = getBrowsingTimeData();
  data.totalTimeMs += durationMs;
  data.sessionCount += 1;
  if (isQuickCheck) data.quickCheckCount += 1;
  saveBrowsingTimeData(data);

  recordHourly((bucket) => {
    if (!bucket.browsing) bucket.browsing = { totalTimeMs: 0, sessionCount: 0, quickCheckCount: 0 };
    bucket.browsing.totalTimeMs += durationMs;
    bucket.browsing.sessionCount += 1;
    if (isQuickCheck) bucket.browsing.quickCheckCount += 1;
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
    data[key] = { apps: {}, browsing: { totalTimeMs: 0, sessionCount: 0, quickCheckCount: 0 }, scrollOnCount: 0, scrollGestureCount: 0, scrollOnTimeMs: 0 };
  }
  mutate(data[key]);
  saveInsightsHourly(data);
}

// prefixは "2026" (年) / "2026-07" (月) / "2026-07-25" (日) / "2026-07-25T14" (時間) のいずれか。
function aggregateInsightsForPrefix(prefix) {
  const hourly = getInsightsHourly();
  const result = {
    apps: {},
    browsing: { totalTimeMs: 0, sessionCount: 0, quickCheckCount: 0 },
    scrollOnCount: 0, scrollGestureCount: 0, scrollOnTimeMs: 0,
  };
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
    if (bucket.browsing) {
      result.browsing.totalTimeMs += bucket.browsing.totalTimeMs || 0;
      result.browsing.sessionCount += bucket.browsing.sessionCount || 0;
      result.browsing.quickCheckCount += bucket.browsing.quickCheckCount || 0;
    }
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

// タブブラウザは意図的にScroll ONの許可とは連動させていない（実在サイトを開く操作を
// PINで縛ると調べもの用途まで摩擦になりすぎるため）。代わりに、閲覧が続いている間
// 一定間隔で「まだ探しているものが見つかっていないか」を振り返らせる（既定はオフ）。
function isBrowsingCheckinsEnabled() {
  return loadJSON(STORAGE_KEYS.browsingCheckinsEnabled, false);
}

function saveBrowsingCheckinsEnabled(value) {
  saveJSON(STORAGE_KEYS.browsingCheckinsEnabled, value);
}

/* --------------------------------------------------------------------------
   「スクロールONでないと開けない」アプリの門番
   Instagram等は X-Frame-Options: DENY / SAMEORIGIN を返すため、このアプリの
   iframeの中には絶対に表示できない（ブラウザ側の決まりで、JSからは外せない）。
   結果、開くと必ず「別タブ＝このアプリの管轄外」になり、スクロールOFFの効き目が
   そこだけ抜けてしまう。中でスクロールを止められない以上、止められる唯一の場所は
   入口なので、スクロールOFFの間は開かせない。
   どのアプリを対象にするかは利用者が選ぶ（既定はフィード系の6つ）。時間を溶かす
   相手は人によって違い、動画や買い物のアプリを止めたい人もいるため。
   -------------------------------------------------------------------------- */
function isFeedGateEnabled() {
  return loadJSON(STORAGE_KEYS.feedAppsNeedScrollOn, true);
}

function saveFeedGateEnabled(value) {
  saveJSON(STORAGE_KEYS.feedAppsNeedScrollOn, value);
}

function getScrollGatedAppIds() {
  const stored = loadJSON(STORAGE_KEYS.scrollGatedApps, null);
  return Array.isArray(stored) ? stored : [...SNS_FEED_PLATFORMS];
}

function saveScrollGatedAppIds(ids) {
  saveJSON(STORAGE_KEYS.scrollGatedApps, ids);
}

// 同じサービスの別ドメインも取りこぼさないようにする。
const DOMAIN_ALIASES = {
  "x.com": ["twitter.com"],
  "threads.net": ["threads.com"],
  "youtube.com": ["youtu.be"],
};

// 対象アプリのドメイン一覧。アドレス欄に直接入力された場合の判定にも使う。
function gatedDomains() {
  const domains = [];
  getScrollGatedAppIds().forEach((id) => {
    const app = findApp(id);
    if (!app || !app.domain) return; // 消されたカスタムタイルは無視する
    domains.push(app.domain, ...(DOMAIN_ALIASES[app.domain] || []));
  });
  return domains;
}

function isGatedUrl(url) {
  const host = hostnameOf(url).toLowerCase();
  if (!host) return false;
  return gatedDomains().some((domain) => host === domain || host.endsWith(`.${domain}`));
}

// 満了済みのisOnが残っていても「ON」と見なさないよう、期限も合わせて確かめる
// （tickがOFFに倒す前の一瞬でも門が開かないようにするため）。
function isScrollCurrentlyOn() {
  const state = ScrollLock.getState();
  return Boolean(state.isOn && state.expiresAt && state.expiresAt > Date.now());
}

// スクロールOFF中に開こうとしている対象アプリかどうか。
function isFeedBlocked(url) {
  return isFeedGateEnabled() && !isScrollCurrentlyOn() && isGatedUrl(url);
}

/* --------------------------------------------------------------------------
   ホーム画面へのインストール（PWA）
   ブラウザのタブとして開いている間は、他アプリを開くと「別のタブ」になり、
   このアプリからは完全に離れてしまう。ホーム画面に入れて単独起動していると、
   同じ操作でも“このアプリの上に重なる小窓”（AndroidのCustom Tab / iOSの
   アプリ内ブラウザ）で開き、閉じればそのまま戻ってこられる。タブも辞書も
   スクロール状態もそのまま残るので、離脱を避けたいならインストールが要になる。
   -------------------------------------------------------------------------- */
let deferredInstallPrompt = null;

function isStandaloneApp() {
  return Boolean(
    (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
      window.navigator.standalone
  );
}

// iOSのSafariはbeforeinstallpromptを持たないため、共有メニューからの手順を案内する。
function isIosDevice() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function renderInstallSection() {
  const status = document.getElementById("installStatusText");
  const btn = document.getElementById("installBtn");
  if (!status || !btn) return;

  if (isStandaloneApp()) {
    status.textContent = t("Installed. Other apps still open outside this app, but most phones now show them as a layer you can close to come straight back rather than switching you away. Either way your tabs, dictionary and scroll state are kept. Other apps' Share button can now send links, text and files straight into your Waiting room, too.");
    btn.hidden = true;
    return;
  }
  if (deferredInstallPrompt) {
    status.textContent = t("Right now other apps open in a separate browser tab, so you leave this app and have to find your way back. Installing it to your home screen usually makes them open as a closable layer instead — the exact behaviour is your phone's choice, not this app's.");
    btn.hidden = false;
    return;
  }
  status.textContent = isIosDevice()
    ? t("Right now other apps open in a separate browser tab, so you leave this app. In Safari, tap the Share button and choose \"Add to Home Screen\" — that usually helps, though iOS sometimes still switches you over to Safari.")
    : t("Open this page in Chrome or Edge and use \"Install app\" (or \"Add to Home Screen\") from the browser menu. Once installed, other apps usually open as a layer you can close to come straight back, instead of taking you away.");
  btn.hidden = true;
}

// 「スクロールONでないと開けない」対象アプリの選択欄。ホーム画面に置ける
// 全アプリ（固定候補＋自分で足したタイル）から選べるようにする。
function renderScrollGatedAppList() {
  const list = document.getElementById("scrollGatedAppList");
  if (!list) return;
  buildAppCandidateListItems(list, getAllAppCandidates(), getScrollGatedAppIds(), "scroll-gated");
}

function readScrollGatedAppSelection() {
  return Array.from(
    document.querySelectorAll('#scrollGatedAppList input[type="checkbox"]:checked')
  ).map((cb) => cb.value);
}

/* --------------------------------------------------------------------------
   通知
   画面を見ていない相手にも届かせるための仕組み。ただしサーバーを持たないアプリ
   なので、押し配りの通知(Web Push)は使えない。出せるのは「このページかService
   Workerが動いている間」だけで、アプリを完全に閉じた後や、同じ画面で他サイトへ
   遷移してこのページが破棄された後には出せない。
   画面を見ている間は既存のトーストで足りるため、隠れている時だけ通知を出す。
   -------------------------------------------------------------------------- */
const NOTIFY_DEFAULTS = {
  scrollAlmostUp: true,
  scrollTimeUp: true,
  focusTimer: true,
  posture: true,
  dailyGoal: true,
};

function getNotifyPrefs() {
  const stored = loadJSON(STORAGE_KEYS.notifyPrefs, null);
  return { ...NOTIFY_DEFAULTS, ...(stored && typeof stored === "object" ? stored : {}) };
}

function saveNotifyPrefs(prefs) {
  saveJSON(STORAGE_KEYS.notifyPrefs, prefs);
}

function notificationsSupported() {
  return typeof Notification !== "undefined";
}

function notificationPermission() {
  return notificationsSupported() ? Notification.permission : "unsupported";
}

async function requestNotificationPermission() {
  if (!notificationsSupported()) return "unsupported";
  try {
    const result = await Notification.requestPermission();
    renderNotificationSection();
    if (result === "granted") {
      showNotification("scrollTimeUp", t("Notifications are on"), t("This is what they'll look like."), { force: true });
    }
    return result;
  } catch (e) {
    return "denied";
  }
}

// Service Worker経由で出すと、通知をタップしたときにこのアプリへ戻せる。
async function showNotification(kind, title, body, options = {}) {
  if (!options.force && !getNotifyPrefs()[kind]) return false;
  if (notificationPermission() !== "granted") return false;
  if (!options.force && !document.hidden) return false;
  const payload = { body, tag: `myhome-${kind}`, lang: currentLanguage };
  try {
    if (navigator.serviceWorker && navigator.serviceWorker.ready) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, payload);
      logEvent("notification_sent", { kind });
      return true;
    }
    new Notification(title, payload);
    logEvent("notification_sent", { kind });
    return true;
  } catch (e) {
    return false;
  }
}

// 画面を見ていれば今までどおりトースト、見ていなければ通知。取り逃しを防ぐ。
// 見出しはアプリ名（訳さない）、本文に伝えたい内容を置く。
function alertUser(kind, message, title) {
  showNotification(kind, title || "MyHome Browser", message);
  showToast(message);
}

/* --------------------------------------------------------------------------
   閉じていても届く通知（push-server/ 、任意・オプトイン、既定OFF）
   ここより上のローカル通知は「このページのJSが動いている間だけ」しか
   出せない。閉じている間にも届かせたい人だけ、外部の小さなサーバーに
   「いつ・何を送るか」だけを預ける。利用状況そのものは一切渡さない。
   -------------------------------------------------------------------------- */
function isPushConfigured() {
  return Boolean(PUSH_SERVER_URL && PUSH_VAPID_PUBLIC_KEY);
}
function isPushEnabled() {
  return isPushConfigured() && loadJSON(STORAGE_KEYS.pushEnabled, false);
}
function savePushEnabled(value) {
  saveJSON(STORAGE_KEYS.pushEnabled, value);
}
function getPushSubscriptionId() {
  return loadJSON(STORAGE_KEYS.pushSubscriptionId, null);
}
function savePushSubscriptionId(id) {
  saveJSON(STORAGE_KEYS.pushSubscriptionId, id);
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from(Array.from(raw).map((c) => c.charCodeAt(0)));
}

async function enablePushNotifications() {
  if (!isPushConfigured()) return { ok: false, reason: "unconfigured" };
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return { ok: false, reason: "unsupported" };
  const permission = await requestNotificationPermission();
  if (permission !== "granted") return { ok: false, reason: "denied" };
  try {
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUSH_VAPID_PUBLIC_KEY),
      });
    }
    const res = await fetch(`${PUSH_SERVER_URL}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription: sub.toJSON() }),
    });
    if (!res.ok) throw new Error("subscribe failed");
    const data = await res.json();
    savePushSubscriptionId(data.id);
    savePushEnabled(true);
    // 有効化した瞬間にすでに動いている予定（スクロールON中など）があれば、
    // 追いつけるものだけ今すぐ登録し直す。
    resyncPushSchedules();
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: "network" };
  }
}

function disablePushNotifications() {
  savePushEnabled(false);
  const id = getPushSubscriptionId();
  if (id && isPushConfigured()) {
    fetch(`${PUSH_SERVER_URL}/unsubscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  }
  savePushSubscriptionId(null);
}

// slotは同じ枠を上書きする論理名（scrollAlmostUp/scrollTimeUp/focusTimer/posture）。
// 同じslotで呼び直すと、サーバー側の予定はそのまま置き換わる。
function schedulePush(slot, sendAt, title, body, opts = {}) {
  if (!isPushEnabled()) return;
  const id = getPushSubscriptionId();
  if (!id) return;
  fetch(`${PUSH_SERVER_URL}/schedule`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      slot,
      sendAt,
      title,
      body,
      tag: `myhome-${slot}`,
      recurringIntervalMin: opts.recurringIntervalMin,
      recurringUntil: opts.recurringUntil,
    }),
  }).catch(() => {});
}

function cancelPush(slot) {
  if (!isPushConfigured()) return;
  const id = getPushSubscriptionId();
  if (!id) return;
  fetch(`${PUSH_SERVER_URL}/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, slot }),
  }).catch(() => {});
}

// スクロールONの間に届き得る3種類（残り1分・時間切れ・姿勢）をまとめて予約する。
function scheduleScrollPushes(expiresAt) {
  if (!isPushEnabled()) return;
  const prefs = getNotifyPrefs();
  if (prefs.scrollAlmostUp) {
    schedulePush("scrollAlmostUp", expiresAt - SCROLL_ALMOST_UP_MS, "MyHome Browser", t("About a minute left before scroll switches back OFF."));
  }
  if (prefs.scrollTimeUp) {
    schedulePush("scrollTimeUp", expiresAt, "MyHome Browser", t("Time's up — scroll switched back OFF"));
  }
  if (prefs.posture && isPostureRemindersEnabled()) {
    schedulePush(
      "posture",
      Date.now() + POSTURE_REMINDER_INTERVAL_MIN * 60000,
      "MyHome Browser",
      t("Posture check: try sitting up and holding the phone at eye level for a moment."),
      { recurringIntervalMin: POSTURE_REMINDER_INTERVAL_MIN, recurringUntil: expiresAt }
    );
  }
}
function cancelScrollPushes() {
  cancelPush("scrollAlmostUp");
  cancelPush("scrollTimeUp");
  cancelPush("posture");
}

// 通知をオンにした瞬間、すでにスクロールONやフォーカスタイマーが動いていれば
// 予約し直す（オンにする前は購読先が無く送りようが無かったため）。
function resyncPushSchedules() {
  if (!isPushEnabled()) return;
  const scrollState = ScrollLock.getState();
  if (scrollState.isOn && scrollState.expiresAt) scheduleScrollPushes(scrollState.expiresAt);
  const timerState = loadJSON(STORAGE_KEYS.focusTimer, { expiresAt: null });
  if (timerState.expiresAt && timerState.expiresAt > Date.now() && getNotifyPrefs().focusTimer) {
    schedulePush("focusTimer", timerState.expiresAt, "MyHome Browser", t("Timer's up"));
  }
}

function renderPushSection() {
  const section = document.getElementById("pushSection");
  const toggle = document.getElementById("pushEnabledToggle");
  if (!section || !toggle) return;
  section.hidden = !isPushConfigured();
  toggle.checked = isPushEnabled();
}

/* --------------------------------------------------------------------------
   通知ON/OFFの一発切り替え（ホーム画面の常設ボタン）
   細かい種類ごとの設定はSettingsに残したまま、ここでは「全部つける／
   全部消す」だけをまとめて行う。設定を開かなくても1タップで届く場所に置く。
   -------------------------------------------------------------------------- */
function areAllNotificationsOn() {
  if (notificationPermission() !== "granted") return false;
  const prefs = getNotifyPrefs();
  const localOn = Object.values(prefs).every(Boolean);
  return isPushConfigured() ? localOn && isPushEnabled() : localOn;
}

async function toggleAllNotifications() {
  if (areAllNotificationsOn()) {
    saveNotifyPrefs({ scrollAlmostUp: false, scrollTimeUp: false, focusTimer: false, posture: false, dailyGoal: false });
    if (isPushEnabled()) disablePushNotifications();
    renderNotifyQuickToggle();
    renderNotificationSection();
    return;
  }
  if (notificationPermission() !== "granted") {
    const result = await requestNotificationPermission();
    if (result !== "granted") {
      renderNotifyQuickToggle();
      return;
    }
  }
  saveNotifyPrefs({ scrollAlmostUp: true, scrollTimeUp: true, focusTimer: true, posture: true, dailyGoal: true });
  if (isPushConfigured() && !isPushEnabled()) await enablePushNotifications();
  renderNotifyQuickToggle();
  renderNotificationSection();
}

function renderNotifyQuickToggle() {
  const btn = document.getElementById("notifyQuickToggleBtn");
  if (!btn) return;
  const on = areAllNotificationsOn();
  btn.classList.toggle("is-off", !on);
  btn.textContent = on ? "🔔" : "🔕";
  btn.setAttribute("aria-label", on ? t("Notifications on — tap to turn off") : t("Notifications off — tap to turn on"));
}

/* --------------------------------------------------------------------------
   匿名の利用ログ（push-server/ 、通知とは別枠）
   PUSH_SERVER_URLを設定した時点で、意味のある操作の名前（例:「スクロールをONにした」）
   を自動的に送る。オン/オフの切り替えは無く、サーバーを立てれば確実に送られる。
   生のタップ座標・スクロール量・辞書や本棚の中身は対象にしない。
   送信先はpush-serverと同じWorkerの別エンドポイントで、そこから
   Google Sheetsへまとめて転記される（push-server/README.md参照）。
   -------------------------------------------------------------------------- */
function isAnalyticsConfigured() {
  return Boolean(PUSH_SERVER_URL);
}
function isAnalyticsEnabled() {
  return isAnalyticsConfigured();
}
function getAnalyticsDeviceId() {
  let id = loadJSON(STORAGE_KEYS.analyticsDeviceId, null);
  if (!id) {
    id = crypto.randomUUID();
    saveJSON(STORAGE_KEYS.analyticsDeviceId, id);
  }
  return id;
}

// name は下のANALYTICS_EVENTSに載っている決まった名前だけを使う（README参照）。
// propsは小さな数値・短い文字列程度に留め、自由記述のテキストは入れない。
function logEvent(name, props) {
  if (!isAnalyticsEnabled()) return;
  fetch(`${PUSH_SERVER_URL}/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: getAnalyticsDeviceId(), name, props: props || {}, ts: Date.now() }),
  }).catch(() => {});
}

function renderAnalyticsSection() {
  const section = document.getElementById("analyticsSection");
  if (!section) return;
  section.hidden = !isAnalyticsConfigured();
}

// 1日の目標を超えた瞬間に一度だけ知らせる（同じ日に何度も鳴らさない）。
function maybeNotifyDailyGoal() {
  const goalMinutes = getInsightsGoalMinutes();
  if (!goalMinutes) return;
  const today = dayPrefix(new Date());
  if (loadJSON(STORAGE_KEYS.notifyGoalDay, null) === today) return;
  if (totalUsageMsForDay(new Date()) <= goalMinutes * 60000) return;
  saveJSON(STORAGE_KEYS.notifyGoalDay, today);
  showNotification(
    "dailyGoal",
    t("You've passed your daily limit"),
    tf("Today is over your {minutes} min goal.", { minutes: goalMinutes })
  );
}

function renderNotificationSection() {
  const status = document.getElementById("notifyStatusText");
  const btn = document.getElementById("notifyEnableBtn");
  const list = document.getElementById("notifyPrefList");
  if (!status || !btn || !list) return;

  const permission = notificationPermission();
  list.hidden = permission !== "granted";
  btn.hidden = permission !== "default";

  if (permission === "unsupported") {
    status.textContent = t("This browser can't show notifications.");
  } else if (permission === "granted") {
    status.textContent = t("Notifications are allowed. They can only reach you while this app is still running in the background — once it's fully closed, nothing can wake it.");
  } else if (permission === "denied") {
    status.textContent = t("Notifications are blocked. Allow them for this app in your browser or phone settings, then come back.");
  } else {
    status.textContent = t("Let this app notify you when scroll time runs out, a timer ends, or you pass your daily limit.");
  }

  const prefs = getNotifyPrefs();
  list.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.checked = Boolean(prefs[cb.value]);
  });
  renderPushSection();
  renderNotifyQuickToggle();
}

function initInstallPrompt() {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    renderInstallSection();
  });
  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    renderInstallSection();
    showToast(t("Installed to your home screen"));
  });
}

// 断ったアプリ(またはURL)を覚えておき、スクロールONが済んだらそのまま開く。
// 時間制限とPINまで通した後に、もう一度アイコンを押させて「本当に開きますか」
// と訊くのは、同じ意思を二度確かめているだけなので省く。
let pendingBlockedTarget = null;

function openFeedBlockedModal(target) {
  pendingBlockedTarget = target;
  document.getElementById("feedBlockedDesc").textContent = tf(
    "Turn scroll ON with a time limit, and {app} will open.",
    { app: target.name }
  );
  // 落ち着いていたときに自分で決めた約束を、まさにその場面で読み返す。
  const rule = nextIfThenRule();
  const ruleBox = document.getElementById("feedBlockedRule");
  ruleBox.hidden = !rule;
  if (rule) {
    document.getElementById("feedBlockedRuleText").textContent = tf("If {trigger}, then {action}", {
      trigger: rule.trigger,
      action: rule.action,
    });
  }
  document.getElementById("feedBlockedModal").hidden = false;
  logEvent("feed_blocked", { appId: target.app ? target.app.id : hostnameOf(target.url) });
}

function hideFeedBlockedModal() {
  document.getElementById("feedBlockedModal").hidden = true;
}

function closeFeedBlockedModal() {
  hideFeedBlockedModal();
  pendingBlockedTarget = null;
}

// 自分で決めた休憩の最中に、ドックの他アプリを開こうとしたときの門前払い。
function openBreakLockModal(app) {
  document.getElementById("breakLockDesc").textContent = tf("{app} stays closed until your break ends.", { app: app.name });
  document.getElementById("breakLockModal").hidden = false;
}
function closeBreakLockModal() {
  document.getElementById("breakLockModal").hidden = true;
}

// スクロールONに成功した直後に呼ぶ。覚えていた相手をそのまま開く。
function resumeBlockedTarget() {
  const target = pendingBlockedTarget;
  pendingBlockedTarget = null;
  if (!target) return false;
  if (target.app) {
    recordAppOpenDecision(target.app.id, true);
    renderAppInsights();
    openApp(target.app);
    return true;
  }
  if (target.url) {
    openTab(target.url);
    return true;
  }
  return false;
}

// その日の合計利用時間（各アプリの滞在時間 + スクロールONだった時間）をミリ秒で返す。
function totalUsageMsForDay(date) {
  const data = aggregateInsightsForPrefix(dayPrefix(date));
  const appsMs = Object.values(data.apps).reduce((sum, entry) => sum + (entry.totalTimeMs || 0), 0);
  return appsMs + (data.browsing.totalTimeMs || 0) + (data.scrollOnTimeMs || 0);
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
    const browsingMs = (bucket.browsing && bucket.browsing.totalTimeMs) || 0;
    totals[Number(h)] += appsMs + browsingMs + (bucket.scrollOnTimeMs || 0);
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
// 同じ画面で遷移して開く設定のときは、このページ自体が破棄されてから戻ってくる。
// メモリ上の変数では滞在時間を数え損ねるので、保存領域に置いて再訪時に拾い直す。
function startAwaySession(appId) {
  if (!appId) return;
  // 出ていく時点で「あと何分」と決めていたかを一緒に控える。戻ってきたときに
  // 実際の滞在時間と突き合わせるため（宣言と実測の差は、自分では見えにくい）。
  const scroll = ScrollLock.getState();
  const promisedMs =
    scroll.isOn && scroll.expiresAt && scroll.expiresAt > Date.now() ? scroll.expiresAt - Date.now() : null;
  saveJSON(STORAGE_KEYS.pendingAwaySession, { appId, startedAt: Date.now(), promisedMs });
}

function endAwaySessionIfAny() {
  const pending = loadJSON(STORAGE_KEYS.pendingAwaySession, null);
  if (!pending || !pending.appId || !pending.startedAt) return;
  const actualMs = Date.now() - pending.startedAt;
  recordAppSession(pending.appId, actualMs);
  saveJSON(STORAGE_KEYS.pendingAwaySession, null);
  if (pending.promisedMs) notePromiseKept(pending.promisedMs, actualMs);
}

/* --------------------------------------------------------------------------
   決めた時間と、実際にかかった時間
   人は自分がどれだけ使ったかを短く見積もる。禁じるのではなく、宣言と実測の
   差をそのつど一度だけ見せる。数字は既にどちらも持っているので、引き算するだけ。
   -------------------------------------------------------------------------- */
const PROMISE_HISTORY_MAX = 20;
// 数十秒のずれをいちいち咎めても意味がないので、明確に超えたときだけ言う。
const PROMISE_OVERRUN_GRACE_MS = 60 * 1000;

function getPromiseHistory() {
  const list = loadJSON(STORAGE_KEYS.promiseHistory, []);
  return Array.isArray(list) ? list.filter((p) => p && p.promisedMs && p.actualMs) : [];
}

function notePromiseKept(promisedMs, actualMs) {
  const list = getPromiseHistory();
  list.push({ promisedMs, actualMs, at: Date.now() });
  saveJSON(STORAGE_KEYS.promiseHistory, list.slice(-PROMISE_HISTORY_MAX));

  if (actualMs <= promisedMs + PROMISE_OVERRUN_GRACE_MS) return;
  const summary = promiseSummary();
  showToast(
    tf("You said {promised}. It was {actual} — {over} of your last {total} went over.", {
      promised: formatDurationLabel(Math.round(promisedMs / 60000)),
      actual: formatDurationLabel(Math.round(actualMs / 60000)),
      over: summary.over,
      total: summary.total,
    })
  );
}

function promiseSummary() {
  const list = getPromiseHistory();
  const over = list.filter((p) => p.actualMs > p.promisedMs + PROMISE_OVERRUN_GRACE_MS);
  const overrunMs = over.reduce((sum, p) => sum + (p.actualMs - p.promisedMs), 0);
  return {
    total: list.length,
    over: over.length,
    avgOverrunMin: over.length ? Math.round(overrunMs / over.length / 60000) : 0,
  };
}

function renderPromiseAccuracy() {
  const note = document.getElementById("promiseAccuracyNote");
  if (!note) return;
  const s = promiseSummary();
  note.hidden = s.total === 0;
  if (!s.total) return;
  note.textContent = s.over
    ? tf("You went past your own limit on {over} of the last {total} times you left, by {avg} on average.", {
        over: s.over,
        total: s.total,
        avg: formatDurationLabel(Math.max(1, s.avgOverrunMin)),
      })
    : tf("You came back within your own limit all {total} of the last times you left.", { total: s.total });
}

function initAwaySessionTracking() {
  // 同じ画面で開いた場合、戻ってくるのは「再訪」ではなく読み込み直しなので
  // visibilitychangeは発火しない。起動時にも取り残しを締める。
  endAwaySessionIfAny();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      endBrowsingSessionIfAny();
      return;
    }
    endAwaySessionIfAny();
    renderAppInsights();
    startBrowsingSessionIfNeeded();
  });
  window.addEventListener("pagehide", endBrowsingSessionIfAny);
}

// 他アプリの開き方は2通りあり、どちらが快適かは端末とブラウザで変わるので選べる。
//
// 同じ画面で開く(既定): location.href で移動する。iframeではなく最上位の遷移なので
//   X-Frame-Options に阻まれず、しかも新しいタブやSafari本体へ切り替わらないため、
//   OSから見れば「MyHome Browserを開いたまま」になる。戻るジェスチャ/戻るボタンで
//   このアプリへ帰ってくる（状態はすべて保存済みなので読み直して復元される）。
// 別タブで開く: 従来どおり window.open。このアプリは残るが、別のタブ（環境により
//   別アプリ）に切り替わる。
function isOpenAppsInSameWindow() {
  return loadJSON(STORAGE_KEYS.openAppsInSameWindow, true);
}

function saveOpenAppsInSameWindow(value) {
  saveJSON(STORAGE_KEYS.openAppsInSameWindow, value);
}

/* --------------------------------------------------------------------------
   開いたタブを握っておく
   window.open の戻り値(タブへの参照)を捨てずに持っておくと、中身は読めなくても
   close() だけは呼べる。つまり時間切れの瞬間に、こちらからそのタブを閉じられる。
   決めた時間制限が、初めて向こう側にも効くことになる。
   引き換えに noopener を外すことになり、開いた先から window.opener 経由で
   こちらのページを別の場所へ飛ばせる余地が生まれる（相手は自分で選んだ大手
   サイトなので実害は考えにくいが、皆無ではない）。だから設定で切れるようにする。
   -------------------------------------------------------------------------- */
function isCloseOnScrollTimeUpEnabled() {
  return loadJSON(STORAGE_KEYS.closeOnScrollTimeUp, true);
}

function saveCloseOnScrollTimeUpEnabled(value) {
  saveJSON(STORAGE_KEYS.closeOnScrollTimeUp, value);
}

// 参照はメモリ上にしか持てない。別タブで開く設定のときはこのページが生き続ける
// ので保つが、同じ画面で開く設定では遷移した時点で失われる（その場合そもそも
// 閉じる対象のタブが無い）。
let openedAppWindows = [];

function trackOpenedWindow(win) {
  if (win) openedAppWindows.push(win);
}

function forgetClosedWindows() {
  openedAppWindows = openedAppWindows.filter((win) => {
    try {
      return win && !win.closed;
    } catch (e) {
      return false;
    }
  });
}

function closeOpenedAppWindows() {
  let closed = 0;
  openedAppWindows.forEach((win) => {
    try {
      if (win && !win.closed) {
        win.close();
        closed++;
      }
    } catch (e) {
      /* 既に閉じられている等。閉じられなくても数えないだけ */
    }
  });
  openedAppWindows = [];
  return closed;
}

function openApp(app) {
  // 数え始めてから移動する。同じ画面で開く場合はこの直後にページが破棄されるため、
  // 先に保存しておかないと滞在時間を取り逃す。
  startAwaySession(app.id);
  if (isOpenAppsInSameWindow()) {
    window.location.href = app.web;
    return;
  }
  forgetClosedWindows();
  if (isCloseOnScrollTimeUpEnabled()) {
    trackOpenedWindow(window.open(app.web, "_blank"));
    return;
  }
  window.open(app.web, "_blank", "noopener");
}

/* ==========================================================================
   ドックのアプリを開く前の確認モーダル
   ========================================================================== */

let pendingConfirmApp = null;

function openAppOpenConfirm(app) {
  // 自分で決めた休憩中は、このアプリ経由で他アプリを開く経路をすべて塞ぐ。
  // OS側のアプリ切り替え自体は止められないので、あくまで「このアプリからは」の話。
  if (isSelfBreakActive()) {
    openBreakLockModal(app);
    return;
  }
  // スクロールOFF中のフィード系は、確認モーダルではなく門前払いにする。
  if (isFeedBlocked(app.web)) {
    openFeedBlockedModal({ name: app.name, app });
    return;
  }
  pendingConfirmApp = app;
  document.getElementById("appOpenConfirmTitle").textContent = tf("Open {app}?", { app: app.name });
  // 開き方の設定で実際に起きることが変わるので、文言もそれに合わせる。
  document.getElementById("appOpenConfirmDesc").textContent = isOpenAppsInSameWindow()
    ? tf("{app} loads in this window, so your phone never switches away from MyHome Browser. Press back to return — everything here will be as you left it.", { app: app.name })
    : tf("{app} opens in a separate browser tab, so you'll leave MyHome Browser and have to find your way back. Installing this app to your home screen usually improves that — see Settings.", { app: app.name });
  document.getElementById("appOpenConfirmModal").hidden = false;
}

function closeAppOpenConfirm() {
  document.getElementById("appOpenConfirmModal").hidden = true;
  pendingConfirmApp = null;
}

// アプリ候補のチェックボックス一覧を作る共通処理。
// Edit Appsモーダルと初回起動時のSNS選択ステップの両方から使う。
function buildAppCandidateListItems(list, candidates, selectedIds, idPrefix, options = {}) {
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

    if (options.onRemove && app.custom) {
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "candidate-remove-btn";
      removeBtn.setAttribute("aria-label", tf("Remove {app}", { app: app.name }));
      removeBtn.textContent = "×";
      removeBtn.addEventListener("click", () => options.onRemove(app.id));
      li.appendChild(removeBtn);
    }

    list.appendChild(li);
  });
}

// ドックの並び順を編集中の一時状態。ピッカーを開いている間だけ使い、
// 保存ボタンを押した時にこの順序でSTORAGE_KEYS.selectedAppsへ書き込む。
let pendingAppOrder = [];

function initPendingAppOrder() {
  const validIds = new Set(getAllAppCandidates().map((a) => a.id));
  pendingAppOrder = getSelectedAppIds().filter((id) => validIds.has(id));
}

function renderAppPickerList() {
  const list = document.getElementById("appCandidateList");
  buildAppCandidateListItems(list, getAllAppCandidates(), pendingAppOrder, "app", {
    onRemove: (id) => {
      removeCustomApp(id);
      pendingAppOrder = pendingAppOrder.filter((oid) => oid !== id);
      renderAppPickerList();
      renderAppOrderList();
    },
  });
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

function moveAppOrder(index, delta) {
  const target = index + delta;
  if (target < 0 || target >= pendingAppOrder.length) return;
  [pendingAppOrder[index], pendingAppOrder[target]] = [pendingAppOrder[target], pendingAppOrder[index]];
  renderAppOrderList();
}

function renderAppOrderList() {
  const list = document.getElementById("appOrderList");
  list.innerHTML = "";

  if (pendingAppOrder.length === 0) {
    const empty = document.createElement("li");
    empty.className = "app-order-empty";
    empty.textContent = t("Check some apps above to arrange their order.");
    list.appendChild(empty);
    return;
  }

  pendingAppOrder.forEach((id, index) => {
    const app = findApp(id);
    if (!app) return;

    const li = document.createElement("li");
    li.className = "app-order-row";

    const iconWrap = document.createElement("span");
    iconWrap.className = "candidate-icon";
    iconWrap.appendChild(buildAppIcon(app));
    li.appendChild(iconWrap);

    const name = document.createElement("span");
    name.className = "app-order-name";
    name.textContent = app.name;
    li.appendChild(name);

    const upBtn = document.createElement("button");
    upBtn.type = "button";
    upBtn.className = "order-btn";
    upBtn.textContent = "↑";
    upBtn.disabled = index === 0;
    upBtn.setAttribute("aria-label", tf("Move {app} earlier", { app: app.name }));
    upBtn.addEventListener("click", () => moveAppOrder(index, -1));
    li.appendChild(upBtn);

    const downBtn = document.createElement("button");
    downBtn.type = "button";
    downBtn.className = "order-btn";
    downBtn.textContent = "↓";
    downBtn.disabled = index === pendingAppOrder.length - 1;
    downBtn.setAttribute("aria-label", tf("Move {app} later", { app: app.name }));
    downBtn.addEventListener("click", () => moveAppOrder(index, 1));
    li.appendChild(downBtn);

    list.appendChild(li);
  });
}

function openAppPicker() {
  initPendingAppOrder();
  renderAppPickerList();
  renderAppOrderList();
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

// X-Frame-Options / CSP frame-ancestors で埋め込み表示そのものを拒否することが
// 確認できている主要サイト。iframeで開こうとしても壊れた表示になるだけなので、
// ドックアプリと同じくOSの実ブラウザで新しいタブとして開く。
const NON_EMBEDDABLE_DOMAINS = [
  "google.com", "duckduckgo.com", "instagram.com", "facebook.com",
  "x.com", "twitter.com", "youtube.com", "tiktok.com",
];

function isNonEmbeddableUrl(url) {
  const host = hostnameOf(url).toLowerCase();
  if (!host) return false;
  return NON_EMBEDDABLE_DOMAINS.some((domain) => host === domain || host.endsWith(`.${domain}`));
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

/* --------------------------------------------------------------------------
   検索: Wikipedia API (action=query&list=search) を使う。
   主要な検索エンジンのページ自体をiframeで開こうとするとX-Frame-Options等で
   軒並み拒否される（DuckDuckGo/Google/Bing含む多くのサイトで確認済み）ため、
   検索エンジンのページを埋め込むのではなく、JSON APIを直接叩いて結果を
   アプリ自身のUIに一覧表示する方式にした。Wikipedia APIはCORS対応済み・
   APIキー不要（ヘッダーで access-control-allow-origin: * を確認済み）なので、
   ユーザー自身のAPIキー登録が要らない。一方でWikipedia内の記事しか検索
   できない（一般的なWeb検索ではない）。
   -------------------------------------------------------------------------- */
function wikipediaApiUrl(query) {
  const lang = LANGUAGES.some((l) => l.code === currentLanguage) ? currentLanguage : "en";
  return `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=10&srsearch=${encodeURIComponent(query)}`;
}
function wikipediaArticleUrl(title) {
  const lang = LANGUAGES.some((l) => l.code === currentLanguage) ? currentLanguage : "en";
  return `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
}
// snippetにはWikipedia側が付けた<span class="searchmatch">等のHTMLが含まれるため、
// 表示前にプレーンテキストへ落とす（未挿入のdivなのでscriptは実行されない）。
function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || "";
}

function resolveNavigationUrl(input) {
  const trimmed = input.trim();
  if (!trimmed || !looksLikeUrl(trimmed)) return null;
  return normalizeUrl(trimmed);
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

/* --------------------------------------------------------------------------
   1件だけを枠の中に出す
   これらのサイトはトップページ(フィード)の枠内表示を拒否する一方、自分たちが
   配っている「埋め込み用アドレス」は拒否していない（ヘッダーで確認済み）。
   つまり「無限に流れてくる部分」は入らないが、「見たかった1本の動画・1件の
   投稿」なら、このアプリを離れずにその場で見られる。
   このアプリの目的からすると、これは制限ではなくむしろ望ましい形——欲しかった
   物だけ渡して、フィードは渡さない。
   -------------------------------------------------------------------------- */
function toEmbeddableUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch (e) {
    return null;
  }
  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  const path = parsed.pathname;

  // YouTube: watch?v= / youtu.be/ / shorts/ のいずれも動画IDを取り出す。
  // rel=0 で終了後の関連動画を抑え、nocookie版を使う。
  const youtubeId =
    host === "youtu.be" ? path.slice(1).split("/")[0]
    : host.endsWith("youtube.com") && path === "/watch" ? parsed.searchParams.get("v")
    : host.endsWith("youtube.com") && path.startsWith("/shorts/") ? path.split("/")[2]
    : host.endsWith("youtube.com") && path.startsWith("/embed/") ? path.split("/")[2]
    : null;
  if (youtubeId && /^[\w-]{6,20}$/.test(youtubeId)) {
    return { url: `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`, kind: "video" };
  }

  // Instagram: 投稿とリールの個別ページ。
  const instaMatch = host.endsWith("instagram.com") && path.match(/^\/(p|reel|tv)\/([\w-]+)/);
  if (instaMatch) {
    return { url: `https://www.instagram.com/${instaMatch[1]}/${instaMatch[2]}/embed/`, kind: "post" };
  }

  // X / Twitter: 個別のポスト。
  const xMatch = (host.endsWith("x.com") || host.endsWith("twitter.com")) && path.match(/\/status\/(\d+)/);
  if (xMatch) {
    return { url: `https://platform.twitter.com/embed/Tweet.html?id=${xMatch[1]}`, kind: "post" };
  }

  return null;
}

// アドレス欄・辞書・本棚などからの入力の入口。アドレスらしければ直接開き、
// そうでなければ検索語として扱い、Wikipediaの結果一覧をアプリ内に出す
// （検索エンジンのページそのものはiframe埋め込みを拒否するため）。
function openTab(rawInput) {
  const raw = String(rawInput).trim();
  if (!raw) return;
  if (!looksLikeUrl(raw)) {
    document.getElementById("searchInput").value = "";
    performSearch(raw);
    return;
  }
  document.getElementById("searchInput").value = "";
  openResolvedTab(normalizeUrl(raw), "", "");
}

// URLをタブとして実際に開く共通処理。アドレス欄からの直接入力も、検索結果
// 一覧からの「開く」も、ここを通る。titleを渡さなければホスト名を使う。
function openResolvedTab(url, title, query) {
  if (isAdBlockedUrl(url)) {
    showToast(t("Blocked: this looks like an ad or tracking domain"));
    return;
  }
  // 1件ものは門番より先に拾う。フィードではないので止める理由がなく、しかも
  // 離れずに済む唯一の形なので、スクロールOFF中でもここだけは通す。
  const embed = toEmbeddableUrl(url);
  if (embed) {
    openEmbedTab(embed.url, title || hostnameOf(url), embed.kind);
    return;
  }
  // アドレス欄や辞書から直接開こうとした場合も、ドックと同じ門をくぐらせる。
  if (isFeedBlocked(url)) {
    openFeedBlockedModal({ name: title || hostnameOf(url), url });
    return;
  }
  if (isNonEmbeddableUrl(url)) {
    // 枠内に出せないサイトも、アプリの開き方の設定に合わせる。
    if (isOpenAppsInSameWindow()) {
      window.location.href = url;
      return;
    }
    forgetClosedWindows();
    if (isCloseOnScrollTimeUpEnabled()) {
      trackOpenedWindow(window.open(url, "_blank"));
    } else {
      window.open(url, "_blank", "noopener");
    }
    showToast(tf("{domain} doesn't allow embedding, so it opened in your browser instead.", { domain: hostnameOf(url) }));
    return;
  }
  // 検索して開いた場合は「調べた言葉」をタブに覚えておく。タブの見出しにも使い、
  // ☆で辞書に保存するときの見出し語の既定値にもなる。
  const tabs = getBrowserTabs();
  const tab = { id: makeTabId(), url, title: title || query || hostnameOf(url) || url, query: query || "" };
  tabs.push(tab);
  saveBrowserTabs(tabs);
  saveActiveTabId(tab.id);
  tabStripPage = tabStripPageForIndex(tabs.length - 1);
  renderBrowser();
}

// 埋め込み用アドレスをタブとして開く。見出しは元のサイト名にしておかないと
// 「platform.twitter.com」のような内部向けの名前が並んでしまう。
function openEmbedTab(embedUrl, title, kind) {
  const tabs = getBrowserTabs();
  const tab = { id: makeTabId(), url: embedUrl, title, query: "", embed: kind };
  tabs.push(tab);
  saveBrowserTabs(tabs);
  saveActiveTabId(tab.id);
  tabStripPage = tabStripPageForIndex(tabs.length - 1);
  renderBrowser();
  showToast(kind === "video" ? t("Playing here, without the feed") : t("Showing this post here, without the feed"));
}

/* --------------------------------------------------------------------------
   検索結果一覧（Wikipedia API）。結果ページをiframeで開くのではなく、
   JSON APIから受け取ったタイトル/抜粋/URLをこのアプリ自身の一覧UIで表示する。
   行をタップすると初めてopenResolvedTab()でタブとして開く。星をタップすれば
   タブを開かずその場で辞書に保存でき（ワンタッチ）、鉛筆から要約を自分の
   言葉に書き換えてから保存することも任意でできる。
   -------------------------------------------------------------------------- */
let searchResultsPage = 0;
let searchResultsQuery = "";
let searchResultsItems = [];
let searchResultsState = "idle"; // idle | loading | results | empty | error
let searchResultsErrorMessage = "";
let searchResultsRequestId = 0;
let searchResultsNoteEditUrl = null; // 「自分で要約を書く」を開いている行のurl
const SEARCH_RESULTS_FALLBACK_PER_PAGE = 4;
const SEARCH_RESULTS_ROW_GAP = 8;

async function performSearch(query) {
  searchResultsQuery = query;
  searchResultsPage = 0;
  searchResultsNoteEditUrl = null;
  const requestId = ++searchResultsRequestId;

  searchResultsState = "loading";
  searchResultsItems = [];
  openSearchResultsModal();

  try {
    const res = await fetch(wikipediaApiUrl(query));
    const data = await res.json().catch(() => ({}));
    if (requestId !== searchResultsRequestId) return; // 別の検索が割り込んでいたら破棄

    if (!res.ok || (data && data.error)) {
      searchResultsState = "error";
      searchResultsErrorMessage = (data && data.error && data.error.info) || `HTTP ${res.status}`;
      searchResultsItems = [];
    } else {
      const results = (data.query && data.query.search) || [];
      searchResultsItems = results.map((item) => ({
        title: item.title,
        snippet: stripHtml(item.snippet || ""),
        url: wikipediaArticleUrl(item.title),
        displayUrl: hostnameOf(wikipediaArticleUrl(item.title)),
      }));
      searchResultsState = searchResultsItems.length ? "results" : "empty";
    }
  } catch (e) {
    if (requestId !== searchResultsRequestId) return;
    searchResultsState = "error";
    searchResultsErrorMessage = String((e && e.message) || e);
    searchResultsItems = [];
  }
  renderSearchResults();
}

function buildSearchResultRow(item) {
  const li = document.createElement("li");
  li.className = "search-result-row";

  const open = document.createElement("button");
  open.type = "button";
  open.className = "search-result-open-btn";
  const title = document.createElement("span");
  title.className = "search-result-title";
  title.textContent = item.title;
  const snippet = document.createElement("span");
  snippet.className = "search-result-snippet";
  snippet.textContent = item.snippet;
  const url = document.createElement("span");
  url.className = "search-result-url";
  url.textContent = item.displayUrl;
  open.append(title, snippet, url);
  open.addEventListener("click", () => {
    closeSearchResultsModal();
    openResolvedTab(item.url, item.title, item.title);
  });
  li.appendChild(open);

  const actions = document.createElement("span");
  actions.className = "search-result-actions";

  // ワンタッチ保存: 星をタップした瞬間に、タイトル・Wikipediaの抜粋・URLで
  // そのまま辞書に入る。タブを開く必要はない。
  const saved = isWordSaved(item.url);
  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.className = "icon-btn search-result-save-btn" + (saved ? " is-active" : "");
  saveBtn.textContent = saved ? "★" : "☆";
  saveBtn.setAttribute("aria-label", saved ? t("Remove from your dictionary") : t("Save to your dictionary"));
  saveBtn.addEventListener("click", () => {
    if (isWordSaved(item.url)) {
      removeDictEntryByUrl(item.url);
      showToast(t("Removed from your dictionary"));
    } else {
      const result = addDictEntry({ word: item.title, note: item.snippet, url: item.url, group: 0 });
      if (result.ok) celebrate(t("Added to your dictionary"));
      else showToast(result.message);
    }
    searchResultsNoteEditUrl = null;
    renderSearchResults();
  });
  actions.appendChild(saveBtn);

  if (!saved) {
    // 任意: Wikipediaの抜粋そのままではなく、自分の言葉で要約を書いてから保存したい場合。
    const noteBtn = document.createElement("button");
    noteBtn.type = "button";
    noteBtn.className = "icon-btn search-result-note-btn";
    noteBtn.textContent = "✎";
    noteBtn.setAttribute("aria-label", t("Save with your own note"));
    noteBtn.addEventListener("click", () => {
      searchResultsNoteEditUrl = searchResultsNoteEditUrl === item.url ? null : item.url;
      renderSearchResults();
    });
    actions.appendChild(noteBtn);
  }
  li.appendChild(actions);

  if (searchResultsNoteEditUrl === item.url) {
    const editor = document.createElement("div");
    editor.className = "search-result-note-editor";
    const textarea = document.createElement("textarea");
    textarea.rows = 2;
    textarea.maxLength = 500;
    textarea.value = item.snippet;
    textarea.setAttribute("aria-label", t("Your own note"));
    editor.appendChild(textarea);

    const actionsRow = document.createElement("div");
    actionsRow.className = "modal-actions";
    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "btn btn-secondary btn-small";
    cancelBtn.textContent = t("Cancel");
    cancelBtn.addEventListener("click", () => {
      searchResultsNoteEditUrl = null;
      renderSearchResults();
    });
    const saveNoteBtn = document.createElement("button");
    saveNoteBtn.type = "button";
    saveNoteBtn.className = "btn btn-small";
    saveNoteBtn.textContent = t("Save");
    saveNoteBtn.addEventListener("click", () => {
      const result = addDictEntry({ word: item.title, note: textarea.value, url: item.url, group: 0 });
      searchResultsNoteEditUrl = null;
      if (result.ok) celebrate(t("Added to your dictionary"));
      else showToast(result.message);
      renderSearchResults();
    });
    actionsRow.append(cancelBtn, saveNoteBtn);
    editor.appendChild(actionsRow);
    li.appendChild(editor);
  }

  return li;
}

// 一覧に割り当てられている高さに何件入るかを実測して決める（他の一覧と同じ手法）。
function measureSearchResultsPerPage(list, items) {
  const available = list.clientHeight;
  if (!available) return SEARCH_RESULTS_FALLBACK_PER_PAGE;
  list.appendChild(buildSearchResultRow(items[0]));
  const rowHeight = list.firstElementChild.getBoundingClientRect().height;
  list.innerHTML = "";
  if (!rowHeight) return SEARCH_RESULTS_FALLBACK_PER_PAGE;
  return Math.max(1, Math.floor((available + SEARCH_RESULTS_ROW_GAP) / (rowHeight + SEARCH_RESULTS_ROW_GAP)));
}

function renderSearchResults() {
  const list = document.getElementById("searchResultsList");
  const pagination = document.querySelector("#searchResultsModal .search-pagination");
  const statusEl = document.getElementById("searchResultsStatus");
  document.getElementById("searchResultsModalTitle").textContent =
    tf('Search results for "{query}"', { query: searchResultsQuery });
  list.innerHTML = "";
  statusEl.hidden = true;

  if (searchResultsState === "loading") {
    pagination.hidden = true;
    statusEl.hidden = false;
    statusEl.textContent = t("Searching…");
    return;
  }
  if (searchResultsState === "error") {
    pagination.hidden = true;
    statusEl.hidden = false;
    statusEl.textContent = tf("Search failed: {message}", { message: searchResultsErrorMessage });
    return;
  }
  if (searchResultsState === "empty") {
    pagination.hidden = true;
    statusEl.hidden = false;
    statusEl.textContent = t("No results found.");
    return;
  }

  const perPage = measureSearchResultsPerPage(list, searchResultsItems);
  const totalPages = Math.max(1, Math.ceil(searchResultsItems.length / perPage));
  if (searchResultsPage >= totalPages) searchResultsPage = totalPages - 1;
  pagination.hidden = totalPages <= 1;

  const start = searchResultsPage * perPage;
  searchResultsItems.slice(start, start + perPage).forEach((item) => list.appendChild(buildSearchResultRow(item)));

  document.getElementById("searchResultsPrevBtn").disabled = searchResultsPage === 0;
  document.getElementById("searchResultsNextBtn").disabled = searchResultsPage >= totalPages - 1;
  const pageNumbers = document.getElementById("searchResultsPageNumbers");
  pageNumbers.innerHTML = "";
  for (let i = 0; i < totalPages; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "page-number-btn" + (i === searchResultsPage ? " is-active" : "");
    btn.textContent = String(i + 1);
    btn.addEventListener("click", () => {
      searchResultsPage = i;
      renderSearchResults();
    });
    pageNumbers.appendChild(btn);
  }
}

function openSearchResultsModal() {
  renderSearchResults();
  document.getElementById("searchResultsModal").hidden = false;
}
function closeSearchResultsModal() {
  document.getElementById("searchResultsModal").hidden = true;
  searchResultsNoteEditUrl = null;
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
  if (tab.embed) {
    // 埋め込みは再生させたいので、全画面と再生系の許可を明示する。
    // リファラも送らないと埋め込みを拒む配信元があるため、ここだけ既定に戻す。
    frame.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen");
    frame.setAttribute("allowfullscreen", "");
  } else {
    frame.setAttribute("referrerpolicy", "no-referrer");
  }
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
    stopBrowsingSessionEntirely();
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
  updateSaveWordButtonState(activeTab.url);
  startBrowsingSessionIfNeeded();
}

/* ==========================================================================
   閲覧時間の計測 (Scroll ONの許可とは連動させず、タブが表示されている間だけを計測する)
   ========================================================================== */

// 声かけの間隔（分）。姿勢リマインダーと同じ10分間隔にする。
const BROWSING_CHECKIN_INTERVAL_MIN = 10;

// SettingsなどのモーダルがブラウザViewportの上に重なっている間は「閲覧中」とは
// 言えないので、開いている間だけ計測を止める。個々のモーダルの開閉処理に手を
// 加えずに済むよう、共通クラスの hidden 属性の変化を監視する。
function isAnyOverlayOpen() {
  return !!document.querySelector(".modal-overlay:not([hidden])") ||
    !document.getElementById("tipsPanel").hidden;
}

// pendingBrowsingSession: 現在計測中の区間（一時停止/再開のたびに区切って加算するので、
// Settingsを覗いていた時間などは閲覧時間に含まれない）。
// browsingSessionStartedAt: 最初にタブを開いた時刻（一時停止では消さない）。声かけの間隔は
// 実際に見ていた合計時間ではなく、この最初のタブを開いてからの経過時間を基準にする
// （姿勢リマインダーがScroll ONしてからの経過時間を基準にしているのと同じ考え方）。
let pendingBrowsingSession = null;
let browsingSessionStartedAt = null;
let browsingCheckinTimer = null;
let lastBrowsingCheckinMinute = -1;

function browsingShouldBeActive() {
  const tabs = getBrowserTabs();
  const activeId = getActiveTabId();
  return tabs.some((tb) => tb.id === activeId) && !document.hidden && !isAnyOverlayOpen();
}

function maybeShowBrowsingCheckin() {
  if (!isBrowsingCheckinsEnabled() || !browsingSessionStartedAt || !browsingShouldBeActive()) return;
  const elapsedMin = Math.floor((Date.now() - browsingSessionStartedAt) / 60000);
  if (elapsedMin <= 0 || elapsedMin % BROWSING_CHECKIN_INTERVAL_MIN !== 0) return;
  if (elapsedMin === lastBrowsingCheckinMinute) return;
  lastBrowsingCheckinMinute = elapsedMin;
  openBrowsingCheckinModal(elapsedMin);
}

// トーストは数秒で消えてしまい、探し直す間もないので、代わりに実際に使える
// 検索バー付きのモーダルとして表示する（送信すれば新しいタブとして開ける）。
function openBrowsingCheckinModal(elapsedMin) {
  document.getElementById("browsingCheckinText").textContent =
    tf("Still finding what you needed? You've been browsing for {minutes} minutes.", { minutes: elapsedMin });
  document.getElementById("browsingCheckinSearchInput").value = "";
  document.getElementById("browsingCheckinModal").hidden = false;
}

function closeBrowsingCheckinModal() {
  document.getElementById("browsingCheckinModal").hidden = true;
}

// タブを表示していて、他に何もかぶさっていない間だけ計測区間を進める。
// Settingsを開く程度の一時中断では最初の開始時刻(声かけの基準)は消さない。
function startBrowsingSessionIfNeeded() {
  if (!browsingShouldBeActive()) return;
  if (!browsingSessionStartedAt) {
    browsingSessionStartedAt = Date.now();
    lastBrowsingCheckinMinute = -1;
    browsingCheckinTimer = setInterval(maybeShowBrowsingCheckin, 30000);
  }
  if (!pendingBrowsingSession) {
    pendingBrowsingSession = { startedAt: Date.now() };
  }
}

// 一時停止のみ（計測区間を記録して閉じるが、声かけの基準時刻は残す）。
function endBrowsingSessionIfAny() {
  if (!pendingBrowsingSession) return;
  const durationMs = Date.now() - pendingBrowsingSession.startedAt;
  pendingBrowsingSession = null;
  recordBrowsingSession(durationMs);
}

// タブが全て閉じられた時など、閲覧そのものが終わったとき用。
function stopBrowsingSessionEntirely() {
  endBrowsingSessionIfAny();
  browsingSessionStartedAt = null;
  lastBrowsingCheckinMinute = -1;
  if (browsingCheckinTimer) {
    clearInterval(browsingCheckinTimer);
    browsingCheckinTimer = null;
  }
}

function initOverlayBrowsingPause() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(({ target }) => {
      if (!(target.classList && target.classList.contains("modal-overlay")) && target.id !== "tipsPanel") return;
      if (target.hidden) {
        startBrowsingSessionIfNeeded();
      } else {
        endBrowsingSessionIfAny();
      }
    });
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ["hidden"], subtree: true });
}

/* ==========================================================================
   「あなたの辞書」。調べた言葉を見出し語として貯め、辞書の中を検索し、
   自分で作ったグループへ振り分け、並び順も自由に決められるようにしたもの。
   （旧「本棚」表示 — 壁ごとの棚・背表紙の色や厚み・容量ゲージ — は、言葉を
   貯める用途には飾りの設定が多すぎたため素直な一覧に置き換えた。旧データは
   migrateBookshelfToDictionary() が見出し語とグループへ移し替える）
   ========================================================================== */

const DEFAULT_DICT_GROUPS = ["Ungrouped"];
const DICT_SORTS = ["manual", "az", "newest", "oldest"];

function makeEntryId() {
  return `w-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getDictGroups() {
  const groups = loadJSON(STORAGE_KEYS.dictGroups, null);
  if (Array.isArray(groups) && groups.length) return groups;
  return DEFAULT_DICT_GROUPS.map((name) => ({ name }));
}
function saveDictGroups(groups) {
  saveJSON(STORAGE_KEYS.dictGroups, groups);
}
// 既定のグループ名だけは訳文を出したいので t() を通す（利用者が付けた名前は
// 辞書に載っていないため、t() はそのまま返す）。
function dictGroupName(index) {
  const groups = getDictGroups();
  return groups[index] ? t(groups[index].name) : t(DEFAULT_DICT_GROUPS[0]);
}

function getDictSort() {
  const sort = loadJSON(STORAGE_KEYS.dictSort, "manual");
  return DICT_SORTS.includes(sort) ? sort : "manual";
}
function saveDictSort(sort) {
  saveJSON(STORAGE_KEYS.dictSort, sort);
}

// グループを消した後などに範囲外のgroupが残らないよう、読み出し時に丸める。
function getDictEntries() {
  const raw = loadJSON(STORAGE_KEYS.dictEntries, []);
  if (!Array.isArray(raw)) return [];
  const groupCount = getDictGroups().length;
  return raw.map((e) => ({
    id: e.id || makeEntryId(),
    word: e.word || "",
    note: e.note || "",
    url: e.url || "",
    group: typeof e.group === "number" && e.group >= 0 && e.group < groupCount ? e.group : 0,
    savedAt: e.savedAt || 0,
  }));
}
function saveDictEntries(entries) {
  saveJSON(STORAGE_KEYS.dictEntries, entries);
}

// 旧「本棚」(ブックマーク＋壁)を辞書へ一度だけ移す。壁はそのままグループになり、
// ブックマークのタイトルが見出し語になる。移し終えたら旧キーは消す。
function migrateBookshelfToDictionary() {
  const legacy = loadJSON("myhome:bookmarks", null);
  if (!Array.isArray(legacy)) return;

  const legacyWalls = loadJSON("myhome:bookmarkWalls", null);
  if (Array.isArray(legacyWalls) && legacyWalls.length) {
    saveDictGroups(legacyWalls.map((w) => ({ name: w.name })));
  }
  // すでに辞書を使い始めていたら上書きしない（旧キーの掃除だけ行う）。
  if (!Array.isArray(loadJSON(STORAGE_KEYS.dictEntries, null))) {
    saveDictEntries(legacy.map((b) => ({
      id: b.id || makeEntryId(),
      word: b.title || hostnameOf(b.url) || "",
      note: "",
      url: b.url || "",
      group: typeof b.wall === "number" ? b.wall : 0,
      savedAt: b.savedAt || Date.now(),
    })));
  }
  ["myhome:bookmarks", "myhome:bookmarkWalls", "myhome:bookmarkShelfCapacity"].forEach((key) => {
    try { localStorage.removeItem(key); } catch (e) {}
  });
}

function isWordSaved(url) {
  if (!url) return false;
  return getDictEntries().some((e) => e.url === url);
}

function addDictEntry({ word, note, url, group }) {
  const trimmed = (word || "").trim();
  if (!trimmed) return { ok: false, message: t("Please enter a word") };
  const entries = getDictEntries();
  if (url && entries.some((e) => e.url === url)) return { ok: true };
  const groups = getDictGroups();
  const groupIdx = Math.max(0, Math.min(typeof group === "number" ? group : 0, groups.length - 1));
  entries.unshift({
    id: makeEntryId(),
    word: trimmed,
    note: (note || "").trim(),
    url: url || "",
    group: groupIdx,
    savedAt: Date.now(),
  });
  saveDictEntries(entries);
  logEvent("dictionary_word_added");
  return { ok: true };
}

function removeDictEntryByUrl(url) {
  saveDictEntries(getDictEntries().filter((e) => e.url !== url));
}
function removeDictEntryById(id) {
  saveDictEntries(getDictEntries().filter((e) => e.id !== id));
}
function updateDictEntry(id, changes) {
  const entries = getDictEntries();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return;
  entries[idx] = { ...entries[idx], ...changes };
  saveDictEntries(entries);
}

// 「自分の並び順」のときだけ使う入れ替え。いま画面に見えている並びの隣と交換
// するので、グループや検索で絞り込んでいても直感どおりに動く。
function moveDictEntry(id, delta, visibleIds) {
  const pos = visibleIds.indexOf(id);
  if (pos === -1) return false;
  const neighborId = visibleIds[pos + delta];
  if (neighborId === undefined) return false;
  const entries = getDictEntries();
  const a = entries.findIndex((e) => e.id === id);
  const b = entries.findIndex((e) => e.id === neighborId);
  if (a === -1 || b === -1) return false;
  [entries[a], entries[b]] = [entries[b], entries[a]];
  saveDictEntries(entries);
  return true;
}

function updateSaveWordButtonState(url) {
  const btn = document.getElementById("saveWordBtn");
  if (!btn) return;
  const saved = isWordSaved(url);
  btn.textContent = saved ? "★" : "☆";
  btn.setAttribute("aria-label", saved ? t("Remove from your dictionary") : t("Save to your dictionary"));
  btn.classList.toggle("is-active", saved);
}

function refreshSaveWordButton() {
  const activeTab = getBrowserTabs().find((tb) => tb.id === getActiveTabId());
  if (activeTab) updateSaveWordButtonState(activeTab.url);
}

/* --------------------------------------------------------------------------
   辞書モーダルの状態: list(一覧) / detail(見出し語の詳細) / groups(グループ管理)
   -------------------------------------------------------------------------- */
let dictView = "list";
let dictSelectedId = null;
let dictEditOpen = false;
let dictQuery = "";
let dictGroupFilter = "all"; // "all" もしくはグループのindex
let dictGroupsEditIndex = 0;

function showDictView(view) {
  dictView = view;
  document.getElementById("dictListView").hidden = view !== "list";
  document.getElementById("dictDetailView").hidden = view !== "detail";
  document.getElementById("dictGroupsView").hidden = view !== "groups";
}

function fillGroupSelect(select, { includeAll = false, selected = 0 } = {}) {
  select.innerHTML = "";
  if (includeAll) {
    const opt = document.createElement("option");
    opt.value = "all";
    opt.textContent = t("All groups");
    select.appendChild(opt);
  }
  getDictGroups().forEach((g, i) => {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = t(g.name);
    select.appendChild(opt);
  });
  select.value = String(selected);
}

// 検索とグループの絞り込みを掛けたうえで、選ばれた並び順に整える。
// manual(自分の並び順)のときは保存されている配列の順序をそのまま使う。
function visibleDictEntries() {
  const query = dictQuery.trim().toLowerCase();
  let entries = getDictEntries();

  if (dictGroupFilter !== "all") {
    const groupIdx = Number(dictGroupFilter);
    entries = entries.filter((e) => e.group === groupIdx);
  }
  if (query) {
    entries = entries.filter(
      (e) =>
        e.word.toLowerCase().includes(query) ||
        e.note.toLowerCase().includes(query) ||
        e.url.toLowerCase().includes(query)
    );
  }

  const sort = getDictSort();
  if (sort === "az") {
    entries = [...entries].sort((a, b) => a.word.localeCompare(b.word, currentLanguage));
  } else if (sort === "newest") {
    entries = [...entries].sort((a, b) => b.savedAt - a.savedAt);
  } else if (sort === "oldest") {
    entries = [...entries].sort((a, b) => a.savedAt - b.savedAt);
  }
  return entries;
}

function buildDictRow(entry, index, entries, visibleIds, manualOrder) {
  const li = document.createElement("li");
  li.className = "dictionary-row";

  const main = document.createElement("button");
  main.type = "button";
  main.className = "dictionary-row-main";
  main.addEventListener("click", () => openDictDetail(entry.id));

  const top = document.createElement("span");
  top.className = "dictionary-row-top";

  const word = document.createElement("span");
  word.className = "dictionary-word";
  word.textContent = entry.word;
  top.appendChild(word);

  const badge = document.createElement("span");
  badge.className = "dictionary-group-badge";
  badge.textContent = dictGroupName(entry.group);
  top.appendChild(badge);
  main.appendChild(top);

  const sub = entry.note || entry.url;
  if (sub) {
    const meta = document.createElement("span");
    meta.className = "dictionary-row-meta";
    meta.textContent = sub;
    main.appendChild(meta);
  }
  li.appendChild(main);

  if (manualOrder) {
    const controls = document.createElement("span");
    controls.className = "dictionary-row-controls";
    [
      ["↑", -1, "Move {word} up", index === 0],
      ["↓", 1, "Move {word} down", index === entries.length - 1],
    ].forEach(([glyph, delta, label, disabled]) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "order-btn";
      btn.textContent = glyph;
      btn.disabled = disabled;
      btn.setAttribute("aria-label", tf(label, { word: entry.word }));
      btn.addEventListener("click", () => {
        if (moveDictEntry(entry.id, delta, visibleIds)) renderDictList();
      });
      controls.appendChild(btn);
    });
    li.appendChild(controls);
  }
  return li;
}

function renderDictList() {
  const list = document.getElementById("dictList");
  const emptyNote = document.getElementById("dictEmptyNote");
  const countNote = document.getElementById("dictCountNote");
  list.innerHTML = "";

  const total = getDictEntries().length;
  const entries = visibleDictEntries();
  const visibleIds = entries.map((e) => e.id);
  const manualOrder = getDictSort() === "manual";

  countNote.textContent = total === 0 ? "" : tf("{shown} / {total}", { shown: entries.length, total });

  if (entries.length === 0) {
    emptyNote.hidden = false;
    emptyNote.textContent =
      total === 0
        ? t("No words saved yet. Look a word up, then tap the star to save it here.")
        : t("No words matched.");
    return;
  }
  emptyNote.hidden = true;
  entries.forEach((entry, index) => {
    list.appendChild(buildDictRow(entry, index, entries, visibleIds, manualOrder));
  });
}

function renderDictListView() {
  fillGroupSelect(document.getElementById("dictGroupFilter"), {
    includeAll: true,
    selected: dictGroupFilter,
  });
  document.getElementById("dictSortSelect").value = getDictSort();
  renderDictList();
}

/* ---- 言葉を手で足すフォーム ---- */
function openDictAddForm() {
  closeDictImportForm();
  document.getElementById("dictAddWordInput").value = "";
  document.getElementById("dictAddNoteInput").value = "";
  fillGroupSelect(document.getElementById("dictAddGroupSelect"), {
    selected: dictGroupFilter === "all" ? 0 : Number(dictGroupFilter),
  });
  document.getElementById("dictAddForm").hidden = false;
  document.getElementById("dictAddWordInput").focus();
}
function closeDictAddForm() {
  document.getElementById("dictAddForm").hidden = true;
}
function submitDictAddForm() {
  const result = addDictEntry({
    word: document.getElementById("dictAddWordInput").value,
    note: document.getElementById("dictAddNoteInput").value,
    url: "",
    group: Number(document.getElementById("dictAddGroupSelect").value) || 0,
  });
  if (!result.ok) {
    showToast(result.message);
    return;
  }
  closeDictAddForm();
  renderDictListView();
  celebrate(t("Added to your dictionary"));
}

/* ---- Excel・CSV・Googleスプレッドシートからの一括読み込み ---- */
let dictImportRows = []; // 確認待ちの {word, note, url}

// SheetJS本体は大きいので、実際にExcelファイルを読む時だけ取りに行く。
let xlsxLibPromise = null;
function loadXlsxLib() {
  if (window.XLSX) return Promise.resolve();
  if (xlsxLibPromise) return xlsxLibPromise;
  xlsxLibPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "lib/xlsx.full.min.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("xlsx load failed"));
    document.head.appendChild(script);
  });
  return xlsxLibPromise;
}

// 先頭行が見出し（word/単語 など）らしければ、データではなくヘッダーとして飛ばす。
const DICT_IMPORT_HEADER_WORDS = ["word", "term", "words", "単語", "語", "语", "단어"];
function looksLikeDictImportHeaderRow(row) {
  const first = String(row[0] || "").trim().toLowerCase();
  return DICT_IMPORT_HEADER_WORDS.includes(first);
}

// [[word, note, url], ...] の生の行から、空行とヘッダー行を除いた候補を作る。
function rowsToDictCandidates(rows) {
  return rows
    .filter((row, i) => !(i === 0 && looksLikeDictImportHeaderRow(row)))
    .map((row) => ({
      word: String((row && row[0]) ?? "").trim(),
      note: String((row && row[1]) ?? "").trim(),
      url: String((row && row[2]) ?? "").trim(),
    }))
    .filter((r) => r.word);
}

// 簡易CSVパーサ。ダブルクォートで囲まれたフィールド内のカンマ・改行・""を扱う。
function parseCsvText(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      continue;
    }
    if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((f) => f !== "")) rows.push(row);
      row = [];
      continue;
    }
    field += c;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function showDictImportStatus(message, isError) {
  const el = document.getElementById("dictImportStatus");
  el.hidden = !message;
  el.textContent = message || "";
  el.classList.toggle("is-error", Boolean(isError));
}

function renderDictImportPreview() {
  const list = document.getElementById("dictImportPreviewList");
  const confirmBtn = document.getElementById("dictImportConfirmBtn");
  list.innerHTML = "";
  if (!dictImportRows.length) {
    list.hidden = true;
    confirmBtn.hidden = true;
    return;
  }
  list.hidden = false;
  confirmBtn.hidden = false;
  confirmBtn.textContent = tf("Add these {count} words", { count: dictImportRows.length });
  dictImportRows.slice(0, 6).forEach((r) => {
    const li = document.createElement("li");
    li.textContent = r.note ? `${r.word} — ${r.note}` : r.word;
    list.appendChild(li);
  });
  if (dictImportRows.length > 6) {
    const li = document.createElement("li");
    li.className = "dictionary-import-more";
    li.textContent = tf("…and {count} more", { count: dictImportRows.length - 6 });
    list.appendChild(li);
  }
}

function setDictImportRows(rows, sourceLabel) {
  dictImportRows = rowsToDictCandidates(rows);
  if (!dictImportRows.length) showDictImportStatus(t("Couldn't find any words in that file."), true);
  else showDictImportStatus(tf("Found {count} words in {source}.", { count: dictImportRows.length, source: sourceLabel }));
  renderDictImportPreview();
}

async function handleDictImportFile(file) {
  if (!file) return;
  showDictImportStatus(t("Reading…"));
  dictImportRows = [];
  renderDictImportPreview();
  try {
    const isCsv = /\.csv$/i.test(file.name) || file.type === "text/csv";
    if (isCsv) {
      setDictImportRows(parseCsvText(await file.text()), file.name);
      return;
    }
    await loadXlsxLib();
    const buf = await file.arrayBuffer();
    const wb = window.XLSX.read(buf, { type: "array" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = window.XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
    setDictImportRows(rows, file.name);
  } catch (e) {
    showDictImportStatus(t("Couldn't read that file."), true);
  }
}

// 共有リンクのURLから、CSVとして書き出せるエクスポート用URLを組み立てる。
function googleSheetsCsvUrl(shareUrl) {
  const idMatch = shareUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!idMatch) return null;
  const gidMatch = shareUrl.match(/[?#&]gid=(\d+)/);
  const gid = gidMatch ? gidMatch[1] : "0";
  return `https://docs.google.com/spreadsheets/d/${idMatch[1]}/export?format=csv&gid=${gid}`;
}

async function handleDictImportSheetUrl(rawUrl) {
  const url = (rawUrl || "").trim();
  if (!url) return;
  const csvUrl = googleSheetsCsvUrl(url);
  if (!csvUrl) {
    showDictImportStatus(t("That doesn't look like a Google Sheets link."), true);
    return;
  }
  showDictImportStatus(t("Fetching…"));
  dictImportRows = [];
  renderDictImportPreview();
  try {
    const res = await fetch(csvUrl);
    if (!res.ok) throw new Error("fetch failed");
    setDictImportRows(parseCsvText(await res.text()), t("the sheet"));
  } catch (e) {
    showDictImportStatus(t('Couldn\'t fetch that sheet. Make sure it\'s shared as "Anyone with the link can view".'), true);
  }
}

function openDictImportForm() {
  closeDictAddForm();
  document.getElementById("dictImportFilePick").value = "";
  document.getElementById("dictImportSheetUrl").value = "";
  dictImportRows = [];
  showDictImportStatus("");
  renderDictImportPreview();
  fillGroupSelect(document.getElementById("dictImportGroupSelect"), {
    selected: dictGroupFilter === "all" ? 0 : Number(dictGroupFilter),
  });
  document.getElementById("dictImportForm").hidden = false;
}
function closeDictImportForm() {
  document.getElementById("dictImportForm").hidden = true;
  dictImportRows = [];
}
function submitDictImportForm() {
  const group = Number(document.getElementById("dictImportGroupSelect").value) || 0;
  let added = 0;
  dictImportRows.forEach((r) => {
    if (addDictEntry({ word: r.word, note: r.note, url: r.url, group }).ok) added++;
  });
  closeDictImportForm();
  renderDictListView();
  if (added) {
    logEvent("dictionary_import", { count: added });
    celebrate(tf("Added {count} words to your dictionary", { count: added }));
  } else {
    showToast(t("Nothing new to add."));
  }
}

/* ---- 見出し語の詳細 ---- */
function openDictDetail(id) {
  dictSelectedId = id;
  dictEditOpen = false;
  showDictView("detail");
  renderDictDetail();
}
function closeDictDetail() {
  dictSelectedId = null;
  showDictView("list");
  renderDictListView();
}

function renderDictDetail() {
  const entry = getDictEntries().find((e) => e.id === dictSelectedId);
  if (!entry) {
    closeDictDetail();
    return;
  }
  const card = document.getElementById("dictDetailCard");
  card.innerHTML = "";

  const h3 = document.createElement("h3");
  h3.textContent = entry.word;
  card.appendChild(h3);

  if (entry.note) {
    const note = document.createElement("p");
    note.className = "detail-note";
    note.textContent = entry.note;
    card.appendChild(note);
  }

  const group = document.createElement("div");
  group.className = "detail-meta";
  group.textContent = tf("Group: {group}", { group: dictGroupName(entry.group) });
  card.appendChild(group);

  if (entry.savedAt) {
    const when = document.createElement("div");
    when.className = "detail-meta";
    when.textContent = tf("Saved {date}", { date: new Date(entry.savedAt).toLocaleDateString() });
    card.appendChild(when);
  }

  if (entry.url) {
    const url = document.createElement("div");
    url.className = "detail-meta detail-url";
    url.textContent = entry.url;
    card.appendChild(url);
  }

  // 手で足した言葉にはURLが無いので、その時だけ「開く」を隠す。
  document.getElementById("dictOpenBtn").hidden = !entry.url;
  document.getElementById("dictEditForm").hidden = !dictEditOpen;
  document.getElementById("dictEditToggleBtn").setAttribute("aria-expanded", String(dictEditOpen));
  if (dictEditOpen) populateDictEditForm(entry);
}

function populateDictEditForm(entry) {
  document.getElementById("dictEditWordInput").value = entry.word;
  document.getElementById("dictEditNoteInput").value = entry.note;
  fillGroupSelect(document.getElementById("dictEditGroupSelect"), { selected: entry.group });
}

function saveDictEdits() {
  const entry = getDictEntries().find((e) => e.id === dictSelectedId);
  if (!entry) return;
  const word = document.getElementById("dictEditWordInput").value.trim();
  if (!word) {
    showToast(t("Please enter a word"));
    return;
  }
  updateDictEntry(entry.id, {
    word,
    note: document.getElementById("dictEditNoteInput").value.trim(),
    group: Number(document.getElementById("dictEditGroupSelect").value) || 0,
  });
  dictEditOpen = false;
  renderDictDetail();
  showToast(t("Saved"));
}

function deleteDictSelected() {
  const entry = getDictEntries().find((e) => e.id === dictSelectedId);
  if (!entry) return;
  removeDictEntryById(entry.id);
  refreshSaveWordButton();
  closeDictDetail();
  showToast(t("Removed from your dictionary"));
}

function openDictSelected() {
  const entry = getDictEntries().find((e) => e.id === dictSelectedId);
  if (!entry || !entry.url) return;
  closeDictionaryModal();
  openTab(entry.url);
}

/* ---- グループの管理 (名前の変更 / 追加 / 削除) ---- */
function openDictGroups() {
  dictGroupsEditIndex = dictGroupFilter === "all" ? 0 : Number(dictGroupFilter);
  showDictView("groups");
  renderDictGroupsView();
}
function closeDictGroups() {
  showDictView("list");
  renderDictListView();
}

function renderDictGroupsView() {
  const groups = getDictGroups();
  if (dictGroupsEditIndex >= groups.length) dictGroupsEditIndex = 0;
  fillGroupSelect(document.getElementById("dictGroupsSelect"), { selected: dictGroupsEditIndex });
  document.getElementById("dictGroupRenameInput").value = groups[dictGroupsEditIndex]
    ? t(groups[dictGroupsEditIndex].name)
    : "";
  document.getElementById("dictGroupDeleteBtn").disabled = groups.length <= 1;
}

function renameDictGroup() {
  const name = document.getElementById("dictGroupRenameInput").value.trim();
  if (!name) return;
  const groups = getDictGroups();
  if (!groups[dictGroupsEditIndex]) return;
  groups[dictGroupsEditIndex].name = name;
  saveDictGroups(groups);
  renderDictGroupsView();
  showToast(t("Saved"));
}

function addDictGroup() {
  const input = document.getElementById("dictAddGroupInput");
  const groups = getDictGroups();
  const name = input.value.trim() || tf("Group {n}", { n: groups.length + 1 });
  groups.push({ name });
  saveDictGroups(groups);
  dictGroupsEditIndex = groups.length - 1;
  input.value = "";
  renderDictGroupsView();
  showToast(t("Saved"));
}

// グループを消しても言葉は消さない。中身は先頭のグループへ寄せ、後ろのグループの
// 番号を1つずつ詰める（並べ替え前の値で振り直したいので、entriesを先に読む）。
function deleteDictGroup() {
  const groups = getDictGroups();
  if (groups.length <= 1) {
    showToast(t("You need at least one group."));
    return;
  }
  const removed = dictGroupsEditIndex;
  const entries = getDictEntries();
  groups.splice(removed, 1);
  saveDictGroups(groups);
  saveDictEntries(
    entries.map((e) => {
      if (e.group === removed) return { ...e, group: 0 };
      return e.group > removed ? { ...e, group: e.group - 1 } : e;
    })
  );
  dictGroupFilter = "all";
  dictGroupsEditIndex = 0;
  renderDictGroupsView();
  showToast(t("Saved"));
}

function openDictionaryModal() {
  dictQuery = "";
  dictGroupFilter = "all";
  document.getElementById("dictSearchInput").value = "";
  closeDictAddForm();
  showDictView("list");
  renderDictListView();
  document.getElementById("dictionaryModal").hidden = false;
}
function closeDictionaryModal() {
  document.getElementById("dictionaryModal").hidden = true;
}

function openInsightsModal() {
  document.getElementById("insightsModal").hidden = false;
  renderAppInsights();
}
function closeInsightsModal() {
  document.getElementById("insightsModal").hidden = true;
}

/* ==========================================================================
   ひと息の待合室 ＋ 本棚
   別アプリとして作られていた「待合室」を、このアプリの本文の場所へ合流させたもの。
   見たくなったものをすぐ開かず、まず60秒だけ預かる。数え終わってから
   「本棚にしまう / いま見る / 捨てる」を選ぶ。
   保存先は待合室・蔵書館と同じキーを使う（同じ場所に置いてあれば、そのまま
   行き来できるように作られていたものなので、その約束をこちらでも守る）。
   ========================================================================== */
const WR_BRIDGE_KEY = "scroll-bridge-v1"; // 預かりもの・記録
const WR_SHELF_KEY = "library-data-v2"; // 本棚（壁と本）
const WR_CHANNEL = "scroll-bridge"; // 他の画面へ知らせる通り道
const WR_TOTAL_GB = 512; // 書庫の広さ
// 最初は棚ひとつだけ。名前は番号のみ（東西南北のような固定の意味を持たせない）。
// 棚は増やせるが、既定では減らさない — 増やすたびに次の番号を振るだけでよい。
const WR_DEFAULT_WALLS = ["1"];
// 以前の既定名（東西南北・待合室からの自動作成「Later」）を、見つけ次第
// 番号だけの名前に置き換える。本の所属は配列の並び順(index)で持っているので
// 名前だけ差し替えれば中身はそのまま保たれる。
const WR_LEGACY_WALL_NAMES = ["North Wall", "East Wall", "South Wall", "West Wall", "Later"];
// 背表紙の色。暗い棚の上でも沈まない程度に明るく、けれど彩度は抑えて並べたときに
// うるさくならない範囲に収める。
const WR_TYPE_COLOR = { site: "#3d6b8f", video: "#a8544a", file: "#4f7a4a", memo: "#bf9a45" };
const WR_TYPE_SIZE = { site: 2, video: 3, file: 2, memo: 1 };
const WR_VIDEO_HOSTS = ["youtube.com", "youtu.be", "nicovideo.jp", "vimeo.com", "tiktok.com", "twitch.tv", "bilibili.com"];

// 一分のあいだにできること。訳せるよう原文のまま持ち、出すときに t() を通す。
const WR_CARDS = [
  "Drink a glass of water, slowly.",
  "Look at the furthest thing out of the window.",
  "Lift your shoulders, then let them drop. Three times.",
  "Put three things on your desk back where they belong.",
  "Close your eyes and count three sounds you can hear.",
  "Stand up and walk once around the room.",
  "Wash your hands. Notice the temperature of the water.",
  "Straighten your back and look up at the ceiling.",
  "Open a window or a curtain and let the air change.",
  "Remember one good thing about today.",
  "Feel where your feet are touching the floor.",
  "Leave one line of a note for tomorrow's you.",
  "Look into the distance and let your eyes go soft.",
  "Breathe in deeply, breathe out slowly. That's enough.",
];

function wrBlankBridge() {
  return {
    version: 1,
    savedMinutes: 0,
    streak: { count: 0, lastDate: "" },
    today: { date: "", count: 0 },
    stats: { paused: 0, stashed: 0, opened: 0, discarded: 0 },
    log: [],
  };
}

let wrBridge = wrBlankBridge();
let wrMemoryOnly = false;

function wrLoadBridge() {
  try {
    const raw = localStorage.getItem(WR_BRIDGE_KEY);
    if (raw) wrBridge = Object.assign(wrBlankBridge(), JSON.parse(raw));
    if (!wrBridge.streak) wrBridge.streak = { count: 0, lastDate: "" };
    if (!wrBridge.today) wrBridge.today = { date: "", count: 0 };
    if (!wrBridge.stats) wrBridge.stats = { paused: 0, stashed: 0, opened: 0, discarded: 0 };
    if (!Array.isArray(wrBridge.log)) wrBridge.log = [];
  } catch (e) {
    wrMemoryOnly = true;
  }
}

function wrSaveBridge() {
  if (wrMemoryOnly) return;
  try {
    localStorage.setItem(WR_BRIDGE_KEY, JSON.stringify(wrBridge));
    wrNotify({ type: "bridge-updated" });
  } catch (e) {
    wrMemoryOnly = true;
  }
}

function wrNotify(msg) {
  try {
    const ch = new BroadcastChannel(WR_CHANNEL);
    ch.postMessage(msg);
    ch.close();
  } catch (e) {
    /* 対応していない環境では黙って何もしない */
  }
}

function wrToday() {
  return new Date().toISOString().slice(0, 10);
}

function wrHostOf(url) {
  return hostnameOf(url).replace(/^www\./, "");
}

function wrGuessType(url) {
  if (!url) return "memo";
  const h = wrHostOf(url).toLowerCase();
  return WR_VIDEO_HOSTS.some((v) => h === v || h.endsWith("." + v)) ? "video" : "site";
}

const wrHasBox = typeof window !== "undefined" && !!window.FileBox;

/* ---- 本棚（待合室と共有する保存先） ---- */
function wrReadShelf() {
  let data = null;
  try {
    const raw = localStorage.getItem(WR_SHELF_KEY);
    if (raw) data = JSON.parse(raw);
  } catch (e) {
    data = null;
  }
  const walls =
    data && Array.isArray(data.walls) && data.walls.length
      ? data.walls
      : WR_DEFAULT_WALLS.map((n) => ({ name: n }));
  const books = (data && Array.isArray(data.books) ? data.books : []).map(wrNormalizeBook);
  return { walls, books };
}

function wrWriteShelf(shelf) {
  try {
    localStorage.setItem(WR_SHELF_KEY, JSON.stringify(shelf));
    return true;
  } catch (e) {
    return false;
  }
}

function wrUsedThickness(books) {
  return books.reduce((sum, b) => sum + (b.size || 0), 0);
}

// 東西南北・自動作成の「Later」など、以前の既定名が残っていたら番号だけに
// 差し替える一度きりの移行。本の所属は棚の並び順(index)で持っているので、
// 名前を変えるだけで中身は保たれる。
function migrateLegacyWallNames() {
  const shelf = wrReadShelf();
  let changed = false;
  shelf.walls.forEach((w, i) => {
    if (w && WR_LEGACY_WALL_NAMES.includes(w.name)) {
      w.name = String(i + 1);
      changed = true;
    }
  });
  if (changed) wrWriteShelf(shelf);
}

// 次に棚を増やすときの名前。既にある番号の最大値+1（歯抜けや並び替えがあっても壊れない）。
function wrNextWallName(walls) {
  const nums = walls.map((w) => Number(w && w.name)).filter((n) => Number.isFinite(n));
  return String((nums.length ? Math.max(...nums) : 0) + 1);
}

/* --------------------------------------------------------------------------
   優先度・済・おすすめの順番
   本には「高/中/低」の優先度と「済(一度見切った)」の印を持たせる。
   済んだものは元の壁から消さず印だけ立て、専用の棚にまとめて見えるようにする
   （元がどの壁だったかを失わずに、未読とだけ分けたいため）。
   -------------------------------------------------------------------------- */
const WR_PRIORITIES = ["high", "mid", "low"];
const WR_PRIORITY_RANK = { high: 0, mid: 1, low: 2 };
const WR_DONE_WALL = -1; // 済専用の棚。実在の壁ではなく、印で集めた見え方

function wrNormalizeBook(b) {
  return {
    ...b,
    priority: WR_PRIORITIES.includes(b.priority) ? b.priority : "mid",
    done: Boolean(b.done),
  };
}

function wrPriorityLabel(priority) {
  if (priority === "high") return t("High");
  if (priority === "low") return t("Low");
  return t("Medium");
}

// おすすめの順番。manual は棚に並んでいる順、priority は高→中→低。
function getRecommendOrder() {
  const v = loadJSON(STORAGE_KEYS.recommendOrder, "priority");
  return v === "manual" ? "manual" : "priority";
}

function saveRecommendOrder(v) {
  saveJSON(STORAGE_KEYS.recommendOrder, v === "manual" ? "manual" : "priority");
}

// まだ済んでいない本を、選ばれた順番で並べて返す。
function wrRecommendableBooks() {
  const books = wrReadShelf().books.filter((b) => !b.done);
  if (getRecommendOrder() === "manual") return books;
  return [...books].sort((a, b) => {
    const pa = WR_PRIORITY_RANK[a.priority] ?? 1;
    const pb = WR_PRIORITY_RANK[b.priority] ?? 1;
    return pa !== pb ? pa - pb : 0; // 同じ優先度なら棚の並び順のまま
  });
}

function wrUpdateBook(id, changes) {
  const shelf = wrReadShelf();
  const idx = shelf.books.findIndex((b) => b.id === id);
  if (idx === -1) return false;
  shelf.books[idx] = { ...shelf.books[idx], ...changes };
  return wrWriteShelf(shelf);
}

// 手で並べ替える。いま見えている並びの隣と入れ替えるので、棚で絞り込んでいても
// 直感どおりに動く（辞書の並べ替えと同じ考え方）。
function wrMoveBook(id, delta, visibleIds) {
  const pos = visibleIds.indexOf(id);
  if (pos === -1) return false;
  const neighbour = visibleIds[pos + delta];
  if (neighbour === undefined) return false;
  const shelf = wrReadShelf();
  const a = shelf.books.findIndex((b) => b.id === id);
  const b = shelf.books.findIndex((x) => x.id === neighbour);
  if (a === -1 || b === -1) return false;
  [shelf.books[a], shelf.books[b]] = [shelf.books[b], shelf.books[a]];
  return wrWriteShelf(shelf);
}

// 預かりものを本にして棚へ。既定の棚（先頭）にしまう。容量が足りなければ断る。
function wrAddToShelf(item) {
  const shelf = wrReadShelf();
  if (!shelf.walls.length) shelf.walls.push({ name: WR_DEFAULT_WALLS[0] });
  const wall = 0;

  const isFile = Boolean(item.fileId && wrHasBox);
  const type = isFile ? FileBox.shelfType(item.mime, item.name) : wrGuessType(item.url);
  const size = isFile ? FileBox.thickness(item.bytes) : WR_TYPE_SIZE[type] || 1;
  if (wrUsedThickness(shelf.books) + size > WR_TOTAL_GB) return { ok: false, reason: "full" };

  const book = {
    id: `${Date.now()}${Math.floor(Math.random() * 999)}`,
    title: item.title,
    type,
    url: item.url || "",
    size,
    wall,
    color: WR_TYPE_COLOR[type],
    deco: "label",
    priority: "mid",
    done: false,
  };
  if (isFile) {
    book.fileId = item.fileId;
    book.fileName = item.name;
    book.mime = item.mime;
    book.bytes = item.bytes;
  }
  shelf.books.push(book);

  if (!wrWriteShelf(shelf)) return { ok: false, reason: "storage" };
  const wallName = shelf.walls[wall].name;
  wrNotify({ type: "book-added", title: item.title, wall: wallName });
  return { ok: true, wall: wallName };
}

/* --------------------------------------------------------------------------
   画面の状態
   -------------------------------------------------------------------------- */
let wrPanel = "wait"; // "wait"(待合室) か "goals" か "shelf"(本棚)
let wrWallIndex = 0;
let wrSelectedBookId = null;

function wrShowPanel(name) {
  wrPanel = name;
  document.getElementById("wrView").hidden = name !== "wait";
  document.getElementById("goalsView").hidden = name !== "goals";
  document.getElementById("shelfView").hidden = name !== "shelf";
  document.getElementById("homeTabWait").classList.toggle("is-active", name === "wait");
  document.getElementById("homeTabGoals").classList.toggle("is-active", name === "goals");
  document.getElementById("homeTabShelf").classList.toggle("is-active", name === "shelf");
  if (name === "shelf") renderShelfView();
  if (name === "goals") renderAspirationList();
  if (name === "wait") renderWaitingRoomHome();
}

function renderWaitingRoomHome() {
  if (wrBridge.today.date !== wrToday()) wrBridge.today = { date: wrToday(), count: 0 };

  document.getElementById("wrLead").textContent = wrMemoryOnly
    ? t("This device can't keep records (private browsing, perhaps).")
    : t("Anything you feel like looking at, this holds for a moment first.");

  renderLookBack();

  document.getElementById("wrFileLabel").hidden = !wrHasBox;
  if (wrHasBox) {
    FileBox.usage().then((u) => {
      if (!u || !u.quota) return;
      document.getElementById("wrStorageNote").textContent = tf("Held on this device: {used} of about {quota}", {
        used: FileBox.humanSize(u.usage || 0),
        quota: FileBox.humanSize(u.quota),
      });
    });
  }
}

/* ---- ひと息の時間 ---- */
// 「一息ついた」を1件記録する。held-itemを待った時と、下の自分開始の休憩を
// やり切った時の両方から呼ぶ共通の集計処理。
function wrRecordPauseCompleted() {
  if (wrBridge.today.date !== wrToday()) wrBridge.today = { date: wrToday(), count: 0 };
  wrBridge.today.count++;
  wrBridge.savedMinutes++;
  wrBridge.stats.paused++;
  const d = wrToday();
  if (wrBridge.streak.lastDate !== d) {
    // 1日空いても途切れさせない。1回崩れただけで全部やめてしまうのを避けるため、
    // 猶予を1日だけ持たせる（2日以上空いたときは数え直す）。
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const dayBefore = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
    const continued = wrBridge.streak.lastDate === yesterday || wrBridge.streak.lastDate === dayBefore;
    wrBridge.streak.count = continued ? wrBridge.streak.count + 1 : 1;
    wrBridge.streak.lastDate = d;
  }
  wrSaveBridge();
}

/* ==========================================================================
   自分から始める休憩（Take a breath ボタン）
   時間を決めてボタンを押すと、その残り時間をボタン自身にリングと数字で表示し、
   その間はドックの他アプリを開けなくする。ただしOS側のアプリ切り替え自体は
   Webアプリの権限では止められないので、塞げるのは「このアプリから」他アプリを
   開く経路だけ（README記載の技術的な制約と同じ前提）。
   ========================================================================== */
function getSelfBreakState() {
  return loadJSON(STORAGE_KEYS.selfBreakState, null);
}
function saveSelfBreakState(state) {
  saveJSON(STORAGE_KEYS.selfBreakState, state);
}
function isSelfBreakActive() {
  const s = getSelfBreakState();
  return Boolean(s && s.endAt && s.totalMs && s.endAt > Date.now());
}

let selfBreakTicker = null;

function wrToggleBreakPicker(show) {
  const picker = document.getElementById("wrBreakPicker");
  if (!picker) return;
  picker.hidden = !show;
  if (!show) return;
  picker.innerHTML = "";
  getDurations().forEach((d) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = t(d.label);
    chip.addEventListener("click", () => wrStartSelfBreak(d.minutes));
    picker.appendChild(chip);
  });
}

function wrStartSelfBreak(minutes) {
  if (!minutes || minutes <= 0) return;
  saveSelfBreakState({ endAt: Date.now() + minutes * 60000, totalMs: minutes * 60000 });
  wrToggleBreakPicker(false);
  wrRenderSelfBreak();
  logEvent("self_break_started", { minutes });
}

// 途中でやめる抜け道は残すが、押しやすい場所には置かない
// （ブロック画面の「それでもONにする」と同じ考え方）。
function wrEndSelfBreakEarly() {
  saveSelfBreakState(null);
  wrRenderSelfBreak();
  logEvent("self_break_ended_early");
}

function wrCompleteSelfBreak() {
  saveSelfBreakState(null);
  wrRecordPauseCompleted();
  if (wrPanel === "wait") renderWaitingRoomHome();
  wrRenderSelfBreak();
  celebrate(t("Break's over. Nice."));
  logEvent("self_break_completed");
}

// リングの塗り具合と、ボタン中央の残り時間表示を、いまの状態に合わせて描き直す。
function wrRenderSelfBreak() {
  clearInterval(selfBreakTicker);
  const ring = document.getElementById("wrBreakRing");
  const btn = document.getElementById("wrStartBtn");
  const endBtn = document.getElementById("wrBreakEndBtn");
  if (!ring || !btn) return;

  const state = getSelfBreakState();
  // 見ていない間（閉じていた・タブが凍結されていた等）に終わっていた場合も、
  // ここで初めて気づいて記録と祝福をきちんと行う。黙って idle に戻さない。
  if (state && state.endAt && state.endAt <= Date.now()) {
    wrCompleteSelfBreak();
    return;
  }

  if (!state) {
    ring.classList.remove("is-active");
    ring.style.removeProperty("--pct");
    btn.textContent = t("Take a breath");
    if (endBtn) endBtn.hidden = true;
    return;
  }

  ring.classList.add("is-active");
  if (endBtn) endBtn.hidden = false;

  const tick = () => {
    const remainingMs = Math.max(0, state.endAt - Date.now());
    if (remainingMs <= 0) {
      wrCompleteSelfBreak();
      return;
    }
    const pct = Math.min(100, Math.max(0, 100 - Math.round((remainingMs / state.totalMs) * 100)));
    ring.style.setProperty("--pct", String(pct));
    const totalSec = Math.ceil(remainingMs / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    btn.textContent = m > 0 ? `${m}:${String(s).padStart(2, "0")}` : String(s);
  };
  tick();
  selfBreakTicker = setInterval(tick, 1000);
}

// 他のアプリの共有ボタンから届いたものを拾い上げる。
// Service Worker (sw.js の receiveShare) が倉庫の「届いたばかり」置き場に
// 置いてくれているので、開いたときにそれを吸い出してそのまま本棚へしまう。
async function wrIntakeShared() {
  if (location.search.includes("shared=")) {
    const params = new URLSearchParams(location.search);
    params.delete("shared");
    const rest = params.toString();
    history.replaceState(null, "", location.pathname + (rest ? "?" + rest : "") + location.hash);
  }
  if (!wrHasBox) return;

  let items;
  try {
    items = await FileBox.inboxDrain();
  } catch (e) {
    return;
  }
  if (!items || !items.length) return;

  let added = 0;
  let full = false;
  for (const it of items) {
    const item =
      it.kind === "file"
        ? {
            title: FileBox.titleFromName(it.name),
            url: "",
            fileId: it.id,
            name: it.name,
            mime: it.mime,
            bytes: it.bytes,
          }
        : {
            title: it.title || (it.url && wrHostOf(it.url)) || t("Something to look at"),
            url: it.url || "",
          };
    const r = wrAddToShelf(item);
    if (r.ok) added++;
    else full = r.reason === "full";
  }

  if (added) {
    wrBridge.stats.stashed += added;
    wrLog("stashed");
    wrSaveBridge();
    renderWaitingRoomHome();
    showToast(
      added === 1 ? t("Received 1 item from another app") : tf("Received {n} items from another app", { n: added })
    );
  } else if (full) {
    showToast(t("The shelf is full. Take something off it first."));
  }
}

function wrLog(action) {
  wrBridge.log.unshift({ at: new Date().toISOString(), action });
  wrBridge.log = wrBridge.log.slice(0, 50);
}

// 他の場所（門番など）から、直接本棚へしまう入口。
function wrHold({ title, url }) {
  const item = {
    title: title || wrHostOf(url) || t("Something to look at"),
    url: url || "",
  };
  const r = wrAddToShelf(item);
  if (r.ok) {
    wrBridge.stats.stashed++;
    wrLog("stashed");
    wrSaveBridge();
    renderWaitingRoomHome();
    showToast(tf("Shelved under {wall}", { wall: t(r.wall) }));
  } else {
    showToast(r.reason === "full" ? t("The shelf is full. Take something off it first.") : t("Couldn't put it on the shelf"));
  }
  return r;
}

/* ==========================================================================
   棚を人に渡す
   スクロールを削るだけだと、SNSが担っていた「人とつながる口」まで一緒に塞いで
   しまい、残るのは一人で本を読むだけの部屋になる。それでは続かない。
   そこで棚に名前を付けて、丸ごと他人へ渡せるようにする。曲のプレイリストと
   同じで、渡した相手はそれを自分の棚に取り込める。何を読んでいるかの交換は、
   無限スクロールより細いが、確かに質の高いつながりになりうる。
   サーバーは持たないので、中身はリンクの断片（#shelf=…）に畳んで運ぶ。
   ========================================================================== */
const SHARED_SHELF_PREFIX = "#shelf=";
// リンクが長くなりすぎると共有先で切られるので、渡すのは先頭のいくつかに絞る。
const SHARED_SHELF_MAX_ITEMS = 40;

// UTF-8をそのままbtoa()に渡すと日本語で落ちるので、バイト列を経由する。
function encodeSharePayload(obj) {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  let binary = "";
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeSharePayload(text) {
  const padded = text.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function buildShelfShareUrl(wallIndex) {
  const shelf = wrReadShelf();
  const wall = shelf.walls[wallIndex];
  if (!wall) return null;
  const items = shelf.books
    .filter((b) => b.wall === wallIndex && b.url)
    .slice(0, SHARED_SHELF_MAX_ITEMS)
    .map((b) => ({ t: b.title, u: b.url }));
  if (!items.length) return null;
  const payload = encodeSharePayload({ v: 1, n: wall.name, i: items });
  return `${location.origin}${location.pathname}${SHARED_SHELF_PREFIX}${payload}`;
}

async function shareCurrentShelf() {
  if (wrWallIndex === WR_DONE_WALL) {
    showToast(t("Pick one of your own shelves to share."));
    return;
  }
  const url = buildShelfShareUrl(wrWallIndex);
  if (!url) {
    showToast(t("This shelf has nothing with a link on it yet."));
    return;
  }
  const shelf = wrReadShelf();
  const title = tf("My shelf: {name}", { name: shelf.walls[wrWallIndex].name });
  // 端末の共有シートがあればそれに任せる。無ければ書き写せるようにする。
  if (navigator.share) {
    try {
      await navigator.share({ title, text: title, url });
      return;
    } catch (e) {
      if (e && e.name === "AbortError") return;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    showToast(t("Link copied. Send it to someone."));
  } catch (e) {
    showToast(t("Couldn't share this shelf"));
  }
}

/* ---- 受け取る側 ---- */
let pendingSharedShelf = null;

function readSharedShelfFromUrl() {
  const hash = location.hash || "";
  if (!hash.startsWith(SHARED_SHELF_PREFIX)) return null;
  try {
    const data = decodeSharePayload(hash.slice(SHARED_SHELF_PREFIX.length));
    if (!data || !Array.isArray(data.i) || !data.i.length) return null;
    return {
      name: typeof data.n === "string" ? data.n : "",
      items: data.i.filter((x) => x && x.u).map((x) => ({ title: String(x.t || x.u), url: String(x.u) })),
    };
  } catch (e) {
    return null;
  }
}

function maybeShowSharedShelf() {
  const incoming = readSharedShelfFromUrl();
  // 読み終えたら断片は消す。同じリンクで開き直すたびに訊かれても困る。
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  if (!incoming || !incoming.items.length) return;

  pendingSharedShelf = incoming;
  document.getElementById("sharedShelfLead").textContent = incoming.name
    ? tf('Someone shared their shelf "{name}" with you — {count} things on it.', { name: incoming.name, count: incoming.items.length })
    : tf("Someone shared a shelf with you — {count} things on it.", { count: incoming.items.length });

  const list = document.getElementById("sharedShelfList");
  list.innerHTML = "";
  incoming.items.slice(0, 10).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.title;
    list.appendChild(li);
  });
  document.getElementById("sharedShelfModal").hidden = false;
}

// 受け取った棚は、自分の棚を上書きせず新しい棚として足す。
function acceptSharedShelf() {
  const incoming = pendingSharedShelf;
  if (!incoming) return;
  const shelf = wrReadShelf();
  const name = incoming.name || wrNextWallName(shelf.walls);
  shelf.walls.push({ name });
  const wallIndex = shelf.walls.length - 1;

  let added = 0;
  incoming.items.forEach((item) => {
    const type = wrGuessType(item.url);
    const size = WR_TYPE_SIZE[type] || 1;
    if (wrUsedThickness(shelf.books) + size > WR_TOTAL_GB) return;
    shelf.books.push({
      id: `${Date.now()}${Math.floor(Math.random() * 999)}${added}`,
      title: item.title,
      type,
      url: item.url,
      size,
      wall: wallIndex,
      color: WR_TYPE_COLOR[type],
      deco: "label",
      priority: "mid",
      done: false,
    });
    added++;
  });

  wrWriteShelf(shelf);
  pendingSharedShelf = null;
  document.getElementById("sharedShelfModal").hidden = true;
  wrWallIndex = wallIndex;
  wrShowPanel("shelf");
  celebrate(tf("Added {count} things to a new shelf", { count: added }));
}

function initSharedShelves() {
  document.getElementById("shelfShareBtn").addEventListener("click", shareCurrentShelf);
  document.getElementById("sharedShelfAcceptBtn").addEventListener("click", acceptSharedShelf);
  document.getElementById("sharedShelfDeclineBtn").addEventListener("click", () => {
    pendingSharedShelf = null;
    document.getElementById("sharedShelfModal").hidden = true;
  });

  // 棚に名前を付けられるようにする。既定は番号のままで、付けたい人だけ付ける。
  document.getElementById("shelfRenameBtn").addEventListener("click", () => {
    if (wrWallIndex === WR_DONE_WALL) return;
    const shelf = wrReadShelf();
    const wall = shelf.walls[wrWallIndex];
    if (!wall) return;
    const next = prompt(t("Name this shelf"), wall.name);
    if (next === null) return;
    const trimmed = next.trim();
    if (!trimmed) return;
    wall.name = trimmed;
    wrWriteShelf(shelf);
    renderShelfView();
  });

  maybeShowSharedShelf();
}

/* ---- 本棚の表示（背表紙を並べる） ---- */
function wrBookWidthPx(size) {
  return Math.round(16 + size * 1.6);
}

function wrBookHeightPx(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return 74 + (Math.abs(h) % 20);
}

function wrBuildSpine(book) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "book-spine" + (book.id === wrSelectedBookId ? " hit" : "");
  btn.style.width = `${wrBookWidthPx(book.size)}px`;
  btn.style.height = `${wrBookHeightPx(book.title + book.id)}px`;
  btn.style.background = `linear-gradient(180deg, ${book.color} 0%, rgba(0,0,0,.35) 140%), ${book.color}`;
  const band = document.createElement("span");
  band.className = "book-band";
  btn.appendChild(band);
  const label = document.createElement("span");
  label.className = "book-spine-title";
  label.textContent = book.title;
  btn.appendChild(label);
  btn.setAttribute("aria-label", book.title);
  btn.addEventListener("click", () => wrOpenBookDetail(book.id));
  return btn;
}

function wrMeasureShelf(caseEl) {
  const probe = document.createElement("div");
  probe.className = "shelf";
  probe.style.flex = "0 0 auto";
  caseEl.appendChild(probe);
  const shelfHeight = probe.getBoundingClientRect().height || 92;
  const maxWidth = probe.clientWidth || 300;
  const available = caseEl.clientHeight || shelfHeight * 3;
  caseEl.innerHTML = "";
  const shelfCount = Math.max(1, Math.floor((available + 6) / (shelfHeight + 6)));
  return { maxWidth, shelfCount };
}

// いま選ばれている棚に並ぶ本。済の棚だけは、元の壁を問わず印で集める。
function wrBooksOnCurrentWall(shelf) {
  if (wrWallIndex === WR_DONE_WALL) return shelf.books.filter((b) => b.done);
  return shelf.books.filter((b) => b.wall === wrWallIndex && !b.done);
}

function renderShelfView() {
  const shelf = wrReadShelf();
  if (wrWallIndex !== WR_DONE_WALL && wrWallIndex >= shelf.walls.length) wrWallIndex = 0;

  const select = document.getElementById("shelfWallSelect");
  select.innerHTML = "";
  shelf.walls.forEach((w, i) => {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = t(w.name);
    select.appendChild(opt);
  });
  // 済だけを集めた棚。実在の壁ではないので最後に足す。
  const doneOpt = document.createElement("option");
  doneOpt.value = String(WR_DONE_WALL);
  doneOpt.textContent = tf("Done ({count})", { count: shelf.books.filter((b) => b.done).length });
  select.appendChild(doneOpt);
  select.value = String(wrWallIndex);

  const used = wrUsedThickness(shelf.books);
  document.getElementById("shelfGaugeText").textContent = tf("{used} / {total}", { used, total: WR_TOTAL_GB });
  document.getElementById("shelfGaugeFill").style.width = `${Math.min(100, (used / WR_TOTAL_GB) * 100)}%`;

  renderShelfSearchHits(shelf);

  const caseEl = document.getElementById("shelfCase");
  caseEl.innerHTML = "";
  const onWall = wrBooksOnCurrentWall(shelf);
  const emptyNote = document.getElementById("shelfEmpty");
  emptyNote.hidden = shelf.books.length > 0;
  if (shelf.books.length === 0) return;

  const { maxWidth, shelfCount } = wrMeasureShelf(caseEl);
  const rows = Array.from({ length: shelfCount }, () => ({ w: 0, items: [] }));
  onWall.forEach((b) => {
    const w = wrBookWidthPx(b.size);
    const row = rows.find((r) => r.w + w <= maxWidth);
    if (row) {
      row.w += w + 2;
      row.items.push(b);
    }
  });

  rows.forEach((row) => {
    const shelfEl = document.createElement("div");
    shelfEl.className = "shelf";
    if (row.items.length === 0) {
      const empty = document.createElement("div");
      empty.className = "shelf-empty";
      empty.textContent = t("— empty shelf —");
      shelfEl.appendChild(empty);
    } else {
      row.items.forEach((b) => shelfEl.appendChild(wrBuildSpine(b)));
    }
    caseEl.appendChild(shelfEl);
  });
}

// 棚の中の検索。背表紙は縦書きで探しにくいので、当たったものは一覧で出す。
let wrShelfQuery = "";

function renderShelfSearchHits(shelf) {
  const list = document.getElementById("shelfHits");
  const q = wrShelfQuery.trim().toLowerCase();
  list.innerHTML = "";
  if (!q) {
    list.hidden = true;
    return;
  }
  list.hidden = false;

  const hits = shelf.books.filter(
    (b) =>
      (b.title || "").toLowerCase().includes(q) ||
      (b.url || "").toLowerCase().includes(q) ||
      (b.fileName || "").toLowerCase().includes(q)
  );

  if (hits.length === 0) {
    const li = document.createElement("li");
    li.className = "shelf-hit-empty";
    li.textContent = t("Nothing on the shelf matched.");
    list.appendChild(li);
    return;
  }

  hits.forEach((b) => {
    const li = document.createElement("li");
    li.className = "shelf-hit";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "shelf-hit-main";
    btn.addEventListener("click", () => {
      // 見つけた本のある棚へ移ってから開く
      wrWallIndex = b.done ? WR_DONE_WALL : b.wall;
      wrOpenBookDetail(b.id);
    });

    const swatch = document.createElement("span");
    swatch.className = "shelf-hit-swatch";
    swatch.style.background = b.color;
    btn.appendChild(swatch);

    const title = document.createElement("span");
    title.className = "shelf-hit-title";
    title.textContent = b.title;
    btn.appendChild(title);

    const tag = document.createElement("span");
    tag.className = "shelf-hit-tag";
    tag.textContent = b.done ? t("Done") : wrPriorityLabel(b.priority);
    btn.appendChild(tag);

    li.appendChild(btn);
    list.appendChild(li);
  });
}

function wrOpenBookDetail(id) {
  const shelf = wrReadShelf();
  const book = shelf.books.find((b) => b.id === id);
  if (!book) return;
  wrSelectedBookId = id;
  document.getElementById("shelfDetailTitle").textContent = book.title;
  const detailBits = [];
  if (book.minutes) detailBits.push(tf("{minutes} min", { minutes: book.minutes }));
  detailBits.push(
    book.fileId
      ? tf("{kind} · {size}", {
          kind: wrHasBox ? FileBox.kindName(book.mime, book.fileName) : t("File"),
          size: wrHasBox ? FileBox.humanSize(book.bytes) : "",
        })
      : book.url || t("No address")
  );
  document.getElementById("shelfDetailMeta").textContent = detailBits.join(" · ");
  document.getElementById("shelfPrioritySelect").value = book.priority;
  document.getElementById("shelfMinutesInput").value = book.minutes || "";
  document.getElementById("shelfDoneBtn").textContent = book.done ? t("Not done after all") : t("Done");

  // 並べ替えは、いま見えている棚の中でだけ意味を持つ
  const visible = wrBooksOnCurrentWall(wrReadShelf()).map((b) => b.id);
  const pos = visible.indexOf(id);
  document.getElementById("shelfMoveUpBtn").disabled = pos <= 0;
  document.getElementById("shelfMoveDownBtn").disabled = pos === -1 || pos === visible.length - 1;

  document.getElementById("shelfDetail").hidden = false;
  // 本を開いた瞬間だけの、ごく小さな手応え。情報を伝える演出ではないので控えめに。
  if (navigator.vibrate) navigator.vibrate(12);
  renderShelfView();
}

function wrMoveSelected(delta) {
  if (!wrSelectedBookId) return;
  const visible = wrBooksOnCurrentWall(wrReadShelf()).map((b) => b.id);
  if (wrMoveBook(wrSelectedBookId, delta, visible)) wrOpenBookDetail(wrSelectedBookId);
}

function wrCloseBookDetail() {
  wrSelectedBookId = null;
  document.getElementById("shelfDetail").hidden = true;
  renderShelfView();
}

function wrOpenSelectedBook() {
  const shelf = wrReadShelf();
  const book = shelf.books.find((b) => b.id === wrSelectedBookId);
  if (!book) return;
  if (book.fileId && wrHasBox) {
    FileBox.load(book.fileId)
      .then((rec) => {
        if (!rec) {
          showToast(t("That file is no longer on this device"));
          return;
        }
        if (!FileBox.openFile(rec)) FileBox.downloadFile(rec);
      })
      .catch(() => showToast(t("That file is no longer on this device")));
    return;
  }
  if (book.url) openTab(book.url);
}

function wrRemoveSelectedBook() {
  const shelf = wrReadShelf();
  const book = shelf.books.find((b) => b.id === wrSelectedBookId);
  if (!book) return;
  if (book.fileId && wrHasBox) FileBox.remove(book.fileId).catch(() => {});
  shelf.books = shelf.books.filter((b) => b.id !== wrSelectedBookId);
  wrWriteShelf(shelf);
  wrCloseBookDetail();
  showToast(t("Taken off the shelf"));
}

/* ---- 組み立て ---- */
function initWaitingRoom() {
  wrLoadBridge();
  migrateLegacyWallNames();
  if (wrHasBox) FileBox.askPersist();
  wrIntakeShared();
  initRoutineTracker();

  document.getElementById("homeTabWait").addEventListener("click", () => wrShowPanel("wait"));
  document.getElementById("homeTabGoals").addEventListener("click", () => wrShowPanel("goals"));
  document.getElementById("homeTabShelf").addEventListener("click", () => wrShowPanel("shelf"));

  document.getElementById("shelfAddWallBtn").addEventListener("click", () => {
    const shelf = wrReadShelf();
    const name = wrNextWallName(shelf.walls);
    shelf.walls.push({ name });
    wrWriteShelf(shelf);
    wrWallIndex = shelf.walls.length - 1;
    renderShelfView();
    showToast(tf("Added shelf {name}", { name }));
  });

  document.getElementById("shelfAddToggleBtn").addEventListener("click", (e) => {
    const form = document.getElementById("shelfAddForm");
    form.hidden = !form.hidden;
    e.currentTarget.setAttribute("aria-expanded", String(!form.hidden));
    if (!form.hidden) document.getElementById("newShelfTitle").focus();
  });

  document.getElementById("shelfAddBtn").addEventListener("click", () => {
    const titleInput = document.getElementById("newShelfTitle");
    const urlInput = document.getElementById("newShelfUrl");
    const title = titleInput.value.trim();
    if (!title) return;
    const url = urlInput.value.trim();
    const result = wrAddToShelf({ title, url });
    if (!result.ok) {
      showToast(t("The shelf is full. Take something off it first."));
      return;
    }
    titleInput.value = "";
    urlInput.value = "";
    document.getElementById("shelfAddForm").hidden = true;
    document.getElementById("shelfAddToggleBtn").setAttribute("aria-expanded", "false");
    renderShelfView();
    showToast(tf("Added to shelf {wall}", { wall: result.wall }));
  });

  document.getElementById("wrAddAspirationToggleBtn").addEventListener("click", (e) => {
    const form = document.getElementById("wrAspirationForm");
    form.hidden = !form.hidden;
    e.currentTarget.setAttribute("aria-expanded", String(!form.hidden));
    if (!form.hidden) document.getElementById("wrNewAspirationInput").focus();
  });

  document.getElementById("wrStartBtn").addEventListener("click", () => {
    if (isSelfBreakActive()) return; // 動いている間はボタン自体では終わらせない（抜け道は別に用意する）
    const picker = document.getElementById("wrBreakPicker");
    wrToggleBreakPicker(picker.hidden);
  });
  document.getElementById("wrBreakEndBtn").addEventListener("click", wrEndSelfBreakEarly);
  wrRenderSelfBreak(); // リロードをまたいで休憩中だった場合に復元する

  document.getElementById("wrFilePick").addEventListener("change", async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length || !wrHasBox) return;
    let added = 0;
    let full = false;
    for (const f of files) {
      const rec = {
        id: FileBox.newId(),
        name: f.name,
        mime: f.type || "application/octet-stream",
        bytes: f.size,
        blob: f,
        addedAt: new Date().toISOString(),
      };
      try {
        await FileBox.save(rec);
      } catch (err) {
        showToast(
          String(err && err.name) === "QuotaExceededError"
            ? t("This device is out of room for held files")
            : t("Couldn't hold that file")
        );
        break; // 容量が尽きたらそこで止める
      }
      const item = {
        title: FileBox.titleFromName(rec.name),
        url: "",
        fileId: rec.id,
        name: rec.name,
        mime: rec.mime,
        bytes: rec.bytes,
      };
      const r = wrAddToShelf(item);
      if (r.ok) {
        added++;
      } else {
        full = r.reason === "full";
        FileBox.remove(rec.id).catch(() => {});
        break; // 棚が尽きたらそこで止める
      }
    }
    if (added) {
      wrBridge.stats.stashed += added;
      wrLog("stashed");
      wrSaveBridge();
      renderWaitingRoomHome();
    }
    if (full) showToast(t("The shelf is full. Take something off it first."));
  });

  document.getElementById("shelfPrevBtn").addEventListener("click", () => {
    const { walls } = wrReadShelf();
    wrWallIndex = (wrWallIndex - 1 + walls.length) % walls.length;
    renderShelfView();
  });
  document.getElementById("shelfNextBtn").addEventListener("click", () => {
    const { walls } = wrReadShelf();
    wrWallIndex = (wrWallIndex + 1) % walls.length;
    renderShelfView();
  });
  document.getElementById("shelfWallSelect").addEventListener("change", (e) => {
    wrWallIndex = Number(e.target.value) || 0;
    renderShelfView();
  });
  document.getElementById("shelfSearchInput").addEventListener("input", (e) => {
    wrShelfQuery = e.target.value;
    renderShelfView();
  });

  document.getElementById("shelfPrioritySelect").addEventListener("change", (e) => {
    if (!wrSelectedBookId) return;
    wrUpdateBook(wrSelectedBookId, { priority: e.target.value });
    renderShelfView();
    showToast(t("Saved"));
  });

  // 一度見切ったものと、まだのものを分ける。押しても本は消さない。
  document.getElementById("shelfDoneBtn").addEventListener("click", () => {
    if (!wrSelectedBookId) return;
    const shelf = wrReadShelf();
    const book = shelf.books.find((b) => b.id === wrSelectedBookId);
    if (!book) return;
    const nowDone = !book.done;
    wrUpdateBook(book.id, { done: nowDone, doneAt: nowDone ? Date.now() : null });
    if (nowDone) wrWallIndex = WR_DONE_WALL; // 移った先が見えるように棚も切り替える
    wrOpenBookDetail(book.id);
    // 済にした瞬間だけ小さく祝う。戻すのは取り消しなので祝わない。
    if (nowDone) {
      celebrate(t("Marked as done"));
      logEvent("shelf_item_done");
    } else {
      showToast(t("Put back as unfinished"));
    }
  });

  // 「何分で終わるか」が分かると、いま始められるかどうかを判断できる。
  document.getElementById("shelfMinutesInput").addEventListener("change", (e) => {
    if (!wrSelectedBookId) return;
    const n = Math.round(Number(e.target.value));
    wrUpdateBook(wrSelectedBookId, { minutes: Number.isFinite(n) && n > 0 ? n : null });
    renderShelfView();
  });

  document.getElementById("shelfMoveUpBtn").addEventListener("click", () => wrMoveSelected(-1));
  document.getElementById("shelfMoveDownBtn").addEventListener("click", () => wrMoveSelected(1));

  document.getElementById("shelfOpenBtn").addEventListener("click", wrOpenSelectedBook);
  document.getElementById("shelfRemoveBtn").addEventListener("click", wrRemoveSelectedBook);
  document.getElementById("shelfCloseDetailBtn").addEventListener("click", wrCloseBookDetail);

  // 待合室や蔵書館を別の画面で開いている場合の知らせ
  try {
    const ch = new BroadcastChannel(WR_CHANNEL);
    ch.onmessage = (e) => {
      const d = e.data || {};
      if (d.type === "bridge-updated") {
        wrLoadBridge();
        if (wrPanel === "wait") renderWaitingRoomHome();
      }
      if (d.type === "book-added" && wrPanel === "shelf") renderShelfView();
    };
  } catch (e) {}

  renderWaitingRoomHome();
  wrShowPanel("wait");
}

/* ==========================================================================
   頭を冷やす時間（設定を緩めるときだけ待たせる）
   設定を落ち着いて決めている自分と、いま見たくてたまらない自分は別人で、
   後者に即座に設定を書き換えられると、この仕組み自体が意味を失う。
   そこで「厳しくする変更」は即座に、「緩める変更」だけ24時間待たせる。
   待っている間はいつでも取り消せるので、閉じ込められるわけではない。
   ========================================================================== */
const COOL_OFF_MS = 24 * 60 * 60 * 1000;

function isCoolOffEnabled() {
  return loadJSON(STORAGE_KEYS.coolOffEnabled, true);
}
function saveCoolOffEnabled(v) {
  saveJSON(STORAGE_KEYS.coolOffEnabled, v);
}

// 保留中の変更を実際に適用する手続き。保留分は再読み込みをまたぐので、
// 関数そのものではなくこのキーで引ける名前として保存する。
const PENDING_APPLIERS = {
  breakEnabled: (v) => saveBreakEnabled(v),
  breakIntervalMin: (v) => saveBreakIntervalMin(v),
  breakScrollCount: (v) => saveBreakScrollCount(v),
  scrollGatedApps: (v) => saveScrollGatedAppIds(v),
  feedAppsNeedScrollOn: (v) => saveFeedGateEnabled(v),
  coolOffEnabled: (v) => saveCoolOffEnabled(v),
};

function getPendingChanges() {
  const list = loadJSON(STORAGE_KEYS.pendingChanges, []);
  return Array.isArray(list) ? list.filter((p) => p && PENDING_APPLIERS[p.key]) : [];
}
function savePendingChanges(list) {
  saveJSON(STORAGE_KEYS.pendingChanges, list);
}

// 期限の来た保留分を適用する。init と設定を開いたとき、あとは定期的に呼ぶ。
function flushPendingChanges() {
  const now = Date.now();
  const pending = getPendingChanges();
  const due = pending.filter((p) => p.effectiveAt <= now);
  if (!due.length) return false;
  due.forEach((p) => {
    try {
      PENDING_APPLIERS[p.key](p.value);
    } catch (e) {
      /* 適用できなくても残りは進める */
    }
  });
  savePendingChanges(pending.filter((p) => p.effectiveAt > now));
  return true;
}

// 設定変更の入口。緩める変更だけ保留にし、それ以外はそのまま通す。
// 同じ項目を続けて変えたときは、最後の指示だけを残す（待ち時間も引き直す）。
function requestSettingChange({ key, value, label, loosening }) {
  if (!loosening || !isCoolOffEnabled()) {
    PENDING_APPLIERS[key](value);
    savePendingChanges(getPendingChanges().filter((p) => p.key !== key));
    return { applied: true };
  }
  const effectiveAt = Date.now() + COOL_OFF_MS;
  const list = getPendingChanges().filter((p) => p.key !== key);
  list.push({ key, value, label, effectiveAt });
  savePendingChanges(list);
  return { applied: false, effectiveAt };
}

function formatCoolOffWait(effectiveAt) {
  const mins = Math.max(1, Math.round((effectiveAt - Date.now()) / 60000));
  if (mins < 60) return tf("{minutes} min", { minutes: mins });
  const hours = Math.floor(mins / 60);
  const rest = mins % 60;
  return rest ? tf("{hours}h {minutes}m", { hours, minutes: rest }) : tf("{hours}h", { hours });
}

// 変更が保留になったことを、その場で伝える。黙って効かないのが一番よくない。
function reportSettingChange(result) {
  if (result.applied) return;
  showToast(tf("Saved. It takes effect in {wait} — you can cancel until then.", { wait: formatCoolOffWait(result.effectiveAt) }));
  renderPendingChanges();
}

function renderPendingChanges() {
  const section = document.getElementById("pendingChangesSection");
  const list = document.getElementById("pendingChangesList");
  if (!section || !list) return;
  flushPendingChanges();
  const pending = getPendingChanges();
  section.hidden = pending.length === 0;
  list.innerHTML = "";
  pending.forEach((p) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = tf("{change} — in {wait}", { change: t(p.label), wait: formatCoolOffWait(p.effectiveAt) });
    li.appendChild(span);

    const btn = document.createElement("button");
    btn.className = "remove-btn";
    btn.type = "button";
    btn.textContent = "×";
    btn.setAttribute("aria-label", t("Cancel this change"));
    btn.addEventListener("click", () => {
      savePendingChanges(getPendingChanges().filter((x) => x.key !== p.key));
      renderPendingChanges();
      refreshProtectedSettingInputs();
      showToast(t("Change cancelled"));
    });
    li.appendChild(btn);
    list.appendChild(li);
  });
}

// 保留中は「まだ効いていない現在値」を出しておかないと、押した通りに
// 見えてしまって嘘になる。保存済みの値へ戻す。
function refreshProtectedSettingInputs() {
  const enabled = document.getElementById("breakEnabledToggle");
  const interval = document.getElementById("breakIntervalInput");
  const scrolls = document.getElementById("breakScrollInput");
  const gate = document.getElementById("feedGateToggle");
  const coolOff = document.getElementById("coolOffToggle");
  if (enabled) enabled.checked = isBreakEnabled();
  if (interval) interval.value = getBreakIntervalMin();
  if (scrolls) scrolls.value = getBreakScrollCount();
  if (gate) gate.checked = isFeedGateEnabled();
  if (coolOff) coolOff.checked = isCoolOffEnabled();
  renderScrollGatedAppList();
}

/* ==========================================================================
   頑張りたいこと
   本棚に貯まるのは「あとで見たかったもの」＝気を散らすものの先送りなので、
   休憩でそれだけを勧めると、気散じを別の気散じに置き換えるだけになりかねない。
   そこで、画面から離れて本当にやりたいことを自分で登録できるようにし、
   休憩ではこちらを優先して差し出す。
   ========================================================================== */
// 実行意図は「いつ」まで決めた方が効く。時間帯だけでも決めておけると、
// その時間に来た休憩でそれを優先して差し出せる。
const ASPIRATION_BANDS = ["any", "morning", "afternoon", "evening", "night"];

function aspirationBandLabel(band) {
  if (band === "morning") return t("Morning");
  if (band === "afternoon") return t("Afternoon");
  if (band === "evening") return t("Evening");
  if (band === "night") return t("Late night");
  return t("Any time");
}

function currentBand(now = new Date()) {
  const h = now.getHours();
  if (h >= 5 && h < 11) return "morning";
  if (h >= 11 && h < 17) return "afternoon";
  if (h >= 17 && h < 22) return "evening";
  return "night";
}

// 曜日はどの組み合わせでも選べるようにする（例: 水曜だけ、月〜金だけ、土日だけ）。
// JSのDate#getDay()に揃えて 0=日, 1=月, ... 6=土 の配列で持つ。空配列は「毎日」の意味。
function normalizeAspirationDays(days) {
  if (days === "weekday") return [1, 2, 3, 4, 5]; // 旧データ（平日/休日の3択時代）からの移行
  if (days === "weekend") return [0, 6];
  if (!Array.isArray(days)) return [];
  const set = new Set();
  days.forEach((d) => {
    const n = Number(d);
    if (Number.isInteger(n) && n >= 0 && n <= 6) set.add(n);
  });
  return Array.from(set).sort((a, b) => a - b);
}

// 曜日名はロケールごとに長さも表記も違うので、Intlに任せて取り違えを防ぐ。
function weekdayShortLabel(dayIndex) {
  const ref = new Date(2023, 0, 1 + dayIndex); // 2023-01-01は日曜日
  return new Intl.DateTimeFormat(currentLanguage, { weekday: "short" }).format(ref);
}

function aspirationDaysLabel(days) {
  if (!days || !days.length || days.length === 7) return "";
  const key = days.join(",");
  if (key === "1,2,3,4,5") return t("Weekdays");
  if (key === "0,6") return t("Weekends");
  return days.map(weekdayShortLabel).join(", ");
}

function getAspirations() {
  const list = loadJSON(STORAGE_KEYS.aspirations, []);
  if (!Array.isArray(list)) return [];
  return list
    .filter((a) => a && a.text)
    .map((a) => ({
      ...a,
      when: ASPIRATION_BANDS.includes(a.when) ? a.when : "any",
      days: normalizeAspirationDays(a.days),
      place: typeof a.place === "string" ? a.place : "",
      minutes: Number.isFinite(Number(a.minutes)) && Number(a.minutes) > 0 ? Number(a.minutes) : null,
      until: /^\d{4}-\d{2}-\d{2}$/.test(a.until) ? a.until : null,
    }));
}
function saveAspirations(list) {
  saveJSON(STORAGE_KEYS.aspirations, list);
}

function addAspiration(text, { when, days, place, minutes, until } = {}) {
  const list = getAspirations();
  const mins = Number(minutes);
  list.push({
    id: `asp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text,
    when: ASPIRATION_BANDS.includes(when) ? when : "any",
    days: normalizeAspirationDays(days),
    place: (place || "").trim(),
    minutes: Number.isFinite(mins) && mins > 0 ? Math.round(mins) : null,
    until: /^\d{4}-\d{2}-\d{2}$/.test(until) ? until : null,
    doneCount: 0,
  });
  saveAspirations(list);
  // 頑張りたいことを追加したその場で、Routine Trackerのカードにも即座に反映する
  // （Routine Trackerの「カテゴリ」は頑張りたいこと一覧を直接読むだけで、
  // 別に登録し直す必要がない設計にしている）。
  refreshRoutineTrackerViews();
}

// 「いつ・どの曜日」まで決まっているものほど実行しやすいので、いまに合うものを先に出す。
// ただし条件を付けたせいで候補が消えては本末転倒なので、段階的に緩めて必ず何か返す。
function aspirationDayMatches(a, dayIndex) {
  return !a.days || a.days.length === 0 || a.days.includes(dayIndex);
}

function aspirationsForNow() {
  const all = getAspirations();
  if (!all.length) return [];
  const band = currentBand();
  const today = new Date().getDay();

  const onDay = all.filter((a) => aspirationDayMatches(a, today));
  const pool = onDay.length ? onDay : all;

  const exact = pool.filter((a) => a.when === band);
  if (exact.length) return exact;
  const anytime = pool.filter((a) => a.when === "any");
  return anytime.length ? anytime : pool;
}

// 「いつまで」を残り日数で示す。数字だけの締め切りより、あと何日かの方が今日動くかの判断に近い。
function aspirationUntilLabel(a) {
  if (!a.until) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${a.until}T00:00:00`);
  const days = Math.round((target - today) / 86400000);
  if (days > 1) return tf("{days} days left", { days });
  if (days === 1) return t("1 day left");
  if (days === 0) return t("Last day");
  return t("Past your date");
}

// 提案に添える一行。場所と所要時間があるほど「いま始められるか」を判断しやすい。
function aspirationMeta(a) {
  const bits = [];
  if (a.place) bits.push(a.place);
  if (a.minutes) bits.push(tf("{minutes} min", { minutes: a.minutes }));
  if (a.when !== "any") bits.push(aspirationBandLabel(a.when));
  const daysLabel = aspirationDaysLabel(a.days);
  if (daysLabel) bits.push(daysLabel);
  const until = aspirationUntilLabel(a);
  if (until) bits.push(until);
  return bits.join(" · ");
}

function noteAspirationDone(id) {
  const list = getAspirations();
  const hit = list.find((a) => a.id === id);
  if (!hit) return;
  hit.doneCount = (hit.doneCount || 0) + 1;
  hit.lastDoneAt = Date.now();
  saveAspirations(list);
  // 振り返りで「いつ何をしたか」を並べたいので、回数だけでなく一件ずつ残す。
  const log = getAspirationLog();
  log.push({ text: hit.text, at: Date.now() });
  saveJSON(STORAGE_KEYS.aspirationLog, log.slice(-200));
  logEvent("aspiration_done");
}

function getAspirationLog() {
  const list = loadJSON(STORAGE_KEYS.aspirationLog, []);
  return Array.isArray(list) ? list.filter((e) => e && e.text && e.at) : [];
}

// 設定画面と待合室、どちらにも同じ一覧を出す。片方で足しても消しても、
// もう片方が古いまま残らないよう、変更のたびに両方を描き直す。
function renderAspirationListInto(listId, emptyId) {
  const list = document.getElementById(listId);
  if (!list) return;
  const items = getAspirations();
  list.innerHTML = "";
  items.forEach((a, idx) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const bits = [a.text];
    const meta = aspirationMeta(a);
    if (meta) bits.push(meta);
    if (a.doneCount) bits.push(tf("done {count}x", { count: a.doneCount }));
    span.textContent = bits.join(" · ");
    li.appendChild(span);

    const btn = document.createElement("button");
    btn.className = "remove-btn";
    btn.type = "button";
    btn.textContent = "×";
    btn.setAttribute("aria-label", tf('Remove "{name}"', { name: a.text }));
    btn.addEventListener("click", () => {
      const updated = getAspirations();
      updated.splice(idx, 1);
      saveAspirations(updated);
      renderAspirationList();
      renderAspirationListInto(listId, emptyId);
    });
    li.appendChild(btn);
    list.appendChild(li);
  });
  const empty = document.getElementById(emptyId);
  if (empty) empty.hidden = items.length > 0;
}
function renderAspirationList() {
  renderAspirationListInto("aspirationList", "aspirationEmpty");
  renderAspirationListInto("wrAspirationList", "wrAspirationEmpty");
}

// 設定画面・待合室、どちらの追加フォームも同じ形なので配線を共通化する。
// 曜日ボタンの並び順。月始まりの方が「今週これから」を思い浮かべやすい。
const DAY_TOGGLE_ORDER = [1, 2, 3, 4, 5, 6, 0];

function buildDayToggleRow(containerId) {
  const row = document.getElementById(containerId);
  if (!row) return;
  const prevSelected = new Set(
    Array.from(row.querySelectorAll(".day-toggle.is-selected")).map((b) => Number(b.dataset.day))
  );
  row.innerHTML = "";
  DAY_TOGGLE_ORDER.forEach((day) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "day-toggle";
    btn.dataset.day = String(day);
    btn.textContent = weekdayShortLabel(day);
    const selected = prevSelected.has(day);
    btn.classList.toggle("is-selected", selected);
    btn.setAttribute("aria-pressed", String(selected));
    btn.addEventListener("click", () => {
      const nowSelected = !btn.classList.contains("is-selected");
      btn.classList.toggle("is-selected", nowSelected);
      btn.setAttribute("aria-pressed", String(nowSelected));
    });
    row.appendChild(btn);
  });
}

function renderDayToggleRows() {
  buildDayToggleRow("newAspirationDayRow");
  buildDayToggleRow("wrNewAspirationDayRow");
  buildDayToggleRow("onboardingGoalDayRow");
}

function getSelectedDays(containerId) {
  const row = document.getElementById(containerId);
  if (!row) return [];
  return Array.from(row.querySelectorAll(".day-toggle.is-selected")).map((b) => Number(b.dataset.day));
}

function clearDaySelection(containerId) {
  const row = document.getElementById(containerId);
  if (!row) return;
  row.querySelectorAll(".day-toggle.is-selected").forEach((b) => {
    b.classList.remove("is-selected");
    b.setAttribute("aria-pressed", "false");
  });
}

function wireAspirationAddForm(ids) {
  const btn = document.getElementById(ids.btn);
  if (!btn) return;
  btn.addEventListener("click", () => {
    const input = document.getElementById(ids.input);
    const when = document.getElementById(ids.when);
    const minutes = document.getElementById(ids.minutes);
    const until = document.getElementById(ids.until);
    const value = input.value.trim();
    if (!value) return;
    const days = getSelectedDays(ids.dayRow);
    addAspiration(value, { when: when.value, days, minutes: minutes.value, until: until.value });
    input.value = "";
    when.value = "any";
    clearDaySelection(ids.dayRow);
    minutes.value = "";
    until.value = "";
    renderAspirationList();
    if (ids.collapse) {
      const toggle = document.getElementById(ids.collapse.toggleBtn);
      const form = document.getElementById(ids.collapse.form);
      if (form) form.hidden = true;
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
    if (ids.onAdded) ids.onAdded();
  });
}

/* ==========================================================================
   Routine Tracker（休憩所ホームの「連続日数・今日の回数・片付いた数」の
   統計行を置き換える本体）。以前ここに置いていた指標は数字だけで、
   「頑張りたいこと」を実際にやれたかどうかの記録にはならなかった。
   ここでは頑張りたいこと一覧をそのままカテゴリとして読み、
   別に登録し直すUIは持たない（追加すればその場でカードが増える）。
   元にしたのは利用者が別途作っていたRoutineTrackerアプリで、
   日/履歴/日記/統計の4画面と1〜5段階の進捗記録という構成をほぼそのまま踏襲した。
   ========================================================================== */
// 進捗の色（1=黒 2=白 3=黄 4=橙 5=赤）。元アプリの配色をそのまま踏襲。
const ROUTINE_PROG_COLORS = ["", "#1e1e1e", "#f1f5f9", "#facc15", "#f97316", "#ef4444"];
// カテゴリ（頑張りたいこと）ごとにグラフ上で見分けられるようにする配色。1色目はアプリのアクセント色。
const ROUTINE_CAT_PALETTE = [
  "#9ed17a", "#f43f5e", "#f97316", "#38bdf8", "#c084fc",
  "#fbbf24", "#2dd4bf", "#f472b6", "#a3e635", "#94a3b8",
];

// HTML/SVGの文字列に利用者入力（頑張りたいことの文面やメモ）を埋め込む箇所があるため、
// テキスト・属性値のどちらに使っても安全なように四種類ともエスケープしておく。
function escapeHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function routineProgLabel(level) {
  const labels = [
    t("Not recorded"),
    t("Not at all"),
    t("Barely"),
    t("Minimum done"),
    t("Pretty good"),
    t("Nailed it!"),
  ];
  return labels[level] || labels[0];
}

// カテゴリは「頑張りたいこと」一覧をそのまま使う。ここで別のリストを持たせると
// 追加のたびに二重登録・同期漏れが起きるため、常に生で読みに行く設計にしている。
function routineCategories() {
  return getAspirations();
}

function getRoutineRecords() {
  const data = loadJSON(STORAGE_KEYS.routineRecords, {});
  return data && typeof data === "object" ? data : {};
}
function saveRoutineRecords(data) {
  saveJSON(STORAGE_KEYS.routineRecords, data);
}
function getRoutineRecord(dateStr, catId) {
  const data = getRoutineRecords();
  const day = data[dateStr] || {};
  return day[catId] || { prog: 0, memo: "" };
}
function setRoutineProgress(dateStr, catId, val) {
  const data = getRoutineRecords();
  if (!data[dateStr]) data[dateStr] = {};
  const cur = data[dateStr][catId] || { prog: 0, memo: "" };
  cur.prog = cur.prog === val ? 0 : val; // 同じ段階をもう一度押したら取り消す
  data[dateStr][catId] = cur;
  saveRoutineRecords(data);
}
function routineHistCycleProgress(dateStr, catId) {
  const data = getRoutineRecords();
  if (!data[dateStr]) data[dateStr] = {};
  const cur = data[dateStr][catId] || { prog: 0, memo: "" };
  cur.prog = (cur.prog + 1) % 6;
  data[dateStr][catId] = cur;
  saveRoutineRecords(data);
}
function setRoutineMemo(dateStr, catId, memo) {
  const data = getRoutineRecords();
  if (!data[dateStr]) data[dateStr] = {};
  const cur = data[dateStr][catId] || { prog: 0, memo: "" };
  cur.memo = memo;
  data[dateStr][catId] = cur;
  saveRoutineRecords(data);
}

function getRoutineDiary() {
  const data = loadJSON(STORAGE_KEYS.routineDiary, {});
  return data && typeof data === "object" ? data : {};
}
function saveRoutineDiaryEntry(dateStr, text) {
  const data = getRoutineDiary();
  if (text) data[dateStr] = text;
  else delete data[dateStr];
  saveJSON(STORAGE_KEYS.routineDiary, data);
}

function routineTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
// 曜日込みの短い日付表示。言語ごとの曜日名はweekdayShortLabelに任せる
// （元アプリは英語/日本語だけのハードコードだったが、このアプリは8言語対応のため）。
function fmtRoutineDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  return `${d.getMonth() + 1}/${d.getDate()} (${weekdayShortLabel(d.getDay())})`;
}
function fmtRoutineMonthLabel(monthStr) {
  const [y, m] = monthStr.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString(currentLanguage, { month: "long", year: "numeric" });
}

/* ---- 画面状態 ----
   統計と今日の採点は常時表示（タブで切り替える必要がない）。
   履歴・日記だけ、場所を取るのでタブの奥にしまってある。 */
let routineView = "history";
let routineTodayDate = routineTodayStr();
let routineHistoryMonth = routineTodayDate.slice(0, 7);
let routineDiaryDate = routineTodayDate;
let routineStatsRange = 30;
let routineMemoContext = null; // { dateStr, catId }

function showRoutineView(view) {
  routineView = view;
  ["History", "Diary"].forEach((name) => {
    const isActive = name.toLowerCase() === view;
    const tab = document.getElementById(`routineTab${name}`);
    const panel = document.getElementById(`routineView${name}`);
    if (tab) tab.classList.toggle("is-active", isActive);
    if (panel) panel.hidden = !isActive;
  });
  refreshRoutineTrackerViews();
}

// 頑張りたいことの追加・削除があった直後にも呼ばれる。オンボーディング中など
// まだRoutine TrackerのDOMが無いタイミングから呼ばれても安全に何もしない。
function refreshRoutineTrackerViews() {
  if (!document.getElementById("routineTodayCards")) return;
  renderRoutineStats();
  renderRoutineToday();
  if (routineView === "diary") renderRoutineDiary();
  else renderRoutineHistory();
}

/* ---- Today ---- */
function shiftRoutineTodayDate(delta) {
  const d = new Date(`${routineTodayDate}T00:00:00`);
  d.setDate(d.getDate() + delta);
  const next = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  if (next > routineTodayStr()) return; // 未来には進めない
  routineTodayDate = next;
  renderRoutineToday();
}

function renderRoutineToday() {
  document.getElementById("routineTodayLabel").textContent = fmtRoutineDate(routineTodayDate);
  const container = document.getElementById("routineTodayCards");
  container.innerHTML = "";
  const cats = routineCategories();
  if (!cats.length) {
    const empty = document.createElement("p");
    empty.className = "routine-empty";
    empty.textContent = t("Add something you want to work on, and it'll show up here to track.");
    container.appendChild(empty);
    return;
  }
  cats.forEach((cat) => {
    const rec = getRoutineRecord(routineTodayDate, cat.id);
    const card = document.createElement("div");
    card.className = "routine-card";

    const top = document.createElement("div");
    top.className = "routine-card-top";
    const name = document.createElement("span");
    name.className = "routine-card-name";
    name.textContent = cat.text;
    const memoBtn = document.createElement("button");
    memoBtn.type = "button";
    memoBtn.className = "routine-memo-btn";
    memoBtn.textContent = `📝 ${t("Note")}`;
    memoBtn.addEventListener("click", () => openRoutineMemo(routineTodayDate, cat.id));
    top.append(name, memoBtn);

    const segWrap = document.createElement("div");
    segWrap.className = "routine-segments";
    for (let i = 1; i <= 5; i++) {
      const seg = document.createElement("button");
      seg.type = "button";
      seg.className = `routine-seg ${i <= rec.prog ? "is-filled" : "is-empty"}`;
      if (i <= rec.prog) seg.style.background = ROUTINE_PROG_COLORS[i];
      seg.title = routineProgLabel(i);
      seg.addEventListener("click", () => {
        setRoutineProgress(routineTodayDate, cat.id, i);
        renderRoutineToday();
      });
      segWrap.appendChild(seg);
    }

    const info = document.createElement("div");
    info.className = "routine-card-info";
    const label = document.createElement("span");
    label.className = "routine-stage-label";
    label.textContent = routineProgLabel(rec.prog);
    if (rec.prog > 0) label.style.color = ROUTINE_PROG_COLORS[rec.prog];
    info.appendChild(label);

    card.append(top, segWrap, info);
    if (rec.memo) {
      const memo = document.createElement("div");
      memo.className = "routine-memo-preview";
      memo.textContent = `📝 ${rec.memo}`;
      card.appendChild(memo);
    }
    container.appendChild(card);
  });
}

/* ---- History ---- */
function shiftRoutineHistoryMonth(delta) {
  const [y, m] = routineHistoryMonth.split("-").map(Number);
  let ny = y;
  let nm = m + delta;
  if (nm > 12) { nm = 1; ny++; }
  if (nm < 1) { nm = 12; ny--; }
  routineHistoryMonth = `${ny}-${pad2(nm)}`;
  renderRoutineHistory();
}

function renderRoutineHistory() {
  document.getElementById("routineHistoryLabel").textContent = fmtRoutineMonthLabel(routineHistoryMonth);
  const [y, m] = routineHistoryMonth.split("-").map(Number);
  const daysInMonth = new Date(y, m, 0).getDate();
  const table = document.getElementById("routineHistoryTable");
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");
  const cats = routineCategories();
  const today = routineTodayStr();

  thead.innerHTML = "";
  tbody.innerHTML = "";
  if (!cats.length) {
    const p = document.createElement("p");
    p.className = "routine-empty";
    p.textContent = t("Add something you want to work on, and it'll show up here to track.");
    tbody.appendChild(document.createElement("tr")).appendChild(document.createElement("td")).appendChild(p);
    return;
  }

  const headRow = document.createElement("tr");
  const dateHeadTh = document.createElement("th");
  dateHeadTh.textContent = t("Date");
  headRow.appendChild(dateHeadTh);
  cats.forEach((cat) => {
    const th = document.createElement("th");
    th.textContent = cat.text;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);

  let rowsAdded = 0;
  for (let d = daysInMonth; d >= 1; d--) {
    const ds = `${y}-${pad2(m)}-${pad2(d)}`;
    if (ds > today) continue;
    rowsAdded++;
    const isToday = ds === today;
    const tr = document.createElement("tr");
    tr.className = isToday ? "is-today" : "";

    const dateTd = document.createElement("td");
    dateTd.className = "routine-history-date";
    const dow = weekdayShortLabel(new Date(`${ds}T00:00:00`).getDay());
    dateTd.innerHTML = `${m}/${d}<br><span class="routine-history-dow">${escapeHtml(dow)}${isToday ? " ★" : ""}</span>`;
    tr.appendChild(dateTd);

    cats.forEach((cat) => {
      const td = document.createElement("td");
      td.className = "routine-history-cell";
      const rec = getRoutineRecord(ds, cat.id);
      const block = document.createElement("button");
      block.type = "button";
      block.className = `routine-history-block routine-lvl-${rec.prog}`;
      block.title = routineProgLabel(rec.prog);
      if (rec.memo) {
        const memoIcon = document.createElement("span");
        memoIcon.className = "routine-history-memo";
        memoIcon.textContent = "📝";
        block.appendChild(memoIcon);
      }
      block.addEventListener("click", () => {
        routineHistCycleProgress(ds, cat.id);
        renderRoutineHistory();
      });
      td.appendChild(block);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  }
  if (!rowsAdded) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = cats.length + 1;
    td.className = "routine-history-empty";
    td.textContent = t("No records this month");
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
}

/* ---- Diary ---- */
function shiftRoutineDiaryDate(delta) {
  const d = new Date(`${routineDiaryDate}T00:00:00`);
  d.setDate(d.getDate() + delta);
  const next = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  if (next > routineTodayStr()) return;
  routineDiaryDate = next;
  renderRoutineDiary();
}

function renderRoutineDiary() {
  document.getElementById("routineDiaryLabel").textContent = fmtRoutineDate(routineDiaryDate);
  const diary = getRoutineDiary();
  document.getElementById("routineDiaryInput").value = diary[routineDiaryDate] || "";

  const hist = document.getElementById("routineDiaryHistory");
  hist.innerHTML = "";
  const entries = Object.entries(diary)
    .filter(([ds, text]) => text && ds !== routineDiaryDate)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 30);
  entries.forEach(([ds, text]) => {
    const entry = document.createElement("div");
    entry.className = "routine-diary-entry";
    const dateEl = document.createElement("div");
    dateEl.className = "routine-diary-entry-date";
    dateEl.textContent = fmtRoutineDate(ds);
    const textEl = document.createElement("div");
    textEl.className = "routine-diary-entry-text";
    textEl.textContent = text;
    entry.append(dateEl, textEl);
    hist.appendChild(entry);
  });
}

function saveRoutineDiaryFromInput() {
  const text = document.getElementById("routineDiaryInput").value.trim();
  saveRoutineDiaryEntry(routineDiaryDate, text);
  showToast(t("Diary saved"));
  renderRoutineDiary();
}

/* ---- メモモーダル（Today/Historyどちらからも開ける） ---- */
function openRoutineMemo(dateStr, catId) {
  const cat = routineCategories().find((c) => c.id === catId);
  routineMemoContext = { dateStr, catId };
  document.getElementById("routineMemoLabel").textContent = `${fmtRoutineDate(dateStr)} ・ ${cat ? cat.text : ""}`;
  document.getElementById("routineMemoInput").value = getRoutineRecord(dateStr, catId).memo;
  document.getElementById("routineMemoModal").hidden = false;
}
function saveRoutineMemoFromModal() {
  if (!routineMemoContext) return;
  const memo = document.getElementById("routineMemoInput").value.trim();
  setRoutineMemo(routineMemoContext.dateStr, routineMemoContext.catId, memo);
  closeRoutineMemo();
  refreshRoutineTrackerViews();
}
function closeRoutineMemo() {
  document.getElementById("routineMemoModal").hidden = true;
  routineMemoContext = null;
}

/* ---- Stats ---- */
function routineLastNDays(n) {
  const today = routineTodayStr();
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(`${today}T00:00:00`);
    d.setDate(d.getDate() - i);
    days.push(`${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`);
  }
  return days;
}

function routineArrAvg(arr, ignoreZero) {
  const a = ignoreZero ? arr.filter((v) => v > 0) : arr;
  return a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
}

function renderRoutineStats() {
  const container = document.getElementById("routineStatsContent");
  const cats = routineCategories();
  container.innerHTML = "";
  if (!cats.length) {
    const p = document.createElement("p");
    p.className = "routine-empty";
    p.textContent = t("Add something you want to work on, and it'll show up here to track.");
    container.appendChild(p);
    return;
  }

  const days = routineLastNDays(routineStatsRange);
  const today = routineTodayStr();
  const catData = {};
  cats.forEach((c) => { catData[c.id] = days.map((ds) => getRoutineRecord(ds, c.id).prog); });

  function section(title, bodyHtml) {
    return `<div class="routine-stat-section"><div class="routine-stat-section-title">${escapeHtml(title)}</div>${bodyHtml}</div>`;
  }

  // 1. サマリーカード
  const activeDays = days.filter((ds) => cats.some((c) => getRoutineRecord(ds, c.id).prog > 0)).length;
  const allVals = cats.flatMap((c) => catData[c.id]).filter((v) => v > 0);
  const overallAvg = allVals.length ? (allVals.reduce((a, b) => a + b, 0) / allVals.length).toFixed(1) : "—";
  let bestCat = null;
  let bestAvg = -1;
  cats.forEach((c) => {
    const avg = routineArrAvg(catData[c.id], true);
    if (avg > bestAvg) { bestAvg = avg; bestCat = c; }
  });
  const summaryHtml = `<div class="routine-stat-cards">
    <div class="routine-stat-card"><div class="routine-stat-card-val">${activeDays}</div><div class="routine-stat-card-label">${escapeHtml(t("Active Days"))}</div><div class="routine-stat-card-sub">${tf("last {days}d", { days: routineStatsRange })}</div></div>
    <div class="routine-stat-card"><div class="routine-stat-card-val">${overallAvg}</div><div class="routine-stat-card-label">${escapeHtml(t("Avg Score"))}</div><div class="routine-stat-card-sub">${escapeHtml(t("out of 5.0"))}</div></div>
    <div class="routine-stat-card"><div class="routine-stat-card-val" style="font-size:${bestCat && bestCat.text.length > 6 ? "12" : "20"}px">${bestCat ? escapeHtml(bestCat.text) : "—"}</div><div class="routine-stat-card-label">${escapeHtml(t("Top Category"))}</div><div class="routine-stat-card-sub">${bestAvg > 0 ? `${bestAvg.toFixed(1)} ${t("avg")}` : escapeHtml(t("no data"))}</div></div>
  </div>`;

  // 2. アクティビティ・ヒートマップ
  const hmDays = days.slice(-42);
  let hm = `<div class="routine-heatmap-wrap"><table class="routine-heatmap-table"><thead><tr><td class="routine-hm-cat-label"></td>`;
  hmDays.forEach((ds) => {
    const dow = weekdayShortLabel(new Date(`${ds}T00:00:00`).getDay()).slice(0, 1);
    hm += `<td class="routine-hm-th${ds === today ? " routine-hm-today" : ""}">${escapeHtml(dow)}</td>`;
  });
  hm += "</tr></thead><tbody>";
  cats.forEach((cat, ci) => {
    const color = ROUTINE_CAT_PALETTE[ci % ROUTINE_CAT_PALETTE.length];
    hm += `<tr><td class="routine-hm-cat-label" style="color:${color}">${escapeHtml(cat.text)}</td>`;
    hmDays.forEach((ds) => {
      const prog = getRoutineRecord(ds, cat.id).prog;
      const bg = prog > 0 ? ROUTINE_PROG_COLORS[prog] : "var(--bg-subtle)";
      const border = prog === 2 ? "border:1px solid var(--border);" : "";
      hm += `<td class="routine-hm-cell"><div class="routine-hm-sq" style="background:${bg};${border}" title="${escapeHtml(routineProgLabel(prog))}"></div></td>`;
    });
    hm += "</tr>";
  });
  hm += "</tbody></table></div>";

  // 3. レーダーチャート（カテゴリのバランス）
  function drawRadar() {
    if (cats.length < 2) return `<div class="routine-need-cats">${escapeHtml(t("Need 2+ categories"))}</div>`;
    const N = cats.length;
    const R = 72;
    const cx = 110;
    const cy = 110;
    const avgs = cats.map((c) => routineArrAvg(catData[c.id], true) / 5);
    const pt = (i, r) => {
      const a = (Math.PI * 2 * i) / N - Math.PI / 2;
      return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    };
    let s = `<svg viewBox="0 0 220 220" style="width:100%;max-width:240px">`;
    [0.25, 0.5, 0.75, 1].forEach((f) => {
      const pts = cats.map((_, i) => pt(i, R * f));
      s += `<polygon points="${pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}" fill="none" stroke="var(--border)" stroke-width="1"/>`;
    });
    cats.forEach((_, i) => {
      const e = pt(i, R);
      s += `<line x1="${cx}" y1="${cy}" x2="${e.x.toFixed(1)}" y2="${e.y.toFixed(1)}" stroke="var(--border)" stroke-width="1"/>`;
    });
    const dpts = cats.map((_, i) => pt(i, R * Math.max(avgs[i], 0.04)));
    s += `<polygon points="${dpts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}" fill="var(--accent)" fill-opacity="0.22" stroke="var(--accent)" stroke-width="2"/>`;
    dpts.forEach((p) => { s += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3" fill="var(--accent)"/>`; });
    cats.forEach((cat, i) => {
      const lp = pt(i, R + 20);
      const anchor = lp.x < cx - 4 ? "end" : lp.x > cx + 4 ? "start" : "middle";
      const color = ROUTINE_CAT_PALETTE[i % ROUTINE_CAT_PALETTE.length];
      s += `<text x="${lp.x.toFixed(1)}" y="${(lp.y + 4).toFixed(1)}" text-anchor="${anchor}" font-size="10" fill="${color}" font-weight="700">${escapeHtml(cat.text.slice(0, 9))}</text>`;
    });
    s += "</svg>";
    return s;
  }

  // 4. 進捗トレンド（折れ線）
  function drawLine() {
    const W = 320;
    const H = 150;
    const pL = 26;
    const pR = 8;
    const pT = 10;
    const pB = 22;
    const w = W - pL - pR;
    const h = H - pT - pB;
    const N = days.length;
    const px = (i) => pL + (i / Math.max(N - 1, 1)) * w;
    const py = (v) => pT + h - (v / 5) * h;
    let s = `<svg viewBox="0 0 ${W} ${H}" style="width:100%">`;
    [1, 2, 3, 4, 5].forEach((v) => {
      const y = py(v).toFixed(1);
      s += `<line x1="${pL}" y1="${y}" x2="${W - pR}" y2="${y}" stroke="var(--border)" stroke-width="1"/>`;
      s += `<text x="${pL - 3}" y="${(py(v) + 3).toFixed(1)}" text-anchor="end" font-size="8" fill="var(--text-dim)">${v}</text>`;
    });
    days.forEach((ds, i) => {
      if (i === 0 || i === N - 1 || (N <= 30 && i % 7 === 0) || (N > 30 && i % 14 === 0)) {
        const d = new Date(`${ds}T00:00:00`);
        s += `<text x="${px(i).toFixed(1)}" y="${H - 5}" text-anchor="middle" font-size="8" fill="var(--text-dim)">${d.getMonth() + 1}/${d.getDate()}</text>`;
      }
    });
    cats.forEach((cat, ci) => {
      const color = ROUTINE_CAT_PALETTE[ci % ROUTINE_CAT_PALETTE.length];
      const vals = catData[cat.id];
      let path = "";
      vals.forEach((v, i) => {
        if (v > 0) {
          const x = px(i).toFixed(1);
          const y = py(v).toFixed(1);
          path += path === "" || vals[i - 1] === 0 ? `M${x},${y}` : `L${x},${y}`;
        }
      });
      if (path) s += `<path d="${path}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`;
      vals.forEach((v, i) => {
        if (v > 0) s += `<circle cx="${px(i).toFixed(1)}" cy="${py(v).toFixed(1)}" r="2.5" fill="${color}"/>`;
      });
    });
    s += "</svg>";
    const legend = `<div class="routine-chart-legend">${cats
      .map((c, ci) => `<span class="routine-legend-item"><span class="routine-legend-dot" style="background:${ROUTINE_CAT_PALETTE[ci % ROUTINE_CAT_PALETTE.length]}"></span>${escapeHtml(c.text)}</span>`)
      .join("")}</div>`;
    return s + legend;
  }

  // 5. 曜日別パフォーマンス
  function drawDow() {
    const buckets = Array(7).fill(0).map(() => []);
    days.forEach((ds, di) => {
      const dow = new Date(`${ds}T00:00:00`).getDay();
      cats.forEach((c) => { const v = catData[c.id][di]; if (v > 0) buckets[dow].push(v); });
    });
    const avgs = buckets.map((b) => (b.length ? b.reduce((a, x) => a + x, 0) / b.length : 0));
    const W = 294;
    const H = 120;
    const pL = 6;
    const pT = 14;
    const pB = 20;
    const slotW = (W - pL - 6) / 7;
    const barW = slotW * 0.6;
    const chartH = H - pT - pB;
    let s = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:360px">`;
    avgs.forEach((avg, i) => {
      const barH = (avg / 5) * chartH;
      const x = pL + i * slotW + (slotW - barW) / 2;
      const y = pT + chartH - barH;
      const lv = Math.round(avg);
      const color = avg > 0 ? ROUTINE_PROG_COLORS[Math.max(1, lv)] : "var(--bg-subtle)";
      s += `<rect x="${x.toFixed(1)}" y="${(avg > 0 ? y : pT + chartH - 2).toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.max(barH, 2).toFixed(1)}" rx="4" fill="${color}"/>`;
      if (avg > 0) s += `<text x="${(x + barW / 2).toFixed(1)}" y="${(y - 3).toFixed(1)}" text-anchor="middle" font-size="9" fill="var(--text-dim)" font-weight="700">${avg.toFixed(1)}</text>`;
      s += `<text x="${(x + barW / 2).toFixed(1)}" y="${H - 4}" text-anchor="middle" font-size="9" fill="var(--text-dim)">${escapeHtml(weekdayShortLabel(i))}</text>`;
    });
    s += "</svg>";
    return `<div class="routine-chart-center">${s}</div>`;
  }

  // 6. ストリーク
  function drawStreaks() {
    let h = '<div class="routine-streak-grid">';
    cats.forEach((cat, ci) => {
      const color = ROUTINE_CAT_PALETTE[ci % ROUTINE_CAT_PALETTE.length];
      const vals = catData[cat.id];
      let cur = 0;
      for (let i = vals.length - 1; i >= 0; i--) { if (vals[i] > 0) cur++; else break; }
      let best = 0;
      let run = 0;
      vals.forEach((v) => { if (v > 0) { run++; best = Math.max(best, run); } else run = 0; });
      const total = vals.filter((v) => v > 0).length;
      const pct = vals.length ? Math.round((total / vals.length) * 100) : 0;
      h += `<div class="routine-streak-card">
        <div class="routine-streak-cat" style="color:${color}">${escapeHtml(cat.text)}</div>
        <div class="routine-streak-nums">
          <div class="routine-streak-item"><div class="routine-streak-val" style="color:${color}">${cur}</div><div class="routine-streak-label">${escapeHtml(t("Streak"))}</div></div>
          <div class="routine-streak-item"><div class="routine-streak-val">${best}</div><div class="routine-streak-label">${escapeHtml(t("Best"))}</div></div>
          <div class="routine-streak-item"><div class="routine-streak-val">${total}</div><div class="routine-streak-label">${escapeHtml(t("Days done"))}</div></div>
          <div class="routine-streak-item"><div class="routine-streak-val">${pct}%</div><div class="routine-streak-label">${escapeHtml(t("Rate"))}</div></div>
        </div>
        <div class="routine-streak-bar-bg"><div class="routine-streak-bar-fill" style="width:${pct}%;background:${color}"></div></div>
      </div>`;
    });
    return `${h}</div>`;
  }

  // 7. 段階別の分布
  function drawDist() {
    let h = '<div class="routine-dist-list">';
    cats.forEach((cat, ci) => {
      const color = ROUTINE_CAT_PALETTE[ci % ROUTINE_CAT_PALETTE.length];
      const vals = catData[cat.id].filter((v) => v > 0);
      if (!vals.length) return;
      const counts = [0, 0, 0, 0, 0, 0];
      vals.forEach((v) => counts[v]++);
      h += `<div class="routine-dist-row"><div class="routine-dist-cat" style="color:${color}">${escapeHtml(cat.text)}</div><div class="routine-dist-bar">`;
      [1, 2, 3, 4, 5].forEach((lv) => {
        if (!counts[lv]) return;
        const pct = ((counts[lv] / vals.length) * 100).toFixed(1);
        const border = lv === 2 ? "border-right:1px solid var(--border);" : "";
        h += `<div class="routine-dist-seg" style="width:${pct}%;background:${ROUTINE_PROG_COLORS[lv]};${border}" title="${escapeHtml(routineProgLabel(lv))}: ${counts[lv]} (${pct}%)"></div>`;
      });
      h += `</div><div class="routine-dist-total">${vals.length}</div></div>`;
    });
    return `${h}</div>`;
  }

  container.innerHTML =
    summaryHtml +
    section(t("Activity Heatmap"), hm) +
    section(t("Category Balance"), `<div class="routine-chart-center">${drawRadar()}</div>`) +
    section(t("Progress Trend"), drawLine()) +
    section(t("Best Day of Week"), drawDow()) +
    section(t("Streaks & Completion"), drawStreaks()) +
    section(t("Level Distribution"), drawDist());
}

/* ---- 配線 ---- */
function initRoutineTracker() {
  document.getElementById("routineTabHistory").addEventListener("click", () => showRoutineView("history"));
  document.getElementById("routineTabDiary").addEventListener("click", () => showRoutineView("diary"));

  document.getElementById("routineTodayPrevBtn").addEventListener("click", () => shiftRoutineTodayDate(-1));
  document.getElementById("routineTodayNextBtn").addEventListener("click", () => shiftRoutineTodayDate(1));
  document.getElementById("routineHistoryPrevBtn").addEventListener("click", () => shiftRoutineHistoryMonth(-1));
  document.getElementById("routineHistoryNextBtn").addEventListener("click", () => shiftRoutineHistoryMonth(1));
  document.getElementById("routineDiaryPrevBtn").addEventListener("click", () => shiftRoutineDiaryDate(-1));
  document.getElementById("routineDiaryNextBtn").addEventListener("click", () => shiftRoutineDiaryDate(1));

  document.getElementById("routineDiarySaveBtn").addEventListener("click", saveRoutineDiaryFromInput);

  document.querySelectorAll(".routine-range-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      routineStatsRange = Number(btn.dataset.range);
      document.querySelectorAll(".routine-range-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
      renderRoutineStats();
    });
  });

  document.getElementById("closeRoutineMemo").addEventListener("click", closeRoutineMemo);
  document.getElementById("routineMemoCancelBtn").addEventListener("click", closeRoutineMemo);
  document.getElementById("routineMemoSaveBtn").addEventListener("click", saveRoutineMemoFromModal);

  refreshRoutineTrackerViews();
}

/* ==========================================================================
   片付いたものを、名前で振り返る
   数字は積み上がっても像を結ばない。二週間に片付けたものを固有名詞で並べて、
   週に一度だけ見せる。毎日出すと風景になるので、間隔はわざと空けている。
   ========================================================================== */
const LOOKBACK_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;
const LOOKBACK_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;
const LOOKBACK_TREND_WEEKS = 6;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// 本棚で済にしたものと、頑張りたいことを実際にやった記録。どちらも「片付いた」ものとして
// 同じ列に並べる（片方だけ見せると、やった実感が半分になってしまう）。
function finishedSince(since) {
  const books = wrReadShelf()
    .books.filter((b) => b.done && b.doneAt && b.doneAt >= since)
    .map((b) => ({ title: b.title, at: b.doneAt, kind: "book", minutes: b.minutes || 0 }));
  const done = getAspirationLog()
    .filter((e) => e.at >= since)
    .map((e) => ({ title: e.text, at: e.at, kind: "aspiration" }));
  return [...books, ...done].sort((a, b) => b.at - a.at);
}

function recentlyFinished() {
  return finishedSince(Date.now() - LOOKBACK_WINDOW_MS);
}

// 直近6週を週ごとに数える。伸びているか落ちているかは、合計だけでは見えない。
function finishedByWeek() {
  const now = Date.now();
  const all = finishedSince(now - LOOKBACK_TREND_WEEKS * WEEK_MS);
  const buckets = new Array(LOOKBACK_TREND_WEEKS).fill(0);
  all.forEach((item) => {
    const weeksAgo = Math.floor((now - item.at) / WEEK_MS);
    if (weeksAgo >= 0 && weeksAgo < LOOKBACK_TREND_WEEKS) buckets[LOOKBACK_TREND_WEEKS - 1 - weeksAgo]++;
  });
  return buckets;
}

function isLookBackDue() {
  const last = loadJSON(STORAGE_KEYS.lastLookBackAt, 0) || 0;
  if (Date.now() - last < LOOKBACK_INTERVAL_MS) return false;
  return recentlyFinished().length > 0;
}

// 週に一度ひとりでに出るほか、待合室の「片付いた」を押しても開ける。
let lookBackForced = false;

function renderLookBack() {
  const card = document.getElementById("wrLookBack");
  if (!card) return;
  const items = recentlyFinished();
  const show = lookBackForced ? items.length > 0 : isLookBackDue();
  card.hidden = !show;
  if (!show) return;

  const fromShelf = items.filter((i) => i.kind === "book").length;
  const fromAspirations = items.length - fromShelf;
  // 選んだものにどれだけ時間を張ったかを合計する。「本棚は独房」ではなく
  // 「これだけ投資して、これだけ受け取った」という収支として見せるため。
  const investedMin = items.reduce((sum, i) => sum + (i.minutes || 0), 0);

  document.getElementById("wrLookBackLead").textContent = investedMin
    ? tf("You finished {count} things these last two weeks — about {minutes} of your own choosing.", {
        count: items.length,
        minutes: formatDurationLabel(investedMin),
      })
    : tf("You finished {count} things these last two weeks.", { count: items.length });

  const breakdown = document.getElementById("wrLookBackBreakdown");
  const parts = [];
  if (fromShelf) parts.push(tf("{count} from your shelf", { count: fromShelf }));
  if (fromAspirations) parts.push(tf("{count} you set out to do", { count: fromAspirations }));
  breakdown.textContent = parts.join(" · ");
  breakdown.hidden = parts.length === 0;

  // 週ごとの棒。数が少ないうちは意味を持たないので、記録が2週以上あるときだけ出す。
  const weeks = finishedByWeek();
  const trend = document.getElementById("wrLookBackTrend");
  const activeWeeks = weeks.filter((n) => n > 0).length;
  trend.hidden = activeWeeks < 2;
  if (!trend.hidden) {
    const peak = Math.max(...weeks, 1);
    trend.innerHTML = "";
    weeks.forEach((n, i) => {
      const col = document.createElement("div");
      col.className = "lookback-bar";
      const fill = document.createElement("div");
      fill.className = "lookback-bar-fill";
      fill.style.height = `${Math.round((n / peak) * 100)}%`;
      const weeksAgo = LOOKBACK_TREND_WEEKS - 1 - i;
      col.title = weeksAgo === 0 ? tf("This week: {count}", { count: n }) : tf("{weeks} weeks ago: {count}", { weeks: weeksAgo, count: n });
      col.appendChild(fill);
      trend.appendChild(col);
    });
  }

  const list = document.getElementById("wrLookBackList");
  list.innerHTML = "";
  items.slice(0, 8).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.title;
    if (item.kind === "aspiration") li.classList.add("is-aspiration");
    list.appendChild(li);
  });
}


function dismissLookBack() {
  lookBackForced = false;
  saveJSON(STORAGE_KEYS.lastLookBackAt, Date.now());
  renderLookBack();
}

/* ==========================================================================
   「もし〜なら、〜する」（実行意図）
   理由を書かせるのは、後から自分を正当化する材料にもなりうる。
   代わりに、落ち着いているうちに条件と行動を先に決めておき、
   まさにその場面（開こうとして止められた瞬間）にそのまま読み返す。
   ========================================================================== */
function getIfThenRules() {
  const list = loadJSON(STORAGE_KEYS.ifThenRules, []);
  return Array.isArray(list) ? list.filter((r) => r && r.trigger && r.action) : [];
}
function saveIfThenRules(list) {
  saveJSON(STORAGE_KEYS.ifThenRules, list);
}

function renderIfThenList() {
  const list = document.getElementById("ifThenList");
  if (!list) return;
  const rules = getIfThenRules();
  list.innerHTML = "";
  rules.forEach((r, idx) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = tf("If {trigger}, then {action}", { trigger: r.trigger, action: r.action });
    li.appendChild(span);

    const btn = document.createElement("button");
    btn.className = "remove-btn";
    btn.type = "button";
    btn.textContent = "×";
    btn.setAttribute("aria-label", t("Remove this rule"));
    btn.addEventListener("click", () => {
      const updated = getIfThenRules();
      updated.splice(idx, 1);
      saveIfThenRules(updated);
      renderIfThenList();
    });
    li.appendChild(btn);
    list.appendChild(li);
  });
  document.getElementById("ifThenEmpty").hidden = rules.length > 0;
}

// 止められた画面で1つだけ見せる。順に回して、同じものばかりにしない。
let ifThenCursor = 0;
function nextIfThenRule() {
  const rules = getIfThenRules();
  if (!rules.length) return null;
  const rule = rules[ifThenCursor % rules.length];
  ifThenCursor++;
  return rule;
}

/* ==========================================================================
   強制の休憩
   自分から「ひと息つく」を押すのを待たず、一定の時間が経つか一定の回数
   スクロールしたら、どの画面を見ていても本棚に貯めたものの中から一つを
   差し出す。休憩を「思い出したらするもの」から「向こうから来るもの」へ
   変えるのが狙い。
   待合室のような全画面モーダルではなく、音を出さないアラームのように
   画面の外に押し出さないバナーで知らせる（振動には対応端末で応じる）。
   操作をブロックしないので、押し付けがましくなく、他の画面の作業はそのまま続けられる。
   数えているのは実際にこのアプリを見ていた時間だけ（隠れている間は止める）。
   ========================================================================== */
const BREAK_DEFAULT_MIN = 30;
const BREAK_SNOOZE_MIN = 5;

function isBreakEnabled() {
  return loadJSON(STORAGE_KEYS.breakEnabled, true);
}
function saveBreakEnabled(v) {
  saveJSON(STORAGE_KEYS.breakEnabled, v);
}

function getBreakIntervalMin() {
  const v = Number(loadJSON(STORAGE_KEYS.breakIntervalMin, BREAK_DEFAULT_MIN));
  return Number.isFinite(v) && v > 0 ? v : BREAK_DEFAULT_MIN;
}
function saveBreakIntervalMin(v) {
  saveJSON(STORAGE_KEYS.breakIntervalMin, Math.max(1, Math.round(Number(v) || BREAK_DEFAULT_MIN)));
}

// 0 なら回数では割り込まない（時間だけで見る）。
function getBreakScrollCount() {
  const v = Number(loadJSON(STORAGE_KEYS.breakScrollCount, 0));
  return Number.isFinite(v) && v >= 0 ? Math.round(v) : 0;
}
function saveBreakScrollCount(v) {
  saveJSON(STORAGE_KEYS.breakScrollCount, Math.max(0, Math.round(Number(v) || 0)));
}

function getBreakState() {
  const s = loadJSON(STORAGE_KEYS.breakState, null);
  if (s && typeof s === "object") {
    return {
      activeMs: Number(s.activeMs) || 0,
      scrolls: Number(s.scrolls) || 0,
      pickTurn: Number(s.pickTurn) || 0,
    };
  }
  return { activeMs: 0, scrolls: 0, pickTurn: 0 };
}
function saveBreakState(s) {
  saveJSON(STORAGE_KEYS.breakState, s);
}
// 数え直しても「次は何を出すか」の順番は持ち越す（毎回同じ提案にしないため）。
function resetBreakCounters() {
  saveBreakState({ activeMs: 0, scrolls: 0, pickTurn: getBreakState().pickTurn });
}

let breakTicker = null;
let breakLastTickAt = null;
let breakSuggestion = null;

// 画面を見ていない間は数えない。放っておいただけで休憩を勧められても意味がない。
function breakTick() {
  if (!isBreakEnabled()) return;
  const now = Date.now();
  const since = breakLastTickAt ? now - breakLastTickAt : 0;
  breakLastTickAt = now;
  if (document.hidden || since <= 0 || since > 60000) return;
  if (isAnyBreakBlocker()) return;

  const state = getBreakState();
  state.activeMs += since;
  saveBreakState(state);

  if (state.activeMs >= getBreakIntervalMin() * 60000) openBreakModal("time");
}

function noteBreakScroll() {
  if (!isBreakEnabled()) return;
  const limit = getBreakScrollCount();
  if (limit <= 0) return;
  const state = getBreakState();
  state.scrolls += 1;
  saveBreakState(state);
  if (state.scrolls >= limit) openBreakModal("scroll");
}

// 割り込んで困る場面では待つ（既に割り込んでいる／ロック中）。
function isAnyBreakBlocker() {
  if (!document.getElementById("breakModal").hidden) return true;
  if (!document.getElementById("appLockScreen").hidden) return true;
  if (!document.getElementById("onboardingScreen").hidden) return true;
  if (!document.getElementById("firstRunModal").hidden) return true;
  return false;
}

// 何を差し出すかを決める。4回に2回は「頑張りたいこと」、1回は本棚、1回は辞書のうんちく。
// 本棚に入っているのは「見たかったのを先送りしたもの」なので、それだけを
// 勧め続けると、気散じを別の気散じに替えているだけになってしまう。辞書の言葉は
// 自分が既に「面白い」と思って拾ったものなので、無限スクロールの「次は何が来るか
// 分からない」報酬に、質の違う面白さで対抗させる狙い。
function wrPickBreakSuggestion() {
  const turn = Number(getBreakState().pickTurn) || 0;
  const aspirations = aspirationsForNow();
  const books = wrRecommendableBooks();
  const dictEntries = getDictEntries();
  const slot = turn % 4;

  if (slot === 3 && dictEntries.length) return wrPickDictTrivia(dictEntries, turn);
  if (slot === 2 && books.length) return { kind: "book", book: books[0] };
  if (aspirations.length) {
    // 同じ候補が続くと「もう手を付けた気」になってしまうので、順番ではなくくじ引きにする。
    const a = aspirations[Math.floor(Math.random() * aspirations.length)];
    return { kind: "aspiration", id: a.id, text: a.text, meta: aspirationMeta(a) };
  }
  // 頑張りたいことが未登録なら、本棚、それも無ければ辞書、最後に内蔵の小さな行動。
  if (books.length) return { kind: "book", book: books[0] };
  if (dictEntries.length) return wrPickDictTrivia(dictEntries, turn);
  return { kind: "card", text: t(WR_CARDS[turn % WR_CARDS.length]) };
}

function wrPickDictTrivia(entries, turn) {
  const entry = entries[turn % entries.length];
  return { kind: "dict", id: entry.id, word: entry.word, note: entry.note, url: entry.url };
}

function renderBreakPick() {
  breakSuggestion = wrPickBreakSuggestion();
  const isBook = breakSuggestion.kind === "book";
  const isDict = breakSuggestion.kind === "dict";

  const label = document.getElementById("breakPickLabel");
  const title = document.getElementById("breakPickTitle");
  const meta = document.getElementById("breakPickMeta");
  const card = document.getElementById("breakPickCard");

  if (isBook) {
    const book = breakSuggestion.book;
    label.textContent = t("From your shelf");
    title.textContent = book.title;
    const bits = [wrPriorityLabel(book.priority)];
    // 所要時間があれば真っ先に出す。「12分で終わる」と分かるかどうかで、
    // いま手を付けるかの判断がまるで変わる。
    if (book.minutes) bits.unshift(tf("{minutes} min", { minutes: book.minutes }));
    if (book.url) bits.push(book.url);
    else if (book.fileName) bits.push(book.fileName);
    meta.textContent = bits.join(" · ");
  } else if (isDict) {
    // 自分の辞書から拾った言葉を「うんちく」として出す。既に興味を持って
    // 拾った言葉なので、無限スクロールの新規性報酬に質で対抗できる数少ない材料。
    label.textContent = t("A word from your dictionary");
    title.textContent = breakSuggestion.word;
    meta.textContent = breakSuggestion.note || "";
  } else {
    label.textContent =
      breakSuggestion.kind === "aspiration" ? t("How about this now?") : t("Away from the screen");
    title.textContent = breakSuggestion.text;
    meta.textContent = breakSuggestion.meta || "";
  }

  if (card) card.classList.toggle("is-dict", isDict);
  document.getElementById("breakOpenBtn").hidden = !(isBook || (isDict && breakSuggestion.url));
  document.getElementById("breakDoneBtn").textContent = isBook
    ? t("Mark done")
    : isDict
    ? t("Nice to know")
    : t("Did it");
  // 何も登録が無いときだけ、置き場所があることを伝える
  document.getElementById("breakEmptyNote").hidden =
    getAspirations().length > 0 || wrRecommendableBooks().length > 0 || getDictEntries().length > 0;
}

// 「そっと一つ提案」の見出しだけでなく、中身そのものを通知本文に乗せる。
// 無限スクロールの新規性報酬に対抗するには、開かないと分からない状態より、
// 通知を見ただけで一つ頭に入る状態の方が強い。
function wrNotificationBodyFor(suggestion) {
  if (!suggestion) return t("There's something you said you wanted to do.");
  if (suggestion.kind === "book") {
    const book = suggestion.book;
    const bits = [book.title];
    if (book.minutes) bits.push(tf("{minutes} min", { minutes: book.minutes }));
    return bits.join(" · ");
  }
  if (suggestion.kind === "dict") {
    return suggestion.note ? `${suggestion.word} — ${suggestion.note}` : suggestion.word;
  }
  if (suggestion.kind === "aspiration") return suggestion.text;
  return suggestion.text; // 内蔵の小さな行動カード
}

function openBreakModal(reason) {
  const state = getBreakState();
  let line;
  if (reason === "idle") line = t("You opened this without anything particular in mind.");
  else if (reason === "scroll") line = tf("You've scrolled {count} times since your last break.", { count: state.scrolls });
  else line = tf("You've been at this for {minutes} minutes.", { minutes: Math.round(state.activeMs / 60000) });
  document.getElementById("breakReason").textContent = line;
  renderBreakPick();
  // 次に出すものを変えるため、提案を1つ進めておく。
  saveBreakState({ ...state, pickTurn: (Number(state.pickTurn) || 0) + 1 });
  document.getElementById("breakModal").hidden = false;
  // 音は出さない。対応端末なら振動だけで気づけるようにする（サイレントアラーム）。
  if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
  showNotification("scrollAlmostUp", t("Time for a break"), wrNotificationBodyFor(breakSuggestion));
}

function closeBreakModal({ snooze } = {}) {
  document.getElementById("breakModal").hidden = true;
  breakSuggestion = null;
  const turn = getBreakState().pickTurn;
  if (snooze) {
    // すぐに出し直さないよう、少しだけ戻して数え直す
    const interval = getBreakIntervalMin() * 60000;
    saveBreakState({ activeMs: Math.max(0, interval - BREAK_SNOOZE_MIN * 60000), scrolls: 0, pickTurn: turn });
  } else {
    resetBreakCounters();
  }
  breakLastTickAt = Date.now();
}

function initForcedBreak() {
  breakLastTickAt = Date.now();
  clearInterval(breakTicker);
  breakTicker = setInterval(breakTick, 5000);
  // 頭を冷やす時間が明けた変更を、開いている間も取りこぼさず反映する。
  flushPendingChanges();
  setInterval(flushPendingChanges, 60000);

  document.addEventListener("visibilitychange", () => {
    // 戻ってきた瞬間に、離れていた分をまとめて足さない
    breakLastTickAt = Date.now();
  });

  document.getElementById("breakSnoozeBtn").addEventListener("click", () => closeBreakModal({ snooze: true }));

  document.getElementById("breakOpenBtn").addEventListener("click", () => {
    const suggestion = breakSuggestion;
    closeBreakModal();
    if (!suggestion) return;
    if (suggestion.kind === "dict") {
      if (suggestion.url) openTab(suggestion.url);
      return;
    }
    if (suggestion.kind !== "book") return;
    const book = suggestion.book;
    if (book.fileId && wrHasBox) {
      FileBox.load(book.fileId)
        .then((rec) => {
          if (!rec) {
            showToast(t("That file is no longer on this device"));
            return;
          }
          if (!FileBox.openFile(rec)) FileBox.downloadFile(rec);
        })
        .catch(() => showToast(t("That file is no longer on this device")));
      return;
    }
    if (book.url) openTab(book.url);
  });

  // 本棚のものは「済」に、頑張りたいことは「やった」の記録に。
  document.getElementById("breakDoneBtn").addEventListener("click", () => {
    const suggestion = breakSuggestion;
    if (!suggestion) return;
    if (suggestion.kind === "book") {
      wrUpdateBook(suggestion.book.id, { done: true, doneAt: Date.now() });
      if (wrPanel === "shelf") renderShelfView();
      if (wrPanel === "wait") renderWaitingRoomHome();
      showToast(t("Marked as done"));
      renderBreakPick(); // 次の候補をその場で出す
      return;
    }
    if (suggestion.kind === "aspiration") noteAspirationDone(suggestion.id);
    closeBreakModal();
    celebrate(t("Nice."));
  });
}

/* ==========================================================================
   初期化 / イベント登録
   ========================================================================== */

function init() {
  // 画面を組み立てる前に言語を確定させ、以降 t() が正しい訳を返せるようにする。
  applyLanguage(getLanguage());
  logEvent("app_opened");
  migrateBookshelfToDictionary();
  initAppLock();
  initOnboarding();
  initFirstRunMoment();
  initBiometricSupport();
  initLanguageSetting();
  applyAppearance();
  ScrollLock.init();
  FocusTimer.init();
  initFocusTimerPanel();
  initAwaySessionTracking();
  initOverlayBrowsingPause();
  initScrollGestureTracking();
  initInstallPrompt();
  initWaitingRoom();
  initSharedShelves();
  initForcedBreak();
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
  document.getElementById("durationChips").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip) selectDurationChip(chip);
  });

  document.getElementById("cancelScrollOn").addEventListener("click", () => {
    pendingBlockedTarget = null;
    closeScrollOnModal();
  });

  function tryConfirmScrollOnByPin() {
    const picked = pickScrollOnDuration();
    if (!picked) return;
    const pinInput = document.getElementById("scrollPinInput");
    if (pinInput.value !== getPin()) {
      showToast(t("Incorrect PIN"));
      pinInput.value = "";
      pinInput.focus();
      return;
    }
    saveLastScrollDurationMinutes(picked.minutes);
    ScrollLock.turnOn(picked.durationLabel, picked.minutes);
    closeScrollOnModal();
    resumeBlockedTarget();
  }
  document.getElementById("confirmScrollOn").addEventListener("click", tryConfirmScrollOnByPin);
  // PINが4桁揃った瞬間に自動でONにする。「入力してさらにボタンを押す」を一手減らす。
  document.getElementById("scrollPinInput").addEventListener("input", (e) => {
    if (e.target.value.length === 4) tryConfirmScrollOnByPin();
  });

  document.getElementById("scrollOnBiometricBtn").addEventListener("click", async () => {
    const picked = pickScrollOnDuration();
    if (!picked) return;
    const credentialId = getBiometricScrollCredentialId();
    if (!credentialId) return;
    const videoEl = document.getElementById("scrollOnCameraPreview");
    startCameraPreviewIfEnabled(videoEl);
    try {
      await BiometricAuth.verify(credentialId);
      stopCameraPreview(videoEl);
      saveLastScrollDurationMinutes(picked.minutes);
      ScrollLock.turnOn(picked.durationLabel, picked.minutes);
      closeScrollOnModal();
      resumeBlockedTarget();
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

  document.getElementById("feedBlockedCancelBtn").addEventListener("click", closeFeedBlockedModal);

  // 断られた相手を「捨てる」か「今すぐ通す」かの二択にせず、本棚へしまえるようにする。
  document.getElementById("feedBlockedHoldBtn").addEventListener("click", () => {
    const target = pendingBlockedTarget;
    closeFeedBlockedModal();
    if (!target) return;
    wrHold({
      title: target.app ? target.app.name : target.name,
      url: target.app ? target.app.web : target.url,
    });
  });
  document.getElementById("feedBlockedScrollOnBtn").addEventListener("click", () => {
    hideFeedBlockedModal();
    openScrollOnModal();
  });

  document.getElementById("breakLockCloseBtn").addEventListener("click", closeBreakLockModal);
  document.getElementById("breakLockEndBtn").addEventListener("click", () => {
    closeBreakLockModal();
    wrEndSelfBreakEarly();
  });

  initTipsPanel();

  wireAspirationAddForm({
    btn: "addAspirationBtn",
    input: "newAspirationInput",
    when: "newAspirationWhen",
    dayRow: "newAspirationDayRow",
    minutes: "newAspirationMinutes",
    until: "newAspirationUntil",
  });
  wireAspirationAddForm({
    btn: "wrAddAspirationBtn",
    input: "wrNewAspirationInput",
    when: "wrNewAspirationWhen",
    dayRow: "wrNewAspirationDayRow",
    minutes: "wrNewAspirationMinutes",
    until: "wrNewAspirationUntil",
    collapse: { toggleBtn: "wrAddAspirationToggleBtn", form: "wrAspirationForm" },
  });
  renderDayToggleRows();

  document.getElementById("wrLookBackDismissBtn").addEventListener("click", dismissLookBack);

  document.getElementById("addIfThenBtn").addEventListener("click", () => {
    const triggerInput = document.getElementById("newIfThenTrigger");
    const actionInput = document.getElementById("newIfThenAction");
    const trigger = triggerInput.value.trim();
    const action = actionInput.value.trim();
    if (!trigger || !action) return;
    const rules = getIfThenRules();
    rules.push({ trigger, action });
    saveIfThenRules(rules);
    triggerInput.value = "";
    actionInput.value = "";
    renderIfThenList();
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

  document.getElementById("iconSizeSelect").addEventListener("change", (e) => {
    const appearance = getAppearance();
    appearance.iconSize = e.target.value;
    saveAppearance(appearance);
    applyAppearance();
  });

  document.getElementById("iconShapeSelect").addEventListener("change", (e) => {
    const appearance = getAppearance();
    appearance.iconShape = e.target.value;
    saveAppearance(appearance);
    applyAppearance();
  });

  document.getElementById("showLabelsToggle").addEventListener("change", (e) => {
    const appearance = getAppearance();
    appearance.showLabels = e.target.checked;
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
    if (!e.target.matches('input[type="checkbox"]')) return;
    const id = e.target.value;
    if (e.target.checked) {
      if (!pendingAppOrder.includes(id)) pendingAppOrder.push(id);
    } else {
      pendingAppOrder = pendingAppOrder.filter((oid) => oid !== id);
    }
    updateAppPickerDisabledState();
    renderAppOrderList();
  });
  document.getElementById("addCustomAppBtn").addEventListener("click", () => {
    const nameInput = document.getElementById("customAppNameInput");
    const urlInput = document.getElementById("customAppUrlInput");
    const name = nameInput.value.trim();
    const rawUrl = urlInput.value.trim();
    if (!name || !rawUrl) {
      showToast(t("Enter a name and a website address"));
      return;
    }
    if (!looksLikeUrl(rawUrl)) {
      showToast(t("Enter a valid website address"));
      return;
    }
    const app = addCustomApp(name, normalizeUrl(rawUrl));
    nameInput.value = "";
    urlInput.value = "";
    if (pendingAppOrder.length < 10) pendingAppOrder.push(app.id);
    renderAppPickerList();
    renderAppOrderList();
    showToast(tf("Added {app}", { app: app.name }));
  });
  document.getElementById("saveAppPicker").addEventListener("click", () => {
    saveJSON(STORAGE_KEYS.selectedApps, pendingAppOrder.slice(0, 10));
    renderDock();
    closeAppPicker();
  });

  document.getElementById("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("searchInput").value.trim();
    if (!input) return;
    openTab(input);
  });

  document.getElementById("closeSearchResults").addEventListener("click", closeSearchResultsModal);
  document.getElementById("searchResultsPrevBtn").addEventListener("click", () => {
    if (searchResultsPage > 0) {
      searchResultsPage--;
      renderSearchResults();
    }
  });
  document.getElementById("searchResultsNextBtn").addEventListener("click", () => {
    if (!document.getElementById("searchResultsNextBtn").disabled) {
      searchResultsPage++;
      renderSearchResults();
    }
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

  document.getElementById("saveWordBtn").addEventListener("click", () => {
    const activeTab = getBrowserTabs().find((tb) => tb.id === getActiveTabId());
    if (!activeTab) return;
    if (isWordSaved(activeTab.url)) {
      removeDictEntryByUrl(activeTab.url);
      showToast(t("Removed from your dictionary"));
    } else {
      // 検索して開いたタブなら、調べた言葉そのものを見出し語にする。
      const result = addDictEntry({
        word: activeTab.query || activeTab.title,
        url: activeTab.url,
        group: 0,
      });
      if (result.ok) celebrate(t("Added to your dictionary"));
      else showToast(result.message);
    }
    updateSaveWordButtonState(activeTab.url);
  });

  document.getElementById("dictionaryBtn").addEventListener("click", openDictionaryModal);
  document.getElementById("closeDictionary").addEventListener("click", closeDictionaryModal);

  document.getElementById("dictSearchInput").addEventListener("input", (e) => {
    dictQuery = e.target.value;
    renderDictList();
  });
  document.getElementById("dictGroupFilter").addEventListener("change", (e) => {
    dictGroupFilter = e.target.value;
    renderDictList();
  });
  document.getElementById("dictSortSelect").addEventListener("change", (e) => {
    saveDictSort(e.target.value);
    renderDictList();
  });
  document.getElementById("dictManageGroupsBtn").addEventListener("click", openDictGroups);

  document.getElementById("dictAddWordBtn").addEventListener("click", openDictAddForm);
  document.getElementById("dictAddCancelBtn").addEventListener("click", closeDictAddForm);
  document.getElementById("dictAddSaveBtn").addEventListener("click", submitDictAddForm);

  document.getElementById("dictImportToggleBtn").addEventListener("click", openDictImportForm);
  document.getElementById("dictImportCancelBtn").addEventListener("click", closeDictImportForm);
  document.getElementById("dictImportConfirmBtn").addEventListener("click", submitDictImportForm);
  document.getElementById("dictImportFilePick").addEventListener("change", (e) => {
    handleDictImportFile(e.target.files && e.target.files[0]);
  });
  document.getElementById("dictImportSheetFetchBtn").addEventListener("click", () => {
    handleDictImportSheetUrl(document.getElementById("dictImportSheetUrl").value);
  });

  document.getElementById("dictDetailBackBtn").addEventListener("click", closeDictDetail);
  document.getElementById("dictOpenBtn").addEventListener("click", openDictSelected);
  document.getElementById("dictDeleteBtn").addEventListener("click", deleteDictSelected);
  document.getElementById("dictEditToggleBtn").addEventListener("click", () => {
    dictEditOpen = !dictEditOpen;
    renderDictDetail();
  });
  document.getElementById("dictEditSaveBtn").addEventListener("click", saveDictEdits);

  document.getElementById("dictGroupsBackBtn").addEventListener("click", closeDictGroups);
  document.getElementById("dictGroupsSelect").addEventListener("change", (e) => {
    dictGroupsEditIndex = Number(e.target.value) || 0;
    renderDictGroupsView();
  });
  document.getElementById("dictGroupRenameBtn").addEventListener("click", renameDictGroup);
  document.getElementById("dictGroupDeleteBtn").addEventListener("click", deleteDictGroup);
  document.getElementById("dictAddGroupBtn").addEventListener("click", addDictGroup);

  document.getElementById("insightsBtn").addEventListener("click", openInsightsModal);
  document.getElementById("closeInsights").addEventListener("click", closeInsightsModal);

  document.getElementById("browsingCheckinSearchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("browsingCheckinSearchInput").value.trim();
    if (!input) return;
    closeBrowsingCheckinModal();
    openTab(input);
  });
  document.getElementById("browsingCheckinDismissBtn").addEventListener("click", closeBrowsingCheckinModal);

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
