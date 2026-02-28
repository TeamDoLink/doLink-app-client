import { View, ViewProps } from 'react-native';
import { useInboxBottomSheet } from './context';
import { PortalIn } from '../protal';

interface FooterProps extends ViewProps {}

const Footer = ({ className, ...props }: FooterProps) => {
  const { footerHeight } = useInboxBottomSheet();
  if (!footerHeight) {
    throw new Error('footerHeight is not defined');
  }

  return (
    <PortalIn portalKey="footer">
      <View
        onLayout={(event) => {
          footerHeight.value = event.nativeEvent.layout.height;
        }}
        className={`bg-white px-5 pb-6 ${className}`}
        {...props}
      />
    </PortalIn>
  );
};

export default Footer;
