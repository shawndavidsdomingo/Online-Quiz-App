import 'dotenv/config';

export default {
  expo: {
    name: 'Quiz App',
    slug: 'group2-online-quiz-app',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    scheme: 'quiz-app',
    updates: {
      url: 'https://u.expo.dev/e1032cad-d8d7-4b6e-86e1-e8680c544b77',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.quizapp.mobile',
    },
    android: {
      package: 'com.quizapp.mobile',
    },
    web: {
      bundler: 'metro',
    },
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      eas: {
        projectId: 'e1032cad-d8d7-4b6e-86e1-e8680c544b77',
      },
    },
  },
};