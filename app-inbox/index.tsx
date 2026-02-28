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
import InboxBottomSheet from './components/InboxBottomSheet';
import { TouchableOpacity, Text } from 'react-native';
import PlusIcon from '@/src/assets/icons/common/plus.svg';

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
              <InboxBottomSheet steps={[40, 70, 100]} initialStep={0}>
                <InboxBottomSheet.BottomSheet>
                  <Stack.Navigator
                    initialRouteName="Inbox"
                    screenOptions={{
                      headerShown: true,
                      contentStyle: {
                        backgroundColor: '#FFFFFF',
                      },
                    }}
                  >
                    <Stack.Screen
                      name="Inbox"
                      options={{
                        title: '할일 담기',
                        header: (props) => (
                          <InboxBottomSheet.Header
                            title="할일 담기"
                            RightContent={
                              <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                  props.navigation.navigate('AddCollection');
                                }}
                                className="flex-row items-center gap-0.5"
                              >
                                <PlusIcon
                                  width={16}
                                  height={16}
                                  color="#4E5968"
                                />
                                <Text className="text-caption-md text-grey-700">
                                  모음 추가
                                </Text>
                              </TouchableOpacity>
                            }
                          />
                        ),
                      }}
                      component={InboxScreen}
                    />
                    <Stack.Screen
                      name="AddCollection"
                      options={{
                        header: () => (
                          <InboxBottomSheet.Header title="모음 추가" />
                        ),
                      }}
                      component={AddCollectionScreen}
                    />
                  </Stack.Navigator>
                </InboxBottomSheet.BottomSheet>
              </InboxBottomSheet>
            </NavigationContainer>
          </QueryClientProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
