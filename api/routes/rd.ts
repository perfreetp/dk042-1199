import express, { type Request, type Response } from 'express';
import {
  rdCommunications,
  getRdCommunicationsByRequirementId,
  requirements,
  timelines,
} from '../data/mockData.js';
import type { RdCommunication } from '../types/index.js';

const router = express.Router();

router.get('/:requirementId', (req: Request, res: Response) => {
  const { requirementId } = req.params;
  const communications = getRdCommunicationsByRequirementId(requirementId);

  res.json({
    code: 0,
    message: 'success',
    data: communications,
  });
});

router.post('/:requirementId', (req: Request, res: Response) => {
  const { requirementId } = req.params;
  const data = req.body as Omit<RdCommunication, 'id' | 'requirementId' | 'responseTime'> & { responder?: string };

  const now = new Date().toISOString();
  const rdId = `rd${rdCommunications.length + 1}`;

  const newCommunication: RdCommunication = {
    id: rdId,
    requirementId,
    ...data,
    responseTime: now,
    responder: data.responder || '陈研发',
  };

  rdCommunications.push(newCommunication);

  const reqIndex = requirements.findIndex(r => r.id === requirementId);
  if (reqIndex !== -1) {
    requirements[reqIndex] = {
      ...requirements[reqIndex],
      updatedAt: now,
    };
  }

  timelines.push({
    id: `t${timelines.length + 1}`,
    requirementId,
    type: 'rd-reply',
    operator: data.responder || '陈研发',
    time: now,
    content: `研发答复：${data.content.substring(0, 30)}...`,
  });

  res.json({
    code: 0,
    message: 'success',
    data: newCommunication,
  });
});

export default router;
