import { ScrollView, View } from 'react-native';
import Header from './Header';
import BottomSheet from './BottomSheet';
import { InboxBottomSheetProvider } from './context';
import Overlay from './Overlay';
import Footer from './Footer';
import Layout from './Layout';
import { PortalOut, PortalProvider } from '../protal';

interface InboxBottomSheetProps {
  steps: number[];
  initialStep?: number;
  header: React.ReactNode;
  content: React.ReactNode;
  footer: React.ReactNode;
}

const InboxBottomSheet = ({
  steps,
  initialStep = 0,
  header,
  content,
  footer,
}: InboxBottomSheetProps) => {
  return (
    <InboxBottomSheetProvider steps={steps} initialStep={initialStep}>
      <View className="flex-1 justify-end">
        <Overlay />
        <BottomSheet>
          {header}
          {content}
        </BottomSheet>
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
});
