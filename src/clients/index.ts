export interface ClientConfig {
  key: string;
  name: string;
  user: {
    name: string;
    email: string;
    initials: string;
    timezone: string;
  };
  credentials: {
    email: string;
    password: string;
  };
  branding?: {
    primaryColor: string;
    logo?: string;
  };
  integrations: {
    airtable: { crmUrl?: string; leadsUrl?: string };
    drive: { campaignFileId?: string; reportDownloadId?: string };
    novu: { subscriberId: string };
    webhook?: { url: string; enabled: boolean };
  };
  stats: Array<{ label: string; value: string; icon: string; color: string }>;
  financeData?: {
    items: Array<{ name: string; desc: string; price: number; reminder?: string; highlightYellow?: boolean; alreadyPaid?: boolean; strikeThrough?: boolean; notDueYet?: boolean; due?: string; dueSmall?: string }>;
    totalDueToday: number;
  };
}

export const getClientConfig = async (clientKey: string): Promise<ClientConfig | null> => {
  try {
    // Support nested keys like "tlnconsultinggroup/travis" and "tlnconsultinggroup/kathy"
    const clientModule = await import(`./${clientKey}`);
    return clientModule.default;
  } catch (error) {
    // Fallback to legacy single-config per company
    try {
      const clientModule = await import(`./${clientKey}/config`);
      return clientModule.default;
    } catch (err) {
      console.error(`Failed to load client config for ${clientKey}:`, err);
      return null;
    }
  }
};

export const getAvailableClients = (): string[] => {
  // Expose nested user keys, can be extended automatically later
  return ['tlnconsultinggroup/travis', 'tlnconsultinggroup/kathy'];
};
