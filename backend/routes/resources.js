import express from 'express';
import { store } from '../models/index.js';

const router = express.Router();

// GET /api/resources - List all emergency and relief resources
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const resources = await store.getResources(type);
    res.json({ success: true, count: resources.length, data: resources });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/resources/hospitals - List hospitals and trauma centers
router.get('/hospitals', async (req, res) => {
  try {
    const hospitals = await store.getResources('HOSPITAL');
    res.json({ success: true, count: hospitals.length, data: hospitals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/resources/relief - List food, water, and civil defense relief camps
router.get('/relief', async (req, res) => {
  try {
    const relief = await store.getResources('RELIEF');
    res.json({ success: true, count: relief.length, data: relief });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/resources/contacts - List emergency helpline numbers
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await store.getContacts();
    res.json({ success: true, count: contacts.length, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/resources/hazards - List hazard and avoid zones
router.get('/hazards', (req, res) => {
  try {
    const hazards = store.getHazardZones();
    res.json({ success: true, count: hazards.length, data: hazards });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/resources/citizen-location - Get citizen's simulated location
router.get('/citizen-location', (req, res) => {
  try {
    const loc = store.getCitizenLocation();
    res.json({ success: true, data: loc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/resources/citizen-location - Update citizen's real or simulated location
router.post('/citizen-location', (req, res) => {
  try {
    const { latitude, longitude, name, neighborhood, mode } = req.body;
    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }
    const loc = store.setCitizenLocation(latitude, longitude, name, neighborhood, mode);
    res.json({ success: true, message: 'Citizen location updated', data: loc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/resources/generate-local-shelters - Generate localized emergency shelters around user GPS
router.post('/generate-local-shelters', async (req, res) => {
  try {
    const { latitude, longitude, cityName } = req.body;
    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }
    const shelters = store.generateLocalShelters(latitude, longitude, cityName || 'Local');
    res.json({ success: true, message: 'Localized shelters initialized', data: shelters });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

