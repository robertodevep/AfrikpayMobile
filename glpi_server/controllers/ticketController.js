

  /// glpi_server/controllers/ticketController.js
  const { initSession, createTicket, getAllTickets, deleteTicket } = require('../services/glpiService');

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

     /* exports.login = async (req, res) => {
        try {
          const { login, password } = req.body;
          
          if (!login || !password) {
            return res.status(400).json({ error: 'Identifiants requis' });
          }
      
          const { sessionToken, userProfile } = await initSession(login, password);
          
          // Solution de repli si l'ID utilisateur n'est pas disponible
          if (!userProfile.id || userProfile.id === 0) {
            const userId = await findUserIdByName(sessionToken, login);
            if (userId) {
              userProfile.id = userId;
            } else {
              console.warn('Utilisateur non trouvé dans GLPI, utilisation du login comme nom');
            }
          }
      
          res.json({ 
            sessionToken,
            user: {
              id: userProfile.id,
              username: login,
              firstname: userProfile.firstname,
              realname: userProfile.realname,
              fullname: userProfile.fullname
            }
          });
          
        } catch (err) {
          console.error('Login error:', {
            message: err.message,
            stack: err.stack,
            response: err.response?.data
          });
          
          const errorMessage = err.response?.data?.message 
            || err.message 
            || 'Échec de l\'authentification';
          
          res.status(401).json({ 
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
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
      
          if (!input.name || !input.content) {
            return res.status(400).json({ error: 'Le sujet et la description sont requis' });
          }
      
          // Récupération du demandeur (soit par ID, soit par nom)
          let requesterData = {};
          if (input.users_id_requester) {
            // Si on a l'ID, on récupère les infos complètes
            const user = await getCurrentUser(sessionToken);
            requesterData = {
              users_id_requester: input.users_id_requester,
              requester_name: user.fullname
            };
          } else if (input.requester_name) {
            // Sinon, on cherche par nom
            const user = await findUserByName(sessionToken, input.requester_name);
            if (user) {
              requesterData = {
                users_id_requester: user.id,
                requester_name: `${user.realname} ${user.firstname}`.trim()
              };
            } else {
              requesterData = {
                requester_name: input.requester_name,
                requester_email: input.requester_email || `${input.requester_name.replace(/\s+/g, '.').toLowerCase()}@no-email.com`
              };
            }
          }
      
          const glpiTicketData = {
            input: {
              name: input.name,
              content: input.content,
              type: input.type || 1,
              urgency: input.urgency || 3,
              impact: input.impact || 2,
              priority: input.priority || 3,
              itilcategories_id: input.itilcategories_id || 1,
              status: 1,
              ...requesterData
            }
          };
      
          const ticket = await createTicket(sessionToken, glpiTicketData);
          res.status(201).json(ticket);
          
        } catch (err) {
          console.error('Create ticket error:', {
            message: err.message,
            stack: err.stack,
            response: err.response?.data
          });
          res.status(500).json({ 
            error: 'Erreur lors de la création du ticket',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
          });
        }
      };*/
      
      // Version améliorée de getRequesterIdByName
      /*async function getRequesterIdByName(sessionToken, username) {
        try {
          const user = await findUserByName(sessionToken, username);
          return user ? user.id : null;
        } catch (error) {
          console.error('Error getting requester ID:', error);
          return null;
        }
      }*/
  



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




  

  