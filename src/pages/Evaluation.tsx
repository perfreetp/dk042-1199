import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Star } from 'lucide-react';
import { requirementApi, evaluationApi, commonApi } from '@/api';
import type { Requirement, Evaluation as EvaluationType, User, Priority, RequirementCategory } from '@/types';
import { formatDateTime, getCategoryLabel, getPriorityLabel } from '@/utils';
import StatusBadge from '@/components/StatusBadge';
import CategoryBadge from '@/components/CategoryBadge';
import PriorityBadge from '@/components/PriorityBadge';

const categories = [
  { value: 'fault', label: '故障修复' },
  { value: 'experience', label: '体验优化' },
  { value: 'compliance', label: '合规要求' },
  { value: 'training', label: '培训需求' },
];

const departments = ['研发一部', '研发二部', '客户服务部', '产品部', '售后服务部'];

export default function Evaluation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [existingEvaluation, setExistingEvaluation] = useState<EvaluationType | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<{
    category: RequirementCategory;
    impactScope: number;
    urgency: number;
    difficulty: number;
    businessValue: number;
    priority: Priority;
    assignee: string;
    assigneeDept: string;
    targetVersion: string;
    promiseDate: string;
    remarks: string;
  }>({
    category: 'fault',
    impactScope: 3,
    urgency: 3,
    difficulty: 3,
    businessValue: 3,
    priority: 'medium',
    assignee: '',
    assigneeDept: '研发一部',
    targetVersion: '',
    promiseDate: '',
    remarks: '',
  });

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [reqRes, evalRes, userRes] = await Promise.all([
          requirementApi.getById(id),
          evaluationApi.getByRequirementId(id),
          commonApi.getUsers(),
        ]);
        setRequirement(reqRes.data.data);
        setExistingEvaluation(evalRes.data.data);
        setUsers(userRes.data.data);

        if (evalRes.data.data) {
          const evalData = evalRes.data.data;
          setFormData({
            category: evalData.category,
            impactScope: evalData.impactScope,
            urgency: evalData.urgency,
            difficulty: evalData.difficulty,
            businessValue: evalData.businessValue,
            priority: evalData.priority,
            assignee: evalData.assignee,
            assigneeDept: evalData.assigneeDept,
            targetVersion: evalData.targetVersion,
            promiseDate: evalData.promiseDate.split('T')[0],
            remarks: evalData.remarks,
          });
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const calculatePriority = () => {
    const total = formData.impactScope + formData.urgency + formData.businessValue - formData.difficulty;
    if (total >= 12) return 'critical';
    if (total >= 9) return 'high';
    if (total >= 6) return 'medium';
    return 'low';
  };

  useEffect(() => {
    const calculated = calculatePriority();
    setFormData((prev) => ({ ...prev, priority: calculated }));
  }, [formData.impactScope, formData.urgency, formData.difficulty, formData.businessValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !formData.assignee) return;

    setSaving(true);
    try {
      await evaluationApi.submit(id, {
        ...formData,
        promiseDate: new Date(formData.promiseDate).toISOString(),
        evaluator: '产品经理',
      });
      navigate(`/requirements/${id}`);
    } catch (error) {
      console.error('Failed to save evaluation:', error);
    } finally {
      setSaving(false);
    }
  };

  const RatingSlider = ({
    label,
    value,
    onChange,
    description,
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    description: string[];
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="p-0.5"
            >
              <Star
                className={`w-5 h-5 ${
                  star <= value ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-slate-500">{description[value - 1]}</p>
    </div>
  );

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
            <h3 className="text-xl font-semibold text-slate-800">优先级评估</h3>
            <p className="text-sm text-slate-500 mt-1">{requirement.reqNo}</p>
          </div>
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
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">提交时间</p>
            <p className="text-sm text-slate-700">{formatDateTime(requirement.submitTime)}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-6">需求分类</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <label
                key={cat.value}
                className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.category === cat.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={formData.category === cat.value}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="sr-only"
                />
                <CategoryBadge category={cat.value} />
                <span className="mt-2 text-sm font-medium text-slate-700">{cat.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-slate-800">四维评估</h4>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">综合优先级：</span>
              <PriorityBadge priority={formData.priority} />
            </div>
          </div>
          <div className="space-y-6">
            <RatingSlider
              label="影响范围"
              value={formData.impactScope}
              onChange={(v) => setFormData({ ...formData, impactScope: v })}
              description={['仅影响单个设备', '影响同型号设备', '影响同科室设备', '影响全院设备', '影响所有客户']}
            />
            <RatingSlider
              label="紧急程度"
              value={formData.urgency}
              onChange={(v) => setFormData({ ...formData, urgency: v })}
              description={['不紧急，可按计划处理', '一般紧急，1-2周内处理', '较紧急，3-5天内处理', '紧急，1-2天内处理', '非常紧急，需立即处理']}
            />
            <RatingSlider
              label="修复难度"
              value={formData.difficulty}
              onChange={(v) => setFormData({ ...formData, difficulty: v })}
              description={['非常简单，快速解决', '较简单，1-2人天', '一般难度，3-5人天', '较复杂，1-2人周', '非常复杂，需跨部门协作']}
            />
            <RatingSlider
              label="业务价值"
              value={formData.businessValue}
              onChange={(v) => setFormData({ ...formData, businessValue: v })}
              description={['价值较低', '有一定价值', '价值较高', '价值很高', '战略级价值']}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-6">责任分配</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                责任部门 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.assigneeDept}
                onChange={(e) => {
                  const newDept = e.target.value;
                  const stillValid = users.some(
                    (u) => u.department === newDept && u.name === formData.assignee
                  );
                  setFormData({
                    ...formData,
                    assigneeDept: newDept,
                    assignee: stillValid ? formData.assignee : '',
                  });
                }}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                责任人 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">请选择责任人</option>
                {users
                  .filter((u) => u.department === formData.assigneeDept)
                  .map((user) => (
                    <option key={user.id} value={user.name}>
                      {user.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                目标版本
              </label>
              <input
                type="text"
                value={formData.targetVersion}
                onChange={(e) => setFormData({ ...formData, targetVersion: e.target.value })}
                placeholder="如 V2.3.1"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                承诺完成日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.promiseDate}
                onChange={(e) => setFormData({ ...formData, promiseDate: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">评估备注</h4>
          <textarea
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            placeholder="请输入评估备注信息..."
            rows={4}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            to={`/requirements/${id}`}
            className="px-6 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            取消
          </Link>
          <button
            type="submit"
            disabled={saving || !formData.assignee}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <Save className="w-4 h-4" />
            {existingEvaluation ? '更新评估' : '提交评估'}
          </button>
        </div>
      </form>
    </div>
  );
}
