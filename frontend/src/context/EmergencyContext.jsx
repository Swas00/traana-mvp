import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { translations } from '../utils/translations';

const EmergencyContext = createContext();

export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 1.0;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
}

export function EmergencyProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);
  const [shelters, setShelters] = useState([]);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [resources, setResources] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [hazardZones, setHazardZones] = useState([]);
  const [citizenLocation, setCitizenLocation] = useState({
    latitude: 28.6105,
    longitude: 77.2055,
    name: "Citizen's Current Location (Simulated)",
    neighborhood: "Sector 2, Flood-Affected Lowlands",
    mode: "DEMO",
    isInDanger: true,
    closestAlertDistance: 1.2,
    status: "IN_HAZARD_ZONE"
  });

  const [loading, setLoading] = useState(true);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');
  const [language, setLanguage] = useState('en');
  const [highContrast, setHighContrast] = useState(false);
  const [isAudioAlertActive, setIsAudioAlertActive] = useState(false);
  const [demoTourOpen, setDemoTourOpen] = useState(false);
  const [presentationOpen, setPresentationOpen] = useState(false);

  // NDMA SACHET Live Sync State
  const [sachetAlerts, setSachetAlerts] = useState([]);
  const [sachetTelemetry, setSachetTelemetry] = useState(null);
  const [sachetSyncing, setSachetSyncing] = useState(false);

  // Web Audio API Audio Oscillator for Siren
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  const t = translations[language] || translations.en;

  const fetchSachetData = async () => {
    try {
      const [alertsRes, telRes] = await Promise.all([
        fetch('/api/sachet/live-alerts').then(r => r.json()).catch(() => null),
        fetch('/api/sachet/telemetry').then(r => r.json()).catch(() => null)
      ]);
      if (alertsRes && alertsRes.success) {
        setSachetAlerts(alertsRes.data || []);
      }
      if (telRes && telRes.success) {
        setSachetTelemetry(telRes.data || null);
      }
    } catch (e) {
      console.warn('Error fetching SACHET data:', e);
    }
  };

  const syncSachetNow = async () => {
    try {
      setSachetSyncing(true);
      const res = await fetch('/api/sachet/sync-now', { method: 'POST' });
      const data = await res.json();
      await fetchSachetData();
      setLocationMessage(`📡 Synced with NDMA SACHET: ${data.data?.liveAlerts?.length || sachetAlerts.length} live alerts updated`);
      setTimeout(() => setLocationMessage(''), 5000);
      return data;
    } catch (e) {
      console.error('Error syncing SACHET:', e);
    } finally {
      setSachetSyncing(false);
    }
  };

  const activateSachetAlert = async (alertId) => {
    try {
      setLoading(true);
      const res = await fetch('/api/sachet/activate-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId })
      });
      const data = await res.json();
      if (data.success) {
        await fetchAllData();
        setLocationMessage(`🚨 Live Indian Alert Activated: ${data.data.alert.title.slice(0, 50)}...`);
        setTimeout(() => setLocationMessage(''), 6000);
      }
      return data;
    } catch (e) {
      console.error('Error activating SACHET alert:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async (userLat = null, userLng = null) => {
    try {
      setLoading(true);
      const lat = userLat !== null ? userLat : citizenLocation.latitude;
      const lng = userLng !== null ? userLng : citizenLocation.longitude;

      const [alertsRes, sheltersRes, resourcesRes, contactsRes, hazardsRes, citizenRes] = await Promise.all([
        fetch('/api/alerts').then(r => r.json()),
        fetch(`/api/shelters?lat=${lat}&lng=${lng}`).then(r => r.json()),
        fetch('/api/resources').then(r => r.json()),
        fetch('/api/resources/contacts').then(r => r.json()),
        fetch('/api/resources/hazards').then(r => r.json()),
        fetch('/api/resources/citizen-location').then(r => r.json())
      ]);

      if (alertsRes.success) {
        setAlerts(alertsRes.data);
        const active = alertsRes.data.find(a => a.active) || alertsRes.data[0] || null;
        setActiveAlert(active);
      }

      if (sheltersRes.success) {
        setShelters(sheltersRes.data);
        setSelectedShelter(prev => {
          if (prev) {
            const updated = sheltersRes.data.find(s => s.id === prev.id);
            return updated || prev;
          }
          return sheltersRes.data.find(s => s.status !== 'FULL') || sheltersRes.data[0];
        });
      }

      if (resourcesRes.success) setResources(resourcesRes.data);
      if (contactsRes.success) setContacts(contactsRes.data);
      if (hazardsRes.success) setHazardZones(hazardsRes.data);
      if (citizenRes.success && citizenRes.data) {
        setCitizenLocation(prev => ({
          ...prev,
          ...citizenRes.data
        }));
      }
    } catch (err) {
      console.error('Error fetching emergency data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    fetchSachetData();
    const interval = setInterval(() => {
      fetchAllData(citizenLocation.latitude, citizenLocation.longitude);
      fetchSachetData();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Real GPS Location Detection using Browser Geolocation API
  const detectRealLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingLocation(true);
    setLocationMessage('Accessing GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let placeName = 'Detected GPS Location';
        let neighborhoodName = `GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;

        try {
          // Reverse-geocoding via OpenStreetMap Nominatim
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`
          );
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            const addr = geoData.address || {};
            const city = addr.city || addr.town || addr.county || addr.state_district || 'Local Area';
            const suburb = addr.suburb || addr.neighbourhood || addr.road || addr.state || '';
            placeName = `${suburb ? suburb + ', ' : ''}${city}`;
            neighborhoodName = `${city}, ${addr.country || ''}`;

            // If user's real location is far from default demo (Delhi 28.61, 77.20), generate local shelters
            const distFromDemo = calculateDistanceKm(latitude, longitude, 28.6139, 77.2090);
            if (distFromDemo > 50) {
              await fetch('/api/resources/generate-local-shelters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  latitude,
                  longitude,
                  cityName: city
                })
              });
            }
          }
        } catch (e) {
          console.warn('Reverse geocoding error:', e);
        }

        // Post to backend
        try {
          const updateRes = await fetch('/api/resources/citizen-location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              latitude,
              longitude,
              name: placeName,
              neighborhood: neighborhoodName,
              mode: 'GPS'
            })
          });
          const updateData = await updateRes.json();
          if (updateData.success) {
            setCitizenLocation(updateData.data);
            await fetchAllData(latitude, longitude);
            setLocationMessage(`📍 Connected to GPS: ${placeName}`);
            setTimeout(() => setLocationMessage(''), 6000);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        setIsDetectingLocation(false);
        let msg = 'Unable to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied by browser. Falling back to Demo mode.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        setLocationMessage(msg);
        setTimeout(() => setLocationMessage(''), 5000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Reset to the standard presentation Demo Location (Sector 2 Flood Zone)
  const resetToDemoLocation = async () => {
    try {
      setIsDetectingLocation(true);
      const updateRes = await fetch('/api/resources/citizen-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: 28.6105,
          longitude: 77.2055,
          name: "Citizen's Current Location (Simulated)",
          neighborhood: "Sector 2, Flood-Affected Lowlands",
          mode: "DEMO"
        })
      });
      const updateData = await updateRes.json();
      if (updateData.success) {
        setCitizenLocation(updateData.data);
        await resetDemoData();
        await fetchAllData(28.6105, 77.2055);
        setLocationMessage('🎯 Reset to Demo Scenario: Riverfront Sector 2');
        setTimeout(() => setLocationMessage(''), 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Custom coordinate pick (e.g. from clicking the map)
  const setCustomLocation = async (lat, lng, name = null) => {
    try {
      const updateRes = await fetch('/api/resources/citizen-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          name: name || `Selected Pin (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          neighborhood: "Selected Map Coordinates",
          mode: "CUSTOM"
        })
      });
      const updateData = await updateRes.json();
      if (updateData.success) {
        setCitizenLocation(updateData.data);
        await fetchAllData(lat, lng);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Web Audio Emergency Siren Synthesizer
  const toggleAudioSiren = () => {
    if (isAudioAlertActive) {
      stopSiren();
    } else {
      startSiren();
    }
  };

  const startSiren = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      let goingUp = true;
      let freq = 600;
      const timer = setInterval(() => {
        if (!oscillatorRef.current) {
          clearInterval(timer);
          return;
        }
        if (goingUp) {
          freq += 35;
          if (freq >= 950) goingUp = false;
        } else {
          freq -= 35;
          if (freq <= 550) goingUp = true;
        }
        try {
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
        } catch (_) {}
      }, 50);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
      setIsAudioAlertActive(true);
    } catch (e) {
      console.warn('Audio alert error:', e);
    }
  };

  const stopSiren = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch (e) {
      console.warn('Stop siren error:', e);
    }
    setIsAudioAlertActive(false);
  };

  // Trigger high severity flood simulation
  const triggerFloodAlert = async () => {
    try {
      const res = await fetch('/api/admin/trigger-flood', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchAllData(citizenLocation.latitude, citizenLocation.longitude);
      }
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  // Reset demo
  const resetDemoData = async () => {
    try {
      const res = await fetch('/api/admin/reset-demo', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchAllData();
      }
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle alert
  const toggleAlertStatus = async (alertId, forceState = null) => {
    try {
      const res = await fetch(`/api/alerts/${alertId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: forceState })
      });
      const data = await res.json();
      if (data.success) {
        await fetchAllData(citizenLocation.latitude, citizenLocation.longitude);
      }
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  // Update shelter capacity
  const updateShelterSlots = async (shelterId, availableSlots) => {
    try {
      const res = await fetch(`/api/shelters/${shelterId}/capacity`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availableSlots })
      });
      const data = await res.json();
      if (data.success) {
        await fetchAllData(citizenLocation.latitude, citizenLocation.longitude);
      }
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  // Evaluate if citizen is currently inside active alert hazard zone
  const isCitizenInDanger = citizenLocation.mode === 'DEMO'
    ? (activeAlert && (activeAlert.severity === 'HIGH' || activeAlert.severity === 'CRITICAL'))
    : (activeAlert && calculateDistanceKm(citizenLocation.latitude, citizenLocation.longitude, activeAlert.latitude, activeAlert.longitude) <= (activeAlert.radiusKm || 5));

  const threatDistanceKm = activeAlert
    ? calculateDistanceKm(citizenLocation.latitude, citizenLocation.longitude, activeAlert.latitude, activeAlert.longitude)
    : 999;

  return (
    <EmergencyContext.Provider
      value={{
        alerts,
        activeAlert,
        shelters,
        selectedShelter,
        setSelectedShelter,
        resources,
        contacts,
        hazardZones,
        citizenLocation,
        isCitizenInDanger,
        threatDistanceKm,
        isDetectingLocation,
        locationMessage,
        detectRealLocation,
        resetToDemoLocation,
        setCustomLocation,
        loading,
        language,
        setLanguage,
        highContrast,
        setHighContrast,
        isAudioAlertActive,
        toggleAudioSiren,
        triggerFloodAlert,
        resetDemoData,
        toggleAlertStatus,
        updateShelterSlots,
        refetch: fetchAllData,
        demoTourOpen,
        setDemoTourOpen,
        presentationOpen,
        setPresentationOpen,
        sachetAlerts,
        sachetTelemetry,
        sachetSyncing,
        syncSachetNow,
        activateSachetAlert,
        fetchSachetData,
        t
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
}
