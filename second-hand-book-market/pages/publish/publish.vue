<template>
  <view class="page">

    <scroll-view scroll-y class="form-scroll">

      <view class="form-card">

        <!-- 书名 -->
        <view class="form-group">
          <text class="form-label">书名 <text class="required">*</text></text>
          <input
            class="form-input"
            v-model.trim="form.title"
            placeholder="请输入书名（1~30 字）"
            placeholder-class="form-ph"
            maxlength="30"
          />
        </view>

        <!-- 价格 -->
        <view class="form-group">
          <text class="form-label">价格（元）<text class="required">*</text></text>
          <input
            class="form-input"
            v-model="form.price"
            type="number"
            placeholder="请输入价格（大于 0）"
            placeholder-class="form-ph"
          />
        </view>

        <!-- 分类 -->
        <view class="form-group">
          <text class="form-label">分类 <text class="required">*</text></text>
          <view class="tag-group">
            <view
              v-for="cat in categoryOptions"
              :key="cat"
              class="tag-item"
              :class="{ active: form.category === cat }"
              @click="form.category = cat"
            >
              {{ cat }}
            </view>
          </view>
        </view>

        <!-- 成色 -->
        <view class="form-group">
          <text class="form-label">成色 <text class="required">*</text></text>
          <view class="tag-group">
            <view
              v-for="cond in conditionOptions"
              :key="cond"
              class="tag-item"
              :class="{ active: form.condition === cond }"
              @click="form.condition = cond"
            >
              {{ cond }}
            </view>
          </view>
        </view>

        <!-- 描述 -->
        <view class="form-group">
          <text class="form-label">书籍描述 <text class="required">*</text></text>
          <textarea
            class="form-textarea"
            v-model="form.desc"
            placeholder="请描述书籍的成色、有无笔记、购买时间等（1~200 字）"
            placeholder-class="form-ph"
            maxlength="200"
          ></textarea>
          <text class="char-count">已输入 {{ form.desc.length }} / 200 字</text>
        </view>

        <!-- 卖家昵称 -->
        <view class="form-group">
          <text class="form-label">卖家昵称</text>
          <input
            class="form-input"
            v-model.trim="form.seller"
            placeholder="选填，不填默认为「匿名同学」"
            placeholder-class="form-ph"
            maxlength="20"
          />
        </view>

        <!-- 联系电话 -->
        <view class="form-group">
          <text class="form-label">联系电话 <text class="required">*</text></text>
          <input
            class="form-input"
            v-model="form.phone"
            type="number"
            placeholder="请输入电话号码"
            placeholder-class="form-ph"
            maxlength="30"
          />
        </view>

      </view>

      <view class="bottom-placeholder"></view>

    </scroll-view>

    <!-- 底部固定操作栏（用 view 代替 button） -->
    <view class="action-bar">
      <view
        class="action-btn secondary"
        :class="{ disabled: submitting }"
        @click="onReset"
      >
        <text>重置</text>
      </view>
      <view
        class="action-btn primary"
        :class="{ disabled: submitting }"
        @click="onSubmit"
      >
        <text>{{ submitting ? '发布中...' : '发布' }}</text>
      </view>
    </view>

  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { categories } from '@/data/books.js'

const categoryOptions = categories.filter(c => c !== '全部')
const conditionOptions = ['全新', '99新', '9成新', '8成新', '7成新', '有笔记']

const form = reactive({
  title: '',
  price: '',
  category: '教材',
  condition: '9成新',
  desc: '',
  seller: '',
  phone: ''
})

const submitting = ref(false)

/* 重置 —— 带防连点 */
function onReset() {
  if (submitting.value) return
  form.title = ''
  form.price = ''
  form.category = '教材'
  form.condition = '9成新'
  form.desc = ''
  form.seller = ''
  form.phone = ''
  uni.showToast({ title: '已重置', icon: 'none' })
}

/* 提交 —— 带防连点 */
function onSubmit() {
  if (submitting.value) return
  submit()
}

function submit() {
  // 只检查"空"，不检查字数
  if (!form.title) {
    return uni.showToast({ title: '请填写书名', icon: 'none' })
  }
  if (!form.price) {
    return uni.showToast({ title: '请填写价格', icon: 'none' })
  }
  if (!form.desc) {
    return uni.showToast({ title: '请填写描述', icon: 'none' })
  }
  if (!form.phone) {
    return uni.showToast({ title: '请填写联系电话', icon: 'none' })
  }

  // 二次确认
  uni.showModal({
    title: '确认发布',
    content: `确认发布《${form.title}》吗？`,
    success: (res) => {
      if (!res.confirm) return
      doPublish()
    }
  })
}

function doPublish() {
  submitting.value = true

  const newBook = {
    id: Date.now(),
    title: form.title,
    price: Number(form.price),
    originalPrice: Number(form.price) * 2,
    category: form.category,
    condition: form.condition,
    desc: form.desc,
    seller: form.seller || '匿名同学',
    phone: form.phone,
    cover: '/static/books/b1.png',
    campus: '瓦莱希雅大学信息学院',
    publishTime: formatDate(new Date()),
    views: 0
  }

  const myBooks = uni.getStorageSync('myBooks') || []
  myBooks.unshift(newBook)
  uni.setStorageSync('myBooks', myBooks)

  uni.showToast({ title: '发布成功', icon: 'success' })

  setTimeout(() => {
    submitting.value = false
    uni.switchTab({ url: '/pages/index/index' })
  }, 1500)
}

function formatDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
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
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans SC',
               'Helvetica Neue', Arial, sans-serif;
}

/* ==================== 表单滚动区 ==================== */
.form-scroll {
  flex: 1;
  padding: 20rpx;
  box-sizing: border-box;
}

/* ==================== 表单卡片 ==================== */
.form-card {
  background: #ffffff;
  border-radius: 6px;
  border: 2rpx solid transparent;
  padding: 30rpx;
  box-shadow: 0 1.6px 3.6px 0 rgba(0, 0, 0, 0.1),
              0 0.3px 0.9px 0 rgba(0, 0, 0, 0.1);
}

/* ==================== 表单组 ==================== */
.form-group {
  margin-bottom: 36rpx;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #323130;
  margin-bottom: 16rpx;
}

.required {
  color: #D9480F;
  margin-left: 4rpx;
}

/* ==================== 输入框 ==================== */
.form-input {
  width: 100%;
  height: 80rpx;
  padding: 0 24rpx;
  background: #ffffff;
  border: 2rpx solid #edebe9;
  border-radius: 8px;
  font-size: 28rpx;
  color: #323130;
  box-sizing: border-box;
  box-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.05, 0.7, 0.1, 1.0);
}

.form-input:focus {
  border-color: #A51515;
  box-shadow: 0 0 0 1rpx #A51515;
}

.form-ph {
  color: #a0a6ad;
  font-size: 28rpx;
}

/* ==================== 文本域 ==================== */
.form-textarea {
  width: 100%;
  min-height: 200rpx;
  padding: 20rpx 24rpx;
  background: #ffffff;
  border: 2rpx solid #edebe9;
  border-radius: 8px;
  font-size: 28rpx;
  color: #323130;
  line-height: 1.6;
  box-sizing: border-box;
  box-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.05, 0.7, 0.1, 1.0);
}

.form-textarea:focus {
  border-color: #A51515;
  box-shadow: 0 0 0 1rpx #A51515;
}

.char-count {
  display: block;
  text-align: right;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #a0a6ad;
}

/* ==================== 标签组 ==================== */
.tag-group {
  display: flex;
  flex-wrap: wrap;
}

.tag-item {
  padding: 12rpx 32rpx;
  margin-right: 16rpx;
  margin-bottom: 16rpx;
  background: #f3f2f1;
  border: 2rpx solid transparent;
  border-radius: 8px;
  font-size: 26rpx;
  color: #323130;
  transition: all 0.4s cubic-bezier(0.05, 0.7, 0.1, 1.0);
}

.tag-item:active {
  transform: scale(0.96);
}

.tag-item.active {
  background: #A51515;
  border-color: #A51515;
  color: #ffffff;
}

/* ==================== 底部占位 ==================== */
.bottom-placeholder {
  height: 240rpx;
}

/* ==================== 底部固定操作栏 ==================== */
.action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 120rpx;
  padding: 0 30rpx;
  padding-bottom: env(safe-area-inset-bottom);
  background: #ffffff;
  border-top: 2rpx solid #edebe9;
  display: flex;
  align-items: center;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.1);
  z-index: 100;
  box-sizing: content-box;
}

.action-btn {
  flex: 1;
  height: 84rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 30rpx;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.05, 0.7, 0.1, 1.0);
}

.action-btn:active {
  transform: scale(0.98);
}

.action-btn.primary {
  background: #A51515;
  color: #ffffff;
  margin-left: 20rpx;
}

.action-btn.primary:active {
  opacity: 0.9;
}

.action-btn.secondary {
  background: #f3f2f1;
  color: #323130;
  border: 2rpx solid #edebe9;
}

.action-btn.secondary:active {
  background: #f8f9fa;
}

.action-btn.disabled {
  opacity: 0.5;
  transform: none;
}
</style>