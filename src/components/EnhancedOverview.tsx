import React, { useState, useEffect } from 'react';
import { ExternalLink, Database, DollarSign, Target, FileText, BarChart3, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardMetrics } from './DashboardMetrics';
import { PerformanceCharts } from './PerformanceCharts';
import { AutomatedInsights } from './AutomatedInsights';
import { RefreshButton } from './RefreshButton';
import { DateRangePicker } from './DateRangePicker';
import { simulateWebhookData } from '../utils/webhookSimulator';
import { getClientConfig } from '../clients';
import { formatCurrency, formatNumber } from '../utils/numberFormatter';

interface EnhancedOverviewProps {
  clientKey: string;
}

interface DailyAnalytics {
  date: string;
  sent: number;
  opened: number;
  unique_opened: number;
  replies: number;
  unique_replies: number;
  clicks: number;
  unique_clicks: number;
}

interface OverallCampaignAnalytics {
  total_reply_count: string | number;
  total_emails_sent_count: string | number;
  total_new_leads_contacted_count: string | number;
  total_opportunities: string | number;
  total_opportunity_value: string | number;
}

interface WebhookResponse {
  overAllCampaignAnalytics: OverallCampaignAnalytics;
  dailyCampaignAnalytics: string;
}

export function EnhancedOverview({ clientKey }: EnhancedOverviewProps) {
  const [metricsData, setMetricsData] = useState({
    replyCount: 0,
    emailsSentCount: 0,
    newLeadsContactedCount: 0,
    totalOpportunities: 0,
    totalOpportunityValue: 0,
    totalInterested: 0,
  });

  const [startDate, setStartDate] = useState<Date | null>(new Date('2025-08-06'));
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const formatDateForWebhook = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchWebhookData = async (webhookUrl: string): Promise<WebhookResponse | null> => {
    try {
      const response = await fetch(webhookUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Webhook request failed with status:', response.status);
        return null;
      }

      const text = await response.text();

      if (!text || text.trim().length === 0) {
        console.warn('Webhook returned empty response');
        return null;
      }

      // Check if response is valid JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.warn('Webhook response is not JSON. Response:', text.substring(0, 100));
        console.warn('This usually means the webhook endpoint needs to return JSON data with the required fields.');
        return null;
      }

      // Validate that we have overAllCampaignAnalytics
      if (!data || !data.overAllCampaignAnalytics) {
        console.warn('Webhook returned invalid data structure: expected overAllCampaignAnalytics');
        return null;
      }

      console.log('Webhook data received successfully:', {
        overallAnalytics: data.overAllCampaignAnalytics,
        hasDailyData: !!data.dailyCampaignAnalytics,
      });

      return data;
    } catch (error) {
      console.error('Webhook fetch error:', error);
      return null;
    }
  };

  // Parse and update metrics from webhook data (overall campaign analytics)
  const updateMetricsFromWebhook = (webhookData: WebhookResponse) => {
    console.log('updateMetricsFromWebhook called with:', webhookData);

    if (!webhookData || !webhookData.overAllCampaignAnalytics) {
      console.warn('Invalid webhook data format: expected overAllCampaignAnalytics', webhookData);
      return;
    }

    const overall = webhookData.overAllCampaignAnalytics;
    console.log('Overall campaign analytics:', overall);

    // Convert all values to numbers (handles both string and number inputs)
    const parseNumber = (value: any): number => {
      if (value === null || value === undefined || value === '') return 0;
      const parsed = typeof value === 'string' ? parseInt(value, 10) : Number(value);
      return isNaN(parsed) ? 0 : parsed;
    };

    const newMetrics = {
      replyCount: parseNumber(overall.total_reply_count),
      emailsSentCount: parseNumber(overall.total_emails_sent_count),
      newLeadsContactedCount: parseNumber(overall.total_new_leads_contacted_count),
      totalOpportunities: parseNumber(overall.total_opportunities),
      totalOpportunityValue: parseNumber(overall.total_opportunity_value),
      totalInterested: parseNumber(overall.total_opportunities),
    };

    console.log('Parsed metrics:', {
      'total_reply_count': overall.total_reply_count,
      'parsed replyCount': newMetrics.replyCount,
      'total_emails_sent_count': overall.total_emails_sent_count,
      'parsed emailsSentCount': newMetrics.emailsSentCount,
      'total_new_leads_contacted_count': overall.total_new_leads_contacted_count,
      'parsed newLeadsContactedCount': newMetrics.newLeadsContactedCount,
      'total_opportunities': overall.total_opportunities,
      'parsed totalOpportunities': newMetrics.totalOpportunities,
      'total_opportunity_value': overall.total_opportunity_value,
      'parsed totalOpportunityValue': newMetrics.totalOpportunityValue,
    });

    setMetricsData(newMetrics);

    console.log('Dashboard metrics state updated to:', newMetrics);
  };

  const triggerWebhook = async (webhookUrl: string): Promise<WebhookResponse | null> => {
    try {
      const payload: any = {
        action: 'refresh_dashboard',
        client_key: clientKey,
        timestamp: new Date().toISOString(),
      };

      if (startDate && endDate) {
        payload.startDate = formatDateForWebhook(startDate);
        payload.endDate = formatDateForWebhook(endDate);
      }

      console.log('Sending webhook trigger with payload:', payload);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Webhook trigger sent successfully');

      if (!response.ok) {
        console.error('Webhook request failed with status:', response.status);
        return null;
      }

      const text = await response.text();

      if (!text || text.trim().length === 0) {
        console.warn('Webhook returned empty response');
        return null;
      }

      try {
        const data = JSON.parse(text);
        console.log('Webhook response received:', data);
        return data;
      } catch (parseError) {
        console.error('Failed to parse webhook response:', parseError);
        return null;
      }
    } catch (error) {
      console.error('Webhook trigger error:', error);
      return null;
    }
  };

  const handleRefresh = async () => {
    const clientConfig = await getClientConfig(clientKey);

    // Check if webhook is enabled and configured
    if (clientConfig?.integrations?.webhook?.enabled && clientConfig?.integrations?.webhook?.url) {
      const webhookUrl = clientConfig.integrations.webhook.url;

      // Trigger webhook and get response in ONE call
      const webhookData = await triggerWebhook(webhookUrl);

      if (webhookData) {
        updateMetricsFromWebhook(webhookData);
        return;
      }

      console.log('Webhook returned invalid data, falling back to simulated data');
    } else {
      console.log('Webhook not configured, using simulated data');
    }

    // Fallback to simulated data
    const simulatedData = simulateWebhookData();
    updateMetricsFromWebhook(simulatedData);
  };

  // Fetch initial data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      const clientConfig = await getClientConfig(clientKey);

      // Check if webhook is enabled and configured
      if (clientConfig?.integrations?.webhook?.enabled && clientConfig?.integrations?.webhook?.url) {
        console.log('Loading initial webhook data using POST request...');
        const webhookData = await triggerWebhook(clientConfig.integrations.webhook.url);

        if (webhookData) {
          console.log('Initial webhook data received, updating dashboard...');
          updateMetricsFromWebhook(webhookData);
          return;
        }

        console.log('Webhook returned invalid data on initial load, falling back to simulated data');
      } else {
        console.log('Webhook not configured, using simulated data for initial load');
      }

      // Fallback to simulated data
      const simulatedData = await simulateWebhookData();
      updateMetricsFromWebhook(simulatedData);
    };

    loadInitialData();
  }, [clientKey]);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const calculateDaysBetween = (start: Date | null, end: Date | null): number => {
    if (!start || !end) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const setQuickDateRange = (range: 'last7days' | 'last4weeks' | 'last3months') => {
    const today = new Date();
    const end = new Date(today);
    let start = new Date(today);

    switch (range) {
      case 'last7days':
        start.setDate(today.getDate() - 6);
        break;
      case 'last4weeks':
        start.setDate(today.getDate() - 27);
        break;
      case 'last3months':
        start.setMonth(today.getMonth() - 3);
        break;
    }

    setStartDate(start);
    setEndDate(end);
  };

  const quickActions = [
    {
      title: 'CRM Dashboard',
      description: 'Access your complete customer relationship management system',
      icon: Database,
      color: 'bg-blue-500',
      stat: '31% of our calls are good fit!',
      link: '../crm',
      external: 'https://airtable.com/appdepbMC8HjPr3D9/shrGOao87lyCG8yKN',
    },
    {
      title: 'Financial Overview',
      description: 'Monthly subscriptions, terms, and pricing details',
      icon: DollarSign,
      color: 'bg-green-500',
      stat: '$119.00 due today (LinkedIn Sales Navigator)',
      link: '../finance',
    },
    {
      title: 'Leads Dashboard',
      description: 'Track and manage your lead-generation pipeline',
      icon: Target,
      color: 'bg-purple-500',
      stat: '49 new leads',
      link: '../leads',
      external: 'https://airtable.com/invite/l?inviteId=invG6X8ERSPZ5Zpc6&inviteToken=e435074069a4e302858da4b37a8e6137c9ff8825aba261372dd4def71bf29808',
    },
    {
      title: 'Campaign Analytics',
      description: 'Monitor email campaigns and outreach performance',
      icon: BarChart3,
      color: 'bg-orange-500',
      stat: '18.2K Emails Sent',
      link: '../campaigns',
    },
    {
      title: 'Monthly Reports',
      description: 'View and download detailed campaign PDFs',
      icon: FileText,
      color: 'bg-slate-500',
      stat: 'Latest file: Aug 2025',
      link: '../reports',
    },
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Analytics Period
            </label>
            <div className="flex gap-3 mb-3">
              <button
                onClick={() => setQuickDateRange('last7days')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setQuickDateRange('last4weeks')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Last 4 Weeks
              </button>
              <button
                onClick={() => setQuickDateRange('last3months')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Last 3 Months
              </button>
            </div>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateChange}
              placeholderText="Select date range for analytics"
            />
          </div>
          <div className="text-sm text-gray-500 mt-7">
            <p>Campaign started: 6 Aug 2025</p>
            <p>Viewing: {startDate && endDate ? `${formatDateForWebhook(startDate)} to ${formatDateForWebhook(endDate)}` : 'All time'}</p>
            {startDate && endDate && (
              <p className="text-gray-600 font-medium mt-1">
                {calculateDaysBetween(startDate, endDate)} days selected
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <DashboardMetrics
          clientKey={clientKey}
          metrics={{
            ...metricsData,
            lastUpdated: new Date().toISOString()
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PerformanceCharts
              data={{
                emailsSent: metricsData.emailsSentCount,
                replies: metricsData.replyCount,
                opportunities: metricsData.totalOpportunities,
                opportunityValue: metricsData.totalOpportunityValue,
                leads: metricsData.newLeadsContactedCount,
                interested: metricsData.totalInterested,
              }}
            />
          </div>
          <div>
            <AutomatedInsights
              emailsSent={metricsData.emailsSentCount}
              replies={metricsData.replyCount}
              opportunities={metricsData.totalOpportunities}
              opportunityValue={metricsData.totalOpportunityValue}
              leads={metricsData.newLeadsContactedCount}
              interested={metricsData.totalOpportunities}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Campaign Impact Summary</h3>
              <p className="text-gray-700 mb-4">
                Your campaign has reached <strong>{formatNumber(metricsData.newLeadsContactedCount, 'compact')} new leads</strong> with{' '}
                <strong>{formatNumber(metricsData.emailsSentCount, 'compact')} emails sent</strong>. Generated{' '}
                <strong>{formatCurrency(metricsData.totalOpportunityValue, 'compact')} in pipeline value</strong> from{' '}
                <strong>{metricsData.totalOpportunities} qualified opportunities</strong>. Response rate of{' '}
                <strong>{((metricsData.replyCount / metricsData.newLeadsContactedCount) * 100).toFixed(2)}%</strong> demonstrates strong market engagement.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.link}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    {action.external && (
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                      {action.stat}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:text-blue-700">
                      Access →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default EnhancedOverview;
