import { Platform } from 'react-native';
import InboxScreenAndroid from './InboxScreen.android';
import InboxScreenIos from './InboxScreen.ios';

const InboxScreen = Platform.OS === 'ios' ? InboxScreenIos : InboxScreenAndroid;

export default InboxScreen;
