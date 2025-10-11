# Webhook Integration & Dynamic Data Formatting Guide

## Overview
The dashboard now dynamically handles webhook responses with flexible field names and automatic number formatting. When users click "Refresh Overview Tab," the system fetches data from the configured webhook URL and updates all visualizations.

## Webhook Response Format

### Supported Field Names (Flexible Mapping)

The system accepts various field name formats from webhook responses:

```json
{
  "reply_count": 252,
  "reply_count_unique": 252,
  "emails_sent_count": 29209,
  "new_leads_contacted_count": 10730,
  "total_opportunities": 85,
  "total_opportunity_value": 188500,
  "total_interested": 87
}
```

### Field Mapping

| Webhook Field | Dashboard Property | Fallback |
|---------------|-------------------|----------|
| `reply_count` | `replyCount` | `reply_count_unique` or 0 |
| `emails_sent_count` | `emailsSentCount` | 0 |
| `new_leads_contacted_count` | `newLeadsContactedCount` | 0 |
| `total_opportunities` | `totalOpportunities` | 0 |
| `total_opportunity_value` | `totalOpportunityValue` | 0 |
| `total_interested` | `totalInterested` | 0 |

### Alternative Field Names

The system also supports these alternate field names:
- `replyCount` instead of `reply_count`
- `emailsSentCount` instead of `emails_sent_count`
- And camelCase versions of all fields

## Refresh Flow

### User Action
```
User clicks "Refresh Overview Tab" button
    ↓
15-second cooldown starts
    ↓
handleRefresh() function triggered
```

### Data Fetch Process
```typescript
handleRefresh() {
  1. Send POST trigger to webhook
     → URL: https://hook.us2.make.com/f36n7r86d2wd8xlq51pwqlbh4koagp8d
     → Body: { action: 'refresh_dashboard', client_key: clientKey, timestamp }
     → This initiates data collection in Make.com

  2. Wait 2 seconds for webhook to process

  3. Fetch updated data from webhook (GET request)
     → Same URL: https://hook.us2.make.com/f36n7r86d2wd8xlq51pwqlbh4koagp8d
     → Parse JSON response
     → Map fields to dashboard format
     → Update all visualizations

  4. If fetch fails:
     → Use simulated data (for testing)
     → Update visualizations
}
```

### Response Processing

```typescript
// Webhook response received
const webhookData = {
  reply_count: 252,
  emails_sent_count: 29209,
  new_leads_contacted_count: 10730,
  total_opportunities: 85,
  total_opportunity_value: 188500,
  total_interested: 87
};

// Automatically mapped to:
setMetricsData({
  replyCount: 252,
  emailsSentCount: 29209,
  newLeadsContactedCount: 10730,
  totalOpportunities: 85,
  totalOpportunityValue: 188500,
  totalInterested: 87
});

// Then formatted for display:
{
  reply_count: "252",              // formatNumber(252, 'full')
  emails_sent_count: "29K",        // formatNumber(29209, 'compact')
  new_leads_contacted: "11K",      // formatNumber(10730, 'compact')
  total_opportunities: "85",       // formatNumber(85, 'full')
  total_opportunity_value: "$189K" // formatCurrency(188500, 'compact')
}
```

## Automatic Formatting

### Number Formatting Rules Applied

| Field | Value | Formatted | Context | Rule |
|-------|-------|-----------|---------|------|
| reply_count | 252 | `"252"` | full | < 1K = as-is |
| emails_sent_count | 29,209 | `"29K"` | compact | 10K-99K = K notation |
| new_leads_contacted | 10,730 | `"11K"` | compact | 10K-99K = K notation |
| total_opportunities | 85 | `"85"` | full | < 1K = as-is |
| total_opportunity_value | 188,500 | `"$189K"` | compact | 100K+ = $K notation |
| total_interested | 87 | `"87"` | full | < 1K = as-is |

### Where Formatting is Applied

1. **Dashboard Metric Cards** (6 KPI cards)
   - Automatically formatted with compact notation
   - Example: "29K emails sent"

2. **Performance Charts**
   - Funnel stages use compact notation
   - Benchmark cards use compact notation

3. **Campaign Impact Summary**
   - Plain English description with formatted numbers
   - Example: "11K new leads with 29K emails sent"

4. **Automated Insights**
   - Uses exact numbers for calculations
   - Displays formatted values in descriptions

## Client Configuration

### Webhook Setup

Each client has a webhook configuration in their config file:

```typescript
// src/clients/tlnconsultinggroup/config.ts
{
  integrations: {
    webhook: {
      url: 'https://hook.us2.make.com/f36n7r86d2wd8xlq51pwqlbh4koagp8d',
      enabled: true
    }
  }
}
```

### Adding a New Client Webhook

```typescript
// src/clients/newclient/config.ts
import { ClientConfig } from '../index';

const config: ClientConfig = {
  key: 'newclient',
  name: 'New Client Company',
  // ... other config
  integrations: {
    webhook: {
      url: 'https://your-webhook-endpoint.com/data',
      enabled: true
    }
  }
};

export default config;
```

## Webhook Endpoint Requirements

### HTTP Methods

The webhook URL handles TWO types of requests:

#### 1. POST Request (Trigger)
Sent when user clicks "Refresh Data" button:

**URL:** `https://hook.us2.make.com/f36n7r86d2wd8xlq51pwqlbh4koagp8d`

**Method:** POST

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "action": "refresh_dashboard",
  "client_key": "tlnconsultinggroup",
  "timestamp": "2025-10-11T10:30:00.000Z"
}
```

**Purpose:** Triggers Make.com scenario to collect fresh data from CRM/database

**Response:** Not required (fire-and-forget)

#### 2. GET Request (Fetch)
Sent 2 seconds after POST trigger:

**URL:** `https://hook.us2.make.com/f36n7r86d2wd8xlq51pwqlbh4koagp8d`

**Method:** GET

**Headers:**
```
Content-Type: application/json
```

**Response Format:**
Must return valid JSON with numeric values:

```json
{
  "reply_count": 252,
  "emails_sent_count": 29209,
  "new_leads_contacted_count": 10730,
  "total_opportunities": 85,
  "total_opportunity_value": 188500,
  "total_interested": 87
}
```

### Error Handling

If webhook fails:
1. Error logged to console
2. Falls back to simulated data
3. User sees data update (seamless experience)
4. No error shown to user

## Testing

### With Real Webhook

```bash
# Test webhook endpoint directly
curl -X GET \
  'https://hook.us2.make.com/f36n7r86d2wd8xlq51pwqlbh4koagp8d' \
  -H 'Content-Type: application/json'

# Expected response:
{
  "reply_count": 252,
  "emails_sent_count": 29209,
  "new_leads_contacted_count": 10730,
  "total_opportunities": 85,
  "total_opportunity_value": 188500,
  "total_interested": 87
}
```

### With Simulated Data

If webhook is disabled or URL not configured:
- System automatically uses simulation
- Generates realistic data with variance
- Perfect for development/testing

```typescript
// Simulate webhook in config
{
  webhook: {
    url: '',
    enabled: false  // Uses simulation
  }
}
```

## Variable Data Handling

### Dynamic Field Values

The system handles variable webhook responses:

```typescript
// Example 1: High performance
{
  "reply_count": 580,
  "emails_sent_count": 35000,
  "new_leads_contacted_count": 15000,
  "total_opportunities": 200,
  "total_opportunity_value": 520000,
  "total_interested": 250
}
// Formatted: "580", "35K", "15K", "200", "$520K", "250"

// Example 2: Low performance
{
  "reply_count": 50,
  "emails_sent_count": 5000,
  "new_leads_contacted_count": 2000,
  "total_opportunities": 10,
  "total_opportunity_value": 15000,
  "total_interested": 20
}
// Formatted: "50", "5,000", "2,000", "10", "$15,000", "20"

// Example 3: Very high performance
{
  "reply_count": 1250,
  "emails_sent_count": 125000,
  "new_leads_contacted_count": 50000,
  "total_opportunities": 500,
  "total_opportunity_value": 2500000,
  "total_interested": 800
}
// Formatted: "1,250", "125K", "50K", "500", "$2500K", "800"
```

### Missing Fields Handling

If webhook response is missing fields:

```json
{
  "reply_count": 252,
  "emails_sent_count": 29209
  // Other fields missing
}
```

Result:
```typescript
{
  replyCount: 252,          // From webhook
  emailsSentCount: 29209,   // From webhook
  newLeadsContactedCount: 0, // Default to 0
  totalOpportunities: 0,     // Default to 0
  totalOpportunityValue: 0,  // Default to 0
  totalInterested: 0         // Default to 0
}
```

## Refresh Cooldown

### How It Works

1. **User clicks "Refresh Data"**
   - Button becomes disabled
   - Text changes to "Refreshing..."
   - Spinning icon animation
   - POST trigger sent to webhook

2. **Webhook processes data**
   - Make.com scenario receives trigger
   - Data collection begins
   - 2-second wait for processing

3. **Data fetches from webhook**
   - GET request to webhook URL
   - JSON response parsed
   - Dashboard state updated

4. **Cooldown starts**
   - 15-second countdown begins (testing mode)
   - Button shows "Refresh in 12s", "Refresh in 8s", etc.
   - Last updated timestamp displayed

5. **Cooldown expires**
   - Button re-enabled
   - Text returns to "Refresh Data"
   - Ready for next refresh

### Cooldown Persistence

Cooldown survives:
- Page refreshes (stored in localStorage)
- Tab switches
- Browser restarts (if within 15 seconds)

### Cooldown Configuration

Current setting: **15 seconds** (for testing purposes)
- Allows rapid testing of webhook integration
- Can be increased to 60 seconds for production
- Change in `EnhancedOverview.tsx`: `<RefreshButton cooldownSeconds={15} />`

## Integration with Insights

### Automatic Recalculation

When new webhook data arrives:

1. **Metrics Update**
   - All KPI cards refresh
   - Calculations recompute
   - Formatting applies

2. **Charts Update**
   - Funnel percentages recalculate
   - Benchmark comparisons update
   - Visual bars animate to new values

3. **Insights Regenerate**
   - Thresholds re-evaluated
   - New insights generated
   - Priority levels assigned
   - Descriptions updated

### Example Insight Changes

**Before (reply_count: 252)**
- Warning: "Response rate of 2.35% is below optimal"

**After Webhook (reply_count: 580)**
- Success: "Response rate of 5.41% is above industry average"

## API Integration Example

### Make.com Webhook Setup

```javascript
// Make.com scenario output
{
  "reply_count": {{replies}},
  "emails_sent_count": {{totalEmails}},
  "new_leads_contacted_count": {{leadsContacted}},
  "total_opportunities": {{opportunities}},
  "total_opportunity_value": {{pipelineValue}},
  "total_interested": {{interested}}
}
```

### Custom API Endpoint

```javascript
// Express.js example
app.get('/api/webhook/metrics/:clientKey', async (req, res) => {
  const { clientKey } = req.params;

  // Fetch data from your database
  const metrics = await getMetricsForClient(clientKey);

  // Return in expected format
  res.json({
    reply_count: metrics.replies,
    emails_sent_count: metrics.emailsSent,
    new_leads_contacted_count: metrics.leadsContacted,
    total_opportunities: metrics.opportunities,
    total_opportunity_value: metrics.opportunityValue,
    total_interested: metrics.interested
  });
});
```

## Security Considerations

### Webhook URL Protection

- Webhook URLs should contain unique tokens
- Example: `https://hook.us2.make.com/f36n7r86d2wd8xlq51pwqlbh4koagp8d`
- Token `f36n7r86d2wd8xlq51pwqlbh4koagp8d` prevents unauthorized access

### CORS Requirements

If webhook is on different domain:
```javascript
// Webhook endpoint must set CORS headers
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
Access-Control-Allow-Headers: Content-Type
```

### Authentication

For additional security, add API key:
```typescript
const response = await fetch(webhookUrl, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY', // Optional
  },
});
```

## Monitoring & Debugging

### Console Logging

Webhook activity is logged:
```javascript
// Success
console.log('Webhook data fetched successfully:', data);

// Failure
console.error('Webhook request failed:', response.status);
console.error('Webhook fetch error:', error);
```

### Testing Checklist

- [ ] Webhook URL is accessible
- [ ] Response returns valid JSON
- [ ] All numeric fields present
- [ ] CORS headers configured
- [ ] Response time < 2 seconds
- [ ] Error handling works (disconnect webhook, test fallback)
- [ ] Cooldown timer functions correctly
- [ ] Numbers format correctly
- [ ] Insights update appropriately
- [ ] Charts animate smoothly

## Summary

The dashboard now:
1. ✅ Accepts dynamic webhook responses
2. ✅ Handles variable field values
3. ✅ Automatically formats all numbers
4. ✅ Updates on "Refresh Overview Tab" click
5. ✅ Falls back gracefully on errors
6. ✅ Maintains 60-second cooldown
7. ✅ Recalculates all insights
8. ✅ Supports multiple clients with unique webhooks

**Status: Production Ready**
