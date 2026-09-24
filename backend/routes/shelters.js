import express from 'express';
import { store } from '../models/index.js';

const router = express.Router();

// GET /api/shelters - List all shelters
router.get('/', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const shelters = await store.getShelters(lat, lng);
    res.json({ success: true, count: shelters.length, data: shelters });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/shelters/nearby - Find nearby shelters with optional filtering
router.get('/nearby', async (req, res) => {
  try {
    const { maxDistance = 50, accessible, food, water, medical, availableOnly, lat, lng } = req.query;
    let shelters = await store.getShelters(lat, lng);


    if (maxDistance) {
      shelters = shelters.filter(s => s.distanceKm <= parseFloat(maxDistance));
    }
    if (accessible === 'true') {
      shelters = shelters.filter(s => s.accessible === true);
    }
    if (food === 'true') {
      shelters = shelters.filter(s => s.food === true);
    }
    if (water === 'true') {
      shelters = shelters.filter(s => s.water === true);
    }
    if (medical === 'true') {
      shelters = shelters.filter(s => s.medical === true);
    }
    if (availableOnly === 'true') {
      shelters = shelters.filter(s => s.availableSlots > 0 && s.status !== 'FULL');
    }

    res.json({ success: true, count: shelters.length, data: shelters });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/shelters/:id - Get specific shelter details
router.get('/:id', async (req, res) => {
  try {
    const shelter = await store.getShelterById(req.params.id);
    if (!shelter) {
      return res.status(404).json({ success: false, message: 'Shelter not found' });
    }
    res.json({ success: true, data: shelter });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/shelters/:id/capacity - Update available capacity/slots
router.patch('/:id/capacity', async (req, res) => {
  try {
    const { availableSlots } = req.body;
    if (availableSlots === undefined) {
      return res.status(400).json({ success: false, message: 'availableSlots is required' });
    }

    const updated = await store.updateShelterCapacity(req.params.id, availableSlots);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Shelter not found' });
    }

    res.json({ success: true, message: 'Shelter capacity updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
