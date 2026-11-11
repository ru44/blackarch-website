---
outline: deep
title: Installazione
translated: true
---

# Installare BlackArch Linux

Questo tutorial ti mostra come installare BlackArch Linux usando la ISO e blackarch-installer. Il tutorial usa VirtualBox, ma puoi usare anche altri software di virtualizzazione, se preferisci.

Si presume che tu abbia già scritto la ISO dalla [pagina dei download](./downloads) su una chiavetta USB o su un DVD e che sia tutto pronto per l'installazione.

## 1. Avvia la ISO

All'avvio dell'immagine dovresti vedere una schermata simile alla seguente. Seleziona la tua architettura e premi invio. [Esempio: BlackArch Linux (x86_64) per 64 bit]

![Menu di avvio della ISO di BlackArch con la scelta dell'architettura](/images/bl-install/1.png)

::: tip Installi in VirtualBox?
Se vuoi installare BlackArch con VirtualBox, assicurati di scegliere la ISO giusta. Verifica che il tuo hardware supporti la virtualizzazione e, in tal caso, abilitala nelle impostazioni UEFI/BIOS. Se non è supportata, devi usare la ISO a 32 bit. QEMU con KVM è stato testato con successo e può essere usato al posto di VirtualBox.
:::

## 2. Accedi

Attendi la comparsa del prompt di login di BlackArch. Le credenziali predefinite di BlackArch Linux sono:

- Login: `root`
- Password: `blackarch`

Se usi la ISO Slim le credenziali sono:

- Login: `liveuser`
- Password: `blackarch`

![Prompt di login di BlackArch su tty1](/images/bl-install/2.png)

## 3. Avvia l'installer

Per avviare l'installazione devi eseguire lo script di installazione di BlackArch. Per evitare problemi che ti costringano a ricominciare, assicurati che la macchina su cui vuoi installare BlackArch abbia accesso a internet. Puoi elencare le interfacce di rete disponibili con il comando `ip a`. Se vuoi usare il wifi, o è l'unica opzione che hai, leggi la <a href="https://wiki.archlinux.org/title/Network_configuration/Wireless">wiki di Arch</a> per imparare a configurare una connessione wireless (ad es. `wifi-menu`/`netctl`).

Se la tua tastiera è diversa da quella predefinita (QWERTY US), puoi impostare la mappatura corrispondente alla tua lingua o al tuo paese. Ad esempio, digita il comando `loadkeys` seguito dalle 2 lettere del codice del tuo paese:

```bash
# List network interfaces
$ ip a

# Example: French keyboard layout
$ loadkeys fr

# Start the installer
$ blackarch-install
```

![Esecuzione di blackarch-install dalla shell](/images/bl-install/3.png)

::: tip Eseguire comandi mentre l'installer è al lavoro
Durante questo tutorial potresti voler eseguire dei comandi nella shell mentre lo script è in esecuzione. Puoi farlo in qualsiasi momento senza fermare l'installer cambiando TTY: premi `Ctrl+Alt+F2` (F1 è la TTY predefinita in cui hai lanciato lo script blackarch-install). Da F2 a F6 ottieni ciascuna una nuova TTY in cui eseguire qualsiasi comando ti serva.
:::

## 4. Scegli un metodo di installazione

Dovrebbero ora comparire 3 opzioni.

![Menu dell'installer con i tre metodi di installazione](/images/bl-install/4.png)

1. **Install from repository using pacman** (installa dal repository con pacman): è l'opzione consigliata per la ISO netinstall. Scarica i pacchetti necessari sia dai repository ufficiali di Arch sia da quelli di BlackArch.

2. **Install from Live-ISO** (installa dalla Live-ISO): se hai scaricato la ISO live. Con questa opzione non ti serve internet durante l'installazione. Per avere però un sistema aggiornato, al termine dell'installazione e dopo il primo avvio del nuovo sistema, esegui un aggiornamento completo con `pacman -Syyu`.

3. **Install from source using blackman** (installa dai sorgenti con blackman): non è un'opzione consigliata ai principianti. Invece di scaricare il pacchetto già compilato da un repository, come fa pacman, ottiene il codice sorgente e lo compila. È simile a `emerge` di un sistema Gentoo (blackman si limita a compilare dai sorgenti; emerge è infinitamente più avanzato e offre moltissime funzioni).

## 5. Seleziona la mappatura della tastiera

Ora devi scegliere la mappatura (keymap) che vuoi usare. Se hai una tastiera QWERTY puoi restare su `us`, ma non è sempre così. Se non sei sicuro, puoi elencare le mappature disponibili selezionando `2`. Per lo più si usa il codice del paese in inglese: per una AZERTY francese la keymap è `fr`, per una spagnola `es`, e così via. Se conosci già la keymap, seleziona `1`.

![Menu di selezione della keymap](/images/bl-install/5.png)

Scrivi la keymap come spiegato sopra:

![Inserimento del codice della keymap](/images/bl-install/6.png)

## 6. Imposta un hostname

L'hostname è, in pratica, il nome che vuoi dare al tuo computer nella rete locale: sarà risolto con il nome indicato. Puoi scegliere quello che preferisci e cambiarlo in qualsiasi momento modificando il file `/etc/hostname`.

![Inserimento dell'hostname](/images/bl-install/7.png)

## 7. Configurazione di rete

Verrà mostrato l'elenco delle interfacce di rete disponibili. Come spiegato prima, se possibile scegli la tua interfaccia ethernet: lo script non offre alcun supporto per il wifi. Usare il wifi è comunque possibile, ma dovrai configurarlo tu.

![Selezione dell'interfaccia di rete](/images/bl-install/8.png)

Poi scegli come configurare l'interfaccia:

1. **Auto DHCP** *(usalo se sei un tipo da cucina)*: il modo semplice e consigliato per impostare automaticamente le informazioni di rete. Richiede (affitta) un IP locale al server DHCP/router per il tuo dispositivo.

2. **Manual** *(usalo se sei 1337)*: scegliendo la configurazione manuale dovrai conoscere i dati della tua rete (gateway, indirizzo IP della LAN, subnet mask, ecc.).

3. **Skip** *(usalo se sei già connesso)*: se la tua interfaccia di rete è già configurata e raggiunge internet, usa questa opzione.

![Opzioni di configurazione della rete](/images/bl-install/9.png)

::: warning Il controllo ping fallisce in una VM?
In alcuni casi con un ambiente virtuale come VirtualBox o QEMU, alcune regole del firewall possono scartare l'ICMP: il ping viene negato e l'installazione si blocca a questo passaggio, perché lo script termina credendo che l'interfaccia di rete sia configurata male. Puoi risolvere modificando lo script in `/usr/bin/blackarch-install`: cerca la riga che inizia con `if ! ping -c 1 github.com > /dev/null 2>&1` e commenta o rimuovi ogni riga del blocco condizionale fino al `fi` di chiusura. Dopo aver salvato la modifica, esegui di nuovo `blackarch-install` e ripeti l'installazione.
:::

Pacman ora aggiornerà ogni repository, scaricherà e installerà alcuni pacchetti di base necessari per il passo successivo dell'installazione di BlackArch. Se la tua connessione è lenta, può volerci un po': vai a prenderti un caffè!

![Pacman aggiorna i repository e installa i pacchetti di base](/images/bl-install/10.png)

## 8. Partizionamento

Quando lo script ha finito i preparativi, dovrai creare le partizioni sul dispositivo in cui verrà installato BlackArch. Dovrai scegliere tra 2 o 3 partizioni:

1. Partizione di boot
2. Partizione root
3. Partizione swap *

\* La partizione swap è facoltativa e si può evitare su una macchina virtuale. È comunque consigliabile crearne una piccola, per evitare crash dovuti a un eventuale problema con la RAM.

![Configurazione del disco: scelta del dispositivo](/images/bl-install/11.png)

::: tip Non sai quale sia il dispositivo giusto?
Se vengono elencati più di 2 dispositivi e non sei sicuro di quale scegliere per l'installazione, puoi usare fdisk per vedere la dimensione del dispositivo di destinazione. Ad esempio, se è elencato `sda` e vuoi conoscerne la dimensione (e, se presente, il filesystem): `fdisk -l -o device,size /dev/sda`
:::

Rispondi `y` quando lo script chiede se vuoi creare le partizioni con cfdisk: rispondendo `n` l'installazione si interrompe.

![Richiesta di partizionare con cfdisk](/images/bl-install/12.png)

Se il tuo dispositivo ha già un tipo di etichetta (label), non vedrai questa schermata; altrimenti impostalo su `dos`. Se dopo l'installazione ottieni un errore, potresti avere un dispositivo EFI e dovresti impostarlo su `gpt`.

![Selezione del tipo di etichetta in cfdisk](/images/bl-install/13.png)

Ora devi creare le partizioni. L'esempio proposto è di base e dovrebbe funzionare nella maggior parte dei casi. Servono almeno 2 partizioni (boot e root), ma in questo esempio ne useremo 3, compresa quella di swap.

![cfdisk con una tabella delle partizioni vuota](/images/bl-install/14.png)

### Partizione di boot

Iniziamo dalla prima, boot. Con le frecce vai su **New**, premi invio e scrivi `500M`. È spazio sufficiente per la maggior parte degli utenti, dato che non avrai più di 3 kernel diversi contemporaneamente.

![Creazione della partizione di boot da 500M](/images/bl-install/15.png)

Seleziona **primary** e premi invio.

![Scelta del tipo di partizione primaria](/images/bl-install/16.png)

Devi contrassegnare questa partizione come avviabile. Vai sull'opzione **Bootable** e premi invio: dovrebbe comparire il simbolo `*`, come nella schermata. Se il tuo dispositivo è EFI, seleziona **Type** e impostalo su *EFI Type*.

![Partizione di boot contrassegnata come avviabile](/images/bl-install/17.png)

### Partizione swap

Poi passa alla seconda partizione: premi la freccia giù per selezionare lo spazio libero, quindi scegli **New**. Questa sarà la nostra partizione swap. Premi invio e scrivi `512M`. Premi di nuovo invio e seleziona **primary**.

![Creazione della partizione swap da 512M](/images/bl-install/18.png)

Per questa partizione serve un tipo diverso. Con le frecce vai su **Type** e premi invio. Comparirà un elenco: seleziona **Linux swap / Solaris** e premi invio.

![Cambio del tipo di partizione in Linux swap](/images/bl-install/19.png)

### Partizione root

Passiamo all'ultima partizione. Stesso procedimento di prima: seleziona lo spazio libero, vai su **New** e premi invio. Stavolta non devi scrivere nulla, perché vogliamo usare tutto lo spazio libero rimasto: premi semplicemente invio due volte.

Prima di uscire da cfdisk devi salvare questa tabella delle partizioni: vai su **Write** e premi invio. Ti verrà chiesto di confermare le modifiche: scrivi `yes`, premi invio e a questo punto puoi uscire.

![Scrittura della tabella delle partizioni su disco](/images/bl-install/20.png)

## 9. Cifratura (facoltativa)

Puoi scegliere di cifrare completamente la partizione root con LUKS. Si consiglia di rispondere `y`, perché i tuoi dati potrebbero essere sensibili e potresti volerli tenere privati (nel caso il computer venga rubato o sequestrato da qualche agenzia...). Non scegliere una password troppo semplice, perché potrebbe essere violata con un attacco a forza bruta.

![Richiesta di cifrare la partizione root](/images/bl-install/21.png)

::: danger Una password LUKS dimenticata non si può recuperare
Tieni presente che se dimentichi la password per sbloccare la partizione LUKS, né i dati né la password possono essere recuperati. Una buona idea è annotare la password su un foglio e nasconderlo in un posto sicuro: può toglierti dai guai se non riesci a ricordarla.
:::

::: tip Usi un SSD?
Se cifri i dati con LUKS la durata dell'SSD si riduce drasticamente, perché cifrare (e decifrare) i dati memorizzati richiede molte scritture su disco. Puoi risolvere aggiungendo `root_trim=yes` come opzione nel bootloader. Per GRUB, cerca la riga del kernel in uso, simile alla seguente: `linux /vmlinuz ... root=/dev/mapper/ ...` e aggiungi `root_trim=yes` alla fine della riga.
:::

## 10. Filesystem

Per ciascuna di queste partizioni va definito il filesystem. `ext4` è la scelta predefinita, in quanto il più recente. Per prima cosa, boot sarà `/dev/sda1`: scegli ext4 come filesystem. La seconda partizione sarà la root: scrivi `/dev/sda3` e scegli ext4 come filesystem. L'ultima sarà lo swap: scrivi `/dev/sda2`, oppure premi semplicemente invio se non ne hai creata una.

![Assegnazione dei filesystem alle partizioni](/images/bl-install/22.png)

Quando richiesto, conferma la tabella delle partizioni:

![Conferma della tabella delle partizioni](/images/bl-install/23.png)

![Conferma della formattazione delle partizioni](/images/bl-install/24.png)

Se hai scelto LUKS, lo script ti chiederà 3 volte di confermare. L'ultima conferma va data con `YES` (le maiuscole sono obbligatorie).

![Avviso di sovrascrittura LUKS che richiede YES in maiuscolo](/images/bl-install/25.png)

Se hai scelto la root completamente cifrata, dovrai definire la password. A ogni avvio, subito dopo il bootloader, comparirà un prompt che la richiede. Quando confermi la password, la partizione root viene cifrata immediatamente. Dopo la cifratura completa della partizione, lo script di installazione deve montare il dispositivo: inserisci di nuovo la password per sbloccare la partizione root, così lo script può montarla e completare l'installazione.

![Inserimento e verifica della passphrase LUKS](/images/bl-install/26.png)

## 11. Sistema di base e account

Ora lo script scaricherà gli ultimi pacchetti necessari per il tuo sistema. Ci vorrà un po', a seconda della velocità della tua connessione.

![Pacman scarica i pacchetti del sistema di base](/images/bl-install/27.png)

Terminata questa fase, ti verrà chiesto di impostare la password dell'account root.

![Impostazione della password dell'account root](/images/bl-install/28.png)

Poi devi creare un account normale: usare root come unico utente del sistema è sbagliato e non andrebbe mai fatto.

![Creazione di un normale account utente](/images/bl-install/29.png)

Quando lo script chiede di scegliere un mirror, premi invio per quello predefinito. Potrai cambiarlo in seguito.

![Richiesta di selezione del mirror](/images/bl-install/30.png)

## 12. Extra facoltativi

D'ora in poi, gli ultimi 3 passaggi prima della fine sono facoltativi. Lo script ti chiederà se vuoi un display X (un ambiente grafico, un desktop). Prima di digitare `y` e premere invio, assicurati che nessuno stia guardando il tuo schermo: è molto importante.

![Richiesta di installare un ambiente grafico X](/images/bl-install/31.png)

Potrai scegliere di scaricare le guest additions/tools di VirtualBox: se non ti interessano, premi `n` e invio. Se vuoi gli strumenti di BlackArch, rispondendo `y` verranno scaricati e installati più di 1500 strumenti dal repository di BlackArch. Puoi scaricarli anche in seguito: questa opzione si può saltare.

![Richiesta di configurare gli strumenti di BlackArch](/images/bl-install/32.png)

## 13. Game over: riavvia

Se ti stai chiedendo che senso abbia quella schermata: è solo uno «scherzo» di uno sviluppatore. In altre parole, significa che l'installazione è terminata. Ora puoi riavviare e accedere al tuo nuovo sistema BlackArch Linux.

![Schermata Game Over che segna la fine dell'installazione](/images/bl-install/33.png)

![Menu di avvio GRUB della nuova installazione di BlackArch](/images/bl-install/34.png)

Se hai scelto la root completamente cifrata, a ogni avvio ti verrà chiesta la password LUKS della partizione.

![Richiesta della passphrase LUKS all'avvio](/images/bl-install/35.png)

## Buon divertimento con BlackArch Linux

Ricorda: gli sviluppatori e i collaboratori di BlackArch Linux sono volontari. Tutto il lavoro offerto è gratuito ed è stato fatto nel loro tempo libero. Puoi aiutarci con una [donazione](./donate), che verrà usata esclusivamente per questo progetto.

Se qualcosa va storto durante l'installazione, passa a trovarci nel canale <a href="https://matrix.to/#/#BlackArch:matrix.org">#BlackArch:matrix.org</a>, consulta le [FAQ](./faq) oppure segnala i problemi dell'installer nel repository <a href="https://github.com/BlackArch/blackarch-installer/issues">blackarch-installer</a>.
