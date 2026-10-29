import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const TRANSLATIONS = {
  mr: {
    // Brand
    brand_name: 'नगरसेतू AI',
    brand_tagline: 'नागरिक जोडणी • सशक्त प्रशासन',
    brand_sub: 'इचलकरंजी महानगरपालिका नागरी बुद्धिमत्ता प्रणाली',
    corp_name: 'इचलकरंजी महानगरपालिका',
    corp_short: 'इ.म.न.पा. (IMC)',
    desktop_edition: 'डेस्कटॉप आवृत्ती v1.0',
    system_operational: 'प्रणाली सुरळीत सुरू',
    demo_env: 'इचलकरंजी प्रायोगिक प्रकल्प',

    // Nav
    nav_command_center: 'नियंत्रण कक्ष (कमांड सेंटर)',
    nav_complaints: 'नागरी तक्रारी यादी',
    nav_ai_routing: 'AI वर्गीकरण व वाटप',
    nav_map: 'स्मार्ट शहर नकाशा',
    nav_work_orders: 'कामाचे आदेश (वर्क ऑर्डर्स)',
    nav_sla: 'सेवा हमी मॉनिटर (SLA)',
    nav_escalations: 'वरिष्ठ अधिकारी दखल',
    nav_analytics: 'प्रशासकीय विश्लेषण',
    nav_audit: 'ऑडिट नोंदवही',
    nav_projects: 'सार्वजनिक विकासकामे',
    nav_admin: 'प्रशासकीय नियंत्रण',
    nav_settings: 'सेटिंग्ज',

    // Extended Navigation
    nav_citizen_dashboard: 'नागरिक डॅशबोर्ड',
    nav_report_issue: 'नवीन तक्रार नोंदवा',
    nav_public_transparency: 'सार्वजनिक पारदर्शकता',
    nav_notifications: 'सूचना व संदेश',
    nav_executive_command: 'वरिष्ठ प्रशासकीय कक्ष',
    nav_ward_operations: 'प्रभाग कार्यप्रणाली',
    nav_department_command: 'विभाग नियंत्रण कक्ष',
    nav_field_operations: 'क्षेत्रीय कार्यप्रणाली',
    nav_assigned_work_orders: 'नेमून दिलेले कामाचे आदेश',
    nav_profile: 'माझी माहिती (प्रोफाइल)',
    nav_emergency_gateway: 'आपत्कालीन नियंत्रण कक्ष',
    nav_admin_dashboard: 'प्रशासक डॅशबोर्ड',
    select_demo_role: 'डेमो भूमिका निवडा',
    switch_role: 'भूमिका',
    live_telemetry: 'थेट नागरी निरीक्षण',
    telemetry_alerts: 'महत्त्वाच्या सूचना',
    unread: 'नवीन',
    city_label: 'शहर:',

    // Common Actions
    btn_report_issue: 'नवीन तक्रार नोंदवा',
    btn_inspect: 'तपशील पहा',
    btn_refresh: 'माहिती अद्ययावत करा',
    btn_search_placeholder: 'तक्रार, प्रभाग, रस्ता किंवा कामाचे आदेश शोधा...',
    btn_close: 'बंद करा',
    btn_approve: 'मंजूर करा व पूर्ण घोषित करा',
    btn_launch_routing: 'AI वाटप प्रणाली सुरू करा',
    btn_clear: 'साफ करा',

    // Statuses
    status_in_progress: 'प्रगतीपथावर',
    status_completed: 'काम पूर्ण झाले',
    status_verification_pending: 'पडताळणी प्रलंबित',
    status_assigned: 'नेमणूक केली',
    status_submitted: 'नोंदणी झाली',
    status_escalated: 'वरिष्ठ स्तरावर वर्ग',
    status_closed: 'तक्रार निवारण पूर्ण',

    // Priority
    prio_critical: 'P1 तातडीची',
    prio_high: 'P2 उच्च',
    prio_medium: 'P3 मध्यम',
    prio_low: 'P4 सामान्य',

    // Work Orders Page
    wo_header_badge: 'क्षेत्रीय कर्मचारी नियंत्रण कक्ष',
    wo_title: 'इचलकरंजी महानगरपालिका - कामाचे आदेश व्यवस्थापन',
    wo_subtitle: 'शहरातील विविध प्रभागांमधील दुरुस्ती कामे, क्षेत्रीय कर्मचारी वाटप आणि कामाची पडताळणी.',
    wo_active_count: 'सक्रिय कामाचे आदेश',
    wo_tab_all: 'सर्व आदेश',
    wo_tab_in_progress: 'प्रगतीपथावर',
    wo_tab_completed: 'पूर्ण झालेली',
    wo_tab_pending_qc: 'पडताळणी प्रलंबित',
    wo_area_label: 'कार्यक्षेत्र व प्रभाग:',
    wo_field_crew: 'क्षेत्रीय पथक:',
    wo_supervisor: 'पर्यवेक्षक अधिकारी:',
    wo_due: 'मुदत:',
    wo_instructions: 'कामाचे स्वरूप व सूचना:',

    // Departments
    dept_road: 'रस्ते व बांधकाम विभाग',
    dept_water: 'पाणी पुरवठा व जलनिस्सारण विभाग',
    dept_waste: 'घनकचरा व्यवस्थापन व स्वच्छता विभाग',
    dept_elec: 'विद्युत व पथदिवे विभाग',
    dept_health: 'आरोग्य व मलनिस्सारण विभाग',
    dept_fire: 'अग्निशामक विभाग',

    // Telemetry & Grid
    telemetry_water: 'पाणी पुरवठा',
    telemetry_power: 'वीज व पथदिवे',
    telemetry_roads: 'रस्ते व वाहतूक',
    telemetry_drain: 'पाणी निचरा',
    telemetry_waste: 'घनकचरा',

    // Chatbot
    chat_title: 'नगरसेतू AI नागरी सहाय्यक',
    chat_online: 'उपलब्ध व सज्ज',
    chat_greeting: 'नमस्कार! मी इचलकरंजी महानगरपालिका नगरसेतू AI सहाय्यक आहे. मी तुम्हाला नागरी समस्यांची नोंद करणे, कामाची स्थिती तपासणे किंवा प्रभागाची माहिती मिळवण्यासाठी कशी मदत करू?',
    chat_placeholder: 'तुमचा प्रश्न किंवा तक्रार येथे लिहा...',
  },

  en: {
    // Brand
    brand_name: 'NAGARSETU AI',
    brand_tagline: 'Connecting Citizens • Empowering Governance',
    brand_sub: 'Ichalkaranji Municipal Corporation Civic Intelligence Platform',
    corp_name: 'Ichalkaranji Municipal Corporation',
    corp_short: 'IMC',
    desktop_edition: 'DESKTOP v1.0',
    system_operational: 'SYSTEM OPERATIONAL',
    demo_env: 'Ichalkaranji Pilot Operations',

    // Nav
    nav_command_center: 'Command Center',
    nav_complaints: 'Complaints Queue',
    nav_ai_routing: 'AI Routing Queue',
    nav_map: 'Smart City Map',
    nav_work_orders: 'Work Orders',
    nav_sla: 'SLA Monitor',
    nav_escalations: 'Escalations Engine',
    nav_analytics: 'Analytics',
    nav_audit: 'Audit Log',
    nav_projects: 'Public Projects',
    nav_admin: 'Administration',
    nav_settings: 'Settings',

    // Extended Navigation
    nav_citizen_dashboard: 'Citizen Dashboard',
    nav_report_issue: 'Report Civic Issue',
    nav_public_transparency: 'Public Transparency',
    nav_notifications: 'Notifications',
    nav_executive_command: 'Executive Command',
    nav_ward_operations: 'Ward Operations',
    nav_department_command: 'Department Command',
    nav_field_operations: 'Field Operations',
    nav_assigned_work_orders: 'Assigned Work Orders',
    nav_profile: 'Profile',
    nav_emergency_gateway: 'Emergency Gateway',
    nav_admin_dashboard: 'Admin Dashboard',
    select_demo_role: 'Select Demo Role',
    switch_role: 'ROLE',
    live_telemetry: 'LIVE TELEMETRY',
    telemetry_alerts: 'Telemetry Alerts',
    unread: 'Unread',
    city_label: 'CITY:',

    // Common Actions
    btn_report_issue: 'Report New Issue',
    btn_inspect: 'Inspect Details',
    btn_refresh: 'Refresh Telemetry',
    btn_search_placeholder: 'Search complaints, wards, work orders...',
    btn_close: 'Close',
    btn_approve: 'Approve & Close Work Order',
    btn_launch_routing: 'Launch AI Routing Queue',
    btn_clear: 'Clear',

    // Statuses
    status_in_progress: 'IN PROGRESS',
    status_completed: 'WORK COMPLETED',
    status_verification_pending: 'VERIFICATION PENDING',
    status_assigned: 'ASSIGNED',
    status_submitted: 'SUBMITTED',
    status_escalated: 'ESCALATED',
    status_closed: 'CLOSED',

    // Priority
    prio_critical: 'P1 CRITICAL',
    prio_high: 'P2 HIGH',
    prio_medium: 'P3 MEDIUM',
    prio_low: 'P4 LOW',

    // Work Orders Page
    wo_header_badge: 'FIELD DISPATCH CONSOLE',
    wo_title: 'Ichalkaranji Municipal Work Order Management',
    wo_subtitle: 'Active field crew dispatch, emergency works, and resolution proof verification across city prabhags.',
    wo_active_count: 'ACTIVE WORK ORDERS',
    wo_tab_all: 'All Orders',
    wo_tab_in_progress: 'In Progress',
    wo_tab_completed: 'Completed',
    wo_tab_pending_qc: 'Pending QC',
    wo_area_label: 'Area & Prabhag:',
    wo_field_crew: 'Field Crew:',
    wo_supervisor: 'Supervisor:',
    wo_due: 'Due:',
    wo_instructions: 'Work Instructions & Scope:',

    // Departments
    dept_road: 'Road Maintenance & Infrastructure',
    dept_water: 'Water Supply & Pipeline Management',
    dept_waste: 'Solid Waste & Sanitation Department',
    dept_elec: 'Electrical & Streetlighting Department',
    dept_health: 'Public Health & Stormwater Drainage',
    dept_fire: 'Fire & Emergency Disaster Cell',

    // Telemetry & Grid
    telemetry_water: 'WATER',
    telemetry_power: 'POWER',
    telemetry_roads: 'ROADS',
    telemetry_drain: 'DRAIN',
    telemetry_waste: 'WASTE',

    // Chatbot
    chat_title: 'NAGARSETU AI CIVIC ASSISTANT',
    chat_online: 'ONLINE & READY',
    chat_greeting: 'Greetings! I am the Ichalkaranji Municipal NagarSetu AI Assistant. How can I guide you with civic grievances, work order tracking, or prabhag services today?',
    chat_placeholder: 'Type your civic grievance or inquiry...',
  },
};

export function LanguageProvider({ children }) {
  // Default to Marathi ('mr') with easy English toggle
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('nagarsetu_language') || 'mr';
  });

  useEffect(() => {
    localStorage.setItem('nagarsetu_language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'mr' ? 'en' : 'mr'));
  };

  const setLang = (lang) => {
    if (TRANSLATIONS[lang]) {
      setLanguage(lang);
    }
  };

  const t = (key) => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.mr;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage,
        setLanguage: setLang,
        t,
        isMarathi: language === 'mr',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
