import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

export default function DebugButton() {
  const router = useRouter();

  if (!__DEV__) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.testButton}
      onPress={() => router.push('/test')}
      activeOpacity={0.8}
    >
      <Text style={styles.testButtonText}>🧪</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  testButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  testButtonText: {
    fontSize: 28,
  },
});
