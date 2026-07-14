'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ProjectGrid, { Project } from '@/components/ProjectGrid';

export default function ProjectsDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setProjects(data);
      setIsLoading(false);
    };

    fetchProjects();
  }, [supabase]);

  const handleCreateProject = async () => {
    setIsCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('projects')
      .insert([{ user_id: user.id, title: 'Untitled Project' }])
      .select().single();

    if (data) router.push(`/projects/${data.id}`);
    if (error) setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-writer-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-writer-navy">My Projects</h1>
          <button
            onClick={handleCreateProject}
            disabled={isCreating}
            className="bg-writer-navy text-writer-white px-6 py-3 rounded-lg hover:bg-writer-navy/90 transition-colors disabled:opacity-50"
          >
            {isCreating ? 'Creating...' : '+ New Project'}
          </button>
        </div>

        {isLoading ? (
          <p className="text-writer-navy/60">Loading projects...</p>
        ) : (
          <ProjectGrid projects={projects} />
        )}
      </div>
    </div>
  );
}