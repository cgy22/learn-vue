<template>
  <view class="page" :class="{ 'theme-dark': isDark }">

    <block v-if="activity">

      <view class="hero" :style="{ background: heroGradient }">
        <view class="hero-placeholder">
          <text class="hero-cat">{{ activity.category }}</text>
          <text class="hero-id">活动编号 #{{ activity.id }}</text>
        </view>
      </view>

      <view class="body">

        <text class="title" :style="{ color: themeColor }">{{ activity.title }}</text>

        <view class="tag-row">
          <text class="cat-tag" :style="{ backgroundColor: themeColorLight, color: themeColor }">
            {{ activity.category }}
          </text>
          <text v-if="activityEnded" class="ended-tag">已结束</text>
          <text
            v-else-if="isEnrolled"
            class="enrolled-tag"
            :style="{ backgroundColor: themeColorLight, color: themeColor }"
          >已报名</text>
          <text v-else class="no-enroll-tag">未报名</text>
        </view>

        <view class="info-line">
          <text class="info-item">发布时间：{{ publishTimeText }}</text>
        </view>

        <view class="desc-block">
          <text
            class="desc-label"
            :style="{ color: themeColor, borderLeftColor: themeColor }"
          >活动描述</text>
          <text class="desc-text">{{ activity.description }}</text>
        </view>

        <view class="desc-block">
          <text
            class="desc-label"
            :style="{ color: themeColor, borderLeftColor: themeColor }"
          >主办方联系方式</text>
          <text class="desc-text">{{ activity.contact }}</text>
        </view>

        <view v-if="activityEnded" class="ended-tip">
          <text class="ended-tip-icon">🚫</text>
          <text class="ended-tip-text">该活动已结束，无法报名</text>
        </view>

        <view class="enroll-wrap">
          <EnrollButton
            :activity-id="activity.id"
            :enrolled="isEnrolled"
            :disabled="activityEnded"
            :dark="isDark"
            :theme="themeColor"
            @toggle="handleToggleEnroll"
          />
        </view>

        <view class="action-row">
          <view class="action-btn" @click="contactHost">
            <text class="action-icon">📞</text>
            <text class="action-text" :style="{ color: themeColor }">联系主办方</text>
          </view>
          <view class="action-btn" @click="copyInfo">
            <text class="action-icon">📋</text>
            <text class="action-text" :style="{ color: themeColor }">复制活动信息</text>
          </view>
        </view>

        <view class="back-home-btn" @click="goHome">
          <text>返回首页</text>
        </view>

        <view class="bottom-placeholder"></view>
      </view>

    </block>

    <view v-else class="not-found">
      <text class="not-found-icon">📕</text>
      <text class="not-found-text">没有找到该活动</text>
      <view class="back-home-btn" @click="goHome">
        <text>返回首页</text>
      </view>
    </view>

  </view>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useTheme } from '@/composables/useTheme.js'
import { useEnroll } from '@/composables/useEnroll.js'

const { isDark, themeColor, themeColorLight, initTheme } = useTheme()
initTheme()
provide('isDark', isDark)
provide('themeColor', themeColor)


const { isEnrolled: checkEnrolled, enroll, cancelEnroll, initEnroll } = useEnroll()
initEnroll()

const activity = ref(null)
const activityEnded = ref(false)

const isEnrolled = computed(() => {
  if (!activity.value) return false
  return checkEnrolled(activity.value.id)
})

const heroGradient = computed(() =>
  `linear-gradient(135deg, ${themeColor.value} 0%, #7A0F0F 100%)`
)

const publishTimeText = computed(() => {
  if (!activity.value || !activity.value.publishTime) return ''
  const d = new Date(activity.value.publishTime)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
})

onLoad((options) => {
  console.log('[detail] onLoad options =', options)
  const id = Number(options.id)
  if (Number.isNaN(id)) return

  let list = []
  try {
    list = uni.getStorageSync('activity_cache') || []
  } catch (e) {
    list = []
  }
  const found = list.find(item => Number(item.id) === id)

  if (found) {
    activity.value = found
  } else {
    const cats = ['讲座', '文体', '志愿']
    const phones = ['538200138000', '548600138001', '638080138002', '513800138003']
    activity.value = {
      id,
      title: `活动 #${id}`,
      description: '活动详情数据暂未缓存，请返回首页重新加载后再进入。',
      category: cats[id % 3],
      publishTime: Date.now() - id * 86400000,
      contact: phones[id % phones.length]
    }
  }

  activityEnded.value = id % 2 === 1
})

const handleToggleEnroll = (payload) => {
  const id = payload.activityId
  if (activityEnded.value) {
    uni.showToast({ title: '活动已结束，无法报名', icon: 'none' })
    return
  }
  if (payload.enrolled) {
    cancelEnroll(id)
    uni.showToast({ title: '已取消报名', icon: 'none' })
  } else {
    enroll(id)
    uni.showToast({ title: '报名成功', icon: 'success' })
  }
}

const contactHost = () => {
  if (!activity.value) return
  const phone = String(activity.value.contact)
  uni.showModal({
    title: '确认拨打电话？',
    content: `将拨打主办方电话：${phone}`,
    success: (res) => {
      if (!res.confirm) return
      uni.makePhoneCall({
        phoneNumber: phone,
        fail: () => { uni.showToast({ title: '拨号失败', icon: 'none' }) }
      })
    }
  })
}

const copyInfo = () => {
  if (!activity.value) return
  const text = `${activity.value.title}\n${activity.value.description}`
  uni.setClipboardData({
    data: text,
    success: () => { uni.showToast({ title: '已复制', icon: 'none' }) }
  })
}

const goHome = () => {
  uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style scoped>
.page {
  min-height: 100vh; background: #FDF2F2; color: #323130; position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans SC',
               'Helvetica Neue', Arial, sans-serif;
}

.hero {
  width: 100%; height: 360rpx;
  display: flex; align-items: center; justify-content: center;
}
.hero-placeholder { display: flex; flex-direction: column; align-items: center; }
.hero-cat { font-size: 48rpx; font-weight: 800; color: #fff; letter-spacing: 4rpx; }
.hero-id { margin-top: 12rpx; font-size: 26rpx; color: rgba(255,255,255,0.85); }

.body { padding: 30rpx; }

.title {
  display: block; font-size: 40rpx; font-weight: 700;
  line-height: 1.4; margin-bottom: 20rpx;
}

.tag-row { display: flex; flex-wrap: wrap; align-items: center; margin-bottom: 20rpx; }
.cat-tag {
  padding: 6rpx 20rpx; margin-right: 16rpx;
  border-radius: 8px; font-size: 24rpx;
}
.ended-tag {
  padding: 6rpx 20rpx; background: #edebe9; color: #6B7A88;
  border-radius: 8px; font-size: 24rpx;
}
.enrolled-tag {
  padding: 6rpx 20rpx;
  border-radius: 8px; font-size: 24rpx; font-weight: 600;
}
.no-enroll-tag {
  padding: 6rpx 20rpx; background: #f3f2f1; color: #6B7A88;
  border-radius: 8px; font-size: 24rpx;
}

.info-line { display: flex; align-items: center; margin-bottom: 24rpx; font-size: 26rpx; color: #6B7A88; }

.desc-block {
  background: #fff; border-radius: 6px; border: 2rpx solid transparent;
  padding: 20px; margin-bottom: 24rpx;
  box-shadow: 0 1.6px 3.6px 0 rgba(0,0,0,0.1), 0 0.3px 0.9px 0 rgba(0,0,0,0.1);
}
.desc-label {
  display: block; font-size: 28rpx; font-weight: 600;
  margin-bottom: 16rpx; padding-left: 16rpx; border-left: 6rpx solid transparent;
  line-height: 1.2;
}
.desc-text { display: block; font-size: 28rpx; color: #323130; line-height: 1.8; }

.ended-tip {
  display: flex; align-items: center; padding: 20rpx 24rpx;
  background: rgba(217,72,15,0.08); border-left: 6rpx solid #D9480F;
  border-radius: 8px; margin-bottom: 24rpx;
}
.ended-tip-icon { font-size: 32rpx; margin-right: 12rpx; }
.ended-tip-text { font-size: 26rpx; color: #D9480F; }

.enroll-wrap { margin-bottom: 24rpx; }

.action-row { display: flex; margin-bottom: 24rpx; }
.action-btn {
  flex: 1; display: flex; align-items: center; justify-content: center;
  height: 84rpx; background: #fff; border: 2rpx solid #edebe9; border-radius: 8px;
  box-shadow: 0 1rpx 2rpx rgba(0,0,0,0.1);
  transition: all 0.4s cubic-bezier(0.05,0.7,0.1,1.0);
}
.action-btn:first-child { margin-right: 20rpx; }
.action-btn:active { transform: scale(0.98); background: #f8f9fa; }
.action-icon { font-size: 30rpx; margin-right: 10rpx; }
.action-text { font-size: 26rpx; font-weight: 600; }

.back-home-btn {
  height: 88rpx; display: flex; align-items: center; justify-content: center;
  background: #f3f2f1; border: 2rpx solid #edebe9; border-radius: 8px;
  font-size: 28rpx; color: #323130; font-weight: 600;
  transition: all 0.4s cubic-bezier(0.05,0.7,0.1,1.0);
}
.back-home-btn:active { transform: scale(0.98); background: #f8f9fa; }

.bottom-placeholder { height: 40rpx; }

.not-found {
  min-height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; padding: 60rpx;
}
.not-found-icon { font-size: 120rpx; opacity: 0.4; margin-bottom: 30rpx; }
.not-found-text { font-size: 32rpx; color: #6B7A88; margin-bottom: 60rpx; }

/* ==================== 暗黑基础 ==================== */
.theme-dark.page { background: #1a1a1a; color: #eeeeee; }
.theme-dark .info-line { color: #bbbbbb; }
.theme-dark .desc-block {
  background: #2a2a2a;
  box-shadow: 0 1.6px 3.6px 0 rgba(0,0,0,0.3), 0 0.3px 0.9px 0 rgba(0,0,0,0.3);
}
.theme-dark .desc-text { color: #dddddd; }
.theme-dark .ended-tag,
.theme-dark .no-enroll-tag { background: #2d2c2c; color: #bbbbbb; }
.theme-dark .action-btn { background: #2a2a2a; border-color: #3b3a39; }
.theme-dark .action-btn:active { background: #323130; }
.theme-dark .back-home-btn { background: #2d2c2c; border-color: #3b3a39; color: #eeeeee; }
.theme-dark .back-home-btn:active { background: #323130; }
.theme-dark .not-found-text { color: #bbbbbb; }
.theme-dark .ended-tip { background: rgba(255,138,91,0.1); border-left-color: #FF8A5B; }
.theme-dark .ended-tip-text { color: #FF8A5B; }
</style>