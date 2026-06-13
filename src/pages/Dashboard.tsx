import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FileText, Clock, CheckCircle, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '@/api';
import type { DashboardStats, DeviceStat, DeadlineItem, Requirement } from '@/types';
import { formatDate, getStatusColor, getStatusLabel, getPriorityLabel, getDaysRemaining } from '@/utils';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topDevices, setTopDevices] = useState<DeviceStat[]>([]);
  const [pendingReqs, setPendingReqs] = useState<Requirement[]>([]);
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, devicesRes, pendingRes, deadlinesRes] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getTopDevices(),
          dashboardApi.getPendingRequirements(),
          dashboardApi.getDeadlines(),
        ]);
        setStats(statsRes.data.data);
        setTopDevices(devicesRes.data.data);
        setPendingReqs(pendingRes.data.data);
        setDeadlines(deadlinesRes.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = stats ? [
    { label: '需求总数', value: stats.total, icon: FileText, color: 'bg-blue-500', change: '+12%' },
    { label: '待处理', value: stats.pending, icon: Clock, color: 'bg-amber-500', change: '+5%' },
    { label: '处理中', value: stats.processing, icon: AlertTriangle, color: 'bg-purple-500', change: '-3%' },
    { label: '已完成', value: stats.closed, icon: CheckCircle, color: 'bg-green-500', change: '+18%' },
  ] : [];

  const barColors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1', '#14B8A6', '#F97316'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{card.label}</p>
                  <p className="text-3xl font-bold text-slate-800">{card.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600">{card.change}</span>
                    <span className="text-xs text-slate-400">较上月</span>
                  </div>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">高频设备问题统计</h3>
            <span className="text-sm text-slate-500">TOP 8 问题设备型号</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topDevices} layout="vertical" margin={{ left: 20, right: 20 }}>
                <XAxis type="number" />
                <YAxis dataKey="model" type="category" width={180} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {topDevices.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">未响应需求</h3>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
              48小时内
            </span>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {pendingReqs.length === 0 ? (
              <p className="text-center text-slate-500 py-8">暂无未响应需求</p>
            ) : (
              pendingReqs.slice(0, 5).map((req) => {
                const daysLeft = getDaysRemaining(req.responseDeadline);
                return (
                  <div
                    key={req.id}
                    className={`p-3 rounded-lg border cursor-pointer hover:bg-slate-50 transition-colors ${
                      daysLeft < 0 ? 'border-red-300 bg-red-50' : 'border-amber-300 bg-amber-50'
                    }`}
                    onClick={() => navigate(`/requirements/${req.id}`)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{req.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{req.reqNo}</p>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-500">{req.hospital}</span>
                      <span
                        className={`text-xs font-medium ${daysLeft < 0 ? 'text-red-600' : 'text-amber-600'}`}
                      >
                        {daysLeft < 0 ? `逾期 ${Math.abs(daysLeft)} 天` : `${daysLeft} 天后到期`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800">承诺到期事项</h3>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="w-4 h-4" />
            <span>按到期时间排序</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">需求编号</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">标题</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">医院</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">承诺日期</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">剩余时间</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">状态</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {deadlines.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    暂无承诺到期事项
                  </td>
                </tr>
              ) : (
                deadlines.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                      item.isOverdue ? 'bg-red-50/50' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-sm font-mono text-slate-600">{item.reqNo}</td>
                    <td className="py-3 px-4 text-sm text-slate-800">{item.title}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{item.hospital}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{formatDate(item.deadline)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.isOverdue
                            ? 'bg-red-100 text-red-700'
                            : item.daysLeft <= 3
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {item.isOverdue
                          ? `已逾期 ${Math.abs(item.daysLeft)} 天`
                          : item.daysLeft === 0
                          ? '今天到期'
                          : `剩余 ${item.daysLeft} 天`}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority="high" />
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => navigate(`/requirements/${item.id}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
