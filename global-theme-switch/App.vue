<script>
// ⚠️ 用普通 <script>，不是 <script setup>
//    因为要用 onLaunch 这个【应用级生命周期】
import { initTheme } from './composables/useTheme.js' 
export default {
  onLaunch() {
    // 应用启动：读一次本地存储，恢复上次的主题
    const dark = initTheme()
    console.log('[App] onLaunch 恢复主题：', dark ? '暗黑' : '浅色')
  },
  onShow() { console.log('[App] onShow') },
  onHide() { console.log('[App] onHide') }
}
</script>
  <style>
page {                        /* 浅色：默认 */
  --bg: #F4F6F8;   --card: #FFFFFF;    --border: #E3E8EC;
  --text: #2B3A45; --text-sub: #6B7A88; --text-mute: #9AA7B0;
  --primary: #2683C6; --primary-bg: #EBF7FC;
  --success: #42BA97; --warn: #D9480F;
  background-color: var(--bg);
  color: var(--text);
}
 
.dark {                       /* 暗黑：只换值 */
  --bg: #16181D;   --card: #22252C;    --border: #33373F;
  --text: #E8ECF1; --text-sub: #A3AEBB; --text-mute: #6E7885;
  --primary: #4FA9E8; --primary-bg: #1E2C38;
  --success: #52C9A6; --warn: #E8683C;
}
 
.app-page {                   /* 所有页面最外层都用它 */
  min-height: 100vh;
  background-color: var(--bg);
  color: var(--text);
  transition: background-color .25s, color .25s;
}
</style>
  
