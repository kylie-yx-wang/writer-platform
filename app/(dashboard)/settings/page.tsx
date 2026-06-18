export default function SettingsPage() {
  return (
    <main className="p-8 md:p-12 max-w-3xl">
      <div className="border-b border-writer-beige pb-6 mb-8">
        <h1 className="text-3xl font-bold text-writer-navy tracking-tight mb-2">Profile Settings</h1>
        <p className="text-writer-brown">Customize your public display profile and account preferences.</p>
      </div>
      
      <div className="bg-writer-beige/20 border border-writer-beige rounded-xl p-8">
        <h2 className="text-xl font-semibold text-writer-navy mb-4">Display Options</h2>
        {/* Settings form will go here */}
      </div>
    </main>
  );
}