import { View, Text, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect, useState } from 'react';
import BackButton from '@/src/components/common/backButton';

interface HeaderProps {
  title: string;
  RightContent?: React.ReactNode;
}

const Header = ({ title, RightContent }: HeaderProps) => {
  const navigation = useNavigation();

  const [canBack, setCanBack] = useState(false);

  useLayoutEffect(() => {
    setCanBack(navigation.canGoBack());
  }, [navigation.canGoBack]);

  const verticalPaddingClassName =
    Platform.OS === 'ios' ? 'pb-6 pt-1' : 'pb-6 pt-3';

  return (
    <View className="bg-white">
      {Platform.OS === 'ios' ? (
        <View className="items-center px-5 pb-1 pt-3">
          <View className="h-1 w-12 rounded-[2px] bg-[#D2D9DD]" />
        </View>
      ) : null}
      <View
        className={`flex-row items-center justify-between px-5 ${verticalPaddingClassName}`}
      >
        <View className="flex-row items-center gap-2">
          {canBack && <BackButton onPress={() => navigation.goBack()} />}
          <Text className="text-heading-xl text-black">{title}</Text>
        </View>
        <View className="flex-row items-center gap-2">{RightContent}</View>
      </View>
    </View>
  );
};

export default Header;
