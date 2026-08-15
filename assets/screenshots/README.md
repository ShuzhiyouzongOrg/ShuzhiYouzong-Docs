# 截图资源与占位规范

本目录保存技术文档中可替换的多端运行截图。截图缺失时，正文使用 TikZ 占位框，不会阻塞 LaTeX 编译；后续只需保持文件名或修改对应 `\IfFileExists` 路径即可替换，不需要重新设计页面。

建议资源：

- `web-digital-human.webp`：Web 游客端数字人、答案、引用与语音状态，建议 16:9 或 4:3。
- `web-scenic-map.webp`：Web 腾讯地图/Leaflet 手绘地图切换，建议 16:9。
- `web-operations-dashboard.webp`：Web 管理端运营大屏，建议 16:9。
- `visitor-android-home.png`：Android APK 首页或 AI 导游页，建议 9:16。
- `visitor-wechat-map.png`：微信小程序地图页，建议 9:16。
- `visitor-harmony-home.jpeg`、`visitor-harmony-map.jpeg`、`visitor-harmony-ai.jpeg`：鸿蒙 HAP 运行截图，建议 9:16。
- `desktop-windows.png`、`desktop-linux.png`、`desktop-macos.png`：桌面端安装后运行截图，建议 16:9。

当前已纳入的 `web-*` 与 `visitor-harmony-*` 为项目评审/介绍站真实截图；Windows、Linux、macOS、Android、微信小程序截图可按上述命名补入。
