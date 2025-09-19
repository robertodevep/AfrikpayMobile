/*import * as React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/glpi_server/types';

// Tes écrans
import LoginScreen from '@/screens/LoginScreen';
import CreateTicketScreen from '@/screens/CreateTicketScreen';
import TicketListScreen from '@/screens/TicketListScreen';
import DashboardScreen from '@/screens/accueille';
import ForgotPassword from '@/screens/ForgotPassword';
 import ResetPasswordScreen from '@/screens/ResetPasswordScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      login: 'login',
      CreateTicket: 'create-ticket',
      TicketList: 'tickets',
      Dashboard: 'dashboard',
      ForgotPassword: 'forgot-password',
      ResetPassword: 'reset-password/:token',
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking} fallback={<Text>Chargement...</Text>}>
      <Stack.Navigator initialRouteName="login">
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="CreateTicket" component={CreateTicketScreen} />
        <Stack.Screen name="TicketList" component={TicketListScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}*/


  
  import CreateTicketScreen from '@/screens/CreateTicketScreen';
import LoginScreen from '@/screens/LoginScreen';
import TicketListScreen from '@/screens/TicketListScreen';
import DashboardScreen from '@/screens/accueille';
import ForgotPassword from '@/screens/ForgotPassword';
import RegisterScreen from '@/screens/RegisterScreen';
import React, { useState } from 'react';
import { SafeAreaView , StyleSheet} from 'react-native';

import { LogBox } from 'react-native';

  type ScreenName = 'login' | 'createTicket' | 'TicketListScreen' | 'DashboardScreen' | "ForgotPassword" | "RegisterScreen";

  interface ScreenState {
    name: ScreenName;
    params?: any;
  }

  LogBox.ignoreLogs(['Invalid prop `style` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props']);

  export default function App() {

    const [currentScreen, setCurrentScreen] = useState<ScreenState>({ 
      name: 'login',
      params: undefined
    });
    
    const [screenHistory, setScreenHistory] = useState<ScreenState[]>([{ 
      name: 'login',
      params: undefined
    }]);

    

    const navigation = {
      navigate: (screenName: ScreenName, params?: any) => {
        const newScreen = { name: screenName, params };
        setScreenHistory(prev => [...prev, newScreen]);
        setCurrentScreen(newScreen);
      },
      goBack: () => {
        if (screenHistory.length > 1) {
          const newHistory = [...screenHistory];
          newHistory.pop();
          setScreenHistory(newHistory);
          setCurrentScreen(newHistory[newHistory.length - 1]);
        }
      }
    };

    return (
      <SafeAreaView style={styles.safe}>
        {currentScreen.name === 'login' && (
          <LoginScreen navigate={(screen) => navigation.navigate(screen)} />
        )}
        
        {currentScreen.name === 'createTicket' && (
          <CreateTicketScreen 
            navigation={navigation} 
            route={{ params: currentScreen.params }} 
          />
        )}
        {currentScreen.name === 'TicketListScreen' && (
          <TicketListScreen navigation={navigation} />
        )}
        {currentScreen.name === 'DashboardScreen' && (
          <DashboardScreen navigation={navigation} />
        )}
        {currentScreen.name === 'ForgotPassword' && (
          <ForgotPassword navigation={navigation} />
        )}
        {currentScreen.name === 'RegisterScreen' && (
          <RegisterScreen navigation={navigation} />
        )}

      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    safe:{
      flex: 1,
    }
  })

  