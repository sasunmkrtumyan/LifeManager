import { create } from "zustand";
import { getCurrentUser } from "../services/auth";
import {
  addDocument,
  deleteDocument,
  getUserCollectionPath,
  subscribeToCollection,
  timestampToDate,
  updateDocument,
} from "../utils/firestoreHelpers";

const useNoteStore = create((set, get) => ({
  notes: [],
  loading: false,
  unsubscribe: null,

  setNotes: (notes) => set({ notes }),

  init: (userId) => {
    const { unsubscribe: existingUnsubscribe } = get();
    if (existingUnsubscribe) {
      existingUnsubscribe();
    }

    const collectionPath = getUserCollectionPath(userId, "notes");
    const unsubscribe = subscribeToCollection(
      collectionPath,
      [],
      { field: "createdAt", direction: "desc" },
      (notes) => {
        const processedNotes = notes.map((note) => ({
          ...note,
          createdAt: timestampToDate(note.createdAt),
          updatedAt: timestampToDate(note.updatedAt),
        }));
        set({ notes: processedNotes });
      }
    );

    set({ unsubscribe });
  },

  cleanup: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
      set({ unsubscribe: null });
    }
  },

  addNote: async (noteData) => {
    const user = getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    set({ loading: true });
    try {
      const collectionPath = getUserCollectionPath(user.uid, "notes");
      const noteId = await addDocument(collectionPath, {
        title: noteData.title,
        content: noteData.content || "",
      });
      return noteId;
    } catch (error) {
      console.error("Error adding note:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateNote: async (id, updatedNote) => {
    const user = getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    set({ loading: true });
    try {
      const collectionPath = getUserCollectionPath(user.uid, "notes");
      await updateDocument(collectionPath, id, {
        title: updatedNote.title,
        content: updatedNote.content,
      });
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteNote: async (id) => {
    const user = getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    set({ loading: true });
    try {
      const collectionPath = getUserCollectionPath(user.uid, "notes");
      await deleteDocument(collectionPath, id);
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useNoteStore;
