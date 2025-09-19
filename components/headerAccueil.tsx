

   import { 
             View,
             TouchableOpacity,
             StyleSheet,
             Text,
             Animated, // animation pour le menu deroulant
             Platform, // adapter le style selon io ou androide
             Alert,

    } from 'react-native';
    import AsyncStorage from '@react-native-async-storage/async-storage';
    import {useState, useEffect} from 'react'
    import { Ionicons } from "@expo/vector-icons";

    const HeaderAccueil = ({ navigation }: { navigation: any }) =>{

          const [menuVisible, setMenuVisible] = useState(false);
           const [animation] = useState(new Animated.Value(0));
           const [userName, setUserName] = useState("");

           useEffect(() => {
                       fetchUserData(); // cahrge le nom d'utilisateurs
                   }, []);

           const fetchUserData = async () => {
            try {
            const name = await AsyncStorage.getItem('username');
            if (name) setUserName(name); // recupere le nom et met a jour l'etat
            } catch (error) {
            console.error('Error fetching user data:', error);
            }
        };

           const toggleMenu = () => {
                    const newVisibility = !menuVisible;

                    Animated.spring(animation, {  // lance une animation en douceur
                    toValue: newVisibility ? 1: 0,  // ouverture et fermeture du menu
                    friction: 5,     // definit la supplesse de l'animation
                    useNativeDriver: true // optimise l'animation
                    }).start();    // demarre l'animation
                    setMenuVisible(newVisibility);
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
                    toggleMenu();
                    navigation.navigate('createTicket');
                };


            return( 
                <View>
                    <View style={styles.header}>
                        <View style={styles.userInfo}>
                        <Text style={styles.welcomeText}>Bienvenue</Text>
                        <Text style={styles.userName}>{userName || "Utilisateur"}</Text>
                        </View>
                        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                        <Ionicons name="menu" size={24} color="#000" />
                        </TouchableOpacity>
                     </View>

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
                 )
                 }
                </View>
            
            )
    }

    export default HeaderAccueil;

    const styles = StyleSheet.create({
        
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
    })


               /* import { 
                    View,
                    TouchableOpacity,
                    StyleSheet,
                    Text,
                    Animated,
                    Platform,
                    Alert,
                } from 'react-native';
                import AsyncStorage from '@react-native-async-storage/async-storage';
                import { useState, useEffect } from 'react';
                import { Ionicons } from "@expo/vector-icons";
                
                const HeaderAccueil = ({ navigation }: { navigation: any }) => {
                    const [menuVisible, setMenuVisible] = useState(false);
                    const [animation] = useState(new Animated.Value(0));
                    const [userName, setUserName] = useState("");
                
                    useEffect(() => {
                        fetchUserData();
                    }, []);
                
                    const fetchUserData = async () => {
                        try {
                            const name = await AsyncStorage.getItem('username');
                            if (name) setUserName(name);
                        } catch (error) {
                            console.error('Error fetching user data:', error);
                        }
                    };
                
                    const toggleMenu = () => {
                        const newVisibility = !menuVisible;
                        
                        Animated.spring(animation, {
                            toValue: newVisibility ? 1 : 0,
                            friction: 5,
                            useNativeDriver: true
                        }).start();
                        
                        setMenuVisible(newVisibility);
                    };
                
                    const handleLogout = async () => {
                        try {
                            await AsyncStorage.multiRemove(['session_token', 'username']);
                            navigation.navigate('login');
                        } catch (error) {
                            console.error('Logout error:', error);
                            Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion');
                        }
                    };
                
                    const handleCreateTicket = () => {
                        toggleMenu(); // Ferme le menu
                        navigation.navigate('createTicket');
                    };
                
                    return (
                        <View>
                            <View style={styles.header}>
                                <View style={styles.userInfo}>
                                    <Text style={styles.welcomeText}>Bienvenue</Text>
                                    <Text style={styles.userName}>{userName || "Utilisateur"}</Text>
                                </View>
                                <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                                    <Ionicons name="menu" size={24} color="#000" />
                                </TouchableOpacity>
                            </View>
                
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
                        </View>
                    );
                };
                
                export default HeaderAccueil;
                
                const styles = StyleSheet.create({
                    header: {
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
                });*/