import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { Link } from 'expo-router';
import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
import SignInWith from '../../components/SignInWith';

const signInSchema = z.object({
  email: z.string({ message: 'Email is required' }).email('Invalid email'),
  password: z
    .string({ message: 'Password is required' })
    .min(8, 'Password should be at least 8 characters long'),
});

type SignInFields = z.infer<typeof signInSchema>;

const mapClerkErrorToFormField = (error: any) => {
  switch (error.meta?.paramName) {
    case 'identifier':
      return 'email';
    case 'password':
      return 'password';
    default:
      return 'root';
  }
};

export default function SignInScreen() {
  const [loading, setLoading] = useState(false);
  
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInFields>({
    resolver: zodResolver(signInSchema),
  });

  const { signIn, isLoaded, setActive } = useSignIn();

  const onSignIn = async (data: SignInFields) => {
    if (!isLoaded) return;

    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        console.log('Sign in status: ', signInAttempt.status);
        setError('root', { message: 'Sign in could not be completed' });
      }
    } catch (err) {
      console.log('Sign in error: ', JSON.stringify(err, null, 2));

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Sign in</Text>

      <View style={styles.form}>
        <CustomInput
          control={control}
          name='email'
          placeholder='Email'
          autoFocus
          autoCapitalize='none'
          keyboardType='email-address'
          autoComplete='email'
        />

        <CustomInput
          control={control}
          name='password'
          placeholder='Password'
          secureTextEntry
        />

        {errors.root && (
          <Text style={{ color: 'crimson' }}>{errors.root.message}</Text>
        )}
      </View>

      <CustomButton 
        text='Sign in' 
        onPress={handleSubmit(onSignIn)} 
        loading={loading}
      />

      <Link href='/sign-up' style={styles.link}>
        Don't have an account? Sign up
      </Link>

      <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: 'auto' }}>
        <SignInWith strategy='oauth_google' />
        <SignInWith strategy='oauth_facebook' />
        <SignInWith strategy='oauth_apple' />
      </View>
    </KeyboardAvoidingView>
  );
}

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
  link: {
    color: '#4353FD',
    fontWeight: '600',
    textAlign: 'center',
  },
});
