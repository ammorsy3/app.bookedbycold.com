import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { webhookUrl, method = 'GET', payload } = await req.json();

    if (!webhookUrl) {
      return new Response(
        JSON.stringify({ error: 'webhookUrl is required' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log(`Proxying ${method} request to:`, webhookUrl);

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    if (method === 'POST' && payload) {
      fetchOptions.body = JSON.stringify(payload);
    }

    const response = await fetch(webhookUrl, fetchOptions);

    if (!response.ok) {
      console.error('Webhook request failed:', response.status, response.statusText);
      return new Response(
        JSON.stringify({
          error: 'Webhook request failed',
          status: response.status,
          statusText: response.statusText,
        }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const text = await response.text();

    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Webhook returned empty response' }),
        {
          status: 204,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.warn('Webhook response is not JSON:', text.substring(0, 100));
      return new Response(
        JSON.stringify({ error: 'Invalid JSON response from webhook', rawResponse: text.substring(0, 200) }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('Webhook data received successfully');

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});