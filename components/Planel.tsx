'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

interface PlanelProps {
  sceneId: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Planel({ sceneId, isOpen, onToggle }: PlanelProps) {
  const supabase = createClient();
  const [formData, setFormData] = useState({
    title: '', pov_character: '', characters: '', 
    setting: '', display_title: '', plot_points: '', 
    notes: '', tags: ''
  });
  
  const [saveStatus, setSaveStatus] = useState('Saved');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dataRef = useRef(formData);

  useEffect(() => {
    const fetchSceneData = async () => {
      const { data } = await supabase.from('scenes').select('*').eq('id', sceneId).single();
      if (data) {
        const loadedData = {
          title: data.title || '', pov_character: data.pov_character || '',
          characters: data.characters || '', setting: data.setting || '',
          display_title: data.display_title || '', plot_points: data.plot_points || '• ',
          notes: data.notes || '', tags: data.tags || ''
        };
        setFormData(loadedData);
        dataRef.current = loadedData;
      }
    };
    fetchSceneData();
  }, [sceneId, supabase]);

  const triggerAutoSave = useCallback(() => {
    setSaveStatus('Saving...');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      const { error } = await supabase.from('scenes').update(dataRef.current).eq('id', sceneId);
      if (error) setSaveStatus('Error');
      else setSaveStatus('Saved');
    }, 1500);
  }, [sceneId, supabase]);

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    dataRef.current = newData;
    triggerAutoSave();
  };

  const handlePlotPointsKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const val = target.value;
      const newVal = val.substring(0, start) + '\n• ' + val.substring(end);
      handleChange('plot_points', newVal);
      
      setTimeout(() => { target.selectionStart = target.selectionEnd = start + 3; }, 0);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={onToggle}
        className="fixed top-24 left-4 z-10 bg-writer-white border border-writer-beige shadow-sm p-2 rounded-r-lg hover:bg-writer-beige/20 text-writer-navy"
        title="Open Planel"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
      </button>
    );
  }

  return (
    <div className="w-80 h-[calc(100vh-80px)] sticky top-20 bg-writer-white border-r border-writer-beige shadow-sm flex flex-col transition-all duration-300">
      <div className="p-4 border-b border-writer-beige flex justify-between items-center bg-writer-beige/10">
        <button onClick={onToggle} className="text-writer-navy/50 hover:text-writer-navy">
          &times;
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="text-xs font-semibold text-writer-navy/70 uppercase">Display Title</label>
          <input type="text" value={formData.display_title} onChange={(e) => handleChange('display_title', e.target.value)} className="w-full text-sm border-b border-transparent hover:border-writer-beige focus:border-writer-navy outline-none py-1 font-medium text-writer-navy bg-transparent" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-semibold text-writer-navy/70 uppercase">POV</label>
            <input type="text" value={formData.pov_character} onChange={(e) => handleChange('pov_character', e.target.value)} className="w-full text-sm border-b border-transparent hover:border-writer-beige focus:border-writer-navy outline-none py-1 bg-transparent" />
          </div>
          <div>
            <label className="text-xs font-semibold text-writer-navy/70 uppercase">Setting</label>
            <input type="text" value={formData.setting} onChange={(e) => handleChange('setting', e.target.value)} className="w-full text-sm border-b border-transparent hover:border-writer-beige focus:border-writer-navy outline-none py-1 bg-transparent" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-writer-navy/70 uppercase">Characters</label>
          <input type="text" value={formData.characters} onChange={(e) => handleChange('characters', e.target.value)} className="w-full text-sm border-b border-transparent hover:border-writer-beige focus:border-writer-navy outline-none py-1 bg-transparent" />
        </div>

        <div>
          <label className="text-xs font-semibold text-writer-navy/70 uppercase mb-1 block">Plot Points</label>
          <textarea 
            value={formData.plot_points} 
            onChange={(e) => handleChange('plot_points', e.target.value)} 
            onKeyDown={handlePlotPointsKeyDown}
            className="w-full text-sm border border-writer-beige/50 rounded p-2 outline-none focus:border-writer-navy min-h-[200px] bg-transparent resize-y" 
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-writer-navy/70 uppercase mb-1 block">Notes</label>
          <textarea value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} className="w-full text-sm border border-writer-beige/50 rounded p-2 outline-none focus:border-writer-navy min-h-[140px] bg-transparent resize-y" />
        </div>
      </div>
    </div>
  );
}