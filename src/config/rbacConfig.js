/**
 * NAGARSETU AI - CONFIGURABLE ROLE BASED ACCESS CONTROL (RBAC)
 * 
 * Defines 11 granular municipal roles, permission flags, and escalation tiers.
 * Permissions are decoupled from UI components.
 */

export const ROLES = {
  CITIZEN: 'CITIZEN',
  NAGARSETU_CONTROLLER: 'NAGARSETU_CONTROLLER',
  WARD_MEMBER: 'WARD_MEMBER',
  WARD_OFFICER: 'WARD_OFFICER',
  DEPARTMENT_OFFICER: 'DEPARTMENT_OFFICER',
  DEPARTMENT_SUPERVISOR: 'DEPARTMENT_SUPERVISOR',
  MUNICIPAL_WORKER: 'MUNICIPAL_WORKER',
  SENIOR_AUTHORITY: 'SENIOR_AUTHORITY',
  CITY_ADMIN: 'CITY_ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  POLICE_EMERGENCY_USER: 'POLICE_EMERGENCY_USER',
};

export const ROLE_DEFINITIONS = [
  {
    role: ROLES.CITIZEN,
    label: 'Citizen User',
    description: 'Submits civic issues, tracks progress, verifies proof of work, and receives city alerts.',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    scope: 'PUBLIC_PORTAL',
    permissions: [
      'SUBMIT_COMPLAINT',
      'VIEW_OWN_COMPLAINTS',
      'VERIFY_WORK_COMPLETION',
      'REOPEN_UNSATISFACTORY_ISSUE',
      'VIEW_PUBLIC_MAP',
      'VIEW_TRANSPARENCY_METRICS',
    ]
  },
  {
    role: ROLES.NAGARSETU_CONTROLLER,
    label: 'NagarSetu Controller',
    description: 'Operational platform administrator monitoring AI triage queue, live city telemetry, SLA & cross-department routing.',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    scope: 'COMMAND_CENTER',
    permissions: [
      'VIEW_COMMAND_CENTER',
      'APPROVE_AI_ROUTING',
      'OVERRIDE_ROUTING',
      'MONITOR_SLAS',
      'MANAGE_INCIDENTS',
      'VIEW_ALL_WARDS',
      'VIEW_ALL_DEPARTMENTS',
      'TRIGGER_ESCALATIONS',
      'VIEW_ANOMALY_FLAGS',
      'ACCESS_FULL_GIS',
    ]
  },
  {
    role: ROLES.WARD_MEMBER,
    label: 'Ward Member (Public Representative)',
    description: 'Elected representative monitoring ward issues, citizen grievances, and oversight metrics.',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    scope: 'WARD_OVERSIGHT',
    permissions: [
      'VIEW_WARD_OVERSIGHT',
      'MONITOR_WARD_ISSUES',
      'SUBMIT_VIP_GRIEVANCE',
      'VIEW_WARD_METRICS',
      'TRACK_CONSTITUENT_SLAS',
    ]
  },
  {
    role: ROLES.WARD_OFFICER,
    label: 'Ward Administrative Officer',
    description: 'Operational ward head coordinating local municipal actions, field dispatch, and initial triage approval.',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    scope: 'WARD_OPERATIONS',
    permissions: [
      'VIEW_WARD_OPERATIONS',
      'ASSIGN_WARD_WORK',
      'APPROVE_FIELD_RESOLUTIONS',
      'MONITOR_WARD_SLAS',
      'ESCALATE_TO_DEPARTMENT',
      'ACCESS_WARD_GIS',
    ]
  },
  {
    role: ROLES.DEPARTMENT_OFFICER,
    label: 'Department Officer',
    description: 'Head of municipal department oversight (Roads, Water, Sanitation, Electrical) managing department queues.',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    scope: 'DEPARTMENT_OPERATIONS',
    permissions: [
      'VIEW_DEPT_OPERATIONS',
      'CREATE_WORK_ORDERS',
      'ASSIGN_SUPERVISOR',
      'MANAGE_RESOURCE_ALLOCATION',
      'VIEW_DEPARTMENT_ANALYTICS',
    ]
  },
  {
    role: ROLES.DEPARTMENT_SUPERVISOR,
    label: 'Field Supervisor',
    description: 'Field operation supervisor assigning tasks to workers, verifying initial evidence, and monitoring team progress.',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    scope: 'FIELD_SUPERVISION',
    permissions: [
      'VIEW_FIELD_SUPERVISION',
      'DISPATCH_WORKERS',
      'REVIEW_PROOF_OF_WORK',
      'UPDATE_WORK_ORDER_STATUS',
      'SUBMIT_SUPERVISOR_VERIFICATION',
    ]
  },
  {
    role: ROLES.MUNICIPAL_WORKER,
    label: 'Municipal Field Worker',
    description: 'Executes ground-level repair work orders, uploads before/during/after evidence, and reports completion.',
    badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    scope: 'FIELD_MOBILE',
    permissions: [
      'VIEW_ASSIGNED_WORK_ORDERS',
      'START_WORK_ORDER',
      'UPLOAD_PROOF_OF_WORK',
      'SUBMIT_WORK_COMPLETION',
    ]
  },
  {
    role: ROLES.SENIOR_AUTHORITY,
    label: 'Senior Municipal Authority',
    description: 'Commissioner, Additional Commissioner, or Mayor reviewing macro city analytics, SLA compliance, and budget accountability.',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    scope: 'EXECUTIVE_COMMAND',
    permissions: [
      'VIEW_EXECUTIVE_ANALYTICS',
      'VIEW_COMMAND_CENTER',
      'VIEW_RISK_AUDITS',
      'OVERRIDE_ESCALATIONS',
      'VIEW_PUBLIC_PROJECTS',
    ]
  },
  {
    role: ROLES.CITY_ADMIN,
    label: 'City Platform Admin',
    description: 'Configures municipality identity, wards, departments, SLA threshold rules, and role permissions.',
    badgeColor: 'bg-amber-600/10 text-amber-500 border-amber-600/30',
    scope: 'ADMINISTRATION',
    permissions: [
      'VIEW_ADMINISTRATION',
      'CONFIGURE_MUNICIPALITY',
      'MANAGE_USERS',
      'CONFIGURE_SLAS',
      'CONFIGURE_ESCALATION_RULES',
      'CONFIGURE_DEPARTMENTS',
      'VIEW_SYSTEM_AUDIT_LOGS',
    ]
  },
  {
    role: ROLES.SUPER_ADMIN,
    label: 'Super Admin (System Infrastructure)',
    description: 'Multi-tenant administrator managing synthetic municipality setups, AI service parameters, and global settings.',
    badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    scope: 'GLOBAL_SYSTEM',
    permissions: [
      'ALL_PERMISSIONS',
      'MANAGE_ALL_MUNICIPALITIES',
      'SWITCH_MUNICIPALITY_CONTEXT',
      'CONFIGURE_GLOBAL_AI',
    ]
  },
  {
    role: ROLES.POLICE_EMERGENCY_USER,
    label: 'Emergency / Public Safety Unit',
    description: 'Configured emergency dispatcher receiving public safety alerts and high-priority hazard incidents.',
    badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30',
    scope: 'EMERGENCY_DISPATCH',
    permissions: [
      'VIEW_EMERGENCY_ALERTS',
      'DISPATCH_EMERGENCY_UNIT',
      'COORDINATE_PUBLIC_SAFETY',
      'VIEW_GIS_EMERGENCY_LAYER',
    ]
  }
];

export const DEMO_USERS = [
  { id: 'user-ctrl', name: 'Rohan Deshmukh (Controller)', role: ROLES.NAGARSETU_CONTROLLER, email: 'controller@nagarsetu.demo', avatar: 'RD' },
  { id: 'user-cit', name: 'Ananya Sharma (Citizen)', role: ROLES.CITIZEN, email: 'citizen@nagarsetu.demo', avatar: 'AS' },
  { id: 'user-wm', name: 'Vikramaditya Mane (Ward Member)', role: ROLES.WARD_MEMBER, email: 'wardmember@nagarsetu.demo', avatar: 'VM' },
  { id: 'user-wo', name: 'Pravin Jadhav (Ward Officer)', role: ROLES.WARD_OFFICER, email: 'wardofficer@nagarsetu.demo', avatar: 'PJ' },
  { id: 'user-dept', name: 'Er. Rajesh Kulkarni (Dept Officer)', role: ROLES.DEPARTMENT_OFFICER, email: 'department@nagarsetu.demo', avatar: 'RK' },
  { id: 'user-sup', name: 'Sunil Shinde (Supervisor)', role: ROLES.DEPARTMENT_SUPERVISOR, email: 'supervisor@nagarsetu.demo', avatar: 'SS' },
  { id: 'user-worker', name: 'Santosh Pawar (Worker)', role: ROLES.MUNICIPAL_WORKER, email: 'worker@nagarsetu.demo', avatar: 'SP' },
  { id: 'user-snr', name: 'Dr. Abhijit More IAS (Senior)', role: ROLES.SENIOR_AUTHORITY, email: 'senior@nagarsetu.demo', avatar: 'AM' },
  { id: 'user-admin', name: 'Mahesh Thorat (City Admin)', role: ROLES.CITY_ADMIN, email: 'cityadmin@nagarsetu.demo', avatar: 'MT' },
  { id: 'user-super', name: 'System Root (Super Admin)', role: ROLES.SUPER_ADMIN, email: 'superadmin@nagarsetu.demo', avatar: 'SR' },
  { id: 'user-police', name: 'Inspector R. V. Kadam (Police)', role: ROLES.POLICE_EMERGENCY_USER, email: 'police@nagarsetu.demo', avatar: 'RK' },
];

export function hasPermission(userRole, permission) {
  if (userRole === ROLES.SUPER_ADMIN) return true;
  const def = ROLE_DEFINITIONS.find(r => r.role === userRole);
  if (!def) return false;
  return def.permissions.includes(permission) || def.permissions.includes('ALL_PERMISSIONS');
}
