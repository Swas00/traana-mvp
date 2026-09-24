import express from 'express';
import { store } from '../models/index.js';

const router = express.Router();

// GET /api/alerts - List all alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await store.getAlerts();
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/alerts/active - Get current active emergency alerts
router.get('/active', async (req, res) => {
  try {
    const activeAlerts = await store.getActiveAlerts();
    res.json({ success: true, count: activeAlerts.length, data: activeAlerts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/alerts/:id - Get specific alert details
router.get('/:id', async (req, res) => {
  try {
    const alert = await store.getAlertById(req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    res.json({ success: true, data: alert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/alerts - Create a new disaster alert (Admin/Dispatch)
router.post('/', async (req, res) => {
  try {
    const { title, type, severity, location, latitude, longitude, instructions, description, radiusKm, affectedPopulation } = req.body;
    if (!title || !type || !location) {
      return res.status(400).json({ success: false, message: 'Title, type, and location are required.' });
    }

    const created = await store.createAlert({
      title,
      type,
      severity,
      location,
      latitude,
      longitude,
      instructions,
      description,
      radiusKm,
      affectedPopulation,
      active: true
    });

    res.status(201).json({ success: true, message: 'Alert created successfully', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/alerts/:id/toggle - Toggle alert active status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { active } = req.body;
    const updated = await store.toggleAlertActive(req.params.id, active !== undefined ? Boolean(active) : null);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    res.json({ success: true, message: 'Alert status updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
