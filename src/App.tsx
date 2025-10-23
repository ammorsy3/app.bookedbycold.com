/* App.jsx — FINAL VERSION (LocalStorage + N8n Webhook only) */
import React, { useState, useEffect, useRef } from 'react';
import { AccountSettings, Support } from './ClientExtras';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation, useParams, Outlet } from 'react-router-dom';
import { NovuUI } from '@novu/js/ui';
import { FileText, DollarSign, Calendar, Zap, Info, Database, BarChart3, Target, Plus, Trash2, CheckCircle2, Pencil, X } from 'lucide-react';
import PasswordProtection from './components/PasswordProtection';
import { EnhancedOverview } from './components/EnhancedOverview';

function getDisplayNameForClient(clientKey: string): { name: string; initials: string } {
  const activeName = localStorage.getItem('tlnActiveUserName');
  let name = 'TLN User';
  if (clientKey === 'tlnconsultinggroup') {
    if (activeName && activeName.trim()) name = activeName.trim();
  }
  const initials = name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
  return { name, initials };
}

function SiteFooter() { return (<footer className="py-8 mt-16 border-t border-gray-200 text-center text-sm leading-6 text-gray-500"><p className="mb-2">© {new Date().getFullYear()} <span className="font-medium text-gray-700">BookedByCold</span>. All rights reserved.</p><p className="mb-2">This client portal contains confidential information. Please do not share data or access outside your organization.</p><a href="https://bookedbycold.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium">Visit public website →</a></footer>); }

function NovuInbox({ subscriberId }: { subscriberId: string }) {
  const inboxRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!inboxRef.current || !subscriberId) return; const novu = new NovuUI({ options: { applicationIdentifier: 'TBnR4lUjfOLQ', subscriber: '68be39f13c95e3a79082a7a9' } }); novu.mountComponent({ name: 'Inbox', element: inboxRef.current }); return () => novu?.unmountComponent?.(); }, [subscriberId]);
  return <div id="notification-inbox" ref={inboxRef} />;
}

function DashboardLayout({ clientKey }: { clientKey: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigationTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, to: `/${clientKey}/overview` },
    { id: 'crm', label: 'CRM', icon: Database, to: `/${clientKey}/crm` },
    { id: 'leads', label: 'Leads', icon: Target, to: `/${clientKey}/leads` },
    { id: 'finance', label: 'Finance', icon: DollarSign, to: `/${clientKey}/finance` },
    { id: 'reports', label: 'Reports', icon: FileText, to: `/${clientKey}/reports` },
  ];
  const clientDisplayNames: Record<string, string> = { 'tlnconsultinggroup': 'TLN Consulting Group' };
  const clientName = clientDisplayNames[clientKey] || 'Client Dashboard';
  const { name: userName, initials } = getDisplayNameForClient(clientKey);

  const handleSignOut = () => {
    const storageKey = `${clientKey}Authenticated`;
    const expiryKey = `${clientKey}AuthExpiry`;
    sessionStorage.removeItem(storageKey); localStorage.removeItem(storageKey); localStorage.removeItem(expiryKey); localStorage.removeItem('tlnActiveUserName'); localStorage.removeItem('tlnActiveUserEmail'); navigate('/login'); };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{clientName}</h1>
            <p className="text-lg text-gray-600 mt-1"><span className="inline-flex items-center gap-2">Welcome {userName} 👋<span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Online</span></span></p>
            <p className="text-xs text-gray-400">Last overview tab update:&nbsp;<time dateTime="2025-09-07T18:37:00">9/17/2025, 5:00 PM 🌜</time></p>
          </div>
          <div className="flex items-center gap-6">
            <NovuInbox subscriberId="68be39f13c95e3a79082a7a9" />
            <div className="relative">
              <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg" aria-label="Profile menu">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><span className="text-sm font-semibold text-blue-600">{initials}</span></div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">{clientName}</p>
                  <p className="text-[11px] text-gray-400">Current Time:&nbsp;<time dateTime={new Date().toISOString()}>{new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Chicago' })}</time></p>
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
      <Outlet />
      <SiteFooter />
    </div>
  );
}

function Overview() { const { clientKey } = useParams<{ clientKey: string }>(); return <EnhancedOverview clientKey={clientKey || 'tlnconsultinggroup'} />; }
function CRM() { return (<main className="max-w-7xl mx-auto px-6 py-8"><iframe className="airtable-embed h-[750px] w-full border border-gray-300" title="CRM Airtable" src="https://airtable.com/embed/appdepbMC8HjPr3D9/shrUpnBjEZjhPLJST" frameBorder="0" /></main>); }
function Leads() { return (<main className="max-w-7xl mx-auto px-6 py-8"><iframe className="airtable-embed h-[750px] w-full border border-gray-300" title="Leads Airtable" src="https://airtable.com/embed/appdepbMC8HjPr3D9/shrvaMOVVXFChOUOo?viewControls=on" frameBorder="0" /></main>); }

// Finance with LocalStorage + webhook tracking per action; send webhooks on Done
function Finance() {
  type Item = { id: string; name: string; desc: string | null; price: number; already_paid: boolean };
  type Action = { type: 'insert' | 'update' | 'delete'; item: Item; originalItem?: Item };

  const CLIENT_KEY = 'tlnconsultinggroup';
  const WEBHOOK_URL = 'https://n8n-self-host-9tn6.onrender.com/webhook-test/d65088f1-49c5-4bca-9daf-65d0c3ee2824';
  const STORAGE_KEY = 'tlnFinanceItems';

  const [items, setItems] = useState<Item[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingActions, setPendingActions] = useState<Action[]>([]);
  const [originalItems, setOriginalItems] = useState<Item[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      } else {
        const defaults: Item[] = [
          { id: 'make', name: 'Make', desc: 'Platforms & AI integration', price: 36.38, already_paid: false },
          { id: 'anthropic', name: 'Anthropic', desc: 'LLM for email writing', price: 40.0, already_paid: false },
          { id: 'perplexity', name: 'Perplexity', desc: 'LLM for lead research & personalization', price: 40.0, already_paid: false },
          { id: 'salesnav', name: 'Sales Navigator', desc: 'Lead generation — Renews 29 Sep', price: 119.0, already_paid: false },
          { id: 'instantly', name: 'Instantly.ai', desc: 'Cold emailing — hyper-growth plan', price: 97.0, already_paid: true },
          { id: 'anymail', name: 'Anymail Finder', desc: 'Lead enrichment', price: 199.0, already_paid: true },
          { id: 'emails', name: 'Email Accounts', desc: '≈1,500 emails/day', price: 240.0, already_paid: false },
        ];
        setItems(defaults);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      }
    } catch {
      setError('Failed to read local finance data.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Track original state when entering edit mode
  const handleStartEditing = () => {
    setIsEditing(true);
    setOriginalItems([...items]); // Deep copy for comparison
    setPendingActions([]); // Clear any stale actions
  };

  const sendWebhook = async (action: Action) => {
    try {
      const payload = {
        actionType: action.type,
        clientKey: 'TLN Consulting Group',
        name: action.item.name,
        description: action.item.desc || '',
        price: action.item.price.toString(),
        alreadyPaid: action.item.already_paid ? 'TRUE' : 'FALSE',
      };
      console.log('Sending webhook:', payload);
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.error('Webhook failed', e);
    }
  };

  const addItem = () => {
    const item: Item = { id: `item_${Date.now()}`, name: 'New tool', desc: 'Description', price: 0, already_paid: false };
    setItems((prev) => [item, ...prev]);
    setPendingActions((prev) => [...prev, { type: 'insert', item }]);
  };

  const removeItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    setPendingActions((prev) => [...prev, { type: 'delete', item }]);
  };

  const updateItem = (id: string, patch: Partial<Item>) => {
    // Find the current item before update
    const currentItem = items.find(i => i.id === id);
    if (!currentItem) return;

    // Update the item in state
    const updatedItem = { ...currentItem, ...patch };
    setItems((prev) => prev.map((i) => (i.id === id ? updatedItem : i)));

    // Track the action with the updated item data
    setPendingActions((prev) => {
      // Remove any previous update action for the same item to avoid duplicates
      const filteredActions = prev.filter(action => !(action.type === 'update' && action.item.id === id));
      return [...filteredActions, { type: 'update', item: updatedItem }];
    });
  };

  const handleDone = async () => {
    console.log('Sending', pendingActions.length, 'webhook notifications...');
    setIsEditing(false);
    for (const action of pendingActions) {
      await sendWebhook(action);
    }
    setPendingActions([]);
    setOriginalItems([]);
  };

  const totalDueToday = items.filter((i) => !i.already_paid).reduce((s, i) => s + (Number.isFinite(i.price) ? i.price : 0), 0);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-slate-50 border-b border-slate-200 mb-8">
        <div className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Finance</h1>
            <p className="text-slate-600">Track monthly subscriptions. Changes are saved locally and sent via webhook when Done.</p>
          </div>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button onClick={addItem} className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"><Plus className="w-4 h-4" /> Add</button>
                <button onClick={handleDone} className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Done {pendingActions.length > 0 && <span className="text-xs bg-green-800 px-1 rounded">{pendingActions.length}</span>}</button>
              </>
            ) : (
              <button onClick={handleStartEditing} className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg"><Pencil className="w-4 h-4" /> Edit</button>
            )}
          </div>
        </div>
      </div>

      <section className="max-w-4xl mx-auto">
        {error && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>)}
        <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left py-4 px-6 font-semibold">Service</th>
                <th className="text-left py-4 px-6 font-semibold">Details</th>
                <th className="text-right py-4 px-6 font-semibold">Monthly Cost</th>
                <th className="text-right py-4 px-6 font-semibold">Status</th>
                {isEditing && <th className="text-right py-4 px-6 font-semibold">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={5} className="py-6 px-6 text-center text-slate-500">Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="py-6 px-6 text-center text-slate-500">No entries yet. Click Edit → Add to create one.</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className={item.already_paid ? 'bg-green-50' : ''}>
                    <td className="py-4 px-6 align-top w-[25%]">
                      {isEditing ? (
                        <input value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:border-blue-500 outline-none" />
                      ) : (
                        <span className="font-medium text-slate-900">{item.name}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 align-top w-[35%]">
                      {isEditing ? (
                        <textarea value={item.desc || ''} onChange={(e) => updateItem(item.id, { desc: e.target.value })} className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:border-blue-500 outline-none resize-y" />
                      ) : (
                        <span className="text-slate-700">{item.desc}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right align-top w-[15%]">
                      {isEditing ? (
                        <input type="number" step="0.01" value={item.price} onChange={(e) => updateItem(item.id, { price: parseFloat(e.target.value || '0') })} className="w-28 text-right bg-white border border-slate-300 rounded px-2 py-1 focus:border-blue-500 outline-none" />
                      ) : (
                        <span className="font-semibold">${Number(item.price).toFixed(2)}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right align-top w-[15%]">
                      <button onClick={() => updateItem(item.id, { already_paid: !item.already_paid })} className={`inline-flex items-center gap-1 px-3 py-1 rounded border ${item.already_paid ? 'bg-green-100 text-green-700 border-green-300' : 'bg-white text-slate-600 border-slate-300'}`}>
                        <CheckCircle2 className="w-4 h-4" /> {item.already_paid ? 'Paid' : 'Mark Paid'}
                      </button>
                    </td>
                    {isEditing && (
                      <td className="py-4 px-6 text-right align-top w-[10%]">
                        <button onClick={() => removeItem(item.id)} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100"><Trash2 className="w-4 h-4" /> Remove</button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-end pt-4">
          <div className="text-slate-500 text-lg"><s>Total: ${items.reduce((s,i)=>s+(Number.isFinite(Number(i.price))?Number(i.price):0),0).toFixed(2)}</s></div>
          <div className="text-xl font-bold">Total Due Today: ${totalDueToday.toFixed(2)}</div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto mt-8 flex items-start gap-2 text-sm text-slate-600"><Info className="w-4 h-4 mt-0.5 text-blue-600" /><p>Use Edit to modify services, descriptions, or amounts. Click Paid to exclude an item from Today's total. Changes are saved locally and sent to webhook when Done.</p></section>
    </main>
  );
}

function Campaigns() { return (<main className="max-w-7xl mx-auto px-6 py-8"><iframe title="Monthly campaign snapshot" src="https://drive.google.com/file/d/1lbrZudT6pkugTEDPPGG5euqtaqYIjlhh/preview" className="w-full h-[750px] border border-gray-300 rounded-lg" allow="autoplay" /></main>); }
function Reports() { return (<main className="max-w-7xl mx-auto px-6 py-8"><section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-10"><h2 className="text-xl font-bold text-gray-900 mb-4">Latest Campaign Report</h2><p className="text-gray-600 mb-6">Download the detailed PDF for this month's campaigns.</p><a href="https://drive.google.com/uc?export=download&id=1Lzrn97Q0fgLgFUoYPnwhLLvSVSDDDqaG" className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors" target="_blank" rel="noopener noreferrer">Download PDF<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg></a></section></main>); }

function ProtectedRoute() { const { clientKey } = useParams<{ clientKey: string }>(); const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); useEffect(() => { if (!clientKey) { setIsAuthenticated(false); return; } const storageKey = `${clientKey}Authenticated`; const expiryKey = `${clientKey}AuthExpiry`; const sessionAuth = sessionStorage.getItem(storageKey); const localAuth = localStorage.getItem(storageKey); const authExpiry = localStorage.getItem(expiryKey); if (sessionAuth === 'true' || (localAuth === 'true' && authExpiry && Date.now() < Number(authExpiry))) { setIsAuthenticated(true); } else { setIsAuthenticated(false); } }, [clientKey]); if (isAuthenticated === null) return <div>Loading...</div>; return isAuthenticated ? <DashboardLayout clientKey={clientKey!} /> : <Navigate to="/login" replace />; }

export default function App() { return (<Router><Routes><Route path="/login" element={<PasswordProtection />} /><Route path="/:clientKey" element={<ProtectedRoute />}> <Route index element={<Navigate to="overview" replace />} /><Route path="overview" element={<Overview />} /><Route path="crm" element={<CRM />} /><Route path="leads" element={<Leads />} /><Route path="finance" element={<Finance />} /><Route path="campaigns" element={<Campaigns />} /><Route path="reports" element={<Reports />} /><Route path="account-settings" element={<AccountSettings />} /><Route path="support" element={<Support />} /></Route><Route path="/" element={<Navigate to="/login" replace />} /><Route path="*" element={<Navigate to="/login" replace />} /></Routes></Router>); }
