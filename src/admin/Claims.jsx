import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, CheckCircle2, XCircle, PackageCheck } from 'lucide-react';
import { adminService } from '../services/adminService';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import Button from '../components/Button';

export const Claims = () => {
  const { toast } = useToast();
  const [claims, setClaims] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');

  // Approval modal
  const [approveClaimItem, setApproveClaimItem] = useState(null);
  const [isApproving, setIsApproving] = useState(false);

  // Rejection modal
  const [rejectClaimItem, setRejectClaimItem] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  // Recovery modal
  const [recoverClaimItem, setRecoverClaimItem] = useState(null);
  const [isRecovering, setIsRecovering] = useState(false);

  const fetchClaims = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getClaims({
        status: statusFilter,
        page,
        limit: 15,
      });
      if (res?.success) {
        setClaims(res.claims || []);
        setTotal(res.total || 0);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch claims');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, page, toast]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  // Handle Approve
  const handleApprove = async () => {
    if (!approveClaimItem) return;
    setIsApproving(true);
    try {
      const res = await adminService.approveClaim(approveClaimItem._id);
      if (res?.success) {
        toast.success('Claim approved successfully');
        setApproveClaimItem(null);
        fetchClaims();
      } else {
        throw new Error(res?.message || 'Approval failed');
      }
    } catch (err) {
      toast.error(err.message || 'Could not approve claim');
    } finally {
      setIsApproving(false);
    }
  };

  // Handle Reject
  const handleReject = async () => {
    if (!rejectClaimItem) return;
    setIsRejecting(true);
    try {
      const res = await adminService.rejectClaim(rejectClaimItem._id, rejectionReason);
      if (res?.success) {
        toast.success('Claim rejected');
        setRejectClaimItem(null);
        setRejectionReason('');
        fetchClaims();
      } else {
        throw new Error(res?.message || 'Rejection failed');
      }
    } catch (err) {
      toast.error(err.message || 'Could not reject claim');
    } finally {
      setIsRejecting(false);
    }
  };

  // Handle Recover
  const handleRecover = async () => {
    if (!recoverClaimItem) return;
    setIsRecovering(true);
    try {
      const res = await adminService.recoverClaim(recoverClaimItem._id);
      if (res?.success) {
        toast.success('Item marked as recovered');
        setRecoverClaimItem(null);
        fetchClaims();
      } else {
        throw new Error(res?.message || 'Recovery failed');
      }
    } catch (err) {
      toast.error(err.message || 'Could not mark item recovered');
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-slate-900">Ownership Claims Moderation</h2>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
              {total} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Review submitted ownership claims, moderate disputes, and oversee handover completions.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {['all', 'pending', 'approved', 'rejected', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer capitalize ${
                statusFilter === st
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Claims Table */}
      {isLoading ? (
        <Loading message="Retrieving claims queue..." />
      ) : claims.length === 0 ? (
        <p className="text-center py-10 text-xs text-slate-400">No claims match the selected status.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                <th className="pb-3">Found Item</th>
                <th className="pb-3">Claimant</th>
                <th className="pb-3">Finder</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {claims.map((c) => {
                const report = c.report || {};
                const claimant = c.claimant || {};
                const finder = report.user || {};
                const status = (c.status || 'PENDING').toUpperCase();
                const isPending = status === 'PENDING';
                const isApproved = status === 'APPROVED';

                return (
                  <tr key={c._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 font-semibold text-slate-900 max-w-[200px]">
                      <div className="truncate font-bold">{report.title || 'Found Property'}</div>
                      <div className="text-[11px] text-slate-400">
                        {report.foundCity || report.city || 'Pakistan'}
                      </div>
                    </td>
                    <td className="py-3 text-slate-700">
                      <div className="font-semibold">{claimant.name || 'Citizen'}</div>
                      <div className="text-[11px] text-slate-400">{claimant.city || 'Pakistan'}</div>
                    </td>
                    <td className="py-3 text-slate-600">
                      <div>{finder.name || 'Citizen'}</div>
                      <div className="text-[11px] text-slate-400">{finder.email}</div>
                    </td>
                    <td className="py-3 text-slate-500 whitespace-nowrap">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-PK') : 'Recently'}
                    </td>
                    <td className="py-3">
                      <StatusBadge type={status} size="xs" />
                    </td>
                    <td className="py-3 text-right space-x-2 whitespace-nowrap">
                      <Link to={`/claims/${c._id}`}>
                        <button className="text-xs text-slate-700 hover:text-slate-900 font-semibold cursor-pointer">
                          Inspect
                        </button>
                      </Link>

                      {isPending && (
                        <>
                          <button
                            onClick={() => setApproveClaimItem(c)}
                            className="text-xs text-emerald-800 hover:text-emerald-950 font-bold cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectClaimItem(c)}
                            className="text-xs text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {isApproved && (
                        <button
                          onClick={() => setRecoverClaimItem(c)}
                          className="text-xs text-teal-700 hover:text-teal-900 font-bold cursor-pointer"
                        >
                          Mark Recovered
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

      {/* Modal: Admin Approve */}
      <Modal
        isOpen={Boolean(approveClaimItem)}
        onClose={() => setApproveClaimItem(null)}
        title="Admin Confirm Claim Acceptance"
      >
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Approve Claim &amp; Confirm Match?</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              As an administrator, confirming this claim will transition the item report to <strong>MATCHED</strong> and notify the parties.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              fullWidth
              disabled={isApproving}
              onClick={() => setApproveClaimItem(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              loading={isApproving}
              onClick={handleApprove}
            >
              Confirm Acceptance
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Admin Reject */}
      <Modal
        isOpen={Boolean(rejectClaimItem)}
        onClose={() => setRejectClaimItem(null)}
        title="Admin Reject Claim"
      >
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Reject Ownership Claim</h3>
            <p className="text-xs text-slate-600 mt-1">
              Please enter an administrative rejection reason.
            </p>
          </div>
          <div className="text-left space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Reason:</label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Inconclusive ownership documentation; invalid serial reference."
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              fullWidth
              disabled={isRejecting}
              onClick={() => setRejectClaimItem(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              fullWidth
              loading={isRejecting}
              onClick={handleReject}
            >
              Reject Claim
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Admin Recover */}
      <Modal
        isOpen={Boolean(recoverClaimItem)}
        onClose={() => setRecoverClaimItem(null)}
        title="Admin Finalize Recovery"
      >
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Complete Item Recovery?</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Confirm that the item has been returned to the owner. This will permanently mark the report as <strong>RECOVERED</strong>.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              fullWidth
              disabled={isRecovering}
              onClick={() => setRecoverClaimItem(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              loading={isRecovering}
              onClick={handleRecover}
            >
              Yes, Mark Recovered
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Claims;
