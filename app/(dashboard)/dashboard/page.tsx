export default function DashboardPage() {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-4">Writer's Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back! Here is your progress.</p>
        
        {/* Placeholder for Portals */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 border rounded-lg bg-gray-50">Drills Portal</div>
          <div className="p-6 border rounded-lg bg-gray-50">Projects Portal</div>
          <div className="p-6 border rounded-lg bg-gray-50">Courses Portal</div>
          <div className="p-6 border rounded-lg bg-gray-50">Community Portal</div>
        </div>
      </main>
    );
  }