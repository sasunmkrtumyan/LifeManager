import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { formatDisplayDate } from "../../utils/dateHelpers";
import Card from "../Shared/Card";

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    content?: string;
    createdAt: Date | string;
  };
  onPress?: () => void; // edit
  handleDelete: () => void;
}

export default function NoteCard({
  note,
  onPress,
  handleDelete,
}: NoteCardProps) {
  const [showPreview, setShowPreview] = useState(false);

  const preview = note.content?.substring(0, 100) || "";
  const hasMore = note.content && note.content.length > 100;

  return (
    <Card className="mb-3">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {note.title}
        </Text>

        {/* Eye toggle */}
        {!!note.content && (
          <TouchableOpacity
            onPress={() => setShowPreview((prev) => !prev)}
            hitSlop={10}
          >
            <Text className="text-sm text-blue-600 dark:text-blue-400">
              {showPreview ? "🙈" : "👁️"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Preview */}
      {showPreview && preview && (
        <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {preview}
          {hasMore && "..."}
        </Text>
      )}

      {/* Footer */}
      <View className="flex-row items-center justify-between">
        <Text className="text-xs text-gray-400 dark:text-gray-500">
          {formatDisplayDate(note.createdAt)}
        </Text>

        {/* Actions (only when preview is visible) */}
        {showPreview && (
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={onPress}>
              <Text className="text-sm text-green-600 dark:text-green-400">
                Edit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleDelete}>
              <Text className="text-sm text-red-600 dark:text-red-400">
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Card>
  );
}
