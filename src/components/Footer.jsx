import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  MapPin,
  Users,
  Lock,
  FileCheck2,
} from 'lucide-react';
import { APP_CONFIG, ROUTES } from '../utils/constants';
import { ReunivoEmblem } from './ReunivoLogo';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 text-sm mt-auto border-t border-slate-800">
      {/* Civic Trust Banner */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Verified National Community Initiative
                </p>
                <p className="text-xs text-slate-400">
                  Protecting privacy, verifying ownership claims, and reconnecting communities across Pakistan.
                </p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Protected Citizen Data</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60 flex items-center gap-1.5">
                <FileCheck2 className="w-3 h-3 text-emerald-400" />
                <span>Secure Claim Verification</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1 & 2: Brand Information */}
          <div className="lg:col-span-2 space-y-4">
            <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
              <ReunivoEmblem className="w-9 h-9 rounded-xl group-hover:scale-105 transition-transform" />
              <span className="font-heading font-black text-lg text-white tracking-wider">
                REUNIVO
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The centralized recovery network. We help citizens report lost possessions, register found items in good faith, and reunite families with missing loved ones.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Serving Punjab, Sindh, KPK, Balochistan, ICT, AJK &amp; GB</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>contact@reunivo.org</span>
              </div>
            </div>
          </div>

          {/* Col 3: Lost & Found Items */}
          <div>
            <h4 className="text-white font-heading font-bold text-xs uppercase tracking-wider mb-4">
              Item Recovery
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to={ROUTES.REPORT_LOST} className="hover:text-emerald-400 transition">
                  Report Lost Belonging
                </Link>
              </li>
              <li>
                <Link to={ROUTES.REPORT_FOUND} className="hover:text-emerald-400 transition">
                  Report Found Item
                </Link>
              </li>
              <li>
                <Link to={ROUTES.SEARCH} className="hover:text-emerald-400 transition">
                  Search Item Registry
                </Link>
              </li>
              <li>
                <Link to={ROUTES.HOW_IT_WORKS} className="hover:text-emerald-400 transition">
                  Verification Workflow
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Find & Reunite Family */}
          <div>
            <h4 className="text-white font-heading font-bold text-xs uppercase tracking-wider mb-4">
              Find &amp; Reunite
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to={ROUTES.FIND_REUNITE} className="text-emerald-400 hover:text-emerald-300 font-medium transition flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>Reunite Portal</span>
                </Link>
              </li>
              <li>
                <Link to="/find-and-reunite/report-person" className="hover:text-emerald-400 transition">
                  File Missing Person Case
                </Link>
              </li>
              <li>
                <Link to="/find-and-reunite/search" className="hover:text-emerald-400 transition">
                  Directory of Missing Persons
                </Link>
              </li>
              <li>
                <Link to={ROUTES.HOW_IT_WORKS} className="hover:text-emerald-400 transition">
                  Case Coordination Process
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Governance & Privacy */}
          <div>
            <h4 className="text-white font-heading font-bold text-xs uppercase tracking-wider mb-4">
              Trust &amp; Governance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to={ROUTES.ABOUT} className="hover:text-emerald-400 transition">
                  About Platform &amp; Mission
                </Link>
              </li>
              <li>
                <Link to={ROUTES.DISCLAIMER} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <span>Testing Disclaimer</span>
                  <span className="text-[10px] bg-amber-500/15 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/20 font-medium">Notice</span>
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ABOUT} className="hover:text-emerald-400 transition">
                  Privacy &amp; Data Shield
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ABOUT} className="hover:text-emerald-400 transition">
                  Community Safety Guidelines
                </Link>
              </li>
              <li>
                <Link to={ROUTES.DASHBOARD} className="hover:text-emerald-400 transition">
                  Member Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {APP_CONFIG.NAME}. Dedicated to the people of Pakistan.</p>
          <div className="flex items-center gap-4">
            <Link to={ROUTES.DISCLAIMER} className="text-slate-400 hover:text-amber-300 transition underline underline-offset-4 decoration-slate-700">
              Disclaimer
            </Link>
            <span className="font-mono text-[11px] text-amber-400/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Testing &amp; Development Build</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
