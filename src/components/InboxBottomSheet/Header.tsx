import { View, Text } from 'react-native';
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

  return (
    <View className="flex-row items-center justify-between px-5 pb-6 pt-3">
      <View className="flex-row items-center gap-2">
        {canBack && <BackButton onPress={() => navigation.goBack()} />}
        <Text className="text-heading-xl text-black">{title}</Text>
      </View>
      <View className="flex-row items-center gap-2">{RightContent}</View>
    </View>
  );
};

export default Header;
