// composables/useEnroll.js
// 报名记录管理：增 / 删 / 查 / 清空，模块级单例 ref，持久化到 enrolled_ids
import { ref } from 'vue'

// ==================== 模块级单例状态 ====================
const enrolledIds = ref([])   // 已报名的活动 id 数组
let inited = false

export const useEnroll = () => {
  // ==================== 初始化（App.vue onLaunch 调用一次） ====================
  const initEnroll = () => {
    if (inited) return
    inited = true
    try {
      const saved = uni.getStorageSync('enrolled_ids')
      if (Array.isArray(saved)) {
        // 统一转 Number，避免 onLoad options.id 是字符串导致 includes 失效
        enrolledIds.value = saved.map(i => Number(i))
      } else {
        enrolledIds.value = []
      }
    } catch (e) {
      console.error('[useEnroll] 读取报名记录失败：', e)
      enrolledIds.value = []
    }
    console.log('[useEnroll] init =>', enrolledIds.value)
  }

  // ==================== 是否已报名 ====================
  const isEnrolled = (id) => {
    return enrolledIds.value.includes(Number(id))
  }

  // ==================== 报名 ====================
  const enroll = (id) => {
    const nid = Number(id)
    if (Number.isNaN(nid)) return false
    if (!isEnrolled(nid)) {
      enrolledIds.value.push(nid)
      persist()
      return true
    }
    return false
  }

  // ==================== 取消报名 ====================
  const cancelEnroll = (id) => {
    const nid = Number(id)
    const before = enrolledIds.value.length
    enrolledIds.value = enrolledIds.value.filter(i => i !== nid)
    if (enrolledIds.value.length !== before) {
      persist()
      return true
    }
    return false
  }

  // ==================== 清空全部 ====================
  const clearAll = () => {
    enrolledIds.value = []
    persist()
  }

  // ==================== 持久化 ====================
  const persist = () => {
    try {
      uni.setStorageSync('enrolled_ids', enrolledIds.value)
    } catch (e) {
      console.error('[useEnroll] 写入报名记录失败：', e)
    }
  }

  // ==================== 已报名数量 ====================
  const enrolledCount = () => enrolledIds.value.length

  return {
    enrolledIds,
    initEnroll,
    isEnrolled,
    enroll,
    cancelEnroll,
    clearAll,
    enrolledCount
  }
}