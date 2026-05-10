import { AppRegistry } from 'react-native';
import './src/styles/global.css';
import './src/lib/nativewind-setup';

import '@expo/metro-runtime';

import { App } from 'expo-router/build/qualified-entry';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';

import Inbox from './app-inbox';
import { registerRootComponent } from 'expo';
import { ShareIntentData } from './src/types/shareIntent';

const DebugInboxRoot = () => <Inbox />;
const AndroidShareInboxRoot = (props: ShareIntentData) => <Inbox {...props} />;

if (process.env.EXPO_PUBLIC_DEBUG_INBOX === 'true') {
  registerRootComponent(DebugInboxRoot);
} else {
  renderRootComponent(App);
}

AppRegistry.registerComponent('share-intent', () => AndroidShareInboxRoot);
