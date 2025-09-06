import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FileText, DollarSign, Calendar, Zap, Info } from 'lucide-react';

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
  return (
    <Router>
      <Routes>
        <Route path="/tlnconsultinggroup" element={<TermsAndPricing />} />
      </Routes>
    </Router>
  );
}

export default App;
