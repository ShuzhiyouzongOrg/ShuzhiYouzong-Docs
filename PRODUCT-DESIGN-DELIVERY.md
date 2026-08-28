# 数智游踪技术文档交付说明

## 项目结构

- LaTeX 主文件：`product-design.tex`
- 参考文献数据库：`reference.bib`
- 正文章节：`chapters/01-background.tex` 至 `chapters/09-conclusion.tex`
- 代码清单：`assets/code/`
- 文档通用图片：`assets/figures/`
- 多端真实截图：`assets/screenshots/`
- Draw.io 源文件及导出资源：`assets/figures/drawio/`
- ElegantBook 示例素材归档：`assets/image/`
- ElegantBook 文档类：`elegantbook.cls`

## 版本与编译

- 文档版本：`v3.2.0`
- 交付日期：2026-08-28
- 页面规格：A4，页数以本次编译输出为准（新增版本修订记录表与 RAG 治理章节）
- 编译链：XeLaTeX → Biber → XeLaTeX → XeLaTeX
- 构建命令：`python build.py`
- 正式 PDF：`shuzhiyouzong-docs.pdf`

构建脚本在隔离的 `.latex-build` 目录中执行完整编译链，完成后将 PDF 复制到项目目录，并清理中间产物。文档保留原有 ElegantBook 模板、章节体系、视觉风格、有效图表、代码清单和参考文献；新增横向技术选型表时使用 `pdflscape`，页面结束后自动恢复纵向排版。

## 本轮更新范围

本轮不是另起炉灶，而是在原有章节基础上的增量更新：

1. 保留内置基线的 7 份资料、22 个 RAG 景点实体、20 个导览分节和 107 个知识分块，并补充运行时上传文档的版本化管理。
2. 补充 RAG 远程增强链路：百炼 Embedding、Qdrant Dense、Reranker、元数据过滤、本地降级和远程索引同步。
3. 补充 PDF/XLSX/OCR 文档处理、运营分析用途隔离、异步 Worker、内容哈希去重与安全边界。
4. 根据 2026-07-14 至 2026-08-28 的源码和文档提交记录新增版本修订记录表，并将文档版本更新为 `v3.2.0`。
5. 新增“核心技术选型”横向比较，覆盖数字人、TTS、ASR 与地图，并将当前项目选型置于比较起点。
6. 强化数字人和地图的双端兜底设计，明确在线、离线、缺少 Key、SDK 失败和终端能力差异下的降级路径。
7. 补充 Web、Windows、Linux、macOS、Android APK、微信小程序、HarmonyOS HAP 及 iOS 模拟器目标的构建、适配关系与交付证据。
8. 更新 Web 与 HarmonyOS 截图，并接入 Android、微信、Windows、Linux、macOS 的真实运行截图。
9. 增加桌面端 Electron 本地服务运行时、构建命令、地图回退代码、移动端地图回退代码、RAG版本治理代码和质量安全检查。
10. 增加商业价值、景区规模化部署和向博物馆、展馆、校园、园区、文旅小镇迁移的复用分析。
11. 修正旧文档中“GPS 尚未实现”等与当前代码冲突的表述；连续轨迹、蓝牙信标、二维码到点触发和弱网缓存仍明确标为后续扩展。

## 多端交付状态

- Web 主网站、文档网站和项目介绍网站：已上线/可访问。
- Windows：Electron x64 NSIS EXE 已完成编译构建与评审测试包发布。
- Linux：Electron AppImage/DEB 已完成构建与可移植性验证，下载项状态为 `ready`。
- macOS：Intel/Apple Silicon 构建链已验证，arm64 DMG 已生成并用于评审测试。
- Android：uni-app x APK 已构建，评审包为 `scenic-visitor-evaluation-1.0.2-102.apk`。
- 微信小程序：`mp-weixin` 产物已生成，启用页面已完成编译与发布验证。
- HarmonyOS：HAP 全链路已完成，已在 Pura 90 模拟器安装启动并复核截图。
- iOS：uni-app x 模拟器目标已完成编译；正式签名、真机安装和商店发行仍需要 macOS/Xcode 环境，文档未将其写成已发布能力。

## 构建证据

文档引用的构建产物来自当前工作区及其留存目录，未在正文中暴露密钥、AppID 或其他敏感凭证。代表性证据包括 Windows EXE、macOS arm64 DMG、Android APK、HarmonyOS HAP 以及微信小程序 `unpackage/dist/build/mp-weixin` 目录。代码清单 `assets/code/platform-builds.ps1` 保留了真实构建命令和目标平台映射。

## 质量与视觉检查

已通过 XeLaTeX、Biber 和二次 XeLaTeX 的完整编译链，PDF 生成成功，无 LaTeX error，目录、图表清单、版本修订记录表、交叉引用和参考文献均已收敛。已检查封面、目录、版本表、横向技术选型页、RAG流程与代码清单、真实截图页、地图回退流程、多端发布表、商业价值、创新与结论章节，以及参考文献末页。表格中的长文件名已改用可断行路径命令，避免影响正文版心。

日志中仍可能出现少量中英文混排造成的 underfull hbox，以及模板自带的 SimSun 粗体回退提示；这些不影响输出 PDF 的可读性和编译成功。原有有效内容没有因压缩页数而删除；本轮新增版本表、RAG治理说明和文档处理清单，最终页数以实际编译结果为准。

## 提交说明

本轮修改应单独在文档仓库创建英文 Git commit；编译生成的 PDF 随文档源代码一并更新，用户删除的 `assets/figures/visitor-guide.png` 不应被恢复或混入提交。
