// composables/useTheme.js
// ⚠️ isDark 写在模块作用域（函数外面），
//    所以整个 App 里所有组件拿到的都是【同一个 ref】
import { ref, watch } from 'vue'
 
// ---------- 常量：key 只写一次，避免拼错 ----------
const STORAGE_KEY = 'app-theme'
 
// ---------- 模块级状态：全局唯一 ----------
const isDark = ref(false) 
// ---------- 落盘：用同步写法（数据极小，只写一次） ----------
function persist(val) {
  try {
    uni.setStorageSync(STORAGE_KEY, val ? 'dark' : 'light')
  } catch (e) {
    console.warn('[useTheme] 写入存储失败：', e)
  }
} 
function toggleTheme() {
  isDark.value = !isDark.value
  persist(isDark.value)
  return isDark.value
}
// ---------- 从 Storage 恢复（App 启动时调一次） ----------
function initTheme() {
  try {
    const saved = uni.getStorageSync(STORAGE_KEY)
    // ⚠️ 读不到时是空字符串 ''，不是 null，也不是 undefined
    if (saved === 'dark' || saved === 'light') {
      isDark.value = saved === 'dark'
    }
    // 读不到就保持默认浅色，不写库 —— 避免无意义的写入
  } catch (e) {
    console.warn('[useTheme] 读取存储失败：', e)
  }
  return isDark.value
}
 
// 主题一变就同步到 H5 根节点
watch(isDark, () => { applyTheme() })
 
// ---------- 对外暴露 ----------
export function useTheme() {
  return { isDark, toggleTheme, setTheme, initTheme }
}
