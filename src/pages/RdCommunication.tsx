import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, Plus, X, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { requirementApi, rdApi } from '@/api';
import type { Requirement, RdCommunication, Alternative } from '@/types';
import { formatDateTime, getFeasibilityLabel, getFeasibilityColor } from '@/utils';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';

const feasibilityOptions = [
  { value: 'feasible', label: '可行', icon: CheckCircle, color: 'text-green-600' },
  { value: 'conditional', label: '有条件可行', icon: AlertTriangle, color: 'text-amber-600' },
  { value: 'not-feasible', label: '不可行', icon: XCircle, color: 'text-red-600' },
  { value: 'pending', label: '待评估', icon: Clock, color: 'text-slate-600' },
];

export default function RdCommunication() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [communications, setCommunications] = useState<RdCommunication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    content: '',
    feasibility: 'pending' as const,
    workLoad: '',
    riskAssessment: '',
  });

  const [alternatives, setAlternatives] = useState<Alternative[]>([
    { id: '1', name: '', description: '', advantages: '', disadvantages: '' },
  ]);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [reqRes, rdRes] = await Promise.all([
          requirementApi.getById(id),
          rdApi.getByRequirementId(id),
        ]);
        setRequirement(reqRes.data.data);
        setCommunications(rdRes.data.data);
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
      await rdApi.addReply(id, {
        ...formData,
        alternatives: alternatives.filter((a) => a.name && a.description),
        responder: '研发工程师',
      });
      const rdRes = await rdApi.getByRequirementId(id);
      setCommunications(rdRes.data.data);
      setShowForm(false);
      setFormData({
        content: '',
        feasibility: 'pending',
        workLoad: '',
        riskAssessment: '',
      });
      setAlternatives([{ id: '1', name: '', description: '', advantages: '', disadvantages: '' }]);
    } catch (error) {
      console.error('Failed to save communication:', error);
    } finally {
      setSaving(false);
    }
  };

  const addAlternative = () => {
    setAlternatives([
      ...alternatives,
      { id: String(Date.now()), name: '', description: '', advantages: '', disadvantages: '' },
    ]);
  };

  const removeAlternative = (index: number) => {
    if (alternatives.length > 1) {
      setAlternatives(alternatives.filter((_, i) => i !== index));
    }
  };

  const updateAlternative = (index: number, field: keyof Alternative, value: string) => {
    const newAlternatives = [...alternatives];
    newAlternatives[index] = { ...newAlternatives[index], [field]: value };
    setAlternatives(newAlternatives);
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
            <h3 className="text-xl font-semibold text-slate-800">研发沟通</h3>
            <p className="text-sm text-slate-500 mt-1">{requirement.reqNo}</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加答复
        </button>
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
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">添加研发答复</h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    答复内容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="请详细描述技术方案、解决思路等..."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    可行性判断 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {feasibilityOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <label
                          key={option.value}
                          className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            formData.feasibility === option.value
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="feasibility"
                            value={option.value}
                            checked={formData.feasibility === option.value}
                            onChange={(e) =>
                              setFormData({ ...formData, feasibility: e.target.value as any })
                            }
                            className="sr-only"
                          />
                          <Icon className={`w-6 h-6 mb-2 ${option.color}`} />
                          <span className="text-sm font-medium text-slate-700">{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">工作量估算</label>
                    <input
                      type="text"
                      value={formData.workLoad}
                      onChange={(e) => setFormData({ ...formData, workLoad: e.target.value })}
                      placeholder="如：2人周"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">风险评估</label>
                  <textarea
                    value={formData.riskAssessment}
                    onChange={(e) => setFormData({ ...formData, riskAssessment: e.target.value })}
                    placeholder="请描述可能存在的技术风险、依赖风险等..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-slate-700">替代方案</label>
                    <button
                      type="button"
                      onClick={addAlternative}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      + 添加方案
                    </button>
                  </div>
                  <div className="space-y-4">
                    {alternatives.map((alt, index) => (
                      <div key={alt.id} className="p-4 border border-slate-200 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-sm font-medium text-slate-700">方案 {index + 1}</h5>
                          {alternatives.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeAlternative(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={alt.name}
                            onChange={(e) => updateAlternative(index, 'name', e.target.value)}
                            placeholder="方案名称"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                          <textarea
                            value={alt.description}
                            onChange={(e) => updateAlternative(index, 'description', e.target.value)}
                            placeholder="方案描述"
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <textarea
                              value={alt.advantages}
                              onChange={(e) => updateAlternative(index, 'advantages', e.target.value)}
                              placeholder="优势"
                              rows={2}
                              className="w-full px-3 py-2 border border-green-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                            />
                            <textarea
                              value={alt.disadvantages}
                              onChange={(e) => updateAlternative(index, 'disadvantages', e.target.value)}
                              placeholder="劣势"
                              rows={2}
                              className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  disabled={saving || !formData.content}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <Send className="w-4 h-4" />
                  提交答复
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {communications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 mb-4">暂无研发沟通记录</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加第一条答复
            </button>
          </div>
        ) : (
          communications.map((comm) => (
            <div key={comm.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-medium text-sm">
                      {comm.responder.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{comm.responder}</p>
                    <p className="text-xs text-slate-500">{formatDateTime(comm.responseTime)}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFeasibilityColor(comm.feasibility)}`}>
                  {getFeasibilityLabel(comm.feasibility)}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed mb-4">{comm.content}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {comm.workLoad && (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">工作量估算</p>
                    <p className="text-sm font-medium text-slate-700">{comm.workLoad}</p>
                  </div>
                )}
              </div>
              {comm.riskAssessment && (
                <div className="bg-amber-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-amber-600 mb-1">风险评估</p>
                  <p className="text-sm text-amber-800">{comm.riskAssessment}</p>
                </div>
              )}
              {comm.alternatives.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">替代方案</p>
                  <div className="space-y-3">
                    {comm.alternatives.map((alt, idx) => (
                      <div key={alt.id} className="border border-slate-200 rounded-lg p-4">
                        <h5 className="font-medium text-slate-800 mb-2">
                          {idx + 1}. {alt.name}
                        </h5>
                        <p className="text-sm text-slate-600 mb-3">{alt.description}</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-green-50 rounded-lg p-3">
                            <p className="text-xs text-green-600 mb-1">优势</p>
                            <p className="text-sm text-green-800">{alt.advantages}</p>
                          </div>
                          <div className="bg-red-50 rounded-lg p-3">
                            <p className="text-xs text-red-600 mb-1">劣势</p>
                            <p className="text-sm text-red-800">{alt.disadvantages}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
