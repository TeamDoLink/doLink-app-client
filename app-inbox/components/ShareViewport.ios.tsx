import { View } from 'react-native';

interface ShareViewportProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function ShareViewportIos({ children }: ShareViewportProps) {
  return <View className="flex-1 bg-white">{children}</View>;
}
