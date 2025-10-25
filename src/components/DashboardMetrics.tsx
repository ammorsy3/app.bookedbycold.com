import { TrendingUp, Mail, UserPlus, Target, DollarSign, MessageSquare } from 'lucide-react';
import { formatNumber, formatCurrency } from '../utils/numberFormatter';

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
  metrics: MetricData;
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  const responseRate = ((metrics.replyCount / metrics.newLeadsContactedCount) * 100).toFixed(2);
  const opportunityRate = ((metrics.totalOpportunities / metrics.newLeadsContactedCount) * 100).toFixed(2);
  const avgOpportunityValue = (metrics.totalOpportunityValue / metrics.totalOpportunities).toFixed(0);

  const primaryMetrics = [
    {
      label: 'Total Emails Sent',
      value: formatNumber(metrics.emailsSentCount, 'compact'),
      icon: Mail,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50',
      description: 'Campaign reach',
    },
    {
      label: 'Replies Received',
      value: formatNumber(metrics.replyCount, 'full'),
      icon: MessageSquare,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgLight: 'bg-green-50',
      description: `${responseRate}% response rate`,
    },
    {
      label: 'New Leads Contacted',
      value: formatNumber(metrics.newLeadsContactedCount, 'compact'),
      icon: UserPlus,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgLight: 'bg-purple-50',
      description: 'Outreach volume',
    },
    {
      label: 'Total Opportunities',
      value: formatNumber(metrics.totalOpportunities, 'full'),
      icon: Target,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgLight: 'bg-orange-50',
      description: `${opportunityRate}% conversion`,
    },
    {
      label: 'Opportunity Value',
      value: formatCurrency(metrics.totalOpportunityValue, 'compact'),
      icon: DollarSign,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgLight: 'bg-emerald-50',
      description: `Avg: ${formatCurrency(Number(avgOpportunityValue), 'compact')}`,
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