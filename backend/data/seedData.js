export const initialAlerts = [
  {
    id: "alert-001",
    type: "FLOOD",
    title: "CRITICAL: Flash Flood Emergency & Rising River Basin",
    description: "Rapidly rising water levels in River Yamuna basin following catastrophic cloudburst upstream. Low-lying urban sectors are facing 3-5 ft inundation. Immediate evacuation ordered for Zones 1 to 4.",
    severity: "HIGH",
    location: "Riverfront Sector 1-4, Central Lowlands",
    latitude: 28.6139,
    longitude: 77.2090,
    radiusKm: 4.5,
    instructions: [
      "Evacuate immediately to designated elevated shelters located in North and East Ridges.",
      "Turn off the main electrical circuit breaker and LPG gas valves before leaving.",
      "DO NOT walk, swim, or drive through moving flood waters (Turn Around, Don't Drown).",
      "Pack essential 72-hour go-bag: medicines, ID cards, power bank, dry food, and clean water bottles.",
      "Stay tuned to TRAANA emergency audio broadcast for live rescue updates."
    ],
    timestamp: new Date().toISOString(),
    active: true,
    affectedPopulation: 45000,
    issuedBy: "State Disaster Management Authority (SDMA)"
  },
  {
    id: "alert-002",
    type: "CYCLONE",
    title: "Cyclone Alert: Gusty Winds & Heavy Precipitation",
    description: "Severe Cyclonic Storm tracking 180 km off coast. High velocity winds of 85-100 km/h predicted within next 12 hours. Flying debris and localized flash floods likely.",
    severity: "MEDIUM",
    location: "Coastal Belt & Harbor Periphery",
    latitude: 28.5800,
    longitude: 77.2500,
    radiusKm: 8.0,
    instructions: [
      "Secure loose rooftop items, tin sheds, and solar panels immediately.",
      "Stay indoors away from glass windows and unreinforced brick walls.",
      "Keep flashlights and battery radios charged.",
      "Fishermen and small crafts strictly prohibited from entering coastal waterways."
    ],
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    active: false,
    affectedPopulation: 85000,
    issuedBy: "Meteorological Department"
  },
  {
    id: "alert-003",
    type: "EARTHQUAKE",
    title: "Seismic Advisory: Minor Tremor Detected",
    description: "Magnitude 4.6 tremor recorded at depth 12 km. Structural damage minimal; aftershock advisory in effect for older multi-story dwellings.",
    severity: "LOW",
    location: "Metro Sub-district North",
    latitude: 28.6600,
    longitude: 77.1800,
    radiusKm: 12.0,
    instructions: [
      "Inspect residential gas lines and water piping for leaks or fissures.",
      "Review Drop, Cover, and Hold On protocols.",
      "Report any deep foundation cracks to municipal helpline."
    ],
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    active: false,
    affectedPopulation: 120000,
    issuedBy: "National Center for Seismology"
  }
];

export const initialShelters = [
  {
    id: "shelter-001",
    name: "North Ridge High School Evacuation Center",
    address: "Block B, High Elevation Ridge Road, Safe Zone North",
    latitude: 28.6380,
    longitude: 77.2140,
    distanceKm: 2.8,
    capacity: 650,
    availableSlots: 240,
    food: true,
    water: true,
    medical: true,
    powerBackup: true,
    accessible: true,
    status: "OPEN",
    contactPerson: "Capt. Rajesh Sharma (Incharge)",
    phone: "+91 98110 23456",
    elevationMeters: 248,
    notes: "Elevated high-ground building, standby doctor and pediatric supplies on site."
  },
  {
    id: "shelter-002",
    name: "Apex Indoor Sports Complex & Relief Hub",
    address: "Sports Avenue, East Highland Park",
    latitude: 28.6250,
    longitude: 77.2400,
    distanceKm: 4.1,
    capacity: 1200,
    availableSlots: 680,
    food: true,
    water: true,
    medical: true,
    powerBackup: true,
    accessible: true,
    status: "OPEN",
    contactPerson: "Dr. Meera Sen (Chief Medical Officer)",
    phone: "+91 98220 34567",
    elevationMeters: 235,
    notes: "Large community hall with solar backup, hot meals station, and pet shelter annex."
  },
  {
    id: "shelter-003",
    name: "Central Community Hall (Overflow Center)",
    address: "Civic Plaza Road, Sector 6",
    latitude: 28.6010,
    longitude: 77.1950,
    distanceKm: 1.9,
    capacity: 300,
    availableSlots: 15,
    food: true,
    water: true,
    medical: false,
    powerBackup: true,
    accessible: false,
    status: "FILLING_FAST",
    contactPerson: "Anil Verma (Coordinator)",
    phone: "+91 98330 45678",
    elevationMeters: 215,
    notes: "Near river periphery. Approaching maximum occupancy; please redirect to North Ridge if possible."
  },
  {
    id: "shelter-004",
    name: "St. Jude Collegiate Auditorium",
    address: "University Circle, West Hillside",
    latitude: 28.6490,
    longitude: 77.1700,
    distanceKm: 5.6,
    capacity: 500,
    availableSlots: 0,
    food: true,
    water: true,
    medical: true,
    powerBackup: true,
    accessible: true,
    status: "FULL",
    contactPerson: "Sister Catherine",
    phone: "+91 98440 56789",
    elevationMeters: 260,
    notes: "Currently at full capacity. Reserve beds kept exclusively for incoming ambulances."
  }
];

export const initialResources = [
  {
    id: "res-001",
    type: "HOSPITAL",
    name: "City Trauma Center & Emergency Hospital",
    address: "Medical Enclave, North Hill",
    latitude: 28.6320,
    longitude: 77.2180,
    contact: "011-26598700 / 102",
    availability: "24x7 Emergency Room, ICU Beds, Blood Bank Active",
    bedsAvailable: 42,
    oxygenAvailable: true,
    ambulanceOnStandby: 8
  },
  {
    id: "res-002",
    type: "POLICE",
    name: "Central Police Station & Search Operations Base",
    address: "Station Road, Sector 3 HQ",
    latitude: 28.6180,
    longitude: 77.2050,
    contact: "112 / 011-23230100",
    availability: "Quick Reaction Team (QRT) & Traffic Diversion Unit deployed",
    personnelCount: 60,
    patrolBoats: 4
  },
  {
    id: "res-003",
    type: "FIRE",
    name: "Metropolitan Fire & Rescue Command Station",
    address: "Bridge Road Industrial Junction",
    latitude: 28.6290,
    longitude: 77.2270,
    contact: "101 / 011-23412222",
    availability: "High-volume water pumps, inflatable rescue rafts, heavy hydraulic cutters",
    fireTenders: 12,
    rescueBoats: 6
  },
  {
    id: "res-004",
    type: "AMBULANCE",
    name: "National Emergency Ambulance Dispatch Hub",
    address: "Ring Road Express Lane Center",
    latitude: 28.6210,
    longitude: 77.2120,
    contact: "108 / 102",
    availability: "Advanced Life Support (ALS) & Basic Life Support (BLS) units active",
    fleetSize: 18,
    activeMissions: 5
  },
  {
    id: "res-005",
    type: "RELIEF",
    name: "Red Cross & Civil Defense Food & Water Relief Point",
    address: "Stadium Grounds, Gate 4",
    latitude: 28.6360,
    longitude: 77.2340,
    contact: "+91 98765 43210",
    availability: "Purified drinking water tanker, packaged ration kits, infant formula",
    waterLiters: 15000,
    rationKits: 3200
  },
  {
    id: "res-006",
    type: "RESCUE",
    name: "NDRF 8th Battalion Flood Relief Outpost",
    address: "Yamuna Barrage Control Yard",
    latitude: 28.6080,
    longitude: 77.2210,
    contact: "011-24363260 / 1078",
    availability: "Inflatable motorboats (OBMs), deep divers, sonar rescue teams",
    boatUnits: 14,
    diverTeams: 5
  }
];

export const initialContacts = [
  { serviceName: "National Disaster Helpline", number: "112", description: "Universal 24x7 Emergency Contact" },
  { serviceName: "Disaster Management Cell (NDMA / SDMA)", number: "1070", description: "Flood, Cyclone & Disaster Control Room" },
  { serviceName: "Ambulance & Medical Emergency", number: "108", description: "Immediate Medical Response & Evacuation" },
  { serviceName: "Fire & Rescue Service", number: "101", description: "Fire, Structure Collapse & Water Rescues" },
  { serviceName: "Police Control Center", number: "100", description: "Emergency Law & Order, Public Safety" },
  { serviceName: "Women & Child Safety Helpline", number: "1091", description: "Specialized Emergency Assistance" }
];

export const avoidHazardZones = [
  {
    id: "hazard-001",
    name: "Lowlands Ring Road Inundation",
    type: "DEEP_WATER",
    description: "Water level 4.2 feet. Swift current. Completely impassable for vehicles.",
    coordinates: [
      [28.6110, 77.2020],
      [28.6145, 77.2080],
      [28.6100, 77.2140],
      [28.6065, 77.2070]
    ],
    severity: "CRITICAL"
  },
  {
    id: "hazard-002",
    name: "Submerged Low-Level Bridge",
    type: "BRIDGE_CLOSED",
    description: "Old River Bridge barricaded by police. Danger of structural scour.",
    coordinates: [
      [28.6210, 77.2300],
      [28.6240, 77.2330],
      [28.6215, 77.2370],
      [28.6185, 77.2330]
    ],
    severity: "HIGH"
  },
  {
    id: "hazard-003",
    name: "Downed High-Voltage Line Zone",
    type: "ELECTRICAL_HAZARD",
    description: "Transformer explosion reported. Electrocution risk in standing puddle.",
    coordinates: [
      [28.6020, 77.1900],
      [28.6050, 77.1940],
      [28.6025, 77.1970],
      [28.5995, 77.1930]
    ],
    severity: "CRITICAL"
  }
];

export const simulatedCitizenLocation = {
  name: "Citizen's Current Location (Simulated)",
  latitude: 28.6105,
  longitude: 77.2055,
  neighborhood: "Sector 2, Flood Affected Lowland",
  status: "IN_HAZARD_ZONE"
};
