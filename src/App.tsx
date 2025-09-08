/* App.jsx */
import React, { useEffect, useRef } from 'react';
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

/* -------------------------------------------------------------------------- */
/* 1.  UTILITIES                                                             */
/* -------------------------------------------------------------------------- */
function SiteFooter() {
  return (
    <footer className="py-8 mt-16 border-t border-gray-200 text-center text-sm leading-6 text-gray-500">
      <p className="mb-2">
        © {new Date().getFullYear()} <span className="font-medium text-gray-700">BookedByCold</span>. All rights reserved.
      </p>
      <p className="mb-2">
        This client portal contains confidential information. Please do not share data or access outside your organization.
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

/* -------------------------------------------------------------------------- */
/* 2.  NOVU WRAPPER                                                          */
/* -------------------------------------------------------------------------- */
function NovuInbox({ subscriberId }) {
  const inboxRef = useRef(null);

  useEffect(() => {
    if (!inboxRef.current || !subscriberId) return;

    const novu = new NovuUI({
      options: {
        applicationIdentifier: 'TBnR4lUjfOLQ', // ← your production key
        subscriber: subscriberId,
        // Keep default launcher so Novu renders its own bell + badge
        // No root:false → launcher stays
      },
    });

    // Mount the inbox (drawer) component
    novu.mountComponent({
      name: 'Inbox',
      element: inboxRef.current,
    });

    return () => novu?.unmountComponent?.();
  }, [subscriberId]);

  return <div id="notification-inbox" ref={inboxRef} />;
}

/* -------------------------------------------------------------------------- */
/* 3.  DASHBOARD LAYOUT                                                      */
/* -------------------------------------------------------------------------- */
function DashboardLayout({ clientKey }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationTabs = [
    { id: 'overview',  label: 'Overview',  icon: BarChart3, to: `/${clientKey}/overview` },
    { id: 'crm',       label: 'CRM',       icon: Database,  to: `/${clientKey}/crm` },
    { id: 'leads',     label: 'Leads',     icon: Target,    to: `/${clientKey}/leads` },
    { id: 'campaigns', label: 'Campaigns', icon: Activity,  to: `/${clientKey}/campaigns` },
    { id: 'finance',   label: 'Finance',   icon: DollarSign,to: `/${clientKey}/finance` },
    { id: 'reports',   label: 'Reports',   icon: FileText,  to: `/${clientKey}/reports` },
  ];

  const clientDisplayNames = {
    tlnconsultinggroup: 'TLN Consulting Group',
  };
  const clientName = clientDisplayNames[clientKey] || 'Client Dashboard';

  /* ---------- sign-out helper ---------- */
  const handleSignOut = () => {
    const storageKey = `${clientKey}Authenticated`;
    const expiryKey  = `${clientKey}AuthExpiry`;
    sessionStorage.removeItem(storageKey);
    localStorage.removeItem(storageKey);
    localStorage.removeItem(expiryKey);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          {/* -------- Title & greeting -------- */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{clientName}</h1>
            <p className="text-lg text-gray-600 mt-1">
              <span className="inline-flex items-center gap-2">
                Welcome Travis 👋
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Online</span>
              </span>
            </p>
          </div>

          {/* -------- Right-side controls -------- */}
          <div className="flex items-center gap-6">
            {/* Novu launcher renders automatically; we only need the inbox target */}
            <NovuInbox subscriberId="68be39f13c95e3a79082a7a9" />

            {/* Profile menu (unchanged) */}
            <ProfileMenu onSignOut={handleSignOut} clientName={clientName} />
          </div>
        </div>

        {/* -------- Nav tabs -------- */}
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

      {/* ------- Routed pages ------- */}
      <Outlet />

      <SiteFooter />
      <SupportButton />
    </div>
  );
}

/* Small helper component for profile dropdown */
function ProfileMenu({ onSignOut, clientName }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
        aria-label="Profile menu"
      >
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold text-blue-600">T</span>
        </div>
        <div className="hidden md:block text-left">
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

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
            Account Settings
          </button>
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
            Support
          </button>
          <hr className="my-2" />
          <button
            onClick={onSignOut}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4.  PAGE COMPONENTS (Overview, CRM, Leads, …) — unchanged for brevity      */
/*    … include the same page definitions you already have …                  */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* 5.  PROTECTED ROUTE + APP ROUTER                                          */
/* -------------------------------------------------------------------------- */
function ProtectedRoute() {
  const { clientKey } = useParams();
  const [authenticated, setAuthenticated] = React.useState(null);

  useEffect(() => {
    if (!clientKey) {
      setAuthenticated(false);
      return;
    }
    const sessionKey = `${clientKey}Authenticated`;
    const expiryKey  = `${clientKey}AuthExpiry`;
    const sessionAuth = sessionStorage.getItem(sessionKey);
    const localAuth   = localStorage.getItem(sessionKey);
    const expiry      = localStorage.getItem(expiryKey);

    if (sessionAuth === 'true' || (localAuth === 'true' && expiry && Date.now() < Number(expiry))) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, [clientKey]);

  if (authenticated === null) return <div>Loading…</div>;

  return authenticated ? (
    <DashboardLayout clientKey={clientKey} />
  ) : (
    <Navigate to="/login" replace />
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<PasswordProtection />} />

        <Route path="/:clientKey" element={<ProtectedRoute />}>
          <Route index element={<Navigate to="overview" replace />} />
          {/* … your other page routes … */}
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
