'use client';

import { useState, useEffect } from 'react';

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTitle: string;
  onSave: (newTitle: string) => Promise<void>;
}

export default function ProjectSettingsModal({
  isOpen,
  onClose,
  initialTitle,
  onSave,
}: ProjectSettingsModalProps) {
  const [editingTitle, setEditingTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);

  // Reset the input field whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setEditingTitle(initialTitle);
    }
  }, [isOpen, initialTitle]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(editingTitle);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-writer-navy/20 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 border border-writer-beige">
        <h2 className="text-2xl font-bold text-writer-navy mb-6">Project Settings</h2>
        
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-writer-navy mb-2">
              Project Title
            </label>
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              className="w-full border border-writer-beige rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-writer-navy/50"
              placeholder="Enter project title"
            />
          </div>
          {/* Future fields (Genre, Description) go here */}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-writer-navy hover:bg-writer-beige/30 rounded-lg transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !editingTitle.trim()}
            className="bg-writer-navy text-writer-white px-6 py-2 rounded-lg hover:bg-writer-navy/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}