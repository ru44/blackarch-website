export default {
  home: {
    copy: "kopieren", copied: "kopiert", copyLabel: "Befehl kopieren", quick: "Befehl zur Schnellinstallation",
    stats: [
      { n: "2800+", l: "Tool-Pakete" },
      { n: "x86_64", l: "+ ARM über Arch ARM" },
      { n: "Rolling", l: "Releases über pacman" },
      { n: "2013", l: "erstes Release" },
    ],
    features: [
      { t: "Auf Arch aufgebaut", d: "Rolling Release, pacman und AUR-Kompatibilität. Keine Forks, keine eingefrorenen Versionen." },
      { t: "Jedes Tool mit einem Befehl", d: "Über 2800 Tools, alle per pacman -S verfügbar. Die Liste steht auf der Tools-Seite." },
      { t: "Installation nach Kategorie", d: "Die ganze Gruppe blackarch oder nur eine einzelne wie blackarch-webapp installieren." },
      { t: "Läuft auf dem eigenen Arch", d: "Das Repository mit strap.sh zum bestehenden System hinzufügen. Keine Neuinstallation nötig." },
    ],
  },
  shots: { title: "So sieht es aus", full: "Vollständige ISO", slim: "Slim-ISO", aria: "BlackArch-Screenshots" },
  iso: {
    version: "Version", size: "Größe", download: "Herunterladen", torrent: "Torrent", copy: "kopieren", copied: "kopiert",
    tags: ["Empfohlen", "Minimal", "Offline", "Virtuelle Maschine"],
    desc: [
      "XFCE-Desktop, eine Auswahl beliebter Tools und ein grafischer Installer.",
      "Kleines Boot-Image. Nur das Nötige auswählen; Internetverbindung erforderlich.",
      "Alle Tools zum Zeitpunkt des Builds. Bei Updates sind Konflikte möglich; für Offline-Installationen.",
      "Fertiges Image für VirtualBox, VMware und QEMU.",
    ],
  },
  people: { copy: "kopieren", copied: "kopiert", label: "BlackArch-Entwickler" },
  mirrors: {
    title: "Offizielle BlackArch-Linux-Mirrors",
    summary: (c, m) => `${c} Länder, ${m} Mirrors. Den nächstgelegenen auswählen.`,
    placeholder: "Nach Land oder Mirror-Adresse suchen…", noMatch: "Keine passenden Mirrors", clear: "Suche zurücksetzen", copy: "kopieren", ok: "ok",
  },
  donate: {
    title: "BlackArch frei halten",
    intro: "Das Team arbeitet ehrenamtlich in seiner Freizeit an BlackArch. Spenden fließen nur in die Kosten und die Weiterentwicklung des Projekts. Jeder Betrag hilft.",
    method: "Zahlungsart", paypalTab: "PayPal", btcTab: "Bitcoin",
    paypalText: "Einen beliebigen Betrag auf der sicheren PayPal-Seite wählen. Per Karte oder PayPal-Guthaben.",
    paypalCta: "Über PayPal spenden", wallet: "In der Wallet öffnen",
    copy: "kopieren", copied: "kopiert", qrLabel: "QR-Code der Bitcoin-Adresse", copyAddr: "Bitcoin-Adresse kopieren",
    waysTitle: "Weitere Möglichkeiten zu helfen",
    costs: [
      { t: "Website und Domain", d: "Hosting und die Domain blackarch.org." },
      { t: "Download-Mirrors", d: "Traffic und Speicher, damit ISOs und Pakete weltweit schnell geladen werden." },
      { t: "Build- und Test-Hardware", d: "Rechner zum Bauen, Signieren und Prüfen der Pakete vor der Veröffentlichung." },
      { t: "Weitere Entwicklung", d: "Neue Tools und kommende Releases." },
    ],
    ways: [
      { t: "Stern vergeben", d: "Ein Stern auf GitHub hilft sehr.", a: "GitHub öffnen" },
      { t: "Anderen Nutzern helfen", d: "Fragen in Matrix beantworten.", a: "Matrix beitreten" },
      { t: "Übersetzen", d: "Das Handbuch anhand der LaTeX-Quellen übersetzen.", a: "Quellen holen" },
      { t: "Unternehmens-Sponsoring", d: "Organisationen können offizielle Sponsoren werden.", a: "Das Team kontaktieren" },
    ],
  },
  community: {
    channels: [
      { d: "Der beste Ort, um Hilfe zu bekommen. Echtzeit-Chat mit Nutzern und dem Team." },
      { d: "Der gesamte Code, Build-Skripte und die Quellen der Website. Issues und Pull Requests jeder Größe sind willkommen." },
      { d: "Neue Tools, Mirrors und wichtige Änderungen am Projekt. Einfach erwähnen, wenn ein Fehler auftaucht oder eine Idee besteht." },
      { d: "Videos zu Installation, Einrichtung und Nutzung der wichtigsten Tools." },
      { d: "Den News-Feed im eigenen Reader verfolgen." },
      { d: "Direkter Kontakt zum Kernteam der Entwicklung." },
    ],
    newsTitle: "Neuigkeiten und Updates",
    lead: "Wir arbeiten ständig an neuen Funktionen und Verbesserungen. Hier lässt sich das verfolgen.",
    updates: [
      { t: "Issue-Tracker", d: "Hier werden Fehlerberichte und Tool-Wünsche erfasst und bearbeitet." },
      { t: "Pull Requests", d: "Was gerade paketiert, aktualisiert und veröffentlicht wird." },
      { t: "Ankündigungen", d: "Neuigkeiten erscheinen in Matrix, auf YouTube und X. Einen RSS-Feed gibt es ebenfalls." },
    ],
  },
  faq: {
    placeholder: "FAQ durchsuchen…", searchLabel: "Fragen suchen", all: "Alle", noResults: "Keine passenden Fragen", clear: "Suche zurücksetzen",
    copy: "kopieren", copied: "kopiert", copyLabel: "Befehl kopieren", count: (n, t) => `${n} von ${t} Fragen`, permalink: "Link zu dieser Frage",
  },
  tools: {
    placeholder: "Nach Name oder Beschreibung suchen…", searchLabel: "Tools suchen", clear: "Suche zurücksetzen", all: "Alle",
    showing: "Angezeigt", of: "von", tools: "Tools", loading: "Tools werden geladen…", loadingLabel: "Tools werden geladen",
    noMatch: "Keine passenden Tools", clearFilters: "Filter zurücksetzen", name: "Name", version: "Version", description: "Beschreibung",
    category: "Kategorie", website: "Website", visit: "Website öffnen", noSite: "Keine Website angegeben", install: "Installation", copy: "kopieren", copied: "kopiert",
    copyAria: (n) => `Installationsbefehl für ${n} kopieren`, expandAria: (n) => `Details anzeigen: ${n}`, filterLabel: "Nach Kategorie filtern",
  },
};
