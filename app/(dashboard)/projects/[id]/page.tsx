'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import SceneGrid, { Scene } from '@/components/SceneGrid';

export default function ProjectOverview() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const supabase = createClient();
  
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchScenes = async () => {
      const { data } = await supabase
        .from('scenes')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (data) setScenes(data);
      setIsLoading(false);
    };

    fetchScenes();
  }, [projectId, supabase]);

  const handleCreateScene = async () => {
    setIsCreating(true);
    const { data, error } = await supabase
      .from('scenes')
      .insert([{ project_id: projectId, title: 'Untitled Scene', content: '' }])
      .select().single();

    if (data) router.push(`/editor/${data.id}`);
    if (error) setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-writer-white p-8">
      <div className="max-w-5xl mx-auto">
        <Link 
          href="/projects"
          className="text-writer-navy mb-6 inline-block hover:underline"
        >
          &larr; Back to Projects
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-writer-navy">Project Outline</h1>
          <button
            onClick={handleCreateScene}
            disabled={isCreating}
            className="bg-writer-navy text-writer-white px-6 py-3 rounded-lg hover:bg-writer-navy/90 transition-colors disabled:opacity-50"
          >
            {isCreating ? 'Setting up editor...' : '+ New Scene'}
          </button>
        </div>

        {isLoading ? (
          <p className="text-writer-navy/60">Loading scenes...</p>
        ) : (
          <SceneGrid scenes={scenes} />
        )}
      </div>
    </div>
  );
}