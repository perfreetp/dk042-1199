import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Mail, Plus, X, Send, FileText, CheckCircle } from 'lucide-react';
import { requirementApi, followupApi } from '@/api';
import type { Requirement, Followup } from '@/types';
import { formatDateTime, getFollowupTypeLabel } from '@/utils';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';

const followupTypes = [
  { value: 'phone', label: '电话', icon: Phone },
  { value: 'onsite', label: '现场', icon: MapPin },
  { value: 'email', label: '邮件', icon: Mail },
];

export default function CustomerFollowup() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [closing, setClosing] = useState(false);

  const [formData, setFormData] = useState({
    followupTime: new Date().toISOString().slice(0, 16),
    followupType: 'phone' as const,
    contactPerson: '',
    content: '',
    customerFeedback: '',
    nextFollowupTime: '',
  });

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [reqRes, followupRes] = await Promise.all([
          requirementApi.getById(id),
          followupApi.getByRequirementId(id),
        ]);
        setRequirement(reqRes.data.data);
        setFollowups(followupRes.data.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !formData.content) return;

    setSaving(true);
    try {
      await followupApi.addRecord(id, {
        ...formData,
        followupTime: new Date(formData.followupTime).toISOString(),
        nextFollowupTime: formData.nextFollowupTime
          ? new Date(formData.nextFollowupTime).toISOString()
          : null,
        operator: '售后工程师',
      });
      const followupRes = await followupApi.getByRequirementId(id);
      setFollowups(followupRes.data.data);
      setShowForm(false);
      setFormData({
        followupTime: new Date().toISOString().slice(0, 16),
        followupType: 'phone',
        contactPerson: '',
        content: '',
        customerFeedback: '',
        nextFollowupTime: '',
      });
    } catch (error) {
      console.error('Failed to save followup:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = async () => {
    if (!id) return;
    if (!confirm('确认要关闭此需求吗？关闭后将无法继续处理。')) return;

    setClosing(true);
    try {
      await followupApi.closeRequirement(id);
      const reqRes = await requirementApi.getById(id);
      setRequirement(reqRes.data.data);
    } catch (error) {
      console.error('Failed to close requirement:', error);
    } finally {
      setClosing(false);
    }
  };

  const generateMinutes = () => {
    if (followups.length === 0) return;
    const latest = followups[0];
    const minutes = `
沟通纪要
========

需求编号：${requirement?.reqNo}
需求标题：${requirement?.title}
医院：${requirement?.hospital}
科室：${requirement?.department}

沟通时间：${formatDateTime(latest.followupTime)}
沟通方式：${getFollowupTypeLabel(latest.followupType)}
联系人：${latest.contactPerson}
操作人：${latest.operator}

沟通内容：
${latest.content}

客户反馈：
${latest.customerFeedback}

后续跟进：
${latest.nextFollowupTime ? `下次跟进时间：${formatDateTime(latest.nextFollowupTime)}` : '暂无后续跟进计划'}

---
生成时间：${formatDateTime(new Date().toISOString())}
    `.trim();

    const blob = new Blob([minutes], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `沟通纪要_${requirement?.reqNo}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
        <p className="text-slate-500">需求不存在</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/requirements/${id}`)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="text-xl font-semibold text-slate-800">客户跟进</h3>
            <p className="text-sm text-slate-500 mt-1">{requirement.reqNo}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {followups.length > 0 && (
            <button
              onClick={generateMinutes}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              生成纪要
            </button>
          )}
          {requirement.status !== 'closed' && (
            <button
              onClick={handleClose}
              disabled={closing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50"
            >
              {closing && (
                <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
              )}
              <CheckCircle className="w-4 h-4" />
              关闭需求
            </button>
          )}
          {requirement.status !== 'closed' && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加跟进
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-lg font-semibold text-slate-800 mb-2">{requirement.title}</h4>
            <p className="text-sm text-slate-600 mb-3">{requirement.description}</p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">{requirement.hospital}</span>
              <span className="text-sm text-slate-500">{requirement.deviceModel}</span>
              <StatusBadge status={requirement.status} />
              <PriorityBadge priority={requirement.priority} />
            </div>
          </div>
          {requirement.customerExpectation && (
            <div className="bg-blue-50 rounded-lg p-3 max-w-xs">
              <p className="text-xs text-blue-600 mb-1">客户期望</p>
              <p className="text-sm text-blue-800">{requirement.customerExpectation}</p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">添加跟进记录</h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      跟进时间 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.followupTime}
                      onChange={(e) => setFormData({ ...formData, followupTime: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      联系人 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="请输入联系人姓名"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    沟通方式 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {followupTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <label
                          key={type.value}
                          className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            formData.followupType === type.value
                              ? 'border-green-500 bg-green-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="followupType"
                            value={type.value}
                            checked={formData.followupType === type.value}
                            onChange={(e) =>
                              setFormData({ ...formData, followupType: e.target.value as any })
                            }
                            className="sr-only"
                          />
                          <Icon className="w-6 h-6 text-slate-600 mb-2" />
                          <span className="text-sm font-medium text-slate-700">{type.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    沟通内容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="请详细记录沟通内容..."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    客户反馈 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.customerFeedback}
                    onChange={(e) => setFormData({ ...formData, customerFeedback: e.target.value })}
                    placeholder="请记录客户的反馈意见..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    下次跟进时间
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.nextFollowupTime}
                    onChange={(e) => setFormData({ ...formData, nextFollowupTime: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-500 mt-1">选填，如无需跟进可留空</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={saving || !formData.content || !formData.contactPerson}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <Send className="w-4 h-4" />
                  保存记录
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {followups.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 mb-4">暂无跟进记录</p>
            {requirement.status !== 'closed' && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                添加第一条跟进
              </button>
            )}
          </div>
        ) : (
          followups.map((followup) => {
            const TypeIcon = followupTypes.find((t) => t.value === followup.followupType)?.icon || Phone;
            return (
              <div key={followup.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      followup.followupType === 'phone' ? 'bg-blue-100' :
                      followup.followupType === 'onsite' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      <TypeIcon className={`w-5 h-5 ${
                        followup.followupType === 'phone' ? 'text-blue-600' :
                        followup.followupType === 'onsite' ? 'text-green-600' : 'text-purple-600'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-800">
                          {getFollowupTypeLabel(followup.followupType)}跟进
                        </p>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          联系人：{followup.contactPerson}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatDateTime(followup.followupTime)} · {followup.operator}
                      </p>
                    </div>
                  </div>
                  {followup.nextFollowupTime && (
                    <div className="bg-amber-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-amber-600">下次跟进</p>
                      <p className="text-sm font-medium text-amber-800">
                        {formatDateTime(followup.nextFollowupTime)}
                      </p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-2">沟通内容</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{followup.content}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-xs text-green-600 mb-2">客户反馈</p>
                    <p className="text-sm text-green-800 leading-relaxed">{followup.customerFeedback}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
