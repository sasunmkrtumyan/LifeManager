import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import Modal from '../Shared/Modal';
import Input from '../Shared/Input';
import Button from '../Shared/Button';
import useNoteStore from '../../store/noteStore';

interface AddNoteModalProps {
  visible: boolean;
  onClose: () => void;
  note?: {
    id: string;
    title: string;
    content?: string;
  };
}

export default function AddNoteModal({ visible, onClose, note }: AddNoteModalProps) {
  const { addNote, updateNote, loading } = useNoteStore();
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  const handleSave = async () => {
    if (!title.trim()) return;

    try {
      if (note) {
        await updateNote(note.id, { title, content });
      } else {
        await addNote({ title, content });
      }
      onClose();
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <Modal visible={visible} onClose={onClose} title={note ? 'Edit Note' : 'Add Note'}>
      <ScrollView>
        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Note title"
        />

        <Input
          label="Content"
          value={content}
          onChangeText={setContent}
          placeholder="Write your note here..."
          multiline
          numberOfLines={8}
        />

        <Button
          title={note ? 'Update Note' : 'Save Note'}
          onPress={handleSave}
          loading={loading}
          className="mt-4"
        />
      </ScrollView>
    </Modal>
  );
}
