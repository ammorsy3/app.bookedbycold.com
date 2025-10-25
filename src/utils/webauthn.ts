/**
 * WebAuthn Utilities for Passkey Authentication
 * Provides functions for creating and authenticating with passkeys
 */

// Type definitions for WebAuthn
interface PublicKeyCredentialCreationOptionsExtended extends PublicKeyCredentialCreationOptions {
  challenge: BufferSource;
  rp: {
    name: string;
    id: string;
  };
  user: {
    id: BufferSource;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: PublicKeyCredentialParameters[];
  authenticatorSelection?: AuthenticatorSelectionCriteria;
  timeout?: number;
  excludeCredentials?: PublicKeyCredentialDescriptor[];
}

interface PublicKeyCredentialRequestOptionsExtended extends PublicKeyCredentialRequestOptions {
  challenge: BufferSource;
  timeout?: number;
  rpId?: string;
  allowCredentials?: PublicKeyCredentialDescriptor[];
  userVerification?: UserVerificationRequirement;
}

// Utility functions for encoding/decoding
export const utils = {
  /**
   * Convert ArrayBuffer to base64url string
   */
  arrayBufferToBase64url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  },

  /**
   * Convert base64url string to ArrayBuffer
   */
  base64urlToArrayBuffer(base64url: string): ArrayBuffer {
    // Add padding if needed
    const padding = '='.repeat((4 - (base64url.length % 4)) % 4);
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/') + padding;
    
    const binary = atob(base64);
    const buffer = new ArrayBuffer(binary.length);
    const bytes = new Uint8Array(buffer);
    
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    return buffer;
  },

  /**
   * Generate a random challenge
   */
  generateChallenge(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(32));
  },

  /**
   * Generate a random user ID
   */
  generateUserId(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(16));
  }
};

/**
 * Check if WebAuthn is supported in the current browser
 */
export function isWebAuthnSupported(): boolean {
  return !!(navigator.credentials && navigator.credentials.create && navigator.credentials.get && window.PublicKeyCredential);
}

/**
 * Check if platform authenticator (like Touch ID, Face ID, Windows Hello) is available
 */
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isWebAuthnSupported()) return false;
  
  try {
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch (error) {
    console.warn('Could not check platform authenticator availability:', error);
    return false;
  }
}

/**
 * Create a new passkey for the user
 */
export async function createPasskey(userEmail: string, userDisplayName: string): Promise<{
  credentialId: string;
  publicKey: string;
  userHandle: string;
}> {
  if (!isWebAuthnSupported()) {
    throw new Error('WebAuthn is not supported in this browser');
  }

  const challenge = utils.generateChallenge();
  const userId = utils.generateUserId();

  const createCredentialOptions: PublicKeyCredentialCreationOptionsExtended = {
    challenge,
    rp: {
      name: 'BookedByCold',
      id: window.location.hostname, // Will work for both localhost and production
    },
    user: {
      id: userId,
      name: userEmail,
      displayName: userDisplayName,
    },
    pubKeyCredParams: [
      { alg: -7, type: 'public-key' }, // ES256
      { alg: -257, type: 'public-key' }, // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: 'platform', // Prefer platform authenticators
      userVerification: 'required',
      residentKey: 'required'
    },
    timeout: 60000,
  };

  try {
    const credential = await navigator.credentials.create({
      publicKey: createCredentialOptions,
    }) as PublicKeyCredential;

    if (!credential || !credential.response) {
      throw new Error('Failed to create credential');
    }

    const response = credential.response as AuthenticatorAttestationResponse;
    
    return {
      credentialId: utils.arrayBufferToBase64url(credential.rawId),
      publicKey: utils.arrayBufferToBase64url(response.getPublicKey() || new ArrayBuffer(0)),
      userHandle: utils.arrayBufferToBase64url(userId),
    };
  } catch (error) {
    console.error('Error creating passkey:', error);
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        throw new Error('Passkey creation was cancelled or not allowed');
      } else if (error.name === 'InvalidStateError') {
        throw new Error('A passkey already exists for this account');
      } else if (error.name === 'NotSupportedError') {
        throw new Error('Passkeys are not supported on this device');
      }
    }
    throw new Error('Failed to create passkey. Please try again.');
  }
}

/**
 * Authenticate using an existing passkey
 */
export async function authenticateWithPasskey(allowedCredentials?: { credentialId: string }[]): Promise<{
  credentialId: string;
  signature: string;
  userHandle: string;
  clientDataJSON: string;
  authenticatorData: string;
}> {
  if (!isWebAuthnSupported()) {
    throw new Error('WebAuthn is not supported in this browser');
  }

  const challenge = utils.generateChallenge();

  const getCredentialOptions: PublicKeyCredentialRequestOptionsExtended = {
    challenge,
    timeout: 60000,
    rpId: window.location.hostname,
    userVerification: 'required',
  };

  // If specific credentials are allowed, include them
  if (allowedCredentials && allowedCredentials.length > 0) {
    getCredentialOptions.allowCredentials = allowedCredentials.map(cred => ({
      type: 'public-key',
      id: utils.base64urlToArrayBuffer(cred.credentialId),
    }));
  }

  try {
    const credential = await navigator.credentials.get({
      publicKey: getCredentialOptions,
    }) as PublicKeyCredential;

    if (!credential || !credential.response) {
      throw new Error('Failed to get credential');
    }

    const response = credential.response as AuthenticatorAssertionResponse;
    
    return {
      credentialId: utils.arrayBufferToBase64url(credential.rawId),
      signature: utils.arrayBufferToBase64url(response.signature),
      userHandle: utils.arrayBufferToBase64url(response.userHandle || new ArrayBuffer(0)),
      clientDataJSON: utils.arrayBufferToBase64url(response.clientDataJSON),
      authenticatorData: utils.arrayBufferToBase64url(response.authenticatorData),
    };
  } catch (error) {
    console.error('Error authenticating with passkey:', error);
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        throw new Error('Authentication was cancelled or not allowed');
      } else if (error.name === 'InvalidStateError') {
        throw new Error('No passkeys found for this account');
      }
    }
    throw new Error('Failed to authenticate with passkey. Please try again.');
  }
}

/**
 * Get stored passkeys for a user from localStorage
 * In a real app, this would be stored on the server
 */
export function getStoredPasskeys(userEmail: string): { credentialId: string; publicKey: string }[] {
  const storageKey = `passkeys_${userEmail}`;
  const stored = localStorage.getItem(storageKey);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Store a passkey for a user in localStorage
 * In a real app, this would be stored on the server
 */
export function storePasskey(userEmail: string, credentialId: string, publicKey: string): void {
  const storageKey = `passkeys_${userEmail}`;
  const existing = getStoredPasskeys(userEmail);
  
  // Check if this credential already exists
  const exists = existing.find(p => p.credentialId === credentialId);
  if (!exists) {
    existing.push({ credentialId, publicKey });
    localStorage.setItem(storageKey, JSON.stringify(existing));
  }
}

/**
 * Remove a passkey for a user from localStorage
 */
export function removePasskey(userEmail: string, credentialId: string): void {
  const storageKey = `passkeys_${userEmail}`;
  const existing = getStoredPasskeys(userEmail);
  const filtered = existing.filter(p => p.credentialId !== credentialId);
  localStorage.setItem(storageKey, JSON.stringify(filtered));
}

/**
 * Check if user has any passkeys stored
 */
export function hasStoredPasskeys(userEmail: string): boolean {
  return getStoredPasskeys(userEmail).length > 0;
}