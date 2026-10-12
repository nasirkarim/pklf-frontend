import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  GitCompare,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  PlusCircle,
  Lock,
  Users,
  Eye,
  UserCheck,
} from 'lucide-react';
import { ROUTES } from '../utils/constants';
import Button from '../components/Button';

export const HowItWorksPage = () => {
  const steps = [
    {
      step: '01',
      title: 'Report',
      subtitle: 'Catalog details in seconds',
      description:
        'Whether you misplaced a belonging or found an item in public, file a structured report. Describe unique attributes, upload photos, and pinpoint the city and area.',
      icon: FileText,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      step: '02',
      title: 'Search',
      subtitle: 'Filter across nationwide directory',
      description:
        'Browse through verified entries filtered by city, item category, brand, and date. Use keyword search to match potential lost items with found records.',
      icon: Search,
      color: 'bg-sky-100 text-sky-800 border-sky-200',
    },
    {
      step: '03',
      title: 'Match',
      subtitle: 'Algorithmic correlation',
      description:
        'Our platform identifies correlating attributes (such as dates, locations, categories, and keywords) to highlight potential matches between finders and owners.',
      icon: GitCompare,
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    },
    {
      step: '04',
      title: 'Verify',
      subtitle: 'Strict proof-of-ownership review',
      description:
        'To prevent fraudulent claims, the claimant submits ownership evidence: purchase invoice, unmasked ID matching, device lock verification, or photo evidence.',
      icon: ShieldCheck,
      color: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      step: '05',
      title: 'Recover',
      subtitle: 'Safe, coordinated physical handover',
      description:
        'Once claim verification is approved, both parties coordinate safe handover in monitored public venues or law enforcement desks.',
      icon: CheckCircle,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
  ];

  const reuniteSteps = [
    {
      step: 'A',
      title: 'Register Case File',
      description: 'Lodge an initial Police FIR, then register the missing individual with age, identifying marks, and recent photos.',
      icon: Users,
    },
    {
      step: 'B',
      title: 'Sighting Leads',
      description: 'Citizens across Pakistan submit sightings with date, city, and location details directly to the case profile.',
      icon: Eye,
    },
    {
      step: 'C',
      title: 'Family Verification & Safe Reunion',
      description: 'Case administrators and family review leads, coordinating with local authorities to ensure safe, verified reunion.',
      icon: UserCheck,
    },
  ];

  return (
    <div className="space-y-16 pb-16 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Transparent Civic Protocol
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          How REUNIVO Works
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          From the moment a belonging goes missing to the moment it is safely returned, our protocol ensures accountability, security, and civic goodwill.
        </p>
      </div>

      {/* 5-Step Cards Grid for Items */}
      <div className="space-y-4 sm:space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="font-heading text-xl font-bold text-slate-900">
            Item Recovery Workflow
          </h2>
          <p className="text-xs text-slate-500">
            Step-by-step procedure for lost and found property across Pakistan.
          </p>
        </div>

        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center gap-6"
            >
              {/* Step Number & Icon */}
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-3xl sm:text-4xl font-black font-mono text-slate-200">
                  {item.step}
                </span>
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-2xs ${item.color}`}
                >
                  <Icon className="w-7 h-7" />
                </div>
              </div>

              {/* Text content */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                    Step {idx + 1}: {item.title}
                  </h3>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {item.subtitle}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Find & Reunite Workflow Section */}
      <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200/80 p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Find &amp; Reunite Missing Persons Workflow
            </h2>
            <p className="text-xs text-slate-600">
              Civic coordination dedicated to finding missing children, elders, and vulnerable family members.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reuniteSteps.map((s) => {
            const SIcon = s.icon;
            return (
              <div key={s.step} className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center font-mono">
                    {s.step}
                  </span>
                  <SIcon className="w-4 h-4 text-emerald-700" />
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-sm">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Advisory & Handover Protocol */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-lg space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/40 text-emerald-400 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold">Safety &amp; Handover Guidelines</h3>
            <p className="text-xs text-slate-400">Strict community rules for in-person item return in Pakistan.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
            <span className="font-bold text-emerald-400 block mb-1">1. Public Locations Only</span>
            Meet in open, daylight settings such as shopping centers, Metro stations, or a local police front desk. Never invite strangers to private residences.
          </div>
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
            <span className="font-bold text-emerald-400 block mb-1">2. No Advance Payments</span>
            Beware of fraudulent shipping requests or advance fee scams. Legitimate finders return items in person or via verified community counters.
          </div>
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
            <span className="font-bold text-emerald-400 block mb-1">3. Mutual Verification</span>
            Both parties should record an informal handover acknowledgement or inspect ownership details together before departing.
          </div>
        </div>

        {/* 3 Primary Action Buttons inside How It Works */}
        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-3">
          <Link to={ROUTES.REPORT_LOST}>
            <Button variant="danger" size="md" icon={HelpCircle}>
              Report Lost Item
            </Button>
          </Link>
          <Link to={ROUTES.REPORT_FOUND}>
            <Button variant="primary" size="md" icon={PlusCircle}>
              Report Found Item
            </Button>
          </Link>
          <Link to={ROUTES.FIND_REUNITE}>
            <Button variant="secondary" size="md" icon={Users} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
              Find Missing Person
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
