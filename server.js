const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const verifyToken = require('./middleware/verifyToken');
const addNewUser = require('./middleware/addNewUser');
const userLoginCheck = require('./middleware/userLoginCheck');
const welcome = require('./middleware/welcome');
const Utilisateur = require('./middleware/Data/Utilisateur');
const UserOne = require("./middleware/UserOne");
const empruntsRoutes = require('./middleware/emprunts');
const commentairesRoutes = require('./middleware/commentaires');
const adminRoutes = require('./middleware/admin');
const livresRoutes = require('./middleware/livres');

const port = process.env.PORT || 4400;

const app = express();

// Middleware for all routes
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Public routes
app.get('/', welcome);
app.post('/signup', addNewUser);
app.post('/userlogin', userLoginCheck);

// Protected routes under /api
const apiRoutes = express.Router();
apiRoutes.use(bodyParser.urlencoded({ extended: true }));
apiRoutes.use(bodyParser.json());
apiRoutes.use(verifyToken);

// Align parameter names and middleware
// apiRoutes.get('/Utilisateur', Utilisateur);
// apiRoutes.put('/Utilisateur/:user_id', Utilisateur);
// apiRoutes.delete('/Utilisateur/:user_id', Utilisateur);
// apiRoutes.get('/Utilisateur/:user_id', Utilisateur); // Replace UserOne with Utilisateur for consistency
apiRoutes.get('/welcome', (req, res) => {
  res.json({ message: "Bienvenue sur l'API sécurisée !" });
});

app.use('/api', apiRoutes);
app.use('/livres', livresRoutes);
app.use('/emprunts', empruntsRoutes);
app.use('/commentaires', commentairesRoutes);
app.use('/admin', adminRoutes);

// Start the server
app.listen(port, () => {
  console.log('✅ Serveur démarré sur le port ' + port);
});