import axios from 'axios';
import type {
  Requirement,
  Evaluation,
  RdCommunication,
  Followup,
  Timeline,
  DashboardStats,
  DeviceStat,
  DeadlineItem,
  Hospital,
  Department,
  Device,
  User,
  RequirementStatus,
  RequirementCategory,
  Priority,
  ImpactLevel,
} from '@/types';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

interface RequirementQuery {
  hospital?: string;
  department?: string;
  deviceModel?: string;
  status?: RequirementStatus | 'all';
  priority?: Priority | 'all';
  category?: RequirementCategory | 'all';
  keyword?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface CreateRequirementRequest {
  hospital: string;
  department: string;
  deviceModel: string;
  deviceSn?: string;
  title: string;
  description: string;
  impactLevel: ImpactLevel;
  customerExpectation?: string;
  repairRecord?: string;
  photos?: string[];
  submitter: string;
}

interface SubmitEvaluationRequest {
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
  remarks?: string;
  evaluator: string;
}

interface AddRdReplyRequest {
  content: string;
  feasibility: string;
  workLoad: string;
  riskAssessment: string;
  responder: string;
  alternatives?: Array<{
    name: string;
    description: string;
    advantages: string;
    disadvantages: string;
  }>;
}

interface AddFollowupRequest {
  followupType: string;
  followupTime: string;
  contactPerson: string;
  content: string;
  customerFeedback: string;
  nextFollowupTime?: string | null;
  operator: string;
}

export const requirementApi = {
  list: (params?: RequirementQuery) =>
    api.get<ApiResponse<ListResponse<Requirement>>>('/requirements', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Requirement>>(`/requirements/${id}`),

  create: (data: CreateRequirementRequest) =>
    api.post<ApiResponse<Requirement>>('/requirements', data),

  update: (id: string, data: Partial<CreateRequirementRequest>) =>
    api.put<ApiResponse<Requirement>>(`/requirements/${id}`, data),

  getTimeline: (id: string) =>
    api.get<ApiResponse<Timeline[]>>(`/requirements/${id}/timeline`),
};

export const evaluationApi = {
  getByRequirementId: (requirementId: string) =>
    api.get<ApiResponse<Evaluation>>(`/evaluation/${requirementId}`),

  submit: (requirementId: string, data: SubmitEvaluationRequest) =>
    api.post<ApiResponse<Evaluation>>(`/evaluation/${requirementId}`, data),
};

export const rdApi = {
  getByRequirementId: (requirementId: string) =>
    api.get<ApiResponse<RdCommunication[]>>(`/rd/${requirementId}`),

  addReply: (requirementId: string, data: AddRdReplyRequest) =>
    api.post<ApiResponse<RdCommunication>>(`/rd/${requirementId}`, data),
};

export const followupApi = {
  getByRequirementId: (requirementId: string) =>
    api.get<ApiResponse<Followup[]>>(`/followup/${requirementId}`),

  addRecord: (requirementId: string, data: AddFollowupRequest) =>
    api.post<ApiResponse<Followup>>(`/followup/${requirementId}`, data),

  closeRequirement: (id: string) =>
    api.post<ApiResponse<void>>(`/followup/${id}/close`),
};

export const dashboardApi = {
  getStats: () => api.get<ApiResponse<DashboardStats>>('/dashboard/stats'),
  getTopDevices: () => api.get<ApiResponse<DeviceStat[]>>('/dashboard/top-devices'),
  getPendingRequirements: () => api.get<ApiResponse<Requirement[]>>('/dashboard/pending'),
  getDeadlines: () => api.get<ApiResponse<DeadlineItem[]>>('/dashboard/deadlines'),
};

export const commonApi = {
  getHospitals: () => api.get<ApiResponse<Hospital[]>>('/requirements/hospitals'),
  getDepartments: (hospitalId?: string) =>
    api.get<ApiResponse<Department[]>>('/requirements/departments', {
      params: { hospitalId },
    }),
  getDevices: () => api.get<ApiResponse<Device[]>>('/requirements/devices'),
  getUsers: () => api.get<ApiResponse<User[]>>('/requirements/users'),
};

export default api;
