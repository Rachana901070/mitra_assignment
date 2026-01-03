import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  View,
  Alert,
} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';

import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo';
import SignInWith from '../../components/SignInWith';
import { useState } from 'react';

const signUpSchema = z.object({
  email: z.string({ message: 'Email is required' }).email('Invalid email'),
  password: z
    .string({ message: 'Password is required' })
    .min(8, 'Password should be at least 8 characters long'),
});

type SignUpFields = z.infer<typeof signUpSchema>;

const mapClerkErrorToFormField = (error: any) => {
  switch (error.meta?.paramName) {
    case 'email_address':
      return 'email';
    case 'password':
      return 'password';
    default:
      return 'root';
  }
};

export default function SignUpScreen() {
  const [loading, setLoading] = useState(false);
  
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpFields>({
    resolver: zodResolver(signUpSchema),
  });

  const { signUp, isLoaded } = useSignUp();

  const onSignUp = async (data: SignUpFields) => {
    if (!isLoaded) return;
    
    setLoading(true);

    try {
      const signUpAttempt = await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      if (signUpAttempt.status === 'missing_requirements') {
        // Prepare verification if needed
        await signUp.prepareVerification({ strategy: 'email_code' });
        router.push('/verify');
      } else if (signUpAttempt.status === 'complete') {
        // Sign up complete, navigate to home
        router.replace('/');
      } else {
        // Handle other statuses
        await signUp.prepareVerification({ strategy: 'email_code' });
        router.push('/verify');
      }
    } catch (err) {
      console.log('Sign up error: ', JSON.stringify(err, null, 2));
      if (isClerkAPIResponseError(err)) {
        err.errors.forEach((error) => {
          const fieldName = mapClerkErrorToFormField(error);
          setError(fieldName, {
            message: error.longMessage,
          });
        });
      } else {
        setError('root', { message: 'An unexpected error occurred' });
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
      <Text style={styles.title}>Create an account</Text>

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
        text='Sign up' 
        onPress={handleSubmit(onSignUp)} 
        loading={loading}
      />
      
      <Link href='/sign-in' style={styles.link}>
        Already have an account? Sign in
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
