import 'dotenv/config';

export default {
  expo: {
    name: 'Quiz App',
    slug: 'quiz-app',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    scheme: 'quiz-app',
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
        projectId: 'cf40a85b-d91b-4781-aeb8-bc5607f8028b',
      },
    },
  },
};