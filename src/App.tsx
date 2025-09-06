import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FileText, DollarSign, Calendar, Zap, Info, Database, Users, TrendingUp, BarChart3, Settings, ExternalLink, Activity, Target, CreditCard, Clock } from 'lucide-react';
import PasswordProtection from './components/PasswordProtection';

function ClientDashboard() {
  const dashboardCards = [
    {
      title: 'CRM Dashboard',
      description: 'Access your complete customer relationship management system',
      icon: Database,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      link: 'https://airtable.com/appdepbMC8HjPr3D9/shrGOao87lyCG8yKN', // Will be replaced with actual Airtable link
      external: true,
      stats: '1,247 contacts',
    },
    {
      title: 'Financial Overview',
      description: 'Monthly subscriptions, terms, and pricing details',
      icon: DollarSign,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      link: '/finance',
      external: false,
      stats: '$116.00 due today',
    },
    {
      title: 'Leads Dashboard',
      description: 'Track and manage your lead generation pipeline',
      icon: Target,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      link: 'https://airtable.com/appdepbMC8HjPr3D9/shrsGQTzFOxvpxxzn', // Will be configured later
      external: true,
      stats: '89 new leads',
    },
    {
      title: 'Campaign Analytics',
      description: 'Monitor email campaigns and outreach performance',
      icon: BarChart3,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      link: 'https://app.instantly.ai/app/analytics/overview', // Will be configured later
      external: true,
      stats: '13.7K Emails Sent',
    },
  ];

  const quickStats = [
    { label: 'Active Campaigns', value: '5', icon: Activity, color: 'text-blue-600' },
    { label: 'Opportunities Value', value: '$58,500', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Response Rate', value: '1.45%', icon: Target, color: 'text-purple-600' },
    { label: 'Subscriptions', value: '7', icon: CreditCard, color: 'text-orange-600' },
  ];

  const recentActivity = [
    { action: 'New lead generated', time: '2 minutes ago', type: 'lead' },
    { action: 'Email campaign sent', time: '1 hour ago', type: 'campaign' },
    { action: 'Payment processed', time: '3 hours ago', type: 'payment' },
    { action: 'CRM updated', time: '5 hours ago', type: 'crm' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TLN Consulting Group</h1>
              <p className="text-lg text-gray-600 mt-1">Client Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="text-sm font-medium text-gray-900">{9/7/2025, 6 PM CST}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {dashboardCards.map((card) => (
            <div key={card.title} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  {card.external && (
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600 mb-4">{card.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">{card.stats}</span>
                  <a
                    href={card.link}
                    className={`inline-flex items-center gap-2 px-4 py-2 ${card.color} ${card.hoverColor} text-white rounded-lg font-medium transition-colors duration-200`}
                    {...(card.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    Access
                    {card.external ? <ExternalLink className="w-4 h-4" /> : <span>→</span>}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'lead' ? 'bg-purple-500' :
                    activity.type === 'campaign' ? 'bg-blue-500' :
                    activity.type === 'payment' ? 'bg-green-500' : 'bg-orange-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-150">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Add New Contact</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors duration-150">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">View Reports</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors duration-150">
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">Settings</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Airtable Embed */}
        <div className="mt-12">
          <iframe
            className="airtable-embed"
            src="https://airtable.com/embed/appdepbMC8HjPr3D9/shrGOao87lyCG8yKN"
            frameBorder="0"
            width="100%"
            height="533"
            style={{ background: 'transparent', border: '1px solid #ccc' }}
          ></iframe>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Powered by BookedByCold • Last sync: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function TermsAndPricing() {
  const items = [
    {
      name: 'Make',
      desc: 'Platforms & AI integration',
      price: 36.38,
    },
    {
      name: 'Anthropic',
      desc: 'LLM used for email writing',
      price: 40.0,
    },
    {
      name: 'Perplexity',
      desc: 'LLM used for lead research & personalisation',
      price: 40.0,
    },
    {
      name: 'Sales Navigator',
      desc: 'Lead generation',
      price: 199.0,
      reminder: 'Reminder: renews this month. Last date to keep Premium access is 29 September.',
      highlightYellow: true, // Added flag to highlight yellow
    },
    {
      name: 'Instantly.ai',
      desc: 'Cold emailing platform - hyper-growth plan',
      price: 97.0,
      alreadyPaid: true,
      strikeThrough: true,
    },
    {
      name: 'Anymail finder',
      desc: 'Lead enrichment service',
      price: 199.0,
      alreadyPaid: true,
      strikeThrough: true,
    },
    {
      name: 'Email Accounts',
      desc: 'Needed for ≈1500 emails a day',
      price: 240.0,
      notDueYet: true,
      due: 'Payment due: September 15th only',
      dueSmall: 'This payment can wait until the specified date',
    },
  ];

  const fullTotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const totalDueToday = 116.0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms & Pricing</h1>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-slate-600">From: <span className="font-semibold text-slate-900">BookedByCold</span></p>
              <p className="text-lg text-slate-600">To: <span className="font-semibold text-slate-900">TLN Consulting Group</span></p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Pricing Terms Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">Pricing Terms</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Month-to-Month */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-900">Month-to-Month Contract</h3>
              </div>
              <div className="space-y-2">
                <p className="text-slate-700">
                  <span className="font-semibold">First Month:</span> 20% commission
                </p>
                <p className="text-slate-700">
                  <span className="font-semibold">Ongoing:</span> 10% per month until cancellation
                </p>
              </div>
            </div>
            {/* Long-term */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-900">Long-Term Contract</h3>
              </div>
              <div className="space-y-2">
                <p className="text-slate-700">
                  <span className="font-semibold">Duration:</span> 3-6 months or more
                </p>
                <p className="text-slate-700">
                  <span className="font-semibold">Commission:</span> 15% one-time payment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Subscriptions */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-slate-900">Monthly Subscriptions</h2>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Service</th>
                  <th className="text-right py-4 px-6 font-semibold text-slate-900">Monthly Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map((item) => (
                  <tr
                    key={item.name}
                    className={
                      (item.alreadyPaid ? 'bg-green-50 border-l-4 border-green-400 ' : '') +
                      (item.notDueYet ? 'bg-yellow-50 border-l-4 border-yellow-400 ' : '') +
                      (item.highlightYellow ? 'bg-yellow-50 border-l-4 border-yellow-400 ' : '')
                    }
                  >
                    <td className="py-4 px-6 text-slate-700 align-top">
                      <div className="flex items-center gap-2">
                        <span>{item.name}</span>
                        {item.alreadyPaid && <span className="text-green-600">✓</span>}
                        {(item.notDueYet || item.highlightYellow) && <span className="text-yellow-600">⚠️</span>}
                      </div>
                      <span className="text-sm text-slate-500 block">{item.desc}</span>
                      {item.alreadyPaid && (
                        <span className="text-sm text-green-700 font-medium block">Already paid</span>
                      )}
                      {item.reminder && (
                        <span className="text-xs text-slate-500 block italic">{item.reminder}</span>
                      )}
                      {item.notDueYet && (
                        <>
                          <span className="text-sm text-yellow-700 font-medium block">{item.due}</span>
                          <span className="text-xs text-yellow-600 block">{item.dueSmall}</span>
                        </>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right font-semibold text-slate-900 align-top">
                      {item.strikeThrough ? (
                        <span className="text-slate-500">
                          <s>${item.price.toFixed(2)}</s>
                        </span>
                      ) : (
                        <>${item.price.toFixed(2)}</>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex flex-col items-end pt-4">
            <div className="text-slate-500 text-lg">
              <s>Total of all subscriptions: ${fullTotal.toFixed(2)}</s>
            </div>
            <div className="text-xl font-bold text-slate-900 mt-1">
              Total Due Today: ${totalDueToday.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Reminder & Footer */}
        <div className="mt-8 flex items-start gap-2 text-sm text-slate-600">
          <Info className="w-4 h-4 mt-0.5 text-blue-600" />
          <p>
            Please ensure Sales Navigator is settled promptly, and remember the Email Accounts fee isn’t due until 15 September.
          </p>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500">
            This pricing structure is effective immediately and subject to the agreed terms of service.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            For questions or clarifications, please contact BookedByCold directly.
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated in this session
    const authenticated = sessionStorage.getItem('tlnAuthenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  // If not authenticated, show password protection
  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={handleAuthenticated} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/finance" element={<TermsAndPricing />} />
        <Route path="/" element={<ClientDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
