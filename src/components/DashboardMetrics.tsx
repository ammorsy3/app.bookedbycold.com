import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Mail, UserPlus, Target, DollarSign, MessageSquare, Users, RefreshCw, AlertCircle } from 'lucide-react';

export interface MetricData {
  replyCount: number;
  emailsSentCount: number;
  newLeadsContactedCount: number;
  totalOpportunities: number;
  totalOpportunityValue: number;
  totalInterested: number;
  lastUpdated: string;
}

interface DashboardMetricsProps {
  clientKey: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  nextRefreshTime?: number;
}

export function DashboardMetrics({ clientKey, onRefresh, isRefreshing, nextRefreshTime }: DashboardMetricsProps) {
  const [metrics, setMetrics] = useState<MetricData>({
    replyCount: 252,
    emailsSentCount: 29209,
    newLeadsContactedCount: 10730,
    totalOpportunities: 85,
    totalOpportunityValue: 188500,
    totalInterested: 87,
    lastUpdated: new Date().toISOString(),
  });

  const conversionRate = ((metrics.replyCount / metrics.emailsSentCount) * 100).toFixed(2);
  const opportunityRate = ((metrics.totalOpportunities / metrics.newLeadsContactedCount) * 100).toFixed(2);
  const avgOpportunityValue = (metrics.totalOpportunityValue / metrics.totalOpportunities).toFixed(0);
  const engagementRate = (((metrics.replyCount + metrics.totalInterested) / metrics.emailsSentCount) * 100).toFixed(2);

  const primaryMetrics = [
    {
      label: 'Total Emails Sent',
      value: metrics.emailsSentCount.toLocaleString(),
      icon: Mail,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50',
      description: 'Campaign reach',
    },
    {
      label: 'Replies Received',
      value: metrics.replyCount.toLocaleString(),
      icon: MessageSquare,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgLight: 'bg-green-50',
      description: `${conversionRate}% response rate`,
    },
    {
      label: 'New Leads Contacted',
      value: metrics.newLeadsContactedCount.toLocaleString(),
      icon: UserPlus,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgLight: 'bg-purple-50',
      description: 'Outreach volume',
    },
    {
      label: 'Total Opportunities',
      value: metrics.totalOpportunities.toLocaleString(),
      icon: Target,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgLight: 'bg-orange-50',
      description: `${opportunityRate}% conversion`,
    },
    {
      label: 'Opportunity Value',
      value: `$${(metrics.totalOpportunityValue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgLight: 'bg-emerald-50',
      description: `Avg: $${Number(avgOpportunityValue).toLocaleString()}`,
    },
    {
      label: 'Interested Leads',
      value: metrics.totalInterested.toLocaleString(),
      icon: Users,
      color: 'bg-cyan-500',
      textColor: 'text-cyan-600',
      bgLight: 'bg-cyan-50',
      description: `${engagementRate}% engagement`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {primaryMetrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${metric.bgLight} p-3 rounded-lg`}>
                <metric.icon className={`w-6 h-6 ${metric.textColor}`} />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.label}</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</p>
            <p className="text-xs text-gray-500">{metric.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardMetrics;
