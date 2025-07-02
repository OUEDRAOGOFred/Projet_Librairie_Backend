const jwt = require('jsonwebtoken');
const config = require('../config');

function checkRole(role) {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token manquant' });
    try {
      const decoded = jwt.verify(token, config.secret);
      if (decoded.role !== role) {
        return res.status(403).json({ message: 'Accès refusé : rôle insuffisant' });
      }
      req.currUser = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token invalide' });
    }
  };
}

module.exports = checkRole; 