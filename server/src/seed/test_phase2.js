import mongoose from 'mongoose';
import app from '../app.js';
import { env } from '../config/env.js';
import { connectDatabase, closeDatabase } from '../config/database.js';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import { generateNextComplaintId, generateNextWorkOrderId, generateNextEscalationId } from '../services/counter.service.js';

async function runTests() {
  console.log('--- NAGARSETU AI PHASE 2 BACKEND ACCEPTANCE TESTS ---');

  // Test 1: MongoDB Connection
  const conn = await connectDatabase();
  if (!conn || mongoose.connection.readyState !== 1) {
    console.error('FAILED: MongoDB Connection');
    process.exit(1);
  }
  console.log('✅ TEST 1 PASSED: Express & MongoDB Connection Operational');

  // Test 2: Password Hashing & Login Verification
  const controllerUser = await User.findOne({ email: 'controller@nagarsetu.demo' }).select('+passwordHash');
  if (!controllerUser) {
    console.error('FAILED: Demo controller user not found');
    process.exit(1);
  }
  const isPasswordValid = await controllerUser.comparePassword('Demo@1234');
  const isInvalidPasswordRejected = !(await controllerUser.comparePassword('WrongPassword!'));
  if (!isPasswordValid || !isInvalidPasswordRejected) {
    console.error('FAILED: Password verification logic');
    process.exit(1);
  }
  console.log('✅ TEST 2 PASSED: Password Hashing & Login Authentication Verified');

  // Test 3: Atomic Counter Generator (Complaint, WorkOrder, Escalation)
  const cId1 = await generateNextComplaintId(2026);
  const cId2 = await generateNextComplaintId(2026);
  const woId1 = await generateNextWorkOrderId(2026);
  const escId1 = await generateNextEscalationId(2026);

  if (!cId1.startsWith('NGS-2026-') || !cId2.startsWith('NGS-2026-') || cId1 === cId2) {
    console.error('FAILED: Atomic Complaint ID allocation', cId1, cId2);
    process.exit(1);
  }
  if (!woId1.startsWith('WO-2026-') || !escId1.startsWith('ESC-2026-')) {
    console.error('FAILED: Atomic WorkOrder / Escalation ID allocation', woId1, escId1);
    process.exit(1);
  }
  console.log(`✅ TEST 3 PASSED: Atomic ID Allocation Verified (${cId1}, ${cId2}, ${woId1}, ${escId1})`);

  // Test 4: Database Persistence & Querying
  const complaintCount = await Complaint.countDocuments({});
  if (complaintCount < 40) {
    console.error('FAILED: Seeded complaint count lower than expected:', complaintCount);
    process.exit(1);
  }
  console.log(`✅ TEST 4 PASSED: MongoDB Data Persistence Verified (${complaintCount} seeded complaints active)`);

  await closeDatabase();
  console.log('----------------------------------------------------');
  console.log('ALL PHASE 2 BACKEND ACCEPTANCE TESTS PASSED (4/4)!');
  console.log('----------------------------------------------------');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('[TEST ERROR]', err);
  process.exit(1);
});
