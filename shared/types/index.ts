export type RequirementStatus = 'pending' | 'evaluating' | 'processing' | 'followup' | 'closed';

export type RequirementCategory = 'fault' | 'experience' | 'compliance' | 'training';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type ImpactLevel = 'severe' | 'significant' | 'moderate' | 'minor';

export type Feasibility = 'feasible' | 'conditional' | 'not-feasible' | 'pending';

export type FollowupType = 'phone' | 'onsite' | 'email';

export type TimelineType = 'create' | 'evaluate' | 'rd-reply' | 'followup' | 'status-change';

export interface Requirement {
  id: string;
  reqNo: string;
  hospital: string;
  department: string;
  deviceModel: string;
  deviceSn: string;
  submitter: string;
  submitTime: string;
  title: string;
  description: string;
  category: RequirementCategory | null;
  status: RequirementStatus;
  priority: Priority | null;
  impactLevel: ImpactLevel;
  customerExpectation: string;
  repairRecord: string;
  photos: string[];
  assignee: string | null;
  assigneeDept: string | null;
  targetVersion: string | null;
  promiseDate: string | null;
  responseDeadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface Evaluation {
  id: string;
  requirementId: string;
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
  evaluator: string;
  evaluateTime: string;
  remarks: string;
}

export interface Alternative {
  id: string;
  name: string;
  description: string;
  advantages: string;
  disadvantages: string;
}

export interface RdCommunication {
  id: string;
  requirementId: string;
  responder: string;
  responseTime: string;
  content: string;
  feasibility: Feasibility;
  workLoad: string;
  riskAssessment: string;
  alternatives: Alternative[];
}

export interface Followup {
  id: string;
  requirementId: string;
  followupTime: string;
  followupType: FollowupType;
  contactPerson: string;
  content: string;
  customerFeedback: string;
  nextFollowupTime: string | null;
  operator: string;
  createdAt: string;
}

export interface Timeline {
  id: string;
  requirementId: string;
  type: TimelineType;
  operator: string;
  time: string;
  content: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  processing: number;
  closed: number;
  avgCycleDays: number;
}

export interface DeviceStat {
  model: string;
  count: number;
}

export interface DeadlineItem {
  id: string;
  reqNo: string;
  title: string;
  hospital: string;
  deadline: string;
  daysLeft: number;
  isOverdue: boolean;
}

export interface Hospital {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
  hospitalId: string;
}

export interface Device {
  id: string;
  model: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  department: string;
}
