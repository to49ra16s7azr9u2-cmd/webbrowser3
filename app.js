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
  appearance: "myhome:appearance",
  pin: "myhome:pin",
  dockCollapsed: "myhome:dockCollapsed",
  appLockEnabled: "myhome:appLockEnabled",
  appLockPin: "myhome:appLockPin",
  appLockQuestion: "myhome:appLockQuestion",
  appLockAnswer: "myhome:appLockAnswer",
  onboardingComplete: "myhome:onboardingComplete",
  interests: "myhome:interests",
  interestsText: "myhome:interestsText",
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
};

const DEFAULT_APPEARANCE = { accent: "#65a30d", bg: "#ffffff", bgImage: null };
const DEFAULT_PIN = "0000";
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

// 対応国は当面この3か国のみ（今後のニュースAPI連携を難しくしすぎないための制限）。
const COUNTRIES = [
  { code: "jp", name: "Japan" },
  { code: "mx", name: "Mexico" },
  { code: "us", name: "United States" },
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
    "You don't need to do anything — just open the app and read. Posts show up on their own.": "Você não precisa fazer nada — é só abrir o app e ler. As publicações aparecem sozinhas.",
    "Scroll is OFF by default to limit distraction. Turn it ON with a reason, a time limit, and your PIN only when you really need to scroll freely.": "A rolagem vem desativada por padrão para reduzir distrações. Ative-a com um motivo, um limite de tempo e seu PIN só quando realmente precisar rolar livremente.",
    "Search the web": "Pesquisar na web",
    "Search": "Pesquisar",
    "All": "Tudo",
    "Videos": "Vídeos",
    "Images": "Imagens",
    "Maps": "Mapas",
    "Shopping": "Compras",
    "Prev": "Anterior",
    "Next": "Próximo",
    "Close search results": "Fechar resultados da pesquisa",
    "Result type": "Tipo de resultado",
    "Your Interests": "Seus interesses",
    "Outside Your Bubble": "Fora da sua bolha",
    "Top News": "Principais notícias",
    "Insights": "Estatísticas",
    "Read": "Ler",
    "Watch": "Assistir",
    "Choose content category": "Escolher categoria de conteúdo",
    "Read or watch": "Ler ou assistir",
    "All time": "Desde o início",
    "Hour": "Hora",
    "Day": "Dia",
    "Month": "Mês",
    "Year": "Ano",
    "Now": "Agora",
    "Time spent per app": "Tempo gasto por app",
    "Scroll": "Rolagem",
    "See details": "Ver detalhes",
    "View detailed insights": "Ver estatísticas detalhadas",
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
    "This sets the language for the next step, where you'll write about your interests.": "Isso define o idioma de todo o app, inclusive da próxima etapa, em que você escreverá sobre seus interesses.",
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
    "Scroll turned ON {count} time": "Rolagem ativada {count} vez",
    "Scroll turned ON {count} times": "Rolagem ativada {count} vezes",
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
    "Results for \"{query}\"": "Resultados de “{query}”",
    "{hours}h": "{hours} h",
    "{minutes}m": "{minutes} min",
    "{seconds}s": "{seconds} s",
    "{minutes}m {seconds}s": "{minutes} min {seconds} s",
    "{query} is a broad topic covered by official sites, encyclopedia entries, and community discussion. Sources generally agree on the core facts, though specifics vary. See the results below for more detail.": "“{query}” é um tema amplo, tratado em sites oficiais, verbetes de enciclopédia e discussões da comunidade. As fontes costumam concordar no essencial, embora os detalhes variem. Veja os resultados abaixo para saber mais.",
    "Coverage tends to fall into a few groups: official pages describing {query} directly, reference entries giving background and history, retailers and comparison pages, and news items on recent developments. Community threads add first-hand opinion but vary in reliability.": "O conteúdo costuma se dividir em alguns grupos: páginas oficiais que descrevem {query} diretamente, verbetes de referência com contexto e história, lojas e páginas de comparação, e notícias sobre novidades recentes. Os tópicos da comunidade trazem opiniões em primeira mão, mas com confiabilidade variável.",
    "If you are new to {query}, start with the official site and the encyclopedia entry, then check the news results for anything that has changed recently.": "Se {query} é novidade para você, comece pelo site oficial e pelo verbete de enciclopédia e depois veja as notícias para saber o que mudou recentemente.",
    "The whole app is shown in this language.": "Todo o app é exibido neste idioma.",
    "30 min ago": "há 30 min",
    "1 hour ago": "há 1 hora",
    "2 hours ago": "há 2 horas",
    "3 hours ago": "há 3 horas",
    "4 hours ago": "há 4 horas",
    "5 hours ago": "há 5 horas",
    "6 hours ago": "há 6 horas",
    "Yesterday": "Ontem",
    "New AI chip design cuts power draw in half": "Novo design de chip de IA reduz o consumo pela metade",
    "Expected to significantly boost inference performance on mobile devices.": "A expectativa é de um grande ganho de desempenho de inferência em celulares.",
    "The 2026 UI trend is 'quiet'": "A tendência de interfaces em 2026 é o \"silêncio\"",
    "Designs that cut down on information and protect the user's focus are gaining attention.": "Designs que reduzem a informação e protegem a concentração vêm ganhando destaque.",
    "Local team extends win streak to 4 with comeback victory": "Time local vence de virada e chega à quarta vitória seguida",
    "A late substitute scored the winning goal.": "Um reserva que entrou no fim marcou o gol da vitória.",
    "Emerging market currencies mixed against the dollar": "Moedas de mercados emergentes ficam mistas ante o dólar",
    "Market watchers are focused on upcoming interest rate moves.": "Analistas estão atentos aos próximos movimentos dos juros.",
    "New deep-sea species found in Pacific trench": "Nova espécie de mar profundo é encontrada em fossa do Pacífico",
    "Researchers hope it will shed light on adaptation to extreme environments.": "Pesquisadores esperam entender melhor a adaptação a ambientes extremos.",
    "City announces accessibility renovation plan for public facilities": "Prefeitura anuncia plano de acessibilidade para prédios públicos",
    "The renovations will be carried out in phases over three years.": "As obras serão feitas por etapas ao longo de três anos.",
    "Today's top stories at a glance": "As principais notícias de hoje em um resumo",
    "A digest of the biggest topics at home and abroad.": "Um resumo dos maiores assuntos do país e do mundo.",
    "Weather agency issues outlook for next week": "Órgão meteorológico divulga previsão para a próxima semana",
    "Near-average temperatures expected across most regions.": "Temperaturas próximas da média são esperadas na maior parte das regiões.",
    "Holiday travel volume at major stations on par with past years": "Movimento de viajantes nas grandes estações segue o padrão de anos anteriores",
    "Transit operators are urging travelers to spread out peak times.": "As operadoras pedem que os viajantes distribuam os horários de pico.",
    "New": "Novo",
    "Trending": "Em alta",
    "Popular": "Popular",
    "{query} — Official Site": "{query} — Site oficial",
    "Learn more about {query} on the official site. Find the latest news, products, and support.": "Saiba mais sobre {query} no site oficial: novidades, produtos e suporte.",
    "{query} - Wikipedia": "{query} - Wikipédia",
    "{query} is covered in this encyclopedia article, including history, background, and related topics.": "Este verbete de enciclopédia trata de {query}, incluindo história, contexto e temas relacionados.",
    "Buy {query} online — best prices": "Compre {query} online — melhores preços",
    "Compare prices and shop for {query} online. Free shipping on qualifying orders.": "Compare preços e compre {query} online. Frete grátis em pedidos que atendam às condições.",
    "{query} news and updates": "Notícias e novidades sobre {query}",
    "The latest news and headlines about {query} from trusted sources around the world.": "As últimas notícias e manchetes sobre {query} de fontes confiáveis do mundo todo.",
    "What is {query}? A complete guide": "O que é {query}? Guia completo",
    "Everything you need to know about {query}, explained simply with examples.": "Tudo o que você precisa saber sobre {query}, explicado de forma simples e com exemplos.",
    "{query} reviews and ratings": "Avaliações e notas de {query}",
    "Real user reviews and ratings for {query}. See what people are saying.": "Avaliações e notas de usuários reais sobre {query}. Veja o que dizem.",
    "{query} — video {number}": "{query} — vídeo {number}",
    "{count}K views": "{count} mil visualizações",
    "{query} Store {number}": "Loja {query} {number}",
    "{query} Center {number}": "Centro {query} {number}",
    "{distance} mi": "{distance} mi",
    "{query} — Item {number}": "{query} — Item {number}",
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
    "Step 1 of 7": "Etapa 1 de 7",
    "Step 2 of 7": "Etapa 2 de 7",
    "Step 3 of 7": "Etapa 3 de 7",
    "Step 4 of 7": "Etapa 4 de 7",
    "Step 5 of 7": "Etapa 5 de 7",
    "Step 6 of 7": "Etapa 6 de 7",
    "Step 7 of 7": "Etapa 7 de 7",
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
    "You don't need to do anything — just open the app and read. Posts show up on their own.": "Du musst nichts tun – öffne die App und lies einfach. Beiträge erscheinen von selbst.",
    "Scroll is OFF by default to limit distraction. Turn it ON with a reason, a time limit, and your PIN only when you really need to scroll freely.": "Scrollen ist standardmäßig aus, um Ablenkung zu begrenzen. Schalte es nur mit einem Grund, einem Zeitlimit und deiner PIN ein, wenn du wirklich frei scrollen musst.",
    "Search the web": "Im Web suchen",
    "Search": "Suchen",
    "All": "Alle",
    "Videos": "Videos",
    "Images": "Bilder",
    "Maps": "Karten",
    "Shopping": "Shopping",
    "Prev": "Zurück",
    "Next": "Weiter",
    "Close search results": "Suchergebnisse schließen",
    "Result type": "Ergebnistyp",
    "Your Interests": "Deine Interessen",
    "Outside Your Bubble": "Außerhalb deiner Blase",
    "Top News": "Top-Nachrichten",
    "Insights": "Nutzung",
    "Read": "Lesen",
    "Watch": "Ansehen",
    "Choose content category": "Inhaltskategorie wählen",
    "Read or watch": "Lesen oder ansehen",
    "All time": "Gesamt",
    "Hour": "Stunde",
    "Day": "Tag",
    "Month": "Monat",
    "Year": "Jahr",
    "Now": "Jetzt",
    "Time spent per app": "Zeit pro App",
    "Scroll": "Scrollen",
    "See details": "Details ansehen",
    "View detailed insights": "Detaillierte Nutzung ansehen",
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
    "This sets the language for the next step, where you'll write about your interests.": "Das legt die Sprache der gesamten App fest – auch für den nächsten Schritt, in dem du deine Interessen beschreibst.",
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
    "Scroll turned ON {count} time": "Scrollen {count}× eingeschaltet",
    "Scroll turned ON {count} times": "Scrollen {count}× eingeschaltet",
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
    "Results for \"{query}\"": "Ergebnisse für „{query}“",
    "{hours}h": "{hours} Std.",
    "{minutes}m": "{minutes} Min.",
    "{seconds}s": "{seconds} Sek.",
    "{minutes}m {seconds}s": "{minutes} Min. {seconds} Sek.",
    "{query} is a broad topic covered by official sites, encyclopedia entries, and community discussion. Sources generally agree on the core facts, though specifics vary. See the results below for more detail.": "„{query}“ ist ein weites Thema, das auf offiziellen Seiten, in Enzyklopädie-Einträgen und in Community-Diskussionen behandelt wird. Bei den Kernfakten sind sich die Quellen weitgehend einig, im Detail unterscheiden sie sich. Mehr dazu in den Ergebnissen unten.",
    "Coverage tends to fall into a few groups: official pages describing {query} directly, reference entries giving background and history, retailers and comparison pages, and news items on recent developments. Community threads add first-hand opinion but vary in reliability.": "Die Inhalte lassen sich grob einteilen: offizielle Seiten, die {query} direkt beschreiben, Nachschlagewerke mit Hintergrund und Geschichte, Shops und Vergleichsseiten sowie Nachrichten zu aktuellen Entwicklungen. Community-Beiträge liefern Meinungen aus erster Hand, sind aber unterschiedlich verlässlich.",
    "If you are new to {query}, start with the official site and the encyclopedia entry, then check the news results for anything that has changed recently.": "Wenn {query} neu für dich ist, fang mit der offiziellen Seite und dem Enzyklopädie-Eintrag an und sieh dann in den Nachrichten nach, was sich zuletzt geändert hat.",
    "The whole app is shown in this language.": "Die gesamte App wird in dieser Sprache angezeigt.",
    "30 min ago": "vor 30 Min.",
    "1 hour ago": "vor 1 Stunde",
    "2 hours ago": "vor 2 Stunden",
    "3 hours ago": "vor 3 Stunden",
    "4 hours ago": "vor 4 Stunden",
    "5 hours ago": "vor 5 Stunden",
    "6 hours ago": "vor 6 Stunden",
    "Yesterday": "Gestern",
    "New AI chip design cuts power draw in half": "Neues KI-Chipdesign halbiert den Stromverbrauch",
    "Expected to significantly boost inference performance on mobile devices.": "Die Inferenzleistung auf Mobilgeräten dürfte deutlich steigen.",
    "The 2026 UI trend is 'quiet'": "Der UI-Trend 2026 heißt „leise“",
    "Designs that cut down on information and protect the user's focus are gaining attention.": "Designs, die Informationen reduzieren und die Konzentration schützen, gewinnen an Aufmerksamkeit.",
    "Local team extends win streak to 4 with comeback victory": "Lokales Team gewinnt nach Rückstand und feiert den vierten Sieg in Folge",
    "A late substitute scored the winning goal.": "Ein spät eingewechselter Spieler erzielte den Siegtreffer.",
    "Emerging market currencies mixed against the dollar": "Schwellenländerwährungen uneinheitlich gegenüber dem Dollar",
    "Market watchers are focused on upcoming interest rate moves.": "Marktbeobachter richten den Blick auf die nächsten Zinsschritte.",
    "New deep-sea species found in Pacific trench": "Neue Tiefseeart in einem Graben im Pazifik entdeckt",
    "Researchers hope it will shed light on adaptation to extreme environments.": "Forschende erhoffen sich Aufschluss über die Anpassung an extreme Lebensräume.",
    "City announces accessibility renovation plan for public facilities": "Stadt kündigt Barrierefreiheits-Sanierung öffentlicher Gebäude an",
    "The renovations will be carried out in phases over three years.": "Die Arbeiten erfolgen schrittweise über drei Jahre.",
    "Today's top stories at a glance": "Die wichtigsten Meldungen des Tages auf einen Blick",
    "A digest of the biggest topics at home and abroad.": "Ein Überblick über die großen Themen im In- und Ausland.",
    "Weather agency issues outlook for next week": "Wetterdienst veröffentlicht Vorhersage für die kommende Woche",
    "Near-average temperatures expected across most regions.": "In den meisten Regionen werden Temperaturen nahe dem Mittelwert erwartet.",
    "Holiday travel volume at major stations on par with past years": "Reiseaufkommen an großen Bahnhöfen auf dem Niveau der Vorjahre",
    "Transit operators are urging travelers to spread out peak times.": "Die Verkehrsbetriebe bitten Reisende, die Stoßzeiten zu entzerren.",
    "New": "Neu",
    "Trending": "Im Trend",
    "Popular": "Beliebt",
    "{query} — Official Site": "{query} — Offizielle Website",
    "Learn more about {query} on the official site. Find the latest news, products, and support.": "Mehr über {query} auf der offiziellen Website: Neuigkeiten, Produkte und Support.",
    "{query} - Wikipedia": "{query} - Wikipedia",
    "{query} is covered in this encyclopedia article, including history, background, and related topics.": "Dieser Enzyklopädie-Artikel behandelt {query} samt Geschichte, Hintergrund und verwandten Themen.",
    "Buy {query} online — best prices": "{query} online kaufen — beste Preise",
    "Compare prices and shop for {query} online. Free shipping on qualifying orders.": "Preise vergleichen und {query} online kaufen. Versandkostenfrei ab dem Mindestbestellwert.",
    "{query} news and updates": "Nachrichten und Neuigkeiten zu {query}",
    "The latest news and headlines about {query} from trusted sources around the world.": "Aktuelle Nachrichten und Schlagzeilen zu {query} von verlässlichen Quellen weltweit.",
    "What is {query}? A complete guide": "Was ist {query}? Der komplette Leitfaden",
    "Everything you need to know about {query}, explained simply with examples.": "Alles Wissenswerte über {query}, einfach erklärt und mit Beispielen.",
    "{query} reviews and ratings": "Bewertungen und Rezensionen zu {query}",
    "Real user reviews and ratings for {query}. See what people are saying.": "Echte Nutzerbewertungen zu {query}. Sieh nach, was andere sagen.",
    "{query} — video {number}": "{query} — Video {number}",
    "{count}K views": "{count} Tsd. Aufrufe",
    "{query} Store {number}": "{query} Filiale {number}",
    "{query} Center {number}": "{query} Center {number}",
    "{distance} mi": "{distance} mi",
    "{query} — Item {number}": "{query} — Artikel {number}",
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
    "Step 1 of 7": "Schritt 1 von 7",
    "Step 2 of 7": "Schritt 2 von 7",
    "Step 3 of 7": "Schritt 3 von 7",
    "Step 4 of 7": "Schritt 4 von 7",
    "Step 5 of 7": "Schritt 5 von 7",
    "Step 6 of 7": "Schritt 6 von 7",
    "Step 7 of 7": "Schritt 7 von 7",
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
    "You don't need to do anything — just open the app and read. Posts show up on their own.": "Vous n'avez rien à faire : ouvrez l'app et lisez. Les publications apparaissent d'elles-mêmes.",
    "Scroll is OFF by default to limit distraction. Turn it ON with a reason, a time limit, and your PIN only when you really need to scroll freely.": "Le défilement est désactivé par défaut pour limiter les distractions. Activez-le avec une raison, une limite de temps et votre code PIN uniquement quand vous en avez vraiment besoin.",
    "Search the web": "Rechercher sur le web",
    "Search": "Rechercher",
    "All": "Tout",
    "Videos": "Vidéos",
    "Images": "Images",
    "Maps": "Cartes",
    "Shopping": "Achats",
    "Prev": "Préc.",
    "Next": "Suiv.",
    "Close search results": "Fermer les résultats de recherche",
    "Result type": "Type de résultat",
    "Your Interests": "Vos centres d'intérêt",
    "Outside Your Bubble": "Hors de votre bulle",
    "Top News": "Actualités à la une",
    "Insights": "Statistiques",
    "Read": "Lire",
    "Watch": "Regarder",
    "Choose content category": "Choisir une catégorie de contenu",
    "Read or watch": "Lire ou regarder",
    "All time": "Depuis le début",
    "Hour": "Heure",
    "Day": "Jour",
    "Month": "Mois",
    "Year": "Année",
    "Now": "Maintenant",
    "Time spent per app": "Temps passé par application",
    "Scroll": "Défilement",
    "See details": "Voir les détails",
    "View detailed insights": "Voir les statistiques détaillées",
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
    "This sets the language for the next step, where you'll write about your interests.": "Ceci définit la langue de toute l'application, y compris l'étape suivante où vous décrirez vos centres d'intérêt.",
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
    "Scroll turned ON {count} time": "Défilement activé {count} fois",
    "Scroll turned ON {count} times": "Défilement activé {count} fois",
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
    "Results for \"{query}\"": "Résultats pour « {query} »",
    "{hours}h": "{hours} h",
    "{minutes}m": "{minutes} min",
    "{seconds}s": "{seconds} s",
    "{minutes}m {seconds}s": "{minutes} min {seconds} s",
    "{query} is a broad topic covered by official sites, encyclopedia entries, and community discussion. Sources generally agree on the core facts, though specifics vary. See the results below for more detail.": "« {query} » est un sujet vaste traité par des sites officiels, des articles d'encyclopédie et des discussions communautaires. Les sources s'accordent globalement sur l'essentiel, même si les détails varient. Consultez les résultats ci-dessous pour en savoir plus.",
    "Coverage tends to fall into a few groups: official pages describing {query} directly, reference entries giving background and history, retailers and comparison pages, and news items on recent developments. Community threads add first-hand opinion but vary in reliability.": "Les contenus se répartissent en quelques groupes : des pages officielles décrivant directement {query}, des articles de référence donnant le contexte et l'historique, des sites marchands et comparateurs, et des actualités sur les évolutions récentes. Les discussions communautaires apportent des avis de première main, mais leur fiabilité varie.",
    "If you are new to {query}, start with the official site and the encyclopedia entry, then check the news results for anything that has changed recently.": "Si vous découvrez {query}, commencez par le site officiel et l'article d'encyclopédie, puis regardez les actualités pour voir ce qui a changé récemment.",
    "The whole app is shown in this language.": "Toute l'application s'affiche dans cette langue.",
    "30 min ago": "il y a 30 min",
    "1 hour ago": "il y a 1 heure",
    "2 hours ago": "il y a 2 heures",
    "3 hours ago": "il y a 3 heures",
    "4 hours ago": "il y a 4 heures",
    "5 hours ago": "il y a 5 heures",
    "6 hours ago": "il y a 6 heures",
    "Yesterday": "Hier",
    "New AI chip design cuts power draw in half": "Une nouvelle puce IA divise par deux la consommation",
    "Expected to significantly boost inference performance on mobile devices.": "Les performances d'inférence sur mobile devraient nettement progresser.",
    "The 2026 UI trend is 'quiet'": "La tendance des interfaces en 2026 : la sobriété",
    "Designs that cut down on information and protect the user's focus are gaining attention.": "Les designs qui réduisent l'information et préservent la concentration séduisent de plus en plus.",
    "Local team extends win streak to 4 with comeback victory": "L'équipe locale enchaîne une 4e victoire après une remontée",
    "A late substitute scored the winning goal.": "Un remplaçant entré en fin de match a marqué le but décisif.",
    "Emerging market currencies mixed against the dollar": "Les devises émergentes évoluent en ordre dispersé face au dollar",
    "Market watchers are focused on upcoming interest rate moves.": "Les observateurs surveillent les prochains mouvements de taux.",
    "New deep-sea species found in Pacific trench": "Une nouvelle espèce des grands fonds découverte dans une fosse du Pacifique",
    "Researchers hope it will shed light on adaptation to extreme environments.": "Les chercheurs espèrent mieux comprendre l'adaptation aux milieux extrêmes.",
    "City announces accessibility renovation plan for public facilities": "La ville annonce un plan d'accessibilité pour les bâtiments publics",
    "The renovations will be carried out in phases over three years.": "Les travaux seront réalisés par étapes sur trois ans.",
    "Today's top stories at a glance": "L'essentiel de l'actualité du jour",
    "A digest of the biggest topics at home and abroad.": "Un condensé des grands sujets nationaux et internationaux.",
    "Weather agency issues outlook for next week": "L'agence météo publie ses prévisions pour la semaine prochaine",
    "Near-average temperatures expected across most regions.": "Des températures proches des normales sont attendues presque partout.",
    "Holiday travel volume at major stations on par with past years": "Affluence des départs en vacances comparable aux années précédentes",
    "Transit operators are urging travelers to spread out peak times.": "Les transporteurs invitent les voyageurs à étaler les heures de pointe.",
    "New": "Nouveau",
    "Trending": "Tendance",
    "Popular": "Populaire",
    "{query} — Official Site": "{query} — Site officiel",
    "Learn more about {query} on the official site. Find the latest news, products, and support.": "En savoir plus sur {query} sur le site officiel : actualités, produits et assistance.",
    "{query} - Wikipedia": "{query} - Wikipédia",
    "{query} is covered in this encyclopedia article, including history, background, and related topics.": "Cet article d'encyclopédie traite de {query}, son histoire, son contexte et les sujets liés.",
    "Buy {query} online — best prices": "Acheter {query} en ligne — meilleurs prix",
    "Compare prices and shop for {query} online. Free shipping on qualifying orders.": "Comparez les prix et achetez {query} en ligne. Livraison gratuite dès le montant requis.",
    "{query} news and updates": "Actualités et nouveautés sur {query}",
    "The latest news and headlines about {query} from trusted sources around the world.": "Les dernières actualités et titres sur {query}, issus de sources fiables du monde entier.",
    "What is {query}? A complete guide": "Qu'est-ce que {query} ? Le guide complet",
    "Everything you need to know about {query}, explained simply with examples.": "Tout ce qu'il faut savoir sur {query}, expliqué simplement et avec des exemples.",
    "{query} reviews and ratings": "Avis et notes sur {query}",
    "Real user reviews and ratings for {query}. See what people are saying.": "Avis et notes de vrais utilisateurs sur {query}. Découvrez ce qu'ils en disent.",
    "{query} — video {number}": "{query} — vidéo {number}",
    "{count}K views": "{count} k vues",
    "{query} Store {number}": "Boutique {query} {number}",
    "{query} Center {number}": "Centre {query} {number}",
    "{distance} mi": "{distance} mi",
    "{query} — Item {number}": "{query} — Article {number}",
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
    "Step 1 of 7": "Étape 1 sur 7",
    "Step 2 of 7": "Étape 2 sur 7",
    "Step 3 of 7": "Étape 3 sur 7",
    "Step 4 of 7": "Étape 4 sur 7",
    "Step 5 of 7": "Étape 5 sur 7",
    "Step 6 of 7": "Étape 6 sur 7",
    "Step 7 of 7": "Étape 7 sur 7",
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
    "You don't need to do anything — just open the app and read. Posts show up on their own.": "따로 할 일은 없습니다. 앱을 열고 읽기만 하면 게시물이 알아서 표시됩니다.",
    "Scroll is OFF by default to limit distraction. Turn it ON with a reason, a time limit, and your PIN only when you really need to scroll freely.": "주의가 흐트러지지 않도록 스크롤은 기본적으로 꺼져 있습니다. 정말 필요할 때만 이유와 제한 시간, PIN을 입력해 켜세요.",
    "Search the web": "웹 검색",
    "Search": "검색",
    "All": "전체",
    "Videos": "동영상",
    "Images": "이미지",
    "Maps": "지도",
    "Shopping": "쇼핑",
    "Prev": "이전",
    "Next": "다음",
    "Close search results": "검색 결과 닫기",
    "Result type": "결과 유형",
    "Your Interests": "관심 분야",
    "Outside Your Bubble": "평소 안 보는 분야",
    "Top News": "주요 뉴스",
    "Insights": "사용 통계",
    "Read": "읽기",
    "Watch": "보기",
    "Choose content category": "콘텐츠 분류 선택",
    "Read or watch": "읽기 또는 보기",
    "All time": "전체 기간",
    "Hour": "시간",
    "Day": "일",
    "Month": "월",
    "Year": "년",
    "Now": "지금",
    "Time spent per app": "앱별 사용 시간",
    "Scroll": "스크롤",
    "See details": "자세히 보기",
    "View detailed insights": "자세한 통계 보기",
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
    "This sets the language for the next step, where you'll write about your interests.": "앱 전체의 표시 언어가 되며, 다음 단계에서 관심사를 적을 때도 사용됩니다.",
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
    "Scroll turned ON {count} time": "스크롤 켠 횟수 {count}회",
    "Scroll turned ON {count} times": "스크롤 켠 횟수 {count}회",
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
    "Results for \"{query}\"": "'{query}' 검색 결과",
    "{hours}h": "{hours}시간",
    "{minutes}m": "{minutes}분",
    "{seconds}s": "{seconds}초",
    "{minutes}m {seconds}s": "{minutes}분 {seconds}초",
    "{query} is a broad topic covered by official sites, encyclopedia entries, and community discussion. Sources generally agree on the core facts, though specifics vary. See the results below for more detail.": "'{query}'은(는) 공식 사이트, 백과사전 항목, 커뮤니티 토론 등에서 폭넓게 다뤄지는 주제입니다. 핵심적인 사실에 대해서는 출처들이 대체로 일치하지만 세부 내용은 다릅니다. 자세한 내용은 아래 결과를 확인하세요.",
    "Coverage tends to fall into a few groups: official pages describing {query} directly, reference entries giving background and history, retailers and comparison pages, and news items on recent developments. Community threads add first-hand opinion but vary in reliability.": "관련 정보는 몇 가지로 나뉩니다. {query}을(를) 직접 설명하는 공식 페이지, 배경과 역사를 정리한 자료, 판매·비교 페이지, 최근 소식을 전하는 뉴스 등입니다. 커뮤니티 글은 직접 경험한 의견을 볼 수 있지만 신뢰도는 제각각입니다.",
    "If you are new to {query}, start with the official site and the encyclopedia entry, then check the news results for anything that has changed recently.": "{query}이(가) 처음이라면 공식 사이트와 백과사전 항목부터 보고, 그다음 뉴스 결과에서 최근에 바뀐 점을 확인해 보세요.",
    "The whole app is shown in this language.": "앱 전체가 이 언어로 표시됩니다.",
    "30 min ago": "30분 전",
    "1 hour ago": "1시간 전",
    "2 hours ago": "2시간 전",
    "3 hours ago": "3시간 전",
    "4 hours ago": "4시간 전",
    "5 hours ago": "5시간 전",
    "6 hours ago": "6시간 전",
    "Yesterday": "어제",
    "New AI chip design cuts power draw in half": "새 AI 칩 설계로 전력 소모 절반으로",
    "Expected to significantly boost inference performance on mobile devices.": "모바일 기기에서의 추론 성능이 크게 향상될 것으로 보입니다.",
    "The 2026 UI trend is 'quiet'": "2026년 UI 트렌드는 '조용함'",
    "Designs that cut down on information and protect the user's focus are gaining attention.": "정보량을 줄이고 사용자의 집중을 지키는 디자인이 주목받고 있습니다.",
    "Local team extends win streak to 4 with comeback victory": "지역 팀, 역전승으로 4연승",
    "A late substitute scored the winning goal.": "후반에 교체 투입된 선수가 결승골을 넣었습니다.",
    "Emerging market currencies mixed against the dollar": "신흥국 통화, 달러 대비 혼조세",
    "Market watchers are focused on upcoming interest rate moves.": "시장은 앞으로의 금리 움직임에 주목하고 있습니다.",
    "New deep-sea species found in Pacific trench": "태평양 해구에서 심해 신종 발견",
    "Researchers hope it will shed light on adaptation to extreme environments.": "연구진은 극한 환경 적응을 밝히는 데 도움이 되기를 기대하고 있습니다.",
    "City announces accessibility renovation plan for public facilities": "시, 공공시설 무장애 개보수 계획 발표",
    "The renovations will be carried out in phases over three years.": "개보수는 3년에 걸쳐 단계적으로 진행됩니다.",
    "Today's top stories at a glance": "오늘의 주요 뉴스 한눈에",
    "A digest of the biggest topics at home and abroad.": "국내외 주요 화제를 요약해 전해 드립니다.",
    "Weather agency issues outlook for next week": "기상 당국, 다음 주 전망 발표",
    "Near-average temperatures expected across most regions.": "대부분 지역에서 평년과 비슷한 기온이 예상됩니다.",
    "Holiday travel volume at major stations on par with past years": "주요 역 연휴 이동 인파, 예년 수준",
    "Transit operators are urging travelers to spread out peak times.": "교통 운영사들은 이용 시간대를 분산해 달라고 당부했습니다.",
    "New": "신규",
    "Trending": "인기 급상승",
    "Popular": "인기",
    "{query} — Official Site": "{query} — 공식 사이트",
    "Learn more about {query} on the official site. Find the latest news, products, and support.": "공식 사이트에서 {query}에 대해 자세히 알아보세요. 최신 소식, 제품, 지원 정보를 제공합니다.",
    "{query} - Wikipedia": "{query} - 위키백과",
    "{query} is covered in this encyclopedia article, including history, background, and related topics.": "이 백과사전 문서는 {query}의 역사와 배경, 관련 주제까지 다룹니다.",
    "Buy {query} online — best prices": "{query} 온라인 구매 — 최저가",
    "Compare prices and shop for {query} online. Free shipping on qualifying orders.": "{query}의 가격을 비교하고 온라인으로 구매하세요. 조건 충족 시 무료 배송.",
    "{query} news and updates": "{query} 뉴스와 소식",
    "The latest news and headlines about {query} from trusted sources around the world.": "전 세계 신뢰할 수 있는 매체가 전하는 {query} 관련 최신 뉴스와 헤드라인.",
    "What is {query}? A complete guide": "{query}란? 완벽 가이드",
    "Everything you need to know about {query}, explained simply with examples.": "{query}에 대해 알아야 할 모든 것을 예시와 함께 쉽게 설명합니다.",
    "{query} reviews and ratings": "{query} 후기와 평점",
    "Real user reviews and ratings for {query}. See what people are saying.": "{query}에 대한 실제 사용자 후기와 평점. 사람들의 이야기를 확인해 보세요.",
    "{query} — video {number}": "{query} — 동영상 {number}",
    "{count}K views": "조회수 {count}천회",
    "{query} Store {number}": "{query} 매장 {number}호점",
    "{query} Center {number}": "{query} 센터 {number}호점",
    "{distance} mi": "{distance}마일",
    "{query} — Item {number}": "{query} — 상품 {number}",
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
    "Step 1 of 7": "1단계 (전체 7단계)",
    "Step 2 of 7": "2단계 (전체 7단계)",
    "Step 3 of 7": "3단계 (전체 7단계)",
    "Step 4 of 7": "4단계 (전체 7단계)",
    "Step 5 of 7": "5단계 (전체 7단계)",
    "Step 6 of 7": "6단계 (전체 7단계)",
    "Step 7 of 7": "7단계 (전체 7단계)",
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
    "You don't need to do anything — just open the app and read. Posts show up on their own.": "你不需要做任何操作，打开应用阅读即可，内容会自动显示。",
    "Scroll is OFF by default to limit distraction. Turn it ON with a reason, a time limit, and your PIN only when you really need to scroll freely.": "为减少干扰，滚动默认关闭。只有确实需要自由滚动时，才输入理由、时间限制和 PIN 来开启。",
    "Search the web": "搜索网页",
    "Search": "搜索",
    "All": "全部",
    "Videos": "视频",
    "Images": "图片",
    "Maps": "地图",
    "Shopping": "购物",
    "Prev": "上一页",
    "Next": "下一页",
    "Close search results": "关闭搜索结果",
    "Result type": "结果类型",
    "Your Interests": "感兴趣的领域",
    "Outside Your Bubble": "平时不看的领域",
    "Top News": "热门新闻",
    "Insights": "使用统计",
    "Read": "阅读",
    "Watch": "观看",
    "Choose content category": "选择内容分类",
    "Read or watch": "阅读或观看",
    "All time": "全部时间",
    "Hour": "小时",
    "Day": "天",
    "Month": "月",
    "Year": "年",
    "Now": "现在",
    "Time spent per app": "各应用的使用时长",
    "Scroll": "滚动",
    "See details": "查看详情",
    "View detailed insights": "查看详细统计",
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
    "This sets the language for the next step, where you'll write about your interests.": "这将作为整个应用的显示语言，也包括下一步填写兴趣时使用的语言。",
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
    "Scroll turned ON {count} time": "开启滚动 {count} 次",
    "Scroll turned ON {count} times": "开启滚动 {count} 次",
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
    "Results for \"{query}\"": "“{query}”的搜索结果",
    "{hours}h": "{hours} 小时",
    "{minutes}m": "{minutes} 分",
    "{seconds}s": "{seconds} 秒",
    "{minutes}m {seconds}s": "{minutes} 分 {seconds} 秒",
    "{query} is a broad topic covered by official sites, encyclopedia entries, and community discussion. Sources generally agree on the core facts, though specifics vary. See the results below for more detail.": "“{query}”是一个涉及面很广的话题，官方网站、百科条目和社区讨论都有涉及。各方资料在核心事实上基本一致，细节则有所不同。更多内容请看下方结果。",
    "Coverage tends to fall into a few groups: official pages describing {query} directly, reference entries giving background and history, retailers and comparison pages, and news items on recent developments. Community threads add first-hand opinion but vary in reliability.": "相关内容大致分为几类：直接介绍 {query} 的官方页面、提供背景与历史的参考条目、销售与比价页面，以及报道最新进展的新闻。社区帖子能看到第一手观点，但可靠性参差不齐。",
    "If you are new to {query}, start with the official site and the encyclopedia entry, then check the news results for anything that has changed recently.": "如果你刚开始了解 {query}，建议先看官方网站和百科条目，再通过新闻结果确认最近有什么变化。",
    "The whole app is shown in this language.": "整个应用都会以此语言显示。",
    "30 min ago": "30 分钟前",
    "1 hour ago": "1 小时前",
    "2 hours ago": "2 小时前",
    "3 hours ago": "3 小时前",
    "4 hours ago": "4 小时前",
    "5 hours ago": "5 小时前",
    "6 hours ago": "6 小时前",
    "Yesterday": "昨天",
    "New AI chip design cuts power draw in half": "新款 AI 芯片设计将功耗降低一半",
    "Expected to significantly boost inference performance on mobile devices.": "预计将大幅提升移动设备上的推理性能。",
    "The 2026 UI trend is 'quiet'": "2026 年的界面趋势是「安静」",
    "Designs that cut down on information and protect the user's focus are gaining attention.": "减少信息量、保护用户注意力的设计正受到关注。",
    "Local team extends win streak to 4 with comeback victory": "本地球队逆转取胜，连胜纪录增至 4 场",
    "A late substitute scored the winning goal.": "终场前替补上场的球员打入制胜一球。",
    "Emerging market currencies mixed against the dollar": "新兴市场货币对美元涨跌互现",
    "Market watchers are focused on upcoming interest rate moves.": "市场人士正关注接下来的利率动向。",
    "New deep-sea species found in Pacific trench": "太平洋海沟发现深海新物种",
    "Researchers hope it will shed light on adaptation to extreme environments.": "研究人员希望借此了解生物如何适应极端环境。",
    "City announces accessibility renovation plan for public facilities": "市政府公布公共设施无障碍改造计划",
    "The renovations will be carried out in phases over three years.": "改造工程将在三年内分阶段进行。",
    "Today's top stories at a glance": "今日要闻一览",
    "A digest of the biggest topics at home and abroad.": "汇总国内外最受关注的话题。",
    "Weather agency issues outlook for next week": "气象部门发布下周天气展望",
    "Near-average temperatures expected across most regions.": "预计大部分地区气温接近常年水平。",
    "Holiday travel volume at major stations on par with past years": "各大车站假期客流与往年持平",
    "Transit operators are urging travelers to spread out peak times.": "交通运营方呼吁旅客错峰出行。",
    "New": "最新",
    "Trending": "热门",
    "Popular": "受欢迎",
    "{query} — Official Site": "{query} — 官方网站",
    "Learn more about {query} on the official site. Find the latest news, products, and support.": "在官方网站了解更多关于{query}的信息，包括最新消息、产品和支持。",
    "{query} - Wikipedia": "{query} - 维基百科",
    "{query} is covered in this encyclopedia article, including history, background, and related topics.": "这篇百科条目介绍了{query}，包括历史、背景和相关话题。",
    "Buy {query} online — best prices": "在线购买{query} — 最优价格",
    "Compare prices and shop for {query} online. Free shipping on qualifying orders.": "比较价格并在线购买{query}。符合条件的订单免运费。",
    "{query} news and updates": "{query}的新闻与动态",
    "The latest news and headlines about {query} from trusted sources around the world.": "来自全球可信来源的{query}最新新闻与头条。",
    "What is {query}? A complete guide": "什么是{query}？完整指南",
    "Everything you need to know about {query}, explained simply with examples.": "关于{query}你需要知道的一切，用实例简明讲解。",
    "{query} reviews and ratings": "{query}的评价与评分",
    "Real user reviews and ratings for {query}. See what people are saying.": "{query}的真实用户评价与评分，看看大家怎么说。",
    "{query} — video {number}": "{query} — 视频 {number}",
    "{count}K views": "{count} 千次观看",
    "{query} Store {number}": "{query}门店 {number}",
    "{query} Center {number}": "{query}中心 {number}",
    "{distance} mi": "{distance} 英里",
    "{query} — Item {number}": "{query} — 商品 {number}",
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
    "Step 1 of 7": "第 1 步（共 7 步）",
    "Step 2 of 7": "第 2 步（共 7 步）",
    "Step 3 of 7": "第 3 步（共 7 步）",
    "Step 4 of 7": "第 4 步（共 7 步）",
    "Step 5 of 7": "第 5 步（共 7 步）",
    "Step 6 of 7": "第 6 步（共 7 步）",
    "Step 7 of 7": "第 7 步（共 7 步）",
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
    "You don't need to do anything — just open the app and read. Posts show up on their own.": "No tienes que hacer nada: abre la app y lee. Las publicaciones aparecen solas.",
    "Scroll is OFF by default to limit distraction. Turn it ON with a reason, a time limit, and your PIN only when you really need to scroll freely.": "El scroll está desactivado por defecto para evitar distracciones. Actívalo con un motivo, un límite de tiempo y tu PIN solo cuando de verdad lo necesites.",
    "Search the web": "Buscar en la web",
    "Search": "Buscar",
    "All": "Todo",
    "Videos": "Vídeos",
    "Images": "Imágenes",
    "Maps": "Mapas",
    "Shopping": "Compras",
    "Prev": "Anterior",
    "Next": "Siguiente",
    "Close search results": "Cerrar resultados de búsqueda",
    "Result type": "Tipo de resultado",
    "Your Interests": "Tus intereses",
    "Outside Your Bubble": "Fuera de tu burbuja",
    "Top News": "Noticias destacadas",
    "Insights": "Estadísticas",
    "Read": "Leer",
    "Watch": "Ver",
    "Choose content category": "Elegir categoría de contenido",
    "Read or watch": "Leer o ver",
    "All time": "Todo el tiempo",
    "Hour": "Hora",
    "Day": "Día",
    "Month": "Mes",
    "Year": "Año",
    "Now": "Ahora",
    "Time spent per app": "Tiempo por aplicación",
    "Scroll": "Scroll",
    "See details": "Ver detalles",
    "View detailed insights": "Ver estadísticas detalladas",
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
    "This sets the language for the next step, where you'll write about your interests.": "Define el idioma de toda la app, incluido el siguiente paso donde escribirás tus intereses.",
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
    "Scroll turned ON {count} time": "Scroll activado {count} vez",
    "Scroll turned ON {count} times": "Scroll activado {count} veces",
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
    "Results for \"{query}\"": "Resultados de «{query}»",
    "{hours}h": "{hours} h",
    "{minutes}m": "{minutes} min",
    "{seconds}s": "{seconds} s",
    "{minutes}m {seconds}s": "{minutes} min {seconds} s",
    "{query} is a broad topic covered by official sites, encyclopedia entries, and community discussion. Sources generally agree on the core facts, though specifics vary. See the results below for more detail.": "«{query}» es un tema amplio que aparece en sitios oficiales, entradas de enciclopedia y debates de la comunidad. Las fuentes coinciden en lo esencial, aunque los detalles varían. Consulta los resultados de abajo para saber más.",
    "Coverage tends to fall into a few groups: official pages describing {query} directly, reference entries giving background and history, retailers and comparison pages, and news items on recent developments. Community threads add first-hand opinion but vary in reliability.": "La información suele dividirse en varios grupos: páginas oficiales que describen {query} directamente, entradas de referencia con contexto e historia, tiendas y páginas de comparación, y noticias sobre novedades recientes. Los hilos de la comunidad aportan opiniones de primera mano, pero su fiabilidad varía.",
    "If you are new to {query}, start with the official site and the encyclopedia entry, then check the news results for anything that has changed recently.": "Si es la primera vez que ves {query}, empieza por el sitio oficial y la entrada de enciclopedia, y después revisa las noticias por si algo ha cambiado hace poco.",
    "The whole app is shown in this language.": "Toda la app se muestra en este idioma.",
    "30 min ago": "hace 30 min",
    "1 hour ago": "hace 1 hora",
    "2 hours ago": "hace 2 horas",
    "3 hours ago": "hace 3 horas",
    "4 hours ago": "hace 4 horas",
    "5 hours ago": "hace 5 horas",
    "6 hours ago": "hace 6 horas",
    "Yesterday": "Ayer",
    "New AI chip design cuts power draw in half": "Un nuevo diseño de chip de IA reduce a la mitad el consumo",
    "Expected to significantly boost inference performance on mobile devices.": "Se espera que mejore mucho el rendimiento de inferencia en móviles.",
    "The 2026 UI trend is 'quiet'": "La tendencia de interfaces en 2026 es «lo silencioso»",
    "Designs that cut down on information and protect the user's focus are gaining attention.": "Ganan atención los diseños que reducen la información y protegen la concentración.",
    "Local team extends win streak to 4 with comeback victory": "El equipo local suma su cuarta victoria seguida con una remontada",
    "A late substitute scored the winning goal.": "Un suplente que entró al final marcó el gol de la victoria.",
    "Emerging market currencies mixed against the dollar": "Las divisas emergentes cierran mixtas frente al dólar",
    "Market watchers are focused on upcoming interest rate moves.": "Los analistas están pendientes de los próximos movimientos de tipos.",
    "New deep-sea species found in Pacific trench": "Hallan una nueva especie abisal en una fosa del Pacífico",
    "Researchers hope it will shed light on adaptation to extreme environments.": "Los investigadores esperan que ayude a entender la adaptación a entornos extremos.",
    "City announces accessibility renovation plan for public facilities": "La ciudad anuncia un plan de accesibilidad para edificios públicos",
    "The renovations will be carried out in phases over three years.": "Las obras se harán por fases a lo largo de tres años.",
    "Today's top stories at a glance": "Las noticias más importantes de hoy, de un vistazo",
    "A digest of the biggest topics at home and abroad.": "Un resumen de los grandes temas nacionales e internacionales.",
    "Weather agency issues outlook for next week": "La agencia meteorológica publica la previsión para la próxima semana",
    "Near-average temperatures expected across most regions.": "Se esperan temperaturas cercanas a la media en casi todas las regiones.",
    "Holiday travel volume at major stations on par with past years": "El tráfico de viajeros en las grandes estaciones, como en años anteriores",
    "Transit operators are urging travelers to spread out peak times.": "Los operadores piden a los viajeros repartir las horas punta.",
    "New": "Nuevo",
    "Trending": "En tendencia",
    "Popular": "Popular",
    "{query} — Official Site": "{query} — Sitio oficial",
    "Learn more about {query} on the official site. Find the latest news, products, and support.": "Descubre más sobre {query} en el sitio oficial: novedades, productos y soporte.",
    "{query} - Wikipedia": "{query} - Wikipedia",
    "{query} is covered in this encyclopedia article, including history, background, and related topics.": "Este artículo de enciclopedia trata sobre {query}, con su historia, contexto y temas relacionados.",
    "Buy {query} online — best prices": "Compra {query} en línea — los mejores precios",
    "Compare prices and shop for {query} online. Free shipping on qualifying orders.": "Compara precios y compra {query} en línea. Envío gratis en pedidos que cumplan las condiciones.",
    "{query} news and updates": "Noticias y novedades sobre {query}",
    "The latest news and headlines about {query} from trusted sources around the world.": "Las últimas noticias y titulares sobre {query} de fuentes fiables de todo el mundo.",
    "What is {query}? A complete guide": "¿Qué es {query}? Guía completa",
    "Everything you need to know about {query}, explained simply with examples.": "Todo lo que necesitas saber sobre {query}, explicado de forma sencilla y con ejemplos.",
    "{query} reviews and ratings": "Opiniones y valoraciones de {query}",
    "Real user reviews and ratings for {query}. See what people are saying.": "Opiniones y valoraciones reales de usuarios sobre {query}. Mira qué dice la gente.",
    "{query} — video {number}": "{query} — vídeo {number}",
    "{count}K views": "{count} mil visualizaciones",
    "{query} Store {number}": "Tienda {query} {number}",
    "{query} Center {number}": "Centro {query} {number}",
    "{distance} mi": "{distance} mi",
    "{query} — Item {number}": "{query} — Artículo {number}",
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
    "Step 1 of 7": "Paso 1 de 7",
    "Step 2 of 7": "Paso 2 de 7",
    "Step 3 of 7": "Paso 3 de 7",
    "Step 4 of 7": "Paso 4 de 7",
    "Step 5 of 7": "Paso 5 de 7",
    "Step 6 of 7": "Paso 6 de 7",
    "Step 7 of 7": "Paso 7 de 7",
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
    "You don't need to do anything — just open the app and read. Posts show up on their own.": "特に操作は要りません。アプリを開いて読むだけで、投稿は自動的に表示されます。",
    "Scroll is OFF by default to limit distraction. Turn it ON with a reason, a time limit, and your PIN only when you really need to scroll freely.": "気が散らないよう、スクロールは既定でOFFです。本当に必要なときだけ、理由と制限時間とPINを入れてONにしてください。",
    // ---- 検索 ----
    "Search the web": "ウェブを検索",
    "Search": "検索",
    "All": "すべて",
    "Videos": "動画",
    "Images": "画像",
    "Maps": "地図",
    "Shopping": "ショッピング",
    "Prev": "前へ",
    "Next": "次へ",
    "Close search results": "検索結果を閉じる",
    "Result type": "検索結果の種類",
    // ---- カテゴリ ----
    "Your Interests": "興味のある分野",
    "Outside Your Bubble": "普段見ない分野",
    "Top News": "トップニュース",
    "Insights": "インサイト",
    "Read": "読む",
    "Watch": "見る",
    "Choose content category": "カテゴリを選ぶ",
    "Read or watch": "読む / 見る",
    // ---- インサイト ----
    "All time": "全期間",
    "Hour": "時間",
    "Day": "日",
    "Month": "月",
    "Year": "年",
    "Now": "現在",
    "Time spent per app": "アプリごとの利用時間",
    "Scroll": "スクロール",
    "See details": "詳しく見る",
    "View detailed insights": "詳しいインサイトを見る",
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
    "This sets the language for the next step, where you'll write about your interests.": "アプリ全体の表示言語になります。次のステップの入力言語にもなります。",
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
    "Scroll turned ON {count} time": "スクロールをONにした回数 {count}回",
    "Scroll turned ON {count} times": "スクロールをONにした回数 {count}回",
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
    "Results for \"{query}\"": "「{query}」の検索結果",
    "{hours}h": "{hours}時間",
    "{minutes}m": "{minutes}分",
    "{seconds}s": "{seconds}秒",
    "{minutes}m {seconds}s": "{minutes}分{seconds}秒",
    "{query} is a broad topic covered by official sites, encyclopedia entries, and community discussion. Sources generally agree on the core facts, though specifics vary. See the results below for more detail.": "「{query}」は公式サイト、百科事典、コミュニティでの議論など幅広く扱われている話題です。基本的な事実については情報源どうしでおおむね一致していますが、細かい点は異なります。詳しくは下の検索結果をご覧ください。",
    "Coverage tends to fall into a few groups: official pages describing {query} directly, reference entries giving background and history, retailers and comparison pages, and news items on recent developments. Community threads add first-hand opinion but vary in reliability.": "情報はいくつかの種類に分かれます。{query}そのものを説明する公式ページ、背景や歴史をまとめた資料、販売・比較ページ、最近の動きを伝えるニュースなどです。コミュニティの投稿は当事者の意見が読めますが、信頼度にはばらつきがあります。",
    "If you are new to {query}, start with the official site and the encyclopedia entry, then check the news results for anything that has changed recently.": "{query}が初めてなら、まず公式サイトと百科事典の項目から読み、そのあとニュースの結果で最近の変化を確認するとよいでしょう。",
    "The whole app is shown in this language.": "アプリ全体がこの言語で表示されます。",
    "30 min ago": "30分前",
    "1 hour ago": "1時間前",
    "2 hours ago": "2時間前",
    "3 hours ago": "3時間前",
    "4 hours ago": "4時間前",
    "5 hours ago": "5時間前",
    "6 hours ago": "6時間前",
    "Yesterday": "昨日",
    "New AI chip design cuts power draw in half": "新しいAIチップ、消費電力を半減させる設計",
    "Expected to significantly boost inference performance on mobile devices.": "モバイル端末での推論性能が大きく向上すると見込まれています。",
    "The 2026 UI trend is 'quiet'": "2026年のUIトレンドは「静かさ」",
    "Designs that cut down on information and protect the user's focus are gaining attention.": "情報量を抑え、利用者の集中を守るデザインが注目されています。",
    "Local team extends win streak to 4 with comeback victory": "地元チームが逆転勝ちで4連勝",
    "A late substitute scored the winning goal.": "終盤に投入された選手が決勝点を挙げました。",
    "Emerging market currencies mixed against the dollar": "新興国通貨、対ドルでまちまちの動き",
    "Market watchers are focused on upcoming interest rate moves.": "市場関係者は今後の金利動向に注目しています。",
    "New deep-sea species found in Pacific trench": "太平洋の海溝で深海の新種を発見",
    "Researchers hope it will shed light on adaptation to extreme environments.": "極限環境への適応の解明につながると期待されています。",
    "City announces accessibility renovation plan for public facilities": "市が公共施設のバリアフリー改修計画を発表",
    "The renovations will be carried out in phases over three years.": "改修は3年かけて段階的に進められます。",
    "Today's top stories at a glance": "今日の主要ニュースをまとめて",
    "A digest of the biggest topics at home and abroad.": "国内外の大きな話題をダイジェストでお届けします。",
    "Weather agency issues outlook for next week": "気象当局が来週の見通しを発表",
    "Near-average temperatures expected across most regions.": "ほとんどの地域で平年並みの気温が見込まれます。",
    "Holiday travel volume at major stations on par with past years": "主要駅の帰省ラッシュ、例年並みの人出",
    "Transit operators are urging travelers to spread out peak times.": "交通各社は時間帯の分散を呼びかけています。",
    "New": "新着",
    "Trending": "話題",
    "Popular": "人気",
    "{query} — Official Site": "{query} — 公式サイト",
    "Learn more about {query} on the official site. Find the latest news, products, and support.": "{query}について公式サイトで詳しく見る。最新のお知らせ・製品・サポート情報はこちら。",
    "{query} - Wikipedia": "{query} - Wikipedia",
    "{query} is covered in this encyclopedia article, including history, background, and related topics.": "{query}について、歴史や背景、関連する話題まで百科事典の記事で解説しています。",
    "Buy {query} online — best prices": "{query}をオンラインで購入 — 最安値",
    "Compare prices and shop for {query} online. Free shipping on qualifying orders.": "{query}の価格を比較してオンラインで購入。条件を満たす注文は送料無料。",
    "{query} news and updates": "{query}のニュースと最新情報",
    "The latest news and headlines about {query} from trusted sources around the world.": "世界各地の信頼できる情報源から、{query}に関する最新ニュースと見出しをお届けします。",
    "What is {query}? A complete guide": "{query}とは？ 完全ガイド",
    "Everything you need to know about {query}, explained simply with examples.": "{query}について知っておきたいことを、例を交えてわかりやすく解説します。",
    "{query} reviews and ratings": "{query}のレビューと評価",
    "Real user reviews and ratings for {query}. See what people are saying.": "{query}の実際の利用者によるレビューと評価。みんなの声をチェック。",
    "{query} — video {number}": "{query} — 動画{number}",
    "{count}K views": "{count}千回視聴",
    "{query} Store {number}": "{query}ストア {number}号店",
    "{query} Center {number}": "{query}センター {number}号店",
    "{distance} mi": "{distance}マイル",
    "{query} — Item {number}": "{query} — 商品{number}",
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
    "Step 1 of 7": "第1ステップ（全7ステップ）",
    "Step 2 of 7": "第2ステップ（全7ステップ）",
    "Step 3 of 7": "第3ステップ（全7ステップ）",
    "Step 4 of 7": "第4ステップ（全7ステップ）",
    "Step 5 of 7": "第5ステップ（全7ステップ）",
    "Step 6 of 7": "第6ステップ（全7ステップ）",
    "Step 7 of 7": "第7ステップ（全7ステップ）",
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
  },
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

/* --------------------------------------------------------------------------
   翻訳の実行部分
   currentLanguage をキャッシュしておき、t() は同期的に引けるようにする。
   静的なHTMLは applyLanguage() が初回に原文を控えてから差し替える。
   JSで組み立てる文字列は生成時に t() を通す（言語切替時は再描画する）。
   -------------------------------------------------------------------------- */
// 興味ステップの文言は ONBOARDING_I18N が持っているので、辞書にも取り込んでおく
// （二重管理を避けるため。"next" はページ送りの "Next" と衝突するので除く）。
Object.keys(ONBOARDING_I18N).forEach((code) => {
  if (code === DEFAULT_LANGUAGE || !UI_I18N[code]) return;
  ["title", "desc", "placeholder"].forEach((field) => {
    const en = ONBOARDING_I18N[DEFAULT_LANGUAGE][field];
    const localized = ONBOARDING_I18N[code][field];
    if (en && localized) UI_I18N[code][en] = localized;
  });
});

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
  const stepInterests = document.getElementById("onboardingStepInterests");
  const stepSns = document.getElementById("onboardingStepSns");
  const stepLogin = document.getElementById("onboardingStepLogin");

  let selectedLanguage = DEFAULT_LANGUAGE;

  /* ---- Step 1: language ---- */
  function applyOnboardingLanguage(code) {
    const copy = ONBOARDING_I18N[code] || ONBOARDING_I18N[DEFAULT_LANGUAGE];
    document.getElementById("interestsStepTitle").textContent = copy.title;
    document.getElementById("interestsStepDesc").textContent = copy.desc;
    document.getElementById("interestsTextInput").placeholder = copy.placeholder;
    document.getElementById("interestsNextBtn").textContent = copy.next;
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
      selectedLanguage = lang.code;
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
  function goToInterestsStep() {
    stepPin.hidden = true;
    stepInterests.hidden = false;
    document.getElementById("interestsTextInput").focus();
  }

  document.getElementById("onboardingPinSkipBtn").addEventListener("click", goToInterestsStep);

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
    goToInterestsStep();
  });

  /* ---- Step 5: interests, written freely in the chosen language ---- */
  document.getElementById("interestsNextBtn").addEventListener("click", () => {
    const text = document.getElementById("interestsTextInput").value.trim();
    saveInterestsText(text);
    saveInterests(extractInterestsFromText(text, selectedLanguage));
    stepInterests.hidden = true;
    stepSns.hidden = false;
    renderOnboardingSnsList();
  });

  /* ---- Step 6: which SNS to use ---- */
  document.getElementById("onboardingSnsNextBtn").addEventListener("click", () => {
    const checked = Array.from(
      document.querySelectorAll('#onboardingSnsList input[type="checkbox"]:checked')
    ).map((cb) => cb.value);
    saveJSON(STORAGE_KEYS.selectedApps, checked);
    stepSns.hidden = true;
    stepLogin.hidden = false;
    renderOnboardingLoginList(checked);
  });

  /* ---- Step 7: log in to the chosen SNS ---- */
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

const SAMPLE_VIDEO_FEEDS = {
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
  const empty = document.getElementById("insightsBarEmpty");
  const track = document.getElementById("insightsBarTrack");
  const legend = document.getElementById("insightsBarLegend");
  const scrollLine = document.getElementById("insightsScrollLine");
  if (!wrap || !empty || !track || !legend || !scrollLine) return;

  const data = getAppInsights();
  const ids = Object.keys(data).filter((id) => data[id].opens > 0);
  const scrollOnCount = getScrollOnCount();
  const scrollGestureCount = getScrollGestureCount();
  const scrollOnTimeMs = getScrollOnTimeMs();
  const hasScrollData = scrollOnCount > 0 || scrollGestureCount > 0;

  // データが無くても消さず、案内文を出したままにしておく（見つけやすさのため常時表示）。
  if (ids.length === 0 && !hasScrollData) {
    empty.hidden = false;
    track.hidden = true;
    legend.hidden = true;
    scrollLine.hidden = true;
    return;
  }
  empty.hidden = true;

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
    const turnedOnPart = tf(
      scrollOnCount === 1 ? "Scroll turned ON {count} time" : "Scroll turned ON {count} times",
      { count: scrollOnCount }
    ) + (scrollOnTimeMs > 0 ? ` (${formatInsightDuration(scrollOnTimeMs)})` : "");
    const parts = [turnedOnPart];
    if (scrollGestureCount > 0) {
      parts.push(tf(
        scrollGestureCount === 1 ? "scrolled {count} time" : "scrolled {count} times",
        { count: scrollGestureCount }
      ));
    }
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

const ScrollLock = (() => {
  let countdownTimer = null;

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
      showToast(t("Time's up — scroll switched back OFF"));
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
  renderFeeds();
  renderInsightsBar();
  renderAppInsights();
  // オンボーディング中はまだページ送りが用意されていないので、その時は飛ばす。
  if (PAGINATED_INSIGHTS.main) renderMainInsightsPanel();
  refreshSearchResultsIfOpen();
  if (searchState.query) {
    document.getElementById("searchResultsQuery").textContent =
      tf('Results for "{query}"', { query: searchState.query });
  }
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

/* ==========================================================================
   カテゴリタブ / SNSタブ
   ========================================================================== */

function activateCategoryTab(cat) {
  const tabs = document.querySelectorAll(".tab");
  const validCats = Array.from(tabs).map((t) => t.dataset.cat);
  if (!validCats.includes(cat)) return;
  tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.cat === cat));
  document.querySelectorAll(".panel").forEach((p) => {
    p.classList.toggle("is-active", p.dataset.panel === cat);
  });
  saveJSON(STORAGE_KEYS.activeCategory, cat);

  const content = document.querySelector(".content");
  if (content) content.classList.toggle("is-insights", cat === "insights");
  // 非表示のうちは高さが0で行数を測れないので、表示になった時点で組み直す。
  if (cat === "insights" && PAGINATED_INSIGHTS.main) PAGINATED_INSIGHTS.main.refresh();
}

function initCategoryTabs() {
  const tabs = document.querySelectorAll(".tab");
  const validCats = Array.from(tabs).map((t) => t.dataset.cat);
  const saved = loadJSON(STORAGE_KEYS.activeCategory, "interest");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateCategoryTab(tab.dataset.cat));
  });

  activateCategoryTab(validCats.includes(saved) ? saved : "interest");
}

// 「どのSNSを使っていますか」のオンボーディング画面を、APP_CANDIDATESの中でも
// SNS系アプリだけに絞り込むための一覧。
const SNS_FEED_PLATFORMS = ["instagram", "facebook", "x", "youtube", "tiktok", "threads"];

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
  meta.textContent = `${item.source} · ${t(item.time)}`;
  const title = document.createElement("div");
  title.className = "result-title";
  title.textContent = t(item.title);
  const body = document.createElement("div");
  body.className = "result-snippet";
  body.textContent = t(item.body);
  card.append(meta, title, body);
  return card;
}

/* フィード一覧の共通ページ送り: スクロールOFF中はページ送り、
   ONの間は通常スクロールの一覧になる。 */
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
  if (!data[appId]) data[appId] = { opens: 0, canceled: 0, totalTimeMs: 0, sessionCount: 0 };
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

function recordAppSession(appId, durationMs) {
  const data = getAppInsights();
  const entry = ensureInsightsEntry(data, appId);
  entry.totalTimeMs += durationMs;
  entry.sessionCount += 1;
  saveAppInsights(data);

  recordHourly((bucket) => {
    const e = ensureInsightsEntry(bucket.apps, appId);
    e.totalTimeMs += durationMs;
    e.sessionCount += 1;
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
      renderInsightsBar();
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
   検索結果 (ページ送り方式・スクロールしない)
   終わりのない情報の流れを止めるため、結果は無限スクロールではなく
   ページ単位で区切って表示する。実際の検索APIと連携する場合は
   generateMockResults() をfetch()呼び出しに差し替える。
   ========================================================================== */

const RESULT_TEMPLATES = [
  { title: "{query} — Official Site", domain: "example.com", snippet: "Learn more about {query} on the official site. Find the latest news, products, and support." },
  { title: "{query} - Wikipedia", domain: "en.wikipedia.org/wiki", snippet: "{query} is covered in this encyclopedia article, including history, background, and related topics." },
  { title: "Buy {query} online — best prices", domain: "shop.example.com", snippet: "Compare prices and shop for {query} online. Free shipping on qualifying orders." },
  { title: "{query} news and updates", domain: "news.example.com", snippet: "The latest news and headlines about {query} from trusted sources around the world." },
  { title: "What is {query}? A complete guide", domain: "guide.example.com", snippet: "Everything you need to know about {query}, explained simply with examples." },
  { title: "{query} reviews and ratings", domain: "reviews.example.com", snippet: "Real user reviews and ratings for {query}. See what people are saying." },
];

function slugify(query) {
  return query.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "search";
}

function generateMockResults(query, count) {
  const slug = slugify(query);
  const results = [];
  for (let i = 0; i < count; i++) {
    const template = RESULT_TEMPLATES[i % RESULT_TEMPLATES.length];
    const round = Math.floor(i / RESULT_TEMPLATES.length);
    results.push({
      title: tf(template.title, { query }),
      url: `https://${round > 0 ? `p${round + 1}.` : ""}${template.domain}${template.domain.includes("wikipedia") ? "/" + slug : ""}`,
      snippet: tf(template.snippet, { query }),
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
      title: tf("{query} — video {number}", { query, number: i + 1 }),
      channel: channels[i % channels.length],
      views: tf("{count}K views", { count: 50 + i * 17 }),
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
      name: i % 2 === 0
        ? tf("{query} Store {number}", { query, number: i + 1 })
        : tf("{query} Center {number}", { query, number: i + 1 }),
      address: `${100 + i * 11} ${streets[i % streets.length]}`,
      rating: (3.5 + (i % 3) * 0.5).toFixed(1),
      distance: tf("{distance} mi", { distance: (0.3 + i * 0.4).toFixed(1) }),
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
      title: tf("{query} — Item {number}", { query, number: i + 1 }),
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
    title.textContent = t(item.title);
    const meta = document.createElement("div");
    meta.className = "result-url";
    meta.textContent = `${item.channel} · ${t(item.views)}`;
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


  renderSearchResultsPage();
}

function openSearchResults(query) {
  searchState.query = query;
  document.getElementById("searchResultsQuery").textContent = tf('Results for "{query}"', { query });
  loadSearchResultsForType("all");
  document.querySelector(".content").hidden = true;
  document.getElementById("searchResultsView").hidden = false;
  // 検索結果に集中できるよう、検索中はドックのアプリを自動で畳む。
  // 設定自体は変えないので、検索を閉じれば元の状態に戻る。
  setDockCollapsedOverride(true);
}

function closeSearchResults() {
  document.getElementById("searchResultsView").hidden = true;
  document.querySelector(".content").hidden = false;
  setDockCollapsedOverride(null);
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
  initCategoryTabs();
  renderFeeds();
  initInsightsPanel();
  renderAppInsights();
  initReadWatchTabs("panel-interest");
  initReadWatchTabs("panel-noninterest");
  renderDock();
  applyDockCollapsed();

  document.getElementById("insightsBarWrap").addEventListener("click", () => activateCategoryTab("insights"));
  document.getElementById("insightsBarWrap").addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activateCategoryTab("insights");
    }
  });

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
    const perPage = RESULT_TYPES[searchState.type].perPage;
    const totalPages = Math.ceil(searchState.results.length / perPage);
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
