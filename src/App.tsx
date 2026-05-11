/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { VendorJobRequestPage } from "./pages/VendorJobRequestPage";
import { AppointmentDetailPage } from "./pages/AppointmentDetailPage";
import { ConfirmationPage } from "./pages/ConfirmationPage";
import { DashboardPage } from "./pages/DashboardPage";
import { JobRequestsPage } from "./pages/JobRequestsPage";
import { CalendarPage } from "./pages/CalendarPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { MessagesPage } from "./pages/MessagesPage";
import { LoginPage } from "./pages/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/jobs" element={<JobRequestsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<ProfilePage />} />
        
        {/* Legacy Magic Link Routes - Kept for accessibility */}
        <Route path="/vendor/job/:token" element={<VendorJobRequestPage />} />
        <Route path="/vendor/confirmation" element={<ConfirmationPage />} />
        <Route path="/vendor/appointment/:token" element={<AppointmentDetailPage />} />
        
        {/* Detail views */}
        <Route path="/appointment/:token" element={<AppointmentDetailPage />} />

        {/* Home redirects to dashboard, but in real app would check auth */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
