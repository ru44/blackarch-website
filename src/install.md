---
outline: deep
title: Installation
---

# Installing BlackArch Linux

This tutorial will show you how to install BlackArch Linux using the ISO and the blackarch-installer. This tutorial uses VirtualBox, but you can also use other software if you prefer to virtualize.

We assume you have already burned the ISO from the [downloads page](./downloads) onto a USB or DVD and you are ready for the installation.

## 1. Boot the ISO

When you boot the image it should display something similar to the following screen. Select your architecture and press enter. [Example: BlackArch Linux (x86_64) for 64 bit]

![BlackArch ISO boot menu with architecture selection](/images/bl-install/1.png)

::: tip Installing in VirtualBox?
If you want to install BlackArch using VirtualBox, make sure to choose the right ISO. Check if your hardware supports virtualization — if so, enable it in your UEFI/BIOS settings. If not, you must use the 32 bit ISO. QEMU with KVM was successfully tested and can be used instead of VirtualBox.
:::

## 2. Log in

Wait until the login prompt appears, requesting the BlackArch login. The default BlackArch Linux credentials are:

- Login: `root`
- Password: `blackarch`

If you are on the Slim ISO the credentials are as follows:

- Login: `liveuser`
- Password: `blackarch`

![BlackArch login prompt on tty1](/images/bl-install/2.png)

## 3. Start the installer

To start the installation, you must execute the BlackArch install script. In order to avoid any problems that can cause you to restart the installation, make sure to have internet available on the machine where you want to install BlackArch. You can list the available network interfaces with the command `ip a`. If you want or only have wifi available as an option, you may read the <a href="https://wiki.archlinux.org/title/Network_configuration/Wireless">Arch wiki</a> to learn how to set up a wireless connection (i.e. `wifi-menu`/`netctl`).

If your keyboard differs from the default one (QWERTY US), you can set the keymap corresponding to your language / country. For example, enter the command `loadkeys` followed by the 2 letters of your country code:

```bash
# List network interfaces
$ ip a

# Example: French keyboard layout
$ loadkeys fr

# Start the installer
$ blackarch-install
```

![Running blackarch-install from the shell](/images/bl-install/3.png)

::: tip Run commands while the installer is busy
Throughout this tutorial, you may want to execute some shell commands while the script is running. You can do it at any time without stopping the installer by switching TTYs: press `Ctrl+Alt+F2` (F1 is the default TTY where you ran the blackarch-install script). F2 through F6 each bring a new TTY where you can execute any command you may need.
:::

## 4. Choose an installation method

3 options should now be displayed.

![Installer menu with the three installation methods](/images/bl-install/4.png)

1. **Install from repository using pacman** — This is the recommended option to select for the netinstall ISO. It will fetch the required packages from the official Arch repositories and the BlackArch repositories as well.

2. **Install from Live-ISO** — If you downloaded the live ISO. If you choose this option you will not need internet during the install process. However, in order to have an updated system, after the installation has finished and you boot into the fresh install, start a general update using `pacman -Syyu`.

3. **Install from source using blackman** — This is not a recommended option for beginners. Instead of fetching the prebuilt package from a repository as pacman does, this will get the source code and compile from source. It's similar to `emerge` available on a Gentoo system (blackman simply builds from source; emerge is infinitely more advanced and offers a ton of features).

## 5. Select your keymap

You now have to select the keymap you want. If you have a QWERTY based keyboard, you can stick with the `us` keycode, however this may not always be the case. If you are unsure, you may list available keymaps by selecting `2`. Most of the time, the English country code is used. For a French AZERTY the keymap will be `fr`, for a Spanish one `es`, etc. If you know the keymap, select `1`.

![Keymap selection menu](/images/bl-install/5.png)

Write the keymap as explained above:

![Entering the keymap code](/images/bl-install/6.png)

## 6. Set a hostname

The hostname is basically the name you want to give to your computer on your local network. It will resolve as the name given. You may choose whatever you like and this can be changed at any time by editing the `/etc/hostname` file.

![Entering a hostname](/images/bl-install/7.png)

## 7. Network setup

A list of the available network interfaces will be displayed. As explained earlier, you should select your ethernet interface if possible — the script doesn't provide any support for wifi. It's still possible to use wifi, but you will have to set it up by yourself.

![Network interface selection](/images/bl-install/8.png)

Then choose how the interface gets configured:

1. **Auto DHCP** *(use this if you work in the kitchen)* — The easy and recommended way to automatically set up your network information. This will request/lease a local IP from your DHCP server/router for your device.

2. **Manual** *(use this if you are 1337)* — If you choose the manual way, you will have to know the information of your network (your gateway, LAN IP address, subnet mask, etc.).

3. **Skip** *(use this if you are already connected)* — In case your network interface is already set up and can reach the internet, use this option.

![Network configuration options](/images/bl-install/9.png)

::: warning Ping check failing in a VM?
In some cases involving a virtual environment such as VirtualBox or QEMU, some rules in your firewall may drop ICMP, which will deny the ping and block the install at this step since the script will exit, thinking your network interface is misconfigured. You can solve this problem by editing the script located in `/usr/bin/blackarch-install`: find the line starting with `if ! ping -c 1 github.com > /dev/null 2>&1` and comment out or remove each line of the condition block until the closing `fi`. Once the edit is made and saved, run `blackarch-install` again and repeat the install.
:::

Pacman will now update each repo, download and install some basic system packages needed for the next step of the BlackArch install. If you have a slow download speed, this can take some time. Go grab a coffee!

![Pacman updating repositories and installing base packages](/images/bl-install/10.png)

## 8. Partitioning

Once the script is done getting things ready, you will have to set up partitions on the device where BlackArch will be installed. You will have to choose between having 2 or 3 partitions:

1. Boot partition
2. Root partition
3. Swap partition *

\* The swap partition is optional and can be avoided on a virtual machine. It's still recommended to make a small one to avoid any crash due to a potential problem with your RAM.

![Hard drive setup — device selection](/images/bl-install/11.png)

::: tip Not sure which device is the right one?
In case more than 2 devices get listed and you are not sure which is the one you want to install to, you can use fdisk to display the size of the target device. For example, if you have `sda` listed and want to know its size (and optionally, the filesystem if any): `fdisk -l -o device,size /dev/sda`
:::

Select `y` when the script asks you if you want to create your partitions with cfdisk — selecting `n` will stop the install.

![Prompt asking to partition with cfdisk](/images/bl-install/12.png)

If your storage device already has a label type, you won't see this screen; otherwise set it to `dos`. If you get an error after installation, you may have an EFI device and should set it to `gpt`.

![cfdisk label type selection](/images/bl-install/13.png)

You now have to set up the partitions. The example given is a basic one and should work in most cases. You will need to create at least 2 partitions (boot and root) but we will use 3 in this example, including the swap partition.

![cfdisk with an empty partition table](/images/bl-install/14.png)

### Boot partition

Let's start with the first one, boot. Using the arrows, go to **New**, push enter and write `500M`. This is enough space for most users since you won't have more than 3 different kernels at the same time.

![Creating the 500M boot partition](/images/bl-install/15.png)

Select **primary** and press enter.

![Choosing the primary partition type](/images/bl-install/16.png)

You need to mark this partition as bootable. Go to the option **Bootable** and press enter. The `*` should appear as on the screen. If your device is an EFI device make sure to select **Type** and set it to *EFI Type*.

![Marking the boot partition as bootable](/images/bl-install/17.png)

### Swap partition

Afterwards go to the second partition: press the down arrow to select the free space, then select **New**. This will be our swap partition. Press enter and write `512M`. Press enter again and select **primary**.

![Creating the 512M swap partition](/images/bl-install/18.png)

For this partition you need a different type. Using the arrows, go to **Type** and press enter. A list will be displayed — select **Linux swap / Solaris** and press enter.

![Changing the partition type to Linux swap](/images/bl-install/19.png)

### Root partition

Let's go for the last partition. Same process as we did earlier: select the free space, go to **New** and press enter. This time you don't need to write anything — we want to take all the free space available. Simply press enter twice.

Before you quit cfdisk you must save this partition table: go to **Write** and press enter. It will ask you to confirm your changes — write `yes`, press enter, and you may now quit.

![Writing the partition table to disk](/images/bl-install/20.png)

## 9. Encryption (optional)

You have the choice to fully encrypt your root partition with LUKS. It's recommended to set `y` as your data may be sensitive and you want to keep it private from anyone (in case your computer gets stolen or is taken by some agency...). Do not pick something too easy, as it can be bruteforced.

![Prompt asking whether to encrypt the root partition](/images/bl-install/21.png)

::: danger A forgotten LUKS password cannot be recovered
Be aware that if you forget the password to unlock your LUKS partition, neither the data nor the password can be recovered. A good move would be to write down the password on a piece of paper and hide it somewhere safe. This can save you from trouble in case you can't remember it.
:::

::: tip Using an SSD?
If you encrypt the data with LUKS it will drastically reduce the lifetime of the SSD — encrypting (and decrypting) the stored data requires a lot of disk writing. You can fix this problem by adding `root_trim=yes` as an option in your bootloader. For GRUB, look for the line of the currently used kernel, similar to the following: `linux /vmlinuz ... root=/dev/mapper/ ...` and add `root_trim=yes` at the end of the line.
:::

## 10. Filesystems

The filesystem for each of those partitions must be defined. `ext4` is the default choice since it's the most recent. First, boot will be `/dev/sda1` — choose ext4 for the filesystem. The second partition will be the root: write `/dev/sda3` and choose ext4 as filesystem. The last one will be the swap: write `/dev/sda2`, or just push enter if you haven't created one.

![Assigning filesystems to the partitions](/images/bl-install/22.png)

Confirm the partition table when asked:

![Confirming the partition table](/images/bl-install/23.png)

![Confirming the formatting of the partitions](/images/bl-install/24.png)

If you chose to use LUKS, the script will ask you 3 times to confirm. The last one must be confirmed with `YES` (capital letters required).

![LUKS overwrite warning requiring an uppercase YES](/images/bl-install/25.png)

If you have chosen the fully encrypted root option, you will have to define the password. A prompt asking for it at each boot will be displayed right after the bootloader. When you confirm the password, the root partition will immediately be encrypted. After it fully encrypts the partition, the install script needs to mount the device: enter your password again to unlock the root partition so the install script can mount it and complete the installation.

![Entering and verifying the LUKS passphrase](/images/bl-install/26.png)

## 11. Base system and accounts

Now the script will download the latest necessary packages for your system. This will take a little time depending on your internet speed.

![Pacman downloading the base system packages](/images/bl-install/27.png)

When the install is finished with this task, you will be asked to set the password of your root account.

![Setting the root account password](/images/bl-install/28.png)

Next, you need to create a normal account — using root as the only user of your system is wrong and you should never do it.

![Creating a normal user account](/images/bl-install/29.png)

When the script asks you to choose a mirror, press enter for the default. You can change this later.

![Mirror selection prompt](/images/bl-install/30.png)

## 12. Optional extras

From now on, the last 3 steps before the end are optional. The script will now ask you if you want an X display (graphical environment, a desktop). Before you type `y` and press enter, make sure nobody is looking at your screen — this is very important.

![Prompt asking whether to install an X display environment](/images/bl-install/31.png)

You will have the choice to download the VirtualBox guest additions/tools — if you are not interested, press `n` and hit enter. If you want the BlackArch tools, saying `y` will download and install more than 1500 tools from the BlackArch repo. You can fetch those later if you want; this is an option that can be skipped.

![Prompt asking whether to set up the BlackArch tools](/images/bl-install/32.png)

## 13. Game over — reboot

If you ever wonder what the meaning of that screen is: it's just a "joke" made by a developer. In other words, this means it's the end of the installation. You can now reboot and access your new BlackArch Linux system.

![Game Over screen marking the end of the installation](/images/bl-install/33.png)

![GRUB boot menu of the fresh BlackArch install](/images/bl-install/34.png)

If you chose the fully encrypted root option, it will prompt you for your partition's LUKS password on each boot.

![LUKS passphrase prompt at boot](/images/bl-install/35.png)

## Enjoy BlackArch Linux

Remember: the developers/contributors of BlackArch Linux are volunteers. All the work provided is free and was done in their free time. You can help us by [making a donation](./donate) which will be used for this project only.

If anything goes wrong during the installation, pay us a visit in the <a href="https://matrix.to/#/#BlackArch:matrix.org">#BlackArch:matrix.org</a> channel, check the [FAQ](./faq), or report installer issues in the <a href="https://github.com/BlackArch/blackarch-installer/issues">blackarch-installer</a> repository.
