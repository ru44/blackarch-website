---
title: Architettura
description: Come BlackArch Linux è costruito sopra Arch, compilato, firmato, replicato sui mirror e tenuto aggiornato.
pageClass: wide
outline: false
translated: true
---

<script setup>
import ArchitectureViz from '@/components/ArchitectureViz.vue'
import ArchJourney from '@/components/ArchJourney.vue'
</script>

# Architettura

BlackArch non è un fork di Arch Linux. È un **repository pacman non ufficiale** accompagnato da una serie di immagini ISO, compilato e mantenuto da un piccolo team di sviluppatori. Esplora il diagramma interattivo qui sotto, poi leggi i dettagli.

<ArchitectureViz />

## Il quadro generale

<ArchJourney />

## Livelli

| Livello | Che cos'è |
| --- | --- |
| Strumenti | Singoli pacchetti; ciascuno ha un proprio `packages/<name>/PKGBUILD` nel repository [blackarch](https://github.com/BlackArch/blackarch) |
| Gruppi | `blackarch` (tutto) e `blackarch-<category>`, ad esempio `blackarch-webapp` |
| Repository | `blackarch.db` e i pacchetti, serviti da `blackarch.org/blackarch/blackarch/os/<arch>` |
| Keyring | Il pacchetto `blackarch-keyring`, che `strap.sh` scarica e verifica prima di considerare affidabile il repository |
| Arch Linux | `core`, `extra`, `multilib`, pacman e la base rolling release |

Esegui `strap.sh` una sola volta su un'installazione di Arch e il repository viene aggiunto; vedi [Installazione](/it/install) e [Download](/it/downloads).

## Repository del codice sorgente

| Repository | Scopo |
| --- | --- |
| [blackarch](https://github.com/BlackArch/blackarch) | PKGBUILD (`packages/`), liste di rilascio (`lists/`), script per i maintainer (`scripts/`), elenco dei mirror (`mirror/`) |
| [blackarch-pkgbuilds](https://github.com/BlackArch/blackarch-pkgbuilds) | Template per i PKGBUILD |
| [blackarch-iso](https://github.com/BlackArch/blackarch-iso) | Livelli del profilo archiso e strumenti per costruire la ISO |
| [blackarch-installer](https://github.com/BlackArch/blackarch-installer) | L'installer ufficiale |
| [blackarch-site](https://github.com/BlackArch/blackarch-site) | Sorgenti di blackarch.org, incluso `strap.sh` |

## Come viene compilato un pacchetto

1. Un maintainer scrive un PKGBUILD, partendo dai template.
2. `babuild` lo compila in un chroot pulito (incapsulando `archbuild` e `makechrootpkg` di Arch) in modo che eventuali dipendenze di build mancanti vengano a galla.
3. Il pacchetto viene installato ed eseguito in un chroot pulito, quindi su un sistema BlackArch completo per rilevare conflitti tra file.
4. `basign` crea le firme GPG detached.
5. `barelease` carica i pacchetti sul server di build, acquisisce un lock e aggiorna il database del repository.

## Come i mirror restano sincronizzati

Chi gestisce un mirror esegue `syncrepo`. Lo script scarica via HTTP un piccolo file `lastupdate` ed esegue `rsync` solo quando il timestamp è cambiato, risparmiando molta banda. Vedi l'[elenco dei mirror](/it/downloads).

## Come viene tenuto aggiornato

BlackArch è una rolling release. I contributori aprono pull request con titolo `<pkgname>: <modifica>`; i nomi dei pacchetti accettati finiscono in `lists/to-release`, e uno sviluppatore con accesso al server di build li compila, li firma e li rilascia. Script di supporto come `outdated`, `pkgver` e `pkgrel` tengono traccia delle versioni e le aggiornano. Gli utenti ricevono gli aggiornamenti con `pacman -Syu`.

## Come vengono assemblate le ISO

La ISO viene costruita con `archiso`. I livelli vengono uniti in un unico profilo: `full` = base + graphical + full, `slim` = base + graphical + slim, `netinstall` = base + netinstall. I livelli successivi sovrascrivono i file con lo stesso percorso, mentre le liste di pacchetti vengono concatenate.

::: info Fonti
Le informazioni provengono dai repository pubblici `blackarch`, `blackarch-iso` e `blackarch-site` (`docs/HOWTO-DEV.md`, `scripts/`, `strap.sh`). I dettagli interni del server di build non sono pubblici, quindi questa pagina si limita a quanto documentano i repository. Le correzioni sono benvenute tramite il link di modifica qui sotto.
:::
