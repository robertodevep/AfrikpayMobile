/*import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

const Plainte = () => {
  const [message, setMessage] = useState<string>('');

  const envoyerPlainte = () => {
    if (message.trim() === '') {
      Alert.alert('Erreur', 'Veuillez écrire votre plainte.');
      return;
    }

    Alert.alert('Succès', 'Votre plainte a été envoyée avec succès.');
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formulaire de Plainte</Text>
      <TextInput
        style={styles.input}
        placeholder="Décrivez votre problème..."
        multiline
        numberOfLines={6}
        value={message}
        onChangeText={setMessage}
      />
      <TouchableOpacity style={styles.button} onPress={envoyerPlainte}>
        <Text style={styles.buttonText}>Envoyer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Plainte;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: '#F9F9F9',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});*/


/*
🔧 1. Backend Node.js — Authentification GLPI personnalisée
🔹 glpiService.js — ajoute une fonction loginWithCredentials

// glpi_server/services/glpiService.js
const axios = require('axios');
const { baseUrl, AppToken } = require('../config/glpiConfig');

async function loginWithCredentials(username, password) {
  try {
    const res = await axios.post(
      `${baseUrl}/initSession`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'App-Token': AppToken,
          Authorization: `user_token ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        },
      }
    );

    return {
      sessionToken: res.data.session_token,
      user: res.data.user, // contient le nom d'utilisateur
    };
  } catch (error) {
    throw new Error(error.response?.data || error.message);
  }
}

module.exports = {
  loginWithCredentials,
  createTicket,
  getAllTickets,
};

🔹 ticketController.js — ajoute le contrôleur de login

// glpi_server/controllers/ticketController.js
const { loginWithCredentials } = require('../services/glpiService');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const { sessionToken, user } = await loginWithCredentials(username, password);
    res.status(200).json({ sessionToken, username: user_name || username });
  } catch (err) {
    res.status(401).json({ error: 'Authentification échouée' });
  }
};

🔹 ticketRoutes.js — ajoute une route /login

// glpi_server/routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const ticketCtrl = require('../controllers/ticketController');

router.post('/login', ticketCtrl.login);
router.post('/tickets', ticketCtrl.create);
router.get('/tickets', ticketCtrl.getAll);

module.exports = router;

📱 2. React Native — Interface de connexion
🔹 LoginScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import api from '../glpi_server/services/api';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await api.post('/login', { username, password });
      setLoggedInUser(response.data.username);
    } catch (error) {
      Alert.alert('Erreur', 'Nom d’utilisateur ou mot de passe incorrect');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {loggedInUser ? (
        <Text>Bienvenue, {loggedInUser} !</Text>
      ) : (
        <>
          <TextInput
            placeholder="Nom d'utilisateur"
            value={username}
            onChangeText={setUsername}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <TextInput
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <Button title="Se connecter" onPress={handleLogin} />
        </>
      )}
    </View>
  );
};

export default LoginScreen;

✅ Résultat attendu

    L'utilisateur entre son nom d'utilisateur et mot de passe.

    L'API backend envoie la requête à GLPI via /initSession.

    Si succès :

        Le token de session est renvoyé.

        Le nom d’utilisateur s’affiche à l’écran.

    Si échec :

        Une alerte affiche une erreur d’authentification.

Souhaites-tu aussi :

    Stocker le token côté React Native pour réutilisation ?

    Naviguer vers un autre écran après la connexion ?

    Ajouter un logout ?

Vous avez dit :
oui
ChatGPT a dit :

Parfait ! Voici la suite pour rendre ton application React Native plus complète :
✅ Objectifs :

    Stocker le token de session pour le réutiliser dans d’autres appels API.

    Naviguer vers un écran d’accueil après la connexion.

    Ajouter une fonctionnalité de déconnexion.

📦 1. Installer les dépendances nécessaires

Si tu ne l’as pas déjà fait, installe @react-navigation et @react-native-async-storage/async-storage :

npm install @react-navigation/native @react-navigation/native-stack
npm install @react-native-async-storage/async-storage
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler

📁 2. Structure de base

Créer les fichiers suivants :

/screens
  ├── LoginScreen.js
  └── HomeScreen.js
App.js

🔐 3. Stocker et récupérer le token avec AsyncStorage
🔹 LoginScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../glpi_server/services/api';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/login', { username, password });
      const { sessionToken, username: name } = response.data;

      await AsyncStorage.setItem('sessionToken', sessionToken);
      await AsyncStorage.setItem('username', name);

      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Erreur', 'Nom d’utilisateur ou mot de passe incorrect');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title="Se connecter" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;

🔹 HomeScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    </View>
  );
};

export default HomeScreen;

🔹 App.js — Navigation entre les écrans

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Connexion' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

🧪 Résultat final :

    ✅ L’utilisateur se connecte.

    ✅ Le token de session et son nom sont stockés localement.

    ✅ Il est redirigé vers l’écran d’accueil.

    ✅ Il peut se déconnecter à tout moment.

Souhaites-tu maintenant utiliser le sessionToken stocké pour créer des tickets ou récupérer les siens depuis GLPI ?
Vous avez dit :
oui
ChatGPT a dit :

Parfait ! Maintenant que l’utilisateur est connecté et que son sessionToken est stocké, on peut l’utiliser pour :

    Créer un ticket depuis l’app mobile.

    Lister les tickets qu’il a créés.

🎯 Objectif

Créer deux fonctionnalités supplémentaires dans ton app mobile React Native :

    ✅ Création de ticket.

    ✅ Récupération des tickets depuis GLPI via ton backend Node.js.

📱 Côté mobile (React Native)
🔹 1. Ajouter un écran pour créer un ticket

📄 screens/CreateTicketScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import api from '../glpi_server/services/api';

const CreateTicketScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  const handleCreate = async () => {
    try {
      const response = await api.post('/tickets', {
        name,
        content
      });

      Alert.alert('Succès', 'Ticket créé avec succès !');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', "Impossible de créer le ticket");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Titre du ticket :</Text>
      <TextInput value={name} onChangeText={setName} style={{ borderBottomWidth: 1 }} />

      <Text>Description :</Text>
      <TextInput value={content} onChangeText={setContent} multiline style={{ borderWidth: 1, height: 100, marginBottom: 10 }} />

      <Button title="Créer le ticket" onPress={handleCreate} />
    </View>
  );
};

export default CreateTicketScreen;

🔹 2. Ajouter un écran pour lister les tickets

📄 screens/ListTicketsScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import api from '../glpi_server/services/api';

const ListTicketsScreen = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get('/tickets');
        setTickets(res.data);
      } catch (err) {
        console.error('Erreur récupération tickets :', err);
      }
    };
    fetchTickets();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Liste des Tickets :</Text>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
            <Text>{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ListTicketsScreen;

🔁 Navigation mise à jour (App.js)

Ajoute les deux nouveaux écrans dans ton App.js :

import CreateTicketScreen from './screens/CreateTicketScreen';
import ListTicketsScreen from './screens/ListTicketsScreen';

<Stack.Screen name="CreateTicket" component={CreateTicketScreen} options={{ title: 'Nouveau Ticket' }} />
<Stack.Screen name="ListTickets" component={ListTicketsScreen} options={{ title: 'Mes Tickets' }} />

Et dans HomeScreen, ajoute deux boutons pour y accéder :

<Button title="Créer un ticket" onPress={() => navigation.navigate('CreateTicket')} />
<Button title="Voir mes tickets" onPress={() => navigation.navigate('ListTickets')} />

🔧 Côté backend (Node.js)

Tu l’as déjà bien fait dans ticketController.js, avec :

exports.create = async (req, res) => { ... }
exports.getAll = async (req, res) => { ... }

Et dans ticketRoutes.js :

router.post('/tickets', ticketCtrl.create);
router.get('/tickets', ticketCtrl.getAll);

💡 Tu peux améliorer la route /tickets pour filtrer les tickets de l'utilisateur s’il est identifié.
✅ Résultat

Tu peux maintenant :

    Créer un ticket depuis l’application mobile.

    Afficher les tickets existants.

    Utiliser les endpoints de ton backend Node.js connecté à GLPI.

Souhaites-tu que je t’aide à filtrer les tickets par utilisateur connecté ou à mettre à jour les tickets existants ? */

