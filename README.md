# 灵境胜杯

潮汕筊杯（圣杯）民俗文化模拟工具。纯前端本地运行，无需后端、账号或任何密钥，所有问事记录只保存在本机 localStorage，不上传任何数据。仅供民俗文化娱乐参考。

## 技术栈

React 19 + TypeScript + Vite + Tailwind CSS v4 + Motion + vite-plugin-pwa

## 本地运行

```bash
npm install
npm run dev
```

默认地址：http://localhost:3000

## 构建与预览

```bash
npm run build
npm run preview
```

## 说明

- 无需配置环境变量或 API Key。
- 首页结果为圣茭 / 笑茭 / 阴茭三种。
- 支持安装为 PWA 使用；界面字体首次加载时从 Google Fonts 获取，之后由缓存提供。
