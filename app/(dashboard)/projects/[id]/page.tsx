'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import SceneGrid, { Scene } from '@/components/SceneGrid';
import ProjectSettingsModal from '@/components/Modals/ProjectSettingsModal';

export default function ProjectOverview() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const supabase = createClient();
  
  // Data state
  const [projectTitle, setProjectTitle] = useState('');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: projectData } = await supabase
        .from('projects')
        .select('title')
        .eq('id', projectId)
        .single();

      if (projectData) {
        setProjectTitle(projectData.title || 'Untitled Project');
      }

      const { data: scenesData } = await supabase
        .from('scenes')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (scenesData) setScenes(scenesData);
      setIsLoading(false);
    };

    fetchData();
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

  // Passed to the modal to execute when the user hits "Save"
  const handleSaveSettings = async (newTitle: string) => {
    const { error } = await supabase
      .from('projects')
      .update({ title: newTitle })
      .eq('id', projectId);

    if (error) {
      console.error('Error saving project:', error);
      alert('Failed to update project settings.');
    } else {
      setProjectTitle(newTitle); 
      setIsModalOpen(false);         
    }
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

        {/* --- Header Area --- */}
        <div className="flex justify-between items-start mb-12 gap-4 border-b border-writer-beige pb-6">
          <div className="flex-1">
            {isLoading ? (
              <div className="h-10 bg-writer-beige/30 rounded w-1/3 animate-pulse"></div>
            ) : (
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold text-writer-navy">
                  {projectTitle}
                </h1>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-sm font-medium text-writer-navy/60 hover:text-writer-navy bg-writer-beige/20 hover:bg-writer-beige/50 px-3 py-1.5 rounded-md transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleCreateScene}
            disabled={isCreating}
            className="bg-writer-navy text-writer-white px-6 py-3 rounded-lg hover:bg-writer-navy/90 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {isCreating ? 'Setting up editor...' : '+ New Scene'}
          </button>
        </div>

        {/* --- Scenes Grid --- */}
        {isLoading ? (
          <p className="text-writer-navy/60">Loading scenes...</p>
        ) : (
          <SceneGrid scenes={scenes} />
        )}
      </div>

      {/* --- Settings Modal --- */}
      <ProjectSettingsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTitle={projectTitle}
        onSave={handleSaveSettings}
      />
    </div>
  );
}