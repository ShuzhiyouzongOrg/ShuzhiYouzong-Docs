# 数智游踪项目技术文档

本仓库是“数智游踪——智慧景区沉浸式 AI 导览助手”的 LaTeX 项目技术文档源码，面向第十五届“中国软件杯”A5“景区导览服务 AI 数字人”赛题。文档基于 ElegantBook 模板持续迭代，内容以真实项目代码、构建结果、运行截图和部署状态为依据。

当前文档版本为 `v3.2.0`，主入口为 [`product-design.tex`](product-design.tex)，正式交付文件为 [`shuzhiyouzong-docs.pdf`](shuzhiyouzong-docs.pdf)。

## 项目概述

“数智游踪”面向景区游客与运营管理人员，围绕可信知识问答、AI 数字人讲解、个性化路线推荐、地图导览、多语言交互和运营分析形成完整服务闭环。项目以灵山胜境与拈花湾资料包为当前知识边界，并通过模块化接口保留向其他景区及相似文旅场景迁移的能力。

技术文档重点呈现以下工程成果：

- 讯飞云端流式数字人与本地 Live2D 组成的数字人双端兜底机制。
- 腾讯地图在线能力、Leaflet 手绘地图、原生地图与 GPS 定位组成的地图双端兜底机制。
- Web、Windows、Linux、macOS、Android APK、微信小程序和 HarmonyOS HAP 的多端发布体系。
- Vue 3、Node.js、SQLite、可重建知识快照与本地/托管可降级 RAG 组成的分层技术架构。
- 版本化知识快照、用途与访问范围隔离、PDF/XLSX结构化解析和扫描PDF的异步 OCR 待处理链路。
- 规则/BM25、RRF、MMR、可选百炼 Embedding、Qdrant 和 Reranker 组成的可观测检索链路，并保留本地回退。
- 简体中文、英文、韩文、繁体中文和日文五语言运行时切换能力。
- 游客导览、管理配置、知识维护、会话反馈、运营分析和质量修正构成的业务闭环。

## 在线入口

- 项目介绍网站：[https://www.shuzhiyouzong.cn/website-preview/](https://www.shuzhiyouzong.cn/website-preview/)
- 项目介绍文档站：[https://www.shuzhiyouzong.cn/website-preview/docs](https://www.shuzhiyouzong.cn/website-preview/docs)

## 文档结构

| 章节 | 主要内容 |
| --- | --- |
| 第 1 章 背景与需求分析 | 项目定位、业务痛点、赛题侧重点、产品目标与范围 |
| 第 2 章 产品总体设计 | 总体架构、技术路线、核心技术选型、设计原则与功能域 |
| 第 3 章 功能与交互设计 | 游客端、管理端、多语言、多模态流程及多端界面适配 |
| 第 4 章 核心技术与算法设计 | i18n、本地与托管 RAG、路线推荐、语音数字人编排与地图兜底 |
| 第 5 章 数据、接口与部署设计 | 知识数据、版本治理、PDF/XLSX/OCR、接口、部署拓扑与多端发布 |
| 第 6 章 质量、安全与可靠性设计 | 非功能指标、安全可信、异常降级、运维与隐私保护 |
| 第 7 章 测试评估与应用价值 | 测试策略、自动化结果、行业价值、商业价值与复用能力 |
| 第 8 章 创新实践 | 可信智能、运营闭环、双端兜底和多端发布创新 |
| 第 9 章 总结与展望 | 项目总结、后续扩展方向与团队致谢 |

## 仓库结构

```text
.
├── product-design.tex              # LaTeX 主入口与全局排版配置
├── chapters/                       # 第 1 章至第 9 章正文
├── assets/
│   ├── code/                       # 文档引用的真实关键代码
│   ├── figures/                    # 架构图、流程图与通用图片
│   │   └── drawio/                 # Draw.io 源文件及导出资源
│   ├── image/                      # 模板相关图片资源
│   └── screenshots/                # Web、移动端与桌面端运行截图
├── reference.bib                   # 参考文献数据库
├── elegantbook.cls                 # ElegantBook 文档类
├── build.py                        # 正式构建脚本
├── shuzhiyouzong-docs.pdf          # 最新正式 PDF
└── PRODUCT-DESIGN-DELIVERY.md      # 文档交付与检查说明
```

## 构建环境

编译前需要准备以下工具：

- Python 3.9 或更高版本。
- XeLaTeX。
- Biber。
- 完整的中文 LaTeX 宏包与可用的中文字体环境。

Windows 可使用 MiKTeX，Linux 和 macOS 可使用包含 XeLaTeX 与 Biber 的 TeX Live 发行版。`build.py` 会优先从系统 `PATH` 查找工具，并兼容 Windows 默认 MiKTeX 安装路径。

## 编译方法

在仓库根目录执行：

```bash
python build.py
```

构建脚本依次执行：

```text
XeLaTeX → Biber → XeLaTeX → XeLaTeX
```

编译成功后，正式 PDF 输出为：

```text
shuzhiyouzong-docs.pdf
```

脚本使用 `.latex-build/` 作为隔离构建目录。编译成功后中间文件会自动清理；编译失败时会保留该目录，便于检查 `.log`、`.blg` 等诊断文件。

## 文档维护

### RAG与文档处理配置

- 默认 `RAG_REMOTE_ENABLED=false`，本地规则/BM25、RRF、MMR 与 SQLite 活动知识版本即可完成离线问答。
- 启用托管增强时，仅在服务端配置 `RAG_DASHSCOPE_API_KEY`、`RAG_EMBEDDING_*`、`RAG_QDRANT_*` 与 `RAG_RERANK_*`；浏览器不接触这些凭证。
- 当前默认模型为 `qwen3.7-text-embedding`（1024 维）和 `qwen3-rerank`；远程异常自动回退本地检索，并在响应中保留状态与耗时摘要。
- `DOCUMENT_PARSER_ENABLED=false` 时，文本型 PDF 仍可由内置解析器处理；扫描型 PDF 标记为 `needs_ocr`，启用阿里云文档解析前需安装可选 SDK 并配置 RAM 凭证。
- 行为分析 XLSX 默认归入 `operations_analytics`，不进入游客问答；面向游客的 XLSX 需明确选择 `visitor_qa` 并经过同样的权限和版本校验。

### 修改正文

正文按章节拆分在 `chapters/` 目录中。新增内容应优先插入现有章节，保持章节名称、编号体系、交叉引用和整体视觉风格稳定。

### 更新图片

- 架构图和流程图放入 `assets/figures/`。
- Draw.io 可编辑源文件放入 `assets/figures/drawio/`，并同步更新导出的 PDF 或 PNG。
- 项目真实运行截图放入 `assets/screenshots/`。
- 替换图片时应尽量保持原文件名与宽高比，随后重新编译并检查图题、清单和页面布局。

### 更新代码清单

文档中的 Listing 代码位于 `assets/code/`，内容应来自真实项目实现。代码清单需要与“源码位置”说明保持在同一页，并检查长行换行、分页、题注和源码路径是否清晰。

### 更新参考文献

参考文献统一维护在 `reference.bib`。正文使用 `\cite{}` 引用，构建脚本会自动执行 Biber 并通过后续 XeLaTeX 轮次解析编号与目录。
