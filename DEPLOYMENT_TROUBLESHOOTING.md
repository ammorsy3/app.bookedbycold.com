# Webhook Deployment Troubleshooting Guide

## Why Webhooks Work in Bolt Preview But Not After Deployment

### The Problem
When your site runs in Bolt's preview environment, it may bypass certain browser security restrictions. However, when deployed to your custom domain, browsers enforce **CORS (Cross-Origin Resource Sharing)** policies that can block webhook requests.

### Common Deployment Issues

#### 1. CORS Errors
**Symptoms:**
- Webhook works in preview but fails on deployed site
- Browser console shows: `Access to fetch at 'https://hook.us2.make.com/...' from origin 'https://yourdomain.com' has been blocked by CORS policy`

**Solution:**
Your Make.com webhook must return these headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept
```

#### 2. HTTPS/HTTP Mixed Content
**Symptoms:**
- Webhook fails with "Mixed Content" error
- Site is HTTPS but webhook is HTTP

**Solution:**
Ensure your webhook URL uses HTTPS (which Make.com does by default)

#### 3. Network Restrictions
**Symptoms:**
- Webhook times out or fails to connect
- No specific error message

**Solution:**
- Verify webhook URL is accessible from your domain
- Check if your hosting provider blocks external requests

## Debugging Steps

### Step 1: Check Browser Console
Open Developer Tools (F12) and look for these messages:

**✅ Success:**
```
🔄 Starting refresh process...
🌐 Webhook configured: https://hook.us2.make.com/...
Sending webhook trigger with payload: {...}
Webhook trigger sent successfully, waiting for data processing...
✅ Webhook data received, updating dashboard...
```

**❌ CORS Error:**
```
❌ CORS Error: Your webhook endpoint needs to include these headers:
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: GET, POST, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Accept
```

**❌ Network Error:**
```
❌ Network Error: Check if webhook URL is accessible from your domain
```

### Step 2: Test Webhook Manually
Test your webhook directly in browser console:

```javascript
// Test GET request
fetch('https://hook.us2.make.com/f36n7r86d2wd8xlq51pwqlbh4koagp8d')
  .then(response => {
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    return response.json();
  })
  .then(data => console.log('Data:', data))
  .catch(error => console.error('Error:', error));
```

### Step 3: Check Make.com Scenario
1. Log into Make.com
2. Check your scenario execution history
3. Verify it's receiving requests from your deployed domain
4. Ensure it's returning proper CORS headers

## Make.com CORS Configuration

### Option 1: HTTP Response Module
Add an HTTP Response module to your scenario:

```json
{
  "status": 200,
  "headers": {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Content-Type": "application/json"
  },
  "body": {
    "reply_count": "{{your_data}}",
    "emails_sent_count": "{{your_data}}",
    "new_leads_contacted_count": "{{your_data}}",
    "total_opportunities": "{{your_data}}",
    "total_opportunity_value": "{{your_data}}",
    "total_interested": "{{your_data}}"
  }
}
```

### Option 2: Webhook Settings
In your webhook module settings, ensure:
- **CORS**: Enabled
- **Methods**: GET, POST, OPTIONS
- **Headers**: Content-Type, Accept

## Testing Checklist

### Before Deployment
- [ ] Test webhook in Make.com directly
- [ ] Verify CORS headers are included
- [ ] Check scenario execution history
- [ ] Test both POST and GET requests

### After Deployment
- [ ] Open deployed site in browser
- [ ] Open Developer Tools (F12)
- [ ] Click "Refresh Data" button
- [ ] Check Console tab for error messages
- [ ] Check Network tab for failed requests
- [ ] Verify Make.com receives requests

### If Still Not Working
- [ ] Try different browser (Chrome, Firefox, Safari)
- [ ] Test on different device/network
- [ ] Check hosting provider restrictions
- [ ] Contact Make.com support for CORS help

## Alternative Solutions

### Option 1: Proxy Through Your Backend
If CORS continues to be an issue, create a proxy endpoint on your server:

```javascript
// Your server endpoint
app.post('/api/webhook-proxy', async (req, res) => {
  try {
    const response = await fetch('https://hook.us2.make.com/f36n7r86d2wd8xlq51pwqlbh4koagp8d', {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Webhook failed' });
  }
});
```

Then update your webhook URL in the config:
```typescript
webhook: {
  url: 'https://yourdomain.com/api/webhook-proxy',
  enabled: true
}
```

### Option 2: Use Netlify Functions
If deploying to Netlify, create a serverless function:

```javascript
// netlify/functions/webhook.js
exports.handler = async (event, context) => {
  try {
    const response = await fetch('https://hook.us2.make.com/f36n7r86d2wd8xlq51pwqlbh4koagp8d', {
      method: event.httpMethod,
      headers: { 'Content-Type': 'application/json' },
      body: event.body
    });
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook failed' })
    };
  }
};
```

## Quick Fixes

### 1. Enable CORS in Make.com
Most common solution - ensure your Make.com webhook returns CORS headers.

### 2. Use JSONP (Not Recommended)
Only as last resort, not secure for production.

### 3. Server-Side Proxy
Most reliable solution if CORS can't be configured.

## Support Contacts

### Make.com Support
- Help with CORS configuration
- Webhook troubleshooting
- Scenario optimization

### Hosting Provider
- Network restrictions
- HTTPS configuration
- Server-side proxy setup

## Status Indicators

When debugging, look for these console messages:

- 🔄 **Starting refresh process** - Button clicked
- 🌐 **Webhook configured** - URL found in config
- ✅ **Webhook data received** - Success!
- ⚠️ **Webhook failed** - Error occurred
- 📊 **Using simulated data** - Fallback activated
- ❌ **CORS Error** - Headers missing
- ❌ **Network Error** - Connection failed

The system will always work (using simulated data as fallback), but these indicators help you identify and fix the webhook connection.