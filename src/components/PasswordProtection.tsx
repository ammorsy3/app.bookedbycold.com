import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Shield, Mail } from 'lucide-react';
import PasskeyLogin, { PasskeyAvailabilityIndicator } from './PasskeyLogin';
import PasskeySetup from './PasskeySetup';

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

  // Per-user client keys (Option A: per-user URLs)
  const emailToClientKey: Record<string, { key: string; displayName: string; password: string }> = {
    'travis.lairson@tlnconsultinggroup.com': { key: 'tlnconsultinggroup/travis', displayName: 'Travis Lairson', password: 'A7med&Travis@TLN' },
    'katlambright@yahoo.com': { key: 'tlnconsultinggroup/kathy', displayName: 'Kathy Lambright', password: 'A7med&Kathy@TLN' },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    authenticateUser(email, password);
  };

  const authenticateUser = (userEmail: string, userPassword?: string) => {
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const mapping = emailToClientKey[userEmail];
      const valid = mapping && (!userPassword || mapping.password === userPassword);

      if (mapping && valid) {
        // Persist display name for header
        localStorage.setItem('tlnconsultinggroupUserName', mapping.displayName);

        // Auth keys must exactly match the per-user clientKey used in route
        const storageKey = `${mapping.key}Authenticated`;
        const expiryKey = `${mapping.key}AuthExpiry`;

        if (rememberMe) {
          const expiryTime = Date.now() + 96 * 60 * 60 * 1000; // 4 days
          localStorage.setItem(storageKey, 'true');
          localStorage.setItem(expiryKey, expiryTime.toString());
        } else {
          sessionStorage.setItem(storageKey, 'true');
        }

        // Navigate to per-user overview (Option A)
        navigate(`/${mapping.key}/overview`, { replace: true });
      } else {
        setError(userPassword ? 'Incorrect email or password. Please try again.' : 'No account found with this email address.');
        setPassword('');
      }

      setIsLoading(false);
    }, 250);
  };

  const handlePasskeySuccess = (userEmail: string) => {
    // For passkey flow, skip password and route using Option A
    const mapping = emailToClientKey[userEmail];
    if (mapping) {
      localStorage.setItem('tlnconsultinggroupUserName', mapping.displayName);
      const storageKey = `${mapping.key}Authenticated`;
      sessionStorage.setItem(storageKey, 'true');
      navigate(`/${mapping.key}/overview`, { replace: true });
    } else {
      setError('No account found with this email address.');
    }
  };

  const handlePasskeyError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">BookedByCold</h1>
          <p className="text-blue-200">Client Dashboard Platform</p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Client Login</h2>
          </div>

          {email && <PasskeyAvailabilityIndicator userEmail={email} />}
          <PasskeyLogin userEmail={email || undefined} onSuccess={handlePasskeySuccess} onError={handlePasskeyError} className="mb-6" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <input type="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" placeholder="Enter your email..." required disabled={isLoading} />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text':'password'} id="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" placeholder="Enter password..." required disabled={isLoading} />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200" disabled={isLoading}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={(e)=>setRememberMe(e.target.checked)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" disabled={isLoading} />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">Remember me for 4 days</label>
            </div>

            {error && (<div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-sm text-red-600">{error}</p></div>)}

            <button type="submit" disabled={isLoading || !email || !password} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
              {isLoading ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Verifying...</>) : (<><Lock className="w-4 h-4" />Access Dashboard</>)}
            </button>
          </form>
        </div>

        <div className="text-center mt-8"><p className="text-sm text-blue-200">Powered by BookedByCold • Secure Client Portal</p></div>
      </div>

      {showPasskeySetup && authenticatedEmail && (
        <PasskeySetup userEmail={authenticatedEmail} userDisplayName={emailToClientKey[authenticatedEmail].displayName} onClose={()=>{setShowPasskeySetup(false)}} onSuccess={()=>{setShowPasskeySetup(false)}} />
      )}
    </div>
  );
}
