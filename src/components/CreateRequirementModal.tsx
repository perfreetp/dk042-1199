import { useState, useEffect } from 'react';
import { X, Upload, Camera } from 'lucide-react';
import { requirementApi, commonApi } from '@/api';
import type { Hospital, Department, Device, User, ImpactLevel, Requirement } from '@/types';
import { cn } from '@/lib/utils';

interface CreateRequirementModalProps {
  onClose: () => void;
  onSuccess: (newReq: Requirement) => void;
}

export default function CreateRequirementModal({ onClose, onSuccess }: CreateRequirementModalProps) {
  const [formData, setFormData] = useState({
    hospital: '',
    department: '',
    deviceModel: '',
    deviceSn: '',
    title: '',
    description: '',
    impactLevel: 'moderate' as ImpactLevel,
    customerExpectation: '',
    repairRecord: '',
    submitter: '',
  });
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        const [hospRes, devRes, userRes] = await Promise.all([
          commonApi.getHospitals(),
          commonApi.getDevices(),
          commonApi.getUsers(),
        ]);
        setHospitals(hospRes.data.data);
        setDevices(devRes.data.data);
        setUsers(userRes.data.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchBaseData();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const selectedHospital = hospitals.find((h) => h.name === formData.hospital);
        const depRes = await commonApi.getDepartments(selectedHospital?.id);
        setDepartments(depRes.data.data);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      }
    };
    if (formData.hospital && hospitals.length > 0) {
      fetchDepartments();
    } else {
      setDepartments([]);
    }
  }, [formData.hospital, hospitals]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.hospital) newErrors.hospital = '请选择医院';
    if (!formData.department) newErrors.department = '请选择科室';
    if (!formData.deviceModel) newErrors.deviceModel = '请选择设备型号';
    if (!formData.title) newErrors.title = '请输入需求标题';
    if (!formData.description) newErrors.description = '请输入问题描述';
    if (!formData.submitter) newErrors.submitter = '请选择提交人';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await requirementApi.create({
        ...formData,
        photos,
      });
      onSuccess(res.data.data);
    } catch (error) {
      console.error('Failed to create requirement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = () => {
    const newPhoto = `photo${photos.length + 1}.jpg`;
    setPhotos([...photos, newPhoto]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const filteredDepartments = departments;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">新建客户需求</h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                医院 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.hospital}
                onChange={(e) => setFormData({ ...formData, hospital: e.target.value, department: '' })}
                className={cn(
                  'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  errors.hospital ? 'border-red-300' : 'border-slate-300'
                )}
              >
                <option value="">请选择医院</option>
                {hospitals.map((h) => (
                  <option key={h.id} value={h.name}>
                    {h.name}
                  </option>
                ))}
              </select>
              {errors.hospital && <p className="text-xs text-red-500 mt-1">{errors.hospital}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                科室 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className={cn(
                  'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  errors.department ? 'border-red-300' : 'border-slate-300'
                )}
                disabled={!formData.hospital}
              >
                <option value="">请选择科室</option>
                {filteredDepartments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
              {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                设备型号 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.deviceModel}
                onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                className={cn(
                  'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  errors.deviceModel ? 'border-red-300' : 'border-slate-300'
                )}
              >
                <option value="">请选择设备型号</option>
                {devices.map((d) => (
                  <option key={d.id} value={d.model}>
                    {d.model}
                  </option>
                ))}
              </select>
              {errors.deviceModel && <p className="text-xs text-red-500 mt-1">{errors.deviceModel}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">设备序列号</label>
              <input
                type="text"
                value={formData.deviceSn}
                onChange={(e) => setFormData({ ...formData, deviceSn: e.target.value })}
                placeholder="请输入设备序列号"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                需求标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="请简要描述问题"
                className={cn(
                  'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  errors.title ? 'border-red-300' : 'border-slate-300'
                )}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                问题描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="请详细描述问题现象、发生频率、影响范围等"
                rows={4}
                className={cn(
                  'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none',
                  errors.description ? 'border-red-300' : 'border-slate-300'
                )}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">影响程度</label>
              <select
                value={formData.impactLevel}
                onChange={(e) => setFormData({ ...formData, impactLevel: e.target.value as ImpactLevel })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="severe">严重</option>
                <option value="significant">较大</option>
                <option value="moderate">一般</option>
                <option value="minor">轻微</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                提交人 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.submitter}
                onChange={(e) => setFormData({ ...formData, submitter: e.target.value })}
                className={cn(
                  'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  errors.submitter ? 'border-red-300' : 'border-slate-300'
                )}
              >
                <option value="">请选择提交人</option>
                {users.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name} - {u.role}
                  </option>
                ))}
              </select>
              {errors.submitter && <p className="text-xs text-red-500 mt-1">{errors.submitter}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">客户期望</label>
              <textarea
                value={formData.customerExpectation}
                onChange={(e) => setFormData({ ...formData, customerExpectation: e.target.value })}
                placeholder="请描述客户的期望解决方案或时间要求"
                rows={2}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">维修记录</label>
              <textarea
                value={formData.repairRecord}
                onChange={(e) => setFormData({ ...formData, repairRecord: e.target.value })}
                placeholder="请记录之前的维修处理情况"
                rows={2}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">现场照片</label>
              <div className="flex flex-wrap gap-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Camera className="w-8 h-8 text-slate-400" />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <p className="text-xs text-slate-500 mt-1 text-center">{photo}</p>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handlePhotoUpload}
                  className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                >
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-xs">上传</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              提交需求
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
