import express, { type Request, type Response } from 'express';
import {
  getDashboardStats,
  getTopDevices,
  getPendingRequirements,
  getDeadlines,
} from '../data/mockData.js';
import { requirements } from '../data/mockData.js';

const router = express.Router();

router.get('/stats', (_req: Request, res: Response) => {
  const stats = getDashboardStats();
  res.json({
    code: 0,
    message: 'success',
    data: stats,
  });
});

router.get('/top-devices', (_req: Request, res: Response) => {
  const devices = getTopDevices();
  res.json({
    code: 0,
    message: 'success',
    data: devices,
  });
});

router.get('/pending', (_req: Request, res: Response) => {
  const pending = getPendingRequirements();
  res.json({
    code: 0,
    message: 'success',
    data: pending,
  });
});

router.get('/deadlines', (_req: Request, res: Response) => {
  const deadlines = getDeadlines().map(item => {
    const req = requirements.find(r => r.id === item.id);
    return {
      ...item,
      status: req?.status || 'pending',
    };
  });
  res.json({
    code: 0,
    message: 'success',
    data: deadlines,
  });
});

export default router;
