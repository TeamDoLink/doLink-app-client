import { View, Text } from 'react-native';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';

import BackButton from '@/src/components/common/backButton';
import { useLayoutEffect, useState } from 'react';

interface StackHeaderProps extends NativeStackHeaderProps {
  RightContent?: React.ReactNode;
}

const StackHeader = (props: StackHeaderProps) => {
  const [canBack, setCanBack] = useState(false);
  const title = props.options.title ?? 'DoLink';

  //   애니메이션 완료 후 네비게이션 상태 업데이트
  useLayoutEffect(() => {
    setCanBack(props.navigation.canGoBack());
  }, [props.navigation]);

  return (
    <View className="flex-row items-center justify-between bg-white px-5 pb-6">
      <View className="flex-1 flex-row items-center gap-2">
        {canBack && <BackButton onPress={() => props.navigation.goBack()} />}
        <Text className="text-heading-xl text-black">{title}</Text>
      </View>
      <View className="flex-row items-center gap-2">{props.RightContent}</View>
    </View>
  );
};

export default StackHeader;
