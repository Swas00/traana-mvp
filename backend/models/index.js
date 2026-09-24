import mongoose from 'mongoose';
import { initialAlerts, initialShelters, initialResources, initialContacts, avoidHazardZones, simulatedCitizenLocation } from '../data/seedData.js';
import { indiaRegionalDatasets } from '../data/indiaDatasets.js';

// Mongoose Schemas
const alertSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'HIGH' },
  location: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  radiusKm: { type: Number, default: 5 },
  instructions: [{ type: String }],
  timestamp: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  affectedPopulation: { type: Number, default: 0 },
  issuedBy: { type: String, default: 'Disaster Management Authority' }
});

const shelterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  distanceKm: { type: Number, default: 1 },
  capacity: { type: Number, required: true },
  availableSlots: { type: Number, required: true },
  food: { type: Boolean, default: true },
  water: { type: Boolean, default: true },
  medical: { type: Boolean, default: true },
  powerBackup: { type: Boolean, default: true },
  accessible: { type: Boolean, default: true },
  status: { type: String, enum: ['OPEN', 'FILLING_FAST', 'FULL'], default: 'OPEN' },
  contactPerson: String,
  phone: String,
  elevationMeters: Number,
  notes: String
});

const resourceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, enum: ['HOSPITAL', 'POLICE', 'FIRE', 'AMBULANCE', 'RELIEF', 'RESCUE'], required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  contact: { type: String, required: true },
  availability: { type: String, required: true },
  bedsAvailable: Number,
  oxygenAvailable: Boolean,
  ambulanceOnStandby: Number,
  waterLiters: Number,
  rationKits: Number
});

const contactSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  number: { type: String, required: true },
  description: { type: String, required: true }
});

const feedbackSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, default: 'Anonymous Friend' },
  category: { type: String, default: 'NEW_FEATURE' },
  suggestion: { type: String, required: true },
  rating: { type: Number, default: 5 },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: 'NEW' }
});

export const AlertModel = mongoose.model('Alert', alertSchema);
export const ShelterModel = mongoose.model('Shelter', shelterSchema);
export const ResourceModel = mongoose.model('Resource', resourceSchema);
export const ContactModel = mongoose.model('Contact', contactSchema);
export const FeedbackModel = mongoose.model('Feedback', feedbackSchema);


// Haversine formula to compute great-circle distance in kilometers
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 1.0;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
}

// In-Memory Data Store (Provides 100% resilient operation regardless of local MongoDB state)
export class DataStore {
  constructor() {
    this.useMongo = false;
    this.alerts = JSON.parse(JSON.stringify(initialAlerts));
    this.shelters = JSON.parse(JSON.stringify(initialShelters));
    this.resources = JSON.parse(JSON.stringify(initialResources));
    this.contacts = JSON.parse(JSON.stringify(initialContacts));
    this.hazardZones = JSON.parse(JSON.stringify(avoidHazardZones));
    this.citizenLocation = {
      ...JSON.parse(JSON.stringify(simulatedCitizenLocation)),
      mode: 'DEMO'
    };
    this.feedback = [
      {
        id: "fb-1",
        name: "Dev Team Tester",
        category: "NEW_FEATURE",
        suggestion: "Add low-bandwidth offline SMS alerts for when mobile data towers go down.",
        rating: 5,
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        status: "PLANNED"
      }
    ];
  }


  async init(connectedMongo = false) {
    this.useMongo = connectedMongo;
    if (this.useMongo) {
      try {
        const alertCount = await AlertModel.countDocuments();
        if (alertCount === 0) {
          await AlertModel.insertMany(initialAlerts);
          await ShelterModel.insertMany(initialShelters);
          await ResourceModel.insertMany(initialResources);
          await ContactModel.insertMany(initialContacts);
          console.log('[TRAANA DB] Initial seed data successfully seeded into MongoDB.');
        } else {
          console.log(`[TRAANA DB] Loaded existing database with ${alertCount} alerts.`);
        }
      } catch (err) {
        console.warn('[TRAANA DB] MongoDB seeding error, falling back to memory store:', err.message);
        this.useMongo = false;
      }
    }
  }

  async getAlerts() {
    if (this.useMongo) {
      try {
        return await AlertModel.find().sort({ timestamp: -1 });
      } catch (e) {
        console.warn('Mongo error, fallback to memory', e.message);
      }
    }
    return this.alerts;
  }

  async getActiveAlerts() {
    if (this.useMongo) {
      try {
        return await AlertModel.find({ active: true }).sort({ timestamp: -1 });
      } catch (e) {
        console.warn('Mongo error, fallback to memory', e.message);
      }
    }
    return this.alerts.filter(a => a.active);
  }

  async getAlertById(id) {
    if (this.useMongo) {
      try {
        return await AlertModel.findOne({ id });
      } catch (e) {
        console.warn('Mongo error, fallback to memory', e.message);
      }
    }
    return this.alerts.find(a => a.id === id);
  }

  async createAlert(data) {
    const newAlert = {
      id: `alert-${Date.now()}`,
      type: data.type || 'FLOOD',
      title: data.title || 'Simulated Emergency Alert',
      description: data.description || 'Emergency alert triggered by system admin.',
      severity: data.severity || 'HIGH',
      location: data.location || 'Municipal Area Zone 1',
      latitude: Number(data.latitude) || 28.6139,
      longitude: Number(data.longitude) || 77.2090,
      radiusKm: Number(data.radiusKm) || 5,
      instructions: Array.isArray(data.instructions) && data.instructions.length > 0 
        ? data.instructions 
        : ['Evacuate immediately to designated high-elevation shelters.', 'Turn off power breakers and gas valves.', 'Do not drive through flooded roads.'],
      timestamp: new Date().toISOString(),
      active: data.active !== undefined ? Boolean(data.active) : true,
      affectedPopulation: Number(data.affectedPopulation) || 30000,
      issuedBy: data.issuedBy || 'Emergency Operations Center'
    };

    if (this.useMongo) {
      try {
        const created = await AlertModel.create(newAlert);
        this.alerts.unshift(created.toObject());
        return created;
      } catch (e) {
        console.warn('Mongo error on create, fallback to memory', e.message);
      }
    }

    this.alerts.unshift(newAlert);
    return newAlert;
  }

  async toggleAlertActive(id, forcedState = null) {
    let updatedAlert = null;
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      alert.active = forcedState !== null ? forcedState : !alert.active;
      updatedAlert = alert;
    }
    if (this.useMongo) {
      try {
        const doc = await AlertModel.findOne({ id });
        if (doc) {
          doc.active = forcedState !== null ? forcedState : !doc.active;
          await doc.save();
          return doc;
        }
      } catch (e) {
        console.warn('Mongo error on toggle', e.message);
      }
    }
    return updatedAlert;
  }

  async getShelters(userLat = null, userLng = null) {
    let list = this.shelters;
    if (this.useMongo) {
      try {
        list = await ShelterModel.find();
      } catch (e) {
        console.warn('Mongo error', e.message);
      }
    }

    // If user coordinates provided, compute dynamic distances
    const lat = userLat !== null ? Number(userLat) : this.citizenLocation.latitude;
    const lng = userLng !== null ? Number(userLng) : this.citizenLocation.longitude;

    const withDistances = list.map(s => {
      const dist = calculateHaversineDistance(lat, lng, s.latitude, s.longitude);
      const obj = s.toObject ? s.toObject() : { ...s };
      return { ...obj, distanceKm: dist };
    });

    return withDistances.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  async getShelterById(id) {
    if (this.useMongo) {
      try {
        return await ShelterModel.findOne({ id });
      } catch (e) {
        console.warn('Mongo error', e.message);
      }
    }
    return this.shelters.find(s => s.id === id);
  }

  async updateShelterCapacity(id, availableSlots) {
    const slots = Number(availableSlots);
    const shelter = this.shelters.find(s => s.id === id);
    if (shelter) {
      shelter.availableSlots = slots;
      shelter.status = slots === 0 ? 'FULL' : (slots < (shelter.capacity * 0.2) ? 'FILLING_FAST' : 'OPEN');
    }
    if (this.useMongo) {
      try {
        const doc = await ShelterModel.findOne({ id });
        if (doc) {
          doc.availableSlots = slots;
          doc.status = slots === 0 ? 'FULL' : (slots < (doc.capacity * 0.2) ? 'FILLING_FAST' : 'OPEN');
          await doc.save();
          return doc;
        }
      } catch (e) {
        console.warn('Mongo error on capacity update', e.message);
      }
    }
    return shelter;
  }

  async getResources(type = null) {
    if (this.useMongo) {
      try {
        const query = type ? { type: type.toUpperCase() } : {};
        return await ResourceModel.find(query);
      } catch (e) {
        console.warn('Mongo error', e.message);
      }
    }
    if (type) {
      return this.resources.filter(r => r.type.toLowerCase() === type.toLowerCase());
    }
    return this.resources;
  }

  async getContacts() {
    if (this.useMongo) {
      try {
        return await ContactModel.find();
      } catch (e) {
        console.warn('Mongo error', e.message);
      }
    }
    return this.contacts;
  }

  async getFeedback() {
    if (this.useMongo) {
      try {
        return await FeedbackModel.find().sort({ timestamp: -1 });
      } catch (e) {
        console.warn('Mongo error', e.message);
      }
    }
    return this.feedback;
  }

  async addFeedback(data) {
    const item = {
      id: `fb-${Date.now()}`,
      name: data.name || 'Anonymous Friend',
      category: data.category || 'NEW_FEATURE',
      suggestion: data.suggestion,
      rating: Number(data.rating) || 5,
      timestamp: new Date().toISOString(),
      status: 'NEW'
    };

    if (this.useMongo) {
      try {
        const created = await FeedbackModel.create(item);
        this.feedback.unshift(created.toObject());
        return created;
      } catch (e) {
        console.warn('Mongo error saving feedback', e.message);
      }
    }

    this.feedback.unshift(item);
    return item;
  }


  getHazardZones() {
    return this.hazardZones;
  }

  getCitizenLocation() {
    return this.citizenLocation;
  }

  setCitizenLocation(lat, lng, name, neighborhood = null, mode = 'CUSTOM') {
    const latitude = Number(lat);
    const longitude = Number(lng);
    
    // Check if citizen is in danger zone of any active alert
    const activeAlerts = this.alerts.filter(a => a.active);
    let isInDanger = false;
    let closestAlertDistance = 9999;
    let closestAlert = null;

    activeAlerts.forEach(a => {
      const dist = calculateHaversineDistance(latitude, longitude, a.latitude, a.longitude);
      if (dist < closestAlertDistance) {
        closestAlertDistance = dist;
        closestAlert = a;
      }
      if (dist <= a.radiusKm) {
        isInDanger = true;
      }
    });

    this.citizenLocation = {
      name: name || (mode === 'GPS' ? 'Citizen Detected Location (GPS)' : 'Citizen Custom Location'),
      latitude,
      longitude,
      neighborhood: neighborhood || (mode === 'GPS' ? 'Detected via GPS Device' : 'Selected Map Coordinates'),
      mode: mode || 'GPS',
      isInDanger,
      closestAlertDistance,
      closestAlert: closestAlert ? { id: closestAlert.id, title: closestAlert.title, severity: closestAlert.severity } : null,
      status: isInDanger ? 'IN_HAZARD_ZONE' : 'SAFE_SECTOR'
    };

    return this.citizenLocation;
  }

  // Generate localized shelters around the user's real GPS position
  generateLocalShelters(lat, lng, cityName = 'Local') {
    const centerLat = Number(lat);
    const centerLng = Number(lng);

    const localShelters = [
      {
        id: `shelter-local-1`,
        name: `${cityName} Municipal Indoor Sports Complex`,
        address: `Sector 4 Central Elevated Ground, ${cityName}`,
        latitude: centerLat + 0.015,
        longitude: centerLng + 0.012,
        distanceKm: 1.8,
        capacity: 500,
        availableSlots: 220,
        food: true,
        water: true,
        medical: true,
        powerBackup: true,
        accessible: true,
        status: "OPEN",
        contactPerson: "Disaster Field Incharge",
        phone: "+91 98110 55443",
        elevationMeters: 45,
        notes: "Designated civil defense emergency evacuation station with standby paramedics."
      },
      {
        id: `shelter-local-2`,
        name: `${cityName} Senior Secondary High School`,
        address: `North Hill Road, ${cityName}`,
        latitude: centerLat + 0.024,
        longitude: centerLng - 0.015,
        distanceKm: 3.1,
        capacity: 800,
        availableSlots: 450,
        food: true,
        water: true,
        medical: true,
        powerBackup: true,
        accessible: true,
        status: "OPEN",
        contactPerson: "Dr. Alok Verma",
        phone: "+91 98220 88776",
        elevationMeters: 55,
        notes: "Elevated high-ground campus equipped with solar power and potable water supply."
      },
      {
        id: `shelter-local-3`,
        name: `${cityName} Community Relief Hall`,
        address: `Civic Center Plaza, ${cityName}`,
        latitude: centerLat - 0.012,
        longitude: centerLng + 0.018,
        distanceKm: 2.3,
        capacity: 350,
        availableSlots: 0,
        food: true,
        water: true,
        medical: false,
        powerBackup: true,
        accessible: false,
        status: "FULL",
        contactPerson: "R. K. Sharma",
        phone: "+91 98330 22110",
        elevationMeters: 38,
        notes: "Currently at full occupancy. Diverting citizens to the Sports Complex."
      }
    ];

    this.shelters = localShelters;
    return this.shelters;
  }


  async resetDemo() {
    this.alerts = JSON.parse(JSON.stringify(initialAlerts));
    this.shelters = JSON.parse(JSON.stringify(initialShelters));
    this.resources = JSON.parse(JSON.stringify(initialResources));
    this.contacts = JSON.parse(JSON.stringify(initialContacts));
    this.hazardZones = JSON.parse(JSON.stringify(avoidHazardZones));
    this.citizenLocation = JSON.parse(JSON.stringify(simulatedCitizenLocation));

    if (this.useMongo) {
      try {
        await AlertModel.deleteMany({});
        await ShelterModel.deleteMany({});
        await ResourceModel.deleteMany({});
        await ContactModel.deleteMany({});
        await AlertModel.insertMany(initialAlerts);
        await ShelterModel.insertMany(initialShelters);
        await ResourceModel.insertMany(initialResources);
        await ContactModel.insertMany(initialContacts);
      } catch (e) {
        console.warn('Mongo reset error', e.message);
      }
    }
    return { success: true, message: "Demo data reset to baseline successfully." };
  }

  async triggerFloodEmergency() {
    // Ensure the main flood alert is ACTIVE and at the top
    const floodAlert = this.alerts.find(a => a.type === 'FLOOD');
    if (floodAlert) {
      floodAlert.active = true;
      floodAlert.timestamp = new Date().toISOString();
    }
    if (this.useMongo) {
      try {
        await AlertModel.findOneAndUpdate({ type: 'FLOOD' }, { active: true, timestamp: new Date() });
      } catch (e) {
        console.warn('Mongo error triggering flood', e.message);
      }
    }
    return floodAlert || this.alerts[0];
  }

  async loadIndiaPreset(presetKey) {
    const preset = indiaRegionalDatasets[presetKey];
    if (!preset) {
      throw new Error(`Unknown Indian dataset preset: ${presetKey}`);
    }

    if (preset.alert) {
      this.alerts = [{ ...preset.alert, active: true, timestamp: new Date().toISOString() }];
    }
    if (preset.shelters && preset.shelters.length > 0) {
      this.shelters = JSON.parse(JSON.stringify(preset.shelters));
    }
    if (preset.resources && preset.resources.length > 0) {
      this.resources = JSON.parse(JSON.stringify(preset.resources));
    }

    // Set simulated citizen location to a realistic coordinate in that disaster zone
    let simLat = preset.alert.latitude;
    let simLng = preset.alert.longitude;
    let locName = preset.regionName;

    if (presetKey === 'ODISHA_CYCLONE') {
      simLat = 19.8050; // Near Puri Beach risk zone
      simLng = 85.8200;
      locName = 'Puri VIP Road (Coastal Cyclone Zone)';
    } else if (presetKey === 'ASSAM_FLOOD') {
      simLat = 26.1750; // Guwahati Bharalumukh riverside
      simLng = 91.7350;
      locName = 'Guwahati Riverfront (Brahmaputra Flood Basin)';
    } else if (presetKey === 'MUMBAI_MONSOON') {
      simLat = 19.0180; // Dadar Hindmata waterlogging point
      simLng = 72.8450;
      locName = 'Dadar Hindmata Circle (Monsoon Waterlogging)';
    } else if (presetKey === 'DELHI_YAMUNA') {
      simLat = 28.6139;
      simLng = 77.2090;
      locName = 'Yamuna Lowland Flood Sector 2';
    }

    this.setCitizenLocation(simLat, simLng, locName, preset.state, 'PRESET');

    // Update MongoDB if connected
    if (this.useMongo) {
      try {
        await AlertModel.deleteMany({});
        await ShelterModel.deleteMany({});
        if (preset.alert) await AlertModel.create(preset.alert);
        if (preset.shelters) await ShelterModel.insertMany(preset.shelters);
        if (preset.resources) {
          await ResourceModel.deleteMany({});
          await ResourceModel.insertMany(preset.resources);
        }
      } catch (e) {
        console.warn('Mongo preset load error, continued in memory store:', e.message);
      }
    }

    return {
      presetKey,
      regionName: preset.regionName,
      state: preset.state,
      disasterType: preset.disasterType,
      alert: this.alerts[0],
      sheltersCount: this.shelters.length,
      resourcesCount: this.resources.length,
      citizenLocation: this.citizenLocation
    };
  }

  async importCustomShelters(sheltersList) {
    if (!Array.isArray(sheltersList) || sheltersList.length === 0) {
      throw new Error("Invalid shelters array provided");
    }

    const formatted = sheltersList.map((s, idx) => ({
      id: s.id || `shelter-custom-${Date.now()}-${idx}`,
      name: s.name || `Relief Shelter ${idx + 1}`,
      address: s.address || 'Indian Regional Relief Site',
      latitude: Number(s.latitude) || (this.citizenLocation.latitude + (idx * 0.008)),
      longitude: Number(s.longitude) || (this.citizenLocation.longitude + (idx * 0.008)),
      distanceKm: Number(s.distanceKm) || 2.0,
      capacity: Number(s.capacity) || 500,
      availableSlots: s.availableSlots !== undefined ? Number(s.availableSlots) : (Number(s.capacity) || 500),
      food: s.food !== undefined ? Boolean(s.food) : true,
      water: s.water !== undefined ? Boolean(s.water) : true,
      medical: s.medical !== undefined ? Boolean(s.medical) : false,
      powerBackup: s.powerBackup !== undefined ? Boolean(s.powerBackup) : true,
      accessible: s.accessible !== undefined ? Boolean(s.accessible) : true,
      status: s.status || 'OPEN',
      contactPerson: s.contactPerson || 'Disaster Relief Incharge',
      phone: s.phone || '1070',
      elevationMeters: Number(s.elevationMeters) || 25,
      notes: s.notes || 'Imported into TRAANA'
    }));

    // Prepend to current active shelters
    this.shelters = [...formatted, ...this.shelters];

    if (this.useMongo) {
      try {
        await ShelterModel.insertMany(formatted);
      } catch (e) {
        console.warn('Mongo custom shelters import error:', e.message);
      }
    }

    return formatted;
  }
}


export const store = new DataStore();
