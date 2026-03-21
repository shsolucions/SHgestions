// ============================================
// SHgestions — Traduccions (i18n)
// ============================================

export type LanguageCode = 'ca' | 'es' | 'en' | 'fr' | 'de' | 'it' | 'pt' | 'nl' | 'ar';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'ca', name: 'Catalan', nativeName: 'Català', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr' },
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', dir: 'ltr' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
];

type TranslationKeys = typeof ca;
type Translations = Record<LanguageCode, TranslationKeys>;

const ca = {
  // App
  appName: 'SHgestions',
  appDescription: 'Gestió de préstecs personals',
  loading: 'Carregant…',

  // Login
  loginTitle: 'Iniciar sessió',
  loginUser: 'Usuari',
  loginUserPlaceholder: "Nom d'usuari",
  loginPin: 'PIN',
  loginEnter: 'Entrar',
  loginEntering: 'Entrant…',
  loginDefault: 'Per defecte: admin / 1234',
  loginNoAccount: 'No tens compte?',
  loginCreateAccount: 'Crear compte',
  loginErrorUser: "Introdueix el nom d'usuari",
  loginErrorPin: 'Introdueix el PIN de 4 dígits',
  loginErrorInvalid: 'Usuari o PIN incorrecte',
  loginErrorGeneric: 'Error inesperat. Torna-ho a provar.',
  loginSuccess: 'Sessió iniciada correctament',

  // Register
  registerTitle: 'Crear compte',
  registerSubtitle: "Registra't per gestionar els teus préstecs",
  registerUsername: "Nom d'usuari *",
  registerUsernamePlaceholder: 'Mínim 3 caràcters',
  registerDisplayName: 'Nom complet (opcional)',
  registerDisplayNamePlaceholder: 'Com vols que et diguin',
  registerPin: 'PIN de 4 dígits *',
  registerPinConfirm: 'Repeteix el PIN *',
  registerSubmit: 'Crear compte',
  registerCreating: 'Creant…',
  registerHasAccount: 'Ja tens compte?',
  registerLogin: 'Inicia sessió',
  registerSuccess: 'Compte creat correctament!',
  registerErrorUsername: "L'usuari ha de tenir almenys 3 caràcters.",
  registerErrorPin: 'El PIN ha de ser de 4 dígits numèrics.',
  registerErrorPinMatch: 'Els PINs no coincideixen.',
  registerErrorExists: "Aquest nom d'usuari ja existeix.",
  registerErrorGeneric: 'Error en crear el compte.',

  // Loans list
  loansTitle: 'Els meus préstecs',
  loansSearch: 'Cercar préstec…',
  loansCreate: 'Crear',
  loansExport: 'Exportar',
  loansEmpty: 'Encara no tens cap préstec',
  loansEmptyDesc: 'Crea el teu primer préstec per començar a registrar devolucions.',
  loansCreateFirst: 'Crear préstec',
  loanLent: 'Prestat',
  loanReturned: 'Retornat',
  loanPending: 'Pendent',
  loanStart: 'Inici',
  loanMovements: 'moviment',
  loanMovements_plural: 'moviments',

  // Loan form
  loanFormTitleNew: 'Nou préstec',
  loanFormTitleEdit: 'Editar préstec',
  loanFormName: 'Nom del préstec',
  loanFormNamePlaceholder: 'p.ex. PRÉSTEC BYD',
  loanFormLender: 'Prestador (qui presta)',
  loanFormLenderPlaceholder: 'Nom del prestador',
  loanFormBorrower: 'Prestatari (qui rep)',
  loanFormBorrowerPlaceholder: 'Nom del prestatari',
  loanFormAmount: 'Import prestat',
  loanFormCurrency: 'Moneda',
  loanFormStartDate: "Data d'inici",
  loanFormStatus: 'Estat',
  loanFormNotes: 'Notes (opcional)',
  loanFormNotesPlaceholder: 'Detalls addicionals del préstec…',
  loanFormCancel: 'Cancel·lar',
  loanFormSave: 'Guardar canvis',
  loanFormCreate: 'Crear préstec',
  loanFormUpdated: 'Préstec actualitzat',
  loanFormCreated: 'Préstec creat correctament',
  loanFormErrorName: 'El nom del préstec és obligatori',
  loanFormErrorAmount: "L'import ha de ser superior a 0",
  loanFormError: 'Error en guardar el préstec',

  // Loan dashboard
  dashPending: 'Pendent',
  dashTotalPaid: 'Total ingressat',
  dashPrincipal: 'Import prestat',
  dashProgress: 'Progres',
  dashLastPayment: 'Últim ingrés',
  dashNoPayments: 'Encara no hi ha cap ingrés registrat',
  dashNotes: 'Notes',
  dashMovements: 'Moviments',
  dashStartDate: 'Data inici',
  dashAddRecord: 'Afegir registre',
  dashHistory: 'Historial',
  dashEdit: 'Editar',
  dashCharts: 'Gràfics',
  dashPdf: 'PDF',
  dashExcel: 'Excel',
  dashDelete: 'Eliminar préstec',
  dashDeleteTitle: 'Eliminar préstec?',
  dashDeleteMsg: "S'eliminaran el préstec i tots els seus registres de pagament. Aquesta acció no es pot desfer.",
  dashDeleteConfirm: 'Sí, eliminar',
  dashDeleted: 'Préstec eliminat',
  dashPdfOk: 'PDF exportat!',
  dashExcelOk: 'Excel exportat!',
  dashPdfError: 'Error exportant PDF',
  dashExcelError: 'Error exportant Excel',
  dashExportError: 'Error exportant',
  dashLoanNotFound: 'Préstec no trobat',
  dashBack: 'Tornar als préstecs',

  // New payment
  newPayTitle: 'Nou registre',
  newPaySubtitle: 'Fes fotos dels rebuts o puja imatges per registrar una devolució.',
  newPayCamera: 'Càmera',
  newPayGallery: 'Galeria',
  newPayImages: 'Imatges',
  newPayProcess: 'Processar amb OCR',
  newPayManual: 'Introduir manualment',
  newPayCancel: 'Cancel·lar',
  newPayNoImages: 'Afegeix almenys una imatge',
  newPayAdded: 'imatge afegida',
  newPayAdded_plural: 'imatges afegides',
  newPayNoValid: "No s'han trobat imatges vàlides",
  newPayProcessing: 'Processant OCR…',
  newPayInit: 'Inicialitzant OCR…',
  newPayProcessImg: 'Processant imatge',
  newPayOf: 'de',
  newPayOcrDone: 'OCR completat',
  newPayOcrError: "Error en processar les imatges. Pots continuar manualment.",
  newPayFront: 'Davant',
  newPayBack: 'Darrere',
  newPayExtra: 'Extra',

  // Review payment
  reviewTitle: 'Revisió del registre',
  reviewDuplicate: 'Possible duplicat',
  reviewOcrConfidence: 'confiança OCR',
  reviewOcrView: 'Veure text OCR',
  reviewOcrTitle: 'Text OCR complet',
  reviewOcrEmpty: "No s'ha detectat text.",
  reviewPaymentData: 'Dades del pagament',
  reviewDate: 'Data',
  reviewTime: 'Hora',
  reviewAmount: 'Import',
  reviewCurrency: 'Moneda',
  reviewMethod: 'Mètode de pagament',
  reviewSender: 'Ordenant / Emissor',
  reviewSenderPlaceholder: 'Nom de qui fa el pagament',
  reviewConcept: 'Concepte',
  reviewConceptPlaceholder: 'Concepte del moviment',
  reviewBank: 'Banc',
  reviewBankPlaceholder: 'Nom del banc',
  reviewIban: 'IBAN (parcial)',
  reviewIbanPlaceholder: 'ES12 **** **** 4567',
  reviewOpCode: 'Codi operació',
  reviewRefCode: 'Referència',
  reviewNotes: 'Notes (opcional)',
  reviewNotesPlaceholder: 'Notes addicionals…',
  reviewAccept: 'Acceptar i guardar',
  reviewSavePending: 'Guardar com a pendent',
  reviewGoBack: 'Tornar enrere',
  reviewSaved: 'Registre acceptat i guardat',
  reviewSavedPending: 'Registre guardat com a pendent',
  reviewError: 'Error en guardar el registre',
  reviewErrorAmount: "L'import ha de ser superior a 0",
  reviewErrorDate: 'La data és obligatòria',

  // History
  historyTitle: 'Historial',
  historySearch: 'Cercar per concepte, banc, import…',
  historyFilters: 'Filtres per data',
  historyFrom: 'Des de',
  historyTo: 'Fins a',
  historyClear: 'Netejar filtres',
  historyRecords: 'registre',
  historyRecords_plural: 'registres',
  historyTotal: 'Total',
  historyEmpty: 'Cap registre trobat',
  historyEmptyDesc: 'Afegeix el primer registre de devolució.',
  historyEmptyFilter: 'Prova amb uns altres filtres.',
  historyAddRecord: 'Afegir registre',
  historyDetail: 'Detall',
  historyReview: 'Revisar ✓',
  historyDelete: 'Esborrar',
  historyDeleteTitle: 'Esborrar registre?',
  historyDeleteMsg: "S'eliminaran el registre i totes les seves imatges. Aquesta acció no es pot desfer.",
  historyDeleteConfirm: 'Sí, esborrar',
  historyDeleted: 'Registre eliminat',
  historyReviewed: 'Marcat com a revisat',
  historyImages: 'imatge',
  historyImages_plural: 'imatges',

  // Payment detail
  detailTitle: 'Detall del registre',
  detailAmount: 'Import',
  detailImages: 'Imatges',
  detailDetails: 'Detalls',
  detailSender: 'Ordenant',
  detailConcept: 'Concepte',
  detailBank: 'Banc',
  detailIban: 'IBAN',
  detailOpCode: 'Codi operació',
  detailRefCode: 'Referència',
  detailNotes: 'Notes',
  detailOcrConfidence: 'OCR confiança',
  detailOcrView: 'Veure OCR',
  detailMetadata: 'Metadades',
  detailCreated: 'Creat',
  detailUpdated: 'Actualitzat',
  detailEdit: 'Editar',
  detailDelete: 'Esborrar',
  detailMarkReviewed: 'Marcar com a revisat',
  detailEditTitle: 'Editar registre',
  detailSave: 'Guardar',
  detailRecordUpdated: 'Registre actualitzat',
  detailRecordDeleted: 'Registre eliminat',
  detailNotFound: 'Registre no trobat',

  // Charts
  chartsTitle: 'Gràfics',
  chartsReturned: 'retornat',
  chartsPerPayment: 'Import per pagament',
  chartsCumulative: 'Evolució acumulada vs objectiu',
  chartsMonthly: 'Resum mensual',
  chartsByMethod: 'Per mètode de pagament',
  chartsNoData: 'Sense dades',
  chartsNoDataDesc: 'No hi ha pagaments per mostrar gràfics.',
  chartsLoanNotFound: 'Préstec no trobat',
  chartsReturnedLabel: 'Retornat',
  chartsGoalLabel: 'Objectiu',
  chartsTotalMonth: 'Total mes',

  // Cloud settings
  cloudTitle: 'Configuració del núvol',
  cloudStatus: 'Estat de connexió',
  cloudConnected: 'Connectat',
  cloudDisconnected: 'Desconnectat',
  cloudConnectDesc: 'Connecta un servei al núvol per fer còpies de seguretat i sincronitzar les teves dades.',
  cloudProviders: 'Proveïdors disponibles',
  cloudAvailable: 'Disponible',
  cloudComingSoon: 'Properament',
  cloudConnect: 'Connectar',
  cloudDisconnect: 'Desconnectar',
  cloudSyncNow: 'Sincronitzar ara',
  cloudSyncStatus: 'Estat de sincronització',
  cloudPending: 'Pendents',
  cloudSynced: 'Sincronitzats',
  cloudErrors: 'Errors',
  cloudConflicts: 'Conflictes',
  cloudLastSync: 'Última',
  cloudViewErrors: 'Veure errors',
  cloudRetry: 'Reintentar',
  cloudHowTitle: 'Com funciona',
  cloudHow1: 'Les dades es guarden sempre primer localment (offline-first).',
  cloudHow2: 'Quan sincronitzis, es pugen al núvol tots els préstecs, registres i imatges.',
  cloudHow3: 'Si hi ha conflictes, guanya el registre més recent.',
  cloudHow4: "Les imatges es guarden a la carpeta SHgestions del teu Drive.",
  cloudHow5: "Cap dada s'esborra mai silenciosament.",
  cloudConfigTitle: 'Configura Google Drive',
  cloudConfigDesc: "Per connectar Google Drive necessites un Client ID de Google.",
  cloudConfigHelp: "Segueix els passos del README o demana ajuda per configurar-ho.",
  cloudClientId: 'Google Client ID',
  cloudClientIdPlaceholder: 'xxxxxxxxxxxx.apps.googleusercontent.com',
  cloudClientIdHint: "El trobaràs a Google Cloud Console → Credencials",
  cloudClientIdSaved: 'Client ID guardat. Ara pots connectar.',
  cloudConnectedOk: 'Connectat correctament!',
  cloudErrorConnect: 'Error de connexió',
  cloudDisconnectedOk: 'Desconnectat del núvol',
  cloudErrorDisconnect: 'Error en desconnectar',
  cloudSyncError: 'Error de sincronització',
  cloudErrorsTitle: 'Errors de sincronització',
  cloudNoErrors: 'Cap error!',
  cloudRetried: 'elements reintentats',
  cloudRetryError: 'Error en reintentar',

  // Language
  langTitle: 'Idioma',
  langCurrent: 'Idioma actual',
  langSelect: "Selecciona l'idioma de l'aplicació",

  // Common
  cancel: 'Cancel·lar',
  confirm: 'Confirmar',
  save: 'Guardar',
  delete: 'Eliminar',
  edit: 'Editar',
  back: 'Enrere',
  close: 'Tancar',
  search: 'Cercar',
  yes: 'Sí',
  no: 'No',
  of: 'de',
  errorGeneric: 'Error inesperat',
  errorUpdate: "Error actualitzant el registre",

  // Status
  statusActive: 'Actiu',
  statusFinished: 'Finalitzat',
  statusPaused: 'Pausat',
  statusPending: 'Pendent',
  statusReviewed: 'Revisat',
  statusRejected: 'Rebutjat',

  // Payment methods
  methodCash: 'Efectiu',
  methodTransfer: 'Transferència',
  methodBizum: 'Bizum',
  methodDeposit: 'Ingrés bancari',
  methodOther: 'Altre',

  // Theme
  themeLight: 'Mode clar',
  themeDark: 'Mode fosc',
  logout: 'Sortir',
  cloud: 'Núvol',
  settings: 'Configuració',

  deleteLoanConfirm: 'S\'eliminaran el préstec "{name}" i tots els seus registres. Aquesta acció no es pot desfer.',
  // ── Alias keys (used by pages) ──
  addAtLeastOneImage: 'Afegeix almenys una imatge',
  addRecord: 'Afegir registre',
  amountMustBePositive: 'L\'import ha de ser superior a 0',
  borrower: 'Prestatari (qui rep)',
  charts: 'Gràfics',
  clientIdSaved: 'Client ID guardat. Ara pots connectar.',
  conflicts: 'Conflictes',
  connectedSuccess: 'Connectat correctament!',
  connectionStatus: 'Estat de connexió',
  createLoan: 'Crear',
  currency: 'Moneda',
  dateFrom: 'Des de',
  dateRequired: 'La data és obligatòria',
  dateTo: 'Fins a',
  deleteLoan: 'Eliminar préstec?',
  deleteRecord: 'Esborrar registre?',
  details: 'Detalls',
  disconnectedInfo: 'Desconnectat del núvol',
  editLoan: 'Editar préstec',
  errorSavingRecord: 'Error en guardar el registre',
  errors: 'Errors',
  excelExported: 'Excel exportat!',
  exportError: 'Error exportant',
  filters: 'Filtres per data',
  fullOcrText: 'Text OCR complet',
  history: 'Historial',
  initOcr: 'Inicialitzant OCR…',
  lastDeposit: 'Últim ingrés',
  lender: 'Prestador (qui presta)',
  lentAmount: 'Import prestat',
  lentAmountLabel: 'Import prestat',
  loanCreated: 'Préstec creat correctament',
  loanDeleted: 'Préstec eliminat',
  loanName: 'Nom del préstec',
  loanNotFound: 'Préstec no trobat',
  loanStatus: 'Estat',
  loanUpdated: 'Préstec actualitzat',
  markedReviewed: 'Marcat com a revisat',
  metadata: 'Metadades',
  movements: 'moviments',
  myLoans: 'Els meus préstecs',
  newLoan: 'Nou préstec',
  newRecord: 'Nou registre',
  noData: 'Sense dades',
  noDepositsYet: 'Encara no hi ha cap ingrés registrat',
  noErrors: 'Cap error!',
  noLoansDesc: 'Crea el teu primer préstec per començar a registrar devolucions.',
  noLoansYet: 'Encara no tens cap préstec',
  noPaymentsForCharts: 'No hi ha pagaments per mostrar gràfics.',
  noRecordsFound: 'Cap registre trobat',
  noRecordsYetDesc: 'Afegeix el primer registre de devolució.',
  notes: 'Notes',
  ocrComplete: 'OCR completat',
  ocrConfidence: 'confiança OCR',
  optional: 'opcional',
  paymentData: 'Dades del pagament',
  pdfExported: 'PDF exportat!',
  pending: 'Pendent',
  pendingItems: 'Pendents',
  possibleDuplicate: 'Possible duplicat',
  recordAccepted: 'Registre acceptat i guardat',
  recordDeleted: 'Registre eliminat',
  recordDetail: 'Detall del registre',
  recordNotFound: 'Registre no trobat',
  recordSavedPending: 'Registre guardat com a pendent',
  returned: 'Retornat',
  reviewRecord: 'Revisió del registre',
  saveChanges: 'Guardar canvis',
  searchLoan: 'Cercar préstec…',
  startDate: 'Data d\'inici',
  synced: 'Sincronitzats',
  takePhotos: 'Fes fotos dels rebuts o puja imatges per registrar una devolució.',
  totalDeposited: 'Total ingressat',
  tryOtherFilters: 'Prova amb uns altres filtres.',
  unexpectedError: 'Error inesperat.',
};

const es: TranslationKeys = {
  appName: 'zGestiónPréstamos',
  appDescription: 'Gestión de préstamos personales',
  loading: 'Cargando…',
  loginTitle: 'Iniciar sesión',
  loginUser: 'Usuario',
  loginUserPlaceholder: 'Nombre de usuario',
  loginPin: 'PIN',
  loginEnter: 'Entrar',
  loginEntering: 'Entrando…',
  loginDefault: 'Por defecto: admin / 1234',
  loginNoAccount: '¿No tienes cuenta?',
  loginCreateAccount: 'Crear cuenta',
  loginErrorUser: 'Introduce el nombre de usuario',
  loginErrorPin: 'Introduce el PIN de 4 dígitos',
  loginErrorInvalid: 'Usuario o PIN incorrecto',
  loginErrorGeneric: 'Error inesperado. Inténtalo de nuevo.',
  loginSuccess: 'Sesión iniciada correctamente',
  registerTitle: 'Crear cuenta',
  registerSubtitle: 'Regístrate para gestionar tus préstamos',
  registerUsername: 'Nombre de usuario *',
  registerUsernamePlaceholder: 'Mínimo 3 caracteres',
  registerDisplayName: 'Nombre completo (opcional)',
  registerDisplayNamePlaceholder: 'Cómo quieres que te llamemos',
  registerPin: 'PIN de 4 dígitos *',
  registerPinConfirm: 'Repite el PIN *',
  registerSubmit: 'Crear cuenta',
  registerCreating: 'Creando…',
  registerHasAccount: '¿Ya tienes cuenta?',
  registerLogin: 'Inicia sesión',
  registerSuccess: '¡Cuenta creada correctamente!',
  registerErrorUsername: 'El usuario debe tener al menos 3 caracteres.',
  registerErrorPin: 'El PIN debe ser de 4 dígitos numéricos.',
  registerErrorPinMatch: 'Los PINs no coinciden.',
  registerErrorExists: 'Este nombre de usuario ya existe.',
  registerErrorGeneric: 'Error al crear la cuenta.',
  loansTitle: 'Mis préstamos',
  loansSearch: 'Buscar préstamo…',
  loansCreate: 'Crear',
  loansExport: 'Exportar',
  loansEmpty: 'Aún no tienes ningún préstamo',
  loansEmptyDesc: 'Crea tu primer préstamo para empezar a registrar devoluciones.',
  loansCreateFirst: 'Crear préstamo',
  loanLent: 'Prestado',
  loanReturned: 'Devuelto',
  loanPending: 'Pendiente',
  loanStart: 'Inicio',
  loanMovements: 'movimiento',
  loanMovements_plural: 'movimientos',
  loanFormTitleNew: 'Nuevo préstamo',
  loanFormTitleEdit: 'Editar préstamo',
  loanFormName: 'Nombre del préstamo',
  loanFormNamePlaceholder: 'ej. PRÉSTAMO BYD',
  loanFormLender: 'Prestador (quien presta)',
  loanFormLenderPlaceholder: 'Nombre del prestador',
  loanFormBorrower: 'Prestatario (quien recibe)',
  loanFormBorrowerPlaceholder: 'Nombre del prestatario',
  loanFormAmount: 'Importe prestado',
  loanFormCurrency: 'Moneda',
  loanFormStartDate: 'Fecha de inicio',
  loanFormStatus: 'Estado',
  loanFormNotes: 'Notas (opcional)',
  loanFormNotesPlaceholder: 'Detalles adicionales del préstamo…',
  loanFormCancel: 'Cancelar',
  loanFormSave: 'Guardar cambios',
  loanFormCreate: 'Crear préstamo',
  loanFormUpdated: 'Préstamo actualizado',
  loanFormCreated: 'Préstamo creado correctamente',
  loanFormErrorName: 'El nombre del préstamo es obligatorio',
  loanFormErrorAmount: 'El importe debe ser superior a 0',
  loanFormError: 'Error al guardar el préstamo',
  dashPending: 'Pendiente',
  dashTotalPaid: 'Total ingresado',
  dashPrincipal: 'Importe prestado',
  dashProgress: 'Progreso',
  dashLastPayment: 'Último ingreso',
  dashNoPayments: 'Aún no hay ningún ingreso registrado',
  dashNotes: 'Notas',
  dashMovements: 'Movimientos',
  dashStartDate: 'Fecha inicio',
  dashAddRecord: 'Añadir registro',
  dashHistory: 'Historial',
  dashEdit: 'Editar',
  dashCharts: 'Gráficos',
  dashPdf: 'PDF',
  dashExcel: 'Excel',
  dashDelete: 'Eliminar préstamo',
  dashDeleteTitle: '¿Eliminar préstamo?',
  dashDeleteMsg: 'Se eliminarán el préstamo y todos sus registros de pago. Esta acción no se puede deshacer.',
  dashDeleteConfirm: 'Sí, eliminar',
  dashDeleted: 'Préstamo eliminado',
  dashPdfOk: '¡PDF exportado!',
  dashExcelOk: '¡Excel exportado!',
  dashPdfError: 'Error exportando PDF',
  dashExcelError: 'Error exportando Excel',
  dashExportError: 'Error exportando',
  dashLoanNotFound: 'Préstamo no encontrado',
  dashBack: 'Volver a préstamos',
  newPayTitle: 'Nuevo registro',
  newPaySubtitle: 'Haz fotos de los recibos o sube imágenes para registrar una devolución.',
  newPayCamera: 'Cámara',
  newPayGallery: 'Galería',
  newPayImages: 'Imágenes',
  newPayProcess: 'Procesar con OCR',
  newPayManual: 'Introducir manualmente',
  newPayCancel: 'Cancelar',
  newPayNoImages: 'Añade al menos una imagen',
  newPayAdded: 'imagen añadida',
  newPayAdded_plural: 'imágenes añadidas',
  newPayNoValid: 'No se han encontrado imágenes válidas',
  newPayProcessing: 'Procesando OCR…',
  newPayInit: 'Inicializando OCR…',
  newPayProcessImg: 'Procesando imagen',
  newPayOf: 'de',
  newPayOcrDone: 'OCR completado',
  newPayOcrError: 'Error al procesar las imágenes. Puedes continuar manualmente.',
  newPayFront: 'Frente',
  newPayBack: 'Dorso',
  newPayExtra: 'Extra',
  reviewTitle: 'Revisión del registro',
  reviewDuplicate: 'Posible duplicado',
  reviewOcrConfidence: 'confianza OCR',
  reviewOcrView: 'Ver texto OCR',
  reviewOcrTitle: 'Texto OCR completo',
  reviewOcrEmpty: 'No se ha detectado texto.',
  reviewPaymentData: 'Datos del pago',
  reviewDate: 'Fecha',
  reviewTime: 'Hora',
  reviewAmount: 'Importe',
  reviewCurrency: 'Moneda',
  reviewMethod: 'Método de pago',
  reviewSender: 'Ordenante / Emisor',
  reviewSenderPlaceholder: 'Nombre de quien realiza el pago',
  reviewConcept: 'Concepto',
  reviewConceptPlaceholder: 'Concepto del movimiento',
  reviewBank: 'Banco',
  reviewBankPlaceholder: 'Nombre del banco',
  reviewIban: 'IBAN (parcial)',
  reviewIbanPlaceholder: 'ES12 **** **** 4567',
  reviewOpCode: 'Código operación',
  reviewRefCode: 'Referencia',
  reviewNotes: 'Notas (opcional)',
  reviewNotesPlaceholder: 'Notas adicionales…',
  reviewAccept: 'Aceptar y guardar',
  reviewSavePending: 'Guardar como pendiente',
  reviewGoBack: 'Volver atrás',
  reviewSaved: 'Registro aceptado y guardado',
  reviewSavedPending: 'Registro guardado como pendiente',
  reviewError: 'Error al guardar el registro',
  reviewErrorAmount: 'El importe debe ser superior a 0',
  reviewErrorDate: 'La fecha es obligatoria',
  historyTitle: 'Historial',
  historySearch: 'Buscar por concepto, banco, importe…',
  historyFilters: 'Filtros por fecha',
  historyFrom: 'Desde',
  historyTo: 'Hasta',
  historyClear: 'Limpiar filtros',
  historyRecords: 'registro',
  historyRecords_plural: 'registros',
  historyTotal: 'Total',
  historyEmpty: 'Ningún registro encontrado',
  historyEmptyDesc: 'Añade el primer registro de devolución.',
  historyEmptyFilter: 'Prueba con otros filtros.',
  historyAddRecord: 'Añadir registro',
  historyDetail: 'Detalle',
  historyReview: 'Revisar ✓',
  historyDelete: 'Borrar',
  historyDeleteTitle: '¿Borrar registro?',
  historyDeleteMsg: 'Se eliminarán el registro y todas sus imágenes. Esta acción no se puede deshacer.',
  historyDeleteConfirm: 'Sí, borrar',
  historyDeleted: 'Registro eliminado',
  historyReviewed: 'Marcado como revisado',
  historyImages: 'imagen',
  historyImages_plural: 'imágenes',
  detailTitle: 'Detalle del registro',
  detailAmount: 'Importe',
  detailImages: 'Imágenes',
  detailDetails: 'Detalles',
  detailSender: 'Ordenante',
  detailConcept: 'Concepto',
  detailBank: 'Banco',
  detailIban: 'IBAN',
  detailOpCode: 'Código operación',
  detailRefCode: 'Referencia',
  detailNotes: 'Notas',
  detailOcrConfidence: 'OCR confianza',
  detailOcrView: 'Ver OCR',
  detailMetadata: 'Metadatos',
  detailCreated: 'Creado',
  detailUpdated: 'Actualizado',
  detailEdit: 'Editar',
  detailDelete: 'Borrar',
  detailMarkReviewed: 'Marcar como revisado',
  detailEditTitle: 'Editar registro',
  detailSave: 'Guardar',
  detailRecordUpdated: 'Registro actualizado',
  detailRecordDeleted: 'Registro eliminado',
  detailNotFound: 'Registro no encontrado',
  chartsTitle: 'Gráficos',
  chartsReturned: 'devuelto',
  chartsPerPayment: 'Importe por pago',
  chartsCumulative: 'Evolución acumulada vs objetivo',
  chartsMonthly: 'Resumen mensual',
  chartsByMethod: 'Por método de pago',
  chartsNoData: 'Sin datos',
  chartsNoDataDesc: 'No hay pagos para mostrar gráficos.',
  chartsLoanNotFound: 'Préstamo no encontrado',
  chartsReturnedLabel: 'Devuelto',
  chartsGoalLabel: 'Objetivo',
  chartsTotalMonth: 'Total mes',
  cloudTitle: 'Configuración de la nube',
  cloudStatus: 'Estado de conexión',
  cloudConnected: 'Conectado',
  cloudDisconnected: 'Desconectado',
  cloudConnectDesc: 'Conecta un servicio en la nube para hacer copias de seguridad y sincronizar tus datos.',
  cloudProviders: 'Proveedores disponibles',
  cloudAvailable: 'Disponible',
  cloudComingSoon: 'Próximamente',
  cloudConnect: 'Conectar',
  cloudDisconnect: 'Desconectar',
  cloudSyncNow: 'Sincronizar ahora',
  cloudSyncStatus: 'Estado de sincronización',
  cloudPending: 'Pendientes',
  cloudSynced: 'Sincronizados',
  cloudErrors: 'Errores',
  cloudConflicts: 'Conflictos',
  cloudLastSync: 'Última',
  cloudViewErrors: 'Ver errores',
  cloudRetry: 'Reintentar',
  cloudHowTitle: 'Cómo funciona',
  cloudHow1: 'Los datos se guardan siempre primero localmente (offline-first).',
  cloudHow2: 'Al sincronizar, se suben a la nube todos los préstamos, registros e imágenes.',
  cloudHow3: 'Si hay conflictos, gana el registro más reciente.',
  cloudHow4: 'Las imágenes se guardan en la carpeta SHgestions de tu Drive.',
  cloudHow5: 'Ningún dato se borra nunca silenciosamente.',
  cloudConfigTitle: 'Configura Google Drive',
  cloudConfigDesc: 'Para conectar Google Drive necesitas un Client ID de Google.',
  cloudConfigHelp: 'Sigue los pasos del README o pide ayuda para configurarlo.',
  cloudClientId: 'Google Client ID',
  cloudClientIdPlaceholder: 'xxxxxxxxxxxx.apps.googleusercontent.com',
  cloudClientIdHint: 'Lo encontrarás en Google Cloud Console → Credenciales',
  cloudClientIdSaved: 'Client ID guardado. Ya puedes conectar.',
  cloudConnectedOk: '¡Conectado correctamente!',
  cloudErrorConnect: 'Error de conexión',
  cloudDisconnectedOk: 'Desconectado de la nube',
  cloudErrorDisconnect: 'Error al desconectar',
  cloudSyncError: 'Error de sincronización',
  cloudErrorsTitle: 'Errores de sincronización',
  cloudNoErrors: '¡Sin errores!',
  cloudRetried: 'elementos reintentados',
  cloudRetryError: 'Error al reintentar',
  langTitle: 'Idioma',
  langCurrent: 'Idioma actual',
  langSelect: 'Selecciona el idioma de la aplicación',
  cancel: 'Cancelar',
  confirm: 'Confirmar',
  save: 'Guardar',
  delete: 'Eliminar',
  edit: 'Editar',
  back: 'Atrás',
  close: 'Cerrar',
  search: 'Buscar',
  yes: 'Sí',
  no: 'No',
  of: 'de',
  errorGeneric: 'Error inesperado',
  errorUpdate: 'Error actualizando el registro',
  statusActive: 'Activo',
  statusFinished: 'Finalizado',
  statusPaused: 'Pausado',
  statusPending: 'Pendiente',
  statusReviewed: 'Revisado',
  statusRejected: 'Rechazado',
  methodCash: 'Efectivo',
  methodTransfer: 'Transferencia',
  methodBizum: 'Bizum',
  methodDeposit: 'Ingreso bancario',
  methodOther: 'Otro',
  themeLight: 'Modo claro',
  themeDark: 'Modo oscuro',
  logout: 'Salir',
  cloud: 'Nube',
  settings: 'Configuración',
};

const en: TranslationKeys = {
  appName: 'SHgestions',
  appDescription: 'Personal loan management',
  loading: 'Loading…',
  loginTitle: 'Sign in',
  loginUser: 'Username',
  loginUserPlaceholder: 'Your username',
  loginPin: 'PIN',
  loginEnter: 'Sign in',
  loginEntering: 'Signing in…',
  loginDefault: 'Default: admin / 1234',
  loginNoAccount: "Don't have an account?",
  loginCreateAccount: 'Create account',
  loginErrorUser: 'Enter your username',
  loginErrorPin: 'Enter your 4-digit PIN',
  loginErrorInvalid: 'Invalid username or PIN',
  loginErrorGeneric: 'Unexpected error. Please try again.',
  loginSuccess: 'Signed in successfully',
  registerTitle: 'Create account',
  registerSubtitle: 'Register to manage your loans',
  registerUsername: 'Username *',
  registerUsernamePlaceholder: 'At least 3 characters',
  registerDisplayName: 'Full name (optional)',
  registerDisplayNamePlaceholder: 'What should we call you',
  registerPin: '4-digit PIN *',
  registerPinConfirm: 'Repeat PIN *',
  registerSubmit: 'Create account',
  registerCreating: 'Creating…',
  registerHasAccount: 'Already have an account?',
  registerLogin: 'Sign in',
  registerSuccess: 'Account created successfully!',
  registerErrorUsername: 'Username must be at least 3 characters.',
  registerErrorPin: 'PIN must be 4 numeric digits.',
  registerErrorPinMatch: 'PINs do not match.',
  registerErrorExists: 'This username already exists.',
  registerErrorGeneric: 'Error creating account.',
  loansTitle: 'My loans',
  loansSearch: 'Search loan…',
  loansCreate: 'Create',
  loansExport: 'Export',
  loansEmpty: "You don't have any loans yet",
  loansEmptyDesc: 'Create your first loan to start recording repayments.',
  loansCreateFirst: 'Create loan',
  loanLent: 'Lent',
  loanReturned: 'Returned',
  loanPending: 'Pending',
  loanStart: 'Start',
  loanMovements: 'payment',
  loanMovements_plural: 'payments',
  loanFormTitleNew: 'New loan',
  loanFormTitleEdit: 'Edit loan',
  loanFormName: 'Loan name',
  loanFormNamePlaceholder: 'e.g. CAR LOAN',
  loanFormLender: 'Lender (who lends)',
  loanFormLenderPlaceholder: 'Lender name',
  loanFormBorrower: 'Borrower (who receives)',
  loanFormBorrowerPlaceholder: 'Borrower name',
  loanFormAmount: 'Amount lent',
  loanFormCurrency: 'Currency',
  loanFormStartDate: 'Start date',
  loanFormStatus: 'Status',
  loanFormNotes: 'Notes (optional)',
  loanFormNotesPlaceholder: 'Additional details…',
  loanFormCancel: 'Cancel',
  loanFormSave: 'Save changes',
  loanFormCreate: 'Create loan',
  loanFormUpdated: 'Loan updated',
  loanFormCreated: 'Loan created successfully',
  loanFormErrorName: 'Loan name is required',
  loanFormErrorAmount: 'Amount must be greater than 0',
  loanFormError: 'Error saving loan',
  dashPending: 'Pending',
  dashTotalPaid: 'Total paid',
  dashPrincipal: 'Amount lent',
  dashProgress: 'Progress',
  dashLastPayment: 'Last payment',
  dashNoPayments: 'No payments recorded yet',
  dashNotes: 'Notes',
  dashMovements: 'Payments',
  dashStartDate: 'Start date',
  dashAddRecord: 'Add record',
  dashHistory: 'History',
  dashEdit: 'Edit',
  dashCharts: 'Charts',
  dashPdf: 'PDF',
  dashExcel: 'Excel',
  dashDelete: 'Delete loan',
  dashDeleteTitle: 'Delete loan?',
  dashDeleteMsg: 'The loan and all payment records will be deleted. This cannot be undone.',
  dashDeleteConfirm: 'Yes, delete',
  dashDeleted: 'Loan deleted',
  dashPdfOk: 'PDF exported!',
  dashExcelOk: 'Excel exported!',
  dashPdfError: 'Error exporting PDF',
  dashExcelError: 'Error exporting Excel',
  dashExportError: 'Error exporting',
  dashLoanNotFound: 'Loan not found',
  dashBack: 'Back to loans',
  newPayTitle: 'New record',
  newPaySubtitle: 'Take photos of receipts or upload images to record a repayment.',
  newPayCamera: 'Camera',
  newPayGallery: 'Gallery',
  newPayImages: 'Images',
  newPayProcess: 'Process with OCR',
  newPayManual: 'Enter manually',
  newPayCancel: 'Cancel',
  newPayNoImages: 'Add at least one image',
  newPayAdded: 'image added',
  newPayAdded_plural: 'images added',
  newPayNoValid: 'No valid images found',
  newPayProcessing: 'Processing OCR…',
  newPayInit: 'Initializing OCR…',
  newPayProcessImg: 'Processing image',
  newPayOf: 'of',
  newPayOcrDone: 'OCR completed',
  newPayOcrError: 'Error processing images. You can continue manually.',
  newPayFront: 'Front',
  newPayBack: 'Back',
  newPayExtra: 'Extra',
  reviewTitle: 'Review record',
  reviewDuplicate: 'Possible duplicate',
  reviewOcrConfidence: 'OCR confidence',
  reviewOcrView: 'View OCR text',
  reviewOcrTitle: 'Full OCR text',
  reviewOcrEmpty: 'No text detected.',
  reviewPaymentData: 'Payment data',
  reviewDate: 'Date',
  reviewTime: 'Time',
  reviewAmount: 'Amount',
  reviewCurrency: 'Currency',
  reviewMethod: 'Payment method',
  reviewSender: 'Sender',
  reviewSenderPlaceholder: 'Name of payer',
  reviewConcept: 'Concept',
  reviewConceptPlaceholder: 'Payment concept',
  reviewBank: 'Bank',
  reviewBankPlaceholder: 'Bank name',
  reviewIban: 'IBAN (partial)',
  reviewIbanPlaceholder: 'ES12 **** **** 4567',
  reviewOpCode: 'Operation code',
  reviewRefCode: 'Reference',
  reviewNotes: 'Notes (optional)',
  reviewNotesPlaceholder: 'Additional notes…',
  reviewAccept: 'Accept and save',
  reviewSavePending: 'Save as pending',
  reviewGoBack: 'Go back',
  reviewSaved: 'Record accepted and saved',
  reviewSavedPending: 'Record saved as pending',
  reviewError: 'Error saving record',
  reviewErrorAmount: 'Amount must be greater than 0',
  reviewErrorDate: 'Date is required',
  historyTitle: 'History',
  historySearch: 'Search by concept, bank, amount…',
  historyFilters: 'Date filters',
  historyFrom: 'From',
  historyTo: 'To',
  historyClear: 'Clear filters',
  historyRecords: 'record',
  historyRecords_plural: 'records',
  historyTotal: 'Total',
  historyEmpty: 'No records found',
  historyEmptyDesc: 'Add the first repayment record.',
  historyEmptyFilter: 'Try different filters.',
  historyAddRecord: 'Add record',
  historyDetail: 'Detail',
  historyReview: 'Review ✓',
  historyDelete: 'Delete',
  historyDeleteTitle: 'Delete record?',
  historyDeleteMsg: 'The record and all its images will be deleted. This cannot be undone.',
  historyDeleteConfirm: 'Yes, delete',
  historyDeleted: 'Record deleted',
  historyReviewed: 'Marked as reviewed',
  historyImages: 'image',
  historyImages_plural: 'images',
  detailTitle: 'Record detail',
  detailAmount: 'Amount',
  detailImages: 'Images',
  detailDetails: 'Details',
  detailSender: 'Sender',
  detailConcept: 'Concept',
  detailBank: 'Bank',
  detailIban: 'IBAN',
  detailOpCode: 'Operation code',
  detailRefCode: 'Reference',
  detailNotes: 'Notes',
  detailOcrConfidence: 'OCR confidence',
  detailOcrView: 'View OCR',
  detailMetadata: 'Metadata',
  detailCreated: 'Created',
  detailUpdated: 'Updated',
  detailEdit: 'Edit',
  detailDelete: 'Delete',
  detailMarkReviewed: 'Mark as reviewed',
  detailEditTitle: 'Edit record',
  detailSave: 'Save',
  detailRecordUpdated: 'Record updated',
  detailRecordDeleted: 'Record deleted',
  detailNotFound: 'Record not found',
  chartsTitle: 'Charts',
  chartsReturned: 'returned',
  chartsPerPayment: 'Amount per payment',
  chartsCumulative: 'Cumulative vs target',
  chartsMonthly: 'Monthly summary',
  chartsByMethod: 'By payment method',
  chartsNoData: 'No data',
  chartsNoDataDesc: 'No payments to show charts.',
  chartsLoanNotFound: 'Loan not found',
  chartsReturnedLabel: 'Returned',
  chartsGoalLabel: 'Target',
  chartsTotalMonth: 'Month total',
  cloudTitle: 'Cloud settings',
  cloudStatus: 'Connection status',
  cloudConnected: 'Connected',
  cloudDisconnected: 'Disconnected',
  cloudConnectDesc: 'Connect a cloud service to backup and sync your data.',
  cloudProviders: 'Available providers',
  cloudAvailable: 'Available',
  cloudComingSoon: 'Coming soon',
  cloudConnect: 'Connect',
  cloudDisconnect: 'Disconnect',
  cloudSyncNow: 'Sync now',
  cloudSyncStatus: 'Sync status',
  cloudPending: 'Pending',
  cloudSynced: 'Synced',
  cloudErrors: 'Errors',
  cloudConflicts: 'Conflicts',
  cloudLastSync: 'Last',
  cloudViewErrors: 'View errors',
  cloudRetry: 'Retry',
  cloudHowTitle: 'How it works',
  cloudHow1: 'Data is always saved locally first (offline-first).',
  cloudHow2: 'When syncing, all loans, records and images are uploaded to the cloud.',
  cloudHow3: 'If there are conflicts, the most recent record wins.',
  cloudHow4: 'Images are stored in the SHgestions folder in your Drive.',
  cloudHow5: 'No data is ever deleted silently.',
  cloudConfigTitle: 'Configure Google Drive',
  cloudConfigDesc: 'To connect Google Drive you need a Google Client ID.',
  cloudConfigHelp: 'Follow the README steps or ask for help.',
  cloudClientId: 'Google Client ID',
  cloudClientIdPlaceholder: 'xxxxxxxxxxxx.apps.googleusercontent.com',
  cloudClientIdHint: "Find it in Google Cloud Console → Credentials",
  cloudClientIdSaved: 'Client ID saved. You can now connect.',
  cloudConnectedOk: 'Connected successfully!',
  cloudErrorConnect: 'Connection error',
  cloudDisconnectedOk: 'Disconnected from cloud',
  cloudErrorDisconnect: 'Error disconnecting',
  cloudSyncError: 'Sync error',
  cloudErrorsTitle: 'Sync errors',
  cloudNoErrors: 'No errors!',
  cloudRetried: 'items retried',
  cloudRetryError: 'Error retrying',
  langTitle: 'Language',
  langCurrent: 'Current language',
  langSelect: 'Select the application language',
  cancel: 'Cancel',
  confirm: 'Confirm',
  save: 'Save',
  delete: 'Delete',
  edit: 'Edit',
  back: 'Back',
  close: 'Close',
  search: 'Search',
  yes: 'Yes',
  no: 'No',
  of: 'of',
  errorGeneric: 'Unexpected error',
  errorUpdate: 'Error updating record',
  statusActive: 'Active',
  statusFinished: 'Finished',
  statusPaused: 'Paused',
  statusPending: 'Pending',
  statusReviewed: 'Reviewed',
  statusRejected: 'Rejected',
  methodCash: 'Cash',
  methodTransfer: 'Transfer',
  methodBizum: 'Bizum',
  methodDeposit: 'Bank deposit',
  methodOther: 'Other',
  themeLight: 'Light mode',
  themeDark: 'Dark mode',
  logout: 'Sign out',
  cloud: 'Cloud',
  settings: 'Settings',
};

// For brevity, remaining languages use a factory that copies 'en' and overrides key fields
function makeLang(base: TranslationKeys, overrides: Partial<TranslationKeys>): TranslationKeys {
  return { ...base, ...overrides };
}

const fr = makeLang(en, {
  appName: 'SHgestions', appDescription: 'Gestion de prêts personnels', loading: 'Chargement…',
  loginTitle: 'Connexion', loginUser: 'Utilisateur', loginUserPlaceholder: "Nom d'utilisateur",
  loginPin: 'PIN', loginEnter: 'Entrer', loginEntering: 'Connexion…', loginDefault: 'Par défaut : admin / 1234',
  loginNoAccount: "Pas de compte ?", loginCreateAccount: 'Créer un compte',
  loginErrorUser: "Entrez le nom d'utilisateur", loginErrorPin: 'Entrez le PIN à 4 chiffres',
  loginErrorInvalid: 'Utilisateur ou PIN incorrect', loginSuccess: 'Connecté avec succès',
  registerTitle: 'Créer un compte', registerSubtitle: 'Inscrivez-vous pour gérer vos prêts',
  registerUsername: "Nom d'utilisateur *", registerPin: 'PIN à 4 chiffres *', registerPinConfirm: 'Répéter le PIN *',
  registerSubmit: 'Créer un compte', registerHasAccount: 'Déjà un compte ?', registerLogin: 'Se connecter',
  registerSuccess: 'Compte créé avec succès !',
  loansTitle: 'Mes prêts', loansSearch: 'Rechercher…', loansCreate: 'Créer', loansExport: 'Exporter',
  loansEmpty: "Vous n'avez aucun prêt", loansCreateFirst: 'Créer un prêt',
  loanLent: 'Prêté', loanReturned: 'Remboursé', loanPending: 'En attente',
  loanFormTitleNew: 'Nouveau prêt', loanFormTitleEdit: 'Modifier le prêt',
  dashPending: 'En attente', dashTotalPaid: 'Total remboursé', dashAddRecord: 'Ajouter',
  dashHistory: 'Historique', dashEdit: 'Modifier', dashCharts: 'Graphiques', dashDelete: 'Supprimer le prêt',
  newPayTitle: 'Nouvel enregistrement', newPayCamera: 'Caméra', newPayGallery: 'Galerie',
  newPayProcess: "Traiter par OCR", newPayManual: 'Saisie manuelle',
  reviewTitle: "Vérification de l'enregistrement", reviewAccept: 'Accepter et sauvegarder',
  historyTitle: 'Historique', chartsTitle: 'Graphiques',
  cloudTitle: 'Configuration cloud', cloudSyncNow: 'Synchroniser',
  langTitle: 'Langue', langCurrent: 'Langue actuelle', langSelect: "Sélectionnez la langue de l'application",
  cancel: 'Annuler', save: 'Enregistrer', delete: 'Supprimer', edit: 'Modifier',
  back: 'Retour', close: 'Fermer', search: 'Rechercher',
  statusActive: 'Actif', statusFinished: 'Terminé', statusPaused: 'En pause',
  statusPending: 'En attente', statusReviewed: 'Vérifié', statusRejected: 'Rejeté',
  methodCash: 'Espèces', methodTransfer: 'Virement', methodDeposit: 'Dépôt bancaire', methodOther: 'Autre',
  logout: 'Déconnexion', cloud: 'Cloud', settings: 'Paramètres',
});

const de = makeLang(en, {
  appName: 'zDarlehensVerwaltung', appDescription: 'Persönliche Darlehensverwaltung', loading: 'Laden…',
  loginTitle: 'Anmelden', loginUser: 'Benutzer', loginUserPlaceholder: 'Benutzername',
  loginEnter: 'Einloggen', loginDefault: 'Standard: admin / 1234',
  loginNoAccount: 'Kein Konto?', loginCreateAccount: 'Konto erstellen',
  loginSuccess: 'Erfolgreich angemeldet',
  registerTitle: 'Konto erstellen', registerSubmit: 'Konto erstellen',
  registerHasAccount: 'Bereits ein Konto?', registerLogin: 'Anmelden',
  loansTitle: 'Meine Darlehen', loansCreate: 'Erstellen', loansExport: 'Exportieren',
  loansEmpty: 'Noch keine Darlehen', loansCreateFirst: 'Darlehen erstellen',
  loanLent: 'Verliehen', loanReturned: 'Zurückgezahlt', loanPending: 'Ausstehend',
  dashPending: 'Ausstehend', dashTotalPaid: 'Gesamt zurückgezahlt', dashAddRecord: 'Hinzufügen',
  dashHistory: 'Verlauf', dashEdit: 'Bearbeiten', dashCharts: 'Diagramme', dashDelete: 'Darlehen löschen',
  newPayTitle: 'Neuer Eintrag', newPayCamera: 'Kamera', newPayGallery: 'Galerie',
  reviewTitle: 'Eintrag überprüfen', reviewAccept: 'Akzeptieren und speichern',
  historyTitle: 'Verlauf', chartsTitle: 'Diagramme',
  cloudTitle: 'Cloud-Einstellungen', cloudSyncNow: 'Jetzt synchronisieren',
  langTitle: 'Sprache', langCurrent: 'Aktuelle Sprache', langSelect: 'Wählen Sie die Anwendungssprache',
  cancel: 'Abbrechen', save: 'Speichern', delete: 'Löschen', edit: 'Bearbeiten',
  back: 'Zurück', close: 'Schließen', search: 'Suchen',
  statusActive: 'Aktiv', statusFinished: 'Abgeschlossen', statusPaused: 'Pausiert',
  logout: 'Abmelden', cloud: 'Cloud', settings: 'Einstellungen',
});

const it = makeLang(en, {
  appName: 'SHgestions', appDescription: 'Gestione prestiti personali', loading: 'Caricamento…',
  loginTitle: 'Accedi', loginUser: 'Utente', loginEnter: 'Accedi', loginDefault: 'Predefinito: admin / 1234',
  loginNoAccount: 'Non hai un account?', loginCreateAccount: 'Crea account', loginSuccess: 'Accesso effettuato',
  registerTitle: 'Crea account', registerSubmit: 'Crea account',
  loansTitle: 'I miei prestiti', loansCreate: 'Crea', loansExport: 'Esporta',
  loansEmpty: 'Nessun prestito', loansCreateFirst: 'Crea prestito',
  loanLent: 'Prestato', loanReturned: 'Restituito', loanPending: 'In sospeso',
  dashPending: 'In sospeso', dashTotalPaid: 'Totale rimborsato', dashAddRecord: 'Aggiungi',
  dashHistory: 'Cronologia', dashEdit: 'Modifica', dashCharts: 'Grafici', dashDelete: 'Elimina prestito',
  newPayTitle: 'Nuovo registro', newPayCamera: 'Fotocamera', newPayGallery: 'Galleria',
  reviewTitle: 'Revisione registro', reviewAccept: 'Accetta e salva',
  historyTitle: 'Cronologia', chartsTitle: 'Grafici',
  cloudTitle: 'Impostazioni cloud', cloudSyncNow: 'Sincronizza ora',
  langTitle: 'Lingua', langCurrent: 'Lingua corrente', langSelect: "Seleziona la lingua dell'applicazione",
  cancel: 'Annulla', save: 'Salva', delete: 'Elimina', edit: 'Modifica',
  back: 'Indietro', close: 'Chiudi', search: 'Cerca',
  logout: 'Esci', cloud: 'Cloud', settings: 'Impostazioni',
});

const pt = makeLang(en, {
  appName: 'SHgestions', appDescription: 'Gestão de empréstimos pessoais', loading: 'Carregando…',
  loginTitle: 'Entrar', loginUser: 'Utilizador', loginEnter: 'Entrar', loginDefault: 'Padrão: admin / 1234',
  loginNoAccount: 'Não tem conta?', loginCreateAccount: 'Criar conta', loginSuccess: 'Sessão iniciada',
  registerTitle: 'Criar conta', registerSubmit: 'Criar conta',
  loansTitle: 'Os meus empréstimos', loansCreate: 'Criar', loansExport: 'Exportar',
  loansEmpty: 'Ainda não tem empréstimos', loansCreateFirst: 'Criar empréstimo',
  loanLent: 'Emprestado', loanReturned: 'Devolvido', loanPending: 'Pendente',
  dashPending: 'Pendente', dashTotalPaid: 'Total devolvido', dashAddRecord: 'Adicionar',
  dashHistory: 'Histórico', dashEdit: 'Editar', dashCharts: 'Gráficos', dashDelete: 'Eliminar empréstimo',
  newPayTitle: 'Novo registo', newPayCamera: 'Câmara', newPayGallery: 'Galeria',
  reviewTitle: 'Revisão do registo', reviewAccept: 'Aceitar e guardar',
  historyTitle: 'Histórico', chartsTitle: 'Gráficos',
  cloudTitle: 'Configuração da nuvem', cloudSyncNow: 'Sincronizar agora',
  langTitle: 'Idioma', langCurrent: 'Idioma atual', langSelect: 'Selecione o idioma da aplicação',
  cancel: 'Cancelar', save: 'Guardar', delete: 'Eliminar', edit: 'Editar',
  back: 'Voltar', close: 'Fechar', search: 'Pesquisar',
  logout: 'Sair', cloud: 'Nuvem', settings: 'Definições',
});

const nl = makeLang(en, {
  appName: 'SHgestions', appDescription: 'Persoonlijk leningbeheer', loading: 'Laden…',
  loginTitle: 'Inloggen', loginUser: 'Gebruiker', loginEnter: 'Inloggen', loginDefault: 'Standaard: admin / 1234',
  loginNoAccount: 'Geen account?', loginCreateAccount: 'Account aanmaken', loginSuccess: 'Succesvol ingelogd',
  registerTitle: 'Account aanmaken', registerSubmit: 'Account aanmaken',
  loansTitle: 'Mijn leningen', loansCreate: 'Aanmaken', loansExport: 'Exporteren',
  loansEmpty: 'Nog geen leningen', loansCreateFirst: 'Lening aanmaken',
  loanLent: 'Uitgeleend', loanReturned: 'Terugbetaald', loanPending: 'Openstaand',
  dashPending: 'Openstaand', dashTotalPaid: 'Totaal terugbetaald', dashAddRecord: 'Toevoegen',
  dashHistory: 'Geschiedenis', dashEdit: 'Bewerken', dashCharts: 'Grafieken', dashDelete: 'Lening verwijderen',
  newPayTitle: 'Nieuw record', newPayCamera: 'Camera', newPayGallery: 'Galerij',
  reviewTitle: 'Record controleren', reviewAccept: 'Accepteren en opslaan',
  historyTitle: 'Geschiedenis', chartsTitle: 'Grafieken',
  cloudTitle: 'Cloud-instellingen', cloudSyncNow: 'Nu synchroniseren',
  langTitle: 'Taal', langCurrent: 'Huidige taal', langSelect: 'Selecteer de applicatietaal',
  cancel: 'Annuleren', save: 'Opslaan', delete: 'Verwijderen', edit: 'Bewerken',
  back: 'Terug', close: 'Sluiten', search: 'Zoeken',
  logout: 'Uitloggen', cloud: 'Cloud', settings: 'Instellingen',
});

const ar = makeLang(en, {
  appName: 'SHgestions', appDescription: 'إدارة القروض الشخصية', loading: '...جاري التحميل',
  loginTitle: 'تسجيل الدخول', loginUser: 'المستخدم', loginUserPlaceholder: 'اسم المستخدم',
  loginPin: 'رمز PIN', loginEnter: 'دخول', loginEntering: '...جاري الدخول',
  loginDefault: 'افتراضي: admin / 1234',
  loginNoAccount: 'ليس لديك حساب؟', loginCreateAccount: 'إنشاء حساب',
  loginErrorUser: 'أدخل اسم المستخدم', loginErrorPin: 'أدخل رمز PIN المكون من 4 أرقام',
  loginErrorInvalid: 'اسم المستخدم أو رمز PIN غير صحيح', loginSuccess: 'تم تسجيل الدخول بنجاح',
  registerTitle: 'إنشاء حساب', registerSubtitle: 'سجّل لإدارة قروضك',
  registerUsername: '* اسم المستخدم', registerUsernamePlaceholder: '3 أحرف على الأقل',
  registerDisplayName: 'الاسم الكامل (اختياري)', registerPin: '* رمز PIN من 4 أرقام',
  registerPinConfirm: '* كرر رمز PIN', registerSubmit: 'إنشاء حساب',
  registerHasAccount: 'لديك حساب بالفعل؟', registerLogin: 'تسجيل الدخول',
  registerSuccess: '!تم إنشاء الحساب بنجاح',
  loansTitle: 'قروضي', loansSearch: '...بحث عن قرض', loansCreate: 'إنشاء', loansExport: 'تصدير',
  loansEmpty: 'لا توجد قروض بعد', loansCreateFirst: 'إنشاء قرض',
  loanLent: 'مُقرض', loanReturned: 'مُسترد', loanPending: 'معلّق',
  loanFormTitleNew: 'قرض جديد', loanFormTitleEdit: 'تعديل القرض',
  dashPending: 'معلّق', dashTotalPaid: 'إجمالي المدفوع', dashAddRecord: 'إضافة سجل',
  dashHistory: 'السجل', dashEdit: 'تعديل', dashCharts: 'رسوم بيانية', dashDelete: 'حذف القرض',
  dashDeleteTitle: 'حذف القرض؟', dashDeleteConfirm: 'نعم، حذف',
  newPayTitle: 'سجل جديد', newPayCamera: 'الكاميرا', newPayGallery: 'المعرض',
  newPayProcess: 'معالجة بـ OCR', newPayManual: 'إدخال يدوي',
  reviewTitle: 'مراجعة السجل', reviewAccept: 'قبول وحفظ',
  reviewDate: 'التاريخ', reviewTime: 'الوقت', reviewAmount: 'المبلغ',
  historyTitle: 'السجل', chartsTitle: 'رسوم بيانية',
  cloudTitle: 'إعدادات السحابة', cloudSyncNow: 'مزامنة الآن',
  cloudConnected: 'متصل', cloudDisconnected: 'غير متصل',
  langTitle: 'اللغة', langCurrent: 'اللغة الحالية', langSelect: 'اختر لغة التطبيق',
  cancel: 'إلغاء', save: 'حفظ', delete: 'حذف', edit: 'تعديل',
  back: 'رجوع', close: 'إغلاق', search: 'بحث',
  yes: 'نعم', no: 'لا',
  statusActive: 'نشط', statusFinished: 'مكتمل', statusPaused: 'متوقف',
  statusPending: 'معلّق', statusReviewed: 'مراجَع', statusRejected: 'مرفوض',
  methodCash: 'نقدي', methodTransfer: 'تحويل', methodDeposit: 'إيداع بنكي', methodOther: 'أخرى',
  logout: 'خروج', cloud: 'سحابة', settings: 'إعدادات',
});


// ─── Missing key aliases (auto-generated) ───
if (!(ca as any).addAtLeastOneImage) (ca as any).addAtLeastOneImage = 'Afegeix almenys una imatge';
if (!(es as any).addAtLeastOneImage) (es as any).addAtLeastOneImage = 'Añade al menos una imagen';
if (!(en as any).addAtLeastOneImage) (en as any).addAtLeastOneImage = 'Add at least one image';
if (!(fr as any).addAtLeastOneImage) (fr as any).addAtLeastOneImage = 'Ajoutez au moins une image';
if (!(de as any).addAtLeastOneImage) (de as any).addAtLeastOneImage = 'Mindestens ein Bild hinzufügen';
if (!(it as any).addAtLeastOneImage) (it as any).addAtLeastOneImage = 'Aggiungi almeno un\'immagine';
if (!(pt as any).addAtLeastOneImage) (pt as any).addAtLeastOneImage = 'Adicione pelo menos uma imagem';
if (!(nl as any).addAtLeastOneImage) (nl as any).addAtLeastOneImage = 'Voeg minimaal één afbeelding toe';
if (!(ar as any).addAtLeastOneImage) (ar as any).addAtLeastOneImage = 'أضف صورة واحدة على الأقل';
if (!(ca as any).addRecord) (ca as any).addRecord = 'Afegir registre';
if (!(es as any).addRecord) (es as any).addRecord = 'Añadir registro';
if (!(en as any).addRecord) (en as any).addRecord = 'Add record';
if (!(fr as any).addRecord) (fr as any).addRecord = 'Ajouter';
if (!(de as any).addRecord) (de as any).addRecord = 'Hinzufügen';
if (!(it as any).addRecord) (it as any).addRecord = 'Aggiungi';
if (!(pt as any).addRecord) (pt as any).addRecord = 'Adicionar';
if (!(nl as any).addRecord) (nl as any).addRecord = 'Toevoegen';
if (!(ar as any).addRecord) (ar as any).addRecord = 'إضافة سجل';
if (!(ca as any).amountMustBePositive) (ca as any).amountMustBePositive = 'L\'import ha de ser superior a 0';
if (!(es as any).amountMustBePositive) (es as any).amountMustBePositive = 'El importe debe ser mayor que 0';
if (!(en as any).amountMustBePositive) (en as any).amountMustBePositive = 'Amount must be greater than 0';
if (!(fr as any).amountMustBePositive) (fr as any).amountMustBePositive = 'Le montant doit être supérieur à 0';
if (!(de as any).amountMustBePositive) (de as any).amountMustBePositive = 'Betrag muss größer als 0 sein';
if (!(it as any).amountMustBePositive) (it as any).amountMustBePositive = 'L\'importo deve essere maggiore di 0';
if (!(pt as any).amountMustBePositive) (pt as any).amountMustBePositive = 'O valor deve ser superior a 0';
if (!(nl as any).amountMustBePositive) (nl as any).amountMustBePositive = 'Bedrag moet groter zijn dan 0';
if (!(ar as any).amountMustBePositive) (ar as any).amountMustBePositive = 'يجب أن يكون المبلغ أكبر من 0';
if (!(ca as any).charts) (ca as any).charts = 'Gràfics';
if (!(es as any).charts) (es as any).charts = 'Gráficos';
if (!(en as any).charts) (en as any).charts = 'Charts';
if (!(fr as any).charts) (fr as any).charts = 'Graphiques';
if (!(de as any).charts) (de as any).charts = 'Diagramme';
if (!(it as any).charts) (it as any).charts = 'Grafici';
if (!(pt as any).charts) (pt as any).charts = 'Gráficos';
if (!(nl as any).charts) (nl as any).charts = 'Grafieken';
if (!(ar as any).charts) (ar as any).charts = 'الرسوم البيانية';
if (!(ca as any).clientIdSaved) (ca as any).clientIdSaved = 'Client ID guardat. Ara pots connectar.';
if (!(es as any).clientIdSaved) (es as any).clientIdSaved = 'Client ID guardado.';
if (!(en as any).clientIdSaved) (en as any).clientIdSaved = 'Client ID saved.';
if (!(fr as any).clientIdSaved) (fr as any).clientIdSaved = 'Client ID enregistré.';
if (!(de as any).clientIdSaved) (de as any).clientIdSaved = 'Client ID gespeichert.';
if (!(it as any).clientIdSaved) (it as any).clientIdSaved = 'Client ID salvato.';
if (!(pt as any).clientIdSaved) (pt as any).clientIdSaved = 'Client ID salvo.';
if (!(nl as any).clientIdSaved) (nl as any).clientIdSaved = 'Client ID opgeslagen.';
if (!(ar as any).clientIdSaved) (ar as any).clientIdSaved = 'تم حفظ معرف العميل.';
if (!(ca as any).conflicts) (ca as any).conflicts = 'Conflictes';
if (!(es as any).conflicts) (es as any).conflicts = 'Conflictos';
if (!(en as any).conflicts) (en as any).conflicts = 'Conflicts';
if (!(fr as any).conflicts) (fr as any).conflicts = 'Conflits';
if (!(de as any).conflicts) (de as any).conflicts = 'Konflikte';
if (!(it as any).conflicts) (it as any).conflicts = 'Conflitti';
if (!(pt as any).conflicts) (pt as any).conflicts = 'Conflitos';
if (!(nl as any).conflicts) (nl as any).conflicts = 'Conflicten';
if (!(ar as any).conflicts) (ar as any).conflicts = 'تعارضات';
if (!(ca as any).connectedSuccess) (ca as any).connectedSuccess = 'Connectat correctament!';
if (!(es as any).connectedSuccess) (es as any).connectedSuccess = '¡Conectado!';
if (!(en as any).connectedSuccess) (en as any).connectedSuccess = 'Connected!';
if (!(fr as any).connectedSuccess) (fr as any).connectedSuccess = 'Connecté !';
if (!(de as any).connectedSuccess) (de as any).connectedSuccess = 'Verbunden!';
if (!(it as any).connectedSuccess) (it as any).connectedSuccess = 'Connesso!';
if (!(pt as any).connectedSuccess) (pt as any).connectedSuccess = 'Conectado!';
if (!(nl as any).connectedSuccess) (nl as any).connectedSuccess = 'Verbonden!';
if (!(ar as any).connectedSuccess) (ar as any).connectedSuccess = 'تم الاتصال!';
if (!(ca as any).connectionStatus) (ca as any).connectionStatus = 'Estat de connexió';
if (!(es as any).connectionStatus) (es as any).connectionStatus = 'Estado de conexión';
if (!(en as any).connectionStatus) (en as any).connectionStatus = 'Connection status';
if (!(fr as any).connectionStatus) (fr as any).connectionStatus = 'État de connexion';
if (!(de as any).connectionStatus) (de as any).connectionStatus = 'Verbindungsstatus';
if (!(it as any).connectionStatus) (it as any).connectionStatus = 'Stato connessione';
if (!(pt as any).connectionStatus) (pt as any).connectionStatus = 'Estado da conexão';
if (!(nl as any).connectionStatus) (nl as any).connectionStatus = 'Verbindingsstatus';
if (!(ar as any).connectionStatus) (ar as any).connectionStatus = 'حالة الاتصال';
if (!(ca as any).createLoan) (ca as any).createLoan = 'Crear';
if (!(es as any).createLoan) (es as any).createLoan = 'Crear';
if (!(en as any).createLoan) (en as any).createLoan = 'Create';
if (!(fr as any).createLoan) (fr as any).createLoan = 'Créer';
if (!(de as any).createLoan) (de as any).createLoan = 'Erstellen';
if (!(it as any).createLoan) (it as any).createLoan = 'Crea';
if (!(pt as any).createLoan) (pt as any).createLoan = 'Criar';
if (!(nl as any).createLoan) (nl as any).createLoan = 'Aanmaken';
if (!(ar as any).createLoan) (ar as any).createLoan = 'إنشاء';
if (!(ca as any).dateFrom) (ca as any).dateFrom = 'Des de';
if (!(es as any).dateFrom) (es as any).dateFrom = 'Desde';
if (!(en as any).dateFrom) (en as any).dateFrom = 'From';
if (!(fr as any).dateFrom) (fr as any).dateFrom = 'Du';
if (!(de as any).dateFrom) (de as any).dateFrom = 'Von';
if (!(it as any).dateFrom) (it as any).dateFrom = 'Dal';
if (!(pt as any).dateFrom) (pt as any).dateFrom = 'De';
if (!(nl as any).dateFrom) (nl as any).dateFrom = 'Van';
if (!(ar as any).dateFrom) (ar as any).dateFrom = 'من';
if (!(ca as any).dateRequired) (ca as any).dateRequired = 'La data és obligatòria';
if (!(es as any).dateRequired) (es as any).dateRequired = 'La fecha es obligatoria';
if (!(en as any).dateRequired) (en as any).dateRequired = 'Date is required';
if (!(fr as any).dateRequired) (fr as any).dateRequired = 'La date est obligatoire';
if (!(de as any).dateRequired) (de as any).dateRequired = 'Datum ist erforderlich';
if (!(it as any).dateRequired) (it as any).dateRequired = 'La data è obbligatoria';
if (!(pt as any).dateRequired) (pt as any).dateRequired = 'A data é obrigatória';
if (!(nl as any).dateRequired) (nl as any).dateRequired = 'Datum is verplicht';
if (!(ar as any).dateRequired) (ar as any).dateRequired = 'التاريخ مطلوب';
if (!(ca as any).dateTo) (ca as any).dateTo = 'Fins a';
if (!(es as any).dateTo) (es as any).dateTo = 'Hasta';
if (!(en as any).dateTo) (en as any).dateTo = 'To';
if (!(fr as any).dateTo) (fr as any).dateTo = 'Au';
if (!(de as any).dateTo) (de as any).dateTo = 'Bis';
if (!(it as any).dateTo) (it as any).dateTo = 'Al';
if (!(pt as any).dateTo) (pt as any).dateTo = 'Até';
if (!(nl as any).dateTo) (nl as any).dateTo = 'Tot';
if (!(ar as any).dateTo) (ar as any).dateTo = 'إلى';
if (!(ca as any).deleteLoan) (ca as any).deleteLoan = 'Eliminar préstec?';
if (!(es as any).deleteLoan) (es as any).deleteLoan = '¿Eliminar préstamo?';
if (!(en as any).deleteLoan) (en as any).deleteLoan = 'Delete loan?';
if (!(fr as any).deleteLoan) (fr as any).deleteLoan = 'Supprimer le prêt ?';
if (!(de as any).deleteLoan) (de as any).deleteLoan = 'Darlehen löschen?';
if (!(it as any).deleteLoan) (it as any).deleteLoan = 'Eliminare il prestito?';
if (!(pt as any).deleteLoan) (pt as any).deleteLoan = 'Excluir empréstimo?';
if (!(nl as any).deleteLoan) (nl as any).deleteLoan = 'Lening verwijderen?';
if (!(ar as any).deleteLoan) (ar as any).deleteLoan = 'حذف القرض؟';
if (!(ca as any).deleteRecord) (ca as any).deleteRecord = 'Esborrar registre?';
if (!(es as any).deleteRecord) (es as any).deleteRecord = '¿Borrar registro?';
if (!(en as any).deleteRecord) (en as any).deleteRecord = 'Delete record?';
if (!(fr as any).deleteRecord) (fr as any).deleteRecord = 'Supprimer l\'enregistrement ?';
if (!(de as any).deleteRecord) (de as any).deleteRecord = 'Eintrag löschen?';
if (!(it as any).deleteRecord) (it as any).deleteRecord = 'Eliminare il record?';
if (!(pt as any).deleteRecord) (pt as any).deleteRecord = 'Excluir registo?';
if (!(nl as any).deleteRecord) (nl as any).deleteRecord = 'Record verwijderen?';
if (!(ar as any).deleteRecord) (ar as any).deleteRecord = 'حذف السجل؟';
if (!(ca as any).details) (ca as any).details = 'Detalls';
if (!(es as any).details) (es as any).details = 'Detalles';
if (!(en as any).details) (en as any).details = 'Details';
if (!(fr as any).details) (fr as any).details = 'Détails';
if (!(de as any).details) (de as any).details = 'Details';
if (!(it as any).details) (it as any).details = 'Dettagli';
if (!(pt as any).details) (pt as any).details = 'Detalhes';
if (!(nl as any).details) (nl as any).details = 'Details';
if (!(ar as any).details) (ar as any).details = 'التفاصيل';
if (!(ca as any).disconnectedInfo) (ca as any).disconnectedInfo = 'Desconnectat del núvol';
if (!(es as any).disconnectedInfo) (es as any).disconnectedInfo = 'Desconectado';
if (!(en as any).disconnectedInfo) (en as any).disconnectedInfo = 'Disconnected';
if (!(fr as any).disconnectedInfo) (fr as any).disconnectedInfo = 'Déconnecté';
if (!(de as any).disconnectedInfo) (de as any).disconnectedInfo = 'Getrennt';
if (!(it as any).disconnectedInfo) (it as any).disconnectedInfo = 'Disconnesso';
if (!(pt as any).disconnectedInfo) (pt as any).disconnectedInfo = 'Desconectado';
if (!(nl as any).disconnectedInfo) (nl as any).disconnectedInfo = 'Niet verbonden';
if (!(ar as any).disconnectedInfo) (ar as any).disconnectedInfo = 'تم قطع الاتصال';
if (!(ca as any).editLoan) (ca as any).editLoan = 'Editar préstec';
if (!(es as any).editLoan) (es as any).editLoan = 'Editar préstamo';
if (!(en as any).editLoan) (en as any).editLoan = 'Edit loan';
if (!(fr as any).editLoan) (fr as any).editLoan = 'Modifier le prêt';
if (!(de as any).editLoan) (de as any).editLoan = 'Darlehen bearbeiten';
if (!(it as any).editLoan) (it as any).editLoan = 'Modifica prestito';
if (!(pt as any).editLoan) (pt as any).editLoan = 'Editar empréstimo';
if (!(nl as any).editLoan) (nl as any).editLoan = 'Lening bewerken';
if (!(ar as any).editLoan) (ar as any).editLoan = 'تعديل القرض';
if (!(ca as any).errorSavingRecord) (ca as any).errorSavingRecord = 'Error en guardar el registre';
if (!(es as any).errorSavingRecord) (es as any).errorSavingRecord = 'Error al guardar';
if (!(en as any).errorSavingRecord) (en as any).errorSavingRecord = 'Error saving record';
if (!(fr as any).errorSavingRecord) (fr as any).errorSavingRecord = 'Erreur lors de l\'enregistrement';
if (!(de as any).errorSavingRecord) (de as any).errorSavingRecord = 'Fehler beim Speichern';
if (!(it as any).errorSavingRecord) (it as any).errorSavingRecord = 'Errore nel salvataggio';
if (!(pt as any).errorSavingRecord) (pt as any).errorSavingRecord = 'Erro ao salvar';
if (!(nl as any).errorSavingRecord) (nl as any).errorSavingRecord = 'Fout bij opslaan';
if (!(ar as any).errorSavingRecord) (ar as any).errorSavingRecord = 'خطأ في الحفظ';
if (!(ca as any).errors) (ca as any).errors = 'Errors';
if (!(es as any).errors) (es as any).errors = 'Errores';
if (!(en as any).errors) (en as any).errors = 'Errors';
if (!(fr as any).errors) (fr as any).errors = 'Erreurs';
if (!(de as any).errors) (de as any).errors = 'Fehler';
if (!(it as any).errors) (it as any).errors = 'Errori';
if (!(pt as any).errors) (pt as any).errors = 'Erros';
if (!(nl as any).errors) (nl as any).errors = 'Fouten';
if (!(ar as any).errors) (ar as any).errors = 'أخطاء';
if (!(ca as any).excelExported) (ca as any).excelExported = 'Excel exportat!';
if (!(es as any).excelExported) (es as any).excelExported = '¡Excel exportado!';
if (!(en as any).excelExported) (en as any).excelExported = 'Excel exported!';
if (!(fr as any).excelExported) (fr as any).excelExported = 'Excel exporté !';
if (!(de as any).excelExported) (de as any).excelExported = 'Excel exportiert!';
if (!(it as any).excelExported) (it as any).excelExported = 'Excel esportato!';
if (!(pt as any).excelExported) (pt as any).excelExported = 'Excel exportado!';
if (!(nl as any).excelExported) (nl as any).excelExported = 'Excel geëxporteerd!';
if (!(ar as any).excelExported) (ar as any).excelExported = 'تم تصدير Excel!';
if (!(ca as any).exportError) (ca as any).exportError = 'Error exportant';
if (!(es as any).exportError) (es as any).exportError = 'Error al exportar';
if (!(en as any).exportError) (en as any).exportError = 'Export error';
if (!(fr as any).exportError) (fr as any).exportError = 'Erreur d\'exportation';
if (!(de as any).exportError) (de as any).exportError = 'Exportfehler';
if (!(it as any).exportError) (it as any).exportError = 'Errore esportazione';
if (!(pt as any).exportError) (pt as any).exportError = 'Erro na exportação';
if (!(nl as any).exportError) (nl as any).exportError = 'Exportfout';
if (!(ar as any).exportError) (ar as any).exportError = 'خطأ في التصدير';
if (!(ca as any).filters) (ca as any).filters = 'Filtres per data';
if (!(es as any).filters) (es as any).filters = 'Filtros por fecha';
if (!(en as any).filters) (en as any).filters = 'Date filters';
if (!(fr as any).filters) (fr as any).filters = 'Filtres par date';
if (!(de as any).filters) (de as any).filters = 'Datumsfilter';
if (!(it as any).filters) (it as any).filters = 'Filtri per data';
if (!(pt as any).filters) (pt as any).filters = 'Filtros por data';
if (!(nl as any).filters) (nl as any).filters = 'Datumfilters';
if (!(ar as any).filters) (ar as any).filters = 'فلاتر التاريخ';
if (!(ca as any).fullOcrText) (ca as any).fullOcrText = 'Text OCR complet';
if (!(es as any).fullOcrText) (es as any).fullOcrText = 'Texto OCR completo';
if (!(en as any).fullOcrText) (en as any).fullOcrText = 'Full OCR text';
if (!(fr as any).fullOcrText) (fr as any).fullOcrText = 'Texte OCR complet';
if (!(de as any).fullOcrText) (de as any).fullOcrText = 'Vollständiger OCR-Text';
if (!(it as any).fullOcrText) (it as any).fullOcrText = 'Testo OCR completo';
if (!(pt as any).fullOcrText) (pt as any).fullOcrText = 'Texto OCR completo';
if (!(nl as any).fullOcrText) (nl as any).fullOcrText = 'Volledige OCR-tekst';
if (!(ar as any).fullOcrText) (ar as any).fullOcrText = 'نص OCR الكامل';
if (!(ca as any).history) (ca as any).history = 'Historial';
if (!(es as any).history) (es as any).history = 'Historial';
if (!(en as any).history) (en as any).history = 'History';
if (!(fr as any).history) (fr as any).history = 'Historique';
if (!(de as any).history) (de as any).history = 'Verlauf';
if (!(it as any).history) (it as any).history = 'Cronologia';
if (!(pt as any).history) (pt as any).history = 'Histórico';
if (!(nl as any).history) (nl as any).history = 'Geschiedenis';
if (!(ar as any).history) (ar as any).history = 'السجل';
if (!(ca as any).initOcr) (ca as any).initOcr = 'Inicialitzant OCR…';
if (!(es as any).initOcr) (es as any).initOcr = 'Inicializando OCR…';
if (!(en as any).initOcr) (en as any).initOcr = 'Initializing OCR…';
if (!(fr as any).initOcr) (fr as any).initOcr = 'Initialisation OCR…';
if (!(de as any).initOcr) (de as any).initOcr = 'OCR wird initialisiert…';
if (!(it as any).initOcr) (it as any).initOcr = 'Inizializzazione OCR…';
if (!(pt as any).initOcr) (pt as any).initOcr = 'A inicializar OCR…';
if (!(nl as any).initOcr) (nl as any).initOcr = 'OCR initialiseren…';
if (!(ar as any).initOcr) (ar as any).initOcr = '...تهيئة OCR';
if (!(ca as any).lastDeposit) (ca as any).lastDeposit = 'Últim ingrés';
if (!(es as any).lastDeposit) (es as any).lastDeposit = 'Último ingreso';
if (!(en as any).lastDeposit) (en as any).lastDeposit = 'Last payment';
if (!(fr as any).lastDeposit) (fr as any).lastDeposit = 'Dernier versement';
if (!(de as any).lastDeposit) (de as any).lastDeposit = 'Letzte Zahlung';
if (!(it as any).lastDeposit) (it as any).lastDeposit = 'Ultimo pagamento';
if (!(pt as any).lastDeposit) (pt as any).lastDeposit = 'Último pagamento';
if (!(nl as any).lastDeposit) (nl as any).lastDeposit = 'Laatste betaling';
if (!(ar as any).lastDeposit) (ar as any).lastDeposit = 'آخر دفعة';
if (!(ca as any).lentAmountLabel) (ca as any).lentAmountLabel = 'Import prestat';
if (!(es as any).lentAmountLabel) (es as any).lentAmountLabel = 'Importe prestado';
if (!(en as any).lentAmountLabel) (en as any).lentAmountLabel = 'Amount lent';
if (!(fr as any).lentAmountLabel) (fr as any).lentAmountLabel = 'Montant prêté';
if (!(de as any).lentAmountLabel) (de as any).lentAmountLabel = 'Geliehener Betrag';
if (!(it as any).lentAmountLabel) (it as any).lentAmountLabel = 'Importo prestato';
if (!(pt as any).lentAmountLabel) (pt as any).lentAmountLabel = 'Valor emprestado';
if (!(nl as any).lentAmountLabel) (nl as any).lentAmountLabel = 'Geleend bedrag';
if (!(ar as any).lentAmountLabel) (ar as any).lentAmountLabel = 'المبلغ المقرض';
if (!(ca as any).loanCreated) (ca as any).loanCreated = 'Préstec creat';
if (!(es as any).loanCreated) (es as any).loanCreated = 'Préstamo creado';
if (!(en as any).loanCreated) (en as any).loanCreated = 'Loan created';
if (!(fr as any).loanCreated) (fr as any).loanCreated = 'Prêt créé';
if (!(de as any).loanCreated) (de as any).loanCreated = 'Darlehen erstellt';
if (!(it as any).loanCreated) (it as any).loanCreated = 'Prestito creato';
if (!(pt as any).loanCreated) (pt as any).loanCreated = 'Empréstimo criado';
if (!(nl as any).loanCreated) (nl as any).loanCreated = 'Lening aangemaakt';
if (!(ar as any).loanCreated) (ar as any).loanCreated = 'تم إنشاء القرض';
if (!(ca as any).loanDeleted) (ca as any).loanDeleted = 'Préstec eliminat';
if (!(es as any).loanDeleted) (es as any).loanDeleted = 'Préstamo eliminado';
if (!(en as any).loanDeleted) (en as any).loanDeleted = 'Loan deleted';
if (!(fr as any).loanDeleted) (fr as any).loanDeleted = 'Prêt supprimé';
if (!(de as any).loanDeleted) (de as any).loanDeleted = 'Darlehen gelöscht';
if (!(it as any).loanDeleted) (it as any).loanDeleted = 'Prestito eliminato';
if (!(pt as any).loanDeleted) (pt as any).loanDeleted = 'Empréstimo excluído';
if (!(nl as any).loanDeleted) (nl as any).loanDeleted = 'Lening verwijderd';
if (!(ar as any).loanDeleted) (ar as any).loanDeleted = 'تم حذف القرض';
if (!(ca as any).loanName) (ca as any).loanName = 'Nom del préstec';
if (!(es as any).loanName) (es as any).loanName = 'Nombre del préstamo';
if (!(en as any).loanName) (en as any).loanName = 'Loan name';
if (!(fr as any).loanName) (fr as any).loanName = 'Nom du prêt';
if (!(de as any).loanName) (de as any).loanName = 'Darlehensname';
if (!(it as any).loanName) (it as any).loanName = 'Nome del prestito';
if (!(pt as any).loanName) (pt as any).loanName = 'Nome do empréstimo';
if (!(nl as any).loanName) (nl as any).loanName = 'Naam van de lening';
if (!(ar as any).loanName) (ar as any).loanName = 'اسم القرض';
if (!(ca as any).loanNotFound) (ca as any).loanNotFound = 'Préstec no trobat';
if (!(es as any).loanNotFound) (es as any).loanNotFound = 'Préstamo no encontrado';
if (!(en as any).loanNotFound) (en as any).loanNotFound = 'Loan not found';
if (!(fr as any).loanNotFound) (fr as any).loanNotFound = 'Prêt non trouvé';
if (!(de as any).loanNotFound) (de as any).loanNotFound = 'Darlehen nicht gefunden';
if (!(it as any).loanNotFound) (it as any).loanNotFound = 'Prestito non trovato';
if (!(pt as any).loanNotFound) (pt as any).loanNotFound = 'Empréstimo não encontrado';
if (!(nl as any).loanNotFound) (nl as any).loanNotFound = 'Lening niet gevonden';
if (!(ar as any).loanNotFound) (ar as any).loanNotFound = 'القرض غير موجود';
if (!(ca as any).loanUpdated) (ca as any).loanUpdated = 'Préstec actualitzat';
if (!(es as any).loanUpdated) (es as any).loanUpdated = 'Préstamo actualizado';
if (!(en as any).loanUpdated) (en as any).loanUpdated = 'Loan updated';
if (!(fr as any).loanUpdated) (fr as any).loanUpdated = 'Prêt mis à jour';
if (!(de as any).loanUpdated) (de as any).loanUpdated = 'Darlehen aktualisiert';
if (!(it as any).loanUpdated) (it as any).loanUpdated = 'Prestito aggiornato';
if (!(pt as any).loanUpdated) (pt as any).loanUpdated = 'Empréstimo atualizado';
if (!(nl as any).loanUpdated) (nl as any).loanUpdated = 'Lening bijgewerkt';
if (!(ar as any).loanUpdated) (ar as any).loanUpdated = 'تم تحديث القرض';
if (!(ca as any).markedReviewed) (ca as any).markedReviewed = 'Marcat com a revisat';
if (!(es as any).markedReviewed) (es as any).markedReviewed = 'Marcado como revisado';
if (!(en as any).markedReviewed) (en as any).markedReviewed = 'Marked as reviewed';
if (!(fr as any).markedReviewed) (fr as any).markedReviewed = 'Marqué comme vérifié';
if (!(de as any).markedReviewed) (de as any).markedReviewed = 'Als geprüft markiert';
if (!(it as any).markedReviewed) (it as any).markedReviewed = 'Contrassegnato come verificato';
if (!(pt as any).markedReviewed) (pt as any).markedReviewed = 'Marcado como verificado';
if (!(nl as any).markedReviewed) (nl as any).markedReviewed = 'Gemarkeerd als gecontroleerd';
if (!(ar as any).markedReviewed) (ar as any).markedReviewed = 'تم وضع علامة كمراجع';
if (!(ca as any).metadata) (ca as any).metadata = 'Metadades';
if (!(es as any).metadata) (es as any).metadata = 'Metadatos';
if (!(en as any).metadata) (en as any).metadata = 'Metadata';
if (!(fr as any).metadata) (fr as any).metadata = 'Métadonnées';
if (!(de as any).metadata) (de as any).metadata = 'Metadaten';
if (!(it as any).metadata) (it as any).metadata = 'Metadati';
if (!(pt as any).metadata) (pt as any).metadata = 'Metadados';
if (!(nl as any).metadata) (nl as any).metadata = 'Metadata';
if (!(ar as any).metadata) (ar as any).metadata = 'بيانات وصفية';
if (!(ca as any).movements) (ca as any).movements = 'moviments';
if (!(es as any).movements) (es as any).movements = 'movimientos';
if (!(en as any).movements) (en as any).movements = 'movements';
if (!(fr as any).movements) (fr as any).movements = 'mouvements';
if (!(de as any).movements) (de as any).movements = 'Bewegungen';
if (!(it as any).movements) (it as any).movements = 'movimenti';
if (!(pt as any).movements) (pt as any).movements = 'movimentos';
if (!(nl as any).movements) (nl as any).movements = 'bewegingen';
if (!(ar as any).movements) (ar as any).movements = 'حركات';
if (!(ca as any).newLoan) (ca as any).newLoan = 'Nou préstec';
if (!(es as any).newLoan) (es as any).newLoan = 'Nuevo préstamo';
if (!(en as any).newLoan) (en as any).newLoan = 'New loan';
if (!(fr as any).newLoan) (fr as any).newLoan = 'Nouveau prêt';
if (!(de as any).newLoan) (de as any).newLoan = 'Neues Darlehen';
if (!(it as any).newLoan) (it as any).newLoan = 'Nuovo prestito';
if (!(pt as any).newLoan) (pt as any).newLoan = 'Novo empréstimo';
if (!(nl as any).newLoan) (nl as any).newLoan = 'Nieuwe lening';
if (!(ar as any).newLoan) (ar as any).newLoan = 'قرض جديد';
if (!(ca as any).newRecord) (ca as any).newRecord = 'Nou registre';
if (!(es as any).newRecord) (es as any).newRecord = 'Nuevo registro';
if (!(en as any).newRecord) (en as any).newRecord = 'New record';
if (!(fr as any).newRecord) (fr as any).newRecord = 'Nouvel enregistrement';
if (!(de as any).newRecord) (de as any).newRecord = 'Neuer Eintrag';
if (!(it as any).newRecord) (it as any).newRecord = 'Nuovo record';
if (!(pt as any).newRecord) (pt as any).newRecord = 'Novo registo';
if (!(nl as any).newRecord) (nl as any).newRecord = 'Nieuw record';
if (!(ar as any).newRecord) (ar as any).newRecord = 'سجل جديد';
if (!(ca as any).noData) (ca as any).noData = 'Sense dades';
if (!(es as any).noData) (es as any).noData = 'Sin datos';
if (!(en as any).noData) (en as any).noData = 'No data';
if (!(fr as any).noData) (fr as any).noData = 'Pas de données';
if (!(de as any).noData) (de as any).noData = 'Keine Daten';
if (!(it as any).noData) (it as any).noData = 'Nessun dato';
if (!(pt as any).noData) (pt as any).noData = 'Sem dados';
if (!(nl as any).noData) (nl as any).noData = 'Geen gegevens';
if (!(ar as any).noData) (ar as any).noData = 'لا بيانات';
if (!(ca as any).noDepositsYet) (ca as any).noDepositsYet = 'Encara no hi ha cap ingrés registrat';
if (!(es as any).noDepositsYet) (es as any).noDepositsYet = 'Aún no hay ingresos';
if (!(en as any).noDepositsYet) (en as any).noDepositsYet = 'No payments yet';
if (!(fr as any).noDepositsYet) (fr as any).noDepositsYet = 'Aucun versement';
if (!(de as any).noDepositsYet) (de as any).noDepositsYet = 'Noch keine Zahlungen';
if (!(it as any).noDepositsYet) (it as any).noDepositsYet = 'Nessun pagamento';
if (!(pt as any).noDepositsYet) (pt as any).noDepositsYet = 'Nenhum pagamento';
if (!(nl as any).noDepositsYet) (nl as any).noDepositsYet = 'Nog geen betalingen';
if (!(ar as any).noDepositsYet) (ar as any).noDepositsYet = 'لا توجد دفعات';
if (!(ca as any).noErrors) (ca as any).noErrors = 'Cap error!';
if (!(es as any).noErrors) (es as any).noErrors = '¡Sin errores!';
if (!(en as any).noErrors) (en as any).noErrors = 'No errors!';
if (!(fr as any).noErrors) (fr as any).noErrors = 'Aucune erreur !';
if (!(de as any).noErrors) (de as any).noErrors = 'Keine Fehler!';
if (!(it as any).noErrors) (it as any).noErrors = 'Nessun errore!';
if (!(pt as any).noErrors) (pt as any).noErrors = 'Sem erros!';
if (!(nl as any).noErrors) (nl as any).noErrors = 'Geen fouten!';
if (!(ar as any).noErrors) (ar as any).noErrors = 'لا أخطاء!';
if (!(ca as any).noLoansDesc) (ca as any).noLoansDesc = 'Crea el teu primer préstec per començar.';
if (!(es as any).noLoansDesc) (es as any).noLoansDesc = 'Crea tu primer préstamo.';
if (!(en as any).noLoansDesc) (en as any).noLoansDesc = 'Create your first loan to get started.';
if (!(fr as any).noLoansDesc) (fr as any).noLoansDesc = 'Créez votre premier prêt.';
if (!(de as any).noLoansDesc) (de as any).noLoansDesc = 'Erstellen Sie Ihr erstes Darlehen.';
if (!(it as any).noLoansDesc) (it as any).noLoansDesc = 'Crea il tuo primo prestito.';
if (!(pt as any).noLoansDesc) (pt as any).noLoansDesc = 'Crie o seu primeiro empréstimo.';
if (!(nl as any).noLoansDesc) (nl as any).noLoansDesc = 'Maak uw eerste lening aan.';
if (!(ar as any).noLoansDesc) (ar as any).noLoansDesc = 'أنشئ أول قرض لك.';
if (!(ca as any).noLoansYet) (ca as any).noLoansYet = 'Encara no tens cap préstec';
if (!(es as any).noLoansYet) (es as any).noLoansYet = 'Aún no tienes préstamos';
if (!(en as any).noLoansYet) (en as any).noLoansYet = 'No loans yet';
if (!(fr as any).noLoansYet) (fr as any).noLoansYet = 'Aucun prêt pour l\'instant';
if (!(de as any).noLoansYet) (de as any).noLoansYet = 'Noch keine Darlehen';
if (!(it as any).noLoansYet) (it as any).noLoansYet = 'Nessun prestito ancora';
if (!(pt as any).noLoansYet) (pt as any).noLoansYet = 'Ainda sem empréstimos';
if (!(nl as any).noLoansYet) (nl as any).noLoansYet = 'Nog geen leningen';
if (!(ar as any).noLoansYet) (ar as any).noLoansYet = 'لا توجد قروض';
if (!(ca as any).noPaymentsForCharts) (ca as any).noPaymentsForCharts = 'No hi ha pagaments per mostrar gràfics.';
if (!(es as any).noPaymentsForCharts) (es as any).noPaymentsForCharts = 'Sin pagos para gráficos.';
if (!(en as any).noPaymentsForCharts) (en as any).noPaymentsForCharts = 'No payments to show charts.';
if (!(fr as any).noPaymentsForCharts) (fr as any).noPaymentsForCharts = 'Aucun paiement pour les graphiques.';
if (!(de as any).noPaymentsForCharts) (de as any).noPaymentsForCharts = 'Keine Zahlungen für Diagramme.';
if (!(it as any).noPaymentsForCharts) (it as any).noPaymentsForCharts = 'Nessun pagamento per i grafici.';
if (!(pt as any).noPaymentsForCharts) (pt as any).noPaymentsForCharts = 'Sem pagamentos para gráficos.';
if (!(nl as any).noPaymentsForCharts) (nl as any).noPaymentsForCharts = 'Geen betalingen voor grafieken.';
if (!(ar as any).noPaymentsForCharts) (ar as any).noPaymentsForCharts = 'لا توجد مدفوعات للرسوم البيانية.';
if (!(ca as any).noRecordsFound) (ca as any).noRecordsFound = 'Cap registre trobat';
if (!(es as any).noRecordsFound) (es as any).noRecordsFound = 'Sin registros';
if (!(en as any).noRecordsFound) (en as any).noRecordsFound = 'No records found';
if (!(fr as any).noRecordsFound) (fr as any).noRecordsFound = 'Aucun enregistrement';
if (!(de as any).noRecordsFound) (de as any).noRecordsFound = 'Keine Einträge';
if (!(it as any).noRecordsFound) (it as any).noRecordsFound = 'Nessun record';
if (!(pt as any).noRecordsFound) (pt as any).noRecordsFound = 'Nenhum registo';
if (!(nl as any).noRecordsFound) (nl as any).noRecordsFound = 'Geen records';
if (!(ar as any).noRecordsFound) (ar as any).noRecordsFound = 'لا توجد سجلات';
if (!(ca as any).noRecordsYetDesc) (ca as any).noRecordsYetDesc = 'Afegeix el primer registre de devolució.';
if (!(es as any).noRecordsYetDesc) (es as any).noRecordsYetDesc = 'Añade el primer reembolso.';
if (!(en as any).noRecordsYetDesc) (en as any).noRecordsYetDesc = 'Add the first repayment.';
if (!(fr as any).noRecordsYetDesc) (fr as any).noRecordsYetDesc = 'Ajoutez le premier remboursement.';
if (!(de as any).noRecordsYetDesc) (de as any).noRecordsYetDesc = 'Fügen Sie den ersten Eintrag hinzu.';
if (!(it as any).noRecordsYetDesc) (it as any).noRecordsYetDesc = 'Aggiungi il primo rimborso.';
if (!(pt as any).noRecordsYetDesc) (pt as any).noRecordsYetDesc = 'Adicione o primeiro reembolso.';
if (!(nl as any).noRecordsYetDesc) (nl as any).noRecordsYetDesc = 'Voeg het eerste record toe.';
if (!(ar as any).noRecordsYetDesc) (ar as any).noRecordsYetDesc = 'أضف أول سداد.';
if (!(ca as any).notes) (ca as any).notes = 'Notes';
if (!(es as any).notes) (es as any).notes = 'Notas';
if (!(en as any).notes) (en as any).notes = 'Notes';
if (!(fr as any).notes) (fr as any).notes = 'Notes';
if (!(de as any).notes) (de as any).notes = 'Notizen';
if (!(it as any).notes) (it as any).notes = 'Note';
if (!(pt as any).notes) (pt as any).notes = 'Notas';
if (!(nl as any).notes) (nl as any).notes = 'Notities';
if (!(ar as any).notes) (ar as any).notes = 'ملاحظات';
if (!(ca as any).ocrComplete) (ca as any).ocrComplete = 'OCR completat';
if (!(es as any).ocrComplete) (es as any).ocrComplete = 'OCR completado';
if (!(en as any).ocrComplete) (en as any).ocrComplete = 'OCR completed';
if (!(fr as any).ocrComplete) (fr as any).ocrComplete = 'OCR terminé';
if (!(de as any).ocrComplete) (de as any).ocrComplete = 'OCR abgeschlossen';
if (!(it as any).ocrComplete) (it as any).ocrComplete = 'OCR completato';
if (!(pt as any).ocrComplete) (pt as any).ocrComplete = 'OCR concluído';
if (!(nl as any).ocrComplete) (nl as any).ocrComplete = 'OCR voltooid';
if (!(ar as any).ocrComplete) (ar as any).ocrComplete = 'اكتمل OCR';
if (!(ca as any).ocrConfidence) (ca as any).ocrConfidence = 'confiança OCR';
if (!(es as any).ocrConfidence) (es as any).ocrConfidence = 'confianza OCR';
if (!(en as any).ocrConfidence) (en as any).ocrConfidence = 'OCR confidence';
if (!(fr as any).ocrConfidence) (fr as any).ocrConfidence = 'confiance OCR';
if (!(de as any).ocrConfidence) (de as any).ocrConfidence = 'OCR-Vertrauen';
if (!(it as any).ocrConfidence) (it as any).ocrConfidence = 'confidenza OCR';
if (!(pt as any).ocrConfidence) (pt as any).ocrConfidence = 'confiança OCR';
if (!(nl as any).ocrConfidence) (nl as any).ocrConfidence = 'OCR-vertrouwen';
if (!(ar as any).ocrConfidence) (ar as any).ocrConfidence = 'دقة OCR';
if (!(ca as any).paymentData) (ca as any).paymentData = 'Dades del pagament';
if (!(es as any).paymentData) (es as any).paymentData = 'Datos del pago';
if (!(en as any).paymentData) (en as any).paymentData = 'Payment data';
if (!(fr as any).paymentData) (fr as any).paymentData = 'Données du paiement';
if (!(de as any).paymentData) (de as any).paymentData = 'Zahlungsdaten';
if (!(it as any).paymentData) (it as any).paymentData = 'Dati del pagamento';
if (!(pt as any).paymentData) (pt as any).paymentData = 'Dados do pagamento';
if (!(nl as any).paymentData) (nl as any).paymentData = 'Betalingsgegevens';
if (!(ar as any).paymentData) (ar as any).paymentData = 'بيانات الدفع';
if (!(ca as any).pdfExported) (ca as any).pdfExported = 'PDF exportat!';
if (!(es as any).pdfExported) (es as any).pdfExported = '¡PDF exportado!';
if (!(en as any).pdfExported) (en as any).pdfExported = 'PDF exported!';
if (!(fr as any).pdfExported) (fr as any).pdfExported = 'PDF exporté !';
if (!(de as any).pdfExported) (de as any).pdfExported = 'PDF exportiert!';
if (!(it as any).pdfExported) (it as any).pdfExported = 'PDF esportato!';
if (!(pt as any).pdfExported) (pt as any).pdfExported = 'PDF exportado!';
if (!(nl as any).pdfExported) (nl as any).pdfExported = 'PDF geëxporteerd!';
if (!(ar as any).pdfExported) (ar as any).pdfExported = 'تم تصدير PDF!';
if (!(ca as any).pending) (ca as any).pending = 'Pendent';
if (!(es as any).pending) (es as any).pending = 'Pendiente';
if (!(en as any).pending) (en as any).pending = 'Pending';
if (!(fr as any).pending) (fr as any).pending = 'En attente';
if (!(de as any).pending) (de as any).pending = 'Ausstehend';
if (!(it as any).pending) (it as any).pending = 'In sospeso';
if (!(pt as any).pending) (pt as any).pending = 'Pendente';
if (!(nl as any).pending) (nl as any).pending = 'In afwachting';
if (!(ar as any).pending) (ar as any).pending = 'معلق';
if (!(ca as any).pendingItems) (ca as any).pendingItems = 'Pendents';
if (!(es as any).pendingItems) (es as any).pendingItems = 'Pendientes';
if (!(en as any).pendingItems) (en as any).pendingItems = 'Pending';
if (!(fr as any).pendingItems) (fr as any).pendingItems = 'En attente';
if (!(de as any).pendingItems) (de as any).pendingItems = 'Ausstehend';
if (!(it as any).pendingItems) (it as any).pendingItems = 'In sospeso';
if (!(pt as any).pendingItems) (pt as any).pendingItems = 'Pendentes';
if (!(nl as any).pendingItems) (nl as any).pendingItems = 'In afwachting';
if (!(ar as any).pendingItems) (ar as any).pendingItems = 'معلقة';
if (!(ca as any).possibleDuplicate) (ca as any).possibleDuplicate = 'Possible duplicat';
if (!(es as any).possibleDuplicate) (es as any).possibleDuplicate = 'Posible duplicado';
if (!(en as any).possibleDuplicate) (en as any).possibleDuplicate = 'Possible duplicate';
if (!(fr as any).possibleDuplicate) (fr as any).possibleDuplicate = 'Doublon possible';
if (!(de as any).possibleDuplicate) (de as any).possibleDuplicate = 'Mögliches Duplikat';
if (!(it as any).possibleDuplicate) (it as any).possibleDuplicate = 'Possibile duplicato';
if (!(pt as any).possibleDuplicate) (pt as any).possibleDuplicate = 'Possível duplicado';
if (!(nl as any).possibleDuplicate) (nl as any).possibleDuplicate = 'Mogelijk duplicaat';
if (!(ar as any).possibleDuplicate) (ar as any).possibleDuplicate = 'مكرر محتمل';
if (!(ca as any).recordAccepted) (ca as any).recordAccepted = 'Registre acceptat i guardat';
if (!(es as any).recordAccepted) (es as any).recordAccepted = 'Registro aceptado';
if (!(en as any).recordAccepted) (en as any).recordAccepted = 'Record accepted';
if (!(fr as any).recordAccepted) (fr as any).recordAccepted = 'Enregistrement accepté';
if (!(de as any).recordAccepted) (de as any).recordAccepted = 'Eintrag akzeptiert';
if (!(it as any).recordAccepted) (it as any).recordAccepted = 'Record accettato';
if (!(pt as any).recordAccepted) (pt as any).recordAccepted = 'Registo aceite';
if (!(nl as any).recordAccepted) (nl as any).recordAccepted = 'Record geaccepteerd';
if (!(ar as any).recordAccepted) (ar as any).recordAccepted = 'تم قبول السجل';
if (!(ca as any).recordDeleted) (ca as any).recordDeleted = 'Registre eliminat';
if (!(es as any).recordDeleted) (es as any).recordDeleted = 'Registro eliminado';
if (!(en as any).recordDeleted) (en as any).recordDeleted = 'Record deleted';
if (!(fr as any).recordDeleted) (fr as any).recordDeleted = 'Enregistrement supprimé';
if (!(de as any).recordDeleted) (de as any).recordDeleted = 'Eintrag gelöscht';
if (!(it as any).recordDeleted) (it as any).recordDeleted = 'Record eliminato';
if (!(pt as any).recordDeleted) (pt as any).recordDeleted = 'Registo excluído';
if (!(nl as any).recordDeleted) (nl as any).recordDeleted = 'Record verwijderd';
if (!(ar as any).recordDeleted) (ar as any).recordDeleted = 'تم حذف السجل';
if (!(ca as any).recordDetail) (ca as any).recordDetail = 'Detall del registre';
if (!(es as any).recordDetail) (es as any).recordDetail = 'Detalle del registro';
if (!(en as any).recordDetail) (en as any).recordDetail = 'Record detail';
if (!(fr as any).recordDetail) (fr as any).recordDetail = 'Détail de l\'enregistrement';
if (!(de as any).recordDetail) (de as any).recordDetail = 'Eintragsdetail';
if (!(it as any).recordDetail) (it as any).recordDetail = 'Dettaglio del record';
if (!(pt as any).recordDetail) (pt as any).recordDetail = 'Detalhe do registo';
if (!(nl as any).recordDetail) (nl as any).recordDetail = 'Recorddetail';
if (!(ar as any).recordDetail) (ar as any).recordDetail = 'تفاصيل السجل';
if (!(ca as any).recordNotFound) (ca as any).recordNotFound = 'Registre no trobat';
if (!(es as any).recordNotFound) (es as any).recordNotFound = 'Registro no encontrado';
if (!(en as any).recordNotFound) (en as any).recordNotFound = 'Record not found';
if (!(fr as any).recordNotFound) (fr as any).recordNotFound = 'Enregistrement non trouvé';
if (!(de as any).recordNotFound) (de as any).recordNotFound = 'Eintrag nicht gefunden';
if (!(it as any).recordNotFound) (it as any).recordNotFound = 'Record non trovato';
if (!(pt as any).recordNotFound) (pt as any).recordNotFound = 'Registo não encontrado';
if (!(nl as any).recordNotFound) (nl as any).recordNotFound = 'Record niet gevonden';
if (!(ar as any).recordNotFound) (ar as any).recordNotFound = 'السجل غير موجود';
if (!(ca as any).recordSavedPending) (ca as any).recordSavedPending = 'Registre guardat com a pendent';
if (!(es as any).recordSavedPending) (es as any).recordSavedPending = 'Registro guardado como pendiente';
if (!(en as any).recordSavedPending) (en as any).recordSavedPending = 'Record saved as pending';
if (!(fr as any).recordSavedPending) (fr as any).recordSavedPending = 'Enregistrement en attente';
if (!(de as any).recordSavedPending) (de as any).recordSavedPending = 'Als ausstehend gespeichert';
if (!(it as any).recordSavedPending) (it as any).recordSavedPending = 'Record in sospeso';
if (!(pt as any).recordSavedPending) (pt as any).recordSavedPending = 'Registo salvo como pendente';
if (!(nl as any).recordSavedPending) (nl as any).recordSavedPending = 'Record als in afwachting opgeslagen';
if (!(ar as any).recordSavedPending) (ar as any).recordSavedPending = 'تم حفظ السجل كمعلق';
if (!(ca as any).returned) (ca as any).returned = 'Retornat';
if (!(es as any).returned) (es as any).returned = 'Devuelto';
if (!(en as any).returned) (en as any).returned = 'Returned';
if (!(fr as any).returned) (fr as any).returned = 'Remboursé';
if (!(de as any).returned) (de as any).returned = 'Zurückgezahlt';
if (!(it as any).returned) (it as any).returned = 'Rimborsato';
if (!(pt as any).returned) (pt as any).returned = 'Devolvido';
if (!(nl as any).returned) (nl as any).returned = 'Terugbetaald';
if (!(ar as any).returned) (ar as any).returned = 'مسدد';
if (!(ca as any).reviewRecord) (ca as any).reviewRecord = 'Revisió del registre';
if (!(es as any).reviewRecord) (es as any).reviewRecord = 'Revisión del registro';
if (!(en as any).reviewRecord) (en as any).reviewRecord = 'Review record';
if (!(fr as any).reviewRecord) (fr as any).reviewRecord = 'Révision de l\'enregistrement';
if (!(de as any).reviewRecord) (de as any).reviewRecord = 'Eintrag überprüfen';
if (!(it as any).reviewRecord) (it as any).reviewRecord = 'Revisione del record';
if (!(pt as any).reviewRecord) (pt as any).reviewRecord = 'Revisão do registo';
if (!(nl as any).reviewRecord) (nl as any).reviewRecord = 'Record beoordelen';
if (!(ar as any).reviewRecord) (ar as any).reviewRecord = 'مراجعة السجل';
if (!(ca as any).saveChanges) (ca as any).saveChanges = 'Guardar canvis';
if (!(es as any).saveChanges) (es as any).saveChanges = 'Guardar cambios';
if (!(en as any).saveChanges) (en as any).saveChanges = 'Save changes';
if (!(fr as any).saveChanges) (fr as any).saveChanges = 'Enregistrer';
if (!(de as any).saveChanges) (de as any).saveChanges = 'Änderungen speichern';
if (!(it as any).saveChanges) (it as any).saveChanges = 'Salva modifiche';
if (!(pt as any).saveChanges) (pt as any).saveChanges = 'Salvar alterações';
if (!(nl as any).saveChanges) (nl as any).saveChanges = 'Wijzigingen opslaan';
if (!(ar as any).saveChanges) (ar as any).saveChanges = 'حفظ التغييرات';
if (!(ca as any).searchLoan) (ca as any).searchLoan = 'Cercar préstec…';
if (!(es as any).searchLoan) (es as any).searchLoan = 'Buscar préstamo…';
if (!(en as any).searchLoan) (en as any).searchLoan = 'Search loan…';
if (!(fr as any).searchLoan) (fr as any).searchLoan = 'Rechercher un prêt…';
if (!(de as any).searchLoan) (de as any).searchLoan = 'Darlehen suchen…';
if (!(it as any).searchLoan) (it as any).searchLoan = 'Cerca prestito…';
if (!(pt as any).searchLoan) (pt as any).searchLoan = 'Pesquisar empréstimo…';
if (!(nl as any).searchLoan) (nl as any).searchLoan = 'Lening zoeken…';
if (!(ar as any).searchLoan) (ar as any).searchLoan = '...بحث عن قرض';
if (!(ca as any).startDate) (ca as any).startDate = 'Data d\'inici';
if (!(es as any).startDate) (es as any).startDate = 'Fecha de inicio';
if (!(en as any).startDate) (en as any).startDate = 'Start date';
if (!(fr as any).startDate) (fr as any).startDate = 'Date de début';
if (!(de as any).startDate) (de as any).startDate = 'Startdatum';
if (!(it as any).startDate) (it as any).startDate = 'Data di inizio';
if (!(pt as any).startDate) (pt as any).startDate = 'Data de início';
if (!(nl as any).startDate) (nl as any).startDate = 'Startdatum';
if (!(ar as any).startDate) (ar as any).startDate = 'تاريخ البدء';
if (!(ca as any).synced) (ca as any).synced = 'Sincronitzats';
if (!(es as any).synced) (es as any).synced = 'Sincronizados';
if (!(en as any).synced) (en as any).synced = 'Synced';
if (!(fr as any).synced) (fr as any).synced = 'Synchronisés';
if (!(de as any).synced) (de as any).synced = 'Synchronisiert';
if (!(it as any).synced) (it as any).synced = 'Sincronizzati';
if (!(pt as any).synced) (pt as any).synced = 'Sincronizados';
if (!(nl as any).synced) (nl as any).synced = 'Gesynchroniseerd';
if (!(ar as any).synced) (ar as any).synced = 'متزامنة';
if (!(ca as any).takePhotos) (ca as any).takePhotos = 'Fes fotos dels rebuts o puja imatges.';
if (!(es as any).takePhotos) (es as any).takePhotos = 'Haz fotos de los recibos o sube imágenes.';
if (!(en as any).takePhotos) (en as any).takePhotos = 'Take photos of receipts or upload images.';
if (!(fr as any).takePhotos) (fr as any).takePhotos = 'Prenez des photos des reçus ou téléchargez des images.';
if (!(de as any).takePhotos) (de as any).takePhotos = 'Fotografieren Sie Quittungen oder laden Sie Bilder hoch.';
if (!(it as any).takePhotos) (it as any).takePhotos = 'Scatta foto delle ricevute o carica immagini.';
if (!(pt as any).takePhotos) (pt as any).takePhotos = 'Fotografe os recibos ou carregue imagens.';
if (!(nl as any).takePhotos) (nl as any).takePhotos = 'Maak foto\'s van bonnen of upload afbeeldingen.';
if (!(ar as any).takePhotos) (ar as any).takePhotos = 'التقط صوراً للإيصالات أو ارفع صوراً.';
if (!(ca as any).totalDeposited) (ca as any).totalDeposited = 'Total ingressat';
if (!(es as any).totalDeposited) (es as any).totalDeposited = 'Total ingresado';
if (!(en as any).totalDeposited) (en as any).totalDeposited = 'Total repaid';
if (!(fr as any).totalDeposited) (fr as any).totalDeposited = 'Total remboursé';
if (!(de as any).totalDeposited) (de as any).totalDeposited = 'Gesamt zurückgezahlt';
if (!(it as any).totalDeposited) (it as any).totalDeposited = 'Totale rimborsato';
if (!(pt as any).totalDeposited) (pt as any).totalDeposited = 'Total devolvido';
if (!(nl as any).totalDeposited) (nl as any).totalDeposited = 'Totaal terugbetaald';
if (!(ar as any).totalDeposited) (ar as any).totalDeposited = 'إجمالي المسدد';
if (!(ca as any).tryOtherFilters) (ca as any).tryOtherFilters = 'Prova amb uns altres filtres.';
if (!(es as any).tryOtherFilters) (es as any).tryOtherFilters = 'Prueba con otros filtros.';
if (!(en as any).tryOtherFilters) (en as any).tryOtherFilters = 'Try different filters.';
if (!(fr as any).tryOtherFilters) (fr as any).tryOtherFilters = 'Essayez d\'autres filtres.';
if (!(de as any).tryOtherFilters) (de as any).tryOtherFilters = 'Versuchen Sie andere Filter.';
if (!(it as any).tryOtherFilters) (it as any).tryOtherFilters = 'Prova con altri filtri.';
if (!(pt as any).tryOtherFilters) (pt as any).tryOtherFilters = 'Tente outros filtros.';
if (!(nl as any).tryOtherFilters) (nl as any).tryOtherFilters = 'Probeer andere filters.';
if (!(ar as any).tryOtherFilters) (ar as any).tryOtherFilters = 'جرب فلاتر أخرى.';
if (!(ca as any).unexpectedError) (ca as any).unexpectedError = 'Error inesperat';
if (!(es as any).unexpectedError) (es as any).unexpectedError = 'Error inesperado';
if (!(en as any).unexpectedError) (en as any).unexpectedError = 'Unexpected error';
if (!(fr as any).unexpectedError) (fr as any).unexpectedError = 'Erreur inattendue';
if (!(de as any).unexpectedError) (de as any).unexpectedError = 'Unerwarteter Fehler';
if (!(it as any).unexpectedError) (it as any).unexpectedError = 'Errore imprevisto';
if (!(pt as any).unexpectedError) (pt as any).unexpectedError = 'Erro inesperado';
if (!(nl as any).unexpectedError) (nl as any).unexpectedError = 'Onverwachte fout';
if (!(ar as any).unexpectedError) (ar as any).unexpectedError = 'خطأ غير متوقع';

export const translations: Translations = { ca, es, en, fr, de, it, pt, nl, ar };
