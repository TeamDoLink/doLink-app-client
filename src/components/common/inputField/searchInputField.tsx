import { useState, useRef } from 'react';
import { TextInput, Pressable, type TextInputProps } from 'react-native';
import SearchIcon from '@/src/assets/icons/common/search-24.svg';

interface SearchInputFieldProps
  extends Omit<TextInputProps, 'onFocus' | 'onBlur'> {
  onSearch?: (text: string) => void;
}

export const SearchInputField = ({
  value,
  onChangeText,
  onSearch,
  placeholder = '검색어를 입력해 주세요',
  ...props
}: SearchInputFieldProps) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const borderClassName = isFocused ? 'border-grey-800' : 'border-transparent';

  const handleSubmit = () => {
    if (value?.trim()) {
      onSearch?.(value);
    }
  };

  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  return (
    <Pressable
      onPress={handleContainerPress}
      className={`flex-row items-center gap-2.5 rounded-[10px] border bg-grey-50 px-4 py-2.5 ${borderClassName}`}
    >
      <SearchIcon width={24} height={24} />

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={handleSubmit}
        placeholder={placeholder}
        placeholderTextColor="#9C9FAE"
        className="flex-1 text-body-md text-grey-900"
        style={{ textAlignVertical: 'center', padding: 0 }}
        returnKeyType="search"
        {...props}
      />
    </Pressable>
  );
};

export default SearchInputField;
