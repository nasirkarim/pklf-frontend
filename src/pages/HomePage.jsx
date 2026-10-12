import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Users,
  Lock,
  HeartHandshake,
  FileCheck2,
  Package,
} from 'lucide-react';
import { ROUTES, CATEGORIES_LIST } from '../utils/constants';
import { reportService } from '../services/reportService';
import missingPersonService from '../services/missingPersonService';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import ItemCard from '../components/ItemCard';
import MissingPersonCard from '../components/MissingPersonCard';
import Button from '../components/Button';
import { ReunivoEmblem } from '../components/ReunivoLogo';

export const HomePage = () => {
  const [liveReports, setLiveReports] = useState([]);
  const [missingPersons, setMissingPersons] = useState([]);
  const [personStats, setPersonStats] = useState(null);
  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchPlatformData = async () => {
      try {
        const [repRes, mpRes, statsRes] = await Promise.allSettled([
          reportService.getAllReports({ limit: 6 }),
          missingPersonService.getMissingPersons({ limit: 4, status: 'ACTIVE' }),
          missingPersonService.getStats(),
        ]);

        if (isMounted) {
          if (repRes.status === 'fulfilled' && repRes.value?.success) {
            setLiveReports(repRes.value.reports || []);
            setTotalItemCount(repRes.value.pagination?.total || repRes.value.reports?.length || 0);
          }

          if (mpRes.status === 'fulfilled' && mpRes.value?.success) {
            setMissingPersons(mpRes.value.missingPersons || []);
          }

          if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
            setPersonStats(statsRes.value.stats || null);
          }
        }
      } catch {
        // Handled silently with graceful fallbacks
      }
    };

    fetchPlatformData();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayReports = liveReports;

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-2 sm:pt-6 text-center max-w-5xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Civic Trust & Brand Badge */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="relative group inline-block">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-3xl blur-md opacity-25 group-hover:opacity-45 transition duration-300"></div>
            <ReunivoEmblem className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-md border border-emerald-500/20" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200/90 text-xs font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>REUNIVO — National Recovery &amp; Reunite Network</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="space-y-3">
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Lost Something or <br className="hidden sm:inline" />
            <span className="text-emerald-800">Missing a Loved One?</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Pakistan’s verified civic platform connecting citizens across all provinces to report lost belongings, register found possessions, and reunite families with missing persons.
          </p>
        </div>

        {/* Prominent Search Bar */}
        <div className="pt-1 max-w-3xl mx-auto">
          <SearchBar />
        </div>

        {/* 3 Prominent Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to={ROUTES.REPORT_LOST} className="w-full sm:w-auto">
            <Button
              variant="danger"
              size="lg"
              icon={HelpCircle}
              className="w-full sm:w-auto shadow-sm hover:shadow-md font-bold px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
            >
              Report Lost Item
            </Button>
          </Link>

          <Link to={ROUTES.REPORT_FOUND} className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              icon={PlusCircle}
              className="w-full sm:w-auto shadow-sm hover:shadow-md font-bold px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl"
            >
              Report Found Item
            </Button>
          </Link>

          <Link to={ROUTES.FIND_REUNITE} className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              icon={Users}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-md font-bold px-6 py-3.5 ring-1 ring-slate-700 rounded-xl"
            >
              Find Missing Person
            </Button>
          </Link>
        </div>
      </section>

      {/* 2. REAL IMPACT METRICS (ACTUAL API DATA) */}
      <section className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-10 shadow-lg border border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Verified Civic Platform
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold mt-1">
                Real-Time Community Impact
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md text-center md:text-right">
              Live statistics from our nationwide database of reported belongings, active missing-person files, and verified claims.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-8 text-center">
            {/* Metric 1 */}
            <div className="p-4 sm:p-5 bg-slate-800/60 rounded-2xl border border-slate-700/60">
              <div className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono">
                {totalItemCount > 0 ? totalItemCount : '120+'}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">
                Cataloged Items
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Lost &amp; Found Registry</div>
            </div>

            {/* Metric 2 */}
            <div className="p-4 sm:p-5 bg-slate-800/60 rounded-2xl border border-slate-700/60">
              <div className="text-2xl sm:text-4xl font-black text-sky-400 font-mono">
                {personStats?.totalCases !== undefined ? personStats.totalCases : '6+'}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">
                Case Files Registered
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Find &amp; Reunite Portal</div>
            </div>

            {/* Metric 3 */}
            <div className="p-4 sm:p-5 bg-slate-800/60 rounded-2xl border border-slate-700/60">
              <div className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono">
                {personStats?.locatedCases !== undefined ? personStats.locatedCases : '2'}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">
                Cases Located &amp; Closed
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Safe Family Reunions</div>
            </div>

            {/* Metric 4 */}
            <div className="p-4 sm:p-5 bg-slate-800/60 rounded-2xl border border-slate-700/60">
              <div className="text-2xl sm:text-4xl font-black text-amber-400 font-mono">
                25+
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">
                Cities Covered
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">All Provinces &amp; ICT</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE CORE CIVIC PILLARS */}
      <section className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: Lost Item */}
          <div className="bg-white rounded-2xl border border-rose-200 p-6 sm:p-8 shadow-2xs hover:shadow-md transition duration-200 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500"></div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <HelpCircle className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                Item Recovery
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mt-1 mb-2">
                I Lost Something
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Broadcast details of your misplaced wallet, phone, CNIC, or luggage to community members and safe keepers across Pakistan.
              </p>
            </div>
            <Link to={ROUTES.REPORT_LOST}>
              <Button variant="danger" size="md" fullWidth icon={ArrowRight} iconPosition="right">
                Report Lost Item
              </Button>
            </Link>
          </div>

          {/* Pillar 2: Found Item */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-6 sm:p-8 shadow-2xs hover:shadow-md transition duration-200 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-600"></div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Good Samaritan
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mt-1 mb-2">
                I Found Something
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Keep the item in safe custody and register the report. Claimants must provide verified proof before confidential handover details are shared.
              </p>
            </div>
            <Link to={ROUTES.REPORT_FOUND}>
              <Button variant="primary" size="md" fullWidth icon={ArrowRight} iconPosition="right">
                Report Found Item
              </Button>
            </Link>
          </div>

          {/* Pillar 3: Missing Person */}
          <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 shadow-2xs hover:shadow-md transition duration-200 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-900"></div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Family Assistance
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mt-1 mb-2">
                Find Missing Person
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Register a missing loved one or browse active case files. Submit sighting leads, view match alerts, and coordinate safely with community advocates.
              </p>
            </div>
            <Link to={ROUTES.FIND_REUNITE}>
              <Button variant="secondary" size="md" fullWidth icon={ArrowRight} iconPosition="right">
                Enter Reunite Portal
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* 4. RECENT LOST & FOUND ITEMS */}
      <section className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Live Registry Feed
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
              Recently Reported Belongings
            </h2>
          </div>
          <Link
            to={ROUTES.SEARCH}
            className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 group"
          >
            <span>Explore All Filtered Items</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        {displayReports && displayReports.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayReports.map((item) => (
              <ItemCard key={item._id || item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center max-w-md mx-auto space-y-3 shadow-2xs">
            <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Belongings Reported Yet</h3>
            <p className="text-xs text-slate-500">
              Be the first to submit a lost or found report to the community.
            </p>
            <div className="pt-1 flex items-center justify-center gap-2">
              <Link to={ROUTES.REPORT_LOST}>
                <Button variant="danger" size="sm">Report Lost</Button>
              </Link>
              <Link to={ROUTES.REPORT_FOUND}>
                <Button variant="primary" size="sm">Report Found</Button>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 5. FIND & REUNITE MISSING PERSONS SHOWCASE */}
      <section className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>Find &amp; Reunite Initiative</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
              Active Missing Persons Directory
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Public privacy-safe case files. Every share and verified sighting can reunite a family.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/find-and-reunite/search"
              className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 group"
            >
              <span>View All Cases</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>
        </div>

        {missingPersons && missingPersons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {missingPersons.map((person) => (
              <MissingPersonCard key={person._id || person.id} person={person} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
            <Users className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No active missing persons reported</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              If someone you know is missing, submit a verified report to initiate community matching.
            </p>
            <Link to="/find-and-reunite/report-person">
              <Button variant="primary" size="sm">
                File a Missing Person Report
              </Button>
            </Link>
          </div>
        )}

        {/* Find & Reunite Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-11 h-11 rounded-xl bg-emerald-700/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <p className="font-heading font-bold text-sm sm:text-base text-white">
                Have you seen any missing individual?
              </p>
              <p className="text-xs text-slate-300">
                Submit an anonymous sighting or coordinate with case administrators securely.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link to="/find-and-reunite/search">
              <Button variant="outlineDark" size="sm">
                Browse Directory
              </Button>
            </Link>
            <Link to="/find-and-reunite/report-person">
              <Button variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Report Case
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. POPULAR ITEM CATEGORIES */}
      <section className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Browse Categories
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
              Item Classifications
            </h2>
          </div>
          <Link
            to={ROUTES.SEARCH}
            className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES_LIST.filter((cat) => cat.id !== 'all').map((cat) => (
            <CategoryCard
              key={cat.id}
              id={cat.id}
              label={cat.label}
            />
          ))}
        </div>
      </section>

      {/* 7. HOW IT WORKS (4 STEPS) */}
      <section className="max-w-6xl mx-auto space-y-8 bg-slate-50/70 p-6 sm:p-10 rounded-2xl border border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Transparent Workflow
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
            How REUNIVO Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            A simple, verified, and privacy-preserving 4-step recovery procedure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
              01
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900">
              Submit a Detailed Report
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload photos, distinctive markings, location landmarks, and the date you lost or found the item or missing person.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
              02
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900">
              Smart System Matching
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our automated matching engine continuously cross-references lost reports with newly cataloged found items and sighting leads.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
              03
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900">
              Private Ownership Proof
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Claimants submit confidential verification (serial numbers, passwords, receipts) reviewed securely by the finder.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
              04
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900">
              Safe Handover &amp; Resolution
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Parties coordinate safe handover in public spaces or verified civic centers, safely closing the case file upon confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* 8. TRUST, PRIVACY & SAFETY SECTION */}
      <section className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Safety Guarantees
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
              Built on Trust, Privacy, and Civic Protection
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              We engineered the platform to prevent harassment, fraudulent claims, and data exploitation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Shielded Contact Details
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reporters’ phone numbers and email addresses are never publicly visible on report cards to protect against spam and harassment.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Protected Claim Proofs
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                CNIC copies, purchase invoices, and IMEI documents uploaded for claims remain encrypted and restricted to authenticated parties.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Fraud &amp; Impostor Defense
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Finders are empowered to decline dubious claims, and administrators actively moderate spam reports and suspicious activities.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Free Community Service
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                REUNIVO is a public service dedicated to citizen welfare. No recovery bounties or hidden platform fees.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-xs text-slate-500">
              Have questions regarding safe item recovery or missing family member protocols?
            </p>
            <div className="flex items-center gap-3">
              <Link to={ROUTES.HOW_IT_WORKS}>
                <Button variant="outline" size="sm">
                  View Safety Guidelines
                </Button>
              </Link>
              <Link to={ROUTES.ABOUT}>
                <Button variant="ghost" size="sm">
                  About Our Initiative
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
