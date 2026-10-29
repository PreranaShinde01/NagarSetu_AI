import mongoose from 'mongoose';
import { connectDatabase, closeDatabase } from '../config/database.js';
import User from '../models/User.js';
import Municipality from '../models/Municipality.js';
import Complaint from '../models/Complaint.js';
import * as aiChatService from '../services/aiChat.service.js';
import * as routingService from '../services/routing.service.js';
import * as analyticsService from '../services/analytics.service.js';

async function runPhase6AiTests() {
  console.log('--- NAGARSETU AI PHASE 6 AI INTELLIGENCE & PUBLIC SERVICES ACCEPTANCE TESTS ---');

  await connectDatabase();

  // Test 1: Civic Assistant Chatbot Service
  const chatResponse = await aiChatService.handleCivicChat('How do I report a pothole on FC Road?', null, {});
  if (!chatResponse || !chatResponse.reply || !chatResponse.suggestedActions) {
    console.error('FAILED: AI Chat service response invalid:', chatResponse);
    process.exit(1);
  }
  console.log(`✅ TEST 1 PASSED: AI Civic Chatbot Service Verified (Category: ${chatResponse.category}, Actions: ${chatResponse.suggestedActions.length})`);

  // Test 2: AI Routing & Triage Service
  const sampleComplaint = await Complaint.findOne({});
  if (!sampleComplaint) {
    console.error('FAILED: Sample complaint missing for AI routing test');
    process.exit(1);
  }

  const recommendation = await routingService.generateAiRoutingRecommendation(sampleComplaint);
  if (!recommendation || !recommendation.recommendedWardName || !recommendation.confidence) {
    console.error('FAILED: AI routing recommendation generation:', recommendation);
    process.exit(1);
  }
  console.log(`✅ TEST 2 PASSED: AI Triage & Routing Engine Verified (Confidence: ${recommendation.confidence}%, Priority: ${recommendation.priority})`);

  // Test 3: Municipal Analytics Suite Data for IMC Flagship
  const imc = await Municipality.findOne({ code: { $in: ['IMC', 'IMC-DEMO'] } });
  const overview = await analyticsService.getOverviewAnalytics(imc._id);
  const categories = await analyticsService.getCategoryDistribution(imc._id);
  if (!overview || typeof overview.totalComplaints !== 'number' || !categories) {
    console.error('FAILED: Analytics overview data fetch:', overview);
    process.exit(1);
  }
  console.log(`✅ TEST 3 PASSED: Data-Driven Analytics Suite Verified (Total: ${overview.totalComplaints}, Categories: ${categories.length})`);

  // Test 4: Public Governance Transparency Metrics (No Personal PII Exposed)
  const publicMetrics = await analyticsService.getPublicTransparencyMetrics();
  if (!publicMetrics || typeof publicMetrics.totalIssuesReported !== 'number' || publicMetrics.citizenName || publicMetrics.email) {
    console.error('FAILED: Public metrics data validation:', publicMetrics);
    process.exit(1);
  }
  console.log(`✅ TEST 4 PASSED: Public Transparency Gateway Verified (Total Reported: ${publicMetrics.totalIssuesReported}, Health Score: ${publicMetrics.cityHealthScore}/100, PII Filtered)`);

  await closeDatabase();
  console.log('----------------------------------------------------');
  console.log('ALL PHASE 6 AI & PUBLIC SERVICES ACCEPTANCE TESTS PASSED (4/4)!');
  console.log('----------------------------------------------------');
  process.exit(0);
}

runPhase6AiTests().catch((err) => {
  console.error('[PHASE 6 TEST ERROR]', err);
  process.exit(1);
});
