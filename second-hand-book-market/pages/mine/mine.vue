<template>
  <view class="page">

    <scroll-view scroll-y class="scroll">

      <!-- ========== 名片头部 ========== -->
      <view class="profile">
        <image class="avatar" src="/static/mine/avatar.png" mode="aspectFill" />
        <text class="nickname">南波万</text>
        <text class="subtitle">瓦莱希雅大学 · 信息学院</text>
      </view>

      <!-- ========== 数据统计卡 ========== -->
      <view class="stat-card">
        <view class="stat-item">
          <text class="stat-num">{{ myBooksCount }}</text>
          <text class="stat-label">我发布的</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-num">{{ collectCount }}</text>
          <text class="stat-label">我收藏的</text>
        </view>
      </view>

      <!-- ========== 功能列表 ========== -->
      <view class="menu-card">

        <view class="menu-item" @click="showMyBooks">
          <text class="menu-icon">📚</text>
          <text class="menu-text">我发布的</text>
          <text class="menu-arrow">›</text>
        </view>

        <view class="menu-divider"></view>

        <view class="menu-item" @click="clearMyData">
          <text class="menu-icon">🗑️</text>
          <text class="menu-text danger">清空我的数据</text>
          <text class="menu-arrow">›</text>
        </view>

        <view class="menu-divider"></view>

        <view class="menu-item" @click="showAbout">
          <text class="menu-icon">ℹ️</text>
          <text class="menu-text">关于本 App</text>
          <text class="menu-arrow">›</text>
        </view>

      </view>

      <!-- ========== 底部平台信息（条件编译） ========== -->
      <view class="platform">
        <!-- #ifdef H5 -->
        <text class="platform-text">当前运行环境：浏览器 H5</text>
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->
        <text class="platform-text">当前运行环境：微信小程序</text>
        <!-- #endif -->
        <!-- #ifdef APP-PLUS -->
        <text class="platform-text">当前运行环境：手机 App</text>
        <!-- #endif -->
      </view>

      <!-- ========== 版本信息 ========== -->
      <view class="version">
        <text class="version-text">校园二手书市 v1.0.0</text>
      </view>

      <view class="bottom-placeholder"></view>

    </scroll-view>

  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'

/* ==================== 状态 ==================== */
const myBooks = ref([])
const collectIds = ref([])

/* ==================== 统计（computed 实时计算） ==================== */
const myBooksCount = computed(() => myBooks.value.length)
const collectCount = computed(() => collectIds.value.length)

/* ==================== 生命周期 ==================== */
onShow(() => {
  console.log('[mine] onShow')
  loadData()
})

/* ==================== 方法 ==================== */
function loadData() {
  myBooks.value = uni.getStorageSync('myBooks') || []
  collectIds.value = uni.getStorageSync('collectIds') || []
}

/** 我发布的 */
function showMyBooks() {
  const n = myBooks.value.length
  if (n === 0) {
    uni.showModal({
      title: '我发布的',
      content: '你还没有发布过书籍。点击底部「发布」开始吧～',
      showCancel: false
    })
  } else {
    const titles = myBooks.value.slice(0, 5).map(b => `· ${b.title}`).join('\n')
    const more = n > 5 ? `\n...等 ${n} 本` : ''
    uni.showModal({
      title: `我发布的 ${n} 本书`,
      content: titles + more,
      showCancel: false
    })
  }
}

/** 清空我的数据 —— 二次确认 */
function clearMyData() {
  uni.showModal({
    title: '清空我的数据',
    content: '将清空「我发布的」和「我的收藏」，此操作不可撤销。确定吗？',
    success: (res) => {
      // ★ 守门员
      if (!res.confirm) return

      uni.removeStorageSync('myBooks')
      uni.removeStorageSync('collectIds')
      myBooks.value = []
      collectIds.value = []

      uni.showToast({ title: '已清空', icon: 'success' })
    }
  })
}

/** 关于本 App */
function showAbout() {
  uni.showModal({
    title: '关于本 App',
    content: '校园二手书市 v1.0.0\n\n作者：cgy22\n\n一个用于校园二手教材流转的演示 App。',
    showCancel: false
  })
}
</script>

<style scoped>
/* ==================================================================
   设计语言来自 ui.css · 主色 #A51515
   注意：不用 CSS 变量，避免小程序端读不到
   ================================================================== */

.page {
  min-height: 100vh;
  background: #FDF2F2; 
  color: #323130;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans SC',
               'Helvetica Neue', Arial, sans-serif;
}

.scroll {
  flex: 1;
  padding: 30rpx;
  box-sizing: border-box;
}

/* ==================== 名片头部 ==================== */
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 30rpx 40rpx;
}

.avatar {
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
  background: #f3f2f1;
  border: 6rpx solid #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.nickname {
  margin-top: 24rpx;
  font-size: 40rpx;
  font-weight: 700;
  color: #A51515;
}

.subtitle {
  margin-top: 12rpx;
  font-size: 26rpx;
  color: #6B7A88;
}

/* ==================== 统计卡 ==================== */
.stat-card {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 6px;
  border: 2rpx solid transparent;
  padding: 40rpx 0;
  margin-bottom: 30rpx;
  box-shadow: 0 1.6px 3.6px 0 rgba(0, 0, 0, 0.1),
              0 0.3px 0.9px 0 rgba(0, 0, 0, 0.1);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 56rpx;
  font-weight: 800;
  color: #A51515;
  line-height: 1;
}

.stat-label {
  margin-top: 12rpx;
  font-size: 26rpx;
  color: #6B7A88;
}

.stat-divider {
  width: 2rpx;
  height: 60rpx;
  background: #edebe9;
}

/* ==================== 功能列表 ==================== */
.menu-card {
  background: #ffffff;
  border-radius: 6px;
  border: 2rpx solid transparent;
  margin-bottom: 30rpx;
  box-shadow: 0 1.6px 3.6px 0 rgba(0, 0, 0, 0.1),
              0 0.3px 0.9px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 32rpx 30rpx;
  transition: all 0.4s cubic-bezier(0.05, 0.7, 0.1, 1.0);
}

.menu-item:active {
  background: #f8f9fa;
}

.menu-icon {
  font-size: 36rpx;
  margin-right: 24rpx;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #323130;
}

.menu-text.danger {
  color: #D9480F;
}

.menu-arrow {
  font-size: 40rpx;
  color: #a0a6ad;
  line-height: 1;
}

.menu-divider {
  height: 2rpx;
  background: #edebe9;
  margin-left: 90rpx;
}

/* ==================== 平台信息 ==================== */
.platform {
  text-align: center;
  padding: 20rpx 0;
}

.platform-text {
  font-size: 24rpx;
  color: #6B7A88;
}

/* ==================== 版本信息 ==================== */
.version {
  text-align: center;
  padding: 12rpx 0 40rpx;
}

.version-text {
  font-size: 22rpx;
  color: #a0a6ad;
}

/* ==================== 底部占位 ==================== */
.bottom-placeholder {
  height: 40rpx;
}
</style>