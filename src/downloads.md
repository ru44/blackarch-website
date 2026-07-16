<script setup>
import MirrorList from './components/MirrorList.vue'
</script>

# Downloads

Here you will find official BlackArch Linux downloads and installation instructions.

## ISOs

The following list contains official BlackArch full, slim and netinstall ISO images. You can burn these images to DVDs and flashdrives.

The full ISO contains a complete, functional BlackArch Linux system with <a href="https://github.com/BlackArch/blackarch-iso/blob/master/full-iso/packages.x86_64">all the available tools in the repo at build time</a>. The slim ISO contains a functional BlackArch Linux system with <a href="https://github.com/BlackArch/blackarch-iso/blob/master/slim-iso/packages.x86_64">a selected set of common/well-known tools and system utilities</a> for pentesting. The netinstall ISO is a lightweight image for bootstrapping machines with <a href="https://github.com/BlackArch/blackarch-iso/blob/master/netinstall-iso/packages.x86_64">a minimal set of packages</a>.

If possible, please try to use a mirror near you to download the ISOs. You can find a <a href="#official-blackarch-linux-mirror-sites">list of mirrors</a> below.

::: warning
Installing the full ISO is highly discouraged, you will probably encounter many errors and conflicts while trying to update or even installing it. This ISO primarily targets offline installation, proceed with it only if you have a good reason, know what you are doing and are willing to spend time troubleshooting. For most people, we recommend installing either the netinstall ISO to install only what you need or the slim ISO to start with a minimal set of common tools.
:::

|<pre>               Image            </pre>| Version | Torrent |<pre> Size </pre>| SHA1sum |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------- | ----------------- | ---------------------------------------- |
| <a href="https://ftp.halifax.rwth-aachen.de/blackarch/iso/blackarch-linux-full-2023.04.01-x86_64.iso">BlackArch Linux 64 bit Full ISO</a>          | 2023.04.01 | <a href="https://blackarch.org/blackarch/torrent/blackarch-linux-full-2023.04.01-x86_64.iso.torrent">Torrent</a>    | 22 GB             | ae64930aeddc491a4644bb3fa92a715145713c65 |
| <a href="https://ftp.halifax.rwth-aachen.de/blackarch/iso/blackarch-linux-slim-2023.05.01-x86_64.iso">BlackArch Linux 64 bit Slim ISO</a>          | 2023.05.01 | <a href="https://blackarch.org/blackarch/torrent/blackarch-linux-slim-2023.05.01-x86_64.iso.torrent">Torrent</a>    | 5.5 GB            | 00949f2908e66314906dce6afc6eaad562349250 |
| <a href="https://ftp.halifax.rwth-aachen.de/blackarch/iso/blackarch-linux-netinst-2023.04.01-x86_64.iso">BlackArch Linux 64 bit Netinstall ISO</a> | 2023.04.01 | <a href="https://blackarch.org/blackarch/torrent/blackarch-linux-netinst-2023.04.01-x86_64.iso.torrent">Torrent</a> | 815 MB            | df2dfcfafa1a8f9bab8afd9aa6b788de00e03e09 |

::: danger Do not use UNetBootIn
Do not use UNetBootIn to write ISO files to flashdrives. UNetBootIn modifies the bootloader configuration, which is bad.
:::

You can use this instead (where /dev/sdX is your flashdrive and file.iso is a BlackArch ISO):

```bash{4}
# Example Image writing
$ sudo dd bs=512M status=progress if=file.iso of=/dev/sdX
```

::: tip Default Login
The default login for all ISOs and OVA is: `root:blackarch`
:::

## OVA Images

The following list contains the official BlackArch OVA image. You can run this image in Virtualbox, VMware and QEMU.

If possible, please try to use a mirror near you to download the OVA images. You can find a list of mirrors below.

|<pre>               Image        </pre>| Version | Torrent |<pre> Size </pre>| SHA1sum |
| ----------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------- | ----------------- | ---------------------------------------- |
| <a href="https://ftp.halifax.rwth-aachen.de/blackarch/ova/blackarch-linux-2023.04.01.ova">BlackArch Linux 64 bit OVA Image</a> | 2023.04.01 | <a href="https://blackarch.org/blackarch/torrent/blackarch-linux-2023.04.01.ova.torrent">Torrent</a> | 29 GB             | 6c2ac1739b4f971bd7eef12d752ccf868a8065bd |

::: tip Default Login
The default login for all ISOs and OVA is: `root:blackarch`
:::

## Installing on top of ArchLinux

BlackArch Linux is compatible with existing/normal Arch installations. It acts as an unofficial user repository. Below you will find instructions on how to install BlackArch in this manner.

```bash
# Run https://blackarch.org/strap.sh as root and follow the instructions.

$ curl -O https://blackarch.org/strap.sh
# Verify the SHA1 sum

$ echo 26849980b35a42e6e192c6d9ed8c46f0d6d06047 strap.sh | sha1sum -c
# Set execute bit

$ chmod +x strap.sh
# Run strap.sh

$ sudo ./strap.sh
# Enable multilib following https://wiki.archlinux.org/index.php/Official_repositories#Enabling_multilib and run:

$ sudo pacman -Syu
```

You may now install tools from the blackarch repository.

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

The complete tool list of the BlackArch Linux repository can be found [here](./tools).

## Installing from Full ISO

You can install BlackArch Linux (packages AND environment) using the Full or Netinstall medium.

```bash
# Run and follow the instructions

$ sudo blackarch-install
```

If you need to be guided step by step, please consult the <a href="https://blackarch.org/blackarch-install.html">blackarch install</a> tutorial.

## Installing from Slim ISO

You can install BlackArch Linux using the Slim medium which features GUI installer. Just double click on the Install BlackArch icon on the desktop. Follow the instructions on the GUI installer.

## ARM

BlackArch is compatible with Arch Linux ARM. It effectively supports all of the Aarch64 platforms listed <a href="http://archlinuxarm.org/platforms">here</a>.

In order to install BlackArch on an ARM platform, follow the install instructions for your device on <a href="http://archlinuxarm.org">archlinuxarm.org</a> and install BlackArch <a href="https://blackarch.org/downloads.html#install-repo">as an unofficial user repository</a>. Soon we will release adaptations of the Arch Linux ARM images with BlackArch packages pre-installed.

<MirrorList />


