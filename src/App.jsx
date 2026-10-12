import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import MainLayout from './layouts/MainLayout';
import Loading from './components/Loading';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { ROUTES } from './utils/constants';

// Eager loaded public landing & core browsing routes
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';
import DisclaimerPage from './pages/DisclaimerPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Route-level lazy loading for heavier workflows, portals, and admin suite
const ReportLostPage = lazy(() => import('./pages/ReportLostPage'));
const ReportFoundPage = lazy(() => import('./pages/ReportFoundPage'));
const FindReunitePage = lazy(() => import('./pages/FindReunitePage'));
const ReportPersonPage = lazy(() => import('./pages/ReportPersonPage'));
const SearchPeoplePage = lazy(() => import('./pages/SearchPeoplePage'));
const PersonDetailsPage = lazy(() => import('./pages/PersonDetailsPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CreateClaimPage = lazy(() => import('./pages/CreateClaimPage'));
const ClaimDetailsPage = lazy(() => import('./pages/ClaimDetailsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 text-center shadow-xs my-8">
      <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-mono font-bold text-2xl">
        404
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
      <p className="text-xs sm:text-sm text-slate-600 mb-6">
        The page or report you requested does not exist or has been relocated.
      </p>
      <Link
        to={ROUTES.HOME}
        className="inline-block bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-800 transition shadow-xs"
      >
        Return to Home Page
      </Link>
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <Suspense fallback={<Loading message="Loading view..." fullHeight />}>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="report-lost" element={<ReportLostPage />} />
                <Route path="report-found" element={<ReportFoundPage />} />
                <Route path="find-and-reunite" element={<FindReunitePage />} />
                <Route path="find-and-reunite/report-person" element={<ReportPersonPage />} />
                <Route path="find-and-reunite/search" element={<SearchPeoplePage />} />
                <Route path="find-and-reunite/person/:id" element={<PersonDetailsPage />} />
                <Route path="item/:id" element={<ItemDetailsPage />} />
                <Route path="how-it-works" element={<HowItWorksPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="disclaimer" element={<DisclaimerPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />

                {/* Protected Member Dashboard routes */}
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="dashboard/lost"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="dashboard/found"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="dashboard/claims"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="dashboard/missing-persons"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Claim Submission & Verification Details routes */}
                <Route
                  path="claim/:reportId"
                  element={
                    <ProtectedRoute>
                      <CreateClaimPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="claims/create/:reportId"
                  element={
                    <ProtectedRoute>
                      <CreateClaimPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="claims/:id"
                  element={
                    <ProtectedRoute>
                      <ClaimDetailsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Citizen Profile route */}
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Console routes */}
                <Route
                  path="admin"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="admin/users"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="admin/reports"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="admin/claims"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="admin/settings"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />

                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
