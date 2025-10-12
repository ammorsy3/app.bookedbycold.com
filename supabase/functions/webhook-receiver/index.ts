import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload = await req.json();
    console.log('Received webhook payload:', payload);

    if (!payload.overAllCampaignAnalytics) {
      return new Response(
        JSON.stringify({ error: 'Missing overAllCampaignAnalytics' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { overAllCampaignAnalytics, dailyCampaignAnalytics } = payload;
    const clientKey = payload.client_key || 'tlnconsultinggroup';

    const parseNumber = (value: any): number => {
      if (value === null || value === undefined || value === '') return 0;
      const parsed = typeof value === 'string' ? parseInt(value, 10) : Number(value);
      return isNaN(parsed) ? 0 : parsed;
    };

    let dailyData = null;
    if (dailyCampaignAnalytics) {
      try {
        dailyData = typeof dailyCampaignAnalytics === 'string'
          ? JSON.parse(dailyCampaignAnalytics)
          : dailyCampaignAnalytics;
      } catch (e) {
        console.error('Failed to parse daily analytics:', e);
      }
    }

    const { data, error } = await supabase
      .from('campaign_analytics')
      .insert({
        client_key: clientKey,
        total_reply_count: parseNumber(overAllCampaignAnalytics.total_reply_count),
        total_emails_sent_count: parseNumber(overAllCampaignAnalytics.total_emails_sent_count),
        total_new_leads_contacted_count: parseNumber(overAllCampaignAnalytics.total_new_leads_contacted_count),
        total_opportunities: parseNumber(overAllCampaignAnalytics.total_opportunities),
        total_opportunity_value: parseNumber(overAllCampaignAnalytics.total_opportunity_value),
        daily_analytics: dailyData,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save data', details: error }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Successfully saved analytics data:', data);

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});