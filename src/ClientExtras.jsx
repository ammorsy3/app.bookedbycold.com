// ClientExtras.jsx
import React from 'react';
import { User, Settings, Shield } from 'lucide-react';
import PasskeyManagement from './components/PasskeyManagement';

// Client credentials mapping for account settings
const clientCredentials = {
  'tlnconsultinggroup': {
    email: 'travis.lairson@tlnconsultinggroup.com',
    displayName: 'Travis Lairson'
  },
  'testclient': {
    email: 'ahmorsy07@gmail.com',
    displayName: 'Ahmed Morsy'
  }
};

// Helper function to get current user from URL
function getCurrentUser() {
  const path = window.location.pathname;
  const clientKey = path.split('/')[1]; // Extract client key from URL
  return clientCredentials[clientKey] || { email: 'user@example.com', displayName: 'User' };
}

export function AccountSettings() {
  const currentUser = getCurrentUser();

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-gray-600">Manage your account preferences and security settings</p>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              <p className="text-sm text-gray-600">Your account details</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {currentUser.email}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {currentUser.displayName}
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
              <p className="text-sm text-gray-600">Manage your authentication methods</p>
            </div>
          </div>
          
          <PasskeyManagement 
            userEmail={currentUser.email}
            userDisplayName={currentUser.displayName}
          />
        </div>

        {/* Additional Settings Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>
              <p className="text-sm text-gray-600">Customize your dashboard experience</p>
            </div>
          </div>
          
          <div className="text-gray-600">
            <p>Additional preference settings will be added here in the future.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export function Support() {
  return (
    <main className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-4">Support</h1>
      <p className="text-gray-700 mb-6">
        Need help? Email <span className="font-medium">support@bookedbycold.com</span>{' '}
        or book a call below.
      </p>
      <a
        href="https://calendly.com/ahmorsy07/ai-booking-demo"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Book a call ↗
      </a>
    </main>
  );
}