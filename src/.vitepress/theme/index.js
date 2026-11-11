import { h } from "vue";
import DefaultTheme from "vitepress/theme";
import HeroLogo from "../../components/HeroLogo.vue";
import SidebarToggle from "./SidebarToggle.vue";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/rtl.css";

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      "sidebar-nav-before": () => h(SidebarToggle, { variant: "collapse" }),
      "home-hero-image": () => h(HeroLogo),
      "layout-bottom": () => h(SidebarToggle, { variant: "expand" }),
    }),
};
