---
outline: deep
title: Installation
---

# Installing BlackArch Linux

This quick-guide walks you through installing BlackArch Linux from the live or netinstall ISOs, step by step. It is written for beginners and has the goal to keep it simple.

## Before you start

- Get an ISO from the [downloads page](./downloads) and write it to a USB flashdrive or DVD.
- Make sure the machine has a working internet connection (ethernet is the most reliable option during installation).
- Know the live credentials:

| ISO | Login |
| --- | --- |
| Full / Netinstall ISO | `root` : `blackarch` |
| Slim ISO | `liveuser` : `blackarch` |

::: tip Running in a virtual machine?
Enable virtualization (VT-x / AMD-V) in your UEFI/BIOS settings before booting the ISO in VirtualBox, VMware or QEMU.
:::

## 1. Boot the ISO

Boot from your USB or DVD and select your system architecture (for most machines: `x86_64`). Log in with the credentials above.

## 2. Start the installer

Verify your network connection, then launch the installer:

```bash
# Check that an interface has an IP address
$ ip a

# Start the guided installer
$ blackarch-install
```

If you don't use a QWERTY keyboard, set your layout first:

```bash
# Example: German layout
$ loadkeys de
```

::: tip Multitasking during installation
You can switch between virtual terminals with `Ctrl+Alt+F2` … `Ctrl+Alt+F6` if you need a shell while the installer is running.
:::

## 3. Choose an installation method

The installer offers three modes:

1. **Install from repository** (recommended) — downloads current packages, requires internet.
2. **Install from Live-ISO** — copies the live system to disk, no internet needed. Run `pacman -Syyu` right after the first boot to update.
3. **Install from sources via blackman** — compiles from source; not recommended for beginners.

## 4. Keymap and hostname

Select your console keymap (default: `us`), then choose a hostname to identify the machine on the network. You can change it later in `/etc/hostname`.

## 5. Network setup

Prefer a wired connection over WiFi when possible. The installer offers:

- **Auto DHCP** (recommended) — the installer configures the interface for you.
- **Manual** — set address, gateway and DNS yourself.
- **Skip** — if you already configured the network before starting.

::: warning
In virtual environments a failing ping test is often caused by the host firewall — check it before blaming the guest.
:::

## 6. Partitioning

Create at least two partitions (boot and root); three are recommended (adding swap). The installer drops you into `cfdisk`:

| Partition | Size | Type |
| --- | --- | --- |
| Boot | 500M | primary, bootable |
| Swap | 512M (or more) | primary, Linux swap |
| Root | remaining space | primary, Linux |

To double-check your disk layout from another terminal:

```bash
$ fdisk -l -o device,size /dev/sda
```

When asked for a filesystem, `ext4` is a safe default for all partitions.

## 7. Encryption (optional)

The installer can fully encrypt the root partition with LUKS, which is recommended if the machine will hold sensitive data. You must confirm with a capital `YES` and choose a strong passphrase.

::: danger Choose your passphrase carefully
A forgotten LUKS passphrase cannot be recovered — the data is gone for good.
:::

If you install to an SSD, add `root_trim=yes` to the bootloader configuration to enable TRIM on the encrypted device.

## 8. System configuration

The installer then walks you through the last steps:

- Set the root password.
- Create your standard (non-root) user account.
- Select a package mirror (press enter for the default).
- Choose a graphical X environment.
- Optionally install VirtualBox guest additions.
- Optionally install the BlackArch tool collection.

## 9. Reboot

Remove the installation medium and reboot. If you enabled LUKS encryption, you will be asked for the partition passphrase at every boot.

If you installed from the Live-ISO, update the system right away:

```bash
$ sudo pacman -Syyu
```

## Getting help

If anything goes wrong, pay us a visit in the <a href="https://matrix.to/#/#BlackArch:matrix.org">#BlackArch:matrix.org</a> channel or check the [FAQ](./faq). The installer's known issues are tracked in the <a href="https://github.com/BlackArch/blackarch-installer/issues">blackarch-installer</a> repository.
