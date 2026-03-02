import { View, ViewProps } from 'react-native';
import { useInboxBottomSheet } from './context';

interface ContentProps extends ViewProps {}

const Content = ({ ...props }: ContentProps) => {
  const { contentHeight } = useInboxBottomSheet();

  if (!contentHeight) {
    throw new Error('contentHeight is not defined');
  }

  return (
    <View
      {...props}
      onLayout={(event) => {
        contentHeight.value = event.nativeEvent.layout.height;
      }}
    />
  );
};

export default Content;
