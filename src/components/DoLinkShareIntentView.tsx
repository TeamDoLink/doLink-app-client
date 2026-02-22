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

  const DEFAULT_PATH = '/share-intent';
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
          <BaseBottomSheet onClose={handleClose} expandable>
            <View className="flex-1 overflow-hidden rounded-xl bg-white px-5">
              {isError ? (
                /* 에러 UI (오프라인) */
                <View className="flex-1">
                  {/* 헤더 */}
                  <View className="flex-row items-center justify-between py-2">
                    <View className="flex-row items-center gap-2">
                      <View className="h-6 w-1 rounded-full bg-point" />
                      <Text className="text-display-2xl text-grey-900">
                        할 일 담기
                      </Text>
                    </View>
                    <TouchableOpacity className="flex-row items-center">
                      <Text className="text-body-lg text-grey-600">
                        + 모음 추가
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* 중앙 안내 */}
                  <View className="flex-1 items-center justify-center py-10">
                    <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-grey-50">
                      {/* 아이콘 대체: 말풍선 모양 */}
                      <View className="h-10 w-12 items-center justify-center rounded-2xl bg-grey-200">
                        <View className="flex-row gap-1">
                          <View className="h-1.5 w-1.5 rounded-full bg-grey-400" />
                          <View className="h-1.5 w-1.5 rounded-full bg-grey-400" />
                          <View className="h-1.5 w-1.5 rounded-full bg-grey-400" />
                        </View>
                        {/* 꼬리 부분 */}
                        <View className="absolute -bottom-1 right-2 h-3 w-3 rotate-45 bg-grey-200" />
                      </View>
                    </View>
                    <Text className="mb-2 text-heading-lg text-grey-700">
                      네트워크가 불안정합니다
                    </Text>
                    <Text className="text-body-lg text-grey-400">
                      연결을 확인 후 다시 시도해주세요
                    </Text>
                  </View>

                  {/* 푸터 버튼 */}
                  <TouchableOpacity
                    disabled
                    className="mb-4 h-14 w-full items-center justify-center rounded-2xl bg-grey-50"
                  >
                    <Text className="text-heading-md text-grey-300">담기</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                /* 정상 웹뷰 */
                <DoLinkWebView
                  source={{ uri: webViewUrl }}
                  onMessage={handleMessage}
                  onError={handleError}
                />
              )}
            </View>
          </BaseBottomSheet>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
