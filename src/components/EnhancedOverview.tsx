import React, { useState, useEffect } from 'react';
import { ExternalLink, Database, DollarSign, Target, FileText, BarChart3, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardMetrics } from './DashboardMetrics';
import { PerformanceCharts } from './PerformanceCharts';
import { AutomatedInsights } from './AutomatedInsights';
import { RefreshButton } from './RefreshButton';
import { simulateWebhookData } from '../utils/webhookSimulator';
import { getClientConfig } from '../clients';
import { formatCurrency, formatNumber } from '../utils/numberFormatter';

interface EnhancedOverviewProps {
  clientKey: string;
}

interface WebhookResponse {
  reply_count?: number;
  reply_count_unique?: number;
  emails_sent_count?: number;
  new_leads_contacted_count?: number;
  total_opportunities?: number;
  total_opportunity_value?: number;
  total_interested?: number;
}

export function EnhancedOverview({ clientKey }: EnhancedOverviewProps) {
  const [metricsData, setMetricsData] = useState({
    replyCount: 252,
    emailsSentCount: 29209,
    newLeadsContactedCount: 10730,
    totalOpportunities: 85,
    totalOpportunityValue: 188500,
    totalInterested: 87,
  });

  const fetchWebhookData = async (webhookUrl: string): Promise<WebhookResponse | null> => {
    try {
      const response = await fetch(webhookUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Webhook request failed:', response.status);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Webhook fetch error:', error);
      return null;
    }
  };

  const triggerWebhook = async (webhookUrl: string): Promise<void> => {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'refresh_dashboard',
          client_key: clientKey,
          timestamp: new Date().toISOString(),
        }),
      });
      console.log('Webhook trigger sent successfully');
    } catch (error) {
      console.error('Webhook trigger error:', error);
    }
  };

  const handleRefresh = async () => {
    const webhookUrl = 'https://hook.us2.make.com/f36n7r86d2wd8xlq51pwqlbh4koagp8d';

    await triggerWebhook(webhookUrl);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const webhookData = await fetchWebhookData(webhookUrl);

    if (webhookData) {
      setMetricsData({
        replyCount: webhookData.reply_count || webhookData.reply_count_unique || 0,
        emailsSentCount: webhookData.emails_sent_count || 0,
        newLeadsContactedCount: webhookData.new_leads_contacted_count || 0,
        totalOpportunities: webhookData.total_opportunities || 0,
        totalOpportunityValue: webhookData.total_opportunity_value || 0,
        totalInterested: webhookData.total_interested || 0,
      });
      return;
    }

    const simulatedData = await simulateWebhookData(clientKey);
    setMetricsData(simulatedData);
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
              interested={metricsData.totalInterested}
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
