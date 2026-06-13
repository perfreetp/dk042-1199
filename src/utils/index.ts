export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    pending: '待评估',
    evaluating: '评估中',
    processing: '处理中',
    followup: '跟进中',
    closed: '已关闭',
  };
  return map[status] || status;
};

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    evaluating: 'bg-blue-100 text-blue-700',
    processing: 'bg-indigo-100 text-indigo-700',
    followup: 'bg-purple-100 text-purple-700',
    closed: 'bg-green-100 text-green-700',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
};

export const getCategoryLabel = (category: string | null): string => {
  if (!category) return '未分类';
  const map: Record<string, string> = {
    fault: '故障修复',
    experience: '体验优化',
    compliance: '合规要求',
    training: '培训需求',
  };
  return map[category] || category;
};

export const getCategoryColor = (category: string | null): string => {
  if (!category) return 'bg-gray-100 text-gray-700';
  const map: Record<string, string> = {
    fault: 'bg-red-100 text-red-700',
    experience: 'bg-cyan-100 text-cyan-700',
    compliance: 'bg-orange-100 text-orange-700',
    training: 'bg-teal-100 text-teal-700',
  };
  return map[category] || 'bg-gray-100 text-gray-700';
};

export const getPriorityLabel = (priority: string | null): string => {
  if (!priority) return '未设置';
  const map: Record<string, string> = {
    critical: '紧急',
    high: '高',
    medium: '中',
    low: '低',
  };
  return map[priority] || priority;
};

export const getPriorityColor = (priority: string | null): string => {
  if (!priority) return 'bg-gray-100 text-gray-700';
  const map: Record<string, string> = {
    critical: 'bg-red-500 text-white',
    high: 'bg-orange-500 text-white',
    medium: 'bg-yellow-500 text-white',
    low: 'bg-green-500 text-white',
  };
  return map[priority] || 'bg-gray-100 text-gray-700';
};

export const getImpactLabel = (impact: string): string => {
  const map: Record<string, string> = {
    severe: '严重',
    significant: '较大',
    moderate: '一般',
    minor: '轻微',
  };
  return map[impact] || impact;
};

export const getImpactColor = (impact: string): string => {
  const map: Record<string, string> = {
    severe: 'text-red-600',
    significant: 'text-orange-600',
    moderate: 'text-yellow-600',
    minor: 'text-green-600',
  };
  return map[impact] || 'text-gray-600';
};

export const getFollowupTypeLabel = (type: string): string => {
  const map: Record<string, string> = {
    phone: '电话',
    onsite: '现场',
    email: '邮件',
  };
  return map[type] || type;
};

export const getFeasibilityLabel = (feasibility: string): string => {
  const map: Record<string, string> = {
    feasible: '可行',
    conditional: '有条件可行',
    'not-feasible': '不可行',
    pending: '待评估',
  };
  return map[feasibility] || feasibility;
};

export const getFeasibilityColor = (feasibility: string): string => {
  const map: Record<string, string> = {
    feasible: 'bg-green-100 text-green-700',
    conditional: 'bg-yellow-100 text-yellow-700',
    'not-feasible': 'bg-red-100 text-red-700',
    pending: 'bg-gray-100 text-gray-700',
  };
  return map[feasibility] || 'bg-gray-100 text-gray-700';
};

export const getDaysRemaining = (dateString: string): number => {
  const now = new Date();
  const date = new Date(dateString);
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const generateReqNo = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `REQ-${year}-${random}`;
};
