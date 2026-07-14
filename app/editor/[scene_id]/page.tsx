'use client';

import { useParams } from 'next/navigation';
import Editor from '@/components/Editor';

export default function EditorWorkspace() {
  const params = useParams();
  const sceneId = params.scene_id as string; // Grabs the ID straight from your URL

  return (
    <div className="min-h-screen bg-writer-beige/10 py-12">
      {/* Pass the ID into your component! */}
      <Editor sceneId={sceneId} />
    </div>
  );
}