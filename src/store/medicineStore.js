import { create } from 'zustand';
import { getUserCollectionPath, subscribeToCollection, addDocument, updateDocument, deleteDocument, timestampToDate, dateToTimestamp } from '../utils/firestoreHelpers';
import { scheduleMedicineReminder, cancelItemNotification } from '../services/notifications';
import { getCurrentUser } from '../services/auth';
import { formatDate } from '../utils/dateHelpers';

const useMedicineStore = create((set, get) => ({
  medicines: [],
  loading: false,
  unsubscribe: null,

  setMedicines: (medicines) => set({ medicines }),

  init: (userId) => {
    const { unsubscribe: existingUnsubscribe } = get();
    if (existingUnsubscribe) {
      existingUnsubscribe();
    }

    const collectionPath = getUserCollectionPath(userId, 'medicines');
    const unsubscribe = subscribeToCollection(
      collectionPath,
      [],
      { field: 'createdAt', direction: 'desc' },
      (medicines) => {
        const processedMedicines = medicines.map(medicine => ({
          ...medicine,
          createdAt: timestampToDate(medicine.createdAt),
          updatedAt: timestampToDate(medicine.updatedAt),
          startDate: timestampToDate(medicine.startDate),
          endDate: medicine.endDate ? timestampToDate(medicine.endDate) : null,
        }));
        set({ medicines: processedMedicines });
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

  addMedicine: async (medicineData) => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    set({ loading: true });
    try {
      const collectionPath = getUserCollectionPath(user.uid, 'medicines');
      const medicineId = await addDocument(collectionPath, {
        name: medicineData.name,
        dose: medicineData.dose,
        frequency: medicineData.frequency, // e.g., "daily", "twice_daily", "09:00,21:00"
        startDate: dateToTimestamp(medicineData.startDate || new Date()),
        endDate: medicineData.endDate ? dateToTimestamp(medicineData.endDate) : null,
        takenHistory: [],
      });

      // Schedule reminders based on frequency
      if (medicineData.frequency && medicineData.frequency.includes(':')) {
        // Custom times (e.g., "09:00,21:00")
        await scheduleMedicineReminder(medicineId, medicineData.name, medicineData.frequency);
      } else if (medicineData.frequency === 'twice_daily') {
        await scheduleMedicineReminder(medicineId, medicineData.name, '09:00,21:00');
      } else {
        // Daily at 9 AM
        await scheduleMedicineReminder(medicineId, medicineData.name, '09:00');
      }

      return medicineId;
    } catch (error) {
      console.error('Error adding medicine:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateMedicine: async (id, updatedMedicine) => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    set({ loading: true });
    try {
      const collectionPath = getUserCollectionPath(user.uid, 'medicines');
      await updateDocument(collectionPath, id, {
        name: updatedMedicine.name,
        dose: updatedMedicine.dose,
        frequency: updatedMedicine.frequency,
        startDate: dateToTimestamp(updatedMedicine.startDate),
        endDate: updatedMedicine.endDate ? dateToTimestamp(updatedMedicine.endDate) : null,
      });

      // Update notifications
      await cancelItemNotification('medicine', id);
      if (updatedMedicine.frequency && updatedMedicine.frequency.includes(':')) {
        await scheduleMedicineReminder(id, updatedMedicine.name, updatedMedicine.frequency);
      } else if (updatedMedicine.frequency === 'twice_daily') {
        await scheduleMedicineReminder(id, updatedMedicine.name, '09:00,21:00');
      } else {
        await scheduleMedicineReminder(id, updatedMedicine.name, '09:00');
      }
    } catch (error) {
      console.error('Error updating medicine:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteMedicine: async (id) => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    set({ loading: true });
    try {
      const collectionPath = getUserCollectionPath(user.uid, 'medicines');
      await deleteDocument(collectionPath, id);
      await cancelItemNotification('medicine', id);
    } catch (error) {
      console.error('Error deleting medicine:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  markAsTaken: async (id, date = new Date()) => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { medicines } = get();
    const medicine = medicines.find(m => m.id === id);
    if (!medicine) return;

    const takenHistory = medicine.takenHistory || [];
    const dateStr = formatDate(date);
    
    if (!takenHistory.includes(dateStr)) {
      set({ loading: true });
      try {
        const collectionPath = getUserCollectionPath(user.uid, 'medicines');
        await updateDocument(collectionPath, id, {
          takenHistory: [...takenHistory, dateStr],
        });
      } catch (error) {
        console.error('Error marking medicine as taken:', error);
        throw error;
      } finally {
        set({ loading: false });
      }
    }
  },
}));

export default useMedicineStore;
