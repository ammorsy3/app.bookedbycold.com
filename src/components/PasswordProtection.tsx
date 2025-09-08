import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, Mail } from 'lucide-react';

interface PasswordProtectionProps {
  onAuthenticated: () => void;
  clientName?: string;
}

export default function PasswordProtection({ onAuthenticated, clientName = 'Client' }: PasswordProtectionProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Client-specific credentials
  const clientCredentials = {
    'tlnconsultinggroup': {
      email: 'travis.lairson@tlnconsultinggroup.com',
      password: 'A7med&Travis@TLN',
      displayName: 'TLN Consulting Group'
    }
  };

  // Get current client from URL path
  const getCurrentClient = () => {
    const path = window.location.pathname;
    const pathParts = path.split('/').filter(part => part);
    return pathParts[0] || null;
  };

  const currentClient = getCurrentClient();
  const credentials = currentClient ? clientCredentials[currentClient] : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a brief loading state for better UX
    setTimeout(() => {
      if (!credentials) {
        setError('Invalid client access. Please check your URL.');
        setIsLoading(false);
        return;
      }

      if (email === credentials.email && password === credentials.password) {
        const storageKey = `${currentClient}Authenticated`;
        const expiryKey = `${currentClient}AuthExpiry`;

        if (rememberMe) {
          // Store authentication in localStorage with 96-hour expiry
          const expiryTime = Date.now() + (96 * 60 * 60 * 1000); // 96 hours in milliseconds
          localStorage.setItem(storageKey, 'true');
          localStorage.setItem(expiryKey, expiryTime.toString());
        } else {
          // Store authentication in sessionStorage (expires when browser closes)
          sessionStorage.setItem(storageKey, 'true');
        }
        onAuthenticated();
      } else {
        setError('Incorrect email or password. Please try again.');
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  // If no client is specified in URL, show generic access page
  if (!currentClient || !credentials) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">BookedByCold</h1>
          <p className="text-blue-200 mb-8">Client Dashboard Platform</p>
          
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Access Your Dashboard</h2>
            <p className="text-gray-600 mb-6">
              Please use your specific client URL to access your dashboard:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <code className="text-sm text-gray-700">
                app.bookedbycold.com/project-name/
              </code>
            </div>
            <p className="text-sm text-gray-500">
              Contact support if you need assistance accessing your dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{credentials.displayName}</h1>
          <p className="text-blue-200">Client Dashboard Access</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Secure Access Required</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter your email..."
                  required
                  disabled={isLoading}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter password..."
                  required
                  disabled={isLoading}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                disabled={isLoading}
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                Remember me for 4 days
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Access Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              This dashboard contains confidential client information. 
              <br />
              Authorized access only.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-blue-200">
            Powered by BookedByCold • Secure Client Portal
          </p>
        </div>
      </div>
    </div>
  );
}
