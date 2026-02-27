import { View, ViewProps } from 'react-native';

interface LayoutProps extends ViewProps {}

const Layout = ({ className, ...props }: LayoutProps) => {
  return <View className={`px-safe flex-1 ${className}`} {...props} />;
};

export default Layout;
