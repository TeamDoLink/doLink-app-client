import { View, ViewProps } from 'react-native';
import { useInboxBottomSheet } from './context';

interface FooterProps extends ViewProps {}

const Footer = ({ className, ...props }: FooterProps) => {
  const { footerHeight } = useInboxBottomSheet();
  if (!footerHeight) {
    throw new Error('footerHeight is not defined');
  }

  return (
    <View
      onLayout={(event) => {
        footerHeight.value = event.nativeEvent.layout.height;
      }}
      className={`bg-white px-5 pb-6 ${className}`}
      {...props}
    />
  );
};

export default Footer;
