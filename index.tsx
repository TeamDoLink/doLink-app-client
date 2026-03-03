import { AppRegistry, Platform } from 'react-native';
import './src/styles/global.css';
import './src/lib/nativewind-setup';

import '@expo/metro-runtime';

import { App } from 'expo-router/build/qualified-entry';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';

import Inbox from './app-inbox';
import { registerRootComponent } from 'expo';

if (process.env.EXPO_PUBLIC_DEBUG_INBOX === 'true') {
  registerRootComponent(Inbox);
} else {
  renderRootComponent(App);
}

if (Platform.OS === 'android') {
  AppRegistry.registerComponent('share-intent', () => Inbox);
} else if (Platform.OS === 'ios') {
  AppRegistry.registerComponent('shareExtension', () => Inbox);
}
