import fs from 'fs';
import path from 'path';

async function runPhase7FrontendTests() {
  console.log('--- NAGARSETU AI PHASE 7 FRONTEND & DESIGN SYSTEM ACCEPTANCE TESTS ---');

  const rootDir = path.resolve(process.cwd());

  // Test 1: Verify ThemeEngine CSS & Variables
  const cssPath = path.join(rootDir, 'src', 'styles', 'index.css');
  if (!fs.existsSync(cssPath)) {
    console.error('FAILED: index.css missing');
    process.exit(1);
  }
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  if (!cssContent.includes('--bg-app') || !cssContent.includes('html.dark')) {
    console.error('FAILED: CSS variables or dark mode rules missing in index.css');
    process.exit(1);
  }
  console.log('✅ TEST 1 PASSED: Theme Engine & CSS Variables Verified');

  // Test 2: Verify All Core Page Components Exist
  const requiredPages = [
    'src/pages/SplashScreenPage.jsx',
    'src/pages/LoginPage.jsx',
    'src/pages/MapPage.jsx',
    'src/pages/WorkOrdersPage.jsx',
    'src/pages/NotificationsPage.jsx',
    'src/pages/SettingsPage.jsx',
    'src/pages/PublicDashboardPage.jsx',
    'src/pages/PublicProjectsPage.jsx',
    'src/pages/EmergencyPage.jsx',
    'src/pages/citizen/CitizenDashboardPage.jsx',
    'src/pages/citizen/CitizenReportPage.jsx',
    'src/pages/citizen/CitizenComplaintDetailPage.jsx',
    'src/pages/controller/ControllerDashboardPage.jsx',
    'src/pages/controller/ControllerComplaintsPage.jsx',
    'src/pages/controller/ControllerRoutingPage.jsx',
    'src/pages/controller/ControllerEscalationsPage.jsx',
    'src/pages/controller/ControllerSlaPage.jsx',
    'src/pages/controller/ControllerAnalyticsPage.jsx',
    'src/pages/controller/ControllerAuditPage.jsx',
    'src/pages/ward/WardDashboardPage.jsx',
    'src/pages/department/DepartmentDashboardPage.jsx',
    'src/pages/worker/WorkerDashboardPage.jsx',
    'src/pages/senior/SeniorDashboardPage.jsx',
    'src/pages/admin/AdminDashboardPage.jsx',
  ];

  for (const pagePath of requiredPages) {
    const fullPath = path.join(rootDir, pagePath);
    if (!fs.existsSync(fullPath)) {
      console.error(`FAILED: Required page missing: ${pagePath}`);
      process.exit(1);
    }
  }
  console.log(`✅ TEST 2 PASSED: All ${requiredPages.length} Core Page Components Verified`);

  // Test 3: Verify Global Shell & Common UI Components
  const requiredComponents = [
    'src/components/layout/MainLayout.jsx',
    'src/components/layout/Sidebar.jsx',
    'src/components/layout/TopHeader.jsx',
    'src/components/layout/TitleBar.jsx',
    'src/components/chat/CivicAssistantChatbot.jsx',
    'src/components/common/Badge.jsx',
    'src/components/common/Button.jsx',
    'src/components/common/Card.jsx',
    'src/components/common/Modal.jsx',
    'src/components/common/StatCard.jsx',
    'src/components/palette/CommandPalette.jsx',
  ];

  for (const compPath of requiredComponents) {
    const fullPath = path.join(rootDir, compPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`FAILED: Shared component missing: ${compPath}`);
      process.exit(1);
    }
  }
  console.log(`✅ TEST 3 PASSED: All ${requiredComponents.length} Shared UI Components Verified`);

  console.log('----------------------------------------------------');
  console.log('ALL PHASE 7 FRONTEND & DESIGN SYSTEM TESTS PASSED (3/3)!');
  console.log('----------------------------------------------------');
}

runPhase7FrontendTests().catch((err) => {
  console.error('[PHASE 7 TEST ERROR]', err);
  process.exit(1);
});
