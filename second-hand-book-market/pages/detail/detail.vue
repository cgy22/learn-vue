<template>
  <view class="page">

    <!-- ========== 找到书：正常显示 ========== -->
    <block v-if="book">

      <!-- 顶部大图（竖版完整显示，高度 500rpx 不变） -->
      <view class="hero">
        <image class="hero-img" :src="book.cover" mode="aspectFit" />
      </view>

      <!-- 主体内容 -->
      <view class="body">

        <!-- 书名 -->
        <text class="title">{{ book.title }}</text>

        <!-- 价格行 -->
        <view class="price-row">
          <text class="price">¥{{ book.price }}</text>
          <text class="original">¥{{ book.originalPrice }}</text>
          <text class="condition-tag">{{ book.condition }}</text>
        </view>

        <!-- 信息行：分类 · 校区 · 浏览量 -->
        <view class="info-line">
          <text class="info-item">{{ book.category }}</text>
          <text class="dot">·</text>
          <text class="info-item">{{ book.campus }}</text>
          <text class="dot">·</text>
          <text class="info-item">{{ book.views }} 次浏览</text>
        </view>

        <!-- 卖家卡片 -->
        <view class="seller-card">
          <image class="avatar" src="/static/mine/avatar.png" mode="aspectFill" />
          <view class="seller-info">
            <text class="seller-name">{{ book.seller }}</text>
            <text class="publish-time">发布于 {{ book.publishTime }}</text>
          </view>
        </view>

        <!-- 描述 -->
        <view class="desc-block">
          <text class="desc-label">书籍描述</text>
          <text class="desc-text">{{ book.desc }}</text>
        </view>

        <!-- 占位，防止内容被底部操作栏遮挡 -->
        <view class="bottom-placeholder"></view>

      </view>

    </block>

    <!-- ========== 找不到书：空态 ========== -->
    <view v-else class="not-found">
      <text class="not-found-icon">📕</text>
      <text class="not-found-text">没有找到这本书</text>
      <button class="back-btn" @click="goBack">返回书市</button>
    </view>

    <!-- ========== 底部固定操作栏（只有找到书才显示） ========== -->
    <view class="action-bar" v-if="book">
      <view class="action-btn" @click="copyContact">
        <text class="action-icon">📋</text>
        <text class="action-text">复制联系方式</text>
      </view>
      <view class="action-btn primary" @click="callSeller">
        <text class="action-icon">📞</text>
        <text class="action-text">联系卖家</text>
      </view>
      <view class="action-btn" :class="{ collected: isCollected }" @click="toggleCollect">
        <text class="action-icon">{{ isCollected ? '⭐' : '☆' }}</text>
        <text class="action-text">{{ isCollected ? '已收藏' : '收藏' }}</text>
      </view>
    </view>

  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import { getBookById } from '@/data/books.js'

/* ==================== 状态 ==================== */
const bookId = ref(null)
const book = ref(null)
const isCollected = ref(false)

/* ==================== 生命周期 ==================== */
onLoad((options) => {
  console.log('[detail] onLoad options =', options)
  // ★ 关键：options.id 是字符串，必须转 Number
  const id = Number(options.id)
  bookId.value = id

  // 找到这本书
  book.value = getBookById(id) || null

  // 判断是否已收藏
  if (book.value) {
    const ids = uni.getStorageSync('collectIds') || []
    isCollected.value = ids.includes(book.value.id)
  }
})

/* ==================== 下拉刷新 → 浏览量 +1 ==================== */
onPullDownRefresh(() => {
  setTimeout(() => {
    if (book.value) {
      book.value.views += 1
    }
    uni.stopPullDownRefresh()
    uni.showToast({ title: '已刷新', icon: 'none' })
  }, 600)
})

/* ==================== 方法 ==================== */

/** 复制联系方式 */
function copyContact() {
  if (!book.value) return
  uni.setClipboardData({
    data: String(book.value.phone),
    success: () => {
      uni.showToast({ title: '已复制', icon: 'none' })
    }
  })
}

/** 联系卖家 —— 先确认，再拨号 */
function callSeller() {
  if (!book.value) return
  const seller = book.value.seller
  const phone = String(book.value.phone)

  uni.showModal({
    title: '确认拨打电话？',
    content: `将拨打 ${seller} 的电话：${phone}`,
    success: (res) => {
      // ★ 守门员：点"取消"绝对不拨号
      if (!res.confirm) return

      uni.makePhoneCall({
        phoneNumber: phone,
        fail: () => {
          uni.showToast({ title: '拨号失败', icon: 'none' })
        }
      })
    }
  })
}

/** 收藏 / 取消收藏 */
function toggleCollect() {
  if (!book.value) return

  const ids = uni.getStorageSync('collectIds') || []
  const id = book.value.id

  if (ids.includes(id)) {
    const newIds = ids.filter(i => i !== id)
    uni.setStorageSync('collectIds', newIds)
    isCollected.value = false
    uni.showToast({ title: '已取消收藏', icon: 'none' })
  } else {
    ids.push(id)
    uni.setStorageSync('collectIds', ids)
    isCollected.value = true
    uni.showToast({ title: '已收藏', icon: 'none' })
  }
}

/** 返回上一页 */
function goBack() {
  uni.navigateBack()
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
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans SC',
               'Helvetica Neue', Arial, sans-serif;
}

/* ==================== 顶部大图 ==================== */
.hero {
  width: 100%;
  height: 500rpx;
  background: #f3f2f1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-img {
  width: 100%;
  height: 100%;
  display: block;
}

/* ==================== 主体 ==================== */
.body {
  padding: 30rpx;
}

.title {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: #A51515;
  line-height: 1.4;
  margin-bottom: 20rpx;
}

.price-row {
  display: flex;
  align-items: baseline;
  margin-bottom: 24rpx;
}

.price {
  font-size: 52rpx;
  font-weight: 800;
  color: #D9480F;
}

.original {
  margin-left: 20rpx;
  font-size: 28rpx;
  color: #a0a6ad;
  text-decoration: line-through;
}

.condition-tag {
  margin-left: 20rpx;
  padding: 6rpx 20rpx;
  background: rgba(165, 21, 21, 0.1);
  color: #A51515;
  border-radius: 8px;
  font-size: 24rpx;
}

.info-line {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  font-size: 26rpx;
  color: #6B7A88;
}

.info-item {
  color: #6B7A88;
}

.dot {
  margin: 0 12rpx;
  color: #a0a6ad;
}

/* ==================== 卖家卡片 ==================== */
.seller-card {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 6px;
  border: 2rpx solid transparent;
  padding: 20px;
  margin-bottom: 24rpx;
  box-shadow: 0 1.6px 3.6px 0 rgba(0, 0, 0, 0.1),
              0 0.3px 0.9px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.05, 0.7, 0.1, 1.0);
}

.seller-card:active {
  background-color: #f8f9fa;
  border-color: #A51515;
}

.avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: #f3f2f1;
  flex-shrink: 0;
}

.seller-info {
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
}

.seller-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #A51515;
  margin-bottom: 6rpx;
}

.publish-time {
  font-size: 24rpx;
  color: #6B7A88;
}

/* ==================== 描述 ==================== */
.desc-block {
  background: #ffffff;
  border-radius: 6px;
  border: 2rpx solid transparent;
  padding: 20px;
  box-shadow: 0 1.6px 3.6px 0 rgba(0, 0, 0, 0.1),
              0 0.3px 0.9px 0 rgba(0, 0, 0, 0.1);
}

.desc-label {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #A51515;
  margin-bottom: 16rpx;
  padding-left: 16rpx;
  border-left: 6rpx solid #A51515;
  line-height: 1.2;
}

.desc-text {
  display: block;
  font-size: 28rpx;
  color: #323130;
  line-height: 1.8;
}

/* ==================== 底部占位 ==================== */
.bottom-placeholder {
  height: 160rpx;
}

/* ==================== 底部固定操作栏 ==================== */
.action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 120rpx;
  padding-bottom: env(safe-area-inset-bottom);
  background: #ffffff;
  border-top: 2rpx solid #edebe9;
  display: flex;
  align-items: center;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.action-btn {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.05, 0.7, 0.1, 1.0);
}

.action-btn:active {
  background: #f3f2f1;
}

.action-icon {
  font-size: 36rpx;
  line-height: 1;
  margin-bottom: 6rpx;
}

.action-text {
  font-size: 24rpx;
  color: #323130;
}

.action-btn.primary .action-text {
  color: #A51515;
  font-weight: 600;
}

.action-btn.collected .action-text {
  color: #A51515;
  font-weight: 600;
}

/* ==================== 找不到书 ==================== */
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx;
}

.not-found-icon {
  font-size: 120rpx;
  opacity: 0.4;
  margin-bottom: 30rpx;
}

.not-found-text {
  font-size: 32rpx;
  color: #6B7A88;
  margin-bottom: 60rpx;
}

.back-btn {
  padding: 0 60rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #A51515;
  color: #ffffff;
  font-size: 28rpx;
  border-radius: 8px;
  transition: all 0.4s cubic-bezier(0.05, 0.7, 0.1, 1.0);
}

.back-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}
</style>