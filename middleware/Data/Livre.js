const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const Livre = {
  // Récupérer tous les livres avec filtres optionnels
  getAll: async (filters, callback) => {
    try {
      const where = {};
      if (filters.titre) where.titre = { contains: filters.titre };
      if (filters.auteur) where.auteur = { contains: filters.auteur };
      if (filters.genre) where.genre = { contains: filters.genre };
      const livres = await prisma.livre.findMany({
        where,
        skip: filters.offset ? Number(filters.offset) : undefined,
        take: filters.limit ? Number(filters.limit) : undefined,
      });
      callback(null, livres);
    } catch (err) {
      callback(err);
    }
  },

  // Récupérer un livre par ID
  getById: async (id, callback) => {
    try {
      const livre = await prisma.livre.findUnique({ where: { id: Number(id) } });
      callback(null, livre);
    } catch (err) {
      callback(err);
    }
  },

  // Ajouter un livre
  create: async (livre, callback) => {
    try {
      const newLivre = await prisma.livre.create({
        data: {
          titre: livre.titre,
          auteur: livre.auteur,
          genre: livre.genre,
          description: livre.description,
          disponible: livre.disponible
        }
      });
      callback(null, newLivre);
    } catch (err) {
      callback(err);
    }
  },

  // Modifier un livre
  update: async (id, livre, callback) => {
    try {
      const updatedLivre = await prisma.livre.update({
        where: { id: Number(id) },
        data: {
          titre: livre.titre,
          auteur: livre.auteur,
          genre: livre.genre,
          description: livre.description,
          disponible: livre.disponible
        }
      });
      callback(null, updatedLivre);
    } catch (err) {
      callback(err);
    }
  },

  // Supprimer un livre
  delete: async (id, callback) => {
    try {
      await prisma.livre.delete({ where: { id: Number(id) } });
      callback(null, { success: true });
    } catch (err) {
      callback(err);
    }
  }
};

module.exports = Livre; 