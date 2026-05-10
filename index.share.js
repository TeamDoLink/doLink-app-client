import { AppRegistry } from 'react-native';

import './src/styles/global.css';
import './src/lib/nativewind-setup';

import Inbox from './app-inbox';

AppRegistry.registerComponent('shareExtension', () => Inbox);
