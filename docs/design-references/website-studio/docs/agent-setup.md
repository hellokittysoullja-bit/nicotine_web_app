# 在不同 Agent 中使用 Website Studio

这份指南说明如何在 Codex 之外安装和调用 `website-studio`。它同时区分两件容易混淆的事：

- **格式兼容**：产品官方文档明确支持目录型 Agent Skill 与 `SKILL.md`。
- **能力完整**：当前 Agent 是否真的拥有文件编辑、终端、浏览器、数据、认证和部署工具。

Website Studio 可以在缺少某些工具时降级执行，但不会把“没有浏览器”说成“已完成视觉验收”，也不会把“没有部署权限”说成“已经上线”。

> 本页所列发现路径和调用方式于 2026-07-12 根据各产品官方文档核对。Agent 产品更新很快；如果界面或命令变化，请优先查看本页末尾的官方资料。我们核对了官方支持路径，但没有在每一种产品、版本和组织策略组合中逐台安装测试。

## 先选安装范围

### 个人安装

适合你希望在所有项目中使用 Website Studio。

最广泛的共享位置是：

```text
~/.agents/skills/website-studio/
```

这个路径可被 Codex、Cursor、Gemini CLI、GitHub Copilot、Windsurf、OpenCode 和 Roo Code 官方发现。

macOS / Linux：

```bash
mkdir -p "$HOME/.agents/skills"
git clone https://github.com/Do-fei/website-studio-skill.git \
  "$HOME/.agents/skills/website-studio"
```

Windows PowerShell：

```powershell
New-Item -ItemType Directory -Force "$HOME\.agents\skills" | Out-Null
git clone https://github.com/Do-fei/website-studio-skill.git `
  "$HOME\.agents\skills\website-studio"
```

Claude Code 和 Cline 使用各自的路径，详见后面的平台章节。

### 项目安装

适合把工作流与项目一起提交，让整个团队获得同一版本。

对于支持跨 Agent 目录的产品，把 Release ZIP 中的 `website-studio/` 放到：

```text
<project>/.agents/skills/website-studio/
```

目录必须保持完整：

```text
.agents/skills/website-studio/
├── SKILL.md
├── references/
├── recipes/
├── adapters/
├── assets/
├── scripts/
└── examples/
```

不要只复制 `SKILL.md`。Website Studio 会按任务需要读取配方、适配器、检查清单和模板。

### 不要重复安装同一个 Skill

同一个项目不要同时保留 `.agents/skills/website-studio`、`.claude/skills/website-studio` 和 `.opencode/skills/website-studio`，除非你清楚每个客户端的覆盖优先级。重复名称可能导致某些 Agent 显示两份 Skill，或者加载到不是你预期的版本。

## 支持矩阵

| Agent | 官方原生 Skill | 推荐个人路径 | 推荐项目路径 | 显式调用 |
|---|---:|---|---|---|
| OpenAI Codex | 是 | `~/.agents/skills/website-studio` | `.agents/skills/website-studio` | `$website-studio ...` |
| Claude Code | 是 | `~/.claude/skills/website-studio` | `.claude/skills/website-studio` | `/website-studio ...` |
| Gemini CLI | 是 | `~/.gemini/skills/website-studio` 或 `~/.agents/skills/...` | `.gemini/skills/...` 或 `.agents/skills/...` | 在提示词中明确要求使用 |
| GitHub Copilot | 是 | `~/.copilot/skills/website-studio` 或 `~/.agents/skills/...` | `.github/skills/...` 或 `.agents/skills/...` | `/website-studio ...`（支持的表面） |
| Cursor | 是 | `~/.cursor/skills/website-studio` 或 `~/.agents/skills/...` | `.cursor/skills/...` 或 `.agents/skills/...` | `/website-studio ...` |
| Windsurf / Cascade | 是 | `~/.codeium/windsurf/skills/website-studio` 或 `~/.agents/skills/...` | `.windsurf/skills/...` 或 `.agents/skills/...` | `@website-studio ...` |
| OpenCode | 是 | `~/.config/opencode/skills/website-studio` 或 `~/.agents/skills/...` | `.opencode/skills/...` 或 `.agents/skills/...` | 在提示词中明确要求使用 |
| Cline | 是 | `~/.cline/skills/website-studio` | `.cline/skills/website-studio` | `/website-studio ...` |
| Roo Code | 是 | `~/.roo/skills/website-studio` 或 `~/.agents/skills/...` | `.roo/skills/...` 或 `.agents/skills/...` | 在提示词中明确要求使用 |
| 其他文件型 Agent | 手动兼容 | 任意可读目录 | 项目内资料目录 | 要求先完整阅读 `SKILL.md` |

“官方原生”只表示该产品支持 Skill 的发现和按需加载，不表示它自动拥有浏览器、托管账号或数据库。

## OpenAI Codex

### 安装

个人范围：

```text
~/.agents/skills/website-studio/SKILL.md
```

项目范围：

```text
<repo>/.agents/skills/website-studio/SKILL.md
```

Codex 会从当前目录向上扫描到仓库根目录，因此团队可以把 Skill 放在仓库根部，也可以放在只服务某个子项目的位置。

### 调用

```text
$website-studio 为这个产品制作一个完整官网。先判断配方和能力路径，再开始实现。
```

Codex CLI / IDE 也可以使用 `/skills` 查看 Skill，或输入 `$` 选择。自然语言命中 `description` 时，Codex也可以自动调用。

### 注意

`agents/openai.yaml` 用来改善 ChatGPT desktop / Codex 的显示信息；它不是其他 Agent 必须理解的跨平台文件。

## Claude Code

### 安装

个人范围：

```bash
mkdir -p "$HOME/.claude/skills"
git clone https://github.com/Do-fei/website-studio-skill.git \
  "$HOME/.claude/skills/website-studio"
```

项目范围：

```text
<project>/.claude/skills/website-studio/
```

### 调用

```text
/website-studio 为这个产品制作官网，先交付本地或私有预览。
```

也可以直接描述任务，让 Claude 根据 Skill 的 `description` 自动判断。

### 注意

Claude Code 有额外的 frontmatter、动态命令注入和子 Agent 执行能力。Website Studio 没有依赖这些专有字段，以保持跨平台可用。`CLAUDE.md` 适合一直生效的项目事实；多阶段建站流程应继续放在 Skill 中。

## Gemini CLI

### 最简安装

```bash
gemini skills install https://github.com/Do-fei/website-studio-skill
```

只在当前项目安装：

```bash
gemini skills install https://github.com/Do-fei/website-studio-skill \
  --scope workspace
```

也可以手动放到：

```text
~/.gemini/skills/website-studio/
<project>/.gemini/skills/website-studio/
```

Gemini CLI 同时支持 `.agents/skills/` 别名。

### 检查与调用

```text
/skills list
/skills reload
```

然后输入：

```text
请使用 website-studio skill，为我的 SaaS 制作官网并完成移动端验收。
```

Gemini CLI 由模型调用 `activate_skill`，不是把 `/website-studio` 定义为通用直接调用语法。启用 Skill 时可能要求用户确认。

## GitHub Copilot

### 安装

个人范围：

```text
~/.copilot/skills/website-studio/
~/.agents/skills/website-studio/
```

项目范围可选择一个：

```text
.github/skills/website-studio/
.agents/skills/website-studio/
.claude/skills/website-studio/
```

Cloud agent 和代码审查运行在远端，不会读取你本机 Home 目录。需要远端 Agent 使用时，必须把项目 Skill 提交到仓库。

### 调用

在 Copilot CLI 或支持 Skill slash command 的界面中：

```text
/website-studio redesign this product site and verify the mobile layout
```

也可以用自然语言自动触发。

### 关于 `gh skill`

GitHub CLI 2.90.0+ 提供预览状态的 `gh skill` 管理能力。使用前先检查内容：

```bash
gh skill preview Do-fei/website-studio-skill website-studio
```

该命令仍属于 public preview，旧版 GitHub CLI 没有此功能；手动下载 Release ZIP 始终是更保守的方案。

## Cursor

### 安装

```text
~/.cursor/skills/website-studio/
<project>/.cursor/skills/website-studio/
```

Cursor 也支持跨 Agent 路径：

```text
~/.agents/skills/website-studio/
<project>/.agents/skills/website-studio/
```

### 调用

```text
/website-studio 为当前项目重新设计响应式首页
```

Skill 也会根据 `description` 自动匹配。Cursor Rules 用于始终生效或按文件范围生效的约束；Website Studio 这种包含多个资源的按需流程更适合 Skill。

## Windsurf / Cascade

### 安装

Workspace：

```text
<project>/.windsurf/skills/website-studio/
```

Global：

```text
~/.codeium/windsurf/skills/website-studio/
```

Windsurf 也会发现 `.agents/skills/` 与 `~/.agents/skills/`。

### 调用

```text
@website-studio 为这个活动制作一个有明确视觉方向的网页
```

也可以让 Cascade 根据描述自动调用。Rules 适合行为约束，Workflows 适合手动 slash command，Skill 适合带模板、脚本和参考资料的多阶段任务。

## OpenCode

### 安装

OpenCode 原生路径：

```text
~/.config/opencode/skills/website-studio/
<project>/.opencode/skills/website-studio/
```

兼容路径：

```text
~/.agents/skills/website-studio/
<project>/.agents/skills/website-studio/
~/.claude/skills/website-studio/
<project>/.claude/skills/website-studio/
```

### 调用

```text
Use the website-studio skill to build this dashboard. Preserve the existing stack.
```

OpenCode 会从 available skills 中调用原生 `skill` tool。`/website-studio` 不是官方通用调用方式。

### 注意

OpenCode 可以按 Skill 名称设置 `allow`、`ask` 或 `deny`。如果 Skill 没有出现，检查 `opencode.json` 是否禁用了 `skill` tool 或拒绝了 `website-studio`。

## Cline

### 安装

个人范围：

```bash
mkdir -p "$HOME/.cline/skills"
git clone https://github.com/Do-fei/website-studio-skill.git \
  "$HOME/.cline/skills/website-studio"
```

项目范围推荐：

```text
<project>/.cline/skills/website-studio/
```

Cline 还会读取项目中的 `.clinerules/skills/` 与 `.claude/skills/`，但没有官方全局 `.agents/skills/` 路径。

### 调用

```text
/website-studio 为当前项目制作产品发布页
```

Cline 也可以按描述自动调用 `use_skill`。如果个人 Skill 与项目 Skill 同名，Cline 的个人版本优先。

## Roo Code

### 安装

```text
~/.roo/skills/website-studio/
<project>/.roo/skills/website-studio/
```

也支持：

```text
~/.agents/skills/website-studio/
<project>/.agents/skills/website-studio/
```

### 调用

```text
Use the website-studio skill to redesign this portal and define all permission states.
```

Roo 会根据描述按需加载。不要把 Website Studio 放进 `skills-code/` 或 `skills-architect/`，除非你有意让它只在某个 Mode 可见。

## 没有原生 Skills 功能时

只要 Agent 能读取一组文件，就能使用手动兼容方式。

1. 下载并解压 Release ZIP，保持目录结构。
2. 把整个 `website-studio/` 文件夹加入项目或对话资料。
3. 发送下面这段提示词：

```text
你现在可以读取 website-studio 文件夹。

先完整阅读 website-studio/SKILL.md，并把它作为本次建站任务的强约束。
不要一次性读取全部参考文件；先判断主网站配方、Simple/Capability path 和执行适配器，
再按 SKILL.md 的路由读取相关 recipes、references 和 adapters。

如果你缺少浏览器、数据、认证、上传、连接器或部署能力，明确说明缺少什么并使用对应降级路径，
不要声称已经完成你无法直接验证的工作。
```

如果产品只能上传单个文件，优先提供 `SKILL.md`，然后根据任务补充：

- 一个网站配方，例如 `recipes/landing-page.md`；
- 一个适配器，例如 `adapters/static.md`；
- 相关质量文件，例如 `references/qa-and-release.md`；
- 必要模板，而不是整个目录一次塞入上下文。

## 推荐提示词

### 新产品官网

```text
使用 website-studio，为我的产品制作一个完整官网。

请先判断：
1. 主网站配方；
2. Simple path 还是 Capability path；
3. 当前 Agent 可用的浏览器、数据和部署能力。

完成设计、真实内容、响应式实现和关键交互；先交付私有预览，未经确认不要公开发布。
```

### 改造已有项目

```text
Use website-studio to redesign this existing web project.
Preserve its framework, package manager, lockfile, architecture, and hosting configuration.
Define the visual direction and critical states before implementation, then provide build,
browser, accessibility, and deployment evidence separately.
```

### Dashboard / 内部工具

```text
使用 website-studio 重新设计这个运营 Dashboard。
必须定义正常、加载、空白、错误、陈旧数据和权限不足状态。
不要用 localStorage 假装已经实现服务器持久化，也不要使用假登录。
```

### 只有设计，没有发布权限

```text
使用 website-studio 完成网站设计和本地实现。
我没有给你部署权限，所以交付可部署产物、构建证据与发布清单，
但不要虚构线上网址或公开访问验证。
```

## 能力降级规则

| 缺少的能力 | Agent 应当怎么做 | 不允许怎么说 |
|---|---|---|
| 浏览器 | 完成实现与静态检查，列出待做视觉 QA | “移动端已经检查” |
| 数据库 | 缩小为内容型网站或交付数据契约 | “数据已经持久化” |
| 认证 | 交付权限矩阵与集成边界 | “登录已经安全实现” |
| 上传能力 | 使用占位接口与文件约束说明 | “文件已上传到云端” |
| 外部连接器 | 使用明确标记的 fixture | “正在展示实时数据” |
| 部署权限 | 交付构建产物和部署清单 | “网站已经公开上线” |
| 匿名访问测试 | 声明访问模型尚未核验 | “任何人都能打开” |

## 官方资料

- [Agent Skills 开放规范](https://agentskills.io/specification)
- [OpenAI Codex：Build skills](https://learn.chatgpt.com/docs/build-skills)
- [Claude Code：Extend Claude with skills](https://code.claude.com/docs/en/skills)
- [Gemini CLI：Managing Agent Skills](https://geminicli.com/docs/cli/using-agent-skills/)
- [GitHub Copilot：Adding agent skills](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills)
- [Cursor：Agent Skills](https://cursor.com/docs/skills)
- [Windsurf / Cascade：Skills](https://docs.windsurf.com/windsurf/cascade/skills)
- [OpenCode：Agent Skills](https://opencode.ai/docs/skills)
- [Cline：Skills](https://docs.cline.bot/customization/skills)
- [Roo Code：Skills](https://docs.roocode.com/features/skills)

安装前请检查 `SKILL.md` 和 `scripts/`。任何公开 Skill 都可能包含不适合你环境的命令；不要因为它来自 GitHub 就自动授予无限终端或发布权限。
