import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AppInboxStackParamList = {
  Inbox: undefined;
  AddCollection: undefined;
};

export type AppInboxStackScreenProps<T extends keyof AppInboxStackParamList> =
  NativeStackScreenProps<AppInboxStackParamList, T>;
export type AppInboxAddCollectionStackScreenProps = NativeStackScreenProps<
  AppInboxStackParamList,
  'AddCollection'
>;
