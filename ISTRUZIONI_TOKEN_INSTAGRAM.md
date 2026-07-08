# Token Instagram che non scade mai (System User)

Il feed "News" del sito legge `data/instagram.json`, aggiornato ogni 6 ore dal
workflow [`fetch-instagram-graph.yml`](.github/workflows/fetch-instagram-graph.yml)
tramite le Meta Graph API. Quel workflow usa due secret di GitHub:

- `IG_USER_ID` — id dell'account Instagram Business/Creator
- `IG_ACCESS_TOKEN` — token di accesso

Un token "utente" normale scade dopo 60-90 giorni. Per non doverlo più rinnovare
a mano, Meta mette a disposizione i **token da System User**, pensati apposta
per integrazioni server-to-server: possono essere impostati con scadenza
**"Non scade mai"**.

## Procedura (una tantum)

1. **Apri Meta Business Suite / Business Manager** → [business.facebook.com](https://business.facebook.com)
   - Se non hai ancora un Business Manager collegato alla Pagina Facebook a cui
     è collegato l'account Instagram, creane uno (gratuito) e aggiungi lì la
     Pagina Facebook e l'account Instagram professionale.

2. **Impostazioni azienda → Utenti → Utenti di sistema** (Business Settings →
   Users → System Users)
   - Crea un nuovo System User (es. "sito-web-token"), ruolo **Admin** (o
     "Employee" se assegni manualmente solo gli asset necessari).

3. **Assegna gli asset al System User**
   - Nella scheda del System User, premi "Aggiungi asset" e collega:
     - la Pagina Facebook collegata all'account Instagram
     - l'account Instagram stesso (se selezionabile separatamente)
   - Dai permesso di controllo completo ("Full control") o almeno gestione,
     così può leggere i contenuti tramite Graph API.

4. **Genera il token**
   - Nella scheda del System User → "Genera nuovo token"
   - Seleziona l'app Meta usata per il progetto (quella con cui è stato
     ottenuto il vecchio `IG_ACCESS_TOKEN`)
   - Permessi da selezionare: `instagram_basic`, `pages_show_list`,
     `pages_read_engagement` (gli stessi già usati oggi)
   - **Scadenza token**: scegli **"Non scade mai"**
   - Copia il token generato (viene mostrato una sola volta)

5. **Aggiorna il secret su GitHub**
   - Vai su GitHub → il repository → *Settings → Secrets and variables →
     Actions*
   - Apri il secret `IG_ACCESS_TOKEN` → *Update* → incolla il nuovo token →
     salva
   - `IG_USER_ID` resta invariato

6. **Verifica**
   - Vai su *Actions* → workflow "Fetch Instagram (Graph API)" → *Run workflow*
     (esecuzione manuale) per controllare subito che tutto funzioni con il
     nuovo token, senza aspettare il prossimo ciclo automatico.

Da questo momento il workflow continuerà a girare ogni 6 ore senza bisogno di
toccare più nulla: il token da System User non ha una data di scadenza.

## Nota

Il token smette di funzionare solo se: viene revocato manualmente dal Business
Manager, l'app Meta viene eliminata, oppure il System User perde l'accesso
alla Pagina/account Instagram. Non scade mai per il semplice passare del
tempo.
