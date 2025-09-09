// ClientExtras.jsx
export function AccountSettings() {
  return (
    <main className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      <p className="text-gray-700">
        Placeholder page — add real settings later.
      </p>
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
