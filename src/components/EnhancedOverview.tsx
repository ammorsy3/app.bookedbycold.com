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

interface WebhookResponse {
  reply_count?: string | number;
  reply_count_unique?: string | number;
  emails_sent_count?: string | number;
  new_leads_contacted_count?: string | number;
  total_opportunities?: string | number;
  total_opportunity_value?: string | number;
  total_interested?: string | number;
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

  const [clientConfig, setClientConfig] = useState<any>(null);
  const [webhookError, setWebhookError] = useState<string | null>(null);
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

      // Validate that we have at least some expected fields
      if (!data || typeof data !== 'object') {
        console.warn('Webhook returned invalid data structure');
        return null;
      }

      console.log('Webhook data received successfully:', {
        reply_count: data.reply_count,
        emails_sent_count: data.emails_sent_count,
        new_leads_contacted_count: data.new_leads_contacted_count,
        total_opportunities: data.total_opportunities,
        total_opportunity_value: data.total_opportunity_value,
        total_interested: data.total_interested,
      });

      return data;
    } catch (error) {
      console.error('Webhook fetch error:', error);
      return null;
    }
  };

  // Parse and update metrics from webhook data
  const updateMetricsFromWebhook = (webhookData: WebhookResponse) => {
    // Convert all values to numbers (handles both string and number inputs)
    const parseNumber = (value: any): number => {
      if (value === null || value === undefined || value === '') return 0;
      const parsed = typeof value === 'string' ? parseInt(value, 10) : Number(value);
      return isNaN(parsed) ? 0 : parsed;
    };

    const newMetrics = {
      replyCount: parseNumber(webhookData.reply_count || webhookData.reply_count_unique),
      emailsSentCount: parseNumber(webhookData.emails_sent_count),
      newLeadsContactedCount: parseNumber(webhookData.new_leads_contacted_count),
      totalOpportunities: parseNumber(webhookData.total_opportunities),
      totalOpportunityValue: parseNumber(webhookData.total_opportunity_value),
      totalInterested: parseNumber(webhookData.total_opportunities), // Same as opportunities
    };

    setMetricsData(newMetrics);

    console.log('Dashboard updated with webhook data:', newMetrics);
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

      console.log('[Webhook] Sending POST request to:', webhookUrl);
      console.log('[Webhook] Payload:', payload);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('[Webhook] Response status:', response.status);
      console.log('[Webhook] Response ok:', response.ok);

      if (!response.ok) {
        console.error('[Webhook] Request failed with status:', response.status);
        const errorText = await response.text();
        console.error('[Webhook] Error response:', errorText);
        return null;
      }

      const text = await response.text();
      console.log('[Webhook] Response text length:', text.length);
      console.log('[Webhook] Response text:', text.substring(0, 200));

      if (!text || text.trim().length === 0) {
        console.warn('[Webhook] Returned empty response');
        return null;
      }

      try {
        const data = JSON.parse(text);
        console.log('[Webhook] Parsed response:', data);
        return data;
      } catch (parseError) {
        console.error('[Webhook] Failed to parse response:', parseError);
        console.error('[Webhook] Raw text:', text);
        return null;
      }
    } catch (error) {
      console.error('[Webhook] Network or fetch error:', error);
      if (error instanceof Error) {
        console.error('[Webhook] Error message:', error.message);
        console.error('[Webhook] Error stack:', error.stack);
      }
      return null;
    }
  };

  const handleRefresh = async () => {
    console.log('[Refresh] Starting refresh process...');
    console.log('[Refresh] Client key:', clientKey);
    setWebhookError(null);

    const config = await getClientConfig(clientKey);
    console.log('[Refresh] Client config loaded:', config?.key);
    console.log('[Refresh] Webhook enabled:', config?.integrations?.webhook?.enabled);
    console.log('[Refresh] Webhook URL:', config?.integrations?.webhook?.url);

    // Check if webhook is enabled and configured
    if (config?.integrations?.webhook?.enabled && config?.integrations?.webhook?.url) {
      const webhookUrl = config.integrations.webhook.url;
      console.log('[Refresh] Calling webhook:', webhookUrl);

      // Trigger webhook and get response in ONE call
      const webhookData = await triggerWebhook(webhookUrl);
      console.log('[Refresh] Webhook response:', webhookData);

      if (webhookData) {
        console.log('[Refresh] Updating metrics with webhook data');
        updateMetricsFromWebhook(webhookData);
        setWebhookError(null);
        return;
      }

      console.warn('[Refresh] Webhook returned invalid data, falling back to simulated data');
      setWebhookError('Webhook returned invalid data. Using simulated data.');
    } else {
      console.warn('[Refresh] Webhook not configured, using simulated data');
      setWebhookError('Webhook not configured. Using simulated data.');
    }

    // Fallback to simulated data
    console.log('[Refresh] Using simulated data');
    const simulatedData = simulateWebhookData();
    updateMetricsFromWebhook(simulatedData);
  };

  // Fetch initial data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      const config = await getClientConfig(clientKey);
      setClientConfig(config);

      // Check if webhook is enabled and configured
      if (config?.integrations?.webhook?.enabled && config?.integrations?.webhook?.url) {
        console.log('Loading initial webhook data...');
        const webhookData = await fetchWebhookData(config.integrations.webhook.url);

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
      const simulatedData = simulateWebhookData();
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

  // Icon mapping for string-based icon names from config
  const iconMap: { [key: string]: any } = {
    Database,
    DollarSign,
    Target,
    BarChart3,
    FileText,
  };

  const quickActions = clientConfig?.quickActions?.map((action: any) => ({
    ...action,
    icon: iconMap[action.icon] || Database,
  })) || [];

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Performance Dashboard</h2>
          <p className="text-gray-600">Real-time metrics and automated insights for data-driven decisions</p>
        </div>
        <RefreshButton onRefresh={handleRefresh} cooldownSeconds={15} />
      </div>

      {webhookError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 mt-0.5">⚠️</div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-900 mb-1">Webhook Issue</h3>
              <p className="text-sm text-yellow-800">{webhookError}</p>
              <p className="text-xs text-yellow-700 mt-2">Check the browser console for detailed logs.</p>
            </div>
          </div>
        </div>
      )}

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action) => (
              <div
                key={action.title}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${action.iconBgColor} p-4 rounded-2xl`}>
                    <action.icon className={`w-8 h-8 ${action.iconColor}`} />
                  </div>
                  {action.external && (
                    <ExternalLink className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 mb-6">{action.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    {action.stat}
                  </span>
                  {action.external ? (
                    <a
                      href={action.external}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-4 py-2 ${action.buttonColor} text-white rounded-lg font-medium transition-colors`}
                    >
                      {action.buttonText || 'Access'}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <Link
                      to={action.link}
                      className={`inline-flex items-center gap-2 px-4 py-2 ${action.buttonColor} text-white rounded-lg font-medium transition-colors`}
                    >
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
