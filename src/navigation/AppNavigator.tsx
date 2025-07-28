import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import SplashScreen from '../screens/SplashScreen'; // ✅ Add this line
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ReportDetailsScreen from '../screens/ReportDetailsScreen';
// import SchemesScreen from '../screens/SchemesScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type RootStackParamList = {
  Splash: undefined; // ✅ Add splash type
  Login: undefined;
  Home: { userName: string };
  Notifications: undefined;
  ReportDetails: { reportData?: any };
  Schemes: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [userName, setUserName] = useState<string>('');

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        {/* ✅ Splash Screen */}
        <Stack.Screen name="Splash" component={SplashScreen} />

        {/* Login Screen */}
        <Stack.Screen name="Login">
          {(props) => (
            <LoginScreen
              {...props}
              onLoginSuccess={({ userName }) => {
                setUserName(userName);
                props.navigation.replace('Home', { userName });
              }}
            />
          )}
        </Stack.Screen>

        {/* Home Screen */}
        <Stack.Screen name="Home">
          {(props) => (
            <HomeScreen
              {...props}
              userName={userName}
              onLogout={() => props.navigation.replace('Login')}
            />
          )}
        </Stack.Screen>

        {/* Other Screens */}
        <Stack.Screen name="Notifications">
          {(props) => (
            <NotificationScreen {...props} onBack={() => props.navigation.goBack()} />
          )}
        </Stack.Screen>

        <Stack.Screen name="ReportDetails">
          {(props) => (
            <ReportDetailsScreen {...props} onBack={() => props.navigation.goBack()} />
          )}
        </Stack.Screen>

        {/* <Stack.Screen name="Schemes">
          {(props) => (
            <SchemesScreen {...props} onBack={() => props.navigation.goBack()} />
          )}
        </Stack.Screen> */}

        <Stack.Screen name="Profile">
          {(props) => (
            <ProfileScreen {...props} onLogout={() => props.navigation.replace('Login')} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;