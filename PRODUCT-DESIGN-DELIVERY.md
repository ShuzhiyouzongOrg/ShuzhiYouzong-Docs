# 数智游踪技术文档交付说明

## 项目结构

- LaTeX 主文件：`product-design.tex`
- 参考文献数据库：`reference.bib`
- 正文章节：`chapters/01-background.tex` 至 `chapters/09-conclusion.tex`
- 代码清单：`assets/code/`
- 文档图片：`figures/`
- Draw.io 源文件及导出资源：`figures/drawio/`
- ElegantBook 类文件：`elegantbook.cls`

## 编译

项目使用 XeLaTeX → Biber → XeLaTeX → XeLaTeX 编译链。在项目目录中运行：

```text
python build.py
```

构建脚本会在隔离的 `.latex-build` 目录中执行完整编译链，成功后自动清理中间文件，并在项目根目录生成正式交付文件：

```text
shuzhiyouzong-docs.pdf
```

编译环境需要 Python 3、XeLaTeX、Biber，以及 `elegantbook.cls` 所依赖的 LaTeX 宏包。Windows 环境支持自动检测用户级 MiKTeX 默认安装位置。

## 当前交付状态

- 文档标题：《数智游踪——智慧景区沉浸式AI导览助手》
- 页面规格：A4，共 39 页
- 目录、图表清单、交叉引用和参考文献已通过完整编译链收敛
- 正式 PDF 文件名：`shuzhiyouzong-docs.pdf`
