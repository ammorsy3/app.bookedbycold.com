export interface DailyAnalytics {
  date: string;
  sent: number;
  opened: number;
  unique_opened: number;
  replies: number;
  unique_replies: number;
  clicks: number;
  unique_clicks: number;
}

export interface WebhookSummary {
  totalLeadsContacted: string;
  totalOpportunities: string;
  totaloOpportunitiesValue: string;
}

export interface WebhookPayload {
  dailyData: DailyAnalytics[];
  summary: WebhookSummary;
}

export async function simulateWebhookData(): Promise<WebhookPayload> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const dailyData: DailyAnalytics[] = [
    {
      date: '2025-10-06',
      sent: 448,
      opened: 0,
      unique_opened: 0,
      replies: 3,
      unique_replies: 3,
      clicks: 0,
      unique_clicks: 0,
    },
    {
      date: '2025-10-07',
      sent: 324,
      opened: 0,
      unique_opened: 0,
      replies: 0,
      unique_replies: 0,
      clicks: 0,
      unique_clicks: 0,
    },
    {
      date: '2025-10-08',
      sent: 3,
      opened: 0,
      unique_opened: 0,
      replies: 0,
      unique_replies: 0,
      clicks: 0,
      unique_clicks: 0,
    },
    {
      date: '2025-10-09',
      sent: 1,
      opened: 0,
      unique_opened: 0,
      replies: 0,
      unique_replies: 0,
      clicks: 0,
      unique_clicks: 0,
    },
    {
      date: '2025-10-10',
      sent: 2,
      opened: 0,
      unique_opened: 0,
      replies: 0,
      unique_replies: 0,
      clicks: 0,
      unique_clicks: 0,
    },
  ];

  const summary: WebhookSummary = {
    totalLeadsContacted: '0',
    totalOpportunities: '1',
    totaloOpportunitiesValue: '2250',
  };

  return { dailyData, summary };
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

    const rawData = await response.json();

    // Parse the response structure: array of daily data + summary object
    if (Array.isArray(rawData) && rawData.length === 2) {
      const dailyData = rawData[0] as DailyAnalytics[];
      const summary = rawData[1] as WebhookSummary;
      return { dailyData, summary };
    }

    // Fallback: if data is already in correct format
    if (rawData.dailyData && rawData.summary) {
      return rawData as WebhookPayload;
    }

    console.error('Unexpected webhook data format:', rawData);
    return null;
  } catch (error) {
    console.error('Webhook fetch error:', error);
    return null;
  }
}
