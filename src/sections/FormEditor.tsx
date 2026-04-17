import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ContentItem, ContentForm } from '@/types';

interface FormEditorProps {
  editingItem: ContentItem | null;
  onSave: (data: ContentForm) => void;
  onCancel: () => void;
}

const CATEGORIES = ['技术文章', '产品动态', '行业资讯', '教程指南', '其他'];

export default function FormEditor({ editingItem, onSave, onCancel }: FormEditorProps) {
  const [form, setForm] = useState<ContentForm>({
    title: '',
    category: '技术文章',
    status: 'draft',
    description: '',
    tags: '',
  });
  const [errors, setErrors] = useState<Partial<ContentForm>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setForm({
        title: editingItem.title,
        category: editingItem.category,
        status: editingItem.status,
        description: editingItem.description || '',
        tags: (editingItem.tags || []).join(', '),
      });
    } else {
      setForm({ title: '', category: '技术文章', status: 'draft', description: '', tags: '' });
    }
    setErrors({});
    setSaved(false);
  }, [editingItem]);

  const validate = (): boolean => {
    const errs: Partial<ContentForm> = {};
    if (!form.title.trim()) errs.title = '请输入标题';
    else if (form.title.length < 2) errs.title = '标题至少2个字符';
    else if (form.title.length > 100) errs.title = '标题不超过100个字符';
    if (!form.description.trim()) errs.description = '请输入内容描述';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const set = (field: keyof ContentForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const isEditing = !!editingItem;

  return (
    <div className="space-y-5">
      {/* 标题 */}
      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{isEditing ? '编辑内容' : '新建内容'}</h2>
          <p className="text-gray-500 text-sm mt-0.5">{isEditing ? `正在编辑：${editingItem!.title}` : '填写以下信息创建新内容'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* 主内容区 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 基本信息 */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-700">基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {/* 标题 */}
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    标题 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={e => set('title', e.target.value)}
                    placeholder="请输入内容标题"
                    className={`h-10 ${errors.title ? 'border-red-400 focus-visible:ring-red-400/30' : 'border-gray-200'}`}
                    maxLength={100}
                  />
                  <div className="flex justify-between items-center">
                    {errors.title ? (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        {errors.title}
                      </p>
                    ) : <span />}
                    <span className="text-xs text-gray-400">{form.title.length}/100</span>
                  </div>
                </div>

                {/* 描述 */}
                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    内容描述 <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    placeholder="请输入内容描述或摘要..."
                    rows={5}
                    className={`w-full px-3 py-2 text-sm rounded-md border resize-none focus:outline-none focus:ring-2 transition-colors ${
                      errors.description
                        ? 'border-red-400 focus:ring-red-400/30'
                        : 'border-gray-200 focus:border-blue-400 focus:ring-blue-400/20'
                    }`}
                    maxLength={500}
                  />
                  <div className="flex justify-between">
                    {errors.description ? (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        {errors.description}
                      </p>
                    ) : <span />}
                    <span className="text-xs text-gray-400">{form.description.length}/500</span>
                  </div>
                </div>

                {/* 标签 */}
                <div className="space-y-1.5">
                  <Label htmlFor="tags" className="text-sm font-medium text-gray-700">标签</Label>
                  <Input
                    id="tags"
                    value={form.tags}
                    onChange={e => set('tags', e.target.value)}
                    placeholder="多个标签用逗号分隔，例如：React, TypeScript, 前端"
                    className="h-10 border-gray-200"
                  />
                  <p className="text-xs text-gray-400">用英文逗号分隔多个标签</p>
                  {form.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {form.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                        <span key={tag} className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 侧边设置区 */}
          <div className="space-y-4">
            {/* 分类与状态 */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-700">发布设置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {/* 状态 */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">发布状态</Label>
                  <div className="space-y-2">
                    {[
                      { value: 'draft', label: '草稿', desc: '仅自己可见', icon: '📝', color: 'border-yellow-400 bg-yellow-50' },
                      { value: 'published', label: '已发布', desc: '公开展示', icon: '✅', color: 'border-green-400 bg-green-50' },
                      { value: 'archived', label: '归档', desc: '不再展示', icon: '📦', color: 'border-gray-400 bg-gray-50' },
                    ].map(opt => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                          form.status === opt.value ? opt.color : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={opt.value}
                          checked={form.status === opt.value}
                          onChange={() => set('status', opt.value)}
                          className="accent-blue-600"
                        />
                        <span className="text-base">{opt.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                          <p className="text-xs text-gray-400">{opt.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 分类 */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">内容分类</Label>
                  <select
                    value={form.category}
                    onChange={e => set('category', e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 space-y-2.5">
                <Button
                  type="submit"
                  className={`w-full h-10 font-medium transition-all duration-200 shadow-sm ${
                    saved
                      ? 'bg-green-500 hover:bg-green-500 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {saved ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      保存成功
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      {isEditing ? '保存修改' : '创建内容'}
                    </span>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="w-full h-10 border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  取消
                </Button>
              </CardContent>
            </Card>

            {/* 提示信息 */}
            {isEditing && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-600 space-y-1">
                <p className="font-medium">编辑信息</p>
                <p>作者：{editingItem!.author}</p>
                <p>创建：{editingItem!.createdAt}</p>
                <p>浏览量：{editingItem!.views.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
