import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "我的前端生涯",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '家', link: '/' },
      { text: '示例', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: '项目中权限问题', link: '/vue-admin中的权限管理' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          { text: '浏览器缓存策略', link: '/浏览器的缓存策略' },
          { text: '关于css中定位的知识', link: '/关于css中定位的知识' },
          { text: '为什么要将图片转成Base64', link: '/为什么要将图片转成Base64' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/xiupuxie' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Evan 解修谱'
    }
  }
})