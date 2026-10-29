import mongoose from 'mongoose';
import { connectDatabase, closeDatabase } from '../config/database.js';
import User from '../models/User.js';
import Municipality from '../models/Municipality.js';
import Complaint from '../models/Complaint.js';
import Ward from '../models/Ward.js';
import Department from '../models/Department.js';
import * as muniService from '../services/municipality.service.js';
import * as complaintService from '../services/complaint.service.js';

async function runPhase5GisTests() {
  console.log('--- NAGARSETU AI PHASE 5 GIS MAP & MULTI-CITY GOVERNANCE ACCEPTANCE TESTS ---');

  await connectDatabase();

  // Test 1: Verify all 5 Municipalities exist in DB with valid GIS center coordinates
  const municipalCodes = ['PMC-DEMO', 'KMC-DEMO', 'NMC-DEMO', 'NMC-NGP-DEMO', 'IMC', 'IMC-DEMO'];
  const municipalities = await Municipality.find({ code: { $in: municipalCodes } });

  if (municipalities.length < 5) {
    console.error('FAILED: Not all 5 municipalities exist in database. Count:', municipalities.length);
    process.exit(1);
  }

  for (const m of municipalities) {
    if (!m.centerCoordinates || m.centerCoordinates.length !== 2) {
      console.error(`FAILED: Municipality ${m.code} missing center coordinates`);
      process.exit(1);
    }
  }
  console.log(`✅ TEST 1 PASSED: All 5 Municipalities Verified in MongoDB (${municipalities.map(m => m.code).join(', ')})`);

  // Test 2: City Isolation Test (Pune vs Ichalkaranji)
  const pmc = municipalities.find(m => m.code === 'PMC-DEMO');
  const imc = municipalities.find(m => m.code === 'IMC' || m.code === 'IMC-DEMO');

  const pmcComplaints = await complaintService.listComplaints({}, { municipalityId: pmc._id });
  const imcComplaints = await complaintService.listComplaints({}, { municipalityId: imc._id });

  const pmcHasImcData = pmcComplaints.items.some(c => c.municipalityId._id.toString() === imc._id.toString());
  const imcHasPmcData = imcComplaints.items.some(c => c.municipalityId._id.toString() === pmc._id.toString());

  if (pmcHasImcData || imcHasPmcData) {
    console.error('FAILED: Multi-city data leak detected between PMC and IMC!');
    process.exit(1);
  }
  console.log(`✅ TEST 2 PASSED: Strict Multi-City Data Isolation Verified (PMC Complaints: ${pmcComplaints.total}, IMC Complaints: ${imcComplaints.total})`);

  // Test 3: Spatial GeoJSON Coordinates Validation for Flagship IMC
  const complaintsWithCoords = await Complaint.find({
    municipalityId: imc._id,
    'location.coordinates': { $exists: true },
  });

  if (complaintsWithCoords.length === 0) {
    console.error('FAILED: No complaints with valid spatial coordinates found for IMC');
    process.exit(1);
  }

  for (const c of complaintsWithCoords) {
    const coords = c.location.coordinates;
    if (!Array.isArray(coords) || coords.length !== 2 || typeof coords[0] !== 'number' || typeof coords[1] !== 'number') {
      console.error(`FAILED: Invalid coordinates format for complaint ${c.complaintId}:`, coords);
      process.exit(1);
    }
  }
  console.log(`✅ TEST 3 PASSED: GeoJSON Spatial Coordinates Verified (${complaintsWithCoords.length} spatial points in Ichalkaranji)`);

  // Test 4: City Configuration Lookup (Wards, Departments, Admin Units for IMC)
  const imcDetails = await muniService.getMunicipalityById(imc._id);
  if (!imcDetails.wards || imcDetails.wards.length === 0 || !imcDetails.departments || imcDetails.departments.length === 0) {
    console.error('FAILED: City configuration details incomplete for IMC');
    process.exit(1);
  }
  console.log(`✅ TEST 4 PASSED: City Configuration API Verified (${imcDetails.wards.length} Wards, ${imcDetails.departments.length} Departments loaded for IMC)`);

  await closeDatabase();
  console.log('----------------------------------------------------');
  console.log('ALL PHASE 5 GIS & MULTI-CITY ACCEPTANCE TESTS PASSED (4/4)!');
  console.log('----------------------------------------------------');
  process.exit(0);
}

runPhase5GisTests().catch((err) => {
  console.error('[PHASE 5 TEST ERROR]', err);
  process.exit(1);
});
