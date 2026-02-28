import { View } from 'react-native';
import Header from './Header';
import BottomSheet from './BottomSheet';
import { InboxBottomSheetProvider } from './context';
import Overlay from './Overlay';
import Footer from './Footer';
import Layout from './Layout';
import { PortalOut } from '../protal';
import Content from './Content';

interface InboxBottomSheetProps {
  steps: number[];
  initialStep?: number;
  children: React.ReactNode;
}

const InboxBottomSheet = ({
  steps,
  initialStep = 0,
  children,
}: InboxBottomSheetProps) => {
  return (
    <InboxBottomSheetProvider steps={steps} initialStep={initialStep}>
      <View className="flex-1 justify-end">
        <Overlay />
        {children}
        <PortalOut portalKey="footer" />
      </View>
    </InboxBottomSheetProvider>
  );
};

export default Object.assign(InboxBottomSheet, {
  Header,
  Footer,
  Layout,
  BottomSheet,
  Overlay,
  Content,
});
