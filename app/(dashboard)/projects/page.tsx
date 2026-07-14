'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function ProjectsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProject = async () => {
    setIsCreating(true);
    
    // 1. Get the currently logged-in user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("You must be logged in!");
      setIsCreating(false);
      return;
    }

    // 2. Create the project in the database
    const { data, error } = await supabase
      .from('projects')
      .insert([
        { 
          user_id: user.id, 
          title: 'Untitled Project' 
        }
      ])
      .select() // <-- CRITICAL: This tells Supabase to return the new data back to us
      .single(); // <-- Tells Supabase we only expect one row back

    if (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project.');
      setIsCreating(false);
    } else if (data) {
      // 3. Send the user to their shiny new project page!
      router.push(`/projects/${data.id}`);
    }
  };
  return (
    <main className="p-8 md:p-12 max-w-5xl">
      <div className="border-b border-writer-beige pb-6 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-writer-navy tracking-tight mb-2">Your Projects</h1>
          <p className="text-writer-brown text-lg">Manage your novels, scenes, and planning notes.</p>
        </div>
        <button
          onClick={handleCreateProject}
          disabled={isCreating}
          className="bg-writer-navy text-writer-white px-6 py-3 rounded-lg hover:bg-writer-navy/90 transition-colors disabled:opacity-50"
        >
          {isCreating ? 'Creating...' : '+ New Project'}
        </button>

      </div>
      {/* <div className="mt-8">
        <Editor />
      </div> */}
    </main>
  );
}