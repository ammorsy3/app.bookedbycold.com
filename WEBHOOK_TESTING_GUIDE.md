# Quick Start: Webhook Testing

## What Changed

### 1. Cooldown Reduced to 15 Seconds
- Changed from 60 seconds to 15 seconds for testing
- Allows rapid testing of webhook integration
- File: `src/components/EnhancedOverview.tsx` line 133

### 2. Webhook Trigger Added
When user clicks "Refresh Data" button, the system now:

**Step 1: POST Trigger (immediate)**
```
POST https://hook.us2.make.com/f36n7r86d2wd8xlq51pwqlbh4koagp8d
Body: {
  "action": "refresh_dashboard",
  "client_key": "tlnconsultinggroup",
  "timestamp": "2025-10-11T..."
}
```

**Step 2: Wait 2 seconds** (gives webhook time to process)

**Step 3: GET Request (fetch data)**
```
GET https://hook.us2.make.com/f36n7r86d2wd8xlq51pwqlbh4koagp8d
Response: {
  "reply_count": 252,
  "emails_sent_count": 29209,
  ...
}
```

**Step 4: Update Dashboard** with formatted numbers

## Testing Flow

### 1. Click "Refresh Data" Button
Location: Top right of Overview tab

### 2. Observe Browser Console
```javascript
// You should see:
"Webhook trigger sent successfully"
// Then after 2 seconds:
"Webhook data fetched: { reply_count: 252, ... }"
```

### 3. Check Make.com Scenario
- Log into Make.com
- View execution history
- You should see the POST trigger arrive with payload

### 4. Wait for Dashboard Update
- Numbers will update with fresh data
- All formatting applies automatically
- Cooldown shows "Refresh in 14s, 13s, 12s..."

### 5. Try Again After 15 Seconds
- Button becomes clickable again
- Can test multiple times rapidly

## Make.com Setup Required

Your Make.com scenario should:

### 1. Accept POST Request
- URL: `https://hook.us2.make.com/f36n7r86d2wd8xlq51pwqlbh4koagp8d`
- Trigger on POST with body containing `action: "refresh_dashboard"`

### 2. Collect Fresh Data
- Query your CRM/database
- Calculate metrics
- Store in data store (optional)

### 3. Accept GET Request
- Same URL: `https://hook.us2.make.com/f36n7r86d2wd8xlq51pwqlbh4koagp8d`
- Return JSON with latest metrics

### Example Make.com Flow
```
1. Webhook Trigger (POST)
   ↓
2. Parse request body
   ↓
3. Query Airtable/CRM
   ↓
4. Calculate totals
   ↓
5. Store in Data Store
   ↓
6. (Webhook responds to GET with stored data)
```

## Expected JSON Response

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

All fields are **required**. Missing fields will default to 0.

## Dashboard Formatting Applied

| Raw Value | Formatted | Rule |
|-----------|-----------|------|
| 252 | "252" | < 1K = as-is |
| 29,209 | "29K" | 10K-99K = compact |
| 10,730 | "11K" | 10K-99K = compact (rounded) |
| 85 | "85" | < 1K = as-is |
| 188,500 | "$189K" | 100K+ = currency K |
| 87 | "87" | < 1K = as-is |

## Troubleshooting

### Webhook Not Triggering?
**Check:**
1. Console for errors: `F12` → Console tab
2. Network tab: See POST/GET requests
3. Make.com execution history: Verify receipt

### Data Not Updating?
**Check:**
1. GET request returns valid JSON
2. All numeric fields present (not strings)
3. No CORS errors in console
4. Response time < 5 seconds

### Cooldown Issues?
**Check:**
1. localStorage: `key: webhook-cooldown-tlnconsultinggroup`
2. Clear if stuck: `localStorage.clear()`
3. Refresh page

## Testing Checklist

- [ ] Build succeeds: `npm run build`
- [ ] Can click "Refresh Data" button
- [ ] POST request appears in network tab
- [ ] Make.com receives POST trigger
- [ ] 2-second delay happens
- [ ] GET request appears in network tab
- [ ] Dashboard numbers update
- [ ] All numbers formatted correctly
- [ ] Cooldown shows 15s, 14s, 13s...
- [ ] Button re-enables after 15 seconds
- [ ] Can refresh again immediately

## Current Webhook URL

```
https://hook.us2.make.com/f36n7r86d2wd8xlq51pwqlbh4koagp8d
```

**Handles both:**
- POST (trigger)
- GET (fetch)

## Next Steps

1. Test the refresh flow
2. Verify Make.com receives triggers
3. Confirm data updates correctly
4. Check number formatting
5. Adjust cooldown if needed (change from 15 to 60 for production)

## Production Deployment

Before going live:

1. **Increase cooldown to 60 seconds**
   ```typescript
   <RefreshButton cooldownSeconds={60} />
   ```

2. **Add error notifications** (optional)
   - Toast messages for webhook failures
   - User-friendly error states

3. **Add loading states** (optional)
   - Skeleton screens during fetch
   - Smooth transitions

4. **Monitor webhook performance**
   - Response times
   - Success/failure rates
   - Data accuracy

## Status: ✅ Ready for Testing

- Cooldown: 15 seconds
- Webhook trigger: Enabled
- Webhook URL: Configured
- Formatting: Active
- Build: Passing
