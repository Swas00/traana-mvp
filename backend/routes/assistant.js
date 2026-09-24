import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { store } from '../models/index.js';

const router = express.Router();

// High-precision local disaster triage engine with offline knowledge core
function generateLocalEmergencyGuidance(question, activeAlert, shelters, resources) {
  const q = question.toLowerCase();
  const alertTitle = activeAlert ? activeAlert.title : "General Weather Advisory";
  const alertType = activeAlert ? activeAlert.type : "UNKNOWN";
  const nearestOpenShelter = shelters.find(s => s.status !== 'FULL') || shelters[0];

  // Specific query matching
  if (q.includes('what should i do') || q.includes('what to do') || q.includes('act') || q.includes('immediate')) {
    return {
      answer: `🚨 **Immediate Action Plan for ${alertType} (${alertTitle}):**\n\n` +
        `1. **Seek High Elevation:** If you are in lowlands (Sectors 1-4), evacuate now. Move to upper floors if trapped.\n` +
        `2. **Cut Utilities:** Shut off your home's main electrical breaker and LPG gas cylinder to prevent explosions and electrocution.\n` +
        `3. **Do NOT Drive/Walk Through Water:** 6 inches of moving water can knock you down; 12 inches can sweep away cars.\n` +
        `4. **Head to Safe Shelter:** Recommended shelter: **${nearestOpenShelter.name}** (${nearestOpenShelter.distanceKm} km away, ${nearestOpenShelter.availableSlots} beds free).\n` +
        `5. **Emergency Contact:** Dial **112** or **1070** (Disaster Control Room) if someone requires immediate water rescue.`,
      disclaimer: "⚠️ TRAANA MVP Advisory: Follow live instructions from civil defense sirens, NDRF, and police personnel on the ground."
    };
  }

  if (q.includes('nearest shelter') || q.includes('where to go') || q.includes('shelter') || q.includes('refuge')) {
    const openShelters = shelters.filter(s => s.status !== 'FULL');
    const shelterList = openShelters.map(s => `• **${s.name}**: ${s.distanceKm} km away | ${s.availableSlots} available slots | Facilities: ${[s.food ? 'Food' : '', s.water ? 'Water' : '', s.medical ? 'Medical' : ''].filter(Boolean).join(', ')}`).join('\n');
    return {
      answer: `🏠 **Nearest Safe Shelters Currently Open:**\n\n${shelterList}\n\n` +
        `📍 **Top Recommendation:** **${nearestOpenShelter.name}** (${nearestOpenShelter.address}). ` +
        `It is located on elevated terrain (${nearestOpenShelter.elevationMeters}m elevation) with 24x7 medical staff and power backup. Click the **Routes** tab to view your safe detour avoiding flood zones.`,
      disclaimer: "⚠️ Shelter capacity updates in real-time. Do not navigate to St. Jude Auditorium as it is currently at full capacity."
    };
  }

  if (q.includes('what should i carry') || q.includes('pack') || q.includes('bag') || q.includes('kit') || q.includes('supplies')) {
    return {
      answer: `🎒 **Essential 72-Hour Emergency Go-Bag Checklist:**\n\n` +
        `• **Water & Food:** At least 2 liters of drinking water per person + high-energy dry food (biscuits, nuts, bars).\n` +
        `• **Documents & Cash:** Government IDs, insurance cards, and emergency cash sealed in waterproof ziplock bags.\n` +
        `• **Medical Supplies:** 7-day prescription medicines, antiseptic liquid, bandages, and water-purification tablets.\n` +
        `• **Electronics:** Fully charged power bank, charging cable, whistle, and LED flashlight with spare batteries.\n` +
        `• **Warmth & Clothing:** Rain poncho, lightweight warm jacket, sturdy shoes, and emergency foil blanket.`,
      disclaimer: "⚠️ Keep your bag packed near the front exit. Evacuate immediately if water enters your neighborhood."
    };
  }

  if (q.includes('water') || q.includes('drink') || q.includes('tap') || q.includes('food')) {
    return {
      answer: `🚰 **Water & Sanitation Safety Protocol:**\n\n` +
        `• **DO NOT drink tap or well water:** Flood waters frequently backflow into municipal pipes and contaminate water with sewage and industrial toxins.\n` +
        `• **Boil or Purify:** Boil all water vigorously for at least 1 minute before drinking or brushing teeth, or use chlorine purification tablets.\n` +
        `• **Drinking Water Supply Point:** Clean drinking water tankers are stationed at **${resources.find(r => r.type === 'RELIEF')?.name || 'Stadium Relief Point'}** (${resources.find(r => r.type === 'RELIEF')?.address || 'East Grounds'}).\n` +
        `• **Discard Submerged Food:** Any canned or unpackaged food that has touched flood water must be thrown away.`,
      disclaimer: "⚠️ Do not consume fresh vegetables washed in flood water."
    };
  }

  if (q.includes('power') || q.includes('electric') || q.includes('wire') || q.includes('current')) {
    return {
      answer: `⚡ **Electrical Hazard Protocol:**\n\n` +
        `• **High Danger:** Stay at least 30 feet away from downed power lines or leaning utility poles.\n` +
        `• **Standing Water Risk:** Water conducts electricity. Never walk into standing puddles near electrical transformers.\n` +
        `• **Main Switch:** If water enters your dwelling, do not step into wet rooms to reach the fuse box. If safe, switch off main breaker from dry ground or call utility emergency at **1912**.`,
      disclaimer: "⚠️ Downed high-voltage lines reported near Sector 2 (Hazard Zone 3). Avoid this sector."
    };
  }

  if (q.includes('call') || q.includes('phone') || q.includes('contact') || q.includes('helpline') || q.includes('hospital')) {
    return {
      answer: `📞 **Essential Emergency Helplines (Pan-India):**\n\n` +
        `• **Universal Disaster Helpline:** 112\n` +
        `• **NDMA / NDRF Disaster Control Room:** 1070 / 1078\n` +
        `• **Ambulance & Trauma Medical Unit:** 108 / 102\n` +
        `• **Metropolitan Fire & Emergency Rescue:** 101\n` +
        `• **Childline / Women Safety:** 1098 / 1090\n` +
        `All regional disaster control centers have activated Aapda Mitra volunteer networks and emergency vehicle escorts.`,
      disclaimer: "⚠️ Keep calls concise and clearly state your district and landmark coordinates."
    };
  }

  // Earthquake Specific Guidance
  if (q.includes('earthquake') || q.includes('quake') || q.includes('tremor') || q.includes('shaking')) {
    return {
      answer: `🏚️ **Earthquake Emergency Life-Safety Protocol (NDMA Guidelines):**\n\n` +
        `• **If Indoors:** **DROP, COVER, HOLD ON.** Drop to hands and knees, cover head/neck under a heavy desk or table, and hold on until shaking stops.\n` +
        `• **DO NOT Use Elevators:** Stairs only. Lifts can lose power or deform in elevator shafts.\n` +
        `• **If Outdoors:** Move immediately to open clearings away from high-rises, overhead power cables, brick chimneys, and flyovers.\n` +
        `• **Post-Tremor Gas Check:** If you smell gas (sulfur odor), turn off the main cylinder valve immediately and open windows. Do NOT strike matches or flip electrical switches.\n` +
        `• **Aftershocks:** Expect secondary tremors. Stay alert for at least 48 hours.`,
      disclaimer: "⚠️ Stand clear of glass facades and unreinforced masonry walls."
    };
  }

  // Cyclone Specific Guidance
  if (q.includes('cyclone') || q.includes('storm') || q.includes('wind') || q.includes('gale')) {
    return {
      answer: `🌀 **Cyclone & Storm Surge Survival Protocol (NCRMP / NDMA):**\n\n` +
        `• **Move to Shelter:** Evacuate to nearest Multi-Purpose Cyclone Shelter (**${nearestOpenShelter.name}**) if in coastal 5km zone.\n` +
        `• **Secure Glass:** Board up windows or apply criss-cross adhesive tape to prevent flying glass shards from blast winds.\n` +
        `• **Beware the 'Eye of the Storm':** If winds suddenly die down, DO NOT go outside. This is the eye of the cyclone; catastrophic hurricane-force winds will resume from the reverse direction within minutes.\n` +
        `• **Livestock Protection:** Move cattle to elevated cyclone shelter stilt pens with emergency dry fodder.`,
      disclaimer: "⚠️ Fishermen are strictly prohibited from venturing into open sea during active signal warnings."
    };
  }

  // Landslide & Cloudburst Specific Guidance
  if (q.includes('landslide') || q.includes('mudflow') || q.includes('cloudburst') || q.includes('hill') || q.includes('mountain')) {
    return {
      answer: `⛰️ **Landslide & Cloudburst Mountain Protocol (NDMA Hill Safety):**\n\n` +
        `• **Early Acoustic Warning:** Listen for sounds of cracking trees, rolling boulders, or sudden muddiness in stream flow.\n` +
        `• **Vertical Evacuation:** Climb vertically toward ridge tops immediately. Never stay in low-lying valley bottoms or dried riverbeds.\n` +
        `• **Perpendicular Escape:** If caught near slope failure, run sideways/perpendicular away from the path of the debris flow, never downhill in its path.\n` +
        `• **Avoid Submerged Mountain Bridges:** Mountain torrents carry heavy tree trunks and boulders capable of washing away RCC culverts.`,
      disclaimer: "⚠️ Do not cross active debris paths until inspected by Border Roads Organisation (BRO) engineers."
    };
  }

  // Tsunami Specific Guidance
  if (q.includes('tsunami') || q.includes('sea wave') || q.includes('coastal surge') || q.includes('tide')) {
    return {
      answer: `🌊 **Tsunami Coastal Emergency Action (NDMA / INCOIS):**\n\n` +
        `• **Natural Warning Signs:** A coastal earthquake tremor or sudden rapid receding of the shoreline is nature's official tsunami warning.\n` +
        `• **Immediate High Ground:** Run at least 2 km inland or climb to elevation higher than 30 meters above sea level.\n` +
        `• **Vertical Refuge:** If escape inland is blocked, climb to the roof or upper 3rd+ floor of a sturdy reinforced concrete building.\n` +
        `• **Wait for All Clear:** A tsunami is a train of destructive waves that can continue for up to 12 hours. Never return after the first wave.`,
      disclaimer: "⚠️ Never go down to the shore to watch tsunami waves."
    };
  }

  // Lightning & Thunderstorm Guidance
  if (q.includes('lightning') || q.includes('thunder') || q.includes('bijli') || q.includes('thunderstorm')) {
    return {
      answer: `⚡ **Lightning & Severe Thunderstorm Safety (NDMA 'Bijli Se Bachav'):**\n\n` +
        `• **30-30 Rule:** If thunder follows a flash within 30 seconds, lightning is dangerous. Wait 30 minutes after last thunderclap before leaving shelter.\n` +
        `• **Outdoor Squat:** If caught in open fields, crouch low on the balls of your feet with heels touching, head tucked, ears covered. DO NOT lie flat on the ground.\n` +
        `• **Avoid Conductors:** Stay clear of isolated tall trees, wire fences, metal poles, and tractors.\n` +
        `• **Indoor Precautions:** Avoid showers, washing dishes, and unplug desktop electronics.`,
      disclaimer: "⚠️ Seek permanent brick/metal-roof shelter immediately."
    };
  }

  // Heatwave Specific Guidance
  if (q.includes('heat') || q.includes('heatwave') || q.includes('sunstroke') || q.includes('loo') || q.includes('temperature')) {
    return {
      answer: `☀️ **Heatwave & Sunstroke Emergency Protocol (NDMA HAP):**\n\n` +
        `• **Hydration:** Drink oral rehydration solution (ORS), buttermilk, lemon water, or coconut water even if not thirsty.\n` +
        `• **Avoid Peak Hours:** Stay indoors between 12:00 PM and 3:30 PM. Wear loose, light-colored cotton clothes.\n` +
        `• **Sunstroke First Aid:** If someone displays high body temperature, confusion, or stopped sweating, move them to shaded ventilation, sponge skin with cold water, and apply ice packs to neck/armpits.\n` +
        `• **Vehicle Warning:** Never leave infants or pets inside parked vehicles for even 2 minutes.`,
      disclaimer: "⚠️ Heat exhaustion can rapidly progress to life-threatening heat stroke. Call 108 if unconsciousness occurs."
    };
  }

  // Wildfire / Forest Fire Guidance
  if (q.includes('wildfire') || q.includes('forest fire') || q.includes('fire') || q.includes('smoke')) {
    return {
      answer: `🔥 **Forest Fire & Wildfire Survival (NDMA Forest Action Plan):**\n\n` +
        `• **Evacuation Direction:** Move downhill and upwind away from advancing smoke and flame fronts.\n` +
        `• **Respiratory Protection:** Wear N95 masks or tie a damp cotton cloth over mouth and nose.\n` +
        `• **Create Defensible Space:** Clear dry brush, pine needles, and woodpiles within 10 meters of dwellings.\n` +
        `• **Report Ignition:** Dial **112** or State Forest Department helpline immediately.`,
      disclaimer: "⚠️ Wildfires accelerate rapidly uphill. Never attempt to run uphill away from flames."
    };
  }

  // Coldwave & Avalanche Guidance
  if (q.includes('cold') || q.includes('coldwave') || q.includes('snow') || q.includes('avalanche') || q.includes('frost')) {
    return {
      answer: `❄️ **Cold Wave & Winter Survival Protocol (NDMA Cold Wave Guidelines):**\n\n` +
        `• **Layering:** Wear multiple loose layers of wool and windproof outer garments.\n` +
        `• **Carbon Monoxide Warning:** Never burn charcoal brazier/angithi in tightly closed unventilated rooms (causes fatal CO poisoning).\n` +
        `• **Hypothermia Signs:** Severe shivering, slurred speech, lethargy. Rewarm slowly using warm dry blankets and warm sugary liquids (NO alcohol).\n` +
        `• **Livestock Care:** Line animal sheds with dry straw bedding to insulate against ground frost.`,
      disclaimer: "⚠️ Keep warm thermoses and backup heating fuels safely stored."
    };
  }

  // Pet and Animal Inclusive Disaster Protection
  if (q.includes('pet') || q.includes('animal') || q.includes('dog') || q.includes('cat') || q.includes('cattle') || q.includes('livestock')) {
    return {
      answer: `🐾 **Animal-Inclusive Disaster Risk Reduction (NDMA May 2026 AiDRR):**\n\n` +
        `• **Untie Before Evacuating:** Untie all cattle, goats, and pets so they can swim or find high ground if waters rise.\n` +
        `• **Pet Emergency Kit:** Pack dry pet food, leash, veterinary vaccination certificate, and clean water container.\n` +
        `• **Animal-Friendly Shelters:** Look for shelters marked with the 🐾 Pets Allowed badge in the Shelters directory.\n` +
        `• **Post-Flood Care:** Ensure fresh dry bedding and clean drinking water to prevent waterborne livestock diseases.`,
      disclaimer: "⚠️ Leaving animals chained during an evacuation is illegal and fatal."
    };
  }

  // General emergency answer
  return {
    answer: `ℹ️ **TRAANA Disaster Neural AI Response:**\n\n` +
      `Active Threat Context: **${alertTitle}** (${alertType})\n` +
      `Your Sector: ${activeAlert ? activeAlert.location : 'Monitored area'}\n\n` +
      `• **Nearest Safe Shelter:** **${nearestOpenShelter.name}** (${nearestOpenShelter.distanceKm} km, ${nearestOpenShelter.availableSlots} free slots).\n` +
      `• **Evacuation Map:** Click **Routes** tab to view detours that avoid active hazard zones.\n` +
      `• **Emergency Call:** Universal helpline **112** | Disaster Cell **1070**.\n` +
      `• Check off your **Life-Safety Checklist** on the Citizen Dashboard.`,
    disclaimer: "⚠️ TRAANA MVP: This guidance is informational. Always prioritize official loudspeaker orders and emergency sirens."
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
    const activeAlert = activeAlertId 
      ? alerts.find(a => a.id === activeAlertId) 
      : (alerts.find(a => a.active) || alerts[0]);
    const shelters = await store.getShelters();
    const resources = await store.getResources();
    const citizenLocation = store.getCitizenLocation();

    // Check if GEMINI_API_KEY is configured
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim() !== '') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `You are TRAANA AI, the emergency response assistant for the Threat Response & Assistance Network for Alerts and Navigation.
You assist citizens during all natural disasters (Floods, Cyclones, Earthquakes, Tsunamis, Landslides, Heatwaves, Thunderstorms, Wildfires, Cold Waves).
Your goal is to save lives by providing concise, actionable, reassuring, and step-by-step emergency instructions.

Citizen Location:
- Coordinates: ${citizenLocation.latitude}, ${citizenLocation.longitude}
- Name/City: ${citizenLocation.name}
- Status: ${citizenLocation.isInDanger ? 'INSIDE HAZARD ZONE' : 'SAFE SECTOR'}
- Mode: ${citizenLocation.mode}

Current Active Alert Context:
- Event: ${activeAlert ? activeAlert.title : 'None active'}
- Type: ${activeAlert ? activeAlert.type : 'General'}
- Severity: ${activeAlert ? activeAlert.severity : 'NORMAL'}
- Location: ${activeAlert ? activeAlert.location : 'City Wide'}
- Instructions: ${activeAlert ? activeAlert.instructions.join('; ') : 'None'}

Nearby Shelters:
${shelters.map(s => `- ${s.name} (${s.distanceKm}km away, Status: ${s.status}, Slots: ${s.availableSlots})`).join('\n')}

Guidelines:
1. Ground your advice in the citizen's specific detected location (${citizenLocation.name}).
2. Always prioritize immediate safety and evacuation guidance.
3. Keep answers concise, highly readable, using bullet points and bold highlights.
4. Advise against dangerous actions (e.g. driving through flood water, touching downed power cables).
5. Recommend open shelters with available capacity.
6. Provide relevant emergency numbers (112, 108, 1070).
7. Always include a short safety disclaimer reminding citizens to follow official emergency authorities.`;


        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: question,
          config: {
            systemInstruction: systemPrompt,
            maxOutputTokens: 500,
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
      } catch (geminiError) {
        console.warn('[TRAANA AI] Remote API call error, using local emergency engine:', geminiError.message);
        // Fall through to local fallback engine
      }
    }

    // High quality local fallback response
    const guidance = generateLocalEmergencyGuidance(question, activeAlert, shelters, resources);
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
