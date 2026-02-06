import '../src/styles/global.css';
import '../src/lib/nativewind-setup';
import { useState, useEffect } from 'react';
import { View, BackHandler, Platform, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import type { ShareIntent } from 'expo-share-intent';
import CollectionBottomSheet from '@/src/components/CollectionBottomSheet';

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </SafeAreaProvider>
    </KeyboardProvider>
  );
}
