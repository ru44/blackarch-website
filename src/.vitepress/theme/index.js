// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import './style.css'
import SidebarToggle from './SidebarToggle.vue'

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'sidebar-nav-before': () => h(SidebarToggle, { variant: 'collapse' }),
      'layout-bottom': () => h(SidebarToggle, { variant: 'expand' }),
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  }
}
