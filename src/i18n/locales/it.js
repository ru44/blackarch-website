export default {
  home: {
    copy: "copia",
    copied: "copiato",
    copyLabel: "Copia il comando",
    quick: "Comando di installazione rapida",
    stats: [
      { n: "2800+", l: "strumenti nel repository" },
      { n: "x86_64", l: "e ARM con Arch Linux ARM" },
      { n: "Rolling", l: "aggiornamenti continui con pacman" },
      { n: "2013", l: "primo rilascio" },
    ],
    features: [
      {
        t: "Basato su Arch",
        d: "Rilascio continuo, pacman e compatibilità con l'AUR. Nessun fork, nessuna versione congelata.",
      },
      {
        t: "Ogni strumento con un solo comando",
        d: "Oltre 2800 strumenti, ognuno a portata di pacman -S. Consulta l'elenco completo.",
      },
      {
        t: "Installazione per categoria",
        d: "Installa un'intera categoria, come blackarch-webapp, oppure solo gli strumenti che ti servono.",
      },
      {
        t: "Funziona sul tuo Arch",
        d: "Aggiungi il repository a un'installazione esistente con strap.sh, senza reinstallare nulla.",
      },
    ],
  },
  shots: { title: "BlackArch in azione", aria: "Screenshot di BlackArch" },
  iso: {
    version: "Versione",
    size: "Dimensione",
    download: "Scarica",
    torrent: "Torrent",
    copy: "copia",
    copied: "copiato",
    tags: ["Consigliata", "Minimale"],
    desc: [
      "Desktop XFCE con una selezione di strumenti comuni e installer grafico.",
      "Immagine di avvio leggera. Scegli solo ciò che serve; richiede internet.",
    ],
  },
  people: { copy: "copia", copied: "copiato", label: "Sviluppatori di BlackArch" },
  mirrors: {
    title: "Mirror ufficiali di BlackArch Linux",
    summary: (c, m) => `${c} paesi, ${m} mirror. Scegline uno vicino a te.`,
    placeholder: "Cerca per paese o URL del mirror…",
    noMatch: "Nessun mirror corrisponde a",
    clear: "Cancella ricerca",
    copy: "copia",
    ok: "ok",
  },
  donate: {
    title: "Mantieni BlackArch libero",
    intro:
      "Il team lavora a BlackArch su base volontaria, nel tempo libero. Le donazioni coprono solo le spese del progetto e il suo sviluppo futuro. Ogni importo conta.",
    method: "Metodo di pagamento",
    paypalTab: "PayPal",
    btcTab: "Bitcoin",
    paypalText: "Scegli qualsiasi importo sulla pagina sicura di PayPal. Carta o saldo PayPal.",
    paypalCta: "Dona con PayPal",
    wallet: "Apri nell'app wallet",
    copy: "copia",
    copied: "copiato",
    qrLabel: "Codice QR dell'indirizzo Bitcoin",
    copyAddr: "Copia indirizzo Bitcoin",
    waysTitle: "Altri modi per aiutare",
    costs: [
      { t: "Sito e dominio", d: "Hosting e dominio blackarch.org." },
      {
        t: "Mirror di download",
        d: "Banda e spazio perché ISO e pacchetti siano veloci in tutto il mondo.",
      },
      {
        t: "Hardware di build e test",
        d: "Macchine per compilare, firmare e testare i pacchetti prima del rilascio.",
      },
      { t: "Sviluppo futuro", d: "Finanzia nuovi strumenti e le prossime release." },
    ],
    ways: [
      {
        t: "Assegna una stella",
        d: "Una stella al repository su GitHub fa una grande differenza.",
        a: "Apri GitHub",
      },
      {
        t: "Aiuta gli utenti",
        d: "Rispondi alle domande nel canale Matrix.",
        a: "Entra su Matrix",
      },
      { t: "Traduci", d: "Traduci la guida dai sorgenti LaTeX.", a: "Ottieni i sorgenti" },
      {
        t: "Sponsor aziendale",
        d: "Le organizzazioni possono diventare sponsor ufficiali.",
        a: "Scrivi al team",
      },
    ],
  },
  community: {
    channels: [
      { d: "Il posto migliore per chiedere aiuto. Chat in tempo reale con utenti e team." },
      {
        d: "Tutto il codice, gli script di build e i sorgenti del sito. Issue e pull request di ogni dimensione sono benvenute.",
      },
      {
        d: "Nuovi strumenti, nuovi mirror e cambiamenti importanti. Menzionaci per bug e suggerimenti.",
      },
      { d: "Video sull'installazione, la configurazione e l'uso dei principali strumenti." },
      { d: "Segui il feed delle novità nel tuo lettore." },
      { d: "Contatta direttamente il team di sviluppo principale." },
    ],
    newsTitle: "Novità e aggiornamenti",
    lead: "Lavoriamo sempre a nuove funzionalità e miglioramenti. Qui puoi seguirli in diretta.",
    updates: [
      {
        t: "Issue tracker",
        d: "Segnalazioni di bug e richieste di strumenti vengono gestite qui.",
      },
      {
        t: "Pull request",
        d: "Cosa viene pacchettizzato, aggiornato e rilasciato in questo momento.",
      },
      { t: "Annunci", d: "Le novità sono su Matrix, YouTube e X. C'è anche il feed RSS." },
    ],
  },
  faq: {
    placeholder: "Cerca nelle FAQ…",
    searchLabel: "Cerca domande",
    all: "Tutte",
    noResults: "Nessuna domanda corrisponde",
    clear: "Cancella ricerca",
    copy: "copia",
    copied: "copiato",
    copyLabel: "Copia il comando",
    count: (n, t) => `${n} di ${t} domande`,
    permalink: "Link a questa domanda",
  },
  tools: {
    placeholder: "Cerca per nome o descrizione…",
    searchLabel: "Cerca strumenti",
    clear: "Cancella ricerca",
    all: "Tutti",
    showing: "Mostrati",
    of: "di",
    tools: "strumenti",
    loading: "Caricamento strumenti…",
    loadingLabel: "Caricamento strumenti",
    noMatch: "Nessuno strumento corrisponde a",
    clearFilters: "Azzera filtri",
    name: "Nome",
    version: "Versione",
    description: "Descrizione",
    category: "Categoria",
    website: "Sito",
    visit: "Visita il sito",
    noSite: "Nessun sito indicato",
    install: "Installa",
    copy: "copia",
    copied: "copiato",
    copyAria: (n) => `Copia il comando di installazione di ${n}`,
    expandAria: (n) => `Mostra i dettagli di ${n}`,
    filterLabel: "Filtra per categoria",
  },
  faqItems: {
    cats: {
      "Getting started": "Per iniziare",
      Updates: "Aggiornamenti",
      Troubleshooting: "Risoluzione dei problemi",
      Community: "Community",
    },
    items: {
      "right-distro": {
        q: "BlackArch Linux è la distribuzione per pentesting giusta per me?",
        a: [
          {
            p: "BlackArch è una distribuzione Linux per penetration testing basata su ArchLinux. Se non hai familiarità con ArchLinux, o con Linux in generale, ti sconsigliamo vivamente di usare BlackArch a causa della curva di apprendimento per chi è alle prime armi.",
          },
        ],
      },
      "where-to-start": {
        q: "Da dove comincio con BlackArch?",
        a: [
          {
            p: 'Prima di tutto devi scaricare una ISO dalla <a href="/downloads">pagina dei download</a> e installarla seguendo le istruzioni dello script di installazione. Trovi un tutorial che mostra il procedimento passo dopo passo nella <a href="/install">pagina di installazione</a>. Se incontri dei problemi e hai bisogno di aiuto, il posto migliore dove chiedere è il nostro <a href="https://matrix.to/#/#BlackArch:matrix.org">canale Matrix</a>.',
          },
        ],
      },
      "up-to-date": {
        q: "BlackArch è aggiornato?",
        a: [
          {
            p: "BlackArch viene aggiornato di continuo e offre gli ultimi pacchetti disponibili su Github. Rilasciamo una nuova ISO quattro volte l'anno (ogni trimestre). Queste nuove immagini contengono pacchetti aggiornati e di solito includono correzioni di bug. Se trovi un pacchetto obsoleto e vuoi vederlo aggiornato, segnalalo come issue nel nostro repository Github.",
          },
        ],
      },
      "install-updates": {
        q: "Come posso scaricare e installare l'ultimo aggiornamento disponibile?",
        a: [
          { p: "Basta eseguire pacman:" },
          { code: "sudo pacman -Syu" },
          { p: "Questo comando richiede privilegi di root." },
        ],
      },
      "keyring-signature": {
        q: "Perché ricevo l'errore «invalid keyring signature»?",
        a: [
          { p: "Può succedere per moltissimi motivi. Ecco alcuni suggerimenti." },
          {
            ul: [
              "Non hai una connessione a internet (come puoi immaginare è un problema raro e si verifica in fretta).",
              "Potresti avere un problema di DNS che impedisce di risolvere correttamente pgp.mit.edu. Controlla le impostazioni DNS (pgp.mit.edu funziona meglio con il server DNS 8.8.8.8).",
              "Potresti avere un problema di rete diverso dal precedente, per il quale è difficile aiutarti perché le cause possibili sono moltissime. Ad esempio: la cache DNS.",
              "Potresti avere un problema con l'orologio di sistema.",
              "Qualcosa potrebbe bloccare la comunicazione con il server mit.edu, ad esempio un firewall.",
              "Se sei connesso tramite VPN, prova a disattivarla temporaneamente ed esegui di nuovo <code>strap.sh</code>.",
            ],
          },
          {
            p: "Dopo aver verificato tutti i punti qui sopra, se hai ancora problemi con <code>strap.sh</code>, prova le opzioni seguenti:",
          },
          { p: "<strong>1ª opzione:</strong>" },
          {
            code: "sudo rm -rf /etc/pacman.d/gnupg\nsudo pacman-key --init\nsudo pacman-key --populate archlinux blackarch\nsudo pacman-key --update --keyserver keyserver.ubuntu.com",
          },
          {
            p: "<strong>2ª opzione:</strong> puoi provare a passare all'indirizzo IP di pgp.mit.edu con il comando seguente:",
          },
          {
            code: "curl -O https://blackarch.org/strap.sh\nchmod +x strap.sh\nsha1sum strap.sh # it should match the SHA1 sum on the downloads page\nsudo sh strap.sh",
          },
          {
            p: "<strong>3ª opzione:</strong> puoi provare a passare temporaneamente a un altro mirror:",
          },
          { code: "sudoedit /etc/pacman.d/blackarch-mirrorlist" },
          {
            p: 'È molto importante seguire i consigli qui sopra e consultare le pagine della Wiki di Archlinux. Se continui ad avere problemi, passa a trovarci su <a href="https://matrix.to/#/#BlackArch:matrix.org">#BlackArch:matrix.org</a>.',
          },
        ],
      },
      "get-help": {
        q: "Dove posso trovare aiuto per un problema che sto incontrando?",
        a: [
          {
            p: "A seconda del problema, puoi visitare il nostro Github e aprire una issue nella relativa pagina, ad esempio:",
          },
          {
            ul: [
              "<strong>Repository BlackArch Site:</strong> riguarda il nostro sito web. Ad esempio: un link non funziona o un'immagine non si carica.",
              "<strong>Repository BlackArch:</strong> riguarda i nostri pacchetti. Ad esempio: un pacchetto non viene aggiornato da tempo o non si avvia.",
              "<strong>Repository BlackArch Installer:</strong> riguarda il nostro installer. Ad esempio: l'installazione è fallita oppure non riesci ad avviare il sistema dopo un'installazione riuscita.",
            ],
          },
          {
            p: 'Puoi anche dedicare un po\' di tempo a esplorare gli altri repository. Se non trovi comunque una soluzione, visita il nostro <a href="https://matrix.to/#/#BlackArch:matrix.org">canale Matrix</a> e chiedi aiuto. Tieni presente, però, che gli utenti di BlackArch si trovano in parti diverse del mondo (fusi orari diversi): abbi pazienza, fai la tua domanda e attendi una risposta.',
          },
        ],
      },
      contribute: {
        q: "Vorrei dare una mano. Cosa posso fare?",
        a: [
          {
            p: 'BlackArch Linux è un progetto enorme: ogni giorno aggiungiamo nuove applicazioni e funzionalità. Se vuoi aiutarci in qualsiasi modo, visita il nostro <a href="https://matrix.to/#/#BlackArch:matrix.org">canale Matrix</a>. Ricorda solo di aspettare una risposta: siamo in fusi orari diversi.',
          },
        ],
      },
    },
  },
  arch: {
    aria: "Esplora l'architettura di BlackArch",
    stepsAria: "Passaggi; usa le frecce",
    copy: "copia",
    copied: "copiato",
    copyAria: (c) => `Copia ${c}`,
    tabs: [
      { label: "Livelli", hint: "Come BlackArch si appoggia ad Arch" },
      { label: "Pipeline di build", hint: "Dal PKGBUILD al tuo pacman" },
      { label: "Flusso degli aggiornamenti", hint: "Come entrano le modifiche" },
      { label: "Livelli della ISO", hint: "Come vengono assemblate le immagini" },
    ],
    layers: [
      {
        t: "Strumenti",
        b: "Oltre 2800 pacchetti, ciascuno con il proprio PKGBUILD in packages/<name> nel repository blackarch.",
      },
      {
        t: "Gruppi per categoria",
        b: "I pacchetti sono raggruppati come blackarch-<category>, più il gruppo blackarch che li comprende tutti.",
      },
      {
        t: "Repository BlackArch",
        b: "Un repository utente non ufficiale, reso affidabile dal pacchetto blackarch-keyring.",
      },
      {
        t: "Arch Linux",
        b: "I repository core, extra e multilib, pacman, systemd e la base rolling release. BlackArch vi si aggiunge, non ne fa un fork.",
      },
    ],
    pipeline: [
      {
        t: "Sorgente upstream",
        b: "Il punto di partenza è una release dello strumento o il suo repository git.",
      },
      {
        t: "PKGBUILD",
        b: "Un maintainer scrive un PKGBUILD in packages/<name> del repository blackarch, partendo dai template di blackarch-pkgbuilds.",
      },
      {
        t: "Build in chroot pulito",
        b: "babuild incapsula archbuild / makechrootpkg di Arch, così le dipendenze di build vengono verificate in isolamento.",
      },
      { t: "Firma", b: "I pacchetti compilati ricevono firme GPG detached (.sig)." },
      {
        t: "Release e repo-add",
        b: "barelease invia i pacchetti al server di build, acquisisce un lock e aggiorna il database del repository.",
      },
      {
        t: "Mirror",
        b: "I mirror controllano via HTTP il timestamp di lastupdate ed eseguono rsync solo quando cambia.",
      },
      {
        t: "Il tuo computer",
        b: "pacman sincronizza blackarch.db e verifica le firme con il keyring.",
      },
    ],
    updates: [
      {
        t: "Apri una PR",
        b: "I contributori fanno il fork del repository blackarch e aprono una pull request. Formato del titolo: <pkgname>: <modifica>.",
      },
      {
        t: "Test in tre modi",
        b: "Compila in un chroot pulito, eseguilo in un chroot pulito, poi installalo su un sistema BlackArch completo per individuare conflitti tra file.",
      },
      {
        t: "Coda di rilascio",
        b: "Il nome di ogni pacchetto modificato viene aggiunto a lists/to-release.",
      },
      {
        t: "Build e firma dello sviluppatore",
        b: "Uno sviluppatore BlackArch con accesso al server di build compila, firma e rilascia il pacchetto.",
      },
      {
        t: "Script di supporto",
        b: "Il repository include script per trovare pacchetti obsoleti e aggiornare le versioni (outdated, pkgver, pkgrel, up-officials).",
      },
      {
        t: "Gli utenti aggiornano",
        b: "Rolling release: il prossimo pacman -Syu scarica il nuovo pacchetto.",
      },
    ],
    iso: [
      {
        t: "base",
        b: "Condiviso da tutte le varianti: configurazione del keyring, scelta dei mirror, tema di avvio, configurazione della shell, pacchetti di base.",
      },
      {
        t: "graphical",
        b: "Livello desktop usato da Full e Slim (Slim usa di default XFCE4 + LightDM).",
      },
      {
        t: "variant",
        b: "full, slim o netinstall aggiunge la propria lista di pacchetti. I livelli successivi sovrascrivono i file; le liste di pacchetti vengono concatenate.",
      },
      {
        t: "merge-profile",
        b: "I livelli vengono uniti in un unico profilo archiso; nei template .in i segnaposto sono compilati con i valori di variant.conf.",
      },
      {
        t: "mkarchiso",
        b: "archiso costruisce l'immagine finale. Full = base+graphical+full, Slim = base+graphical+slim, NetInstall = base+netinstall.",
      },
    ],
  },
  journey: {
    title: "Come uno strumento arriva da te",
    mine: "Il tuo percorso",
    copy: "copia",
    copied: "copiato",
    stations: [
      { t: "Upstream", who: "Autore dello strumento", out: "sorgenti / release" },
      { t: "Pacchettizzazione", who: "Maintainer", out: "PKGBUILD" },
      { t: "Build e firma", who: "Sviluppatore", out: ".pkg.tar.zst + .sig" },
      { t: "Release", who: "Server di build", out: "blackarch.db" },
      { t: "Mirror", who: "Gestori dei mirror", out: "copia via rsync" },
      { t: "Tu", who: "pacman", out: "strumento installato" },
    ],
    steps: ["1. Aggiungi il repository", "2. Sincronizza", "3. Installa uno strumento"],
  },
};
