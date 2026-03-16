import useAuthStore from '@/src/stores/useAuthStore';
import { ActivityIndicator } from 'react-native';
import { openMainApp } from '@/src/utils/openMainApp';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, rehydrate } = useAuthStore();
  // 권한이 없는경우 Intent를 실행한다

  if (rehydrate === 'pending') {
    return <ActivityIndicator />;
  }

  if (rehydrate === 'fulfilled' && !isAuthenticated) {
    openMainApp(true);
    return null;
  }

  return children;
};

export default AuthGuard;
