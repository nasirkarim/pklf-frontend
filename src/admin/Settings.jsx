import React from 'react';
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Database,
  Lock,
  Sparkles,
  Server,
  FileCheck,
} from 'lucide-react';
import { APP_CONFIG } from '../utils/constants';

export const Settings = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-emerald-800" />
          <h2 className="text-lg font-bold text-slate-900">System Configuration &amp; Governance</h2>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Platform parameters, data protection policies, and matching engine rules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* National Platform Identity */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Server className="w-4 h-4 text-emerald-800" />
            <span>Platform Registry Core</span>
          </div>
          <div className="space-y-1.5 text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-400">Platform:</span>
              <span className="font-semibold text-slate-800">{APP_CONFIG.NAME}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-400">Jurisdiction:</span>
              <span className="font-semibold text-slate-800">Islamic Republic of Pakistan</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-400">Environment:</span>
              <span className="font-mono text-emerald-700 font-bold">Production / Local</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">System Engine:</span>
              <span className="font-semibold text-slate-800">Civic Recovery &amp; Matching Engine</span>
            </div>
          </div>
        </div>

        {/* Data Privacy & Security Governance */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Lock className="w-4 h-4 text-indigo-700" />
            <span>Privacy Protection Policies</span>
          </div>
          <div className="space-y-1.5 text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-400">Phone &amp; Email Masking:</span>
              <span className="font-bold text-emerald-700">Strict (Hidden Until Match Confirmed)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-400">Proof Documents:</span>
              <span className="font-bold text-emerald-700">Encrypted / Private Storage</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-400">Finder Secret Marks:</span>
              <span className="font-bold text-emerald-700">Excluded from Claim Forms</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Self-Claim Prevention:</span>
              <span className="font-bold text-emerald-700">Enforced by Backend</span>
            </div>
          </div>
        </div>

        {/* Smart Matching Engine Parameters */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Smart Matching Calibration</span>
          </div>
          <div className="space-y-1.5 text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-400">Category Weight:</span>
              <span className="font-mono font-bold text-slate-800">25 pts</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-400">City / Area Proximity:</span>
              <span className="font-mono font-bold text-slate-800">25 pts</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-400">Date Proximity (±7 days):</span>
              <span className="font-mono font-bold text-slate-800">15 pts</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Brand, Color &amp; Keywords:</span>
              <span className="font-mono font-bold text-slate-800">35 pts</span>
            </div>
          </div>
        </div>

        {/* Database & System Integrity */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Database className="w-4 h-4 text-sky-600" />
            <span>Database Integrity</span>
          </div>
          <div className="space-y-1.5 text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-400">Engine:</span>
              <span className="font-semibold text-slate-800">MongoDB / Mongoose ODM</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-400">Compound Indexes:</span>
              <span className="font-bold text-emerald-700">Active (Report, Claimant, Status)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-400">Duplicate Claim Lock:</span>
              <span className="font-bold text-emerald-700">Enforced</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Multi-Approval Lock:</span>
              <span className="font-bold text-emerald-700">Enforced (Single Approved Claim)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
