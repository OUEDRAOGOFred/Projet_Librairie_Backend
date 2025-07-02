const jwt = require('jsonwebtoken');
const config = require('../config');

const verifyToken = (req, res, next) => {
  try {
    // Récupérer le token depuis l'en-tête Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });
    }

    // Vérification du token
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token invalide ou expiré" });
      }

      req.currUser = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la vérification du token", error });
  }
};

module.exports = verifyToken;
