# NAGARSETU AI — KNOWN LIMITATIONS & FUTURE SCOPE

**Tagline:** *"Connecting Citizens. Empowering Governance."*

---

## 1. Known Technical Limitations & Disclaimers

1. **Synthetic Demo Data**:
   - All municipal personnel, ward boundaries, worker contact details, and initial complaint numbers are synthetic demo data created for platform demonstration purposes.
   - Ichalkaranji and regional municipal configurations preserve strict data provenance disclaimers and do not imply an unauthorized municipal/police live API connection exists.

2. **AI Provider Binding**:
   - The AI service abstraction layer (`server/src/services/routing.service.js` and `aiChat.service.js`) includes heuristic rules and deterministic fallback classification.
   - When a live Gemini or OpenAI API key is configured in `.env`, the system forwards queries to the live provider; otherwise, it operates using the built-in NLP fallback.

3. **Field Worker Location Simulation**:
   - Field worker markers on the GIS Operations Map (`MapPage.jsx`) display active team locations. GPS positions report simulated device telemetry unless real location streaming is enabled on mobile.

4. **Third-Party Telephony / SMS Integration**:
   - SMS and WhatsApp citizen notifications are logged to MongoDB (`Notification` collection) and displayed in the application header. External SMS gateway delivery requires third-party API provider keys (e.g. Twilio/MSG91).

---

## 2. Future Enhancement Roadmap

1. **CCTV Anomaly Stream Integration**:
   - Binding municipal traffic & flood camera video feeds directly to the GIS map for automated computer vision hazard detection.
2. **Offline Mobile Sync**:
   - Service worker offline cache allowing field workers in remote low-connectivity wards to record completion proof offline and auto-sync when online.
3. **Multi-Language Speech Input**:
   - Voice-to-text complaint reporting in regional languages (Marathi, Hindi) within the Citizen 7-step wizard.
