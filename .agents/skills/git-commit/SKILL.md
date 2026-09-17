---
name: git-commit
description: 分析当前 Git 工作区的变更，生成符合 Conventional Commits 的提交信息，并在用户明确要求提交时安全执行 git commit。用户要求提交代码、生成 commit message、整理提交说明或检查待提交变更时使用。
disable-model-invocation: true
---

# Git Commit

根据当前 Git 工作区生成准确、简洁的 Conventional Commits 提交信息，并在用户明确要求时执行提交。

## 安全边界

- 仅处理当前仓库，不修改 Git 配置，不切换分支，不执行 push、pull、merge、rebase 或 reset。
- 不自动提交敏感文件，例如 `.env`、私钥、令牌、凭据或包含用户数据的文件。发现疑似敏感内容时停止并提醒用户。
- 不自动提交明显的临时文件、构建缓存、编辑器状态或与本次任务无关的改动。
- 不覆盖、还原或删除用户已有改动。
- 只有用户明确要求“提交”时才执行 `git commit`；若用户只要求生成提交信息，则仅输出建议。
- 提交前必须展示或说明拟提交范围，不能默认把所有工作区修改全部纳入。

## 工作流

### 1. 检查仓库状态

运行只读命令：

```sh
git --no-optional-locks status --short --branch
git --no-pager diff --stat
git --no-pager diff --cached --stat
```

必要时查看具体差异：

```sh
git --no-pager diff -- <path>
git --no-pager diff --cached -- <path>
```

同时检查未跟踪文件名，判断是否存在不应提交的内容。

### 2. 明确提交范围

- 若已有 staged 变更，优先将其视为用户选定的提交范围，并检查是否还存在相关但未暂存的文件。
- 若没有 staged 变更，依据用户本轮任务确定应提交文件；范围不明确或包含不相关修改时，先向用户确认。
- 使用明确路径暂存文件：

```sh
git add -- <path-1> <path-2>
```

- 不要使用 `git add -A`、`git add .` 或其他会无差别纳入全部修改的命令，除非用户明确要求提交所有变更且已确认范围。
- 暂存后重新检查：

```sh
git --no-pager diff --cached --stat
git --no-pager diff --cached
```

### 3. 生成提交信息

格式：

```text
<type>(<scope>): <subject>

<body>
```

可用类型：

- `feat`：新增功能
- `fix`：修复问题
- `docs`：仅文档变更
- `style`：不影响逻辑的格式调整
- `refactor`：重构
- `perf`：性能优化
- `test`：测试变更
- `chore`：构建、工具或辅助维护
- `ci`：持续集成配置
- `build`：构建系统或依赖变更

规则：

- 标题使用英文 Conventional Commits 前缀；subject 默认使用简洁中文，与仓库已有风格明显不同时可沿用仓库风格。
- subject 使用祈使语气，概括核心改动，不加句号，建议不超过 72 个字符。
- scope 应来自实际影响模块，例如 `docs`、`sidebar`、`android`、`ios`；无法准确归类时省略 scope。
- body 只说明有价值的实现细节、影响或迁移信息，避免重复标题。
- 多类改动应以主要目的决定 type；互不相关的变更建议拆分提交。

示例：

```text
docs(ble): 新增异常与信息对照表

- 汇总 ErrorTmd 和 MessageTmd 映射
- 补充检测项路由及数据源注意事项
- 将页面加入客户文档导航
```

### 4. 执行提交

执行提交时避免打开编辑器：

```sh
GIT_EDITOR=true git commit -m "<title>" -m "<body>"
```

无 body 时只使用一个 `-m`。

### 5. 验证结果

提交后运行：

```sh
git --no-pager show --stat --oneline --summary HEAD
git --no-optional-locks status --short --branch
```

最终报告：

1. commit 短哈希和完整标题；
2. 实际提交的文件范围；
3. 工作区是否仍有未提交修改；
4. 明确说明未执行 push。

## 异常处理

- 没有可提交内容时，不创建空提交，直接说明。
- Git hooks 或检查失败时，报告关键错误并修复由本次改动造成的问题；未经用户明确要求，不使用 `--no-verify` 绕过 hooks。
- 如果提交过程中出现冲突、锁文件、身份配置缺失或其他 Git 错误，停止操作并说明，不进行破坏性恢复。
