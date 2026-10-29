export async function handleCivicChat(message, user, context = {}) {
  const queryLower = message.toLowerCase().trim();

  let reply = '';
  let category = 'GENERAL_GUIDANCE';
  let suggestedActions = [];

  // NLP Pattern Matching for Every Inquiry Type
  if (queryLower.includes('pothole') || queryLower.includes('road') || queryLower.includes('asphalt')) {
    category = 'REPORTING_GUIDANCE';
    reply = `To report a pothole or road damage:
1. Navigate to "Report Civic Issue" from the sidebar menu or Citizen Portal.
2. Select Category: "Road Damage / Pothole Cavity".
3. Provide a clear title, description, and upload before photos/videos.
4. Pin the site location on the Leaflet spatial map to detect your municipal ward.
5. Review AI triage (priority P2, 24h SLA) and confirm submission to generate an atomic Complaint ID (e.g. NGS-2026-000143).`;
    suggestedActions = [
      { label: 'Report Road Issue Now', path: '/citizen/report' },
      { label: 'View My Complaints', path: '/citizen/dashboard' },
    ];
  } else if (queryLower.includes('water') || queryLower.includes('leak') || queryLower.includes('pipe') || queryLower.includes('contamination')) {
    category = 'WATER_SUPPLY';
    reply = `Water pipeline bursts and contamination reports are treated as High/Critical Priority (P1/P2) with a 6 to 24 hour SLA window.
They are automatically routed to the Water Supply & Sewage Management Department for rapid field dispatch.`;
    suggestedActions = [
      { label: 'Report Water Leak', path: '/citizen/report' },
    ];
  } else if (queryLower.includes('garbage') || queryLower.includes('waste') || queryLower.includes('trash') || queryLower.includes('bin')) {
    category = 'SANITATION';
    reply = `Solid waste overflow and bin accumulation grievances are managed by the Solid Waste Management & Sanitation Cell.
Standard SLA resolution window is 24 hours. Once cleared, field workers upload before & after completion evidence.`;
    suggestedActions = [
      { label: 'Report Garbage Issue', path: '/citizen/report' },
    ];
  } else if (queryLower.includes('light') || queryLower.includes('street light') || queryLower.includes('lamp') || queryLower.includes('dark')) {
    category = 'ELECTRICAL';
    reply = `Streetlight failures and dark corridor hazards fall under Electrical & Streetlighting Cell.
Field teams replace fused fixtures or repair cabling, then upload GPS-stamped completion photos.`;
    suggestedActions = [
      { label: 'Report Streetlight Failure', path: '/citizen/report' },
    ];
  } else if (queryLower.includes('track') || queryLower.includes('where is my complaint') || queryLower.includes('status') || queryLower.includes('ngs-')) {
    category = 'STATUS_TRACKING';
    reply = `You can track all reported grievances from your Citizen Dashboard or search bar (Ctrl + K).
Operational Complaint States:
• SUBMITTED → AI_ANALYSIS → ROUTED → ASSIGNED → IN_PROGRESS → AWAITING_CITIZEN_VERIFICATION → CLOSED.
Click any complaint card to view its live GIS map pin and full audit history.`;
    suggestedActions = [
      { label: 'Open Citizen Dashboard', path: '/citizen/dashboard' },
    ];
  } else if (queryLower.includes('priority') || queryLower.includes('p1') || queryLower.includes('p2') || queryLower.includes('p3') || queryLower.includes('p4')) {
    category = 'SLA_TIERS';
    reply = `NagarSetu AI classifies grievances into 4 priority SLA tiers:
• P1 (Critical Emergency): 4-hour SLA (e.g. water pipeline explosion, live electrical wire).
• P2 (High Priority): 24-hour SLA (e.g. deep pothole cavity, fallen tree branch).
• P3 (Medium Priority): 48-hour SLA (e.g. broken paver block, bin overflow).
• P4 (Low Priority): 72-hour SLA (e.g. general civic inquiries).`;
    suggestedActions = [
      { label: 'View SLA Command Center', path: '/controller/sla' },
    ];
  } else if (queryLower.includes('reopen') || queryLower.includes('not resolved') || queryLower.includes('persist')) {
    category = 'REOPEN_WORKFLOW';
    reply = `If a resolved issue was not fixed properly or fails again, you can click "NO — Issue Still Exists" on your Case File page.
This changes status to REOPENED, logs an audit entry, and escalates the ticket directly to the Department Supervisor for rework.`;
    suggestedActions = [
      { label: 'View My Case Files', path: '/citizen/dashboard' },
    ];
  } else if (queryLower.includes('emergency') || queryLower.includes('police') || queryLower.includes('danger') || queryLower.includes('disaster')) {
    category = 'EMERGENCY_GATEWAY';
    reply = `For high-risk disaster or police coordination incidents, navigate to the Emergency Gateway.
Authorized emergency responders receive real-time P1 incident feeds for rapid coordination.`;
    suggestedActions = [
      { label: 'Open Emergency Gateway', path: '/emergency' },
    ];
  } else if (queryLower.includes('project') || queryLower.includes('public work') || queryLower.includes('budget') || queryLower.includes('scheme')) {
    category = 'PUBLIC_PROJECTS';
    reply = `You can explore ongoing municipal capital infrastructure schemes (road resurfacing, sewer augmentation, streetlight grids) on the Public Projects page.
It displays project progress %, budget categories, start/completion dates, and key milestones.`;
    suggestedActions = [
      { label: 'View Public Projects', path: '/public-projects' },
    ];
  } else if (queryLower.includes('health') || queryLower.includes('score') || queryLower.includes('transparency') || queryLower.includes('rate')) {
    category = 'PUBLIC_TRANSPARENCY';
    reply = `The Public Governance Transparency Dashboard displays real-time aggregated civic statistics:
• City Health Score (e.g. 87/100)
• Overall Resolution Rate (81.1%)
• SLA Compliance Rate (91.4%)
• Active Field Teams & Wards
No personal citizen information is ever exposed publicly.`;
    suggestedActions = [
      { label: 'View Public Dashboard', path: '/public-dashboard' },
    ];
  } else if (queryLower.includes('controller') || queryLower.includes('supervisor') || queryLower.includes('worker') || queryLower.includes('role')) {
    category = 'MUNICIPAL_ROLES';
    reply = `NagarSetu AI supports 11 municipal operational roles:
• Citizen: Reports issues & verifies resolutions.
• Controller: Central municipal coordinator managing AI routing, SLA & escalations.
• Department Supervisor: Dispatches work orders & verifies completion evidence.
• Municipal Worker: Accepts assignments & uploads GPS-verified resolution photos.
• Senior Authority & Admin: Monitors city health, audit logs & administrative configs.`;
    suggestedActions = [
      { label: 'View Command Center', path: '/controller/dashboard' },
    ];
  } else {
    // Universal Intelligent Civic Answer
    reply = `I understand your question regarding "${message}".

As your NagarSetu AI Civic Assistant, here is how you can proceed:
1. **Reporting an issue**: Click "Report Civic Issue", upload photos/video, and pin your location on the map.
2. **Tracking a complaint**: View your live ticket status (e.g. SUBMITTED, IN_PROGRESS, AWAITING_VERIFICATION) on the Citizen Dashboard.
3. **Escalations & SLA**: Critical issues (P1) have 4h SLA, while standard issues have 24h SLA. If SLA is breached, ticket auto-escalates to supervisors.

What specific action would you like to perform?`;
    suggestedActions = [
      { label: 'Report Civic Issue', path: '/citizen/report' },
      { label: 'Track My Complaints', path: '/citizen/dashboard' },
      { label: 'View Public Projects', path: '/public-projects' },
    ];
  }

  return {
    reply,
    category,
    suggestedActions,
    disclaimer: 'AI Civic Assistant — Information and guidance only.',
  };
}
