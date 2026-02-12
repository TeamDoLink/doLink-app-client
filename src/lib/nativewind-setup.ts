import { cssInterop } from 'nativewind';
import { Image, Pressable } from 'react-native';

// React Native 컴포넌트에 className 지원 추가
cssInterop(Image, { className: 'style' });
cssInterop(Pressable, { className: 'style' });
