import { TouchableOpacity } from 'react-native';
import BackIcon from '@/src/assets/icons/common/back.svg';

interface BackButtonProps {
  onPress: () => void;
}

export default function BackButton({ onPress }: BackButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="h-9 w-9 items-center justify-center rounded-lg"
      accessibilityLabel="뒤로"
    >
      <BackIcon width={24} height={24} />
    </TouchableOpacity>
  );
}
