
    /*const express = require("express");
    const cors = require("cors");
    const ticketRoutes = require("./routes/ticketRoutes");

    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use("/api", ticketRoutes);

    app.listen(3000, () =>{
        console.log("Api server runing on http:localhost:3000");
    })*/

        /*const express = require('express');
        const bodyParser = require('body-parser'); // middleware pour analyser les donnees des requetes(Http, formulaire)
        const ticketRoutes = require('./routes/ticketRoutes');  // route pour la creation des tickets

        const app = express();
        app.use(bodyParser.json()); // transforme automatiquement les corps de requete en json

        app.use('/api', ticketRoutes);

        const PORT = 3000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));*/

        /*const express = require('express');
        const bodyParser = require('body-parser');
        const ticketRoutes = require('./routes/ticketRoutes');

        const app = express();

        app.use(bodyParser.json());

        app.use('/api', ticketRoutes);

        const PORT = 3000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));*/



  // app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ticketRoutes = require('./routes/ticketRoutes');
const authRoutes = require('./routes/authRoutes'); // Importez les routes d'authentification

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', ticketRoutes);
app.use('/api', authRoutes); // Ajoutez les routes d'authentification

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

module.exports = app;


  /*
  //original
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Ajout pour gérer CORS
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // pour gerer les donnees json
app.use(bodyParser.urlencoded({ extended: true })); // pour gerer les donnees des formulaires 

// Routes
app.use('/api', ticketRoutes);


// routes.js ou app.js
const router = express.Router();
const authController = require('./controllers/authController');

// Routes d'authentification
router.post('/api/forgot-password', authController.forgotPassword);
router.post('/api/reset-password', authController.resetPassword);


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

module.exports = app;
*/