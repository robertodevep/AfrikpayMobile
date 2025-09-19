


import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import api from "../glpi_server/services/api"; // instance Axios

interface ForgotPasswordProps {
  navigation: {
    goBack: () => void;
  };
}

const ForgotPasswordScreen: React.FC<ForgotPasswordProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Erreur", "Veuillez entrer votre adresse e-mail");
      return;
    }

    try {
      setLoading(true);

      // Appel API backend Node.js
      const response = await api.post("/forgot-password", { email });

      if (response.status === 200) {
        Alert.alert(
          "Réinitialisation envoyée",
          `Un lien de réinitialisation a été envoyé à ${email}`
        );
        navigation.goBack();
      } else {
        Alert.alert("Erreur", "Impossible d'envoyer l'email de réinitialisation");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Problème de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mot de passe oublié ?</Text>

      <TextInput
        style={styles.input}
        placeholder="Entrez votre adresse e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Réinitialiser</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Retour à la connexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", height: 45, borderWidth: 1, borderColor: "#3366E0", paddingHorizontal: 10, borderRadius: 8, marginBottom: 20 },
  button: { width: "100%", backgroundColor: "#3366E0", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginBottom: 15 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  link: { color: "#3366E0", fontSize: 14, marginTop: 10, textDecorationLine: "underline" },
});

export default ForgotPasswordScreen;




/*import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/glpi_server/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

interface ResetPasswordResponse {
  message: string;
  error?: string;
}

const ResetPasswordScreen: React.FC<Props> = ({ route, navigation }) => {
  const { token } = route.params;
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirm) {
      return Alert.alert('Erreur', 'Veuillez remplir tous les champs');
    }
    if (password !== confirm) {
      return Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
    }

    try {
      setLoading(true);
      const response = await axios.post<ResetPasswordResponse>(
        'http://glpi.afrikpay.com/reset-password',
        { token, newPassword: password }
      );

      Alert.alert('Succès', response.data.message, [
        { text: 'OK', onPress: () => navigation.navigate('login') },
      ]);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erreur', err.response?.data?.error || 'Impossible de réinitialiser');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réinitialiser votre mot de passe</Text>
      <Text style={styles.token}>Token: {token}</Text>
      <TextInput
        placeholder="Nouveau mot de passe"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Confirmer le mot de passe"
        secureTextEntry
        style={styles.input}
        value={confirm}
        onChangeText={setConfirm}
      />
      <Button title={loading ? 'En cours...' : 'Valider'} onPress={handleReset} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, marginBottom: 20, textAlign: 'center' },
  token: { fontSize: 12, color: 'gray', marginBottom: 10, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
});

export default ResetPasswordScreen;*/
