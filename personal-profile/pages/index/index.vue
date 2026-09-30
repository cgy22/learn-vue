<template>
	<div class="profile-page">
		<div class="avatar-wrapper">
			<img class="avatar" src="/static/avatar.png" alt="cgy22 Avatar" />
		</div>

		<h1 class="profile-title">Hi there, I'm cgy22! 👋</h1>

		<h3 class="hint">⬇️ Scroll down for more info... ⬇️</h3>

		<img class="profile-banner" src="/static/banner-main.jpg" alt="Main Profile Banner" />

		<div class="language-selector">🌐 <em>Select Language</em></div>

		<hr class="divider" />

		<details open class="lang-section section-container">
			<summary><b>English</b></summary>

			<p class="intro-text">
				I'm a computer science major and developer. I'm all about bridging the gap
				between logic and creativity—whether I'm coding or arranging a symphony.
			</p>

			<h4 class="section-title">💻 My Tech Stack</h4>

			<p class="stack-label"><strong>Mainly Using:</strong></p>
			<div class="badge-group">
				<img src="https://img.shields.io/badge/c++-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white"
					alt="C++" />
				<img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white"
					alt="HTML5" />
				<img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white"
					alt="CSS3" />
				<img src="https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black"
					alt="JavaScript" />
				<img src="https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white"
					alt="PHP" />
			</div>

			<p class="stack-label"><strong>Also Explored / Learning:</strong></p>
			<div class="badge-group">
				<img src="https://img.shields.io/badge/c-%2300599C.svg?style=for-the-badge&logo=c&logoColor=white"
					alt="C" />
				<img src="https://img.shields.io/badge/python-%233776AB.svg?style=for-the-badge&logo=python&logoColor=white"
					alt="Python" />
			</div>

			<p class="stack-label"><strong>Future Plans:</strong></p>
			<div class="badge-group">
				<img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white"
					alt="Java" />
				<img src="https://img.shields.io/badge/Assembly-6E4C13?style=for-the-badge&logo=asm&logoColor=white"
					alt="Assembly" />
			</div>

			<h4 class="section-title">🚂 My Tracks &amp; Interests</h4>
			<ul class="interest-list">
				<li><strong>✈️ Aviation:</strong> I'm a huge aviation geek. I love following flights, airline
					operations, and global routes.</li>
				<li><strong>🚄 Transit &amp; Railways:</strong> From heavy rail to subways, light rail, and monorails—if
					it runs on tracks, I'm probably tracking it.</li>
				<li><strong>🪟 Windows Insider:</strong> A tech enthusiast who loves running bleeding-edge OS builds and
					testing new features. I'm on Experimental Channel now.</li>
				<li><strong>🎼 Symphonic Music:</strong> I play a few different instruments and spend my free time
					composing and arranging full orchestral scores.</li>
			</ul>
		</details>

		<hr class="divider" />

		<details class="lang-section section-container">
			<summary><b>简体中文 (Simplified Chinese)</b></summary>

			<p class="intro-text">
				我是一名计算机科学与技术（计科）专业的学生兼开发者。无论是编写代码，还是谱写一首交响乐，我都享受这种将逻辑与创意完美融合的过程。
			</p>

			<h4 class="section-title">💻 我的技术栈</h4>

			<p class="stack-label"><strong>常用技术：</strong></p>
			<div class="badge-group">
				<img src="https://img.shields.io/badge/c++-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white"
					alt="C++" />
				<img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white"
					alt="HTML5" />
				<img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white"
					alt="CSS3" />
				<img src="https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black"
					alt="JavaScript" />
				<img src="https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white"
					alt="PHP" />
			</div>

			<p class="stack-label"><strong>接触过 / 计划学习：</strong></p>
			<div class="badge-group">
				<img src="https://img.shields.io/badge/c-%2300599C.svg?style=for-the-badge&logo=c&logoColor=white"
					alt="C" />
				<img src="https://img.shields.io/badge/python-%233776AB.svg?style=for-the-badge&logo=python&logoColor=white"
					alt="Python" />
			</div>

			<p class="stack-label"><strong>未来计划：</strong></p>
			<div class="badge-group">
				<img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white"
					alt="Java" />
				<img src="https://img.shields.io/badge/Assembly-6E4C13?style=for-the-badge&logo=asm&logoColor=white"
					alt="Assembly" />
			</div>

			<h4 class="section-title">🚂 兴趣与爱好</h4>
			<ul class="interest-list">
				<li><strong>✈️ 航空：</strong> 妥妥的飞友一枚。对飞行、航司运营以及全球航线网路非常感兴趣。</li>
				<li><strong>🚄 轨道交通：</strong> 无论是国铁、地铁、有轨电车还是单轨——只要是跑在轨道上的，我都喜欢。</li>
				<li><strong>🪟 Windows 预览体验计划：</strong> 操作系统发烧友，喜欢第一时间体验最新、最前沿的系统特性。我现在在 Experimental 通道。</li>
				<li><strong>🎼 交响乐与作曲：</strong> 会演奏几种乐器，平时喜欢自己创作和改编交响乐总谱。</li>
			</ul>
		</details>

		<hr class="divider" />

		<details class="lang-section section-container">
			<summary><b>繁體中文 (Traditional Chinese)</b></summary>

			<p class="intro-text">
				我是一名資訊工程（資工）專業的學生兼軟體開發者。無論是撰寫程式碼，還是譜寫一首交響樂，我都享受這種將邏輯與創意完美融合的過程。
			</p>

			<h4 class="section-title">💻 我的技術棧</h4>

			<p class="stack-label"><strong>常用技術：</strong></p>
			<div class="badge-group">
				<img src="https://img.shields.io/badge/c++-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white"
					alt="C++" />
				<img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white"
					alt="HTML5" />
				<img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white"
					alt="CSS3" />
				<img src="https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black"
					alt="JavaScript" />
				<img src="https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white"
					alt="PHP" />
			</div>

			<p class="stack-label"><strong>接觸過 / 計劃學習：</strong></p>
			<div class="badge-group">
				<img src="https://img.shields.io/badge/c-%2300599C.svg?style=for-the-badge&logo=c&logoColor=white"
					alt="C" />
				<img src="https://img.shields.io/badge/python-%233776AB.svg?style=for-the-badge&logo=python&logoColor=white"
					alt="Python" />
			</div>

			<p class="stack-label"><strong>未來計劃：</strong></p>
			<div class="badge-group">
				<img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white"
					alt="Java" />
				<img src="https://img.shields.io/badge/Assembly-6E4C13?style=for-the-badge&logo=asm&logoColor=white"
					alt="Assembly" />
			</div>

			<h4 class="section-title">🚂 興趣與愛好</h4>
			<ul class="interest-list">
				<li><strong>✈️ 航空：</strong> 妥妥的飛機迷（飛友）。對飛行、航司營運以及全球航網非常感興趣。</li>
				<li><strong>🚄 鐵道：</strong> 無論是台鐵/高鐵、捷運、輕軌還是單軌——只要是跑在軌道上的，我都有研究。</li>
				<li><strong>🪟 Windows 測試人員計畫：</strong> 作業系統愛好者，喜歡第一時間體驗最新、最前沿的系統特性。我現在在 Experimental 通道。</li>
				<li><strong>🎼 交響樂與作曲：</strong> 會演奏幾種樂器，平時喜歡自己創作和編配交響樂總譜。</li>
			</ul>
		</details>

		<hr class="divider" />

		<div class="github-cta section-container">
			<p>Find me on GitHub — repositories, experiments, and probably nothing useful to see :l</p>
			<a class="btn btn-primary github-btn" href="https://github.com/cgy22" target="_blank"
				rel="noopener noreferrer">
				<i class="fab fa-github"></i> Visit My GitHub
			</a>
		</div>
	</div>
</template>

<script setup>
	// 纯展示型个人介绍页，无需响应式状态或交互逻辑。
</script>

<style scoped>
	.profile-page {
		max-width: 900px;
		margin: 0 auto;
		padding: 40px 20px 60px;
		font-family: 'Open Sans', 'Noto Sans SC', -apple-system, BlinkMacSystemFont,
			'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		color: var(--text-color);
		line-height: 1.6;
	}

	.avatar-wrapper {
		display: flex;
		justify-content: center;
		margin-bottom: 24px;
		margin-top: 100px;
	}

	.avatar {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		object-fit: cover;
		border: 3px solid var(--primary-color);
		box-shadow: 0 4px 16px var(--shadow-color);
		background: var(--secondary-color);
	}

	.profile-banner {
		display: block;
		width: 100%;
		object-fit: cover;
		border-radius: var(--border-radius);
		margin-bottom: 24px;
		box-shadow: 0 4px 16px var(--shadow-color);
	}

	.profile-title {
		text-align: center;
		font-size: 28px;
		font-weight: 700;
		color: var(--primary-color);
		margin-bottom: 50px;

	}

	.hint {
		text-align: center;
		font-size: 18px;
		margin-bottom: 120px;
	}

	.language-selector {
		text-align: center;
		font-size: 14px;
		opacity: 0.7;
		margin-bottom: 16px;
	}

	.divider {
		border: none;
		border-top: 1px solid var(--border-color);
		margin: 28px 0;
	}

	.lang-section {
		margin-bottom: 20px;
		padding: 24px 28px;
		border-radius: 16px;
	}

	.lang-section summary {
		cursor: pointer;
		font-size: 17px;
		color: var(--primary-color);
		list-style: none;
		padding: 4px 0;
	}

	.lang-section summary::-webkit-details-marker {
		display: none;
	}

	.lang-section summary::before {
		content: '▸ ';
		display: inline-block;
		transition: transform 0.2s var(--animation-curve);
	}

	.lang-section[open] summary::before {
		transform: rotate(90deg);
	}

	.intro-text {
		margin: 16px 0 24px;
		font-size: 15px;
		acity: 0.9;
	}

	.section-title {
		font-size: 17px;
		font-weight: 700;
		color: var(--primary-color);
		margin: 24px 0 12px;
	}

	.stack-label {
		margin: 12px 0 8px;
		font-size: 14px;
	}

	.badge-group {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 8px;
	}

	.badge-group img {
		height: 28px;
	}

	.interest-list {
		margin: 8px 0 0 20px;
		padding: 0;
	}

	.interest-list li {
		margin: 10px 0;
		line-height: 1.7;
	}

	.interest-list li::marker {
		color: var(--primary-color);
		font-weight: bold;
	}

	.github-cta {
		text-align: center;
		padding: 30px 24px;
		border-radius: 16px;
	}

	.github-cta p {
		margin-bottom: 18px;
		font-size: 15px;
		opacity: 0.85;
	}

	.github-btn {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		font-size: 15px;
		padding: 12px 24px;
	}

	@media (max-width: 640px) {
		.profile-page {
			padding: 24px 14px 40px;
		}

		.profile-title {
			font-size: 22px;
		}

		.lang-section {
			padding: 18px 16px;
		}

		.avatar {
			width: 96px;
			height: 96px;
		}

		.profile-banner {
			max-height: 160px;
		}
	}
</style>