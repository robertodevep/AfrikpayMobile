
 
/*import React, { useState } from "react";
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
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import api from "../glpi_server/services/api";
import { RootStackParamList } from "@/glpi_server/types";

type Props = NativeStackScreenProps<RootStackParamList, "login">;

interface LoginResponse {
  sessionToken?: string;
  error?: string;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

      navigation.navigate("Dashboard");
    } catch (error: unknown) {
      let errorMessage = "Échec de l'authentification";
      if (error instanceof Error) errorMessage = error.message;
      Alert.alert("Erreur", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "android" ? "padding" : undefined}
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

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
             <Text style={styles.forgot}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Connexion</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { flex: 1, alignItems: "center", paddingHorizontal: 30 },
  logo: { width: 180, height: 180, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 40, textAlign: "center" },
  input: { width: "100%", height: 45, borderBottomWidth: 1.5, borderBottomColor: "#3366E0", marginBottom: 25, fontSize: 14, paddingHorizontal: 8 },
  passwordWrapper: { width: "100%", flexDirection: "row", alignItems: "center", borderBottomWidth: 1.5, borderBottomColor: "#3366E0", marginBottom: 15 },
  inputPassword: { flex: 1, height: 45, fontSize: 14, paddingHorizontal: 8 },
  eyeIcon: { fontSize: 18, padding: 8, color: "#0042DA" },
  forgot: { alignSelf: "flex-end", color: "#000", textDecorationLine: "underline", marginBottom: 30, fontSize: 13, marginLeft: 170 },
  button: { width: "100%", backgroundColor: "#3366E0", paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default LoginScreen;*/

 
 
 import AsyncStorage from "@react-native-async-storage/async-storage"; // stockage des donnees localement de maniere persistante
import React, { useState } from "react"; // le hook pour gerer les etats locaux du composant
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
  Linking,
} from "react-native";
import api from "../glpi_server/services/api"; // importe l'instance axios préconfigurée

 import ForgotPassword from "./ForgotPassword";
 
   //type ScreenName = "login" | "createTicket"; // type pour les noms d'écran
   type ScreenName = "login" | "DashboardScreen" | "ForgotPassword" | "RegisterScreen"; // type pour les noms d'écran


 
   interface LoginScreenProps {
     navigate: (screenName: ScreenName) => void; //props que le composant attend
   }
 
   interface LoginResponse { //structure de la reponse attendue de l'API
     sessionToken?: string;
     error?: string;
   }
 
   const LoginScreen: React.FC<LoginScreenProps> = ({ navigate }) => { // composant LoginScreen qui prend en parametre les props attendues
     const [login, setLogin] = useState("");
     const [password, setPassword] = useState("");
     const [isLoading, setIsLoading] = useState(false);
     const [showPassword, setShowPassword] = useState(false);
 
     const handleLogin = async () => {
       if (!login.trim() || !password.trim()) {
         Alert.alert("Erreur", "Veuillez remplir tous les champs");
         return;
       }
 
       setIsLoading(true);
       try {
         const response = await api.post<LoginResponse>("/login", { login, password }); // envoie une requete post a l'API avec les credentials de l'utilisateur et type la reponse attendue
 
         if (!response.data.sessionToken) throw new Error("Token de session non reçu");// verifie si le token de session est renvoyé par l'API
 
         await AsyncStorage.setItem("session_token", response.data.sessionToken);// stocke le token de session dans le stockage local
         await AsyncStorage.setItem("username", login);// stocke le nom d'utilisateur dans le stockage local
         navigate("DashboardScreen");
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
         behavior={Platform.OS === "android" ? "padding" : undefined} // permet de deplacer le clavier au dessus des inputs
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
 
           <TouchableOpacity onPress={() => navigate("ForgotPassword")}>
             <Text style={styles.forgot}>Mot de passe oublié ?</Text>
           </TouchableOpacity>

           <TouchableOpacity onPress={() => navigate("RegisterScreen")}>
            <Text style={styles.forgot}>Creer un compte</Text>
           </TouchableOpacity>
           
          

          { /*<TouchableOpacity 
               onPress={() =>{
            Linking.openURL("https://glpi.afrikpay.com/front/lostpassword.php");
           }}>
             <Text style={styles.forgot}>Mot de passe oublié ?</Text>
           </TouchableOpacity>*/}

 
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
       borderBottomColor: "#3366E0",
       marginBottom: 25,
       fontSize: 14,
       paddingHorizontal: 8,
     },
 
     
     passwordWrapper: {
       width: "100%",
       flexDirection: "row",
       alignItems: "center",
       borderBottomWidth: 1.5,
       //borderBottomColor: "#00DA",
       borderBottomColor: "#3366E0",
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
       marginLeft: 170,
     },
     button: {
       width: "100%",
       //backgroundColor: "#0042DA",  
       backgroundColor: "#3366E0",
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

 