import {
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/navBarConfig";

// ============================================================================
// 导航栏配置 - 情侣纪念站专用
// ============================================================================
const getDynamicNavBarConfig = (): NavBarConfig => {
	const links: NavBarLink[] = [];

	// 🏠 初隅
	links.push({
		name: "初隅",
		url: "/",
		icon: "material-symbols:home",
	});

	// 📚 岁隅书辞（下拉菜单）
	links.push({
		name: "岁隅书辞",
		url: "#",
		icon: "material-symbols:auto-stories",
		children: [
			{
				name: "书信集",
				url: "/archive/?category=书信集",
			},
			{
				name: "纪事录",
				url: "/archive/?category=纪事录",
			},
			{
				name: "情绪随笔",
				url: "/archive/?category=情绪随笔",
			},
			{
				name: "碎碎念",
				url: "/archive/?category=碎碎念",
			},
		],
	});

	// 🖼 浮光集
	links.push({
		name: "浮光集",
		url: "/gallery/",
		icon: "material-symbols:photo-library",
	});

	// ⏳ 时序札
	links.push({
		name: "时序札",
		url: "/timeline/",
		icon: "material-symbols:timeline",
	});

	// 💫 寄愿笺
	links.push({
		name: "寄愿笺",
		url: "/wishlist/",
		icon: "material-symbols:star",
	});

	return { links } as NavBarConfig;
};

// 导航搜索配置
export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

// ============================================================================
// 链接预设（保留兼容性）
// ============================================================================
export const LinkPresets: Record<string, NavBarLink> = {
	Home: {
		name: "初隅",
		url: "/",
		icon: "material-symbols:home",
	},
	About: {
		name: "关于我们",
		url: "/about/",
		icon: "material-symbols:person",
	},
	Gallery: {
		name: "浮光集",
		url: "/gallery/",
		icon: "material-symbols:photo-library",
		pageKey: "gallery",
	},
	Guestbook: {
		name: "留言",
		url: "/guestbook/",
		icon: "material-symbols:chat",
		pageKey: "guestbook",
	},
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
