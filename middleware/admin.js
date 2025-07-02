const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const verifyToken = require('./verifyToken');
const checkRole = require('./checkRole');
const bcrypt = require('bcrypt');

// Lister tous les utilisateurs
router.get('/utilisateurs', verifyToken, checkRole('admin'), async (req, res) => {
  try {
    const users = await prisma.utilisateur.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', err });
  }
});

// Supprimer un utilisateur
router.delete('/utilisateurs/:id', verifyToken, checkRole('admin'), async (req, res) => {
  try {
    await prisma.utilisateur.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', err });
  }
});

// Changer le rôle d'un utilisateur
router.put('/utilisateurs/:id/role', verifyToken, checkRole('admin'), async (req, res) => {
  const { role } = req.body;
  if (!['etudiant', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Rôle invalide' });
  }
  try {
    await prisma.utilisateur.update({
      where: { id: Number(req.params.id) },
      data: { role }
    });
    res.json({ message: 'Rôle mis à jour' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', err });
  }
});

// Récupérer un utilisateur par ID (admin uniquement)
router.get('/utilisateurs/:id', verifyToken, checkRole('admin'), async (req, res) => {
  try {
    const user = await prisma.utilisateur.findUnique({ where: { id: Number(req.params.id) } });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', err });
  }
});

// Récupérer les emprunts d'un utilisateur par ID (admin uniquement)
router.get('/utilisateurs/:id/emprunts', verifyToken, checkRole('admin'), async (req, res) => {
  try {
    const emprunts = await prisma.emprunt.findMany({
      where: { utilisateur_id: Number(req.params.id) },
      include: { livre: true }
    });
    console.log('--- Emprunts récupérés pour l\'admin ---');
    console.log(JSON.stringify(emprunts, null, 2));
    // On ajoute le champ date_limite (date_emprunt + 14 jours)
    const empruntsWithLimite = emprunts.map(e => ({
      ...e,
      date_limite: e.date_emprunt ? new Date(new Date(e.date_emprunt).getTime() + 14 * 24 * 60 * 60 * 1000) : null
    }));
    res.json(empruntsWithLimite);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', err });
  }
});

// Ajouter un utilisateur (admin uniquement)
router.post('/utilisateurs', verifyToken, checkRole('admin'), async (req, res) => {
  const { nom, prenom, email, password, role } = req.body;
  if (!nom || !prenom || !email || !password || !role) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
  }
  if (!['etudiant', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Rôle invalide.' });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: "Format d'email invalide." });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Le mot de passe doit faire au moins 8 caractères.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Vérifier unicité email
    const existing = await prisma.utilisateur.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email déjà utilisé.' });
    }
    await prisma.utilisateur.create({
      data: { nom, prenom, email, mot_de_passe: hashedPassword, role }
    });
    res.status(201).json({ message: 'Utilisateur créé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Modifier les infos d'un utilisateur (admin uniquement)
router.put('/utilisateurs/:id', verifyToken, checkRole('admin'), async (req, res) => {
  const { nom, prenom, email } = req.body;
  if (!nom || !prenom || !email) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: "Format d'email invalide." });
  }
  try {
    const updated = await prisma.utilisateur.update({
      where: { id: Number(req.params.id) },
      data: { nom, prenom, email }
    });
    res.json({ message: 'Utilisateur mis à jour avec succès.' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(500).json({ message: 'Erreur serveur', err });
  }
});

module.exports = router; 