import type { GalleryConfig } from "@/types/galleryConfig";

// 相册配置
export const galleryConfig: GalleryConfig = {
	// 相册列表
	albums: [
		// === 双影同栖 ===
		{
			id: "couple-together",
			name: "Ethereal · 双影同栖",
			nameEn: "Ethereal",
			description: "镜头定格，并肩相伴的时刻",
			subtitle: "这里存放我们二人同框的照片，每一张都是我和你并肩相伴的时刻",
			tags: ["双影同栖"],
		},
		// === 婷影留光 ===
		{
			id: "ting-photos",
			name: "Serene · 婷影留光",
			nameEn: "Serene",
			description: "收集你的每一帧模样",
			subtitle: "属于你的单人影像，记录我眼里你安静美好的模样",
			tags: ["婷影留光"],
		},
		// === 斐拾光景 ===
		{
			id: "pei-scenery",
			name: "Limerence · 斐拾光景",
			nameEn: "Limerence",
			description: "属于我的细碎瞬间",
			subtitle: "属于我的单人影像，留存你眼中的我的样子",
			tags: ["斐拾光景"],
		},
		// === 人间食味 ===
		{
			id: "food",
			name: "Savor · 人间食味",
			nameEn: "Savor",
			description: "三餐烟火，与你共尝",
			subtitle: "存放着我们一起吃过的各色美食，留存那共享烟火滋味的瞬间",
			tags: ["人间食味"],
		},
		// === 闲趣赴欢 ===
		{
			id: "leisure",
			name: "Echo · 闲趣赴欢",
			nameEn: "Echo",
			description: "细碎玩乐，岁岁欢愉",
			subtitle: "收纳我们一起看电影、玩乐的碎片，记下共同消遣的欢喜",
			tags: ["闲趣赴欢"],
		},
		// === 山野远行 ===
		{
			id: "travel-nature",
			name: "Wander · 山野远行",
			nameEn: "Wander",
			description: "奔赴风景，一路同行",
			subtitle: "是我们一同看过的山河风光，收录出门远行遇见的风景",
			tags: ["山野远行"],
		},
		// === 絮语存档 ===
		{
			id: "messages",
			name: "Whisper · 絮语存档",
			nameEn: "Whisper",
			description: "文字往来，句句心动",
			subtitle: "保存着我们日常聊天的截图，收藏彼此细碎温柔的对话",
			tags: ["絮语存档"],
		},
		// === 锦札寄意 ===
		{
			id: "gifts",
			name: "Petrichor · 锦札寄意",
			nameEn: "Petrichor",
			description: "每份惊喜，皆是满心偏爱",
			subtitle: "记录我们互相准备的小惊喜，珍藏这些不期而遇的心意",
			tags: ["锦札寄意"],
		},
	],

	// 瀑布流最小列宽(px)
	columnWidth: 240,
};
