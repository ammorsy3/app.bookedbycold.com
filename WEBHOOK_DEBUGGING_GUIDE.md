# Webhook Debugging Guide

This guide helps diagnose and fix webhook issues in production.

## Common Issues

### 1. CORS (Cross-Origin Resource Sharing) Errors

**Symptom:** Console shows errors like:
```
Access to fetch at 'https://hook.us2.make.com/...' from origin 'https://yoursite.com' has been blocked by CORS policy
```

**Solution:**
Your webhook endpoint (Make.com scenario) needs to return proper CORS headers:
- `Access-Control-Allow-Origin: *` (or your specific domain)
- `Access-Control-Allow-Methods: POST, GET, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

**How to fix in Make.com:**
1. Add a "HTTP Response" module at the end of your scenario
2. Set Status Code: 200
3. Add Headers:
   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: POST, GET, OPTIONS
   Access-Control-Allow-Headers: Content-Type
   ```
4. Return your data as JSON in the Body field

### 2. Webhook Not Returning JSON

**Symptom:** Console shows:
```
[Webhook] Failed to parse response: SyntaxError: Unexpected token...
```

**Solution:**
Make sure your webhook returns valid JSON:
```json
{
  "reply_count": 150,
  "emails_sent_count": 18200,
  "new_leads_contacted_count": 7234,
  "total_opportunities": 45,
  "total_opportunity_value": 108000,
  "total_interested": 45
}
```

### 3. Webhook URL Not Configured

**Symptom:** Console shows:
```
[Refresh] Webhook not configured, using simulated data
```

**Solution:**
Check `/src/clients/{clientkey}/config.ts` has:
```typescript
webhook: {
  url: 'https://hook.us2.make.com/YOUR_WEBHOOK_ID',
  enabled: true
}
```

### 4. Network/Timeout Issues

**Symptom:** Console shows:
```
[Webhook] Network or fetch error: Failed to fetch
```

**Possible causes:**
- Webhook URL is incorrect
- Make.com scenario is turned off
- Network connectivity issues
- Webhook endpoint is slow (>30s timeout)

**Solution:**
1. Verify webhook URL is correct
2. Check Make.com scenario is active
3. Test webhook directly using curl or Postman
4. Check webhook response time

## Debugging Steps

### Step 1: Check Browser Console

1. Open Developer Tools (F12)
2. Go to Console tab
3. Click "Refresh Data" button
4. Look for logs starting with `[Refresh]` and `[Webhook]`

### Step 2: Verify Webhook Configuration

Check your client config file has the correct webhook URL:

```typescript
// /src/clients/tlnconsultinggroup/config.ts
webhook: {
  url: 'https://hook.us2.make.com/f36n7r86d2wd8xlq51pwqlbh4koagp8d',
  enabled: true
}
```

### Step 3: Test Webhook Directly

Use curl to test the webhook:

```bash
curl -X POST https://hook.us2.make.com/YOUR_WEBHOOK_ID \
  -H "Content-Type: application/json" \
  -d '{
    "action": "refresh_dashboard",
    "client_key": "tlnconsultinggroup",
    "timestamp": "2025-01-15T12:00:00.000Z",
    "startDate": "2025-08-06",
    "endDate": "2025-10-12"
  }'
```

Expected response (with CORS headers):
```json
{
  "reply_count": 150,
  "emails_sent_count": 18200,
  "new_leads_contacted_count": 7234,
  "total_opportunities": 45,
  "total_opportunity_value": 108000,
  "total_interested": 45
}
```

### Step 4: Check Make.com Scenario

1. Log into Make.com
2. Find your scenario
3. Check "History" tab for recent executions
4. Verify the scenario is "ON"
5. Check for errors in execution logs

### Step 5: Network Tab Analysis

1. Open Developer Tools (F12)
2. Go to Network tab
3. Click "Refresh Data"
4. Find the request to `hook.us2.make.com`
5. Check:
   - Status code (should be 200)
   - Response headers (check for CORS headers)
   - Response body (should be valid JSON)
   - Timing (should complete in a few seconds)

## Console Logs Explained

### Successful Webhook Call
```
[Refresh] Starting refresh process...
[Refresh] Client key: tlnconsultinggroup
[Refresh] Client config loaded: tlnconsultinggroup
[Refresh] Webhook enabled: true
[Refresh] Webhook URL: https://hook.us2.make.com/...
[Refresh] Calling webhook: https://hook.us2.make.com/...
[Webhook] Sending POST request to: https://hook.us2.make.com/...
[Webhook] Payload: {...}
[Webhook] Response status: 200
[Webhook] Response ok: true
[Webhook] Response text length: 234
[Webhook] Response text: {"reply_count":150,...}
[Webhook] Parsed response: {...}
[Refresh] Webhook response: {...}
[Refresh] Updating metrics with webhook data
```

### Failed Webhook Call (CORS)
```
[Refresh] Starting refresh process...
...
[Webhook] Network or fetch error: TypeError: Failed to fetch
[Webhook] Error message: Failed to fetch
[Refresh] Webhook returned invalid data, falling back to simulated data
```

### Failed Webhook Call (Invalid JSON)
```
[Webhook] Response text: <html>Error page</html>
[Webhook] Failed to parse response: SyntaxError: Unexpected token '<'
[Webhook] Raw text: <html>Error page</html>
```

## Make.com Webhook Setup

### Scenario Structure
```
1. Webhook Trigger (Receive data)
   ↓
2. Router/Filter (Process based on client_key)
   ↓
3. Airtable/Database Query (Fetch real data)
   ↓
4. Aggregator (Calculate metrics)
   ↓
5. JSON Module (Format response)
   ↓
6. HTTP Response (Return data with CORS headers)
```

### HTTP Response Module Settings
```
Status Code: 200
Headers:
  - Name: Content-Type
    Value: application/json
  - Name: Access-Control-Allow-Origin
    Value: *
  - Name: Access-Control-Allow-Methods
    Value: POST, GET, OPTIONS
  - Name: Access-Control-Allow-Headers
    Value: Content-Type
Body:
{
  "reply_count": {{aggregated_replies}},
  "emails_sent_count": {{aggregated_emails}},
  "new_leads_contacted_count": {{aggregated_leads}},
  "total_opportunities": {{aggregated_opportunities}},
  "total_opportunity_value": {{aggregated_value}},
  "total_interested": {{aggregated_interested}}
}
```

## Production vs Development

### Development (localhost)
- Webhooks usually work fine
- CORS is less strict
- Same-origin policy relaxed

### Production (deployed site)
- CORS headers REQUIRED
- Webhook must respond quickly (<30s)
- HTTPS required for secure sites
- Browser security is stricter

## Testing Checklist

- [ ] Webhook URL is correct in client config
- [ ] Webhook is enabled (`enabled: true`)
- [ ] Make.com scenario is turned ON
- [ ] Make.com scenario has HTTP Response module
- [ ] HTTP Response includes CORS headers
- [ ] Response returns valid JSON
- [ ] Test with curl succeeds
- [ ] Browser console shows detailed logs
- [ ] Network tab shows 200 status code
- [ ] No CORS errors in console

## Alternative: Use Supabase Edge Function

If Make.com webhooks continue to have issues, consider using a Supabase Edge Function as a proxy:

1. Create Edge Function to call Make.com
2. Edge Function handles CORS automatically
3. Frontend calls Edge Function instead of Make.com directly
4. More reliable in production

Would you like help setting this up?
