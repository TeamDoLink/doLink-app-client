import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  FocusEvent,
  Pressable,
  GestureResponderEvent,
} from 'react-native';
import { createContext, useContext, useRef, useState } from 'react';

interface ContextType {
  isFocused: boolean;
  disabled: boolean;
  inputRef: React.RefObject<RNTextInput | null>;
  setIsFocused: (isFocused: boolean) => void;
}

const Context = createContext<ContextType>({
  isFocused: false,
  disabled: false,
  inputRef: { current: null },
  setIsFocused: () => {},
});

const useTextInput = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useTextInput must be used within a TextInputProvider');
  }
  return context;
};

type TextInputProps = {
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
};

const TextInput = ({ disabled, className, children }: TextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<RNTextInput>(null);

  const handlePress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    inputRef.current?.focus();
  };

  return (
    <Context.Provider
      value={{ isFocused, disabled: disabled ?? false, inputRef, setIsFocused }}
    >
      <Pressable onPress={handlePress}>
        <View
          className={`border-b pb-[9px] ${isFocused ? 'border-grey-800' : 'border-grey-200'} ${className}`}
        >
          {children}
        </View>
      </Pressable>
    </Context.Provider>
  );
};

const Input = ({ className, ...props }: RNTextInputProps) => {
  const { inputRef, setIsFocused } = useTextInput();

  const handleFocus = (e: FocusEvent) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  return (
    <RNTextInput
      className={`py-0 text-body-xs ${className}`}
      multiline
      placeholderClassName="text-grey-500 text-body-xs"
      ref={inputRef}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
};

export default Object.assign(TextInput, { Input });
