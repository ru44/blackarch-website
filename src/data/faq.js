// The English FAQ. Other languages override questions and answers by id in
// src/i18n/locales/<code>.js (namespace "faqItems").
//
// Answer blocks: p (html string), ul (array of html strings), code (string).
// Internal links are written as href="/path"; the page adds the site base.
// Used by FaqList.vue and by the FAQ structured data in .vitepress/seo.mjs.
const matrix = '<a href="https://matrix.to/#/#BlackArch:matrix.org">Matrix channel</a>';

export const faq = [
  {
    id: "right-distro",
    cat: "Getting started",
    q: "Is BlackArch Linux the right pentesting distribution for me?",
    a: [
      {
        p: "BlackArch is a Linux pentesting distribution based on ArchLinux. If you're not familiar with ArchLinux, or Linux in general, we strongly suggest you avoid BlackArch due to the learning curve for new users.",
      },
    ],
  },
  {
    id: "where-to-start",
    cat: "Getting started",
    q: "Where do I start with BlackArch?",
    a: [
      {
        p: `You must first get an ISO on the <a href="/downloads">downloads page</a> and install it by following the instructions of the installation script. You can find a tutorial showing the process step by step on the <a href="/install">installation page</a>. If you encounter any problems and need help, the best place to ask is our ${matrix}.`,
      },
    ],
  },
  {
    id: "up-to-date",
    cat: "Updates",
    q: "Is BlackArch up to date?",
    a: [
      {
        p: "BlackArch is constantly being updated and offers the latest packages available on Github. We release a new ISO four times a year (quarterly). These new images contain packages that are up to date, and usually include bug fixes. If you find any package that is outdated and wish to see it up to date, please report it as an issue on our Github repository.",
      },
    ],
  },
  {
    id: "install-updates",
    cat: "Updates",
    q: "How can I fetch/install the latest update available?",
    a: [
      { p: "By simply running pacman" },
      { code: "sudo pacman -Syu" },
      { p: "This command requires root privileges." },
    ],
  },
  {
    id: "keyring-signature",
    cat: "Troubleshooting",
    q: "Why do I get invalid keyring signature?",
    a: [
      { p: "It could happen for a wide range of reasons. Below you will find a few suggestions." },
      {
        ul: [
          "You don't have an internet connection (as you can imagine, a rare problem and can be verified quickly).",
          "You may have a DNS problem, that can't resolve pgp.mit.edu accordingly. Please check your DNS settings (pgp.mit.edu works best with 8.8.8.8 DNS Server).",
          "You may have a network issue, different from the above one, which is hard for us to help since it can be a myriad of things. For example: DNS caching.",
          "You may have a clock/time issue.",
          "You may have something blocking your communication with mit.edu server, for instance: a firewall.",
          "If you're connected through a VPN, try to temporarily disable it and run <code>strap.sh</code> again.",
        ],
      },
      {
        p: "After testing all the items described above if you still have problems using <code>strap.sh</code>, try the options below:",
      },
      { p: "<strong>1st option:</strong>" },
      {
        code: "sudo rm -rf /etc/pacman.d/gnupg\nsudo pacman-key --init\nsudo pacman-key --populate archlinux blackarch\nsudo pacman-key --update --keyserver keyserver.ubuntu.com",
      },
      {
        p: "<strong>2nd option:</strong> You could try to change to pgp.mit.edu's IP address using the following command:",
      },
      {
        code: "curl -O https://blackarch.org/strap.sh\nchmod +x strap.sh\nsha1sum strap.sh # it should match the SHA1 sum on the downloads page\nsudo sh strap.sh",
      },
      { p: "<strong>3rd option:</strong> You could try to temporarily switch to another mirror:" },
      { code: "sudoedit /etc/pacman.d/blackarch-mirrorlist" },
      {
        p: `It's very important to follow the suggestions above as well as checking the Archlinux Wiki pages to assist you as needed. If you still encounter any problems, pay us a visit at <a href="https://matrix.to/#/#BlackArch:matrix.org">#BlackArch:matrix.org</a>.`,
      },
    ],
  },
  {
    id: "get-help",
    cat: "Community",
    q: "Where can I get help for a problem that I'm facing?",
    a: [
      {
        p: "Depending on the problem you're facing, you can visit our Github and submit an issue on our Issue page, such as:",
      },
      {
        ul: [
          "<strong>BlackArch Site repository:</strong> related to our website. For example: If a link is broken or an image isn't loading.",
          "<strong>BlackArch repository:</strong> related to our packages. For example: a package hasn't been updated for a while or failed to run.",
          "<strong>BlackArch Installer repository:</strong> related to our installer. For example: the installation failed or you can not boot after a successful installation.",
        ],
      },
      {
        p: `You can also take some time to browse our other repositories. If you still cannot find a solution to your problem, visit our ${matrix} and ask for help. But please be advised, BlackArch users are in different parts of the globe (different time zones). Therefore, be patient. Ask your question and wait for a reply.`,
      },
    ],
  },
  {
    id: "contribute",
    cat: "Community",
    q: "I would like to help. What can I do?",
    a: [
      {
        p: `BlackArch Linux is a huge project, we are adding new applications and features everyday. If you would like to help us with anything, visit our ${matrix}. Just remember to wait for a reply, we are in different time zones.`,
      },
    ],
  },
];
