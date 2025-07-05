const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const findAllUsers = async (req, res) => {
  try {
    console.log('findAllUsers - req.currUser:', req.currUser);
    // Vérifier que l'utilisateur est admin
    if (!req.currUser || req.currUser.role !== 'admin') {
      return res.status(403).json({ 
        error: true, 
        message: "Accès refusé. Seuls les administrateurs peuvent voir la liste des utilisateurs." 
      });
    }

    const users = await prisma.utilisateur.findMany({
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        date_inscription: true
      },
      orderBy: {
        date_inscription: 'desc'
      }
    });

    res.json(users);
} catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ 
      error: true, 
      message: "Erreur lors de la récupération des utilisateurs" 
    });
}
};

module.exports = findAllUsers;