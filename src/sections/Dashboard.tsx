import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatsData, ChartDataPoint, ContentItem } from '@/types';

interface DashboardProps {
  recentItems: ContentItem[];
}

const statsData: StatsData = {
  totalItems: 1248,
  publishedItems: 892,
  draftItems: 256,
  totalViews: 98432,
  newItemsToday: 23,
  weeklyGrowth: 12.5,
};

const weeklyData: ChartDataPoint[] = [
  { name: '周一', value: 65, value2: 45 },
  { name: '周二', value: 89, value2: 67 },
  { name: '周三', value: 72, value2: 58 },
  { name: '周四', value: 120, value2: 89 },
  { name: '周五', value: 95, value2: 74 },
  { name: '周六', value: 48, value2: 35 },
  { name: '周日', value: 38, value2: 28 },
];

const categoryData = [
  { name: '技术文章', count: 342, color: 'bg-blue-500', pct: 34 },
  { name: '产品动态', count: 256, color: 'bg-purple-500', pct: 26 },
  { name: '行业资讯', count: 198, color: 'bg-green-500', pct: 20 },
  { name: '教程指南', count: 165, color: 'bg-orange-500', pct: 13 },
  { name: '其他', count: 87, color: 'bg-gray-400', pct: 7 },
];

const maxBarValue = Math.max(...weeklyData.map(d => d.value));

export default function Dashboard({ recentItems }: DashboardProps) {
  const stats = [
    {
      label: '内容总量',
      value: statsData.totalItems.toLocaleString(),
      sub: `今日新增 ${statsData.newItemsToday}`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-blue-500/10 text-blue-500',
      trend: '+8.2%',
      trendUp: true,
    },
    {
      label: '已发布',
      value: statsData.publishedItems.toLocaleString(),
      sub: `占比 ${Math.round(statsData.publishedItems / statsData.totalItems * 100)}%`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-500/10 text-green-500',
      trend: '+5.1%',
      trendUp: true,
    },
    {
      label: '草稿中',
      value: statsData.draftItems.toLocaleString(),
      sub: '待审核 12 篇',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'bg-yellow-500/10 text-yellow-500',
      trend: '-2.3%',
      trendUp: false,
    },
    {
      label: '总浏览量',
      value: statsData.totalViews.toLocaleString(),
      sub: `周增长 ${statsData.weeklyGrowth}%`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      color: 'bg-purple-500/10 text-purple-500',
      trend: '+12.5%',
      trendUp: true,
    },
  ];

  const statusColor: Record<string, string> = {
    published: 'bg-green-100 text-green-700 border-green-200',
    draft: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    archived: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  const statusLabel: Record<string, string> = {
    published: '已发布',
    draft: '草稿',
    archived: '已归档',
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">数据看板</h2>
        <p className="text-gray-500 text-sm mt-1">欢迎回来！这是您的内容概览。</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-1">
                <span className={`text-xs font-medium ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend}
                </span>
                <span className="text-xs text-gray-400">较上周</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 周发布趋势 */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">本周发布趋势</CardTitle>
                <CardDescription className="text-xs mt-0.5">发布量与浏览量对比</CardDescription>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />发布量</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-purple-400 inline-block" />浏览量(×10)</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-end gap-2 h-40">
              {weeklyData.map((d) => (
                <div key={d.name} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end gap-0.5 h-32">
                    <div
                      className="flex-1 bg-blue-500 rounded-t-sm transition-all duration-500 min-h-[4px]"
                      style={{ height: `${(d.value / maxBarValue) * 100}%` }}
                    />
                    <div
                      className="flex-1 bg-purple-400 rounded-t-sm transition-all duration-500 min-h-[4px]"
                      style={{ height: `${((d.value2 || 0) / maxBarValue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{d.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 内容分类占比 */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">内容分类</CardTitle>
            <CardDescription className="text-xs mt-0.5">各类型内容占比</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {categoryData.map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium">{cat.name}</span>
                  <span className="text-gray-400">{cat.count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`${cat.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 最近内容 */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">最近内容</CardTitle>
              <CardDescription className="text-xs mt-0.5">最新发布或更新的内容</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-0 divide-y divide-gray-50">
            {recentItems.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 hover:bg-gray-50/50 -mx-2 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {item.title.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.author} · {item.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColor[item.status]}`}>
                    {statusLabel[item.status]}
                  </span>
                  <span className="text-xs text-gray-400 hidden sm:block">{item.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
