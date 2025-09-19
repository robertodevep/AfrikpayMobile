// screens/RegisterScreen.tsx
import PortailInscription from "@/components/PortailInscrit";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from "react-native";
 // Linking pour ouvrir les URL externe et webView pourafficher les pages web
import { WebView } from 'react-native-webview';



interface RegisterScreenProps {
  navigation: {
    goBack: () => void;
  };
}

// http://glpi.afrikpay.com/front/helpdesk.public.php
const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {  // composant avec destructuration (navigation)
 
  const glpiPortalUrl = "https://glpi.afrikpay.com/front/user.php"; //  URL GLPI

  const handleOpenPortal = () => {
    Linking.openURL(glpiPortalUrl)
      .then(() => {
        Alert.alert(
          "Inscription",
          "Veuillez créer votre compte sur le portail GLPI. Revenez ensuite à l'application pour vous connecter."
        );
      })
      .catch((err) => {
        Alert.alert("Erreur", "Impossible d'ouvrir le portail d'inscription");
        console.error(err);
      });
  };

  return (
    <View style={styles.container}>
      <View>
      <Text style={styles.title}>Créer un compte</Text>
      <Text style={styles.description}>
        Pour créer un compte, veuillez utiliser le portail public GLPI. 
        Une fois votre compte créé, revenez à cette application pour vous connecter.
      </Text>
      </View>
      
      <PortailInscription/>

       
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Retour à la connexion</Text>
      </TouchableOpacity>
    </View>
  );
};

  // https://glpi.afrikpay.com/front/user.php

// Alternative avec WebView intégrée
const RegisterWebViewScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  //const glpiPortalUrl = "http://glpi.afrikpay.com/front/helpdesk.public.php";
  const glpiPortalUrl = "https://glpi.afrikpay.com/front/user.php";

  return (
    <View style={styles.fullContainer}>
      <WebView 
        source={{ uri: glpiPortalUrl }}
        onNavigationStateChange={(navState) => {
          // Rediriger vers l'écran de connexion après inscription réussie
          if (navState.url.includes('success') || navState.title.includes('Connection')) {
            navigation.goBack();
            Alert.alert("Succès", "Compte créé avec succès. Vous pouvez maintenant vous connecter.");
          }
        }}
      />
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
  fullContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
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

export default RegisterScreen;
// export default RegisterWebViewScreen; // Décommentez pour utiliser la WebView