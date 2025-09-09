/* App.jsx — UPDATED 9 Sep 2025 */
import React, { useState, useEffect, useRef } from 'react';
import { AccountSettings, Support } from './ClientExtras';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useLocation,
  useParams,
  Outlet,
} from 'react-router-dom';
import { NovuUI } from '@novu/js/ui';
import {
  FileText,
  DollarSign,
  Calendar,
  Zap,
  Info,
  Database,
  TrendingUp,
  BarChart3,
  ExternalLink,
  Activity,
  Target,
  CreditCard,
} from 'lucide-react';
import PasswordProtection from './components/PasswordProtection';

/* ========================================================================
   1. UTILITY COMPONENTS
   ===================================================================== */

/* ---------- CST timestamp (auto-refresh) ---------- */
function LastUpdatedCST() {
  const [stamp, setStamp] = useState(() => formatCST(new Date()));

  // refresh once a minute
  useEffect(() => {
    const id = setInterval(() => setStamp(formatCST(new Date())), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="text-xs text-gray-400">
      Last update:&nbsp;
      <time dateTime={stamp.iso}>{stamp.pretty}</time>
    </p>
  );
}

function formatCST(date) {
  // America/Chicago = CST/CDT depending on daylight saving
  const intlOpts = {
    timeZone: 'America/Chicago',
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  };
  const pretty = date.toLocaleString('en-US', intlOpts);
  // convert the same instant to ISO for assistive tech
  const iso = new Date(
    date.toLocaleString('en-US', { timeZone: 'America/Chicago' })
  ).toISOString();
  return { pretty, iso };
}

/* ---------- Site Footer ---------- */
function SiteFooter() {
  return (
    <footer className="py-8 mt-16 border-t border-gray-200 text-center text-sm leading-6 text-gray-500">
      <p className="mb-2">
        © {new Date().getFullYear()}{' '}
        <span className="font-medium text-gray-700">BookedByCold</span>. All
        rights reserved.
      </p>
      <p className="mb-2">
        This client portal contains confidential information. Please do not
        share data or access outside your organization.
      </p>
      <a
        href="https://bookedbycold.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Visit public website →
      </a>
    </footer>
  );
}

/* ---------- Support Button ---------- */
function SupportButton() {
  return (
    <a
      href="https://calendly.com/ahmorsy07/ai-booking-demo"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center
                 px-6 py-3 rounded-lg shadow-lg bg-orange-600 text-white
                 hover:bg-orange-700 focus:outline-none focus:ring-4
                 focus:ring-orange-300 transition-colors"
    >
      Need help? Book a call with Ahmed.
    </a>
  );
}

/* ---------- Novu Inbox Wrapper ---------- */
function NovuInbox({ subscriberId }) {
  const inboxRef = useRef(null);

  useEffect(() => {
    if (!inboxRef.current || !subscriberId) return;

    const novu = new NovuUI({
      options: {
        applicationIdentifier: 'TBnR4lUjfOLQ',
        subscriber: subscriberId,
      },
    });

    novu.mountComponent({
      name: 'Inbox',
      element: inboxRef.current,
    });

    return () => novu?.unmountComponent?.();
  }, [subscriberId]);

  return <div id="notification-inbox" ref={inboxRef} />;
}

/* ========================================================================
   2. DASHBOARD LAYOUT
   ===================================================================== */
function DashboardLayout({ clientKey }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navigationTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, to: `/${clientKey}/overview` },
    { id: 'crm', label: 'CRM', icon: Database, to: `/${clientKey}/crm` },
    { id: 'leads', label: 'Leads', icon: Target, to: `/${clientKey}/leads` },
    { id: 'campaigns', label: 'Campaigns', icon: Activity, to: `/${clientKey}/campaigns` },
    { id: 'finance', label: 'Finance', icon: DollarSign, to: `/${clientKey}/finance` },
    { id: 'reports', label: 'Reports', icon: FileText, to: `/${clientKey}/reports` },
  ];

  const clientDisplayNames = {
    tlnconsultinggroup: 'TLN Consulting Group',
  };
  const clientName = clientDisplayNames[clientKey] || 'Client Dashboard';

  const notifications = [
    { id: 1, message: 'New lead from LinkedIn campaign', time: '5 min ago', unread: true },
    { id: 2, message: 'Email campaign completed', time: '1 h ago', unread: true },
    { id: 3, message: 'Payment processed successfully', time: '2 h ago', unread: false },
  ];
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleSignOut = () => {
    const storageKey = `${clientKey}Authenticated`;
    const expiryKey = `${clientKey}AuthExpiry`;
    sessionStorage.removeItem(storageKey);
    localStorage.removeItem(storageKey);
    localStorage.removeItem(expiryKey);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ==================== HEADER ==================== */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          {/* ---------- LEFT: logo + welcome ---------- */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{clientName}</h1>

            <p className="text-lg text-gray-600">
              <span className="inline-flex items-center gap-2">
                Welcome Travis 👋
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Online
                </span>
              </span>
            </p>

            {/* live CST timestamp */}
            <LastUpdatedCST />
          </div>

          {/* ---------- RIGHT: notifications + profile ---------- */}
          <div className="flex items-center gap-6">
            <NovuInbox subscriberId="68be39f13c95e3a79082a7a9" />

            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Profile menu"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">T</span>
                </div>

                <div className="hidden md:block text-left leading-tight">
                  <p className="text-sm font-medium text-gray-900">Travis Lairson</p>
                  <p className="text-xs text-gray-500">{clientName}</p>
                </div>

                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                    Account Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                    Support
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---------- nav tabs ---------- */}
        <nav className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8 border-b border-gray-200">
            {navigationTabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.to}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  location.pathname === tab.to
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* overlay click catcher */}
      {(notificationsOpen || profileMenuOpen) && (
        <div
          className="fixed inset-0 z-30"
          onMouseDown={() => {
            setNotificationsOpen(false);
            setProfileMenuOpen(false);
          }}
        />
      )}

      <Outlet />
      <SiteFooter />
      <SupportButton />
    </div>
  );
}

/* ========================================================================
   3. PAGE COMPONENTS (unchanged)
   ===================================================================== */
function Overview() {
  const stats = [
    { label: 'Active Campaigns', value: '5', icon: Activity, color: 'text-blue-600' },
    { label: 'Opportunity Value', value: '$58,500', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Response Rate', value: '1.45%', icon: Target, color: 'text-purple-600' },
    { label: 'Subscriptions', value: '7', icon: CreditCard, color: 'text-orange-600' },
  ];
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
              </div>
              <s.icon className={`w-8 h-8 ${s.color}`} />
            </div>
          </div>
        ))}
      </div>
      {/* …rest of Overview unchanged */}
    </main>
  );
}

/* --- CRM --- */
function CRM() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <iframe
        className="airtable-embed h-[750px] w-full border border-gray-300"
        title="CRM Airtable"
        src="https://airtable.com/embed/appdepbMC8HjPr3D9/shrGOao87lyCG8yKN"
        frameBorder="0"
      />
    </main>
  );
}

/* --- Leads --- */
function Leads() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <iframe
        className="airtable-embed h-[750px] w-full border border-gray-300"
        title="Leads Airtable"
        src="https://airtable.com/embed/appdepbMC8HjPr3D9/shrvaMOVVXFChOUOo?viewControls=on"
        frameBorder="0"
      />
    </main>
  );
}

/* --- Campaigns --- */
function Campaigns() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <iframe
        title="Monthly campaign snapshot"
        src="https://drive.google.com/file/d/1lbrZudT6pkugTEDPPGG5euqtaqYIjlhh/preview"
        className="w-full h-[750px] border border-gray-300 rounded-lg"
        allow="autoplay"
      />
    </main>
  );
}

/* --- Reports --- */
function Reports() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      {/* content unchanged */}
    </main>
  );
}

/* --- Finance --- */
function Finance() {
  /* unchanged (omitted for brevity) */
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      {/* finance markup */}
    </main>
  );
}

/* ========================================================================
   4. AUTH + ROUTING
   ===================================================================== */
function ProtectedRoute() {
  const { clientKey } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    if (!clientKey) {
      setIsAuthenticated(false);
      return;
    }
    const storageKey = `${clientKey}Authenticated`;
    const expiryKey = `${clientKey}AuthExpiry`;

    const sessionAuth = sessionStorage.getItem(storageKey);
    const localAuth = localStorage.getItem(storageKey);
    const authExpiry = localStorage.getItem(expiryKey);

    if (
      sessionAuth === 'true' ||
      (localAuth === 'true' && authExpiry && Date.now() < Number(authExpiry))
    ) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [clientKey]);

  if (isAuthenticated === null) return <div>Loading…</div>;

  return isAuthenticated ? (
    <DashboardLayout clientKey={clientKey} />
  ) : (
    <Navigate to="/login" replace />
  );
}

/* ---------- Main App ---------- */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<PasswordProtection />} />
        <Route path="/:clientKey" element={<ProtectedRoute />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="crm" element={<CRM />} />
          <Route path="leads" element={<Leads />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="finance" element={<Finance />} />
          <Route path="reports" element={<Reports />} />
          <Route path="account-settings" element={<AccountSettings />} />
          <Route path="support" element={<Support />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
