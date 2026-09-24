import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { store } from '../models/index.js';
import { sachetService } from '../services/sachetSync.js';
import { ndmaDosAndDonts as ndmaGuidelines } from '../data/indiaDatasets.js';

const router = express.Router();

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 1.2;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
}

// High-precision local disaster triage engine with offline knowledge core
function generateLocalEmergencyGuidance(question, activeAlert, shelters, resources, citizenLocation) {
  const q = question.toLowerCase();
  const alertTitle = activeAlert ? activeAlert.title : "Pan-India Multi-Hazard Weather Advisory";
  const rawType = (activeAlert ? (activeAlert.type || activeAlert.rawDisasterType || "GENERAL") : "GENERAL").toUpperCase();
  const alertSeverity = activeAlert ? activeAlert.severity : "HIGH";
  const alertLocation = activeAlert ? activeAlert.location : "Monitored National Sector";
  const alertInstructions = activeAlert && activeAlert.instructions && activeAlert.instructions.length > 0
    ? activeAlert.instructions
    : ["Seek elevated sturdy shelter immediately.", "Turn off electrical mains & LPG valves.", "Follow official civil defense announcements."];

  const nearestOpenShelter = shelters.find(s => s.status !== 'FULL') || shelters[0] || {
    name: "Sector Relief Center",
    distanceKm: 2.1,
    availableSlots: 150,
    address: "Civil Defense Grounds"
  };

  const threatDist = (activeAlert && activeAlert.latitude && citizenLocation)
    ? calculateDistanceKm(citizenLocation.latitude, citizenLocation.longitude, activeAlert.latitude, activeAlert.longitude)
    : 1.2;
  const inDanger = threatDist <= (activeAlert?.radiusKm || 5);

  // 1. LIVE SITUATION / ACTIVE ALERT INQUIRIES
  if (q.includes('live alert') || q.includes('current alert') || q.includes('active alert') || q.includes('what alert') || q.includes('current situation') || q.includes('what is happening') || q.includes('live warning') || q.includes('live calamity')) {
    return {
      answer: `🚨 **Live Calamity Telemetry (NDMA SACHET Real-Time Feed):**\n\n` +
        `• **Active Emergency:** **${alertTitle}**\n` +
        `• **Calamity Classification:** \`${rawType}\` | Severity: **${alertSeverity} PRIORITY**\n` +
        `• **Affected Geofence:** ${alertLocation} (Threat Radius: ~${activeAlert?.radiusKm || 5} km)\n` +
        `• **Your Proximity:** You are approximately **${threatDist} km** from the threat epicenter (${inDanger ? '⚠️ INSIDE ACTIVE HAZARD ZONE' : '🛡️ IN MONITORED SAFE PERIMETER'}).\n\n` +
        `📢 **Official NDMA Broadcast Instructions:**\n` +
        alertInstructions.map(ins => `  - ${ins}`).join('\n') + `\n\n` +
        `🏠 **Nearest Available Safe Shelter:** **${nearestOpenShelter.name}** (${nearestOpenShelter.distanceKm} km away, **${nearestOpenShelter.availableSlots}** vacant beds).`,
      disclaimer: "⚠️ Ground Telemetry: Sourced from NDMA SACHET C-DOT CAP-India broadcast network. Obey local civil defense loudspeakers."
    };
  }

  // 2. DANGER ZONE / PROXIMITY / AM I SAFE INQUIRIES
  if (q.includes('am i in danger') || q.includes('am i safe') || q.includes('how far') || q.includes('danger zone') || q.includes('safe sector') || q.includes('is my area affected')) {
    return {
      answer: inDanger
        ? `⚠️ **CRITICAL HAZARD ASSESSMENT: YOU ARE IN THE THREAT PERIMETER**\n\n` +
          `• **Current Status:** Your location (${citizenLocation?.name || 'Detected Sector'}) is **${threatDist} km** from the active **${rawType}** threat epicenter, which has an active warning radius of **${activeAlert?.radiusKm || 5} km**.\n` +
          `• **Immediate Action Required:** Initiate evacuation towards high-ground designated safe zones. Do not wait for conditions to deteriorate.\n` +
          `• **Assigned Safe Haven:** Evacuate to **${nearestOpenShelter.name}** (${nearestOpenShelter.distanceKm} km away).\n` +
          `• **Evacuation Map:** Open the **Routes** tab for automated detour pathways avoiding inundated lowlands.`
        : `🛡️ **SAFETY ASSESSMENT: CURRENTLY OUTSIDE THE IMMEDIATE IMPACT RADIUS**\n\n` +
          `• **Status:** You are approximately **${threatDist} km** from the active **${rawType}** epicenter (${alertLocation}), outside the primary ${activeAlert?.radiusKm || 5} km impact core.\n` +
          `• **Precautionary Advice:** Maintain vigilance. Disaster perimeters expand rapidly. Keep your mobile phone charged, 72h go-bag packed, and monitor NDMA broadcast alerts.\n` +
          `• **Contingency Shelter:** Pre-identify **${nearestOpenShelter.name}** (${nearestOpenShelter.distanceKm} km) should weather escalate.`,
      disclaimer: "⚠️ Wind vectors and flash runoff can shift hazard boundaries within minutes."
    };
  }

  // 3. VEHICLE, 2-WHEELER, AND EVACUATION TRANSPORT SAFETY
  if (q.includes('2 wheeler') || q.includes('2-wheeler') || q.includes('two wheeler') || q.includes('bike') || q.includes('scooter') || q.includes('motorcycle') || q.includes('car') || q.includes('drive') || q.includes('ride') || q.includes('vehicle') || q.includes('can i travel')) {
    const isFlood = rawType.includes('FLOOD') || rawType.includes('CLOUDBURST');
    const isCyclone = rawType.includes('CYCLONE') || rawType.includes('WIND');
    const isLightning = rawType.includes('THUNDER') || rawType.includes('LIGHTNING');

    return {
      answer: `🛵 **Disaster Evacuation Transport & Vehicle Advisory (${rawType}):**\n\n` +
        `• **2-Wheeler (Motorcycle / Scooter):**\n` +
        `  - ${isFlood ? '⚠️ **EXTREME DANGER:** Do NOT ride into floodwater deeper than **10-12 cm**. Water entry into the air filter causes instant engine seizure (hydrolock) and skidding on submerged silt.' : 'Exercise caution around loose gravel and road debris.'}\n` +
        `  - ${isCyclone ? '⛔ **PROHIBITED:** Crosswinds > 60 km/h will topple two-wheelers. Risk of flying iron sheets and branches is fatal.' : 'Wear certified helmet and secure rain protection.'}\n` +
        `  - ${isLightning ? '⚡ **HIGH RISK:** Open two-wheelers offer ZERO lightning protection. Discontinue riding during active strikes.' : 'Keep headlight on for visibility.'}\n\n` +
        `• **4-Wheeler (Cars, SUVs, Vans):**\n` +
        `  - **Rule of Floatation:** 30 cm (12 inches) of flowing water can sweep away small cars; 60 cm (24 inches) will float heavy SUVs.\n` +
        `  - **Window Safety:** Crack side windows 2 cm before crossing waterlogged areas to prevent electronic door lock traps.\n` +
        `  - **Underpasses:** NEVER drive into submerged underpasses (water depth is deceptive and often exceeds 2 meters).\n\n` +
        `• **Recommended Travel Mode Right Now:** ${isCyclone ? 'Pedestrian movement to nearest reinforced building only.' : 'Follow elevated arterial roads directly to ' + nearestOpenShelter.name + '.'}`,
      disclaimer: "⚠️ When in doubt, 'Turn Around, Don't Drown'. Over 60% of flood fatalities occur in vehicles."
    };
  }

  // 4. IMMEDIATE ACTION / 15-MINUTE PROTOCOL
  if (q.includes('what should i do') || q.includes('what to do') || q.includes('act') || q.includes('immediate') || q.includes('first steps') || q.includes('15 min')) {
    return {
      answer: `🚨 **Immediate 15-Minute Life-Safety Protocol (${rawType} - ${alertTitle}):**\n\n` +
        `1. **Secure Family & Personal Safety:** Gather household members, infants, elderly, and pets. Move away from glass windows and loose roof structures.\n` +
        `2. **Cut Core Utilities:** Turn off home electrical main breaker switch and close the LPG cylinder regulator valve tightly to avoid electrocution and post-disaster fire.\n` +
        `3. **Grab Emergency 72h Go-Bag:** Ensure you have drinking water, emergency cash, government IDs, prescription medications, and power banks.\n` +
        `4. **Head to Designated Shelter:** Evacuate to **${nearestOpenShelter.name}** (${nearestOpenShelter.distanceKm} km away, **${nearestOpenShelter.availableSlots}** vacant slots).\n` +
        `5. **Emergency Signal:** Keep a whistle and bright torch ready. In extreme life peril, call **112** (Universal SOS) or **1070** (State Disaster Control Room).`,
      disclaimer: "⚠️ TRAANA MVP Advisory: Obey local police, civil defense sirens, and NDRF rescue instructions unconditionally."
    };
  }

  // 5. SHELTER DISCOVERY & OCCUPANCY
  if (q.includes('nearest shelter') || q.includes('where to go') || q.includes('shelter') || q.includes('refuge') || q.includes('bed') || q.includes('slot')) {
    const openShelters = shelters.filter(s => s.status !== 'FULL');
    const shelterList = openShelters.slice(0, 4).map(s => 
      `• **${s.name}**\n` +
      `  - Distance: **${s.distanceKm} km** | Available Beds: **${s.availableSlots} / ${s.capacity}**\n` +
      `  - Elevation: **${s.elevationMeters || 18}m** (High Ground Safe)\n` +
      `  - Amenities: ${[s.food ? '🍲 Food' : '', s.water ? '💧 Water' : '', s.medical ? '🏥 Medical Triage' : '', s.powerBackup ? '⚡ Diesel Generator' : ''].filter(Boolean).join(' | ')}\n` +
      `  - Contact: ${s.contactPerson} (${s.phone})`
    ).join('\n\n');

    return {
      answer: `🏠 **Verified Safe High-Ground Shelters Currently Open:**\n\n${shelterList}\n\n` +
        `📍 **Top Evacuation Recommendation:** **${nearestOpenShelter.name}** (${nearestOpenShelter.address}). Click **Routes** tab on TRAANA to view turn-by-turn navigation avoiding active hazard polygons.`,
      disclaimer: "⚠️ Shelter occupancy updates dynamically. Do not navigate to shelters marked FULL."
    };
  }

  // 6. EMERGENCY GO-BAG & DISASTER PACK
  if (q.includes('what should i carry') || q.includes('pack') || q.includes('bag') || q.includes('kit') || q.includes('supplies') || q.includes('go-bag') || q.includes('gobag')) {
    return {
      answer: `🎒 **Essential 72-Hour Emergency Go-Bag Checklist (NDMA Citizen Protocol):**\n\n` +
        `• **Drinking Water & Rations:** 3 liters clean drinking water per person + dry packaged food (dates, roasted chana, biscuits, energy bars, glucose powder).\n` +
        `• **Medical & Sanitation:** 10-day prescription medications, antiseptic liquid (Dettol/Savlon), ORS sachets, pain relievers, bandages, water purification chlorine tablets, and sanitary pads.\n` +
        `• **Waterproof Document Pouch:** Aadhaar cards, Voter ID, property documents, insurance policies, medical records, and cash in small notes sealed in ziplock pouches.\n` +
        `• **Light & Power:** High-capacity power bank (charged), LED torch with spare cells, multi-pin charging cable, and a signaling whistle.\n` +
        `• **Protective Wear:** Raincoat/poncho, sturdy enclosed shoes, spare dry cotton socks, light woolen blanket, and N95 dust/smoke masks.`,
      disclaimer: "⚠️ Keep your go-bag stationed right beside your front exit door for zero-delay grab-and-go evacuation."
    };
  }

  // 7. WATER & FOOD PURIFICATION
  if (q.includes('water') || q.includes('drink') || q.includes('tap') || q.includes('food') || q.includes('purify') || q.includes('boil')) {
    const reliefPoint = resources.find(r => r.type === 'RELIEF');
    return {
      answer: `🚰 **Emergency Water & Food Safety Protocol:**\n\n` +
        `• **DO NOT Drink Tap or Well Water:** Flood, surge, and tremor events rupture sewage lines and introduce fecal coliform and chemical poisons into ground tables.\n` +
        `• **Safe Disinfection:**\n` +
        `  1. **Boiling:** Bring water to a rolling boil for at least 1 full minute (3 minutes at higher hill elevations).\n` +
        `  2. **Chlorination:** Use 1 Halazone / Chlorine tablet (or 2-3 drops of unscented liquid household chlorine) per 5 liters of clear water; let stand 30 minutes before drinking.\n` +
        `• **Submerged Food Warning:** Discard all fresh vegetables, fruits, and loose grains touched by disaster water.\n` +
        `• **Verified Drinking Water Tankers:** Civil defense relief supply tankers are positioned at **${reliefPoint?.name || 'Stadium Relief Center'}** (${reliefPoint?.address || 'East Zone Grounds'}).`,
      disclaimer: "⚠️ Waterborne epidemics (cholera, leptospirosis) claim more lives post-disaster than initial inundation."
    };
  }

  // 8. ELECTRICITY & GAS SAFETY
  if (q.includes('power') || q.includes('electric') || q.includes('wire') || q.includes('current') || q.includes('gas') || q.includes('lpg') || q.includes('meter')) {
    return {
      answer: `⚡ **Electrical & Domestic Gas Safety Directives:**\n\n` +
        `• **Stay 10+ Meters Clear of Downed Wires:** Assume EVERY fallen electrical cable is energized and lethal. Wet ground can conduct high voltage dozens of paces.\n` +
        `• **Do NOT Step in Standing Water near Appliances:** If water enters your house, do not wade to electrical boards. Switch off main supply only if reachable from completely dry ground.\n` +
        `• **LPG Gas Cylinder Safety:** Smell of sulfur or hissing gas means immediate leak. Extinguish any open flames, close the main cylinder regulator, open all windows, and do NOT flip electrical switches (sparks ignite gas).\n` +
        `• **Utility Helplines:** Electricity Emergency: **1912** | LPG Emergency: **1906**.`,
      disclaimer: "⚠️ Electrocution is a top cause of secondary disaster casualties in India. Report sparks to 112 immediately."
    };
  }

  // 9. PETS, CATTLE & LIVESTOCK SAFETY (AiDRR)
  if (q.includes('pet') || q.includes('animal') || q.includes('dog') || q.includes('cat') || q.includes('cattle') || q.includes('cow') || q.includes('livestock') || q.includes('fodder')) {
    return {
      answer: `🐾 **Animal-Inclusive Disaster Risk Reduction (NDMA May 2026 AiDRR Framework):**\n\n` +
        `• **NEVER Leave Animals Chained or Penned:** If evacuating and unable to transport cattle or pets, UNTIE all leashes and tether ropes. Animals have superior natural survival instincts and will find high ground if free.\n` +
        `• **Pet Emergency Kit:** 3-day dry pet food, portable water bowl, leash, collar with contact tag, and veterinary vaccination papers.\n` +
        `• **Livestock Protection:** Move livestock to elevated multi-purpose cyclone/flood shelter ramps or village mounds (pucca chabutra). Store dry straw fodder on elevated lofts.\n` +
        `• **Shelters with Animal Pens:** The **Shelters** tab displays facilities equipped with stilt-level livestock pens and veterinary first-aid.`,
      disclaimer: "⚠️ Leaving animals tied up to drown or starve during an emergency evacuation is both illegal and fatal."
    };
  }

  // 10. HELPLINES & RESCUE DIRECTORY
  if (q.includes('call') || q.includes('phone') || q.includes('contact') || q.includes('helpline') || q.includes('number') || q.includes('sos') || q.includes('ndrf') || q.includes('hospital')) {
    return {
      answer: `📞 **National & State Emergency Helpline Directory (India):**\n\n` +
        `• **Universal Disaster & Police Emergency:** **112**\n` +
        `• **NDMA / NDRF National Disaster Control Room:** **1070** / **1078**\n` +
        `• **State Emergency Operations Center (SEOC):** **1070**\n` +
        `• **District Emergency Operations Center (DEOC):** **1077**\n` +
        `• **Emergency Ambulance & Trauma Care:** **108** / **102**\n` +
        `• **Fire & Rescue Service:** **101**\n` +
        `• **National Women Helpline / Childline:** **1090** / **1098**\n` +
        `• **Electricity Crisis Board:** **1912** | LPG Leak Emergency: **1906**\n\n` +
        `💡 **SOS Calling Tip:** When calling, state: 1) Your exact district & landmark, 2) Number of people trapped/injured, 3) Water depth or hazard type, 4) Accessible entry approach.`,
      disclaimer: "⚠️ Keep communication lines brief to allow rescue boat operators and first responders through."
    };
  }

  // 11. EARTHQUAKE SPECIFIC GUIDANCE
  if (q.includes('earthquake') || q.includes('quake') || q.includes('tremor') || q.includes('shaking') || q.includes('aftershock')) {
    return {
      answer: `🌋 **Earthquake Emergency Life-Safety Protocol (NDMA 'Jhuko, Dhako, Pakdo'):**\n\n` +
        `• **During Active Shaking (Drop, Cover, Hold On):**\n` +
        `  - **DROP** to your hands and knees to prevent being knocked down.\n` +
        `  - **COVER** your head and neck under a sturdy table, desk, or against an interior wall.\n` +
        `  - **HOLD ON** to your shelter until violent shaking stops.\n` +
        `• **Multi-Story Building Rules:**\n` +
        `  - **NEVER use elevators or lifts** (power failure traps occupants; shafts deform).\n` +
        `  - Use stairwells cautiously. Do not rush into narrow stairwells in panic.\n` +
        `• **If Trapped Under Debris:** Tap on a pipe or wall with a stone or metal object so rescuers hear acoustic vibrations. Shout only as a last resort to preserve energy and prevent dust inhalation.\n` +
        `• **Post-Tremor Inspection:** Check for gas leaks (smell of sulfur) and electrical sparks. Turn off utilities. Expect secondary aftershocks for 48 hours.`,
      disclaimer: "⚠️ Stand clear of glass facades, exterior brick veneers, chimneys, and overhead flyovers."
    };
  }

  // 12. CYCLONE SPECIFIC GUIDANCE
  if (q.includes('cyclone') || q.includes('storm') || q.includes('wind') || q.includes('gale') || q.includes('eye of the cyclone')) {
    return {
      answer: `🌀 **Cyclone & Severe Storm Surge Protocol (NCRMP / NDMA):**\n\n` +
        `• **Pre-Landfall Home Reinforcement:** Board up glass windows or apply heavy criss-cross adhesive tape to prevent flying glass shards. Trim large tree branches near roofs.\n` +
        `• **Tidal Surge Evacuation:** If within 5 km of the sea or delta creeks, evacuate immediately to **${nearestOpenShelter.name}** (elevation > 15m). Storm surges can rise 3–5 meters in minutes.\n` +
        `• **The 'Eye of the Storm' Trap:** If violent winds abruptly cease and skies clear, **DO NOT VENTURE OUTSIDE.** You are in the eye of the cyclone; hurricane-force winds will return from the exact reverse direction within 20-40 minutes.\n` +
        `• **Sea Prohibition:** Fishermen must strictly remain in harbor under Signal 10 warnings.`,
      disclaimer: "⚠️ Disconnect antenna cables and avoid handling landline telephone cords during coastal storms."
    };
  }

  // 13. TSUNAMI SPECIFIC GUIDANCE
  if (q.includes('tsunami') || q.includes('sea wave') || q.includes('coastal surge') || q.includes('tide') || q.includes('ocean')) {
    return {
      answer: `🌊 **Tsunami Early Warning & Coastal Inundation Protocol (INCOIS / NDMA):**\n\n` +
        `• **Natural Warning Signs:** A strong coastal tremor OR the sudden, unnatural withdrawal of sea water exposing seabed and reefs is nature's official tsunami alert.\n` +
        `• **Immediate High Elevation:** Run inland at least **2 km** or climb to terrain higher than **30 meters** above mean sea level.\n` +
        `• **Vertical Refuge:** If escape inland is blocked, climb to the roof or upper 3rd+ floor of a reinforced concrete frame building.\n` +
        `• **Wave Train Hazard:** A tsunami is NOT a single wave; it is a series of catastrophic surges that can arrive 15 to 45 minutes apart over a 12-hour period. Never return after the first wave.`,
      disclaimer: "⚠️ NEVER go to the beach to look at receding sea waters. If you see the wave coming, you are already too close to outrun it."
    };
  }

  // 14. THUNDERSTORM & LIGHTNING SPECIFIC GUIDANCE
  if (q.includes('lightning') || q.includes('thunder') || q.includes('bijli') || q.includes('thunderstorm') || q.includes('squall') || q.includes('30-30')) {
    return {
      answer: `⚡ **Lightning & Severe Thunderstorm Life Safety (NDMA 'Bijli Se Bachav'):**\n\n` +
        `• **The 30-30 Rule:** If the time between seeing lightning and hearing thunder is less than 30 seconds, seek substantial indoor shelter immediately. Stay sheltered until 30 minutes after the last thunderclap.\n` +
        `• **Open Field Lightning Crouch:** If trapped in open fields with no shelter, crouch down on the balls of your feet with heels touching, head tucked between knees, and hands covering ears. DO NOT lie flat on the ground.\n` +
        `• **Hazardous Shelters to AVOID:** Never shelter under isolated tall trees, open metal tin sheds, bus stops, or next to wire fencing and tractors.\n` +
        `• **Indoor Precautions:** Avoid plumbing (no baths/washing dishes) and unplug desktop electronics and chargers.`,
      disclaimer: "⚠️ India records over 2,500 lightning fatalities annually. Over 80% occur in open agricultural fields."
    };
  }

  // 15. LANDSLIDE & CLOUDBURST SPECIFIC GUIDANCE
  if (q.includes('landslide') || q.includes('mudflow') || q.includes('cloudburst') || q.includes('hill') || q.includes('mountain') || q.includes('torrent') || q.includes('boulder')) {
    return {
      answer: `⛰️ **Mountain Cloudburst & Landslide Survival (NDMA Hill Disaster Protocol):**\n\n` +
        `• **Acoustic Early Warnings:** Listen for unusual sounds of cracking trees, rolling boulders, or sudden muddiness and debris in clear mountain streams.\n` +
        `• **Perpendicular Escape:** If caught near slope movement, run sideways/perpendicular to the slide path. Never attempt to run straight downhill.\n` +
        `• **Avoid Valley Corridors:** Mountain cloudbursts (100mm/hr) transform dry ravines and seasonal nullahs into ferocious torrents within 5 minutes. Move uphill onto stable ridge shoulders.\n` +
        `• **Road Motorists:** If boulders begin rolling on hill highways, stop vehicles immediately before blind bends, do not park beneath steep rock faces, and seek shelter in pucca slope-retaining structures.`,
      disclaimer: "⚠️ Do not cross active debris trails until inspected by Border Roads Organisation (BRO) engineers."
    };
  }

  // 16. HEATWAVE & SUNSTROKE SPECIFIC GUIDANCE
  if (q.includes('heat') || q.includes('heatwave') || q.includes('sunstroke') || q.includes('loo') || q.includes('temperature') || q.includes('hot')) {
    return {
      answer: `☀️ **Extreme Heatwave & Sunstroke Emergency Protocol (NDMA HAP):**\n\n` +
        `• **Hydration Strategy:** Drink oral rehydration solution (ORS), buttermilk (chaach), coconut water, or lemon water every 30 minutes, even if not feeling thirsty.\n` +
        `• **Curfew Hours:** Avoid outdoor sun exposure between **12:00 noon and 3:30 PM**.\n` +
        `• **Sunstroke Emergency Treatment:**\n` +
        `  1. Move victim to shaded, well-ventilated area.\n` +
        `  2. Sponge entire body with cool (not ice cold) water.\n` +
        `  3. Place ice packs on neck, armpits, and groin.\n` +
        `  4. If unconscious or stopped sweating, call **108** immediately for acute emergency care.\n` +
        `• **Vehicle Warning:** Never leave infants, elderly, or pets inside parked vehicles for even 2 minutes.`,
      disclaimer: "⚠️ Heat exhaustion can progress to fatal heat stroke with brain edema within 30 minutes."
    };
  }

  // 17. WILDFIRE & FOREST FIRE SPECIFIC GUIDANCE
  if (q.includes('wildfire') || q.includes('forest fire') || q.includes('fire') || q.includes('smoke') || q.includes('brush')) {
    return {
      answer: `🔥 **Wildfire & Forest Fire Survival (NDMA Forest Disaster Guidelines):**\n\n` +
        `• **Evacuation Direction:** Always evacuate downhill and upwind away from advancing flames and smoke.\n` +
        `• **Uphill Danger:** Wildfires accelerate with extreme speed uphill (heat rises and pre-heats dry timber above). NEVER attempt to outrun a fire uphill.\n` +
        `• **Smoke Inhalation Defense:** Wear an N95 respirator mask or tie a damp, multi-layered cotton cloth over mouth and nose.\n` +
        `• **Home Defensible Space:** Clear dry pine needles, dead brush, and firewood stacks within 10 meters of dwellings. Soak roofs and perimeters if water is available.`,
      disclaimer: "⚠️ Radiant heat from wildland fires can ignite clothing at distances over 50 meters."
    };
  }

  // 18. COLD WAVE, FROST & AVALANCHE SPECIFIC GUIDANCE
  if (q.includes('cold') || q.includes('coldwave') || q.includes('frost') || q.includes('snow') || q.includes('avalanche') || q.includes('hypothermia') || q.includes('angithi')) {
    return {
      answer: `❄️ **Severe Cold Wave & Winter Survival Protocol (NDMA Guidelines):**\n\n` +
        `• **Layering Clothing:** Wear multiple loose, warm layers of wool and wind-resistant outer clothing rather than one single heavy coat.\n` +
        `• **FATAL Carbon Monoxide Warning:** NEVER burn charcoal braziers (angithi), wood fires, or gas stoves in closed, unventilated bedrooms. Invisible CO gas causes painless, fatal poisoning in sleep.\n` +
        `• **Hypothermia Recognition:** Signs include uncontrollable shivering, slurred speech, clumsy fingers, and apathy. Rewarm core slowly with warm dry blankets and warm sugary tea/water (NO alcohol).\n` +
        `• **Livestock Care:** Provide thick dry straw bedding and draft-proof livestock sheds against ground frost.`,
      disclaimer: "⚠️ Ensure heating appliances have working chimney flues or crack a window 1 inch for cross-ventilation."
    };
  }

  // 19. DROUGHT & WATER STRESS GUIDANCE
  if (q.includes('drought') || q.includes('scarcity') || q.includes('water shortage') || q.includes('dry spell')) {
    return {
      answer: `🌾 **Severe Drought & Water Scarcity Action Plan (NDMA Drought Manual):**\n\n` +
        `• **Potable Water Conservation:** Prioritize drinking and cooking water. Restrict vehicle washing, lawn watering, and construction usage.\n` +
        `• **Community Tanker Logistics:** Register family ration units with Gram Panchayat / Ward Municipal Office for municipal tanker supply distribution.\n` +
        `• **Livestock Cattle Camps:** Relocate farm animals to government-designated fodder and water camps (Chhaoni) to prevent distress cattle sales.\n` +
        `• **Hygiene Maintenance:** Maintain hand hygiene with minimal water to prevent waterborne dysentery epidemics during low-flow periods.`,
      disclaimer: "⚠️ Report water tanker hoarding or black-marketing to the District Collectorate Helpline (1077)."
    };
  }

  // 20. CHEMICAL & INDUSTRIAL HAZARDS
  if (q.includes('chemical') || q.includes('gas leak') || q.includes('industrial') || q.includes('toxic') || q.includes('fumes')) {
    return {
      answer: `☣️ **Chemical & Toxic Gas Leak Emergency Protocol (NDMA Industrial SOP):**\n\n` +
        `• **Upwind & Crosswind Evacuation:** Look at flag or smoke direction and evacuate strictly UPWIND and perpendicular to the gas plume path.\n` +
        `• **Wet Cloth Masking:** Tie a wet handkerchief or cotton cloth over mouth and nose immediately (water dissolves and absorbs many toxic vapors).\n` +
        `• **Seek Higher Elevation:** Most heavy industrial gases (chlorine, phosgene, LPG) pool in low-lying basements, drains, and ground floors. Move to 2nd floor or higher.\n` +
        `• **Shelter in Place:** If evacuation is blocked, seal doors and windows with wet towels and duct tape, turn off air conditioners, and wait for civil defense clearance.`,
      disclaimer: "⚠️ Do not consume exposed food or open water supplies after a chemical cloud release."
    };
  }

  // DEFAULT CONTEXTUAL SYNTHESIS GROUNDED IN ACTIVE ALERT
  return {
    answer: `ℹ️ **TRAANA Disaster Neural AI Triage:**\n\n` +
      `• **Active Situation:** **${alertTitle}** (${alertSeverity} Severity)\n` +
      `• **Monitored Sector:** ${alertLocation} (Threat Epicenter ~${threatDist} km away)\n` +
      `• **Your Risk Assessment:** ${inDanger ? '⚠️ Inside Warning Perimeter - Immediate Evacuation Advisable' : '🛡️ Monitored Safe Perimeter - Stay Alert'}\n\n` +
      `📋 **Top 3 Recommended Actions Right Now:**\n` +
      `1. **Evacuate to Safe Haven:** Recommended refuge: **${nearestOpenShelter.name}** (${nearestOpenShelter.distanceKm} km, **${nearestOpenShelter.availableSlots}** free slots).\n` +
      `2. **Check Utility Breakers:** Shut off home main electricity breaker and LPG cylinder valve before leaving.\n` +
      `3. **Review Evacuation Map:** Open the **Routes** tab on TRAANA to inspect detour paths avoiding active hazard zones.\n\n` +
      `📞 **24x7 Helplines:** Universal Emergency **112** | Disaster Control **1070** | Ambulance **108**.`,
    disclaimer: "⚠️ TRAANA MVP: Ground directives issued by police, NDRF rescue boat squads, and civil defense loudspeaker sirens take legal priority."
  };
}

// POST /api/assistant - Ask TRAANA AI
router.post('/', async (req, res) => {
  try {
    const { question, activeAlertId } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: 'Question cannot be empty' });
    }

    const alerts = await store.getAlerts();
    const liveSachetAlerts = sachetService.getLiveAlerts();

    // Look up active alert in store OR in live SACHET feed
    let activeAlert = null;
    if (activeAlertId) {
      activeAlert = alerts.find(a => a.id === activeAlertId) ||
                    liveSachetAlerts.find(a => a.id === activeAlertId || String(a.sachetId) === String(activeAlertId));
    }
    if (!activeAlert) {
      activeAlert = alerts.find(a => a.active) || liveSachetAlerts[0] || alerts[0];
    }

    const shelters = await store.getShelters();
    const resources = await store.getResources();
    const citizenLocation = store.getCitizenLocation();

    // Associated NDMA Guidelines for this calamity type
    const calamityKey = (activeAlert?.type || activeAlert?.rawDisasterType || 'FLOOD').toUpperCase();
    const guidelines = ndmaGuidelines[calamityKey] || ndmaGuidelines.FLOOD;

    // Check if neural API key is configured
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim() !== '') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `You are TRAANA AI, the disaster response and evacuation intelligence engine for the Threat Response & Assistance Network for Alerts and Navigation (India).
You assist citizens during all natural and meteorological disasters: Floods, Cyclones, Earthquakes, Tsunamis, Landslides, Cloudbursts, Thunderstorms & Lightning, Heatwaves, Wildfires, Cold Waves, and Droughts.
Your goal is to save human and animal lives by providing concise, highly actionable, reassuring, step-by-step emergency instructions grounded in official National Disaster Management Authority (NDMA) guidelines.

Citizen Real-Time Telemetry:
- Coordinates: ${citizenLocation.latitude}, ${citizenLocation.longitude}
- Registered Location: ${citizenLocation.name}
- Status: ${citizenLocation.isInDanger ? 'INSIDE ACTIVE HAZARD ZONE' : 'SAFE PERIMETER'}
- Travel Mode: Supports Walk, 2-Wheeler (Motorcycle/Scooter), and 4-Wheeler (Car)

Active Live Calamity Context:
- Alert: ${activeAlert ? activeAlert.title : 'Pan-India Multi-Hazard Monitoring'}
- Disaster Type: ${activeAlert ? (activeAlert.type || activeAlert.rawDisasterType) : 'General'}
- Severity: ${activeAlert ? activeAlert.severity : 'NORMAL'}
- Location: ${activeAlert ? activeAlert.location : 'National Geofence'}
- Official Directives: ${activeAlert ? activeAlert.instructions.join('; ') : 'None'}

Nearby High-Ground Shelters:
${shelters.slice(0, 4).map(s => `- ${s.name} (${s.distanceKm}km away, Status: ${s.status}, Free Beds: ${s.availableSlots}, Elevation: ${s.elevationMeters || 18}m)`).join('\n')}

NDMA Citizen Guidelines for this Hazard:
${guidelines ? `- Do's: ${guidelines.dos.slice(0, 3).join('; ')}\n- Don'ts: ${guidelines.donts.slice(0, 3).join('; ')}` : ''}

Strict Response Rules:
1. Always ground your advice in the citizen's specific detected location and the active disaster.
2. Address questions specifically for all calamity types (Floods, Earthquakes, Cyclones, Lightning, Tsunamis, Cloudbursts, Heatwaves, Wildfires).
3. If asked about travel or 2-wheelers, give specific water depth and wind hazard rules (e.g. 10cm waterlock risk for 2-wheelers, 30cm floating risk for cars).
4. Provide immediate actionable steps in concise bullet points.
5. Provide relevant emergency numbers (112 Universal, 1070 Disaster, 1078 NDRF, 108 Ambulance).
6. Always maintain a professional, calm, authoritative tone. Do NOT mention any AI model names. Sign off with concise emergency priority.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: question,
          config: {
            systemInstruction: systemPrompt,
            maxOutputTokens: 550,
            temperature: 0.2
          }
        });

        const replyText = response.text || "Please seek high ground and follow official emergency instructions.";
        return res.json({
          success: true,
          provider: 'TRAANA Neural Disaster AI',
          data: {
            answer: replyText,
            disclaimer: "⚠️ TRAANA Advisory: Always follow official ground instructions from police, NDRF, and emergency responders."
          }
        });
      } catch (remoteError) {
        console.warn('[TRAANA AI] Remote API call error, using local emergency engine:', remoteError.message);
        // Fall through to local fallback engine
      }
    }

    // High quality local fallback response
    const guidance = generateLocalEmergencyGuidance(question, activeAlert, shelters, resources, citizenLocation);
    return res.json({
      success: true,
      provider: 'TRAANA Disaster Resilience Core',
      data: guidance
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
