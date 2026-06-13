import express, { type Request, type Response } from 'express';
import {
  getDashboardStats,
  getTopDevices,
  getPendingRequirements,
  getDeadlines,
} from '../data/mockData.js';

const router = express.Router();

router.get('/stats', (_req: Request, res: Response) => {
  const stats = getDashboardStats();
  res.json({
    success: true,
    data: stats,
  });
});

router.get('/top-devices', (_req: Request, res: Response) => {
  const devices = getTopDevices();
  res.json({
    success: true,
    data: devices,
  });
});

router.get('/pending', (_req: Request, res: Response) => {
  const pending = getPendingRequirements();
  res.json({
    success: true,
    data: pending,
  });
});

router.get('/deadlines', (_req: Request, res: Response) => {
  const deadlines = getDeadlines();
  res.json({
    success: true,
    data: deadlines,
  });
});

export default router;
