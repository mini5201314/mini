import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ContentItem } from '@/types';

interface ListManagementProps {
  items: ContentItem[];
  onEdit: (item: ContentItem) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

const STATUS_OPTIONS = [
  { value: 'all', label: '全部状态' },
  { value: 'published', label: '已发布' },
  { value: 'draft', label: '草稿' },
  { value: 'archived', label: '已归档' },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: '全部分类' },
  { value: '技术文章', label: '技术文章' },
  { value: '产品动态', label: '产品动态' },
  { value: '行业资讯', label: '行业资讯' },
  { value: '教程指南', label: '教程指南' },
  { value: '其他', label: '其他' },
];

const statusStyle: Record<string, string> = {
  published: 'bg-green-100 text-green-700 border-green-200',
  draft: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  archived: 'bg-gray-100 text-gray-500 border-gray-200',
};
const statusLabel: Record<string, string> = {
  published: '已发布',
  draft: '草稿',
  archived: '已归档',
};

export default function ListManagement({ items, onEdit, onDelete, onAdd }: ListManagementProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const pageSize = 8;

  // 过滤
  const filtered = items.filter(item => {
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.author.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedIds.length === paged.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paged.map(i => i.id));
    }
  };

  const handleSearch = (v: string) => {
    setSearch(v);
    setCurrentPage(1);
  };

  const handleDeleteConfirm = (id: number) => {
    onDelete(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-4">
      {/* 标题栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">内容管理</h2>
          <p className="text-gray-500 text-sm mt-0.5">共 {filtered.length} 条内容</p>
        </div>
        <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-500 text-white shadow-sm gap-2 self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建内容
        </Button>
      </div>

      {/* 筛选栏 */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                placeholder="搜索标题、作者..."
                value={search}
                onChange={e => handleSearch(e.target.value)}
                className="pl-9 bg-gray-50 border-gray-200 focus:bg-white h-9 text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="h-9 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 min-w-[120px]"
            >
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select
              value={categoryFilter}
              onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="h-9 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 min-w-[120px]"
            >
              {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* 批量操作 */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
          <span className="text-sm text-blue-700 font-medium">已选 {selectedIds.length} 项</span>
          <button
            className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline"
            onClick={() => { selectedIds.forEach(id => onDelete(id)); setSelectedIds([]); }}
          >
            批量删除
          </button>
          <button
            className="text-xs text-gray-500 hover:text-gray-700 ml-auto"
            onClick={() => setSelectedIds([])}
          >
            取消
          </button>
        </div>
      )}

      {/* 表格 */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={paged.length > 0 && selectedIds.length === paged.length}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">标题</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3 hidden md:table-cell">分类</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3 hidden sm:table-cell">作者</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">状态</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3 hidden lg:table-cell">浏览量</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3 hidden xl:table-cell">更新时间</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-400">
                    <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm">暂无数据</p>
                  </td>
                </tr>
              ) : paged.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors group">
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-3.5 max-w-[200px]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-purple-500 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {item.title.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate" title={item.title}>{item.title}</p>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex gap-1 mt-0.5">
                            {item.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-xs text-gray-400 bg-gray-100 px-1.5 rounded">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 hidden md:table-cell">
                    <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-medium">{item.category}</span>
                  </td>
                  <td className="px-3 py-3.5 text-sm text-gray-600 hidden sm:table-cell">{item.author}</td>
                  <td className="px-3 py-3.5">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${statusStyle[item.status]}`}>
                      {statusLabel[item.status]}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-sm text-gray-500 hidden lg:table-cell">{item.views.toLocaleString()}</td>
                  <td className="px-3 py-3.5 text-xs text-gray-400 hidden xl:table-cell">{item.updatedAt}</td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="编辑"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {deleteConfirm === item.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteConfirm(item.id)}
                            className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >确认</button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors"
                          >取消</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(item.id)}
                          className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="删除"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              显示 {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} / {filtered.length} 条
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-2.5 py-1.5 text-xs rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                上一页
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-7 text-xs rounded border transition-colors ${currentPage === page ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-2.5 py-1.5 text-xs rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
