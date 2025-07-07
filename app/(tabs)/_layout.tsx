 

 // barre de menu en bas
 
 /* import { Tabs } from 'expo-router'; // importe les composant tabs fournis par la bibliothèque, expo-router bare en bas de l'ecran
  import React from 'react';
  import { Platform } from 'react-native'; // permet de detecter la plateforme sur laquelle l'application est en cours d'execution (Android, IOS)

  import { HapticTab } from '@/components/HapticTab'; // importe le composant HapticTab pour gérer les effets tactiles
  import { IconSymbol } from '@/components/ui/IconSymbol'; // importe le composant IconSymbol pour afficher des icones
  import TabBarBackground from '@/components/ui/TabBarBackground'; // importe le composant TabBarBackground pour personnaliser l'arrière-plan de la barre de navigation
  import { Colors } from '@/constants/Colors'; // importe les constantes de couleurs
  import { useColorScheme } from '@/hooks/useColorScheme'; // importe le hook useColorScheme pour gérer le mode sombre

  export default function TabLayout() {
    const colorScheme = useColorScheme(); 

    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint, // couleur de l'icône active light
          headerShown: false, // masque l'en-tête de la barre de navigation
          tabBarButton: HapticTab, // bouton de la barre de navigation
          tabBarBackground: TabBarBackground, // arrière-plan de la barre de navigation
        
          tabBarStyle: Platform.select({ // style de la barre de navigation
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
          android: {
            height: 55, // hauteur de la barre de navigation
            paddingBottom: 4, // espace intérieur bas
            paddingTop: 4, // espace intérieur haut
            backgroundColor: 'white', // ou la couleur de fond que tu veux
            borderTopWidth: 0.5, // fine bordure en haut si souhaité
            borderTopColor: '#ccc', // couleur de la bordure
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={10} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => <IconSymbol size={10} name="paperplane.fill" color={color} />,
          }}
        />
      </Tabs>
    );
  }*/
