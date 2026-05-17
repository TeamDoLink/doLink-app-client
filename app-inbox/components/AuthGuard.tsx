import { performReissueFromCookies } from '@/src/bridge/handlers/authHandler';
import useAuthStore from '@/src/stores/useAuthStore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { openMainApp } from '@/src/utils/openMainApp';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, refreshToken, rehydrate } = useAuthStore();
  const [isReissuing, setIsReissuing] = useState(false);
  const [hasAttemptedReissue, setHasAttemptedReissue] = useState(false);
  const [hasRequestedMainAppOpen, setHasRequestedMainAppOpen] = useState(false);

  useEffect(() => {
    setHasAttemptedReissue(false);
    setHasRequestedMainAppOpen(false);
  }, [refreshToken]);

  useEffect(() => {
    let isCancelled = false;

    if (
      rehydrate !== 'fulfilled' ||
      isAuthenticated ||
      !refreshToken ||
      hasAttemptedReissue
    ) {
      return;
    }

    setHasAttemptedReissue(true);
    setIsReissuing(true);

    void performReissueFromCookies().finally(() => {
      if (!isCancelled) {
        setIsReissuing(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [hasAttemptedReissue, isAuthenticated, refreshToken, rehydrate]);

  useEffect(() => {
    if (rehydrate === 'pending' || isAuthenticated || isReissuing) {
      return;
    }

    if (refreshToken && !hasAttemptedReissue) {
      return;
    }

    if (!hasRequestedMainAppOpen) {
      setHasRequestedMainAppOpen(true);
      openMainApp(true);
    }
  }, [
    hasRequestedMainAppOpen,
    isAuthenticated,
    isReissuing,
    refreshToken,
    rehydrate,
  ]);

  if (rehydrate === 'pending' || isReissuing) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return isAuthenticated ? children : null;
};

export default AuthGuard;
