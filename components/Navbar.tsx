import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-writer-beige/50 border-b border-writer-beige px-8 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo / Brand */}
        <Link href="/dashboard" className="text-2xl font-bold text-writer-navy tracking-tight">
          WriterCraft
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6 text-writer-black/80 font-medium">
          <Link href="/dashboard" className="hover:text-writer-navy transition-colors">Dashboard</Link>
          <Link href="/drills" className="hover:text-writer-navy transition-colors">Drills</Link>
          <Link href="/projects" className="hover:text-writer-navy transition-colors">Projects</Link>
          <Link href="/courses" className="hover:text-writer-navy transition-colors">Courses</Link>
          <Link href="/community" className="hover:text-writer-navy transition-colors">Community</Link>
          <Link href="/settings" className="hover:text-writer-navy transition-colors">Settings</Link>
        </div>
      </div>
    </nav>
  );
}