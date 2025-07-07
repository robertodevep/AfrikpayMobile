
    
    
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


    router.get('/tickets', verifySessionToken, async (req, res, next) => {
      console.log('Requête GET /tickets reçue');
      console.log('Headers:', req.headers);
      next();
    }, ticketCtrl.getAll);
    
    module.exports = router;



