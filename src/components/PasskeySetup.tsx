import React, { useState, useEffect } from 'react';
import { Fingerprint, Shield, CheckCircle, AlertCircle, X } from 'lucide-react';
import {
  isWebAuthnSupported,
  isPlatformAuthenticatorAvailable,
  createPasskey,
  storePasskey,
  hasStoredPasskeys,
} from '../utils/webauthn';

interface PasskeySetupProps {
  userEmail: string;
  userDisplayName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PasskeySetup({ userEmail, userDisplayName, onClose, onSuccess }: PasskeySetupProps) {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isPlatformAvailable, setIsPlatformAvailable] = useState<boolean | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasExistingPasskeys, setHasExistingPasskeys] = useState(false);

  useEffect(() => {
    async function checkSupport() {
      setIsSupported(isWebAuthnSupported());
      setIsPlatformAvailable(await isPlatformAuthenticatorAvailable());
      setHasExistingPasskeys(hasStoredPasskeys(userEmail));
    }
    checkSupport();
  }, [userEmail]);

  const handleCreatePasskey = async () => {
    if (!isSupported || !isPlatformAvailable) {
      setError('Passkeys are not supported on this device');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const credential = await createPasskey(userEmail, userDisplayName);
      
      // Store the passkey (in a real app, this would be sent to your server)
      storePasskey(userEmail, credential.credentialId, credential.publicKey);
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      console.error('Failed to create passkey:', err);
      setError(err instanceof Error ? err.message : 'Failed to create passkey');
    } finally {
      setIsCreating(false);
    }
  };

  if (isSupported === null || isPlatformAvailable === null) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="ml-2 text-gray-600">Checking device compatibility...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Fingerprint className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {hasExistingPasskeys ? 'Add Another Passkey' : 'Set Up Passkey'}
              </h2>
              <p className="text-sm text-gray-500">Secure fingerprint or face unlock</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {success && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Passkey Created!</h3>
            <p className="text-gray-600">You can now sign in with your fingerprint or face.</p>
          </div>
        )}

        {/* Setup Content */}
        {!success && (
          <>
            {/* Compatibility Check */}
            {!isSupported || !isPlatformAvailable ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Not Supported</h3>
                <p className="text-gray-600 mb-4">
                  Passkeys are not available on this device. You'll need to use your password to sign in.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* Benefits List */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">More Secure</p>
                      <p className="text-sm text-gray-600">Your biometric data never leaves your device</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Fingerprint className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Faster Sign-in</p>
                      <p className="text-sm text-gray-600">No more typing passwords</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Cross-Device Sync</p>
                      <p className="text-sm text-gray-600">Works across all your devices</p>
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    disabled={isCreating}
                  >
                    {hasExistingPasskeys ? 'Skip' : 'Maybe Later'}
                  </button>
                  <button
                    onClick={handleCreatePasskey}
                    disabled={isCreating}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="w-4 h-4" />
                        Create Passkey
                      </>
                    )}
                  </button>
                </div>

                {/* Help Text */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    You'll be prompted to use your fingerprint, face, or device PIN
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}