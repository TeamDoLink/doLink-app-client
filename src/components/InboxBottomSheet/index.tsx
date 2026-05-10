import { View } from 'react-native';
import Header from './Header';
import BottomSheet from './BottomSheet';
import { InboxBottomSheetProvider } from './context';
import Overlay from './Overlay';
import Footer from './Footer';
import Layout from './Layout';
import { PortalOut } from '../Portal';
import Content from './Content';

interface InboxBottomSheetProps {
  steps: number[];
  initialStep?: number;
  children: React.ReactNode;
  onClose?: () => void;
  showOverlay?: boolean;
  dockToBottom?: boolean;
  viewportHeight?: number;
}

const InboxBottomSheet = ({
  steps,
  initialStep = 0,
  children,
  onClose,
  showOverlay = true,
  dockToBottom = true,
  viewportHeight,
}: InboxBottomSheetProps) => {
  return (
    <InboxBottomSheetProvider
      steps={steps}
      initialStep={initialStep}
      onClose={onClose}
      viewportHeight={viewportHeight}
    >
      <View className={dockToBottom ? 'flex-1 justify-end' : 'flex-1'}>
        {showOverlay ? <Overlay /> : null}
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
