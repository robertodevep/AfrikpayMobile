


import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import api from "../glpi_server/services/api"; // Import de ton instance Axios

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
      
      console.log("Tentative de requête vers:", api.defaults.baseURL + "/forgot-password");
      
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
    } catch (error:any) {
      console.error("Erreur complète:", error);
      console.error("URL de la requête:", error.config?.url);
      console.error("Méthode:", error.config?.method);
      Alert.alert("Erreur", "Problème de connexion au serveur: " + error.message);
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#3366E0",
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    backgroundColor: "#3366E0",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#3366E0",
    fontSize: 14,
    marginTop: 10,
    textDecorationLine: "underline",
  },
});

export default ForgotPasswordScreen;


/*import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

interface ForgotPasswordProps {
  navigation: {
    goBack: () => void;
  };
}

const ForgotPasswordScreen: React.FC<ForgotPasswordProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    if (!email.trim()) {
      Alert.alert("Erreur", "Veuillez entrer votre adresse e-mail");
      return;
    }

    Alert.alert(
      "Réinitialisation envoyée",
      `Un lien a été envoyé à ${email} pour réinitialiser votre mot de passe`
    );
    navigation.goBack();
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

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Réinitialiser</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Retour à la connexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#3366E0",
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    backgroundColor: "#3366E0",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#3366E0",
    fontSize: 14,
    marginTop: 10,
    textDecorationLine: "underline",
  },
});

export default ForgotPasswordScreen;*/


    /*import React from "react";

    import { TextInput, View , StyleSheet} from 'react-native';


    const ForgotPassword = () =>{

        return (<View style={styles.cont}>

            <TextInput
              placeholder = "Entrer votre adresse mail"
              style={styles.email}
            />
        </View>)
    }

    export default ForgotPassword;

    const styles = StyleSheet.create({

        email:{
            fontSize: 20,
            backgroundColor: 'black'
        },
        cont:{
            backgroundColor: "yellow",
        },
    })*/