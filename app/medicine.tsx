import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import useMedicineStore from "@/src/store/medicineStore";
import { getCurrentUser, signInAnon, onAuthChange } from "@/src/services/auth";
import Card from "@/src/components/Shared/Card";
import Button from "@/src/components/Shared/Button";
import Input from "@/src/components/Shared/Input";
import Modal from "@/src/components/Shared/Modal";
import { formatDisplayDate } from "@/src/utils/dateHelpers";

interface Medicine {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  startDate?: Date | string;
}

export default function MedicineScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [frequency, setFrequency] = useState("daily");

  const { medicines, init, cleanup, addMedicine, updateMedicine, deleteMedicine, markAsTaken, loading } = useMedicineStore();

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

  const handleSave = async () => {
    if (!name.trim() || !dose) return;

    try {
      if (editingMedicine) {
        await updateMedicine(editingMedicine.id, {
          name,
          dose,
          frequency,
        });
      } else {
        await addMedicine({
          name,
          dose,
          frequency,
        });
      }
      setModalVisible(false);
      setName("");
      setDose("");
      setFrequency("daily");
      setEditingMedicine(null);
    } catch (error) {
      console.error('Error saving medicine:', error);
    }
  };

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setName(medicine.name);
    setDose(medicine.dose);
    setFrequency(medicine.frequency || "daily");
    setModalVisible(true);
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Medicine
          </Text>
          <Button
            title="+ Add"
            onPress={() => setModalVisible(true)}
            className="px-4 py-2"
          />
        </View>

        <ScrollView>
          {medicines.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className="text-gray-500 dark:text-gray-400 text-center">
                No medicines yet. Add your first medicine!
              </Text>
            </View>
          ) : (
            medicines.map((medicine: Medicine) => (
              <Card key={medicine.id} className="mb-3">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {medicine.name}
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Dose: {medicine.dose}
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      Frequency: {medicine.frequency}
                    </Text>
                    {medicine.startDate && (
                      <Text className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Started: {formatDisplayDate(medicine.startDate)}
                      </Text>
                    )}
                  </View>
                  <View className="items-end">
                    <TouchableOpacity
                      onPress={() => markAsTaken(medicine.id)}
                      className="bg-green-100 dark:bg-green-900 px-3 py-2 rounded-lg mb-2"
                    >
                      <Text className="text-green-700 dark:text-green-300 text-sm">Mark Taken</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleEdit(medicine)}
                      className="mb-2"
                    >
                      <Text className="text-blue-600 dark:text-blue-400 text-sm">Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteMedicine(medicine.id)}
                    >
                      <Text className="text-red-600 dark:text-red-400 text-sm">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            ))
          )}
        </ScrollView>
      </View>

      <Modal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingMedicine(null);
          setName("");
          setDose("");
          setFrequency("daily");
        }}
        title={editingMedicine ? "Edit Medicine" : "Add Medicine"}
      >
        <Input
          label="Medicine Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g., Aspirin"
        />
        <Input
          label="Dose"
          value={dose}
          onChangeText={setDose}
          placeholder="e.g., 100mg"
        />
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Frequency
          </Text>
          <View className="flex-row flex-wrap">
            {["daily", "twice_daily", "09:00,21:00"].map((freq) => (
              <Button
                key={freq}
                title={freq.replace("_", " ")}
                onPress={() => setFrequency(freq)}
                variant={frequency === freq ? "primary" : "outline"}
                className="mr-2 mb-2"
              />
            ))}
          </View>
        </View>
        <Button
          title={editingMedicine ? "Update" : "Add"}
          onPress={handleSave}
          loading={loading}
        />
      </Modal>
    </View>
  );
}
