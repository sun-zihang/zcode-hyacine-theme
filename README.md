# zcode-hyacine-theme 🌸🌙

> 「昏光庭院」——以《崩坏：星穹铁道》角色 **风堇（Hyacinthia / Hyacine）** 为灵感的
> ZCode 桌面客户端整套 UI 主题 + Codex CLI 配色。

夜空蓝紫半透明表面 · 风信子粉（brand）· 天青风色（accent）· 昏光金（warning）。

![static wallpaper](wallpapers/hyacine-static.jpg)

## 这是什么

| 部分 | 文件 | 作用 |
|---|---|---|
| ZCode 主题注入器 | `zcode/hyacine-theme.mjs` | 通过 CDP 给 ZCode 桌面版注入 43 个语义 CSS 变量覆盖（`!important`），常驻 watch、ZCode 重启/刷新自动重注入 |
| ZCode 视频探针 | `zcode/probe-video.mjs` | 诊断壁纸视频是否真的在播放（currentTime / readyState / 分辨率） |
| Codex CLI 主题 | `codex/Hyacine Dusklight.tmTheme` | Codex CLI 的 TextMate 主题：暮紫底、粉关键字、青字符串、金常量 |
| 静态壁纸 | `wallpapers/hyacine-static.jpg` | 2560×1440，开箱即用 |

主题概念取自角色设定：风堇是背负「天空」火种的黄金裔、昏光庭院的医师——
所以底色是**永夜的暮蓝紫**，点缀**风信子粉**（她的发色）、**天青**（风）、**昏光金**（泰坦艾格勒的黄昏天光）。

## 安装（ZCode 桌面版）

前提：Node.js ≥ 20；ZCode 桌面客户端（Electron）。动态壁纸另需 Wallpaper Engine + ffmpeg ≥ 5。

```bash
# 1) 克隆壁纸插件底座（MIT，第三方）
git clone https://github.com/sorrowKnight123/zcode-beautify-for-wallpaper-engine.git ~/zcode-beautify

# 2) 克隆本仓库，把主题注入器放进插件目录
git clone https://github.com/<you>/zcode-hyacine-theme.git
cp zcode-hyacine-theme/zcode/*.mjs zcode-beautify/

# 3) 启动壁纸服务（serve 自带 watch，ZCode 每次启动自动重注入壁纸）
cd zcode-beautify
node dist/cli.js serve --detach

# 4) 应用静态壁纸（动态版见下）
node dist/cli.js apply wallpapers/hyacine-static.jpg --blur 0 --dim 12

# 5) 启动主题注入器（后台常驻）
node hyacine-theme.mjs &
```

ZCode 需要**带 CDP 调试端口启动**才会被注入（一次性）：

```bash
# 完全退出 ZCode 后：
node dist/cli.js launch
# 该命令会顺便把桌面快捷方式更新为带 --remote-debugging-port=9222，之后正常双击即可
```

### 常见坑（本机实测）

- **ZCode 不在默认路径**（如 `D:\zcode`）：设环境变量
  `ZCODE_WINDOWS_APP_INSTALL_DIR` 指向安装目录
- **ffmpeg 不在 PATH**：设 `ZCODE_BEAUTIFY_FFMPEG` 直指 `ffmpeg.exe` 全路径
- **动态壁纸 404 / 只剩静态海报**：`serve` 必须在场景导入**之后**（重）启动，
  它的场景注册表只在启动时加载
- **4K 视频导入 OOM**：交叉淡化滤镜在 4K 会爆内存，先转码到屏幕原生宽度再喂给 `apply-scene`

### 动态壁纸（可选）

在 Wallpaper Engine 创意工坊订阅你喜欢的动态壁纸后：

```bash
node dist/cli.js apply-scene "<WE 工坊项目目录>" --blur 0 --dim 12
```

### 开机自启（可选）

把下面内容存为 `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\zcode-hyacine.cmd`
（纯 ASCII，路径按需改）：

```bat
@echo off
set "ZCODE_BEAUTIFY_FFMPEG=C:\Users\you\zcode-beautify\bin\ffmpeg.exe"
cd /d C:\Users\you\zcode-beautify
start "serve" /min "C:\Program Files\nodejs\node.exe" dist\cli.js serve --detach
start "theme" /min "C:\Program Files\nodejs\node.exe" hyacine-theme.mjs
```

## 安装（Codex CLI）

```bash
mkdir -p ~/.codex/themes
cp "codex/Hyacine Dusklight.tmTheme" ~/.codex/themes/
# ~/.codex/config.toml 加一行：
#   tui.theme = "Hyacine Dusklight"
```

或在 Codex CLI 里输 `/theme` 直接选。

## 调色板

- **brand：风信子粉 `#FFB1C9`** —— 她的发色/风信子花
- **accent：天青 `#8ED4CF`** —— 风与天空
- **warning：昏光金 `#F0A24E`** —— 艾格勒的黄昏天光
- **文字**：薰衣草白四级层次；焦点环/输入框聚焦转粉
- **文件节点/命令节点**：转青色与紫藤色族；搜索高亮转紫红

表面为半透明暮色层，壁纸照常从底下透出，克制不抢戏。

改颜色：直接编辑 `zcode/hyacine-theme.mjs` 顶部 `CSS` 常量，
重启注入器即生效（watcher 启动时会强制刷新已注入的样式块）。

## 卸载

- 主题：关掉 hyacine-theme 进程，ZCode 重启即恢复原生外观
- 壁纸：`node dist/cli.js reset`

## 署名与声明

- 主题底座：[sorrowKnight123/zcode-beautify-for-wallpaper-engine](https://github.com/sorrowKnight123/zcode-beautify-for-wallpaper-engine)（MIT）
- 壁纸画面源自《崩坏：星穹铁道》官方宣传图（© HoYoverse/miHoYo），
  工坊视频版作者 [Ra轮回](https://space.bilibili.com)（B站），版权归原作者所有；
  本仓库仅非商用粉丝用途，动态版请到 Wallpaper Engine 创意工坊订阅支持作者
- 本项目与 HoYoverse、ZCode、OpenAI 均无关联，纯属粉丝自制

## License

MIT
