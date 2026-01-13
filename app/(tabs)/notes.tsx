import AddNoteModal from "@/src/components/Notes/AddNoteModal";
import NoteCard from "@/src/components/Notes/NoteCard";
import Button from "@/src/components/Shared/Button";
import { getCurrentUser, onAuthChange, signInAnon } from "@/src/services/auth";
import useNoteStore from "@/src/store/noteStore";
import { useRouter } from "expo-router";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

interface Note {
  id: string;
  title: string;
  content?: string;
  createdAt?: Date | string;
}

export default function NotesScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const { notes, init, cleanup, deleteNote } = useNoteStore();

  useEffect(() => {
    const initialize = async () => {
      let currentUser = getCurrentUser();
      if (!currentUser) {
        currentUser = await signInAnon();
      }
      setUser(currentUser);
      if (currentUser) {
        init(currentUser.uid);
      }
    };

    initialize();

    const unsubscribe = onAuthChange((authUser: User | null) => {
      if (authUser) {
        setUser(authUser);
        init(authUser.uid);
      } else {
        setUser(null);
        cleanup();
      }
    });

    return () => {
      unsubscribe();
      cleanup();
    };
  }, []);

  const filteredNotes = notes.filter(
    (note: Note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setModalVisible(true);
  };

  const handleDelete = (note: Note) => {
    deleteNote(note.id);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingNote(null);
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Notes
          </Text>
          <Button
            title="+ Add"
            onPress={() => setModalVisible(true)}
            className="px-4 py-2"
          />
        </View>

        <TextInput
          className="bg-white dark:bg-gray-800 px-4 py-3 rounded-lg mb-4 text-gray-900 dark:text-gray-100"
          placeholder="Search notes..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView>
          {filteredNotes.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className="text-gray-500 dark:text-gray-400 text-center">
                {searchQuery
                  ? "No notes found"
                  : "No notes yet. Create your first note!"}
              </Text>
            </View>
          ) : (
            filteredNotes.map((note: Note) => (
              <Pressable key={note.id}>
                <NoteCard
                  onPress={() => handleEdit(note)}
                  handleDelete={handleDelete}
                  note={{ ...note, createdAt: note.createdAt || new Date() }}
                />
              </Pressable>
            ))
          )}
        </ScrollView>
      </View>

      <AddNoteModal
        visible={modalVisible}
        onClose={handleCloseModal}
        note={editingNote || undefined}
      />
    </View>
  );
}
