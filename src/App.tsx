import { useState } from 'react';
import LoginPage from './sections/LoginPage';
import Dashboard from './sections/Dashboard';
import ListManagement from './sections/ListManagement';
import FormEditor from './sections/FormEditor';
import Sidebar from './sections/Sidebar';
import { User, ContentItem, ContentForm, PageType } from './types';

// Mock 数据
const MOCK_ITEMS: ContentItem[] = [
  { id: 1, title: 'React 18 新特性深度解析', category: '技术文章', author: '张三', status: 'published', views: 3420, createdAt: '2026-03-01', updatedAt: '2026-04-10', description: '深入探讨 React 18 带来的并发模式、自动批处理等新特性。', tags: ['React', '前端'] },
  { id: 2, title: 'TypeScript 5.0 实用技巧', category: '技术文章', author: '李四', status: 'published', views: 2180, createdAt: '2026-03-05', updatedAt: '2026-04-11', description: 'TypeScript 5.0 最实用的新语法与类型技巧总结。', tags: ['TypeScript'] },
  { id: 3, title: '2026 产品路线图发布', category: '产品动态', author: '王五', status: 'published', views: 5600, createdAt: '2026-03-10', updatedAt: '2026-04-12', description: '正式发布 2026 年度产品规划与功能路线图。', tags: ['产品', '路线图'] },
  { id: 4, title: 'Tailwind CSS 最佳实践', category: '教程指南', author: '张三', status: 'draft', views: 0, createdAt: '2026-04-01', updatedAt: '2026-04-14', description: '系统整理 Tailwind CSS 在大型项目中的最佳使用实践。', tags: ['CSS', '前端'] },
  { id: 5, title: '云原生架构设计指南', category: '技术文章', author: '赵六', status: 'published', views: 1890, createdAt: '2026-03-20', updatedAt: '2026-04-09', description: '从零开始的云原生架构设计与实施方案。', tags: ['云原生', '架构'] },
  { id: 6, title: 'AI 行业年度报告 2026', category: '行业资讯', author: '李四', status: 'published', views: 8920, createdAt: '2026-02-15', updatedAt: '2026-04-08', description: '全面梳理 2026 年 AI 行业发展动态与趋势展望。', tags: ['AI', '报告'] },
  { id: 7, title: '微前端架构实战', category: '技术文章', author: '王五', status: 'archived', views: 1230, createdAt: '2025-12-01', updatedAt: '2026-03-30', description: '基于 qiankun 的微前端架构实战经验分享。', tags: ['微前端'] },
  { id: 8, title: 'Node.js 性能优化指南', category: '教程指南', author: '张三', status: 'draft', views: 0, createdAt: '2026-04-15', updatedAt: '2026-04-15', description: '深度解析 Node.js 性能瓶颈与优化策略。', tags: ['Node.js', '性能'] },
  { id: 9, title: 'Vue 3 组件设计模式', category: '技术文章', author: '陈七', status: 'published', views: 2640, createdAt: '2026-03-25', updatedAt: '2026-04-13', description: 'Vue 3 常用组件设计模式与最佳实践。', tags: ['Vue', '组件'] },
  { id: 10, title: '低代码平台调研报告', category: '行业资讯', author: '赵六', status: 'draft', views: 0, createdAt: '2026-04-16', updatedAt: '2026-04-16', description: '国内外主流低代码平台横向对比调研报告。', tags: ['低代码'] },
  { id: 11, title: 'Vite 构建工具实战', category: '教程指南', author: '李四', status: 'published', views: 1760, createdAt: '2026-03-18', updatedAt: '2026-04-07', description: 'Vite 构建工具的配置与性能优化实战教程。', tags: ['Vite', '构建'] },
  { id: 12, title: '数据可视化设计规范', category: '产品动态', author: '王五', status: 'published', views: 3100, createdAt: '2026-03-22', updatedAt: '2026-04-06', description: '面向业务的数据可视化设计规范与组件库建设。', tags: ['可视化', '设计'] },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [items, setItems] = useState<ContentItem[]>(MOCK_ITEMS);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    setMobileSidebarOpen(false);
  };

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setCurrentPage('form');
  };

  const handleAdd = () => {
    setEditingItem(null);
    setCurrentPage('form');
  };

  const handleDelete = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSave = (data: ContentForm) => {
    const now = new Date().toISOString().split('T')[0];
    if (editingItem) {
      setItems(prev => prev.map(item =>
        item.id === editingItem.id
          ? {
              ...item,
              title: data.title,
              category: data.category,
              status: data.status,
              description: data.description,
              tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
              updatedAt: now,
            }
          : item
      ));
    } else {
      const newItem: ContentItem = {
        id: Date.now(),
        title: data.title,
        category: data.category,
        status: data.status,
        description: data.description,
        tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
        author: currentUser?.username || '未知',
        views: 0,
        createdAt: now,
        updatedAt: now,
      };
      setItems(prev => [newItem, ...prev]);
    }
  };

  const handleFormCancel = () => {
    setCurrentPage('list');
    setEditingItem(null);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const pageTitles: Record<PageType, string> = {
    login: '',
    dashboard: '数据看板',
    list: '内容管理',
    form: editingItem ? '编辑内容' : '新建内容',
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* 移动端遮罩 */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 — 桌面端固定，移动端抽屉 */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 lg:z-auto
        transition-transform duration-300
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          user={currentUser!}
          onLogout={handleLogout}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(p => !p)}
        />
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 顶部导航 */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 gap-3 shrink-0 shadow-sm">
          {/* 移动端菜单按钮 */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* 面包屑 */}
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-gray-400">首页</span>
            <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium text-gray-900">{pageTitles[currentPage]}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* 通知 */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* 用户头像 */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {currentUser?.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{currentUser?.username}</span>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {currentPage === 'dashboard' && (
            <Dashboard recentItems={items} />
          )}
          {currentPage === 'list' && (
            <ListManagement
              items={items}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
            />
          )}
          {currentPage === 'form' && (
            <FormEditor
              editingItem={editingItem}
              onSave={handleSave}
              onCancel={handleFormCancel}
            />
          )}
        </main>
      </div>
    </div>
  );
}
