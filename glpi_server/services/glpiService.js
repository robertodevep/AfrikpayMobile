

// services/glpiService.js original
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

/*async function initSession(login, password) {
  try {
    const credentials = base64.encode(`${login}:${password}`);

    const response = await axios.get(`${baseUrl}/initSession`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'App-Token': AppToken
      }
    });

    if (!response.data.session_token) {
      throw new Error('Token de session non reçu');
    }

    // Alternative si getCurrentUser ne fonctionne pas
    const userProfile = {
      id: 0, // À remplacer par l'ID réel si possible
      name: login,
      firstname: '',
      realname: login,
      fullname: login
    };

    return {
      sessionToken: response.data.session_token,
      userProfile
    };
  } catch (error) {
    console.error('GLPI initSession error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    throw new Error(`Échec authentification: ${error.response?.data?.message || error.message}`);
  }
}*/


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

/*async function createTicket(sessionToken, input) {
  try {
    // Formatage des données pour GLPI
    const glpiData = {
      input: {
        name: input.name,
        content: input.content,
        type: input.type || 1,
        urgency: input.urgency || 3,
        impact: input.impact || 2,
        priority: input.priority || 3,
        itilcategories_id: input.itilcategories_id || 1,
        status: 1
      }
    };

    // Ajout de l'information du demandeur
    if (input.users_id_requester) {
      glpiData.input._users_id_requester = input.users_id_requester;
    } else if (input.requester_name) {
      glpiData.input.requester = {
        name: input.requester_name,
        email: input.requester_email || `${input.requester_name.replace(/\s+/g, '.').toLowerCase()}@no-email.com`
      };
    }

    const response = await axios.post(
      `${baseUrl}/Ticket`,
      glpiData,
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
    console.error('GLPI createTicket error:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    throw new Error(`Échec création ticket: ${error.response?.data?.error || error.message}`);
  }
}


async function getCurrentUser(sessionToken) {
  try {
    // Essayez d'abord avec le endpoint standard de GLPI
    const response = await axios.get(`${baseUrl}/getFullSession`, {
      headers: {
        'App-Token': AppToken,
        'Session-Token': sessionToken
      }
    });

    // Vérifiez la structure de réponse et adaptez selon votre GLPI
    const userData = response.data.session?.glpi_currentuser || response.data;
    
    if (!userData || !userData.id) {
      throw new Error('Réponse utilisateur invalide');
    }

    return {
      id: userData.id,
      name: userData.name || userData.login,
      firstname: userData.firstname || '',
      realname: userData.realname || userData.name,
      fullname: `${userData.realname || userData.name} ${userData.firstname || ''}`.trim()
    };
  } catch (error) {
    console.error('GLPI getCurrentUser error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
}*/

/*async function findUserIdByName(sessionToken, username) {
  try {
    const response = await axios.get(`${baseUrl}/User`, {
      headers: {
        'App-Token': AppToken,
        'Session-Token': sessionToken
      },
      params: {
        searchText: username,
        searchCriteria: [{ field: 'name', value: username }],
        forcedisplay: ['id', 'name', 'realname', 'firstname']
      }
    });

    // Adaptez selon la structure de réponse de votre GLPI
    if (response.data && response.data.length > 0) {
      return response.data[0].id;
    }
    return null;
  } catch (error) {
    console.error('GLPI findUserIdByName error:', error);
    return null;
  }
}*/

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


  module.exports = {
    initSession,
    createTicket,
    getAllTickets,
    deleteTicket,
    getCurrentUser,
    
  };

