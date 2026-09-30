<template>
	<view class="page">
		<!--输入区：v-model双向绑定+@confirm回车添加-->
		<view class="input-row">
			<input class="input" v-model.trim="newText" placeholder="请输入待办事项" confirm-type="done" @confirm="addTodo" />
			<button type="primary" size="mini" @click="addTodo">
				添加
			</button>
		</view>
		<!--列表：v-for必须绑:key，值用item.id，严禁用index-->
		<view class="list">
			<view class="item" v-for="item in list" :key="item.id" @click="toggleDone(item)">
				<text :class="{done:item.done}">
					{{item.text}}
				</text>
				<button size="mini" type="warn" @click.stop="deleteItem(item.id)">
					删除
				</button>
			</view>
		</view>
		<view v-if="list.length===0" class="empty">
			<text class="empty-text">
				暂无待办，添加一条吧
			</text>
		</view>
		<!--统计与清空-->
		<view class="stat-row" v-if="list.length>0">
			<text class="stat">
				共{{list.length}}条·未完成{{unDoneCount}}条
			</text>
			<text class="clear" @click="clearDone">
				清空已完成
			</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		computed
	} from 'vue'
	
	const newText = ref('')
	
	//基本类型→ref，要.value
	const list = reactive([])
	//数组→reactive，不整体赋值
	let nextId = 1
	//自增id，严禁拿index当:key
	
	const unDoneCount = computed(() => {
		return list.filter(t => !t.done).length
	})
	
	function addTodo() {
		const text = newText.value
		//ref要.value
		if (!text) {
			//判空
			uni.showToast({ title: '请输入内容', icon: 'none' })
			return
		}
		list.push({ id: nextId++, text, done: false })
		newText.value = ''
		//清空输入框
		uni.showToast({ title: '添加成功', icon: 'success' })
	}
	//点击整项：切换完成/未完成
	
	function toggleDone(item) {
		item.done = !item.done
		//改数据，删除线自己出现
	}
	
	//点删除按钮：.stop保证不会触发父级的toggleDone
	
	function deleteItem(id) {
		const i = list.findIndex(t => t.id === id)
		if (i > -1) list.splice(i, 1)
		//原地改，保住响应
	}
	//清空已完成：不能整体赋值，用splice原地替换
	
	function clearDone() {
		const remain = list.filter(t => !t.done)
		list.splice(0, list.length, ...remain)
		uni.showToast({ title: '已清空完成项', icon: 'success' })
	}
</script>

<style scoped>
	.page {
		padding: 30rpx;
	}
	
	.input-row {
		display: flex;
		align-items: center;
	}
	
	.input {
		flex: 1;
		height: 72rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		border: 1px solid #DDDDDD;
		border-radius: 8rpx;
	}
	
	.empty {
		padding: 120rpx 0;
		text-align: center;
	}
	
	.empty-text {
		font-size: 28rpx;
		color: #999999;
	}
	
	.item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 28rpx 20rpx;
		margin-top: 20rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
	}
	
	.item-text {
		font-size: 30rpx;
		color: #1A1A1A;
	}
	
	.done {
		text-decoration: line-through;
		color: #999999;
	}
	
	.stat-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 40rpx;
		padding: 0 20rpx;
	}
	
	.stat {
		font-size: 26rpx;
		color: #6B7A88;
	}
	
	.clear {
		font-size: 26rpx;
		color: #2683C6;
	}
</style>