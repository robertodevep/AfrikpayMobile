
   
    import AsyncStorage from '@react-native-async-storage/async-storage';
    import React, { useEffect, useState } from 'react';
    import { Button, Text, View } from 'react-native';
        
        const HomeScreen = ({ navigation }) => {
          const [username, setUsername] = useState('');
        
          useEffect(() => {
            const loadUser = async () => {
              const name = await AsyncStorage.getItem('username');
              setUsername(name || 'Utilisateur');
            };
            loadUser();
          }, []);
        
          const handleLogout = async () => {
            await AsyncStorage.removeItem('sessionToken');
            await AsyncStorage.removeItem('username');
            navigation.replace('Login');
          };
        
          return (
            <View style={{ padding: 20 }}>
              <Text style={{ fontSize: 18 }}>Bienvenue, {username} !</Text>
              <Button title="Se déconnecter" onPress={handleLogout} />
              <Button title="Créer un ticket" onPress={() => navigation.navigate('CreateTicket')} />
              <Button title="Voir mes tickets" onPress={() => navigation.navigate('ListTickets')} />
            </View>
          );
        };
        
        export default HomeScreen;