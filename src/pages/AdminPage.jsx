import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  LayoutDashboard,
  Users as UsersIcon,
  FileText,
  FileCheck,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../admin/AdminDashboard';
import Users from '../admin/Users';
import Reports from '../admin/Reports';
import Claims from '../admin/Claims';
import Settings from '../admin/Settings';

export const AdminPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = (path) => {
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/admin/reports')) return 'reports';
    if (path.includes('/admin/claims')) return 'claims';
    if (path.includes('/admin/settings')) return 'settings';
    return 'dashboard';
  };

  const activeTab = getTabFromPath(location.pathname);

  const handleTabChange = (tabId) => {
    if (tabId === 'dashboard') {
      navigate('/admin');
    } else {
      navigate(`/admin/${tabId}`);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'claims', label: 'Claims', icon: FileCheck },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Admin Top Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/30 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">Admin Moderation Console</h1>
              <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                Staff Only
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              National registry moderation, dispute handling, user privileges &amp; recovery oversight.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-slate-800 text-emerald-400 px-3 py-1.5 rounded-xl border border-slate-700">
            Moderator: {user?.name || 'Administrator'}
          </span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-slate-200 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      <div>
        {activeTab === 'dashboard' && <AdminDashboard onNavigateTab={handleTabChange} />}
        {activeTab === 'users' && <Users />}
        {activeTab === 'reports' && <Reports />}
        {activeTab === 'claims' && <Claims />}
        {activeTab === 'settings' && <Settings />}
      </div>
    </div>
  );
};

export default AdminPage;
