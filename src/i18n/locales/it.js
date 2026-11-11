export default {
  home: {
    copy: "copia", copied: "copiato", copyLabel: "Copia il comando", quick: "Comando di installazione rapida",
    stats: [
      { n: "2800+", l: "strumenti pacchettizzati" },
      { n: "x86_64", l: "+ ARM tramite Arch ARM" },
      { n: "Rolling", l: "rilasci via pacman" },
      { n: "2013", l: "primo rilascio" },
    ],
    features: [
      { t: "Arch al centro", d: "Rolling release, pacman, compatibile con AUR. Nessun fork, nessuna versione congelata." },
      { t: "Ogni strumento, un comando", d: "Oltre 2800 strumenti, ognuno a un pacman -S di distanza. Sfoglia l'elenco degli strumenti." },
      { t: "Installa per categoria", d: "Installa l'intero gruppo blackarch o una parte, come blackarch-webapp." },
      { t: "Funziona sul tuo Arch", d: "Aggiungi il repository a un'installazione esistente con strap.sh. Nessuna reinstallazione." },
    ],
  },
  shots: { title: "Guardalo in azione", full: "ISO Full", slim: "ISO Slim", aria: "Screenshot di BlackArch" },
  iso: {
    version: "Versione", size: "Dimensione", download: "Scarica", torrent: "Torrent", copy: "copia", copied: "copiato",
    tags: ["Consigliata", "Minimale", "Offline", "Macchina virtuale"],
    desc: [
      "Desktop XFCE con una selezione di strumenti comuni e installer grafico.",
      "Immagine di avvio leggera. Scegli solo ciò che serve; richiede internet.",
      "Tutti gli strumenti al momento della build. Possibili conflitti negli aggiornamenti; pensata per l'installazione offline.",
      "Appliance pronta per VirtualBox, VMware e QEMU.",
    ],
  },
  people: { copy: "copia", copied: "copiato", label: "Sviluppatori di BlackArch" },
  mirrors: {
    title: "Mirror ufficiali di BlackArch Linux",
    summary: (c, m) => `${c} paesi, ${m} mirror. Scegline uno vicino a te.`,
    placeholder: "Cerca per paese o URL del mirror…", noMatch: "Nessun mirror corrisponde a", clear: "Cancella ricerca", copy: "copia", ok: "ok",
  },
  donate: {
    title: "Mantieni BlackArch libero",
    intro: "Il team lavora a BlackArch su base volontaria, nel tempo libero. Le donazioni coprono solo le spese del progetto e il suo sviluppo futuro. Ogni importo conta.",
    method: "Metodo di pagamento", paypalTab: "PayPal", btcTab: "Bitcoin",
    paypalText: "Scegli qualsiasi importo sulla pagina sicura di PayPal. Carta o saldo PayPal.",
    paypalCta: "Dona con PayPal", wallet: "Apri nell'app wallet",
    copy: "copia", copied: "copiato", qrLabel: "Codice QR dell'indirizzo Bitcoin", copyAddr: "Copia indirizzo Bitcoin",
    waysTitle: "Altri modi per aiutare",
    costs: [
      { t: "Sito e dominio", d: "Hosting e dominio blackarch.org." },
      { t: "Mirror di download", d: "Banda e spazio perché ISO e pacchetti siano veloci in tutto il mondo." },
      { t: "Hardware di build e test", d: "Macchine per compilare, firmare e testare i pacchetti prima del rilascio." },
      { t: "Sviluppo futuro", d: "Finanzia nuovi strumenti e le prossime release." },
    ],
    ways: [
      { t: "Metti una stella", d: "Una stella su GitHub fa la differenza.", a: "Apri GitHub" },
      { t: "Aiuta gli utenti", d: "Rispondi alle domande nel canale Matrix.", a: "Entra su Matrix" },
      { t: "Traduci", d: "Traduci la guida dai sorgenti LaTeX.", a: "Ottieni i sorgenti" },
      { t: "Sponsor aziendale", d: "Le organizzazioni possono diventare sponsor ufficiali.", a: "Scrivi al team" },
    ],
  },
  community: {
    channels: [
      { d: "Il posto migliore per chiedere aiuto. Chat in tempo reale con utenti e team." },
      { d: "Tutto il codice, gli script di build e i sorgenti del sito. Issue e pull request di ogni dimensione sono benvenute." },
      { d: "Nuovi strumenti, nuovi mirror e cambiamenti importanti. Menzionaci per bug e suggerimenti." },
      { d: "Video sull'installazione, la configurazione e l'uso dei principali strumenti." },
      { d: "Segui il feed delle novità nel tuo lettore." },
      { d: "Contatta direttamente il team di sviluppo principale." },
    ],
    newsTitle: "Novità e aggiornamenti",
    lead: "Lavoriamo sempre a nuove funzionalità e miglioramenti. Qui puoi seguirli in diretta.",
    updates: [
      { t: "Issue tracker", d: "Segnalazioni di bug e richieste di strumenti vengono gestite qui." },
      { t: "Pull request", d: "Cosa viene pacchettizzato, aggiornato e rilasciato in questo momento." },
      { t: "Annunci", d: "Le novità sono su Matrix, YouTube e X. C'è anche il feed RSS." },
    ],
  },
  faq: {
    placeholder: "Cerca nelle FAQ…", searchLabel: "Cerca domande", all: "Tutte", noResults: "Nessuna domanda corrisponde", clear: "Cancella ricerca",
    copy: "copia", copied: "copiato", copyLabel: "Copia il comando", count: (n, t) => `${n} di ${t} domande`, permalink: "Link a questa domanda",
  },
  tools: {
    placeholder: "Cerca per nome o descrizione…", searchLabel: "Cerca strumenti", clear: "Cancella ricerca", all: "Tutti",
    showing: "Mostrati", of: "di", tools: "strumenti", loading: "Caricamento strumenti…", loadingLabel: "Caricamento strumenti",
    noMatch: "Nessuno strumento corrisponde a", clearFilters: "Azzera filtri", name: "Nome", version: "Versione", description: "Descrizione",
    category: "Categoria", website: "Sito", visit: "Visita il sito", noSite: "Nessun sito indicato", install: "Installa", copy: "copia", copied: "copiato",
    copyAria: (n) => `Copia il comando di installazione di ${n}`, expandAria: (n) => `Mostra i dettagli di ${n}`, filterLabel: "Filtra per categoria",
  },
};
