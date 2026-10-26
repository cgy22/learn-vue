<template>
  <view class="page" :class="{ 'theme-dark': isDark }">

    <scroll-view scroll-y class="scroll">
      <view class="scroll-inner">

        <view class="stat-card">
          <view class="stat-main">
            <text class="stat-num" :style="{ color: themeColor }">{{ enrolledList.length }}</text>
            <text class="stat-label">已报名活动</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-sub">
            <view class="sub-item">
              <text class="sub-num">{{ countByCat('讲座') }}</text>
              <text class="sub-label">讲座</text>
            </view>
            <view class="sub-item">
              <text class="sub-num">{{ countByCat('文体') }}</text>
              <text class="sub-label">文体</text>
            </view>
            <view class="sub-item">
              <text class="sub-num">{{ countByCat('志愿') }}</text>
              <text class="sub-label">志愿</text>
            </view>
          </view>
        </view>

        <view class="theme-card">
          <view class="theme-row">
            <view class="theme-left">
              <text class="theme-icon">{{ isDark ? '🌙' : '☀️' }}</text>
              <text class="theme-label">{{ isDark ? '暗黑模式' : '明亮模式' }}</text>
            </view>
            <view
              class="switch-track"
              :class="{ on: isDark }"
              :style="isDark ? { backgroundColor: themeColor } : {}"
              @click="toggleTheme"
            >
              <view class="switch-thumb" :class="{ on: isDark }"></view>
            </view>
          </view>
        </view>

        <view v-if="enrolledList.length > 0" class="list-block">
          <text
            class="section-title"
            :style="{ color: themeColor, borderLeftColor: themeColor }"
          >我的报名</text>
          <ActivityCard
            v-for="item in enrolledList"
            :key="item.id"
            :activity="item"
            :show-enroll-status="true"
            :enrolled="true"
            :dark="isDark"
            :theme="themeColor"
            @click="goToDetail"
          >
            <view class="cancel-btn" @click.stop="confirmCancel(item)">
              <text class="cancel-text">取消报名</text>
            </view>
          </ActivityCard>
            

          <view class="clear-btn" @click="confirmClearAll">
            <text class="clear-text">清空报名记录</text>
          </view>
        </view>

        <view v-else class="empty">
          <text class="empty-icon">📝</text>
          <text class="empty-text">你还没有报名任何活动</text>
          <view class="go-btn" :style="{ backgroundColor: themeColor }" @click="goHome">
            <text>去首页看看</text>
          </view>
        </view>

        <view class="footer-info">
          <!-- #ifdef H5 --><text class="footer-text">当前运行环境：浏览器 H5</text><!-- #endif -->
          <!-- #ifdef MP-WEIXIN --><text class="footer-text">当前运行环境：微信小程序</text><!-- #endif -->
          <!-- #ifdef APP-PLUS --><text class="footer-text">当前运行环境：手机 App</text><!-- #endif -->
          <text class="footer-version">瓦莱希雅大学活动平台 v1.0.0</text>
        </view>

      </view>
    </scroll-view>

  </view>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import { onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { useTheme } from '@/composables/useTheme.js'
import { useEnroll } from '@/composables/useEnroll.js'

const { isDark, themeColor, toggleTheme, initTheme } = useTheme()
initTheme()
provide('isDark', isDark)
provide('themeColor', themeColor)


const { enrolledIds, initEnroll, cancelEnroll, clearAll } = useEnroll()
initEnroll()

const activityCache = ref([])

const enrolledList = computed(() => {
  if (!enrolledIds.value || enrolledIds.value.length === 0) return []
  const cats = ['讲座', '文体', '志愿']
  const phones = ['538200138000', '548600138001', '638080138002', '513800138003']
  return enrolledIds.value.map(id => {
    const nid = Number(id)
    const hit = activityCache.value.find(a => Number(a.id) === nid)
    if (hit) return hit
    return {
      id: nid,
      title: `活动 #${nid}`,
      description: '活动详情缓存缺失，可返回首页刷新后查看完整描述。',
      category: cats[nid % 3],
      publishTime: Date.now() - nid * 86400000,
      contact: phones[nid % phones.length]
    }
  })
})

const countByCat = (cat) => enrolledList.value.filter(a => a.category === cat).length

onShow(() => { loadCache() })

onPullDownRefresh(() => {
  setTimeout(() => {
    loadCache()
    uni.stopPullDownRefresh()
    uni.showToast({ title: '已刷新', icon: 'none' })
  }, 400)
})

const loadCache = () => {
  try {
    const cache = uni.getStorageSync('activity_cache') || []
    activityCache.value = Array.isArray(cache) ? cache : []
  } catch (e) {
    activityCache.value = []
  }
}

const confirmCancel = (activity) => {
  if (!activity) return
  uni.showModal({
    title: '取消报名',
    content: `确定要取消报名《${activity.title}》吗？`,
    success: (res) => {
      if (!res.confirm) return
      cancelEnroll(activity.id)
      uni.showToast({ title: '已取消报名', icon: 'none' })
    }
  })
}

const confirmClearAll = () => {
  uni.showModal({
    title: '清空报名记录',
    content: '将移除全部报名记录，此操作不可撤销。确定吗？',
    success: (res) => {
      if (!res.confirm) return
      clearAll()
      uni.showToast({ title: '已清空', icon: 'success' })
    }
  })
}

const goToDetail = (activity) => {
  if (!activity || !activity.id) return
  uni.navigateTo({ url: '/pages/detail/detail?id=' + activity.id })
}

const goHome = () => { uni.switchTab({ url: '/pages/index/index' }) }
</script>

<style scoped>
.page {
  min-height: 100vh; background: #FDF2F2; color: #323130;
  display: flex; flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans SC',
               'Helvetica Neue', Arial, sans-serif;
}
.scroll { flex: 1; height: calc(100vh - 50px); }
.scroll-inner { padding: 30rpx; box-sizing: border-box; }

.stat-card {
  background: #fff; border-radius: 6px; border: 2rpx solid transparent;
  padding: 30rpx; margin-bottom: 24rpx;
  box-shadow: 0 1.6px 3.6px 0 rgba(0,0,0,0.1), 0 0.3px 0.9px 0 rgba(0,0,0,0.1);
}
.stat-main { display: flex; flex-direction: column; align-items: center; padding-bottom: 24rpx; }
.stat-num { font-size: 64rpx; font-weight: 800; line-height: 1; }
.stat-label { margin-top: 10rpx; font-size: 26rpx; color: #6B7A88; }
.stat-divider { height: 2rpx; background: #edebe9; margin: 0 0 24rpx; }
.stat-sub { display: flex; }
.sub-item { flex: 1; display: flex; flex-direction: column; align-items: center; }
.sub-num { font-size: 36rpx; font-weight: 700; color: #D9480F; }
.sub-label { margin-top: 6rpx; font-size: 24rpx; color: #6B7A88; }

.theme-card {
  background: #fff; border-radius: 6px; border: 2rpx solid transparent;
  padding: 24rpx 30rpx; margin-bottom: 24rpx;
  box-shadow: 0 1.6px 3.6px 0 rgba(0,0,0,0.1), 0 0.3px 0.9px 0 rgba(0,0,0,0.1);
}
.theme-row { display: flex; align-items: center; justify-content: space-between; }
.theme-left { display: flex; align-items: center; }
.theme-icon { font-size: 36rpx; margin-right: 16rpx; }
.theme-label { font-size: 28rpx; color: #323130; font-weight: 500; }
.switch-track {
  position: relative; width: 88rpx; height: 48rpx; border-radius: 24rpx;
  background: #edebe9; transition: background 0.4s cubic-bezier(0.05,0.7,0.1,1.0);
}
.switch-thumb {
  position: absolute; top: 4rpx; left: 4rpx; width: 40rpx; height: 40rpx;
  border-radius: 50%; background: #fff; box-shadow: 0 2rpx 4rpx rgba(0,0,0,0.2);
  transition: left 0.4s cubic-bezier(0.05,0.7,0.1,1.0);
}
.switch-thumb.on { left: 44rpx; }

.list-block { margin-bottom: 24rpx; }
.section-title {
  display: block; font-size: 30rpx; font-weight: 700;
  margin-bottom: 20rpx; padding-left: 16rpx; border-left: 6rpx solid transparent;
  line-height: 1.2;
}
.cancel-btn {
  height: 64rpx; display: flex; align-items: center; justify-content: center;
  background: #f3f2f1; border: 2rpx solid #edebe9; border-radius: 8px;
}
.cancel-btn:active { transform: scale(0.98); background: #f8f9fa; border-color: #D9480F; }
.cancel-text { font-size: 26rpx; color: #D9480F; font-weight: 600; }

.clear-btn {
  height: 88rpx; display: flex; align-items: center; justify-content: center;
  background: #fff; border: 2rpx solid #edebe9; border-radius: 8px; margin-top: 10rpx;
}
.clear-btn:active { transform: scale(0.98); background: #f8f9fa; border-color: #D9480F; }
.clear-text { font-size: 28rpx; color: #D9480F; font-weight: 600; }

.empty { padding: 100rpx 60rpx; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.empty-icon { font-size: 120rpx; opacity: 0.35; margin-bottom: 30rpx; }
.empty-text { font-size: 30rpx; color: #6B7A88; margin-bottom: 50rpx; }
.go-btn {
  padding: 0 60rpx; height: 80rpx; display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 28rpx; border-radius: 8px;
}
.go-btn:active { transform: scale(0.98); opacity: 0.9; }

.footer-info { display: flex; flex-direction: column; align-items: center; padding: 30rpx 0 40rpx; }
.footer-text { font-size: 24rpx; color: #6B7A88; margin-bottom: 10rpx; }
.footer-version { font-size: 22rpx; color: #a0a6ad; }

/* ==================== 暗黑基础 ==================== */
.theme-dark.page { background: #1a1a1a; color: #eeeeee; }
.theme-dark .stat-card,
.theme-dark .theme-card {
  background: #2a2a2a;
  box-shadow: 0 1.6px 3.6px 0 rgba(0,0,0,0.3), 0 0.3px 0.9px 0 rgba(0,0,0,0.3);
}
.theme-dark .stat-divider { background: #3b3a39; }
.theme-dark .stat-label, .theme-dark .sub-label { color: #bbbbbb; }
.theme-dark .sub-num { color: #FF8A5B; }
.theme-dark .theme-label { color: #eeeeee; }
.theme-dark .switch-track { background: #3b3a39; }
.theme-dark .cancel-btn { background: #2d2c2c; border-color: #3b3a39; }
.theme-dark .cancel-btn:active { background: #323130; border-color: #FF8A5B; }
.theme-dark .cancel-text { color: #FF8A5B; }
.theme-dark .clear-btn { background: #2a2a2a; border-color: #3b3a39; }
.theme-dark .clear-btn:active { background: #323130; border-color: #FF8A5B; }
.theme-dark .clear-text { color: #FF8A5B; }
.theme-dark .empty-text { color: #bbbbbb; }
.theme-dark .footer-text, .theme-dark .footer-version { color: #888888; }
</style>