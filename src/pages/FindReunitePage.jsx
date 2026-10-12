import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Shield,
  HeartHandshake,
  PhoneCall,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  Lock,
  RefreshCw,
  UserPlus,
  Search,
  FileCheck2,
  Eye,
} from 'lucide-react';
import { ROUTES } from '../utils/constants';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import MissingPersonCard from '../components/MissingPersonCard';
import missingPersonService from '../services/missingPersonService';

export const FindReunitePage = () => {
  const [stats, setStats] = useState({ totalCases: 0, totalActive: 0, totalLocated: 0 });
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, casesRes] = await Promise.all([
        missingPersonService.getStats().catch(() => ({ stats: { totalCases: 0, totalActive: 0, totalLocated: 0 } })),
        missingPersonService.getMissingPersons({ limit: 6 }).catch(() => ({ missingPersons: [] })),
      ]);

      if (statsRes?.stats) {
        setStats(statsRes.stats);
      }
      if (casesRes?.missingPersons) {
        setCases(casesRes.missingPersons);
      }
    } catch (err) {
      console.error('Error fetching Find & Reunite data:', err);
      setError(err.message || 'Unable to load module data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-12 pb-16 max-w-6xl mx-auto">
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-semibold backdrop-blur-xs">
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            <span>Find &amp; Reunite Portal</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Connecting Families &amp; Missing Individuals Across Pakistan
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            A secure, dedicated civic initiative operating within REUNIVO to assist in reporting, cataloging sightings, and safely reuniting missing loved ones.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 max-w-lg">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-white/10 text-center">
              <span className="block text-xl sm:text-3xl font-extrabold text-white">
                {stats.totalCases}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-300 font-medium">Total Cases</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-white/10 text-center">
              <span className="block text-xl sm:text-3xl font-extrabold text-amber-300">
                {stats.totalActive}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-300 font-medium">Active Cases</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-white/10 text-center">
              <span className="block text-xl sm:text-3xl font-extrabold text-emerald-300">
                {stats.totalLocated}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-300 font-medium">Safely Located</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to={ROUTES.REPORT_PERSON}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3 rounded-2xl transition shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Report a Missing Person</span>
            </Link>
            <Link
              to={ROUTES.FIND_REUNITE_SEARCH}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-6 py-3 rounded-2xl border border-white/20 transition backdrop-blur-xs"
            >
              <Search className="w-4 h-4" />
              <span>Search People Directory</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Critical Safety & Law Enforcement Advisory */}
      <section className="bg-rose-50 border-l-4 border-rose-600 rounded-2xl p-5 sm:p-6 shadow-2xs">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h2 className="font-heading text-base font-bold text-slate-900">
              Immediate Emergency Protocol &amp; Pakistani Helplines
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              If an individual or minor is missing, <strong>immediately contact local police authorities first</strong> to lodge an official First Information Report (FIR). This platform acts as a community amplification aid and does not substitute emergency law enforcement services.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold">
              <span className="bg-white px-3 py-1.5 rounded-lg border border-rose-200 text-rose-800 flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                Police Emergency: <strong>15</strong>
              </span>
              <span className="bg-white px-3 py-1.5 rounded-lg border border-rose-200 text-rose-800 flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                Edhi Foundation Helpline: <strong>115</strong>
              </span>
              <span className="bg-white px-3 py-1.5 rounded-lg border border-rose-200 text-rose-800 flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                Chhipa Ambulance &amp; Shelter: <strong>1020</strong>
              </span>
              <span className="bg-white px-3 py-1.5 rounded-lg border border-rose-200 text-rose-800 flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                Madadgaar National Helpline (Women &amp; Children): <strong>1098</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Architectural Security & Privacy Notice */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 text-emerald-800 mb-4">
          <Shield className="w-6 h-6" />
          <h2 className="font-heading text-xl font-bold text-slate-900">Privacy-First Architecture</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          People reunification requires strict data safeguards. In accordance with platform privacy guidelines, sensitive reporter contact information, internal notes, and private verification documents are strictly shielded and never made accessible via public search feeds.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-1.5">
              <Lock className="w-4 h-4 text-emerald-700" />
              Protected Reporter Data
            </div>
            <p className="text-xs text-slate-600">
              Personal phone numbers and contact details are masked from public listings to safeguard reporting families from spam and extortion.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Verified Case Workflow
            </div>
            <p className="text-xs text-slate-600">
              Every missing person entry is indexed with clear lifecycle states: Active, Possible Match, Located, and Closed.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              Nationwide Smart Matching
            </div>
            <p className="text-xs text-slate-600">
              Continuous cross-referencing between missing person reports and sighting reports across all provinces of Pakistan.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Active Inquiries Feed (Public-Safe Listings Foundation) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900">Public Inquiries</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Recent verified missing individual notices across Pakistani regions.
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 bg-white rounded-2xl border border-slate-200">
            <Loading message="Loading missing person case records..." />
          </div>
        ) : error ? (
          <ErrorState
            title="Unable to load cases"
            description={error}
            onRetry={fetchData}
          />
        ) : cases.length === 0 ? (
          <EmptyState
            title="No Active Cases Currently Registered"
            description="There are currently no open missing individual reports registered in the database. When reports are filed, they will appear here once verified."
            icon={Users}
            actionLabel="Report a Missing Person"
            actionTo={ROUTES.REPORT_PERSON}
          />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cases.map((person) => (
                <MissingPersonCard key={person._id || person.id} person={person} />
              ))}
            </div>

            <div className="text-center pt-2">
              <Link
                to={ROUTES.FIND_REUNITE_SEARCH}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-5 py-2.5 rounded-xl transition"
              >
                <Search className="w-4 h-4" />
                <span>Explore Full Missing Person Directory</span>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 5. Reunification Process Guidelines */}
      <section className="bg-slate-50 rounded-2xl border border-slate-200 p-8 sm:p-10 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Reunification Lifecycle
          </span>
          <h2 className="font-heading text-2xl font-bold text-slate-900 mt-3">
            Civic Reunite Procedure
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
            Following strict privacy and verification standards to protect families and vulnerable individuals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              Step 01
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-sm">Citizen Case Filing</h3>
            <p className="text-xs text-slate-600">
              Structured citizen reporting with demographic details, identifying marks, and police FIR reference.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              Step 02
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-sm">Public Awareness &amp; Leads</h3>
            <p className="text-xs text-slate-600">
              Community members across Pakistani cities submit sighting leads and photographic evidence securely.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              Step 03
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-sm">Match Review</h3>
            <p className="text-xs text-slate-600">
              Case filers and moderators cross-examine incoming sighting leads against physical traits.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              Step 04
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-sm">Safe Handover &amp; Closure</h3>
            <p className="text-xs text-slate-600">
              Family verification workflow, safe handover coordination with authorities, and case resolution.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FindReunitePage;
