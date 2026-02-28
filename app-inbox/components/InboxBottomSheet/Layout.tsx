import { View, ViewProps } from 'react-native';
import { useInboxBottomSheet } from './context';

interface LayoutProps extends ViewProps {}

const Layout = ({ className, ...props }: LayoutProps) => {
  const { contentHeight } = useInboxBottomSheet();

  if (!contentHeight) {
    throw new Error('contentHeight is not defined');
  }

  return (
    <View
      className={`px-safe flex-1 ${className}`}
      {...props}
      onLayout={(event) => {
        contentHeight.value = event.nativeEvent.layout.height;
      }}
    />
  );
};

export default Layout;
