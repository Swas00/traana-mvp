# TRAANA — Threat Response & Assistance Network for Alerts and Navigation

> **Disaster-Alert & Emergency-Response Minimum Viable Product (MVP)**  
> **Core Mission Flow:** `Alert → Understand → Act → Find Shelter → Evacuate → Get Help`

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Swas00/traana-mvp)

---

## 📌 Executive Summary

**TRAANA** bridges the critical gap between early disaster warnings and citizen survival. Traditional emergency broadcasts state that danger is incoming, but leave citizens stranded in confusion. TRAANA delivers an end-to-end, life-safety navigation network:
1. **Disaster Alerts:** Instant notifications with high-visibility severity ratings (HIGH, MEDIUM, LOW) and immediate action instructions.
2. **Citizen Dashboard:** Actionable life-safety steps (cutting electricity breakers, turning off gas, grabbing 72h go-bags).
3. **Shelter Discovery:** Real-time occupancy tracking, bed availability, high-ground elevation metrics, and critical facility filters (wheelchair ramps, medical stations, hot meals, drinking water).
4. **Hazard-Aware Evacuation Map:** Live OpenStreetMap cartography plotting safe detour paths around inundated lowlands, submerged bridges, and electrocution zones.
5. **TRAANA AI Assistant:** Natural-language disaster triage with situational awareness of the active alert, answering urgent questions with life-saving precision.
6. **Emergency & Relief Directory:** Direct dispatch dial links for universal SOS (112), Disaster Cell (1070), trauma hospitals, NDRF rescue boat squads, and fire teams.
7. **Crisis Admin Dispatcher:** Complete simulation command suite for reviewers to trigger flash floods, cyclones, or wildfires live, update shelter bed counts, and see citizen dashboards update instantly.

---

## 🏛️ System Architecture

```mermaid
graph TD
    subgraph ClientLayer["🖥️ Frontend Client (React 19 + Vite + Tailwind CSS v4)"]
        UI_Home["Home & Crisis Overview"]
        UI_Dash["Citizen Dashboard & Ticker"]
        UI_Alerts["Disaster Alerts Archive"]
        UI_Shelter["Shelter Finder & Capacity"]
        UI_Map["Hazard-Aware Evacuation Map (Leaflet)"]
        UI_AI["TRAANA AI Assistant (Speech & Chat)"]
        UI_Res["Emergency Resources & Hotlines"]
        UI_Admin["Admin Dispatch & Simulation Suite"]
        UI_Deck["Interactive 10-Slide Pitch Deck"]
    end

    subgraph APILayer["⚙️ Backend REST Engine (Node.js + Express)"]
        API_Alerts["/api/alerts (Active & History)"]
        API_Shelters["/api/shelters (Discovery & Capacity)"]
        API_Resources["/api/resources (Hospitals, Boats, Relief)"]
        API_Assistant["/api/assistant (Contextual Triage)"]
        API_Admin["/api/admin (Simulation & Reset)"]
    end

    subgraph DataAndAI["🧠 Intelligence & Persistence"]
        DB_Mongo[("MongoDB / Local Mongoose")]
        Store_Memory[("Resilient In-Memory Dual Store")]
        AI_Gemini["Google GenAI (Gemini 3.8 Flash)"]
        AI_Core["TRAANA Contextual Offline Engine"]
    end

    UI_Dash --> API_Alerts
    UI_Shelter --> API_Shelters
    UI_Map --> API_Shelters
    UI_Map --> API_Resources
    UI_AI --> API_Assistant
    UI_Admin --> API_Admin
    UI_Res --> API_Resources

    API_Alerts --> DB_Mongo
    API_Alerts -. Fallback .-> Store_Memory
    API_Shelters --> DB_Mongo
    API_Shelters -. Fallback .-> Store_Memory
    API_Resources --> DB_Mongo
    API_Assistant --> AI_Gemini
    API_Assistant -. Fallback .-> AI_Core
```

---

## 🗄️ Database & Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    ALERT {
        string id PK
        string type "FLOOD | CYCLONE | EARTHQUAKE | WILDFIRE"
        string title
        string description
        string severity "HIGH | MEDIUM | LOW | CRITICAL"
        string location
        float latitude
        float longitude
        float radiusKm
        string_array instructions
        datetime timestamp
        boolean active
        int affectedPopulation
        string issuedBy
    }

    SHELTER {
        string id PK
        string name
        string address
        float latitude
        float longitude
        float distanceKm
        int capacity
        int availableSlots
        boolean food
        boolean water
        boolean medical
        boolean powerBackup
        boolean accessible
        string status "OPEN | FILLING_FAST | FULL"
        string contactPerson
        string phone
        int elevationMeters
        string notes
    }

    RESOURCE {
        string id PK
        string type "HOSPITAL | POLICE | FIRE | AMBULANCE | RELIEF | RESCUE"
        string name
        string address
        float latitude
        float longitude
        string contact
        string availability
        int bedsAvailable
        int ambulanceOnStandby
        int waterLiters
        int boatUnits
    }

    EMERGENCY_CONTACT {
        string serviceName
        string number
        string description
    }

    HAZARD_ZONE {
        string id PK
        string name
        string type "DEEP_WATER | BRIDGE_CLOSED | ELECTRICAL_HAZARD"
        string description
        coordinates polygon
        string severity
    }

    ALERT ||--o{ HAZARD_ZONE : triggers
    ALERT ||--o{ SHELTER : designates
    SHELTER ||--o{ RESOURCE : coordinates_with
```

---

## 🔄 Core Demonstration Flow (Section 9 Walkthrough)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as 🎛️ Emergency Dispatcher
    actor Citizen as 👤 Citizen / Evaluator
    participant Frontend as 🖥️ TRAANA Web App
    participant Backend as ⚙️ Express REST API
    participant DB as 🗄️ MongoDB Database
    participant AI as 🤖 Gemini / Emergency AI

    Admin->>Frontend: 1. Opens Admin Dispatch
    Admin->>Backend: 2. Triggers "HIGH-SEVERITY FLOOD" Alert
    Backend->>DB: 3. Activates alert record & timestamps
    Backend-->>Frontend: 4. Broadcasts alert across network
    Frontend->>Citizen: 5. Displays Red Siren Alert Banner & Action Checklist
    Citizen->>Frontend: 6. Clicks "Find Nearest Safe Shelter"
    Frontend->>Backend: 7. GET /api/shelters/nearby
    Backend-->>Frontend: 8. Returns shelters with live capacity (North Ridge: 240 slots)
    Citizen->>Frontend: 9. Selects North Ridge High School as Evacuation Destination
    Frontend->>Frontend: 10. Renders Evacuation Map avoiding flood hazard polygons
    Citizen->>Frontend: 11. Asks TRAANA AI: "What should I do during this flood?"
    Frontend->>Backend: 12. POST /api/assistant (with active flood context)
    Backend->>AI: 13. Evaluates prompt + alert details + shelter slots
    AI-->>Frontend: 14. Delivers prioritized life-safety instructions & go-bag list
    Citizen->>Frontend: 15. Opens Emergency Resources (trauma hospital, NDRF boat dispatch)
```

---

## 📡 REST API Documentation

### 1. Alerts Module
| Method | Endpoint | Description | Sample Response Payload |
|---|---|---|---|
| `GET` | `/api/alerts` | List all historical and current alerts | `{ success: true, count: 3, data: [...] }` |
| `GET` | `/api/alerts/active` | Get currently active disaster emergency alerts | `{ success: true, count: 1, data: [{ type: "FLOOD", severity: "HIGH", ... }] }` |
| `GET` | `/api/alerts/:id` | Fetch specific alert record | `{ success: true, data: { ... } }` |
| `POST` | `/api/alerts` | Create and broadcast new simulated alert | `Body: { title, type, severity, location, radiusKm, instructions: [] }` |
| `PATCH` | `/api/alerts/:id/toggle` | Toggle alert between active and archived | `Body: { active: true / false }` |

### 2. Shelters Module
| Method | Endpoint | Description | Sample Query / Body |
|---|---|---|---|
| `GET` | `/api/shelters` | List all registered shelters sorted by distance | — |
| `GET` | `/api/shelters/nearby` | Filter shelters by accessibility, distance, and facilities | `?accessible=true&food=true&medical=true` |
| `GET` | `/api/shelters/:id` | Fetch detailed shelter record | — |
| `PATCH` | `/api/shelters/:id/capacity` | Update available bed slots (simulates shelter filling up) | `Body: { availableSlots: 0 }` |

### 3. Resources & Hazards Module
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/resources` | List all emergency resources (optional `?type=HOSPITAL`) |
| `GET` | `/api/resources/hospitals` | Filter exclusively for trauma centers and ICU facilities |
| `GET` | `/api/resources/relief` | Filter for clean drinking water and food ration relief centers |
| `GET` | `/api/resources/contacts` | Fetch emergency dispatch hotlines (112, 1070, 108, 101, 100) |
| `GET` | `/api/resources/hazards` | Retrieve active hazard avoidance polygons for map routing |
| `GET` | `/api/resources/citizen-location` | Get simulated citizen coordinates |

### 4. AI Assistant Module
| Method | Endpoint | Description | Sample Request |
|---|---|---|---|
| `POST` | `/api/assistant` | Context-aware natural-language emergency triage | `Body: { question: "What should I pack?", activeAlertId: "alert-001" }` |

### 5. Admin & Simulation Module
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/trigger-flood` | 1-Click trigger for the Core Demo High-Severity Flood emergency |
| `POST` | `/api/admin/reset-demo` | Resets all alerts, shelter capacities, and resources to seed baseline |
| `POST` | `/api/admin/preset-simulation` | Trigger scenario presets: `CYCLONE_WARNING`, `WILDFIRE`, `EARTHQUAKE_AFTERSHOCK` |
| `GET` | `/api/admin/status` | Real-time database telemetry, active alert counts, and occupancy |

---

## 💻 Technology Stack

- **Frontend:** React 19, Vite 8, Tailwind CSS v4, Lucide React Iconography, Leaflet Cartography.
- **Audio Synthesizer:** Native Web Audio API emergency siren oscillator wail (100% offline, zero external audio asset dependency).
- **Speech Synthesis:** Web Speech API for emergency broadcast read-aloud and accessibility.
- **Backend:** Node.js, Express.js REST API with CORS and structured routing.
- **Database:** MongoDB with Mongoose document schemas + Automatic Dual In-Memory Failover Cache (ensures uninterrupted operation even during internet/database disconnects).
- **AI Engine:** Google GenAI SDK (`@google/genai`) using `gemini-3.8-flash` with contextual situation injection + Built-in offline emergency knowledge core.

---

## 🚀 Running the Prototype Locally

### Prerequisites
- Node.js >= 18 (Tested on v24.17.0)
- npm >= 9 (Tested on 11.13.0)
- MongoDB (Running locally or via cloud URI; if unavailable, in-memory fallback engages automatically)

### 1-Click Windows Launch
Double-click `start.bat` in the project root, or execute:
```powershell
./start.ps1
```

### Manual Launch
**Backend:**
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## 📋 Evaluation & Testing Checklist (Section 11)

- [x] **Frontend loads without console errors** (Verified via Vite build & runtime).
- [x] **All navigation routes work** (Home, Dashboard, Alerts, Shelters, Routes, Assistant, Resources, Admin).
- [x] **Admin can create and activate an alert** (Tested via custom alert creator and simulation presets).
- [x] **Active alert appears on citizen dashboard** (Immediate broadcast banner, high-severity badge, and instructions).
- [x] **Alert details display correctly** (Timestamps, affected sectors, casualty estimates, issuing authority).
- [x] **Shelter data loads from API** (Verified live MongoDB and REST API endpoints).
- [x] **Available shelter capacity is shown correctly** (Live capacity progress bars, occupancy percentages).
- [x] **Map loads and displays markers** (Citizen pin, shelter markers, destination highlight).
- [x] **Hazard avoidance active** (Polygons drawn for flooded lowlands, detour route plotted).
- [x] **TRAANA AI returns concise answers** (Active-alert context injected, go-bag checklists, tap water safety).
- [x] **Emergency audio alert siren works** (Web Audio API modulated frequency synthesizer).
- [x] **Multilingual switcher ready** (English, Hindi, Spanish).
- [x] **High contrast emergency mode** (Optimized for visibility under glare or night-time disaster conditions).
- [x] **Interactive 10-Slide Pitch Deck** (Embedded directly into the application header for live presentation).
