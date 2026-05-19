import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import { supabase } from './src/services/supabase';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import LoginScreen     from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import QuizScreen      from './src/screens/QuizScreen';
import ResultScreen    from './src/screens/ResultScreen';
import ReviewScreen    from './src/screens/ReviewScreen';
import HistoryScreen   from './src/screens/HistoryScreen';
import ProfileScreen   from './src/screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab   = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#161925', borderTopColor: '#222533' },
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#4B5563',
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: '🏠 Home' }} />
      <Tab.Screen name="History"   component={HistoryScreen}   options={{ tabBarLabel: '📋 History' }} />
      <Tab.Screen name="Profile"   component={ProfileScreen}   options={{ tabBarLabel: '👤 Profile' }} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { session, loading } = useAuth();

  // Mobile deep link handler for OAuth
  useEffect(() => {
    const handle = async (url) => {
      if (!url) return;
      const frag = url.includes('#') ? url.split('#')[1] : url.split('?')[1] ?? '';
      const p = new URLSearchParams(frag);
      const access_token  = p.get('access_token');
      const refresh_token = p.get('refresh_token');
      if (access_token) {
        await supabase.auth.setSession({ access_token, refresh_token: refresh_token ?? '' });
      }
    };
    Linking.getInitialURL().then(url => { if (url) handle(url); });
    const sub = Linking.addEventListener('url', ({ url }) => handle(url));
    return () => sub.remove();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  // Single NavigationContainer — switching screens inside it avoids
  // the "two NavigationContainers" bug that breaks sign-out.
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!session ? (
          // ── Logged-out screens ──────────────────────────
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          // ── Logged-in screens ───────────────────────────
          <>
            <Stack.Screen name="Tabs"   component={AppTabs} />
            <Stack.Screen name="Quiz"   component={QuizScreen} options={{ gestureEnabled: false }} />
            <Stack.Screen name="Result" component={ResultScreen} />
            <Stack.Screen name="Review" component={ReviewScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F111A' },
});