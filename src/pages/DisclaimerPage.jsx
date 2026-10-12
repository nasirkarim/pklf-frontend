import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Building2,
  FileQuestion,
  Lock,
  Users,
  Scale,
  Mail,
  ArrowLeft,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { ROUTES } from '../utils/constants';

export const DisclaimerPage = () => {
  return (
    <div className="space-y-10 pb-16 max-w-4xl mx-auto">
      {/* Breadcrumb / Back Link */}
      <div className="pt-2">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="space-y-4 text-center sm:text-left border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Active Testing &amp; Development Stage</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Disclaimer — Reunivo Pakistan Lost &amp; Found
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
          Important legal and operational advisory regarding the testing status, data handling, and public usage of the Reunivo platform. Please read carefully before using any features.
        </p>
      </div>

      {/* Prominent High-Priority Alert Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-5 sm:p-6 rounded-r-2xl shadow-2xs space-y-2">
        <div className="flex items-center gap-2.5 text-amber-900 font-bold text-sm sm:text-base">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Demonstration &amp; Development Notice</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-800/90 leading-relaxed">
          Reunivo is currently in an active development phase. Features and database registries are subject to maintenance and testing adjustments. Do not submit sensitive real-world credentials or rely on the system for critical emergencies.
        </p>
      </div>

      {/* Disclaimer Sections */}
      <div className="space-y-6">

        {/* 1. Testing and Development Notice */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-3 transition hover:border-slate-300">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                Testing and Development Notice
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Reunivo is currently being tested and developed. The platform is provided for demonstration and testing purposes only. Its features, reports, and matching results may not work perfectly.
              </p>
            </div>
          </div>
        </section>

        {/* 2. No Government Affiliation */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-3 transition hover:border-slate-300">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 mt-0.5">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                No Government Affiliation
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Reunivo is an independent project and is not an official government department, police service, or law enforcement platform. It does not claim government approval or affiliation.
              </p>
              <div className="mt-3 bg-slate-50 rounded-xl p-3 text-xs text-slate-600 border border-slate-100 flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-600 shrink-0" />
                <span>
                  For official reporting of lost identity documents (CNICs, passports, licenses), please consult NADRA and your nearest police station.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Accuracy of Information */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-3 transition hover:border-slate-300">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
              <FileQuestion className="w-5 h-5" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                Accuracy of Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Information submitted by users may be incomplete, inaccurate, or unverified. A suggested match does not confirm ownership, identity, or the accuracy of a report.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Privacy and Safety */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-3 transition hover:border-slate-300">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                Privacy and Safety
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Do not submit real CNIC numbers, private contact details, exact home addresses, or other sensitive personal information during testing. Use fictional sample data instead.
              </p>
              <div className="mt-3 bg-rose-50/70 border border-rose-200/60 rounded-xl p-3 text-xs text-rose-900 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  Testing Safety Best Practices:
                </p>
                <ul className="list-disc list-inside text-rose-800/90 pl-1 space-y-0.5">
                  <li>Use fictitious names and placeholder numbers for demo testing.</li>
                  <li>Do not upload unredacted government cards or banking credentials.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Missing-Person Reports */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-3 transition hover:border-slate-300">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0 mt-0.5">
              <Users className="w-5 h-5" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                Missing-Person Reports
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Any missing-person feature is for testing and demonstration only. It is not a substitute for contacting the appropriate authorities. Do not rely on test reports or matching results for emergencies or real-world identification.
              </p>
              <div className="mt-3 bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-950 flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-700 shrink-0" />
                <span>
                  In the event of an urgent missing person situation, immediately contact the local Police emergency helpline (15) or law enforcement.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. No Guarantee */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-3 transition hover:border-slate-300">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
              <Scale className="w-5 h-5" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                No Guarantee
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                During testing, Reunivo does not guarantee the accuracy, availability, recovery of lost items, or reunification of people.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Contact */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-3 transition hover:border-slate-300">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                Contact
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                For questions, corrections, or privacy concerns, use the official contact method provided on the website.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="mailto:contact@reunivo.org"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition border border-emerald-200"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-700" />
                  <span>contact@reunivo.org</span>
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Navigation Footer Actions */}
      <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.ABOUT}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 transition"
          >
            About Platform
          </Link>
          <span className="text-slate-300">•</span>
          <Link
            to={ROUTES.HOW_IT_WORKS}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 transition"
          >
            How It Works
          </Link>
          <span className="text-slate-300">•</span>
          <Link
            to={ROUTES.SEARCH}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 transition"
          >
            Search Registry
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPage;
