import { ClientConfig } from '../index';

const config: ClientConfig = {
  key: 'newclient',
  name: 'New Client Company',
  user: {
    name: 'John Smith',
    email: 'john@newclient.com',
    initials: 'JS',
    timezone: 'America/New_York'
  },
  credentials: {
    email: 'john@newclient.com',
    password: 'secure_password_123'
  },
  branding: {
    primaryColor: '#10B981' // Custom green
  },
  integrations: {
    airtable: {
      crmUrl: 'https://airtable.com/embed/NEW_CLIENT_CRM_URL',
      leadsUrl: 'https://airtable.com/embed/NEW_CLIENT_LEADS_URL'
    },
    drive: {
      campaignFileId: 'NEW_CLIENT_CAMPAIGN_FILE_ID',
      reportDownloadId: 'NEW_CLIENT_REPORT_ID'
    },
    novu: {
      subscriberId: 'new_client_subscriber_id'
    }
  },
  stats: [
    { label: 'Active Campaigns', value: '3', icon: 'Activity', color: 'text-blue-600' },
    { label: 'Total Leads', value: '127', icon: 'Target', color: 'text-green-600' },
    { label: 'Conversion Rate', value: '4.2%', icon: 'TrendingUp', color: 'text-purple-600' },
    { label: 'Monthly Revenue', value: '$15,000', icon: 'DollarSign', color: 'text-orange-600' }
  ],
  financeData: {
    items: [
      { name: 'Google Ads', desc: 'Search advertising platform', price: 200.0 },
      { name: 'Facebook Ads', desc: 'Social media advertising', price: 150.0 },
      { name: 'CRM Software', desc: 'Customer relationship management', price: 99.0, alreadyPaid: true, strikeThrough: true },
      { name: 'Email Marketing', desc: 'Automated email campaigns', price: 79.0, notDueYet: true, due: 'Due 25 Sep', dueSmall: 'Payment pending' }
    ],
    totalDueToday: 350.0
  }
};

export default config;