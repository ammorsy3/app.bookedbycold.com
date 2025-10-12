/* App.jsx — FINAL VERSION */
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
import { EnhancedOverview } from './components/EnhancedOverview';
// =================================================================================
// 1. UTILITY AND LAYOUT COMPONENTS
// =================================================================================
/* ---------- Site Footer ---------- */
function SiteFooter() {
  return (
    <footer className="py-8 mt-16 border-t border-gray-200 text-center text-sm leading-6 text-gray-500">
      <p className="mb-2">
        © {new Date().getFullYear()} <span className="font-medium text-gray-700">BookedByCold</span>.
        All rights reserved.
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
function NovuInbox({ subscriberId }: { subscriberId: string }) {
  const inboxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Return early if the ref isn't attached or if there's no subscriberId
    if (!inboxRef.current || !subscriberId) return;
    const novu = new NovuUI({
      options: {
        // THE PRODUCTION KEY IDENTIFIER
        applicationIdentifier: 'TBnR4lUjfOLQ',
        // CORRECT: Use the subscriberId prop passed to the component
        subscriber: '68be39f13c95e3a79082a7a9',
      },
    });
    novu.mountComponent({
      name: 'Inbox',
      element: inboxRef.current,
    });
    // Cleanup when the component unmounts or the subscriberId changes
    return () => novu?.unmountComponent?.();
  // Add subscriberId to the dependency array to re-initialize if it changes
  }, [subscriberId]); 
  return <div id="notification-inbox" ref={inboxRef} />;
}
/* ---------- Last-Updated Stamp ---------- */
function LastUpdated({ date = '9/7/2025, 6:37 PM 🌜' }) {
  return (
    <p className="text-right text-xs text-gray-500 mt-1">
      Date:&nbsp;
      <time dateTime="2025-09-07">{date}</time>
    </p>
  );
}


/* ---------- Dashboard Layout ---------- */
function DashboardLayout({ clientKey }: { clientKey: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigationTabs = [
    { id: 'overview',  label: 'Overview',  icon: BarChart3, to: `/${clientKey}/overview` },
    { id: 'crm',       label: 'CRM',       icon: Database,  to: `/${clientKey}/crm` },
    { id: 'leads',     label: 'Leads',     icon: Target,    to: `/${clientKey}/leads` },
    { id: 'finance',   label: 'Finance',   icon: DollarSign,to: `/${clientKey}/finance` },
    { id: 'reports',   label: 'Reports',   icon: FileText,  to: `/${clientKey}/reports` },
  ];
  const clientDisplayNames: { [key: string]: string } = {
    'tlnconsultinggroup': 'TLN Consulting Group',
  };
  const clientName = clientDisplayNames[clientKey] || 'Client Dashboard';
  const notifications = [
    { id: 1, message: 'New lead from LinkedIn campaign', time: '5 min ago', unread: true },
    { id: 2, message: 'Email campaign completed',        time: '1 h ago',   unread: true },
    { id: 3, message: 'Payment processed successfully',  time: '2 h ago',   unread: false },
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
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
  <h1 className="text-3xl font-bold text-gray-900">{clientName}</h1>
  <p className="text-lg text-gray-600 mt-1">
    <span className="inline-flex items-center gap-2">
      Welcome Travis 👋
      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
        Online
      </span>
    </span>
  </p>
  <p className="text-xs text-gray-400">
    Last overview tab update:&nbsp;
    <time dateTime="2025-09-07T18:37:00">9/17/2025, 5:00 PM 🌜</time>
  </p>

</div>

          <div className="flex items-center gap-6">
                  <NovuInbox subscriberId="68be39f13c95e3a79082a7a9" />
            <div className="relative">
              <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg" aria-label="Profile menu">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><span className="text-sm font-semibold text-blue-600">T</span></div>
<div className="hidden md:block text-left">
  <p className="text-sm font-medium text-gray-900">Travis Lairson</p>
  <p className="text-xs text-gray-500">{clientName}</p>
  <p className="text-[11px] text-gray-400">
    Current Time:&nbsp;
    <time dateTime={new Date().toISOString()}>
    {new Date().toLocaleString("en-US", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "America/Chicago", // CST/CDT
    })}</time>
  </p>
</div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Account Settings</button>
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Support</button>
                  <hr className="my-2" />
                  <button onClick={handleSignOut} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50">Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8 border-b border-gray-200">
            {navigationTabs.map((tab) => (
              <Link key={tab.id} to={tab.to} className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${location.pathname === tab.to ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                <tab.icon className="w-4 h-4" />{tab.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      {(notificationsOpen || profileMenuOpen) && <div className="fixed inset-0 z-30" onMouseDown={() => { setNotificationsOpen(false); setProfileMenuOpen(false); }} />}
      <Outlet />
      <SiteFooter />
      <SupportButton />
    </div>
  );
}
// =================================================================================
// 2. ALL YOUR PAGE COMPONENTS
// =================================================================================
function Overview() {
  const { clientKey } = useParams<{ clientKey: string }>();
  return <EnhancedOverview clientKey={clientKey || 'tlnconsultinggroup'} />;
}
/* ---------- CRM ---------- */
function CRM() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <iframe className="airtable-embed h-[750px] w-full border border-gray-300" title="CRM Airtable" src="https://airtable.com/embed/appdepbMC8HjPr3D9/shrGOao87lyCG8yKN" frameBorder="0" />
    </main>
  );
}
/* ---------- Leads ---------- */
function Leads() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <iframe className="airtable-embed h-[750px] w-full border border-gray-300" title="Leads Airtable" src="https://airtable.com/embed/appdepbMC8HjPr3D9/shrvaMOVVXFChOUOo?viewControls=on" frameBorder="0" />
    </main>
  );
}
/* ---------- Campaigns ---------- */
function Campaigns() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <iframe title="Monthly campaign snapshot" src="https://drive.google.com/file/d/1lbrZudT6pkugTEDPPGG5euqtaqYIjlhh/preview" className="w-full h-[750px] border border-gray-300 rounded-lg" allow="autoplay" />
    </main>
  );
}
/* ---------- Reports ---------- */
function Reports() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Latest Campaign Report</h2>
        <p className="text-gray-600 mb-6">Download the detailed PDF for this month's campaigns.</p>
        <a href="https://drive.google.com/uc?export=download&id=1Lzrn97Q0fgLgFUoYPnwhLLvSVSDDDqaG" className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors" target="_blank" rel="noopener noreferrer">
          Download PDF
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
        </a>
      </section>
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Walk-through Video</h2>
        <div style={{ position: 'relative', paddingBottom: '62.5%', height: 0 }}>
          <iframe src="https://www.loom.com/embed/b07ab1ca4d1040d0ae4941025b9286bc?sid=e7fa61ac-ed93-4745-b71f-7cf06856426d" frameBorder="0" allowFullScreen style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} title="Campaign report walkthrough" />
        </div>
      </section>
    </main>
  );
}
/* ---------- Finance ---------- */
function Finance() {
  const items = [
    { name: 'Make', desc: 'Platforms & AI integration', price: 36.38 },
    { name: 'Anthropic', desc: 'LLM for email writing', price: 40.0 },
    { name: 'Perplexity', desc: 'LLM for lead research & personalization', price: 40.0 },
    { name: 'Sales Navigator', desc: 'Lead generation', price: 119.0, reminder: 'Renews 29 Sep', highlightYellow: true },
    { name: 'Instantly.ai', desc: 'Cold emailing — hyper-growth plan', price: 97.0, alreadyPaid: true, strikeThrough: true },
    { name: 'Anymail Finder', desc: 'Lead enrichment', price: 199.0, alreadyPaid: true, strikeThrough: true },
    { name: 'Email Accounts', desc: '≈1,500 emails/day', price: 240.0, notDueYet: true, due: 'Due 15 Sep', dueSmall: 'Payment can wait' },
  ];
  const fullTotal = items.reduce((s, i) => s + i.price, 0);
  const totalDueToday = 116.0;
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-slate-50 border-b border-slate-200 mb-8">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms & Pricing</h1>
          <div className="flex items-center justify-between"><div><p className="text-lg text-slate-600">From: <span className="font-semibold text-slate-900">BookedByCold</span></p><p className="text-lg text-slate-600">To:&nbsp;&nbsp;&nbsp;<span className="font-semibold text-slate-900">TLN Consulting Group</span></p></div><p className="text-sm text-slate-500">Date: {new Date().toLocaleDateString()}</p></div>
        </div>
      </div>
      <section className="max-w-4xl mx-auto mb-12">
        <div className="flex items-center gap-3 mb-6"><DollarSign className="w-6 h-6 text-blue-600" /><h2 className="text-2xl font-bold text-slate-900">Pricing Terms</h2></div>
        <div className="grid md:grid-cols-2 gap-6"><div className="bg-slate-50 border border-slate-200 rounded-lg p-6"><div className="flex items-center gap-2 mb-3"><Calendar className="w-5 h-5 text-blue-600" /><h3 className="text-lg font-semibold">Month-to-Month Contract</h3></div><p className="text-slate-700"><span className="font-semibold">First Month:</span> 20% commission</p><p className="text-slate-700"><span className="font-semibold">Ongoing:</span> 10%/mo until cancellation</p></div><div className="bg-blue-50 border border-blue-200 rounded-lg p-6"><div className="flex items-center gap-2 mb-3"><FileText className="w-5 h-5 text-blue-600" /><h3 className="text-lg font-semibold">Long-Term Contract</h3></div><p className="text-slate-700"><span className="font-semibold">Duration:</span> 3–6 months+</p><p className="text-slate-700"><span className="font-semibold">Commission:</span> 15% one-time</p></div></div>
      </section>
      <section className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6"><Zap className="w-6 h-6 text-green-600" /><h2 className="text-2xl font-bold text-slate-900">Monthly Subscriptions</h2></div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full"><thead className="bg-slate-100"><tr><th className="text-left py-4 px-6 font-semibold">Service</th><th className="text-right py-4 px-6 font-semibold">Monthly Cost</th></tr></thead><tbody className="divide-y divide-slate-200">{items.map((item) => (<tr key={item.name} className={[item.alreadyPaid && 'bg-green-50 border-l-4 border-green-400', item.highlightYellow && 'bg-yellow-50 border-l-4 border-yellow-400', item.notDueYet && 'bg-yellow-50 border-l-4 border-yellow-400',].filter(Boolean).join(' ')}><td className="py-4 px-6 align-top text-slate-700"><div className="flex items-center gap-2"><span>{item.name}</span>{item.alreadyPaid && <span className="text-green-600">✓</span>}{(item.notDueYet || item.highlightYellow) && <span className="text-yellow-600">⚠️</span>}</div><span className="text-sm text-slate-500 block">{item.desc}</span>{item.alreadyPaid && <span className="text-sm text-green-700 block">Already paid</span>}{item.reminder && <span className="text-xs italic text-slate-500 block">{item.reminder}</span>}{item.notDueYet && (<><span className="text-sm text-yellow-700 block">{item.due}</span><span className="text-xs text-yellow-600 block">{item.dueSmall}</span></>)}</td><td className="py-4 px-6 text-right align-top font-semibold">{item.strikeThrough ? (<span className="text-slate-500"><s>${item.price.toFixed(2)}</s></span>) : (<>${item.price.toFixed(2)}</>)}</td></tr>))}</tbody></table>
        </div>
        <div className="flex flex-col items-end pt-4"><div className="text-slate-500 text-lg"><s>Total: ${fullTotal.toFixed(2)}</s></div><div className="text-xl font-bold">Total Due Today: ${totalDueToday.toFixed(2)}</div></div>
      </section>
      <section className="max-w-4xl mx-auto mt-8 flex items-start gap-2 text-sm text-slate-600"><Info className="w-4 h-4 mt-0.5 text-blue-600" /><p>Please settle Sales Navigator promptly; Email Accounts isn't due until 15 Sep.</p></section>
      <footer className="max-w-4xl mx-auto mt-12 pt-8 border-t border-slate-200 text-center"><p className="text-sm text-slate-500">Pricing structure effective immediately per agreed terms.</p><p className="text-sm text-slate-500 mt-2">Questions? Contact BookedByCold.</p></footer>
    </main>
  );
}
// =================================================================================
// 3. AUTHENTICATION AND ROUTING LOGIC
// =================================================================================
/* ---------- Protected Route Wrapper ---------- */
function ProtectedRoute() {
  const { clientKey } = useParams<{ clientKey: string }>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
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
    if (sessionAuth === 'true' || (localAuth === 'true' && authExpiry && Date.now() < Number(authExpiry))) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [clientKey]);
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }
  return isAuthenticated ? (
    <DashboardLayout clientKey={clientKey!} />
  ) : (
    <Navigate to="/login" replace />
  );
}
/* ---------- Main App Router ---------- */
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
