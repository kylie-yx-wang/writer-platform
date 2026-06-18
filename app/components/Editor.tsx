'use client';

// 1. We import EditorProvider and useCurrentEditor instead of useEditor
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
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

// --- The Toolbar Component ---
const MenuBar = () => {
  // 2. We pull the editor directly from the Provider context
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  // Back to your custom palette!
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

// --- The Main Editor Component ---
export default function Editor() {
  // 3. Define extensions outside of the component
  const extensions = [
    StarterKit,
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-writer-white border border-writer-beige rounded-xl p-6 shadow-sm">
        
        {/* 4. Use EditorProvider. It automatically connects the MenuBar and handles the text area! */}
        <EditorProvider 
          slotBefore={<MenuBar />} 
          extensions={extensions} 
          content="<p>Start drafting your scene here...</p>"
          editorProps={{
            attributes: {
              class: 'min-h-[500px] focus:outline-none text-writer-black leading-relaxed text-lg prose prose-stone max-w-none px-2 py-4',
            },
          }}
        >
          {/* Tiptap magically renders the editable text area right here */}
        </EditorProvider>

      </div>
    </div>
  );
}