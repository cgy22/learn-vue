<template>
  <view class="page">
    <view class="toolbar">
      <text class="toolbar-title" style="color: #a30014;">新闻</text>
    </view>

    <!-- 1. 加载中状态 -->
    <view v-if="isLoading" class="state-box">
      <text class="state-icon">⏳</text>
      <text class="state-text">加载中...</text>
    </view>

    <!-- 2. 错误状态 -->
    <view v-else-if="errorMsg" class="state-box">
      <text class="state-icon">⚠️</text>
      <text class="state-text">{{ errorMsg }}</text>
      <view class="retry-btn" @click="fetchNews">
        <text>重试</text>
      </view>
    </view>

    <!-- 3. 数据成功状态 -->
    <view v-else-if="newsList.length > 0" class="list-wrap">
      <view 
        v-for="item in newsList" 
        :key="item.id" 
        class="news-card" 
      >
        <text class="news-title">{{ item.title }}</text>
        <text class="news-content">{{ item.content }}</text>
        <view class="news-meta">
          <text class="news-author">{{ item.author }}</text>
          <text class="news-time">{{ formatTime(item.publish_time) }}</text>
        </view>
      </view>
      <view class="list-footer"><text>—— 到底啦 ——</text></view>
    </view>

    <!-- 4. 空数据状态 -->
    <view v-else class="empty">
      <text class="empty-icon">📭</text>
      <text class="empty-text">暂无相关文章</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const newsList = ref([])
const isLoading = ref(false)
const errorMsg = ref('')

// Supabase 配置
const supabaseUrl = '在此填上真实数据' 
const publishableKey = '在此填上真实数据'

const fetchNews = async () => {
  try {
    isLoading.value = true
    errorMsg.value = ''
    
    const res = await uni.request({
      url: `${supabaseUrl}/rest/v1/news?select=*&order=publish_time.desc`,
      method: 'GET',
      header: {
        'apikey': publishableKey,
        'Authorization': `Bearer ${publishableKey}`
      }
    })
    

    if (res.statusCode === 200 && Array.isArray(res.data)) {
      newsList.value = res.data
    } else {
      throw new Error(res.data?.message || '请求异常')
    }
  } catch (error) {
    errorMsg.value = '数据加载失败，请重试'
  } finally {
    isLoading.value = false
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 页面首次加载时执行一次
onMounted(() => {
  fetchNews()
})
</script>

<style scoped>
.page {
  min-height: 100vh; background: #FDF2F2; color: #323130;
  display: flex; flex-direction: column;
}
.toolbar { padding: 24rpx 30rpx 12rpx; display: flex; flex-direction: column; }
.toolbar-title { font-size: 34rpx; font-weight: 700; }

.list-wrap { padding: 20rpx 30rpx 40rpx; box-sizing: border-box; }
.news-card {
  background: #ffffff; border-radius: 12px; padding: 30rpx;
  margin-bottom: 24rpx; display: flex; flex-direction: column;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.03);
}
.news-title { font-size: 32rpx; font-weight: 700; color: #323130; margin-bottom: 12rpx; }
.news-content { font-size: 26rpx; color: #6B7A88; line-height: 1.5; margin-bottom: 20rpx; }
.news-meta { display: flex; justify-content: space-between; font-size: 22rpx; color: #a0a6ad; }
.list-footer { text-align: center; padding: 40rpx 0 20rpx; font-size: 24rpx; color: #a0a6ad; }

.state-box { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 120rpx 60rpx; }
.state-icon { font-size: 100rpx; opacity: 0.5; margin-bottom: 24rpx; }
.state-text { font-size: 28rpx; color: #6B7A88; text-align: center; line-height: 1.6; }
.retry-btn { margin-top: 40rpx; padding: 0 60rpx; height: 80rpx; display: flex; align-items: center; justify-content: center; background: #a30014; color: #fff; font-size: 28rpx; border-radius: 8px; }

.empty { flex: 1; padding: 120rpx 60rpx; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.empty-icon { font-size: 100rpx; opacity: 0.4; margin-bottom: 24rpx; }
.empty-text { font-size: 28rpx; color: #6B7A88; }
</style>
