export interface Translation {
  // Navigation
  home: string;
  createGift: string;
  claimGift: string;
  bulkCreate: string;
  giftCards: string;
  history: string;
  dashboard: string;
  groupGift: string;
  
  // Authentication
  login: string;
  signup: string;
  logout: string;
  welcome: string;
  createAccount: string;
  
  // Gift Creation
  giftAmount: string;
  giftMessage: string;
  recipientName: string;
  recipientEmail: string;
  expiryDays: string;
  createGiftCard: string;
  
  // Common
  tokens: string;
  pending: string;
  claimed: string;
  expired: string;
  loading: string;
  success: string;
  error: string;
  
  // Messages
  giftCreated: string;
  giftClaimed: string;
  emailSent: string;
  copySuccess: string;
  shareGift: string;
}

export const translations: Record<string, Translation> = {
  // English (Default)
  en: {
    home: "Home",
    createGift: "Create Gift",
    claimGift: "Claim Gift",
    bulkCreate: "Bulk Create",
    giftCards: "Gift Cards",
    history: "History",
    dashboard: "Dashboard",
    groupGift: "Group Gift",
    
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
    welcome: "Welcome",
    createAccount: "Create Account",
    
    giftAmount: "Gift Amount",
    giftMessage: "Gift Message",
    recipientName: "Recipient Name",
    recipientEmail: "Recipient Email",
    expiryDays: "Expires in",
    createGiftCard: "Create Gift Card",
    
    tokens: "tokens",
    pending: "Pending",
    claimed: "Claimed",
    expired: "Expired",
    loading: "Loading...",
    success: "Success",
    error: "Error",
    
    giftCreated: "🎁 Gift created successfully!",
    giftClaimed: "🎉 Gift claimed successfully!",
    emailSent: "📧 Email notification sent!",
    copySuccess: "📋 Copied to clipboard!",
    shareGift: "📱 Share Gift"
  },

  // Spanish
  es: {
    home: "Inicio",
    createGift: "Crear Regalo",
    claimGift: "Reclamar Regalo",
    bulkCreate: "Crear en Lote",
    giftCards: "Tarjetas de Regalo",
    history: "Historial",
    dashboard: "Panel",
    groupGift: "Regalo Grupal",
    
    login: "Iniciar Sesión",
    signup: "Registrarse",
    logout: "Cerrar Sesión",
    welcome: "Bienvenido",
    createAccount: "Crear Cuenta",
    
    giftAmount: "Cantidad del Regalo",
    giftMessage: "Mensaje del Regalo",
    recipientName: "Nombre del Destinatario",
    recipientEmail: "Email del Destinatario",
    expiryDays: "Expira en",
    createGiftCard: "Crear Tarjeta de Regalo",
    
    tokens: "tokens",
    pending: "Pendiente",
    claimed: "Reclamado",
    expired: "Expirado",
    loading: "Cargando...",
    success: "Éxito",
    error: "Error",
    
    giftCreated: "🎁 ¡Regalo creado exitosamente!",
    giftClaimed: "🎉 ¡Regalo reclamado exitosamente!",
    emailSent: "📧 ¡Notificación por email enviada!",
    copySuccess: "📋 ¡Copiado al portapapeles!",
    shareGift: "📱 Compartir Regalo"
  },

  // French
  fr: {
    home: "Accueil",
    createGift: "Créer un Cadeau",
    claimGift: "Réclamer un Cadeau",
    bulkCreate: "Création en Lot",
    giftCards: "Cartes Cadeaux",
    history: "Historique",
    dashboard: "Tableau de Bord",
    groupGift: "Cadeau de Groupe",
    
    login: "Connexion",
    signup: "S'inscrire",
    logout: "Déconnexion",
    welcome: "Bienvenue",
    createAccount: "Créer un Compte",
    
    giftAmount: "Montant du Cadeau",
    giftMessage: "Message du Cadeau",
    recipientName: "Nom du Destinataire",
    recipientEmail: "Email du Destinataire",
    expiryDays: "Expire dans",
    createGiftCard: "Créer une Carte Cadeau",
    
    tokens: "jetons",
    pending: "En Attente",
    claimed: "Réclamé",
    expired: "Expiré",
    loading: "Chargement...",
    success: "Succès",
    error: "Erreur",
    
    giftCreated: "🎁 Cadeau créé avec succès!",
    giftClaimed: "🎉 Cadeau réclamé avec succès!",
    emailSent: "📧 Notification email envoyée!",
    copySuccess: "📋 Copié dans le presse-papiers!",
    shareGift: "📱 Partager le Cadeau"
  },

  // German
  de: {
    home: "Startseite",
    createGift: "Geschenk Erstellen",
    claimGift: "Geschenk Einlösen",
    bulkCreate: "Massenerstellen",
    giftCards: "Geschenkkarten",
    history: "Verlauf",
    dashboard: "Dashboard",
    groupGift: "Gruppengeschenk",
    
    login: "Anmelden",
    signup: "Registrieren",
    logout: "Abmelden",
    welcome: "Willkommen",
    createAccount: "Konto Erstellen",
    
    giftAmount: "Geschenkbetrag",
    giftMessage: "Geschenknachricht",
    recipientName: "Empfängername",
    recipientEmail: "Empfänger-E-Mail",
    expiryDays: "Läuft ab in",
    createGiftCard: "Geschenkkarte Erstellen",
    
    tokens: "Token",
    pending: "Ausstehend",
    claimed: "Eingelöst",
    expired: "Abgelaufen",
    loading: "Laden...",
    success: "Erfolg",
    error: "Fehler",
    
    giftCreated: "🎁 Geschenk erfolgreich erstellt!",
    giftClaimed: "🎉 Geschenk erfolgreich eingelöst!",
    emailSent: "📧 E-Mail-Benachrichtigung gesendet!",
    copySuccess: "📋 In die Zwischenablage kopiert!",
    shareGift: "📱 Geschenk Teilen"
  },

  // Japanese
  ja: {
    home: "ホーム",
    createGift: "ギフト作成",
    claimGift: "ギフト受取",
    bulkCreate: "一括作成",
    giftCards: "ギフトカード",
    history: "履歴",
    dashboard: "ダッシュボード",
    groupGift: "グループギフト",
    
    login: "ログイン",
    signup: "新規登録",
    logout: "ログアウト",
    welcome: "ようこそ",
    createAccount: "アカウント作成",
    
    giftAmount: "ギフト金額",
    giftMessage: "ギフトメッセージ",
    recipientName: "受取人名",
    recipientEmail: "受取人メール",
    expiryDays: "有効期限",
    createGiftCard: "ギフトカード作成",
    
    tokens: "トークン",
    pending: "保留中",
    claimed: "受取済み",
    expired: "期限切れ",
    loading: "読み込み中...",
    success: "成功",
    error: "エラー",
    
    giftCreated: "🎁 ギフトが正常に作成されました！",
    giftClaimed: "🎉 ギフトが正常に受け取られました！",
    emailSent: "📧 メール通知が送信されました！",
    copySuccess: "📋 クリップボードにコピーしました！",
    shareGift: "📱 ギフトを共有"
  },

  // Chinese (Simplified)
  zh: {
    home: "首页",
    createGift: "创建礼品",
    claimGift: "领取礼品",
    bulkCreate: "批量创建",
    giftCards: "礼品卡",
    history: "历史记录",
    dashboard: "仪表板",
    groupGift: "群组礼品",
    
    login: "登录",
    signup: "注册",
    logout: "退出",
    welcome: "欢迎",
    createAccount: "创建账户",
    
    giftAmount: "礼品金额",
    giftMessage: "礼品消息",
    recipientName: "收件人姓名",
    recipientEmail: "收件人邮箱",
    expiryDays: "过期时间",
    createGiftCard: "创建礼品卡",
    
    tokens: "代币",
    pending: "待处理",
    claimed: "已领取",
    expired: "已过期",
    loading: "加载中...",
    success: "成功",
    error: "错误",
    
    giftCreated: "🎁 礼品创建成功！",
    giftClaimed: "🎉 礼品领取成功！",
    emailSent: "📧 邮件通知已发送！",
    copySuccess: "📋 已复制到剪贴板！",
    shareGift: "📱 分享礼品"
  }
};

export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];