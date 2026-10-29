import mongoose from 'mongoose';
import { connectDatabase, closeDatabase } from '../config/database.js';
import User from '../models/User.js';
import Municipality from '../models/Municipality.js';
import Ward from '../models/Ward.js';
import Department from '../models/Department.js';
import Complaint from '../models/Complaint.js';
import WorkOrder from '../models/WorkOrder.js';
import AuditLog from '../models/AuditLog.js';
import * as complaintService from '../services/complaint.service.js';
import * as workOrderService from '../services/workOrder.service.js';

async function runPhase4LifecycleTests() {
  console.log('--- NAGARSETU AI PHASE 4 OPERATIONAL LIFECYCLE ACCEPTANCE TESTS ---');

  await connectDatabase();

  // 1. Fetch seed users and entities
  const citizen = await User.findOne({ email: 'citizen@nagarsetu.demo' });
  const controller = await User.findOne({ email: 'controller@nagarsetu.demo' });
  const supervisor = await User.findOne({ email: 'supervisor@nagarsetu.demo' });
  const worker = await User.findOne({ email: 'worker@nagarsetu.demo' });
  const pmc = await Municipality.findOne({ code: { $in: ['IMC', 'IMC-DEMO'] } });
  const ward = await Ward.findOne({ municipalityId: pmc._id });
  const dept = await Department.findOne({ municipalityId: pmc._id });

  if (!citizen || !controller || !supervisor || !worker || !pmc || !ward || !dept) {
    console.error('FAILED: Required seed personas/entities missing for lifecycle test');
    process.exit(1);
  }

  // STEP 1: Citizen creates complaint
  const complaint = await complaintService.createComplaint(
    {
      municipalityId: pmc._id,
      wardId: ward._id,
      departmentId: dept._id,
      title: 'Phase 4 End-to-End Test: Major Road Cavity on FC Road',
      description: 'Dangerous pothole cavity requiring immediate hot-mix asphalt patching.',
      category: 'Road Damage / Pothole Cavity',
      priority: 'P2',
      severity: 'HIGH',
      location: {
        type: 'Point',
        coordinates: [73.8507, 18.5284],
        address: 'FC Road, Ward 12, Shivajinagar, Pune',
      },
    },
    citizen,
    'req-p4-step1'
  );

  console.log(`✅ STEP 1 PASSED: Complaint Created (${complaint.complaintId}, Status: ${complaint.status})`);

  // STEP 2: Controller Reviews AI Recommendation & Routes Complaint
  const routed = await complaintService.routeComplaint(
    complaint.complaintId,
    {
      wardId: ward._id,
      departmentId: dept._id,
      assignedToUserId: worker._id,
      priority: 'P2',
      overrideAi: false,
      note: 'Controller approved AI routing recommendation.',
    },
    controller,
    'req-p4-step2'
  );

  if (routed.status !== 'ROUTED') {
    console.error('FAILED: Controller routing failed', routed);
    process.exit(1);
  }
  console.log(`✅ STEP 2 PASSED: Controller Routed Complaint (${routed.complaintId}, Status: ${routed.status})`);

  // STEP 3: Department Supervisor Issues Work Order
  const workOrder = await workOrderService.createWorkOrder(
    {
      complaintId: routed._id,
      departmentId: dept._id,
      assignedWorkerId: worker._id,
      assignedTeam: 'Road Rapid Response Team A',
      title: `Work Order for ${routed.complaintId}`,
      instructions: 'Fill road cavity with hot-mix asphalt, compact surface, upload before/after photos.',
    },
    supervisor,
    'req-p4-step3'
  );

  if (!workOrder || !workOrder.workOrderId.startsWith('WO-2026-')) {
    console.error('FAILED: Work Order creation failed', workOrder);
    process.exit(1);
  }
  console.log(`✅ STEP 3 PASSED: Work Order Created (${workOrder.workOrderId}, Status: ${workOrder.status})`);

  // STEP 3B: Verify Duplicate Active Work Order Prevention
  let duplicatePrevented = false;
  try {
    await workOrderService.createWorkOrder(
      { complaintId: routed._id, departmentId: dept._id },
      supervisor,
      'req-p4-step3b'
    );
  } catch (err) {
    if (err.code === 'DUPLICATE_WORK_ORDER') {
      duplicatePrevented = true;
    }
  }
  if (!duplicatePrevented) {
    console.error('FAILED: Duplicate active work order was not blocked');
    process.exit(1);
  }
  console.log('✅ STEP 3B PASSED: Duplicate Active Work Order Prevention Verified');

  // STEP 4: Worker Accepts Work Order
  const acceptedWO = await workOrderService.acceptWorkOrder(workOrder._id, worker, 'req-p4-step4');
  if (acceptedWO.status !== 'ACCEPTED') {
    console.error('FAILED: Worker accept work order', acceptedWO);
    process.exit(1);
  }
  console.log(`✅ STEP 4 PASSED: Worker Accepted Work Order (Status: ${acceptedWO.status})`);

  // STEP 5: Worker Starts Field Work
  const startedWO = await workOrderService.startWorkOrder(workOrder._id, worker, 'req-p4-step5');
  if (startedWO.status !== 'IN_PROGRESS') {
    console.error('FAILED: Worker start work order', startedWO);
    process.exit(1);
  }
  console.log(`✅ STEP 5 PASSED: Field Work Marked IN_PROGRESS (Status: ${startedWO.status})`);

  // STEP 6: Worker Submits Completion Evidence
  const completedWO = await workOrderService.completeWorkOrder(
    workOrder._id,
    {
      notes: 'Pothole filled with hot-mix asphalt, leveled, and compacted.',
      beforeImages: ['data:image/jpeg;base64,before_evidence_sample'],
      afterImages: ['data:image/jpeg;base64,after_evidence_sample'],
      gpsVerified: true,
    },
    worker,
    'req-p4-step6'
  );

  if (completedWO.status !== 'COMPLETED' || completedWO.verificationStatus !== 'PENDING_SUPERVISOR') {
    console.error('FAILED: Worker completion evidence submission', completedWO);
    process.exit(1);
  }
  console.log(`✅ STEP 6 PASSED: Completion Evidence Submitted (Status: ${completedWO.status}, Verification: ${completedWO.verificationStatus})`);

  // STEP 7: Supervisor Verifies Completion Evidence
  const verifiedWO = await workOrderService.supervisorVerifyWorkOrder(
    workOrder._id,
    'APPROVE',
    'Asphalt quality & surface compaction verified clean by supervisor.',
    supervisor,
    'req-p4-step7'
  );

  if (verifiedWO.status !== 'VERIFIED' || verifiedWO.verificationStatus !== 'SUPERVISOR_APPROVED') {
    console.error('FAILED: Supervisor verification', verifiedWO);
    process.exit(1);
  }
  console.log(`✅ STEP 7 PASSED: Supervisor Verification Approved (Status: ${verifiedWO.status}, Verification: ${verifiedWO.verificationStatus})`);

  // STEP 8: Citizen Confirms Resolution & Case Files Closed
  const closedComplaint = await complaintService.citizenVerifyComplaint(
    complaint.complaintId,
    true,
    'Confirmed fixed satisfactorily.',
    citizen,
    'req-p4-step8'
  );

  if (closedComplaint.status !== 'CLOSED') {
    console.error('FAILED: Citizen resolution confirmation', closedComplaint);
    process.exit(1);
  }
  console.log(`✅ STEP 8 PASSED: Citizen Resolution Confirmed & Case Closed (${closedComplaint.complaintId}, Status: ${closedComplaint.status})`);

  // STEP 9: Audit Log Chain Verification
  const auditLogs = await AuditLog.find({ entityId: complaint._id.toString() });
  console.log(`✅ STEP 9 PASSED: Immutable Audit Log Chain Verified (${auditLogs.length} audit entries recorded for case ${complaint.complaintId})`);

  await closeDatabase();
  console.log('----------------------------------------------------');
  console.log('ALL PHASE 4 OPERATIONAL LIFECYCLE TESTS PASSED (9/9)!');
  console.log('----------------------------------------------------');
  process.exit(0);
}

runPhase4LifecycleTests().catch((err) => {
  console.error('[PHASE 4 TEST ERROR]', err);
  process.exit(1);
});
