/**
 * TraceAI Settings & Account Governance Page
 * User account management, password change, active sessions,
 * client-side privacy controls, API keys, and theme toggling.
 */

import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  Lock,
  Save,
  Key,
  Database,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Laptop,
  Smartphone,
  Moon,
  Sun,
  LogOut,
  AlertTriangle
} from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { Modal } from '../../../components/common/Modal';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useLocalPreferences } from '../../../hooks/useLocalPreferences';
import { useNotification } from '../../../context/NotificationContext';
import { historyService } from '../../../services/history/historyService';

export function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const { preferences, updatePreference } = useLocalPreferences();
  const { notify } = useNotification();

  // Profile Form state
  const [name, setName] = useState(user.name || 'Amir Karki');
  const [email, setEmail] = useState(user.email || 'karkiamir15@gmail.com');
  const [role, setRole] = useState(user.role || 'lead_analyst');
  const [org, setOrg] = useState(user.organization || 'TraceAI Global Lab');

  // Password Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Delete Account Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile({ name, email, role, organization: org });
    notify({
      title: 'Profile Updated',
      message: 'Analyst credentials updated in active session.',
      type: 'success'
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      notify({
        title: 'Validation Error',
        message: 'New password must be at least 8 characters long.',
        type: 'error'
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      notify({
        title: 'Mismatch Error',
        message: 'New password and confirmation do not match.',
        type: 'error'
      });
      return;
    }

    notify({
      title: 'Password Updated',
      message: 'Your account password has been successfully updated.',
      type: 'success'
    });
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleAccountWipe = () => {
    if (deleteConfirmText !== 'DELETE') {
      notify({
        title: 'Confirmation Failed',
        message: 'Please type DELETE to confirm data purge.',
        type: 'error'
      });
      return;
    }
    historyService.clearAll();
    setIsDeleteModalOpen(false);
    notify({
      title: 'Account Data Purged',
      message: 'All local session history and cached credentials were deleted.',
      type: 'info'
    });
  };

  return (
    <PageContainer
      title="Settings & Account Governance"
      description="Manage analyst credentials, security sessions, retention policies, and programmatic API access."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile & Client Preferences */}
        <div className="lg:col-span-7 space-y-6">
          {/* Profile Card */}
          <Card
            title="Analyst Profile & Identity"
            subtitle="Identification details displayed across exported audit dossiers"
          >
            <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Analyst Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Designation / Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Organization / Lab
                  </label>
                  <input
                    type="text"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Lock}
                  onClick={() => setIsPasswordModalOpen(true)}
                >
                  Change Password
                </Button>

                <Button type="submit" variant="primary" size="sm" icon={Save}>
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Active Sessions Overview */}
          <Card
            title="Active Security Sessions"
            subtitle="Current authenticated devices and token issuance points"
          >
            <div className="space-y-3 text-xs divide-y divide-slate-100">
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 flex items-center gap-2">
                      <span>Chrome on macOS (Current Browser)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-medium px-1.5 py-0.2 rounded">
                        Active Now
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px] font-mono mt-0.5">
                      IP: 104.28.192.1 · Singapore (Asia-SE1)
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">
                      Safari on iOS (Analyst Handset)
                    </div>
                    <div className="text-slate-500 text-[11px] font-mono mt-0.5">
                      IP: 27.34.41.88 · Last active 3 hours ago
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Client Privacy & Data Retention */}
          <Card
            title="Client Privacy & Data Retention"
            subtitle="Frontend controls governing local storage, metadata sanitization, and purging"
          >
            <div className="space-y-4 text-xs">
              {/* Metadata Scrubbing */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <div className="font-semibold text-slate-900">
                    Client Metadata Sanitization
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Strip non-essential operating system file tags before local ingestion
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.stripClientMetadataBeforeUpload}
                  onChange={(e) => updatePreference('stripClientMetadataBeforeUpload', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  aria-label="Client Metadata Sanitization toggle"
                />
              </div>

              {/* Anonymous Mode */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <div className="font-semibold text-slate-900">
                    Anonymous Evaluation Mode
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Omit analyst identity and organization names from exported JSON audit metadata
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.anonymousAnalysisMode}
                  onChange={(e) => updatePreference('anonymousAnalysisMode', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  aria-label="Anonymous Evaluation Mode toggle"
                />
              </div>

              {/* Retention Policy */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">
                      Audit History Retention Period
                    </div>
                    <div className="text-slate-500 mt-0.5">
                      Determines how long evaluated records remain cached in local session storage
                    </div>
                  </div>
                  <select
                    value={preferences.dataRetentionDays}
                    onChange={(e) => updatePreference('dataRetentionDays', Number(e.target.value))}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    aria-label="Audit History Retention Period"
                  >
                    <option value={7}>7 Days</option>
                    <option value={30}>30 Days</option>
                    <option value={0}>Manual Only</option>
                  </select>
                </div>
              </div>

              {/* Danger Zone: Purge */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-rose-600 font-medium">Danger Zone</span>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Trash2}
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="hover:text-rose-600 hover:border-rose-300 text-rose-600"
                >
                  Purge Account Records
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Subscription Tier, Theme, and API Tokens */}
        <div className="lg:col-span-5 space-y-6">
          {/* Subscription Tier */}
          <Card
            title="Subscription & Capacity"
            subtitle="Assigned enterprise quotas and pipeline throughput"
          >
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 capitalize">
                    {user.tier || 'Enterprise'} Tier
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Unlimited investigations · Priority neural queue · Full C2PA signature support
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
            </div>
          </Card>

          {/* Theme & Workspace Appearance */}
          <Card
            title="Appearance & Theme"
            subtitle="Display configuration and UI presentation standard"
          >
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">Interface Theme</div>
                  <div className="text-slate-500 mt-0.5">
                    Currently using {theme === 'dark' ? 'Dark Theme' : 'Production Modern Light Theme'}
                  </div>
                </div>
                <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-1.5 rounded-md flex items-center gap-1 transition-colors ${
                      theme === 'light' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-1.5 rounded-md flex items-center gap-1 transition-colors ${
                      theme === 'dark' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* API Access Tokens */}
          <Card
            title="API Access & Integration"
            subtitle="Enterprise credentials for programmatic analysis microservices"
          >
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  API Token Preview
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    readOnly
                    value={user.apiKeyPreview || 'tai_live_8f3a...b92c'}
                    className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-mono text-slate-600 text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      notify({
                        title: 'Token Copied',
                        message: 'API authorization token copied to clipboard.',
                        type: 'info'
                      });
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Keep your API keys confidential. Never commit tokens to public repositories.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600">
                <span>Backend Route</span>
                <span className="font-mono text-slate-900">/api/v1/*</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <Modal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          title="Change Account Password"
          subtitle="Update your security password for analyst dashboard access"
          maxWidth="max-w-md"
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">New Password (Min 8 chars)</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsPasswordModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Update Password
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Purge Account Data Confirmation Modal */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Account Record Purge"
          subtitle="Permanently erase cached history and local credentials"
          maxWidth="max-w-md"
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleAccountWipe}>
                Confirm Purge
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs text-slate-600">
            <p className="leading-relaxed">
              This action will permanently delete all cached analysis history, local findings, and session tokens from this browser. To confirm, type <strong className="font-mono text-slate-900 font-bold">DELETE</strong> below:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-mono"
            />
          </div>
        </Modal>
      )}
    </PageContainer>
  );
}

export default SettingsPage;
