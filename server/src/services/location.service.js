import Ward from '../models/Ward.js';

/**
 * NAGARSETU SPATIAL LOCATION RESOLVER SERVICE
 * 
 * Maps GPS coordinates [latitude, longitude] to administrative wards 
 * within the specified municipality.
 */
export async function resolveLocationToWard(latitude, longitude, municipalityId) {
  const wards = await Ward.find({ municipalityId, isActive: true });

  if (!wards || wards.length === 0) {
    return {
      municipalityId,
      wardId: null,
      wardName: 'Unassigned Ward',
      area: 'Municipal Area',
      confidence: 0.75,
      source: 'synthetic-demo-gis',
    };
  }

  // Find nearest ward by Euclidean distance to centerCoordinates [lat, lng]
  let nearestWard = wards[0];
  let minDistance = Infinity;

  for (const ward of wards) {
    if (ward.centerCoordinates && ward.centerCoordinates.length === 2) {
      const wardLat = ward.centerCoordinates[0];
      const wardLng = ward.centerCoordinates[1];
      const dist = Math.hypot(latitude - wardLat, longitude - wardLng);
      if (dist < minDistance) {
        minDistance = dist;
        nearestWard = ward;
      }
    }
  }

  return {
    municipalityId,
    wardId: nearestWard._id,
    wardName: nearestWard.name,
    wardNumber: nearestWard.number,
    area: nearestWard.name,
    confidence: 0.92,
    source: 'synthetic-demo-gis',
    disclaimer: 'Demo location intelligence — municipal GIS integration can be connected in production.',
  };
}
