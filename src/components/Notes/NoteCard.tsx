import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Card from '../Shared/Card';
import { formatDisplayDate } from '../../utils/dateHelpers';

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    content?: string;
    createdAt: Date | string;
  };
  onPress?: () => void;
}

export default function NoteCard({ note, onPress }: NoteCardProps) {
  const preview = note.content?.substring(0, 100) || '';
  const hasMore = note.content && note.content.length > 100;

  return (
    <Card className="mb-3">
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {note.title}
        </Text>
        {preview && (
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {preview}
            {hasMore && '...'}
          </Text>
        )}
        <Text className="text-xs text-gray-400 dark:text-gray-500">
          {formatDisplayDate(note.createdAt)}
        </Text>
      </TouchableOpacity>
    </Card>
  );
}
