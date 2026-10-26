<template>
  <view
    class="activity-card"
    :class="{ 'theme-dark': darkResolved, 'is-pressing': pressing }"
    :style="cardStyle"
    @click="onCardClick"
    @touchstart="pressing = true"
    @touchend="pressing = false"
    @touchcancel="pressing = false"
  >
    <view
      v-if="showEnrollStatus && enrolled"
      class="badge-enrolled"
      :style="{ backgroundColor: colorResolved }"
    >
      <text class="badge-text">已报名</text>
    </view>

    <view class="card-top">
      <text
        class="cat-tag"
        :style="{ backgroundColor: lightResolved, color: colorResolved }"
      >{{ activity.category }}</text>
      <text class="publish-time">{{ publishTimeText }}</text>
    </view>

    <text class="card-title" :style="{ color: colorResolved }">{{ activity.title }}</text>
    <text class="card-desc">{{ activity.description }}</text>

    <view class="card-meta">
      <text class="meta-item">📞 {{ activity.contact }}</text>
      <text
        v-if="showEnrollStatus"
        class="meta-status"
        :class="{ on: enrolled }"
        :style="enrolled ? { color: colorResolved } : {}"
      >{{ enrolled ? '已报名' : '未报名' }}</text>
    </view>

    <view class="card-slot" @click.stop>
      <slot></slot>
    </view>
  </view>
</template>

<script setup>
import { computed, ref, inject } from 'vue'

const props = defineProps({
  activity: { type: Object, required: true },
  showEnrollStatus: { type: Boolean, default: false },
  enrolled: { type: Boolean, default: false },
  // ★ 新增：由页面显式传入，优先于 inject
  dark: { type: Boolean, default: null },
  theme: { type: String, default: null }
})

const emit = defineEmits(['click'])

const injectedDark = inject('isDark', null)
const injectedColor = inject('themeColor', null)

// props 优先，其次 inject，最后默认
const darkResolved = computed(() => {
  if (props.dark !== null) return props.dark
  if (injectedDark && typeof injectedDark.value !== 'undefined') return injectedDark.value
  return false
})

const colorResolved = computed(() => {
  if (props.theme) return props.theme
  if (injectedColor && typeof injectedColor.value !== 'undefined') return injectedColor.value
  return '#A51515'
})


const lightResolved = computed(() =>
  darkResolved.value ? 'rgba(229,72,77,0.15)' : 'rgba(165,21,21,0.10)'
)

const pressing = ref(false)
const cardStyle = computed(() => (pressing.value ? { borderColor: colorResolved.value } : {}))

const publishTimeText = computed(() => {
  const t = props.activity && props.activity.publishTime
  if (!t) return ''
  const d = new Date(t)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
})

const onCardClick = () => { emit('click', props.activity) }
</script>

<style scoped>
/* 样式保持上一版：只留灰阶与布局，主色由 :style 控制 */
.activity-card {
  position: relative; background: #fff; border-radius: 6px;
  border: 2rpx solid transparent; padding: 24rpx; margin-bottom: 20rpx;
  box-shadow: 0 1.6px 3.6px 0 rgba(0,0,0,0.1), 0 0.3px 0.9px 0 rgba(0,0,0,0.1);
  transition: all 0.4s cubic-bezier(0.05,0.7,0.1,1.0);
  animation: cardAppear 0.7s cubic-bezier(0.05,0.7,0.1,1.0);
  overflow: hidden;
}
.activity-card.is-pressing {
  box-shadow: 0 3.2px 7.2px 0 rgba(0,0,0,0.1), 0 0.6px 1.8px 0 rgba(0,0,0,0.1);
  background-color: #f8f9fa;
  transform: translateY(-5rpx) scale(1.02);
}
.badge-enrolled {
  position: absolute; top: 0; right: 0; padding: 8rpx 18rpx;
  border-radius: 0 6px 0 8px; z-index: 2;
}
.badge-text { font-size: 20rpx; color: #fff; font-weight: 600; line-height: 1; }
.card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12rpx; }
.cat-tag { display: inline-block; padding: 4rpx 16rpx; border-radius: 8px; font-size: 22rpx; }
.publish-time { font-size: 22rpx; color: #a0a6ad; }
/* ==================== 主色文字辅助效果（不改颜色） ==================== */
.card-title {
  display: block; font-size: 34rpx; font-weight: 700;
  line-height: 1.4; margin-bottom: 10rpx;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden; text-overflow: ellipsis;
  text-shadow: 0 0 1rpx currentColor;                   /* 轻微提亮，削弱锯齿暗边 */
}

.cat-tag {
  display: inline-block; padding: 4rpx 16rpx; border-radius: 8px; font-size: 22rpx;
  text-shadow: 0 0 1rpx currentColor;
}

.meta-status.on {
  font-weight: 600;
  text-shadow: 0 0 1rpx currentColor;
}

/* ==================== 暗黑基础（灰阶 + 底/影） ==================== */
.theme-dark.activity-card {
  background: #2a2a2a; border-color: transparent;
  box-shadow: 0 1.6px 3.6px 0 rgba(0,0,0,0.3), 0 0.3px 0.9px 0 rgba(0,0,0,0.3);
  color: #eeeeee;
}
.theme-dark.activity-card.is-pressing {
  background-color: #323130;
  box-shadow: 0 3.2px 7.2px 0 rgba(0,0,0,0.4), 0 0.6px 1.8px 0 rgba(0,0,0,0.4);
}

/* 暗黑下主色文字加一点微弱发光，和按钮观感拉齐 */
.theme-dark .card-title {
  text-shadow: 0 0 2rpx currentColor;
}
.theme-dark .cat-tag {
  text-shadow: 0 0 2rpx currentColor;
}
.theme-dark .meta-status.on {
  text-shadow: 0 0 2rpx currentColor;
}

.theme-dark .card-desc { color: #bbbbbb; }
.theme-dark .meta-item { color: #bbbbbb; }
.theme-dark .meta-status { color: #888888; }
.theme-dark .publish-time { color: #888888; }

@keyframes cardAppear {
  from { opacity: 0; transform: translateY(20rpx) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>