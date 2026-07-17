'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import Editor from '@/components/Editor';
import Planel from '@/components/Planel';

export default function EditorWorkspace() {
  const params = useParams();
  const sceneId = params.scene_id as string;
  const supabase = createClient();
  
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isPlanelOpen, setIsPlanelOpen] = useState(true);

  useEffect(() => {
    const fetchProjectContext = async () => {
      const { data } = await supabase.from('scenes').select('project_id').eq('id', sceneId).single();
      if (data) setProjectId(data.project_id);
    };
    if (sceneId) fetchProjectContext();
  }, [sceneId, supabase]);

  return (
    <div className="min-h-screen bg-writer-white flex flex-col">
      {/* Top Navigation Bar */}
      <div className="h-16 px-4 md:px-8 border-b border-writer-beige flex items-center shrink-0">
        {projectId ? (
          <Link href={`/projects/${projectId}`} className="text-sm font-semibold text-writer-navy hover:text-writer-navy/70 transition-colors">
            &larr; Back to Project
          </Link>
        ) : (
          <div className="h-5" /> 
        )}
      </div>
      
      {/* Workspace Area: Planel + Editor */}
      <div className="flex flex-1 overflow-hidden relative">
        <Planel 
          sceneId={sceneId} 
          isOpen={isPlanelOpen} 
          onToggle={() => setIsPlanelOpen(!isPlanelOpen)} 
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-3xl mx-auto">
            <Editor sceneId={sceneId} />
          </div>
        </div>
      </div>
    </div>
  );
}