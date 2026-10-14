<template>
  <view class="page">

    <!-- ========== 有收藏：显示列表 ========== -->
    <block v-if="collectList.length > 0">

      <!-- 顶部统计 -->
      <view class="top-stat">
        <text class="stat-text">共收藏 {{ collectList.length }} 本</text>
      </view>

      <!-- 收藏列表 -->
      <scroll-view scroll-y class="book-list">
        <view
          v-for="item in collectList"
          :key="item.id"
          class="book-card"
          @click="goDetail(item.id)"
        >
          <!-- 左：封面 -->
          <image class="book-cover" :src="item.cover" mode="aspectFill" />

          <!-- 中：信息 -->
          <view class="book-info">
            <text class="book-title">{{ item.title }}</text>
            <view class="price-row">
              <text class="price">¥{{ item.price }}</text>
              <text class="original">¥{{ item.originalPrice }}</text>
            </view>
            <view class="meta-row">
              <text class="meta-tag">{{ item.condition }}</text>
              <text class="meta-tag cat-tag">{{ item.category }}</text>
            </view>
          </view>

          <!-- 右：取消收藏按钮 -->
          <view class="remove-btn" @click.stop="confirmRemove(item)">
            <text class="remove-icon">✕</text>
          </view>
        </view>

        <view class="list-footer">
          —— 共 {{ collectList.length }} 本 ——
        </view>
      </scroll-view>

    </block>

    <!-- ========== 无收藏：空态 ========== -->
    <view v-else class="empty">
      <text class="empty-icon">⁉️</text>
      <text class="empty-text">还没有收藏任何书</text>
      <button class="go-btn" @click="goIndex">去书市看看</button>
    </view>

  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { getBookById } from '@/data/books.js'

/* ==================== 状态 ==================== */
const collectIds = ref([])

/* ==================== 收藏列表（id 数组 → 书籍对象） ==================== */
const collectList = computed(() => {
  return collectIds.value
    .map(id => getBookById(id))
    .filter(item => item != null)   // 去掉找不到的
})

/* ==================== 生命周期 ==================== */
onShow(() => {
  console.log('[collect] onShow')
  loadCollectIds()
})

onPullDownRefresh(() => {
  setTimeout(() => {
    loadCollectIds()
    uni.stopPullDownRefresh()
    uni.showToast({ title: '已刷新', icon: 'none' })
  }, 600)
})

/* ==================== 方法 ==================== */
function loadCollectIds() {
  collectIds.value = uni.getStorageSync('collectIds') || []
}

/** 跳详情 */
function goDetail(id) {
  uni.navigateTo({ url: '/pages/detail/detail?id=' + id })
}

/** 去书市 —— 必须用 switchTab */
function goIndex() {
  uni.switchTab({ url: '/pages/index/index' })
}

/** 取消收藏 —— 先二次确认 */
function confirmRemove(book) {
  uni.showModal({
    title: '取消收藏',
    content: `确定要从收藏夹移除《${book.title}》吗？`,
    success: (res) => {
      // ★ 守门员：点"取消"什么都不做
      if (!res.confirm) return

      // 从 ids 里移除
      const newIds = collectIds.value.filter(id => id !== book.id)
      uni.setStorageSync('collectIds', newIds)
      collectIds.value = newIds

      uni.showToast({ title: '已取消收藏', icon: 'none' })
    }
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

/* ==================== 顶部统计 ==================== */
.top-stat {
  padding: 24rpx 30rpx;
  background: #ffffff;
  border-bottom: 2rpx solid #edebe9;
}

.stat-text {
  font-size: 26rpx;
  color: #6B7A88;
}

/* ==================== 收藏列表 ==================== */
.book-list {
  flex: 1;
  padding: 20rpx;
  box-sizing: border-box;
}

.book-card {
  display: flex;
  background: #ffffff;
  border-radius: 6px;
  border: 2rpx solid transparent;
  padding: 20px;
  margin-bottom: 20rpx;
  box-shadow: 0 1.6px 3.6px 0 rgba(0, 0, 0, 0.1),
              0 0.3px 0.9px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.05, 0.7, 0.1, 1.0);
  animation: cardAppear 0.7s cubic-bezier(0.05, 0.7, 0.1, 1.0);
  position: relative;
}

.book-card:active {
  box-shadow: 0 3.2px 7.2px 0 rgba(0, 0, 0, 0.1),
              0 0.6px 1.8px 0 rgba(0, 0, 0, 0.1);
  background-color: #f8f9fa;
  transform: translateY(-5rpx) scale(1.02);
  border-color: #A51515;
}

.book-cover {
  width: 160rpx;
  height: 210rpx;
  border-radius: 8px;
  background: #f3f2f1;
  flex-shrink: 0;
}

.book-info {
  flex: 1;
  margin-left: 24rpx;
  margin-right: 60rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.book-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #A51515;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price-row {
  display: flex;
  align-items: baseline;
  margin-top: 8rpx;
}

.price {
  font-size: 36rpx;
  font-weight: 700;
  color: #D9480F;
}

.original {
  margin-left: 16rpx;
  font-size: 24rpx;
  color: #a0a6ad;
  text-decoration: line-through;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  margin-top: 8rpx;
}

.meta-tag {
  display: inline-block;
  padding: 4rpx 16rpx;
  margin-right: 12rpx;
  background: #f3f2f1;
  border-radius: 8px;
  font-size: 22rpx;
  color: #323130;
}

.cat-tag {
  background: rgba(165, 21, 21, 0.1);
  color: #A51515;
}

/* ==================== 取消收藏按钮 ==================== */
.remove-btn {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #f3f2f1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.05, 0.7, 0.1, 1.0);
}

.remove-btn:active {
  background: #A51515;
}

.remove-icon {
  font-size: 26rpx;
  color: #323130;
  line-height: 1;
}

.remove-btn:active .remove-icon {
  color: #ffffff;
}

/* ==================== 空态 ==================== */
.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 60rpx;
}

.empty-icon {
  font-size: 140rpx;
  opacity: 0.3;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 30rpx;
  color: #6B7A88;
  margin-bottom: 60rpx;
}

.go-btn {
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

.go-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

/* ==================== 列表底部 ==================== */
.list-footer {
  text-align: center;
  padding: 40rpx 0 60rpx;
  font-size: 24rpx;
  color: #a0a6ad;
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(20rpx) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>