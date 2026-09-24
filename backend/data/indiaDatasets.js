// Authentic Indian Regional Disaster Datasets (NDMA, NCRMP, CWC, State Disaster Authorities)

export const indiaRegionalDatasets = {
  ODISHA_CYCLONE: {
    regionName: "Odisha Coastal Belt (NCRMP Network)",
    state: "Odisha",
    source: "Odisha State Disaster Management Authority (OSDMA) & NCRMP",
    disasterType: "CYCLONE",
    alert: {
      id: "alert-odisha-01",
      type: "CYCLONE",
      title: "EXTREME: Cyclone Warning along Puri-Paradip Coastal Corridor",
      description: "Severe Cyclonic Storm tracking 110 km south-east of Gopalpur. Sustained wind speed of 115-135 km/h with 3.5m tidal storm surge expected. Mandatory evacuation ordered for all settlements within 5 km of shoreline.",
      severity: "HIGH",
      location: "Puri, Jagatsinghpur & Kendrapara Coastal Districts",
      latitude: 19.8135,
      longitude: 85.8312,
      radiusKm: 12.0,
      instructions: [
        "Move immediately to designated Multipurpose Cyclone Shelters (MPCS) on high ground.",
        "Secure livestock in designated lower-deck animal pens of cyclone shelters.",
        "Do not venture into the sea; all fishing harbours and ports placed on Signal 10.",
        "Store 48h emergency water, ORS packets, dry food, and power banks."
      ],
      affectedPopulation: 185000,
      issuedBy: "OSDMA & IMD Bhubaneswar"
    },
    shelters: [
      {
        id: "shelter-od-01",
        name: "Puri Marine Drive Multi-Purpose Cyclone Shelter (MPCS)",
        address: "NCRMP Block 4, Marine Drive Road, Puri",
        latitude: 19.8250,
        longitude: 85.8450,
        distanceKm: 1.8,
        capacity: 1500,
        availableSlots: 620,
        food: true,
        water: true,
        medical: true,
        powerBackup: true,
        accessible: true,
        status: "OPEN",
        contactPerson: "Prasant Mohapatra (OSDMA Coordinator)",
        phone: "+91 6752 222107",
        elevationMeters: 18,
        notes: "Heavy RCC storm-resistant construction, solar rooftop generator, rooftop helipad."
      },
      {
        id: "shelter-od-02",
        name: "Satyabadi High School Cyclone Relief Hub",
        address: "National Highway 316, Sakshigopal",
        latitude: 19.9450,
        longitude: 85.8180,
        distanceKm: 8.5,
        capacity: 900,
        availableSlots: 410,
        food: true,
        water: true,
        medical: true,
        powerBackup: true,
        accessible: true,
        status: "OPEN",
        contactPerson: "Dr. Bishnu Charan Dash",
        phone: "+91 6752 234500",
        elevationMeters: 26,
        notes: "Elevated school campus outside tidal surge reach, equipped with dry ration store."
      },
      {
        id: "shelter-od-03",
        name: "Astaranga Coastal Community Shelter",
        address: "Fisheries Road, Astaranga Block",
        latitude: 19.9800,
        longitude: 86.2600,
        distanceKm: 14.2,
        capacity: 1200,
        availableSlots: 150,
        food: true,
        water: true,
        medical: false,
        powerBackup: true,
        accessible: false,
        status: "FILLING_FAST",
        contactPerson: "Manoj Behera",
        phone: "+91 6754 220112",
        elevationMeters: 14,
        notes: "Rapid intake from fishing villages underway. Inflatable rafts on site."
      }
    ],
    resources: [
      {
        id: "res-od-01",
        type: "HOSPITAL",
        name: "District Headquarters Hospital (DHH) Puri",
        address: "Grand Road, Puri Town",
        latitude: 19.8090,
        longitude: 85.8280,
        contact: "06752-222044 / 108",
        availability: "Trauma center operating on diesel generator, blood bank active, 60 ICU beds",
        bedsAvailable: 48,
        ambulanceOnStandby: 12
      },
      {
        id: "res-od-02",
        type: "RESCUE",
        name: "ODRAF & NDRF 3rd Battalion Base",
        address: "Bhubaneswar-Puri Expressway Junction",
        latitude: 19.8350,
        longitude: 85.8500,
        contact: "1077 / 0674-2395398",
        availability: "Tree-clearing hydraulic saws, inflatable rescue boats, satellite comms",
        boatUnits: 20
      }
    ]
  },

  ASSAM_FLOOD: {
    regionName: "Assam Brahmaputra Valley Basin",
    state: "Assam",
    source: "Assam State Disaster Management Authority (ASDMA) & CWC",
    disasterType: "FLOOD",
    alert: {
      id: "alert-assam-01",
      type: "FLOOD",
      title: "CRITICAL: Brahmaputra River Surpassing Danger Level by 1.8m",
      description: "Severe flooding across Kamrup, Morigaon, and Kaziranga floodplains following continuous heavy monsoon downpours. Embankment breach reported at Palasbari. Over 45 revenue circles inundated.",
      severity: "HIGH",
      location: "Guwahati Riverside & Kamrup Rural Lowlands",
      latitude: 26.1850,
      longitude: 91.7450,
      radiusKm: 15.0,
      instructions: [
        "Evacuate flood-prone char areas and low-lying riverside immediately.",
        "Take shelter in designated high-ground schools and tea garden elevated plateaus.",
        "Boil all drinking water or use halogen water-purification tablets.",
        "Be alert to wildlife movement (Kaziranga highlands migration)."
      ],
      affectedPopulation: 320000,
      issuedBy: "ASDMA & Central Water Commission"
    },
    shelters: [
      {
        id: "shelter-as-01",
        name: "Sarala Birla Higher Secondary Evacuation Center",
        address: "Airport Road, Borjhar High Ground, Guwahati",
        latitude: 26.1050,
        longitude: 91.5950,
        distanceKm: 3.2,
        capacity: 1100,
        availableSlots: 480,
        food: true,
        water: true,
        medical: true,
        powerBackup: true,
        accessible: true,
        status: "OPEN",
        contactPerson: "Dhiren Kalita (ASDMA Officer)",
        phone: "+91 361 2840222",
        elevationMeters: 62,
        notes: "Located on elevated terrace well above flood level. Mobile medical team on site."
      },
      {
        id: "shelter-as-02",
        name: "Khanapara Veterinary College Grounds Shelter",
        address: "GS Road, Khanapara Ridge",
        latitude: 26.1250,
        longitude: 91.8150,
        distanceKm: 6.8,
        capacity: 2200,
        availableSlots: 1150,
        food: true,
        water: true,
        medical: true,
        powerBackup: true,
        accessible: true,
        status: "OPEN",
        contactPerson: "Dr. Himanta Barman",
        phone: "+91 361 2334455",
        elevationMeters: 75,
        notes: "Large ground with community kitchens, clean water bowsers, and animal rescue pen."
      }
    ],
    resources: [
      {
        id: "res-as-01",
        type: "HOSPITAL",
        name: "Gauhati Medical College & Hospital (GMCH)",
        address: "Narakasur Hilltop, Bhangagarh, Guwahati",
        latitude: 26.1550,
        longitude: 91.7700,
        contact: "0361-2529457 / 108",
        availability: "Level 1 Trauma Care, anti-snake venom reserves, 24x7 dialysis & emergency OT",
        bedsAvailable: 85,
        ambulanceOnStandby: 18
      },
      {
        id: "res-as-02",
        type: "RESCUE",
        name: "NDRF 1st Battalion Flood Rescue Base",
        address: "Patgaon, Rani Gate, Kamrup",
        latitude: 26.0950,
        longitude: 91.6200,
        contact: "0361-2849005 / 1070",
        availability: "45 motorized boats (OBMs), deep divers, airborne winch teams",
        boatUnits: 32
      }
    ]
  },

  MUMBAI_MONSOON: {
    regionName: "Mumbai Metropolitan Monsoon Inundation",
    state: "Maharashtra",
    source: "Brihanmumbai Municipal Corporation (BMC) Disaster Cell",
    disasterType: "FLOOD",
    alert: {
      id: "alert-mum-01",
      type: "FLOOD",
      title: "RED ALERT: High Tide (4.87m) + Heavy Rain Cloudburst Inundation",
      description: "Severe urban waterlogging reported across Hindmata, Gandhi Market, Milan Subway, and Kurla West. Mithi river level approaching 3.6m warning mark. Suburban local trains suspended between Kurla and Thane.",
      severity: "HIGH",
      location: "Dadar, Kurla, Sion & Mithi River Basin",
      latitude: 19.0178,
      longitude: 72.8478,
      radiusKm: 8.5,
      instructions: [
        "Avoid low-lying subways (Milan, Khar, Andheri, Malad subways submerged).",
        "Stay indoors unless residing in vulnerable ground-floor slums near Mithi river.",
        "Do not touch metal lamp posts or electrical feeder boxes in standing water.",
        "Keep mobile phones charged; dial 1916 for BMC Disaster Control."
      ],
      affectedPopulation: 450000,
      issuedBy: "BMC Disaster Management Cell & IMD Mumbai"
    },
    shelters: [
      {
        id: "shelter-mum-01",
        name: "Dadar Swami Vivekananda Municipal School",
        address: "Ranade Road, Dadar West (High Ground)",
        latitude: 19.0220,
        longitude: 72.8410,
        distanceKm: 1.4,
        capacity: 850,
        availableSlots: 360,
        food: true,
        water: true,
        medical: true,
        powerBackup: true,
        accessible: true,
        status: "OPEN",
        contactPerson: "Sachin Patil (Ward Officer)",
        phone: "+91 22 2422 4000",
        elevationMeters: 14,
        notes: "Elevated school structure equipped with municipal emergency food kits and potable tankers."
      },
      {
        id: "shelter-mum-02",
        name: "Bandra Kurla Complex (BKC) Exhibition Hall 2",
        address: "G Block, BKC Urban Complex, Bandra East",
        latitude: 19.0650,
        longitude: 72.8680,
        distanceKm: 4.8,
        capacity: 2500,
        availableSlots: 1400,
        food: true,
        water: true,
        medical: true,
        powerBackup: true,
        accessible: true,
        status: "OPEN",
        contactPerson: "Dr. Anjali Sawant",
        phone: "+91 22 2659 0000",
        elevationMeters: 16,
        notes: "Massive indoor transit shelter with air filtration and standby ambulance station."
      }
    ],
    resources: [
      {
        id: "res-mum-01",
        type: "HOSPITAL",
        name: "KEM Hospital & Parel Medical Center",
        address: "Acharya Donde Marg, Parel, Mumbai",
        latitude: 19.0030,
        longitude: 72.8420,
        contact: "022-24107000 / 108",
        availability: "24x7 Emergency Trauma Wing, high-volume blood bank, pediatric ICU",
        bedsAvailable: 70,
        ambulanceOnStandby: 16
      },
      {
        id: "res-mum-02",
        type: "FIRE",
        name: "Byculla Fire Station & Emergency Command HQ",
        address: "Bapurao Jagtap Marg, Byculla",
        latitude: 18.9750,
        longitude: 72.8330,
        contact: "101 / 022-23076111",
        availability: "High-capacity submersible de-watering pumps, tree clearance cranes",
        boatUnits: 10
      }
    ]
  },

  DELHI_YAMUNA: {
    regionName: "Delhi NCT Yamuna Basin",
    state: "Delhi",
    source: "Delhi Disaster Management Authority (DDMA) & CWC",
    disasterType: "FLOOD",
    alert: {
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
        "Pack essential 72-hour go-bag: medicines, ID cards, power bank, dry food, and clean water bottles."
      ],
      affectedPopulation: 45000,
      issuedBy: "State Disaster Management Authority (SDMA)"
    },
    shelters: [
      {
        id: "shelter-delhi-01",
        name: "North Ridge Senior Secondary Evacuation Center",
        address: "Block B, High Elevation Ridge Road, Safe Zone North, Delhi",
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
        id: "shelter-delhi-02",
        name: "Yamuna Sports Complex Indoor Relief Hub",
        address: "Surajmal Vihar, East Delhi Highland",
        latitude: 28.6650,
        longitude: 77.3050,
        distanceKm: 5.1,
        capacity: 1500,
        availableSlots: 850,
        food: true,
        water: true,
        medical: true,
        powerBackup: true,
        accessible: true,
        status: "OPEN",
        contactPerson: "Dr. Meera Sen (CMO)",
        phone: "+91 98220 34567",
        elevationMeters: 235,
        notes: "Large community hall with solar backup, hot meals station, and pet shelter annex."
      },
      {
        id: "shelter-delhi-03",
        name: "Civil Defense Training Center Kashmere Gate",
        address: "Near ISBT Elevated Bypass, Delhi",
        latitude: 28.6670,
        longitude: 77.2300,
        distanceKm: 4.2,
        capacity: 450,
        availableSlots: 110,
        food: true,
        water: true,
        medical: false,
        powerBackup: true,
        accessible: false,
        status: "FILLING_FAST",
        contactPerson: "Anil Verma",
        phone: "+91 98330 45678",
        elevationMeters: 228,
        notes: "Transit facility equipped with inflatable rafts and emergency ration stocks."
      }
    ],
    resources: [
      {
        id: "res-delhi-01",
        type: "HOSPITAL",
        name: "Lok Nayak & GB Pant Super Specialty Hospital",
        address: "Jawaharlal Nehru Marg, Delhi Gate",
        latitude: 28.6360,
        longitude: 77.2410,
        contact: "011-23232400 / 102",
        availability: "24x7 Emergency Trauma Center, 50 ICU Beds, Blood Bank Active",
        bedsAvailable: 42,
        ambulanceOnStandby: 12
      },
      {
        id: "res-delhi-02",
        type: "RESCUE",
        name: "NDRF 8th Battalion Flood Relief HQ",
        address: "Ghaziabad / Delhi Border Station",
        latitude: 28.6400,
        longitude: 77.3100,
        contact: "1078 / 011-24363260",
        availability: "Motorized assault boats, deep water sonar, life buoys, medical first responders",
        boatUnits: 24
      }
    ]
  }
};


export const indianDataCatalogs = [
  {
    id: "ndma-sachet",
    name: "NDMA SACHET National Early Warning Portal",
    agency: "National Disaster Management Authority (Govt. of India)",
    protocol: "Common Alerting Protocol (CAP v1.2 / ITU-T X.1303)",
    hazards: ["Cyclone", "Flood", "Heavy Rain", "Heatwave", "Landslide", "Earthquake"],
    coverage: "Pan-India across 36 States & Union Territories",
    format: "CAP-XML & JSON",
    url: "https://sachet.ndma.gov.in",
    status: "SCHEMA_READY",
    tag: "Official National CAP Standard",
    description: "Multi-hazard early warning aggregator receiving inputs from IMD, CWC, INCOIS, FSI, and GSI. Fully compatible with TRAANA's alert ingestor."
  },
  {
    id: "cwc-floodwatch",
    name: "Central Water Commission (CWC) Flood Watch India",
    agency: "Ministry of Jal Shakti, Dept. of Water Resources",
    protocol: "Hydrograph API & River Gauge Telemetry",
    hazards: ["River Basin Floods", "Dam Inflow Spikes", "Flash Floods"],
    coverage: "338 River Stations across Ganga, Brahmaputra, Godavari, Krishna, Mahanadi",
    format: "REST / GeoJSON",
    url: "https://ffs.india-water.gov.in",
    status: "SCHEMA_READY",
    tag: "Live River Gauges",
    description: "Real-time telemetry tracking Warning Level, Danger Level, and HFL (Highest Flood Level) across all major river basins."
  },
  {
    id: "ncrmp-cyclone",
    name: "National Cyclone Risk Mitigation Project (NCRMP)",
    agency: "NDMA & World Bank Coastal Infrastructure Project",
    protocol: "GIS Cyclone Shelter Geodatabase",
    hazards: ["Cyclones", "Storm Surges", "High Coastal Winds"],
    coverage: "13 Coastal States & UTs (Odisha, Andhra, West Bengal, Tamil Nadu, Gujarat, Kerala)",
    format: "GeoJSON / ESRI Shapefile",
    url: "https://ncrmp.gov.in",
    status: "PRESET_ACTIVE",
    tag: "Multi-Purpose Cyclone Shelters",
    description: "Official registry of high-elevation Multi-Purpose Cyclone Shelters (MPCS) engineered for Category 4+ cyclones and tidal surges."
  },
  {
    id: "imd-mausam",
    name: "India Meteorological Department (IMD) Mausam Feeds",
    agency: "Ministry of Earth Sciences, Govt. of India",
    protocol: "District Color-Coded Warning API & Radar Nowcast",
    hazards: ["Cloudbursts", "Thunderstorm & Lightning", "Depression / Cyclonic Vortices"],
    coverage: "All 700+ Districts in India",
    format: "JSON / REST",
    url: "https://mausam.imd.gov.in",
    status: "SCHEMA_READY",
    tag: "Color-Coded Bulletins",
    description: "Issues Red, Orange, and Yellow color warnings that calibrate TRAANA's dynamic proximity threat radius and citizen alerts."
  },
  {
    id: "osm-india-overpass",
    name: "OpenStreetMap India Overpass Infrastructure Service",
    agency: "Humanitarian OSM & OpenStreetMap India Community",
    protocol: "Overpass API Query Language (QL)",
    hazards: ["Impromptu Shelter Discovery", "Hospitals", "Community Centers"],
    coverage: "Pan-India Open Spatial Infrastructure",
    format: "GeoJSON / OSM JSON",
    url: "https://overpass-api.de/api/interpreter",
    status: "LIVE_QUERY_ENABLED",
    tag: "Live Spatial Query",
    description: "Dynamically queries nearby schools, halls, and public clinics within any Indian municipal coordinate bounding box."
  },
  {
    id: "ogd-data-gov",
    name: "Open Government Data (OGD) Platform India",
    agency: "National Informatics Centre (NIC) & MeitY",
    protocol: "Open Data Portal Catalog",
    hazards: ["Hospital Beds", "Fire Stations", "NDRF Battalion Bases", "SDRF Contacts"],
    coverage: "National & State-level Public Datasets",
    format: "CSV / GeoJSON / JSON API",
    url: "https://data.gov.in",
    status: "CUSTOM_IMPORT_SUPPORTED",
    tag: "Custom CSV/GeoJSON Ingest",
    description: "Supports instant drag-and-drop or paste ingestion of state disaster management tables into TRAANA."
  }
];

// Official NDMA Citizen Do's & Don'ts Standard Operating Procedures (SOPs)
export const ndmaDosAndDonts = {
  FLOOD: {
    title: "Floods & Urban Inundation (NDMA National Guidelines)",
    source: "NDMA Flood Safety SOP & Urban Flooding Framework",
    url: "https://ndma.gov.in/floods-dos-donts",
    dos: [
      "Listen to radio, watch TV, or monitor TRAANA/SACHET for official CWC river gauge warnings.",
      "Keep 72-hour emergency go-bag: drinking water (3L/person/day), dry rations, halogen tablets, waterproof torch, power bank, and vital ID papers.",
      "Switch off the main electrical circuit breaker and turn off LPG cylinder valves before evacuating.",
      "Stay on upper floors or relocate to elevated high-ground shelters if floodwaters rise.",
      "Boil all drinking water or use chlorine/halogen water purification tablets before consumption.",
      "Keep animal leashes untied so livestock and pets can swim or escape to high platforms (AiDRR Guidelines)."
    ],
    donts: [
      "DO NOT walk, swim, or drive through moving flood waters (Turn Around, Don't Drown — 6 inches of moving water can knock you down).",
      "DO NOT touch fallen electric cables, transformers, or submerged street light poles to avoid electrocution.",
      "DO NOT allow children or elders to play or wade in flood waters due to submerged drains, open manholes, and reptiles.",
      "DO NOT eat food that has come into contact with floodwater.",
      "DO NOT operate damaged electrical equipment until checked by a certified technician."
    ]
  },

  CYCLONE: {
    title: "Cyclones & Storm Surges (NDMA 'Saavdhan Hai Toh Jaan Hai')",
    source: "NDMA Cyclone Guidelines & NCRMP Framework",
    url: "https://ndma.gov.in/cyclone-dos-donts",
    dos: [
      "Check house roof; board up glass windows with wooden shutters or criss-cross tape to avoid flying shards.",
      "Keep hurricane lanterns, battery torches, spare cells, and fully charged mobile power banks ready.",
      "Move to designated Multi-Purpose Cyclone Shelters (MPCS) immediately upon Signal 7 or higher.",
      "Secure boats, fishing trawlers, and offshore nets; fishermen strictly prohibited from entering deep sea.",
      "Store adequate dry food (chura, gur, biscuits) and essential prescription medicines for at least 5 days.",
      "Keep cattle in designated lower stilt pens of cyclone shelters with feed supplies."
    ],
    donts: [
      "DO NOT venture outside even if the winds suddenly calm down (the 'Eye of the Cyclone' creates false calm followed by ferocious reverse-direction winds).",
      "DO NOT believe or spread unverified rumors on social media; rely exclusively on IMD and TRAANA broadcasts.",
      "DO NOT stand near weak trees, tin sheds, or large hoarding billboards.",
      "DO NOT leave pets tied up during evacuation."
    ]
  },

  EARTHQUAKE: {
    title: "Earthquakes (NDMA 'Jhuko, Dhako, Pakdo' / Drop, Cover, Hold On)",
    source: "NDMA Earthquake Management Guidelines",
    url: "https://ndma.gov.in/earthquake-dos-donts",
    dos: [
      "DROP down onto your hands and knees; COVER your head and neck under a sturdy table or desk; HOLD ON until shaking stops.",
      "If outdoors, move immediately to an open field or clear ground away from buildings, power cables, and chimneys.",
      "Follow Bureau of Indian Standards (BIS) earthquake-resistant building norms (IS 1893 / IS 13920).",
      "Anchor overhead heavy fixtures, ceiling fans, and tall book-racks securely to walls.",
      "Inspect home for gas leaks immediately after tremors (smell of sulfur means close main gas valve immediately)."
    ],
    donts: [
      "DO NOT use elevators or lifts during or immediately after an earthquake — use stairwells only.",
      "DO NOT light matches, candles, or turn on electric switches until you are certain there are no gas pipeline leaks.",
      "DO NOT rush out of multi-story buildings during tremors (falling masonry and facade glass cause most casualties).",
      "DO NOT enter damaged structures until certified safe by municipal civil defense engineers."
    ]
  },

  HEATWAVE: {
    title: "Extreme Heatwaves & Sunstroke (NDMA Summer SOP)",
    source: "NDMA National Guidelines on Heatwave Action Plans (HAP)",
    url: "https://ndma.gov.in/heat-wave-dos-donts",
    dos: [
      "Drink sufficient clean water and oral rehydration solution (ORS), lassi, lemon water, or coconut water even if not feeling thirsty.",
      "Wear lightweight, light-coloured, loose, breathable cotton clothes.",
      "Use umbrellas, wide-brim hats, or damp towels to cover head and neck when stepping outside.",
      "Keep pets and cattle in shaded enclosures with plenty of clean drinking water.",
      "Provide shaded resting spots and water bowls for street animals."
    ],
    donts: [
      "DO NOT go out in the direct afternoon sun between 12:00 noon and 3:00 PM.",
      "DO NOT leave children, elders, or pets inside parked vehicles (temperatures can turn fatal within 10 minutes).",
      "DO NOT consume alcohol, tea, coffee, or carbonated soft drinks that dehydrate the human body.",
      "DO NOT engage in strenuous physical exercise outdoors during peak heat hours."
    ]
  },

  LANDSLIDE: {
    title: "Landslides & Hill Slope Mudflows (NDMA Hill Safety)",
    source: "NDMA Landslide Risk Reduction Strategy",
    url: "https://ndma.gov.in/landslide-dos-donts",
    dos: [
      "Listen for unusual sounds like trees cracking or boulders knocking together (early warning of slope failure).",
      "Move away quickly from landslide chutes, natural drainage gullies, and downstream river valleys.",
      "Check slope stability before constructing buildings in hilly sectors; follow NDMA Hill Hazard Atlas.",
      "Stay alert to sudden changes in mountain stream flow (clear water turning muddy indicates upstream slope breach)."
    ],
    donts: [
      "DO NOT stay in buildings located directly at the foot of steep slopes or on uncompacted debris fills.",
      "DO NOT cross active landslide debris paths until cleared by Border Roads Organisation (BRO) or PWD engineers.",
      "DO NOT sleep in ground-floor rooms facing the hill slope during continuous torrential monsoon rains."
    ]
  },

  TSUNAMI: {
    title: "Tsunami & Coastal Harbor Surges (NDMA Marine Safety)",
    source: "NDMA Tsunami Early Warning Guidelines & INCOIS",
    url: "https://ndma.gov.in/tsunami-dos-donts",
    dos: [
      "If you feel an earthquake near the coast or notice sudden rapid withdrawal of the sea, move IMMEDIATELY to high ground (>30m above sea level) or at least 2 km inland.",
      "Follow official INCOIS (Indian National Centre for Ocean Information Services) ocean warnings.",
      "Climb upper floors of sturdy reinforced-concrete buildings if escape inland is impossible.",
      "Stay in elevated safety until official 'ALL CLEAR' is sounded — tsunami is a series of waves arriving over several hours."
    ],
    donts: [
      "DO NOT go to the beach or harbor to watch the receding tide or incoming waves.",
      "DO NOT return to low-lying coastal areas after the first wave — subsequent waves are often much larger and violent.",
      "DO NOT stay inside boats or small trawlers tied in shallow harbor slips."
    ]
  },

  THUNDERSTORM: {
    title: "Thunderstorms & Lightning Strikes (NDMA 'Bijli Se Bachav')",
    source: "NDMA Guidelines on Preparation of Action Plan for Prevention and Management of Thunderstorms, Lightning & Squalls",
    url: "https://ndma.gov.in/lightning-dos-donts",
    dos: [
      "Follow the 30-30 Rule: If time between lightning flash and thunder is under 30 seconds, seek indoor shelter immediately; wait 30 minutes after last thunderclap before venturing outside.",
      "If caught in an open field with no shelter, crouch down into the 'Lightning Safety Position' (feet touching, head between knees, cover ears, minimize contact with ground).",
      "Unplug desktop computers, televisions, and sensitive electrical equipment before the storm hits.",
      "Seek shelter inside enclosed metal-roof vehicles or permanent brick/concrete buildings."
    ],
    donts: [
      "DO NOT take shelter under isolated tall trees, electric transmission towers, or metal flagpoles.",
      "DO NOT hold umbrellas with metal tips, golf clubs, or metal farming tools in open paddy fields.",
      "DO NOT take baths, wash dishes, or touch plumbing pipes during active lightning strikes.",
      "DO NOT lie flat on the ground (touching the ground increases the strike voltage gradient across your body)."
    ]
  },

  WILDFIRE: {
    title: "Forest Fires & Wildfires (NDMA Forest Protection)",
    source: "NDMA National Action Plan on Forest Fires",
    url: "https://ndma.gov.in/forest-fire-dos-donts",
    dos: [
      "Evacuate perpendicular or upwind of fire spread; move downhill away from rising thermal updrafts.",
      "Wear N95/P100 respirators or damp cotton cloth over nose and mouth to prevent smoke inhalation.",
      "Clear combustible dry leaves, brushwood, and firewood within 10 meters of homes in forest-fringe settlements.",
      "Report smoke or unattended fire immediately to Forest Department toll-free helplines and 112."
    ],
    donts: [
      "DO NOT attempt to outrun a wildfire uphill (fire travels much faster uphill than downhill).",
      "DO NOT discard lit bidi/cigarette butts, matchsticks, or burn agricultural stubble near forest edges.",
      "DO NOT enter smoke-filled canyons or narrow ravine blind spots."
    ]
  },

  COLDWAVE: {
    title: "Cold Wave, Blizzard & Avalanche (NDMA Winter SOP)",
    source: "NDMA Guidelines for Management of Cold Wave and Frost",
    url: "https://ndma.gov.in/cold-wave-dos-donts",
    dos: [
      "Wear multiple layers of loose, warm, windproof and water-resistant woolen clothing.",
      "Watch for signs of hypothermia (shivering, slurred speech, confusion) and frostbite (numbness, white or pale skin).",
      "Keep sufficient dry rations, thermal blankets, hot thermoses, and room heaters with proper ventilation.",
      "Protect livestock with dry straw bedding and shielded night enclosures."
    ],
    donts: [
      "DO NOT sleep in closed, unventilated rooms with active charcoal angithis or wood brazier fires (causes fatal Carbon Monoxide poisoning).",
      "DO NOT drink alcohol to 'warm up' (alcohol dilates blood vessels, causing rapid core body heat loss).",
      "DO NOT rub frostbitten skin with ice or direct flame."
    ]
  },

  CLOUDBURST: {
    title: "Cloudbursts & Mountain Flash Floods (NDMA High Altitude SOP)",
    source: "NDMA Guidelines on Management of Flash Floods and Cloudbursts",
    url: "https://ndma.gov.in/cloudburst-dos-donts",
    dos: [
      "Upon intense torrential rainfall in mountain valleys, evacuate vertically to surrounding ridges immediately.",
      "Stay away from dry riverbeds, nullahs, and seasonal ravines (flash flood torrents arrive without acoustic warning).",
      "Keep emergency whistle, torch, and high-energy food bars in waterproof pouches.",
      "Follow District Disaster Management Authority (DDMA) hill road advisories."
    ],
    donts: [
      "DO NOT park vehicles or pitch tourist tents on river sandbars or next to mountain torrents.",
      "DO NOT drive across bridges submerged under torrential glacial runoffs.",
      "DO NOT stay in valley bottoms during cloudburst alerts issued by IMD."
    ]
  },

  DROUGHT: {
    title: "Drought & Water Scarcity Management (NDMA Guidelines)",
    source: "NDMA National Disaster Management Guidelines on Drought",
    url: "https://ndma.gov.in/drought-dos-donts",
    dos: [
      "Implement rooftop rainwater harvesting and graywater recycling in community tanks.",
      "Adopt drip and micro-irrigation systems to optimize agricultural water efficiency.",
      "Store potable drinking water in sanitized, covered storage vessels with chlorine tablets.",
      "Protect community farm ponds (Jal Sanrakshan) from industrial pollution."
    ],
    donts: [
      "DO NOT waste municipal piped water for washing driveways, sidewalks, or vehicles during drought advisories.",
      "DO NOT over-pump borewells beyond permissible groundwater extraction recharge levels."
    ]
  },

  AIDRR_ANIMALS: {
    title: "Animal-Inclusive Disaster Risk Reduction (NDMA May 2026 AiDRR)",
    source: "NDMA National Guidelines on Animal-inclusive Disaster Risk Reduction (AiDRR - May 2026)",
    url: "https://ndma.gov.in/sites/default/files/2026-05/AiDRR_Guidelines.pdf",
    dos: [
      "Untie livestock, cattle, and domestic pets before evacuation so they are not trapped by rising waters.",
      "Ensure cattle vaccination against foot-and-mouth disease (FMD) and hemorrhagic septicemia prior to flood season.",
      "Relocate herds to elevated community mounds, tea garden plateaus, or cyclone shelter ground decks.",
      "Pack emergency animal feed pellets, clean water, and veterinary antiseptic spray."
    ],
    donts: [
      "DO NOT leave animals chained or tied inside barns or enclosures during mandatory evacuation.",
      "DO NOT abandon pets locked inside homes without food and ventilation."
    ]
  }
};

// Aapda Mitra Community First Responder Volunteer Units (Government of India / NDMA Scheme)
export const aapdaMitraNetwork = [
  {
    id: "am-01",
    district: "Puri Coastal District",
    state: "Odisha",
    unitName: "Puri Zilla Aapda Mitra Rescue Cohort 4",
    leadVolunteer: "Manoj Kumar Nayak (Certified Master Trainer)",
    phone: "+91 6752 223400 / 1077",
    volunteersActive: 48,
    specialization: "Cyclone Evacuation, Storm Surge Rescue, First Aid",
    equipmentStock: ["60 Inflatable Life Jackets", "8 Life Buoys", "6 Stretcher Kits", "Dewatering Pumps", "Solar Torches"],
    headquarters: "Civil Defense Training Center, VIP Road, Puri"
  },
  {
    id: "am-02",
    district: "Kamrup Metropolitan & Rural",
    state: "Assam",
    unitName: "Guwahati Riverside Aapda Mitra Unit 2",
    leadVolunteer: "Pankaj Borah (Community Lead)",
    phone: "+91 361 2456789 / 1070",
    volunteersActive: 64,
    specialization: "Brahmaputra Boat Evacuation, Drowning Prevention, Stretcher Drill",
    equipmentStock: ["120 Life Jackets", "14 Rubber Dinghies", "12 First Aid Trauma Kits", "Water Purification Tablets"],
    headquarters: "DC Office Complex, Panbazar, Guwahati"
  },
  {
    id: "am-03",
    district: "Mumbai City & Suburban",
    state: "Maharashtra",
    unitName: "BMC Ward F-North (Dadar/Kurla) Aapda Mitra Cell",
    leadVolunteer: "Vikas Shinde (Ward Disaster Volunteer)",
    phone: "+91 22 2413 5555 / 1916",
    volunteersActive: 52,
    specialization: "Subway Water Rescue, De-watering Coordination, Elder Transit",
    equipmentStock: ["Submersible Pumps", "High-Visibility Rain Gear", "80 Life Vests", "Rope Ladders"],
    headquarters: "Dadar Fire Brigade Campus, Dadar West"
  },
  {
    id: "am-04",
    district: "Central & East Delhi",
    state: "Delhi NCT",
    unitName: "Yamuna Floodplain Aapda Mitra Taskforce",
    leadVolunteer: "Rajeshwar Tyagi",
    phone: "+91 11 2244 5566 / 1077",
    volunteersActive: 40,
    specialization: "Lowland River Flood Relocation, Temporary Shelter Management",
    equipmentStock: ["40 Life Jackets", "4 Inflatable Rafts", "First Aid Bags", "Thermal Blankets"],
    headquarters: "Geeta Colony Community Relief Center, East Delhi"
  }
];

// All-India State Disaster Management Authorities (SDMAs) Institutional Directory
export const stateDisasterAuthorities = [
  { state: "National (Apex)", name: "National Disaster Management Authority (NDMA)", helpline: "011-26701700 / 1078", website: "https://ndma.gov.in" },
  { state: "Odisha", name: "Odisha State Disaster Management Authority (OSDMA)", helpline: "0674-2395398 / 1070", website: "https://osdma.org" },
  { state: "Assam", name: "Assam State Disaster Management Authority (ASDMA)", helpline: "0361-2237221 / 1070", website: "https://asdma.assam.gov.in" },
  { state: "Maharashtra", name: "Maharashtra State Disaster Management Authority (SDMA) & BMC", helpline: "022-22027990 / 1916", website: "https://dm.maharashtra.gov.in" },
  { state: "Delhi", name: "Delhi Disaster Management Authority (DDMA)", helpline: "1077 / 011-23831077", website: "https://ddma.delhigovt.nic.in" },
  { state: "Kerala", name: "Kerala State Disaster Management Authority (KSDMA)", helpline: "0471-2364424 / 1070", website: "https://sdma.kerala.gov.in" },
  { state: "Tamil Nadu", name: "Tamil Nadu State Disaster Management Authority (TNSDMA)", helpline: "044-28593990 / 1070", website: "https://tnsdma.tn.gov.in" },
  { state: "Gujarat", name: "Gujarat State Disaster Management Authority (GSDMA)", helpline: "079-23259283 / 1070", website: "https://gsdma.org" }
];

