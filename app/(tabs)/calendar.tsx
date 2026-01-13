import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import { User } from "firebase/auth";
import useHabitStore from "@/src/store/habitStore";
import useTaskStore from "@/src/store/taskStore";
import useNoteStore from "@/src/store/noteStore";
import useSubscriptionStore from "@/src/store/subscriptionStore";
import { getCurrentUser, signInAnon, onAuthChange } from "@/src/services/auth";
import { formatDate, getToday } from "@/src/utils/dateHelpers";
import Card from "@/src/components/Shared/Card";

interface MarkedDate {
  dots?: Array<{ color: string; selectedDotColor: string }>;
  selected?: boolean;
  selectedColor?: string;
}

interface MarkedDates {
  [key: string]: MarkedDate;
}

export default function CalendarScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});

  const { habits, init: initHabits, cleanup: cleanupHabits } = useHabitStore();
  const { tasks, init: initTasks, cleanup: cleanupTasks } = useTaskStore();
  const { notes, init: initNotes, cleanup: cleanupNotes } = useNoteStore();
  const { subscriptions, init: initSubscriptions, cleanup: cleanupSubscriptions } = useSubscriptionStore();

  useEffect(() => {
    const initialize = async () => {
      let currentUser = getCurrentUser();
      if (!currentUser) {
        currentUser = await signInAnon();
      }
      setUser(currentUser);
      if (currentUser) {
        initHabits(currentUser.uid);
        initTasks(currentUser.uid);
        initNotes(currentUser.uid);
        initSubscriptions(currentUser.uid);
      }
    };

    initialize();

    const unsubscribe = onAuthChange((authUser: User | null) => {
      if (authUser) {
        setUser(authUser);
        initHabits(authUser.uid);
        initTasks(authUser.uid);
        initNotes(authUser.uid);
        initSubscriptions(authUser.uid);
      } else {
        setUser(null);
        cleanupHabits();
        cleanupTasks();
        cleanupNotes();
        cleanupSubscriptions();
      }
    });

    return () => {
      unsubscribe();
      cleanupHabits();
      cleanupTasks();
      cleanupNotes();
      cleanupSubscriptions();
    };
  }, []);

  // Update marked dates when data changes
  useEffect(() => {
    const marked: MarkedDates = {};
    
    // Mark dates with habits
    habits.forEach((habit: { id: string; completedDates?: string[] }) => {
      (habit.completedDates || []).forEach((date: string) => {
        if (date && !marked[date]) {
          marked[date] = { dots: [], selected: false };
        }
        if (date && marked[date] && !marked[date].dots) {
          marked[date].dots = [];
        }
        if (date && marked[date] && marked[date].dots) {
          marked[date].dots.push({ color: 'blue', selectedDotColor: 'blue' });
        }
      });
    });

    // Mark dates with tasks
    tasks.forEach((task: { id: string; dueDate?: Date | string | null }) => {
      if (task.dueDate) {
        const dateStr = formatDate(task.dueDate);
        if (dateStr && !marked[dateStr]) {
          marked[dateStr] = { dots: [], selected: false };
        }
        if (dateStr && marked[dateStr] && !marked[dateStr].dots) {
          marked[dateStr].dots = [];
        }
        if (dateStr && marked[dateStr] && marked[dateStr].dots) {
          marked[dateStr].dots.push({ color: 'green', selectedDotColor: 'green' });
        }
      }
    });

    // Mark dates with notes
    notes.forEach((note: { id: string; createdAt: Date | string }) => {
      const dateStr = formatDate(note.createdAt);
      if (dateStr && !marked[dateStr]) {
        marked[dateStr] = { dots: [], selected: false };
      }
      if (dateStr && marked[dateStr] && !marked[dateStr].dots) {
        marked[dateStr].dots = [];
      }
      if (dateStr && marked[dateStr] && marked[dateStr].dots) {
        marked[dateStr].dots.push({ color: 'orange', selectedDotColor: 'orange' });
      }
    });

    // Mark dates with subscriptions
    subscriptions.forEach((sub: { id: string; nextPaymentDate: Date | string }) => {
      const dateStr = formatDate(sub.nextPaymentDate);
      if (dateStr && !marked[dateStr]) {
        marked[dateStr] = { dots: [], selected: false };
      }
      if (dateStr && marked[dateStr] && !marked[dateStr].dots) {
        marked[dateStr].dots = [];
      }
      if (dateStr && marked[dateStr] && marked[dateStr].dots) {
        marked[dateStr].dots.push({ color: 'purple', selectedDotColor: 'purple' });
      }
    });

    // Mark selected date
    if (selectedDate) {
      if (marked[selectedDate]) {
        marked[selectedDate].selected = true;
        marked[selectedDate].selectedColor = 'blue';
      } else {
        marked[selectedDate] = { selected: true, selectedColor: 'blue', dots: [] };
      }
    }

    setMarkedDates(marked);
  }, [habits, tasks, notes, subscriptions, selectedDate]);

  const getDateItems = (date: string | null) => {
    if (!date) {
      return {
        habits: [],
        tasks: [],
        notes: [],
        subscriptions: [],
      };
    }
    const dateStr = formatDate(new Date(date));
    if (!dateStr) {
      return {
        habits: [],
        tasks: [],
        notes: [],
        subscriptions: [],
      };
    }
    return {
      habits: habits.filter((h: { completedDates?: string[] }) => (h.completedDates || []).includes(dateStr)),
      tasks: tasks.filter((t: { dueDate?: Date | string | null }) => t.dueDate && formatDate(t.dueDate) === dateStr),
      notes: notes.filter((n: { createdAt: Date | string }) => formatDate(n.createdAt) === dateStr),
      subscriptions: subscriptions.filter((s: { nextPaymentDate: Date | string }) => formatDate(s.nextPaymentDate) === dateStr),
    };
  };

  const dateItems = getDateItems(selectedDate);

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        <Text className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Calendar
        </Text>

        <Calendar
          current={selectedDate || undefined}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#2563eb',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#2563eb',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#2563eb',
            selectedDotColor: '#ffffff',
            arrowColor: '#2563eb',
            monthTextColor: '#2d4150',
            textDayFontWeight: '400',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 13,
          }}
        />

        <Card className="mt-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {selectedDate ? formatDate(new Date(selectedDate)) : 'No date selected'}
          </Text>

          {dateItems.habits.length > 0 && (
            <View className="mb-3">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Habits ({dateItems.habits.length})
              </Text>
              {dateItems.habits.map((habit: { id: string; name: string }) => (
                <Text key={habit.id} className="text-sm text-gray-600 dark:text-gray-400">
                  ✓ {habit.name}
                </Text>
              ))}
            </View>
          )}

          {dateItems.tasks.length > 0 && (
            <View className="mb-3">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tasks ({dateItems.tasks.length})
              </Text>
              {dateItems.tasks.map((task: { id: string; title: string }) => (
                <Text key={task.id} className="text-sm text-gray-600 dark:text-gray-400">
                  • {task.title}
                </Text>
              ))}
            </View>
          )}

          {dateItems.notes.length > 0 && (
            <View className="mb-3">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes ({dateItems.notes.length})
              </Text>
              {dateItems.notes.map((note: { id: string; title: string }) => (
                <Text key={note.id} className="text-sm text-gray-600 dark:text-gray-400">
                  📝 {note.title}
                </Text>
              ))}
            </View>
          )}

          {dateItems.subscriptions.length > 0 && (
            <View className="mb-3">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subscriptions ({dateItems.subscriptions.length})
              </Text>
              {dateItems.subscriptions.map((sub: { id: string; name: string; amount: number }) => (
                <Text key={sub.id} className="text-sm text-gray-600 dark:text-gray-400">
                  💳 {sub.name} - ${sub.amount}
                </Text>
              ))}
            </View>
          )}

          {dateItems.habits.length === 0 &&
            dateItems.tasks.length === 0 &&
            dateItems.notes.length === 0 &&
            dateItems.subscriptions.length === 0 && (
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                No items for this date
              </Text>
            )}
        </Card>
      </View>
    </ScrollView>
  );
}
