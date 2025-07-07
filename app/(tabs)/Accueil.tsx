// screens/CreateTicketScreen.js
/*import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import api from "../../glpi_server/services/api";

export default function CreateTicketScreen() {
    const [name, setName] = useState("");
    const [content, setContent] = useState("");

    const handleCreateTicket = async () => {
        try {
            const response = await api.post("/tickets", {
                name,
                content,
            });

            console.log("Réponse backend :", response.data); // 🔍 Debug : montre le ticket complet

            // Vérifie différentes structures possibles pour récupérer l'id
            const ticketId = response.data?.id || response.data?.data?.id || "Non défini";

            Alert.alert("Succès", `Ticket ID: ${ticketId}`);
            setName("");
            setContent("");
        } catch (error) {
            console.log("Erreur ticket :", error.response?.data || error.message); // 🔍 Plus de détails sur l'erreur
            Alert.alert("Erreur", error.response?.data?.message || error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Créer un Ticket</Text>
            <TextInput
                placeholder="Titre du ticket"
                style={styles.input}
                onChangeText={setName}
                value={name}
            />
            <TextInput
                placeholder="Contenu du ticket"
                style={[styles.input, styles.textarea]}
                onChangeText={setContent}
                value={content}
                multiline
            />
            <Button title="Créer le Ticket" onPress={handleCreateTicket} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f2f2f2",
        flex: 1,
        justifyContent: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    textarea: {
        height: 100,
        textAlignVertical: "top",
    },
});*/


// server.js
/*const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware pour parser le JSON
app.use(bodyParser.json());

// Configuration GLPI
const GLPI_API_URL = 'http://localhost/glpi/apirest.php';
const APP_TOKEN = 'QPkSMqodMxbHni9fMgrnjowVPwEQDe7PeUhTVMtu';

// Route de connexion
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username et password requis' });
  }

  try {
    // Appel à l'API GLPI pour initier la session
    const response = await axios.post(
      `${GLPI_API_URL}/initSession`,
      {
        login: username,
        password: password
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'App-Token': APP_TOKEN
        }
      }
    );
    
    // Supposons que GLPI renvoie l'ID et on peut retrouver le nom de l'utilisateur via une autre API
    // Pour cet exemple, nous supposons que le nom de l'utilisateur est dans response.data.name
    // (Adaptation possible en fonction de la réponse réelle de GLPI)

    // Pour cet exemple, on renvoie tout simplement le contenu renvoyé par l'API GLPI
    // en production, il faudra sécuriser et adapter selon vos besoins.
    return res.json({
      message: 'Connexion réussie',
      user: response.data // ou par exemple response.data.name si l'API retourne le nom
    });
  } catch (error) {
    console.error('Erreur de connexion GLPI:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Erreur lors de la connexion à GLPI' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});*/
