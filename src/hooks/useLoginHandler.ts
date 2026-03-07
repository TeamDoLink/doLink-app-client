import type WebView from 'react-native-webview';
import { useRef, useCallback } from 'react';
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import { performReissueFromCookies } from '@/src/bridge/handlers/authHandler';
import { sendAuthLoginToWeb } from '@/src/bridge/sender';
import useAuthStore from '@/src/stores/useAuthStore';
import { config } from '@/src/utils/envConfig';

const APP_DOMAIN = 'app.dolink.team';

function getPathname(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return '/';
  }
}

function isRootUrl(url: string): boolean {
  const onDomain = url.includes(config.domain) || url.includes(APP_DOMAIN);
  return onDomain && getPathname(url) === '/';
}

/**
 * 루트 페이지 진입 시 useAuthStore의 access token을 auth:login으로 웹에 전달한다.
 * token이 없으면 reissue 후 결과를 전달한다.
 */
function sendAuthOnRootEntry(
  webViewRef: React.RefObject<WebView | null>,
): void {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    sendAuthLoginToWeb(webViewRef, accessToken);
    return;
  }
  performReissueFromCookies().then((token) => {
    if (token) {
      sendAuthLoginToWeb(webViewRef, token);
    }
  });
}

/**
 * 앱 루트(/) 진입 시 useAuthStore의 access token을 auth:login으로 웹에 전달한다.
 * token이 없으면 reissue 후 전달한다.
 */
export default function useLoginHandler(
  webViewRef: React.RefObject<WebView | null>,
) {
  const sentOnRootRef = useRef(false);

  const onLoginNavigation = useCallback(
    (event: WebViewNavigation) => {
      const url = event.url ?? '';

      if (isRootUrl(url)) {
        if (!sentOnRootRef.current) {
          sentOnRootRef.current = true;
          sendAuthOnRootEntry(webViewRef);
        }
      } else {
        sentOnRootRef.current = false;
      }
    },
    [webViewRef],
  );

  return { onLoginNavigation };
}
