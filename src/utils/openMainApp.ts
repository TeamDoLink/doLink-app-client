import { openHostApp } from 'expo-share-extension';
import { Linking, NativeModules, Platform } from 'react-native';
import { closeShareOrExitApp } from './closeShareOrExitApp';

const { ShareActivityModule } = NativeModules;

/**
 * 메인 앱(MainActivity)을 열거나, 불가능한 경우 딥링크 + 종료 처리.
 *
 * @param isShareContext 현재 컨텍스트가 ShareActivity인지 여부
 */
export function openMainApp(isShareContext: boolean): void {
  // Android + 네이티브 모듈이 있는 경우: Intent로 MainActivity를 직접 연다.
  if (
    Platform.OS === 'android' &&
    ShareActivityModule &&
    typeof ShareActivityModule.openMainApp === 'function'
  ) {
    ShareActivityModule.openMainApp();
    return;
  }

  if (Platform.OS === 'ios' && isShareContext) {
    try {
      openHostApp('/');
      return;
    } catch {
      // noop
    }
  }

  // 그 외(iOS 또는 모듈 없음): 딥링크로 메인 앱 진입 시도 후 기존 종료 로직 사용
  Linking.openURL('dolink://').catch(() => {});

  closeShareOrExitApp(isShareContext);
}
