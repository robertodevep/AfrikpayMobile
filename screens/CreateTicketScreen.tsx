

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
  /*interface CreateTicketScreenProps {
    navigation: {
      navigate: (screenName: keyof RootStackParamList) => void; // Typage des écrans
      goBack: () => void; // Ajout de la fonction goBack
    };
    route?: {
      params?: {
        editMode?: boolean;
        ticketData?: {
          id: number;
          name: string;
          content: string;
        };
      };
    };
  }*/

    interface CreateTicketScreenProps {
      navigation: {
        navigate: (screenName: keyof RootStackParamList) => void;
        goBack: () => void;
      };
      route: {  // <-- Ajoutez cette partie
        params?: {
          editMode?: boolean;
          ticketData?: {
            id: number;
            name: string;
            content: string;
          };
        };
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

  const CreateTicketScreen = ({ navigation, route}: CreateTicketScreenProps) => { // definition du composant CreateTicketScreen qui prend en parametre les props attendues
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false); 
    const [ticketId, setTicketId] = useState<number | null>(null); 

    useEffect(() => { // hook pour charger les donnees de l'utilisateur a partir du stockage local
      const loadUserData = async () => { 
        try {
          const storedUsername = await AsyncStorage.getItem("username");//recupere le nom de l'utilisateur stocké localement
          if (storedUsername) setUsername(storedUsername);//met a jour l'etat local avec le nom de l'utilisateur
          // Vérification des paramètres de route pour le mode édition
           // DEBUG: Vérifiez ce qui est reçu
         console.log("Paramètres reçus:", route?.params);
         console.log("Paramètres params:", route?.params); // Debug spécifique
         console.log("Mode édition:", route?.params?.editMode); // Debug édition
         console.log("Données ticket:", route?.params?.ticketData); // Debug données
        if (route?.params?.editMode && route.params.ticketData) {
          console.log("Données reçues:", route.params.ticketData); // Debug
          setIsEditMode(true);
          setSubject(route.params.ticketData.name);
          setContent(route.params.ticketData.content);
          setTicketId(route.params.ticketData.id);
        }
        } catch (error) {
          console.error("Erreur chargement données utilisateur:", error);
        }
      };
      loadUserData(); // appel de la fonction pour charger les donnees de l'utilisateur a chaque chargement de l'ecran
    }, [route?.params]); // tableau de dependance vide pour que le hook ne soit executé qu'une seul fois au chargement de l'ecran

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
        const sessionToken = await AsyncStorage.getItem('session_token');
        if (!sessionToken) {
          Alert.alert('Erreur', 'Session expirée - Veuillez vous reconnecter');
          return;
        }
    
        // Structure de base pour création et modification
        const ticketData = {
          name: subject,
          content: content,
          requester_name: username,
          type: 1,
          urgency: 3,
          impact: 2,
          priority: 3,
          itilcategories_id: 1
        };
    
        if (isEditMode && ticketId) {
          // Format spécifique pour la modification GLPI
          const response = await api.put(
            `/tickets/${ticketId}`,
            { input: ticketData }, // Notez l'objet { input: ... } encapsulant
            {
              headers: {
                'Session-Token': sessionToken,
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log("Réponse modification:", response.data);
          Alert.alert('Succès', 'Ticket mis à jour avec succès');
        } else {
          // Création d'un nouveau ticket
          const response = await api.post(
            '/tickets',
            { input: ticketData },
            {
              headers: {
                'Session-Token': sessionToken,
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log("Réponse création:", response.data);
          Alert.alert('Succès', 'Ticket créé avec succès');
        }
    
        navigation.navigate('TicketListScreen');
        setSubject("");
        setContent("");
      } catch (error: any) {
        console.error('Erreur détaillée:', {
          message: error.message,
          response: error.response?.data,
          config: error.config
        });
        
        let errorMessage = "Erreur lors de l'opération";
        if (error.response?.data?.message) {
          errorMessage += `: ${error.response.data.message}`;
        } else if (error.message) {
          errorMessage += `: ${error.message}`;
        }
        
        Alert.alert('Erreur', errorMessage);
      } finally {
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
        {/*<Text style={styles.title}>Créer un ticket</Text>*/}
        <Text style={styles.title}>
          {isEditMode ? 'Modifier le ticket' : 'Créer un ticket'}
        </Text>
          
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
                //title="Envoyer le ticket" 
                title={isEditMode ? "Mettre à jour" : "Envoyer le ticket"} 
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

  