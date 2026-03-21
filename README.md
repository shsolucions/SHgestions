# zGestioPrestecsApp v2.0

Aplicació web moderna per gestionar préstecs personals i familiars amb registre de devolucions via OCR de rebuts bancaris.

## Arbre de fitxers actualitzat (Fase 1 + Fase 2)

```
zGestioPrestecsApp/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
├── vercel.json                          ← NOU: config desplegament Vercel
├── .env.example                         ← NOU: variables d'entorn
├── .gitignore                           ← NOU
├── public/
│   ├── manifest.json
│   ├── _redirects                       ← NOU: Netlify SPA routing
│   └── icons/
│       ├── icon.svg
│       ├── icon-192.png
│       └── icon-512.png
└── src/
    ├── main.tsx
    ├── App.tsx                          ← MODIFICAT: noves rutes
    ├── index.css
    ├── vite-env.d.ts                    ← MODIFICAT: env types
    ├── types/
    │   ├── index.ts
    │   └── jspdf-autotable.d.ts         ← NOU
    ├── db/
    │   └── database.ts
    ├── cloud/                           ← NOU: tota la capa cloud
    │   ├── index.ts                     ← barrel export
    │   ├── types.ts                     ← interfaces cloud
    │   ├── cloudService.ts              ← gestor de proveïdors
    │   ├── syncEngine.ts                ← motor sync + cua + conflictes
    │   └── providers/
    │       ├── googleDriveProvider.ts    ← IMPLEMENTAT COMPLET
    │       ├── dropboxProvider.ts        ← esquelet preparat
    │       └── oneDriveProvider.ts       ← esquelet preparat
    ├── services/
    │   ├── authService.ts
    │   ├── loanService.ts
    │   ├── paymentService.ts
    │   ├── ocrService.ts
    │   ├── exportService.ts             ← NOU: exportació PDF/Excel
    │   └── syncService.ts               ← MODIFICAT: redirigeix a cloud/
    ├── context/
    │   ├── AuthContext.tsx
    │   ├── ThemeContext.tsx
    │   └── ToastContext.tsx
    ├── components/
    │   ├── layout/
    │   │   └── AppLayout.tsx            ← MODIFICAT: botó núvol al header
    │   └── ui/ (tots iguals que Fase 1)
    ├── pages/
    │   ├── LoginPage.tsx
    │   ├── LoansListPage.tsx            ← MODIFICAT: botó exportar
    │   ├── LoanFormPage.tsx
    │   ├── LoanDashboardPage.tsx        ← MODIFICAT: botons gràfics/PDF/Excel
    │   ├── NewPaymentPage.tsx
    │   ├── ReviewPaymentPage.tsx
    │   ├── HistoryPage.tsx
    │   ├── PaymentDetailPage.tsx
    │   ├── CloudSettingsPage.tsx         ← NOU: configuració núvol
    │   └── ChartsPage.tsx               ← NOU: gràfics d'evolució
    └── utils/ (tots iguals que Fase 1)
```

## Noves funcionalitats (Fase 2)

- [x] **Google Drive** — Sincronització real amb OAuth2
- [x] **Cua de sincronització** amb estats (pendent/sincronitzat/error)
- [x] **Resolució de conflictes** (registre més recent guanya)
- [x] **Reintent automàtic** d'errors (fins a 3 intents)
- [x] **Pantalla de configuració** del núvol
- [x] **Exportar a PDF** (historial d'un préstec)
- [x] **Exportar a Excel** (un préstec o tots)
- [x] **Gràfics interactius**: barres, evolució acumulada, resum mensual, pastís
- [x] **Dropbox i OneDrive** preparats com a esquelet
- [x] **Desplegament online** amb Vercel o Netlify
- [x] Estructura de carpetes al Drive: config/, prestecs/, attachments/, backups/

## Com executar localment

```bash
cd zGestioPrestecsApp
npm install
npm run dev
```

Obre `http://localhost:5173` — Credencials: **admin / 1234**

## Com desplegar online (accedir sense PC encès)

### Opció A: Vercel (recomanat, gratuït)

1. Ves a **https://vercel.com** i crea un compte (pots fer-ho amb GitHub)
2. Instal·la Git si no el tens: https://git-scm.com
3. A la terminal dins la carpeta del projecte:

```bash
npm install -g vercel
vercel login
vercel
```

4. Segueix les instruccions. Vercel et donarà una URL tipus:
   `https://zgestioprestecs-xxxxx.vercel.app`

5. Obre aquesta URL al teu iPhone i ja funciona!

### Opció B: Netlify (també gratuït)

1. Ves a **https://app.netlify.com**
2. Fes build local: `npm run build`
3. Arrossega la carpeta `dist/` a la web de Netlify
4. Et donarà una URL pública

### Opció C: Servir des del PC a la xarxa local

```bash
npm run dev
```
Obre des de l'iPhone: `http://192.168.X.X:5173` (la IP del teu PC)

## Com configurar Google Drive (sincronització al núvol)

### Pas 1: Crear un projecte a Google Cloud

1. Ves a **https://console.cloud.google.com**
2. Clica "Seleccionar projecte" → "Projecte nou"
3. Nom: `zGestioPrestecsApp`
4. Clica "Crear"

### Pas 2: Activar l'API de Google Drive

1. Al menú lateral: **APIs i serveis → Biblioteca**
2. Cerca "Google Drive API"
3. Clica-hi i prem **"Habilitar"**

### Pas 3: Crear credencials OAuth

1. Al menú lateral: **APIs i serveis → Credencials**
2. Clica **"Crear credencials" → "ID de client OAuth"**
3. Si et demana configurar la pantalla de consentiment:
   - Tipus: "Extern"
   - Nom de l'app: `zGestioPrestecsApp`
   - Correu de suport: el teu
   - Guarda
4. Torna a "Crear credencials" → "ID de client OAuth"
5. Tipus d'aplicació: **"Aplicació web"**
6. Orígens de JavaScript autoritzats:
   - `http://localhost:5173` (per desenvolupament)
   - `https://la-teva-url.vercel.app` (per producció)
7. URIs de redirecció autoritzats:
   - `http://localhost:5173`
   - `https://la-teva-url.vercel.app`
8. Clica **"Crear"**
9. **Copia el Client ID** (serà algo com: `123456789.apps.googleusercontent.com`)

### Pas 4: Configurar a l'app

**Opció A** (fitxer .env):
```bash
# Crea un fitxer .env a l'arrel del projecte
VITE_GOOGLE_CLIENT_ID=el_teu_client_id.apps.googleusercontent.com
```

**Opció B** (des de la UI):
1. Obre l'app → icona del núvol (☁️) al header
2. Clica "Connectar" → Google Drive
3. Et demanarà el Client ID → Enganxa'l
4. Es guardarà localment

### Pas 5: Provar la sincronització

1. Obre l'app i ves a ☁️ (Configuració del núvol)
2. Clica "Connectar" al costat de Google Drive
3. S'obrirà una finestra de Google — autoritza l'app
4. Un cop connectat, clica "Sincronitzar ara"
5. Ves al teu Google Drive → trobaràs la carpeta `zGestioPrestecsApp` amb:
   - `config/` → resum de sincronització
   - `prestecs/` → JSON de cada préstec i pagament
   - `attachments/` → imatges dels rebuts
   - `backups/` → (preparat per futures exportacions)

## Passos de prova

1. **Login**: admin / 1234 ✓
2. **Crear préstec**: omplir formulari ✓
3. **Afegir registre**: pujar foto → OCR → revisar → acceptar ✓
4. **Historial**: filtrar per data, cercar ✓
5. **Gràfics**: veure barres, línia acumulada, pastís ✓
6. **Exportar PDF**: dashboard → botó PDF → es descarrega ✓
7. **Exportar Excel**: dashboard → botó Excel → es descarrega ✓
8. **Exportar tot**: llista préstecs → botó "Exportar" → Excel amb tot ✓
9. **Connectar Drive**: ☁️ → Connectar → autoritzar → sincronitzar ✓
10. **Desconnectar Drive**: ☁️ → Desconnectar ✓

## Millores futures (Fase 3)

- Implementar Dropbox i OneDrive (esquelet ja preparat)
- Sync automàtic en segon pla (cada X minuts)
- Service Worker complet per cache offline
- Notificacions push de recordatori
- Compartir préstec amb altra persona
- Autenticació biomètrica (WebAuthn)
- Historial de conflictes amb resolució manual
- Backup automàtic periòdic al núvol
- Vista calendari dels pagaments
- Import de dades des d'Excel

## Limitacions actuals reals

1. **Google Drive requereix Client ID**: Cal crear-lo manualment a Google Cloud Console (gratuït però requereix uns minuts de configuració).

2. **Token OAuth caduca**: El token implicit dura ~1 hora. Després cal reconnectar. A una futura versió es pot implementar refresh token amb un backend.

3. **Dropbox i OneDrive no funcionals**: Només estan com a esquelet preparat. Google Drive és l'únic proveïdor operatiu.

4. **No hi ha sync automàtic**: La sincronització és manual (botó "Sincronitzar ara"). El sync en segon pla requereix Service Worker.

5. **Conflictes simples**: La resolució és "el més recent guanya". No hi ha merge manual de camps individuals.

6. **OCR depèn de qualitat**: Igual que a Fase 1 — funciona bé amb fotos clares.

7. **Les imatges al Drive poden ocupar espai**: Cada rebut es puja tal qual. No hi ha compressió.

8. **PDF bàsic**: L'exportació PDF és funcional però amb format simple (taula).

---

**v2.0** — Fase 1 (offline) + Fase 2 (cloud + exportació + gràfics)
Stack: React · TypeScript · Vite · Tailwind · IndexedDB · Tesseract.js · Recharts · jsPDF · SheetJS · Google Drive API
