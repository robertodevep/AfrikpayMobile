  import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage'; // gestion des stockage locale
import { isValid, parse } from 'date-fns';
import * as he from 'he'; // Bibliotheque pour decoder les entiter HTML
import React, { useEffect, useState } from "react"; // hook pour gerer l'etat local et les effect secondaire



  import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList, // Composant pour afficher une liste scrollable
  Platform,
  RefreshControl, // pour rafraichir la page
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity, // pour afficher une liste cliquable
  View,
} from 'react-native';
import api from "../glpi_server/services/api";

  interface Ticket { // definit la structure des donnees (ticket)
    id: number;
    name: string;
    content: string;
    description?: string;
    status?: string;
    date?: string;
    date_mod?: string;
    date_creation?: string;
    priority?: number;
  }

  interface StatusInfo { // les informations des status
    text: string;
    color: string;
    bgColor: string;
    circleColor: string;
    circleFill?: string;
  }

  type RootStackParamList = {
    login: undefined;       // Pas de paramètres attendus
    createTicket: undefined;
    TicketListScreen: undefined;
  };

  // Interface des props de CreateTicketScreen
  interface CreateTicketScreenProps {
    navigation: {
      navigate: (screenName: keyof RootStackParamList) => void; // Typage des écrans
      goBack: () => void; // Ajout de la fonction goBack
    };
  }

  interface ApiResponse<T> { // Structure de la reponse de l'API, T indique quelle est generique(qu'on ne sait pas encore le type de donnees qui sera utiliser)
    data: T[];
  }

  // gestion des couleurs status
  const statusMapping: Record<string, StatusInfo> = {
    "1": { 
      text: "Nouveau", 
      color: "#FFFFFF", // couleur du text (Nouveau)
      bgColor: "#3178C6", // couleur de fond(Nouveau)
      circleColor: "#3178C6" // couleur du cercle
    },
    "2": { 
      text: "En cours", 
      color: "#FFFFFF",
      bgColor: "#3E9333",
      circleColor: "#34C759",
      circleFill: "transparent" // pour que l'interieur soit vide
    },
    "3": { 
      text: "En cours Planifier", 
      color: "#FFFFFF",
      bgColor: "#34C759",
      circleColor: "#34C759"
    },
    "4": { 
      text: "En attente", 
      color: "#000000",
      bgColor: "#FFEFD6",
      circleColor: "#FF9500"
    },
    "5": { 
      text: "Résolu",    
      color: "#000000",
      bgColor: "#FFFFFF",
      circleColor: "#000000",
      circleFill: "transparent"
    },
    "6": { 
      text: "Clos", 
      color: "#FFFFFF",
      bgColor: "#000000",
      circleColor: "#000000"
    }
  };

  const priorityColors: Record<number, string> = {
    1: "#FF3B30",
    2: "#FF9500",
    3: "#34C759",
    4: "#AF52DE",
    5: "#5856D6"
  };

  type DeleteResponse = {
    success: boolean;
    id?: number;
    error?: string;
    message?: string;
    status?: number;
    code?: number;
  };



  export default function TicketListScreen({ navigation }: { navigation: any }) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchDate, setSearchDate] = useState<string>(""); // gestion des dates 


  //const [menuVisible, setMenuVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  // fonction pour
    /*const toggleMenu = () => {
      setMenuVisible(!menuVisible);
      Animated.spring(animation, {
        toValue: menuVisible ? 0 : 1,
        friction: 5,
        useNativeDriver: true
      }).start();
    };*/

    // page TICKET
  /* const handleNewTicket = () => {
      //setMenuVisible(false);
      navigation.navigate('createTicket'); // page nouveau ticket
    };*/

    /*const handleHome = () => {
      setMenuVisible(false);
      navigation.navigate('DashboardScreen'); // accueil 
    };*/


    // pour supprimer les caractere html present dans le text
    const cleanText = (text: string): string => {

      // Si le texte est vide ou null, retourne une chaîne vide
      if (!text) return "";

      
      try {
        // Décodage en deux passes pour gérer le double encodage
        let decoded = text; // Commence avec le texte original
        let previousDecoded; // Variable pour stocker l'état précédent
        
        do {
          previousDecoded = decoded; // Sauvegarde la version avant décodage
          decoded = he.decode(decoded); // Décode les entités HTML (comme &amp; -> &)
        } while (decoded !== previousDecoded); // Continue tant qu'il y a des changements
    
        // Suppression des balises HTML
        const withoutTags = decoded.replace(/<\/?[^>]+(>|$)/g, ''); 
    
        // Nettoyage final
        return withoutTags.replace(/[\u200B-\u200D\uFEFF]/g, '')
                        .replace(/\s+/g, ' ')
                        .trim();
      } catch (error) {
        console.error('Error cleaning text:', error);
        // Fallback plus agressif
        return text.replace(/&[^;]+;/g, '') // Supprime toutes les entités
                  .replace(/<\/?[^>]+(>|$)/g, '')
                  .trim();
      }
    };

    useEffect(() => {
      fetchTickets();
    }, []);

    useEffect(() => {
      filterTickets();
    }, [searchQuery, tickets]);

    // recherche par status
    const isStatusSearch = (query: string): string | null => {
      const normalizedQuery = query.toLowerCase().trim();
      for (const [key, statusInfo] of Object.entries(statusMapping)) {
        if (statusInfo.text.toLowerCase().includes(normalizedQuery)) {
          return key;
        }
      }
      return null;
    };

    const fetchTickets = async () => {
      setRefreshing(true);
      try {
        const sessionToken = await AsyncStorage.getItem('session_token');
        if (!sessionToken) {
          throw new Error('Session invalide');
        }

        const response = await api.get('/tickets', {
          headers: {
            'Session-Token': sessionToken
          }
        });

        console.log('Réponse tickets:', response.data);

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Format de réponse inattendu');
        }

        const mapped = response.data.map(t => ({
          id: t.id,
          name: t.name || 'Sans titre',
          content: t.content || t.description || "",
          status: t.status?.toString() || "1",
          date: t.date_mod || t.date_creation || "",
          priority: t.priority || 3,
          date_creation: t.date_creation || "", // pour le tri
          date_mod: t.date_mod || ""
        }));

          // Tri des tickets par date (les plus récents en premier)
        const sortedTickets = mapped.sort((a, b) => {
          // Priorité à date_creation
          const dateA = a.date_creation || a.date_mod;
          const dateB = b.date_creation || b.date_mod;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });

        setTickets(mapped);
        setFilteredTickets(mapped);
      } catch (err) {
        console.error('Erreur fetchTickets:', err);
        Alert.alert('Erreur', err instanceof Error ? err.message : 'Impossible de charger les tickets');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    const filterTickets = () => {
      if (!searchQuery) {
        setFilteredTickets(tickets);
        return;
      }

      // Vérifier si la recherche correspond à un statut
      const statusKey = isStatusSearch(searchQuery);
      if (statusKey) {
        const filtered = tickets.filter(ticket => ticket.status === statusKey);
        setFilteredTickets(filtered);
        return;
      }

      // Essayez de parser la recherche comme une date (formats acceptés: jj/mm/aaaa ou jj-mm-aaaa)
      const dateFormats = ['dd/MM/yyyy', 'dd-MM-yyyy'];
      let dateSearch: Date | null = null;
      
      for (const formatStr of dateFormats) {
        try {
          const parsedDate = parse(searchQuery, formatStr, new Date());
          if (isValid(parsedDate)) {
            dateSearch = parsedDate;
            break;
          }
        } catch (e) {
          console.log("Erreur de parsing de date", e);
        }
      }

      if (dateSearch) {
        // Normaliser la date de recherche (enlever l'heure)
        const searchDateStart = new Date(dateSearch);
        searchDateStart.setHours(0, 0, 0, 0);
        
        const searchDateEnd = new Date(dateSearch);
        searchDateEnd.setHours(23, 59, 59, 999);

        const filtered = tickets.filter(ticket => {
          const ticketDateStr = ticket.date_creation || ticket.date_mod;
          if (!ticketDateStr) return false;
          
          try {
            const ticketDate = new Date(ticketDateStr);
            return ticketDate >= searchDateStart && ticketDate <= searchDateEnd;
          } catch (e) {
            console.log("Erreur de parsing de la date du ticket", ticketDateStr, e);
            return false;
          }
        });
        
        setFilteredTickets(filtered);
      } else {
        // Recherche par texte (titre ou contenu)
        const query = searchQuery.toLowerCase();
        const filtered = tickets.filter(ticket =>
          ticket.name.toLowerCase().includes(query) || 
          ticket.content.toLowerCase().includes(query)
        );
        setFilteredTickets(filtered);
      }
    };

    const formatDate = (dateStr?: string) => {
      if (!dateStr) return "N/A";
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };


    const handleEditTicket = (ticket: Ticket) => {
      // Vérification du statut avant modification
      console.log("Ticket à modifier:", ticket); // Debug
      if (ticket.status !== "1") {
        Alert.alert(
          "Modification impossible",
          "Seuls les tickets avec le statut 'Nouveau' peuvent être modifiés"
        );
        return;
      }
    
      // Navigation avec les paramètres COMPLETS
      navigation.navigate('createTicket', { 
        editMode: true,
        ticketData: {
          id: ticket.id,
          name: ticket.name,
          content: ticket.content
        }
      });
    };
    
      // gestion du rendu du ticket et suppression
    const renderTicketItem = ({ item }: { item: Ticket }) => {
      // Récupère les infos de statut ou utilise les valeurs par défaut
      const statusInfo = statusMapping[item.status || "1"] || statusMapping["1"];
      // suppression
      const handleDeleteTicket = async () => {

         // Vérifie si le ticket est bien en statut "Clos" (6)
        if (item.status !== "6") {
          Alert.alert(
            "Suppression impossible",
            "Seuls les tickets avec le statut 'Clos' peuvent être supprimés."
          );
          return; // Annule la suppression
        }
        
        Alert.alert(
          "Supprimer le ticket",
          `Voulez-vous vraiment supprimer le ticket #${item.id} ?`,
          [
            { text: "Annuler", style: "cancel" },
            { 
              text: "Supprimer", 
              onPress: async () => {
                try {
                  const sessionToken = await AsyncStorage.getItem('session_token');
                  
                  if (!sessionToken) {
                    Alert.alert('Erreur', 'Session expirée - Veuillez vous reconnecter');
                    return;
                  }
      
                  // endpoint API
                  const response = await api.delete(`/tickets/${item.id}`, {
                    headers: {
                      'Session-Token': sessionToken
                    }
                  });
      
                  // Si succès (200 ou 204)
                  setTickets(prev => prev.filter(t => t.id !== item.id));
                  setFilteredTickets(prev => prev.filter(t => t.id !== item.id));
                  
                  Alert.alert("Succès", "Le ticket a été supprimé avec succès");
      
                } catch (err: any) {
                  console.error('Erreur complète:', err.response?.data || err.message);
                  
                  let errorMessage = 'Échec de la suppression';
                  if (err.response) {
                    switch (err.response.status) {
                      case 401:
                        errorMessage = "Session expirée - Veuillez vous reconnecter";
                        break;
                      case 403:
                        errorMessage = "Permissions insuffisantes";
                        break;
                      case 404:
                        errorMessage = "Ticket introuvable (déjà supprimé?)";
                        // Mise à jour quand même de l'état local
                        setTickets(prev => prev.filter(t => t.id !== item.id));
                        setFilteredTickets(prev => prev.filter(t => t.id !== item.id));
                        break;
                      case 500:
                        errorMessage = "Erreur serveur - Veuillez réessayer plus tard";
                        break;
                    }
                  }
                  
                  Alert.alert('Erreur', errorMessage);
                }
              }
            }
          ]
        );
      };
      
      return (
        <TouchableOpacity style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <Text style={styles.ticketId}>#{item.id}</Text>
          {/* Indicateur de priorité */}
            <View style={[
              styles.priorityIndicator, 
              { 
                backgroundColor: statusInfo.circleFill || statusInfo.circleColor,
                borderWidth: statusInfo.circleFill === "transparent" ? 1 : 0,
                borderColor: statusInfo.circleColor
              }
            ]} />
            {/* Bouton de modification */}
            {/*<TouchableOpacity 
              onPress={() => handleEditTicket(item)}
              style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color="#007AFF" />
            </TouchableOpacity>*/}

            {/* Bouton de suppression */}
          {/*<TouchableOpacity 
              onPress={handleDeleteTicket}
              style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />                         
          </TouchableOpacity>*/}

            {/* Badge de statut */}
            <View style={styles.statusBadgeContainer}>
              <StatusBadge status={item.status || ""} />
            </View>
          </View>
            {/* Titre et contenu NETTOYÉS */}
          <Text style={styles.ticketTitle} numberOfLines={1}>
            {cleanText(item.name)} 
          </Text>
          <Text style={styles.ticketContent} numberOfLines={6}>
            {cleanText(item.content)}
          </Text>
            {/* Pied de carte avec date */}
          <View style={styles.ticketFooter}>
            <Text style={styles.ticketDate}>{formatDate(item.date)}</Text>
            {/*<Ionicons name="chevron-forward" size={20} color="#C7C7CC" />*/}

            {/* Bouton de modification */}
            <TouchableOpacity
              onPress={() => handleEditTicket(item)}
              style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color="#007AFF" />
            </TouchableOpacity>

            <View style={styles.ticketActions}>
              {/* Bouton de suppression */}
              <TouchableOpacity 
                  onPress={handleDeleteTicket}
                  style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />                         
              </TouchableOpacity>
            </View>

            
          </View>
        </TouchableOpacity>
        
        
      );
    };

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Chargement des tickets...</Text>
        </View>
      );
    }

    return (
      
      <View style={styles.container}>
        
        <View style={styles.searchContainer}>
        <TouchableOpacity 
            onPress={() => navigation.goBack()}
              style={styles.backButton}>
        
              <Ionicons name="arrow-back" size={24} color="#2E86DE" />
          </TouchableOpacity>
          <Ionicons  size={20} color="#8E8E93" style={styles.searchIcon}/>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un ticket..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearSearch}>
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
        

        {filteredTickets.length === 0 ? (
          <View style={styles.emptyContainer}>
            {searchQuery ? (
              <>
                <Ionicons name="search-outline" size={60} color="#D1D1D6" />
                <Text style={styles.emptyTitle}>Aucun résultat trouvé</Text>
                <Text style={styles.emptyText}>Essayez une autre recherche</Text>
              </>
            ) : (
              <>
                <Ionicons name="document-text-outline" size={60} color="#D1D1D6" />
                <Text style={styles.emptyTitle}>Aucun ticket trouvé</Text>
                <Text style={styles.emptyText}>Créez votre premier ticket</Text>
              </>
            )}
          </View>
          
        ) : (
          <FlatList
            data={filteredTickets}
            renderItem={renderTicketItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={fetchTickets}
                tintColor="#4A90E2"
              />
            }
          />
          
        )}

        

        
      {/* Menu contextuel pour le bouton flotant*/}
      
        <View>
        <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('createTicket')} // Navigation directe
          >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
        </View>
    </View>
      );
    }

  function StatusBadge({ status }: { status: string }) {
    const statusInfo = statusMapping[status] || { 
      text: status === "5" ? "Résolu" : status === "6" ? "Clos" : "N/A",
      color: "#444", 
      bgColor: "#EEE",
      circleColor: "#EEE"
    };
    
    return (
      <View style={[styles.badge, { 
        backgroundColor: statusInfo.bgColor,
        borderWidth: 1,
        borderColor: statusInfo.color
      }]}>
        <Text style={[styles.badgeText, { color: statusInfo.color }]}>
          {statusInfo.text}
        </Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F5F7", // couleurs de fond de toute la page
    },

    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F5F5F7",
    },
    loadingText: {
      marginTop: 16,
      color: "#4A90E2",
      fontSize: 16,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFF",
      borderRadius: 10,
      margin: 16,
      paddingHorizontal: 12,
      height: 50,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      height: "100%",
      fontSize: 16,
      color: "#000",
    },
    clearSearch: {
      padding: 8,
    },
    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 32,
    },
    ticketCard: {
      backgroundColor: "#FFF", // couleurs de fond ticketCard
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    ticketHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    ticketId: {
      fontSize: 14,
      fontWeight: "600",
      color: "#8E8E93",
      marginRight: 8,
    },
    priorityIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
    },
    deleteButton: { // bouton de supprssion
      //marginRight: 20, // Espacement entre l'icône trash et le badge de statut
      padding: 5, // Zone cliquable plus grande
      //paddingLeft: 125,
      //top: 105, 
    },

    ticketActions: {
      flexDirection: 'row',
      alignItems: 'center',
      //marginRight: 20,
  },

    statusBadgeContainer: {
      marginLeft: "auto",
    },
    badge: {
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 12,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: "600",
    },
    ticketTitle: {
      fontSize: 17,
      fontWeight: "600",
      color: "#1C1C1E",
      marginBottom: 8,
    },
    ticketContent: {
      fontSize: 15,
      color: "#636366",
      marginBottom: 12,
      lineHeight: 20,
    },
    ticketFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    ticketDate: {
      fontSize: 13,
      color: "#8E8E93",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#1C1C1E",
      marginTop: 16,
      textAlign: "center",
    },
    emptyText: {
      fontSize: 16,
      color: "#636366",
      marginTop: 8,
      textAlign: "center",
    },

    fab: { // gestion du bouton statique
      position: 'absolute',
      right: 20,
      bottom: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      //backgroundColor: '#25D366', // couleur fond
      backgroundColor: '#3E9333',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5, // ombre sur androide
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      zIndex: 10, // pour s'assurer que le menu est au dessus des autre elements
    },
    menuContainer: {
      position: 'absolute',
      right: 20,
      bottom: 80,
      backgroundColor: 'rgba(0,0,0,0.85)',
      borderRadius: 8,
      padding: 8,
      elevation: 5,
      zIndex: 9,
    },
    menuItem: {
      flexDirection: 'row', // aligne l'icone et texter horizontal
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    menuText: {
      color: '#fff',
      marginLeft: 10,
      fontSize: 14,
    },
    backButton: {
      marginRight: 15,
      padding: 5,
    },
    editButton: {
      marginRight: -105, // Espacement entre les boutons
      padding: 5, // Zone cliquable plus grande
    },
  });