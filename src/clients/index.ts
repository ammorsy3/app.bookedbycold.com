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
    airtable: {
      crmUrl?: string;
      leadsUrl?: string;
    };
    drive: {
      campaignFileId?: string;
      reportDownloadId?: string;
    };
    novu: {
      subscriberId: string;
    };
    webhook?: {
      url: string;
      enabled: boolean;
    };
  };
  stats: Array<{
    label: string;
    value: string;
    icon: string;
    color: string;
  }>;
  financeData?: {
    items: Array<{
      name: string;
      desc: string;
      price: number;
      reminder?: string;
      highlightYellow?: boolean;
      alreadyPaid?: boolean;
      strikeThrough?: boolean;
      notDueYet?: boolean;
      due?: string;
      dueSmall?: string;
    }>;
    totalDueToday: number;
  };
}

export const getClientConfig = async (clientKey: string): Promise<ClientConfig | null> => {
  try {
    const clientModule = await import(`./${clientKey}/config`);
    return clientModule.default;
  } catch (error) {
    console.error(`Failed to load client config for ${clientKey}:`, error);
    return null;
  }
};

// Get all available client keys
export const getAvailableClients = (): string[] => {
  return ['tlnconsultinggroup']; // Add new client keys here as they're created
};