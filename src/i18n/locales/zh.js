export default {
  home: {
    copy: "复制", copied: "已复制", copyLabel: "复制命令", quick: "快速安装命令",
    stats: [
      { n: "2800+", l: "个工具软件包" },
      { n: "x86_64", l: "+ 通过 Arch ARM 支持 ARM" },
      { n: "Rolling", l: "通过 pacman 滚动发布" },
      { n: "2013", l: "首次发布" },
    ],
    features: [
      { t: "基于 Arch", d: "滚动发布、pacman、兼容 AUR。没有分叉，也没有冻结的版本。" },
      { t: "一条命令安装任意工具", d: "超过 2800 个工具，均可通过 pacman -S 安装。完整列表见工具页面。" },
      { t: "按类别安装", d: "安装整个 blackarch 组，或单独的组，例如 blackarch-webapp。" },
      { t: "可在现有 Arch 上使用", d: "通过 strap.sh 将仓库添加到现有系统，无需重新安装。" },
    ],
  },
  shots: { title: "效果展示", full: "完整 ISO", slim: "精简 ISO", aria: "BlackArch 截图" },
  iso: {
    version: "版本", size: "大小", download: "下载", torrent: "种子", copy: "复制", copied: "已复制",
    tags: ["推荐", "最小化", "离线", "虚拟机"],
    desc: [
      "XFCE 桌面、常用工具集和图形化安装程序。",
      "小型启动镜像。按需选择所需内容；需要联网。",
      "包含构建时的全部工具。更新时可能出现冲突；适合离线安装。",
      "适用于 VirtualBox、VMware 和 QEMU 的预构建镜像。",
    ],
  },
  people: { copy: "复制", copied: "已复制", label: "BlackArch 开发者" },
  mirrors: {
    title: "BlackArch Linux 官方镜像",
    summary: (c, m) => `${c} 个国家，${m} 个镜像。请选择离您最近的。`,
    placeholder: "按国家或镜像地址搜索…", noMatch: "没有匹配的镜像", clear: "清除搜索", copy: "复制", ok: "确定",
  },
  donate: {
    title: "让 BlackArch 保持自由",
    intro: "团队利用业余时间自愿维护 BlackArch。捐款仅用于项目开支和后续开发。任何金额都很重要。",
    method: "支付方式", paypalTab: "PayPal", btcTab: "Bitcoin",
    paypalText: "在 PayPal 安全页面选择任意金额。可使用银行卡或 PayPal 余额。",
    paypalCta: "通过 PayPal 捐款", wallet: "在钱包中打开",
    copy: "复制", copied: "已复制", qrLabel: "Bitcoin 地址二维码", copyAddr: "复制 Bitcoin 地址",
    waysTitle: "其他帮助方式",
    costs: [
      { t: "网站与域名", d: "托管及 blackarch.org 域名。" },
      { t: "下载镜像", d: "流量和存储，让 ISO 和软件包在全球快速下载。" },
      { t: "构建与测试硬件", d: "用于在发布前构建、签名和验证软件包的机器。" },
      { t: "持续开发", d: "新工具和后续版本。" },
    ],
    ways: [
      { t: "加星标", d: "GitHub 上的一颗星会帮大忙。", a: "打开 GitHub" },
      { t: "帮助用户", d: "在 Matrix 中回答问题。", a: "加入 Matrix" },
      { t: "参与翻译", d: "根据 LaTeX 源文件翻译指南。", a: "获取源文件" },
      { t: "企业赞助", d: "组织可成为官方赞助商。", a: "联系团队" },
    ],
  },
  community: {
    channels: [
      { d: "寻求帮助的最佳去处。与用户和团队实时聊天。" },
      { d: "所有代码、构建脚本和网站源码。欢迎提交各种大小的 issue 和 pull request。" },
      { d: "新工具、镜像和重要项目变更。发现问题或有想法时请提及我们。" },
      { d: "关于安装、配置和使用主要工具的视频。" },
      { d: "直接联系核心开发团队。" },
    ],
    newsTitle: "新闻与更新",
    lead: "我们一直在开发新功能并持续改进。您可以在这里关注进展。",
    updates: [
      { t: "问题跟踪", d: "错误报告和工具请求在此记录和处理。" },
      { t: "Pull request", d: "当前正在打包、更新和发布的内容。" },
      { t: "公告", d: "新闻发布于 Matrix、YouTube 和 X，也提供 RSS 订阅。" },
    ],
  },
  faq: {
    placeholder: "搜索 FAQ…", searchLabel: "搜索问题", all: "全部", noResults: "没有匹配的问题", clear: "清除搜索",
    copy: "复制", copied: "已复制", copyLabel: "复制命令", count: (n, t) => `第 ${n} 个，共 ${t} 个问题`, permalink: "此问题的链接",
  },
  tools: {
    placeholder: "按名称或描述搜索…", searchLabel: "搜索工具", clear: "清除搜索", all: "全部",
    showing: "显示", of: "/", tools: "个工具", loading: "正在加载工具…", loadingLabel: "正在加载工具",
    noMatch: "没有匹配的工具", clearFilters: "清除筛选", name: "名称", version: "版本", description: "描述",
    category: "类别", website: "网站", visit: "访问网站", noSite: "未提供网站", install: "安装", copy: "复制", copied: "已复制",
    copyAria: (n) => `复制 ${n} 的安装命令`, expandAria: (n) => `显示详情：${n}`, filterLabel: "按类别筛选",
  },
};
