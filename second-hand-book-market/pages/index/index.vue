<template>
  <view class="page">

    <!-- ========== 搜索框 ========== -->
    <view class="search-bar">
      <input
        class="search-input"
        v-model="keyword"
        placeholder="搜索书名或作者"
        placeholder-class="search-ph"
        confirm-type="search"
      />
    </view>

    <!-- ========== 分类 Tab 条 ========== -->
    <scroll-view scroll-x class="cat-bar" :show-scrollbar="false">
      <view class="cat-inner">
        <view
          v-for="cat in categories"
          :key="cat"
          class="cat-item"
          :class="{ active: currentCategory === cat }"
          @click="currentCategory = cat"
        >
          <text>{{ cat }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- ========== 书籍列表 ========== -->
    <scroll-view scroll-y class="book-list">

      <view
        v-for="item in showList"
        :key="item.id"
        class="book-card"
        @click="goDetail(item.id)"
      >
        <!-- ★ 已收藏角标 -->
        <view v-if="isCollected(item.id)" class="badge-collected">
          <text class="badge-text">已收藏</text>
        </view>

        <!-- 左：封面 -->
        <image
          class="book-cover"
          :src="item.cover"
          mode="aspectFill"
        />

        <!-- 右：信息区 -->
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

          <text class="seller">{{ item.seller }}</text>
        </view>
      </view>

      <!-- 空态 -->
      <view v-if="showList.length === 0" class="empty">
        <text class="empty-icon">📚</text>
        <text class="empty-text">书市暂时没有书～</text>
      </view>

      <!-- 列表底部统计 -->
      <view v-else class="list-footer">
        <text>—— 共 {{ showList.length }} 本 ——</text>
      </view>

    </scroll-view>

  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { books, categories } from '@/data/books.js'

/* ==================== 状态 ==================== */
const currentCategory = ref('全部')
const keyword = ref('')
// 我发布的书
const myBooks = ref([])
// 我收藏的 id 列表
const collectIds = ref([])

/* ==================== 全部数据 ==================== */
// 我发布的 + 静态 8 本（我发布的排前面）
const allBooks = computed(() => {
  return [...myBooks.value, ...books]
})

/* ==================== 筛选后的列表 ==================== */
const showList = computed(() => {
  let list = allBooks.value

  // 1. 分类筛选
  if (currentCategory.value !== '全部') {
    list = list.filter(b => b.category === currentCategory.value)
  }

  // 2. 关键词筛选（书名 或 描述）
  const kw = keyword.value.trim()
  if (kw) {
    list = list.filter(b =>
      b.title.includes(kw) || b.desc.includes(kw)
    )
  }

  return list
})

/* ==================== 生命周期 ==================== */
onLoad(() => {
  console.log('[index] onLoad')
  loadMyBooks()
})

// 从详情页返回时刷新（收藏角标 / 新发布的书）
onShow(() => {
  console.log('[index] onShow')
  loadMyBooks()
})

// 下拉刷新
onPullDownRefresh(() => {
  setTimeout(() => {
    loadMyBooks()
    uni.stopPullDownRefresh()
    uni.showToast({ title: '已刷新', icon: 'none' })
  }, 600)
})

/* ==================== 方法 ==================== */
function loadMyBooks() {
  myBooks.value = uni.getStorageSync('myBooks') || []
  collectIds.value = uni.getStorageSync('collectIds') || []
}

// 判断某本书是否已收藏
function isCollected(id) {
  return collectIds.value.includes(id)
}

function goDetail(id) {
  uni.navigateTo({
    url: '/pages/detail/detail?id=' + id
  })
}
</script>

<style scoped>
/* ==================================================================
   设计语言来自 ui.css · 主色 #A51515（秋茗红）
   背景 #FDF2F2（淡红）
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

/* ==================== 搜索框 ==================== */
.search-bar {
  padding: 20rpx 30rpx 10rpx;
  background: #FDF2F2;
}

.search-input {
  height: 76rpx;
  padding: 0 32rpx;
  background: #ffffff;
  border: 2rpx solid #edebe9;
  border-radius: 8px;
  font-size: 28rpx;
  color: #323130;
  box-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.05, 0.7, 0.1, 1.0);
}

.search-input:focus {
  border-color: #A51515;
  box-shadow: 0 0 0 1rpx #A51515;
}

.search-ph {
  color: #a0a6ad;
  font-size: 28rpx;
}

/* ==================== 分类 Tab 条 ==================== */
.cat-bar {
  background: #FDF2F2;
  white-space: nowrap;
  padding: 10rpx 0 20rpx;
  border-bottom: 2rpx solid #edebe9;
}

.cat-inner {
  display: inline-flex;
  padding: 0 20rpx;
}

.cat-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx 32rpx;
  margin-right: 16rpx;
  background: #f3f2f1;
  border: 2rpx solid transparent;
  border-radius: 8px;
  font-size: 26rpx;
  color: #323130;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.05, 0.7, 0.1, 1.0);
}

.cat-item:last-child {
  margin-right: 0;
}

.cat-item:active {
  transform: scale(0.95);
}

.cat-item.active {
  background: #A51515;
  color: #ffffff;
  border-color: #A51515;
}

/* ==================== 书籍列表 ==================== */
.book-list {
  flex: 1;
  padding: 20rpx;
  box-sizing: border-box;
}

/* 书籍卡片 —— 照 ui.css 的 .card */
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
  overflow: hidden;
}

.book-card:active {
  box-shadow: 0 3.2px 7.2px 0 rgba(0, 0, 0, 0.1),
              0 0.6px 1.8px 0 rgba(0, 0, 0, 0.1);
  background-color: #f8f9fa;
  transform: translateY(-5rpx) scale(1.02);
  border-color: #A51515;
}

/* ==================== 已收藏角标 ==================== */
.badge-collected {
  position: absolute;
  top: 0;
  right: 0;
  padding: 8rpx 18rpx;
  background: #A51515;
  border-radius: 0 6px 0 8px;
  z-index: 2;
}

.badge-text {
  font-size: 20rpx;
  color: #ffffff;
  font-weight: 600;
  line-height: 1;
}

/* ==================== 封面 ==================== */
.book-cover {
  width: 180rpx;
  height: 230rpx;
  border-radius: 8px;
  background: #f3f2f1;
  flex-shrink: 0;
}

/* ==================== 信息区 ==================== */
.book-info {
  flex: 1;
  margin-left: 24rpx;
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

/* 价格行 */
.price-row {
  display: flex;
  align-items: baseline;
  margin-top: 8rpx;
}

.price {
  font-size: 38rpx;
  font-weight: 700;
  color: #D9480F;
}

.original {
  margin-left: 16rpx;
  font-size: 24rpx;
  color: #a0a6ad;
  text-decoration: line-through;
}

/* 标签行 */
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

.seller {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #6B7A88;
}

/* ==================== 空态 ==================== */
.empty {
  padding: 120rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  font-size: 100rpx;
  opacity: 0.4;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #6B7A88;
}

/* ==================== 列表底部统计 ==================== */
.list-footer {
  text-align: center;
  padding: 40rpx 0 60rpx;
  font-size: 24rpx;
  color: #a0a6ad;
}

/* ==================== 动画 ==================== */
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