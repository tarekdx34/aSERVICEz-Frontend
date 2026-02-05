import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { BrowseServicesPage } from "./pages/BrowseServicesPage";
import { AddServicePage } from "./pages/AddServicePage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { ProfilePage } from "./pages/ProfilePage";
import { MyServicesPage } from "./pages/MyServicesPage";
import { OrdersPage } from "./pages/OrdersPage";
import { SettingsPage } from "./pages/SettingsPage";
import { OrderPage } from "./pages/OrderPage";
import { OrderDetailPage } from "./pages/OrderDetailPage";
import { MessagesPage } from "./pages/MessagesPage";
import { RequestRevisionPage } from "./pages/RequestRevisionPage";
import { AcceptAndRatePage } from "./pages/AcceptAndRatePage";
import { SupportTicketPage } from "./pages/SupportTicketPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { NotificationPreferencesPage } from "./pages/NotificationPreferencesPage";
import { ExpertSetupPage } from "./pages/ExpertSetupPage";
import { ExpertDashboardPage } from "./pages/ExpertDashboardPage";
import { ExpertOrdersPage } from "./pages/ExpertOrdersPage";
import { ExpertEarningsPage } from "./pages/ExpertEarningsPage";
import { ExpertAnalyticsPage } from "./pages/ExpertAnalyticsPage";
import { ExpertDeliveryPage } from "./pages/ExpertDeliveryPage";
import { ExpertTicketsPage } from "./pages/ExpertTicketsPage";
import { CustomerServicePage } from "./pages/CustomerServicePage";
import { HelpCenterPage } from "./pages/HelpCenterPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { AdminPaymentsPage } from "./pages/AdminPaymentsPage";
import { AdminServicesPage } from "./pages/AdminServicesPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MarketplacePage />,
  },
  {
    path: "/browse",
    element: <BrowseServicesPage />,
  },
  {
    path: "/service/:id",
    element: <ServiceDetailPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-services",
    element: (
      <ProtectedRoute requiredRole="expert">
        <MyServicesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/orders",
    element: (
      <ProtectedRoute>
        <OrdersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/add-service",
    element: (
      <ProtectedRoute requiredRole="expert">
        <AddServicePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/order/:id",
    element: (
      <ProtectedRoute>
        <OrderPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/order-detail/:id",
    element: (
      <ProtectedRoute>
        <OrderDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/messages/:id",
    element: (
      <ProtectedRoute>
        <MessagesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/request-revision/:id",
    element: (
      <ProtectedRoute>
        <RequestRevisionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/accept-rate/:id",
    element: (
      <ProtectedRoute>
        <AcceptAndRatePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/support-ticket/:id",
    element: (
      <ProtectedRoute>
        <SupportTicketPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifications",
    element: (
      <ProtectedRoute>
        <NotificationsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notification-preferences",
    element: (
      <ProtectedRoute>
        <NotificationPreferencesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/expert-setup",
    element: (
      <ProtectedRoute>
        <ExpertSetupPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/expert-dashboard",
    element: (
      <ProtectedRoute>
        <ExpertDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/expert-orders",
    element: (
      <ProtectedRoute>
        <ExpertOrdersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/expert-earnings",
    element: (
      <ProtectedRoute>
        <ExpertEarningsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/expert-analytics",
    element: (
      <ProtectedRoute>
        <ExpertAnalyticsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/expert-delivery/:id",
    element: (
      <ProtectedRoute>
        <ExpertDeliveryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/expert-tickets",
    element: (
      <ProtectedRoute>
        <ExpertTicketsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/customer-service",
    element: (
      <ProtectedRoute>
        <CustomerServicePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/help-center",
    element: <HelpCenterPage />,
  },
  {
    path: "/admin-dashboard",
    element: (
      <ProtectedRoute>
        <AdminDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin-users",
    element: (
      <ProtectedRoute>
        <AdminUsersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin-payments",
    element: (
      <ProtectedRoute>
        <AdminPaymentsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin-services",
    element: (
      <ProtectedRoute>
        <AdminServicesPage />
      </ProtectedRoute>
    ),
  },
]);