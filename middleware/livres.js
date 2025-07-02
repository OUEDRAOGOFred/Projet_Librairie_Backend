const express = require('express');
const router = express.Router();
const Livre = require('./Data/Livre');
const verifyToken = require('./verifyToken');
const checkRole = require('./checkRole');

// Obtenir tous les livres (avec filtres) - authentification optionnelle
router.get('/', (req, res) => {
  const filters = {
    titre: req.query.titre || '',
    auteur: req.query.auteur || '',
    genre: req.query.genre || ''
  };
  
  console.log('🔍 Recherche de livres avec filtres:', filters);
  
  Livre.getAll(filters, (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération des livres:', err);
      return res.status(500).json({ message: 'Erreur serveur', err });
    }
    console.log(`✅ ${result.length} livre(s) trouvé(s)`);
    res.json(result);
  });
});

// Obtenir un livre par ID - authentification optionnelle
router.get('/:id', (req, res) => {
  console.log(`🔍 Recherche du livre ID: ${req.params.id}`);
  
  Livre.getById(req.params.id, (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération du livre:', err);
      return res.status(500).json({ message: 'Erreur serveur', err });
    }
    if (!result) {
      console.log('❌ Livre non trouvé');
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    console.log('✅ Livre trouvé');
    res.json(result);
  });
});

// Ajouter un livre (admin uniquement)
router.post('/', verifyToken, checkRole('admin'), (req, res) => {
  // Validation avancée
  const { titre, auteur, genre, description } = req.body;
  if (!titre || !auteur || !genre || !description) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
  }
  console.log('📚 Ajout d\'un nouveau livre:', req.body);
  
  Livre.create(req.body, (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de l\'ajout du livre:', err);
      return res.status(500).json({ message: 'Erreur serveur', err });
    }
    console.log('✅ Livre ajouté avec succès');
    res.status(201).json({ message: 'Livre ajouté', id: result.insertId });
  });
});

// Modifier un livre (admin uniquement)
router.put('/:id', verifyToken, checkRole('admin'), (req, res) => {
  console.log(`📝 Modification du livre ID: ${req.params.id}`);
  
  Livre.update(req.params.id, req.body, (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de la modification du livre:', err);
      return res.status(500).json({ message: 'Erreur serveur', err });
    }
    console.log('✅ Livre modifié avec succès');
    res.json({ message: 'Livre modifié' });
  });
});

// Supprimer un livre (admin uniquement)
router.delete('/:id', verifyToken, checkRole('admin'), (req, res) => {
  console.log(`🗑️ Suppression du livre ID: ${req.params.id}`);
  
  Livre.delete(req.params.id, (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de la suppression du livre:', err);
      return res.status(500).json({ message: 'Erreur serveur', err });
    }
    console.log('✅ Livre supprimé avec succès');
    res.json({ message: 'Livre supprimé' });
  });
});

module.exports = router; 