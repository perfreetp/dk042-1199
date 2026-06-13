import express, { type Request, type Response } from 'express';
import {
  requirements,
  getRequirementById,
  getTimelineByRequirementId,
  hospitals,
  departments,
  devices,
  users,
} from '../data/mockData.js';
import type { Requirement } from '../types/index.js';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  const {
    hospital,
    department,
    deviceModel,
    status,
    priority,
    category,
    keyword,
    page = 1,
    pageSize = 100,
  } = req.query;

  let filtered = [...requirements];

  if (hospital && hospital !== 'all') {
    filtered = filtered.filter(r => r.hospital === hospital);
  }
  if (department && department !== 'all') {
    filtered = filtered.filter(r => r.department === department);
  }
  if (deviceModel && deviceModel !== 'all') {
    filtered = filtered.filter(r => r.deviceModel === deviceModel);
  }
  if (status && status !== 'all') {
    filtered = filtered.filter(r => r.status === status);
  }
  if (priority && priority !== 'all') {
    filtered = filtered.filter(r => r.priority === priority);
  }
  if (category && category !== 'all') {
    filtered = filtered.filter(r => r.category === category);
  }
  if (keyword) {
    const kw = String(keyword).toLowerCase();
    filtered = filtered.filter(
      r =>
        r.title.toLowerCase().includes(kw) ||
        r.description.toLowerCase().includes(kw) ||
        r.reqNo.toLowerCase().includes(kw)
    );
  }

  const total = filtered.length;
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);
  const start = (pageNum - 1) * pageSizeNum;
  const items = filtered.slice(start, start + pageSizeNum);

  res.json({
    code: 0,
    message: 'success',
    data: {
      items,
      total,
      page: pageNum,
      pageSize: pageSizeNum,
    },
  });
});

router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const requirement = getRequirementById(id);

  if (!requirement) {
    return res.status(404).json({
      code: 404,
      message: 'Requirement not found',
      data: null,
    });
  }

  res.json({
    code: 0,
    message: 'success',
    data: requirement,
  });
});

router.post('/', (req: Request, res: Response) => {
  const data = req.body as Partial<Requirement>;
  const now = new Date().toISOString();
  const reqNo = `REQ-2026-${String(requirements.length + 1).padStart(4, '0')}`;

  const newRequirement: Requirement = {
    id: `req${requirements.length + 1}`,
    reqNo,
    hospital: data.hospital || '',
    department: data.department || '',
    deviceModel: data.deviceModel || '',
    deviceSn: data.deviceSn || '',
    submitter: data.submitter || '当前用户',
    submitTime: now,
    title: data.title || '',
    description: data.description || '',
    category: data.category || null,
    status: 'pending',
    priority: null,
    impactLevel: data.impactLevel || 'moderate',
    customerExpectation: data.customerExpectation || '',
    repairRecord: data.repairRecord || '',
    photos: data.photos || [],
    assignee: null,
    assigneeDept: null,
    targetVersion: null,
    promiseDate: null,
    responseDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: now,
    updatedAt: now,
  };

  requirements.unshift(newRequirement);

  res.json({
    code: 0,
    message: 'success',
    data: newRequirement,
  });
});

router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body as Partial<Requirement>;

  const index = requirements.findIndex(r => r.id === id);
  if (index === -1) {
    return res.status(404).json({
      code: 404,
      message: 'Requirement not found',
      data: null,
    });
  }

  requirements[index] = {
    ...requirements[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  res.json({
    code: 0,
    message: 'success',
    data: requirements[index],
  });
});

router.get('/:id/timeline', (req: Request, res: Response) => {
  const { id } = req.params;
  const timeline = getTimelineByRequirementId(id);

  res.json({
    code: 0,
    message: 'success',
    data: timeline,
  });
});

router.get('/hospitals', (_req: Request, res: Response) => {
  res.json({
    code: 0,
    message: 'success',
    data: hospitals,
  });
});

router.get('/departments', (req: Request, res: Response) => {
  const { hospitalId } = req.query;
  let filtered = departments;
  if (hospitalId) {
    filtered = departments.filter(d => d.hospitalId === hospitalId);
  }
  res.json({
    code: 0,
    message: 'success',
    data: filtered,
  });
});

router.get('/devices', (_req: Request, res: Response) => {
  res.json({
    code: 0,
    message: 'success',
    data: devices,
  });
});

router.get('/users', (_req: Request, res: Response) => {
  res.json({
    code: 0,
    message: 'success',
    data: users,
  });
});

export default router;
