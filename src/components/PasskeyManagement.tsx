import React, { useState, useEffect } from 'react';
import { Fingerprint, Trash2, Plus, Shield, Smartphone, Monitor, AlertCircle } from 'lucide-react';
import {
  getStoredPasskeys,
  removePasskey,
  isWebAuthnSupported,
  isPlatformAuthenticatorAvailable,
} from '../utils/webauthn';
import PasskeySetup from './PasskeySetup';

interface PasskeyManagementProps {
  userEmail: string;
  userDisplayName: string;
}

interface StoredPasskey {
  credentialId: string;
  publicKey: string;
  createdAt?: string;
  deviceName?: string;
}

export default function PasskeyManagement({ userEmail, userDisplayName }: PasskeyManagementProps) {
  const [passkeys, setPasskeys] = useState<StoredPasskey[]>([]);
  const [showSetup, setShowSetup] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isPlatformAvailable, setIsPlatformAvailable] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function checkSupport() {
      setIsSupported(isWebAuthnSupported());
      setIsPlatformAvailable(await isPlatformAuthenticatorAvailable());
    }
    checkSupport();
    loadPasskeys();
  }, [userEmail]);

  const loadPasskeys = () => {
    const stored = getStoredPasskeys(userEmail);
    // Add some metadata for display purposes
    const withMetadata = stored.map(p => ({
      ...p,
      createdAt: new Date().toLocaleDateString(), // In a real app, this would come from server
      deviceName: getDeviceName(), // In a real app, this would be stored when creating
    }));
    setPasskeys(withMetadata);
  };

  const getDeviceName = (): string => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      return 'iPhone/iPad';
    } else if (userAgent.includes('Android')) {
      return 'Android Device';
    } else if (userAgent.includes('Mac')) {
      return 'Mac';
    } else if (userAgent.includes('Windows')) {
      return 'Windows PC';
    } else {
      return 'Unknown Device';
    }
  };

  const getDeviceIcon = (deviceName: string) => {
    if (deviceName.includes('iPhone') || deviceName.includes('iPad') || deviceName.includes('Android')) {
      return Smartphone;
    }
    return Monitor;
  };

  const handleDeletePasskey = async (credentialId: string) => {
    setDeletingId(credentialId);
    
    // In a real app, you would also delete from your server
    try {
      removePasskey(userEmail, credentialId);
      loadPasskeys();
    } catch (error) {
      console.error('Failed to delete passkey:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetupSuccess = () => {
    setShowSetup(false);
    loadPasskeys();
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Passkeys Not Supported</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Your browser or device doesn't support passkeys. You can continue using your password to sign in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Passkeys</h3>
            <p className="text-sm text-gray-600 mt-1">
              Sign in with your fingerprint, face, or device PIN
            </p>
          </div>
          {isPlatformAvailable && (
            <button
              onClick={() => setShowSetup(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Passkey
            </button>
          )}
        </div>

        {/* Platform Availability Warning */}
        {!isPlatformAvailable && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-orange-800">Platform Authenticator Required</h4>
                <p className="text-sm text-orange-700 mt-1">
                  To use passkeys, you need a device with Touch ID, Face ID, Windows Hello, or similar biometric authentication.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Passkeys List */}
        {passkeys.length > 0 ? (
          <div className="space-y-3">
            {passkeys.map((passkey) => {
              const DeviceIcon = getDeviceIcon(passkey.deviceName || '');
              
              return (
                <div
                  key={passkey.credentialId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <DeviceIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {passkey.deviceName || 'Unknown Device'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Added {passkey.createdAt}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeletePasskey(passkey.credentialId)}
                    disabled={deletingId === passkey.credentialId}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Remove passkey"
                  >
                    {deletingId === passkey.credentialId ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Fingerprint className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Passkeys Set Up</h4>
            <p className="text-gray-600 mb-4">
              Add a passkey to sign in quickly and securely with your fingerprint or face.
            </p>
            {isPlatformAvailable && (
              <button
                onClick={() => setShowSetup(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Set Up Your First Passkey
              </button>
            )}
          </div>
        )}

        {/* Security Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">How Passkeys Work</h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Your biometric data never leaves your device</li>
                <li>• Passkeys sync securely across your devices</li>
                <li>• More secure than passwords - no risk of phishing</li>
                <li>• Works with Touch ID, Face ID, Windows Hello, and more</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Setup Modal */}
      {showSetup && (
        <PasskeySetup
          userEmail={userEmail}
          userDisplayName={userDisplayName}
          onClose={() => setShowSetup(false)}
          onSuccess={handleSetupSuccess}
        />
      )}
    </>
  );
}