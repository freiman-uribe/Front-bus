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
import { UserAvatar } from '@/components/navigation/UserAvatar';
import { useSession } from '@/hooks/useSession';
import { ROLES } from '@/constants/Rol';
import { Link, router } from 'expo-router';
import { RedirectRouter } from '@/components/RedirectRouter';
import { DrawerToggleButton } from '@react-navigation/drawer';
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
                  <Stack.Screen
                    name="(admin)"
                    options={{
                      headerTitle: '',
                      headerLeft: () => <DrawerToggleButton />,
                      headerRight: () => <UserAvatar />,
                    }}
                  />
                  <Stack.Screen  name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="(auths)" options={{ headerShown: false }} />
                  <Stack.Screen name="(car_route)" options={{ headerShown: false }} />
                  <Stack.Screen name="(driver)" options={{ headerShown: false }} />
                  <Stack.Screen name="(student)" options={{ headerShown: false }} />
                  <Stack.Screen name="(plans)" options={{ headerShown: false }} />
                  <Stack.Screen name='(car)' options={{ headerShown: false }} />
                  <Stack.Screen name='(bus-driver)' options={{ headerShown: false }} />
                  <Stack.Screen name="+not-found" />
              </Stack>
            </RedirectRouter>
        </SafeAreaProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}
