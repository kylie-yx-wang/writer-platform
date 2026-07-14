'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
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
import { createClient } from '../utils/supabase/client';

// 1. Extensions safely isolated
const extensions = [
  StarterKit,
  Underline,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
];

// --- The Toolbar Component ---
const MenuBar = ({ editor }: { editor: any }) => {
  // 2. THE FIX: A manual trigger to force Next.js to re-render the buttons
  const [, setRenderTrigger] = useState(0);

  useEffect(() => {
    if (!editor) return;
    
    // Tiptap fires a 'transaction' event on every keystroke, click, or highlight.
    // We tell React to update the component whenever this happens!
    const handleUpdate = () => setRenderTrigger((val) => val + 1);
    
    editor.on('transaction', handleUpdate);
    
    return () => {
      editor.off('transaction', handleUpdate);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  // 3. Back to your custom Navy theme!
  const getButtonClass = (isActive: boolean) => {
    if (isActive) {
      return 'p-2 rounded-md transition-colors bg-writer-navy text-writer-white shadow-sm';
    }
    return 'p-2 rounded-md transition-colors text-writer-black/70 hover:bg-writer-beige hover:text-writer-navy';
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4 p-2 bg-writer-beige/30 border border-writer-beige rounded-xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={getButtonClass(editor.isActive('bold'))}
        title="Bold"
      >
        <Bold size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={getButtonClass(editor.isActive('italic'))}
        title="Italic"
      >
        <Italic size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={getButtonClass(editor.isActive('underline'))}
        title="Underline"
      >
        <UnderlineIcon size={18} />
      </button>

      <div className="w-px bg-writer-beige mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={getButtonClass(editor.isActive('heading', { level: 1 }))}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={getButtonClass(editor.isActive('heading', { level: 2 }))}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </button>

      <div className="w-px bg-writer-beige mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={getButtonClass(editor.isActive('bulletList'))}
        title="Bullet List"
      >
        <List size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={getButtonClass(editor.isActive('orderedList'))}
        title="Numbered List"
      >
        <ListOrdered size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={getButtonClass(editor.isActive('blockquote'))}
        title="Quote / Indent"
      >
        <Quote size={18} />
      </button>

      <div className="w-px bg-writer-beige mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={getButtonClass(editor.isActive({ textAlign: 'left' }))}
        title="Align Left"
      >
        <AlignLeft size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={getButtonClass(editor.isActive({ textAlign: 'center' }))}
        title="Align Center"
      >
        <AlignCenter size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={getButtonClass(editor.isActive({ textAlign: 'right' }))}
        title="Align Right"
      >
        <AlignRight size={18} />
      </button>
    </div>
  );
};

// 1. Add this interface so the Editor knows it expects a sceneId
interface EditorProps {
  sceneId: string;
}

// --- The Main Editor Component ---
export default function Editor({ sceneId }: EditorProps) {
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions,
    content: '<p>Start drafting your scene here...</p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'min-h-[500px] focus:outline-none text-writer-black leading-relaxed text-lg prose prose-stone max-w-none px-2 py-4',
      },
    },
  });

  // --- THE SAVE FUNCTION ---
const handleSave = async () => {
    if (!editor) return;
    
    setIsSaving(true);
    const htmlContent = editor.getHTML(); 

    // 3. Change .insert() to .update() and match the sceneId!
    const { error } = await supabase
      .from('scenes')
      .update({ 
        content: htmlContent, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', sceneId); // <-- This is crucial! It tells Supabase WHICH scene to update.

    if (error) {
      console.error('Error saving scene:', error);
      alert('Failed to save scene.');
    } else {
      console.log('Scene saved successfully!');
    }
    
    setIsSaving(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Save Button Header */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-writer-navy text-writer-white px-4 py-2 rounded-md hover:bg-writer-navy/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Scene'}
        </button>
      </div>

      <div className="bg-writer-white border border-writer-beige rounded-xl p-6 shadow-sm">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}