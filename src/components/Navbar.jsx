import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Compass,
  PlusCircle,
  HelpCircle,
  User,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  LayoutDashboard,
  Users,
  Search,
  ChevronDown,
} from 'lucide-react';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { ReunivoIcon, ReunivoEmblem } from './ReunivoLogo';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { to: ROUTES.HOME, label: 'Home' },
    { to: ROUTES.SEARCH, label: 'Lost & Found' },
    { to: ROUTES.FIND_REUNITE, label: 'Find & Reunite', highlight: true },
    { to: ROUTES.HOW_IT_WORKS, label: 'How It Works' },
    { to: ROUTES.ABOUT, label: 'About' },
  ];

  const isActive = (path) => {
    if (path === ROUTES.HOME) return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* 1. Brand Logo */}
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-3 group shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-xl p-1"
            aria-label="REUNIVO Home"
          >
            <ReunivoEmblem className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl group-hover:scale-105 transition-transform duration-200" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-lg sm:text-xl text-slate-900 tracking-wider leading-none group-hover:text-emerald-800 transition-colors">
                  REUNIVO
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  PORTAL
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 mt-1">
                Lost &amp; Found Recovery Network
              </span>
            </div>
          </Link>

          {/* 2. Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                    active
                      ? 'bg-emerald-50 text-emerald-800 shadow-2xs ring-1 ring-emerald-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  {link.highlight && (
                    <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* 3. Action Buttons & Auth Section */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Quick Action: Report Dropdown or direct buttons */}
            <div className="flex items-center gap-1.5">
              <Link
                to={ROUTES.REPORT_LOST}
                className="px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1 shadow-2xs"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Lost</span>
              </Link>
              <Link
                to={ROUTES.REPORT_FOUND}
                className="px-3 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1 shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
                <span>Found</span>
              </Link>
            </div>

            {/* Authentication States */}
            {isAuthenticated ? (
              <div className="relative pl-2 border-l border-slate-200">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition cursor-pointer"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-bold text-slate-900 line-clamp-1 max-w-[100px]">
                      {user?.name?.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium -mt-0.5">
                      {isAdmin ? 'Admin' : 'Member'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to={ROUTES.DASHBOARD}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-800 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        <span>Member Dashboard</span>
                      </Link>

                      <Link
                        to={ROUTES.PROFILE}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-800 transition"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>My Profile &amp; Settings</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to={ROUTES.ADMIN}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50/50 hover:bg-rose-100/70 transition"
                        >
                          <ShieldAlert className="w-4 h-4 text-rose-600" />
                          <span>Admin Control Console</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  to={ROUTES.LOGIN}
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-emerald-800 hover:bg-slate-100 rounded-xl transition"
                >
                  Sign In
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs hover:shadow-sm transition"
                >
                  Join Network
                </Link>
              </div>
            )}
          </div>

          {/* 4. Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-8 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto"
          role="dialog"
          aria-label="Mobile Navigation"
        >

          {/* User profile summary if logged in */}
          {isAuthenticated && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate max-w-[180px]">{user?.email}</p>
                </div>
              </div>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200">
                  Admin
                </span>
              )}
            </div>
          )}

          {/* Quick Action Buttons on Mobile */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={ROUTES.REPORT_LOST}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Report Lost</span>
            </Link>
            <Link
              to={ROUTES.REPORT_FOUND}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-emerald-700" />
              <span>Report Found</span>
            </Link>
          </div>

          {/* Main Navigation Links */}
          <div className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    active
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.highlight && <Users className="w-4 h-4 text-emerald-600" />}
                    <span>{link.label}</span>
                  </span>
                  {link.highlight && (
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      Civic Portal
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Authenticated user mobile actions */}
          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-100 space-y-1">
              <Link
                to={ROUTES.DASHBOARD}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-100"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                <span>Member Dashboard</span>
              </Link>
              <Link
                to={ROUTES.PROFILE}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-100"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>My Profile &amp; Cases</span>
              </Link>
              {isAdmin && (
                <Link
                  to={ROUTES.ADMIN}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50/60"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Admin Control Console</span>
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 text-left mt-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to={ROUTES.LOGIN}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                to={ROUTES.REGISTER}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-xs"
              >
                Join Network
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
