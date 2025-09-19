
    
    
        // app.js
  /*const express = require('express');
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const ticketRoutes = require('./routes/ticketRoutes');
  const authRoutes = require('./routes/authRoutes'); // Ajoutez cette ligne

  const app = express();

  // Middleware
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Routes
  app.use('/api', ticketRoutes);
  app.use('/api', authRoutes); // Ajoutez cette ligne

  // Gestion des erreurs
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
  });

  module.exports = app;*/

    const express = require('express');
    const router = express.Router();
    const ticketCtrl = require('../controllers/ticketController');
    const axios = require('axios');
    
    // Middleware pour vérifier le token de session
    const verifySessionToken = (req, res, next) => {
      const token = req.headers['session-token'];
      if (!token) {
        return res.status(401).json({ error: 'Token de session manquant' });
      }
      next();
    };
    
    router.post('/login', ticketCtrl.login);
    router.post('/tickets', verifySessionToken, ticketCtrl.create);
    // routes/ticketRoute.js
    router.delete('/tickets/:id', verifySessionToken, ticketCtrl.delete);
    //router.get('/tickets', verifySessionToken, ticketCtrl.getAll);
    //router.delete('/tickets/:id', ticketCtrl.delete);
    
    router.put('/tickets/:id', verifySessionToken, ticketCtrl.update);

    router.get('/tickets', verifySessionToken, async (req, res, next) => {
      console.log('Requête GET /tickets reçue');
      console.log('Headers:', req.headers);
      next();
    }, ticketCtrl.getAll);
    
    module.exports = router;



