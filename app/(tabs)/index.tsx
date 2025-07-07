  

 /*import CreateTicketScreen from '@/screens/CreateTicketScreen';
import LoginScreen from '@/screens/LoginScreen';
import TicketListScreen from '@/screens/TicketListScreen';
import DashboardScreen from '@/screens/accueille';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';

  
  export default function App() {
    const [screen, setScreen] = useState<'login' | 'createTicket' | 'TicketListScreen' | 'DashboardScreen'>('login');
  
    const navigation = {
      navigate: (screenName: 'login' | 'createTicket' | 'TicketListScreen' | 'DashboardScreen') => setScreen(screenName),
    };
  
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {screen === 'login' && <LoginScreen navigate={(screen) => setScreen(screen)} />}
        {screen === 'createTicket' && <CreateTicketScreen navigation={navigation} />}
        {screen === 'TicketListScreen' && <TicketListScreen navigation={navigation} />} 
        {screen === 'DashboardScreen' && <DashboardScreen navigation={navigation} />} 
        
      </SafeAreaView>
    );
  }*/


  import CreateTicketScreen from '@/screens/CreateTicketScreen';
  import LoginScreen from '@/screens/LoginScreen';
  import TicketListScreen from '@/screens/TicketListScreen';
  import DashboardScreen from '@/screens/accueille';
  import React, { useState } from 'react';
  import { SafeAreaView } from 'react-native';

    export default function App() {
      const [screen, setScreen] = useState<'login' | 'createTicket' | 'TicketListScreen' | 'DashboardScreen'>('login'); // stocke les ecran actuel par defaut login
      const [screenHistory, setScreenHistory] = useState<string[]>(['login']); // une liste qui garde eb memoire l'historique de navigation par defaut login
    
      const navigation = {
        navigate: (screenName: 'login' | 'createTicket' | 'TicketListScreen' | 'DashboardScreen') => {
          setScreenHistory(prev => [...prev, screenName]);
          setScreen(screenName);
        },
        goBack: () => {
          if (screenHistory.length > 1) {
            const newHistory = [...screenHistory];
            newHistory.pop(); // Retire le dernier écran
            setScreenHistory(newHistory);
            setScreen(newHistory[newHistory.length - 1] as any);
          }
        }
      };
    
      return (
        <SafeAreaView style={{ flex: 1 }}>
          {screen === 'login' && <LoginScreen navigate={(screen) => navigation.navigate(screen)} />}
          {screen === 'createTicket' && <CreateTicketScreen navigation={navigation} />}
          {screen === 'TicketListScreen' && <TicketListScreen navigation={navigation} />} 
          {screen === 'DashboardScreen' && <DashboardScreen navigation={navigation} />} 
        </SafeAreaView>
      );
    }


  /*import CreateTicketScreen from '@/screens/CreateTicketScreen';
import LoginScreen from '@/screens/LoginScreen';
import TicketListScreen from '@/screens/TicketListScreen';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';

  
  export default function App() {
    const [screen, setScreen] = useState<'login' | 'createTicket' | 'TicketListScreen'>('login');
  
    const navigation = {
      navigate: (screenName: 'login' | 'createTicket' | 'TicketListScreen') => setScreen(screenName),
    };
  
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {screen === 'login' && <LoginScreen navigate={(screen) => setScreen(screen)} />}
        {screen === 'createTicket' && <CreateTicketScreen navigation={navigation} />}
        {screen === 'TicketListScreen' && <TicketListScreen navigation={navigation} />} 
        
        
      </SafeAreaView>
    );
  }*/
  
   //DashboardScreen
   /*import CreateTicketScreen from '@/screens/CreateTicketScreen';
import LoginScreen from '@/screens/LoginScreen';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
    
    export default function App() {
      const [screen, setScreen] = useState<'login' | 'createTicket' | 'TicketListScreen'>('login');
    
      const navigation = {
        navigate: (screenName: 'login' | 'createTicket' | 'TicketListScreen') => setScreen(screenName),
      };
    
      return (
        <SafeAreaView style={{ flex: 1 }}>
          {screen === 'login' ? (
            <LoginScreen navigate={(screen) => setScreen(screen)} />
          ) : (
            <CreateTicketScreen navigation={navigation} />
          )}
        </SafeAreaView>
      );
    }*/
    
  /*import CreateTicketScreen from "@/screens/CreateTicketScreen";
import LoginScreen from "@/screens/LoginScreen";
import React, { useState } from "react";
import { SafeAreaView } from "react-native";

  export default function App() {
    const [screen, setScreen] = useState("login");

    return (
      <SafeAreaView style={{ flex: 1 }}>
        {screen === "login" ? (
          <LoginScreen navigate={setScreen} />
        ) : (
          <CreateTicketScreen />
        )}
      </SafeAreaView>
    );
  }*/


/*
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import LoginScreen from '@/screens/LoginScreen';
import CreateTicketScreen from '@/screens/CreateTicketScreen';

export default function App() {
  const [screen, setScreen] = useState<'login' | 'createTicket'>('login');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {screen === 'login' ? (
        <LoginScreen navigate={setScreen} />
      ) : (
        <CreateTicketScreen />
      )}
    </SafeAreaView>
  );
}
*/



 
  
 /*se qui fonctionne
import CreateTicketScreen from "@/screens/CreateTicketScreen";
import LoginScreen from "@/screens/LoginScreen";
import React from "react";
import { SafeAreaView } from "react-native";
 
 export default function App() {
   return (
     <SafeAreaView style={{ flex: 1 }}>
       <LoginScreen/>
     </SafeAreaView>
   );
 } */


   
   /*import CreateTicketScreen from '@/screens/CreateTicketScreen';
   import ListTicketsScreen from '@/screens/TicketListScreen';
   
   import React from 'react';
   import { NavigationContainer } from '@react-navigation/native';
   import { createNativeStackNavigator } from '@react-navigation/native-stack';
   
   import LoginScreen from '@/screens/LoginScreen';
   import HomeScreen from '@/screens/HomeScreen';
   
   const Stack = createNativeStackNavigator();
   
   const App = () => {
     return (
       <NavigationContainer>
         <Stack.Navigator initialRouteName="Login">
           <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Connexion' }} />
           <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
           <Stack.Screen name="CreateTicket" component={CreateTicketScreen} options={{ title: 'Nouveau Ticket' }} />
           <Stack.Screen name="ListTickets" component={ListTicketsScreen} options={{ title: 'Mes Tickets' }} />
         </Stack.Navigator>
       </NavigationContainer>
     );
   };
   
   export default App;*/