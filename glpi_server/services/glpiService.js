


const axios = require('axios');
const { baseUrl, AppToken } = require('../config/glpiConfig');
const base64 = require('base-64');

async function initSession(login, password) { 
  try {
    const credentials = base64.encode(`${login}:${password}`);

    const response = await axios.get(`${baseUrl}/initSession`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'App-Token': AppToken,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    if (!response.data.session_token) {
      throw new Error('Token de session non reçu');
    }

    return response.data.session_token;
  } catch (error) {
    console.error('GLPI initSession error:', error.response?.data || error.message);
    throw new Error('Échec de l\'authentification auprès de GLPI');
  }
}


async function createTicket(sessionToken, input) { 
  try {
    const response = await axios.post(
      `${baseUrl}/Ticket`,
      input,
      {
        headers: {
          'App-Token': AppToken,
          'Session-Token': sessionToken,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    if (!response.data || !response.data.id) {
      throw new Error('Réponse invalide de GLPI');
    }

    return {
      id: response.data.id,
      message: `Ticket créé avec succès (ID: ${response.data.id})`,
      ...response.data
    };
  } catch (error) {
    console.error('GLPI createTicket error:', error.response?.data || error.message);
    throw new Error(`Échec création ticket: ${error.message}`);
  }
}



async function getCurrentUser(sessionToken) {
  try {
    const response = await axios.get(`${baseUrl}/getCurrentUser`, {
      headers: {
        'App-Token': AppToken,
        'Session-Token': sessionToken,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    if (!response.data || !response.data.id) {
      throw new Error('Réponse utilisateur invalide');
    }

    return response.data;
  } catch (error) {
    console.error('GLPI getCurrentUser error:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });
    throw new Error(`Échec de récupération de l'utilisateur: ${error.message}`);
  }
}


async function getAllTickets(sessionToken) { 
  try {
    console.log('Récupération des tickets...');
    
    const response = await axios.get(`${baseUrl}/Ticket`, {
      headers: {
        'App-Token': AppToken,
        'Session-Token': sessionToken,
        'Content-Type': 'application/json'
      },
      params: {
        "range": "0-100" // Limite le nombre de résultats
      },
      timeout: 10000
    });

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Format de réponse inattendu de GLPI');
    }

    return response.data;
  } catch (error) {
    console.error('GLPI getAllTickets error:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });
    throw new Error(`Échec de la récupération des tickets: ${error.message}`);
  }
}


  // Supprimer un ticket avec suppression définitive (purge)
  async function deleteTicket(sessionToken, ticketId) {
    try {
      // Vérification de l'ID
      const id = parseInt(ticketId);
      if (isNaN(id)) throw new Error('ID de ticket invalide');

      const response = await axios.delete(
        `${baseUrl}/Ticket/${id}`,
        {
          headers: {
            'App-Token': AppToken,
            'Session-Token': sessionToken,
            'Content-Type': 'application/json'
          },
          params: {
            force_purge: true
          },
          timeout: 10000
        }
      );

      return {
        success: true,
        id: id,
        message: `Ticket ${id} supprimé avec succès`,
        status: response.status,
        data: response.data
      };

    } catch (error) {
      console.error('Erreur détaillée:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data
      });

      if (error.response?.status === 404) {
        return {
          success: false,
          error: `Ticket ${ticketId} non trouvé (déjà supprimé?)`,
          code: 404
        };
      }

      throw error; // Propage l'erreur pour une gestion centralisée
    }
  }

  // modification 

  async function updateTicket(sessionToken, ticketId, input) {
    try {
      // Vérification préalable du ticket
      const checkResponse = await axios.get(`${baseUrl}/Ticket/${ticketId}`, {
        headers: {
          'App-Token': AppToken,
          'Session-Token': sessionToken,
          'Content-Type': 'application/json'
        }
      });
  
      if (checkResponse.data.status !== 1) {
        throw new Error("Seuls les tickets avec le statut 'Nouveau' peuvent être modifiés");
      }
  
      // Mise à jour du ticket
      const response = await axios.put(
        `${baseUrl}/Ticket/${ticketId}`,
        { input }, // Notez que l'input est encapsulé dans un objet { input }
        {
          headers: {
            'App-Token': AppToken,
            'Session-Token': sessionToken,
            'Content-Type': 'application/json'
          }
        }
      );
  
      return response.data;
    } catch (error) {
      console.error('Update error:', error.response?.data || error.message);
      throw error;
    }
  }

  module.exports = {
    initSession,
    createTicket,
    getAllTickets,
    deleteTicket,
    getCurrentUser,
    updateTicket
  };

  