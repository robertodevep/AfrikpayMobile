
    import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
        
        import {
    ActivityIndicator, // spinner de chargement
    Alert,
    Animated, // animation pour le menu deroulant
    FlatList, // liste optimiser pour afficher les tickets
    Platform, // pour adapter le style selon ios/androide
    RefreshControl, // pour le rafraichissement de la page
    ScrollView, // contenu defilable
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

    import api from "../glpi_server/services/api"; // client api pour les requetes glpi

        interface Ticket { // definition de la structure des tickets avec ces proprieter
        id: number;
        name: string;
        content: string;
        status?: string;
        date_creation?: string;
        }

        interface ApiResponse { // structure de la reponse de l'api
        data: any[];
        }

        interface StatusInfo { // structure pour les status
        text: string;
        color: string;
        bgColor: string;
        circleFill?: string;
        }

        const statusMapping: Record<string, StatusInfo> = { // cree un objet avec une cle et la valeurs
        "1": { text: "Nouveau", color: "#FFFFFF", bgColor: "#3178C6" },
        "2": { text: "En cours", color: "#FFFFFF", bgColor: "#3E9333" },
        "3": { text: "Planifié", color: "#FFFFFF", bgColor: "#34C759" },
        "4": { text: "En attente", color: "#000000", bgColor: "#FFEFD6" },
        "5": { text: "Résolu", color: "#000000", bgColor: "#FFFFFF", circleFill: "transparent"},
        "6": { text: "Clos", color: "#FFFFFF", bgColor: "#000000" }
        };
        //bgColor: "#FFFFFF",
        //circleColor: "#000000",

        export default function DashboardScreen({ navigation }: { navigation: any }) {
        const [userName, setUserName] = useState("");
        const [allTickets, setAllTickets] = useState<Ticket[]>([]);
        const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
        const [loading, setLoading] = useState(true);
        const [refreshing, setRefreshing] = useState(false);
        const [menuVisible, setMenuVisible] = useState(false);
        const [animation] = useState(new Animated.Value(0));
        

        useEffect(() => {
            fetchUserData(); // cahrge le nom d'utilisateurs
            fetchAllTickets(); // charge les tickets 
        }, []);

        const fetchUserData = async () => {
            try {
            const name = await AsyncStorage.getItem('username');
            if (name) setUserName(name); // recupere le nom et met a jour l'etat
            } catch (error) {
            console.error('Error fetching user data:', error);
            }
        };

        const fetchAllTickets = async () => { // recupere tout les tickets
            setRefreshing(true);
            try {
            const sessionToken = await AsyncStorage.getItem('session_token');
            if (!sessionToken) throw new Error('Session invalide');

            const response = await api.get<ApiResponse>('/tickets', {
                headers: { 'Session-Token': sessionToken }
            });

            if (!response.data || !Array.isArray(response.data)) {
                throw new Error('Format de réponse inattendu');
            }

            const mappedTickets = response.data.map((t: any) => ({
                id: t.id,
                name: t.name || 'Sans titre',
                content: t.content || "",
                status: t.status?.toString() || "1",
                date_creation: t.date_creation || ""
            }));

            // Tous les tickets pour les statistiques
            setAllTickets(mappedTickets);

            // Derniers tickets (2 plus récents) pour l'affichage
            const sortedTickets = [...mappedTickets].sort((a, b) =>  // faire une copie du tableau original et utilise sort pour effectuer le trir
                new Date(b.date_creation || "").getTime() - new Date(a.date_creation || "").getTime() // soustrait les 2 date si elle est positif b est plus grand sinon a
            );
            setRecentTickets(sortedTickets.slice(0, 5)); // prend juste les deux dernier tickets (start, end)

            } catch (err) {
            console.error('Erreur fetchTickets:', err);
            Alert.alert('Erreur', 'Impossible de charger les tickets');
            } finally {
            setLoading(false);
            setRefreshing(false);
            }
        };

        const onRefresh = () => {
            fetchAllTickets();
        };

        const toggleMenu = () => {
            setMenuVisible(!menuVisible);
            Animated.spring(animation, {  // lance une animation en douceur
            toValue: menuVisible ? 0 : 1,  // ouverture et fermeture du menu
            friction: 5,     // definit la supplesse de l'animation
            useNativeDriver: true // optimise l'animation
            }).start();    // demarre l'animation
        };

    
        const handleLogout = async () => { // deconnexion
            
            try {
                
                await AsyncStorage.multiRemove(['session_token', 'username']); // supprime la session et le nom
                navigation.navigate('login'); 
            } catch (error) {
                console.error('Logout error:', error);
                Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion');
            }
        };

        const handleCreateTicket = () => {
            setMenuVisible(false);
            navigation.navigate('createTicket');
        };

        const formatDate = (dateStr?: string) => {
            if (!dateStr) return "N/A";
            const date = new Date(dateStr);
            return date.toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', year: 'numeric' });
        };

        // Calcul des statistiques à partir de tous les tickets
        const calculateStats = () => {
            return { // retourne un objet contenant ces differents statistique
            total: allTickets.length,
            new: allTickets.filter(t => t.status === "1").length, // creer un nouveau tableau avec seulement les tickets qui on le statut nouveau et compte le nombre
            inProgress: allTickets.filter(t => t.status === "2" || t.status === "3").length,
            resolved: allTickets.filter(t => t.status === "5" || t.status === "6").length
            //resolved: allTickets.filter(t => t.status === "5" || t.status === "6").length
            };
        };

        const stats = calculateStats();

        if (loading) {
            return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text style={styles.loadingText}>Chargement...</Text>
            </View>
            );
        }

        return (
            <View style={styles.container}>
            {/* Header */}
            
            <View style={styles.header}>
                <View style={styles.userInfo}>
                <Text style={styles.welcomeText}>Bienvenue</Text>
                <Text style={styles.userName}>{userName || "Utilisateur"}</Text>
                </View>
                <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                <Ionicons name="menu" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Menu déroulant */}
            {menuVisible && (
                <Animated.View style={[styles.dropdownMenu, {
                opacity: animation,
                transform: [{
                    translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0]
                    })
                }]
                }]}>
                <TouchableOpacity style={styles.menuItem} onPress={handleCreateTicket}>
                    <Ionicons name="add-circle-outline" size={20} color="#000" />
                    <Text style={styles.menuItemText}>Créer un ticket</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#000" />
                    <Text style={styles.menuItemText}>Déconnexion</Text>
                </TouchableOpacity>
                </Animated.View>
            )}

            {/* Contenu principal avec RefreshControl */}
            <ScrollView 
                style={styles.content}
                refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#4A90E2']}
                    tintColor="#4A90E2"
                />
                }
            >
                {/* Statistiques */}
                <View style={styles.statsContainer}>
                <Text style={styles.sectionTitle}>Statistiques</Text>
                <View style={styles.statsRow}>
                    <View style={[styles.statCard, { backgroundColor: '#05716c' }]}>
                    <Text style={styles.statNumber}>{stats.total}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: '#32A224' }]}>
                    <Text style={styles.statNumber}>{stats.inProgress}</Text>
                    <Text style={styles.statLabel}>En cours</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: '#3178C6' }]}>
                    <Text style={[styles.statNumber, { color: '#FFF' }]}>{stats.new}</Text>
                    <Text style={[styles.statLabel, { color: '#FFF' }]}>Nouveau</Text>
                    </View>
                </View>
                </View>


                {/* Derniers tickets*/}
                
                <View style={styles.ticketsContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Derniers tickets</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('TicketListScreen')}>
                    <Text style={styles.seeAll}>Voir plus</Text>
                    </TouchableOpacity>
                </View>

                {recentTickets.length > 0 ? (
                    <FlatList
                    data={recentTickets}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.ticketCard}>
                        <View style={styles.ticketHeader}>
                            <Text style={styles.ticketId}>#{item.id}</Text>
                            <View style={[styles.statusBadge, { 
                            backgroundColor: statusMapping[item.status || "1"].bgColor 
                            }]}>
                            <Text style={[styles.statusText, { 
                                color: statusMapping[item.status || "1"].color 
                            }]}>
                                {statusMapping[item.status || "1"].text}
                            </Text>
                            </View>
                        </View>
                        <Text style={styles.ticketTitle} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.ticketDate}>{formatDate(item.date_creation)}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id.toString()}
                    scrollEnabled={false}
                    />
                ) : (
                    <View style={styles.emptyTickets}>
                    <Ionicons name="document-text-outline" size={40} color="#D1D1D6" />
                    <Text style={styles.emptyText}>Aucun ticket récent</Text>
                    </View>
                )}
                </View>
            </ScrollView>
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

        // ... (les styles restent exactement les mêmes que dans votre code original)


        const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#F5F5F7',
            
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F5F5F7', 
            
        },
        loadingText: {
            marginTop: 16,
            color: '#4A90E2',
            fontSize: 16,
            
        },
        header: { // entete de la page
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            paddingTop: Platform.OS === 'ios' ? 50 : 20,
            backgroundColor: '#FFF',
            ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
            }),
        },
        userInfo: {
            flexDirection: 'column',  
        },
        welcomeText: {
            fontSize: 14,
            color: '#8E8E93',
            
        },
        userName: {
            fontSize: 18,
            fontWeight: '600',
            color: '#1C1C1E',
            marginTop: 4,
            
        },
        menuButton: {
            padding: 8,
            
        },
        dropdownMenu: {
            position: 'absolute',
            right: 20,
            top: Platform.OS === 'ios' ? 90 : 70,
            backgroundColor: '#FFF',
            borderRadius: 8,
            padding: 10,
            zIndex: 100,
            
            ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
            }),
        },
        menuItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 12,
            
        },
        menuItemText: {
            marginLeft: 10,
            fontSize: 16,
            color: '#1C1C1E',
            
        },
        content: { // contenue
            flex: 1,
            paddingHorizontal: 20,
            
        },
        statsContainer: {
            marginTop: 20,
            
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#1C1C1E',
            marginBottom: 15,    
        },
        statsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
            
        },
        statCard: {
            width: '30%',
            borderRadius: 12,
            padding: 15,
            alignItems: 'center',
            ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
            }),
        },
        statNumber: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#FFF',
            marginBottom: 5,
            
        },
        statLabel: {
            fontSize: 12,
            color: 'rgba(255,255,255,0.8)',
            
        },
        ticketsContainer: {
            marginBottom: 30,
            
        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,   
        },
        seeAll: {
            color: '#4A90E2',
            fontSize: 14,
            
        },
        ticketCard: {
            backgroundColor: '#FFF',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            
            ...Platform.select({
            ios: {
                shadowColor: '#000',
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
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            
        },
        ticketId: {
            fontSize: 14,
            fontWeight: '600',
            color: '#8E8E93',
            marginRight: 8,
            
        },
        statusBadge: { // gestion des statut
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 12,
            marginLeft: 'auto',
        },
        statusText: {
            fontSize: 12,
            fontWeight: '600',

            
        },
        ticketTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: '#1c1c1E',
            marginBottom: 8,
            
        },
        ticketDate: {
            fontSize: 13,
            color: '#8E8E93',
            
        },
        emptyTickets: {
            backgroundColor: '#FFF',
            borderRadius: 12,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            
            ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
            }),
        },
        emptyText: {
            fontSize: 16,
            color: '#636366',
            marginTop: 10,
            
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
        });