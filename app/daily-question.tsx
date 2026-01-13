import { ScrollView, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import useDailyQuestionStore from "@/src/store/dailyQuestionStore";
import { getCurrentUser, signInAnon, onAuthChange } from "@/src/services/auth";
import Card from "@/src/components/Shared/Card";
import Input from "@/src/components/Shared/Input";
import Button from "@/src/components/Shared/Button";
import { formatDisplayDate } from "@/src/utils/dateHelpers";

export default function DailyQuestionScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [answer, setAnswer] = useState("");

  const { todayQuestion, getTodayAnswer, answers, init, cleanup, saveAnswer, loading } = useDailyQuestionStore();

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

  useEffect(() => {
    const todayAnswer = getTodayAnswer();
    if (todayAnswer) {
      setAnswer(todayAnswer.answer || "");
    } else {
      setAnswer("");
    }
  }, [answers]);

  const handleSave = async () => {
    if (!todayQuestion) return;
    await saveAnswer(todayQuestion, answer);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        <Text className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Daily Question
        </Text>

        <Card className="mb-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Today's Question
          </Text>
          <Text className="text-xl text-gray-800 dark:text-gray-200 mb-4">
            {todayQuestion || "What are you grateful for today?"}
          </Text>

          <Input
            label="Your Answer"
            value={answer}
            onChangeText={setAnswer}
            placeholder="Write your answer here..."
            multiline
            numberOfLines={6}
          />

          <Button
            title="Save Answer"
            onPress={handleSave}
            loading={loading}
            className="mt-4"
          />
        </Card>

        {answers.length > 0 && (
          <Card>
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Previous Answers
            </Text>
            {answers.slice(0, 5).map((ans: { date: Date | string; question: string; answer: string }, index: number) => (
              <View key={index} className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {formatDisplayDate(ans.date)}
                </Text>
                <Text className="text-base text-gray-900 dark:text-gray-100 mb-2">
                  {ans.question}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  {ans.answer}
                </Text>
              </View>
            ))}
          </Card>
        )}
      </View>
    </ScrollView>
  );
}
