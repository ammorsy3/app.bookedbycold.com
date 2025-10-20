import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Shield, Mail } from 'lucide-react';
import PasskeyLogin, { PasskeyAvailabilityIndicator } from './PasskeyLogin';
import PasskeySetup from './PasskeySetup';

// The 'onAuthenticated' and 'clientName' props are no longer needed
// as this component now handles redirection itself.
export default function PasswordProtection() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasskeySetup, setShowPasskeySetup] = useState(false);
  const [authenticatedEmail, setAuthenticatedEmail] = useState<string | null>(null);

  // All client credentials are in one place.
  // In a real application, you would fetch this from a secure API.
  const clientCredentials = {
    'tlnconsultinggroup': {
      email: 'travis.lairson@tlnconsultinggroup.com',
      password: 'A7med&Travis@TLN',
      displayName: 'Travis Lairson'
    },
    // Testing credentials for Ahmed
    'testclient': {
      email: 'ahmorsy07@gmail.com',
      password: 'A7med&Do3a',
      displayName: 'Ahmed Morsy'
    },
    // You can add more clients here in the future
    // 'newclient': {
    //   email: 'contact@newclient.com',
    //   password: 'securepassword123',
    //   displayName: 'New Client User'
    // }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    authenticateUser(email, password);
  };

  const authenticateUser = (userEmail: string, userPassword?: string) => {
    setIsLoading(true);
    setError('');

    // Simulate an API call
    setTimeout(() => {
      // Find which client's credentials match the input
      const clientKey = Object.keys(clientCredentials).find(key => {
        const creds = clientCredentials[key as keyof typeof clientCredentials];
        // For passkey authentication, only check email
        if (!userPassword) {
          return creds.email === userEmail;
        }
        // For password authentication, check both email and password
        return creds.email === userEmail && creds.password === userPassword;
      });

      if (clientKey) {
        // If a match is found, set authentication state
        const storageKey = `${clientKey}Authenticated`;
        const expiryKey = `${clientKey}AuthExpiry`;

        if (rememberMe) {
          // Store authentication in localStorage with 96-hour expiry
          const expiryTime = Date.now() + (96 * 60 * 60 * 1000); // 96 hours
          localStorage.setItem(storageKey, 'true');
          localStorage.setItem(expiryKey, expiryTime.toString());
        } else {
          // Store authentication in sessionStorage (clears on browser close)
          sessionStorage.setItem(storageKey, 'true');
        }
        
        // If this was a successful password login, offer to set up passkey
        if (userPassword) {
          const credentials = clientCredentials[clientKey as keyof typeof clientCredentials];
          setAuthenticatedEmail(credentials.email);
          setShowPasskeySetup(true);
          // Don't navigate yet, wait for passkey setup decision
        } else {
          // Direct navigation for passkey login
          navigate(`/${clientKey}`);
        }

      } else {
        // If no match is found, show an error
        if (userPassword) {
          setError('Incorrect email or password. Please try again.');
        } else {
          setError('No account found with this email address.');
        }
        setPassword('');
      }

      setIsLoading(false);
    }, 500);
  };

  const handlePasskeySuccess = (userEmail: string) => {
    // Find the client key for this email and authenticate
    authenticateUser(userEmail);
  };

  const handlePasskeyError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handlePasskeySetupComplete = () => {
    setShowPasskeySetup(false);
    // Now navigate to dashboard
    const clientKey = Object.keys(clientCredentials).find(key => {
      const creds = clientCredentials[key as keyof typeof clientCredentials];
      return creds.email === authenticatedEmail;
    });
    
    if (clientKey) {
      navigate(`/${clientKey}`);
    }
  };

  const handleSkipPasskeySetup = () => {
    setShowPasskeySetup(false);
    // Navigate to dashboard without setting up passkey
    const clientKey = Object.keys(clientCredentials).find(key => {
      const creds = clientCredentials[key as keyof typeof clientCredentials];
      return creds.email === authenticatedEmail;
    });
    
    if (clientKey) {
      navigate(`/${clientKey}`);
    }
  };

  // This component now always renders the unified login form.
  // The generic "Access Your Dashboard" page has been removed.
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Generic Header for the main login page */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">BookedByCold</h1>
          <p className="text-blue-200">Client Dashboard Platform</p>
        </div>

        {/* Unified Login Form */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Client Login</h2>
          </div>

          {/* Passkey Availability Indicator */}
          {email && <PasskeyAvailabilityIndicator userEmail={email} />}
          
          {/* Passkey Login Option */}
          <PasskeyLogin
            userEmail={email || undefined}
            onSuccess={handlePasskeySuccess}
            onError={handlePasskeyError}
            className="mb-6"
          />

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

      {/* Passkey Setup Modal */}
      {showPasskeySetup && authenticatedEmail && (
        <PasskeySetup
          userEmail={authenticatedEmail}
          userDisplayName={Object.values(clientCredentials).find(c => c.email === authenticatedEmail)?.displayName || 'User'}
          onClose={handleSkipPasskeySetup}
          onSuccess={handlePasskeySetupComplete}
        />
      )}
    </div>
  );
}