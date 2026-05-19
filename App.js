import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import LoginScreen    from './src/screens/LoginScreen';
import NicknameScreen from './src/screens/NicknameScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import QuizScreen     from './src/screens/QuizScreen';
import ResultScreen   from './src/screens/ResultScreen';
import ReviewScreen   from './src/screens/ReviewScreen';
import HistoryScreen  from './src/screens/HistoryScreen';

const Stack = createStackNavigator();
const Tab   = createBottomTabNavigator();

// ─── Tab screens only: Dashboard + History ──────────────────
// Quiz, Result, Review are pushed on top via Stack — no tab access
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
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Home', tabBarIcon: () => null }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ tabBarLabel: 'History', tabBarIcon: () => null }}
      />
    </Tab.Navigator>
  );
}

// ─── Main app stack: tabs + quiz flow on top ─────────────────
// Quiz screens are pushed over the tabs — tab bar disappears
// during quiz, result, and review. User can only reach Quiz via
// Dashboard "Start Quiz" button.
function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Tabs sit at the bottom of the stack */}
      <Stack.Screen name="Tabs" component={AppTabs} />

      {/* Quiz flow — pushed on top, hides tab bar completely */}
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{ gestureEnabled: false }} // disable swipe-back during quiz
      />
      <Stack.Screen name="Result"   component={ResultScreen} />
      <Stack.Screen name="Review"   component={ReviewScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (!session) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  const hasNickname = profile?.nickname && profile.nickname.trim() !== '';
  if (!hasNickname) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Nickname" component={NicknameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <AppStack />
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F111A',
  },
});