module.exports = {
  base: '/whc-blog/',
  title: 'blog',
  description: 'Vuepress blog demo',
  themeConfig: {
    // 你的GitHub仓库，请正确填写
    repo: 'https://github.com/xxxxxxx/blog-demo',
    // 自定义仓库链接文字。
    repoLabel: 'My GitHub',
    // 导航栏
    nav: [
        { text: 'Home', link: '/' },
        { text: 'FirstBlog', link: '/blog/FirstBlog.md' }
    ],
    // 侧边栏
    sidebar: [
      ['/', '首页'],
      ['/blog/firstBlog.md', '我的第一篇博客']
    ]
  }
}