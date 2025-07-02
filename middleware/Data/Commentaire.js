const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const Commentaire = {
  // Ajouter un commentaire/note
  create: async (utilisateur_id, livre_id, commentaire, note, callback) => {
    try {
      const newComment = await prisma.commentaire.create({
        data: {
          utilisateur_id: Number(utilisateur_id),
          livre_id: Number(livre_id),
          commentaire,
          note: note ? Number(note) : null
        }
      });
      callback(null, newComment);
    } catch (err) {
      callback(err);
    }
  },

  // Récupérer les commentaires d'un livre
  getByLivre: async (livre_id, callback) => {
    try {
      const commentaires = await prisma.commentaire.findMany({
        where: { livre_id: Number(livre_id) },
        include: { utilisateur: { select: { nom: true, prenom: true } } },
        orderBy: { date_commentaire: 'desc' }
      });
      callback(null, commentaires);
    } catch (err) {
      callback(err);
    }
  },

  // Supprimer un commentaire (admin ou auteur)
  delete: async (id, utilisateur_id, isAdmin, callback) => {
    try {
      let where = { id: Number(id) };
      if (!isAdmin) {
        where.utilisateur_id = Number(utilisateur_id);
      }
      await prisma.commentaire.delete({ where });
      callback(null, { success: true });
    } catch (err) {
      callback(err);
    }
  }
};

module.exports = Commentaire; 