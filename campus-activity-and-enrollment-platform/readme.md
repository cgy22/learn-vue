# 🎓 Campus Activity & Enrollment Platform

---

## 📖 About

**Campus Activity & Enrollment Platform** is a uni-app project that runs as a WeChat Mini Program (and H5). It provides a two-tab structure — **🏠 Home (Activity List)** and **👤 Mine (Enrollment Management)** — plus a non-tab **📄 Activity Detail** page. Activities are fetched from a public test API and mapped into a unified activity model; enrollments are persisted locally with `uni.setStorageSync`. The project demonstrates custom components (`props` / `emit` / `slot` / easycom), composables, global theme and enrollment state, network request handling with loading and error states, pull-down refresh, category filtering, and light/dark theme switching with color persistence.

The fictional setting is **Valencia University**. This is a virtual university in a virtual lore, whose flagship disciplines include Linguistics, **Irelav** Language and Literature, Foreign Languages and Literature, History, Philosophy, Translation Studies, and Journalism & Communication.

---

## ✨ Features

| Category | Features |
| :--- | :--- |
| 🧭 **Navigation** | Two TabBar pages (Home / Mine) + one non-tab Detail page |
| 📡 **Network** | `uni.request` to `https://jsonplaceholder.typicode.com/posts`, `async/await` + `try/catch`, `isLoading`, error message with retry button |
| 🔄 **Refresh** | Pull-down refresh (`onPullDownRefresh` + `uni.stopPullDownRefresh`) |
| 🗂️ **Filtering** | Four category tabs (All / Lecture / Sports & Culture / Volunteer) with `computed` filtering |
| 🃏 **Card Component** | `ActivityCard` with `props` (`activity` / `showEnrollStatus` / `enrolled`), `emit('click')`, default `slot` |
| 🔘 **Button Component** | `EnrollButton` with `props` (`activityId` / `enrolled` / `disabled`), `emit('toggle')` |
| 🧠 **Composables** | `useTheme` (light/dark + color schemes, persisted), `useEnroll` (enroll / cancel / clear / query, persisted, single source of truth) |
| 🎨 **Theme** | Light/dark switching, global `themeColor` binding; dark mode uses a lighter red (`#E5484D`), light mode uses `#A51515` |
| 📝 **Detail Page** | Full description, contact host (`uni.makePhoneCall` with confirmation), copy info (`uni.setClipboardData`), back to home (`uni.switchTab`), odd-id activities marked as ended and disabled |
| 📊 **Mine Page** | Enrolled list with slot-based cancel button (`uni.showModal` confirmation), total and per-category counts via `computed`, theme switch, clear all enrollments, empty state |
| 🧩 **Empty States** | Empty list, error state, and no-enrollment state all handled with `v-if` |
| 💾 **Persistence** | `theme_mode`, `enrolled_ids`, `activity_cache` stored via `uni.setStorageSync` |

---

## 📁 Project Structure

```
project-root/
├── pages/
│   ├── index/index.vue        # Home: activity list, category filter, refresh, states
│   ├── mine/mine.vue          # Mine: enrolled list, stats, theme switch, clear
│   └── detail/detail.vue      # Detail: full info, enroll, contact, copy, back
├── components/
│   ├── ActivityCard/ActivityCard.vue
│   └── EnrollButton/EnrollButton.vue
├── composables/
│   ├── useTheme.js
│   └── useEnroll.js
├── static/
│   └── tabbar/
│       ├── home.png
│       ├── home-active.png
│       ├── mine.png
│       └── mine-active.png
├── pages.json
├── App.vue
└── main.js
```

---

## 🚀 Run Steps

1. 📥 Import the project into HBuilderX (Vue 3 / Vite template).
2. 🖼️ Make sure four TabBar icons exist under `static/tabbar/`: `home.png`, `home-active.png`, `mine.png`, `mine-active.png` (81×81 PNG, transparent background).
3. ▶️ Run to WeChat DevTools or H5:
   - **WeChat Mini Program**: Run → Run to Mini Program Simulator. If the API is blocked by domain whitelist, enable “Do not verify legal domain names” in DevTools settings for local testing.
   - **H5**: Run → Run to Browser.
4. ✅ On first launch, the Home page requests activities and writes `activity_cache`. Open a card to view the detail page, enroll, and check the Mine tab.

---

## 👩‍💻 For Developers

### 📦 Repository

Source code: `https://github.com/cgy22/learn-vue/tree/main/campus-activity-and-enrollment-platform`

The project is a sub-directory of the `learn-vue` repository. Clone the whole repository and open the `campus-activity-and-enrollment-platform` folder in HBuilderX.

```bash
git clone https://github.com/cgy22/learn-vue.git
cd learn-vue/campus-activity-and-enrollment-platform
```

### 🛠️ How to modify activity content

Activity titles and descriptions are **not** taken directly from the API. They come from the local `ACTIVITY_CONTENT` map in `pages/index/index.vue`, keyed by activity `id`:

```javascript
const ACTIVITY_CONTENT = {
  1: { title: '...', description: '...', category: '讲座', contact: '538200138000' },
  2: { title: '...', description: '...', category: '文体', contact: '548600138001' },
  // ...
}
```

- To edit an activity, change the corresponding entry.
- To add one, append a new `id` entry. Unconfigured IDs are skipped (or fall back, depending on your mapping).
- `category` must be one of `讲座` / `文体` / `志愿`, otherwise category filtering will not match.
- After editing, refresh the Home page so `activity_cache` is rewritten; the Detail and Mine pages read from that cache.

### 🖼️ How to replace TabBar icons

Put four 81×81 transparent PNGs into `static/tabbar/`:

```
static/tabbar/home.png
static/tabbar/home-active.png
static/tabbar/mine.png
static/tabbar/mine-active.png
```

`pages.json` maps `iconPath` to the normal state and `selectedIconPath` to the active state. Keep the file names unchanged to avoid editing `pages.json`.

### 🎨 How to change theme colors

- Light primary: `LIGHT_PRIMARY` in `composables/useTheme.js`.
- Dark primary: `DARK_PRIMARY` in the same file.
- If you change `DARK_PRIMARY`, also update `themeColorLight` (rgba) and `themeColorRgb` accordingly.

### 🚀 Build & Release (WeChat Mini Program)

1. In HBuilderX: **发行 → 小程序-微信**, which generates the Mini Program build.
2. Open the generated `dist/dev/mp-weixin` (or `dist/build/mp-weixin`) folder in WeChat DevTools.
3. Fill in your AppID, check the project, then **上传** to the WeChat platform for review and release.
4. The API domain `jsonplaceholder.typicode.com` must be added to the request domain whitelist in the Mini Program admin console before release; for local debugging, enable “Do not verify legal domain names”.

---

## 🧩 Custom Components

### 🃏 `ActivityCard`

| Prop | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `activity` | Object | ✅ | Activity object (`id`, `title`, `description`, `category`, `publishTime`, `contact`) |
| `showEnrollStatus` | Boolean | ❌ | Whether to show enrollment status (default `false`) |
| `enrolled` | Boolean | ❌ | Whether currently enrolled (effective only when `showEnrollStatus` is `true`) |
| `dark` | Boolean | ❌ | Optional theme override; takes precedence over `inject('isDark')` |
| `theme` | String | ❌ | Optional primary color override; takes precedence over `inject('themeColor')` |

| Event | Payload | Description |
| :--- | :--- | :--- |
| `click` | `activity` | Fired when the card is tapped; parent navigates to detail |

**🧷 Slot**: default slot at the bottom of the card, used by the Mine page to place a “Cancel enrollment” button. The slot wrapper uses `@click.stop` so tapping the button does not trigger the card click.

### 🔘 `EnrollButton`

| Prop | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `activityId` | Number / String | ✅ | Activity ID |
| `enrolled` | Boolean | ✅ | Whether currently enrolled |
| `disabled` | Boolean | ❌ | Disable the button (e.g. activity ended) |
| `dark` | Boolean | ❌ | Optional theme override |
| `theme` | String | ❌ | Optional primary color override |

| Event | Payload | Description |
| :--- | :--- | :--- |
| `toggle` | `{ activityId, enrolled }` | Fired on tap; parent performs enroll / cancel |

When `disabled` is `true`, the button shows “Activity ended”, is greyed out, and does not emit `toggle`.

---

## 🧠 Composables

### 🎨 `useTheme`

- Manages `isDark` (light/dark) and `themeColor` (light: `#A51515`, dark: `#E5484D`).
- Persists `theme_mode` to local storage.
- Synchronizes native TabBar style via `uni.setTabBarStyle` only on TabBar pages, with promise rejection handled.
- Exposes `themeColor`, `themeColorLight`, `themeColorRgb`, `toggleTheme`, `setTheme`, `initTheme`.

### 📝 `useEnroll`

- Manages `enrolledIds` as a module-level singleton `ref`, shared across pages.
- Persists `enrolled_ids` to local storage.
- Normalizes IDs with `Number()` so `onLoad(options.id)` string IDs match.
- Exposes `isEnrolled`, `enroll`, `cancelEnroll`, `clearAll`, `initEnroll`.
- Array replacement (`[...]`, `filter`) ensures Vue 3 reactivity updates every consumer immediately.

---

## 📡 Network Request & Data Mapping

- 🌐 API: `https://jsonplaceholder.typicode.com/posts`
- ⚙️ Request pattern: `async/await` + `try/catch`, `isLoading` toggled in `finally`.
- 🧾 `res.statusCode` and the level of `res.data` are logged to the console for verification.
- 🗺️ Mapping: each item is mapped to `{ id, title, description, category, publishTime, contact }`.
  - `category` is derived from `id % 3` (`Lecture` / `Sports & Culture` / `Volunteer`).
  - `contact` uses long numeric phone numbers (e.g. `538200138000`).
  - Content is taken from a local `ACTIVITY_CONTENT` map keyed by `id`, so each activity’s title and description can be edited individually.
- 💾 On success, the mapped list is written to `activity_cache` for the Detail and Mine pages.
- ⚠️ On failure, an error message and a retry button are shown.

---

## 🛠️ Problems & Solutions

1. **🎨 `ActivityCard` did not follow the dark theme.**
   Cause: the component resolved the theme via `inject`, but the page never `provide`d it, so the dark class was never applied.
   Solution: pages now `provide('isDark', isDark)` and `provide('themeColor', themeColor)`; the component additionally accepts `dark` / `theme` props which take precedence over `inject`, removing reliance on injection timing.

2. **💥 `Cannot set properties of null (setting 'scrollTop')` on H5.**
   Cause: a vertical `<scroll-view>` inside a `KeepAlive` page tried to write `scrollTop` during the `activated` hook when the inner DOM was not ready.
   Solution: the vertical list was changed to a plain `<view>` with page-level scrolling; `scroll-view` is kept only for the horizontal category bar (`scroll-x`), which does not trigger this error.

3. **⚠️ `setTabBarStyle:fail not TabBar page`.**
   Cause: `uni.setTabBarStyle` was called on a non-TabBar page (Detail), and the API rejects asynchronously, so `try/catch` did not catch it.
   Solution: `syncTabBar()` now checks `getCurrentPages()` and only runs on TabBar pages, and attaches `.catch()` to the returned promise.

4. **📊 Mine page showed 0 after enrolling.**
   Cause: the enrolled list depended on `activity_cache`, which could be empty when Mine rendered, filtering out all IDs.
   Solution: the Home page writes `activity_cache` after a successful request; the Mine page computes the enrolled list directly from `enrolledIds` and falls back to a minimal object when cache is missing, so entries appear immediately.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## ©️ Copyright

Copyright © 2026. All Rights Reserved.

---

🍹 A toast with Prickly Pear juice!

---

# 🎓 校园活动信息与报名平台

---

## 📖 项目简介

**校园活动信息与报名平台** 是一个基于 uni-app、可在微信小程序（及 H5）运行的项目。采用两个 TabBar 页面 —— **🏠 首页（活动列表）** 与 **👤 我的（报名管理）** —— 外加一个非 Tab 的 **📄 活动详情页**。活动列表通过公共测试 API 获取并映射为统一的活动对象；报名记录使用 `uni.setStorageSync` 本地持久化。项目综合演示了自定义组件（`props` / `emit` / `slot` / easycom）、组合式函数、全局主题与报名状态、带加载与错误状态的网络请求、下拉刷新、分类筛选，以及明暗主题切换与颜色持久化。

故事背景设定为 **瓦莱希雅大学（Valencia University）**。这是一个虚拟世界观中的虚拟大学，其王牌专业包括语言学、**𣿅语（Irelav）** 语言文学、外国语言文学、历史学、哲学、翻译学、新闻传播学。

---

## ✨ 功能清单

| 类别 | 功能 |
| :--- | :--- |
| 🧭 **页面结构** | 两个 TabBar 页面（首页 / 我的）+ 一个非 Tab 详情页 |
| 📡 **网络请求** | `uni.request` 请求 `https://jsonplaceholder.typicode.com/posts`，`async/await` + `try/catch`，`isLoading`，错误提示与重试按钮 |
| 🔄 **刷新** | 下拉刷新（`onPullDownRefresh` + `uni.stopPullDownRefresh`） |
| 🗂️ **分类筛选** | 四个分类 Tab（全部 / 讲座 / 文体 / 志愿），`computed` 过滤 |
| 🃏 **卡片组件** | `ActivityCard`：`props`（`activity` / `showEnrollStatus` / `enrolled`）、`emit('click')`、默认 `slot` |
| 🔘 **按钮组件** | `EnrollButton`：`props`（`activityId` / `enrolled` / `disabled`）、`emit('toggle')` |
| 🧠 **组合式函数** | `useTheme`（明暗 + 色板，持久化）、`useEnroll`（报名 / 取消 / 清空 / 查询，持久化，单一数据源） |
| 🎨 **主题** | 明暗切换，全局 `themeColor` 绑定；暗黑用浅红 `#E5484D`，明亮用 `#A51515` |
| 📝 **详情页** | 完整描述、联系主办方（`uni.makePhoneCall`，先确认）、复制信息（`uni.setClipboardData`）、返回首页（`uni.switchTab`）、奇数 id 活动标记为已结束并禁用报名 |
| 📊 **我的页** | 已报名列表 + slot 取消按钮（`uni.showModal` 二次确认）、总数与分类统计（`computed`）、主题切换、清空报名、空状态 |
| 🧩 **空状态** | 空列表、错误、未报名三种状态均用 `v-if` 处理 |
| 💾 **持久化** | `theme_mode`、`enrolled_ids`、`activity_cache` 通过 `uni.setStorageSync` 存储 |

---

## 📁 目录结构

```
项目根目录/
├── pages/
│   ├── index/index.vue        # 首页：活动列表、分类筛选、刷新、状态
│   ├── mine/mine.vue          # 我的：已报名列表、统计、主题切换、清空
│   └── detail/detail.vue      # 详情：完整信息、报名、联系、复制、返回
├── components/
│   ├── ActivityCard/ActivityCard.vue
│   └── EnrollButton/EnrollButton.vue
├── composables/
│   ├── useTheme.js
│   └── useEnroll.js
├── static/
│   └── tabbar/
│       ├── home.png
│       ├── home-active.png
│       ├── mine.png
│       └── mine-active.png
├── pages.json
├── App.vue
└── main.js
```

---

## 🚀 运行步骤

1. 📥 用 HBuilderX 导入项目（Vue 3 / Vite 模板）。
2. 🖼️ 确认 `static/tabbar/` 下存在四个 TabBar 图标：`home.png`、`home-active.png`、`mine.png`、`mine-active.png`（81×81 PNG，透明背景）。
3. ▶️ 运行到微信开发者工具或 H5：
   - **微信小程序**：运行 → 运行到小程序模拟器。若 API 域名未在白名单，在开发者工具设置中勾选「不校验合法域名」用于本地调试。
   - **H5**：运行 → 运行到浏览器。
4. ✅ 首次启动时首页请求活动并写入 `activity_cache`。点击卡片进入详情页，报名后到「我的」页查看。

---

## 👩‍💻 开发者说明

### 📦 仓库位置

源码地址：`https://github.com/cgy22/learn-vue/tree/main/campus-activity-and-enrollment-platform`

项目是 `learn-vue` 仓库下的子目录。克隆整个仓库后，在 HBuilderX 中打开 `campus-activity-and-enrollment-platform` 文件夹即可。

```bash
git clone https://github.com/cgy22/learn-vue.git
cd learn-vue/campus-activity-and-enrollment-platform
```

### 🛠️ 如何修改活动内容

活动的标题与描述**不是**直接取自 API，而是来自 `pages/index/index.vue` 中的本地 `ACTIVITY_CONTENT` 映射表，按活动 `id` 键取值：

```javascript
const ACTIVITY_CONTENT = {
  1: { title: '...', description: '...', category: '讲座', contact: '538200138000' },
  2: { title: '...', description: '...', category: '文体', contact: '548600138001' },
  // ...
}
```

- 改某条活动：直接改对应条目。
- 新增活动：追加新的 `id` 条目；未配置的 id 会被跳过（或走兜底，取决于映射写法）。
- `category` 必须是 `讲座` / `文体` / `志愿` 之一，否则分类筛选匹配不到。
- 改完后刷新首页，让 `activity_cache` 重写；详情页与「我的」页从该缓存读取。

### 🖼️ 如何替换 TabBar 图标

把四张 81×81 透明 PNG 放进 `static/tabbar/`：

```
static/tabbar/home.png
static/tabbar/home-active.png
static/tabbar/mine.png
static/tabbar/mine-active.png
```

`pages.json` 中 `iconPath` 对应普通态，`selectedIconPath` 对应激活态。保持文件名不变即可，无需改 `pages.json`。

### 🎨 如何修改主题色

- 明亮主色：`composables/useTheme.js` 中的 `LIGHT_PRIMARY`。
- 暗黑主色：同文件中的 `DARK_PRIMARY`。
- 若改 `DARK_PRIMARY`，需同步更新 `themeColorLight`（rgba）与 `themeColorRgb`。

### 🚀 构建与发布（微信小程序）

1. HBuilderX 中：**发行 → 小程序-微信**，生成小程序构建产物。
2. 用微信开发者工具打开生成的 `dist/dev/mp-weixin`（或 `dist/build/mp-weixin`）目录。
3. 填入自己的 AppID，检查项目后点击 **上传**，到微信平台提交审核发布。
4. 发布前需在微信公众平台后台把 `jsonplaceholder.typicode.com` 加入 request 合法域名；本地调试可勾选「不校验合法域名」。

---

## 🧩 自定义组件说明

### 🃏 `ActivityCard`

| 属性 | 类型 | 必填 | 说明 |
| :--- | :--- | :---: | :--- |
| `activity` | Object | ✅ | 活动对象（`id`、`title`、`description`、`category`、`publishTime`、`contact`） |
| `showEnrollStatus` | Boolean | ❌ | 是否显示报名状态（默认 `false`） |
| `enrolled` | Boolean | ❌ | 是否已报名（仅当 `showEnrollStatus` 为 `true` 时生效） |
| `dark` | Boolean | ❌ | 可选主题覆盖，优先于 `inject('isDark')` |
| `theme` | String | ❌ | 可选主色覆盖，优先于 `inject('themeColor')` |

| 事件 | 参数 | 说明 |
| :--- | :--- | :--- |
| `click` | `activity` | 点击卡片时触发，父组件跳转详情 |

**🧷 插槽**：默认插槽位于卡片底部，供「我的」页放置「取消报名」按钮。插槽外层使用 `@click.stop`，点按钮不会触发卡片跳转。

### 🔘 `EnrollButton`

| 属性 | 类型 | 必填 | 说明 |
| :--- | :--- | :---: | :--- |
| `activityId` | Number / String | ✅ | 活动 ID |
| `enrolled` | Boolean | ✅ | 是否已报名 |
| `disabled` | Boolean | ❌ | 是否禁用（如活动已结束） |
| `dark` | Boolean | ❌ | 可选主题覆盖 |
| `theme` | String | ❌ | 可选主色覆盖 |

| 事件 | 参数 | 说明 |
| :--- | :--- | :--- |
| `toggle` | `{ activityId, enrolled }` | 点击时触发，父组件执行报名 / 取消报名 |

当 `disabled` 为 `true` 时，按钮显示「活动已结束」，置灰且不触发 `toggle`。

---

## 🧠 组合式函数说明

### 🎨 `useTheme`

- 管理 `isDark`（明暗）与 `themeColor`（明亮 `#A51515`、暗黑 `#E5484D`）。
- 持久化 `theme_mode` 到本地存储。
- 仅在 TabBar 页面通过 `uni.setTabBarStyle` 同步原生 TabBar 样式，并处理 Promise 拒绝。
- 对外暴露 `themeColor`、`themeColorLight`、`themeColorRgb`、`toggleTheme`、`setTheme`、`initTheme`。

### 📝 `useEnroll`

- 以模块级单例 `ref` 管理 `enrolledIds`，各页面共享同一份状态。
- 持久化 `enrolled_ids` 到本地存储。
- 统一用 `Number()` 归一 id，确保 `onLoad(options.id)` 的字符串 id 能正确匹配。
- 对外暴露 `isEnrolled`、`enroll`、`cancelEnroll`、`clearAll`、`initEnroll`。
- 通过数组替换（`[...]`、`filter`）保证 Vue 3 响应式在所有消费处立即更新。

---

## 📡 网络请求与数据映射

- 🌐 API：`https://jsonplaceholder.typicode.com/posts`
- ⚙️ 请求方式：`async/await` + `try/catch`，`isLoading` 在 `finally` 中复位。
- 🧾 控制台打印 `res.statusCode` 与 `res.data` 层级，便于确认解析正确。
- 🗺️ 映射为 `{ id, title, description, category, publishTime, contact }`：
  - `category` 由 `id % 3` 得到（讲座 / 文体 / 志愿）。
  - `contact` 使用长数字电话（如 `538200138000`）。
  - 标题与描述取自本地 `ACTIVITY_CONTENT` 映射表（按 `id` 键），每条可单独编辑。
- 💾 请求成功后把映射列表写入 `activity_cache`，供详情页与「我的」页读取。
- ⚠️ 请求失败显示错误提示与重试按钮。

---

## 🛠️ 遇到的问题与解决方式

1. **🎨 `ActivityCard` 不跟随暗黑主题。**
   原因：组件通过 `inject` 取主题，但页面从未 `provide`，暗黑 class 永远不加。
   解决：页面 `provide('isDark', isDark)` 与 `provide('themeColor', themeColor)`；组件同时接受 `dark` / `theme` 两个 props，优先级高于 `inject`，不再依赖注入时机。

2. **💥 H5 下报 `Cannot set properties of null (setting 'scrollTop')`。**
   原因：`KeepAlive` 页面内的纵向 `<scroll-view>` 在 `activated` 钩子触发时内部 DOM 尚未就绪，仍尝试写 `scrollTop`。
   解决：纵向列表改为普通 `<view>` + 页面级滚动；`scroll-view` 仅保留横向分类条（`scroll-x`），不触发该错误。

3. **⚠️ `setTabBarStyle:fail not TabBar page`。**
   原因：在非 TabBar 页（详情页）调用 `uni.setTabBarStyle`，该 API 异步 reject，`try/catch` 捕获不到。
   解决：`syncTabBar()` 先通过 `getCurrentPages()` 判断是否 TabBar 页，仅在这些页面执行，并给返回的 Promise 加 `.catch()`。

4. **📊 报名后「我的」页仍显示 0。**
   原因：已报名列表依赖 `activity_cache`，渲染时缓存可能为空，导致所有 id 被过滤掉。
   解决：首页请求成功后写入 `activity_cache`；「我的」页直接由 `enrolledIds` 计算列表，缓存缺失时用最小兜底对象，保证报名后立即显示。

---

## 📜 许可证

本项目采用 **MIT 许可证**。

---

## ©️ 版权

Copyright © 2026. All Rights Reserved.

---

🍹 敬上一杯刺梨汁！
