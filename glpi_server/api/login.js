const express = require('express');
const router = express.Router();
const axios = require('axios');

// Ton App-Token GLPI
const APP_TOKEN = "QPkSMqodMxbHni9fMgrnjowVPwEQDe7PeUhTVMtu";

router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ error: "Login et mot de passe requis" });
  }

  try {
    // Appel à GLPI pour initSession avec Basic Auth + App-Token
    const response = await axios.post(
      "http://192.168.1.139/glpi/apirest.php/initSession",
      {}, // aucun corps nécessaire
      {
        headers: {
          "App-Token": APP_TOKEN,
          "Authorization": "Basic " + Buffer.from(`${login}:${password}`).toString("base64"),
        },
      }
    );

    const sessionToken = response.data.session_token;

    if (!sessionToken) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    return res.json({ sessionToken });
  } catch (error) {
    console.error("Erreur API GLPI initSession:", error.response?.data || error.message);
    return res.status(500).json({ error: "Erreur lors de la connexion à GLPI" });
  }
});

module.exports = router;
