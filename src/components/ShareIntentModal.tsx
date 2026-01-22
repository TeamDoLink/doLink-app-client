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
} from 'react-native';
import type { ShareIntent } from 'expo-share-intent';

const BOTTOM_SHEET_HEIGHT = 400;

interface ShareIntentModalProps {
  visible: boolean;
  shareIntent: ShareIntent | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ShareIntentModal({
  visible,
  shareIntent,
  onClose,
  onConfirm,
}: ShareIntentModalProps) {
  const translateY = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // BottomSheet 올라오는 애니메이션
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
      // BottomSheet 내려가는 애니메이션
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

  const { text, files } = shareIntent;

  return (
    <View style={styles.fullScreen} pointerEvents={visible ? 'auto' : 'none'}>
      {/* 배경 오버레이 */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity }]} />
      </TouchableWithoutFeedback>

      {/* BottomSheet */}
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
          <Text style={styles.title}>dolink에 저장</Text>
          <TouchableOpacity onPress={onConfirm} style={styles.headerButton}>
            <Text style={styles.confirmText}>저장</Text>
          </TouchableOpacity>
        </View>

        {/* 콘텐츠 */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {text && (
            <View style={styles.section}>
              <Text style={styles.label}>공유된 링크</Text>
              <View style={styles.linkContainer}>
                <Text style={styles.linkText} numberOfLines={3} selectable>
                  {text}
                </Text>
              </View>
            </View>
          )}

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
  title: {
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
  linkContainer: {
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 12,
  },
  linkText: {
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
