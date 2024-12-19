import { defineConfig } from 'vitepress'
import vitepressBar from 'vite-plugin-vitepress-bar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "我的前端生涯",
  description: "A VitePress Site",
  vite: {
    plugins: [
      vitepressBar({
        filter(item) {
          return /^(?!.*(?:\/\.vitepress(?:\/|$)|\/\.git(?:\/|$)|\/node_modules(?:\/|$)|\/dist(?:\/|$))).*$/.test(item.path)
        },
        complete(bar) {
          bar.nav = [
            { text: '首页', link: '/' },
            { text: '文档', link: bar.nav[0].link }
          ]
          return bar
        }
      })
    ]
  },
  themeConfig: {
    search: {
      provider: 'local'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/xiupuxie' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Evan 解修谱'
    }
  }
})
