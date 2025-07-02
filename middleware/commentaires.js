const express = require('express');
const router = express.Router();
const verifyToken = require('./verifyToken');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Commentaire = require('./Data/Commentaire');

// Ajouter ou mettre à jour un commentaire/note
router.post('/', verifyToken, async (req, res) => {
  const utilisateur_id = req.currUser && req.currUser.id;
  if (!utilisateur_id) return res.status(401).json({ message: 'Utilisateur non authentifié' });
  const { livre_id, commentaire, note } = req.body;
  if (!livre_id || !note) return res.status(400).json({ message: 'Livre et note requis' });
  try {
    // Vérifie si un commentaire existe déjà
    const existing = await prisma.commentaire.findFirst({ where: { utilisateur_id, livre_id } });
    if (existing) {
      // Mise à jour
      await prisma.commentaire.update({
        where: { id: existing.id },
        data: { commentaire, note: Number(note), date_commentaire: new Date() }
      });
      res.json({ message: 'Commentaire mis à jour' });
    } else {
      // Insertion
      await prisma.commentaire.create({
        data: { utilisateur_id, livre_id, commentaire, note: Number(note) }
      });
      res.json({ message: 'Commentaire ajouté' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', err });
  }
});

// Supprimer un commentaire (admin ou auteur)
router.delete('/:id', verifyToken, async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token manquant' });
  let utilisateur_id;
  let role;
  try {
    const decoded = jwt.verify(token, config.secret);
    utilisateur_id = decoded.id;
    role = decoded.role;
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' });
  }
  try {
    const commentaire = await prisma.commentaire.findUnique({ where: { id: Number(req.params.id) } });
    if (!commentaire) return res.status(404).json({ message: 'Commentaire non trouvé' });
    if (role !== 'admin' && commentaire.utilisateur_id !== utilisateur_id) {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    await prisma.commentaire.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Commentaire supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', err });
  }
});

// Récupérer tous les commentaires d'un livre + moyenne
router.get('/:livre_id', async (req, res) => {
  const { livre_id } = req.params;
  try {
    const commentaires = await prisma.commentaire.findMany({
      where: { livre_id: Number(livre_id) },
      include: { utilisateur: { select: { nom: true, prenom: true, role: true } } },
      orderBy: { date_commentaire: 'desc' }
    });
    const moyenne = await prisma.commentaire.aggregate({
      where: { livre_id: Number(livre_id) },
      _avg: { note: true }
    });
    res.json({ commentaires, moyenne: moyenne._avg.note });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', err });
  }
});

module.exports = router; 