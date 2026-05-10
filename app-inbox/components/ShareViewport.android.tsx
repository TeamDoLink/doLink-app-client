import InboxBottomSheet from '@/src/components/InboxBottomSheet';

interface ShareViewportProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function ShareViewportAndroid({
  children,
  onClose,
}: ShareViewportProps) {
  return (
    <InboxBottomSheet steps={[40, 70, 100]} initialStep={0} onClose={onClose}>
      <InboxBottomSheet.BottomSheet>{children}</InboxBottomSheet.BottomSheet>
    </InboxBottomSheet>
  );
}
