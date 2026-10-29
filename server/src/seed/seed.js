/**
 * NAGARSETU AI - COMPREHENSIVE IDEMPOTENT MULTI-CITY SEED SCRIPT
 * 
 * Seeds 5 synthetic municipalities, administrative units, wards, departments, 
 * SLA configs, complaint categories, 11 demo users (@nagarsetu.demo with password Demo@1234),
 * WorkOrders, Escalations, Notifications, SLAEvents, and 40+ synthetic complaints.
 */

import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';
import User from '../models/User.js';
import Municipality from '../models/Municipality.js';
import AdministrativeUnit from '../models/AdministrativeUnit.js';
import Ward from '../models/Ward.js';
import Department from '../models/Department.js';
import ComplaintCategory from '../models/ComplaintCategory.js';
import SLAConfig from '../models/SLAConfig.js';
import Complaint from '../models/Complaint.js';
import WorkOrder from '../models/WorkOrder.js';
import Escalation from '../models/Escalation.js';
import Notification from '../models/Notification.js';
import SLAEvent from '../models/SLAEvent.js';
import Counter from '../models/Counter.js';
import AuditLog from '../models/AuditLog.js';

export async function runSeed() {
  console.log('[SEED] Connecting to MongoDB...');
  await mongoose.connect(env.MONGODB_URI);
  console.log('[SEED] Connected to MongoDB.');

  console.log('[SEED] Cleaning existing synthetic collection data...');
  await Promise.all([
    User.deleteMany({}),
    Municipality.deleteMany({}),
    AdministrativeUnit.deleteMany({}),
    Ward.deleteMany({}),
    Department.deleteMany({}),
    ComplaintCategory.deleteMany({}),
    SLAConfig.deleteMany({}),
    Complaint.deleteMany({}),
    WorkOrder.deleteMany({}),
    Escalation.deleteMany({}),
    Notification.deleteMany({}),
    SLAEvent.deleteMany({}),
    Counter.deleteMany({}),
    AuditLog.deleteMany({}),
  ]);

  console.log('[SEED] Seeding Municipalities...');
  const municipalities = await Municipality.create([
    {
      name: 'Ichalkaranji Municipal Corporation',
      code: 'IMC',
      state: 'Maharashtra',
      country: 'India',
      centerCoordinates: [16.6992, 74.4578],
      zoomLevel: 13,
      adminStructureType: 'PRABHAG_WARD_HIERARCHY',
      tagline: 'Textile City Civic Command & Operations Hub',
      officeAddress: 'Station Road, beside Guru Talkies, Vikas Nagar, Ichalkaranji, Maharashtra – 416115',
      totalAreaSqKm: 49.84,
      totalWardsCount: 65,
      totalPrabhagsCount: 16,
      isDemo: false,
    },
    {
      name: 'Kolhapur Municipal Demo',
      code: 'KMC-DEMO',
      state: 'Maharashtra',
      country: 'India',
      centerCoordinates: [16.7050, 74.2433],
      zoomLevel: 13,
      adminStructureType: 'DIV_WARD_HIERARCHY',
      tagline: 'Heritage & Smart Governance Directorate',
      isDemo: true,
    },
    {
      name: 'Pune Municipal Demo',
      code: 'PMC-DEMO',
      state: 'Maharashtra',
      country: 'India',
      centerCoordinates: [18.5204, 73.8567],
      zoomLevel: 12,
      adminStructureType: 'ZONE_WARD_HIERARCHY',
      tagline: 'Smart Governance & Urban Infrastructure Cell',
      isDemo: true,
    },
    {
      name: 'Nashik Municipal Demo',
      code: 'NMC-DEMO',
      state: 'Maharashtra',
      country: 'India',
      centerCoordinates: [19.9975, 73.7898],
      zoomLevel: 12,
      adminStructureType: 'ZONE_WARD_HIERARCHY',
      tagline: 'Civic Technology & Urban Operations',
      isDemo: true,
    },
    {
      name: 'Nagpur Municipal Demo',
      code: 'NMC-NGP-DEMO',
      state: 'Maharashtra',
      country: 'India',
      centerCoordinates: [21.1458, 79.0882],
      zoomLevel: 12,
      adminStructureType: 'ZONE_WARD_HIERARCHY',
      tagline: 'Orange City Smart Operations Center',
      isDemo: true,
    },
  ]);

  const imc = municipalities[0];
  const kmc = municipalities[1];
  const pmc = municipalities[2];
  const nmc = municipalities[3];
  const nmcNgp = municipalities[4];

  console.log('[SEED] Seeding Administrative Units & Wards for Ichalkaranji...');
  const zoneCentral = await AdministrativeUnit.create({
    municipalityId: imc._id,
    name: 'Central Commercial Zone',
    code: 'ZONE-CENTRAL',
    type: 'ZONE',
  });

  const zoneIndustrial = await AdministrativeUnit.create({
    municipalityId: imc._id,
    name: 'Powerloom Industrial Zone',
    code: 'ZONE-INDUSTRIAL',
    type: 'ZONE',
  });

  const ward12 = await Ward.create({
    municipalityId: imc._id,
    administrativeUnitId: zoneCentral._id,
    name: 'Prabhag 1: Rajwada & Kapad Market',
    number: 1,
    code: 'PRABHAG-01',
    centerCoordinates: [16.6985, 74.4620],
    population: 28500,
  });

  const ward18 = await Ward.create({
    municipalityId: imc._id,
    administrativeUnitId: zoneCentral._id,
    name: 'Prabhag 2: Janata Chowk & D.K.T.E. Campus',
    number: 2,
    code: 'PRABHAG-02',
    centerCoordinates: [16.7020, 74.4650],
    population: 31000,
  });

  const ward24 = await Ward.create({
    municipalityId: imc._id,
    administrativeUnitId: zoneCentral._id,
    name: 'Prabhag 4: Station Road & Vikas Nagar (HQ)',
    number: 4,
    code: 'PRABHAG-04',
    centerCoordinates: [16.6992, 74.4578],
    population: 26000,
  });

  const ward31 = await Ward.create({
    municipalityId: imc._id,
    administrativeUnitId: zoneIndustrial._id,
    name: 'Prabhag 5: Powerloom Weaving Estate',
    number: 5,
    code: 'PRABHAG-05',
    centerCoordinates: [16.7110, 74.4710],
    population: 33000,
  });

  console.log('[SEED] Seeding Departments for Ichalkaranji...');
  const deptRoad = await Department.create({
    municipalityId: imc._id,
    name: 'Road Maintenance & Infrastructure',
    code: 'ROAD',
    description: 'Pothole repairs, asphalt surfacing, footpaths and storm drainage',
    headName: 'City Engineer (Civil)',
  });

  const deptWater = await Department.create({
    municipalityId: imc._id,
    name: 'Water Supply & Panchganga Pipeline',
    code: 'WATER',
    description: 'Panchganga river intake well, pipeline bursts, water supply lines',
    headName: 'Executive Engineer (Water Works)',
  });

  const deptElec = await Department.create({
    municipalityId: imc._id,
    name: 'Electrical & Streetlighting',
    code: 'ELEC',
    description: 'Streetlight outages, exposed cabling and electrical hazards',
    headName: 'Assistant Engineer (Electrical)',
  });

  const deptWaste = await Department.create({
    municipalityId: imc._id,
    name: 'Solid Waste Management & Sanitation',
    code: 'WASTE',
    description: 'Garbage accumulation, bin overflows and public hygiene',
    headName: 'Chief Sanitary Inspector',
  });

  console.log('[SEED] Seeding Complaint Categories & SLA Configs...');
  const categoryData = [
    { name: 'Water Supply Contamination / Pipeline Burst', group: 'WATER', defaultSlaHours: 6, priority: 'P1', dept: deptWater._id },
    { name: 'Road Damage / Pothole Cavity', group: 'INFRASTRUCTURE', defaultSlaHours: 24, priority: 'P2', dept: deptRoad._id },
    { name: 'Fallen Tree / Dangerous Branch', group: 'SAFETY', defaultSlaHours: 12, priority: 'P2', dept: deptRoad._id },
    { name: 'Garbage Accumulation', group: 'SANITATION', defaultSlaHours: 24, priority: 'P3', dept: deptWaste._id },
    { name: 'Streetlight Outage', group: 'ELECTRICAL', defaultSlaHours: 24, priority: 'P2', dept: deptElec._id },
  ];

  for (const cat of categoryData) {
    const createdCat = await ComplaintCategory.create({
      municipalityId: imc._id,
      name: cat.name,
      group: cat.group,
      defaultDepartmentId: cat.dept,
      defaultSlaHours: cat.defaultSlaHours,
      priority: cat.priority,
    });

    await SLAConfig.create({
      municipalityId: imc._id,
      categoryId: createdCat._id,
      priority: cat.priority,
      slaHours: cat.defaultSlaHours,
      escalationEnabled: true,
      escalationHours: 4,
    });
  }

  console.log('[SEED] Seeding 11 Synthetic Demo Users (@nagarsetu.demo)...');
  const commonPassword = await User.hashPassword('Demo@1234');

  const demoAccounts = [
    { name: 'Rohan Deshmukh (Controller)', email: 'controller@nagarsetu.demo', role: 'NAGARSETU_CONTROLLER', muni: imc._id },
    { name: 'Ananya Sharma (Citizen)', email: 'citizen@nagarsetu.demo', role: 'CITIZEN', muni: imc._id, ward: ward12._id },
    { name: 'Vikramaditya Mane (Ward Member)', email: 'wardmember@nagarsetu.demo', role: 'WARD_MEMBER', muni: imc._id, ward: ward12._id },
    { name: 'Pravin Jadhav (Ward Officer)', email: 'wardofficer@nagarsetu.demo', role: 'WARD_OFFICER', muni: imc._id, ward: ward12._id },
    { name: 'Er. Rajesh Kulkarni (Dept Officer)', email: 'department@nagarsetu.demo', role: 'DEPARTMENT_OFFICER', muni: imc._id, dept: deptRoad._id },
    { name: 'Sunil Shinde (Supervisor)', email: 'supervisor@nagarsetu.demo', role: 'DEPARTMENT_SUPERVISOR', muni: imc._id, dept: deptRoad._id },
    { name: 'Amit Jadhav (Worker)', email: 'worker@nagarsetu.demo', role: 'MUNICIPAL_WORKER', muni: imc._id, dept: deptRoad._id },
    { name: 'Dr. Abhijit More IAS (Senior)', email: 'senior@nagarsetu.demo', role: 'SENIOR_AUTHORITY', muni: imc._id },
    { name: 'Mahesh Thorat (City Admin)', email: 'cityadmin@nagarsetu.demo', role: 'CITY_ADMIN', muni: imc._id },
    { name: 'System Root (Super Admin)', email: 'superadmin@nagarsetu.demo', role: 'SUPER_ADMIN', muni: imc._id },
    { name: 'Inspector R. V. Kadam (Police)', email: 'police@nagarsetu.demo', role: 'POLICE_EMERGENCY_USER', muni: imc._id },
  ];

  const createdUsers = {};
  for (const u of demoAccounts) {
    const created = await User.create({
      name: u.name,
      email: u.email,
      passwordHash: commonPassword,
      role: u.role,
      municipalityId: u.muni,
      wardId: u.ward || null,
      departmentId: u.dept || null,
    });
    createdUsers[u.role] = created;
  }

  ward12.officerUserId = createdUsers['WARD_OFFICER']._id;
  await ward12.save();

  console.log('[SEED] Seeding 40 Synthetic Complaints & WorkOrders...');

  const complaintTemplates = [
    { title: 'Panchganga Pipeline Burst & Pressure Drop near Intake Well', cat: 'Water Supply', prio: 'P1', sev: 'CRITICAL', ward: ward12, dept: deptWater, status: 'SUBMITTED', hours: 4 },
    { title: 'Deep Asphalt Pothole Cavity on Janata Chowk Main Road', cat: 'Road Damage', prio: 'P2', sev: 'HIGH', ward: ward18, dept: deptRoad, status: 'IN_PROGRESS', hours: 24 },
    { title: 'Fallen Tree Branch Blocking Corridor near Station Road HQ', cat: 'Tree Hazard', prio: 'P2', sev: 'HIGH', ward: ward24, dept: deptRoad, status: 'ASSIGNED', hours: 12 },
    { title: 'Powerloom Cluster Industrial Waste Pileup in Weaving Estate', cat: 'Garbage Accumulation', prio: 'P3', sev: 'MEDIUM', ward: ward31, dept: deptWaste, status: 'AWAITING_VERIFICATION', hours: 24 },
    { title: 'Streetlight Cable Fault along Rajwada & Kapad Market Corridor', cat: 'Streetlight', prio: 'P2', sev: 'HIGH', ward: ward12, dept: deptElec, status: 'AWAITING_CITIZEN_VERIFICATION', hours: 24 },
    { title: 'Open Stormwater Drainage Overflow near Shahapur Road', cat: 'Water Supply', prio: 'P1', sev: 'CRITICAL', ward: ward12, dept: deptWater, status: 'ESCALATED', hours: 6 },
    { title: 'Broken Footpath Paver Blocks near IGM Hospital Precinct', cat: 'Road Damage', prio: 'P3', sev: 'MEDIUM', ward: ward18, dept: deptRoad, status: 'IN_PROGRESS', hours: 48 },
    { title: 'Solid Waste Heap near Kabnur Link & Korochi Naka', cat: 'Garbage Accumulation', prio: 'P3', sev: 'MEDIUM', ward: ward24, dept: deptWaste, status: 'REOPENED', hours: 24 },
  ];

  let woCounter = 1;
  let escCounter = 1;

  for (let i = 1; i <= 40; i++) {
    const tmpl = complaintTemplates[(i - 1) % complaintTemplates.length];
    const seqStr = String(i).padStart(6, '0');
    const complaintId = `NGS-2026-${seqStr}`;

    const deadline = new Date();
    deadline.setHours(deadline.getHours() + tmpl.hours);

    const createdComplaint = await Complaint.create({
      complaintId,
      citizenId: createdUsers['CITIZEN']._id,
      municipalityId: imc._id,
      administrativeUnitId: zoneCentral._id,
      wardId: tmpl.ward._id,
      departmentId: tmpl.dept._id,
      title: `${tmpl.title} #${i}`,
      description: `Synthetic grievance report #${i} submitted for municipal verification. High traffic area requiring inspection.`,
      category: tmpl.cat,
      location: {
        type: 'Point',
        coordinates: [tmpl.ward.centerCoordinates[1] + (i * 0.0002), tmpl.ward.centerCoordinates[0] + (i * 0.0002)],
        address: `${tmpl.ward.name}, Sector ${i}`,
        area: tmpl.ward.name,
      },
      priority: tmpl.prio,
      severity: tmpl.sev,
      status: tmpl.status,
      assignedToUserId: createdUsers['MUNICIPAL_WORKER']._id,
      assignedByUserId: createdUsers['DEPARTMENT_SUPERVISOR']._id,
      statusHistory: [
        {
          status: 'SUBMITTED',
          changedBy: createdUsers['CITIZEN']._id,
          timestamp: new Date(Date.now() - 3600000 * 5),
          note: 'Initial citizen report submitted via NagarSetu mobile portal.',
        },
        {
          status: tmpl.status,
          changedBy: createdUsers['NAGARSETU_CONTROLLER']._id,
          timestamp: new Date(),
          note: `Complaint status set to ${tmpl.status}.`,
        },
      ],
      aiAnalysis: {
        classification: tmpl.cat,
        confidence: 94 + (i % 5),
        severity: tmpl.sev,
        priority: tmpl.prio,
        reasons: ['Semantic pattern match', 'Visual evidence confirmed'],
        recommendedWard: tmpl.ward.name,
        recommendedDepartment: tmpl.dept.name,
        recommendedSupervisor: 'Sunil Shinde',
        recommendedWorker: 'Amit Jadhav',
        disclaimer: 'AI-generated recommendation. Final action remains with authorized personnel.',
      },
      sla: {
        targetHours: tmpl.hours,
        deadline,
        state: i % 5 === 0 ? 'AT_RISK' : i % 7 === 0 ? 'BREACHED' : 'ON_TRACK',
      },
      isDemoRecord: true,
    });

    // Create WorkOrders for in-progress / verification complaints
    if (['IN_PROGRESS', 'AWAITING_VERIFICATION', 'AWAITING_CITIZEN_VERIFICATION', 'ASSIGNED'].includes(tmpl.status)) {
      const woSeqStr = String(woCounter++).padStart(6, '0');
      const workOrderId = `WO-2026-${woSeqStr}`;
      const wo = await WorkOrder.create({
        workOrderId,
        complaintId: createdComplaint._id,
        municipalityId: imc._id,
        wardId: tmpl.ward._id,
        departmentId: tmpl.dept._id,
        supervisorId: createdUsers['DEPARTMENT_SUPERVISOR']._id,
        assignedWorkerId: createdUsers['MUNICIPAL_WORKER']._id,
        assignedTeam: 'Road Maintenance Response Team B',
        title: `Work Order for ${createdComplaint.complaintId}`,
        instructions: 'Clear site obstacle, fill pothole cavity with hot-mix asphalt, and submit before/after evidence photos.',
        priority: tmpl.prio,
        status: tmpl.status === 'AWAITING_VERIFICATION' ? 'COMPLETED' : tmpl.status === 'IN_PROGRESS' ? 'IN_PROGRESS' : 'ASSIGNED',
        dueAt: deadline,
        verificationStatus: tmpl.status === 'AWAITING_VERIFICATION' ? 'PENDING_SUPERVISOR' : 'NONE',
        completionNotes: tmpl.status === 'AWAITING_VERIFICATION' ? 'Pothole cavity filled, surface leveled, and compaction verified.' : '',
        completionEvidence: tmpl.status === 'AWAITING_VERIFICATION' ? {
          beforeImages: ['/demo/evidence_before.jpg'],
          afterImages: ['/demo/evidence_after.jpg'],
          notes: 'Pothole filled and road surface restored.',
          gpsVerified: true,
          completedAt: new Date(),
        } : {},
      });

      createdComplaint.workOrderId = wo._id;
      await createdComplaint.save();
    }

    // Create Escalations for ESCALATED complaints
    if (tmpl.status === 'ESCALATED' || i % 7 === 0) {
      const escSeqStr = String(escCounter++).padStart(6, '0');
      await Escalation.create({
        escalationId: `ESC-2026-${escSeqStr}`,
        complaintId: createdComplaint._id,
        municipalityId: imc._id,
        wardId: tmpl.ward._id,
        departmentId: tmpl.dept._id,
        level: 2,
        reason: 'SLA threshold breached without resolution by designated field unit.',
        trigger: 'SLA_BREACH',
        status: 'ACTIVE',
        escalatedFrom: createdUsers['DEPARTMENT_SUPERVISOR']._id,
        escalatedTo: createdUsers['NAGARSETU_CONTROLLER']._id,
      });

      await SLAEvent.create({
        complaintId: createdComplaint._id,
        municipalityId: imc._id,
        event: 'SLA_BREACH',
        targetHours: tmpl.hours,
        elapsedMinutes: tmpl.hours * 60 + 120,
        remainingMinutes: 0,
        status: 'BREACHED',
        notes: 'SLA deadline exceeded by 2 hours.',
      });
    }

    await AuditLog.create({
      actorId: createdUsers['CITIZEN']._id,
      actorRole: 'CITIZEN',
      municipalityId: imc._id,
      action: 'COMPLAINT_CREATED',
      entityType: 'Complaint',
      entityId: createdComplaint._id.toString(),
      metadata: { complaintId },
      timestamp: new Date(),
    });
  }

  // Seed City-Specific Wards, Complaints, & WorkOrders for Nashik, Nagpur, Kolhapur, and Ichalkaranji
  console.log('[SEED] Seeding distinct city-specific complaints & work orders for NMC, NMC-NGP, KMC, and IMC...');

  const otherCityConfigs = [
    {
      muni: nmc,
      codePrefix: 'NMC',
      zoneName: 'Panchavati Zone',
      zoneCode: 'NZ1',
      wards: [
        { name: 'Ward 8 (Panchavati Temple Sector)', number: 8, code: 'W08', coords: [19.9975, 73.7898] },
        { name: 'Ward 19 (CIDCO Sector 4)', number: 19, code: 'W19', coords: [19.9825, 73.7650] },
        { name: 'Ward 27 (Satpur MIDC Sector)', number: 27, code: 'W27', coords: [19.9700, 73.7350] },
      ],
      orders: [
        {
          woId: 'WO-NMC-2026-000031',
          compSeq: '000084',
          title: 'Bitumen Pothole Restoration along Gangapur Road',
          area: 'Gangapur Road, Near KBT Circle & Horizon Academy Link',
          wardIdx: 0,
          cat: 'Road Damage / Pothole Cavity',
          prio: 'P2',
          status: 'IN_PROGRESS',
          worker: 'Kiran Khairnar',
          supervisor: 'Er. Sachin Bhamre',
          team: 'NMC West Zone Asphalt Squad',
        },
        {
          woId: 'WO-NMC-2026-000030',
          compSeq: '000082',
          title: 'Godavari Ghat Embankment Desilting & Silt Clearance',
          area: 'Panchavati Temple Sector, Near Ramkund & Laxman Kund Ghat',
          wardIdx: 0,
          cat: 'Water Supply Contamination / Pipeline Burst',
          prio: 'P1',
          status: 'WORK_COMPLETED',
          worker: 'Dinesh Sonawane',
          supervisor: 'Er. Deepak Ahire',
          team: 'NMC Riverfront Conservation Crew',
        },
        {
          woId: 'WO-NMC-2026-000029',
          compSeq: '000079',
          title: 'Underground Feeder Cable Repair & High-Mast Lighting',
          area: 'CIDCO Sector 4, Near Pawan Nagar Stadium & Market Chowk',
          wardIdx: 1,
          cat: 'Streetlight Outage',
          prio: 'P3',
          status: 'AWAITING_VERIFICATION',
          worker: 'Nitin Bhamre',
          supervisor: 'Pooja Wagh',
          team: 'NMC CIDCO Power Maintenance Unit',
        },
        {
          woId: 'WO-NMC-2026-000028',
          compSeq: '000076',
          title: 'Industrial Storm Drainage Unblocking & Desludging',
          area: 'Satpur MIDC Residential, Near Trimbak Road Naka Link',
          wardIdx: 2,
          cat: 'Road Damage / Pothole Cavity',
          prio: 'P2',
          status: 'IN_PROGRESS',
          worker: 'Prakash Wagh',
          supervisor: 'Er. Sachin Bhamre',
          team: 'NMC Satpur Drainage Fleet',
        },
      ],
    },
    {
      muni: nmcNgp,
      codePrefix: 'NGP',
      zoneName: 'Dharampeth Zone',
      zoneCode: 'NGP-Z1',
      wards: [
        { name: 'Ward 14 (Dharampeth West)', number: 14, code: 'W14', coords: [21.1458, 79.0682] },
        { name: 'Ward 22 (Medical Square Sector)', number: 22, code: 'W22', coords: [21.1350, 79.0982] },
        { name: 'Ward 11 (Civil Lines Sector)', number: 11, code: 'W11', coords: [21.1550, 79.0750] },
      ],
      orders: [
        {
          woId: 'WO-NGP-2026-000051',
          compSeq: '000112',
          title: 'Metro Corridor Footpath & Kerb Stone Restoration',
          area: 'Sitabuldi Central Interchange, Near Variety Chowk & Metro Pillar 42',
          wardIdx: 0,
          cat: 'Road Damage / Pothole Cavity',
          prio: 'P2',
          status: 'IN_PROGRESS',
          worker: 'Rajesh Meshram',
          supervisor: 'Er. Harish Barve',
          team: 'NMC Orange Corridor Civil Crew',
        },
        {
          woId: 'WO-NGP-2026-000050',
          compSeq: '000109',
          title: 'Hospital Zone Sewerage Line Clearance & Disinfection',
          area: 'Medical Square Sector, Opposite GMC Hospital Emergency Gate',
          wardIdx: 1,
          cat: 'Water Supply Contamination / Pipeline Burst',
          prio: 'P1',
          status: 'WORK_COMPLETED',
          worker: 'Chandrashekhar Tembhekar',
          supervisor: 'Dr. Parag Tembhekar',
          team: 'NMC Emergency Sanitation Squad',
        },
        {
          woId: 'WO-NGP-2026-000049',
          compSeq: '000105',
          title: 'Traffic Junction High-Mast Illuminator Overhaul',
          area: 'Dharampeth West, Near Traffic Park & Law College Square',
          wardIdx: 0,
          cat: 'Streetlight Outage',
          prio: 'P3',
          status: 'AWAITING_VERIFICATION',
          worker: 'Manoj Muley',
          supervisor: 'Aakash Muley',
          team: 'NMC Zone 1 Lighting Unit',
        },
        {
          woId: 'WO-NGP-2026-000048',
          compSeq: '000102',
          title: 'Hazardous Tree Branch Pruning near Overhead Cables',
          area: 'Civil Lines Heritage Zone, Near High Court Road & VCA Ground',
          wardIdx: 2,
          cat: 'Fallen Tree / Dangerous Branch',
          prio: 'P2',
          status: 'IN_PROGRESS',
          worker: 'Sandeep Raut',
          supervisor: 'Vandana Meshram',
          team: 'NMC Arborist & Safety Unit',
        },
      ],
    },
    {
      muni: kmc,
      codePrefix: 'KMC',
      zoneName: 'Division B (Rajarampuri)',
      zoneCode: 'DIV-B',
      wards: [
        { name: 'Ward 9 (Rankala Lake Precinct)', number: 9, code: 'W09', coords: [16.7050, 74.2233] },
        { name: 'Ward 4 (Rajarampuri Main)', number: 4, code: 'W04', coords: [16.6950, 74.2480] },
        { name: 'Ward 15 (Tarabai Park Area)', number: 15, code: 'W15', coords: [16.7150, 74.2380] },
      ],
      orders: [
        {
          woId: 'WO-KMC-2026-000025',
          compSeq: '000065',
          title: 'Basalt Paver Restoration around Rankala Lake Promenade',
          area: 'Rankala Lake Precinct, Near Sandhya Math & Chaupati Chowk',
          wardIdx: 0,
          cat: 'Road Damage / Pothole Cavity',
          prio: 'P2',
          status: 'IN_PROGRESS',
          worker: 'Anand Jadhav',
          supervisor: 'Er. Sandeep Patil',
          team: 'KMC Heritage Infrastructure Team',
        },
        {
          woId: 'WO-KMC-2026-000024',
          compSeq: '000062',
          title: 'Drinking Water Pipeline Sluice Valve Replacement',
          area: 'Rajarampuri Main, 5th Lane Commercial Junction',
          wardIdx: 1,
          cat: 'Water Supply Contamination / Pipeline Burst',
          prio: 'P1',
          status: 'WORK_COMPLETED',
          worker: 'Ravindra More',
          supervisor: 'Prashant Mane',
          team: 'KMC Water Division B',
        },
        {
          woId: 'WO-KMC-2026-000023',
          compSeq: '000059',
          title: 'Heritage Streetlight Fixture & Wiring Restoration',
          area: 'Tarabai Park Area, Circuit House Road Corridor',
          wardIdx: 2,
          cat: 'Streetlight Outage',
          prio: 'P3',
          status: 'AWAITING_VERIFICATION',
          worker: 'Mahesh Patil',
          supervisor: 'Kavita Chavan',
          team: 'KMC Electrical Division A',
        },
        {
          woId: 'WO-KMC-2026-000022',
          compSeq: '000055',
          title: 'Community Waste Bin Overhaul & Sanitization Drive',
          area: 'Bindu Chowk & Bhavani Mandap Heritage Precinct',
          wardIdx: 0,
          cat: 'Garbage Accumulation',
          prio: 'P2',
          status: 'IN_PROGRESS',
          worker: 'Nitin Kamble',
          supervisor: 'Dr. Nitin Kamble',
          team: 'KMC Rapid Cleanliness Fleet',
        },
      ],
    },
    {
      muni: imc,
      codePrefix: 'IMC',
      zoneName: 'Industrial Sector',
      zoneCode: 'IMC-Z1',
      wards: [
        { name: 'Ward 3 (Powerloom Estate)', number: 3, code: 'W03', coords: [16.6917, 74.4704] },
        { name: 'Ward 17 (Panchaganga Riverbank)', number: 17, code: 'W17', coords: [16.6850, 74.4504] },
        { name: 'Ward 11 (Shahupuri Sector 11)', number: 11, code: 'W11', coords: [16.7000, 74.4604] },
      ],
      orders: [
        {
          woId: 'WO-IMC-2026-000015',
          compSeq: '000045',
          title: 'Powerloom Cluster Drainage Desilting & Silt Removal',
          area: 'Powerloom Estate Ward 3, Industrial Estate Ring Road Link',
          wardIdx: 0,
          cat: 'Road Damage / Pothole Cavity',
          prio: 'P1',
          status: 'IN_PROGRESS',
          worker: 'Ganesh Naik',
          supervisor: 'Er. Prakash Kamble',
          team: 'IMC Textile Zone Civil Squad',
        },
        {
          woId: 'WO-IMC-2026-000014',
          compSeq: '000042',
          title: 'Panchaganga Intake Well Pumping Line Weld Repair',
          area: 'Panchaganga Riverbank Ward 17, Municipal Pumping Station',
          wardIdx: 1,
          cat: 'Water Supply Contamination / Pipeline Burst',
          prio: 'P1',
          status: 'WORK_COMPLETED',
          worker: 'Rohan Kurane',
          supervisor: 'Er. Swati Gurav',
          team: 'IMC River Intake Maintenance Team',
        },
        {
          woId: 'WO-IMC-2026-000013',
          compSeq: '000038',
          title: 'Textile Market Commercial Streetlight Feeder Repair',
          area: 'Shahupuri Sector 11, Near Rajwada Cloth Market Chowk',
          wardIdx: 2,
          cat: 'Streetlight Outage',
          prio: 'P3',
          status: 'AWAITING_VERIFICATION',
          worker: 'Vijay Powar',
          supervisor: 'Lata Kulkarni',
          team: 'IMC Market Sector Electricals',
        },
        {
          woId: 'WO-IMC-2026-000012',
          compSeq: '000035',
          title: 'Industrial Fiber Waste Clearance & Open Drain Scraping',
          area: 'Kabnur Road Link, Ward 7 Industrial Corridor',
          wardIdx: 0,
          cat: 'Garbage Accumulation',
          prio: 'P2',
          status: 'IN_PROGRESS',
          worker: 'Mohan Powar',
          supervisor: 'Dr. Mohan Powar',
          team: 'IMC Heavy Sanitation Crew',
        },
      ],
    },
  ];

  for (const cfg of otherCityConfigs) {
    const adminUnit = await AdministrativeUnit.create({
      municipalityId: cfg.muni._id,
      name: cfg.zoneName,
      code: cfg.zoneCode,
      type: 'ZONE',
    });

    const createdWards = [];
    for (const w of cfg.wards) {
      const wardDoc = await Ward.create({
        municipalityId: cfg.muni._id,
        administrativeUnitId: adminUnit._id,
        name: w.name,
        number: w.number,
        code: w.code,
        centerCoordinates: w.coords,
        population: 40000,
      });
      createdWards.push(wardDoc);
    }

    let cityRoadDept = await Department.findOne({ municipalityId: cfg.muni._id, code: 'ROAD' });
    if (!cityRoadDept) {
      cityRoadDept = await Department.create({
        municipalityId: cfg.muni._id,
        name: 'Road Maintenance & Infrastructure',
        code: 'ROAD',
        headName: 'Chief Municipal Engineer',
      });
    }

    for (const ord of cfg.orders) {
      const targetWard = createdWards[ord.wardIdx] || createdWards[0];
      const complaintId = `NGS-${cfg.codePrefix}-2026-${ord.compSeq}`;
      
      const comp = await Complaint.create({
        complaintId,
        citizenId: createdUsers['CITIZEN']._id,
        municipalityId: cfg.muni._id,
        administrativeUnitId: adminUnit._id,
        wardId: targetWard._id,
        departmentId: cityRoadDept._id,
        title: ord.title,
        description: `Field inspection request for ${ord.area}.`,
        category: ord.cat,
        location: {
          type: 'Point',
          coordinates: [targetWard.centerCoordinates[1], targetWard.centerCoordinates[0]],
          address: ord.area,
          area: ord.area,
        },
        priority: ord.prio,
        severity: ord.prio === 'P1' ? 'CRITICAL' : 'HIGH',
        status: ord.status === 'WORK_COMPLETED' ? 'RESOLVED' : ord.status === 'AWAITING_VERIFICATION' ? 'AWAITING_VERIFICATION' : 'IN_PROGRESS',
        isDemoRecord: true,
      });

      const wo = await WorkOrder.create({
        workOrderId: ord.woId,
        complaintId: comp._id,
        municipalityId: cfg.muni._id,
        wardId: targetWard._id,
        departmentId: cityRoadDept._id,
        supervisorId: createdUsers['DEPARTMENT_SUPERVISOR']._id,
        assignedWorkerId: createdUsers['MUNICIPAL_WORKER']._id,
        assignedTeam: ord.team,
        title: ord.title,
        instructions: `Proceed to ${ord.area}, inspect damages, and carry out resolution according to municipal standards.`,
        priority: ord.prio,
        status: ord.status === 'WORK_COMPLETED' ? 'COMPLETED' : ord.status === 'AWAITING_VERIFICATION' ? 'COMPLETED' : 'IN_PROGRESS',
        verificationStatus: ord.status === 'AWAITING_VERIFICATION' ? 'PENDING_SUPERVISOR' : 'NONE',
        dueAt: new Date(Date.now() + 4 * 3600000),
      });

      comp.workOrderId = wo._id;
      await comp.save();
      woCounter++;
    }
  }

  // Create notifications for controller & worker
  await Notification.create([
    {
      userId: createdUsers['NAGARSETU_CONTROLLER']._id,
      municipalityId: pmc._id,
      type: 'SLA_BREACH',
      title: 'Critical SLA Breach Alert: NGS-2026-000006',
      message: 'Complaint NGS-2026-000006 in Ward 12 has breached SLA threshold.',
      data: { complaintId: 'NGS-2026-000006' },
    },
    {
      userId: createdUsers['NAGARSETU_CONTROLLER']._id,
      municipalityId: pmc._id,
      type: 'ESCALATION',
      title: 'New Level 2 Escalation: NGS-2026-000006',
      message: 'Escalation ESC-2026-000001 requires Controller intervention.',
      data: { escalationId: 'ESC-2026-000001' },
    },
    {
      userId: createdUsers['MUNICIPAL_WORKER']._id,
      municipalityId: pmc._id,
      type: 'NEW_WORK_ORDER',
      title: 'Assigned Work Order: WO-2026-000001',
      message: 'You have been assigned Work Order WO-2026-000001 in Ward 18.',
      data: { workOrderId: 'WO-2026-000001' },
    },
  ]);

  // Update counters
  await Counter.create({ key: 'complaint', year: 2026, sequence: 40 });
  await Counter.create({ key: 'work_order', year: 2026, sequence: woCounter - 1 });
  await Counter.create({ key: 'escalation', year: 2026, sequence: escCounter - 1 });

  console.log('[SEED SUCCESS] Idempotent seeding complete!');
  console.log('----------------------------------------------------');
  console.log('SEED SUMMARY:');
  console.log(`- Municipalities: ${municipalities.length}`);
  console.log(`- Demo Users (@nagarsetu.demo): ${Object.keys(createdUsers).length}`);
  console.log(`- Synthetic Complaints (NGS-2026-000001..000040): 40`);
  console.log(`- Synthetic Work Orders: ${woCounter - 1}`);
  console.log(`- Synthetic Escalations: ${escCounter - 1}`);
  console.log('Common Demo Account Password: Demo@1234');
  console.log('----------------------------------------------------');
}

// Run standalone if executed directly
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url).toLowerCase() === path.resolve(process.argv[1]).toLowerCase();
if (isDirectRun || process.argv.includes('--run') || process.argv[1]?.includes('seed.js')) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[SEED ERROR]', err);
      process.exit(1);
    });
}
