import express, { type Request, type Response } from 'express';
import {
  evaluations,
  getEvaluationByRequirementId,
  requirements,
  timelines,
} from '../data/mockData.js';
import type { Evaluation } from '../types/index.js';

const router = express.Router();

router.get('/:requirementId', (req: Request, res: Response) => {
  const { requirementId } = req.params;
  const evaluation = getEvaluationByRequirementId(requirementId);

  if (!evaluation) {
    return res.json({
      success: true,
      data: null,
    });
  }

  res.json({
    success: true,
    data: evaluation,
  });
});

router.post('/:requirementId', (req: Request, res: Response) => {
  const { requirementId } = req.params;
  const data = req.body as Omit<Evaluation, 'id' | 'requirementId' | 'evaluateTime' | 'evaluator'>;

  const now = new Date().toISOString();
  const evalId = `eval${evaluations.length + 1}`;

  const newEvaluation: Evaluation = {
    id: evalId,
    requirementId,
    ...data,
    evaluateTime: now,
    evaluator: '王经理',
  };

  const existingIndex = evaluations.findIndex(e => e.requirementId === requirementId);
  if (existingIndex !== -1) {
    evaluations[existingIndex] = { ...newEvaluation, id: evaluations[existingIndex].id };
  } else {
    evaluations.push(newEvaluation);
  }

  const reqIndex = requirements.findIndex(r => r.id === requirementId);
  if (reqIndex !== -1) {
    requirements[reqIndex] = {
      ...requirements[reqIndex],
      category: data.category,
      priority: data.priority,
      assignee: data.assignee,
      assigneeDept: data.assigneeDept,
      targetVersion: data.targetVersion,
      promiseDate: data.promiseDate,
      status: 'processing',
      updatedAt: now,
    };
  }

  timelines.push({
    id: `t${timelines.length + 1}`,
    requirementId,
    type: 'evaluate',
    operator: '王经理',
    time: now,
    content: `评估完成，优先级：${data.priority === 'critical' ? '紧急' : data.priority === 'high' ? '高' : data.priority === 'medium' ? '中' : '低'}`,
  });

  timelines.push({
    id: `t${timelines.length + 2}`,
    requirementId,
    type: 'status-change',
    operator: '系统',
    time: now,
    content: '状态变更：待评估 → 处理中',
  });

  res.json({
    success: true,
    data: existingIndex !== -1 ? evaluations[existingIndex] : newEvaluation,
  });
});

export default router;
