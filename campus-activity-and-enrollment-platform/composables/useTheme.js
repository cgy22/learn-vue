// composables/useTheme.js
import { ref, computed } from 'vue'

export const COLOR_PALETTE = [
  { name: '𣿅国绿', value: '#16DA49' },
  { name: '大江蓝', value: '#6499FF' },
  { name: '秋茗红', value: '#A51515' },
  { name: '铁山青', value: '#349DA5' },
  { name: '凤凰金', value: '#FFB500' },
  { name: '兰花紫', value: '#DA70D6' },
  { name: '梨花粉', value: '#FF69B4' },
  { name: '深蓝色', value: '#0078d4' }
]

// ★ 明亮模式固定主色（颜色切换已移除，不再从 storage 读 theme_color）
const LIGHT_PRIMARY = '#A51515'
// ★ 暗黑模式浅红
const DARK_PRIMARY = '#c75252'

const isDark = ref(false)
// primaryColor 保留导出以免其他引用报错，但不再参与 themeColor 计算
const primaryColor = ref(LIGHT_PRIMARY)
let inited = false

function hexToRgbStr(hex) {
  const h = String(hex).replace('#', '')
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  const r = parseInt(full.substring(0, 2), 16)
  const g = parseInt(full.substring(2, 4), 16)
  const b = parseInt(full.substring(4, 6), 16)
  return `${r}, ${g}, ${b}`
}

// ★ 全局主题色：明亮固定 #A51515，暗黑固定 #E5484D
const themeColor = computed(() => (isDark.value ? DARK_PRIMARY : LIGHT_PRIMARY))
const themeColorLight = computed(() =>
  isDark.value ? 'rgba(229,72,77,0.15)' : 'rgba(165,21,21,0.10)'
)
const themeColorRgb = computed(() =>
  isDark.value ? '229, 72, 77' : hexToRgbStr(LIGHT_PRIMARY)
)

function isTabBarPage() {
  try {
    const pages = getCurrentPages()
    if (!pages || pages.length === 0) return false
    const cur = pages[pages.length - 1]
    const route = cur && (cur.route || cur.__route__ || '')
    return route === 'pages/index/index' || route === 'pages/mine/mine'
  } catch (e) {
    return false
  }
}

function syncTabBar() {
  if (!isTabBarPage()) return
  try {
    const p = uni.setTabBarStyle({
      color: isDark.value ? '#bbbbbb' : '#6B7A88',
      selectedColor: themeColor.value,
      backgroundColor: isDark.value ? '#1a1a1a' : '#ffffff',
      borderStyle: isDark.value ? 'white' : 'black'
    })
    if (p && typeof p.catch === 'function') p.catch(() => {})
  } catch (e) {}
}

export const useTheme = () => {
  const initTheme = () => {
    if (inited) return
    inited = true
    try {
      const mode = uni.getStorageSync('theme_mode')
      isDark.value = mode === 'dark'
      // 不再读取 theme_color，避免历史残留蓝色污染浅色主题
      primaryColor.value = LIGHT_PRIMARY
    } catch (e) {
      isDark.value = false
      primaryColor.value = LIGHT_PRIMARY
    }
    syncTabBar()
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    try { uni.setStorageSync('theme_mode', isDark.value ? 'dark' : 'light') } catch (e) {}
    syncTabBar()
  }

  const setTheme = (dark) => {
    isDark.value = !!dark
    try { uni.setStorageSync('theme_mode', isDark.value ? 'dark' : 'light') } catch (e) {}
    syncTabBar()
  }

  // 保留接口但无实际切换作用（颜色切换 UI 已移除）
  const setPrimaryColor = (_color) => {
    primaryColor.value = LIGHT_PRIMARY
    syncTabBar()
  }

  return {
    isDark,
    primaryColor,
    themeColor,
    themeColorLight,
    themeColorRgb,
    COLOR_PALETTE,
    initTheme,
    toggleTheme,
    setTheme,
    setPrimaryColor
  }
}