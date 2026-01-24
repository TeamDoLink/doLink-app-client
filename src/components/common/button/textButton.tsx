import type { PropsWithChildren } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import type { TouchableOpacityProps } from 'react-native';

type TextButtonProps = TouchableOpacityProps & PropsWithChildren;

/**
 * 텍스트 형태의 버튼 컴포넌트
 */
export const TextButton = ({
  children,
  disabled,
  className = '',
  ...props
}: TextButtonProps) => {
  /** 텍스트 버튼은 disabled 상태일 때 텍스트 색상만 변경됨 */
  return (
    <TouchableOpacity
      disabled={disabled}
      className={`p-2 ${className}`}
      {...props}
    >
      <Text
        className={`text-body-lg ${disabled ? 'text-grey-400' : 'text-point'}`}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};
