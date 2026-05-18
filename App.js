import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import LoginScreen     from './src/screens/LoginScreen';
import NicknameScreen  from './src/screens/NicknameScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import QuizScreen      from './src/screens/QuizScreen';
import ResultScreen    from './src/screens/ResultScreen';
import ReviewScreen    from './src/screens/ReviewScreen';
import HistoryScreen   from './src/screens/HistoryScreen';

const Stack = createStackNavigator();
const Tab   = createBottomTabNavigator();

function QuizStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Quiz"   component={QuizScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="QuizTab"   component={QuizStack} options={{ title: 'Quiz' }} />
      <Tab.Screen name="History"   component={HistoryScreen} />
    </Tab.Navigator>
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

  // No session → Login
  if (!session) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // Has session — check nickname
  // null profile OR empty nickname → NicknameScreen
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

  // Session + nickname → Main app
  return (
    <NavigationContainer>
      <AppTabs />
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