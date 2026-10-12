import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Trash2, Search } from 'lucide-react';
import { adminService } from '../services/adminService';
import { useToast } from '../context/ToastContext';
import { MAJOR_CITIES_PAKISTAN } from '../utils/constants';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import Button from '../components/Button';

export const Reports = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');

  // Status edit modal
  const [statusEditReport, setStatusEditReport] = useState(null);
  const [newStatus, setNewStatus] = useState('ACTIVE');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Delete confirmation modal
  const [deleteReportItem, setDeleteReportItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getReports({
        q: searchQuery,
        type: typeFilter,
        status: statusFilter,
        city: cityFilter,
        page,
        limit: 15,
      });
      if (res?.success) {
        setReports(res.reports || []);
        setTotal(res.total || 0);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch reports');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, typeFilter, statusFilter, cityFilter, page, toast]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!statusEditReport) return;
    setIsUpdatingStatus(true);
    try {
      const res = await adminService.updateReportStatus(statusEditReport._id, newStatus);
      if (res?.success) {
        toast.success(`Report status updated to ${newStatus}`);
        setStatusEditReport(null);
        fetchReports();
      } else {
        throw new Error(res?.message || 'Could not update report status');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle report deletion
  const handleDeleteReport = async () => {
    if (!deleteReportItem) return;
    setIsDeleting(true);
    try {
      const res = await adminService.deleteReport(deleteReportItem._id);
      if (res?.success) {
        toast.success('Report deleted successfully');
        setDeleteReportItem(null);
        fetchReports();
      } else {
        throw new Error(res?.message || 'Failed to delete report');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete report');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-slate-900">Reports Moderation &amp; Registry</h2>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
              {total} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Oversee all lost property claims and custody records across Pakistani provinces.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search title, brand..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
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
            <option value="active">Active</option>
            <option value="matched">Matched</option>
            <option value="recovered">Recovered</option>
            <option value="closed">Closed</option>
          </select>

          {/* City Filter */}
          <select
            value={cityFilter}
            onChange={(e) => {
              setCityFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
          >
            {MAJOR_CITIES_PAKISTAN.map((c) => (
              <option key={c} value={c === 'All Cities' ? 'all' : c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reports Table */}
      {isLoading ? (
        <Loading message="Filtering registry records..." />
      ) : reports.length === 0 ? (
        <p className="text-center py-10 text-xs text-slate-400">No reports found matching your filters.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                <th className="pb-3">Item</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Reported By</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((r) => {
                const photo =
                  r.photos?.[0] ||
                  r.image ||
                  'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=200&q=80';

                return (
                  <tr key={r._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        <img
                          src={photo}
                          alt={r.title}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                        />
                        <div className="max-w-[200px]">
                          <div className="truncate font-bold text-slate-900">{r.title}</div>
                          <div className="text-[11px] text-slate-400">
                            {r.brand || 'Unbranded'} {r.model ? `• ${r.model}` : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <StatusBadge type={r.type} size="xs" />
                    </td>
                    <td className="py-3 text-slate-600 capitalize">
                      {(r.category || 'other').replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 text-slate-600">
                      <div>{r.foundCity || r.city || 'Pakistan'}</div>
                      <div className="text-[11px] text-slate-400">{r.foundArea || r.area || ''}</div>
                    </td>
                    <td className="py-3 text-slate-600">
                      <div>{r.user?.name || 'Citizen'}</div>
                      <div className="text-[11px] text-slate-400">{r.user?.email}</div>
                    </td>
                    <td className="py-3">
                      <StatusBadge type={r.status} size="xs" />
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <Link to={`/item/${r._id}`}>
                        <button className="text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer">
                          Inspect
                        </button>
                      </Link>

                      <button
                        onClick={() => {
                          setStatusEditReport(r);
                          setNewStatus(r.status || 'ACTIVE');
                        }}
                        className="text-xs text-emerald-800 hover:text-emerald-900 font-semibold cursor-pointer"
                      >
                        Status
                      </button>

                      <button
                        onClick={() => setDeleteReportItem(r)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Edit Report Status */}
      <Modal
        isOpen={Boolean(statusEditReport)}
        onClose={() => setStatusEditReport(null)}
        title="Update Report Status"
      >
        {statusEditReport && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Item: {statusEditReport.title}</p>
              <p className="text-xs text-slate-500 mt-1">
                Select the target state for this report.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Report Status:</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
              >
                <option value="ACTIVE">ACTIVE (Open for search &amp; claims)</option>
                <option value="MATCHED">MATCHED (Claim approved &amp; handover in progress)</option>
                <option value="RECOVERED">RECOVERED (Item returned to owner)</option>
                <option value="CLOSED">CLOSED (Archived / Inactive)</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="md"
                fullWidth
                disabled={isUpdatingStatus}
                onClick={() => setStatusEditReport(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                fullWidth
                loading={isUpdatingStatus}
                onClick={handleUpdateStatus}
              >
                Save Status
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Delete Report Confirmation */}
      <Modal
        isOpen={Boolean(deleteReportItem)}
        onClose={() => setDeleteReportItem(null)}
        title="Delete Inappropriate Report"
      >
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Permanently remove this report?</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              This will permanently delete <strong>{deleteReportItem?.title}</strong> and all associated ownership claims. This action cannot be reversed.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              fullWidth
              disabled={isDeleting}
              onClick={() => setDeleteReportItem(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              fullWidth
              loading={isDeleting}
              onClick={handleDeleteReport}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Reports;
