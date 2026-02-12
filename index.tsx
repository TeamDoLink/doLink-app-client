import { AppRegistry, Platform } from 'react-native';
import 'expo-router/entry';
import './src/styles/global.css';
import './src/lib/nativewind-setup';

// import NaverWebView from './src/components/NaverWebView';
// import {
//   ShareIntentRoot,
//   IOSShareIntentRoot,
// } from './src/components/extension';
import ShareIntentRouter from './src/components/extension/ShareIntentRouter';

if (Platform.OS === 'android') {
  AppRegistry.registerComponent('share-intent', () => ShareIntentRouter);
} else {
  AppRegistry.registerComponent('shareExtension', () => ShareIntentRouter);
}
