import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';

import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo';

const verificationSchema = z.object({
  code: z.string({ message: 'Code is required' }).min(6, 'Code should be 6 digits'),
});

type VerificationFields = z.infer<typeof verificationSchema>;

export default function VerifyScreen() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<VerificationFields>({
    resolver: zodResolver(verificationSchema),
  });

  const { signUp, isLoaded } = useSignUp();

  const onPress = async (data: VerificationFields) => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: data.code,
      });

      if (signUpAttempt.status === 'complete') {
        await signUp.reload();
        router.replace('/');
      } else {
        setError('root', { message: 'Verification failed' });
      }
    } catch (err) {
      console.log('Verification error: ', err);
      if (isClerkAPIResponseError(err)) {
        err.errors.forEach((error) => {
          const fieldName = mapClerkErrorToFormField(error);
          setError(fieldName, {
            message: error.longMessage,
          });
        });
      } else {
        setError('root', { message: 'Unknown error' });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Verify your email</Text>
      <Text style={styles.subtitle}>We've sent a code to your email</Text>

      <View style={styles.form}>
        <CustomInput
          control={control}
          name='code'
          placeholder='Enter verification code'
          autoFocus
          keyboardType='number-pad'
          maxLength={6}
        />
        {errors.root && (
          <Text style={{ color: 'crimson' }}>{errors.root.message}</Text>
        )}
      </View>

      <CustomButton text='Verify' onPress={handleSubmit(onPress)} />
    </KeyboardAvoidingView>
  );
}

const mapClerkErrorToFormField = (error: any) => {
  switch (error.meta?.paramName) {
    case 'code':
      return 'code';
    default:
      return 'root';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
  },
  form: {
    gap: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

