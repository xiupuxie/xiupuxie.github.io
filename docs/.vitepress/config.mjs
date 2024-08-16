import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "我的前端生涯",
  description: "A VitePress Site",
  themeConfig: {
    search: {
      provider: 'local'
    },
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
          { text: '权限模型封装和改造前端权限系统', link: '/权限模型封装和改造前端权限系统' },
          { text: '性能指标', link: '/性能指标' },
          { text: '用Composition API 后代码变得更乱了？', link: '/用Composition API 后代码变得更乱了？' },
          { text: '浏览器缓存策略', link: '/浏览器的缓存策略' },
          { text: '关于css中定位的知识', link: '/关于css中定位的知识' },
          { text: '为什么要将图片转成Base64', link: '/为什么要将图片转成Base64' },
          { text: 'Runtime API Examples', link: '/api-examples' },
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
