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

export type WebhookPayload = DailyAnalytics[];

export async function simulateWebhookData(): Promise<WebhookPayload> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Generate 5 days of mock data
  const mockData: DailyAnalytics[] = [
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

  return mockData;
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
