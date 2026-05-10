import { Platform } from 'react-native';
import AddCollectionScreenAndroid from './AddCollectionScreen.android';
import AddCollectionScreenIos from './AddCollectionScreen.ios';

const AddCollectionScreen =
  Platform.OS === 'ios' ? AddCollectionScreenIos : AddCollectionScreenAndroid;

export default AddCollectionScreen;
