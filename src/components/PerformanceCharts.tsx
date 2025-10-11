import React from 'react';
import { TrendingUp, Target, DollarSign, Activity } from 'lucide-react';

interface ChartData {
  emailsSent: number;
  replies: number;
  opportunities: number;
  opportunityValue: number;
  leads: number;
  interested: number;
}

interface PerformanceChartsProps {
  data: ChartData;
}

export function PerformanceCharts({ data }: PerformanceChartsProps) {
  const conversionFunnel = [
    { stage: 'Emails Sent', value: data.emailsSent, percentage: 100, color: 'bg-blue-500' },
    { stage: 'Leads Contacted', value: data.leads, percentage: (data.leads / data.emailsSent) * 100, color: 'bg-purple-500' },
    { stage: 'Replies', value: data.replies, percentage: (data.replies / data.emailsSent) * 100, color: 'bg-green-500' },
    { stage: 'Interested', value: data.interested, percentage: (data.interested / data.emailsSent) * 100, color: 'bg-cyan-500' },
    { stage: 'Opportunities', value: data.opportunities, percentage: (data.opportunities / data.emailsSent) * 100, color: 'bg-orange-500' },
  ];

  const performanceMetrics = [
    {
      label: 'Email Response Rate',
      value: ((data.replies / data.emailsSent) * 100).toFixed(2) + '%',
      target: '2.5%',
      performance: ((data.replies / data.emailsSent) * 100) >= 2.5 ? 'above' : 'below',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      label: 'Lead to Opportunity',
      value: ((data.opportunities / data.leads) * 100).toFixed(2) + '%',
      target: '1.0%',
      performance: ((data.opportunities / data.leads) * 100) >= 1.0 ? 'above' : 'below',
      icon: Target,
      color: 'text-purple-600',
    },
    {
      label: 'Avg Opportunity Value',
      value: '$' + (data.opportunityValue / data.opportunities).toLocaleString(undefined, { maximumFractionDigits: 0 }),
      target: '$2,000',
      performance: (data.opportunityValue / data.opportunities) >= 2000 ? 'above' : 'below',
      icon: DollarSign,
      color: 'text-emerald-600',
    },
    {
      label: 'Engagement Rate',
      value: (((data.replies + data.interested) / data.emailsSent) * 100).toFixed(2) + '%',
      target: '3.0%',
      performance: (((data.replies + data.interested) / data.emailsSent) * 100) >= 3.0 ? 'above' : 'below',
      icon: Activity,
      color: 'text-blue-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Conversion Funnel</h3>
        <div className="space-y-4">
          {conversionFunnel.map((stage, index) => (
            <div key={stage.stage}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">{stage.value.toLocaleString()}</span>
                  <span className="text-xs text-gray-500 ml-2">({stage.percentage.toFixed(2)}%)</span>
                </div>
              </div>
              <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className={`${stage.color} h-full rounded-lg transition-all duration-500 flex items-center justify-center`}
                  style={{ width: `${stage.percentage}%` }}
                >
                  {stage.percentage > 20 && (
                    <span className="text-xs font-medium text-white">
                      {stage.percentage.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Performance Benchmarks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {performanceMetrics.map((metric) => (
            <div
              key={metric.label}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    metric.performance === 'above'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {metric.performance === 'above' ? 'Above Target' : 'Below Target'}
                </span>
              </div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">{metric.label}</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                <span className="text-sm text-gray-500">vs {metric.target} target</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PerformanceCharts;
