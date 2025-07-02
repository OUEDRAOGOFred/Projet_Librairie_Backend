const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const Emprunt = {
  // Créer un nouvel emprunt
  create: async (utilisateur_id, livre_id, callback) => {
    try {
      // Vérifier la disponibilité du livre
      const livre = await prisma.livre.findUnique({ where: { id: Number(livre_id) } });
      if (!livre || !livre.disponible) {
        return callback(null, { error: 'Livre indisponible' });
      }
      // Créer l'emprunt (date_limite = date_emprunt + 14 jours)
      const emprunt = await prisma.emprunt.create({
        data: {
          utilisateur_id: Number(utilisateur_id),
          livre_id: Number(livre_id),
          // Prisma ne gère pas date_limite, donc on ne l'ajoute pas ici
        }
      });
      // Mettre à jour la disponibilité du livre
      await prisma.livre.update({
        where: { id: Number(livre_id) },
        data: { disponible: false }
      });
      callback(null, { success: true, empruntId: emprunt.id });
    } catch (err) {
      callback(err);
    }
  },

  // Lister les emprunts d'un utilisateur
  getByUser: async (utilisateur_id, callback) => {
    try {
      const emprunts = await prisma.emprunt.findMany({
        where: { utilisateur_id: Number(utilisateur_id) },
        include: { livre: true }
      });
      callback(null, emprunts);
    } catch (err) {
      callback(err);
    }
  },

  // Retourner un livre
  retour: async (emprunt_id, callback) => {
    try {
      // Récupérer l'emprunt pour connaître le livre
      const emprunt = await prisma.emprunt.findUnique({ where: { id: Number(emprunt_id) } });
      if (!emprunt) return callback(null, { error: 'Emprunt introuvable' });
      const livre_id = emprunt.livre_id;
      // Marquer l'emprunt comme rendu
      await prisma.emprunt.update({
        where: { id: Number(emprunt_id) },
        data: { rendu: true, date_retour: new Date() }
      });
      // Rendre le livre disponible
      await prisma.livre.update({
        where: { id: livre_id },
        data: { disponible: true }
      });
      callback(null, { success: true });
    } catch (err) {
      callback(err);
    }
  }
};

module.exports = Emprunt; 