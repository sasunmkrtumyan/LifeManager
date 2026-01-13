import { create } from 'zustand';
import { getUserCollectionPath, subscribeToCollection, addDocument, getDocuments, timestampToDate, dateToTimestamp } from '../utils/firestoreHelpers';
import { getCurrentUser } from '../services/auth';
import { getToday, formatDate } from '../utils/dateHelpers';

// Default questions bank
const DEFAULT_QUESTIONS = [
  "What are you grateful for today?",
  "What did you learn today?",
  "What made you smile today?",
  "What's one thing you want to improve tomorrow?",
  "What was the highlight of your day?",
  "How did you take care of yourself today?",
  "What challenge did you overcome today?",
  "Who made a positive impact on your day?",
  "What are you looking forward to?",
  "What's one thing you're proud of today?",
];

const useDailyQuestionStore = create((set, get) => ({
  answers: [],
  todayQuestion: null,
  loading: false,
  unsubscribe: null,

  setAnswers: (answers) => set({ answers }),

  init: (userId) => {
    const { unsubscribe: existingUnsubscribe } = get();
    if (existingUnsubscribe) {
      existingUnsubscribe();
    }

    const collectionPath = getUserCollectionPath(userId, 'dailyQuestions');
    const unsubscribe = subscribeToCollection(
      collectionPath,
      [],
      { field: 'date', direction: 'desc' },
      (answers) => {
        const processedAnswers = answers.map(answer => ({
          ...answer,
          date: timestampToDate(answer.date),
          createdAt: timestampToDate(answer.createdAt),
        }));
        set({ answers: processedAnswers });
        
        // Set today's question
        const today = getToday();
        const todayAnswer = processedAnswers.find(a => formatDate(a.date) === today);
        if (todayAnswer) {
          set({ todayQuestion: todayAnswer.question });
        } else {
          // Get a random question for today
          const randomQuestion = DEFAULT_QUESTIONS[Math.floor(Math.random() * DEFAULT_QUESTIONS.length)];
          set({ todayQuestion: randomQuestion });
        }
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

  getTodayQuestion: () => {
    const { todayQuestion } = get();
    if (todayQuestion) return todayQuestion;
    
    // Return random question if none set
    return DEFAULT_QUESTIONS[Math.floor(Math.random() * DEFAULT_QUESTIONS.length)];
  },

  saveAnswer: async (question, answer) => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    set({ loading: true });
    try {
      const today = new Date();
      const dateStr = formatDate(today);
      
      // Check if answer already exists for today
      const collectionPath = getUserCollectionPath(user.uid, 'dailyQuestions');
      const existingAnswers = await getDocuments(collectionPath, [
        { field: 'date', operator: '==', value: dateToTimestamp(today) }
      ]);

      if (existingAnswers.length > 0) {
        // Update existing answer
        const { updateDocument } = await import('../utils/firestoreHelpers');
        await updateDocument(collectionPath, existingAnswers[0].id, {
          question,
          answer,
        });
      } else {
        // Create new answer
        await addDocument(collectionPath, {
          question,
          answer,
          date: dateToTimestamp(today),
        });
      }
    } catch (error) {
      console.error('Error saving answer:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getTodayAnswer: () => {
    const { answers } = get();
    const today = getToday();
    return answers.find(a => formatDate(a.date) === today);
  },

  getAnswerByDate: (date) => {
    const { answers } = get();
    const dateStr = formatDate(date);
    return answers.find(a => formatDate(a.date) === dateStr);
  },
}));

export default useDailyQuestionStore;
