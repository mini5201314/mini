// 测试代码上传
// 用户相关类型
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  createdAt: string;
  avatar?: string;
}

// 内容管理类型
export interface ContentItem {
  id: number;
  title: string;
  category: string;
  author: string;
  status: 'published' | 'draft' | 'archived';
  views: number;
  createdAt: string;
  updatedAt: string;
  description?: string;
  tags?: string[];
}

// 表单编辑数据类型
export interface ContentForm {
  title: string;
  category: string;
  status: 'published' | 'draft' | 'archived';
  description: string;
  tags: string;
}

// 统计数据类型
export interface StatsData {
  totalItems: number;
  publishedItems: number;
  draftItems: number;
  totalViews: number;
  newItemsToday: number;
  weeklyGrowth: number;
}

// 图表数据类型
export interface ChartDataPoint {
  name: string;
  value: number;
  value2?: number;
}

// 路由页面类型
export type PageType = 'login' | 'dashboard' | 'list' | 'form';

// 应用全局状态
export interface AppState {
  isLoggedIn: boolean;
  currentUser: User | null;
  currentPage: PageType;
  editingItem: ContentItem | null;
}
