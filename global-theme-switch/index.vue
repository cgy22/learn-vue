<template>
  <!-- ⭐ 一个开关，全页换色 -->
  <view class="app-page" :class="{ dark: isDark }">
    <view class="switch" :class="{ on: isDark }" @click="toggleTheme">
      <view class="switch-knob" />
    </view>
    <view class="card">...</view>
  </view>
</template>
 
<script setup>
import { ref } from 'vue'
import { useTheme } from '../../composables/useTheme.js'
 
// 解构出来的 isDark 仍然是那个共享的 ref
const { isDark, toggleTheme } = useTheme()
 
const logs = ref([])
function push(msg) {
  logs.value.unshift(msg)
  if (logs.value.length > 6) logs.value.pop()
}
</script>
