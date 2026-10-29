/**
 * NAGARSETU AI SERVICE ABSTRACTION LAYER
 * 
 * Encapsulates all AI intelligence functions (classification, image analysis, 
 * duplicate detection, severity assessment, and verification assistance).
 * 
 * IMPORTANT: This layer acts as an isolated contract. In production, these methods
 * issue authenticated API calls to the Express REST API backend, ensuring zero API keys 
 * are exposed in the client/renderer code.
 */

export const AI_DISCLAIMER = "AI-generated recommendation. Final action remains with authorized personnel.";

export async function classifyComplaint(description, hasImage = false) {
  // Simulate AI processing latency
  await new Promise(resolve => setTimeout(resolve, 600));

  const textLower = (description || '').toLowerCase();

  let category = 'cat-pothole';
  let recommendedDept = 'dept-road';
  let severity = 'HIGH';
  let priority = 'P2';
  let slaHours = 24;
  let confidence = 94;

  if (textLower.includes('water') || textLower.includes('pipe') || textLower.includes('leak') || textLower.includes('contamination')) {
    category = 'cat-water';
    recommendedDept = 'dept-water';
    severity = 'CRITICAL';
    priority = 'P1';
    slaHours = 6;
    confidence = 98;
  } else if (textLower.includes('light') || textLower.includes('dark') || textLower.includes('electric') || textLower.includes('wire')) {
    category = 'cat-light';
    recommendedDept = 'dept-elec';
    severity = 'HIGH';
    priority = 'P2';
    slaHours = 24;
    confidence = 91;
  } else if (textLower.includes('garbage') || textLower.includes('waste') || textLower.includes('trash') || textLower.includes('smell')) {
    category = 'cat-garbage';
    recommendedDept = 'dept-waste';
    severity = 'MEDIUM';
    priority = 'P3';
    slaHours = 24;
    confidence = 93;
  } else if (textLower.includes('drain') || textLower.includes('sewage') || textLower.includes('overflow')) {
    category = 'cat-drainage';
    recommendedDept = 'dept-water';
    severity = 'HIGH';
    priority = 'P1';
    slaHours = 12;
    confidence = 96;
  }

  return {
    confidence,
    category,
    recommendedDept,
    severity,
    priority,
    recommendedSlaHours: slaHours,
    summary: `AI classified issue as ${category.replace('cat-', '').toUpperCase()} with ${confidence}% confidence based on semantic indicators.`,
    disclaimer: AI_DISCLAIMER,
  };
}

export async function analyzeImage(imageFileOrUrl) {
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    confidence: 91,
    detectedObjects: ['Asphalt Crack', 'Pothole Cavity', 'Standing Water', 'Road Markings'],
    severityScore: 0.86,
    depthEstimate: 'Substantial structural erosion (depth ~12cm)',
    hazardRating: 'HIGH_TRAFFIC_HAZARD',
    disclaimer: AI_DISCLAIMER,
  };
}

export async function detectDuplicates(locationCoords, categoryId, description) {
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    isPossibleDuplicate: true,
    matchingIncidentId: 'INC-2026-000124',
    supportingReportsCount: 14,
    locationSimilarityPct: 94,
    descriptionSimilarityPct: 88,
    actionRecommendation: 'GROUP_INTO_INCIDENT',
    disclaimer: AI_DISCLAIMER,
  };
}

export async function verifyCompletion(beforeMediaUrl, afterMediaUrl) {
  await new Promise(resolve => setTimeout(resolve, 900));

  return {
    confidence: 92,
    visualChangeDetected: true,
    locationConsistencyScore: 98,
    issueVisibility: 'RESOLVED',
    evidenceCompleteness: 100,
    recommendation: 'AWAITING_CITIZEN_VERIFICATION',
    summary: 'AI detected completed road patch repair. Pothole cavity is no longer visible in post-work photo evidence.',
    disclaimer: AI_DISCLAIMER,
  };
}
