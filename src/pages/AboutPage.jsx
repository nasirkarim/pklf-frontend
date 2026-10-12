import React from 'react';
import {
  Compass,
  Target,
  Users,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react';
import { ROUTES } from '../utils/constants';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

export const AboutPage = () => {
  return (
    <div className="space-y-16 pb-16 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Civic Technology For Pakistan
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          About REUNIVO
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Creating a centralized, transparent digital infrastructure to connect lost belongings and missing loved ones with their rightful owners and families across Pakistan.
        </p>
      </div>

      {/* 1. What is REUNIVO? */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-2xs space-y-4">
        <div className="flex items-center gap-3 text-emerald-800">
          <Compass className="w-6 h-6" />
          <h2 className="font-heading text-2xl font-bold text-slate-900">What is REUNIVO?</h2>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          <strong>REUNIVO</strong> is an open community-driven civic platform built to address a major challenge in Pakistan: the lack of a unified registry for lost property and missing persons. Across public transit, educational institutions, shopping bazaars, mosques, and neighborhoods, citizens lose crucial identity documents (such as CNICs, educational credentials, and driving licenses), electronics, wallets, and keys every day.
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          Furthermore, when vulnerable individuals or children go missing, families often have to rely on scattered WhatsApp messages or social media posts with no central coordination. Our platform provides a verified, searchable, and privacy-shielded directory to coordinate recovery and reunification nationwide.
        </p>
        <div className="bg-slate-50 border-l-4 border-emerald-600 p-4 rounded-r-xl text-xs text-slate-600">
          <span className="font-bold text-slate-800">Civic Advisory: </span>
          REUNIVO is an independent community civic technology platform. We are not an official law enforcement agency. Citizens should always lodge an official First Information Report (FIR) with local police authorities and report lost national documents to NADRA.
        </div>
      </section>

      {/* 2. Core Pillars Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Our Mission */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-xl font-bold text-slate-900">Our Mission</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To restore lost property and reunite families swiftly, respectfully, and without friction. By equipping honest citizens with accessible tools, we turn goodwill into verified recovery results.
          </p>
        </div>

        {/* Pillar 2: Find & Reunite */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-xl font-bold text-slate-900">Find &amp; Reunite</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            A specialized humanitarian workflow for missing persons. Allows safe public case listing while shielding sensitive family contact numbers and enabling community sighting leads.
          </p>
        </div>

        {/* Pillar 3: Community Trust */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-xl font-bold text-slate-900">Community Trust</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Built on transparency and respect. Claimants must provide verified proof before confidential contacts are shared, preventing fraudulent claims and harassment.
          </p>
        </div>

        {/* Pillar 4: Safety First */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-xl font-bold text-slate-900">Safety First</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            User safety is our paramount priority. We advise public daylight meetings for item returns, forbid upfront shipping fees, and encrypt private claim proof documents.
          </p>
        </div>
      </section>

      {/* CTA Box */}
      <section className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 text-center max-w-3xl mx-auto space-y-4">
        <h3 className="font-heading text-2xl font-bold">Join the Nationwide Civic Recovery Network</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Help return misplaced belongings to their owners or search the registry for your misplaced item today.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to={ROUTES.SEARCH}>
            <Button variant="primary" size="md">
              Search All Reports
            </Button>
          </Link>
          <Link to={ROUTES.FIND_REUNITE}>
            <Button variant="outlineDark" size="md">
              Find &amp; Reunite Portal
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
