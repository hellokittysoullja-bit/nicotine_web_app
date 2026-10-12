# Troubleshooting

## Skill 没有出现在列表里

依次检查：

1. 目录名是否正好是 `website-studio`。
2. 文件名是否正好是大写 `SKILL.md`。
3. `SKILL.md` 是否位于产品会扫描的目录下一层。
4. YAML frontmatter 是否位于文件最前面，并包含 `name` 与 `description`。
5. `name: website-studio` 是否与目录名一致。
6. 是否需要刷新或重启 Agent。
7. 产品或组织策略是否禁用了第三方 Skill。

Gemini CLI 可以运行 `/skills reload`；其他产品请参考各自的 Skill 管理界面。

## Agent 没有自动使用 Skill

自动调用取决于 Agent 对 `description` 的匹配，不同模型可能有差异。先使用平台支持的显式形式：

```text
$website-studio ...      # Codex
/website-studio ...      # Claude Code、Cursor、Cline、部分 Copilot 表面
@website-studio ...      # Windsurf / Cascade
```

OpenCode、Gemini CLI 和 Roo Code 可以直接写：

```text
Use the website-studio skill to build this website.
```

## Agent 只读了 SKILL.md，没有读取配方

明确要求它按照 `SKILL.md` 的路由加载一个主网站配方、必要能力配方和一个适配器。不要要求一次读完所有文件，这会浪费上下文并削弱路由价值。

## 同一个 Skill 出现两次

搜索项目和个人目录中的重复安装，例如：

```text
.agents/skills/website-studio
.claude/skills/website-studio
.opencode/skills/website-studio
```

保留当前 Agent 推荐的一个位置。不同客户端的同名优先级不同，重复副本还容易造成版本漂移。

## 验证脚本无法运行

Skill 的工作流本身只需要 Markdown。附带验证器需要 Node.js 20 或更高版本：

```bash
node --version
npm test
```

没有 Node.js 时，Agent 仍可执行建站流程，但必须把确定性验证器标记为“未运行”。

## Agent 没有浏览器

它可以完成代码、构建和静态检查，但不能声称完成了真实视觉 QA。交付时应列出仍需人工或浏览器 Agent 检查的视口、裁切、菜单、键盘焦点、溢出和控制台错误。

## 页面能构建但发布后打不开

分别检查：

- 部署的是不是刚刚验证过的同一个版本；
- base path 与静态资源路径是否适配托管子目录；
- 首页是否返回 HTML，而不是登录页或错误页；
- 预期公开站点在未登录状态是否仍可访问；
- 预期受保护站点是否正确返回登录或拒绝访问行为。

可以在发布后运行：

```bash
node scripts/validate-deployment.mjs https://example.com/ \
  --config site-quality.config.json
```

部署验证器会访问你提供的地址，只对你信任并有权测试的目标运行。

## Windows 路径问题

优先使用产品 UI 创建 Skill 目录，或在 PowerShell 中使用 `$HOME`。不要把包含反斜杠的 Windows 路径直接写进 `SKILL.md`；Skill 内的资源链接统一使用相对于 Skill 根目录的正斜杠路径。

## 文档与当前产品版本不一致

Agent 产品变化很快。先查看 [跨 Agent 安装指南](agent-setup.md) 底部的官方链接，再提交 Issue 更新兼容矩阵。不要根据旧博客或社区贴直接修改路径说明。
