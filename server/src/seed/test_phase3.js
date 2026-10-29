import mongoose from 'mongoose';
import { connectDatabase, closeDatabase } from '../config/database.js';
import User from '../models/User.js';
import Municipality from '../models/Municipality.js';
import Ward from '../models/Ward.js';
import Department from '../models/Department.js';
import Complaint from '../models/Complaint.js';
import AuditLog from '../models/AuditLog.js';
import Notification from '../models/Notification.js';
import * as complaintService from '../services/complaint.service.js';
import * as muniService from '../services/municipality.service.js';

async function runPhase3Tests() {
  console.log('--- NAGARSETU AI PHASE 3 CITIZEN PORTAL & LIFECYCLE ACCEPTANCE TESTS ---');

  // Connect to database
  await connectDatabase();

  // Test 1: Fetch Municipality Categories (Flagship: Ichalkaranji)
  const imc = await Municipality.findOne({ code: { $in: ['IMC', 'IMC-DEMO'] } });
  if (!imc) {
    console.error('FAILED: IMC Municipality not found');
    process.exit(1);
  }
  const categories = await muniService.getCategoriesByMunicipalityId(imc._id);
  if (!categories || categories.length === 0) {
    console.error('FAILED: Municipality categories list empty');
    process.exit(1);
  }
  console.log(`✅ TEST 1 PASSED: Categories API (${categories.length} categories loaded)`);

  // Test 2: Submit Citizen Complaint (POST /api/v1/complaints)
  const citizenUser = await User.findOne({ email: 'citizen@nagarsetu.demo' });
  const ward = await Ward.findOne({ municipalityId: imc._id });
  const dept = await Department.findOne({ municipalityId: imc._id });

  if (!citizenUser || !ward || !dept) {
    console.error('FAILED: Seed prerequisites missing');
    process.exit(1);
  }

  const newComplaintPayload = {
    municipalityId: imc._id,
    wardId: ward._id,
    departmentId: dept._id,
    title: 'Water Supply Pipeline Leak near Market Yard',
    description: 'High pressure clean water leaking onto main road causing flooding and water loss.',
    category: 'Water Supply & Sewage Management',
    priority: 'P1',
    severity: 'CRITICAL',
    location: {
      type: 'Point',
      coordinates: [73.8567, 18.5204],
      address: 'Market Yard Main Gate, Ward 12, Pune',
    },
    media: {
      images: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='],
      videos: [],
    },
  };

  const created = await complaintService.createComplaint(newComplaintPayload, citizenUser, 'req-phase3-test-1');
  if (!created || !created.complaintId.startsWith('NGS-2026-') || created.status !== 'SUBMITTED') {
    console.error('FAILED: Complaint creation logic', created);
    process.exit(1);
  }
  if (created.sla.targetHours !== 4) {
    console.error('FAILED: SLA calculation for P1 priority expected 4 hours, got:', created.sla.targetHours);
    process.exit(1);
  }
  console.log(`✅ TEST 2 PASSED: Complaint Creation & SLA Calculation Verified (${created.complaintId}, SLA Target: ${created.sla.targetHours}h)`);

  // Test 3: List Citizen Complaints (GET /api/v1/complaints/my)
  const citizenList = await complaintService.listComplaints({}, { citizenId: citizenUser._id });
  if (citizenList.total < 1 || !citizenList.items.some(c => c.complaintId === created.complaintId)) {
    console.error('FAILED: Citizen my complaints list verification');
    process.exit(1);
  }
  console.log(`✅ TEST 3 PASSED: Citizen My Complaints List API Verified (${citizenList.total} citizen complaints)`);

  // Test 4: Get Complaint Details & Timeline (GET /api/v1/complaints/:id)
  const fetchedDetails = await complaintService.getComplaintById(created.complaintId);
  if (!fetchedDetails || fetchedDetails.statusHistory.length < 1) {
    console.error('FAILED: Complaint details retrieval');
    process.exit(1);
  }
  console.log(`✅ TEST 4 PASSED: Complaint Details & Timeline API Verified (Timeline Events: ${fetchedDetails.statusHistory.length})`);

  // Test 5: Reopen Complaint Lifecycle & Audit Log (POST /api/v1/complaints/:id/reopen)
  const reopenReason = 'Water leakage restarted from pipe joint 2 hours after initial patch.';
  const reopened = await complaintService.reopenComplaint(created.complaintId, reopenReason, citizenUser, 'req-phase3-test-2');
  if (!reopened || reopened.status !== 'REOPENED') {
    console.error('FAILED: Complaint reopening logic', reopened);
    process.exit(1);
  }

  // Verify Audit Log entry
  const auditEntry = await AuditLog.findOne({ entityId: created._id.toString(), action: 'COMPLAINT_REOPENED' });
  if (!auditEntry) {
    console.error('FAILED: Reopening audit log entry not found');
    process.exit(1);
  }

  console.log(`✅ TEST 5 PASSED: Complaint Reopen Lifecycle & Immutable Audit Log Verified (${reopened.complaintId}, Status: ${reopened.status})`);

  await closeDatabase();
  console.log('----------------------------------------------------');
  console.log('ALL PHASE 3 CITIZEN PORTAL ACCEPTANCE TESTS PASSED (5/5)!');
  console.log('----------------------------------------------------');
  process.exit(0);
}

runPhase3Tests().catch((err) => {
  console.error('[PHASE 3 TEST ERROR]', err);
  process.exit(1);
});
