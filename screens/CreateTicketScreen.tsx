
/*
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
  TouchableOpacity
} from "react-native";
import api from "../glpi_server/services/api";

interface CreateTicketScreenProps {
  navigation: {
    navigate: (screenName: 'login' | 'createTicket' | 'TicketListScreen') => void;
  };
}

interface ApiTicketResponse {
  id: number;
  message?: string;
}

interface TicketRequest {
  input: {
    name: string;
    content: string;
    users_id_requester?: number;
    requester_name?: string;
    type?: number;
    urgency?: number;
    impact?: number;
    priority?: number;
    itilcategories_id?: number;
  };
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
  message?: string;
}

const CreateTicketScreen = ({ navigation }: CreateTicketScreenProps) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [userFullname, setUserFullname] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadUserData = async () => {
    try {
      const [sessionData, username] = await Promise.all([
        AsyncStorage.getItem('sessionData'),
        AsyncStorage.getItem('username')
      ]);
  
      if (sessionData) {
        const parsedData = JSON.parse(sessionData);
        setUserId(parsedData.userId);
        setUserFullname(parsedData.fullname || username || '');
      } else if (username) {
        setUserFullname(username);
        const id = await AsyncStorage.getItem('userId');
        if (id) setUserId(parseInt(id, 10));
      }
    } catch (error) {
      console.error("Erreur chargement données utilisateur:", error);
      Alert.alert("Erreur", "Impossible de charger les informations utilisateur");
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleCreateTicket = async () => {
    if (!subject.trim() || !content.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
  
    if (!userId || !userFullname) {
      await loadUserData();
      
      if (!userId || !userFullname) {
        Alert.alert(
          "Erreur de session", 
          "Veuillez vous reconnecter",
          [{ text: "OK", onPress: () => navigation.navigate('login') }]
        );
        return;
      }
    }
  
    setIsLoading(true);
    
    try {
      const ticketRequest: TicketRequest = {
        input: {
          name: subject,
          content: content,
          users_id_requester: userId,
          requester_name: userFullname,
          type: 1,
          urgency: 3,
          impact: 2,
          priority: 3,
          itilcategories_id: 1,
        }
      };
  
      const response = await api.post<ApiTicketResponse>("/tickets", ticketRequest);
      
      if (!response.data?.id) {
        throw new Error("La création du ticket a échoué");
      }
  
      Alert.alert(
        "Succès", 
        `Ticket #${response.data.id} créé avec succès !`,
        [{ text: "OK", onPress: () => {
          setSubject("");
          setContent("");
        }}]
      );
    } catch (error: unknown) {
      console.error("Erreur création ticket:", error);
      
      let errorMessage = "Une erreur est survenue";
      if (isAxiosError(error)) {
        const axiosError = error as ApiError;
        errorMessage = axiosError.response?.data?.message || 
                     axiosError.response?.data?.error || 
                     axiosError.message || 
                     "Erreur de communication avec le serveur";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
  
      Alert.alert("Erreur", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isAxiosError = (error: unknown): error is ApiError => {
    return typeof error === 'object' && error !== null && 'isAxiosError' in error;
  };

  

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Image
          source={require("../assets/images/logoAfrikPay.jpeg")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Créer un ticket</Text>
        
        {userFullname && (
          <Text style={styles.userInfo}>Demandeur: {userFullname}</Text>
        )}
        
        <Text style={styles.label}>Sujet*</Text>
        <TextInput
          placeholder="Entrez le sujet de votre ticket"
          value={subject}
          onChangeText={setSubject}
          style={styles.input}
          placeholderTextColor="#999"
        />
        
        <Text style={styles.label}>Description détaillée*</Text>
        <TextInput
          placeholder="Décrivez votre problème en détail..."
          value={content}
          onChangeText={setContent}
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={6}
          placeholderTextColor="#999"
        />
        
        <View style={styles.buttonContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#2E86DE" />
          ) : (
            <Button 
              title="Envoyer le ticket" 
              onPress={handleCreateTicket}
              disabled={isLoading}
              color="#2E86DE"
            />
          )}
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.ticketListLink}
        onPress={() => navigation.navigate('TicketListScreen')}
      >
        <Text style={styles.ticketListText}>Liste des Tickets</Text>
      </TouchableOpacity>
    </ScrollView>
  );

};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  logo: {
    width: 200,
    height: 80,
  },
  formContainer: {
    padding: 25,
    marginTop: -55,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 25,
    color: '#333',
    textAlign: 'center',
  },
  userInfo: {
    marginBottom: 20,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#333',
  },
  multilineInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  ticketListLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  ticketListText: {
    color: '#2E86DE',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});

export default CreateTicketScreen;*/

  //  DEBUT ORIGINAL  qui fonctionne actuel

  import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import api from "../glpi_server/services/api";



  /*interface CreateTicketScreenProps { // definition des props attendues par le composant CreateTicketScreen(la navigation)
    navigation: {
      navigate: (screenName: 'login' | 'createTicket' | 'TicketListScreen') => void;
    };
  }*/

      // Définir un type pour les routes autorisées (pour éviter les erreurs de typage)
  type RootStackParamList = {
    login: undefined;       // Pas de paramètres attendus
    createTicket: undefined;
    TicketListScreen: undefined;
    DashboardScreen: undefined;
  };

  // Interface des props de CreateTicketScreen
  interface CreateTicketScreenProps {
    navigation: {
      navigate: (screenName: keyof RootStackParamList) => void; // Typage des écrans
      goBack: () => void; // Ajout de la fonction goBack
    };
  }

  interface ApiTicketResponse { // la structure de la reponse attendue de l'API pour la creation d'un ticket
    id: number;
    message?: string;
  }

  interface TicketRequest { // la structure de la requete attendue par l'API pour la creation d'un ticket
    input: {
      name: string;
      content: string;
      requester_name: string; // nom du demandeur
      type?: number;
      urgency?: number;
      impact?: number;
      priority?: number;
      itilcategories_id?: number;
    };
  }

  const CreateTicketScreen = ({ navigation }: CreateTicketScreenProps) => { // definition du composant CreateTicketScreen qui prend en parametre les props attendues
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { // hook pour charger les donnees de l'utilisateur a partir du stockage local
      const loadUserData = async () => { 
        try {
          const storedUsername = await AsyncStorage.getItem("username");//recupere le nom de l'utilisateur stocké localement
          if (storedUsername) setUsername(storedUsername);//met a jour l'etat local avec le nom de l'utilisateur
        } catch (error) {
          console.error("Erreur chargement données utilisateur:", error);
        }
      };
      loadUserData(); // appel de la fonction pour charger les donnees de l'utilisateur a chaque chargement de l'ecran
    }, []); // tableau de dependance vide pour que le hook ne soit executé qu'une seul fois au chargement de l'ecran

    const handleCreateTicket = async () => { // gestion de la creation d'un ticket
      if (!subject.trim() || !content.trim()) {
        Alert.alert("Erreur", "Veuillez remplir tous les champs.");
        return;
      }

      if (!username) {
        Alert.alert("Erreur", "Impossible d'identifier l'utilisateur.");
        return;
      }

      setIsLoading(true); //active le chargement
      
      try {
        const ticketRequest: TicketRequest = { //prepare la requete a envoyer a l'API avec les donnees du ticket
          input: {
            name: subject,
            content: content,
            requester_name: username, // Uutilise le nom comme demandeur
            type: 1, //  d'incident
            urgency: 3, // moyenne
            impact: 2, // moyen
            priority: 3, // moyenne
            itilcategories_id: 1 // categorie incident
          }
        };

        const response = await api.post<ApiTicketResponse>("/tickets", ticketRequest); // envoie la requete a l'API avec les donnees du ticket et type la reponse attendue
        const responseData = response.data as ApiTicketResponse; // type la reponse attendue et la stocke dans une variable appelee responseData

        if (!responseData.id) {// si la reponse ne contient pas de id on declenche une erreur
          throw new Error("Réponse invalide du serveur");
        }

        Alert.alert("Succès", `Ticket créé avec succès !`);
         navigation.navigate('TicketListScreen');
        setSubject("");
        setContent("");
      } catch (error: unknown) { // unknown pour dire que le type de l'erreur est inconnu
        console.error("Erreur création ticket:", error);
        
        let errorMessage = "Impossible de créer le ticket";
        if (isAxiosError(error)) { // si l'erreur est une erreurs axios on recupere le message d'erreur renvoyer par l'API
          const axiosError = error as { response?: { data?: { error?: string } } }; // typage de l'erreur axios et de la reponse de l'API
          errorMessage = axiosError.response?.data?.error || "Erreur API"; // recupere le message d'erreur renvoyer par l'API ou "Erreur API" si le message n'est pas disponible
        } else if (error instanceof Error) { // instanceof pour verifier que l'erreur est une erreur javascript
          errorMessage = error.message;
        }

        Alert.alert("Erreur", errorMessage);
      } finally { // desactive le chargement, finally est execute quoi qu'il arrive
        setIsLoading(false);
      }
    };

    const isAxiosError = (error: unknown): error is { response?: { data?: { error?: string } } } => { // verification que l'erreur est une erreur axios
      return typeof error === 'object' && error !== null && 'isAxiosError' in error; // verifie que l'erreur est un objet, qu'elle n'est pas null et qu'elle contient la propriete isAxiosError
    };

    return (
      <ScrollView  // ScrollView pour permettre le scroll si le clavier est affiché, scroll pour gerer le clavier
        contentContainerStyle={styles.container} 
        keyboardShouldPersistTaps="handled" // pour que le clavier ne cache pas le contenu de la vue
      >
        <TouchableOpacity 
        onPress={() => navigation.goBack()}
        style={styles.backButton}>

        <Ionicons name="arrow-back" size={24} color="#2E86DE" />
       </TouchableOpacity>
        <View style={styles.header}> 
          <Image
            source={require("../assets/images/logoAfrikPay.jpeg")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        

        <View style={styles.formContainer}>
          <Text style={styles.title}>Créer un ticket</Text>
          
          {username && ( //si le nom de l'utilisateur est disponible on l'affiche
            <Text style={styles.userInfo}>Demandeur: {username}</Text>
          )}
          
          <Text style={styles.label}>Sujet<Text style={styles.etoil}>*</Text></Text>
          <TextInput
            placeholder="Entrez le sujet de votre ticket"
            value={subject}
            onChangeText={setSubject}
            style={styles.input}
            placeholderTextColor="#999" // couleur du placehoder
          />
          
          <Text style={styles.label}>Description détaillée<Text style={styles.etoil}>*</Text></Text>
          <TextInput
            placeholder="Décrivez votre problème en détail..."
            value={content} 
            onChangeText={setContent}
            style={[styles.input, styles.multilineInput]} // style multilineInput pour gerer la hauteur de la zone de texte, multiline pour gerer le retour a la ligne
            multiline // pour gerer le retour a la ligne
            numberOfLines={6} // pour afficher 6 ligne au maximun
            placeholderTextColor="#999" // couleur du placehoder
          />
          
          <View style={styles.buttonContainer}>
            {isLoading ? ( // si le chargement est actif on affiche un indicateur de chargement
              <ActivityIndicator size="large" color="#2E86DE" /> // indicateur de chargement permettant de gerer le temps de chargement
            ) : (
              <Button 
                title="Envoyer le ticket" 
                onPress={handleCreateTicket}  
                disabled={isLoading}
                color="#2E86DE"
              />
            
            )}
          </View>
        </View>
       
      </ScrollView>
    );
  };

  interface Styles {
    container: ViewStyle; // type de style pour le container, viewStyle est un type de style pour les vues
    header: ViewStyle;
    logo: ViewStyle;
    formContainer: ViewStyle;
    title: TextStyle;
    userInfo: TextStyle;
    label: TextStyle;
    input: TextStyle;
    multilineInput: TextStyle;
    buttonContainer: ViewStyle;
    etoil: TextStyle,
  }

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1, // pour que le container occupe toute la hauteur de l'ecran
      backgroundColor: '#FFFFFF', // couleur de fond de l'ecran(la page)
    },
    header: {
      alignItems: 'center', 
      paddingVertical: 20, // marge verticale
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1, // ligne du bas ligne horizontale
      borderBottomColor: '#F0F0F0', // couleur de la ligne du bas
    },
    logo: {
      width: 200,
      height: 90,
      marginTop: -85,
      marginRight: 60,
    },
    backButton: {
      marginRight: 15,
      padding: 5,
      marginLeft: 17,
    },
    formContainer: {
      padding: 25, 
      marginTop: -55, // pour que le container soit en dessous du logo
    },
    title: {
      fontSize: 22,
      fontWeight: '600', 
      marginBottom: 25, // marge en bas pour separer le titre du contenue
      color: '#333',
      textAlign: 'center',
      //textTransform: 'uppercase',
    },
    userInfo: { // style pour l'affichage du nom de l'utilisateur
      marginBottom: 20,
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
      fontStyle: 'italic', 
      //fontWeight: '500',
      //textDecorationColor: 'yellow',
      textDecorationLine: 'underline',
    },
    label: {
      fontSize: 16, 
      fontWeight: '500',
      marginBottom: 8,
      color: '#444',
    },
    input: {
      borderWidth: 1, // bordure des champs de saisie
      borderColor: '#DDD', // couleur de la bordure
      padding: 15,
      marginBottom: 20,
      borderRadius: 8,
      fontSize: 16,
      backgroundColor: '#FAFAFA',
      color: '#333',
    },
    multilineInput: {
      height: 150, // hauteur de la zone de texte
      textAlignVertical: 'top', // pour que le texte soit aligné en haut
    },
    buttonContainer: {
      marginTop: 10, // marge en haut pour separer le bouton du contenue
      borderRadius: 8,
      //height: 90,
      
      
      overflow: 'hidden', // pour que le bouton ne depasse pas la zone de texte
    },
    etoil:{
    color: 'red',
    },
    
  });

  export default CreateTicketScreen;  

  // FIN ORIGINAL actuel









/*import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  ViewStyle
} from "react-native";
import api from "../glpi_server/services/api";

interface CreateTicketScreenProps {
  navigation: {
    navigate: (screenName: string) => void;
  };
}

interface ApiTicketResponse {
  id: number;
  message?: string;
}

interface TicketRequest {
  input: {
    name: string;
    content: string;
    requester_name: string;  // Champ modifié pour utiliser le nom
    type?: number;
    urgency?: number;
    impact?: number;
    priority?: number;
    itilcategories_id?: number;
  };
}

const CreateTicketScreen = ({ navigation }: CreateTicketScreenProps) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        if (storedUsername) setUsername(storedUsername);
      } catch (error) {
        console.error("Erreur chargement données utilisateur:", error);
      }
    };
    loadUserData();
  }, []);

  const handleCreateTicket = async () => {
    if (!subject.trim() || !content.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    if (!username) {
      Alert.alert("Erreur", "Impossible d'identifier l'utilisateur.");
      return;
    }

    setIsLoading(true);
    
    try {
      const ticketRequest: TicketRequest = {
        input: {
          name: subject,
          content: content,
          requester_name: username,  // Utilisation du nom comme demandeur
          type: 1,
          urgency: 3,
          impact: 2,
          priority: 3,
          itilcategories_id: 1
        }
      };

      const response = await api.post<ApiTicketResponse>("/tickets", ticketRequest);
      const responseData = response.data as ApiTicketResponse;

      if (!responseData.id) {
        throw new Error("Réponse invalide du serveur");
      }

      //Alert.alert("Succès", `Ticket #${responseData.id} créé avec succès !`);
      Alert.alert("Succès", `Ticket créé avec succès !`);
      setSubject("");
      setContent("");
    } catch (error: unknown) {
      console.error("Erreur création ticket:", error);
      
      let errorMessage = "Impossible de créer le ticket";
      if (isAxiosError(error)) {
        const axiosError = error as { response?: { data?: { error?: string } } };
        errorMessage = axiosError.response?.data?.error || "Erreur API";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      Alert.alert("Erreur", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isAxiosError = (error: unknown): error is { response?: { data?: { error?: string } } } => {
    return typeof error === 'object' && error !== null && 'isAxiosError' in error;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
          source={require("../assets/images/logoAfrikPay.jpeg")}
          style={styles.logo}
          resizeMode="contain"
        />
      <Text style={styles.title}>Créer un ticket</Text>
      {username && (
        <Text style={styles.userInfo}>Demandeur: {username}</Text>
      )}
      
      <TextInput
        placeholder="Sujet*"
        value={subject}
        onChangeText={setSubject}
        style={styles.input}
      />
      
      <TextInput
        placeholder="Description détaillée*"
        value={content}
        onChangeText={setContent}
        style={[styles.input, styles.multilineInput]}
        multiline
        numberOfLines={4}
      />
      
      <Button 
        title={isLoading ? "Envoi en cours..." : "Envoyer le ticket"} 
        onPress={handleCreateTicket} 
        disabled={isLoading}
      />
    </ScrollView>
  );
};


interface Styles {
  container: ViewStyle;
  title: TextStyle;
  userInfo: TextStyle;
  input: TextStyle;
  multilineInput: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: "center"
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center" as const,
    fontWeight: "bold" as const,
  },
  logo: {
    width: 180,
    height: 100,
    marginBottom: 20,
  },
  userInfo: {
    marginBottom: 15,
    fontStyle: "italic" as const,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  multilineInput: {
    height: 150,
    textAlignVertical: "top" as const,
  },
  

});

export default CreateTicketScreen;  */


    
/*import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  Alert, 
  StyleSheet, 
  ScrollView,
  TextStyle,
  ViewStyle
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../glpi_server/services/api";

interface CreateTicketScreenProps {
  navigation: {
    navigate: (screenName: string) => void;
  };
}

interface ApiTicketResponse {
  id: number;
  message?: string;
}

interface TicketRequest {
  input: {
    name: string;
    content: string;
    _users_id_requester: number;
    type?: number;
    urgency?: number;
    impact?: number;
    priority?: number;
    itilcategories_id?: number;
  };
}

const CreateTicketScreen = ({ navigation }: CreateTicketScreenProps) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [storedUsername, storedUserId] = await Promise.all([
          AsyncStorage.getItem("username"),
          AsyncStorage.getItem("user_id")
        ]);
        
        if (storedUsername) setUsername(storedUsername);
        if (storedUserId) setUserId(parseInt(storedUserId));
      } catch (error) {
        console.error("Erreur chargement données utilisateur:", error);
      }
    };
    loadUserData();
  }, []);


  const handleCreateTicket = async () => {
    if (!subject.trim() || !content.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    if (!userId) {
      Alert.alert("Erreur", "Impossible d'identifier l'utilisateur.");
      return;
    }

    setIsLoading(true);
    
    try {
      const ticketRequest: TicketRequest = {
        input: {
          name: subject,
          content: content,
          _users_id_requester: userId,
          type: 1,
          urgency: 3,
          impact: 2,
          priority: 3,
          itilcategories_id: 1
        }
      };

      const response = await api.post<ApiTicketResponse>("/tickets", ticketRequest);
      const responseData = response.data as ApiTicketResponse;

      if (!responseData.id) {
        throw new Error("Réponse invalide du serveur");
      }

      Alert.alert("Succès", `Ticket #${responseData.id} créé avec succès !`);
      setSubject("");
      setContent("");
    } catch (error: unknown) {
      console.error("Erreur création ticket:", error);
      
      let errorMessage = "Impossible de créer le ticket";
      if (isAxiosError(error)) {
        const axiosError = error as { response?: { data?: { error?: string } } };
        errorMessage = axiosError.response?.data?.error || "Erreur API";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      Alert.alert("Erreur", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isAxiosError = (error: unknown): error is { response?: { data?: { error?: string } } } => {
    return typeof error === 'object' && error !== null && 'isAxiosError' in error;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Créer un ticket</Text>
      {username && (
        <Text style={styles.userInfo}>Demandeur: {username} (ID: {userId})</Text>
      )}
      
      <TextInput
        placeholder="Sujet*"
        value={subject}
        onChangeText={setSubject}
        style={styles.input}
      />
      
      <TextInput
        placeholder="Description détaillée*"
        value={content}
        onChangeText={setContent}
        style={[styles.input, styles.multilineInput]}
        multiline
        numberOfLines={4}
      />
      
      <Button 
        title={isLoading ? "Envoi en cours..." : "Envoyer le ticket"} 
        onPress={handleCreateTicket} 
        disabled={isLoading}
      />
    </ScrollView>
  );
};

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  userInfo: TextStyle;
  input: TextStyle;
  multilineInput: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center" as const,
    fontWeight: "bold" as const,
  },
  userInfo: {
    marginBottom: 15,
    fontStyle: "italic" as const,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  multilineInput: {
    height: 150,
    textAlignVertical: "top" as const,
  },
});

export default CreateTicketScreen;*/

/*import React, { useState, useEffect } from "react"; se qui fonctionne 
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface CreateTicketScreenProps {
  navigation: {
    navigate: (screenName: string) => void;
  };
}

interface ApiTicketResponse {
  id: number;
  message?: string;
  // Autres champs que votre API pourrait retourner
}


const CreateTicketScreen = ({ navigation }: CreateTicketScreenProps) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };
    loadUserData();
  }, []);

  const handleCreateTicket = async () => {
    if (!subject.trim() || !content.trim()) {
      Alert.alert("Champs requis", "Veuillez remplir tous les champs.");
      return;
    }

    setIsLoading(true);
    
    try {
      const sessionToken = await AsyncStorage.getItem("session_token");
      if (!sessionToken) {
        Alert.alert("Erreur", "Session expirée. Veuillez vous reconnecter.");
        navigation.navigate("login");
        return;
      }

      const ticketData = {
        name: subject,
        content: content,
        requester: username, // Ajout du nom du demandeur
        // Autres champs GLPI standard
        type: 1, // Type d'incident
        urgency: 3, // Urgence moyenne
        impact: 2, // Impact moyen
        priority: 3, // Priorité moyenne
        itilcategories_id: 1, // Catégorie (à adapter)
      };

      const response = await axios.post(
        "http://192.168.208.253:3000/api/tickets",
        { input: ticketData },
        {
          headers: {
            'Session-Token': sessionToken,
            'Content-Type': 'application/json'
          }
        }
      );

      Alert.alert("Succès", `Ticket #${response.data.id} créé avec succès !`);
      setSubject("");
      setContent("");
    } catch (error: any) {
      console.error("Erreur création ticket:", error);
      const errorMessage = error.response?.data?.error || "Impossible de créer le ticket";
      Alert.alert("Erreur", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Créer un ticket</Text>
      {username ? <Text style={styles.userInfo}>Demandeur: {username}</Text> : null}
      
      <TextInput
        placeholder="Sujet*"
        value={subject}
        onChangeText={setSubject}
        style={styles.input}
      />
      
      <TextInput
        placeholder="Description détaillée*"
        value={content}
        onChangeText={setContent}
        style={[styles.input, styles.multilineInput]}
        multiline
        numberOfLines={4}
      />
      
      <Button 
        title={isLoading ? "Envoi en cours..." : "Envoyer le ticket"} 
        onPress={handleCreateTicket} 
        disabled={isLoading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  userInfo: {
    marginBottom: 15,
    fontStyle: "italic",
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  multilineInput: {
    height: 150,
    textAlignVertical: "top",
  },
});

export default CreateTicketScreen;*/


/*import api from "@/glpi_server/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";

const CreateTicketScreen = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreateTicket = async () => {
    const userToken = await AsyncStorage.getItem("userToken");

    try {
      const response = await api.post(
        "/tickets",
        {
          input: {
            name: title,
            content: content,
          },
        },
        {
          headers: {
            "Authorization": `user_token ${userToken}`,
          },
        }
      );

      Alert.alert("Succès", "Ticket créé avec succès !");
      setTitle("");
      setContent("");
    } catch (error) {
      Alert.alert("Erreur", "Échec de la création du ticket");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Titre du ticket"
        value={title}
        onChangeText={setTitle}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Contenu"
        value={content}
        onChangeText={setContent}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
        multiline
      />
      <Button title="Créer le ticket" onPress={handleCreateTicket} />
    </View>
  );
};

export default CreateTicketScreen;*/

 /*system actuimport React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../glpi_server/services/api'; // adapte ce chemin si nécessaire
import { useState } from 'react';

type NavigationProps = {
  navigation: {
    navigate: (targetScreen: 'Login' | 'CreateTicket') => void;
    goBack: () => void;
  };
};

const CreateTicketScreen = ({ navigation }: NavigationProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreateTicket = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    if (!title || !content) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    if (!userToken) {
      Alert.alert('Erreur', 'Token utilisateur introuvable. Veuillez vous reconnecter.');
      return;
    }

    try {
      const input = {
        name: title,
        content: content,
        urgency: 3,
        _users_id_requester: 2, // à adapter dynamiquement si nécessaire
      };

      const response = await api.post('/tickets', { input, userToken });

      Alert.alert('Succès', 'Ticket créé avec succès !');
      setTitle('');
      setContent('');
      navigation.goBack(); // ou navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le ticket.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Titre du ticket</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Titre"
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={content}
        onChangeText={setContent}
        placeholder="Décrivez votre problème"
        multiline
      />
      <Button title="Créer le ticket" onPress={handleCreateTicket} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default CreateTicketScreen;*/

   

/*se qui fonctionne
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native"; // importe les composants de base de React Native
import api from "../glpi_server/services/api"; // pointe vers l'API de mon serveur

export default function CreateTicketScreen() {
  const [title, setTitle] = useState(""); // contiient le titre du ticket creer par le User(title), fonction pour modifier le titre(setTitle)
  const [description, setDescription] = useState(""); //la valeur initial vide(useState)

  const handleCreate = async () => {

    if(!title.trim() || !description.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      const payload = { name: title, content: description }; // prepare les données à envoyer a l'API glpi
      const response = await api.post('/tickets', payload); // envoie les données a l'API et await attend la reponse
      const { id } = response.data;
      Alert.alert('Succès', `Ticket créé avec l’ID ${id}`);
      setTitle(''); // remet les champs a vide apres la creation du ticket
      setDescription('');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erreur', err.response?.data?.message || err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un ticket</Text>
      <TextInput
        placeholder="Titre"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Description"
        style={[styles.input, styles.textarea]}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button title="Envoyer"  onPress={handleCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 12, padding: 10, marginBottom: 12 },
  textarea: { height: 100, textAlignVertical: 'top' },
  footer: { backgroundColor: 'black'},
  Button: {borderRadius: 10, backgroundColor: 'blue', padding: 10, marginTop: 10, color: 'white' }
});*/



/*import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import api from "../glpi_server/services/api";

export default function CreateTicketScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attemptSubmit, setAttemptSubmit] = useState(false); // pour afficher les erreurs après tentative

  const isTitleEmpty = !title.trim();
  const isDescriptionEmpty = !description.trim();
  const isFormValid = !isTitleEmpty && !isDescriptionEmpty;

  const handleCreate = async () => {
    setAttemptSubmit(true); // active la validation visuelle

    if (!isFormValid) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      const payload = { name: title, content: description };
      const response = await api.post('/tickets', payload);
      const { id } = response.data;
      Alert.alert('Succès', `Ticket créé avec l’ID ${id}`);
      setTitle('');
      setDescription('');
      setAttemptSubmit(false); // réinitialise après succès
    } catch (err) {
      console.error(err);
      Alert.alert('Erreur', err.response?.data?.message || err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un ticket</Text>

      <TextInput
        placeholder="Titre"
        style={[
          styles.input,
          attemptSubmit && isTitleEmpty && styles.inputError
        ]}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Description"
        style={[
          styles.input,
          styles.textarea,
          attemptSubmit && isDescriptionEmpty && styles.inputError
        ]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Button title="Envoyer" onPress={handleCreate} disabled={!isFormValid} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12 },
  textarea: { height: 100, textAlignVertical: 'top' },
  inputError: { borderColor: 'red' } // bordure rouge en cas d’erreur
});*/
