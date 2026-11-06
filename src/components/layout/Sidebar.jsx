/**
 * TraceAI Application Sidebar
 * Persistent navigation with collapsible mode, active link highlights, role-aware admin entry, and user profile panel.
 */

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Image,
  Mic,
  Video,
  Clock,
  FileCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
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

export function Sidebar({
  isCollapsed = false,
  onToggleCollapse
}) {
  const { user } = useAuth();
  const isAdminOrAnalyst = user && (user.role === 'admin' || user.role === 'senior_analyst');

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-200 ease-in-out shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
        <Link to="/app" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Shield className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 tracking-tight text-base whitespace-nowrap">
                Trace<span className="text-blue-600">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Content Intelligence
              </span>
            </div>
          )}
        </Link>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Primary Navigation List */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}

        {/* Admin & Evaluation Section */}
        {isAdminOrAnalyst && (
          <div className="pt-4 mt-4 border-t border-slate-100">
            {!isCollapsed && (
              <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Intelligence Ops
              </div>
            )}
            <NavLink
              to="/app/evaluation"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
              title={isCollapsed ? 'Evaluation Benchmarks' : undefined}
            >
              <Activity className="w-4 h-4 shrink-0 text-slate-500" />
              {!isCollapsed && <span className="truncate">Model Benchmarks</span>}
            </NavLink>

            <NavLink
              to="/app/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
              title={isCollapsed ? 'Admin Console' : undefined}
            >
              <Users className="w-4 h-4 shrink-0 text-slate-500" />
              {!isCollapsed && <span className="truncate">Admin Console</span>}
            </NavLink>
          </div>
        )}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-3 border-t border-slate-100">
        <Link
          to="/app/settings"
          className={`flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? user.name : undefined}
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-semibold text-xs shrink-0">
            {user.name?.charAt(0) || 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-800 truncate">
                {user.name}
              </span>
              <span className="text-[11px] text-slate-400 truncate capitalize">
                {user.role?.replace('_', ' ')} · {user.tier || 'Enterprise'}
              </span>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
