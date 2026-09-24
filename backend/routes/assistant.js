import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { store } from '../models/index.js';

const router = express.Router();

// Fallback intelligent emergency responder if Gemini API key is missing or offline
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
      answer: `📞 **Essential Emergency Helplines:**\n\n` +
        `• **Universal Disaster Helpline:** 112\n` +
        `• **NDRF Flood Rescue Control Room:** 1070 / 1078\n` +
        `• **Ambulance & Trauma Center:** 108 / 102\n` +
        `• **City Emergency Trauma Hospital:** 011-26598700\n` +
        `• **Metropolitan Fire & Water Rescue:** 101\n` +
        `All stations have deployed rapid reaction teams and inflatable rafts across affected lowlands.`,
      disclaimer: "⚠️ Lines may experience heavy traffic. Keep calls brief and state your GPS coordinates clearly."
    };
  }

  // General emergency answer
  return {
    answer: `ℹ️ **TRAANA Situational Update:**\n\n` +
      `Active Threat: **${alertTitle}** (${alertType})\n` +
      `Affected Sector: ${activeAlert ? activeAlert.location : 'Metro area'}\n\n` +
      `• Follow the safety steps on your Citizen Dashboard.\n` +
      `• Safe shelter: **${nearestOpenShelter.name}** (${nearestOpenShelter.distanceKm} km).\n` +
      `• For urgent rescue, call **112** or **1070**.\n` +
      `• Check the **Routes** tab to ensure your route bypasses flooded lowlands.`,
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
You assist citizens during natural disasters (Floods, Cyclones, Earthquakes, Fires).
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
          provider: 'gemini-3.8-flash',
          data: {
            answer: replyText,
            disclaimer: "⚠️ TRAANA Advisory: Always follow official ground instructions from police, NDRF, and emergency responders."
          }
        });
      } catch (geminiError) {
        console.warn('[TRAANA AI] Gemini API call error, using local emergency engine:', geminiError.message);
        // Fall through to local fallback engine
      }
    }

    // High quality local fallback response
    const guidance = generateLocalEmergencyGuidance(question, activeAlert, shelters, resources);
    return res.json({
      success: true,
      provider: 'traana-emergency-core',
      data: guidance
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
