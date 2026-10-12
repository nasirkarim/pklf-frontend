import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  PackageCheck,
  ArrowUpRight,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';

export const AdminDashboard = ({ onNavigateTab }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await adminService.getDashboard();
      if (res?.success) {
        setData(res);
      } else {
        throw new Error(res?.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to administrative database');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <Loading message="Loading administrative intelligence & telemetry..." />;
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
        <p className="text-sm font-semibold text-rose-800">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentReports = data?.recentReports || [];
  const pendingClaimsList = data?.pendingClaimsList || [];
  const recoveredItemsList = data?.recoveredItemsList || [];

  return (
    <div className="space-y-8">
      {/* Metrics Row 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Users */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('users')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Users</span>
            <Users className="w-4 h-4 text-sky-600 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-mono">
            {stats.totalUsers || 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Registered Pakistani citizens</p>
        </div>

        {/* Total Lost */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('reports')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Lost Reports</span>
            <FileText className="w-4 h-4 text-rose-500 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-mono">
            {stats.totalLostReports || 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Lost property notices</p>
        </div>

        {/* Total Found */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('reports')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Found Items</span>
            <FileText className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-mono">
            {stats.totalFoundReports || 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Items in citizen custody</p>
        </div>

        {/* Recovered Items */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('reports')}
          className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-2xs hover:border-emerald-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-semibold">Recovered Items</span>
            <PackageCheck className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-2 font-mono">
            {stats.recoveredItems || 0}
          </div>
          <p className="text-[11px] text-emerald-700/80 mt-1">Handover completed</p>
        </div>
      </div>

      {/* Metrics Row 2: Claims Funnel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pending Claims */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('claims')}
          className="bg-amber-50/60 border border-amber-200 p-5 rounded-2xl shadow-2xs cursor-pointer hover:border-amber-300 transition"
        >
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Claims</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 mt-2 font-mono">
            {stats.pendingClaims || 0}
          </div>
          <p className="text-[11px] text-amber-800 mt-1">Awaiting verification / decision</p>
        </div>

        {/* Approved Claims */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('claims')}
          className="bg-emerald-50/60 border border-emerald-200 p-5 rounded-2xl shadow-2xs cursor-pointer hover:border-emerald-300 transition"
        >
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-bold uppercase tracking-wider">Approved Claims</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mt-2 font-mono">
            {stats.approvedClaims || 0}
          </div>
          <p className="text-[11px] text-emerald-800 mt-1">Matches verified &amp; confirmed</p>
        </div>

        {/* Rejected Claims */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('claims')}
          className="bg-rose-50/60 border border-rose-200 p-5 rounded-2xl shadow-2xs cursor-pointer hover:border-rose-300 transition"
        >
          <div className="flex items-center justify-between text-rose-800">
            <span className="text-xs font-bold uppercase tracking-wider">Rejected Claims</span>
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-900 mt-2 font-mono">
            {stats.rejectedClaims || 0}
          </div>
          <p className="text-[11px] text-rose-800 mt-1">Proof mismatch / denied</p>
        </div>
      </div>

      {/* Metrics Row: Find & Reunite Module Status */}
      {stats.findAndReunite && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-700" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Find &amp; Reunite (Missing Persons Telemetry)
              </h3>
            </div>
            <Link
              to="/find-and-reunite/search"
              className="text-xs font-bold text-purple-700 hover:text-purple-900 inline-flex items-center gap-1"
            >
              <span>View National Directory</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block">Total Inquiries</span>
              <span className="text-xl font-bold font-mono text-slate-900">{stats.findAndReunite.totalMissingPersons || 0}</span>
            </div>
            <div className="bg-sky-50 p-3.5 rounded-2xl border border-sky-100">
              <span className="text-[11px] font-semibold text-sky-800 block">Active Looking</span>
              <span className="text-xl font-bold font-mono text-sky-900">{stats.findAndReunite.activeMissingPersons || 0}</span>
            </div>
            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-100">
              <span className="text-[11px] font-semibold text-amber-800 block">Pending Match Leads</span>
              <span className="text-xl font-bold font-mono text-amber-900">{stats.findAndReunite.pendingMatches || 0}</span>
            </div>
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100">
              <span className="text-[11px] font-semibold text-emerald-800 block">Safely Located</span>
              <span className="text-xl font-bold font-mono text-emerald-900">{stats.findAndReunite.locatedMissingPersons || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* Two-Column Grid: Pending Claims Queue & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Claims Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">Pending Claims Requiring Attention</h2>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('claims')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 cursor-pointer"
            >
              View All Claims →
            </button>
          </div>

          {pendingClaimsList.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No pending claims in the queue.</p>
          ) : (
            <div className="space-y-2.5">
              {pendingClaimsList.map((claim) => (
                <div
                  key={claim._id}
                  className="p-3.5 rounded-2xl border border-amber-100 bg-amber-50/20 hover:bg-amber-50/50 transition flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                      {claim.report?.title || 'Found Property'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Claimant: <span className="font-semibold text-slate-700">{claim.claimant?.name || 'Citizen'}</span> ({claim.claimant?.city || 'Pakistan'})
                    </div>
                  </div>

                  <Link to={`/claims/${claim._id}`}>
                    <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0">
                      Moderate
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Recovered Items */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-teal-600" />
              <h2 className="text-base font-bold text-slate-900">Recently Recovered Items</h2>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('reports')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 cursor-pointer"
            >
              All Reports →
            </button>
          </div>

          {recoveredItemsList.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No items marked as recovered yet.</p>
          ) : (
            <div className="space-y-2.5">
              {recoveredItemsList.map((item) => (
                <div
                  key={item._id}
                  className="p-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/20 transition flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Finder: {item.user?.name || 'Citizen'} • Owner: {item.matchedUser?.name || 'Citizen'}
                    </div>
                  </div>

                  <StatusBadge type="RECOVERED" size="xs" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent System Reports */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-600" />
            <h2 className="text-base font-bold text-slate-900">Recent Registry Reports</h2>
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab('reports')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 cursor-pointer"
          >
            Moderate All Reports →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                <th className="pb-3">Item Title</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Reported By</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentReports.map((report) => (
                <tr key={report._id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 font-semibold text-slate-900 max-w-[200px] truncate">
                    {report.title}
                  </td>
                  <td className="py-3">
                    <StatusBadge type={report.type} size="xs" />
                  </td>
                  <td className="py-3 text-slate-500">
                    {report.foundCity || report.city || 'Pakistan'}
                  </td>
                  <td className="py-3 text-slate-600">
                    {report.user?.name || 'Citizen'}
                  </td>
                  <td className="py-3">
                    <StatusBadge type={report.status} size="xs" />
                  </td>
                  <td className="py-3 text-right">
                    <Link to={`/item/${report._id}`}>
                      <button className="text-emerald-800 hover:text-emerald-900 font-bold cursor-pointer">
                        View
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
