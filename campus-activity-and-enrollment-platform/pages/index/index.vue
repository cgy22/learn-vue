<template>
  <view class="page" :class="{ 'theme-dark': isDark }">

    <view class="toolbar">
      <text class="toolbar-title" :style="{ color: themeColor }">瓦莱希雅大学 · 校园活动</text>
      <text class="toolbar-sub">共 {{ activityList.length }} 场 · 下拉可刷新</text>
    </view>

    <scroll-view scroll-x class="cat-bar" :show-scrollbar="false">
      <view class="cat-inner">
        <view
          v-for="cat in categories"
          :key="cat"
          class="cat-item"
          :class="{ active: currentCategory === cat }"
          :style="currentCategory === cat
            ? { backgroundColor: themeColor, borderColor: themeColor, color: '#ffffff' }
            : {}"
          @click="currentCategory = cat"
        >
          <text>{{ cat }}</text>
        </view>
      </view>
    </scroll-view>

    <view v-if="isLoading" class="state-box">
      <text class="state-icon">⏳</text>
      <text class="state-text">加载中...</text>
    </view>

    <view v-else-if="errorMsg" class="state-box">
      <text class="state-icon">⚠️</text>
      <text class="state-text">{{ errorMsg }}</text>
      <view class="retry-btn" :style="{ backgroundColor: themeColor }" @click="fetchActivities">
        <text>重试</text>
      </view>
    </view>

    <!-- 列表：普通 view，页面级滚动，避免 scroll-view 在 KeepAlive 下 scrollTop 报错 -->
    <view v-else-if="filteredList.length > 0" class="list-wrap">
      <ActivityCard
        v-for="item in filteredList"
        :key="item.id"
        :activity="item"
        :dark="isDark"
        :theme="themeColor"
        @click="goToDetail"
      />
      <view class="list-footer"><text>—— 共 {{ filteredList.length }} 场 ——</text></view>
    </view>

    <view v-else class="empty">
      <text class="empty-icon">📭</text>
      <text class="empty-text">暂无相关活动</text>
    </view>

  </view>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import { onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { useTheme } from '@/composables/useTheme.js'

const { isDark, themeColor, initTheme } = useTheme()
initTheme()
provide('isDark', isDark)
provide('themeColor', themeColor)

const activityList = ref([])
const isLoading = ref(false)
const errorMsg = ref('')
const currentCategory = ref('全部')
const categories = ['全部', '讲座', '文体', '志愿']
const API_URL = 'https://jsonplaceholder.typicode.com/posts'

// ==================== 活动文案映射：按 id 任意编辑 ====================
// 以瓦莱希雅大学王牌专业为主线：语言学 / 𣿅语语言文学 / 外国语言文学 /
// 历史学 / 哲学 / 翻译学 / 新闻传播学，并呼应总统演讲方针
const ACTIVITY_CONTENT = {
  1: {
    title: '语言文学专题讲座：经典与当代',
    description: '由语言学专业主办，围绕经典文献与当代语言生活展开，兼谈人工智能时代的语言研究新路径。',
    category: '讲座',
    contact: '538200138000'
  },
  2: {
    title: '语言学前沿论坛：语言、认知与社会',
    description: '语言学专业主办的前沿论坛，讨论语言与认知、社会变迁的关系，并介绍国家级语料库与量子加密互联网下的语言数据安全。',
    category: '讲座',
    contact: '548600138001'
  },
  3: {
    title: '外国语言文学读书会：法语的“自由、平等、博爱”',
    description: '法语专业领读法语经典，讨论跨文化理解与友好交流。',
    category: '讲座',
    contact: '638080138002'
  },
  4: {
    title: '历史学工作坊：建国与金瓶古镇',
    description: '历史学专业主持的工作坊，从史料出发梳理建国历程，并讨论金瓶古镇作为信息传输中心的历史与未来。',
    category: '讲座',
    contact: '513800138003'
  },
  5: {
    title: '哲学沙龙：“星环闪耀之处”的信念之思',
    description: '哲学专业围绕“星环闪耀之处，𣿅国生生不息”的信念展开讨论，探讨国家、公民与技术在伦理层面的关系。',
    category: '讲座',
    contact: '538200138000'
  },
  6: {
    title: '翻译学实践：国事访问文献翻译志愿项目',
    description: '翻译学专业组织志愿翻译项目，为国事访问相关文献与对外交流材料提供翻译支持，服务时长计入志愿记录。',
    category: '志愿',
    contact: '548600138001'
  },
  7: {
    title: '新闻传播学：国家开放日现场报道实践',
    description: '新闻传播学专业组织学生参与国家开放日现场报道，采访参观公民，实践采写、摄影与融媒体发布。',
    category: '志愿',
    contact: '638080138002'
  },
  8: {
    title: '瓦莱希雅大学秋季运动会',
    description: '面向全校的秋季运动会，设田径、球类与趣味项目，报名后请留意分组通知与赛程安排。',
    category: '文体',
    contact: '513800138003'
  },
  9: {
    title: '瓦莱希雅十佳歌手大赛初赛',
    description: '校园歌手大赛初赛报名开启，曲目自选，现场提供伴奏设备，晋级名单将于赛后公布。',
    category: '文体',
    contact: '538200138000'
  },
  10: {
    title: '多语种演讲比赛：讲述我眼中的𣿅国',
    description: '面向全校的多语种演讲比赛，可用𣿅语、法语、英语等语言讲述“我眼中的𣿅国”，优胜者将参与对外交流展示。',
    category: '文体',
    contact: '548600138001'
  }
  // 11~20 可按同样格式继续补充；未列出的走兜底
}

// ==================== 兜底（未配置的 id） ====================
const FALLBACK_CONTENT = {
  title: '瓦莱希雅大学校园活动',
  description: '该活动的详细内容尚未配置，可在首页数据映射表中补充。',
  category: '讲座',
  contact: '538200138000'
}

// ==================== 映射：优先取 ACTIVITY_CONTENT，按 id 精确对应 ====================
const mapToActivity = (item) => {
  const id = Number(item.id)
  const conf = ACTIVITY_CONTENT[id] || FALLBACK_CONTENT
  const cats = ['讲座', '文体', '志愿']
  const phones = ['538200138000', '548600138001', '638080138002', '513800138003']
  return {
    id,
    title: conf.title,
    description: conf.description,
    category: conf.category || cats[id % 3],
    publishTime: Date.now() - id * 86400000,
    contact: conf.contact || phones[id % phones.length]
  }
}

const fetchActivities = async () => {
  try {
    isLoading.value = true
    errorMsg.value = ''
    const res = await uni.request({ url: API_URL, method: 'GET' })
    console.log('[index] statusCode =', res.statusCode)
    console.log('[index] data 层级 =', Array.isArray(res.data) ? 'Array' : typeof res.data)
    if (res.statusCode === 200 && Array.isArray(res.data)) {
      activityList.value = res.data.slice(0, 10).map(mapToActivity)
      uni.setStorageSync('activity_cache', activityList.value)
      console.log('[index] 映射后活动数 =', activityList.value.length)
    } else {
      throw new Error(`请求失败，状态码：${res.statusCode}`)
    }
  } catch (error) {
    errorMsg.value = '加载失败，请检查网络后重试'
    console.error('[index] 请求异常：', error)
  } finally {
    isLoading.value = false
  }
}

const filteredList = computed(() => {
  if (currentCategory.value === '全部') return activityList.value
  return activityList.value.filter(a => a.category === currentCategory.value)
})

onShow(() => { fetchActivities() })

onPullDownRefresh(async () => {
  await fetchActivities()
  uni.stopPullDownRefresh()
  uni.showToast({ title: '已刷新', icon: 'none' })
})

const goToDetail = (activity) => {
  if (!activity || !activity.id) return
  uni.navigateTo({ url: '/pages/detail/detail?id=' + activity.id })
}
</script>

<style scoped>
.page {
  min-height: 100vh; background: #FDF2F2; color: #323130;
  display: flex; flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans SC',
               'Helvetica Neue', Arial, sans-serif;
}
.toolbar { padding: 24rpx 30rpx 12rpx; display: flex; flex-direction: column; }
.toolbar-title { font-size: 34rpx; font-weight: 700; }
.toolbar-sub { margin-top: 4rpx; font-size: 22rpx; color: #6B7A88; }

.cat-bar {
  background: #FDF2F2; white-space: nowrap; padding: 10rpx 0 20rpx;
  border-bottom: 2rpx solid #edebe9;
  flex-shrink: 0;
}
.cat-inner { display: inline-flex; padding: 0 20rpx; }
.cat-item {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 12rpx 32rpx; margin-right: 16rpx; background: #f3f2f1;
  border: 2rpx solid transparent; border-radius: 8px; font-size: 26rpx;
  color: #323130; white-space: nowrap; flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.05,0.7,0.1,1.0);
}
.cat-item:last-child { margin-right: 0; }
.cat-item:active { transform: scale(0.95); }

.state-box {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; padding: 120rpx 60rpx;
}
.state-icon { font-size: 100rpx; opacity: 0.5; margin-bottom: 24rpx; }
.state-text { font-size: 28rpx; color: #6B7A88; text-align: center; line-height: 1.6; }
.retry-btn {
  margin-top: 40rpx; padding: 0 60rpx; height: 80rpx;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 28rpx; border-radius: 8px;
}
.retry-btn:active { transform: scale(0.98); opacity: 0.9; }

/* 列表容器：普通滚动，页面自然滚动 */
.list-wrap {
  padding: 20rpx 20rpx 40rpx;
  box-sizing: border-box;
}
.list-footer { text-align: center; padding: 40rpx 0 20rpx; font-size: 24rpx; color: #a0a6ad; }

.empty {
  flex: 1; padding: 120rpx 60rpx; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
}
.empty-icon { font-size: 100rpx; opacity: 0.4; margin-bottom: 24rpx; }
.empty-text { font-size: 28rpx; color: #6B7A88; }

/* ==================== 暗黑基础 ==================== */
.theme-dark.page { background: #1a1a1a; color: #eeeeee; }
.theme-dark .toolbar-sub { color: #bbbbbb; }
.theme-dark .cat-bar { background: #1a1a1a; border-bottom-color: #3b3a39; }
.theme-dark .cat-item { background: #2d2c2c; color: #eeeeee; }
.theme-dark .state-text, .theme-dark .empty-text { color: #bbbbbb; }
.theme-dark .list-footer { color: #888888; }
</style>