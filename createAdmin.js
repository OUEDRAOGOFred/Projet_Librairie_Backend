const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('👤 Création de l\'administrateur...');
    
    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.utilisateur.findUnique({
      where: { email: 'admin@2ie.edu.bf' }
    });

    if (existingAdmin) {
      console.log('⚠️ L\'administrateur existe déjà dans la base de données.');
      console.log('📧 Email: admin@2ie.edu.bf');
      console.log('🔑 Mot de passe: admin123');
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Créer l'administrateur
    const admin = await prisma.utilisateur.create({
      data: {
        nom: 'ADMIN',
        prenom: '2iE',
        email: 'admin@2ie.edu.bf',
        mot_de_passe: hashedPassword,
        role: 'admin'
      }
    });

    console.log('✅ Administrateur créé avec succès !');
    console.log('📧 Email: admin@2ie.edu.bf');
    console.log('🔑 Mot de passe: admin123');
    console.log('👤 Nom complet: ADMIN 2iE');
    console.log('🔐 Rôle: Administrateur');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 