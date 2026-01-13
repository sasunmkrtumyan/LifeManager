import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Modal from '../Shared/Modal';
import Input from '../Shared/Input';
import Button from '../Shared/Button';
import useTaskStore from '../../store/taskStore';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  task?: {
    id: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: Date | string;
  };
}

const PRIORITIES: Array<'low' | 'medium' | 'high' | 'urgent'> = ['low', 'medium', 'high', 'urgent'];

export default function AddTaskModal({ visible, onClose, task }: AddTaskModalProps) {
  const { addTask, updateTask, loading } = useTaskStore();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>(
    task?.priority || 'medium'
  );
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );

  const handleSave = async () => {
    if (!title.trim()) return;

    try {
      if (task) {
        await updateTask(task.id, {
          title,
          description,
          priority,
          dueDate: dueDate ? new Date(dueDate) : null,
        });
      } else {
        await addTask({
          title,
          description,
          priority,
          dueDate: dueDate ? new Date(dueDate) : null,
        });
      }
      onClose();
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <Modal visible={visible} onClose={onClose} title={task ? 'Edit Task' : 'Add Task'}>
      <ScrollView>
        <Input
          label="Task Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Complete project report"
        />

        <Input
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Add details..."
          multiline
          numberOfLines={3}
        />

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Priority
          </Text>
          <View className="flex-row flex-wrap">
            {PRIORITIES.map((pri) => (
              <Button
                key={pri}
                title={pri.charAt(0).toUpperCase() + pri.slice(1)}
                onPress={() => setPriority(pri)}
                variant={priority === pri ? 'primary' : 'outline'}
                className="mr-2 mb-2"
              />
            ))}
          </View>
        </View>

        <Input
          label="Due Date (Optional)"
          value={dueDate}
          onChangeText={setDueDate}
          placeholder="YYYY-MM-DD"
        />

        <Button
          title={task ? 'Update Task' : 'Add Task'}
          onPress={handleSave}
          loading={loading}
          className="mt-4"
        />
      </ScrollView>
    </Modal>
  );
}
