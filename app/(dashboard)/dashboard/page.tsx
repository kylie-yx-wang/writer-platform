import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="p-8 md:p-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-writer-navy tracking-tight mb-2">Writer's Dashboard</h1>
        <p className="text-writer-brown text-lg">Welcome back! Here is your progress.</p>
      </header>
      
      {/* Portals*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <Link href="/drills" className="p-8 border border-writer-beige rounded-xl bg-writer-beige/40 hover:bg-writer-beige hover:shadow-md transition-all duration-200 block">
          <h2 className="text-2xl font-semibold text-writer-navy mb-2">Drills Portal</h2>
          <p className="text-writer-black/80">Warm up your skills with daily exercises.</p>
        </Link>

        <Link href="/projects" className="p-8 border border-writer-beige rounded-xl bg-writer-beige/40 hover:bg-writer-beige hover:shadow-md transition-all duration-200 block">
          <h2 className="text-2xl font-semibold text-writer-navy mb-2">Projects Portal</h2>
          <p className="text-writer-black/80">Continue drafting your latest novel.</p>
        </Link>

        <Link href="/courses" className="p-8 border border-writer-beige rounded-xl bg-writer-beige/40 hover:bg-writer-beige hover:shadow-md transition-all duration-200 block">
          <h2 className="text-2xl font-semibold text-writer-navy mb-2">Courses Portal</h2>
          <p className="text-writer-black/80">Expand your craft with guided lessons.</p>
        </Link>

        <Link href="/community" className="p-8 border border-writer-beige rounded-xl bg-writer-beige/40 hover:bg-writer-beige hover:shadow-md transition-all duration-200 block">
          <h2 className="text-2xl font-semibold text-writer-navy mb-2">Community Portal</h2>
          <p className="text-writer-black/80">Check in with your writing party.</p>
        </Link>

      </div>
    </main>
  );
}