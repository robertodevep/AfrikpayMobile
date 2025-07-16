  
  import CreateTicketScreen from '@/screens/CreateTicketScreen';
import LoginScreen from '@/screens/LoginScreen';
import TicketListScreen from '@/screens/TicketListScreen';
import DashboardScreen from '@/screens/accueille';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';

  type ScreenName = 'login' | 'createTicket' | 'TicketListScreen' | 'DashboardScreen';

  interface ScreenState {
    name: ScreenName;
    params?: any;
  }

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
      <SafeAreaView style={{ flex: 1 }}>
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
      </SafeAreaView>
    );
  }

  