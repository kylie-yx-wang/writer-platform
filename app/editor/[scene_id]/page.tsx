'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import Editor from '@/components/Editor';

export default function EditorWorkspace() {
  const params = useParams();
  const sceneId = params.scene_id as string;
  const supabase = createClient();
  
  // State to hold the parent project's ID once we fetch it
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectContext = async () => {
      // We only need to fetch the project_id column for this routing link
      const { data, error } = await supabase
        .from('scenes')
        .select('project_id')
        .eq('id', sceneId)
        .single();
        
      if (data) {
        setProjectId(data.project_id);
      }
    };

    if (sceneId) {
      fetchProjectContext();
    }
  }, [sceneId, supabase]);

  return (
    <div className="min-h-screen bg-writer-white py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto mb-6">
        {/* Only render the link once we successfully pull the project ID */}
        {projectId ? (
          <Link 
            href={`/projects/${projectId}`}
            className="inline-flex items-center text-sm font-semibold text-writer-navy hover:text-writer-navy/70 transition-colors bg-writer-beige/30 px-4 py-2 rounded-lg"
          >
            &larr; Back to Project
          </Link>
        ) : (
          /* An invisible placeholder so the layout doesn't jump when the ID loads */
          <div className="h-9" /> 
        )}
      </div>
      
      {/* Your powerful, self-contained auto-saving editor */}
      <Editor sceneId={sceneId} />
    </div>
  );
}