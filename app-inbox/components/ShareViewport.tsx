import { Platform } from 'react-native';
import ShareViewportAndroid from './ShareViewport.android';
import ShareViewportIos from './ShareViewport.ios';

const ShareViewport =
  Platform.OS === 'ios' ? ShareViewportIos : ShareViewportAndroid;

export default ShareViewport;
