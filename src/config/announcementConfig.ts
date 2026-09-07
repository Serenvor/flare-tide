import type { AnnouncementConfig } from "../types/announcementConfig";

export const announcementConfig: AnnouncementConfig = {
	// 公告标题
	title: "🎉 Flare-Tide·汐焰拾叙 🎉",

	// 公告内容
	content: "记下每一次心动，每一次奔赴，把所有的偏爱与心里话，尽数安放于此",

	// 是否允许用户关闭公告
	closable: false,

	link: {
		// 启用链接
		enable: true,
		// 链接文本
		text: "查看故事",
		// 链接 URL
		url: "/about/",
		// 内部链接
		external: false,
	},
};
