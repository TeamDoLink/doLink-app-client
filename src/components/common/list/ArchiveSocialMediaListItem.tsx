import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ArchiveSocialMediaListItemProps {
  title: string;
  category: string;
  itemCount: number;
  thumbnail?: string;
  isSelected?: boolean;
  onPress?: () => void;
  showDivider?: boolean;
  highlightText?: string;
}

export default function ArchiveSocialMediaListItem({
  title,
  category,
  itemCount,
  thumbnail,
  isSelected = false,
  onPress,
  showDivider = true,
  highlightText,
}: ArchiveSocialMediaListItemProps) {
  return (
    <Pressable onPress={onPress} className="w-full">
      <View
        className={`w-full flex-col items-center ${
          isSelected ? 'bg-grey-50 py-3' : 'pt-3'
        }`}
      >
        {/* Info */}
        <View className="w-full flex-row items-center gap-4 px-5">
          {/* Thumbnail */}
          <View className="h-[44px] w-[44px] overflow-hidden rounded-[10px]">
            {thumbnail ? (
              <View className="h-full w-full">
                <Image
                  source={{ uri: thumbnail }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
                <View className="absolute inset-0 bg-black/20" />
              </View>
            ) : (
              <View className="h-full w-full bg-grey-200" />
            )}
          </View>

          {/* Text */}
          <View className="flex-1 flex-col justify-center gap-[4px]">
            {/* Title Row */}
            <View className="flex-row items-start gap-[16px]">
              {/* Title */}
              <View className="flex-1 py-[2px]">
                <Text
                  className="text-[14px] font-semibold leading-[20px] text-grey-900"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {isSelected &&
                  highlightText &&
                  title.startsWith(highlightText) ? (
                    <>
                      <Text className="text-point">{highlightText}</Text>
                      {title.substring(highlightText.length)}
                    </>
                  ) : (
                    title
                  )}
                </Text>
              </View>

              {/* Checkbox */}
              <View className="h-[24px] w-[24px] items-center justify-center overflow-hidden rounded-full">
                {isSelected ? (
                  <View className="h-full w-full items-center justify-center bg-point">
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  </View>
                ) : (
                  <View className="h-full w-full rounded-full border-2 border-grey-300" />
                )}
              </View>
            </View>

            {/* Explanation */}
            <View className="flex-row items-center gap-[4px]">
              <Text className="text-[12px] font-medium leading-[18px] text-grey-500">
                {category}
              </Text>
              <Text className="text-[12px] font-medium leading-[18px] text-grey-500">
                ·
              </Text>
              <Text className="text-[12px] font-medium leading-[18px] text-grey-500">
                할 일 {itemCount}개
              </Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        {showDivider && !isSelected && (
          <View className="mt-3 w-full px-5">
            <View className="h-px w-full bg-grey-100" />
          </View>
        )}
      </View>
    </Pressable>
  );
}
