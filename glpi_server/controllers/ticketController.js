

  /// glpi_server/controllers/ticketController.js
  const { initSession, createTicket, getAllTickets, deleteTicket, updateTicket} = require('../services/glpiService');
  const glpiService = require('../services/glpiService');

  exports.login = async (req, res) => { 
    try {
      const { login, password } = req.body;
      
      if (!login || !password) {
        return res.status(400).json({ error: 'Identifiants requis' });
      }
  
      const sessionToken = await initSession(login, password);
      res.json({ 
        sessionToken,
        username: login // Ajouté pour cohérence avec le frontend
      });
      
    } catch (err) {
      console.error('Login error:', err);
      res.status(401).json({ 
        error: 'Authentification échouée. Vérifiez vos identifiants.',
        details: err.message 
      });
    }
  }; 
  
 


    exports.create = async (req, res) => {
      try {
        const { input } = req.body;
        const sessionToken = req.headers['session-token'];
        
        if (!sessionToken) {
          return res.status(400).json({ error: 'Token de session requis' });
        }
    
        if (!input.name || !input.content || !input.requester_name) {
          return res.status(400).json({ error: 'Le sujet, la description et le nom du demandeur sont requis' });
        }
    
        const glpiTicketData = {
          input: {
            name: input.name,
            content: input.content,
            _users_id_requester: input.requester_name, // GLPI accepte le nom comme identifiant
            type: input.type || 1,
            urgency: input.urgency || 3,
            impact: input.impact || 2,
            priority: input.priority || 3,
            itilcategories_id: input.itilcategories_id || 1,
            status: 1
          }
        };
    
        const ticket = await createTicket(sessionToken, glpiTicketData);
        res.status(201).json(ticket);
        
      } catch (err) {
        console.error('Create ticket error:', err);
        res.status(500).json({ 
          error: 'Erreur lors de la création du ticket',
          details: err.response?.data || err.message 
        });
      }
    };
    
    // Nouvelle fonction helper pour récupérer l'ID par nom
    async function getRequesterIdByName(sessionToken, username) {
      try {
        const response = await axios.get(`${baseUrl}/User`, {
          headers: {
            'App-Token': AppToken,
            'Session-Token': sessionToken,
          },
          params: {
            searchText: username,
            searchCriteria: [{ field: 'name', value: username }]
          }
        });
        return response.data.data[0]?.id || 0;
      } catch (error) {
        console.error('Error getting requester ID by name:', error);
        return 0;
      }
    }

   


  exports.getAll = async (req, res) => {
    try {
      const sessionToken = req.headers['session-token'];
      
      if (!sessionToken) {
        return res.status(400).json({ error: 'Token de session requis' });
      }
  
      // Ajout de logging pour le débogage
      console.log('Tentative de récupération des tickets...');
      
      const tickets = await getAllTickets(sessionToken);
      
      // Log pour vérifier les données reçues
      console.log('Tickets reçus:', tickets.length);
      
      res.json(tickets);
      
    } catch (err) {
      console.error('Get tickets error:', err);
      
      // Meilleure gestion des erreurs Axios
      const errorDetails = err.response 
        ? {
            status: err.response.status,
            data: err.response.data,
            message: err.message
          }
        : { message: err.message };
      
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des tickets',
        details: errorDetails 
      });
    }
  };

  // gestion de la suppression

    // controllers/ticketController.js
    //const { deleteTicket } = require('../services/glpiService');

    exports.delete = async (req, res) => {
      try {
        const { id } = req.params;
        const sessionToken = req.headers['session-token'];
    
        if (!sessionToken) {
          return res.status(401).json({ 
            success: false,
            error: 'Token de session manquant' 
          });
        }
    
        // Appel direct au service GLPI
        const result = await deleteTicket(sessionToken, id);
        
        return res.status(200).json({
          success: true,
          message: `Ticket ${id} supprimé avec succès`,
          data: result
        });
    
      } catch (error) {
        console.error('Erreur contrôleur:', error);
        
        let statusCode = 500;
        let errorMessage = error.message;
        
        if (error.response) {
          statusCode = error.response.status;
          errorMessage = error.response.data?.error || error.message;
        }
    
        res.status(statusCode).json({
          success: false,
          error: errorMessage,
          details: error.response?.data || null
        });
      }
    };

    //  fonction pour la modification des ticket modification donc le status est new
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { input } = req.body;
    const sessionToken = req.headers['session-token'];

    // Validation des entrées id  tu tickekt et input qui est 
    if (!id || !input) {
      return res.status(400).json({ error: "ID et données de mise à jour requis" });
    }

    if (!sessionToken) {
      return res.status(401).json({ error: "Token de session manquant" });
    }

    // Formatage spécifique pour GLPI
    const updateData = {
      input: {
        name: input.name,
        content: input.content,
        type: input.type || 1,
        urgency: input.urgency || 3,
        impact: input.impact || 2,
        priority: input.priority || 3,
        itilcategories_id: input.itilcategories_id || 1
      }
    };

    // Appel au service
    const result = await updateTicket(sessionToken, id, updateData.input);

    // Réponse standardisée
    res.status(200).json({
      success: true,
      message: `Ticket ${id} mis à jour avec succès`,
      data: result
    });

  } catch (error) {
    console.error('Erreur mise à jour:', {
      message: error.message,
      response: error.response?.data
    });

    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({
      error: error.message,
      details: error.response?.data || null
    });
  }
};

  