import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface RefreshButtonProps {
  onRefresh: () => void;
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

  const handleRefresh = async () => {
    if (countdown > 0 || isRefreshing) return;

    setIsRefreshing(true);
    const refreshTime = Date.now();
    setLastRefreshTime(refreshTime);
    localStorage.setItem('lastDashboardRefresh', refreshTime.toString());

    try {
      await onRefresh();
      setCountdown(cooldownSeconds);
    } catch (error) {
      console.error('Refresh failed:', error);
      // Still start cooldown even if refresh failed to prevent spam
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