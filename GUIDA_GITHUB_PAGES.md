# 🚀 Guida - Come Hostare il Sito su GitHub Pages

## Passaggio 1: Crea un account GitHub
Se non hai già un account, registrati su [github.com](https://github.com)

## Passaggio 2: Crea un nuovo repository
1. Accedi a GitHub
2. Clicca sul "+" in alto a destra → **New repository**
3. Dai un nome al repository (es: `angela-lavanderia`)
4. Descrizione: "Sito web ufficiale di Angela Lavanderia"
5. Scegli **Public** (essenziale per GitHub Pages gratuito)
6. Clicca **Create repository**

## Passaggio 3: Carica i file del sito

### Opzione A: Tramite Git (Consigliato)

#### Installa Git (se non lo hai)
- **Windows**: Scarica da [git-scm.com](https://git-scm.com)
- **Mac**: `brew install git`
- **Linux**: `sudo apt install git`

#### Comandi nel terminale:
```bash
cd percorso/del/tuo/progetto/angela-lavanderia

# Inizializza il repository locale
git init

# Aggiungi i file
git add .

# Commit iniziale
git commit -m "Initial commit - Angela Lavanderia website"

# Aggiungi il remote repository
git remote add origin https://github.com/TUO_USERNAME/angela-lavanderia.git

# Carica i file
git branch -M main
git push -u origin main
```

### Opzione B: Tramite interfaccia web GitHub
1. Vai nel repository appena creato
2. Clicca **Add file** → **Upload files**
3. Seleziona tutti i file (index.html, style.css, script.js, README.md, .gitignore) e la cartella `images/` se l'hai creata
4. Scrivi il messaggio: "Add website files"
5. Clicca **Commit changes**

## Passaggio 4: Abilita GitHub Pages

1. Vai nel repository
2. Clicca su **Settings** (in alto a destra)
3. Nel menu a sinistra, seleziona **Pages**
4. Sotto "Source", seleziona il branch **main** (o **master**)
5. Seleziona la cartella **/ (root)**
6. Clicca **Save**

GitHub Pages creerà automaticamente il sito! ✨

## Passaggio 5: Accedi al tuo sito

Il tuo sito sarà disponibile a:
```
https://TUO_USERNAME.github.io/angela-lavanderia/
```

Esempio:
- Se il tuo username è `mario` e il repo è `angela-lavanderia`
- URL: `https://mario.github.io/angela-lavanderia/`

## ⚙️ Successivamente: Personalizzazioni

### 1. Aggiungi numero di telefono e email
Apri `index.html` e modifica la sezione contatti:
- Sostituisci "Contattaci per ricevere il numero" con il numero reale
- Aggiungi l'email nella sezione email

### 2. Personalizza gli orari
Modifica la sezione "Orari di Apertura" in `index.html`

### 3. Aggiungi indirizzo completo
Aggiorna il link a Google Maps o aggiungi l'indirizzo

### 4. Modifica i prezzi
Aggiorna i prezzi nella sezione tariffe

### 5. Aggiungi il dominio personale (Facoltativo)
Se hai un dominio personalizzato:
1. Vai su **Settings** → **Pages**
2. Sotto "Custom domain", inserisci il tuo dominio
3. Configura il DNS dal tuo provider di dominio

### 6. Uso di un dominio personalizzato (CNAME) - dettagli
Se vuoi usare un dominio personalizzato (es: www.tuodominio.com), segui questi passi:

1. Nel pannello del tuo provider DNS, aggiungi i record seguenti:
	 - Se usi `www.tuodominio.com` come dominio, aggiungi un record CNAME che punti a `TUO_USERNAME.github.io`.
	 - Se vuoi usare il dominio radice `tuodominio.com`, aggiungi i record A che puntano agli IP di GitHub Pages:
		 - 185.199.108.153
		 - 185.199.109.153
		 - 185.199.110.153
		 - 185.199.111.153

2. Nella repository, crea un file `CNAME` (nella root) che contenga solo il tuo dominio personalizzato (es: `www.tuodominio.com`) e fai push.

3. Torna in **Settings** → **Pages** e verifica che il tuo dominio sia elencato. GitHub tenterà automaticamente di emettere il certificato HTTPS.

4. Assicurati di abilitare l'opzione **Enforce HTTPS** una volta che il certificato è stato emesso.

Note:
- La propagazione DNS può richiedere fino a 48 ore, ma spesso è molto più veloce.
- Non rimuovere il file `CNAME` dal repository finché non desideri disabilitare il dominio personalizzato.

## 📊 Tips per il Successo

✅ **SEO**: I meta tag sono già configurati  
✅ **Mobile**: Il sito è completamente responsive  
✅ **Performance**: Caricamento veloce (no dipendenze pesanti)  
✅ **Social**: Link diretti a Facebook e Instagram  

## 🔄 Aggiornare il sito

Ogni volta che vuoi aggiornare il sito:

```bash
git add .
git commit -m "Descrivi il cambiamento"
git push
```

Il sito si aggiornerà automaticamente in pochi secondi!

## ❓ Problemi Comuni

### Il sito non appare
- Aspetta 2-3 minuti (primo deploy)
- Controlla che il repository sia PUBLIC
- Verifica che i file siano nel branch corretto

### URL errato
- Controlla che il nome del repository sia esatto
- Lo username deve essere scritto correttamente (case-sensitive)

### Il sito è lento
- Cancella la cache del browser (Ctrl+Shift+Del)
- Attendi alcuni minuti per la propagazione DNS

## 📧 Supporto

Per domande su GitHub Pages, consulta la [documentazione ufficiale](https://docs.github.com/en/pages)

---

**Congratulazioni!** Il tuo sito web è online e raggiungibile da tutto il mondo gratuitamente! 🎉
