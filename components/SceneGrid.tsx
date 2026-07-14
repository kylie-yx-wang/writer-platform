import Link from 'next/link';

export interface Scene {
  id: string;
  title: string;
  created_at: string;
}

interface SceneGridProps {
  scenes: Scene[];
}

export default function SceneGrid({ scenes }: SceneGridProps) {
  if (scenes.length === 0) {
    return <p className="text-writer-navy/60">No scenes yet. Time to start writing!</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {scenes.map((scene, index) => (
        <Link 
          key={scene.id} 
          href={`/editor/${scene.id}`}
          className="group block p-5 bg-writer-beige/20 border border-writer-beige rounded-lg hover:bg-writer-beige/40 hover:border-writer-navy transition-all"
        >
          <div className="text-sm font-bold text-writer-brown mb-1 uppercase tracking-wider">
            Scene {index + 1}
          </div>
          <h2 className="text-lg font-medium text-writer-navy truncate">
            {scene.title || 'Untitled Scene'}
          </h2>
        </Link>
      ))}
    </div>
  );
}