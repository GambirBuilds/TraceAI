/**
 * TraceAI Application Header
 * Contextual breadcrumbs, quick action controls, database notification center, and mobile drawer trigger.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Plus,
  HelpCircle,
  ChevronRight,
  FileText,
  Image,
  Mic,
  Video,
  Bell,
  Check,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Info
} from 'lucide-react';
import { Button } from '../common/Button';
import { useNotification } from '../../context/NotificationContext';
import { formatDate } from '../../utils/formatters';

export function Header({ onOpenMobileMenu }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotification();

  const notifRef = useRef(null);
  const newActionRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (newActionRef.current && !newActionRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute breadcrumbs
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/app') return [{ label: 'Dashboard', path: '/app' }];
    if (path === '/app/text') return [{ label: 'Dashboard', path: '/app' }, { label: 'Text Detection', path: '/app/text' }];
    if (path === '/app/image') return [{ label: 'Dashboard', path: '/app' }, { label: 'Image Detection', path: '/app/image' }];
    if (path === '/app/audio') return [{ label: 'Dashboard', path: '/app' }, { label: 'Audio Detection', path: '/app/audio' }];
    if (path === '/app/video') return [{ label: 'Dashboard', path: '/app' }, { label: 'Video Detection', path: '/app/video' }];
    if (path === '/app/history') return [{ label: 'Dashboard', path: '/app' }, { label: 'Analysis History', path: '/app/history' }];
    if (path === '/app/reports') return [{ label: 'Dashboard', path: '/app' }, { label: 'Audit Reports', path: '/app/reports' }];
    if (path === '/app/settings') return [{ label: 'Dashboard', path: '/app' }, { label: 'Settings', path: '/app/settings' }];
    if (path === '/app/admin') return [{ label: 'Dashboard', path: '/app' }, { label: 'Admin Console', path: '/app/admin' }];
    if (path === '/app/evaluation') return [{ label: 'Dashboard', path: '/app' }, { label: 'Evaluation Benchmarks', path: '/app/evaluation' }];
    return [{ label: 'Dashboard', path: '/app' }];
  };

  const breadcrumbs = getBreadcrumbs();

  const handleSelectDetector = (detectorPath) => {
    setIsDropdownOpen(false);
    navigate(detectorPath);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 relative z-30">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden text-slate-500 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumbs" className="flex items-center text-xs font-medium text-slate-500">
          <Link to="/" className="hover:text-slate-800 transition-colors hidden sm:inline">
            TraceAI
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.path}>
              <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 shrink-0" />
              {idx === breadcrumbs.length - 1 ? (
                <span className="text-slate-900 font-semibold">{crumb.label}</span>
              ) : (
                <Link to={crumb.path} className="hover:text-slate-800 transition-colors">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Notification Center & Quick Analysis Action */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to="/"
          className="hidden lg:inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Documentation</span>
        </Link>

        {/* Database Notification Center Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in duration-150">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-mono font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 flex items-start gap-3 transition-colors ${
                        item.isRead ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/30 hover:bg-blue-50/50'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.type === 'alert' ? (
                          <ShieldAlert className="w-4 h-4 text-rose-500" />
                        ) : (
                          <Info className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-xs ${item.isRead ? 'font-medium text-slate-800' : 'font-semibold text-slate-900'}`}>
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {item.message}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-[11px]">
                          {!item.isRead && (
                            <button
                              onClick={() => markAsRead(item.id)}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(item.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors ml-auto flex items-center gap-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Dismiss</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* New Analysis Dropdown */}
        <div className="relative" ref={newActionRef}>
          <Button
            size="sm"
            icon={Plus}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="hidden sm:inline">New Analysis</span>
            <span className="sm:hidden">Analyze</span>
          </Button>

          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 text-xs animate-in fade-in duration-100"
            >
              <button
                onClick={() => handleSelectDetector('/app/text')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Text Analysis</span>
              </button>
              <button
                onClick={() => handleSelectDetector('/app/image')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
              >
                <Image className="w-4 h-4 text-indigo-600" />
                <span>Image Forensics</span>
              </button>
              <button
                onClick={() => handleSelectDetector('/app/audio')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
              >
                <Mic className="w-4 h-4 text-teal-600" />
                <span>Audio Authenticity</span>
              </button>
              <button
                onClick={() => handleSelectDetector('/app/video')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
              >
                <Video className="w-4 h-4 text-orange-600" />
                <span>Video Inspection</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
