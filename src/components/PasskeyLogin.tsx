import React, { useState, useEffect } from 'react';
import { Fingerprint, AlertCircle, Loader } from 'lucide-react';
import {
  isWebAuthnSupported,
  isPlatformAuthenticatorAvailable,
  authenticateWithPasskey,
  getStoredPasskeys,
  hasStoredPasskeys,
} from '../utils/webauthn';

interface PasskeyLoginProps {
  userEmail?: string;
  onSuccess: (email: string) => void;
  onError: (error: string) => void;
  className?: string;
}

export default function PasskeyLogin({ userEmail, onSuccess, onError, className = '' }: PasskeyLoginProps) {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isPlatformAvailable, setIsPlatformAvailable] = useState<boolean | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [hasPasskeys, setHasPasskeys] = useState(false);

  useEffect(() => {
    async function checkSupport() {
      const supported = isWebAuthnSupported();
      const platformAvailable = await isPlatformAuthenticatorAvailable();
      
      setIsSupported(supported);
      setIsPlatformAvailable(platformAvailable);
      
      if (userEmail) {
        setHasPasskeys(hasStoredPasskeys(userEmail));
      } else {
        // Check if any passkeys exist in localStorage
        const keys = Object.keys(localStorage).filter(key => key.startsWith('passkeys_'));
        setHasPasskeys(keys.some(key => {
          const stored = localStorage.getItem(key);
          return stored && JSON.parse(stored).length > 0;
        }));
      }
    }
    checkSupport();
  }, [userEmail]);

  const handlePasskeyLogin = async () => {
    if (!isSupported || !isPlatformAvailable) {
      onError('Passkeys are not supported on this device');
      return;
    }

    setIsAuthenticating(true);

    try {
      let allowedCredentials;
      
      if (userEmail) {
        // If we have a specific user email, use their stored passkeys
        const storedPasskeys = getStoredPasskeys(userEmail);
        allowedCredentials = storedPasskeys.map(p => ({ credentialId: p.credentialId }));
      }

      const result = await authenticateWithPasskey(allowedCredentials);
      
      // In a real application, you would verify the signature on your server
      // and return the user information. For this demo, we'll find the user
      // based on stored passkeys.
      
      let authenticatedEmail = userEmail;
      
      if (!authenticatedEmail) {
        // Find which user this credential belongs to
        const keys = Object.keys(localStorage).filter(key => key.startsWith('passkeys_'));
        
        for (const key of keys) {
          const email = key.replace('passkeys_', '');
          const storedPasskeys = getStoredPasskeys(email);
          
          if (storedPasskeys.some(p => p.credentialId === result.credentialId)) {
            authenticatedEmail = email;
            break;
          }
        }
      }
      
      if (authenticatedEmail) {
        onSuccess(authenticatedEmail);
      } else {
        onError('Could not find user for this passkey');
      }
    } catch (err) {
      console.error('Passkey authentication failed:', err);
      onError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Don't render if WebAuthn is not supported or no passkeys exist
  if (isSupported === false || isPlatformAvailable === false || !hasPasskeys) {
    return null;
  }

  // Show loading state while checking support
  if (isSupported === null || isPlatformAvailable === null) {
    return (
      <div className={`flex items-center justify-center py-4 ${className}`}>
        <Loader className="w-4 h-4 animate-spin text-gray-400" />
        <span className="ml-2 text-sm text-gray-500">Checking for passkeys...</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>
      
      <button
        onClick={handlePasskeyLogin}
        disabled={isAuthenticating}
        className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
      >
        {isAuthenticating ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Authenticating...
          </>
        ) : (
          <>
            <Fingerprint className="w-5 h-5" />
            Sign in with {userEmail ? 'Passkey' : 'Fingerprint'}
            <div className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs font-normal">
              Touch ID • Face ID • Windows Hello
            </div>
          </>
        )}
      </button>
      
      <p className="mt-2 text-xs text-center text-gray-500">
        Use your fingerprint, face, or device PIN to sign in securely
      </p>
    </div>
  );
}

// Separate component for showing passkey availability indicator
export function PasskeyAvailabilityIndicator({ userEmail }: { userEmail?: string }) {
  const [hasPasskeys, setHasPasskeys] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    async function checkAvailability() {
      const supported = isWebAuthnSupported();
      const platformAvailable = await isPlatformAuthenticatorAvailable();
      setIsSupported(supported && platformAvailable);
      
      if (userEmail) {
        setHasPasskeys(hasStoredPasskeys(userEmail));
      }
    }
    checkAvailability();
  }, [userEmail]);

  if (!isSupported || !hasPasskeys) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
      <Fingerprint className="w-4 h-4" />
      <span>Passkey available for quick sign-in</span>
    </div>
  );
}