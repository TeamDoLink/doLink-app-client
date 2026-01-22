import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
  Platform,
  Linking,
} from 'react-native';
import type { ShareIntent } from 'expo-share-intent';

const BOTTOM_SHEET_HEIGHT = 450;

interface ShareIntentModalProps {
  visible: boolean;
  shareIntent: ShareIntent | null;
  onClose: () => void;
  onConfirm: () => void;
  isShareMode?: boolean;
}

export default function ShareIntentModal({
  visible,
  shareIntent,
  onClose,
  onConfirm,
  isShareMode = false,
}: ShareIntentModalProps) {
  const translateY = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: BOTTOM_SHEET_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateY, opacity]);

  if (!shareIntent) return null;

  const { text, webUrl, meta, files } = shareIntent;
  const title = meta?.title;
  const thumbnail = meta?.thumbnail as string | undefined;
  const url = webUrl || (meta?.url as string | undefined);

  const handleOpenUrl = () => {
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.fullScreen} pointerEvents={visible ? 'auto' : 'none'}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.overlay,
            { opacity },
            isShareMode && styles.transparentOverlay,
          ]}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.bottomSheet, { transform: [{ translateY }] }]}
      >
        {/* 핸들 바 */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Text style={styles.cancelText}>취소</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>dolink에 저장</Text>
          <TouchableOpacity onPress={onConfirm} style={styles.headerButton}>
            <Text style={styles.confirmText}>저장</Text>
          </TouchableOpacity>
        </View>

        {/* 콘텐츠 */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* 링크 프리뷰 카드 */}
          {(title || url || thumbnail) && (
            <TouchableOpacity
              style={styles.previewCard}
              onPress={handleOpenUrl}
              activeOpacity={url ? 0.7 : 1}
            >
              {thumbnail && (
                <Image
                  source={{ uri: thumbnail }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              )}
              <View style={styles.previewContent}>
                {title && (
                  <Text style={styles.previewTitle} numberOfLines={2}>
                    {title}
                  </Text>
                )}
                {url && (
                  <Text style={styles.previewUrl} numberOfLines={1}>
                    {url}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}

          {/* 공유된 텍스트 (URL과 다른 경우에만 표시) */}
          {text && text !== url && (
            <View style={styles.section}>
              <Text style={styles.label}>공유된 텍스트</Text>
              <View style={styles.textContainer}>
                <Text style={styles.sharedText} numberOfLines={5} selectable>
                  {text}
                </Text>
              </View>
            </View>
          )}

          {/* 공유된 이미지들 */}
          {files && files.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.label}>이미지 ({files.length}개)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {files.map((file, index) => (
                  <Image
                    key={index}
                    source={{ uri: file.path }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  transparentOverlay: {
    backgroundColor: 'transparent',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_SHEET_HEIGHT,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DEDEDE',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 50,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  cancelText: {
    fontSize: 16,
    color: '#666666',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  // 링크 프리뷰 카드
  previewCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  thumbnail: {
    width: '100%',
    height: 160,
    backgroundColor: '#E5E5E5',
  },
  previewContent: {
    padding: 14,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 22,
    marginBottom: 4,
  },
  previewUrl: {
    fontSize: 13,
    color: '#007AFF',
  },
  // 섹션
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  textContainer: {
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 12,
  },
  sharedText: {
    fontSize: 15,
    color: '#1a1a1a',
    lineHeight: 22,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
});
