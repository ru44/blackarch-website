---
title: Download
pageClass: wide
outline: false
translated: true
---

<script setup>
import MirrorList from '@/components/MirrorList.vue'
import IsoCards from '@/components/IsoCards.vue'
</script>

# Download

Qui trovi i download ufficiali di BlackArch Linux e le istruzioni di installazione.

## ISO

Questo elenco contiene le immagini ISO ufficiali slim e netinstall di BlackArch. Puoi masterizzarle su DVD oppure scriverle su chiavetta USB.

La ISO slim contiene un sistema BlackArch Linux funzionante con <a href="https://github.com/BlackArch/blackarch-iso/blob/master/slim-iso/packages.x86_64">una selezione di strumenti comuni e noti e di utilità di sistema</a> per il pentesting. La ISO netinstall è un'immagine leggera per avviare l'installazione sulle macchine con <a href="https://github.com/BlackArch/blackarch-iso/blob/master/netinstall-iso/packages.x86_64">un insieme minimo di pacchetti</a>.

Se possibile, scarica le ISO da un mirror vicino a te. Più sotto trovi l'<a href="#official-blackarch-linux-mirror-sites">elenco dei mirror</a>.

<IsoCards />

::: tip Verifica il download
Confronta il checksum del file scaricato con quello riportato nella sua scheda, per esempio:

```bash
$ sha256sum blackarch-linux-slim-2023.05.01-x86_64.iso
```

:::

::: danger Non usare UNetbootin
Non usare UNetbootin per scrivere i file ISO sulle chiavette USB. UNetbootin modifica la configurazione del bootloader, il che è un problema.
:::

Usa invece questo comando (dove /dev/sdX è la tua chiavetta e file.iso è una ISO di BlackArch):

```bash{4}
# Example Image writing
$ sudo dd bs=512M status=progress if=file.iso of=/dev/sdX
```

::: tip Login predefinito
Il login predefinito per tutte le ISO è: `root:blackarch`
:::

## Installazione su Arch Linux

BlackArch Linux è compatibile con le normali installazioni di Arch esistenti e funziona come repository utente non ufficiale. Qui sotto trovi le istruzioni per installare BlackArch in questo modo.

```bash
# Run https://blackarch.org/strap.sh as root and follow the instructions.

$ curl -O https://blackarch.org/strap.sh
# Verify the SHA-256 sum

$ echo dc0737cc75d64d03e9ec2212f989f17cdcf0162c2db5980e256093e293abfb8b strap.sh | sha256sum -c
# Set execute bit

$ chmod +x strap.sh
# Run strap.sh

$ sudo ./strap.sh
# Enable multilib following https://wiki.archlinux.org/index.php/Official_repositories#Enabling_multilib and run:

$ sudo pacman -Syu
```

Ora puoi installare gli strumenti dal repository blackarch.

```bash
# To list all of the available tools, run

$ sudo pacman -Sgg | grep blackarch | cut -d' ' -f2 | sort -u
# To install a category of tools, run

$ sudo pacman -S blackarch-<category>
# To see the blackarch categories, run

$ sudo pacman -Sg | grep blackarch
# To search for a specific package, run

$ pacman -Ss <package_name>
# Note - it may be necessary to overwrite certain packages when installing blackarch tools. If
# you experience "failed to commit transaction" errors, use the --needed and --overwrite switches
# For example:

$ sudo pacman -Syyu --needed --overwrite='*' <wanted-package>
```

L'elenco completo degli strumenti del repository di BlackArch Linux è [qui](./tools).

## Installazione dalla ISO netinstall

Puoi installare BlackArch Linux (pacchetti E ambiente) usando il supporto Netinstall.

```bash
# Run and follow the instructions

$ sudo blackarch-install
```

Se preferisci essere guidato passo dopo passo, consulta il tutorial di [installazione di BlackArch](./install).

## Installazione dalla ISO slim

Puoi installare BlackArch Linux usando il supporto Slim, che include un installer grafico. Fai doppio clic sull'icona «Install BlackArch» sul desktop e segui le istruzioni dell'installer grafico.

## ARM

BlackArch è compatibile con Arch Linux ARM e supporta di fatto tutte le piattaforme Aarch64 elencate <a href="http://archlinuxarm.org/platforms">qui</a>.

Per installare BlackArch su una piattaforma ARM, segui le istruzioni di installazione per il tuo dispositivo su <a href="http://archlinuxarm.org">archlinuxarm.org</a> e poi installa BlackArch <a href="https://blackarch.org/downloads.html#install-repo">come repository utente non ufficiale</a>. A breve rilasceremo adattamenti delle immagini di Arch Linux ARM con i pacchetti di BlackArch già installati.

<MirrorList />
