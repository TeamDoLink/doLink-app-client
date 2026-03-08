import { BackHandler, NativeModules, Platform } from 'react-native';

const { ShareActivityModule } = NativeModules;

/**
 * 공유 컨텍스트(ShareActivity)면 해당 Activity만 finish,
 * 아니면 앱 전체 종료(BackHandler.exitApp).
 */
export function closeShareOrExitApp(isShareContext: boolean): void {
  if (Platform.OS === 'android' && isShareContext && ShareActivityModule) {
    console.log('finishShareActivity');
    ShareActivityModule.finishShareActivity();
  } else {
    console.log('exitApp');
    BackHandler.exitApp();
  }
}
