
    module.exports = {
        baseUrl: "http://localhost/glpi/apirest.php", // l'ApI de base de glpi
        AppToken: "QPkSMqodMxbHni9fMgrnjowVPwEQDe7PeUhTVMtu", // jeton d'application pour l'authentification
        //userToken: "ODvz4ya3vCisDMjQHQgUCRnnQ3RbljBODOrtWU9R" // le jeton d'utilisateur pour l'authentification

    }


    /*

    import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../glpi_server/services/api";

type ScreenName = "login" | "createTicket";

interface LoginScreenProps {
  navigate: (screenName: ScreenName) => void;
}

interface LoginResponse {
  sessionToken?: string;
  error?: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigate }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false)

  const handleLogin = async () => {
    if (!login.trim() || !password.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post<LoginResponse>("/login", { login, password });

      if (!response.data.sessionToken) throw new Error("Token de session non reçu");

      await AsyncStorage.setItem("session_token", response.data.sessionToken);
      await AsyncStorage.setItem("username", login);
      navigate("createTicket");
    } catch (error: unknown) {
      let errorMessage = "Échec de l'authentification";
      if (typeof error === "object" && error !== null) {
        if ("isAxiosError" in error && error.isAxiosError) {
          const axiosError = error as any;
          errorMessage = axiosError.response?.data?.error || "Erreur réseau";
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
      }
      Alert.alert("Erreur", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.inner}>
        <Image
          source={require("../assets/images/logoAfrikPay.jpeg")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Connexion</Text>

        <TextInput
          placeholder="Entrez votre username"
          value={login}
          onChangeText={setLogin}
          style={styles.input}
          autoCapitalize="none"
        />

        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Entrez votre mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.inputPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
           <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={styles.forgot}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Connexion</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inner: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 45,
    borderBottomWidth: 1.5,
    borderBottomColor: "#0042DA",
    marginBottom: 25,
    fontSize: 14,
    paddingHorizontal: 8,
  },

  
  passwordWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#0042DA",
    marginBottom: 15,
  },
  inputPassword: {
    flex: 1,
    height: 45,
    fontSize: 14,
    paddingHorizontal: 8,
  },
  eyeIcon: {
    fontSize: 18,
    padding: 8,
    color: "#0042DA",
  },
  forgot: {
    alignSelf: "flex-end",
    color: "#000",
    textDecorationLine: "underline",
    marginBottom: 30,
    fontSize: 13,
    marginLeft: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#0042DA",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LoginScreen;
    */
      