import React, { useState, useEffect, useCallback } from 'react';
import {
  Users as UsersIcon,
  Search,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import Button from '../components/Button';

export const Users = () => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // User details modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Status toggle confirmation modal
  const [statusModalUser, setStatusModalUser] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getUsers({
        q: searchQuery,
        role: roleFilter,
        status: statusFilter,
        page,
        limit: 15,
      });
      if (res?.success) {
        setUsers(res.users || []);
        setTotal(res.total || 0);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, roleFilter, statusFilter, page, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Open user details modal
  const handleOpenDetails = async (u) => {
    setSelectedUser(u);
    setIsLoadingDetails(true);
    try {
      const res = await adminService.getUserDetails(u._id || u.id);
      if (res?.success) {
        setUserDetails(res);
      }
    } catch {
      // fallback to basic
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Toggle user active status
  const handleToggleStatus = async () => {
    if (!statusModalUser) return;
    setIsUpdatingStatus(true);
    try {
      const newStatus = !statusModalUser.isActive;
      const res = await adminService.updateUserStatus(statusModalUser._id, newStatus);
      if (res?.success) {
        toast.success(`User status updated to ${newStatus ? 'Active' : 'Suspended'}`);
        setStatusModalUser(null);
        fetchUsers();
      } else {
        throw new Error(res?.message || 'Failed to update user status');
      }
    } catch (err) {
      toast.error(err.message || 'Could not update user status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-slate-900">User Account Management</h2>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
              {total} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            View registered citizens, moderate account access, and inspect report activity.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="user">Citizens</option>
            <option value="admin">Admins</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Deactivated</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <Loading message="Fetching registered citizen directory..." />
      ) : users.length === 0 ? (
        <p className="text-center py-10 text-xs text-slate-400">No users match your criteria.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                <th className="pb-3">User</th>
                <th className="pb-3">Contact</th>
                <th className="pb-3">City</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Reports</th>
                <th className="pb-3">Claims</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const isSelf = String(currentUser?._id || currentUser?.id) === String(u._id);
                const isActive = u.isActive !== false;

                return (
                  <tr key={u._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs uppercase">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div>{u.name}</div>
                          {u.isVerified && (
                            <span className="text-[10px] text-emerald-700 font-bold">Verified</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600">
                      <div>{u.email}</div>
                      {u.phone && <div className="text-slate-400 text-[11px]">{u.phone}</div>}
                    </td>
                    <td className="py-3 text-slate-600">{u.city || 'Pakistan'}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'admin'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role === 'admin' ? 'Administrator' : 'Citizen'}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-semibold text-slate-800">
                      {u.reportsCount || 0}
                    </td>
                    <td className="py-3 font-mono font-semibold text-slate-800">
                      {u.claimsCount || 0}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        ></span>
                        <span>{isActive ? 'Active' : 'Suspended'}</span>
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenDetails(u)}
                        className="text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                      >
                        Inspect
                      </button>

                      {/* Deactivate/Activate button */}
                      {!isSelf && (
                        <button
                          onClick={() => setStatusModalUser(u)}
                          className={`text-xs font-semibold cursor-pointer ${
                            isActive
                              ? 'text-rose-600 hover:text-rose-800'
                              : 'text-emerald-700 hover:text-emerald-900'
                          }`}
                        >
                          {isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: User Inspection Details */}
      <Modal
        isOpen={Boolean(selectedUser)}
        onClose={() => {
          setSelectedUser(null);
          setUserDetails(null);
        }}
        title="Citizen Account Dossier"
      >
        {selectedUser && (
          <div className="space-y-4 text-xs">
            {isLoadingDetails ? (
              <Loading message="Retrieving account records..." />
            ) : (
              <>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="font-bold text-sm text-slate-900">{selectedUser.name}</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div>
                      <span className="text-slate-400 block font-medium">Email</span>
                      <span className="font-semibold text-slate-800">{selectedUser.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Phone</span>
                      <span className="font-semibold text-slate-800">{selectedUser.phone || 'Unspecified'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">City</span>
                      <span className="font-semibold text-slate-800">{selectedUser.city || 'Pakistan'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Role</span>
                      <span className="font-semibold text-slate-800 uppercase">{selectedUser.role}</span>
                    </div>
                  </div>
                </div>

                {/* Submitted Reports */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Reports Registered ({userDetails?.reports?.length || 0})</h4>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2">
                    {userDetails?.reports?.length === 0 ? (
                      <p className="text-slate-400 py-2 text-center">No reports posted by this user.</p>
                    ) : (
                      userDetails?.reports?.map((r) => (
                        <div key={r._id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                          <span className="font-semibold text-slate-800 truncate max-w-[200px]">{r.title}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200">{r.type}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Claims */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Ownership Claims Filed ({userDetails?.claims?.length || 0})</h4>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2">
                    {userDetails?.claims?.length === 0 ? (
                      <p className="text-slate-400 py-2 text-center">No claims submitted by this user.</p>
                    ) : (
                      userDetails?.claims?.map((c) => (
                        <div key={c._id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                          <span className="font-semibold text-slate-800 truncate max-w-[200px]">{c.report?.title || 'Claim'}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">{c.status}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="pt-2 text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedUser(null);
                  setUserDetails(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Confirm Status Change */}
      <Modal
        isOpen={Boolean(statusModalUser)}
        onClose={() => setStatusModalUser(null)}
        title={statusModalUser?.isActive !== false ? 'Deactivate Account' : 'Reactivate Account'}
      >
        <div className="space-y-4 text-center">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
              statusModalUser?.isActive !== false
                ? 'bg-rose-100 text-rose-700'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {statusModalUser?.isActive !== false ? (
              <XCircle className="w-6 h-6" />
            ) : (
              <CheckCircle className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {statusModalUser?.isActive !== false
                ? `Deactivate account for ${statusModalUser?.name}?`
                : `Reactivate account for ${statusModalUser?.name}?`}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {statusModalUser?.isActive !== false
                ? 'Deactivated users are blocked from logging in, reporting items, and creating claims.'
                : 'This will restore login and reporting access for this citizen.'}
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              fullWidth
              disabled={isUpdatingStatus}
              onClick={() => setStatusModalUser(null)}
            >
              Cancel
            </Button>
            <Button
              variant={statusModalUser?.isActive !== false ? 'danger' : 'primary'}
              size="md"
              fullWidth
              loading={isUpdatingStatus}
              onClick={handleToggleStatus}
            >
              {statusModalUser?.isActive !== false ? 'Deactivate User' : 'Activate User'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
