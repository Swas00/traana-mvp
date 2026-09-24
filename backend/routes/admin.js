import express from 'express';
import { store } from '../models/index.js';

const router = express.Router();

// GET /api/admin/status - Get administrative overview of the crisis network
router.get('/status', async (req, res) => {
  try {
    const alerts = await store.getAlerts();
    const activeAlerts = await store.getActiveAlerts();
    const shelters = await store.getShelters();
    const resources = await store.getResources();

    const totalCapacity = shelters.reduce((acc, s) => acc + s.capacity, 0);
    const availableSlots = shelters.reduce((acc, s) => acc + s.availableSlots, 0);

    res.json({
      success: true,
      data: {
        serverTime: new Date().toISOString(),
        databaseConnected: store.useMongo,
        databaseMode: store.useMongo ? 'MongoDB Local' : 'In-Memory Resilient Cache',
        totalAlerts: alerts.length,
        activeAlertsCount: activeAlerts.length,
        totalShelters: shelters.length,
        totalCapacity,
        availableSlots,
        occupancyRate: Math.round(((totalCapacity - availableSlots) / totalCapacity) * 100),
        totalResources: resources.length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/feedback - List all feature suggestions from friends and reviewers
router.get('/feedback', async (req, res) => {
  try {
    const list = await store.getFeedback();
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/feedback - Submit a new suggestion or feature request
router.post('/feedback', async (req, res) => {
  try {
    const { name, category, suggestion, rating } = req.body;
    if (!suggestion || !suggestion.trim()) {
      return res.status(400).json({ success: false, message: 'Suggestion text is required' });
    }
    const created = await store.addFeedback({ name, category, suggestion, rating });
    res.status(201).json({ success: true, message: 'Thank you! Your suggestion was saved.', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// POST /api/admin/trigger-flood - Trigger the standard High-Severity Flood emergency for testing
router.post('/trigger-flood', async (req, res) => {
  try {
    const alert = await store.triggerFloodEmergency();
    res.json({
      success: true,
      message: 'HIGH-SEVERITY FLOOD alert triggered and activated across TRAANA network!',
      data: alert
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/reset-demo - Reset all collections to default demo seed data
router.post('/reset-demo', async (req, res) => {
  try {
    const result = await store.resetDemo();
    res.json({
      success: true,
      message: result.message
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/preset-simulation - Quick scenario simulation
router.post('/preset-simulation', async (req, res) => {
  try {
    const { scenario } = req.body;
    let newAlertData;

    switch (scenario) {
      case 'WILDFIRE':
        newAlertData = {
          type: 'WILDFIRE',
          title: 'CRITICAL: Rapid Forest Fire Encroachment',
          description: 'Wind-driven brush fire approaching eastern suburbs at 15 km/h. Smoke plumes causing severe visibility drops and respiratory hazards.',
          severity: 'HIGH',
          location: 'Eastern Ridge Forest Border & Suburbs',
          latitude: 28.6300,
          longitude: 77.2600,
          radiusKm: 6.0,
          instructions: [
            'Evacuate immediately toward West Highland shelters.',
            'Wear N95 or damp cloth masks to filter toxic particulate smoke.',
            'Close all windows, vents, and turn off air conditioners before leaving.',
            'Keep vehicle air intakes set to recirculate.'
          ],
          affectedPopulation: 35000,
          active: true
        };
        break;

      case 'EARTHQUAKE_AFTERSHOCK':
        newAlertData = {
          type: 'EARTHQUAKE',
          title: 'MAJOR: Magnitude 5.8 Tremor with Structural Hazard',
          description: 'Intense aftershock recorded. Masonry failure reported in older commercial quarter. Gas main ruptures possible.',
          severity: 'HIGH',
          location: 'Old Metro Core & Central Market',
          latitude: 28.6200,
          longitude: 77.2000,
          radiusKm: 7.5,
          instructions: [
            'Drop, Cover, and Hold On during tremors.',
            'Evacuate multi-story buildings via stairs only; NEVER use elevators.',
            'Check for gas leaks: smell of sulfur means turn off gas immediately from meter.',
            'Assemble at designated open grounds away from power cables and facades.'
          ],
          affectedPopulation: 75000,
          active: true
        };
        break;

      case 'CYCLONE_WARNING':
        newAlertData = {
          type: 'CYCLONE',
          title: 'EXTREME: Cyclone Category 3 Landfall Imminent',
          description: 'Sustained winds 125 km/h with 4-meter tidal surge warning. Power grid will be pre-emptively disconnected.',
          severity: 'CRITICAL',
          location: 'Coastal Lowlands & Delta Sectors',
          latitude: 28.5800,
          longitude: 77.2500,
          radiusKm: 10.0,
          instructions: [
            'Mandatory evacuation for all residents within 3 km of coast.',
            'Board up exterior glass windows with storm shutters or plywood.',
            'Charge all mobile phones, power banks, and battery lamps.',
            'Store at least 15 liters of drinking water per household.'
          ],
          affectedPopulation: 110000,
          active: true
        };
        break;

      case 'TSUNAMI_WARNING':
        newAlertData = {
          type: 'TSUNAMI',
          title: 'RED ALERT: Tsunami Coastal Inundation Surge',
          description: 'Undersea subduction earthquake generated 3.5-meter tsunami waves approaching coastline within 45 minutes.',
          severity: 'CRITICAL',
          location: 'Coastal Belt & Harbor Communities',
          latitude: 28.5700,
          longitude: 77.2600,
          radiusKm: 12.0,
          instructions: [
            'Evacuate immediately at least 2 km inland or to elevation > 15 meters.',
            'If sea water suddenly recedes rapidly, DO NOT approach shore.',
            'Move vertically to 3rd floor or higher of reinforced concrete structures if trapped.',
            'Never stay on beach to watch waves arrive.'
          ],
          affectedPopulation: 95000,
          active: true
        };
        break;

      case 'THUNDERSTORM_LIGHTNING':
        newAlertData = {
          type: 'THUNDERSTORM',
          title: 'SEVERE: Intense Thunderstorm Squall & Lightning Strike Grid',
          description: 'Squall wind gusts 75 km/h with high-density cloud-to-ground lightning discharge. Risk of falling trees and electrocution.',
          severity: 'HIGH',
          location: 'Metro Urban Zone & Open Agricultural Outskirts',
          latitude: 28.6150,
          longitude: 77.2100,
          radiusKm: 8.0,
          instructions: [
            'Seek immediate shelter inside substantial pucca buildings or enclosed metal vehicles.',
            'Do NOT shelter under isolated trees, metal sheds, or open bus stops.',
            'Unplug sensitive electrical appliances and avoid wired corded landlines.',
            'Follow the 30-30 rule: stay sheltered until 30 minutes after the last thunderclap.'
          ],
          affectedPopulation: 130000,
          active: true
        };
        break;

      case 'CLOUDBURST_LANDSLIDE':
        newAlertData = {
          type: 'CLOUDBURST',
          title: 'CRITICAL: Mountain Cloudburst & Torrential Debris Flow',
          description: 'Over 100mm rainfall in 60 minutes triggering flash torrents and severe slope failure across hill road corridors.',
          severity: 'CRITICAL',
          location: 'Valley Corridors & Mountain Slopes',
          latitude: 28.6400,
          longitude: 77.1900,
          radiusKm: 7.0,
          instructions: [
            'Move perpendicular and uphill away from river channels and ravine bottoms.',
            'Listen for unusual sounds: cracking trees or rumbling boulders indicate immediate slide.',
            'Halt vehicle travel on mountain roads immediately and seek stable elevated ground.',
            'Stay alert for secondary slope failures and road collapses.'
          ],
          affectedPopulation: 28000,
          active: true
        };
        break;

      case 'HEATWAVE_RED':
        newAlertData = {
          type: 'HEATWAVE',
          title: 'RED ALERT: Severe Heatwave Conditions (45.8°C Loo)',
          description: 'Excessive ambient daytime temperatures exceeding 45°C with hot dry winds. High risk of heat exhaustion and fatal heat stroke.',
          severity: 'HIGH',
          location: 'Central Urban Core & Semi-Arid Sectors',
          latitude: 28.6250,
          longitude: 77.2050,
          radiusKm: 15.0,
          instructions: [
            'Avoid outdoor sun exposure between 12:00 PM and 3:30 PM.',
            'Drink ORS, buttermilk, nimbu pani, and clean water frequently.',
            'Wear loose light cotton clothes and carry an umbrella or cloth cap.',
            'Provide shaded cool water for pets and domestic livestock.'
          ],
          affectedPopulation: 250000,
          active: true
        };
        break;

      default:
        return res.status(400).json({ success: false, message: 'Unknown scenario' });
    }

    const created = await store.createAlert(newAlertData);
    res.json({
      success: true,
      message: `Scenario '${scenario}' activated successfully!`,
      data: created
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
