import { TouchableOpacity, Text } from 'react-native';
import type { TouchableOpacityProps } from 'react-native';
import type { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';

type ButtonProps = TouchableOpacityProps & PropsWithChildren;

const ButtonContext = createContext<ButtonProps>({
  disabled: false,
});

const useButtonContext = () => {
  const context = useContext(ButtonContext);
  if (!context) {
    throw new Error('useButtonContext must be used within a ButtonProvider');
  }
  return context;
};

const Button = ({ children, disabled, ...props }: ButtonProps) => {
  return (
    <ButtonContext.Provider value={{ disabled }}>
      <TouchableOpacity
        className={`items-center justify-center rounded-[12px] py-[14px] ${
          disabled ? 'bg-grey-50' : 'bg-point'
        }`}
        disabled={disabled}
        activeOpacity={0.8}
        {...props}
      >
        {children}
      </TouchableOpacity>
    </ButtonContext.Provider>
  );
};

interface ButtonTextProps extends PropsWithChildren {}

const ButtonText = ({ children }: ButtonTextProps) => {
  const { disabled: buttonDisabled } = useButtonContext();
  return (
    <Text
      className={`text-center text-body-xl ${
        buttonDisabled ? 'text-grey-400' : 'text-white'
      }`}
    >
      {children}
    </Text>
  );
};

export default Object.assign(Button, {
  Text: ButtonText,
});
