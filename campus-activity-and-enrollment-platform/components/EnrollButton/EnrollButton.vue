<template>
  <view
    class="enroll-btn"
    :class="{ 'is-enrolled': enrolled, 'is-disabled': disabled, 'theme-dark': darkResolved }"
    :style="btnStyle"
    @click="onToggle"
  >
    <text class="enroll-text" :style="textStyle">
      {{ disabled ? '活动已结束' : (enrolled ? '取消报名' : '立即报名') }}
    </text>
  </view>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  activityId: { type: [Number, String], required: true },
  enrolled: { type: Boolean, required: true },
  disabled: { type: Boolean, default: false },
  dark: { type: Boolean, default: null },
  theme: { type: String, default: null }
})

const emit = defineEmits(['toggle'])

const injectedDark = inject('isDark', null)
const injectedColor = inject('themeColor', null)

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

const btnStyle = computed(() => {
  if (props.disabled || props.enrolled) return {}
  return { backgroundColor: colorResolved.value }
})

const textStyle = computed(() => {
  if (props.disabled) return {}
  if (props.enrolled) return { color: colorResolved.value }
  return { color: '#ffffff' }
})

const onToggle = () => {
  if (props.disabled) {
    uni.showToast({ title: '活动已结束，无法报名', icon: 'none' })
    return
  }
  emit('toggle', { activityId: props.activityId, enrolled: props.enrolled })
}
</script>

<style scoped>
.enroll-btn {
  height: 84rpx; display: flex; align-items: center; justify-content: center;
  border-radius: 8px;
  transition: all 0.4s cubic-bezier(0.05,0.7,0.1,1.0);
}
.enroll-btn:active { transform: scale(0.98); opacity: 0.9; }
.enroll-text { font-size: 30rpx; font-weight: 600; }
.enroll-btn.is-enrolled { background: #f3f2f1; border: 2rpx solid #edebe9; }
.enroll-btn.is-disabled { background: #edebe9; border: 2rpx solid #edebe9; }
.enroll-btn.is-disabled:active { transform: none; opacity: 1; }
.enroll-btn.is-disabled .enroll-text { color: #a0a6ad; font-weight: 500; }
.theme-dark.enroll-btn.is-enrolled { background: #2d2c2c; border-color: #3b3a39; }
.theme-dark.enroll-btn.is-disabled { background: #2d2c2c; border-color: #3b3a39; }
.theme-dark.enroll-btn.is-disabled .enroll-text { color: #666666; }
</style>