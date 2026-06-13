import express, { type Request, type Response } from 'express';
import {
  followups,
  getFollowupsByRequirementId,
  requirements,
  timelines,
} from '../data/mockData.js';
import type { Followup } from '../types/index.js';

const router = express.Router();

router.get('/:requirementId', (req: Request, res: Response) => {
  const { requirementId } = req.params;
  const followupList = getFollowupsByRequirementId(requirementId);

  res.json({
    code: 0,
    message: 'success',
    data: followupList,
  });
});

router.post('/:requirementId', (req: Request, res: Response) => {
  const { requirementId } = req.params;
  const data = req.body as Omit<Followup, 'id' | 'requirementId' | 'createdAt'> & { operator?: string };

  const now = new Date().toISOString();
  const fId = `f${followups.length + 1}`;

  const newFollowup: Followup = {
    id: fId,
    requirementId,
    ...data,
    operator: data.operator || '孙客服',
    createdAt: now,
  };

  followups.push(newFollowup);

  const reqIndex = requirements.findIndex(r => r.id === requirementId);
  if (reqIndex !== -1) {
    requirements[reqIndex] = {
      ...requirements[reqIndex],
      status: 'followup',
      updatedAt: now,
    };
  }

  timelines.push({
    id: `t${timelines.length + 1}`,
    requirementId,
    type: 'followup',
    operator: data.operator || '孙客服',
    time: now,
    content: `客户跟进：${data.content.substring(0, 30)}...`,
  });

  res.json({
    code: 0,
    message: 'success',
    data: newFollowup,
  });
});

router.post('/:requirementId/close', (req: Request, res: Response) => {
  const { requirementId } = req.params;
  const now = new Date().toISOString();

  const reqIndex = requirements.findIndex(r => r.id === requirementId);
  if (reqIndex === -1) {
    return res.status(404).json({
      code: 404,
      message: 'Requirement not found',
      data: null,
    });
  }

  requirements[reqIndex] = {
    ...requirements[reqIndex],
    status: 'closed',
    updatedAt: now,
  };

  timelines.push({
    id: `t${timelines.length + 1}`,
    requirementId,
    type: 'status-change',
    operator: '系统',
    time: now,
    content: '状态变更：跟进中 → 已关闭',
  });

  res.json({
    code: 0,
    message: 'success',
    data: requirements[reqIndex],
  });
});

export default router;
