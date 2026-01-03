import { Redirect, Stack, usePathname } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { ActivityIndicator, View } from 'react-native';

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  // Only redirect signed-in users from sign-in page
  // Allow access to sign-up even when signed in (for creating additional accounts)
  if (isSignedIn && pathname === '/sign-in') {
    return <Redirect href={'/'} />;
  }

  return (
    <Stack>
      <Stack.Screen
        name='sign-in'
        options={{ headerShown: false, title: 'Sign in' }}
      />
      <Stack.Screen name='sign-up' options={{ title: 'Sign up' }} />
      <Stack.Screen name='verify' options={{ title: 'Verify email' }} />
    </Stack>
  );
}
