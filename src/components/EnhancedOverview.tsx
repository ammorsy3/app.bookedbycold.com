import React, { useState, useEffect } from 'react';
import { ExternalLink, Database, DollarSign, Target, FileText, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardMetrics } from './DashboardMetrics';
import { PerformanceCharts } from './PerformanceCharts';
import { AutomatedInsights } from './AutomatedInsights';
import { RefreshButton } from './RefreshButton';
import { DateRangePicker } from './DateRangePicker';
import { simulateWebhookData, WebhookPayload } from '../utils/webhookSimulator';
import { getClientConfig } from '../clients';
import { formatCurrency, formatNumber } from '../utils/numberFormatter';

interface EnhancedOverviewProps { clientKey: string; }
interface WebhookResponse { reply_count?: string|number; reply_count_unique?: string|number; emails_sent_count?: string|number; new_leads_contacted_count?: string|number; total_opportunities?: string|number; total_opportunity_value?: string|number; total_interested?: string|number; response?: string; }

const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/f36n7r86d2wd8xlq51pwqlbh4koagp8d';

export function EnhancedOverview({ clientKey }: EnhancedOverviewProps) {
  const [metricsData, setMetricsData] = useState({ replyCount: 0, emailsSentCount: 0, newLeadsContactedCount: 0, totalOpportunities: 0, totalOpportunityValue: 0, totalInterested: 0 });
  const [startDate, setStartDate] = useState<Date | null>(new Date('2025-08-06'));
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const formatDateForWebhook = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

  const buildWebhookPayload = () => {
    const webhookPayload: Record<string, any> = {
      client_key: clientKey,
      timestamp: new Date().toISOString(),
      origin: typeof window !== 'undefined' ? window.location.origin : 'unknown',
    };

    if (startDate && endDate) {
      webhookPayload.startDate = formatDateForWebhook(startDate);
      webhookPayload.endDate = formatDateForWebhook(endDate);
    }

    return webhookPayload;
  };

  const sendWebhookRequest = async (
    webhookUrl: string,
    action: 'fetch_initial_metrics' | 'refresh_dashboard'
  ): Promise<WebhookResponse | null> => {
    try {
      const payload = {
        action,
        ...buildWebhookPayload(),
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('Error response:', errorText);
        return null;
      }

      const responseText = await response.text();

      let data: WebhookResponse = {};
      try {
        data = JSON.parse(responseText);
      } catch (parseError: any) {
        data = { response: responseText } as WebhookResponse;
      }

      if (!data || typeof data !== 'object') {
        console.warn('Webhook returned invalid data structure');
        return null;
      }

      return data;
    } catch (error: any) {
      console.error('Webhook request error details:', {
        error: error.message,
        type: error.name,
        stack: error.stack,
        url: webhookUrl,
      });

      return null;
    }
  };

  const fetchWebhookData = async (webhookUrl: string): Promise<WebhookResponse | null> => {
    return sendWebhookRequest(webhookUrl, 'fetch_initial_metrics');
  };

  const updateMetricsFromWebhook = (webhookData: WebhookResponse | WebhookPayload) => {
    const parseNumber = (value: any): number => {
      if (value === null || value === undefined || value === '') return 0;
      const parsed = typeof value === 'string' ? parseInt(value, 10) : Number(value);
      return isNaN(parsed) ? 0 : parsed;
    };

    const newMetrics = {
      replyCount: parseNumber('replyCount' in webhookData ? webhookData.replyCount : webhookData.reply_count || webhookData.reply_count_unique),
      emailsSentCount: parseNumber('emailsSentCount' in webhookData ? webhookData.emailsSentCount : webhookData.emails_sent_count),
      newLeadsContactedCount: parseNumber('newLeadsContactedCount' in webhookData ? webhookData.newLeadsContactedCount : webhookData.new_leads_contacted_count),
      totalOpportunities: parseNumber('totalOpportunities' in webhookData ? webhookData.totalOpportunities : webhookData.total_opportunities),
      totalOpportunityValue: parseNumber('totalOpportunityValue' in webhookData ? webhookData.totalOpportunityValue : webhookData.total_opportunity_value),
      totalInterested: parseNumber('totalInterested' in webhookData ? webhookData.totalInterested : webhookData.total_opportunities),
    };

    setMetricsData(newMetrics);
  };

  const triggerWebhook = async (webhookUrl: string): Promise<WebhookResponse | null> => {
    const webhookData = await sendWebhookRequest(webhookUrl, 'refresh_dashboard');
    if (!webhookData) {
      throw new Error('Webhook did not return data. Please verify the Make.com scenario is active.');
    }
    return webhookData;
  };

  const handleRefresh = async () => {
    const clientConfig = await getClientConfig(clientKey);
    if (clientConfig?.integrations?.webhook?.enabled && clientConfig?.integrations?.webhook?.url) {
      const webhookUrl = clientConfig.integrations.webhook.url;
      const webhookData = await triggerWebhook(webhookUrl);
      if (webhookData) {
        updateMetricsFromWebhook(webhookData);
        return;
      }
    }
    const simulatedData = await simulateWebhookData();
    updateMetricsFromWebhook(simulatedData);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const clientConfig = await getClientConfig(clientKey);
      if (clientConfig?.integrations?.webhook?.enabled && clientConfig?.integrations?.webhook?.url) {
        const webhookData = await fetchWebhookData(clientConfig.integrations.webhook.url);
        if (webhookData) {
          updateMetricsFromWebhook(webhookData);
          return;
        }
      }
      const simulatedData = await simulateWebhookData();
      updateMetricsFromWebhook(simulatedData);
    };
    loadInitialData();
  }, [clientKey]);

  const calculateDaysBetween = (s:Date|null,e:Date|null)=>{ if(!s||!e) return 0; return Math.ceil(Math.abs(e.getTime()-s.getTime())/(1000*60*60*24))+1; };
  const setQuickDateRange = (range:'last7days'|'last4weeks'|'last3months')=>{ const today=new Date(); const e=new Date(today); let s=new Date(today); if(range==='last7days') s.setDate(today.getDate()-6); if(range==='last4weeks') s.setDate(today.getDate()-27); if(range==='last3months') s.setMonth(today.getMonth()-3); setStartDate(s); setEndDate(e); };

  const quickActions = [
    { title:'CRM Dashboard', description:'Access your complete customer relationship management system', icon:Database, iconBgColor:'bg-blue-100', iconColor:'text-blue-600', buttonColor:'bg-blue-600 hover:bg-blue-700', stat:'31% of our calls are good fit!', link:'../crm', external:'https://airtable.com/appdepbMC8HjPr3D9/shrUpnBjEZjhPLJST' },
    { title:'Financial Overview', description:'Monthly subscriptions, terms, and pricing details', icon:DollarSign, iconBgColor:'bg-green-100', iconColor:'text-green-600', buttonColor:'bg-green-600 hover:bg-green-700', stat:'$119.00 due today (LinkedIn Sales Navigator)', link:'../finance' },
    { title:'Leads Dashboard', description:'Track and manage your lead-generation pipeline', icon:Target, iconBgColor:'bg-purple-100', iconColor:'text-purple-600', buttonColor:'bg-purple-600 hover:bg-purple-700', stat:'49 new leads', link:'../leads', external:'https://airtable.com/appdepbMC8HjPr3D9/tbl0j3sAHYjA9nJTs/viwDFuuaeUhGuloNX?blocks=hide' },
    { title:'Monthly Reports', description:'View and download detailed campaign PDFs', icon:FileText, iconBgColor:'bg-slate-100', iconColor:'text-slate-600', buttonColor:'bg-slate-600 hover:bg-slate-700', stat:'Latest file: Aug 2025', link:'../reports', buttonText:'Open' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Performance Dashboard</h2>
          <p className="text-gray-600">Real-time metrics and automated insights for data-driven decisions</p>
        </div>
        <RefreshButton onRefresh={handleRefresh} cooldownSeconds={15} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Analytics Period</label>
            <div className="flex gap-3 mb-3">
              <button onClick={()=>setQuickDateRange('last7days')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Last 7 Days</button>
              <button onClick={()=>setQuickDateRange('last4weeks')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Last 4 Weeks</button>
              <button onClick={()=>setQuickDateRange('last3months')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Last 3 Months</button>
            </div>
            <DateRangePicker startDate={startDate} endDate={endDate} onChange={(d)=>{ const [s,e]=d; setStartDate(s); setEndDate(e); }} placeholderText="Select date range for analytics" />
          </div>
          <div className="text-sm text-gray-500 mt-7">
            <p>Campaign started: 6 Aug 2025</p>
            <p>Viewing: {startDate && endDate ? `${formatDateForWebhook(startDate)} to ${formatDateForWebhook(endDate)}` : 'All time'}</p>
            {startDate && endDate && (<p className="text-gray-600 font-medium mt-1">{calculateDaysBetween(startDate,endDate)} days selected</p>)}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <DashboardMetrics
          metrics={{
            ...metricsData,
            lastUpdated: new Date().toISOString()
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PerformanceCharts data={{ emailsSent: metricsData.emailsSentCount, replies: metricsData.replyCount, opportunities: metricsData.totalOpportunities, opportunityValue: metricsData.totalOpportunityValue, leads: metricsData.newLeadsContactedCount, interested: metricsData.totalInterested }} />
          </div>
          <div>
            <AutomatedInsights emailsSent={metricsData.emailsSentCount} replies={metricsData.replyCount} opportunities={metricsData.totalOpportunities} opportunityValue={metricsData.totalOpportunityValue} leads={metricsData.newLeadsContactedCount} interested={metricsData.totalOpportunities} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500 p-3 rounded-lg"><TrendingUp className="w-6 h-6 text-white" /></div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Campaign Impact Summary</h3>
              <p className="text-gray-700 mb-4">Your campaign has reached <strong>{formatNumber(metricsData.newLeadsContactedCount,'compact')} new leads</strong> with <strong>{formatNumber(metricsData.emailsSentCount,'compact')} emails sent</strong>. Generated <strong>{formatCurrency(metricsData.totalOpportunityValue,'compact')} in pipeline value</strong> from <strong>{metricsData.totalOpportunities} qualified opportunities</strong>. Response rate of <strong>{((metricsData.replyCount / metricsData.newLeadsContactedCount) * 100 || 0).toFixed(2)}%</strong> demonstrates strong market engagement.</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action) => (
              <div key={action.title} className="bg-white rounded-2l shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${action.iconBgColor} p-4 rounded-2xl`}><action.icon className={`w-8 h-8 ${action.iconColor}`} /></div>
                  {action.external && (<ExternalLink className="w-5 h-5 text-gray-300" />)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 mb-6">{action.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{action.stat}</span>
                  {action.external ? (
                    <a href={action.external} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 px-4 py-2 ${action.buttonColor} text_white rounded-lg font-medium transition-colors`}>
                      {action.buttonText || 'Access'}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <Link to={action.link} className={`inline-flex items-center gap-2 px-4 py-2 ${action.buttonColor} text-white rounded-lg font-medium transition-colors`}>
                      {action.buttonText || 'Access'} →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default EnhancedOverview;
