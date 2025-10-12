# Client Data Isolation and Configuration

This document explains how client-specific data is configured and isolated in the portal.

## Overview

Each client has their own private configuration file that contains:
- Authentication credentials
- Webhook URLs for fetching real-time data
- Airtable URLs (both embedded and external links)
- Quick action cards with client-specific links
- Finance data
- User information

## Client Configuration Structure

Client configs are stored in `/src/clients/{clientKey}/config.ts`

### Current Clients

1. **TLN Consulting Group** (`tlnconsultinggroup`)
   - Email: `travis.lairson@tlnconsultinggroup.com`
   - Configuration: `/src/clients/tlnconsultinggroup/config.ts`

### Adding a New Client

1. Create a new directory: `/src/clients/{clientkey}/`
2. Create `config.ts` with the following structure:

```typescript
import { ClientConfig } from '../index';

const config: ClientConfig = {
  key: 'clientkey',
  name: 'Client Company Name',
  user: {
    name: 'User Name',
    email: 'user@company.com',
    initials: 'UN',
    timezone: 'America/New_York'
  },
  credentials: {
    email: 'user@company.com',
    password: 'secure_password'
  },
  integrations: {
    airtable: {
      crmUrl: 'https://airtable.com/embed/...',
      leadsUrl: 'https://airtable.com/embed/...',
      crmExternalUrl: 'https://airtable.com/...',
      leadsExternalUrl: 'https://airtable.com/...'
    },
    drive: {
      campaignFileId: 'GOOGLE_DRIVE_FILE_ID',
      reportDownloadId: 'GOOGLE_DRIVE_REPORT_ID'
    },
    novu: {
      subscriberId: 'novu_subscriber_id'
    },
    webhook: {
      url: 'https://webhook-url.com/...',
      enabled: true
    }
  },
  quickActions: [
    {
      title: 'CRM Dashboard',
      description: 'Access your complete customer relationship management system',
      icon: 'Database',
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      stat: 'Client-specific stat',
      link: '../crm',
      external: 'https://airtable.com/...' // Opens in new tab
    },
    // Add more quick actions as needed
  ],
  stats: [
    { label: 'Metric Name', value: '100', icon: 'Activity', color: 'text-blue-600' }
  ],
  financeData: {
    items: [
      { name: 'Service', desc: 'Description', price: 99.00 }
    ],
    totalDueToday: 99.00
  }
};

export default config;
```

3. Update `/src/clients/index.ts` to include the new client:

```typescript
export const getAvailableClients = (): string[] => {
  return ['tlnconsultinggroup', 'newclientkey'];
};
```

## Data Isolation

### How It Works

1. **Login**: Users authenticate with their email and password specific to their client
2. **Session**: The `clientKey` is stored in the session and used for all data fetching
3. **Configuration Loading**: All components load their data from the client-specific config
4. **Webhooks**: Each client has their own webhook URL that returns their specific data
5. **External Links**: Quick action cards use client-specific URLs from the config

### Security Features

- Each client config is loaded dynamically based on their `clientKey`
- Credentials are validated against the specific client's config
- Webhook URLs are private to each client
- Airtable URLs (both embedded and external) are client-specific
- No cross-client data leakage

## Important Files

- `/src/clients/index.ts` - Type definitions and client loader
- `/src/clients/{clientkey}/config.ts` - Individual client configurations
- `/src/components/EnhancedOverview.tsx` - Uses client config for quick actions
- `/src/App.tsx` - Main routing and authentication

## Testing a New Client

1. Create the client config file
2. Add the client key to `getAvailableClients()`
3. Navigate to `/login`
4. Enter the client's credentials
5. Verify all links, webhooks, and data are client-specific

## External Links

External links in quick action cards will open in a new tab. Configure them in the client config:

```typescript
{
  title: 'Leads Dashboard',
  link: '../leads', // Internal route
  external: 'https://airtable.com/...' // External link that opens in new tab
}
```

If `external` is provided, the button will open the external URL instead of navigating to the internal route.
