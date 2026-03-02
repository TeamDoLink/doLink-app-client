import { createContext, useContext } from 'react';
import { ShareIntentData } from '@/src/types/shareIntent';

const ShareIntentContext = createContext<{
  shareIntent: ShareIntentData | null;
} | null>(null);

export const useShareIntent = () => {
  const context = useContext(ShareIntentContext);
  if (!context) {
    throw new Error('useShareIntent must be used within a ShareIntentProvider');
  }
  return context;
};

interface ShareIntentProviderProps {
  children: React.ReactNode;
  shareIntent: ShareIntentData | null;
}

export const ShareIntentProvider = ({
  children,
  shareIntent,
}: ShareIntentProviderProps) => {
  return (
    <ShareIntentContext.Provider value={{ shareIntent }}>
      {children}
    </ShareIntentContext.Provider>
  );
};
