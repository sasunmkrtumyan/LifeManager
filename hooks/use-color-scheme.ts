import { useColorScheme as useRNColorScheme } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@lifemanager_theme';

export function useColorScheme() {
  const systemColorScheme = useRNColorScheme();
  const [colorScheme, setColorScheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme) {
          setColorScheme(savedTheme as 'light' | 'dark');
        } else {
          // Default to dark mode
          setColorScheme('dark');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        setColorScheme('dark'); // Default to dark
      }
    };
    loadTheme();
  }, []);

  const setTheme = async (theme: 'light' | 'dark') => {
    try {
      await AsyncStorage.setItem(THEME_KEY, theme);
      setColorScheme(theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return { colorScheme: colorScheme || 'dark', setTheme };
}
