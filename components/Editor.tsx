'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { createClient } from '@/utils/supabase/client';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { 
    Bold, 
    Italic, 
    Underline as UnderlineIcon, 
    List, 
    ListOrdered, 
    Quote,     
    AlignLeft, 
    AlignCenter, 
    AlignRight, 
    Heading1, 
    Heading2 
  } from 'lucide-react';

const extensions = [
  StarterKit,
  Underline,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
];

// --- The Toolbar Component ---
const MenuBar = ({ editor }: { editor: any }) => {
  const [, setRenderTrigger] = useState(0);

  useEffect(() => {
    if (!editor) return;
    
    const handleUpdate = () => setRenderTrigger((val) => val + 1);
    editor.on('transaction', handleUpdate);
    
    return () => {
      editor.off('transaction', handleUpdate);
    };
  }, [editor]);

  if (!editor) return null;

  const getButtonClass = (isActive: boolean) => {
    if (isActive) {
      return 'p-2 rounded-md transition-colors bg-writer-navy text-writer-white shadow-sm';
    }
    return 'p-2 rounded-md transition-colors text-writer-black/70 hover:bg-writer-beige hover:text-writer-navy';
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6 p-2 bg-writer-beige/30 border border-writer-beige rounded-xl">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={getButtonClass(editor.isActive('bold'))} title="Bold"><Bold size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={getButtonClass(editor.isActive('italic'))} title="Italic"><Italic size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={getButtonClass(editor.isActive('underline'))} title="Underline"><UnderlineIcon size={18} /></button>
      <div className="w-px bg-writer-beige mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={getButtonClass(editor.isActive('heading', { level: 1 }))} title="Heading 1"><Heading1 size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={getButtonClass(editor.isActive('heading', { level: 2 }))} title="Heading 2"><Heading2 size={18} /></button>
      <div className="w-px bg-writer-beige mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={getButtonClass(editor.isActive('bulletList'))} title="Bullet List"><List size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={getButtonClass(editor.isActive('orderedList'))} title="Numbered List"><ListOrdered size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={getButtonClass(editor.isActive('blockquote'))} title="Quote / Indent"><Quote size={18} /></button>
      <div className="w-px bg-writer-beige mx-1" />
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={getButtonClass(editor.isActive({ textAlign: 'left' }))} title="Align Left"><AlignLeft size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={getButtonClass(editor.isActive({ textAlign: 'center' }))} title="Align Center"><AlignCenter size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={getButtonClass(editor.isActive({ textAlign: 'right' }))} title="Align Right"><AlignRight size={18} /></button>
    </div>
  );
};

interface EditorProps {
  sceneId: string;
}

type SaveStatus = 'Saved' | 'Unsaved changes' | 'Saving...' | 'Error saving';

// --- The Main Editor Component ---
export default function Editor({ sceneId }: EditorProps) {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('Saved');
  
  // New state and ref for the Title
  const [title, setTitle] = useState('');
  const titleRef = useRef(''); // We use a ref so the setTimeout always has the freshest title
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: extensions, 
    content: '', 
    editorProps: {
      attributes: {
        class: 'prose prose-lg focus:outline-none max-w-none min-h-[500px]',
      },
    },
  });

  // 1. Fetch both Title and Content on load
  useEffect(() => {
    const fetchScene = async () => {
      const { data, error } = await supabase
        .from('scenes')
        // We need both title and content now
        .select('title, content') 
        .eq('id', sceneId)
        .single();

      if (error) {
        console.error('Error fetching scene:', error);
      } else if (data) {
        setTitle(data.title || 'Untitled Scene');
        titleRef.current = data.title || 'Untitled Scene';
        
        if (editor && !editor.isDestroyed) {
          editor.commands.setContent(data.content || '');
        }
      }
      
      setIsLoading(false);
    };

    if (editor) {
      fetchScene();
    }
  }, [editor, sceneId, supabase]);

  // 2. Shared Unified Auto-Save Function
  const triggerAutoSave = useCallback(() => {
    setSaveStatus('Unsaved changes');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      setSaveStatus('Saving...');
      const htmlContent = editor?.getHTML() || '';
      const currentTitle = titleRef.current; // Grab the latest title from the ref

      const { error } = await supabase
        .from('scenes')
        .update({ 
          title: currentTitle,
          content: htmlContent, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', sceneId);

      if (error) {
        console.error('Auto-save error:', error);
        setSaveStatus('Error saving');
      } else {
        setSaveStatus('Saved');
      }
    }, 2000);
  }, [editor, sceneId, supabase]);

  // 3. Listen to Tiptap updates
  useEffect(() => {
    if (!editor || isLoading) return;

    editor.on('update', triggerAutoSave);
    return () => {
      editor.off('update', triggerAutoSave);
    };
  }, [editor, isLoading, triggerAutoSave]);

  // 4. Handle Title input changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    titleRef.current = newTitle; // Keep the ref synced
    triggerAutoSave(); // Trigger the exact same debounce logic
  };

  const getStatusColor = () => {
    switch (saveStatus) {
      case 'Saving...': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Unsaved changes': return 'text-gray-500 bg-gray-50 border-gray-200';
      case 'Error saving': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-end mb-4 h-10 items-center">
        {!isLoading && (
          <span className={`text-sm font-medium px-3 py-1 rounded-full border transition-colors ${getStatusColor()}`}>
            {saveStatus}
          </span>
        )}
      </div>

      <div className="bg-writer-white border border-writer-beige rounded-xl p-8 shadow-sm">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-writer-beige/30 rounded w-1/3 mb-8"></div>
            <div className="h-12 bg-writer-beige/30 rounded w-full mb-6"></div>
            <div className="h-4 bg-writer-beige/30 rounded w-full"></div>
            <div className="h-4 bg-writer-beige/30 rounded w-5/6"></div>
            <div className="h-4 bg-writer-beige/30 rounded w-4/6"></div>
          </div>
        ) : (
          <>
            {/* The seamlessly integrated Title Input */}
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Scene Title"
              className="w-full text-4xl font-bold text-writer-navy bg-transparent border-none outline-none placeholder:text-writer-navy/20 mb-6 focus:ring-0"
            />
            
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
          </>
        )}
      </div>
    </div>
  );
}