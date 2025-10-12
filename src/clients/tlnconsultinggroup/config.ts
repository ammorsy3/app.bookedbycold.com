import { ClientConfig } from '../index';

const config: ClientConfig = {
  key: 'tlnconsultinggroup',
  name: 'TLN Consulting Group',
  user: {
    name: 'Travis Lairson',
    email: 'travis.lairson@tlnconsultinggroup.com',
    initials: 'T',
    timezone: 'America/Chicago'
  },
  credentials: {
    email: 'travis.lairson@tlnconsultinggroup.com',
    password: 'A7med&Travis@TLN'
  },
  integrations: {
    airtable: {
      crmUrl: 'https://airtable.com/embed/appdepbMC8HjPr3D9/shrGOao87lyCG8yKN',
      leadsUrl: 'https://airtable.com/embed/appdepbMC8HjPr3D9/shrvaMOVVXFChOUOo?viewControls=on'
    },
    drive: {
      campaignFileId: '1lbrZudT6pkugTEDPPGG5euqtaqYIjlhh',
      reportDownloadId: '1Lzrn97Q0fgLgFUoYPnwhLLvSVSDDDqaG'
    },
    novu: {
      subscriberId: '68be39f13c95e3a79082a7a9'
    },
    webhook: {
      url: 'https://hook.us2.make.com/f36n7r86d2wd8xlq51pwqlbh4koagp8d',
      enabled: true
    }
  },
  stats: [
    { label: 'Active Campaigns', value: '5', icon: 'Activity', color: 'text-blue-600' },
    { label: 'Opportunity Value', value: '$108,000', icon: 'TrendingUp', color: 'text-green-600' },
    { label: 'Response Rate', value: '2.08%', icon: 'Target', color: 'text-purple-600' },
    { label: 'Subscriptions', value: '7', icon: 'CreditCard', color: 'text-orange-600' }
  ],
  financeData: {
    items: [
      { name: 'Make', desc: 'Platforms & AI integration', price: 36.38 },
      { name: 'Anthropic', desc: 'LLM for email writing', price: 40.0 },
      { name: 'Perplexity', desc: 'LLM for lead research & personalization', price: 40.0 },
      { name: 'Sales Navigator', desc: 'Lead generation', price: 119.0, reminder: 'Renews 29 Sep', highlightYellow: true },
      { name: 'Instantly.ai', desc: 'Cold emailing — hyper-growth plan', price: 97.0, alreadyPaid: true, strikeThrough: true },
      { name: 'Anymail Finder', desc: 'Lead enrichment', price: 199.0, alreadyPaid: true, strikeThrough: true },
      { name: 'Email Accounts', desc: '≈1,500 emails/day', price: 240.0, notDueYet: true, due: 'Due 15 Sep', dueSmall: 'Payment can wait' }
    ],
    totalDueToday: 116.0
  }
};

export default config;