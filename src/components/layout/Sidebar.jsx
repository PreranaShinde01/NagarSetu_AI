import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useMunicipality } from '../../context/MunicipalityContext';
import { useLanguage } from '../../context/LanguageContext';
import Tooltip from '../common/Tooltip';
import {
  LayoutDashboard,
  AlertOctagon,
  MapPin,
  ClipboardList,
  Clock,
  BarChart3,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  FolderGit2,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building,
  HardHat,
  Eye,
  Award,
  PhoneCall,
  X,
} from 'lucide-react';

export default function Sidebar({ isCollapsed, toggleCollapsed, isMobileOpen, onCloseMobile }) {
  const { currentUser, currentRoleDef, loginAsRole, demoUsers } = useAuth();
  const { activeMunicipality, municipalities, switchMunicipality } = useMunicipality();
  const { isMarathi, t } = useLanguage();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const role = currentUser?.role || 'CITIZEN';

  // Role-specific navigation items with multilingual support
  const citizenNavItems = [
    { label: 'Citizen Dashboard', i18nKey: 'nav_citizen_dashboard', path: '/citizen/dashboard', icon: LayoutDashboard },
    { label: 'Report Civic Issue', i18nKey: 'nav_report_issue', path: '/citizen/report', icon: AlertOctagon },
    { label: 'Smart City Map', i18nKey: 'nav_map', path: '/map', icon: MapPin },
    { label: 'Public Projects', i18nKey: 'nav_projects', path: '/public-projects', icon: FolderGit2 },
    { label: 'Public Transparency', i18nKey: 'nav_public_transparency', path: '/public-dashboard', icon: Eye },
    { label: 'Notifications', i18nKey: 'nav_notifications', path: '/notifications', icon: Bell },
    { label: 'Settings', i18nKey: 'nav_settings', path: '/settings', icon: Settings },
  ];

  const controllerNavItems = [
    { label: 'Command Center', i18nKey: 'nav_command_center', path: '/controller/dashboard', icon: LayoutDashboard },
    { label: 'Complaints Queue', i18nKey: 'nav_complaints', path: '/controller/complaints', icon: AlertOctagon },
    { label: 'AI Routing Queue', i18nKey: 'nav_ai_routing', path: '/controller/routing', icon: Sparkles },
    { label: 'Smart City Map', i18nKey: 'nav_map', path: '/map', icon: MapPin },
    { label: 'Work Orders', i18nKey: 'nav_work_orders', path: '/work-orders', icon: ClipboardList },
    { label: 'SLA Monitor', i18nKey: 'nav_sla', path: '/controller/sla', icon: Clock },
    { label: 'Escalations Engine', i18nKey: 'nav_escalations', path: '/controller/escalations', icon: ShieldAlert },
    { label: 'Analytics', i18nKey: 'nav_analytics', path: '/controller/analytics', icon: BarChart3 },
    { label: 'Audit Log', i18nKey: 'nav_audit', path: '/controller/audit', icon: ShieldCheck },
    { label: 'Public Projects', i18nKey: 'nav_projects', path: '/public-projects', icon: FolderGit2 },
    { label: 'Administration', i18nKey: 'nav_admin', path: '/settings', icon: Settings },
  ];

  const seniorNavItems = [
    { label: 'Executive Command', i18nKey: 'nav_executive_command', path: '/senior/dashboard', icon: Award },
    { label: 'Escalations Engine', i18nKey: 'nav_escalations', path: '/senior/escalations', icon: ShieldAlert },
    { label: 'Analytics', i18nKey: 'nav_analytics', path: '/senior/analytics', icon: BarChart3 },
    { label: 'Smart City Map', i18nKey: 'nav_map', path: '/map', icon: MapPin },
    { label: 'Public Transparency', i18nKey: 'nav_public_transparency', path: '/public-dashboard', icon: Eye },
    { label: 'Settings', i18nKey: 'nav_settings', path: '/settings', icon: Settings },
  ];

  const adminNavItems = [
    { label: 'Admin Dashboard', i18nKey: 'nav_admin_dashboard', path: '/admin/dashboard', icon: Settings },
    { label: 'Command Center', i18nKey: 'nav_command_center', path: '/controller/dashboard', icon: LayoutDashboard },
    { label: 'Complaints Queue', i18nKey: 'nav_complaints', path: '/controller/complaints', icon: AlertOctagon },
    { label: 'Analytics', i18nKey: 'nav_analytics', path: '/controller/analytics', icon: BarChart3 },
    { label: 'Audit Log', i18nKey: 'nav_audit', path: '/controller/audit', icon: ShieldCheck },
  ];

  const wardNavItems = [
    { label: 'Ward Operations', i18nKey: 'nav_ward_operations', path: '/ward/dashboard', icon: Building },
    { label: 'Complaints Queue', i18nKey: 'nav_complaints', path: '/controller/complaints', icon: AlertOctagon },
    { label: 'Smart City Map', i18nKey: 'nav_map', path: '/map', icon: MapPin },
    { label: 'Work Orders', i18nKey: 'nav_work_orders', path: '/work-orders', icon: ClipboardList },
    { label: 'SLA Monitor', i18nKey: 'nav_sla', path: '/controller/sla', icon: Clock },
    { label: 'Settings', i18nKey: 'nav_settings', path: '/settings', icon: Settings },
  ];

  const deptNavItems = [
    { label: 'Department Command', i18nKey: 'nav_department_command', path: '/department/dashboard', icon: LayoutDashboard },
    { label: 'Work Orders', i18nKey: 'nav_work_orders', path: '/work-orders', icon: ClipboardList },
    { label: 'Complaints Queue', i18nKey: 'nav_complaints', path: '/controller/complaints', icon: AlertOctagon },
    { label: 'SLA Monitor', i18nKey: 'nav_sla', path: '/controller/sla', icon: Clock },
    { label: 'Analytics', i18nKey: 'nav_analytics', path: '/controller/analytics', icon: BarChart3 },
    { label: 'Settings', i18nKey: 'nav_settings', path: '/settings', icon: Settings },
  ];

  const workerNavItems = [
    { label: 'Field Operations', i18nKey: 'nav_field_operations', path: '/worker/dashboard', icon: HardHat },
    { label: 'Assigned Work Orders', i18nKey: 'nav_assigned_work_orders', path: '/work-orders', icon: ClipboardList },
    { label: 'Smart City Map', i18nKey: 'nav_map', path: '/map', icon: MapPin },
    { label: 'Notifications', i18nKey: 'nav_notifications', path: '/notifications', icon: Bell },
    { label: 'Profile', i18nKey: 'nav_profile', path: '/settings', icon: Settings },
  ];

  const policeNavItems = [
    { label: 'Emergency Gateway', i18nKey: 'nav_emergency_gateway', path: '/emergency', icon: PhoneCall },
    { label: 'Smart City Map', i18nKey: 'nav_map', path: '/map', icon: MapPin },
    { label: 'Complaints Queue', i18nKey: 'nav_complaints', path: '/controller/complaints', icon: AlertOctagon },
  ];

  let navItems = citizenNavItems;
  if (['NAGARSETU_CONTROLLER'].includes(role)) {
    navItems = controllerNavItems;
  } else if (role === 'SENIOR_AUTHORITY') {
    navItems = seniorNavItems;
  } else if (['CITY_ADMIN', 'SUPER_ADMIN'].includes(role)) {
    navItems = adminNavItems;
  } else if (['WARD_MEMBER', 'WARD_OFFICER'].includes(role)) {
    navItems = wardNavItems;
  } else if (['DEPARTMENT_OFFICER', 'DEPARTMENT_SUPERVISOR'].includes(role)) {
    navItems = deptNavItems;
  } else if (role === 'MUNICIPAL_WORKER') {
    navItems = workerNavItems;
  } else if (role === 'POLICE_EMERGENCY_USER') {
    navItems = policeNavItems;
  }

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between select-none">
      {/* Top Branding Section */}
      <div>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <img src="/assets/nagarsetu-icon.png" alt="NagarSetu" className="w-8 h-8 rounded-full object-contain drop-shadow-sm" />
              <div>
                <h1 className="text-sm font-extrabold tracking-wide text-slate-900 dark:text-slate-100 font-sans">
                  NAGAR<span className="text-amber-500">SETU</span> AI
                </h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {isMarathi ? 'नागरी बुद्धिमत्ता प्रणाली' : 'Civic Intelligence Platform'}
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <img src="/assets/nagarsetu-icon.png" alt="NagarSetu" className="w-7 h-7 rounded-full object-contain" />
            </div>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={toggleCollapsed}
              className="hidden md:block p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            {onCloseMobile && (
              <button onClick={onCloseMobile} className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Municipality Badge */}
        {!isCollapsed && (
          <div className="px-3 py-2 bg-slate-100 dark:bg-brand-deepCharcoal/80 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <Building className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {isMarathi ? 'इचलकरंजी मनपा' : 'Ichalkaranji'}
              </span>
            </div>
            <span className="bg-amber-500/10 text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold border border-amber-500/30 rounded px-1.5 py-0.5">
              IMC
            </span>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="p-2 space-y-1 mt-1 overflow-y-auto max-h-[calc(100vh-14rem)] custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const itemLabel = item.i18nKey ? t(item.i18nKey) : item.label;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                {isCollapsed ? (
                  <Tooltip text={itemLabel} position="right">
                    <Icon className="w-5 h-5 shrink-0" />
                  </Tooltip>
                ) : (
                  <>
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{itemLabel}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Demo Role Switcher */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-brand-deepCharcoal/90">
        {!isCollapsed ? (
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 truncate">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-500 flex items-center justify-center font-bold text-xs font-mono">
                  {currentUser.avatar}
                </div>
                <div className="truncate">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{currentUser.name}</h4>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${currentRoleDef.badgeColor}`}>
                    {currentRoleDef.label}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 text-[10px] font-mono border border-slate-300 dark:border-slate-700"
                title="Switch Demo Role"
              >
                {t('switch_role')}
              </button>
            </div>

            {/* Quick Demo Role Switcher Popup */}
            {showRoleMenu && (
              <div className="absolute bottom-full mb-2 left-0 right-0 bg-white dark:bg-brand-charcoal border border-slate-300 dark:border-slate-700 rounded-xl p-2 shadow-2xl z-50 max-h-60 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">{t('select_demo_role')}</span>
                  <button onClick={() => setShowRoleMenu(false)} className="text-[10px] text-slate-400 hover:text-slate-600">✕</button>
                </div>
                <div className="space-y-1">
                  {demoUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        loginAsRole(user.role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left p-1.5 rounded text-xs flex items-center justify-between ${
                        currentUser.role === user.role
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{user.name}</span>
                      <span className="text-[9px] font-mono text-slate-400">{user.role.replace(/_/g, ' ')}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            <Tooltip text={`${currentUser.name} (${currentRoleDef.label})`} position="right">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-500 flex items-center justify-center font-bold text-xs font-mono">
                {currentUser.avatar}
              </div>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 72 : 256 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden md:block h-[calc(100vh-2.5rem)] bg-white dark:bg-brand-charcoal border-r border-slate-200 dark:border-slate-800 relative z-30 shadow-xl transition-colors duration-200"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Drawer Backdrop & Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25 }}
              className="relative w-72 h-full bg-white dark:bg-brand-charcoal border-r border-slate-200 dark:border-slate-800 z-50 shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
