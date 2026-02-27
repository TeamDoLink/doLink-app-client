import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InboxScreen from './screens/InboxScreen';
import AddCollectionScreen from './screens/AddCollectionScreen';
import { NavigationContainer } from '@react-navigation/native';
import { AppInboxStackParamList } from './types';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useSyncLoginCookie from '@/src/hooks/useSyncLoginCookie';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const queryClient = new QueryClient();

const Stack = createNativeStackNavigator<AppInboxStackParamList>();

export default function Inbox() {
  const navigationRef =
    useRef<NavigationContainerRef<AppInboxStackParamList>>(null);

  const syncLogin = useSyncLoginCookie();
  useEffect(() => {
    syncLogin();
  }, [syncLogin]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer ref={navigationRef}>
              <Stack.Navigator
                initialRouteName="Inbox"
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen
                  name="Inbox"
                  options={{
                    title: '할일 담기',
                  }}
                  component={InboxScreen}
                />
                <Stack.Screen
                  name="AddCollection"
                  options={{ title: '모음 추가' }}
                  component={AddCollectionScreen}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </QueryClientProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
