import { Pressable, Text, StyleSheet, PressableProps, ActivityIndicator } from 'react-native';

type CustomButtonProps = {
  text: string;
  loading?: boolean;
} & PressableProps;

export default function CustomButton({ text, loading, disabled, ...props }: CustomButtonProps) {
  return (
    <Pressable 
      {...props} 
      style={[styles.button, (disabled || loading) && styles.buttonDisabled]}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color='white' />
      ) : (
        <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>{text}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4353FD',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#CCCCCC',
  },
});
