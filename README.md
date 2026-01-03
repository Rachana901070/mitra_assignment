# Mitra Assignment - React Native Authentication App

A production-ready authentication app built with Expo Router, Clerk, and React Native. Supports email/password login and OAuth (Google, Facebook, Apple) for both iOS and web platforms.

## Features

- 🔐 **Secure Authentication** - Powered by Clerk with session management
- 📧 **Email/Password Login** - Form validation with Zod
- 🌐 **Social OAuth** - Google, Facebook, and Apple sign-in
- 📱 **Cross-Platform** - Works on iOS, Android, and Web
- 🎨 **Modern UI** - Clean, responsive design with React Native
- 🔄 **Protected Routes** - Automatic redirect for unauthenticated users

## Tech Stack

- **Framework**: Expo SDK 52 with Expo Router
- **Auth**: Clerk (React Native SDK)
- **Forms**: React Hook Form + Zod validation
- **Language**: TypeScript
- **Platforms**: iOS, Android, Web

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go (for mobile testing)
- Clerk account (for authentication)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Rachana901070/mitra_assignment.git
cd mitra_assignment
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with your Clerk credentials:
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

4. Start the development server:
```bash
npm start
```

### Running on Different Platforms

```bash
# Web
npm run web

# iOS Simulator
npm run ios

# Android
npm run android
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Authentication screens
│   │   ├── sign-in.tsx   # Email/password sign in
│   │   ├── sign-up.tsx   # Email/password sign up
│   │   └── verify.tsx    # Email verification
│   ├── (protected)/      # Protected routes (auth required)
│   │   └── index.tsx     # Main app screen after login
│   ├── _layout.tsx       # Root layout with Clerk provider
│   └── index.tsx         # Public landing page
├── components/
│   ├── CustomButton.tsx  # Reusable button component
│   ├── CustomInput.tsx   # Reusable input with validation
│   └── SignInWith.tsx    # Social OAuth buttons
├── providers/            # React context providers
└── types/                # TypeScript type definitions
```

## Authentication Flow

### Email/Password Sign In
1. User enters email and password
2. Validation with Zod schema
3. Clerk sign-in attempt
4. On success → redirect to protected home
5. On error → display validation errors

### Social OAuth (Google, Facebook, Apple)
1. User clicks OAuth button
2. Platform-specific auth flow (native or web redirect)
3. Clerk handles OAuth callback
4. On success → redirect to protected home

### Route Protection
- Unauthenticated users accessing `/` → redirected to `/sign-in`
- Authenticated users accessing `/sign-in` → redirected to home
- Protected routes require valid session

## Environment Variables

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable API key |

## Key Files

- **`src/app/(auth)/_layout.tsx`** - Auth route group with signed-in user handling
- **`src/app/(protected)/_layout.tsx`** - Protected route with auth check
- **`src/components/SignInWith.tsx`** - Social OAuth implementation with platform checks
- **`src/app/_layout.tsx`** - Root layout wrapping Clerk provider

## Dependencies

| Package | Purpose |
|---------|---------|
| `@clerk/clerk-expo` | Authentication |
| `expo-router` | Navigation |
| `react-hook-form` | Form management |
| `zod` | Validation |
| `expo-auth-session` | OAuth redirect handling |

## Troubleshooting

### WebBrowser errors on web
The app handles `WebBrowser` methods with platform checks:
- `warmUpAsync()`/`coolDownAsync()` only run on native
- `maybeCompleteAuthSession()` only runs on web

### Auth redirect issues
Ensure your Clerk OAuth redirect URIs are configured:
- Web: `http://localhost:8085`
- iOS: `yourapp://oauthredirect`
- Android: `yourapp://oauthredirect`

## License

MIT

