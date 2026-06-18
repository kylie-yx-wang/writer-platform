import Editor from '@/app/components/Editor';

export default function ProjectsPage() {
  return (
    <main className="p-8 md:p-12 max-w-5xl">
      <div className="border-b border-writer-beige pb-6 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-writer-navy tracking-tight mb-2">Your Projects</h1>
          <p className="text-writer-brown text-lg">Manage your novels, scenes, and planning notes.</p>
        </div>
        <button className="bg-writer-navy text-writer-white px-6 py-3 rounded-lg font-medium hover:bg-writer-navy/90 transition-colors">
          + New Project
        </button>

      </div>
      <div className="mt-8">
        <Editor />
      </div>
    </main>
  );
}