import { AppRegistry, Platform } from 'react-native';
import 'expo-router/entry';
import './src/styles/global.css';
import './src/lib/nativewind-setup';

import {
  ShareIntentRoot,
  IOSShareIntentRoot,
} from './src/components/extension';

if (Platform.OS === 'android') {
  AppRegistry.registerComponent('share-intent', () => ShareIntentRoot);
} else {
  AppRegistry.registerComponent('shareExtension', () => IOSShareIntentRoot);
}
