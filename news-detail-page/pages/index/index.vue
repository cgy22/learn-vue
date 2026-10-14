<template>  <view class="page">    <view v-if="detail" class="article">      <text class="title">{{ detail.title }}</text>      <view class="meta">        <text class="source">{{ detail.source }}</text>        <text class="time">{{ detail.time }}</text>      </view>      <image class="banner" :src="detail.thumb" mode="aspectFill" />       <!-- 点赞数：下拉刷新后会变 -->      <view class="stat">        <text class="likes">👍 {{ detail.likes }} 人觉得有用</text>        <text class="refresh-hint">下拉可刷新</text>      </view>       <text class="body">{{ detail.content }}</text>       <!-- 作者信息：复制、拨号的对象 -->      <view class="author">        <text class="author-name">作者：{{ detail.author }}</text>        <text class="author-phone">{{ detail.phone }}</text>      </view>    </view>
	<!-- 兜底空态：参数错了、数据被删了都不至于白屏 -->    <view v-else class="empty">      <text>没有找到这条新闻</text>    </view>     <view class="bottom-space" />   <!-- 给底部栏留位置 -->
	<!-- 顶部返回条：演示 navigateBack -->    <view v-if="detail" class="nav-back" @click="goBack">      <text class="nav-back-text">← 返回列表</text>    </view>     <!-- 底部操作栏：三个按钮，每个都有反馈 -->    <view v-if="detail" class="action-bar">      <view class="action" @click="copyAuthor">        <text class="action-icon">📋</text>        <text class="action-text">复制作者</text>      </view>      <view class="action" @click="callAuthor">        <text class="action-icon">📞</text>        <text class="action-text">联系作者</text>      </view>      <view class="action" @click="toggleCollect">        <text class="action-icon">{{ collected ? '⭐' : '☆' }}</text>        <text class="action-text">{{ collected ? '已收藏' : '收藏' }}</text>      </view>    </view>  </view></template>


<script setup>
import { ref } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'   // 关键
import { newsList } from '@/data/news.js'

const detail = ref(null)
const collected = ref(false)

onLoad((options) => {
	const id = options.id || 1     
  
  detail.value = newsList.find(item => item.id === Number(id))
  if (detail.value) {
    collected.value = !!uni.getStorageSync('collected-' + detail.value.id)
  }
})



// ---------- 2. 复制作者：setClipboardData ----------function copyAuthor() {  uni.setClipboardData({    data: detail.value.author,    success: () => {      uni.showToast({ title: '已复制作者名', icon: 'success' })    },    fail: () => {      uni.showToast({ title: '复制失败', icon: 'none' })    }  })}
// ---------- 3. 联系作者：先确认，再拨号 ----------function callAuthor() {  // makePhoneCall 会直接跳系统拨号盘，属于「不可逆」操作  // 所以先用 showModal 让用户确认一次  uni.showModal({    title: '联系作者',    content: '将拨打 ' + detail.value.phone + '，确定吗？',    confirmColor: '#2683C6',    success: (res) => {      // ⚠️ 关键：拨号必须写在 res.confirm 为真的分支里      // 写在 showModal 外面的话，用户点取消也会拨出去      if (!res.confirm) return       uni.makePhoneCall({        phoneNumber: detail.value.phone,        fail: () => {          // H5、部分模拟器不支持拨号，会走到这里          uni.showToast({ title: '当前环境不支持拨号', icon: 'none' })        }      })    }  })}
// ---------- 4. 收藏：切换状态 + 落盘 ----------function toggleCollect() {  collected.value = !collected.value  const key = 'collected-' + detail.value.id   if (collected.value) {    uni.setStorageSync(key, true)    uni.showToast({ title: '已收藏', icon: 'success' })  } else {    uni.removeStorageSync(key)    uni.showToast({ title: '已取消收藏', icon: 'none' })  }}
// ---------- 5. 下拉刷新详情页：点赞数会变 ----------onPullDownRefresh(() => {
	console.log('下拉刷新触发了！')  
  setTimeout(() => {
    if (detail.value) detail.value.likes += Math.ceil(Math.random() * 5)
    uni.stopPullDownRefresh()
    uni.showToast({ title: '点赞数已更新', icon: 'none', duration: 1200 })
  }, 600)
}) // ---------- 6. 返回列表页 ----------function goBack() {  uni.navigateBack()}</script>

<style scoped>.page { padding: 30rpx; background: #FFFFFF; min-height: 100vh; } /* 顶部返回条 */.nav-back { padding: 10rpx 0 24rpx; }.nav-back-text { font-size: 28rpx; color: #2683C6; } .title { font-size: 40rpx; font-weight: bold;         color: #2B3A45; line-height: 1.4; }.meta { display: flex; margin: 20rpx 0 30rpx; }.source { font-size: 24rpx; color: #2683C6; }.time { margin-left: 24rpx; font-size: 24rpx; color: #999999; }.banner { width: 100%; height: 360rpx; border-radius: 12rpx;          background: #EEEEEE; } .stat {  display: flex; align-items: center; justify-content: space-between;  margin-top: 24rpx; padding: 20rpx 24rpx;  background: #F4F6F8; border-radius: 10rpx;}.likes { font-size: 26rpx; color: #2683C6; font-weight: bold; }.refresh-hint { font-size: 22rpx; color: #999999; } .body { display: block; margin-top: 30rpx; font-size: 30rpx;        color: #333333; line-height: 1.8; }
		.author {  display: flex; align-items: center; justify-content: space-between;  margin-top: 40rpx; padding: 24rpx;  background: #EBF7FC; border-radius: 10rpx;}.author-name { font-size: 28rpx; color: #335B74; font-weight: bold; }.author-phone { font-size: 26rpx; color: #6B7A88; } .bottom-space { height: 160rpx; }   /* 给底部固定栏留位置 */.empty { padding: 200rpx 0; text-align: center;         font-size: 28rpx; color: #999999; } /* 底部操作栏：固定在屏幕底部 */.action-bar {  position: fixed; left: 0; right: 0; bottom: 0;  display: flex; align-items: center;  background: #FFFFFF; border-top: 1px solid #EEEEEE;  padding: 16rpx 0 calc(16rpx + env(safe-area-inset-bottom));}.action { flex: 1; display: flex; flex-direction: column;          align-items: center; padding: 12rpx 0; }.action-icon { font-size: 40rpx; }.action-text { margin-top: 6rpx; font-size: 22rpx; color: #6B7A88; }</style>
