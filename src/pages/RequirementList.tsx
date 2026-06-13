import { useEffect, useState } from 'react';
import { Plus, Filter, RotateCcw, Eye, ClipboardCheck, MessageSquare, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { requirementApi, commonApi } from '@/api';
import type { Requirement, Hospital, Device, RequirementStatus, Priority, RequirementCategory } from '@/types';
import { formatDate, formatDateTime, getImpactLabel, getImpactColor } from '@/utils';
import useStore from '@/store/useStore';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import CategoryBadge from '@/components/CategoryBadge';
import CreateRequirementModal from '@/components/CreateRequirementModal';

export default function RequirementList() {
  const navigate = useNavigate();
  const { filters, setFilters, resetFilters } = useStore();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, hospRes, devRes] = await Promise.all([
          requirementApi.list(filters),
          commonApi.getHospitals(),
          commonApi.getDevices(),
        ]);
        setRequirements(reqRes.data.data.items);
        setHospitals(hospRes.data.data);
        setDevices(devRes.data.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const sortedRequirements = [...requirements].sort((a, b) => {
    const aVal = a[sortField as keyof Requirement] as string;
    const bVal = b[sortField as keyof Requirement] as string;
    if (sortOrder === 'asc') {
      return aVal.localeCompare(bVal);
    }
    return bVal.localeCompare(aVal);
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 opacity-50" />;
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  const handleCreateSuccess = () => {
    setShowModal(false);
    const fetchData = async () => {
      const reqRes = await requirementApi.list(filters);
      setRequirements(reqRes.data.data.items);
    };
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">客户需求台账</h3>
          <p className="text-sm text-slate-500 mt-1">共 {requirements.length} 条需求记录</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          新建需求
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-500" />
              <span className="font-medium text-slate-700">筛选条件</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                重置
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showFilters ? '收起' : '展开'}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">医院</label>
                <select
                  value={filters.hospital}
                  onChange={(e) => setFilters({ hospital: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">全部医院</option>
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.name}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">设备型号</label>
                <select
                  value={filters.deviceModel}
                  onChange={(e) => setFilters({ deviceModel: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">全部型号</option>
                  {devices.map((d) => (
                    <option key={d.id} value={d.model}>
                      {d.model}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">状态</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ status: e.target.value as RequirementStatus | 'all' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">全部状态</option>
                  <option value="pending">待评估</option>
                  <option value="evaluating">评估中</option>
                  <option value="processing">处理中</option>
                  <option value="followup">跟进中</option>
                  <option value="closed">已关闭</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">优先级</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ priority: e.target.value as Priority | 'all' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">全部优先级</option>
                  <option value="critical">紧急</option>
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">分类</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ category: e.target.value as RequirementCategory | 'all' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">全部分类</option>
                  <option value="fault">故障修复</option>
                  <option value="experience">体验优化</option>
                  <option value="compliance">合规要求</option>
                  <option value="training">培训需求</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th
                  className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase cursor-pointer hover:bg-slate-100"
                  onClick={() => handleSort('reqNo')}
                >
                  <div className="flex items-center gap-1">
                    需求编号
                    <SortIcon field="reqNo" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase cursor-pointer hover:bg-slate-100"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-1">
                    标题
                    <SortIcon field="title" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">医院/科室</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">设备型号</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">分类</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">优先级</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">影响程度</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">状态</th>
                <th
                  className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase cursor-pointer hover:bg-slate-100"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    提交时间
                    <SortIcon field="createdAt" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {sortedRequirements.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <Filter className="w-12 h-12 opacity-50" />
                      <p>暂无符合条件的需求记录</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedRequirements.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 px-4 text-sm font-mono text-slate-600">{req.reqNo}</td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-medium text-slate-800 max-w-xs truncate">{req.title}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-slate-700">{req.hospital}</p>
                      <p className="text-xs text-slate-500">{req.department}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600">{req.deviceModel}</td>
                    <td className="py-4 px-4">
                      <CategoryBadge category={req.category} />
                    </td>
                    <td className="py-4 px-4">
                      <PriorityBadge priority={req.priority} />
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm font-medium ${getImpactColor(req.impactLevel)}`}>
                        {getImpactLabel(req.impactLevel)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-500">
                      {formatDate(req.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/requirements/${req.id}`)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {req.status === 'pending' || req.status === 'evaluating' ? (
                          <button
                            onClick={() => navigate(`/evaluation/${req.id}`)}
                            className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                            title="优先级评估"
                          >
                            <ClipboardCheck className="w-4 h-4" />
                          </button>
                        ) : null}
                        {req.status === 'processing' ? (
                          <button
                            onClick={() => navigate(`/rd/${req.id}`)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="研发沟通"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        ) : null}
                        <button
                          onClick={() => navigate(`/followup/${req.id}`)}
                          className="p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="客户跟进"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <CreateRequirementModal
          onClose={() => setShowModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
}
