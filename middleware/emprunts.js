const express = require('express');
const router = express.Router();
const Emprunt = require('./Data/Emprunt');
const verifyToken = require('./verifyToken');
const jwt = require('jsonwebtoken');
const config = require('../config');
const sendLateEmails = require('./sendLateEmails');

// Emprunter un livre (utilisateur connecté)
router.post('/', verifyToken, (req, res) => {
  // On récupère l'id utilisateur depuis le token
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token manquant' });
  let utilisateur_id;
  try {
    const decoded = jwt.verify(token, config.secret);
    utilisateur_id = decoded.id;
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' });
  }
  const { livre_id } = req.body;
  if (!livre_id) return res.status(400).json({ message: 'ID du livre manquant' });
  Emprunt.create(utilisateur_id, livre_id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', err });
    if (result.error) return res.status(400).json({ message: result.error });
    res.status(201).json({ message: 'Emprunt enregistré', empruntId: result.empruntId });
  });
});

// Voir les emprunts de l'utilisateur connecté
router.get('/mes', verifyToken, (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token manquant' });
  let utilisateur_id;
  try {
    const decoded = jwt.verify(token, config.secret);
    utilisateur_id = decoded.id;
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' });
  }
  Emprunt.getByUser(utilisateur_id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', err });
    // On ajoute le champ date_limite (date_emprunt + 14 jours)
    const empruntsWithLimite = result.map(e => ({
      ...e,
      date_limite: e.date_emprunt ? new Date(new Date(e.date_emprunt).getTime() + 14 * 24 * 60 * 60 * 1000) : null
    }));
    res.json(empruntsWithLimite);
  });
});

// Retourner un livre
router.post('/retour', verifyToken, (req, res) => {
  console.log('[POST] /emprunts/retour - body:', req.body);
  const { emprunt_id } = req.body;
  if (!emprunt_id) return res.status(400).json({ message: 'ID de l\'emprunt manquant' });
  Emprunt.retour(emprunt_id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', err });
    if (result.error) return res.status(400).json({ message: result.error });
    res.json({ message: 'Livre retourné' });
  });
});

// Voir tous les emprunts en retard (admin uniquement)
router.get('/retards', verifyToken, require('./checkRole')('admin'), async (req, res) => {
  try {
    const retards = await require('./Data/Emprunt').prisma.emprunt.findMany({
      where: {
        rendu: false,
        date_retour: null,
        date_emprunt: { lt: new Date() } // À adapter si tu veux une vraie date limite
      },
      include: {
        utilisateur: true,
        livre: true
      }
    });
    res.json(retards);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', err });
  }
});

// Lancer l'envoi des emails de rappel pour les retards (admin uniquement)
router.post('/retards/notifier', verifyToken, require('./checkRole')('admin'), async (req, res) => {
  try {
    const result = await sendLateEmails();
    res.json({ message: result });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'envoi des emails', err });
  }
});

module.exports = router; 