import { AlertTriangle, CheckCircle, Lightbulb, Award, Target } from 'lucide-react';

interface InsightData {
  type: 'success' | 'warning' | 'info' | 'achievement';
  title: string;
  description: string;
  metric?: string;
  priority: 'high' | 'medium' | 'low';
}

interface AutomatedInsightsProps {
  emailsSent: number;
  replies: number;
  opportunities: number;
  opportunityValue: number;
  leads: number;
  interested: number;
}

export function AutomatedInsights({
  emailsSent,
  replies,
  opportunities,
  opportunityValue,
  leads,
  interested,
}: AutomatedInsightsProps) {
  const generateInsights = (): InsightData[] => {
    const insights: InsightData[] = [];
    const responseRate = (replies / leads) * 100;
    const opportunityRate = (opportunities / leads) * 100;
    const avgOpportunityValue = opportunityValue / opportunities;
    const engagementRate = ((replies + interested) / leads) * 100;

    if (responseRate > 2.0) {
      insights.push({
        type: 'success',
        title: 'Strong Response Rate',
        description: `Your ${responseRate.toFixed(2)}% response rate is above industry average (1.5-2%). Your messaging is resonating well with prospects.`,
        metric: `${responseRate.toFixed(2)}%`,
        priority: 'high',
      });
    } else if (responseRate < 1.0) {
      insights.push({
        type: 'warning',
        title: 'Response Rate Below Target',
        description: `Current response rate of ${responseRate.toFixed(2)}% is below optimal. Consider A/B testing subject lines or refining targeting criteria.`,
        metric: `${responseRate.toFixed(2)}%`,
        priority: 'high',
      });
    }

    if (opportunities >= 50) {
      insights.push({
        type: 'achievement',
        title: 'Opportunity Milestone Reached',
        description: `Generated ${opportunities} qualified opportunities this campaign. This represents strong pipeline growth.`,
        metric: `${opportunities} opportunities`,
        priority: 'medium',
      });
    }

    if (avgOpportunityValue > 2000) {
      insights.push({
        type: 'success',
        title: 'High-Value Opportunities',
        description: `Average opportunity value of $${avgOpportunityValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} indicates strong lead quality and effective targeting.`,
        metric: `$${avgOpportunityValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
        priority: 'high',
      });
    }

    if (opportunityRate > 0.5) {
      insights.push({
        type: 'success',
        title: 'Efficient Lead Conversion',
        description: `Converting ${opportunityRate.toFixed(2)}% of contacted leads to opportunities. Your qualification process is working effectively.`,
        metric: `${opportunityRate.toFixed(2)}%`,
        priority: 'medium',
      });
    }

    if (engagementRate > 3.0) {
      insights.push({
        type: 'info',
        title: 'High Engagement Signal',
        description: `Combined engagement (replies + interested) of ${engagementRate.toFixed(2)}% shows strong market interest. Consider scaling campaign volume.`,
        metric: `${engagementRate.toFixed(2)}%`,
        priority: 'medium',
      });
    } else if (engagementRate < 2.0) {
      insights.push({
        type: 'warning',
        title: 'Low Engagement Signal',
        description: `Engagement rate of ${engagementRate.toFixed(2)}% suggests messaging or targeting refinement needed. Review ICP alignment.`,
        metric: `${engagementRate.toFixed(2)}%`,
        priority: 'high',
      });
    }

    const pipelineValue = opportunityValue;
    if (pipelineValue > 100000) {
      insights.push({
        type: 'achievement',
        title: 'Six-Figure Pipeline',
        description: `Current pipeline value of $${(pipelineValue / 1000).toFixed(0)}K represents significant business impact from this campaign.`,
        metric: `$${(pipelineValue / 1000).toFixed(0)}K`,
        priority: 'high',
      });
    }

    insights.push({
      type: 'info',
      title: 'Campaign Reach',
      description: `Contacted ${leads.toLocaleString()} new leads with ${emailsSent.toLocaleString()} total emails sent. Strong outreach volume maintained.`,
      metric: `${leads.toLocaleString()} leads`,
      priority: 'low',
    });

    return insights;
  };

  const insights = generateInsights();

  const getInsightIcon = (type: InsightData['type']) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'achievement':
        return Award;
      case 'info':
      default:
        return Lightbulb;
    }
  };

  const getInsightStyles = (type: InsightData['type'], priority: InsightData['priority']) => {
    const baseStyles = 'border rounded-lg p-4 ';
    const priorityBorder = priority === 'high' ? 'border-l-4 ' : '';

    switch (type) {
      case 'success':
        return baseStyles + priorityBorder + 'bg-green-50 border-green-200 border-l-green-500';
      case 'warning':
        return baseStyles + priorityBorder + 'bg-yellow-50 border-yellow-200 border-l-yellow-500';
      case 'achievement':
        return baseStyles + priorityBorder + 'bg-blue-50 border-blue-200 border-l-blue-500';
      case 'info':
      default:
        return baseStyles + priorityBorder + 'bg-gray-50 border-gray-200 border-l-gray-400';
    }
  };

  const getIconColor = (type: InsightData['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'achievement':
        return 'text-blue-600';
      case 'info':
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Automated Insights</h3>
      </div>
      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = getInsightIcon(insight.type);
          return (
            <div key={index} className={getInsightStyles(insight.type, insight.priority)}>
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${getIconColor(insight.type)} flex-shrink-0 mt-0.5`} />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{insight.title}</h4>
                    {insight.metric && (
                      <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
                        {insight.metric}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AutomatedInsights;