/**
 * TraceAI Mobile Navigation Drawer
 */

import React, { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  X,
  Shield,
  LayoutDashboard,
  FileText,
  Image,
  Mic,
  Video,
  Clock,
  FileCheck,
  Settings,
  Activity,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Overview', path: '/app', icon: LayoutDashboard },
  { label: 'Text Detection', path: '/app/text', icon: FileText },
  { label: 'Image Detection', path: '/app/image', icon: Image },
  { label: 'Audio Detection', path: '/app/audio', icon: Mic },
  { label: 'Video Detection', path: '/app/video', icon: Video },
  { label: 'Analysis History', path: '/app/history', icon: Clock },
  { label: 'Reports', path: '/app/reports', icon: FileCheck },
  { label: 'Settings', path: '/app/settings', icon: Settings }
];

export function MobileNavigation({ isOpen, onClose }) {
  const { user } = useAuth();
  const isAdminOrAnalyst = user && (user.role === 'admin' || user.role === 'senior_analyst');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[80vw] bg-white h-full flex flex-col shadow-2xl z-10">
        <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
          <Link to="/app" onClick={onClose} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 text-base">
              Trace<span className="text-blue-600">AI</span>
            </span>
          </Link>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/app'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {isAdminOrAnalyst && (
            <div className="pt-3 mt-3 border-t border-slate-100">
              <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Intelligence Ops
              </div>
              <NavLink
                to="/app/evaluation"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <Activity className="w-4 h-4 shrink-0" />
                <span>Model Benchmarks</span>
              </NavLink>
              <NavLink
                to="/app/admin"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>Admin Console</span>
              </NavLink>
            </div>
          )}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-semibold text-xs shrink-0">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-800 truncate">
                {user.name}
              </span>
              <span className="text-[11px] text-slate-500 truncate">
                {user.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileNavigation;
