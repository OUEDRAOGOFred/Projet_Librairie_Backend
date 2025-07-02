const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function migrate() {
  try {
    console.log('🔄 Début de la migration de la base de données...');
    
    // Générer le client Prisma
    console.log('📦 Génération du client Prisma...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Pousser le schéma vers la base de données
    console.log('🗄️ Poussage du schéma vers la base de données...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    console.log('✅ Migration terminée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrate(); 