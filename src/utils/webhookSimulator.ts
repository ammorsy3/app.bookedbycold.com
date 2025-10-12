export interface WebhookPayload {
  replyCount: number;
  emailsSentCount: number;
  newLeadsContactedCount: number;
  totalOpportunities: number;
  totalOpportunityValue: number;
  totalInterested: number;
}

export function simulateWebhookData(clientKey?: string): WebhookPayload {
  const baseData = {
    replyCount: 252,
    emailsSentCount: 29209,
    newLeadsContactedCount: 10730,
    totalOpportunities: 85,
    totalOpportunityValue: 188500,
    totalInterested: 87,
  };

  const variance = (base: number, percent: number = 5): number => {
    const change = base * (percent / 100);
    const random = (Math.random() - 0.5) * 2;
    return Math.round(base + change * random);
  };

  return {
    replyCount: variance(baseData.replyCount, 10),
    emailsSentCount: variance(baseData.emailsSentCount, 3),
    newLeadsContactedCount: variance(baseData.newLeadsContactedCount, 5),
    totalOpportunities: variance(baseData.totalOpportunities, 15),
    totalOpportunityValue: variance(baseData.totalOpportunityValue, 20),
    totalInterested: variance(baseData.totalInterested, 12),
  };
}

export async function fetchWebhookData(webhookUrl: string): Promise<WebhookPayload | null> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Webhook fetch error:', error);
    return null;
  }
}

export function generateMockData(scenario: 'success' | 'warning' | 'growth'): WebhookPayload {
  const scenarios = {
    success: {
      replyCount: 580,
      emailsSentCount: 29000,
      newLeadsContactedCount: 10500,
      totalOpportunities: 120,
      totalOpportunityValue: 350000,
      totalInterested: 150,
    },
    warning: {
      replyCount: 150,
      emailsSentCount: 30000,
      newLeadsContactedCount: 11000,
      totalOpportunities: 45,
      totalOpportunityValue: 75000,
      totalInterested: 60,
    },
    growth: {
      replyCount: 780,
      emailsSentCount: 35000,
      newLeadsContactedCount: 15000,
      totalOpportunities: 200,
      totalOpportunityValue: 520000,
      totalInterested: 250,
    },
  };

  return scenarios[scenario];
}
