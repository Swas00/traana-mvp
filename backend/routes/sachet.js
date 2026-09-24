import express from 'express';
import { sachetService } from '../services/sachetSync.js';
import { store } from '../models/index.js';

const router = express.Router();

// GET /api/sachet/live-alerts - Get all real-time synchronized NDMA SACHET alerts
router.get('/live-alerts', (req, res) => {
  const { severity, state, limit } = req.query;
  let alerts = sachetService.getLiveAlerts();

  if (severity) {
    alerts = alerts.filter(a => a.severity.toLowerCase() === severity.toLowerCase());
  }

  if (state) {
    alerts = alerts.filter(a => a.location.toLowerCase().includes(state.toLowerCase()));
  }

  const count = alerts.length;
  const max = limit ? Number(limit) : 100;

  res.json({
    success: true,
    totalCount: count,
    source: 'https://sachet.ndma.gov.in/',
    syncTime: sachetService.lastSyncTime,
    status: sachetService.syncStatus,
    data: alerts.slice(0, max)
  });
});

// GET /api/sachet/telemetry - Live sync status and NDMA national metrics
router.get('/telemetry', (req, res) => {
  res.json({
    success: true,
    data: sachetService.getTelemetry()
  });
});

// POST /api/sachet/sync-now - Force immediate pull from sachet.ndma.gov.in
router.post('/sync-now', async (req, res) => {
  try {
    const result = await sachetService.syncNow();
    res.json({
      success: true,
      message: `Synchronized with NDMA SACHET (${sachetService.liveAlerts.length} live alerts)`,
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/sachet/activate-alert - Set a real live SACHET alert as TRAANA's active crisis alert
router.post('/activate-alert', async (req, res) => {
  try {
    const { alertId } = req.body;
    const all = sachetService.getLiveAlerts();
    const target = all.find(a => a.id === alertId || String(a.sachetId) === String(alertId)) || all[0];

    if (!target) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    // Ingest into store's active alerts
    const activatedAlert = await store.createAlert({
      title: target.title,
      type: target.type,
      severity: target.severity,
      location: target.location,
      latitude: target.latitude,
      longitude: target.longitude,
      radiusKm: target.radiusKm,
      description: target.description,
      instructions: target.instructions,
      affectedPopulation: target.areaCoveredSqKm ? Math.round(target.areaCoveredSqKm * 2.5) : 85000,
      issuedBy: target.issuedBy,
      active: true
    });

    // Move citizen near the live alert centroid to experience the threat proximity
    store.setCitizenLocation(
      target.latitude + 0.015,
      target.longitude - 0.012,
      `Citizen in ${target.location.split(',')[0]} (NDMA Live Risk Zone)`,
      target.location.split('districts')[0],
      'SACHET_LIVE'
    );

    // Generate local relief shelters around this live Indian coordinate
    store.generateLocalShelters(target.latitude, target.longitude, target.location.split(',')[0].trim());

    res.json({
      success: true,
      message: `Activated real-time alert: ${target.title}`,
      data: {
        alert: activatedAlert,
        citizenLocation: store.citizenLocation,
        sheltersCount: store.shelters.length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
