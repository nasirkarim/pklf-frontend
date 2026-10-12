import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  HelpCircle,
  CheckCircle2,
  FileCheck,
  User,
  PlusCircle,
  ArrowRight,
  Inbox,
  Users,
  Calendar,
  Eye,
  MapPin,
} from 'lucide-react';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import { claimService } from '../services/claimService';
import missingPersonService from '../services/missingPersonService';
import StatusBadge from '../components/StatusBadge';
import ReportCard from '../components/ReportCard';
import Button from '../components/Button';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

export const DashboardPage = () => {
  const location = useLocation();
  const { user } = useAuth();

  const [realLostReports, setRealLostReports] = useState([]);
  const [realFoundReports, setRealFoundReports] = useState([]);
  const [realClaims, setRealClaims] = useState([]);
  const [receivedClaims, setReceivedClaims] = useState([]);
  const [realMissingPersons, setRealMissingPersons] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [isLoadingClaims, setIsLoadingClaims] = useState(true);
  const [isLoadingReceivedClaims, setIsLoadingReceivedClaims] = useState(true);
  const [isLoadingMissingPersons, setIsLoadingMissingPersons] = useState(true);
  const [claimsSubTab, setClaimsSubTab] = useState('my'); // 'my' or 'received'
  const [claimStatusFilter, setClaimStatusFilter] = useState('ALL');

  // Determine active tab from pathname
  const currentPath = location.pathname;
  const isOverview = currentPath === ROUTES.DASHBOARD;
  const isLost = currentPath === ROUTES.DASHBOARD_LOST;
  const isFound = currentPath === ROUTES.DASHBOARD_FOUND;
  const isClaims = currentPath === ROUTES.DASHBOARD_CLAIMS;
  const isPersons = currentPath === ROUTES.DASHBOARD_PERSONS;

  // Fetch real user reports from API (both LOST and FOUND)
  const fetchMyReports = useCallback(async () => {
    setIsLoadingReports(true);
    try {
      const [lostRes, foundRes] = await Promise.all([
        reportService.getMyReports('LOST'),
        reportService.getMyReports('FOUND'),
      ]);

      if (lostRes?.success) {
        setRealLostReports(lostRes.reports || []);
      }
      if (foundRes?.success) {
        setRealFoundReports(foundRes.reports || []);
      }
    } catch {
      // Keep empty if error
    } finally {
      setIsLoadingReports(false);
    }
  }, []);

  // Fetch real user ownership claims
  const fetchMyClaims = useCallback(async () => {
    setIsLoadingClaims(true);
    try {
      const res = await claimService.getMyClaims();
      if (res?.success) {
        setRealClaims(res.claims || []);
      }
    } catch {
      // Keep empty
    } finally {
      setIsLoadingClaims(false);
    }
  }, []);

  // Fetch claims received on items reported as FOUND by this user
  const fetchReceivedClaims = useCallback(async () => {
    setIsLoadingReceivedClaims(true);
    try {
      const res = await claimService.getMyFoundItemsClaims();
      if (res?.success) {
        setReceivedClaims(res.claims || []);
      }
    } catch {
      // Keep empty
    } finally {
      setIsLoadingReceivedClaims(false);
    }
  }, []);

  // Fetch missing person reports filed by this user
  const fetchMyMissingPersons = useCallback(async () => {
    setIsLoadingMissingPersons(true);
    try {
      const res = await missingPersonService.getMyMissingPersons();
      if (res?.success) {
        setRealMissingPersons(res.missingPersons || []);
      }
    } catch {
      // Keep empty
    } finally {
      setIsLoadingMissingPersons(false);
    }
  }, []);

  useEffect(() => {
    fetchMyReports();
    fetchMyClaims();
    fetchReceivedClaims();
    fetchMyMissingPersons();
  }, [fetchMyReports, fetchMyClaims, fetchReceivedClaims, fetchMyMissingPersons]);

  // Tab definitions
  const totalLostCount = realLostReports.length;
  const totalFoundCount = realFoundReports.length;
  const totalClaimsCount = realClaims.length;
  const totalPersonsCount = realMissingPersons.length;
  const receivedPendingCount = receivedClaims.filter((c) => (c.status || '').toUpperCase() === 'PENDING').length;

  const tabs = [
    { to: ROUTES.DASHBOARD, label: 'Overview', icon: LayoutDashboard, active: isOverview },
    { to: ROUTES.DASHBOARD_LOST, label: 'My Lost Reports', icon: HelpCircle, active: isLost, count: totalLostCount, countColor: 'bg-rose-100 text-rose-700' },
    { to: ROUTES.DASHBOARD_FOUND, label: 'My Found Reports', icon: CheckCircle2, active: isFound, count: totalFoundCount, countColor: 'bg-emerald-100 text-emerald-800' },
    { to: ROUTES.DASHBOARD_CLAIMS, label: 'Ownership Claims', icon: FileCheck, active: isClaims, count: totalClaimsCount, countColor: 'bg-amber-100 text-amber-800' },
    { to: ROUTES.DASHBOARD_PERSONS, label: 'Missing Persons', icon: Users, active: isPersons, count: totalPersonsCount, countColor: 'bg-purple-100 text-purple-800' },
    { to: ROUTES.PROFILE, label: 'My Profile', icon: User, active: false },
  ];

  const displayName = user?.name || MOCK_USER_PROFILE.name;
  const displayStatus = user?.isVerified ? 'Verified Citizen' : 'Registered Citizen';

  // Filtered my claims
  const filteredMyClaims = realClaims.filter((c) => {
    if (claimStatusFilter === 'ALL') return true;
    return (c.status || '').toUpperCase() === claimStatusFilter;
  });

  // Filtered received claims
  const filteredReceivedClaims = receivedClaims.filter((c) => {
    if (claimStatusFilter === 'ALL') return true;
    return (c.status || '').toUpperCase() === claimStatusFilter;
  });

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Top Banner Greeting */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Citizen Portal
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {displayStatus}
            </span>
            {user?.role === 'admin' && (
              <Link
                to={ROUTES.ADMIN}
                className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full hover:bg-rose-700 transition"
              >
                Admin Console
              </Link>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Welcome back, {displayName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your lost notices, found custody reports, and ownership claim requests.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Link to={ROUTES.REPORT_LOST} className="flex-1 md:flex-none">
            <Button variant="danger" size="md" icon={PlusCircle} fullWidth>
              Report Lost
            </Button>
          </Link>
          <Link to={ROUTES.REPORT_FOUND} className="flex-1 md:flex-none">
            <Button variant="primary" size="md" icon={PlusCircle} fullWidth>
              Report Found
            </Button>
          </Link>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-slate-200 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition shrink-0 cursor-pointer ${
                tab.active
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    tab.active ? 'bg-white/20 text-white' : tab.countColor
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Alert banner for Finder if there are pending received claims */}
      {receivedPendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-amber-900">
                You have {receivedPendingCount} pending {receivedPendingCount === 1 ? 'claim' : 'claims'} to review!
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                Citizens have submitted ownership verification requests for items you reported as found.
              </p>
            </div>
          </div>
          <Link
            to={ROUTES.DASHBOARD_CLAIMS}
            onClick={() => setClaimsSubTab('received')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
          >
            <span>Review Claims</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Sub-View 1: OVERVIEW METRICS */}
      {isOverview && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-400 font-medium">Lost Reports</span>
              <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">{totalLostCount}</div>
              <p className="text-[11px] text-slate-500 mt-1">Submitted notices</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-400 font-medium">Found Items Kept</span>
              <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">{totalFoundCount}</div>
              <p className="text-[11px] text-slate-500 mt-1">Under custody</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-400 font-medium">My Claims</span>
              <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">{totalClaimsCount}</div>
              <p className="text-[11px] text-slate-500 mt-1">Submitted claims</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-400 font-medium">Claims Received</span>
              <div className="text-2xl font-bold text-amber-700 mt-2 font-mono">{receivedClaims.length}</div>
              <p className="text-[11px] text-slate-500 mt-1">{receivedPendingCount} pending review</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-400 font-medium">Missing Persons</span>
              <div className="text-2xl font-bold text-purple-700 mt-2 font-mono">{totalPersonsCount}</div>
              <p className="text-[11px] text-slate-500 mt-1">Reported inquiries</p>
            </div>
          </div>
        </div>
      )}

      {/* Sub-View: LOST REPORTS */}
      {(isOverview || isLost) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">🔍 My Lost Item Reports</h2>
              <p className="text-xs text-slate-500 mt-0.5">Items you reported as lost across Pakistan.</p>
            </div>
            <Link to={ROUTES.REPORT_LOST} className="text-xs font-semibold text-emerald-700 hover:text-emerald-900">
              + Report Another Lost Item
            </Link>
          </div>

          {isLoadingReports ? (
            <Loading message="Loading lost reports..." />
          ) : realLostReports.length === 0 ? (
            <EmptyState
              title="No lost reports found"
              description="You have not reported any lost property yet."
              actionLabel="Report Lost Item"
              actionTo={ROUTES.REPORT_LOST}
              icon={HelpCircle}
            />
          ) : (
            <div className="space-y-3">
              {realLostReports.map((report) => (
                <ReportCard key={report._id || report.id} report={report} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sub-View: FOUND REPORTS */}
      {(isOverview || isFound) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">📦 My Found Item Reports</h2>
              <p className="text-xs text-slate-500 mt-0.5">Found items you are safeguarding for owners.</p>
            </div>
            <Link to={ROUTES.REPORT_FOUND} className="text-xs font-semibold text-emerald-700 hover:text-emerald-900">
              + Report Found Item
            </Link>
          </div>

          {isLoadingReports ? (
            <Loading message="Loading found reports..." />
          ) : realFoundReports.length === 0 ? (
            <EmptyState
              title="No found reports yet"
              description="You have not registered any found property yet."
              actionLabel="Report Found Item"
              actionTo={ROUTES.REPORT_FOUND}
              icon={CheckCircle2}
            />
          ) : (
            <div className="space-y-3">
              {realFoundReports.map((report) => (
                <ReportCard key={report._id || report.id} report={report} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sub-View: OWNERSHIP CLAIMS (Section 11 & 12) */}
      {(isOverview || isClaims) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">📋 Ownership Claims Management</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Track your submitted claims and review claims filed by others on your found items.
              </p>
            </div>

            {/* Toggle between "My Claims" and "Claims on My Found Items" */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setClaimsSubTab('my')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  claimsSubTab === 'my'
                    ? 'bg-white text-emerald-900 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Claims ({realClaims.length})
              </button>
              <button
                type="button"
                onClick={() => setClaimsSubTab('received')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  claimsSubTab === 'received'
                    ? 'bg-white text-emerald-900 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Claims on My Found Items</span>
                {receivedPendingCount > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                    {receivedPendingCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Sub-Filters: ALL, PENDING, APPROVED, REJECTED, RECOVERED */}
          <div className="flex overflow-x-auto no-scrollbar gap-1.5 border-b border-slate-100 pb-3 text-xs font-semibold">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'RECOVERED'].map((st) => (
              <button
                key={st}
                onClick={() => setClaimStatusFilter(st)}
                className={`px-3 py-1 rounded-lg transition cursor-pointer capitalize ${
                  claimStatusFilter === st
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st.toLowerCase()}
              </button>
            ))}
          </div>

          {/* Tab 1: MY SUBMITTED CLAIMS */}
          {claimsSubTab === 'my' && (
            <div>
              {isLoadingClaims ? (
                <Loading message="Loading your submitted claims..." />
              ) : filteredMyClaims.length === 0 ? (
                <EmptyState
                  title="No claims matching filter"
                  description="You have not submitted any ownership claims under this category."
                  actionLabel="Search Found Registry"
                  actionTo={ROUTES.SEARCH}
                  icon={FileCheck}
                />
              ) : (
                <div className="space-y-3">
                  {filteredMyClaims.map((claim) => {
                    const report = claim.report || {};
                    const claimStatus = (claim.status || 'PENDING').toUpperCase();
                    const claimDate = claim.createdAt
                      ? new Date(claim.createdAt).toLocaleDateString('en-PK', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Recently';

                    const reportPhoto =
                      report.photos?.[0] ||
                      report.image ||
                      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80';

                    return (
                      <div
                        key={claim._id}
                        className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs hover:shadow-xs transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
                          <img
                            src={reportPhoto}
                            alt={report.title || 'Claimed item'}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                          />
                          <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <StatusBadge type={claimStatus} size="xs" />
                              <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                                {report.category || 'General'}
                              </span>
                            </div>

                            <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-1">
                              {report.title || 'Found Item'}
                            </h3>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{report.foundCity || report.city || 'Pakistan'}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>Submitted: {claimDate}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="self-end sm:self-center shrink-0">
                          <Link to={`/claims/${claim._id}`}>
                            <button
                              type="button"
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>View Claim Details</span>
                            </button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: CLAIMS ON MY FOUND ITEMS (FINDER DASHBOARD) */}
          {claimsSubTab === 'received' && (
            <div>
              {isLoadingReceivedClaims ? (
                <Loading message="Loading claims on your found items..." />
              ) : filteredReceivedClaims.length === 0 ? (
                <EmptyState
                  title="No claims received on your found items"
                  description="When citizens claim items that you reported as found, their verification requests will appear here for your review."
                  icon={Inbox}
                />
              ) : (
                <div className="space-y-3">
                  {filteredReceivedClaims.map((claim) => {
                    const report = claim.report || {};
                    const claimant = claim.claimant || {};
                    const claimStatus = (claim.status || 'PENDING').toUpperCase();
                    const isPending = claimStatus === 'PENDING';
                    const claimDate = claim.createdAt
                      ? new Date(claim.createdAt).toLocaleDateString('en-PK', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Recently';

                    const reportPhoto =
                      report.photos?.[0] ||
                      report.image ||
                      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80';

                    return (
                      <div
                        key={claim._id}
                        className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                          isPending
                            ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
                          <img
                            src={reportPhoto}
                            alt={report.title || 'Found item'}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                          />
                          <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <StatusBadge type={claimStatus} size="xs" />
                              <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                                Claim from: {claimant.name || 'Citizen'}
                              </span>
                              {claimant.isVerified && (
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                                  Verified
                                </span>
                              )}
                            </div>

                            <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-1">
                              {report.title || 'Found Item'}
                            </h3>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>Received: {claimDate}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>Claimant City: {claimant.city || 'Pakistan'}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="self-end sm:self-center shrink-0">
                          <Link to={`/claims/${claim._id}`}>
                            <button
                              type="button"
                              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
                                isPending
                                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                              }`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{isPending ? 'Review Claim' : 'View Claim'}</span>
                            </button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Sub-View: MISSING PERSONS (CITIZEN REUNIFICATION INQUIRIES) */}
      {(isOverview || isPersons) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-700" />
                <span>My Reported Missing Person Cases</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cases you registered with Pakistan Find &amp; Reunite. Manage verification statuses and review incoming leads.
              </p>
            </div>
            <Link
              to={ROUTES.REPORT_PERSON}
              className="text-xs font-semibold text-purple-700 hover:text-purple-900 inline-flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Report Another Person</span>
            </Link>
          </div>

          {isLoadingMissingPersons ? (
            <Loading message="Loading missing person case files..." />
          ) : realMissingPersons.length === 0 ? (
            <EmptyState
              title="No missing person reports filed"
              description="If a family member, loved one, or acquaintance is missing, you can register a secure case file here."
              actionLabel="Report a Missing Person"
              actionTo={ROUTES.REPORT_PERSON}
              icon={Users}
            />
          ) : (
            <div className="space-y-3">
              {realMissingPersons.map((p) => {
                const photo =
                  p.photo || (p.photos && p.photos.length > 0 ? p.photos[0] : null);
                const hasPendingLeads = p.pendingMatchesCount > 0;
                const formattedDate = p.lastSeenDate
                  ? new Date(p.lastSeenDate).toLocaleDateString('en-PK', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'Date unspecified';

                return (
                  <div
                    key={p._id || p.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
                  >
                    <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
                      {photo ? (
                        <img
                          src={photo}
                          alt={p.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 border border-slate-200">
                          <User className="w-8 h-8 stroke-1" />
                        </div>
                      )}

                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge type={p.status || 'ACTIVE'} size="xs" />
                          {hasPendingLeads && (
                            <span className="text-[11px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                              {p.pendingMatchesCount} {p.pendingMatchesCount === 1 ? 'Pending Lead' : 'Pending Leads'} Under Review
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400">
                            Ref: {(p._id || p.id).substring(0, 8)}
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-slate-900">
                          {p.name}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                          <span>
                            {p.age ? `${p.age} yrs` : 'Age unspecified'} • {p.gender}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>
                              {p.lastSeenArea ? `${p.lastSeenArea}, ` : ''}{p.lastSeenCity}
                            </span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>Last seen: {formattedDate}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="self-end sm:self-center shrink-0">
                      <Link to={`/find-and-reunite/person/${p._id || p.id}`}>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white transition cursor-pointer shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Case &amp; Review</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
