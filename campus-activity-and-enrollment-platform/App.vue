<script>
import { useTheme } from '@/composables/useTheme.js'
import { useEnroll } from '@/composables/useEnroll.js'

export default {
  onLaunch() {
    const theme = useTheme()
    theme.initTheme()
    const enroll = useEnroll()
    enroll.initEnroll()
  },
  onShow() {
    console.log('[App] onShow')
  },
  onHide() {
    console.log('[App] onHide')
  }
}
</script>

<style>
page {
  background-color: #FDF2F2;
  color: #323130;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans SC',
               'Helvetica Neue', Arial, sans-serif;
  font-size: 28rpx;
  line-height: 1.5;
}
.theme-dark {
  background-color: #1a1a1a;
  color: #eeeeee;
}
@keyframes cardAppear {
  from { opacity: 0; transform: translateY(20rpx) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10rpx); }
  to { opacity: 1; transform: translateY(0); }
}
</style>