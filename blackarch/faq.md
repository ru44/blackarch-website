---
outline: deep
---

# Frequently Asked Questions

## Is BlackArch Linux the right pentesting distribution for me?

BlackArch is a Linux pentesting distribution based on ArchLinux. If you're not familiar with ArchLinux, or Linux in general, we strongly suggest you avoid BlackArch due to the learning curve for new users.

## Where do I start with BlackArch?

You must first get an ISO on the downloads page and install it by following the instructions of the installation script. You can find a tutorial to show the process step by step at this URL BlackArch installation. If you encounter any problems and need help, the best place to ask is our Matrix channel.

## Is BlackArch up to date?

BlackArch is constantly being updated and offers the latest packages available on Github. We release a new ISO four times a year (quarterly). These new images contain packages that are up to date, and usually include bug fixes. If you find any package that is outdated and wish to see it up to date, please report it as an issue on our Github repository Github.

## How can I fetch/install the latest update available?

By simply running pacman

```bash
-Syu --needed --overwrite='*' blackarch
```

 This command requires root privileges.

## Why do I get invalid keyring signature?

It could happen for a wide range of reasons. Below you will find a few suggestions.

You don't have an internet connection (as you can imagine, a rare problem and can be verified quickly).
You may have a DNS problem, that can't resolve pgp.mit.edu accordingly. Please check your DNS settings (pgp.mit.edu works best with 8.8.8.8 DNS Server).
You may have a network issue, different from the above one, which is hard for us to help since it can be a myriad of things. For example: DNS caching.
You may have a clock/time issue.
You may have something blocking your communication with mit.edu server, for instance: a firewall.
If you're connected through a VPN, try to temporarily disable it and run ```strap.sh``` again.
After testing all the items described above if you still have problems using ```strap.sh```, try the options below:

1st option:

```bash
# rm -rf /etc/pacman.d/gnupg
# pacman-key --init
# pacman-key --populate archlinux blackarch
# pacman-key --update --keyserver keyserver.ubuntu.com
```

2nd option:
You could try to change to pgp.mit.edu's IP address using the following command:

```bash
# curl -O https://blackarch.org/strap.sh
# chmod +x strap.sh
# sha1sum strap.sh: it should match with the information on downloads
# sh strap.sh
```

3rd option:
You could try to temporarily switch to another mirror:

```bash
sudoedit /etc/pacman.d/blackarch-mirrorlist
```

It's very important to follow the suggestions above as well as checking the Archlinux Wiki pages to assist you as needed. If you still encounter any problems, pay us a visit at #BlackArch.

## Where can I get help for a problem that I'm facing?

Depending on the problem you're facing, you can visit our Github and submit an issue on our Issue page, such as:

- BlackArch Site repository: related to our website. For example: If a link is broken or an image isn't loading.
- BlackArch repository: related to our packages. For example: a package hasn't been updated for a while or failed to run.
- BlackArch Installer repository: related to our installer. For example: the installation failed or you can not boot after a successful installation.

You can also take some time to browse our other repositories.
If you still cannot find a solution to your problem, visit our Matrix channel and ask for help. But please be advised, BlackArch users are in different parts of the globe (different time zones). Therefore, be patient. Ask your question and wait for a reply.

## I would like to help. What can I do?

BlackArch Linux is a huge project, we are adding new applications and features everyday.
If you would like to help us with anything, visit our <a href="https://matrix.to/#/#BlackArch:matrix.org">Matrix channel</a>. Just remember to wait for a reply, we are in different time zones.

**Output**

```md
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::
```

**Output**
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::
