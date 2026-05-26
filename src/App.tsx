/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { SchoolAdminLayout } from "./components/layout/SchoolAdminLayout";
import { RegisterSchoolPage } from "@/pages/RegisterSchoolPage";
import { LoginPage } from "@/pages/LoginPage";
import { LandingPage } from "@/pages/LandingPage";
import { DirectoryPage } from "@/pages/DirectoryPage";
import { SchoolPage } from "@/pages/SchoolPage";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { WebsiteBuilderPage } from "@/pages/WebsiteBuilderPage";
import { SignUpPage } from "@/pages/SignUpPage";
import { AdminStudentsPage } from "@/pages/AdminStudentsPage";
import { AdminAdmissionsPage } from "@/pages/AdminAdmissionsPage";
import { AdminParentsPage } from "@/pages/AdminParentsPage";
import { AdminStaffPage } from "@/pages/AdminStaffPage";
import { AdminAttendancePage } from "@/pages/AdminAttendancePage";
import { AdminEventsPage } from "@/pages/AdminEventsPage";
import { AdminAnnouncementsPage } from "@/pages/AdminAnnouncementsPage";
import { AdminCommunicationPage } from "@/pages/AdminCommunicationPage";
import { AdminAIToolsPage } from "@/pages/AdminAIToolsPage";
import { AdminAnalyticsPage } from "@/pages/AdminAnalyticsPage";
import { SuperAdminLayout } from "./components/layout/SuperAdminLayout";
import { SuperAdminDashboard } from "./pages/super/SuperAdminDashboard";
import { SuperAdminSchoolsPage } from "./pages/super/SuperAdminSchoolsPage";
import { SuperAdminRevenuePage } from "./pages/super/SuperAdminRevenuePage";
import { SuperAdminUsersPage } from "./pages/super/SuperAdminUsersPage";
import { SuperAdminAnnouncementsPage } from "./pages/super/SuperAdminAnnouncementsPage";
import { SuperAdminModerationPage } from "./pages/super/SuperAdminModerationPage";
import { SuperAdminSupportPage } from "./pages/super/SuperAdminSupportPage";
import { SuperAdminScalabilityPage } from "./pages/super/SuperAdminScalabilityPage";
import { SuperAdminCMSPage } from "./pages/super/SuperAdminCMSPage";
import { SuperAdminSocialPage } from "./pages/super/SuperAdminSocialPage";
import { FeaturesPage } from "@/pages/FeaturesPage";
import { PricingPage } from "@/pages/PricingPage";
import { MarketplacePage } from "@/pages/MarketplacePage";
import { AuthProvider } from "@/lib/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ParentPortalPage } from "@/pages/ParentPortalPage";
import { SubscriptionPage } from "@/pages/SubscriptionPage";
import { AdminMarketplacePage } from "@/pages/AdminMarketplacePage";
import { AdminFinancePage } from "@/pages/AdminFinancePage";
import { AdminTransportPage } from "@/pages/AdminTransportPage";
import { AdminELearningPage } from "@/pages/AdminELearningPage";
import { DigitalLearningEcosystemPage } from "@/pages/DigitalLearningEcosystemPage";
import { CommunityPage } from "@/pages/CommunityPage";
import { SafetySecurityPage } from "@/pages/SafetySecurityPage";
import { AIMatchingPage } from "@/pages/AIMatchingPage";
import { AdvancedWebsiteFeaturesPage } from "@/pages/AdvancedWebsiteFeaturesPage";
import { InstallGuidePage } from "@/pages/InstallGuidePage";
import { InformalFlatletsPage } from "@/pages/InformalFlatletsPage";

import { PerformanceInfrastructurePage } from "@/pages/PerformanceInfrastructurePage";
import { NationalInsightsPage } from "@/pages/NationalInsightsPage";
import { MapSearchPage } from "@/pages/GeolocationMapPage";
import { MarketingToolsPage } from "@/pages/MarketingToolsPage";
import { ApplyPage } from "@/pages/ApplyPage";
import { ParentResourcesPage } from "@/pages/ParentResourcesPage";
import { BlogHubPage } from "@/pages/BlogHubPage";
import { FaqPage } from "@/pages/FaqPage";
import { ContactUsPage } from "@/pages/ContactUsPage";
import { AboutPage } from "@/pages/AboutPage";
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "@/pages/TermsOfServicePage";
import { SchoolApplicationsPage } from "@/pages/SchoolApplicationsPage";
import { AdminHealthDailyPage } from "@/pages/AdminHealthDailyPage";
import { AdminHRInventoryPage } from "@/pages/AdminHRInventoryPage";
import { AdminCompliancePage } from "@/pages/AdminCompliancePage";
import { AdminCRMPage } from "@/pages/AdminCRMPage";
import { AdminPartnershipPage } from "@/pages/AdminPartnershipPage";
import { AdminSupportPage } from "@/pages/AdminSupportPage";
import { AdminContentMediaPage } from "@/pages/AdminContentMediaPage";
import { AdminDocumentsPage } from "@/pages/AdminDocumentsPage";
import { SupplierMarketplacePage } from "@/pages/SupplierMarketplacePage";
import { SupplierPortalPage } from "@/pages/SupplierPortalPage";
import { AdvertiserPortalPage } from "@/pages/AdvertiserPortalPage";
import { RegisterSupplierPage } from "@/pages/RegisterSupplierPage";
import { RegisterAdvertiserPage } from "@/pages/RegisterAdvertiserPage";
import { PWAPrompt } from "@/components/PWAPrompt";
import { Toaster } from "sonner";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="directory" element={<DirectoryPage />} />
            <Route path="school/:id" element={<SchoolPage />} />
            <Route path="features" element={<FeaturesPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="marketplace" element={<MarketplacePage />} />
            <Route path="learning" element={<DigitalLearningEcosystemPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="safety" element={<SafetySecurityPage />} />
            <Route path="ai-matching" element={<AIMatchingPage />} />
            <Route path="advanced-features" element={<AdvancedWebsiteFeaturesPage />} />
            <Route path="infrastructure" element={<PerformanceInfrastructurePage />} />
            <Route path="insights" element={<NationalInsightsPage />} />
            <Route path="map" element={<MapSearchPage />} />
            <Route path="marketing" element={<MarketingToolsPage />} />
            <Route path="apply" element={<ApplyPage />} />
            <Route path="register" element={<RegisterSchoolPage />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route path="register-supplier" element={<RegisterSupplierPage />} />
            <Route path="register-advertiser" element={<RegisterAdvertiserPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="resources" element={<ParentResourcesPage />} />
            <Route path="blog" element={<BlogHubPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="contact" element={<ContactUsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="privacy" element={<PrivacyPolicyPage />} />
            <Route path="terms" element={<TermsOfServicePage />} />
            <Route path="install" element={<InstallGuidePage />} />
            <Route path="flatlets" element={<InformalFlatletsPage />} />
            <Route path="applications" element={<SchoolApplicationsPage />} />
            <Route path="parent-resources" element={<ParentResourcesPage />} />
            <Route path="website-builder" element={<WebsiteBuilderPage />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['SchoolAdmin', 'SuperAdmin']}>
              <SchoolAdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboardPage />} />
            <Route path="website" element={<WebsiteBuilderPage />} />
            <Route path="students" element={<AdminStudentsPage />} />
            <Route path="staff" element={<AdminStaffPage />} />
            <Route path="attendance" element={<AdminAttendancePage />} />
            <Route path="events" element={<AdminEventsPage />} />
            <Route path="announcements" element={<AdminAnnouncementsPage />} />
            <Route path="communication" element={<AdminCommunicationPage />} />
            <Route path="ai-tools" element={<AdminAIToolsPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="admissions" element={<AdminAdmissionsPage />} />
            <Route path="parents" element={<AdminParentsPage />} />
            <Route path="billing" element={<SubscriptionPage />} />
            <Route path="finance" element={<AdminFinancePage />} />
            <Route path="transport" element={<AdminTransportPage />} />
            <Route path="e-learning" element={<AdminELearningPage />} />
            <Route path="health" element={<AdminHealthDailyPage />} />
            <Route path="hr-inventory" element={<AdminHRInventoryPage />} />
            <Route path="compliance" element={<AdminCompliancePage />} />
            <Route path="crm" element={<AdminCRMPage />} />
            <Route path="partnerships" element={<AdminPartnershipPage />} />
            <Route path="support" element={<AdminSupportPage />} />
            <Route path="documents" element={<AdminDocumentsPage />} />
            <Route path="content-media" element={<AdminContentMediaPage />} />
            <Route path="supplier-marketplace" element={<SupplierMarketplacePage />} />
            <Route path="marketplace" element={<AdminMarketplacePage />} />
            <Route path="*" element={<div className="p-8 text-center"><h1 className="text-slate-500">Feature coming soon</h1></div>} />
          </Route>

          {/* Parent Portal */}
          <Route path="/parent" element={
            <ProtectedRoute allowedRoles={['Parent', 'SuperAdmin']}>
              <ParentPortalPage />
            </ProtectedRoute>
          } />

          {/* Supplier Portal */}
          <Route path="/supplier" element={
            <ProtectedRoute allowedRoles={['Supplier', 'SuperAdmin']}>
              <SupplierPortalPage />
            </ProtectedRoute>
          } />

          {/* Advertiser Portal */}
          <Route path="/advertiser" element={
            <ProtectedRoute allowedRoles={['Advertiser', 'SuperAdmin']}>
              <AdvertiserPortalPage />
            </ProtectedRoute>
          } />

          {/* Super Admin Routes */}
          <Route path="/super" element={
            <ProtectedRoute allowedRoles={['SuperAdmin']}>
              <SuperAdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="schools" element={<SuperAdminSchoolsPage />} />
            <Route path="subscriptions" element={<SuperAdminRevenuePage />} />
            <Route path="revenue" element={<SuperAdminRevenuePage />} />
            <Route path="users" element={<SuperAdminUsersPage />} />
            <Route path="announcements" element={<SuperAdminAnnouncementsPage />} />
            <Route path="moderation" element={<SuperAdminModerationPage />} />
            <Route path="verification" element={<SuperAdminSchoolsPage />} />
            <Route path="support" element={<SuperAdminSupportPage />} />
            <Route path="scalability" element={<SuperAdminScalabilityPage />} />
            <Route path="cms" element={<SuperAdminCMSPage />} />
            <Route path="social" element={<SuperAdminSocialPage />} />
            <Route path="*" element={<div className="p-8 text-center"><h1 className="text-slate-500">Super Admin Feature coming soon</h1></div>} />
          </Route>
        </Routes>
        <PWAPrompt />
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}






