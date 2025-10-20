import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface RefreshButtonProps {
  onRefresh: () => Promise<void> | void;
  cooldownSeconds?: number;
}

export function RefreshButton({ onRefresh, cooldownSeconds = 60 }: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState<number | null>(null);

  useEffect(() => {
    const storedTime = localStorage.getItem('lastDashboardRefresh');
    if (storedTime) {
      const timeElapsed = Date.now() - parseInt(storedTime);
      const remainingCooldown = cooldownSeconds * 1000 - timeElapsed;
      if (remainingCooldown > 0) {
        setCountdown(Math.ceil(remainingCooldown / 1000));
        setLastRefreshTime(parseInt(storedTime));
      }
    }
  }, [cooldownSeconds]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Helper: fetch with timeout
  const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs = 5000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      return res;
    } finally {
      clearTimeout(id);
    }
  };

  const triggerMakeWebhookAndWait = async () => {
    try {
      const res = await fetchWithTimeout(
        'https://hook.us2.make.com/f36n7r86d2wd8xlq51pwqlbh4koagp8d',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ source: 'app.bookedbycold.com', action: 'refresh_click', ts: new Date().toISOString() })
        },
        5500 // allow up to ~5.5s to accommodate network jitter
      );

      // Attempt to parse JSON; fall back to text
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        return { ok: res.ok, status: res.status, body: text };
      }
    } catch (e) {
      console.warn('Make.com webhook request failed or timed out (~5s):', e);
      return null;
    }
  };

  const handleRefresh = async () => {
    if (countdown > 0 || isRefreshing) return;

    setIsRefreshing(true);
    const refreshTime = Date.now();
    setLastRefreshTime(refreshTime);
    localStorage.setItem('lastDashboardRefresh', refreshTime.toString());

    try {
      // Await webhook response (up to ~5s)
      const webhookResponse = await triggerMakeWebhookAndWait();
      if (webhookResponse) {
        console.log('Make.com webhook response:', webhookResponse);
      }

      await onRefresh();
      setCountdown(cooldownSeconds);
    } catch (error) {
      console.error('Refresh failed:', error);
      setCountdown(cooldownSeconds);
    } finally {
      setIsRefreshing(false);
    }
  };

  const isDisabled = countdown > 0 || isRefreshing;

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleRefresh}
        disabled={isDisabled}
        className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
          isDisabled
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95'
        }`}
      >
        <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Refreshing...' : countdown > 0 ? `Refresh in ${countdown}s` : 'Refresh Data'}
      </button>
      {lastRefreshTime && (
        <div className="text-sm text-gray-600">
          Last updated: {new Date(lastRefreshTime).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}

export default RefreshButton;
