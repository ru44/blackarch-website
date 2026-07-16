import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/blackarch-demo/",
  title: "BlackArch Linux",
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/blackarch-demo/favicon.ico",
      },
    ],
  ],
  description:
    "BlackArch Linux is a penetration testing distribution for penetration testers and security researchers.",
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    editLink: {
      pattern: "https://github.com/ru44/blackarch-demo/edit/main/src/:path",
      text: "Edit this page on GitHub",
    },
    search: {
      provider: "local",
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "Downloads", link: "/downloads" },
      { text: "Guide", link: "/guide" },
      { text: "FAQ", link: "/faq" },
      { text: "Tools", link: "/tools" },
      { text: "Community", link: "/community" },
      { text: "News", link: "/news" },
      { text: "Donate", link: "/donate" },
    ],

    sidebar: [
      {
        text: "Downloads",
        link: "/downloads",
      },
      {
        text: "Guide",
        link: "/guide",
      },
      {
        text: "FAQ",
        link: "/faq",
      },
      {
        text: "Tools",
        link: "/tools",
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/BlackArch" },
      { icon: "twitter", link: "https://twitter.com/blackarchlinux" },
      { icon: "youtube", link: "https://www.youtube.com/@blackarchlinux5075" },
      {
        icon: {
          svg: '<svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60.019 60.019" xml:space="preserve"><g><path d="M59.888,47.514l-3.839-11.518c2.056-3.615,3.14-7.716,3.14-11.893c0-13.286-10.809-24.095-24.095-24.095c-8.242,0-15.824,4.223-20.219,11.007c3.089-1.291,6.477-2.007,10.029-2.007C39.294,9.01,51,20.716,51,35.104c0,3.996-0.905,7.783-2.518,11.172l10.263,2.701c0.085,0.022,0.17,0.033,0.255,0.033c0.006,0,0.014-0.001,0.02,0c0.553,0,1-0.448,1-1C60.019,47.829,59.972,47.66,59.888,47.514z"/><path d="M24.905,11.01C11.619,11.01,0.81,21.819,0.81,35.104c0,4.176,1.084,8.277,3.14,11.893L0.051,58.693c-0.116,0.349-0.032,0.732,0.219,1C0.462,59.898,0.727,60.01,1,60.01c0.085,0,0.17-0.011,0.255-0.033l12.788-3.365c3.35,1.694,7.097,2.587,10.862,2.587C38.191,59.199,49,48.39,49,35.104S38.191,11.01,24.905,11.01z M41.246,26.799c-0.152,0.083-0.317,0.123-0.479,0.123c-0.354,0-0.696-0.188-0.878-0.519c-2.795-5.097-8.115-8.679-13.883-9.349c-0.549-0.063-0.941-0.56-0.878-1.108c0.063-0.548,0.558-0.942,1.108-0.878c6.401,0.743,12.304,4.718,15.406,10.373C41.908,25.926,41.73,26.534,41.246,26.799z"/></g></svg>',
        },
        link: "https://matrix.to/#/#BlackArch:matrix.org",
      },
      {
        icon: {
          svg: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M23 7C23 5.34315 21.6569 4 20 4H4C2.34315 4 1 5.34315 1 7H3C3 6.44771 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7V17C21 17.5523 20.5523 18 20 18H15C14.4477 18 14 18.4477 14 19C14 19.5523 14.4477 20 15 20H20C21.6569 20 23 18.6569 23 17V7Z"></path> <path d="M10.763 19.9806C11.2919 20.1155 11.8358 19.7963 11.912 19.2558C12.0823 18.0468 12.0054 16.8123 11.6818 15.6279C11.2711 14.1248 10.4772 12.7541 9.37776 11.6499C8.27832 10.5456 6.91103 9.74579 5.4097 9.32859C4.22678 8.99987 2.99258 8.91757 1.78293 9.08267C1.24209 9.15649 0.920464 9.69902 1.05311 10.2285C1.18576 10.758 1.72288 11.0723 2.26575 11.0152C3.14036 10.9233 4.02749 10.9961 4.88045 11.2331C6.05203 11.5587 7.11902 12.1829 7.97698 13.0446C8.83494 13.9063 9.45448 14.9759 9.77497 16.1489C10.0083 17.0029 10.0773 17.8904 9.98155 18.7646C9.92213 19.3072 10.2341 19.8457 10.763 19.9806Z"></path> <path d="M6.55123 19.8727C7.03253 20.1265 7.63907 19.943 7.79374 19.4213C8.00116 18.7216 8.05408 17.9811 7.94368 17.2517C7.78382 16.1956 7.28993 15.2184 6.53438 14.4633C5.77882 13.7083 4.80131 13.215 3.74506 13.0558C3.01562 12.9459 2.2751 12.9993 1.5756 13.2072C1.05401 13.3622 0.870846 13.9688 1.12497 14.45C1.3791 14.9311 1.97808 15.0966 2.5152 15.0095C2.8232 14.9596 3.13899 14.9572 3.45143 15.0043C4.09142 15.1007 4.6837 15.3996 5.14149 15.8571C5.59929 16.3146 5.89854 16.9067 5.9954 17.5466C6.04268 17.859 6.04052 18.1748 5.99079 18.4829C5.90407 19.02 6.06992 19.6189 6.55123 19.8727Z"></path> <path d="M4 18.5C4 19.3284 3.32843 20 2.5 20C1.67157 20 1 19.3284 1 18.5C1 17.6716 1.67157 17 2.5 17C3.32843 17 4 17.6716 4 18.5Z"></path> </g></svg>',
        },
        link: "https://blackarch.org/rss.xml",
      },
    ],
  },
});
