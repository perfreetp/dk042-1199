import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ClipboardCheck,
  MessageSquare,
  Phone,
  Camera,
  User,
  MapPin,
  Calendar,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { requirementApi } from '@/api';
import type { Requirement, Timeline as TimelineType } from '@/types';
import { formatDate, formatDateTime, getImpactLabel, getImpactColor } from '@/utils';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import CategoryBadge from '@/components/CategoryBadge';
import TimelineView from '@/components/Timeline';

export default function RequirementDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [timeline, setTimeline] = useState<TimelineType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [reqRes, timelineRes] = await Promise.all([
          requirementApi.getById(id),
          requirementApi.getTimeline(id),
        ]);
        setRequirement(reqRes.data.data);
        setTimeline(timelineRes.data.data);
      } catch (error) {
        console.error('Failed to fetch requirement:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!requirement) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <p className="text-slate-500">需求不存在</p>
        <button
          onClick={() => navigate('/requirements')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          返回列表
        </button>
      </div>
    );
  }

  const infoItems = [
    { icon: MapPin, label: '医院', value: requirement.hospital },
    { icon: MapPin, label: '科室', value: requirement.department },
    { icon: FileText, label: '设备型号', value: requirement.deviceModel },
    { icon: FileText, label: '设备序列号', value: requirement.deviceSn || '-' },
    { icon: User, label: '提交人', value: requirement.submitter },
    { icon: Calendar, label: '提交时间', value: formatDateTime(requirement.submitTime) },
    { icon: User, label: '责任人', value: requirement.assignee || '-' },
    { icon: FileText, label: '责任部门', value: requirement.assigneeDept || '-' },
    { icon: Calendar, label: '目标版本', value: requirement.targetVersion || '-' },
    { icon: Calendar, label: '承诺日期', value: requirement.promiseDate ? formatDate(requirement.promiseDate) : '-' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/requirements')}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-slate-800">{requirement.title}</h3>
              <StatusBadge status={requirement.status} />
            </div>
            <p className="text-sm text-slate-500 mt-1">{requirement.reqNo}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(requirement.status === 'pending' || requirement.status === 'evaluating') && (
            <Link
              to={`/evaluation/${id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <ClipboardCheck className="w-4 h-4" />
              优先级评估
            </Link>
          )}
          {requirement.status === 'processing' && (
            <Link
              to={`/rd/${id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              研发沟通
            </Link>
          )}
          <Link
            to={`/followup/${id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Phone className="w-4 h-4" />
            客户跟进
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">基本信息</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {infoItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Icon className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">{item.label}</p>
                      <p className="text-sm font-medium text-slate-800">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">问题描述</h4>
            <p className="text-slate-700 leading-relaxed">{requirement.description}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-slate-800">分类与优先级</h4>
              <div className="flex items-center gap-2">
                <CategoryBadge category={requirement.category} />
                <PriorityBadge priority={requirement.priority} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">影响程度</p>
                  <p className={`text-sm font-medium ${getImpactColor(requirement.impactLevel)}`}>
                    {getImpactLabel(requirement.impactLevel)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">客户期望</h4>
            <p className="text-slate-700 leading-relaxed">
              {requirement.customerExpectation || '暂无'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">维修记录</h4>
            <p className="text-slate-700 leading-relaxed">
              {requirement.repairRecord || '暂无维修记录'}
            </p>
          </div>

          {requirement.photos.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">现场照片</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {requirement.photos.map((photo, index) => (
                  <div key={index} className="group relative">
                    <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
                      <Camera className="w-12 h-12 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500 mt-2 text-center">{photo}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">处理时间线</h4>
            <TimelineView events={timeline} />
          </div>
        </div>
      </div>
    </div>
  );
}
