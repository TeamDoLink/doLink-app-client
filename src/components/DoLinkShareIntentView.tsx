import React, { useRef, useState } from 'react';
import {
  View,
  BackHandler,
  StatusBar,
  Linking,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import * as Clipboard from 'expo-clipboard';
import { BaseBottomSheet } from './common/bottomSheet/baseBottomSheet';
import type { ShareIntentData } from '../types/shareIntent';
import type {
  ShareIntentDataMessage,
  AuthStatusMessage,
} from '../bridge/types';
import { config } from '../utils/envConfig';
import DoLinkWebView from './DoLinkWebView';
import { TodoBottomSheet } from './common/bottomSheet/todoBottomSheet';

interface DoLinkShareIntentViewProps {
  shareIntent?: ShareIntentData | null;
}

export default function DoLinkShareIntentView({
  shareIntent,
}: DoLinkShareIntentViewProps) {
  const domain = config.domain;
  const [visible, setVisible] = useState(true);
  const [isError, setIsError] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const DEFAULT_PATH = '/';
  const webViewUrl = `${domain}${DEFAULT_PATH}`;

  // console.log('isError', isError);
  console.log('webViewUrl', webViewUrl);

  const handleClose = () => {
    setVisible(false);
    BackHandler.exitApp();
  };

  const handleWebViewLoad = () => {
    if (!shareIntent || !webViewRef.current) return;

    const message: ShareIntentDataMessage = {
      type: 'shareIntent:data',
      payload: {
        text: shareIntent.text,
        title: shareIntent.title,
        url: shareIntent.url,
        thumbnailUrl: shareIntent.thumbnailUrl,
        contentType: shareIntent.type,
      },
    };

    webViewRef.current.postMessage(JSON.stringify(message));
  };

  const handleError = async () => {
    console.log('handleError');
    // 데이터 유실 방지를 위해 미리 클립보드 복사
    const sharedUrl = shareIntent?.url || shareIntent?.text || '';
    if (sharedUrl) {
      await Clipboard.setStringAsync(sharedUrl);
    }
    setIsError(true);
  };

  const handleAuthFailure = async () => {
    // 1. 공유하려는 URL을 클립보드에 저장
    const sharedUrl = shareIntent?.url || shareIntent?.text || '';
    if (sharedUrl) {
      await Clipboard.setStringAsync(sharedUrl);
    }

    // 2. 딥링크로 메인 앱 연다
    Linking.openURL('dolink://');

    // 3. 종료
    handleClose();
  };

  const handleMessage = async (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'auth:status') {
        const { isAuthenticated } = (data as AuthStatusMessage).payload;

        if (isAuthenticated) {
          // 로그인 되어있다면 공유 데이터 내려줌
          handleWebViewLoad();
        } else {
          // 로그인 되어있지 않다면 리다이렉트
          await handleAuthFailure();
        }
      }
    } catch (error) {
      console.error('[DoLinkWebView] 메시지 처리 에러:', error);
    }
  };

  // if (!visible) return null;

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-transparent">
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />

        {/* 오버레이 */}
        <View
          className="absolute inset-0 bg-black/50"
          onTouchEnd={handleClose}
        />

        {/* BottomSheet */}
        <View className="absolute bottom-0 left-0 right-0 bg-transparent">
          <TodoBottomSheet
            onClickAddCollection={() => console.log('add collection')}
            onClose={handleClose}
            dismissThreshold={80}
            initialHeight={300}
            expandable={true}
          ></TodoBottomSheet>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
