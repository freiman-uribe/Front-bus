import React from 'react';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '@/assets/css/style'

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RedirectRouter } from '@/components/RedirectRouter';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();



  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  
  return (
    <PaperProvider theme={theme}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider
        
          style={{ paddingBottom: insets.bottom }}
          // style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
        >
            <RedirectRouter>
              <Stack >
                  <Stack.Screen name="(admin)" options={{headerShown: false}} />
                  <Stack.Screen name="(auths)" options={{ headerShown: false }} />
                  <Stack.Screen name="(driver)" options={{ headerShown: false }} />
                  <Stack.Screen name="(student)" options={{ headerShown: false }} />
                  <Stack.Screen name="+not-found" />
              </Stack>
            </RedirectRouter>
        </SafeAreaProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}
