'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams(); // <-- This grabs the [id] from the URL
  const projectId = params.id as string;
  
  const supabase = createClient();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateScene = async () => {
    setIsCreating(true);

    const { data, error } = await supabase
      .from('scenes')
      .insert([
        { 
          project_id: projectId, // Tying it strictly to this project
          title: 'Untitled Scene',
          content: '' 
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating scene:', error);
      alert('Failed to create scene.');
      setIsCreating(false);
    } else if (data) {
      // Send the user to the editor page (we will set this route up next!)
      router.push(`/editor/${data.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-writer-white p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.push('/dashboard')}
          className="text-writer-navy mb-6 hover:underline"
        >
          &larr; Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-writer-navy mb-8">Project Overview</h1>
        
        <button
          onClick={handleCreateScene}
          disabled={isCreating}
          className="bg-writer-navy text-writer-white px-6 py-3 rounded-lg hover:bg-writer-navy/90 transition-colors disabled:opacity-50"
        >
          {isCreating ? 'Setting up editor...' : '+ New Scene'}
        </button>
      </div>
    </div>
  );
}