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
      leadsUrl: 'https://airtable.com/embed/appdepbMC8HjPr3D9/shrvaMOVVXFChOUOo?viewControls=on',
      crmExternalUrl: 'https://airtable.com/appdepbMC8HjPr3D9/shrUpnBjEZjhPLJST',
      leadsExternalUrl: 'https://airtable.com/appdepbMC8HjPr3D9/tbl0j3sAHYjA9nJTs/viwDFuuaeUhGuloNX?blocks=hide'
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
  quickActions: [
    {
      title: 'CRM Dashboard',
      description: 'Access your complete customer relationship management system',
      icon: 'Database',
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      stat: '31% of our calls are good fit!',
      link: '../crm',
      external: 'https://airtable.com/appdepbMC8HjPr3D9/shrUpnBjEZjhPLJST',
    },
    {
      title: 'Financial Overview',
      description: 'Monthly subscriptions, terms, and pricing details',
      icon: 'DollarSign',
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      stat: '$119.00 due today (LinkedIn Sales Navigator)',
      link: '../finance',
    },
    {
      title: 'Leads Dashboard',
      description: 'Track and manage your lead-generation pipeline',
      icon: 'Target',
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      stat: '49 new leads',
      link: '../leads',
      external: 'https://airtable.com/appdepbMC8HjPr3D9/tbl0j3sAHYjA9nJTs/viwDFuuaeUhGuloNX?blocks=hide',
    },
    {
      title: 'Campaign Analytics',
      description: 'Monitor email campaigns and outreach performance',
      icon: 'BarChart3',
      iconBgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      buttonColor: 'bg-orange-600 hover:bg-orange-700',
      stat: '18.2K Emails Sent',
      link: '../campaigns',
    },
    {
      title: 'Monthly Reports',
      description: 'View and download detailed campaign PDFs',
      icon: 'FileText',
      iconBgColor: 'bg-slate-100',
      iconColor: 'text-slate-600',
      buttonColor: 'bg-slate-600 hover:bg-slate-700',
      stat: 'Latest file: Aug 2025',
      link: '../reports',
      buttonText: 'Open',
    },
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