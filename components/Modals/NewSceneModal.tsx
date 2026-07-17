'use client';

import { useState, useEffect } from 'react';

interface NewSceneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (sceneData: any) => Promise<void>;
  nextSceneNumber: number;
}

export default function NewSceneModal({ isOpen, onClose, onContinue, nextSceneNumber }: NewSceneModalProps) {
  const [title, setTitle] = useState('');
  const [povCharacter, setPovCharacter] = useState('');
  const [characters, setCharacters] = useState('');
  const [setting, setSetting] = useState('');
  const [plotPoints, setPlotPoints] = useState('• ');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  
  const [displayTitle, setDisplayTitle] = useState('');
  const [isManuallyEdited, setIsManuallyEdited] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-generate the display title
  useEffect(() => {
    if (isManuallyEdited) return;

    const parts = [title, povCharacter, setting].filter(Boolean);
    const bracketContent = parts.length > 0 ? ` [${parts.join(' — ')}]` : '';
    setDisplayTitle(`Scene ${nextSceneNumber}${bracketContent}`);
  }, [title, povCharacter, setting, nextSceneNumber, isManuallyEdited]);

  if (!isOpen) return null;

  // Auto-bullet formatting for Plot Points
  const handlePlotPointsKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const val = target.value;
      const newVal = val.substring(0, start) + '\n• ' + val.substring(end);
      setPlotPoints(newVal);
      
      // Reset cursor position
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 3;
      }, 0);
    }
  };

  const handleContinue = async () => {
    setIsSaving(true);
    await onContinue({
      title,
      pov_character: povCharacter,
      characters,
      setting,
      display_title: displayTitle,
      plot_points: plotPoints,
      notes,
      tags
    });
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-writer-navy/20 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 border border-writer-beige my-8">
        <h2 className="text-2xl font-bold text-writer-navy mb-6">Plan New Scene</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-writer-navy mb-1">Scene Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-writer-beige rounded-lg px-4 py-2" placeholder="Meeting the Bees" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-writer-navy mb-1">POV Character</label>
            <input type="text" value={povCharacter} onChange={(e) => setPovCharacter(e.target.value)} className="w-full border border-writer-beige rounded-lg px-4 py-2" placeholder="Tom" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-writer-navy mb-1">Setting</label>
            <input type="text" value={setting} onChange={(e) => setSetting(e.target.value)} className="w-full border border-writer-beige rounded-lg px-4 py-2" placeholder="The Veldt Room" />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-writer-navy mb-1">Display Title (Auto-generated)</label>
            <input 
              type="text" 
              value={displayTitle} 
              onChange={(e) => { setDisplayTitle(e.target.value); setIsManuallyEdited(true); }}
              className="w-full border border-writer-beige rounded-lg px-4 py-2 bg-writer-beige/10 font-medium text-writer-navy" 
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-writer-navy mb-1">Characters (Comma separated)</label>
            <input type="text" value={characters} onChange={(e) => setCharacters(e.target.value)} className="w-full border border-writer-beige rounded-lg px-4 py-2" placeholder="Tom, Sarah, The Bees" />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-writer-navy mb-1">Plot Points</label>
            <textarea 
              value={plotPoints} 
              onChange={(e) => setPlotPoints(e.target.value)} 
              onKeyDown={handlePlotPointsKeyDown}
              className="w-full border border-writer-beige rounded-lg px-4 py-2 min-h-[100px]" 
              placeholder="• Enter plot points..." 
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-semibold text-writer-navy mb-1">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border border-writer-beige rounded-lg px-4 py-2 min-h-[80px]" />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-semibold text-writer-navy mb-1">Tags</label>
            <textarea value={tags} onChange={(e) => setTags(e.target.value)} className="w-full border border-writer-beige rounded-lg px-4 py-2 min-h-[80px]" placeholder="action, flashback, important" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-writer-beige">
          <button onClick={onClose} className="px-4 py-2 text-writer-navy hover:bg-writer-beige/30 rounded-lg">Cancel</button>
          <button 
            onClick={handleContinue} 
            disabled={isSaving}
            className="bg-writer-navy text-writer-white px-6 py-2 rounded-lg hover:bg-writer-navy/90 disabled:opacity-50"
          >
            {isSaving ? 'Creating...' : 'Continue to Editor'}
          </button>
        </div>
      </div>
    </div>
  );
}