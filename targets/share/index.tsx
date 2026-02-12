import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { close, type InitialProps } from 'expo-share-extension';

interface ShareExtensionScreenProps {
  initialProps?: InitialProps;
}

export default function ShareExtensionScreen({
  initialProps,
}: ShareExtensionScreenProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSave = useCallback(async () => {
    if (!initialProps) return;

    setIsProcessing(true);

    try {
      // TODO: Step 2에서 공유 데이터를 저장하는 로직 구현
      console.log('[ShareExtension] 공유 데이터:', initialProps);

      // 처리 완료 후 Extension 닫기
      close();
    } catch (error) {
      console.error('[ShareExtension] 저장 실패:', error);
      setIsProcessing(false);
    }
  }, [initialProps]);

  const handleCancel = useCallback(() => {
    close();
  }, []);

  // 공유 데이터에서 URL 또는 텍스트 추출
  const getSharedContent = (data: InitialProps | undefined): string => {
    if (!data) return '';

    // URL이 있으면 URL 반환
    if (data.url) return data.url;

    // 텍스트가 있으면 텍스트 반환
    if (data.text) return data.text;

    return '';
  };

  const sharedContent = getSharedContent(initialProps);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={styles.cancelText}>취소</Text>
        </TouchableOpacity>
        <Text style={styles.title}>doLink에 저장</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveButton, isProcessing && styles.saveButtonDisabled]}
          disabled={isProcessing || !sharedContent}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Text style={styles.saveText}>저장</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {sharedContent ? (
          <View style={styles.previewContainer}>
            <Text style={styles.label}>공유된 링크</Text>
            <Text style={styles.url} numberOfLines={3} ellipsizeMode="middle">
              {sharedContent}
            </Text>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>공유된 내용이 없습니다</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  cancelButton: {
    padding: 4,
  },
  cancelText: {
    fontSize: 16,
    color: '#666666',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  saveButton: {
    padding: 4,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  previewContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
  },
  url: {
    fontSize: 15,
    color: '#000000',
    lineHeight: 22,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#999999',
  },
});
