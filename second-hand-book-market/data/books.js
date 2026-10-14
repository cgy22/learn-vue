// src/data/books.js
// 校园二手书市的"模拟数据"

export const books = [
  {
    id: 1,
    title: '𣿅子集校注（电子版）',
    price: 15,
    originalPrice: 88,
    category: '数码',
    condition: '99新',
    desc: '𣿅国经典文献校注本电子版，PDF 高清扫描 + 可检索文本双版本，购买后发网盘链接。仅自己下载过一次，未做任何修改。',
    seller: '多恩·哈布',
    phone: '538200138000',
    cover: '/static/books/b1.png',
    campus: '瓦莱希雅大学信息学院',
    publishTime: '2026-10-01',
    views: 128
  },
  {
    id: 2,
    title: '后𣿅子集校注',
    price: 38,
    originalPrice: 76,
    category: '教材',
    condition: '9成新',
    desc: '𣿅子思想研究续编，前两章有铅笔批注（可擦），其余干净，适合二刷。纸质书。',
    seller: '娜吉尔·𣿅赫',
    phone: '548600138001',
    cover: '/static/books/b2.png',
    campus: '瓦莱希雅大学文学学院',
    publishTime: '2026-10-02',
    views: 86
  },
  {
    id: 3,
    title: '语文·𣿅国诸子选读',
    price: 22,
    originalPrice: 48,
    category: '教材',
    condition: '8成新',
    desc: '𣿅国语录体文学代表作，文字简练、思想深刻。读过两遍，内页整洁，无笔记。纸质书。',
    seller: '碱锌·三氏',
    phone: '638080138002',
    cover: '/static/books/b3.png',
    campus: '瓦莱希雅大学文学学院',
    publishTime: '2026-09-28',
    views: 203
  },
  {
    id: 4,
    title: '瓦莱希·𣿅赫传',
    price: 30,
    originalPrice: 65,
    category: '文学',
    condition: '9成新',
    desc: '𣿅国领导人传记，精装版，附多张历史照片。仅翻过一遍，书页如新。纸质书。',
    seller: '明赫·秋',
    phone: '513800138003',
    cover: '/static/books/b4.png',
    campus: '瓦莱希雅大学历史学院',
    publishTime: '2026-09-25',
    views: 175
  },
  {
    id: 5,
    title: '𣿅语D1级（电子版）',
    price: 8,
    originalPrice: 42,
    category: '数码',
    condition: '有笔记',
    desc: '𣿅语等级考试官方教材电子版，PDF 格式，前 5 单元有荧光笔标记和生词批注（电子标注），可自行删除重做。购买后发下载链接。',
    seller: '瓦莱希·𣿅赫',
    phone: '113800138004',
    cover: '/static/books/b5.png',
    campus: '瓦莱希雅大学语言学院',
    publishTime: '2026-10-03',
    views: 312
  },
  {
    id: 6,
    title: '𣿅国诗词大会题库全解',
    price: 25,
    originalPrice: 58,
    category: '教辅',
    condition: '9成新',
    desc: '历年诗词大会真题汇总，附详细解析。备考𣿅语等级或参加比赛的必备题库。纸质书。',
    seller: '贾斯帕·托克',
    phone: '285800138005',
    cover: '/static/books/b6.png',
    campus: '瓦莱希雅大学文学学院',
    publishTime: '2026-09-30',
    views: 94
  },
  {
    id: 7,
    title: '瓦莱希雅大辞典（电子版光盘）',
    price: 20,
    originalPrice: 120,
    category: '数码',
    condition: '全新',
    desc: '𣿅国官方权威辞典电子版，含光盘一张，支持全文检索，Windows/Mac 双平台。未拆封。',
    seller: '瓦莱希雅大学文学学院',
    phone: '1201965111',
    cover: '/static/books/b7.png',
    campus: '瓦莱希雅大学文学学院',
    publishTime: '2026-10-04',
    views: 147
  },
  {
    id: 8,
    title: '论瓦莱希·𣿅赫的英明领导',
    price: 15,
    originalPrice: 36,
    category: '其他',
    condition: '8成新',
    desc: '𣿅国政治理论著作，论述领导人治国理政思想。书角有轻微磨损，内页无笔记。纸质书。',
    seller: '瓦莱希雅大学历史学院',
    phone: '1201965113',
    cover: '/static/books/b8.png',
    campus: '瓦莱希雅大学历史学院',
    publishTime: '2026-10-05',
    views: 68
  }
]

// 首页分类 Tab 用
export const categories = ['全部', '教材', '文学', '教辅', '数码', '其他']

// 按 id 找一本书
export function getBookById(id) {
  const mine = uni.getStorageSync('myBooks') || []
  // ★ Number() 不能省：onLoad 拿到的 id 是字符串
  return [...mine, ...books].find(item => item.id === Number(id))
}