import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import SplashScreenPage from '../pages/SplashScreenPage';
import LoginPage from '../pages/LoginPage';
import MapPage from '../pages/MapPage';
import WorkOrdersPage from '../pages/WorkOrdersPage';
import NotificationsPage from '../pages/NotificationsPage';
import SettingsPage from '../pages/SettingsPage';

// Citizen Portal Pages
import CitizenDashboardPage from '../pages/citizen/CitizenDashboardPage';
import CitizenReportPage from '../pages/citizen/CitizenReportPage';
import CitizenComplaintDetailPage from '../pages/citizen/CitizenComplaintDetailPage';

// Controller Operations Center Pages
import ControllerDashboardPage from '../pages/controller/ControllerDashboardPage';
import ControllerComplaintsPage from '../pages/controller/ControllerComplaintsPage';
import ControllerRoutingPage from '../pages/controller/ControllerRoutingPage';
import ControllerEscalationsPage from '../pages/controller/ControllerEscalationsPage';
import ControllerSlaPage from '../pages/controller/ControllerSlaPage';
import ControllerAnalyticsPage from '../pages/controller/ControllerAnalyticsPage';
import ControllerAuditPage from '../pages/controller/ControllerAuditPage';

// Specialized Operations Pages
import WardDashboardPage from '../pages/ward/WardDashboardPage';
import DepartmentDashboardPage from '../pages/department/DepartmentDashboardPage';
import WorkerDashboardPage from '../pages/worker/WorkerDashboardPage';
import PublicDashboardPage from '../pages/PublicDashboardPage';
import PublicProjectsPage from '../pages/PublicProjectsPage';
import EmergencyPage from '../pages/EmergencyPage';
import SeniorDashboardPage from '../pages/senior/SeniorDashboardPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Desktop Splash Boot Route */}
      <Route path="/" element={<SplashScreenPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Main Mission-Control Desktop Shell Routes */}
      <Route element={<MainLayout />}>
        {/* Default & Legacy Alias Routes */}
        <Route path="/command-center" element={<ControllerDashboardPage />} />
        <Route path="/complaints" element={<ControllerComplaintsPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/work-orders" element={<WorkOrdersPage />} />
        <Route path="/sla-monitor" element={<ControllerSlaPage />} />
        <Route path="/analytics" element={<ControllerAnalyticsPage />} />
        <Route path="/projects" element={<PublicProjectsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Controller Routes */}
        <Route path="/controller/dashboard" element={<ControllerDashboardPage />} />
        <Route path="/controller/complaints" element={<ControllerComplaintsPage />} />
        <Route path="/controller/routing" element={<ControllerRoutingPage />} />
        <Route path="/controller/escalations" element={<ControllerEscalationsPage />} />
        <Route path="/controller/sla" element={<ControllerSlaPage />} />
        <Route path="/controller/analytics" element={<ControllerAnalyticsPage />} />
        <Route path="/controller/audit" element={<ControllerAuditPage />} />

        {/* Ward Route */}
        <Route path="/ward/dashboard" element={<WardDashboardPage />} />
        <Route path="/ward/complaints" element={<ControllerComplaintsPage />} />
        <Route path="/ward/map" element={<MapPage />} />

        {/* Department Route */}
        <Route path="/department/dashboard" element={<DepartmentDashboardPage />} />
        <Route path="/department/work-orders" element={<WorkOrdersPage />} />
        <Route path="/department/verification" element={<DepartmentDashboardPage />} />

        {/* Worker Route */}
        <Route path="/worker/dashboard" element={<WorkerDashboardPage />} />
        <Route path="/worker/work-orders" element={<WorkerDashboardPage />} />

        {/* Senior Authority Routes */}
        <Route path="/senior/dashboard" element={<SeniorDashboardPage />} />
        <Route path="/senior/escalations" element={<ControllerEscalationsPage />} />
        <Route path="/senior/analytics" element={<ControllerAnalyticsPage />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminDashboardPage />} />
        <Route path="/admin/municipalities" element={<AdminDashboardPage />} />
        <Route path="/admin/configuration" element={<AdminDashboardPage />} />

        {/* Emergency & Public Routes */}
        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/public-dashboard" element={<PublicDashboardPage />} />
        <Route path="/public-projects" element={<PublicProjectsPage />} />

        {/* Citizen Portal Routes */}
        <Route path="/citizen/dashboard" element={<CitizenDashboardPage />} />
        <Route path="/citizen/report" element={<CitizenReportPage />} />
        <Route path="/citizen/complaints" element={<CitizenDashboardPage />} />
        <Route path="/citizen/complaint/:id" element={<CitizenComplaintDetailPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
